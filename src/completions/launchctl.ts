// launchctl - Manage launchd services (macOS)
import { CompletionSpec } from '../types.js';

export const launchctlSpec: CompletionSpec = {
  name: 'launchctl',
  description: 'Manage launchd services',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
  ],
  subcommands: [
    { name: 'list', description: 'List loaded services' },
    { name: 'load', description: 'Load services', args: { name: 'plist', template: 'filepaths', isVariadic: true } },
    { name: 'unload', description: 'Unload services', args: { name: 'plist', template: 'filepaths', isVariadic: true } },
    { name: 'start', description: 'Start a service', args: { name: 'label' } },
    { name: 'stop', description: 'Stop a service', args: { name: 'label' } },
    { name: 'kickstart', description: 'Kickstart a service', args: { name: 'target' } },
    { name: 'bootstrap', description: 'Bootstrap a domain', args: [{ name: 'domain' }, { name: 'service', template: 'filepaths' }] },
    { name: 'bootout', description: 'Remove service', args: [{ name: 'domain' }, { name: 'service', template: 'filepaths' }] },
    { name: 'enable', description: 'Enable service', args: { name: 'target' } },
    { name: 'disable', description: 'Disable service', args: { name: 'target' } },
    { name: 'print', description: 'Print service information', args: { name: 'target' } },
  ],
};
