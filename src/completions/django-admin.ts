// django-admin - Django administration utility
import { CompletionSpec } from '../types.js';

export const djangoAdminSpec: CompletionSpec = {
  name: 'django-admin',
  description: 'Django administration utility',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: '--settings', description: 'Settings module', args: { name: 'module' } },
    { name: '--pythonpath', description: 'Python path', args: { name: 'path' } },
    { name: '--verbosity', description: 'Verbosity', args: { name: 'level' } },
  ],
  subcommands: [
    { name: 'startproject', description: 'Create a project', args: [{ name: 'name' }, { name: 'directory', isOptional: true, template: 'folders' }] },
    { name: 'startapp', description: 'Create an app', args: [{ name: 'name' }, { name: 'directory', isOptional: true, template: 'folders' }] },
    { name: 'runserver', description: 'Start dev server', args: { name: 'addrport', isOptional: true } },
    { name: 'makemigrations', description: 'Create migrations', args: { name: 'app', isOptional: true } },
    { name: 'migrate', description: 'Apply migrations' },
    { name: 'createsuperuser', description: 'Create superuser' },
    { name: 'collectstatic', description: 'Collect static files' },
    { name: 'test', description: 'Run tests', args: { name: 'tests', isOptional: true, isVariadic: true } },
    { name: 'shell', description: 'Open shell' },
  ],
};
