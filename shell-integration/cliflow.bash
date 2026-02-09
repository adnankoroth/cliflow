#!/bin/bash
# CLIFlow - IDE-like autocomplete for the terminal
# Full Bash shell integration with real-time completions (like zsh)

# Configuration
CLIFLOW_SOCKET="${HOME}/.cliflow/cliflow.sock"
CLIFLOW_CLIENT="${HOME}/.cliflow/client.mjs"
CLIFLOW_ENABLED=1
CLIFLOW_MIN_CHARS=1
CLIFLOW_LAST_QUERY=""

# Completion state
declare -a CLIFLOW_NAMES=()
declare -a CLIFLOW_INSERT_VALUES=()
declare -a CLIFLOW_ICONS=()
CLIFLOW_SELECTED=0
CLIFLOW_MENU_VISIBLE=0

# Colors
CLIFLOW_RESET=$'\e[0m'
CLIFLOW_DIM=$'\e[2m'
CLIFLOW_BOLD=$'\e[1m'
CLIFLOW_BLUE=$'\e[34m'
CLIFLOW_GREEN=$'\e[32m'
CLIFLOW_YELLOW=$'\e[33m'
CLIFLOW_CYAN=$'\e[36m'
CLIFLOW_REVERSE=$'\e[7m'

# Check if daemon is running
cliflow_is_running() {
  [[ -S "$CLIFLOW_SOCKET" ]]
}

# Get completions from daemon using the Node.js client
cliflow_get_completions() {
  local buffer="$1"
  local cursor="$2"
  local cwd="$PWD"
  
  # Escape backslashes first, then quotes for valid JSON
  local escaped_buffer="${buffer//\\/\\\\}"
  escaped_buffer="${escaped_buffer//\"/\\\"}"
  local escaped_cwd="${cwd//\\/\\\\}"
  escaped_cwd="${escaped_cwd//\"/\\\"}"
  
  local request="{\"type\":\"complete\",\"commandLine\":\"${escaped_buffer}\",\"cursorPosition\":$cursor,\"cwd\":\"${escaped_cwd}\"}"
  
  if [[ -f "$CLIFLOW_CLIENT" ]]; then
    /usr/local/bin/node "$CLIFLOW_CLIENT" "$request" 2>/dev/null
  else
    # Fallback to socat/nc
    if command -v socat &>/dev/null; then
      echo "$request" | socat - UNIX-CONNECT:"$CLIFLOW_SOCKET" 2>/dev/null
    elif command -v nc &>/dev/null; then
      echo "$request" | nc -U "$CLIFLOW_SOCKET" 2>/dev/null
    fi
  fi
}

# Clear the menu display
cliflow_clear_menu() {
  if [[ $CLIFLOW_MENU_VISIBLE -gt 0 ]]; then
    # Move cursor down and clear lines
    for ((i=0; i<CLIFLOW_MENU_VISIBLE; i++)); do
      echo -ne "\n\033[2K"
    done
    # Move cursor back up
    echo -ne "\033[${CLIFLOW_MENU_VISIBLE}A"
    # Clear current line too
    echo -ne "\r\033[2K"
    CLIFLOW_MENU_VISIBLE=0
  fi
}

# Show the completion menu
cliflow_show_menu() {
  local count=${#CLIFLOW_NAMES[@]}
  
  cliflow_clear_menu
  
  [[ $count -eq 0 ]] && return
  
  local max=8
  local selected=$CLIFLOW_SELECTED
  
  # Calculate the window of items to show (scrolling window)
  local start=0
  local end=$((max < count ? max : count))
  
  if [[ $count -gt $max ]]; then
    if [[ $selected -gt $((max - 3)) ]]; then
      start=$((selected - max + 3))
      [[ $start -lt 0 ]] && start=0
      end=$((start + max))
      [[ $end -gt $count ]] && { end=$count; start=$((end - max)); [[ $start -lt 0 ]] && start=0; }
    fi
  fi
  
  # Save cursor position
  echo -ne "\033[s"
  
  local lines_printed=0
  
  # Show scroll indicator if there are items above
  if [[ $start -gt 0 ]]; then
    echo -e "\n  ↑ ($start more above)"
    ((lines_printed++))
  fi
  
  for ((i=start; i<end; i++)); do
    local icon="${CLIFLOW_ICONS[$i]:-•}"
    local name="${CLIFLOW_NAMES[$i]}"
    
    if [[ $i -eq $selected ]]; then
      echo -e "\n${CLIFLOW_REVERSE}▶ ${icon} ${name}${CLIFLOW_RESET}"
    else
      echo -e "\n  ${icon} ${name}"
    fi
    ((lines_printed++))
  done
  
  # Show scroll indicator if there are items below
  if [[ $end -lt $count ]]; then
    echo -e "\n  ↓ ($((count - end)) more below)"
    ((lines_printed++))
  fi
  
  # Move cursor back to original position
  echo -ne "\033[u"
  
  CLIFLOW_MENU_VISIBLE=$lines_printed
}

# Update completions based on current input
cliflow_update() {
  [[ "$CLIFLOW_ENABLED" != "1" ]] && return
  ! cliflow_is_running && return
  
  local buffer="$READLINE_LINE"
  local cursor="$READLINE_POINT"
  
  # Skip if same query
  [[ "$buffer" == "$CLIFLOW_LAST_QUERY" ]] && return
  CLIFLOW_LAST_QUERY="$buffer"
  
  # Only activate CLIFlow after a command is typed (has a space)
  if [[ "$buffer" != *" "* ]]; then
    CLIFLOW_NAMES=()
    CLIFLOW_INSERT_VALUES=()
    CLIFLOW_ICONS=()
    CLIFLOW_SELECTED=0
    cliflow_clear_menu
    return
  fi
  
  # Get completions
  local response
  response=$(cliflow_get_completions "$buffer" "$cursor")
  
  if [[ -z "$response" ]] || [[ "$response" == *'"success":false'* ]]; then
    CLIFLOW_NAMES=()
    CLIFLOW_INSERT_VALUES=()
    CLIFLOW_ICONS=()
    cliflow_clear_menu
    return
  fi
  
  # Parse names, insertValues, and icons
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

# Accept the current selection
cliflow_accept() {
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 ]]; then
    local idx=$CLIFLOW_SELECTED
    local selected="${CLIFLOW_NAMES[$idx]}"
    local insert_raw="${CLIFLOW_INSERT_VALUES[$idx]:-$selected}"
    local buffer="$READLINE_LINE"
    
    # Clear menu first
    cliflow_clear_menu
    
    # Escape spaces in the value for shell (unless it's a flag)
    local escaped_value
    if [[ "$insert_raw" == -* ]]; then
      escaped_value="$insert_raw"
    elif [[ "$insert_raw" == *" "* ]]; then
      escaped_value="${insert_raw// /\\ }"
    else
      escaped_value="$insert_raw"
    fi
    
    # Find where the current argument starts (after the last unescaped space)
    local prefix=""
    local i=$((${#buffer} - 1))
    local found_space=0
    
    while [[ $i -ge 0 ]]; do
      local char="${buffer:$i:1}"
      local prev_char=""
      [[ $i -gt 0 ]] && prev_char="${buffer:$((i-1)):1}"
      
      if [[ "$char" == " " && "$prev_char" != "\\" ]]; then
        prefix="${buffer:0:$((i+1))}"
        found_space=1
        break
      fi
      ((i--))
    done
    
    [[ $found_space -eq 0 ]] && prefix=""
    
    # Build the new buffer
    if [[ "$insert_raw" == */ ]]; then
      READLINE_LINE="${prefix}${escaped_value}"
    else
      READLINE_LINE="${prefix}${escaped_value} "
    fi
    READLINE_POINT=${#READLINE_LINE}
    
    # Reset state
    CLIFLOW_NAMES=()
    CLIFLOW_INSERT_VALUES=()
    CLIFLOW_ICONS=()
    CLIFLOW_SELECTED=0
    CLIFLOW_LAST_QUERY="$READLINE_LINE"
    
    # If directory, immediately fetch new completions
    if [[ "$insert_raw" == */ ]]; then
      CLIFLOW_LAST_QUERY=""
      cliflow_update
    fi
  fi
}

# Navigate up in the menu
cliflow_up() {
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 ]]; then
    local count=${#CLIFLOW_NAMES[@]}
    CLIFLOW_SELECTED=$(( (CLIFLOW_SELECTED - 1 + count) % count ))
    cliflow_show_menu
  fi
}

# Navigate down in the menu
cliflow_down() {
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 ]]; then
    local count=${#CLIFLOW_NAMES[@]}
    CLIFLOW_SELECTED=$(( (CLIFLOW_SELECTED + 1) % count ))
    cliflow_show_menu
  fi
}

# Handle Tab key
cliflow_tab() {
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 ]]; then
    cliflow_accept
  else
    # Trigger completion update
    cliflow_update
  fi
}

# Handle Space key
cliflow_space() {
  if [[ ${#CLIFLOW_NAMES[@]} -gt 0 ]]; then
    cliflow_accept
  else
    # Insert space and update
    READLINE_LINE="${READLINE_LINE:0:$READLINE_POINT} ${READLINE_LINE:$READLINE_POINT}"
    ((READLINE_POINT++))
    cliflow_update
  fi
}

# Handle Enter key
cliflow_enter() {
  cliflow_clear_menu
  CLIFLOW_NAMES=()
  CLIFLOW_INSERT_VALUES=()
  CLIFLOW_ICONS=()
  CLIFLOW_LAST_QUERY=""
}

# Handle Escape key - cancel completion
cliflow_escape() {
  cliflow_clear_menu
  CLIFLOW_NAMES=()
  CLIFLOW_INSERT_VALUES=()
  CLIFLOW_ICONS=()
  CLIFLOW_SELECTED=0
}

# Backspace wrapper
cliflow_backspace() {
  if [[ $READLINE_POINT -gt 0 ]]; then
    READLINE_LINE="${READLINE_LINE:0:$((READLINE_POINT-1))}${READLINE_LINE:$READLINE_POINT}"
    ((READLINE_POINT--))
    cliflow_update
  fi
}

# Generic key handler for updating completions after any key
cliflow_after_key() {
  cliflow_update
}

# Bind keys for real-time completion
cliflow_setup_bindings() {
  # Tab - accept completion or trigger
  bind -x '"\C-i": cliflow_tab'
  
  # Arrow keys
  bind -x '"\e[A": cliflow_up'      # Up arrow
  bind -x '"\e[B": cliflow_down'    # Down arrow
  
  # Space - accept or insert
  bind -x '" ": cliflow_space'
  
  # Backspace
  bind -x '"\C-?": cliflow_backspace'
  bind -x '"\C-h": cliflow_backspace'
  
  # Escape - cancel menu
  bind -x '"\e\e": cliflow_escape'
  
  # Create macro for update after character input
  bind -x '"\C-x\C-u": cliflow_after_key'
  
  # Bind common characters to: insert character, then update
  local chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-._~'
  for ((i=0; i<${#chars}; i++)); do
    local c="${chars:$i:1}"
    bind "\"$c\": \"\C-v$c\C-x\C-u\""
  done
}

# Use PROMPT_COMMAND for cleanup after each command
cliflow_prompt_hook() {
  CLIFLOW_LAST_QUERY=""
  CLIFLOW_NAMES=()
  CLIFLOW_INSERT_VALUES=()
  CLIFLOW_ICONS=()
  CLIFLOW_SELECTED=0
  if [[ $CLIFLOW_MENU_VISIBLE -gt 0 ]]; then
    cliflow_clear_menu
  fi
}

# Traditional completion function (as fallback)
_cliflow_complete_traditional() {
  [[ "$CLIFLOW_ENABLED" != "1" ]] && return
  ! cliflow_is_running && return
  
  local buffer="${COMP_LINE}"
  local cursor="${COMP_POINT}"
  local current="${COMP_WORDS[COMP_CWORD]}"
  
  local response
  response=$(cliflow_get_completions "$buffer" "$cursor")
  
  if [[ -z "$response" ]] || [[ "$response" == *'"success":false'* ]]; then
    return
  fi
  
  # Parse all names for COMPREPLY
  local names=()
  while IFS= read -r name; do
    [[ -n "$name" ]] && names+=("$name")
  done < <(echo "$response" | grep -oE '"name":"[^"]*"' | sed 's/"name":"//g;s/"//g')
  
  COMPREPLY=()
  for name in "${names[@]}"; do
    if [[ "$name" == "$current"* ]] || [[ -z "$current" ]]; then
      COMPREPLY+=("$name")
    fi
  done
}

# Register traditional completions for commands (fallback when bind -x doesn't work)
_cliflow_register_commands() {
  local commands=(
    git docker kubectl aws terraform helm npm yarn pip cargo go make
    curl ssh rsync grep find cat tail head ps kill chmod chown tar wget scp
    docker-compose kubectx kubens psql mysql redis-cli mongosh
    az gcloud gh ansible ansible-playbook pulumi serverless
    cd ls mv cp rm mkdir rmdir touch ln df du
    python python3 node ruby java javac gcc g++ clang rustc
    vim nvim nano emacs code subl
  )
  
  for cmd in "${commands[@]}"; do
    complete -F _cliflow_complete_traditional "$cmd" 2>/dev/null
  done
  
  # Default completion for unknown commands
  complete -D -F _cliflow_complete_traditional 2>/dev/null
}

# Status function
cliflow_status() {
  echo -e "${CLIFLOW_CYAN}${CLIFLOW_BOLD}CLIFlow Status${CLIFLOW_RESET}"
  echo "─────────────────────────────"
  echo "  Enabled: $CLIFLOW_ENABLED"
  echo -n "  Daemon:  "
  if cliflow_is_running; then
    echo -e "${CLIFLOW_GREEN}● Running${CLIFLOW_RESET}"
  else
    echo -e "${CLIFLOW_YELLOW}○ Not running${CLIFLOW_RESET}"
  fi
  echo "  Socket:  $CLIFLOW_SOCKET"
  echo "  Shell:   bash ${BASH_VERSION}"
}

cliflow_enable() {
  CLIFLOW_ENABLED=1
  echo "CLIFlow enabled"
}

cliflow_disable() {
  CLIFLOW_ENABLED=0
  cliflow_clear_menu
  echo "CLIFlow disabled"
}

# Initialize
_cliflow_init() {
  # Check bash version (need 4.0+ for bind -x with READLINE_LINE)
  if [[ "${BASH_VERSINFO[0]}" -lt 4 ]]; then
    echo -e "${CLIFLOW_YELLOW}Warning: CLIFlow requires bash 4.0+ for full features${CLIFLOW_RESET}"
    echo "  Current version: ${BASH_VERSION}"
    echo "  Falling back to traditional completion mode"
    _cliflow_register_commands
    return
  fi
  
  if [[ "$CLIFLOW_ENABLED" == "1" ]]; then
    # Set up key bindings for real-time completion
    cliflow_setup_bindings
    
    # Register traditional completions as fallback
    _cliflow_register_commands
    
    # Add to PROMPT_COMMAND for cleanup
    if [[ "$PROMPT_COMMAND" != *"cliflow_prompt_hook"* ]]; then
      PROMPT_COMMAND="cliflow_prompt_hook${PROMPT_COMMAND:+;$PROMPT_COMMAND}"
    fi
    
    # Startup message
    if cliflow_is_running; then
      echo -e "${CLIFLOW_GREEN}✓${CLIFLOW_RESET} CLIFlow loaded (bash ${BASH_VERSION})"
    else
      echo -e "${CLIFLOW_YELLOW}⚠${CLIFLOW_RESET} CLIFlow loaded but daemon not running"
      echo "  Start with: cd ~/go/cliflow && node build/daemon/server.js start &"
    fi
  fi
}

# Run initialization
_cliflow_init
