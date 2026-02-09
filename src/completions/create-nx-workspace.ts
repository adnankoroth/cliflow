// create-nx-workspace - Create Nx workspace
import { CompletionSpec } from '../types.js';

export const createNxWorkspaceSpec: CompletionSpec = {
  name: 'create-nx-workspace',
  description: 'Create a new Nx workspace',
  options: [
    { name: ['-p', '--preset'], description: 'Preset', args: { name: 'preset' } },
    { name: '--appName', description: 'App name', args: { name: 'name' } },
    { name: '--style', description: 'Styling', args: { name: 'style' } },
    { name: '--packageManager', description: 'Package manager', args: { name: 'pm', suggestions: [{ name: 'npm' }, { name: 'yarn' }, { name: 'pnpm' }, { name: 'bun' }] } },
    { name: ['-h', '--help'], description: 'Show help' },
  ],
  args: { name: 'workspace-name', description: 'Workspace directory' },
};
