// dapr - Distributed Application Runtime
import { CompletionSpec } from '../types.js';

export const daprSpec: CompletionSpec = {
  name: 'dapr',
  description: 'Dapr CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'init', description: 'Initialize Dapr' },
    { name: 'uninstall', description: 'Uninstall Dapr' },
    { name: 'run', description: 'Run a Dapr-enabled app', options: [
      { name: '--app-id', description: 'App id', args: { name: 'id' } },
      { name: '--app-port', description: 'App port', args: { name: 'port' } },
      { name: '--dapr-http-port', description: 'Dapr HTTP port', args: { name: 'port' } },
      { name: '--dapr-grpc-port', description: 'Dapr gRPC port', args: { name: 'port' } },
      { name: '--components-path', description: 'Components path', args: { name: 'dir', template: 'folders' } },
      { name: '--config', description: 'Config file', args: { name: 'file', template: 'filepaths' } },
    ], args: { name: 'command', isOptional: true, isVariadic: true } },
    { name: 'status', description: 'Show status' },
    { name: 'dashboard', description: 'Launch dashboard' },
    { name: 'list', description: 'List apps' },
  ],
};
