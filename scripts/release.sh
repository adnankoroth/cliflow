#!/bin/bash
#
# CLIFlow Release Script
# Creates a new release with proper SHA256 hashes
#
# Usage: ./scripts/release.sh v1.0.0
#

set -e

VERSION="${1:-}"

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 v1.0.0"
    exit 1
fi

# Remove 'v' prefix if present for version number
VERSION_NUM="${VERSION#v}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${BLUE}ℹ${NC}  $1"; }
success() { echo -e "${GREEN}✓${NC}  $1"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $1"; }
error()   { echo -e "${RED}✗${NC}  $1"; exit 1; }
step()    { echo -e "\n${CYAN}${BOLD}▸ $1${NC}"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
RELEASE_DIR="$ROOT_DIR/releases/$VERSION"

echo ""
echo -e "${CYAN}${BOLD}CLIFlow Release Script${NC}"
echo -e "${CYAN}Version: $VERSION${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# Pre-flight checks
# ═══════════════════════════════════════════════════════════════════════════════

step "Pre-flight checks..."

# Check we're in the right directory
if [ ! -f "$ROOT_DIR/package.json" ]; then
    error "Must run from CLIFlow repository root"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    warn "You have uncommitted changes"
    read -p "Continue anyway? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if tag already exists
if git rev-parse "$VERSION" >/dev/null 2>&1; then
    error "Tag $VERSION already exists"
fi

success "All checks passed"

# ═══════════════════════════════════════════════════════════════════════════════
# Update version
# ═══════════════════════════════════════════════════════════════════════════════

step "Updating version to $VERSION_NUM..."

cd "$ROOT_DIR"

# Update package.json
if command -v jq &> /dev/null; then
    jq ".version = \"$VERSION_NUM\"" package.json > package.json.tmp && mv package.json.tmp package.json
else
    sed -i.bak "s/\"version\": \".*\"/\"version\": \"$VERSION_NUM\"/" package.json
    rm -f package.json.bak
fi

success "Updated package.json"

# ═══════════════════════════════════════════════════════════════════════════════
# Build
# ═══════════════════════════════════════════════════════════════════════════════

step "Building..."

npm ci --ignore-scripts
npm run build

success "Build complete"

# ═══════════════════════════════════════════════════════════════════════════════
# Create release directory
# ═══════════════════════════════════════════════════════════════════════════════

step "Creating release artifacts..."

mkdir -p "$RELEASE_DIR"

# Create source tarball (simulating what GitHub creates)
TARBALL_NAME="cliflow-$VERSION_NUM.tar.gz"
git archive --format=tar.gz --prefix="cliflow-$VERSION_NUM/" HEAD > "$RELEASE_DIR/$TARBALL_NAME"

# Calculate SHA256
TARBALL_SHA256=$(shasum -a 256 "$RELEASE_DIR/$TARBALL_NAME" | cut -d' ' -f1)

success "Created $TARBALL_NAME"
info "SHA256: $TARBALL_SHA256"

# ═══════════════════════════════════════════════════════════════════════════════
# Update Homebrew formula
# ═══════════════════════════════════════════════════════════════════════════════

step "Updating Homebrew formula..."

FORMULA_FILE="$ROOT_DIR/packaging/homebrew/cliflow.rb"

# Update URL
sed -i.bak "s|url \"https://github.com/adnankoroth/cliflow/archive/refs/tags/.*\"|url \"https://github.com/adnankoroth/cliflow/archive/refs/tags/$VERSION.tar.gz\"|" "$FORMULA_FILE"

# Update SHA256
sed -i.bak "s/sha256 \".*\"/sha256 \"$TARBALL_SHA256\"/" "$FORMULA_FILE"

rm -f "$FORMULA_FILE.bak"

success "Updated formula with SHA256: $TARBALL_SHA256"

# ═══════════════════════════════════════════════════════════════════════════════
# Create checksums file
# ═══════════════════════════════════════════════════════════════════════════════

step "Creating checksums..."

cat > "$RELEASE_DIR/SHA256SUMS.txt" << EOF
# CLIFlow $VERSION SHA256 Checksums
# Verify with: shasum -a 256 -c SHA256SUMS.txt

$TARBALL_SHA256  $TARBALL_NAME
EOF

success "Created SHA256SUMS.txt"

# ═══════════════════════════════════════════════════════════════════════════════
# Git operations
# ═══════════════════════════════════════════════════════════════════════════════

step "Committing changes..."

git add package.json "$FORMULA_FILE"
git commit -m "Release $VERSION"

success "Committed version bump"

step "Creating tag..."

git tag -a "$VERSION" -m "Release $VERSION

CLIFlow $VERSION

## Installation

\`\`\`bash
# Quick install
curl -fsSL https://raw.githubusercontent.com/adnankoroth/cliflow/main/install.sh | bash

# Homebrew
brew install adnankoroth/cliflow/cliflow
\`\`\`

## Checksums (SHA256)
$TARBALL_SHA256  $TARBALL_NAME
"

success "Created tag $VERSION"

# ═══════════════════════════════════════════════════════════════════════════════
# Summary
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${GREEN}${BOLD}"
echo "  ╔════════════════════════════════════════════════════════════╗"
echo "  ║                                                            ║"
echo "  ║   ✓  Release $VERSION prepared!                            "
echo "  ║                                                            ║"
echo "  ╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BOLD}Next steps:${NC}"
echo ""
echo "  1. ${CYAN}Review the changes:${NC}"
echo "     git log --oneline -3"
echo "     git show $VERSION"
echo ""
echo "  2. ${CYAN}Push to GitHub:${NC}"
echo "     git push origin main"
echo "     git push origin $VERSION"
echo ""
echo "  3. ${CYAN}Create GitHub Release:${NC}"
echo "     - Go to: https://github.com/adnankoroth/cliflow/releases/new"
echo "     - Select tag: $VERSION"
echo "     - Upload: $RELEASE_DIR/$TARBALL_NAME"
echo "     - Add release notes"
echo ""
echo "  4. ${CYAN}Update Homebrew tap:${NC}"
echo "     cd /path/to/homebrew-cliflow"
echo "     cp $FORMULA_FILE Formula/"
echo "     git add Formula/cliflow.rb"
echo "     git commit -m \"Update cliflow to $VERSION\""
echo "     git push"
echo ""
echo -e "${BOLD}SHA256 for Homebrew:${NC}"
echo "  $TARBALL_SHA256"
echo ""
