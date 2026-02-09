// asdf - Extendable version manager
import { CompletionSpec } from '../types.js';

export const asdfSpec: CompletionSpec = {
  name: 'asdf',
  description: 'Extendable version manager',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'plugin-add', description: 'Add a plugin', args: [{ name: 'name' }, { name: 'repo', isOptional: true }] },
    { name: 'plugin-remove', description: 'Remove a plugin', args: { name: 'name' } },
    { name: 'plugin-list', description: 'List plugins' },
    { name: 'list', description: 'List installed versions', args: { name: 'name', isOptional: true } },
    { name: 'list-all', description: 'List all available versions', args: { name: 'name' } },
    { name: 'install', description: 'Install a version', args: [{ name: 'name' }, { name: 'version', isOptional: true }] },
    { name: 'uninstall', description: 'Uninstall a version', args: [{ name: 'name' }, { name: 'version', isOptional: true }] },
    { name: 'current', description: 'Show current version', args: { name: 'name', isOptional: true } },
    { name: 'global', description: 'Set global version', args: [{ name: 'name' }, { name: 'version' }] },
    { name: 'local', description: 'Set local version', args: [{ name: 'name' }, { name: 'version' }] },
    { name: 'reshim', description: 'Reshim executables', args: { name: 'name', isOptional: true } },
  ],
};
