// flyctl - Fly.io CLI
import { CompletionSpec } from '../types.js';

export const flyctlSpec: CompletionSpec = {
  name: 'flyctl',
  description: 'Fly.io CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: ['-a', '--app'], description: 'App name', args: { name: 'app' } },
  ],
  subcommands: [
    { name: 'launch', description: 'Create and configure app' },
    { name: 'deploy', description: 'Deploy an app' },
    { name: 'status', description: 'Show app status' },
    { name: 'apps', description: 'Manage apps', subcommands: [
      { name: 'list', description: 'List apps' },
      { name: 'create', description: 'Create app', args: { name: 'name', isOptional: true } },
      { name: 'destroy', description: 'Destroy app', args: { name: 'name', isOptional: true } },
    ] },
    { name: 'secrets', description: 'Manage secrets', subcommands: [
      { name: 'list', description: 'List secrets' },
      { name: 'set', description: 'Set secret', args: { name: 'pairs', isVariadic: true } },
      { name: 'unset', description: 'Unset secret', args: { name: 'keys', isVariadic: true } },
    ] },
    { name: 'volumes', description: 'Manage volumes' },
    { name: 'logs', description: 'Show logs' },
    { name: 'ssh', description: 'SSH commands', subcommands: [
      { name: 'console', description: 'Open console' },
      { name: 'connect', description: 'Connect via SSH' },
    ] },
  ],
};
