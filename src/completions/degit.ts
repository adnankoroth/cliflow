// degit - Project scaffolding tool
import { CompletionSpec } from '../types.js';

export const degitSpec: CompletionSpec = {
  name: 'degit',
  description: 'Create projects from git repositories',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--verbose'], description: 'Verbose output' },
    { name: ['-f', '--force'], description: 'Overwrite destination' },
    { name: ['-c', '--cache'], description: 'Use cache', args: { name: 'mode', isOptional: true } },
  ],
  args: [{ name: 'repo', description: 'Repository', isOptional: true }, { name: 'dest', description: 'Destination', isOptional: true }],
};
