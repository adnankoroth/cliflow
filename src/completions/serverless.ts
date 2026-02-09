// serverless - Serverless Framework CLI
import { CompletionSpec } from '../types.js';

export const serverlessSpec: CompletionSpec = {
  name: 'serverless',
  description: 'Serverless Framework CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: ['-c', '--config'], description: 'Config file', args: { name: 'file', template: 'filepaths' } },
    { name: ['-s', '--stage'], description: 'Stage', args: { name: 'stage' } },
    { name: ['-r', '--region'], description: 'Region', args: { name: 'region' } },
  ],
  subcommands: [
    { name: 'deploy', description: 'Deploy service', options: [{ name: '--conceal', description: 'Conceal output' }, { name: '--package', description: 'Package directory', args: { name: 'dir', template: 'folders' } }] },
    { name: 'remove', description: 'Remove service' },
    { name: 'info', description: 'Display info' },
    { name: 'logs', description: 'Fetch logs', options: [{ name: ['-f', '--function'], description: 'Function name', args: { name: 'name' } }, { name: ['-t', '--tail'], description: 'Tail logs' }] },
    { name: 'invoke', description: 'Invoke function', options: [{ name: ['-f', '--function'], description: 'Function name', args: { name: 'name' } }, { name: ['-p', '--path'], description: 'Path to data', args: { name: 'file', template: 'filepaths' } }] },
    { name: 'package', description: 'Package service' },
    { name: 'plugin', description: 'Manage plugins', subcommands: [
      { name: 'list', description: 'List plugins' },
      { name: 'install', description: 'Install plugin', args: { name: 'name' } },
      { name: 'uninstall', description: 'Uninstall plugin', args: { name: 'name' } },
    ] },
  ],
};
