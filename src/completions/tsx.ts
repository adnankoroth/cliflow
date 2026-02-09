// tsx - TypeScript execution runtime
import { CompletionSpec } from '../types.js';

export const tsxSpec: CompletionSpec = {
  name: 'tsx',
  description: 'TypeScript execution runtime',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: '--tsconfig', description: 'Path to tsconfig', args: { name: 'file', template: 'filepaths' } },
    { name: '--clear-cache', description: 'Clear cache' },
  ],
  args: [{ name: 'script', description: 'Script to run', template: 'filepaths' }, { name: 'args', isOptional: true, isVariadic: true }],
};
