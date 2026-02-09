#!/bin/bash
#
# CLIFlow Quick Install Wrapper
# Redirects to the full installer in scripts/install.sh
#
# Usage:
#   ./install.sh
#   curl -fsSL https://raw.githubusercontent.com/adnankoroth/cliflow/main/install.sh | bash
#

# Check if running from repo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/scripts/install.sh" ]; then
    exec bash "$SCRIPT_DIR/scripts/install.sh" "$@"
else
    # Download and run installer
    curl -fsSL https://raw.githubusercontent.com/adnankoroth/cliflow/main/scripts/install.sh | bash -s -- "$@"
fi
