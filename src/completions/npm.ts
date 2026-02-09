import { CompletionSpec } from '../types.js';
import { npmScripts, npmPackages } from '../engine/common-generators.js';

export const npmSpec: CompletionSpec = {
  name: 'npm',
  description: 'Node Package Manager',
  options: [
    { name: ['-v', '--version'], description: 'Show version' },
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-g', '--global'], description: 'Global mode' },
    { name: '--prefix', description: 'Prefix path', args: { name: 'path', template: ['folders'] } },
    { name: '--registry', description: 'Registry URL', args: { name: 'url' } },
    { name: '--loglevel', description: 'Log level', args: { name: 'level', suggestions: [{ name: 'silent' }, { name: 'error' }, { name: 'warn' }, { name: 'notice' }, { name: 'http' }, { name: 'info' }, { name: 'verbose' }, { name: 'silly' }] } }
  ],
  subcommands: [
    {
      name: 'install',
      description: 'Install packages',
      args: { name: 'package', description: 'Package name', isOptional: true, isVariadic: true },
      options: [
        { name: ['-D', '--save-dev'], description: 'Save to devDependencies' },
        { name: ['-O', '--save-optional'], description: 'Save to optionalDependencies' },
        { name: ['-E', '--save-exact'], description: 'Save exact version' },
        { name: '--no-save', description: 'Do not save to package.json' },
        { name: '--production', description: 'Install production dependencies only' },
        { name: '--legacy-peer-deps', description: 'Ignore peer dependencies' },
        { name: '--force', description: 'Force installation' }
      ]
    },
    {
      name: 'i',
      description: 'Alias for install',
      args: { name: 'package', isOptional: true, isVariadic: true },
      options: [
        { name: ['-D', '--save-dev'], description: 'Save to devDependencies' },
        { name: ['-E', '--save-exact'], description: 'Save exact version' }
      ]
    },
    {
      name: 'add',
      description: 'Alias for install',
      args: { name: 'package', isOptional: true, isVariadic: true },
      options: [
        { name: ['-D', '--save-dev'], description: 'Save to devDependencies' },
        { name: ['-E', '--save-exact'], description: 'Save exact version' }
      ]
    },
    {
      name: 'uninstall',
      description: 'Remove packages',
      args: { 
        name: 'package', 
        generators: [npmPackages],
        filterStrategy: 'fuzzy',
        isVariadic: true 
      },
      options: [
        { name: ['-D', '--save-dev'], description: 'Remove from devDependencies' },
        { name: '--no-save', description: 'Do not update package.json' }
      ]
    },
    {
      name: 'rm',
      description: 'Alias for uninstall',
      args: { 
        name: 'package', 
        generators: [npmPackages],
        filterStrategy: 'fuzzy',
        isVariadic: true 
      }
    },
    {
      name: 'remove',
      description: 'Alias for uninstall',
      args: { 
        name: 'package', 
        generators: [npmPackages],
        filterStrategy: 'fuzzy',
        isVariadic: true 
      }
    },
    {
      name: 'update',
      description: 'Update packages',
      args: { 
        name: 'package', 
        generators: [npmPackages],
        filterStrategy: 'fuzzy',
        isOptional: true, 
        isVariadic: true 
      },
      options: [
        { name: ['-g', '--global'], description: 'Update global packages' }
      ]
    },
    {
      name: 'up',
      description: 'Alias for update',
      args: { 
        name: 'package', 
        generators: [npmPackages],
        isOptional: true, 
        isVariadic: true 
      }
    },
    {
      name: 'upgrade',
      description: 'Alias for update',
      args: { 
        name: 'package', 
        generators: [npmPackages],
        isOptional: true, 
        isVariadic: true 
      }
    },
    {
      name: 'run',
      description: 'Run scripts defined in package.json',
      args: { 
        name: 'script', 
        generators: [npmScripts],
        filterStrategy: 'fuzzy'
      },
      options: [
        { name: '--', description: 'Pass arguments to script' },
        { name: '--if-present', description: 'Don\'t error if script not found' },
        { name: '--silent', description: 'Run silently' }
      ]
    },
    {
      name: 'run-script',
      description: 'Run scripts defined in package.json',
      args: { 
        name: 'script', 
        generators: [npmScripts],
        filterStrategy: 'fuzzy'
      }
    },
    {
      name: 'start',
      description: 'Run the start script',
      options: [
        { name: '--', description: 'Pass arguments to script' }
      ]
    },
    { name: 'stop', description: 'Run the stop script' },
    { name: 'restart', description: 'Run the restart script' },
    {
      name: 'test',
      description: 'Run the test script',
      options: [
        { name: '--', description: 'Pass arguments to script' }
      ]
    },
    { name: 't', description: 'Alias for test' },
    {
      name: 'build',
      description: 'Run the build script (for compatibility)'
    },
    {
      name: 'exec',
      description: 'Execute npm package binary',
      args: { name: 'command', isVariadic: true },
      options: [
        { name: ['-c', '--call'], description: 'Command to execute', args: { name: 'command' } },
        { name: '--package', description: 'Package providing command', args: { name: 'package' } }
      ]
    },
    {
      name: 'init',
      description: 'Create a package.json file',
      options: [
        { name: ['-y', '--yes'], description: 'Accept defaults' },
        { name: ['-w', '--workspace'], description: 'Create workspace', args: { name: 'name' } }
      ]
    },
    { name: 'create', description: 'Create package using create-* package', args: { name: 'initializer' } },
    {
      name: 'publish',
      description: 'Publish package to registry',
      options: [
        { name: '--tag', description: 'Publish with tag', args: { name: 'tag' } },
        { name: '--access', description: 'Access level', args: { name: 'level', suggestions: [{ name: 'public' }, { name: 'restricted' }] } },
        { name: '--dry-run', description: 'Preview without publishing' },
        { name: '--otp', description: 'One-time password', args: { name: 'otp' } }
      ]
    },
    {
      name: 'pack',
      description: 'Create tarball from package',
      options: [
        { name: '--dry-run', description: 'Preview without creating' }
      ]
    },
    {
      name: 'link',
      description: 'Symlink a package folder',
      args: { name: 'package', isOptional: true }
    },
    { name: 'ln', description: 'Alias for link', args: { name: 'package', isOptional: true } },
    {
      name: 'outdated',
      description: 'Check for outdated packages',
      args: { name: 'package', generators: [npmPackages], isOptional: true, isVariadic: true },
      options: [
        { name: ['-g', '--global'], description: 'Check global packages' },
        { name: '--json', description: 'Output as JSON' },
        { name: '--long', description: 'Extended output' }
      ]
    },
    {
      name: 'ls',
      description: 'List installed packages',
      args: { name: 'package', generators: [npmPackages], isOptional: true },
      options: [
        { name: ['-g', '--global'], description: 'List global packages' },
        { name: '--json', description: 'Output as JSON' },
        { name: '--depth', description: 'Depth level', args: { name: 'depth' } },
        { name: '--all', description: 'Show all packages' },
        { name: '--long', description: 'Extended output' }
      ]
    },
    { name: 'list', description: 'Alias for ls', args: { name: 'package', generators: [npmPackages], isOptional: true } },
    { name: 'll', description: 'Alias for ls --long', args: { name: 'package', isOptional: true } },
    { name: 'la', description: 'Alias for ls --all', args: { name: 'package', isOptional: true } },
    {
      name: 'search',
      description: 'Search registry for packages',
      args: { name: 'term', isVariadic: true },
      options: [
        { name: '--json', description: 'Output as JSON' },
        { name: '--long', description: 'Extended output' }
      ]
    },
    { name: 's', description: 'Alias for search', args: { name: 'term', isVariadic: true } },
    { name: 'find', description: 'Alias for search', args: { name: 'term', isVariadic: true } },
    {
      name: 'view',
      description: 'View registry info about a package',
      args: [
        { name: 'package' },
        { name: 'field', isOptional: true }
      ],
      options: [
        { name: '--json', description: 'Output as JSON' }
      ]
    },
    { name: 'info', description: 'Alias for view', args: { name: 'package' } },
    { name: 'show', description: 'Alias for view', args: { name: 'package' } },
    {
      name: 'audit',
      description: 'Run security audit',
      options: [
        { name: '--json', description: 'Output as JSON' },
        { name: '--fix', description: 'Attempt to fix vulnerabilities' },
        { name: '--force', description: 'Force fixes' },
        { name: '--audit-level', description: 'Minimum severity', args: { name: 'level', suggestions: [{ name: 'info' }, { name: 'low' }, { name: 'moderate' }, { name: 'high' }, { name: 'critical' }] } }
      ]
    },
    {
      name: 'fund',
      description: 'Show funding info',
      args: { name: 'package', generators: [npmPackages], isOptional: true },
      options: [
        { name: '--json', description: 'Output as JSON' }
      ]
    },
    {
      name: 'cache',
      description: 'Manage npm cache',
      subcommands: [
        { name: 'clean', description: 'Clear the cache', options: [{ name: '--force', description: 'Force clean' }] },
        { name: 'ls', description: 'List cache contents' },
        { name: 'verify', description: 'Verify cache integrity' }
      ]
    },
    {
      name: 'config',
      description: 'Manage npm configuration',
      subcommands: [
        { name: 'list', description: 'List all config settings' },
        { name: 'get', description: 'Get config value', args: { name: 'key' } },
        { name: 'set', description: 'Set config value', args: [{ name: 'key' }, { name: 'value' }] },
        { name: 'delete', description: 'Delete config value', args: { name: 'key' } },
        { name: 'edit', description: 'Open config in editor' }
      ]
    },
    { name: 'c', description: 'Alias for config' },
    { name: 'get', description: 'Get config value', args: { name: 'key' } },
    { name: 'set', description: 'Set config value', args: [{ name: 'key' }, { name: 'value' }] },
    {
      name: 'ci',
      description: 'Clean install for CI',
      options: [
        { name: '--legacy-peer-deps', description: 'Ignore peer dependencies' }
      ]
    },
    { name: 'clean-install', description: 'Alias for ci' },
    {
      name: 'dedupe',
      description: 'Reduce duplication in node_modules'
    },
    { name: 'ddp', description: 'Alias for dedupe' },
    {
      name: 'prune',
      description: 'Remove extraneous packages',
      options: [
        { name: '--production', description: 'Remove devDependencies' },
        { name: '--dry-run', description: 'Preview without removing' }
      ]
    },
    {
      name: 'rebuild',
      description: 'Rebuild native addons',
      args: { name: 'package', generators: [npmPackages], isOptional: true, isVariadic: true }
    },
    { name: 'rb', description: 'Alias for rebuild' },
    {
      name: 'version',
      description: 'Bump package version',
      args: {
        name: 'newversion',
        suggestions: [
          { name: 'major', description: 'Bump major version' },
          { name: 'minor', description: 'Bump minor version' },
          { name: 'patch', description: 'Bump patch version' },
          { name: 'premajor', description: 'Bump premajor' },
          { name: 'preminor', description: 'Bump preminor' },
          { name: 'prepatch', description: 'Bump prepatch' },
          { name: 'prerelease', description: 'Bump prerelease' }
        ]
      }
    },
    {
      name: 'login',
      description: 'Log in to registry',
      options: [
        { name: '--registry', description: 'Registry URL', args: { name: 'url' } }
      ]
    },
    { name: 'adduser', description: 'Alias for login' },
    { name: 'logout', description: 'Log out of registry' },
    { name: 'whoami', description: 'Show current user' },
    {
      name: 'token',
      description: 'Manage access tokens',
      subcommands: [
        { name: 'list', description: 'List tokens' },
        { name: 'create', description: 'Create new token' },
        { name: 'revoke', description: 'Revoke token', args: { name: 'id' } }
      ]
    },
    {
      name: 'owner',
      description: 'Manage package owners',
      subcommands: [
        { name: 'add', description: 'Add owner', args: [{ name: 'user' }, { name: 'package' }] },
        { name: 'rm', description: 'Remove owner', args: [{ name: 'user' }, { name: 'package' }] },
        { name: 'ls', description: 'List owners', args: { name: 'package' } }
      ]
    },
    {
      name: 'team',
      description: 'Manage teams',
      subcommands: [
        { name: 'create', description: 'Create team', args: { name: 'scope:team' } },
        { name: 'destroy', description: 'Remove team', args: { name: 'scope:team' } },
        { name: 'add', description: 'Add user to team', args: [{ name: 'scope:team' }, { name: 'user' }] },
        { name: 'rm', description: 'Remove user from team', args: [{ name: 'scope:team' }, { name: 'user' }] },
        { name: 'ls', description: 'List teams or members' }
      ]
    },
    {
      name: 'access',
      description: 'Manage package access',
      subcommands: [
        { name: 'public', description: 'Set package public', args: { name: 'package' } },
        { name: 'restricted', description: 'Set package restricted', args: { name: 'package' } },
        { name: 'ls-packages', description: 'List packages', args: { name: 'scope' } },
        { name: 'ls-collaborators', description: 'List collaborators', args: { name: 'package' } }
      ]
    },
    {
      name: 'dist-tag',
      description: 'Manage package distribution tags',
      subcommands: [
        { name: 'add', description: 'Add tag', args: [{ name: 'package@version' }, { name: 'tag' }] },
        { name: 'rm', description: 'Remove tag', args: [{ name: 'package' }, { name: 'tag' }] },
        { name: 'ls', description: 'List tags', args: { name: 'package' } }
      ]
    },
    {
      name: 'deprecate',
      description: 'Deprecate package version',
      args: [
        { name: 'package@version' },
        { name: 'message' }
      ]
    },
    {
      name: 'unpublish',
      description: 'Remove package from registry',
      args: { name: 'package@version', isOptional: true },
      options: [
        { name: '--force', description: 'Force unpublish' }
      ]
    },
    {
      name: 'pkg',
      description: 'Manage package.json fields',
      subcommands: [
        { name: 'get', description: 'Get field value', args: { name: 'field' } },
        { name: 'set', description: 'Set field value', args: [{ name: 'field' }, { name: 'value' }] },
        { name: 'delete', description: 'Delete field', args: { name: 'field' } }
      ]
    },
    {
      name: 'bugs',
      description: 'Open package bugs page',
      args: { name: 'package', generators: [npmPackages], isOptional: true }
    },
    { name: 'issues', description: 'Alias for bugs', args: { name: 'package', isOptional: true } },
    { name: 'docs', description: 'Open package docs page', args: { name: 'package', generators: [npmPackages], isOptional: true } },
    { name: 'home', description: 'Alias for docs', args: { name: 'package', isOptional: true } },
    { name: 'repo', description: 'Open package repo page', args: { name: 'package', generators: [npmPackages], isOptional: true } },
    {
      name: 'explain',
      description: 'Explain installed package',
      args: { name: 'package', generators: [npmPackages] }
    },
    { name: 'why', description: 'Alias for explain', args: { name: 'package', generators: [npmPackages] } },
    { name: 'doctor', description: 'Check environment' },
    { name: 'prefix', description: 'Display prefix' },
    { name: 'root', description: 'Display npm root' },
    { name: 'bin', description: 'Display npm bin folder' },
    { name: 'completion', description: 'Generate shell completion' },
    { name: 'help', description: 'Get help', args: { name: 'command', isOptional: true } },
    { name: 'help-search', description: 'Search help topics', args: { name: 'term' } }
  ]
};
