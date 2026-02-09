#!/bin/bash
# Build macOS installer package (.pkg) for CLIFlow
# This creates an installer that can be deployed via MDM (Jamf, Kandji, etc.)

set -e

VERSION="1.0.0"
IDENTIFIER="io.cliflow.cli"
INSTALL_LOCATION="/usr/local/cliflow"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$ROOT_DIR/dist/pkg-build"
PKG_DIR="$ROOT_DIR/dist"

echo "🔨 Building CLIFlow macOS Installer Package v${VERSION}"
echo ""

# Clean and create build directory
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/payload${INSTALL_LOCATION}"
mkdir -p "$BUILD_DIR/scripts"

# Build standalone binary first
echo "📦 Building standalone binary..."
cd "$ROOT_DIR"
npm run build

# For now, copy the Node.js version (replace with pkg binary later)
cp -r build "$BUILD_DIR/payload${INSTALL_LOCATION}/"
cp -r shell-integration "$BUILD_DIR/payload${INSTALL_LOCATION}/"
cp package.json "$BUILD_DIR/payload${INSTALL_LOCATION}/"

# Create symlink script
cat > "$BUILD_DIR/scripts/postinstall" << 'EOF'
#!/bin/bash
# Post-installation script

INSTALL_DIR="/usr/local/cliflow"

# Create symlink in /usr/local/bin
ln -sf "$INSTALL_DIR/build/bin/cliflow.js" /usr/local/bin/cliflow

# Make executable
chmod +x "$INSTALL_DIR/build/bin/cliflow.js"

# Install Node.js if not present (via Homebrew)
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js 20+ to use CLIFlow."
    echo "  brew install node@20"
fi

echo "CLIFlow installed successfully!"
echo "Run 'cliflow setup' to configure your shell."

exit 0
EOF
chmod +x "$BUILD_DIR/scripts/postinstall"

# Create uninstall script
cat > "$BUILD_DIR/payload${INSTALL_LOCATION}/uninstall.sh" << 'EOF'
#!/bin/bash
# Uninstall CLIFlow

echo "Uninstalling CLIFlow..."

# Remove symlink
rm -f /usr/local/bin/cliflow

# Remove installation directory
rm -rf /usr/local/cliflow

# Remove config (optional)
read -p "Remove configuration (~/.cliflow)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf ~/.cliflow
fi

echo "CLIFlow uninstalled."
EOF
chmod +x "$BUILD_DIR/payload${INSTALL_LOCATION}/uninstall.sh"

# Build the package
echo ""
echo "📦 Creating installer package..."

pkgbuild \
    --root "$BUILD_DIR/payload" \
    --scripts "$BUILD_DIR/scripts" \
    --identifier "$IDENTIFIER" \
    --version "$VERSION" \
    --install-location "/" \
    "$PKG_DIR/cliflow-${VERSION}.pkg"

echo ""
echo "✅ Package created: dist/cliflow-${VERSION}.pkg"
echo ""
echo "To install:"
echo "  sudo installer -pkg dist/cliflow-${VERSION}.pkg -target /"
echo ""
echo "For MDM deployment:"
echo "  Upload cliflow-${VERSION}.pkg to Jamf/Kandji/Mosyle"
