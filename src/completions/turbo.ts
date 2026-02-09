// turbo - Turborepo CLI
import { CompletionSpec } from '../types.js';

export const turboSpec: CompletionSpec = {
  name: 'turbo',
  description: 'Turborepo CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-V', '--version'], description: 'Show version' },
    { name: ['-c', '--config'], description: 'Path to config', args: { name: 'file', template: 'filepaths' } },
  ],
  subcommands: [
    { name: 'run', description: 'Run tasks', args: { name: 'tasks', isVariadic: true } },
    { name: 'lint', description: 'Run lint' },
    { name: 'build', description: 'Run build' },
    { name: 'dev', description: 'Run dev tasks' },
    { name: 'prune', description: 'Create a pruned monorepo', options: [{ name: '--scope', args: { name: 'package' } }, { name: '--docker', description: 'Docker output' }] },
  ],
};
