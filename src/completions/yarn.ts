import { CompletionSpec, Generator } from '../types.js';
import { npmScripts, npmPackages } from '../engine/common-generators.js';

// yarn completion spec for CLIFlow
const yarnWorkspaceGenerator: Generator = {
  script: 'yarn workspaces list --json 2>/dev/null',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    try {
      return output.split('\n')
        .filter(line => line.trim() && line.startsWith('{'))
        .map(line => JSON.parse(line))
        .filter(data => data?.name && data.name !== '.')
        .map(data => ({
          name: data.name,
          description: `Workspace: ${data.location || 'unknown location'}`,
          type: 'argument' as const,
          icon: '🏗',
          priority: 100
        }));
    } catch {
      return [];
    }
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const yarnSpec: CompletionSpec = {
  name: 'yarn',
  description: 'Fast, reliable, and secure dependency management',
  options: [
    {
      name: '--version',
      description: 'Output the version number'
    },
    {
      name: ['-h', '--help'],
      description: 'Output usage information'
    },
    {
      name: '--verbose',
      description: 'Output verbose messages on internal operations'
    },
    {
      name: '--offline',
      description: 'Trigger an error if any required dependencies are not available in local cache'
    },
    {
      name: '--prefer-offline',
      description: 'Use network only if dependencies are not available in local cache'
    },
    {
      name: '--enable-pnp',
      description: 'Enable Plug\'n\'Play installation'
    },
    {
      name: '--disable-pnp',
      description: 'Disable Plug\'n\'Play installation'
    },
    {
      name: '--strict-semver',
      description: 'Use strict semantic version mode'
    },
    {
      name: '--json',
      description: 'Format output as JSON'
    },
    {
      name: '--ignore-scripts',
      description: 'Do not execute any scripts defined in the project package.json'
    },
    {
      name: '--har',
      description: 'Save HTTP requests to a HAR file',
      args: {
        name: 'filename',
        template: ['filepaths']
      }
    },
    {
      name: '--ignore-platform',
      description: 'Ignore platform checks'
    },
    {
      name: '--ignore-engines',
      description: 'Ignore engines check'
    },
    {
      name: '--ignore-optional',
      description: 'Ignore optional dependencies'
    },
    {
      name: '--force',
      description: 'Install and build packages even if they were built before'
    },
    {
      name: '--skip-integrity-check',
      description: 'Skip integrity check'
    },
    {
      name: '--check-files',
      description: 'Install will verify file tree of packages for consistency'
    },
    {
      name: '--no-bin-links',
      description: 'Do not create symlinks for any binaries the package might contain'
    },
    {
      name: '--flat',
      description: 'Only allow one version of a package'
    },
    {
      name: '--prod',
      description: 'Install only production dependencies'
    },
    {
      name: '--production',
      description: 'Install only production dependencies'
    },
    {
      name: '--no-lockfile',
      description: 'Do not read or generate a lockfile'
    },
    {
      name: '--pure-lockfile',
      description: 'Do not generate a lockfile'
    },
    {
      name: '--frozen-lockfile',
      description: 'Install dependencies from lockfile and fail if an update is needed'
    },
    {
      name: '--update-checksums',
      description: 'Update checksums in the yarn.lock lockfile'
    },
    {
      name: '--link-duplicates',
      description: 'Create hardlinks to the repeated modules in node_modules'
    },
    {
      name: '--link-folder',
      description: 'Specify a custom folder to store global links',
      args: {
        name: 'path',
        template: ['folders']
      }
    },
    {
      name: '--global-folder',
      description: 'Specify a custom folder to store global packages',
      args: {
        name: 'path',
        template: ['folders']
      }
    },
    {
      name: '--modules-folder',
      description: 'Specify custom folder to store node_modules',
      args: {
        name: 'path',
        template: ['folders']
      }
    },
    {
      name: '--preferred-cache-folder',
      description: 'Specify a custom folder to store the yarn cache if possible',
      args: {
        name: 'path',
        template: ['folders']
      }
    },
    {
      name: '--cache-folder',
      description: 'Specify a custom folder that must be used to store the yarn cache',
      args: {
        name: 'path',
        template: ['folders']
      }
    },
    {
      name: '--mutex',
      description: 'How to ensure only one yarn instance is executing at a time',
      args: {
        name: 'type',
        suggestions: [
          { name: 'file', description: 'Use a file-based mutex' },
          { name: 'network', description: 'Use network port-based mutex' }
        ]
      }
    },
    {
      name: '--emoji',
      description: 'Enable emoji in output'
    },
    {
      name: '--no-emoji',
      description: 'Disable emoji in output'
    },
    {
      name: '--proxy',
      description: 'Define HTTP proxy to use',
      args: { name: 'url' }
    },
    {
      name: '--https-proxy',
      description: 'Define HTTPS proxy to use',
      args: { name: 'url' }
    },
    {
      name: '--registry',
      description: 'Override configuration registry',
      args: { name: 'url' }
    },
    {
      name: '--no-progress',
      description: 'Disable progress bar'
    },
    {
      name: '--network-concurrency',
      description: 'Maximum number of concurrent network requests',
      args: { name: 'number' }
    },
    {
      name: '--network-timeout',
      description: 'TCP timeout for network requests',
      args: { name: 'milliseconds' }
    },
    {
      name: '--non-interactive',
      description: 'Disable interactive prompts'
    },
    {
      name: '--scripts-prepend-node-path',
      description: 'Prepend the node executable dir to the PATH in scripts',
      args: {
        name: 'bool',
        suggestions: [
          { name: 'true', description: 'Enable prepending' },
          { name: 'false', description: 'Disable prepending' }
        ]
      }
    },
    {
      name: '--no-node-version-check',
      description: 'Do not warn when using a potentially unsupported Node version'
    },
    {
      name: '--focus',
      description: 'Focus on a single workspace by installing remote copies of its sibling workspaces'
    },
    {
      name: '--otp',
      description: 'One-time password for two factor authentication',
      args: { name: 'otpcode' }
    }
  ],
  subcommands: [
    {
      name: 'add',
      description: 'Install packages and update package.json and yarn.lock',
      args: {
        name: 'package',
        description: 'Package to add',
        generators: [npmPackages],
        isVariadic: true
      },
      options: [
        {
          name: ['-W', '--ignore-workspace-root-check'],
          description: 'Allow installation of packages at the workspace root'
        },
        {
          name: ['-D', '--dev'],
          description: 'Save package to devDependencies'
        },
        {
          name: ['-P', '--peer'],
          description: 'Save package to peerDependencies'
        },
        {
          name: ['-O', '--optional'],
          description: 'Save package to optionalDependencies'
        },
        {
          name: ['-E', '--exact'],
          description: 'Install exact version'
        },
        {
          name: ['-T', '--tilde'],
          description: 'Install most recent release with the same minor version'
        },
        {
          name: ['-C', '--caret'],
          description: 'Install most recent release with the same major version'
        },
        {
          name: ['-A', '--audit'],
          description: 'Run vulnerability audit on installed packages'
        }
      ]
    },
    {
      name: 'audit',
      description: 'Perform vulnerability audit against installed packages',
      options: [
        {
          name: '--verbose',
          description: 'Output verbose information'
        },
        {
          name: '--json',
          description: 'Output audit report in JSON format'
        },
        {
          name: '--level',
          description: 'Only show vulnerabilities of a specific level',
          args: {
            name: 'severity',
            suggestions: [
              { name: 'info', description: 'Info level vulnerabilities' },
              { name: 'low', description: 'Low severity vulnerabilities' },
              { name: 'moderate', description: 'Moderate severity vulnerabilities' },
              { name: 'high', description: 'High severity vulnerabilities' },
              { name: 'critical', description: 'Critical vulnerabilities' }
            ]
          }
        },
        {
          name: '--groups',
          description: 'Only audit dependencies from these groups',
          args: {
            name: 'group_names',
            suggestions: [
              { name: 'dependencies', description: 'Production dependencies' },
              { name: 'devDependencies', description: 'Development dependencies' },
              { name: 'optionalDependencies', description: 'Optional dependencies' }
            ]
          }
        }
      ]
    },
    {
      name: 'autoclean',
      description: 'Clean and remove unnecessary files from package dependencies',
      options: [
        {
          name: ['-I', '--init'],
          description: 'Create default .yarnclean file'
        },
        {
          name: ['-F', '--force'],
          description: 'Run autoclean using the current .yarnclean file'
        }
      ]
    },
    {
      name: 'bin',
      description: 'Display the location of the yarn bin folder',
      args: {
        name: 'executable',
        description: 'Name of executable to locate',
        isOptional: true
      }
    },
    {
      name: 'cache',
      description: 'Manage yarn cache',
      subcommands: [
        {
          name: 'list',
          description: 'List cached packages',
          options: [
            {
              name: '--pattern',
              description: 'Filter list by package name pattern',
              args: { name: 'pattern' }
            }
          ]
        },
        {
          name: 'dir',
          description: 'Show cache directory path'
        },
        {
          name: 'clean',
          description: 'Clean yarn cache',
          args: {
            name: 'modules',
            description: 'Modules to clean',
            isOptional: true,
            isVariadic: true
          }
        }
      ]
    },
    {
      name: 'check',
      description: 'Verify package dependencies against yarn.lock',
      options: [
        {
          name: '--integrity',
          description: 'Check integrity of packages'
        },
        {
          name: '--verify-tree',
          description: 'Verify file tree of packages for consistency'
        }
      ]
    },
    {
      name: 'config',
      description: 'Manage yarn configuration files',
      subcommands: [
        {
          name: 'set',
          description: 'Set configuration option',
          args: [
            {
              name: 'key',
              description: 'Configuration key'
            },
            {
              name: 'value',
              description: 'Configuration value'
            }
          ],
          options: [
            {
              name: ['-g', '--global'],
              description: 'Set global configuration'
            }
          ]
        },
        {
          name: 'get',
          description: 'Get configuration option',
          args: {
            name: 'key',
            description: 'Configuration key'
          }
        },
        {
          name: 'delete',
          description: 'Delete configuration option',
          args: {
            name: 'key',
            description: 'Configuration key'
          }
        },
        {
          name: 'list',
          description: 'List all configuration options'
        }
      ]
    },
    {
      name: 'create',
      description: 'Create new projects from any create-* starter kits',
      args: [
        {
          name: 'starter-kit-package',
          description: 'Starter kit package name'
        },
        {
          name: 'directory',
          description: 'Directory to create project in',
          template: ['folders']
        }
      ]
    },
    {
      name: 'dedupe',
      description: 'Deduplicate packages in the current project'
    },
    {
      name: 'generate-lock-entry',
      description: 'Generate a lock file entry'
    },
    {
      name: 'global',
      description: 'Install packages globally',
      subcommands: [
        {
          name: 'add',
          description: 'Install packages globally',
          args: {
            name: 'package',
            description: 'Package to install globally',
            generators: [npmPackages],
            isVariadic: true
          },
          options: [
            {
              name: '--prefix',
              description: 'Update bin prefix',
              args: {
                name: 'prefix',
                template: ['folders']
              }
            }
          ]
        },
        {
          name: 'bin',
          description: 'Display the location of the global bin folder'
        },
        {
          name: 'dir',
          description: 'Display the location of the global modules folder'
        },
        {
          name: 'list',
          description: 'List installed packages globally',
          options: [
            {
              name: '--depth',
              description: 'Limit depth of dependencies shown',
              args: { name: 'depth' }
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove packages from global installation',
          args: {
            name: 'package',
            description: 'Package to remove globally',
            isVariadic: true
          }
        },
        {
          name: 'upgrade',
          description: 'Upgrade packages installed globally',
          args: {
            name: 'package',
            description: 'Package to upgrade globally',
            isOptional: true,
            isVariadic: true
          }
        },
        {
          name: 'upgrade-interactive',
          description: 'Upgrade packages installed globally interactively',
          options: [
            {
              name: '--latest',
              description: 'List packages to upgrade to their latest version'
            }
          ]
        }
      ]
    },
    {
      name: 'help',
      description: 'Show help information',
      args: {
        name: 'command',
        description: 'Command to show help for',
        isOptional: true
      }
    },
    {
      name: 'import',
      description: 'Generate yarn.lock from existing package-lock.json'
    },
    {
      name: 'info',
      description: 'Show information about a package',
      args: {
        name: 'package',
        description: 'Package to show info for',
        generators: [npmPackages]
      },
      options: [
        {
          name: '--json',
          description: 'Format output as JSON'
        }
      ]
    },
    {
      name: 'init',
      description: 'Initialize a new project',
      options: [
        {
          name: ['-y', '--yes'],
          description: 'Skip interactive prompts and use defaults'
        },
        {
          name: ['-p', '--private'],
          description: 'Initialize private package'
        },
        {
          name: ['-2', '--install=v2'],
          description: 'Initialize using Yarn v2'
        }
      ]
    },
    {
      name: 'install',
      description: 'Install project dependencies',
      options: [
        {
          name: '--flat',
          description: 'Install packages at top level'
        },
        {
          name: '--har',
          description: 'Save HTTP requests to a HAR file',
          args: {
            name: 'filename',
            template: ['filepaths']
          }
        },
        {
          name: '--ignore-scripts',
          description: 'Do not execute any scripts defined in package.json'
        },
        {
          name: '--modules-folder',
          description: 'Specify custom folder to store node_modules',
          args: {
            name: 'path',
            template: ['folders']
          }
        },
        {
          name: '--no-lockfile',
          description: 'Do not read or generate a yarn.lock file'
        },
        {
          name: '--production',
          description: 'Install only production dependencies'
        },
        {
          name: '--pure-lockfile',
          description: 'Do not generate a yarn.lock file'
        },
        {
          name: '--focus',
          description: 'Focus on a single workspace and its dependencies'
        },
        {
          name: '--frozen-lockfile',
          description: 'Install dependencies from lockfile and fail if an update is needed'
        }
      ]
    },
    {
      name: 'licenses',
      description: 'List licenses for installed packages',
      subcommands: [
        {
          name: 'list',
          description: 'List all licenses'
        },
        {
          name: 'generate-disclaimer',
          description: 'Generate disclaimer containing all licenses'
        }
      ]
    },
    {
      name: 'link',
      description: 'Symlink a package folder during development',
      args: {
        name: 'package',
        description: 'Package to link',
        isOptional: true
      }
    },
    {
      name: 'list',
      description: 'List installed packages',
      options: [
        {
          name: '--depth',
          description: 'Limit depth of dependencies shown',
          args: { name: 'depth' }
        },
        {
          name: '--pattern',
          description: 'Filter list by package name pattern',
          args: { name: 'pattern' }
        }
      ]
    },
    {
      name: 'login',
      description: 'Store registry username and email'
    },
    {
      name: 'logout',
      description: 'Clear registry username and email'
    },
    {
      name: 'node',
      description: 'Run Node.js with the hook already setup',
      args: {
        name: 'script',
        description: 'Node.js script to run',
        template: ['filepaths']
      }
    },
    {
      name: 'outdated',
      description: 'Check for outdated package dependencies',
      args: {
        name: 'package',
        description: 'Package to check',
        isOptional: true,
        isVariadic: true
      }
    },
    {
      name: 'owner',
      description: 'Manage package owners',
      subcommands: [
        {
          name: 'list',
          description: 'List owners of a package',
          args: {
            name: 'package',
            description: 'Package name'
          }
        },
        {
          name: 'add',
          description: 'Add owner to package',
          args: [
            {
              name: 'user',
              description: 'Username to add'
            },
            {
              name: 'package',
              description: 'Package name'
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove owner from package',
          args: [
            {
              name: 'user',
              description: 'Username to remove'
            },
            {
              name: 'package',
              description: 'Package name'
            }
          ]
        }
      ]
    },
    {
      name: 'pack',
      description: 'Create a compressed gzip archive of package dependencies',
      options: [
        {
          name: ['-f', '--filename'],
          description: 'Filename for the archive',
          args: {
            name: 'filename',
            template: ['filepaths']
          }
        }
      ]
    },
    {
      name: 'policies',
      description: 'Define project-wide policies for packages',
      subcommands: [
        {
          name: 'set-version',
          description: 'Enforce that a given range for a package'
        }
      ]
    },
    {
      name: 'publish',
      description: 'Publish package to npm registry',
      options: [
        {
          name: '--new-version',
          description: 'New version to publish',
          args: { name: 'version' }
        },
        {
          name: '--message',
          description: 'Message to use when creating tag',
          args: { name: 'message' }
        },
        {
          name: '--no-git-tag-version',
          description: 'Do not create git tag'
        },
        {
          name: '--access',
          description: 'Set access level for scoped packages',
          args: {
            name: 'access',
            suggestions: [
              { name: 'public', description: 'Public access' },
              { name: 'restricted', description: 'Restricted access' }
            ]
          }
        },
        {
          name: '--tag',
          description: 'Tag to publish package with',
          args: { name: 'tag' }
        },
        {
          name: '--registry',
          description: 'Registry to publish to',
          args: { name: 'url' }
        }
      ]
    },
    {
      name: 'remove',
      description: 'Remove packages from dependencies',
      args: {
        name: 'package',
        description: 'Package to remove',
        isVariadic: true
      },
      options: [
        {
          name: ['-W', '--ignore-workspace-root-check'],
          description: 'Allow removal of packages from workspace root'
        }
      ]
    },
    {
      name: 'run',
      description: 'Run a defined package script',
      args: {
        name: 'script',
        description: 'Script name to run',
        generators: [npmScripts],
        filterStrategy: 'fuzzy',
        isOptional: true
      },
      options: [
        {
          name: '--inspect',
          description: 'Activate inspector on host:port',
          args: { name: 'host:port' }
        },
        {
          name: '--inspect-brk',
          description: 'Activate inspector on host:port and break at start',
          args: { name: 'host:port' }
        }
      ]
    },
    {
      name: 'tag',
      description: 'Add, remove, or list tags on a package',
      subcommands: [
        {
          name: 'add',
          description: 'Add a tag',
          args: [
            {
              name: 'package@version',
              description: 'Package and version'
            },
            {
              name: 'tag',
              description: 'Tag name'
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove a tag',
          args: [
            {
              name: 'package',
              description: 'Package name'
            },
            {
              name: 'tag',
              description: 'Tag name'
            }
          ]
        },
        {
          name: 'list',
          description: 'List tags',
          args: {
            name: 'package',
            description: 'Package name',
            isOptional: true
          }
        }
      ]
    },
    {
      name: 'team',
      description: 'Manage organization teams and team memberships',
      subcommands: [
        {
          name: 'create',
          description: 'Create a new team',
          args: {
            name: 'scope:team',
            description: 'Team identifier'
          }
        },
        {
          name: 'destroy',
          description: 'Destroy a team',
          args: {
            name: 'scope:team',
            description: 'Team identifier'
          }
        },
        {
          name: 'add',
          description: 'Add user to team',
          args: [
            {
              name: 'scope:team',
              description: 'Team identifier'
            },
            {
              name: 'user',
              description: 'Username'
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove user from team',
          args: [
            {
              name: 'scope:team',
              description: 'Team identifier'
            },
            {
              name: 'user',
              description: 'Username'
            }
          ]
        },
        {
          name: 'list',
          description: 'List teams or team members',
          args: {
            name: 'scope|scope:team',
            description: 'Scope or team identifier',
            isOptional: true
          }
        }
      ]
    },
    {
      name: 'unlink',
      description: 'Unlink a previously linked package',
      args: {
        name: 'package',
        description: 'Package to unlink',
        isOptional: true
      }
    },
    {
      name: 'unplug',
      description: 'Temporarily copy a package outside of the global cache',
      args: {
        name: 'package',
        description: 'Package to unplug',
        isVariadic: true
      }
    },
    {
      name: 'upgrade',
      description: 'Upgrade packages to their latest version',
      args: {
        name: 'package',
        description: 'Package to upgrade',
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: '--latest',
          description: 'Ignore version ranges in package.json'
        },
        {
          name: '--pattern',
          description: 'Upgrade packages matching pattern',
          args: { name: 'pattern' }
        },
        {
          name: '--scope',
          description: 'Upgrade packages under scope',
          args: { name: 'scope' }
        },
        {
          name: ['-S', '--exact'],
          description: 'Install exact version'
        },
        {
          name: ['-T', '--tilde'],
          description: 'Install most recent release with same minor version'
        },
        {
          name: ['-C', '--caret'],
          description: 'Install most recent release with same major version'
        }
      ]
    },
    {
      name: 'upgrade-interactive',
      description: 'Upgrade packages interactively',
      options: [
        {
          name: '--latest',
          description: 'List packages to upgrade to their latest version'
        }
      ]
    },
    {
      name: 'version',
      description: 'Update package version',
      args: {
        name: 'version',
        description: 'New version or version bump type',
        isOptional: true,
        suggestions: [
          { name: 'major', description: 'Increment major version' },
          { name: 'minor', description: 'Increment minor version' },
          { name: 'patch', description: 'Increment patch version' },
          { name: 'premajor', description: 'Increment major version with prerelease' },
          { name: 'preminor', description: 'Increment minor version with prerelease' },
          { name: 'prepatch', description: 'Increment patch version with prerelease' },
          { name: 'prerelease', description: 'Increment prerelease version' }
        ]
      },
      options: [
        {
          name: '--new-version',
          description: 'New version',
          args: { name: 'version' }
        },
        {
          name: '--message',
          description: 'Commit message when creating git tag',
          args: { name: 'message' }
        },
        {
          name: '--no-git-tag-version',
          description: 'Do not create git tag'
        },
        {
          name: '--no-commit-hooks',
          description: 'Skip git commit hooks'
        }
      ]
    },
    {
      name: 'versions',
      description: 'Display version information of current package',
      options: [
        {
          name: '--json',
          description: 'Format output as JSON'
        }
      ]
    },
    {
      name: 'why',
      description: 'Show why a package is installed',
      args: {
        name: 'package',
        description: 'Package name to explain'
      }
    },
    {
      name: 'workspace',
      description: 'Run commands within workspace context',
      args: {
        name: 'workspace',
        description: 'Workspace name',
        generators: [yarnWorkspaceGenerator]
      }
    },
    {
      name: 'workspaces',
      description: 'Show information about project workspaces',
      subcommands: [
        {
          name: 'info',
          description: 'Show workspaces dependency tree',
          options: [
            {
              name: '--json',
              description: 'Format output as JSON'
            }
          ]
        },
        {
          name: 'run',
          description: 'Run command in each workspace',
          args: {
            name: 'command',
            description: 'Command to run',
            generators: [npmScripts]
          }
        }
      ]
    }
  ]
};