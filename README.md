# CLIFlow 🚀

**IDE-style terminal autocompletion — 800+ commands, zero cloud dependencies**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![Security](https://img.shields.io/badge/Security-100%25%20Offline-blue)](SECURITY.md)

> **Privacy-first alternative to Fig.io** — all completions run locally, no data ever leaves your machine.

## Why CLIFlow?

| ✅ What CLIFlow Does | ❌ What CLIFlow Doesn't Do |
|---------------------|---------------------------|
| Runs 100% locally | No cloud connections |
| Works offline | No telemetry or analytics |
| Open source (MIT) | No account required |
| Single binary install | No npm runtime needed |
| 800+ command specs | No AI/ML features |

## How CLIFlow Compares

| Feature | CLIFlow | Fig / Amazon Q | zsh-autosuggestions | bash-completion |
|---------|---------|----------------|---------------------|-----------------|
| **Offline** | ✅ 100% | ❌ Cloud-based | ✅ Yes | ✅ Yes |
| **Privacy** | ✅ Zero telemetry | ❌ Telemetry | ✅ Yes | ✅ Yes |
| **Open Source** | ✅ MIT | ❌ Proprietary | ✅ Yes | ✅ Yes |
| **Rich Completions** | ✅ 800+ specs | ✅ Yes | ❌ History only | ⚠️ Basic |
| **Subcommand Args** | ✅ Full support | ✅ Yes | ❌ No | ⚠️ Limited |
| **Cross-shell** | ✅ zsh/bash/fish | ✅ Yes | ❌ zsh only | ❌ bash only |
| **No Account** | ✅ Yes | ❌ Required | ✅ Yes | ✅ Yes |
| **IDE-style UI** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |

**Why not Fig / Amazon Q?**
- Acquired by Amazon, now requires AWS account
- Cloud-based with telemetry
- Not suitable for air-gapped or high-security environments

**Why not zsh-autosuggestions?**
- Only suggests from command history
- No intelligent argument/flag completion

**Why not bash-completion?**
- Basic completions, no descriptions
- Limited to bash shell

**CLIFlow** gives you the best of all worlds: rich IDE-style completions like Fig, but fully offline and open-source like traditional tools.

> 💡 Completion specs powered by the open-source [Fig autocomplete](https://github.com/withfig/autocomplete) project (MIT licensed).

## Security First

```
┌─────────────────────────────────────────────────────────────┐
│  🔒 CLIFlow Security Model                                  │
├─────────────────────────────────────────────────────────────┤
│  ✓ Zero network access - works completely offline          │
│  ✓ No telemetry, analytics, or tracking of any kind        │
│  ✓ No accounts, logins, or cloud sync                      │
│  ✓ Open source - audit the code yourself                   │
│  ✓ Standalone binary - no npm dependencies at runtime      │
│  ✓ SHA256 checksums for all releases                       │
│  ✓ Minimal permissions - only reads shell config           │
└─────────────────────────────────────────────────────────────┘
```

**For IT/Security Teams**: See [SECURITY.md](SECURITY.md) for detailed security documentation.

## Preview

```
$ git ch<TAB>
┌──────────────────────────────────────┐
│ ⚡ checkout      Switch branches      │
│ ⚡ cherry        Find commits yet...  │
│ ⚡ cherry-pick   Apply changes from.. │
└──────────────────────────────────────┘

$ docker <TAB>
┌──────────────────────────────────────┐
│ ⚡ run           Run a command in...  │
│ ⚡ build         Build an image       │
│ ⚡ ps            List containers      │
│ 🔧 --help        Show help            │
└──────────────────────────────────────┘
```

## Installation

### Quick Install (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/adnankoroth/cliflow/main/install.sh | bash
```

This will:
- ✅ Install CLIFlow to `~/.cliflow`
- ✅ Configure your shell (zsh & bash)
- ✅ Set up auto-start daemon
- ✅ Add CLI to your PATH

### macOS (Homebrew)
```bash
# Add the tap (one time)
brew tap adnankoroth/cliflow

# Install
brew install cliflow

# Or in one command
brew install adnankoroth/cliflow/cliflow
```

**Auto-start daemon with brew services:**
```bash
brew services start cliflow
```

### macOS/Linux (Standalone Binary)

No Node.js or npm required — single binary download:

```bash
# macOS Apple Silicon (M1/M2/M3)
curl -fsSL https://github.com/adnankoroth/cliflow/releases/latest/download/cliflow-macos-arm64.tar.gz -o cliflow.tar.gz

# macOS Intel
curl -fsSL https://github.com/adnankoroth/cliflow/releases/latest/download/cliflow-macos-x64.tar.gz -o cliflow.tar.gz

# Linux x64
curl -fsSL https://github.com/adnankoroth/cliflow/releases/latest/download/cliflow-linux-x64.tar.gz -o cliflow.tar.gz
```

**Verify the download** (recommended):
```bash
# Check SHA256 - compare with value on Releases page
shasum -a 256 cliflow.tar.gz
```

**Install**:
```bash
tar -xzf cliflow.tar.gz
sudo mv cliflow /usr/local/bin/
cliflow setup
source ~/.zshrc  # or restart terminal
cliflow daemon start
```

### Verify Installation
```bash
cliflow status        # Check everything is working
cliflow test "git "   # Test completions
```

### Uninstall
```bash
curl -fsSL https://raw.githubusercontent.com/adnankoroth/cliflow/main/scripts/uninstall.sh | bash
```

## CLI Commands

```bash
# Status and management
cliflow status           # Show installation status
cliflow start            # Start the daemon
cliflow stop             # Stop the daemon  
cliflow restart          # Restart the daemon
cliflow enable           # Enable completions
cliflow disable          # Temporarily disable
cliflow logs             # View daemon logs
cliflow logs -f          # Follow daemon logs

# Setup and troubleshooting
cliflow setup            # Configure shell integration
cliflow repair           # Diagnose and fix issues
cliflow repair --fix       # Auto-fix issues
cliflow test "git ch"      # Test completions
cliflow specs list         # List built-in specs
cliflow specs community    # List community specs
```

## Supported Commands (794 total)

### Built-in Specs (78)
`git`, `docker`, `kubectl`, `helm`, `terraform`, `aws`, `gcloud`, `npm`, `yarn`, `cargo`, `go`, `pip`, `psql`, `mysql`, `redis-cli`, and 60+ more.

### Community Specs (716)
`brew`, `apt`, `jq`, `fzf`, `bat`, `rg`, `fd`, `vercel`, `netlify`, `heroku`, and 700+ more.

## Custom Completions

Create specs for your own tools:

```bash
cliflow specs create my-tool
# Edit ~/.cliflow/specs/my-tool.mjs
```

```javascript
export const spec = {
  name: 'my-tool',
  description: 'My custom CLI',
  subcommands: [
    { name: 'deploy', description: 'Deploy to production' },
    { name: 'status', description: 'Show status' }
  ]
};
```

## Requirements

- macOS or Linux
- Zsh, Bash, or Fish shell
- ~50MB disk space

## FAQ

**Q: Does CLIFlow require an internet connection?**  
A: No. CLIFlow works 100% offline. No network requests are ever made.

**Q: Does CLIFlow collect any data?**  
A: No. There is no telemetry, analytics, or tracking. Zero data leaves your machine.

**Q: Is CLIFlow safe for corporate environments?**  
A: Yes. It's open source (MIT), runs offline, requires no accounts, and can be installed as a standalone binary with no npm runtime dependencies. See [SECURITY.md](SECURITY.md).

**Q: How is this different from Fig.io?**  
A: Fig.io (now Amazon Q) was closed-source with cloud features. CLIFlow is fully open-source, runs offline, and has no AI/cloud components.

## Troubleshooting

```bash
cliflow repair           # Diagnose all issues
cliflow repair --fix     # Auto-fix common problems
cat ~/.cliflow/daemon.log  # Check daemon logs
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License — see [LICENSE](LICENSE).