#!/bin/zsh
# CLIFlow - IDE-like autocomplete for the terminal
# Zsh shell integration with Ink UI support

# Configuration
CLIFLOW_SOCKET="${HOME}/.cliflow/cliflow.sock"
CLIFLOW_ENABLED=1
CLIFLOW_DEBUG=0
CLIFLOW_UI_MODE="ink"  # "ink" for fancy UI, "fzf" fallback, "basic" for simple

# Find CLIFlow installation
if [[ -z "$CLIFLOW_ROOT" ]]; then
  # Try to find relative to this script
  local script_path="${(%):-%x}"
  if [[ -f "$script_path" ]]; then
    CLIFLOW_ROOT="$(dirname $(dirname $(realpath $script_path)))"
  else
    CLIFLOW_ROOT="${HOME}/.cliflow"
  fi
fi
CLIFLOW_UI="${CLIFLOW_ROOT}/build/ui/terminal/App.js"

# Colors for the inline preview (fallback when UI not available)
typeset -A CLIFLOW_COLORS
CLIFLOW_COLORS=(
  reset    $'\e[0m'
  dim      $'\e[2m'
  bold     $'\e[1m'
  blue     $'\e[34m'
  green    $'\e[32m'
  yellow   $'\e[33m'
  cyan     $'\e[36m'
)

# Check if daemon is running
cliflow_is_running() {
  [[ -S "$CLIFLOW_SOCKET" ]] && return 0
  return 1
}

# Send request to daemon and get response
cliflow_request() {
  local request="$1"
  local response
  
  if ! cliflow_is_running; then
    return 1
  fi
  
  # Use socat or nc to communicate with Unix socket
  # Need to keep connection open briefly to receive response
  if command -v socat &>/dev/null; then
    response=$({ echo "$request"; sleep 0.1; } | socat -t 1 - UNIX-CONNECT:"$CLIFLOW_SOCKET" 2>/dev/null)
  elif command -v nc &>/dev/null; then
    response=$({ echo "$request"; sleep 0.1; } | nc -U "$CLIFLOW_SOCKET" 2>/dev/null)
  else
    return 1
  fi
  
  echo "$response"
}

# Get completions from daemon
cliflow_get_completions() {
  local buffer="$1"
  local cursor="$2"
  local cwd="$PWD"
  
  # Escape special characters for JSON
  local escaped_buffer="${buffer//\\/\\\\}"  # Escape backslashes first
  escaped_buffer="${escaped_buffer//\"/\\\"}"  # Escape quotes
  local escaped_cwd="${cwd//\\/\\\\}"
  escaped_cwd="${escaped_cwd//\"/\\\"}"
  
  local request="{\"type\":\"complete\",\"commandLine\":\"${escaped_buffer}\",\"cursorPosition\":${cursor},\"cwd\":\"${escaped_cwd}\",\"shell\":\"zsh\"}"
  
  cliflow_request "$request"
}

# FZF-based completion (fallback UI)
cliflow_fzf_complete() {
  local buffer="$1"
  local cursor="$2"
  
  local response=$(cliflow_get_completions "$buffer" "$cursor")
  
  if [[ -z "$response" ]] || [[ "$response" == *'"success":false'* ]]; then
    return 1
  fi
  
  # Extract names, descriptions, and icons
  local names=($(echo "$response" | grep -oE '"name":"[^"]*"' | sed 's/"name":"//g;s/"//g'))
  local descs=($(echo "$response" | grep -oE '"description":"[^"]*"' | sed 's/"description":"//g;s/"//g'))
  local icons=($(echo "$response" | grep -oE '"icon":"[^"]*"' | sed 's/"icon":"//g;s/"//g'))
  
  if [[ ${#names[@]} -eq 0 ]]; then
    return 1
  fi
  
  # Build display list for fzf
  local -a items
  for i in {1..${#names[@]}}; do
    local icon="${icons[$i]:-•}"
    local name="${names[$i]}"
    local desc="${descs[$i]:-}"
    items+=("${icon} ${name}|${desc}")
  done
  
  # Run fzf
  local selected=$(printf '%s\n' "${items[@]}" | \
    fzf --height=15 \
        --reverse \
        --no-sort \
        --ansi \
        --delimiter='|' \
        --with-nth=1 \
        --preview='echo {2}' \
        --preview-window=down:1:wrap \
        --bind='tab:accept,enter:accept' \
        --prompt="❯ " \
        --pointer="▶" \
        --header="CLIFlow" \
        --color='fg:#f8f8f2,hl:#bd93f9,fg+:#f8f8f2,bg+:#44475a,hl+:#bd93f9,prompt:#50fa7b,pointer:#ff79c6')
  
  if [[ -n "$selected" ]]; then
    # Extract name (remove icon prefix and description)
    local name="${selected#* }"  # Remove icon
    name="${name%%|*}"           # Remove description
    echo "$name"
    return 0
  fi
  
  return 1
}

# Parse JSON response (basic parsing without jq dependency)
cliflow_parse_suggestions() {
  local json="$1"
  local suggestions=()
  
  # Extract suggestions array using pattern matching
  # Format: {"name":"value","description":"desc","icon":"icon","type":"type"}
  local pattern='"name":"([^"]*)"[^}]*"description":"([^"]*)"[^}]*"icon":"([^"]*)"'
  
  while [[ "$json" =~ $pattern ]]; do
    local name="${match[1]}"
    local desc="${match[2]}"
    local icon="${match[3]}"
    suggestions+=("${icon} ${name}|${desc}")
    json="${json#*\}}"
  done
  
  printf '%s\n' "${suggestions[@]}"
}

# Main completion widget
cliflow_complete_widget() {
  local buffer="$BUFFER"
  local cursor="$CURSOR"
  local selected=""
  
  # Skip if disabled or daemon not running
  if [[ "$CLIFLOW_ENABLED" != "1" ]] || ! cliflow_is_running; then
    zle expand-or-complete
    return
  fi
  
  # Try Ink UI first (if mode is ink and UI file exists)
  if [[ "$CLIFLOW_UI_MODE" == "ink" ]] && [[ -f "$CLIFLOW_UI" ]] && command -v node &>/dev/null; then
    # Save cursor position and clear line for UI
    echo ""
    
    # Run the Ink UI
    local result
    result=$(node "$CLIFLOW_UI" "$buffer" "$cursor" "$PWD" 2>/dev/null)
    
    # Move cursor back up
    echo -ne "\033[1A\033[2K"
    
    if [[ -n "$result" ]] && [[ "$result" == *'"selected":'* ]]; then
      selected=$(echo "$result" | sed 's/.*"selected":"\([^"]*\)".*/\1/')
    fi
  fi
  
  # Fall back to fzf mode
  if [[ -z "$selected" ]] && [[ "$CLIFLOW_UI_MODE" != "basic" ]] && command -v fzf &>/dev/null; then
    selected=$(cliflow_fzf_complete "$buffer" "$cursor")
  fi
  
  # Apply selected completion
  if [[ -n "$selected" ]]; then
    local prefix="${buffer% *}"
    if [[ "$prefix" == "$buffer" ]] || [[ -z "${buffer// /}" ]]; then
      BUFFER="${selected} "
    else
      BUFFER="${prefix} ${selected} "
    fi
    CURSOR=${#BUFFER}
    zle reset-prompt
    return
  fi
  
  # Fall back to basic inline completion
  local response=$(cliflow_get_completions "$buffer" "$cursor")
  
  if [[ -z "$response" ]] || [[ "$response" == *'"success":false'* ]]; then
    zle expand-or-complete
    return
  fi
  
  # Parse suggestions
  local -a suggestions
  local -a descriptions
  
  # Simple JSON parsing for suggestions
  # Looking for: "name":"value"
  local names=($(echo "$response" | grep -oE '"name":"[^"]*"' | sed 's/"name":"//g;s/"//g'))
  local descs=($(echo "$response" | grep -oE '"description":"[^"]*"' | sed 's/"description":"//g;s/"//g' | head -${#names[@]}))
  local icons=($(echo "$response" | grep -oE '"icon":"[^"]*"' | sed 's/"icon":"//g;s/"//g' | head -${#names[@]}))
  
  if [[ ${#names[@]} -eq 0 ]]; then
    zle expand-or-complete
    return
  fi
  
  # Build completion array for zsh menu
  local -a completions
  for i in {1..${#names[@]}}; do
    local name="${names[$i]}"
    local desc="${descs[$i]:-}"
    local icon="${icons[$i]:-•}"
    completions+=("${name}:${icon} ${desc}")
  done
  
  # Use zsh's completion system
  _cliflow_completions() {
    local -a opts
    for c in "${completions[@]}"; do
      opts+=("${c%%:*}:${c#*:}")
    done
    _describe 'cliflow' opts
  }
  
  # Trigger completion menu
  compadd -Q -a completions
  
  # Alternative: Use fzf if available for better UI
  if command -v fzf &>/dev/null && [[ -t 0 ]]; then
    local selected=$(printf '%s\n' "${completions[@]}" | \
      fzf --height=10 --reverse --no-sort --ansi \
          --delimiter=':' \
          --with-nth=1 \
          --preview-window=hidden \
          --bind='tab:accept' \
          --prompt="❯ " \
          --pointer="▶" \
          --color='fg:#f8f8f2,bg:-1,hl:#bd93f9,fg+:#f8f8f2,bg+:#44475a,hl+:#bd93f9,info:#ffb86c,prompt:#50fa7b,pointer:#ff79c6,marker:#ff79c6,spinner:#ffb86c,header:#6272a4')
    
    if [[ -n "$selected" ]]; then
      local completion="${selected%%:*}"
      # Find the current word and replace it
      local prefix="${buffer% *}"
      if [[ "$prefix" == "$buffer" ]]; then
        BUFFER="$completion"
      else
        BUFFER="${prefix} ${completion}"
      fi
      CURSOR=${#BUFFER}
    fi
  fi
  
  zle reset-prompt
}

# Space widget - shows inline ghost completion
cliflow_space_widget() {
  # First, insert the space
  BUFFER+=" "
  CURSOR=${#BUFFER}
  
  # Skip if disabled or daemon not running
  if [[ "$CLIFLOW_ENABLED" != "1" ]] || ! cliflow_is_running; then
    zle reset-prompt
    return
  fi
  
  # Get completions
  local response=$(cliflow_get_completions "$BUFFER" "$CURSOR")
  
  if [[ -z "$response" ]] || [[ "$response" == *'"success":false'* ]]; then
    zle reset-prompt
    return
  fi
  
  # Get top suggestion
  local top_suggestion=$(echo "$response" | grep -oE '"name":"[^"]*"' | head -1 | sed 's/"name":"//;s/"//')
  
  if [[ -n "$top_suggestion" ]] && [[ "$top_suggestion" != "$BUFFER"* ]]; then
    # Store for Right arrow acceptance
    CLIFLOW_GHOST="$top_suggestion"
    # Show ghost text using raw ANSI codes (dim gray)
    POSTDISPLAY=$'\e[90m'"$top_suggestion"$'\e[0m'
  else
    POSTDISPLAY=""
    CLIFLOW_GHOST=""
  fi
  
  zle reset-prompt
}

# Right arrow accepts ghost completion
cliflow_accept_ghost() {
  if [[ -n "$CLIFLOW_GHOST" ]]; then
    BUFFER="${BUFFER}${CLIFLOW_GHOST} "
    CURSOR=${#BUFFER}
    POSTDISPLAY=""
    CLIFLOW_GHOST=""
  else
    zle forward-char
  fi
  zle reset-prompt
}

# Register widgets
zle -N cliflow_complete_widget
zle -N cliflow_space_widget
zle -N cliflow_accept_ghost

# Bind keys
bindkey '^I' cliflow_complete_widget    # Tab - full fzf menu
bindkey ' ' cliflow_space_widget        # Space - inline ghost
bindkey '^[[C' cliflow_accept_ghost     # Right arrow - accept ghost

# Status functions
cliflow_status() {
  echo "${CLIFLOW_COLORS[cyan]}${CLIFLOW_COLORS[bold]}CLIFlow Status${CLIFLOW_COLORS[reset]}"
  echo "─────────────────────────────"
  
  if cliflow_is_running; then
    echo "  Daemon:  ${CLIFLOW_COLORS[green]}● Running${CLIFLOW_COLORS[reset]}"
  else
    echo "  Daemon:  ${CLIFLOW_COLORS[yellow]}○ Stopped${CLIFLOW_COLORS[reset]}"
  fi
  
  echo "  Socket:  $CLIFLOW_SOCKET"
  echo "  UI Mode: $CLIFLOW_UI_MODE"
  echo "  Root:    $CLIFLOW_ROOT"
  
  if [[ -f "$CLIFLOW_UI" ]]; then
    echo "  Ink UI:  ${CLIFLOW_COLORS[green]}✓ Available${CLIFLOW_COLORS[reset]}"
  else
    echo "  Ink UI:  ${CLIFLOW_COLORS[yellow]}○ Not found${CLIFLOW_COLORS[reset]}"
  fi
  
  if command -v fzf &>/dev/null; then
    echo "  fzf:     ${CLIFLOW_COLORS[green]}✓ Available${CLIFLOW_COLORS[reset]}"
  else
    echo "  fzf:     ${CLIFLOW_COLORS[dim]}○ Not installed${CLIFLOW_COLORS[reset]}"
  fi
}

cliflow_enable() {
  CLIFLOW_ENABLED=1
  echo "✓ CLIFlow enabled"
}

cliflow_disable() {
  CLIFLOW_ENABLED=0
  echo "○ CLIFlow disabled"
}

# Set UI mode: ink, fzf, or basic
cliflow_mode() {
  local mode="$1"
  case "$mode" in
    ink|ui)
      CLIFLOW_UI_MODE="ink"
      echo "✓ Using Ink UI mode"
      ;;
    fzf)
      CLIFLOW_UI_MODE="fzf"
      echo "✓ Using fzf mode"
      ;;
    basic|inline|simple)
      CLIFLOW_UI_MODE="basic"
      echo "✓ Using basic inline mode"
      ;;
    *)
      echo "Usage: cliflow_mode [ink|fzf|basic]"
      echo "Current mode: $CLIFLOW_UI_MODE"
      ;;
  esac
}

# Print startup message
if [[ "$CLIFLOW_DEBUG" == "1" ]]; then
  echo "${CLIFLOW_COLORS[dim]}CLIFlow shell integration loaded (mode: $CLIFLOW_UI_MODE)${CLIFLOW_COLORS[reset]}"
fi
