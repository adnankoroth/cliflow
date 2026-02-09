// amplify - AWS Amplify CLI
import { CompletionSpec } from '../types.js';

export const amplifySpec: CompletionSpec = {
  name: 'amplify',
  description: 'AWS Amplify CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: '--yes', description: 'Use defaults' },
  ],
  subcommands: [
    { name: 'init', description: 'Initialize a new Amplify project' },
    { name: 'configure', description: 'Configure Amplify CLI' },
    { name: 'add', description: 'Add a resource', args: { name: 'category', isOptional: true } },
    { name: 'update', description: 'Update a resource', args: { name: 'category', isOptional: true } },
    { name: 'remove', description: 'Remove a resource', args: { name: 'category', isOptional: true } },
    { name: 'push', description: 'Push resources to the cloud' },
    { name: 'pull', description: 'Pull backend environment' },
    { name: 'publish', description: 'Publish updates' },
    { name: 'status', description: 'Show project status' },
    { name: 'console', description: 'Open Amplify console' },
    { name: 'delete', description: 'Delete Amplify project' },
    {
      name: 'env',
      description: 'Manage environments',
      subcommands: [
        { name: 'add', description: 'Add environment', args: { name: 'name', isOptional: true } },
        { name: 'checkout', description: 'Checkout environment', args: { name: 'name' } },
        { name: 'list', description: 'List environments' },
        { name: 'remove', description: 'Remove environment', args: { name: 'name' } },
      ],
    },
  ],
};
