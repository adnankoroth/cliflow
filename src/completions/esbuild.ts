// esbuild - JavaScript bundler
import { CompletionSpec } from '../types.js';

export const esbuildSpec: CompletionSpec = {
  name: 'esbuild',
  description: 'JavaScript bundler',
  options: [
    { name: '--bundle', description: 'Bundle mode' },
    { name: '--minify', description: 'Minify output' },
    { name: '--sourcemap', description: 'Generate sourcemaps', args: { name: 'mode', isOptional: true } },
    { name: '--watch', description: 'Watch mode', args: { name: 'value', isOptional: true } },
    { name: '--outfile', description: 'Output file', args: { name: 'file', template: 'filepaths' } },
    { name: '--outdir', description: 'Output directory', args: { name: 'dir', template: 'folders' } },
    { name: '--format', description: 'Output format', args: { name: 'format', suggestions: [{ name: 'esm' }, { name: 'cjs' }, { name: 'iife' }] } },
    { name: '--platform', description: 'Target platform', args: { name: 'platform', suggestions: [{ name: 'browser' }, { name: 'node' }, { name: 'neutral' }] } },
    { name: '--target', description: 'Target environment', args: { name: 'target' } },
  ],
  args: { name: 'entryPoints', description: 'Entry points', isVariadic: true, template: 'filepaths' },
};
