// hugo - Static site generator
import { CompletionSpec } from '../types.js';

export const hugoSpec: CompletionSpec = {
  name: 'hugo',
  description: 'Static site generator',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--verbose'], description: 'Verbose output' },
    { name: '--config', description: 'Config file', args: { name: 'file', template: 'filepaths' } },
    { name: '--environment', description: 'Environment', args: { name: 'env' } },
  ],
  subcommands: [
    { name: 'new', description: 'Create new content', args: { name: 'path' } },
    { name: 'new-site', description: 'Create a new site', args: { name: 'path', template: 'folders' } },
    { name: 'server', description: 'Start server', options: [{ name: ['-D', '--buildDrafts'], description: 'Include drafts' }, { name: ['-p', '--port'], description: 'Port', args: { name: 'port' } }, { name: ['-b', '--baseURL'], description: 'Base URL', args: { name: 'url' } }] },
    { name: 'build', description: 'Build the site', options: [{ name: ['-d', '--destination'], description: 'Output directory', args: { name: 'dir', template: 'folders' } }] },
    { name: 'list', description: 'List content', subcommands: [{ name: 'all', description: 'List all content' }, { name: 'drafts', description: 'List drafts' }, { name: 'future', description: 'List future content' }, { name: 'expired', description: 'List expired content' }] },
    { name: 'config', description: 'Print config' },
  ],
};
