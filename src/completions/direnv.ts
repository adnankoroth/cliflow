// direnv - Directory-based environment manager
import { CompletionSpec } from '../types.js';

export const direnvSpec: CompletionSpec = {
  name: 'direnv',
  description: 'Directory-based environment manager',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
  ],
  subcommands: [
    { name: 'allow', description: 'Allow .envrc in dir', args: { name: 'path', template: 'folders', isOptional: true } },
    { name: 'deny', description: 'Deny .envrc in dir', args: { name: 'path', template: 'folders', isOptional: true } },
    { name: 'edit', description: 'Edit .envrc', args: { name: 'path', template: 'folders', isOptional: true } },
    { name: 'exec', description: 'Exec command', args: { name: 'dir', template: 'folders' } },
    { name: 'reload', description: 'Reload env' },
    { name: 'status', description: 'Show status' },
    { name: 'export', description: 'Export env', args: { name: 'shell', suggestions: [{ name: 'bash' }, { name: 'zsh' }, { name: 'fish' }] } },
    { name: 'hook', description: 'Shell hook', args: { name: 'shell', suggestions: [{ name: 'bash' }, { name: 'zsh' }, { name: 'fish' }] } },
  ],
};
