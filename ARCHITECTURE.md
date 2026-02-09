# CLIFlow - Open Source Fig.io Alternative

## Vision
An IDE-like autocomplete experience for the terminal. No AI, no cloud dependencies - just fast, beautiful completions.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Terminal Emulator                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ $ aws s3 cp                                                 ││
│  │        ┌──────────────────────────────┐                     ││
│  │        │ 📁 s3://bucket-name/         │  ← Floating UI      ││
│  │        │ 📄 ./local-file.txt          │                     ││
│  │        │ 🔧 --recursive                │                     ││
│  │        │ 🔧 --exclude                  │                     ││
│  │        └──────────────────────────────┘                     ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Shell Integration (`shell-integration/`)
Hooks into zsh/bash/fish to:
- Intercept TAB key and other triggers
- Read current command line buffer
- Send completion requests to daemon
- Receive and apply selected completion

### 2. Completion Daemon (`daemon/`)
Background process that:
- Receives completion requests via Unix socket
- Loads and caches completion specs
- Runs generators (git branches, file lists, etc.)
- Returns ranked suggestions

### 3. UI Renderer (`ui/`)
Displays the popup:
- **Option A**: Native macOS (Swift) - Best UX, macOS only
- **Option B**: Electron - Cross-platform, heavier
- **Option C**: Terminal UI (blessed/ink) - Pure terminal, limited icons

### 4. Completion Specs (`src/completions/`)
Already built! 78 tools with subcommands, options, and generators.

## Data Flow

```
User types "git ch" + TAB
        │
        ▼
┌───────────────────┐
│ Shell Integration │  (zsh widget intercepts)
└────────┬──────────┘
         │ Unix Socket
         ▼
┌───────────────────┐
│ Completion Daemon │  (matches specs, runs generators)
└────────┬──────────┘
         │ JSON response
         ▼
┌───────────────────┐
│    UI Renderer    │  (shows popup at cursor)
└────────┬──────────┘
         │ User selects
         ▼
┌───────────────────┐
│ Shell Integration │  (inserts completion)
└───────────────────┘
```

## Implementation Plan

### Phase 1: Core Daemon (Week 1)
- [ ] Unix socket server
- [ ] Spec loading and caching
- [ ] Basic matching algorithm
- [ ] Generator execution

### Phase 2: Shell Integration (Week 2)
- [ ] Zsh integration (primary)
- [ ] Bash integration
- [ ] Fish integration
- [ ] Cursor position tracking

### Phase 3: UI Layer (Week 3-4)
- [ ] Terminal UI prototype (ink/blessed)
- [ ] Icon rendering
- [ ] Keyboard navigation
- [ ] Scroll support

### Phase 4: Native UI (Optional, Week 5+)
- [ ] Swift macOS app
- [ ] Accessibility permissions
- [ ] Terminal emulator detection

## File Structure

```
cliflow/
├── src/
│   ├── completions/       # Existing specs (78 tools)
│   ├── engine/            # Existing completion engine
│   └── types.ts           # Type definitions
├── daemon/
│   ├── server.ts          # Unix socket server
│   ├── matcher.ts         # Fuzzy matching
│   └── generator-runner.ts
├── shell-integration/
│   ├── cliflow.zsh        # Zsh widget
│   ├── cliflow.bash       # Bash integration
│   └── cliflow.fish       # Fish integration
├── ui/
│   ├── terminal/          # Terminal UI (ink)
│   │   ├── App.tsx
│   │   ├── Dropdown.tsx
│   │   └── SuggestionItem.tsx
│   └── native/            # Future: Swift app
├── bin/
│   └── cliflow            # CLI entry point
└── package.json
```

## Installation (Target)

```bash
# Install
npm install -g cliflow

# Setup shell integration
cliflow setup

# Start daemon
cliflow daemon start

# That's it! Start typing in your terminal
```

## Key Differences from Fig.io

| Feature | Fig.io | CLIFlow |
|---------|--------|---------|
| AI Integration | Yes (Amazon Q) | No |
| Cloud Dependency | Yes | No |
| Open Source | Partial | Full |
| Spec Format | Fig.Spec | Compatible adapter |
| Platform | macOS | macOS, Linux, WSL |
| Price | Freemium | Free |

## Technical Decisions

### Why Unix Socket?
- Fast IPC (no network overhead)
- Secure (file permissions)
- Works across all shells

### Why TypeScript/Node?
- Existing codebase
- Fast prototyping
- Easy JSON handling
- Ink for terminal UI

### Future: Native UI
For the best UX, a native Swift app would be ideal:
- Accessibility API for cursor position
- Native rendering (no electron overhead)
- System tray integration
