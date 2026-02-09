// eslint - JavaScript/TypeScript linter
import { CompletionSpec } from '../types.js';

export const eslintSpec: CompletionSpec = {
  name: 'eslint',
  description: 'Lint JavaScript/TypeScript code',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: ['-c', '--config'], description: 'Use configuration file', args: { name: 'file', template: 'filepaths' } },
    { name: ['-f', '--format'], description: 'Use a specific output format', args: { name: 'format' } },
    { name: '--fix', description: 'Automatically fix problems' },
    { name: '--fix-dry-run', description: 'Fix without writing to disk' },
    { name: '--max-warnings', description: 'Number of warnings to trigger nonzero exit', args: { name: 'n' } },
    { name: '--quiet', description: 'Report errors only' },
    { name: '--ext', description: 'Specify file extensions', args: { name: 'extensions' } },
    { name: '--ignore-path', description: 'Specify ignore file', args: { name: 'file', template: 'filepaths' } },
    { name: '--no-ignore', description: 'Disable ignore files' },
    { name: '--cache', description: 'Enable caching' },
    { name: '--cache-location', description: 'Cache location', args: { name: 'file', template: 'filepaths' } },
    { name: '--stdin', description: 'Lint text from stdin' },
    { name: '--stdin-filename', description: 'Filename for stdin input', args: { name: 'file' } },
  ],
  args: { name: 'files', description: 'Files or directories', template: 'filepaths', isOptional: true, isVariadic: true },
};
