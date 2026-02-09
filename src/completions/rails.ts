// rails - Ruby on Rails
import { CompletionSpec } from '../types.js';

export const railsSpec: CompletionSpec = {
  name: 'rails',
  description: 'Ruby on Rails command line',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'new', description: 'Create new app', args: { name: 'app_path' } },
    { name: 'server', description: 'Start server', options: [{ name: ['-p', '--port'], description: 'Port', args: { name: 'port' } }, { name: ['-b', '--binding'], description: 'Bind', args: { name: 'host' } }] },
    { name: 'console', description: 'Start console' },
    { name: 'generate', description: 'Generate code', args: { name: 'generator', isVariadic: true } },
    { name: 'destroy', description: 'Destroy generated code', args: { name: 'generator', isVariadic: true } },
    { name: 'db', description: 'Database tasks', subcommands: [
      { name: 'create', description: 'Create database' },
      { name: 'migrate', description: 'Run migrations' },
      { name: 'seed', description: 'Seed database' },
      { name: 'drop', description: 'Drop database' },
      { name: 'reset', description: 'Reset database' },
    ] },
    { name: 'test', description: 'Run tests' },
  ],
};
