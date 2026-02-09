// create-vite - Create Vite project
import { CompletionSpec } from '../types.js';

export const createViteSpec: CompletionSpec = {
  name: 'create-vite',
  description: 'Create a new Vite project',
  options: [
    { name: ['-t', '--template'], description: 'Project template', args: { name: 'template' } },
    { name: ['-h', '--help'], description: 'Show help' },
  ],
  args: { name: 'project-name', description: 'Project directory', isOptional: true },
};
