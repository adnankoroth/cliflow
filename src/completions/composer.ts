// composer - PHP dependency manager
import { CompletionSpec } from '../types.js';

export const composerSpec: CompletionSpec = {
  name: 'composer',
  description: 'PHP dependency manager',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-V', '--version'], description: 'Show version' },
    { name: ['-q', '--quiet'], description: 'Quiet output' },
    { name: ['-v', '--verbose'], description: 'Verbose output' },
  ],
  subcommands: [
    { name: 'install', description: 'Install dependencies' },
    { name: 'update', description: 'Update dependencies' },
    { name: 'require', description: 'Add requirement', args: { name: 'packages', isVariadic: true } },
    { name: 'remove', description: 'Remove dependency', args: { name: 'packages', isVariadic: true } },
    { name: 'create-project', description: 'Create new project', args: [{ name: 'package' }, { name: 'path', isOptional: true }] },
    { name: 'dump-autoload', description: 'Regenerate autoloader' },
    { name: 'run-script', description: 'Run scripts', args: { name: 'script', isOptional: true } },
    { name: 'config', description: 'Set config', args: { name: 'key', isOptional: true } },
    { name: 'global', description: 'Manage global composer', args: { name: 'command', isOptional: true, isVariadic: true } },
  ],
};
