#!/bin/zsh
# CLIFlow - IDE-like autocomplete for the terminal
# Live completions using zsh's built-in message display

# Load required modules
zmodload zsh/datetime 2>/dev/null
zmodload zsh/parameter 2>/dev/null

CLIFLOW_SOCKET="${HOME}/.cliflow/cliflow.sock"
# Find cliflow-client binary relative to this script (works for Homebrew and local installs)
CLIFLOW_SCRIPT_DIR="${${(%):-%x}:A:h}"
# Force local binary if it exists, otherwise use default
if [[ -f "${CLIFLOW_SCRIPT_DIR}/../bin/cliflow-client" ]]; then
  CLIFLOW_CLIENT="${CLIFLOW_SCRIPT_DIR}/../bin/cliflow-client"
else
  CLIFLOW_CLIENT="${CLIFLOW_CLIENT:-${CLIFLOW_SCRIPT_DIR}/../bin/cliflow-client}"
fi
CLIFLOW_ENABLED=1
CLIFLOW_MIN_CHARS=1
CLIFLOW_ACCEPT_SPACE=${CLIFLOW_ACCEPT_SPACE:-1}
CLIFLOW_DEBOUNCE_MS=${CLIFLOW_DEBOUNCE_MS:-40}
CLIFLOW_LAST_QUERY=""
CLIFLOW_LAST_UPDATE=0
echo "CLIFlow Sourced"

CLIFLOW_NAMES=()
CLIFLOW_INSERT_VALUES=()
CLIFLOW_ICONS=()
CLIFLOW_DESCS=()
CLIFLOW_SELECTED=0

# Debug logging
cliflow_log() {
  echo "[$(date +%T)] $*" >> /tmp/cliflow-debug.log
}
cliflow_log "CLIFlow client path: $CLIFLOW_CLIENT"

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
  local request="{\"type\":\"complete\",\"commandLine\":\"${escaped_buffer}\",\"cursorPosition\":$cursor,\"cwd\":\"${escaped_cwd}\",\"format\":\"tsv\"}"
  
  cliflow_log "Request: $request"
  local output=""
  if [[ -x "$CLIFLOW_CLIENT" ]]; then
    output=$("$CLIFLOW_CLIENT" "$request" 2>/dev/null)
  elif [[ "$CLIFLOW_CLIENT" == *.mjs ]] && command -v node &>/dev/null; then
    output=$(node "$CLIFLOW_CLIENT" "$request" 2>/dev/null)
  elif command -v socat &>/dev/null; then
    output=$(echo "$request" | socat -t2 - UNIX-CONNECT:"$CLIFLOW_SOCKET" 2>/dev/null)
  elif command -v nc &>/dev/null; then
    output=$(echo "$request" | nc -U "$CLIFLOW_SOCKET" 2>/dev/null)
  else
    cliflow_log "Error: No suitable client found for $CLIFLOW_CLIENT"
  fi
  cliflow_log "Response raw: ${output:0:100}..."
  echo "$output"
}

cliflow_show_menu() {
  local -a names=("${CLIFLOW_NAMES[@]}")
  local -a icons=("${CLIFLOW_ICONS[@]}")
  local -a descs=("${CLIFLOW_DESCS[@]}")
  local count=${#names[@]}
  [[ $count -eq 0 ]] && { zle -M ""; return; }
  
  local max=8 display=""
  local selected=$((CLIFLOW_SELECTED + 1))  # Convert to 1-indexed
  
  # Get terminal width for description truncation
  local term_width=${COLUMNS:-80}
  local desc_max=$((term_width - 30))  # Leave room for icon + name + padding
  [[ $desc_max -lt 10 ]] && desc_max=10
  
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
    local name="${names[$i]}"
    local desc="${descs[$i]}"
    
    # Truncate description to fit terminal width
    if [[ -n "$desc" && ${#desc} -gt $desc_max ]]; then
      desc="${desc:0:$((desc_max - 1))}…"
    fi
    
    # Format: "▶ ⚡ name     description" with padded name
    local name_padded="${(r:20:)name}"  # Right-pad name to 20 chars
    if [[ $i -eq $selected ]]; then
      if [[ -n "$desc" ]]; then
        display+="▶ ${icon} ${name_padded} ${desc}"
      else
        display+="▶ ${icon} ${name}"
      fi
    else
      if [[ -n "$desc" ]]; then
        display+="  ${icon} ${name_padded} ${desc}"
      else
        display+="  ${icon} ${name}"
      fi
    fi
    [[ $i -lt $end ]] && display+=$'\n'
  done
  
  # Show scroll indicator if there are items below
  [[ $end -lt $count ]] && display+=$'\n'"  ↓ ($((count - end)) more below)"
  
  zle -M "$display"
}

cliflow_update() {
  cliflow_log "cliflow_update called. Enabled: $CLIFLOW_ENABLED"
  [[ "$CLIFLOW_ENABLED" != "1" ]] && return
  if ! cliflow_is_running; then
    cliflow_log "Daemon not running (socket check failed)"
    return
  fi
  if cliflow_ignored_keymap; then
    cliflow_log "Ignored keymap: $KEYMAP / $ZLE_STATE"
    CLIFLOW_NAMES=(); CLIFLOW_INSERT_VALUES=(); CLIFLOW_ICONS=(); CLIFLOW_SELECTED=0; zle -M ""; return
  fi

  local now_ms=$(( ${EPOCHREALTIME:-0} * 1000 ))
  # Fallback if EPOCHREALTIME is somehow still 0 (e.g. integer math issue)
  if [[ $now_ms -eq 0 ]]; then
    now_ms=$(( $(date +%s) * 1000 ))
  fi

  if (( CLIFLOW_LAST_UPDATE > 0 && now_ms - CLIFLOW_LAST_UPDATE < CLIFLOW_DEBOUNCE_MS )); then
    cliflow_log "Debounced: ${now_ms} vs ${CLIFLOW_LAST_UPDATE}"
    return
  fi
  CLIFLOW_LAST_UPDATE=$now_ms
  
  local buffer="$BUFFER" cursor="$CURSOR"
  
  # Skip if same query
  if [[ "$buffer" == "$CLIFLOW_LAST_QUERY" ]]; then
    cliflow_log "Skipping: same query '$buffer'"
    return
  fi
  CLIFLOW_LAST_QUERY="$buffer"
  
  cliflow_log "Fetching completions for '$buffer'"
  # Get completions (TSV format)
  local response="$(cliflow_get_completions "$buffer" "$cursor")"
  
  if [[ -z "$response" ]]; then
    CLIFLOW_NAMES=()
    CLIFLOW_INSERT_VALUES=()
    CLIFLOW_ICONS=()
    CLIFLOW_DESCS=()
    zle -M ""
    return
  fi
  
  # Parse TSV response: first line is "OK\tcount" or "ERR\tmessage"
  CLIFLOW_NAMES=()
  CLIFLOW_INSERT_VALUES=()
  CLIFLOW_ICONS=()
  CLIFLOW_DESCS=()
  local first_line=1
  while IFS=$'\t' read -r f1 f2 f3 f4; do
    if [[ $first_line -eq 1 ]]; then
      first_line=0
      # Check header: OK or ERR
      if [[ "$f1" != "OK" ]]; then
        zle -M ""
        return
      fi
      continue
    fi
    # f1=name, f2=insertValue, f3=icon, f4=description
    [[ -n "$f1" ]] || continue
    CLIFLOW_NAMES+=("$f1")
    CLIFLOW_INSERT_VALUES+=("$f2")
    CLIFLOW_ICONS+=("$f3")
    CLIFLOW_DESCS+=("$f4")
  done <<< "$response"
  CLIFLOW_SELECTED=0
  cliflow_show_menu
}

# Wrapper for self-insert that updates completions
# Wrapper for self-insert that updates completions
cliflow_self_insert() {
  cliflow_log "cliflow_self_insert called"
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
    
    # Always clear last query so the next update isn't skipped
    CLIFLOW_LAST_QUERY=""
    # If we just selected a directory, immediately fetch completions for its contents
    if [[ "$insert_raw" == */ ]]; then
      cliflow_update
    fi
  else
    # No CLIFlow menu - fall back to native zsh completion
    zle -M ""
    zle "${CLIFLOW_ORIG_TAB:-expand-or-complete}"
  fi
}

# Space key - accept if user has intentionally navigated menu, otherwise insert space
cliflow_space() {
  if cliflow_ignored_keymap; then
    zle .self-insert
    return
  fi
  # Only accept if user has explicitly navigated the menu (moved off index 0)
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 && $CLIFLOW_SELECTED -gt 0 ]]; then
    cliflow_accept
  else
    # No menu, or menu shown but user hasn't navigated - insert space and update
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
# Save what Tab was bound to before we override it
# Avoid capturing our own binding if sourced multiple times
local current_binding=$(bindkey '^I' | awk '{print $2}')
if [[ "$current_binding" != "cliflow_accept" ]]; then
  CLIFLOW_ORIG_TAB="$current_binding"
fi
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

echo "Current Tab binding: $(bindkey '^I')"
echo "Current Space binding: $(bindkey ' ')"
echo "CLIFLOW_ENABLED=$CLIFLOW_ENABLED"

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
