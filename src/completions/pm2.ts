// pm2 - Process manager for Node.js
import { CompletionSpec } from '../types.js';

export const pm2Spec: CompletionSpec = {
  name: 'pm2',
  description: 'Process manager for Node.js',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'start', description: 'Start an app', args: { name: 'script', isOptional: true } },
    { name: 'stop', description: 'Stop an app', args: { name: 'app', isOptional: true } },
    { name: 'restart', description: 'Restart an app', args: { name: 'app', isOptional: true } },
    { name: 'reload', description: 'Reload an app', args: { name: 'app', isOptional: true } },
    { name: 'delete', description: 'Delete an app', args: { name: 'app', isOptional: true } },
    { name: 'list', description: 'List processes' },
    { name: 'status', description: 'Show status' },
    { name: 'logs', description: 'Show logs', args: { name: 'app', isOptional: true } },
    { name: 'monit', description: 'Monitor processes' },
    { name: 'save', description: 'Save process list' },
    { name: 'resurrect', description: 'Restore process list' },
    { name: 'startup', description: 'Generate startup script' },
    { name: 'ecosystem', description: 'Generate ecosystem file' },
  ],
};
