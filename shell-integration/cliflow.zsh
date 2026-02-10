#!/bin/zsh
# CLIFlow - IDE-like autocomplete for the terminal
# Live completions using zsh's built-in message display

CLIFLOW_SOCKET="${HOME}/.cliflow/cliflow.sock"
# Find client.mjs relative to this script (works for Homebrew and local installs)
CLIFLOW_SCRIPT_DIR="${${(%):-%x}:A:h}"
CLIFLOW_CLIENT="${CLIFLOW_CLIENT:-${CLIFLOW_SCRIPT_DIR}/client.mjs}"
CLIFLOW_ENABLED=1
CLIFLOW_MIN_CHARS=1
CLIFLOW_ACCEPT_SPACE=${CLIFLOW_ACCEPT_SPACE:-1}
CLIFLOW_DEBOUNCE_MS=${CLIFLOW_DEBOUNCE_MS:-40}
CLIFLOW_LAST_QUERY=""
CLIFLOW_LAST_UPDATE=0
CLIFLOW_NAMES=()
CLIFLOW_INSERT_VALUES=()
CLIFLOW_ICONS=()
CLIFLOW_SELECTED=0

cliflow_ignored_keymap() {
  [[ "$ZLE_STATE" == *"isearch"* || "$KEYMAP" == "isearch" || "$KEYMAP" == "vicmd" || "$KEYMAP" == "menuselect" ]]
}

cliflow_is_running() {
  [[ -S "$CLIFLOW_SOCKET" ]]
}

cliflow_get_completions() {
  local buffer="$1" cursor="$2"
  local cwd="$PWD"
  # Escape backslashes first, then quotes for valid JSON
  local escaped_buffer="${buffer//\\/\\\\}"
  escaped_buffer="${escaped_buffer//\"/\\\"}"
  local escaped_cwd="${cwd//\\/\\\\}"
  escaped_cwd="${escaped_cwd//\"/\\\"}"
  local request="{\"type\":\"complete\",\"commandLine\":\"${escaped_buffer}\",\"cursorPosition\":$cursor,\"cwd\":\"${escaped_cwd}\"}"
  node "$CLIFLOW_CLIENT" "$request" 2>/dev/null
}

cliflow_show_menu() {
  local -a names=("${CLIFLOW_NAMES[@]}")
  local -a icons=("${CLIFLOW_ICONS[@]}")
  local count=${#names[@]}
  [[ $count -eq 0 ]] && { zle -M ""; return; }
  
  local max=8 display=""
  local selected=$((CLIFLOW_SELECTED + 1))  # Convert to 1-indexed
  
  # Calculate the window of items to show (scrolling window)
  local start=1 end=$max
  if [[ $count -le $max ]]; then
    # All items fit, show all
    end=$count
  elif [[ $selected -gt $((max - 2)) ]]; then
    # Selection is near bottom, scroll window down
    start=$((selected - max + 3))
    [[ $start -lt 1 ]] && start=1
    end=$((start + max - 1))
    [[ $end -gt $count ]] && { end=$count; start=$((end - max + 1)); [[ $start -lt 1 ]] && start=1; }
  fi
  
  # Show scroll indicator if there are items above
  [[ $start -gt 1 ]] && display+="  ↑ ($((start - 1)) more above)"$'\n'
  
  for ((i=start; i<=end; i++)); do
    local icon="${icons[$i]:-•}"
    if [[ $i -eq $selected ]]; then
      display+="▶ ${icon} ${names[$i]}"
    else
      display+="  ${icon} ${names[$i]}"
    fi
    [[ $i -lt $end ]] && display+=$'\n'
  done
  
  # Show scroll indicator if there are items below
  [[ $end -lt $count ]] && display+=$'\n'"  ↓ ($((count - end)) more below)"
  
  zle -M "$display"
}

cliflow_update() {
  [[ "$CLIFLOW_ENABLED" != "1" ]] && return
  ! cliflow_is_running && return
  cliflow_ignored_keymap && { CLIFLOW_NAMES=(); CLIFLOW_INSERT_VALUES=(); CLIFLOW_ICONS=(); CLIFLOW_SELECTED=0; zle -M ""; return; }

  local now_ms=$(( EPOCHREALTIME * 1000 ))
  if (( now_ms - CLIFLOW_LAST_UPDATE < CLIFLOW_DEBOUNCE_MS )); then
    return
  fi
  CLIFLOW_LAST_UPDATE=$now_ms
  
  local buffer="$BUFFER" cursor="$CURSOR"
  
  # Skip if same query
  [[ "$buffer" == "$CLIFLOW_LAST_QUERY" ]] && return
  CLIFLOW_LAST_QUERY="$buffer"
  
  # Only activate CLIFlow after a command is typed (has a space)
  # This allows native completion for command names like ssh-agent
  if [[ "$buffer" != *" "* ]]; then
    CLIFLOW_NAMES=()
    CLIFLOW_INSERT_VALUES=()
    CLIFLOW_ICONS=()
    CLIFLOW_SELECTED=0
    zle -M ""
    return
  fi
  
  # Get completions
  local response=$(cliflow_get_completions "$buffer" "$cursor")
  
  if [[ -z "$response" ]] || [[ "$response" == *'"success":false'* ]]; then
    CLIFLOW_NAMES=()
    CLIFLOW_INSERT_VALUES=()
    CLIFLOW_ICONS=()
    zle -M ""
    return
  fi
  
  # Parse names, insertValues, and icons preserving spaces
  CLIFLOW_NAMES=()
  CLIFLOW_INSERT_VALUES=()
  CLIFLOW_ICONS=()
  local name insertValue icon
  while IFS= read -r name; do
    [[ -n "$name" ]] && CLIFLOW_NAMES+=("$name")
  done < <(echo "$response" | grep -oE '"name":"[^"]*"' | sed 's/"name":"//g;s/"//g')
  while IFS= read -r insertValue; do
    [[ -n "$insertValue" ]] && CLIFLOW_INSERT_VALUES+=("$insertValue")
  done < <(echo "$response" | grep -oE '"insertValue":"[^"]*"' | sed 's/"insertValue":"//g;s/"//g')
  while IFS= read -r icon; do
    [[ -n "$icon" ]] && CLIFLOW_ICONS+=("$icon")
  done < <(echo "$response" | grep -oE '"icon":"[^"]*"' | sed 's/"icon":"//g;s/"//g')
  CLIFLOW_SELECTED=0
  cliflow_show_menu
}

# Wrapper for self-insert that updates completions
cliflow_self_insert() {
  zle .self-insert
  cliflow_update
}

# Wrapper for backward-delete-char
cliflow_backward_delete() {
  zle .backward-delete-char
  cliflow_update
}

# Accept selection with Tab or Space
cliflow_accept() {
  cliflow_ignored_keymap && { zle -M ""; zle "${CLIFLOW_ORIG_TAB:-expand-or-complete}"; return; }
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 ]]; then
    local idx=$((CLIFLOW_SELECTED + 1))
    local selected="${CLIFLOW_NAMES[$idx]}"
    # Use insertValue if available, otherwise fall back to name
    local insert_raw="${CLIFLOW_INSERT_VALUES[$idx]:-$selected}"
    local buffer="$BUFFER"
    
    # Clear menu FIRST before any buffer changes
    zle -M ""
    
    # Escape spaces in the value for shell (unless it's a flag)
    local escaped_value
    if [[ "$insert_raw" == -* ]]; then
      escaped_value="$insert_raw"
    elif [[ "$insert_raw" == *" "* ]]; then
      # Escape spaces with backslash
      escaped_value="${insert_raw// /\\ }"
    else
      escaped_value="$insert_raw"
    fi
    
    # Find where the current argument starts (after the last unescaped space)
    # We need to replace only the current partial argument, not the whole line
    local prefix=""
    local i=$((${#buffer} - 1))
    local found_space=0
    
    # Walk backwards to find the start of the current argument
    while [[ $i -ge 0 ]]; do
      local char="${buffer:$i:1}"
      local prev_char="${buffer:$((i-1)):1}"
      
      if [[ "$char" == " " && "$prev_char" != "\\" ]]; then
        # Found unescaped space - this is where current arg starts
        prefix="${buffer:0:$((i+1))}"
        found_space=1
        break
      fi
      ((i--))
    done
    
    # If no space found, prefix is empty (we're completing the command itself)
    [[ $found_space -eq 0 ]] && prefix=""
    
    # Build the new buffer: prefix + escaped value
    # Don't add trailing space if it's a directory path (ends with /)
    if [[ "$insert_raw" == */ ]]; then
      BUFFER="${prefix}${escaped_value}"
    else
      BUFFER="${prefix}${escaped_value} "
    fi
    CURSOR=${#BUFFER}
    
    # Reset state
    CLIFLOW_NAMES=()
    CLIFLOW_INSERT_VALUES=()
    CLIFLOW_ICONS=()
    CLIFLOW_SELECTED=0
    
    # Redraw the line
    zle -R
    
    # If we just selected a directory, immediately fetch completions for its contents
    if [[ "$insert_raw" == */ ]]; then
      CLIFLOW_LAST_QUERY=""
      cliflow_update
    else
      CLIFLOW_LAST_QUERY="$BUFFER"
    fi
  else
    # No CLIFlow menu - fall back to native zsh completion
    zle -M ""
    zle "${CLIFLOW_ORIG_TAB:-expand-or-complete}"
  fi
}

# Space key - accept if menu showing, otherwise insert space and update
cliflow_space() {
  if cliflow_ignored_keymap; then
    zle .self-insert
    return
  fi
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 ]]; then
    # Menu showing - accept selection
    cliflow_accept
  else
    # No menu - insert space and check for completions
    zle .self-insert
    cliflow_update
  fi
}

# Navigate up
cliflow_up() {
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 ]]; then
    CLIFLOW_SELECTED=$(( (CLIFLOW_SELECTED - 1 + ${#CLIFLOW_NAMES[@]}) % ${#CLIFLOW_NAMES[@]} ))
    cliflow_show_menu
  else
    zle .up-line-or-history
  fi
}

# Navigate down
cliflow_down() {
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 ]]; then
    CLIFLOW_SELECTED=$(( (CLIFLOW_SELECTED + 1) % ${#CLIFLOW_NAMES[@]} ))
    cliflow_show_menu
  else
    zle .down-line-or-history
  fi
}

# Clear on enter
cliflow_accept_line() {
  CLIFLOW_NAMES=()
  CLIFLOW_INSERT_VALUES=()
  CLIFLOW_LAST_QUERY=""
  zle -M ""
  zle .accept-line
}

# Clear on ctrl-c
cliflow_cancel() {
  CLIFLOW_NAMES=()
  CLIFLOW_INSERT_VALUES=()
  CLIFLOW_LAST_QUERY=""
  zle -M ""
  zle .send-break
}

# Register widgets
zle -N self-insert cliflow_self_insert
zle -N cliflow_backward_delete
zle -N cliflow_accept
zle -N cliflow_space
zle -N cliflow_up
zle -N cliflow_down
zle -N cliflow_accept_line
zle -N cliflow_cancel

# Save what Tab was bound to before we override it
CLIFLOW_ORIG_TAB=$(bindkey '^I' | awk '{print $2}')
[[ -z "$CLIFLOW_ORIG_TAB" ]] && CLIFLOW_ORIG_TAB="expand-or-complete"

# Bind keys
bindkey '^I' cliflow_accept       # Tab accepts
if [[ "$CLIFLOW_ACCEPT_SPACE" == "1" ]]; then
  bindkey ' ' cliflow_space         # Space accepts or inserts
fi
bindkey '^[[A' cliflow_up         # Up arrow
bindkey '^[[B' cliflow_down       # Down arrow
bindkey '^M' cliflow_accept_line  # Enter
bindkey '^C' cliflow_cancel       # Ctrl-C
bindkey '^?' cliflow_backward_delete  # Backspace
bindkey '^H' cliflow_backward_delete  # Backspace (alternate)

cliflow_enable() { CLIFLOW_ENABLED=1; echo "CLIFlow enabled"; }
cliflow_disable() { CLIFLOW_ENABLED=0; zle -M ""; echo "CLIFlow disabled"; }

# Auto-start daemon if not running (runs in background, silent)
if ! cliflow_is_running; then
  # Ensure ~/.cliflow directory exists
  [[ ! -d "${HOME}/.cliflow" ]] && mkdir -p "${HOME}/.cliflow"
  # Start daemon in background if cliflow command exists
  if command -v cliflow &>/dev/null; then
    (cliflow daemon start &>/dev/null &)
  fi
fi
