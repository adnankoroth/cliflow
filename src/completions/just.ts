// just - Command runner
import { CompletionSpec } from '../types.js';

export const justSpec: CompletionSpec = {
  name: 'just',
  description: 'Command runner',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: ['-f', '--justfile'], description: 'Justfile path', args: { name: 'file', template: 'filepaths' } },
    { name: ['-d', '--working-directory'], description: 'Working directory', args: { name: 'dir', template: 'folders' } },
    { name: '--list', description: 'List recipes' },
    { name: '--summary', description: 'List summary' },
    { name: '--show', description: 'Show recipe', args: { name: 'recipe' } },
  ],
  args: [{ name: 'recipe', isOptional: true }, { name: 'args', isOptional: true, isVariadic: true }],
};
