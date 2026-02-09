#!/bin/bash
#
# CLIFlow Uninstall Script
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/adnankoroth/cliflow/main/scripts/uninstall.sh | bash
#

set -e

# ═══════════════════════════════════════════════════════════════════════════════
# Configuration
# ═══════════════════════════════════════════════════════════════════════════════

CLIFLOW_HOME="${CLIFLOW_HOME:-$HOME/.cliflow}"

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
step()    { echo -e "\n${CYAN}${BOLD}▸ $1${NC}"; }

# ═══════════════════════════════════════════════════════════════════════════════
# Banner
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${CYAN}${BOLD}CLIFlow Uninstaller${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# Confirmation
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "This will uninstall CLIFlow and remove all configuration."
echo ""
read -p "Are you sure you want to continue? [y/N] " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Stop Services
# ═══════════════════════════════════════════════════════════════════════════════

step "Stopping CLIFlow daemon..."

# Stop daemon process
pkill -f "cliflow.*daemon" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
success "Daemon stopped"

# Unload LaunchAgent (macOS)
LAUNCH_AGENT_FILE="$HOME/Library/LaunchAgents/com.cliflow.daemon.plist"
if [ -f "$LAUNCH_AGENT_FILE" ]; then
    launchctl unload "$LAUNCH_AGENT_FILE" 2>/dev/null || true
    rm -f "$LAUNCH_AGENT_FILE"
    success "Removed LaunchAgent"
fi

# Disable systemd service (Linux)
if command -v systemctl &> /dev/null; then
    systemctl --user disable cliflow 2>/dev/null || true
    systemctl --user stop cliflow 2>/dev/null || true
    rm -f "$HOME/.config/systemd/user/cliflow.service" 2>/dev/null || true
    systemctl --user daemon-reload 2>/dev/null || true
    success "Removed systemd service"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Remove Files
# ═══════════════════════════════════════════════════════════════════════════════

step "Removing CLIFlow files..."

# Remove installation directory
if [ -d "$CLIFLOW_HOME" ]; then
    rm -rf "$CLIFLOW_HOME"
    success "Removed $CLIFLOW_HOME"
fi

# Remove CLI wrapper
if [ -f "$HOME/.local/bin/cliflow" ]; then
    rm -f "$HOME/.local/bin/cliflow"
    success "Removed CLI wrapper"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Clean Shell Configs
# ═══════════════════════════════════════════════════════════════════════════════

step "Cleaning shell configurations..."

remove_from_config() {
    local config_file="$1"
    
    if [ ! -f "$config_file" ]; then
        return
    fi
    
    # Create backup
    cp "$config_file" "${config_file}.cliflow-backup"
    
    # Remove CLIFlow lines
    if grep -q "cliflow" "$config_file" 2>/dev/null; then
        # Remove the comment and source line
        sed -i.bak '/# CLIFlow/d' "$config_file" 2>/dev/null || \
            sed -i '' '/# CLIFlow/d' "$config_file" 2>/dev/null || true
        sed -i.bak '/cliflow/d' "$config_file" 2>/dev/null || \
            sed -i '' '/cliflow/d' "$config_file" 2>/dev/null || true
        
        # Clean up backup files
        rm -f "${config_file}.bak" 2>/dev/null || true
        
        success "Cleaned $config_file"
    fi
}

remove_from_config "$HOME/.zshrc"
remove_from_config "$HOME/.bashrc"
remove_from_config "$HOME/.bash_profile"

# ═══════════════════════════════════════════════════════════════════════════════
# Done
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${GREEN}${BOLD}CLIFlow has been uninstalled.${NC}"
echo ""
echo -e "${DIM}Restart your terminal to complete the removal.${NC}"
echo ""
echo -e "To reinstall, run:"
echo -e "  ${CYAN}curl -fsSL https://raw.githubusercontent.com/adnankoroth/cliflow/main/scripts/install.sh | bash${NC}"
echo ""
