// drush - Drupal shell
import { CompletionSpec } from '../types.js';

export const drushSpec: CompletionSpec = {
  name: 'drush',
  description: 'Drupal shell',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--verbose'], description: 'Verbose output' },
    { name: ['-y', '--yes'], description: 'Assume yes' },
  ],
  subcommands: [
    { name: 'status', description: 'Show status' },
    { name: 'cr', description: 'Rebuild cache' },
    { name: 'updb', description: 'Apply database updates' },
    { name: 'uli', description: 'Generate login link' },
    { name: 'sql-dump', description: 'Dump SQL' },
    { name: 'sql-cli', description: 'Open SQL CLI' },
    { name: 'pm-list', description: 'List modules' },
    { name: 'pm-enable', description: 'Enable module', args: { name: 'module', isVariadic: true } },
    { name: 'pm-disable', description: 'Disable module', args: { name: 'module', isVariadic: true } },
  ],
};
