# CLIFlow - IDE-like autocomplete for the terminal
# Fish shell integration

# Configuration
set -g CLIFLOW_SOCKET "$HOME/.cliflow/cliflow.sock"
set -g CLIFLOW_ENABLED 1
set -g CLIFLOW_DEBUG 0
set -g CLIFLOW_UI_MODE "fzf"  # "fzf" for fuzzy UI, "basic" for simple

# Find CLIFlow installation
if not set -q CLIFLOW_ROOT
    set -g CLIFLOW_ROOT "$HOME/.cliflow"
end

# Find cliflow-client binary
if not set -q CLIFLOW_CLIENT
    set -g CLIFLOW_CLIENT (status dirname)"/../bin/cliflow-client"
end

# Check if daemon is running
function cliflow_is_running
    test -S "$CLIFLOW_SOCKET"
end

# Send request to daemon
function cliflow_request
    set -l request $argv[1]
    
    if not cliflow_is_running
        return 1
    end
    
    # Use compiled Go client (fastest), fall back to socat/nc
    if test -x "$CLIFLOW_CLIENT"
        $CLIFLOW_CLIENT "$request" 2>/dev/null
    else if command -sq socat
        echo "$request" | socat -t2 - UNIX-CONNECT:"$CLIFLOW_SOCKET" 2>/dev/null
    else if command -sq nc
        echo "$request" | nc -U "$CLIFLOW_SOCKET" 2>/dev/null
    else
        return 1
    end
end

# Get completions from daemon
function cliflow_get_completions
    set -l buffer $argv[1]
    set -l cursor $argv[2]
    set -l cwd (pwd)
    
    # Escape quotes
    set buffer (string replace -a '"' '\\"' "$buffer")
    set cwd (string replace -a '"' '\\"' "$cwd")
    
    set -l request "{\"type\":\"complete\",\"commandLine\":\"$buffer\",\"cursorPosition\":$cursor,\"cwd\":\"$cwd\",\"shell\":\"fish\",\"format\":\"tsv\"}"
    
    cliflow_request "$request"
end

# Helper: Parse TSV line
function cliflow_parse_tsv_line
    string split \t $argv[1]
end

# FZF-based completion
function cliflow_fzf_complete
    set -l buffer $argv[1]
    set -l cursor $argv[2]
    
    set -l response (cliflow_get_completions "$buffer" "$cursor")
    
    if test -z "$response"; or string match -q '*"success":false*' "$response"
        return 1
    end
    
    # Build items for fzf
    set -l items
    set -l found_header 0
    
    for line in (string split \n $response)
        if test $found_header -eq 0
            if string match -q "OK*" "$line"
                set found_header 1
                continue
            else
                return 1
            end
        end
        
        set -l parts (string split \t -- $line)
        set -l name $parts[1]
        set -l insertValue $parts[2]
        set -l icon $parts[3]
        set -l desc $parts[4]
        
        if test -z "$name"; continue; end
        
        if test -z "$icon"; set icon "•"; end
        set -a items "$icon $name|$desc"
    end
    
    # Run fzf
    set -l selected (printf '%s\n' $items | \
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
    
    if test -n "$selected"
        # Extract name (remove icon prefix and description)
        set -l name (string replace -r '^[^ ]+ ' '' "$selected")
        set name (string replace -r '\|.*$' '' "$name")
        echo "$name"
        return 0
    end
    
    return 1
end

# Fish completion function
function __cliflow_complete
    set -l cmd (commandline -o)
    set -l buffer (commandline -b)
    set -l cursor (commandline -C)
    
    # Skip if disabled or daemon not running
    if test "$CLIFLOW_ENABLED" != "1"; or not cliflow_is_running
        return
    end
    
    set -l response (cliflow_get_completions "$buffer" "$cursor")
    
    if test -z "$response"; or string match -q '*"success":false*' "$response"
        return
    end
    
    # Parse TSV response
    set -l found_header 0
    
    for line in (string split \n $response)
        if test $found_header -eq 0
            if string match -q "OK*" "$line"
                set found_header 1
                continue
            else
                return 1 # Error or invalid response
            end
        end
        
        set -l parts (string split \t -- $line)
        set -l name $parts[1]
        set -l insertValue $parts[2]
        set -l icon $parts[3]
        set -l desc $parts[4]
        
        if test -z "$name"; continue; end
        if test -z "$icon"; set icon "•"; end
        
        # Fish completion format: value \t description
        # We include the icon in the description for visibility
        printf '%s\t%s %s\n' "$name" "$icon" "$desc"
    end
end

# FZF keybinding for fish (Ctrl+Space)
function __cliflow_fzf_widget
    set -l buffer (commandline -b)
    set -l cursor (commandline -C)
    
    if test "$CLIFLOW_ENABLED" != "1"; or not cliflow_is_running
        return
    end
    
    if test "$CLIFLOW_UI_MODE" = "fzf"; and command -sq fzf
        set -l selected (cliflow_fzf_complete "$buffer" "$cursor")
        
        if test -n "$selected"
            # Get the prefix (everything before the last space)
            set -l prefix (string replace -r ' [^ ]*$' '' "$buffer")
            
            if test "$prefix" = "$buffer"; or test -z (string trim "$buffer")
                commandline -r "$selected "
            else
                commandline -r "$prefix $selected "
            end
            commandline -f repaint
        end
    end
end

# Register completions for common commands
function __cliflow_register
    set -l commands \
        git docker kubectl aws terraform helm npm yarn pip cargo go make \
        curl ssh rsync grep find cat tail head ps kill chmod chown tar wget scp \
        docker-compose kubectx kubens psql mysql redis-cli mongosh \
        az gcloud gh ansible ansible-playbook pulumi serverless \
        jest cypress playwright eslint prettier vitest \
        vault 1password sops age gpg \
        kustomize skaffold kind minikube flux \
        next vite vue create-react-app nuxt storybook ng \
        prisma prometheus grafana-cli datadog jaeger
    
    for cmd in $commands
        if command -sq $cmd
            complete -c $cmd -f -a "(__cliflow_complete)"
        end
    end
end

# Helper functions
function cliflow_enable
    set -g CLIFLOW_ENABLED 1
    echo "CLIFlow enabled"
end

function cliflow_disable
    set -g CLIFLOW_ENABLED 0
    echo "CLIFlow disabled"
end

function cliflow_status
    echo "CLIFlow Status:"
    echo "  Enabled: $CLIFLOW_ENABLED"
    echo "  UI Mode: $CLIFLOW_UI_MODE"
    echo "  Socket: $CLIFLOW_SOCKET"
    if cliflow_is_running
        set_color green
        echo "  Daemon: Running"
    else
        set_color yellow
        echo "  Daemon: Not running"
    end
    set_color normal
end

function cliflow_mode
    switch $argv[1]
        case fzf
            set -g CLIFLOW_UI_MODE "fzf"
            echo "Switched to fzf mode"
        case basic
            set -g CLIFLOW_UI_MODE "basic"
            echo "Switched to basic mode"
        case '*'
            echo "Usage: cliflow_mode [fzf|basic]"
            echo "Current mode: $CLIFLOW_UI_MODE"
    end
end

# Bind Ctrl+Space to fzf completion widget
bind \e\  __cliflow_fzf_widget  # Alt+Space
bind \cg __cliflow_fzf_widget   # Ctrl+G as alternative

# Initialize
if test "$CLIFLOW_ENABLED" = "1"
    __cliflow_register
    
    if test "$CLIFLOW_DEBUG" = "1"
        if cliflow_is_running
            set_color green
            echo "✓ CLIFlow loaded (fish)"
            set_color normal
        else
            set_color yellow
            echo "⚠ CLIFlow loaded but daemon not running"
            set_color normal
        end
    end
end
