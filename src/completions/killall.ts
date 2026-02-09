// killall - Kill processes by name
import { CompletionSpec } from '../types.js';

export const killallSpec: CompletionSpec = {
  name: 'killall',
  description: 'Kill processes by name',
  options: [
    { name: ['-s', '--signal'], description: 'Signal name or number', args: { name: 'signal' } },
    { name: ['-u', '--user'], description: 'Match by user', args: { name: 'user' } },
    { name: ['-v', '--verbose'], description: 'Verbose output' },
    { name: ['-q', '--quiet'], description: 'Quiet output' },
    { name: ['-l', '--list'], description: 'List signals' },
  ],
  args: { name: 'names', description: 'Process names', isVariadic: true },
};
