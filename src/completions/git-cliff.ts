// git-cliff - Generate changelogs
import { CompletionSpec } from '../types.js';

export const gitCliffSpec: CompletionSpec = {
  name: 'git-cliff',
  description: 'Generate changelogs from git history',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-V', '--version'], description: 'Show version' },
    { name: ['-c', '--config'], description: 'Config file', args: { name: 'file', template: 'filepaths' } },
    { name: ['-o', '--output'], description: 'Output file', args: { name: 'file', template: 'filepaths' } },
    { name: ['-t', '--tag'], description: 'Tag name', args: { name: 'tag' } },
    { name: '--current', description: 'Use current tag' },
    { name: '--latest', description: 'Use latest tag' },
    { name: '--unreleased', description: 'Include unreleased changes' },
    { name: '--prepend', description: 'Prepend to existing file', args: { name: 'file', template: 'filepaths' } },
    { name: '--strip', description: 'Strip header', args: { name: 'n', isOptional: true } },
  ],
  args: { name: 'range', description: 'Commit range', isOptional: true },
};
