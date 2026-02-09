// fnm - Fast Node Manager
import { CompletionSpec } from '../types.js';

export const fnmSpec: CompletionSpec = {
  name: 'fnm',
  description: 'Fast Node Manager',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'install', description: 'Install Node version', args: { name: 'version', isOptional: true } },
    { name: 'use', description: 'Use Node version', args: { name: 'version' } },
    { name: 'list', description: 'List installed versions' },
    { name: 'list-remote', description: 'List remote versions' },
    { name: 'current', description: 'Show current version' },
    { name: 'default', description: 'Set default version', args: { name: 'version' } },
    { name: 'env', description: 'Print env variables', options: [{ name: '--shell', description: 'Shell', args: { name: 'shell', suggestions: [{ name: 'bash' }, { name: 'zsh' }, { name: 'fish' }] } }] },
    { name: 'completions', description: 'Generate completions', args: { name: 'shell', suggestions: [{ name: 'bash' }, { name: 'zsh' }, { name: 'fish' }] } },
  ],
};
