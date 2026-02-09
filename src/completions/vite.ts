// vite - Vite dev server and build tool
import { CompletionSpec } from '../types.js';

export const viteSpec: CompletionSpec = {
  name: 'vite',
  description: 'Vite dev server and build tool',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: ['-c', '--config'], description: 'Path to config', args: { name: 'file', template: 'filepaths' } },
    { name: ['-l', '--logLevel'], description: 'Log level', args: { name: 'level', suggestions: [{ name: 'info' }, { name: 'warn' }, { name: 'error' }, { name: 'silent' }] } },
  ],
  subcommands: [
    { name: 'dev', description: 'Start dev server', options: [{ name: ['-p', '--port'], description: 'Port', args: { name: 'port' } }, { name: ['-H', '--host'], description: 'Host', args: { name: 'host', isOptional: true } }, { name: '--open', description: 'Open browser' }] },
    { name: 'build', description: 'Build for production', options: [{ name: '--mode', description: 'Mode', args: { name: 'mode' } }, { name: '--outDir', description: 'Output directory', args: { name: 'dir', template: 'folders' } }, { name: '--sourcemap', description: 'Generate sourcemaps', args: { name: 'bool', isOptional: true } }] },
    { name: 'preview', description: 'Preview build', options: [{ name: ['-p', '--port'], description: 'Port', args: { name: 'port' } }, { name: ['-H', '--host'], description: 'Host', args: { name: 'host', isOptional: true } }, { name: '--open', description: 'Open browser' }] },
    { name: 'optimize', description: 'Optimize dependencies' },
  ],
};
