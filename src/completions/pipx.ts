// pipx - Install and run Python applications in isolated environments
import { CompletionSpec } from '../types.js';

export const pipxSpec: CompletionSpec = {
  name: 'pipx',
  description: 'Install and run Python applications in isolated environments',
  options: [
    { name: '--version', description: 'Show version' },
    { name: ['-h', '--help'], description: 'Show help' },
  ],
  subcommands: [
    {
      name: 'install',
      description: 'Install a package',
      options: [
        { name: '--include-deps', description: 'Include dependencies' },
        { name: '--verbose', description: 'Verbose output' },
        { name: '--force', description: 'Force install' },
        { name: '--suffix', description: 'Suffix for app name', args: { name: 'suffix' } },
        { name: '--python', description: 'Python interpreter', args: { name: 'python', template: 'filepaths' } },
        { name: '--system-site-packages', description: 'Include system site packages' },
        { name: '--index-url', description: 'Index URL', args: { name: 'url' } },
        { name: '--editable', description: 'Editable install', args: { name: 'path', template: 'folders' } },
        { name: '--pip-args', description: 'Additional pip arguments', args: { name: 'args' } },
        { name: '--preinstall', description: 'Preinstall packages', args: { name: 'package' } },
      ],
      args: { name: 'package', description: 'Package to install' },
    },
    {
      name: 'inject',
      description: 'Install packages into existing virtual environment',
      options: [
        { name: '--include-apps', description: 'Include applications' },
        { name: '--include-deps', description: 'Include dependencies' },
        { name: '--system-site-packages', description: 'Include system packages' },
        { name: '--index-url', description: 'Index URL', args: { name: 'url' } },
        { name: '--editable', description: 'Editable install', args: { name: 'path', template: 'folders' } },
        { name: '--pip-args', description: 'Additional pip arguments', args: { name: 'args' } },
        { name: '--verbose', description: 'Verbose output' },
        { name: '--force', description: 'Force install' },
      ],
      args: [
        { name: 'package', description: 'Main package' },
        { name: 'dependencies', description: 'Packages to inject', isVariadic: true },
      ],
    },
    {
      name: 'upgrade',
      description: 'Upgrade a package',
      options: [
        { name: '--include-injected', description: 'Include injected packages' },
        { name: '--force', description: 'Force upgrade' },
        { name: '--system-site-packages', description: 'Include system packages' },
        { name: '--index-url', description: 'Index URL', args: { name: 'url' } },
        { name: '--pip-args', description: 'Additional pip arguments', args: { name: 'args' } },
        { name: '--verbose', description: 'Verbose output' },
      ],
      args: { name: 'package', description: 'Package to upgrade' },
    },
    {
      name: 'upgrade-all',
      description: 'Upgrade all packages',
      options: [
        { name: '--include-injected', description: 'Include injected packages' },
        { name: '--skip', description: 'Skip packages', args: { name: 'packages' } },
        { name: '--force', description: 'Force upgrade' },
        { name: '--verbose', description: 'Verbose output' },
      ],
    },
    {
      name: 'uninstall',
      description: 'Uninstall a package',
      options: [
        { name: '--verbose', description: 'Verbose output' },
      ],
      args: { name: 'package', description: 'Package to uninstall' },
    },
    {
      name: 'uninstall-all',
      description: 'Uninstall all packages',
      options: [
        { name: '--verbose', description: 'Verbose output' },
      ],
    },
    {
      name: 'reinstall',
      description: 'Reinstall a package',
      options: [
        { name: '--python', description: 'Python interpreter', args: { name: 'python', template: 'filepaths' } },
        { name: '--verbose', description: 'Verbose output' },
      ],
      args: { name: 'package', description: 'Package to reinstall' },
    },
    {
      name: 'reinstall-all',
      description: 'Reinstall all packages',
      options: [
        { name: '--python', description: 'Python interpreter', args: { name: 'python', template: 'filepaths' } },
        { name: '--skip', description: 'Skip packages', args: { name: 'packages' } },
        { name: '--verbose', description: 'Verbose output' },
      ],
    },
    {
      name: 'list',
      description: 'List installed packages',
      options: [
        { name: '--include-injected', description: 'Include injected packages' },
        { name: '--json', description: 'Output JSON' },
        { name: '--short', description: 'Short output' },
      ],
    },
    {
      name: 'run',
      description: 'Run an app in a temporary virtual environment',
      options: [
        { name: '--no-cache', description: 'Disable cache' },
        { name: '--pypackages', description: 'Use __pypackages__' },
        { name: '--spec', description: 'Package spec', args: { name: 'spec' } },
        { name: '--python', description: 'Python interpreter', args: { name: 'python', template: 'filepaths' } },
        { name: '--system-site-packages', description: 'Include system packages' },
        { name: '--index-url', description: 'Index URL', args: { name: 'url' } },
        { name: '--editable', description: 'Editable install', args: { name: 'path', template: 'folders' } },
        { name: '--pip-args', description: 'Additional pip arguments', args: { name: 'args' } },
        { name: '--verbose', description: 'Verbose output' },
      ],
      args: [
        { name: 'app', description: 'App to run' },
        { name: 'args', description: 'App arguments', isOptional: true, isVariadic: true },
      ],
    },
    {
      name: 'runpip',
      description: "Run pip in a package's virtual environment",
      options: [
        { name: '--verbose', description: 'Verbose output' },
      ],
      args: [
        { name: 'package', description: 'Package name' },
        { name: 'args', description: 'pip arguments', isVariadic: true },
      ],
    },
    {
      name: 'ensurepath',
      description: 'Add pipx paths to PATH',
      options: [
        { name: '--force', description: 'Force update' },
      ],
    },
    {
      name: 'completions',
      description: 'Print shell completions',
      args: { name: 'shell', suggestions: [{ name: 'bash' }, { name: 'zsh' }, { name: 'fish' }, { name: 'tcsh' }] },
    },
    {
      name: 'environment',
      description: 'Print environment variables',
      options: [
        { name: '--value', description: 'Print variable value', args: { name: 'variable', suggestions: [{ name: 'PIPX_HOME' }, { name: 'PIPX_BIN_DIR' }, { name: 'PIPX_MAN_DIR' }] } },
      ],
    },
  ],
};
