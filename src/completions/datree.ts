// datree - Kubernetes policy enforcement
import { CompletionSpec } from '../types.js';

export const datreeSpec: CompletionSpec = {
  name: 'datree',
  description: 'Kubernetes policy enforcement',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'test', description: 'Test YAML against policies', args: { name: 'file', template: 'filepaths', isOptional: true } },
    { name: 'config', description: 'Configure datree' },
    { name: 'policy', description: 'Manage policies' },
  ],
};
