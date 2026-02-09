// cloudflared - Cloudflare tunnel client
import { CompletionSpec } from '../types.js';

export const cloudflaredSpec: CompletionSpec = {
  name: 'cloudflared',
  description: 'Cloudflare tunnel client',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: '--config', description: 'Config file', args: { name: 'file', template: 'filepaths' } },
  ],
  subcommands: [
    { name: 'tunnel', description: 'Manage tunnels', subcommands: [
      { name: 'login', description: 'Login to Cloudflare' },
      { name: 'create', description: 'Create tunnel', args: { name: 'name' } },
      { name: 'list', description: 'List tunnels' },
      { name: 'run', description: 'Run tunnel', args: { name: 'name' } },
      { name: 'delete', description: 'Delete tunnel', args: { name: 'name' } },
    ] },
    { name: 'access', description: 'Access management', subcommands: [
      { name: 'login', description: 'Login via Access' },
      { name: 'logout', description: 'Logout' },
    ] },
    { name: 'dns', description: 'DNS utilities' },
  ],
};
