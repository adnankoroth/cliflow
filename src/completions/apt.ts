// apt - Debian package manager
import { CompletionSpec } from '../types.js';

export const aptSpec: CompletionSpec = {
  name: 'apt',
  description: 'Advanced Package Tool',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-y', '--yes'], description: 'Assume yes for prompts' },
    { name: ['-q', '--quiet'], description: 'Quiet output' },
    { name: ['-v', '--verbose'], description: 'Verbose output' },
  ],
  subcommands: [
    { name: 'update', description: 'Update package lists' },
    { name: 'upgrade', description: 'Upgrade packages' },
    { name: 'full-upgrade', description: 'Perform full upgrade' },
    { name: 'install', description: 'Install packages', args: { name: 'packages', isVariadic: true } },
    { name: 'remove', description: 'Remove packages', args: { name: 'packages', isVariadic: true } },
    { name: 'purge', description: 'Purge packages', args: { name: 'packages', isVariadic: true } },
    { name: 'autoremove', description: 'Remove unused packages' },
    { name: 'search', description: 'Search for packages', args: { name: 'pattern' } },
    { name: 'show', description: 'Show package details', args: { name: 'packages', isVariadic: true } },
    { name: 'list', description: 'List packages', args: { name: 'pattern', isOptional: true } },
    { name: 'policy', description: 'Show policy for package', args: { name: 'package', isOptional: true } },
  ],
};
