// rake - Ruby make-like utility
import { CompletionSpec } from '../types.js';

export const rakeSpec: CompletionSpec = {
  name: 'rake',
  description: 'Ruby make-like task runner',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-T', '--tasks'], description: 'List tasks' },
    { name: ['-A', '--all'], description: 'Show all tasks' },
    { name: ['-n', '--dry-run'], description: 'Dry run' },
    { name: ['-f', '--rakefile'], description: 'Use Rakefile', args: { name: 'file', template: 'filepaths' } },
    { name: ['-C', '--directory'], description: 'Change directory', args: { name: 'dir', template: 'folders' } },
  ],
  args: { name: 'tasks', description: 'Tasks to run', isOptional: true, isVariadic: true },
};
