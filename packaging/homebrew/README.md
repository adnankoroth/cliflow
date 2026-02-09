# Homebrew Tap for CLIFlow

This directory contains the Homebrew formula for CLIFlow.

## Setting Up Your Own Tap

To distribute CLIFlow via Homebrew, you need to create a separate "tap" repository.

### 1. Create the Tap Repository

Create a new GitHub repository named `homebrew-cliflow` (the `homebrew-` prefix is required).

```bash
# Create the repo structure
mkdir homebrew-cliflow
cd homebrew-cliflow
git init

# Create Formula directory
mkdir Formula

# Copy the formula
cp /path/to/cliflow/packaging/homebrew/cliflow.rb Formula/

# Create README
echo "# CLIFlow Homebrew Tap" > README.md
echo "" >> README.md
echo "Install CLIFlow with:" >> README.md
echo '```bash' >> README.md
echo "brew install adnankoroth/cliflow/cliflow" >> README.md
echo '```' >> README.md

# Commit and push
git add .
git commit -m "Initial formula"
git remote add origin git@github.com:adnankoroth/homebrew-cliflow.git
git push -u origin main
```

### 2. Update Formula SHA256

When you create a release, update the SHA256 hash in the formula:

```bash
# Download your release tarball
curl -fsSL https://github.com/adnankoroth/cliflow/archive/refs/tags/v1.0.0.tar.gz -o cliflow.tar.gz

# Get SHA256
shasum -a 256 cliflow.tar.gz
# Output: abc123... cliflow.tar.gz

# Update the formula with this hash
```

### 3. Users Can Install With

```bash
# Add the tap (one time)
brew tap adnankoroth/cliflow

# Install
brew install cliflow

# Or in one command
brew install adnankoroth/cliflow/cliflow
```

## Formula Features

The formula includes:

- **Main CLI**: `cliflow` command
- **Daemon**: `cliflow-daemon` for background service
- **Shell Integration**: Installed to `$(brew --prefix)/share/cliflow/`
- **Brew Services**: `brew services start cliflow` for auto-start
- **Completions**: Native bash and zsh completions

## Testing Locally

```bash
# Test the formula before publishing
brew install --build-from-source ./cliflow.rb

# Or audit it
brew audit --strict ./cliflow.rb

# Test it
brew test ./cliflow.rb
```

## Releasing New Versions

1. Create a new release tag on GitHub
2. Get the SHA256 of the tarball:
   ```bash
   curl -fsSL https://github.com/adnankoroth/cliflow/archive/refs/tags/vX.Y.Z.tar.gz | shasum -a 256
   ```
3. Update `Formula/cliflow.rb` in your tap repo:
   - Update `url` with new version
   - Update `sha256` with new hash
4. Commit and push to tap repo
5. Users will get the update with `brew upgrade cliflow`

## Cask Alternative (for Binary Distribution)

If you build standalone binaries, you can also create a Cask:

```ruby
# Formula/cliflow.rb (Cask version)
cask "cliflow" do
  version "1.0.0"
  sha256 arm: "ARM64_SHA256",
         intel: "X64_SHA256"

  on_arm do
    url "https://github.com/adnankoroth/cliflow/releases/download/v#{version}/cliflow-macos-arm64.tar.gz"
  end
  on_intel do
    url "https://github.com/adnankoroth/cliflow/releases/download/v#{version}/cliflow-macos-x64.tar.gz"
  end

  name "CLIFlow"
  desc "IDE-style terminal autocompletion"
  homepage "https://github.com/adnankoroth/cliflow"

  binary "cliflow"

  postflight do
    system_command "#{staged_path}/cliflow", args: ["setup"]
  end
end
```
