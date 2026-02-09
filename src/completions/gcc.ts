// gcc - GNU C Compiler
import { CompletionSpec } from '../types.js';

export const gccSpec: CompletionSpec = {
  name: 'gcc',
  description: 'GNU C Compiler',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: '-c', description: 'Compile only' },
    { name: '-g', description: 'Generate debug info' },
    { name: '-O', description: 'Optimization level', args: { name: 'level', isOptional: true } },
    { name: '-Wall', description: 'Enable all warnings' },
    { name: '-Wextra', description: 'Enable extra warnings' },
    { name: '-std', description: 'Language standard', args: { name: 'standard' } },
    { name: '-I', description: 'Include directory', args: { name: 'dir', template: 'folders' } },
    { name: '-L', description: 'Library directory', args: { name: 'dir', template: 'folders' } },
    { name: '-l', description: 'Link library', args: { name: 'lib' } },
    { name: ['-o', '--output'], description: 'Output file', args: { name: 'file', template: 'filepaths' } },
  ],
  args: { name: 'files', description: 'Source files', template: 'filepaths', isVariadic: true },
};
