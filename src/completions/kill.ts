// kill - Terminate processes
import { CompletionSpec } from '../types.js';

export const killSpec: CompletionSpec = {
  name: 'kill',
  description: 'Send signals to processes',
  options: [
    { name: ['-s', '--signal'], description: 'Signal name or number', args: { name: 'signal' } },
    { name: ['-l', '--list'], description: 'List signals', args: { name: 'signal', isOptional: true } },
    { name: ['-q', '--queue'], description: 'Queue signal with value', args: { name: 'value' } },
  ],
  args: { name: 'pids', description: 'Process IDs', isVariadic: true },
};
