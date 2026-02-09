// htop - Interactive process viewer
import { CompletionSpec, Suggestion } from '../types.js';

export const htopSpec: CompletionSpec = {
  name: 'htop',
  description: 'Interactive process viewer',
  options: [
    { name: ['-d', '--delay'], description: 'Set the delay between updates (in tenths of seconds)', args: { name: 'delay' } },
    { name: ['-C', '--no-color'], description: 'Start htop in monochrome mode' },
    { name: '--no-mouse', description: 'Disable mouse support' },
    { name: ['-F', '--filter'], description: 'Filter processes by command', args: { name: 'filter' } },
    { name: ['-h', '--help'], description: 'Display help and exit' },
    { name: ['-H', '--highlight-changes'], description: 'Highlight new and old processes', args: { name: 'delay', isOptional: true } },
    { name: ['-M', '--no-unicode'], description: 'Do not use unicode characters' },
    { name: ['-p', '--pid'], description: 'Show only given PIDs', args: { name: 'pid', description: 'Comma-separated list of PIDs' } },
    { name: '--readonly', description: 'Disable kill and renice' },
    { name: ['-s', '--sort-key'], description: 'Sort by column', args: { 
      name: 'column',
      suggestions: [
        { name: 'PID', description: 'Process ID' },
        { name: 'USER', description: 'User name' },
        { name: 'PRIORITY', description: 'Process priority' },
        { name: 'NICE', description: 'Nice value' },
        { name: 'M_VIRT', description: 'Virtual memory size' },
        { name: 'M_RESIDENT', description: 'Resident memory size' },
        { name: 'M_SHARE', description: 'Shared memory size' },
        { name: 'STATE', description: 'Process state' },
        { name: 'PERCENT_CPU', description: 'CPU usage percent' },
        { name: 'PERCENT_MEM', description: 'Memory usage percent' },
        { name: 'TIME', description: 'CPU time' },
        { name: 'NLWP', description: 'Number of threads' },
        { name: 'COMM', description: 'Command name' },
        { name: 'EXE', description: 'Executable path' },
        { name: 'STARTTIME', description: 'Start time' },
      ],
    }},
    { name: ['-t', '--tree'], description: 'Show processes in tree view' },
    { name: ['-u', '--user'], description: 'Show only processes for a given user', args: { name: 'username' } },
    { name: ['-U', '--no-userland-threads'], description: 'Do not show userland process threads' },
    { name: ['-v', '--version'], description: 'Display version and exit' },
  ],
};
