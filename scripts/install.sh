#!/bin/bash
#
# CLIFlow Installation Script
# IDE-style terminal autocompletion
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/adnankoroth/cliflow/main/scripts/install.sh | bash
#
# Options:
#   --no-shell-setup    Skip automatic shell configuration
#   --install-dir DIR   Custom installation directory (default: ~/.cliflow)
#

set -e

# ═══════════════════════════════════════════════════════════════════════════════
# Configuration
# ═══════════════════════════════════════════════════════════════════════════════

CLIFLOW_VERSION="${CLIFLOW_VERSION:-latest}"
CLIFLOW_HOME="${CLIFLOW_HOME:-$HOME/.cliflow}"
CLIFLOW_REPO="https://github.com/adnankoroth/cliflow"
AUTO_SHELL_SETUP=true

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --no-shell-setup) AUTO_SHELL_SETUP=false; shift ;;
    --install-dir) CLIFLOW_HOME="$2"; shift 2 ;;
    --version) CLIFLOW_VERSION="$2"; shift 2 ;;
    *) shift ;;
  esac
done

# ═══════════════════════════════════════════════════════════════════════════════
# Colors and helpers
# ═══════════════════════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

info()    { echo -e "${BLUE}ℹ${NC}  $1"; }
success() { echo -e "${GREEN}✓${NC}  $1"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $1"; }
error()   { echo -e "${RED}✗${NC}  $1"; exit 1; }
step()    { echo -e "\n${CYAN}${BOLD}▸ $1${NC}"; }

# ═══════════════════════════════════════════════════════════════════════════════
# Banner
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${CYAN}${BOLD}"
echo "   ██████╗██╗     ██╗███████╗██╗      ██████╗ ██╗    ██╗"
echo "  ██╔════╝██║     ██║██╔════╝██║     ██╔═══██╗██║    ██║"
echo "  ██║     ██║     ██║█████╗  ██║     ██║   ██║██║ █╗ ██║"
echo "  ██║     ██║     ██║██╔══╝  ██║     ██║   ██║██║███╗██║"
echo "  ╚██████╗███████╗██║██║     ███████╗╚██████╔╝╚███╔███╔╝"
echo "   ╚═════╝╚══════╝╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ "
echo -e "${NC}"
echo -e "  ${DIM}IDE-style autocompletion for your terminal${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# System Detection
# ═══════════════════════════════════════════════════════════════════════════════

step "Detecting system..."

OS="$(uname -s)"
ARCH="$(uname -m)"
SHELL_NAME="$(basename "$SHELL")"

case "$OS" in
    Darwin) 
        OS_NAME="macOS"
        OS_TYPE="macos"
        ;;
    Linux)  
        OS_NAME="Linux"
        OS_TYPE="linux"
        ;;
    MINGW*|MSYS*|CYGWIN*)
        OS_NAME="Windows (WSL recommended)"
        OS_TYPE="windows"
        warn "Native Windows support is limited. Consider using WSL."
        ;;
    *)
        error "Unsupported operating system: $OS"
        ;;
esac

case "$ARCH" in
    x86_64|amd64) ARCH_NAME="x64" ;;
    arm64|aarch64) ARCH_NAME="arm64" ;;
    *) error "Unsupported architecture: $ARCH" ;;
esac

info "Operating System: ${OS_NAME} (${ARCH_NAME})"
info "Default Shell: ${SHELL_NAME}"
info "Install Location: ${CLIFLOW_HOME}"

# ═══════════════════════════════════════════════════════════════════════════════
# Prerequisites Check
# ═══════════════════════════════════════════════════════════════════════════════

step "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js is required but not installed.

Please install Node.js 18+ first:

  macOS:   brew install node
  Ubuntu:  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs
  Fedora:  sudo dnf install nodejs

Then run this installer again."
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ required. Found: $(node -v)
    
Please upgrade Node.js and try again."
fi
success "Node.js $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    error "npm is required but not installed."
fi
success "npm $(npm -v)"

# Check git (optional, for cloning)
if command -v git &> /dev/null; then
    HAS_GIT=true
    success "git $(git --version | cut -d' ' -f3)"
else
    HAS_GIT=false
    warn "git not found - will download as archive"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Installation
# ═══════════════════════════════════════════════════════════════════════════════

step "Installing CLIFlow..."

# Create installation directory
mkdir -p "$CLIFLOW_HOME"

# Check if already installed
if [ -f "$CLIFLOW_HOME/package.json" ]; then
    info "Existing installation found, updating..."
    UPDATING=true
else
    UPDATING=false
fi

# Download/clone CLIFlow
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

if [ "$HAS_GIT" = true ]; then
    info "Cloning repository..."
    if [ "$CLIFLOW_VERSION" = "latest" ]; then
        git clone --depth 1 "$CLIFLOW_REPO.git" cliflow 2>/dev/null || {
            # Fallback for local development
            if [ -d "$HOME/go/cliflow" ]; then
                info "Using local development version..."
                cp -r "$HOME/go/cliflow" cliflow
            else
                error "Failed to clone repository"
            fi
        }
    else
        git clone --depth 1 --branch "$CLIFLOW_VERSION" "$CLIFLOW_REPO.git" cliflow 2>/dev/null || error "Failed to clone version $CLIFLOW_VERSION"
    fi
else
    info "Downloading archive..."
    if [ "$CLIFLOW_VERSION" = "latest" ]; then
        DOWNLOAD_URL="${CLIFLOW_REPO}/archive/refs/heads/main.tar.gz"
    else
        DOWNLOAD_URL="${CLIFLOW_REPO}/archive/refs/tags/${CLIFLOW_VERSION}.tar.gz"
    fi
    
    if command -v curl &> /dev/null; then
        curl -fsSL "$DOWNLOAD_URL" -o cliflow.tar.gz || error "Download failed"
    elif command -v wget &> /dev/null; then
        wget -q "$DOWNLOAD_URL" -O cliflow.tar.gz || error "Download failed"
    else
        error "Neither curl nor wget found"
    fi
    
    tar -xzf cliflow.tar.gz
    mv cliflow-* cliflow
fi

cd cliflow

# Install dependencies
info "Installing dependencies..."
npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts

# Build
info "Building CLIFlow..."
npm run build

# Copy to installation directory
info "Installing files..."
cp -r build "$CLIFLOW_HOME/"
cp -r shell-integration "$CLIFLOW_HOME/"
cp package.json "$CLIFLOW_HOME/"

# Create the socket client script
cat > "$CLIFLOW_HOME/client.mjs" << 'CLIENTEOF'
#!/usr/bin/env node
import { createConnection } from 'net';
import { homedir } from 'os';
import { join } from 'path';

const SOCKET_PATH = join(homedir(), '.cliflow', 'cliflow.sock');

const request = process.argv[2];
if (!request) {
  process.exit(1);
}

const socket = createConnection(SOCKET_PATH);
let response = '';

socket.on('connect', () => {
  socket.write(request + '\n');
});

socket.on('data', (data) => {
  response += data.toString();
  if (response.includes('\n')) {
    console.log(response.trim());
    socket.end();
  }
});

socket.on('error', () => {
  process.exit(1);
});

socket.setTimeout(2000, () => {
  socket.end();
  process.exit(1);
});
CLIENTEOF

chmod +x "$CLIFLOW_HOME/client.mjs"

# Create CLI wrapper script
mkdir -p "$HOME/.local/bin"
cat > "$HOME/.local/bin/cliflow" << EOF
#!/bin/bash
exec node "$CLIFLOW_HOME/build/bin/cliflow.js" "\$@"
EOF
chmod +x "$HOME/.local/bin/cliflow"

# Cleanup
cd /
rm -rf "$TEMP_DIR"

success "CLIFlow installed to $CLIFLOW_HOME"

# ═══════════════════════════════════════════════════════════════════════════════
# Shell Integration
# ═══════════════════════════════════════════════════════════════════════════════

step "Configuring shell integration..."

setup_shell_integration() {
    local shell_name="$1"
    local rc_file="$2"
    local source_line="$3"
    
    if [ ! -f "$rc_file" ]; then
        touch "$rc_file"
    fi
    
    # Check if already configured
    if grep -q "cliflow" "$rc_file" 2>/dev/null; then
        info "$shell_name: Already configured in $rc_file"
        return 0
    fi
    
    # Add source line
    echo "" >> "$rc_file"
    echo "# CLIFlow - IDE-style terminal autocompletion" >> "$rc_file"
    echo "$source_line" >> "$rc_file"
    
    success "$shell_name: Added to $rc_file"
}

if [ "$AUTO_SHELL_SETUP" = true ]; then
    # Detect and configure shells
    
    # Zsh
    if [ -f "$HOME/.zshrc" ] || [ "$SHELL_NAME" = "zsh" ]; then
        setup_shell_integration "zsh" "$HOME/.zshrc" "source \"$CLIFLOW_HOME/shell-integration/cliflow.zsh\""
    fi
    
    # Bash
    if [ -f "$HOME/.bashrc" ] || [ "$SHELL_NAME" = "bash" ]; then
        setup_shell_integration "bash" "$HOME/.bashrc" "source \"$CLIFLOW_HOME/shell-integration/cliflow.bash\""
    fi
    
    # Bash profile (macOS uses this)
    if [ "$OS_TYPE" = "macos" ] && [ -f "$HOME/.bash_profile" ]; then
        setup_shell_integration "bash" "$HOME/.bash_profile" "source \"$CLIFLOW_HOME/shell-integration/cliflow.bash\""
    fi
else
    info "Shell setup skipped (--no-shell-setup)"
    echo ""
    echo "  To enable CLIFlow, add one of these to your shell config:"
    echo ""
    echo "  ${BOLD}Zsh (~/.zshrc):${NC}"
    echo "    source \"$CLIFLOW_HOME/shell-integration/cliflow.zsh\""
    echo ""
    echo "  ${BOLD}Bash (~/.bashrc):${NC}"
    echo "    source \"$CLIFLOW_HOME/shell-integration/cliflow.bash\""
fi

# ═══════════════════════════════════════════════════════════════════════════════
# PATH Setup
# ═══════════════════════════════════════════════════════════════════════════════

step "Checking PATH..."

if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    warn "\$HOME/.local/bin is not in your PATH"
    
    # Add to shell configs
    for rc_file in "$HOME/.zshrc" "$HOME/.bashrc" "$HOME/.bash_profile"; do
        if [ -f "$rc_file" ] && ! grep -q '\.local/bin' "$rc_file"; then
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$rc_file"
            info "Added PATH to $rc_file"
        fi
    done
else
    success "PATH is configured correctly"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Start Daemon
# ═══════════════════════════════════════════════════════════════════════════════

step "Starting CLIFlow daemon..."

# Kill any existing daemon
pkill -f "cliflow.*daemon" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
rm -f "$CLIFLOW_HOME/cliflow.sock" 2>/dev/null || true

sleep 1

# Start daemon
cd "$CLIFLOW_HOME"
nohup node build/daemon/server.js start > "$CLIFLOW_HOME/daemon.log" 2>&1 &
DAEMON_PID=$!

sleep 2

# Check if daemon started
if [ -S "$CLIFLOW_HOME/cliflow.sock" ]; then
    success "Daemon started (PID: $DAEMON_PID)"
else
    warn "Daemon may not have started. Check $CLIFLOW_HOME/daemon.log"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Create systemd/launchd service (optional)
# ═══════════════════════════════════════════════════════════════════════════════

step "Setting up auto-start..."

if [ "$OS_TYPE" = "macos" ]; then
    # Create LaunchAgent for macOS
    LAUNCH_AGENT_DIR="$HOME/Library/LaunchAgents"
    LAUNCH_AGENT_FILE="$LAUNCH_AGENT_DIR/com.cliflow.daemon.plist"
    
    mkdir -p "$LAUNCH_AGENT_DIR"
    
    cat > "$LAUNCH_AGENT_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cliflow.daemon</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which node)</string>
        <string>$CLIFLOW_HOME/build/daemon/server.js</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$CLIFLOW_HOME/daemon.log</string>
    <key>StandardErrorPath</key>
    <string>$CLIFLOW_HOME/daemon.log</string>
    <key>WorkingDirectory</key>
    <string>$CLIFLOW_HOME</string>
</dict>
</plist>
EOF
    
    # Load the agent
    launchctl unload "$LAUNCH_AGENT_FILE" 2>/dev/null || true
    launchctl load "$LAUNCH_AGENT_FILE" 2>/dev/null || true
    
    success "Created LaunchAgent for auto-start"

elif [ "$OS_TYPE" = "linux" ] && command -v systemctl &> /dev/null; then
    # Create systemd user service for Linux
    SYSTEMD_DIR="$HOME/.config/systemd/user"
    SYSTEMD_FILE="$SYSTEMD_DIR/cliflow.service"
    
    mkdir -p "$SYSTEMD_DIR"
    
    cat > "$SYSTEMD_FILE" << EOF
[Unit]
Description=CLIFlow Daemon
After=network.target

[Service]
Type=simple
ExecStart=$(which node) $CLIFLOW_HOME/build/daemon/server.js start
Restart=always
RestartSec=3
WorkingDirectory=$CLIFLOW_HOME

[Install]
WantedBy=default.target
EOF
    
    systemctl --user daemon-reload 2>/dev/null || true
    systemctl --user enable cliflow 2>/dev/null || true
    systemctl --user restart cliflow 2>/dev/null || true
    
    success "Created systemd user service for auto-start"
else
    info "Auto-start not configured (add to your shell profile manually)"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Completion
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${GREEN}${BOLD}"
echo "  ╔════════════════════════════════════════════════════════════╗"
echo "  ║                                                            ║"
echo "  ║   ✓  CLIFlow installed successfully!                       ║"
echo "  ║                                                            ║"
echo "  ╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BOLD}Next steps:${NC}"
echo ""
echo "  1. ${CYAN}Restart your terminal${NC} (or run: source ~/.zshrc)"
echo ""
echo "  2. ${CYAN}Test it out:${NC}"
echo "     $ git ${DIM}# Press Tab or Space after typing${NC}"
echo "     $ aws ${DIM}# See subcommands and options${NC}"
echo "     $ kubectl ${DIM}# Navigate with arrow keys${NC}"
echo ""
echo "  3. ${CYAN}Useful commands:${NC}"
echo "     $ cliflow status    ${DIM}# Check daemon status${NC}"
echo "     $ cliflow restart   ${DIM}# Restart daemon${NC}"
echo "     $ cliflow disable   ${DIM}# Temporarily disable${NC}"
echo ""
echo -e "${DIM}Documentation: https://github.com/adnankoroth/cliflow${NC}"
echo ""
