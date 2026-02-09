// open - Open files and apps (macOS)
import { CompletionSpec } from '../types.js';

export const openSpec: CompletionSpec = {
  name: 'open',
  description: 'Open files, directories, or apps (macOS)',
  options: [
    { name: ['-a', '--app'], description: 'Open with the specified app', args: { name: 'app' } },
    { name: ['-b', '--bundle'], description: 'Open with bundle identifier', args: { name: 'bundle' } },
    { name: ['-n', '--new'], description: 'Open new instance' },
    { name: ['-F', '--fresh'], description: 'Fresh launch' },
    { name: ['-R', '--reveal'], description: 'Reveal in Finder' },
    { name: ['-g', '--background'], description: 'Do not bring app to foreground' },
    { name: ['-t', '--text'], description: 'Open with default text editor' },
    { name: ['-e', '--edit'], description: 'Open with TextEdit' },
    { name: ['-f', '--stdin'], description: 'Read from stdin' },
    { name: ['-W', '--wait-apps'], description: 'Wait for app to exit' },
  ],
  args: { name: 'paths', description: 'Files or URLs', template: 'filepaths', isOptional: true, isVariadic: true },
};
