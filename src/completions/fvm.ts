// fvm - Flutter Version Management
import { CompletionSpec } from '../types.js';

export const fvmSpec: CompletionSpec = {
  name: 'fvm',
  description: 'Flutter Version Management',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'install', description: 'Install Flutter version', args: { name: 'version', isOptional: true } },
    { name: 'use', description: 'Use Flutter version', args: { name: 'version' } },
    { name: 'list', description: 'List installed versions' },
    { name: 'releases', description: 'List available releases' },
    { name: 'remove', description: 'Remove a version', args: { name: 'version' } },
    { name: 'global', description: 'Set global version', args: { name: 'version' } },
    { name: 'spawn', description: 'Run command with version', args: { name: 'command', isVariadic: true } },
  ],
};
