# CLIFlow — IT Approval Summary

**One-page summary for IT/Security review**

---

## What is CLIFlow?

A terminal autocompletion tool that suggests commands as you type — like IDE autocomplete but for your terminal.

---

## Security Summary

| Question | Answer |
|----------|--------|
| **Network access?** | ❌ None — works 100% offline |
| **Data collection?** | ❌ None — no telemetry or analytics |
| **Account required?** | ❌ No — no login or signup |
| **Cloud services?** | ❌ None — fully local |
| **Open source?** | ✅ Yes — MIT License |
| **Auditable?** | ✅ Yes — source on GitHub |

---

## Technical Details

| Aspect | Details |
|--------|---------|
| **Language** | TypeScript/JavaScript (compiled) |
| **Runtime** | Standalone binary (no Node.js required) |
| **Platforms** | macOS (Intel/ARM), Linux |
| **Install size** | ~50MB |
| **Memory usage** | ~30-50MB |
| **Permissions** | Read/write `~/.cliflow/` only |

---

## Installation Method

**Recommended: Standalone binary**

```bash
# Download (macOS ARM)
curl -fsSL https://github.com/adnankoroth/cliflow/releases/latest/download/cliflow-macos-arm64.tar.gz -o cliflow.tar.gz

# Verify checksum
shasum -a 256 cliflow.tar.gz

# Install
tar -xzf cliflow.tar.gz && sudo mv cliflow /usr/local/bin/
```

No `npm install` required = no supply chain concerns.

---

## What It Accesses

| Resource | Access | Purpose |
|----------|--------|---------|
| `~/.cliflow/` | Read/Write | Config & specs |
| `~/.zshrc` | Read | Shell integration |
| Unix socket | Local IPC | Terminal ↔ Daemon |

**Does NOT access**: Documents, browser, credentials, other apps.

---

## Verification

```bash
# Verify no network connections
lsof -i -P | grep cliflow
# Expected: (empty output)

# Run built-in diagnostics  
cliflow repair
```

---

## Links

- **Source Code**: https://github.com/adnankoroth/cliflow
- **Security Docs**: https://github.com/adnankoroth/cliflow/blob/main/SECURITY.md
- **License**: MIT (permissive, commercial-friendly)

---

## Approval Recommendation

✅ **Low Risk** — Offline-only, open source, no data collection, standalone binary.

Comparable to: Homebrew packages, standard CLI tools (ripgrep, fzf, bat).
