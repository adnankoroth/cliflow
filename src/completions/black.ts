// black - Python formatter
import { CompletionSpec } from '../types.js';

export const blackSpec: CompletionSpec = {
  name: 'black',
  description: 'Python code formatter',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-V', '--version'], description: 'Show version' },
    { name: ['-l', '--line-length'], description: 'Line length', args: { name: 'length' } },
    { name: ['-S', '--skip-string-normalization'], description: 'Skip string normalization' },
    { name: ['-C', '--check'], description: 'Check formatting only' },
    { name: ['-D', '--diff'], description: 'Show diff' },
    { name: ['-q', '--quiet'], description: 'Quiet output' },
    { name: '--include', description: 'Include regex', args: { name: 'regex' } },
    { name: '--exclude', description: 'Exclude regex', args: { name: 'regex' } },
    { name: '--force-exclude', description: 'Force exclude regex', args: { name: 'regex' } },
  ],
  args: { name: 'paths', description: 'Files or directories', template: 'filepaths', isOptional: true, isVariadic: true },
};
