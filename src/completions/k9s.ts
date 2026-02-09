// k9s - Kubernetes CLI UI
import { CompletionSpec } from '../types.js';

export const k9sSpec: CompletionSpec = {
  name: 'k9s',
  description: 'Kubernetes CLI UI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: ['-A', '--all-namespaces'], description: 'All namespaces' },
    { name: ['-n', '--namespace'], description: 'Namespace', args: { name: 'namespace' } },
    { name: ['-c', '--command'], description: 'Run command on startup', args: { name: 'command' } },
    { name: ['-r', '--readonly'], description: 'Read-only mode' },
    { name: '--log-level', description: 'Log level', args: { name: 'level' } },
    { name: '--log-file', description: 'Log file', args: { name: 'file', template: 'filepaths' } },
    { name: '--kubeconfig', description: 'Kubeconfig', args: { name: 'file', template: 'filepaths' } },
  ],
};
