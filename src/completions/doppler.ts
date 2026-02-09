// doppler - Secrets manager CLI
import { CompletionSpec } from '../types.js';

export const dopplerSpec: CompletionSpec = {
  name: 'doppler',
  description: 'Doppler CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'login', description: 'Login to Doppler' },
    { name: 'logout', description: 'Logout of Doppler' },
    { name: 'setup', description: 'Setup project/config', options: [
      { name: '--project', description: 'Project name', args: { name: 'project' } },
      { name: '--config', description: 'Config name', args: { name: 'config' } },
    ] },
    { name: 'secrets', description: 'Manage secrets', subcommands: [
      { name: 'get', description: 'Get a secret', args: { name: 'name' } },
      { name: 'set', description: 'Set secrets', args: { name: 'pairs', isVariadic: true } },
      { name: 'delete', description: 'Delete secret', args: { name: 'name', isVariadic: true } },
      { name: 'download', description: 'Download secrets', options: [{ name: '--format', args: { name: 'format' } }] },
    ] },
    { name: 'configs', description: 'List configs' },
    { name: 'projects', description: 'List projects' },
    { name: 'run', description: 'Run a command with secrets', args: { name: 'command', isVariadic: true } },
  ],
};
