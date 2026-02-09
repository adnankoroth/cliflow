// man - Display manual pages
import { CompletionSpec } from '../types.js';

export const manSpec: CompletionSpec = {
  name: 'man',
  description: 'Display manual pages',
  options: [
    { name: ['-k', '--apropos'], description: 'Search manuals', args: { name: 'keyword' } },
    { name: ['-f', '--whatis'], description: 'Short description', args: { name: 'name' } },
    { name: ['-a', '--all'], description: 'Show all pages' },
    { name: ['-w', '--where'], description: 'Show location' },
    { name: ['-M', '--manpath'], description: 'Set MANPATH', args: { name: 'path' } },
    { name: ['-P', '--pager'], description: 'Pager program', args: { name: 'pager' } },
  ],
  args: [{ name: 'section', isOptional: true }, { name: 'page', description: 'Manual page' }],
};
