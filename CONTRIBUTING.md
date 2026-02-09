# Contributing to CLIFlow

Thank you for your interest in contributing to CLIFlow! This document provides guidelines for contributing.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/adnankoroth/cliflow.git
cd cliflow

# Install dependencies
npm install

# Build
npm run build

# Run the daemon in development
node build/daemon/server.js start
```

### Project Structure

```
cliflow/
├── src/                    # Main source code
│   ├── cli.ts              # CLI commands
│   ├── index.ts            # Core exports
│   ├── types.ts            # TypeScript types
│   ├── completions/        # Built-in completion specs
│   │   ├── specs/          # Individual command specs
│   │   └── community/      # Community-contributed specs
│   └── engine/             # Completion engine
│       ├── completion-engine.ts  # Main engine
│       └── fig-helpers.ts        # Fig spec compatibility
├── daemon/                 # Background daemon
│   ├── server.ts           # Unix socket server
│   └── history.ts          # Shell history integration
├── shell-integration/      # Shell integration scripts
│   ├── cliflow.zsh         # Zsh integration
│   └── cliflow.bash        # Bash integration
├── bin/                    # CLI binary entry point
├── build/                  # Compiled output
├── scripts/                # Build and release scripts
└── packaging/              # Distribution packaging
    └── homebrew/           # Homebrew formula
```

## Development Workflow

### Building

```bash
# Full build
npm run build

# Clean build
npm run clean && npm run build

# Type checking without emit
npm run lint
```

### Testing

```bash
# Test completions interactively
npm test

# Test a specific command
node build/bin/cliflow.js test "git ch"

# Check daemon status
node build/cli.js status
```

### Running the Daemon

```bash
# Start daemon
node build/daemon/server.js start

# Restart daemon (useful during development)
pkill -f "node.*server.js" && node build/daemon/server.js start
```

## Making Changes

### Code Style

- Use TypeScript with strict mode
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Use meaningful variable names

### Commit Messages

Use conventional commit format:

```
type(scope): description

feat(engine): add fuzzy matching for subcommands
fix(daemon): handle socket connection errors
docs(readme): update installation instructions
chore(deps): update dependencies
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push and create a PR

## Adding Command Specs

### Built-in Specs

For popular commands (>1000 GitHub stars), add to `src/completions/specs/`:

```typescript
// src/completions/specs/mytool.ts
import { Spec } from '../types.js';

const spec: Spec = {
  name: 'mytool',
  description: 'Description of the tool',
  subcommands: [
    {
      name: 'subcommand',
      description: 'What it does',
      options: [
        {
          name: ['--option', '-o'],
          description: 'Option description'
        }
      ]
    }
  ]
};

export default spec;
```

### Community Specs

Community specs go in `src/completions/community/`. They follow the same format.

## Shell Integration Development

### Testing Zsh Integration

```bash
# Source the integration script
source shell-integration/cliflow.zsh

# Test completions
git <Tab>
```

### Testing Bash Integration

```bash
# Requires Bash 4.0+
source shell-integration/cliflow.bash

# Test completions
git <Tab>
```

## Reporting Issues

Please include:

1. CLIFlow version (`cliflow --version`)
2. OS and shell version
3. Steps to reproduce
4. Expected vs actual behavior
5. Relevant logs (`cliflow logs`)

## Code of Conduct

Be respectful and inclusive. We're all here to make terminal life better.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
