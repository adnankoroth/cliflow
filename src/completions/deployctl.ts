// deployctl - Deno Deploy CLI
import { CompletionSpec } from '../types.js';

export const deployctlSpec: CompletionSpec = {
  name: 'deployctl',
  description: 'Deno Deploy CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-V', '--version'], description: 'Show version' },
    { name: ['-t', '--token'], description: 'API token', args: { name: 'token' } },
  ],
  subcommands: [
    { name: 'deploy', description: 'Deploy a script', options: [
      { name: ['-p', '--project'], description: 'Project name', args: { name: 'project' } },
      { name: '--prod', description: 'Deploy to production' },
      { name: '--import-map', description: 'Import map file', args: { name: 'file', template: 'filepaths' } },
      { name: '--config', description: 'Config file', args: { name: 'file', template: 'filepaths' } },
    ], args: { name: 'entry', description: 'Entry file', template: 'filepaths' } },
    { name: 'projects', description: 'Manage projects', subcommands: [
      { name: 'list', description: 'List projects' },
      { name: 'create', description: 'Create project', args: { name: 'name' } },
      { name: 'delete', description: 'Delete project', args: { name: 'name' } },
    ] },
    { name: 'login', description: 'Login' },
    { name: 'logout', description: 'Logout' },
  ],
};
