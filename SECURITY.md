# CLIFlow Security Documentation

> **TL;DR**: CLIFlow runs 100% offline, collects zero data, requires no accounts, and can be installed as a standalone binary with no runtime dependencies.

---

## Executive Summary

| Question | Answer |
|----------|--------|
| Does it connect to the internet? | **No** |
| Does it collect any data? | **No** |
| Does it require an account? | **No** |
| Is it open source? | **Yes** (MIT License) |
| Can I audit the code? | **Yes** — [View Source](https://github.com/adnankoroth/cliflow) |
| Does it require npm at runtime? | **No** (standalone binary available) |

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIFlow Security Model                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐    Unix Socket    ┌──────────────┐               │
│   │   Terminal   │◄─────────────────►│    Daemon    │               │
│   │   (User)     │   Local IPC Only  │  (Local)     │               │
│   └──────────────┘                   └──────────────┘               │
│                                             │                        │
│                                             ▼                        │
│                                    ┌──────────────┐                  │
│                                    │  Completion  │                  │
│                                    │    Specs     │                  │
│                                    │   (Local)    │                  │
│                                    └──────────────┘                  │
│                                                                      │
│   ❌ No Internet Connection                                          │
│   ❌ No Cloud Services                                               │
│   ❌ No External APIs                                                │
│   ❌ No Telemetry/Analytics                                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## What CLIFlow Does NOT Do

| Activity | Status | Details |
|----------|--------|---------|
| Network requests | ❌ Never | No HTTP/HTTPS calls, no DNS lookups |
| Telemetry | ❌ Never | No usage tracking, no analytics |
| Data collection | ❌ Never | No personal data, no command history |
| Cloud sync | ❌ Never | No cloud storage, no sync services |
| Account/login | ❌ Never | No authentication required |
| Auto-updates | ❌ Never | Manual updates only |
| Keystroke logging | ❌ Never | Only processes completions on TAB |

---

## What CLIFlow DOES Access

| Resource | Access | Purpose |
|----------|--------|---------|
| `~/.cliflow/` | Read/Write | Configuration and specs storage |
| `~/.zshrc` / `~/.bashrc` | Read | Detect shell integration |
| Unix socket | Read/Write | Local IPC between terminal and daemon |
| Current directory | Read | Context-aware completions |
| Shell commands | Execute | Dynamic completions (e.g., `git branch`) |

### File System Permissions

```
~/.cliflow/
├── cliflow.sock      # Unix socket for local IPC
├── daemon.log        # Daemon logs (local only)
├── daemon.pid        # Daemon process ID
└── specs/            # User's custom completion specs
    └── *.mjs
```

**No access to**:
- User documents
- Browser data
- Credentials/keychains
- Other applications

---

## Installation Security

### Option 1: Standalone Binary (Recommended for Corporate)

**No npm, no Node.js runtime required.**

```bash
# Download
curl -fsSL https://github.com/adnankoroth/cliflow/releases/latest/download/cliflow-macos-arm64.tar.gz -o cliflow.tar.gz

# Verify SHA256 checksum (IMPORTANT)
shasum -a 256 cliflow.tar.gz
# Compare output with checksum on GitHub Releases page

# Install
tar -xzf cliflow.tar.gz
sudo mv cliflow /usr/local/bin/
```

**Why this is secure:**
- Single binary, no external dependencies at runtime
- Verifiable with SHA256 checksum
- No `npm install` = no supply chain risk
- No `node_modules` = smaller attack surface

### Option 2: Homebrew

```bash
brew install adnankoroth/cliflow/cliflow
```

**Security**: Homebrew formulas are public and auditable.

### Option 3: Build from Source

```bash
git clone https://github.com/adnankoroth/cliflow.git
cd cliflow
npm ci --ignore-scripts  # Ignore install scripts
npm audit                # Check for vulnerabilities
npm run build
npm run build:standalone # Create binary
```

---

## Dependency Audit

### Runtime Dependencies (Standalone Binary)

**Zero** — the standalone binary has no runtime dependencies.

### Build Dependencies (for building from source)

| Package | Purpose | Weekly Downloads |
|---------|---------|------------------|
| `ink` | Terminal UI | 1M+ |
| `react` | UI framework | 20M+ |
| `typescript` | Compilation | 50M+ |

All dependencies are well-maintained packages from the npm ecosystem.

### Audit Commands

```bash
# Check for known vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# View dependency tree
npm ls --all
```

---

## Network Verification

You can verify CLIFlow makes no network connections:

### macOS
```bash
# Monitor network activity (run while using cliflow)
sudo lsof -i -P | grep cliflow
# Expected output: (empty - no network connections)

# Or use Little Snitch / LuLu to monitor
```

### Linux
```bash
# Monitor with ss
ss -tunap | grep cliflow
# Expected output: (empty)

# Or use nethogs
sudo nethogs
```

---

## Corporate Deployment Checklist

### For IT/Security Teams

- [ ] **Source Code Review**: Code is open source at [github.com/adnankoroth/cliflow](https://github.com/adnankoroth/cliflow)
- [ ] **Dependency Audit**: Run `npm audit` — no high/critical vulnerabilities
- [ ] **Binary Distribution**: Use standalone binary (no npm runtime)
- [ ] **Checksum Verification**: SHA256 provided for all releases
- [ ] **Network Audit**: Verified zero network connections
- [ ] **Permission Review**: Only accesses `~/.cliflow/` and shell configs
- [ ] **License Review**: MIT License — permissive, no restrictions

### MDM Deployment (Jamf, Kandji, etc.)

1. Download standalone binary from GitHub Releases
2. Verify SHA256 checksum
3. (Optional) Sign with corporate certificate
4. Package as `.pkg` or deploy binary directly
5. Run `cliflow setup` as post-install script

---

## Incident Response

### Reporting Security Issues

**Do NOT open public GitHub issues for security vulnerabilities.**

Email: security@cliflow.dev (or your actual email)

We will:
1. Acknowledge within 48 hours
2. Investigate and fix
3. Release patched version
4. Credit reporter (if desired)

### Known Vulnerabilities

None currently known.

Check [GitHub Security Advisories](https://github.com/adnankoroth/cliflow/security/advisories) for updates.

---

## Comparison with Alternatives

| Feature | CLIFlow | Fig.io (Amazon Q) | Other Tools |
|---------|:-------:|:-----------------:|:-----------:|
| Open Source | ✅ | ❌ | Varies |
| Offline-only | ✅ | ❌ | Varies |
| No telemetry | ✅ | ❌ | Varies |
| No account | ✅ | ❌ | Varies |
| Standalone binary | ✅ | ❌ | Varies |
| Auditable code | ✅ | ❌ | Varies |

---

## FAQ

**Q: Can my company safely allow CLIFlow?**  
A: Yes. It runs offline, collects no data, and is open source. Install the standalone binary for zero npm dependencies.

**Q: Does CLIFlow see my commands?**  
A: Only when you press TAB for completions. It does not log or transmit your commands.

**Q: Can CLIFlow access my credentials?**  
A: No. It has no access to keychains, credential stores, or environment variables beyond what's needed for shell context.

**Q: Is it safe behind a corporate firewall?**  
A: Yes. CLIFlow makes zero network requests, so firewalls have no effect.

**Q: Who maintains CLIFlow?**  
A: [Your name/org]. The code is MIT licensed and open for community contributions.

---

## License

MIT License — use freely in personal and commercial environments.

```
MIT License

Copyright (c) 2024 CLIFlow Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

See [LICENSE](LICENSE) for full text.
