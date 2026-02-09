// k3d - Kubernetes in Docker
import { CompletionSpec } from '../types.js';

export const k3dSpec: CompletionSpec = {
  name: 'k3d',
  description: 'K3s in Docker',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
  ],
  subcommands: [
    { name: 'cluster', description: 'Manage clusters', subcommands: [
      { name: 'create', description: 'Create a cluster', args: { name: 'name', isOptional: true } },
      { name: 'delete', description: 'Delete a cluster', args: { name: 'name', isOptional: true } },
      { name: 'list', description: 'List clusters' },
      { name: 'start', description: 'Start a cluster', args: { name: 'name', isOptional: true } },
      { name: 'stop', description: 'Stop a cluster', args: { name: 'name', isOptional: true } },
    ] },
    { name: 'node', description: 'Manage nodes', subcommands: [
      { name: 'create', description: 'Create node', args: { name: 'name', isOptional: true } },
      { name: 'delete', description: 'Delete node', args: { name: 'name', isOptional: true } },
      { name: 'list', description: 'List nodes' },
    ] },
    { name: 'kubeconfig', description: 'Manage kubeconfig', subcommands: [
      { name: 'get', description: 'Get kubeconfig', args: { name: 'name', isOptional: true } },
      { name: 'merge', description: 'Merge kubeconfig', args: { name: 'name', isOptional: true } },
      { name: 'write', description: 'Write kubeconfig', args: { name: 'name', isOptional: true } },
    ] },
  ],
};
