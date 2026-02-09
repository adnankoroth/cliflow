// pulumi - Infrastructure as code
import { CompletionSpec } from '../types.js';

export const pulumiSpec: CompletionSpec = {
  name: 'pulumi',
  description: 'Pulumi CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--verbose'], description: 'Verbose output' },
    { name: ['-C', '--cwd'], description: 'Working directory', args: { name: 'dir', template: 'folders' } },
  ],
  subcommands: [
    { name: 'new', description: 'Create a new project', args: { name: 'template', isOptional: true } },
    { name: 'stack', description: 'Manage stacks', subcommands: [
      { name: 'init', description: 'Initialize stack', args: { name: 'name' } },
      { name: 'select', description: 'Select stack', args: { name: 'name' } },
      { name: 'ls', description: 'List stacks' },
      { name: 'rm', description: 'Remove stack', args: { name: 'name' } },
      { name: 'export', description: 'Export stack state', args: { name: 'file', template: 'filepaths', isOptional: true } },
      { name: 'import', description: 'Import stack state', args: { name: 'file', template: 'filepaths' } },
    ] },
    { name: 'up', description: 'Deploy changes', options: [{ name: ['-y', '--yes'], description: 'Auto-approve' }] },
    { name: 'preview', description: 'Preview changes' },
    { name: 'destroy', description: 'Destroy stack', options: [{ name: ['-y', '--yes'], description: 'Auto-approve' }] },
    { name: 'config', description: 'Manage config', subcommands: [
      { name: 'set', description: 'Set config', args: [{ name: 'key' }, { name: 'value', isOptional: true }] },
      { name: 'get', description: 'Get config', args: { name: 'key' } },
      { name: 'rm', description: 'Remove config', args: { name: 'key' } },
      { name: 'list', description: 'List config' },
    ] },
    { name: 'login', description: 'Login to Pulumi' },
    { name: 'logout', description: 'Logout' },
  ],
};
