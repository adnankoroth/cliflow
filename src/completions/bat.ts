// bat - A cat clone with syntax highlighting
import { CompletionSpec } from '../types.js';

export const batSpec: CompletionSpec = {
  name: 'bat',
  description: 'Cat clone with syntax highlighting',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-V', '--version'], description: 'Show version' },
    { name: ['-n', '--number'], description: 'Number lines' },
    { name: ['-p', '--plain'], description: 'Plain output' },
    { name: ['-A', '--show-all'], description: 'Show all characters' },
    { name: ['-l', '--language'], description: 'Language', args: { name: 'lang' } },
    { name: ['-t', '--theme'], description: 'Theme', args: { name: 'theme' } },
    { name: ['-H', '--highlight-line'], description: 'Highlight lines', args: { name: 'lines' } },
  ],
  args: { name: 'files', description: 'Files to read', template: 'filepaths', isOptional: true, isVariadic: true },
};
