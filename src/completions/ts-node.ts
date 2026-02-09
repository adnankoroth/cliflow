// ts-node - TypeScript execution engine
import { CompletionSpec } from '../types.js';

export const tsNodeSpec: CompletionSpec = {
  name: 'ts-node',
  description: 'TypeScript execution engine',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: ['-P', '--project'], description: 'Path to tsconfig', args: { name: 'file', template: 'filepaths' } },
    { name: ['-T', '--transpile-only'], description: 'Transpile only' },
    { name: ['-r', '--require'], description: 'Require module', args: { name: 'module' } },
    { name: ['-e', '--eval'], description: 'Evaluate code', args: { name: 'code' } },
  ],
  args: [{ name: 'script', description: 'Script to run', template: 'filepaths', isOptional: true }, { name: 'args', isOptional: true, isVariadic: true }],
};
