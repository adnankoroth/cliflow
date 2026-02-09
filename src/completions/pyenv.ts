// pyenv - Simple Python version management
import { CompletionSpec, Suggestion } from '../types.js';

export const pyenvSpec: CompletionSpec = {
  name: 'pyenv',
  description: 'Simple Python version management',
  subcommands: [
    {
      name: 'install',
      description: 'Install a Python version',
      options: [
        { name: ['-l', '--list'], description: 'List available versions' },
        { name: ['-f', '--force'], description: 'Force installation' },
        { name: ['-s', '--skip-existing'], description: 'Skip if version exists' },
        { name: ['-k', '--keep'], description: 'Keep source tree after install' },
        { name: ['-p', '--patch'], description: 'Apply patch from stdin' },
        { name: ['-g', '--debug'], description: 'Build with debug flags' },
        { name: ['-v', '--verbose'], description: 'Verbose mode' },
      ],
      args: { name: 'version', description: 'Python version to install', isOptional: true },
    },
    {
      name: 'uninstall',
      description: 'Uninstall a Python version',
      options: [
        { name: ['-f', '--force'], description: 'Force uninstallation' },
      ],
      args: { name: 'version', description: 'Python version to uninstall', isVariadic: true },
    },
    {
      name: 'versions',
      description: 'List all installed Python versions',
      options: [
        { name: '--bare', description: 'Print only version names' },
        { name: '--skip-aliases', description: 'Skip aliases' },
        { name: '--skip-envs', description: 'Skip virtual environments' },
      ],
    },
    {
      name: 'version',
      description: 'Show the current Python version',
    },
    {
      name: 'version-name',
      description: 'Show the current Python version name',
    },
    {
      name: 'version-file',
      description: 'Show the file that sets the current version',
    },
    {
      name: 'version-file-read',
      description: 'Read the version file',
    },
    {
      name: 'version-file-write',
      description: 'Write a version to the version file',
      args: { name: 'version', description: 'Version to write' },
    },
    {
      name: 'version-origin',
      description: 'Show how the current version was set',
    },
    {
      name: 'global',
      description: 'Set or show the global Python version',
      args: { name: 'version', description: 'Version to set', isOptional: true, isVariadic: true },
    },
    {
      name: 'local',
      description: 'Set or show the local Python version',
      options: [
        { name: '--unset', description: 'Unset local version' },
      ],
      args: { name: 'version', description: 'Version to set', isOptional: true, isVariadic: true },
    },
    {
      name: 'shell',
      description: 'Set or show the shell-specific Python version',
      options: [
        { name: '--unset', description: 'Unset shell version' },
      ],
      args: { name: 'version', description: 'Version to set', isOptional: true, isVariadic: true },
    },
    {
      name: 'rehash',
      description: 'Rehash pyenv shims',
    },
    {
      name: 'which',
      description: 'Show the full path of an executable',
      args: { name: 'command', description: 'Command to locate' },
    },
    {
      name: 'whence',
      description: 'List versions containing the given command',
      options: [
        { name: '--path', description: 'Show paths' },
      ],
      args: { name: 'command', description: 'Command to search' },
    },
    {
      name: 'exec',
      description: 'Run an executable with the selected Python version',
      args: { name: 'command', description: 'Command to run', isVariadic: true },
    },
    {
      name: 'root',
      description: 'Show the root directory where versions are installed',
    },
    {
      name: 'prefix',
      description: 'Show the directory for a specific version',
      args: { name: 'version', description: 'Version to show prefix for', isOptional: true },
    },
    {
      name: 'hooks',
      description: 'List hook scripts for a command',
      args: { name: 'command', description: 'Command to list hooks for' },
    },
    {
      name: 'shims',
      description: 'List existing pyenv shims',
      options: [
        { name: '--short', description: 'Short format' },
      ],
    },
    {
      name: 'init',
      description: 'Initialize pyenv shell integration',
      options: [
        { name: '-', description: 'Print shell integration code' },
        { name: '--path', description: 'Only print path setup' },
        { name: '--no-rehash', description: 'Skip rehash' },
        { name: '--detect-shell', description: 'Detect shell' },
      ],
      args: { 
        name: 'shell', 
        description: 'Shell type', 
        isOptional: true,
        suggestions: [
          { name: 'bash', description: 'Bash shell' },
          { name: 'zsh', description: 'Zsh shell' },
          { name: 'fish', description: 'Fish shell' },
          { name: 'ksh', description: 'Ksh shell' },
        ],
      },
    },
    {
      name: 'completions',
      description: 'List available completions',
      args: { name: 'command', description: 'Command', isOptional: true },
    },
    {
      name: 'commands',
      description: 'List all available pyenv commands',
      options: [
        { name: '--sh', description: 'List only shell commands' },
        { name: '--no-sh', description: 'List only non-shell commands' },
      ],
    },
    {
      name: 'help',
      description: 'Show help for a command',
      args: { name: 'command', description: 'Command to get help for', isOptional: true },
    },
    // pyenv-virtualenv plugin commands
    {
      name: 'virtualenv',
      description: 'Create a Python virtualenv',
      options: [
        { name: ['-f', '--force'], description: 'Force creation' },
        { name: ['-u', '--upgrade'], description: 'Upgrade existing' },
        { name: '--without-pip', description: 'Create without pip' },
        { name: ['-p', '--python'], description: 'Python executable', args: { name: 'python' } },
      ],
      args: [
        { name: 'version', description: 'Python version', isOptional: true },
        { name: 'virtualenv-name', description: 'Virtualenv name', isOptional: true },
      ],
    },
    {
      name: 'virtualenv-delete',
      description: 'Delete a virtualenv',
      options: [
        { name: ['-f', '--force'], description: 'Force deletion' },
      ],
      args: { name: 'virtualenv', description: 'Virtualenv to delete' },
    },
    {
      name: 'virtualenv-init',
      description: 'Initialize virtualenv plugin',
    },
    {
      name: 'virtualenv-prefix',
      description: 'Show the prefix of a virtualenv',
      args: { name: 'virtualenv', description: 'Virtualenv name', isOptional: true },
    },
    {
      name: 'virtualenvs',
      description: 'List all virtualenvs',
      options: [
        { name: '--bare', description: 'Print only names' },
        { name: '--skip-aliases', description: 'Skip aliases' },
      ],
    },
    {
      name: 'activate',
      description: 'Activate a virtualenv',
      args: { name: 'virtualenv', description: 'Virtualenv to activate', isOptional: true },
    },
    {
      name: 'deactivate',
      description: 'Deactivate the current virtualenv',
    },
    // pyenv-update plugin
    {
      name: 'update',
      description: 'Update pyenv and plugins',
    },
  ],
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
};
