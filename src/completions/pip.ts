import { CompletionSpec, Generator } from '../types.js';

// pip completion spec for CLIFlow
const pipPackageGenerator: Generator = {
  script: 'pip search --index-url=https://pypi.org/pypi --no-deps --disable-pip-version-check 2>/dev/null || pip list --format=freeze 2>/dev/null | head -20',
  postProcess: (output) => {
    if (output.includes('DEPRECATION') || output.trim() === '') {
      // Fallback to common packages if pip search fails
      return [
        { name: 'requests', description: 'HTTP library', type: 'argument' as const, icon: '📦', priority: 100 },
        { name: 'numpy', description: 'Numerical computing', type: 'argument' as const, icon: '📦', priority: 100 },
        { name: 'pandas', description: 'Data analysis', type: 'argument' as const, icon: '📦', priority: 100 },
        { name: 'flask', description: 'Web framework', type: 'argument' as const, icon: '📦', priority: 100 },
        { name: 'django', description: 'Web framework', type: 'argument' as const, icon: '📦', priority: 100 }
      ];
    }
    return output.split('\n')
      .filter(line => line.trim() && !line.includes('DEPRECATION'))
      .slice(0, 15)
      .map(line => {
        const parts = line.includes('==') ? line.split('==') : [line.trim()];
        const name = parts[0]?.trim() || line.trim();
        const version = parts[1] || '';
        return {
          name: name,
          description: version ? `Version: ${version}` : 'Python package',
          type: 'argument' as const,
          icon: '📦',
          priority: 100
        };
      });
  },
  cache: { ttl: 600000, strategy: 'ttl' as const }
};

const pipInstalledGenerator: Generator = {
  script: 'pip list --format=freeze --disable-pip-version-check 2>/dev/null',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n')
      .filter(line => line.trim() && line.includes('=='))
      .slice(0, 20)
      .map(line => {
        const [name, version] = line.split('==');
        return {
          name: name?.trim() || line.trim(),
          description: version ? `Installed: ${version}` : 'Installed package',
          type: 'argument' as const,
          icon: '✅',
          priority: 100
        };
      });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

const pipRequirementsGenerator: Generator = {
  script: 'find . -maxdepth 2 -name "*requirements*.txt" 2>/dev/null',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [{ name: 'requirements.txt', description: 'Default requirements file', type: 'argument' as const, icon: '📄', priority: 100 }];
    }
    return output.split('\n').filter(line => line.trim()).map(file => ({
      name: file.replace('./', ''),
      description: 'Requirements file',
      type: 'argument' as const,
      icon: '📄',
      priority: 100
    }));
  },
  cache: { ttl: 300000, strategy: 'ttl' as const }
};

export const pipSpec: CompletionSpec = {
  name: 'pip',
  description: 'Python package installer',
  options: [
    {
      name: ['-h', '--help'],
      description: 'Show help message and exit'
    },
    {
      name: '--isolated',
      description: 'Run pip in an isolated mode'
    },
    {
      name: ['-v', '--verbose'],
      description: 'Give more output'
    },
    {
      name: ['-V', '--version'],
      description: 'Show version and exit'
    },
    {
      name: ['-q', '--quiet'],
      description: 'Give less output'
    },
    {
      name: '--log',
      description: 'Path to a verbose appending log',
      args: {
        name: 'path',
        template: ['filepaths']
      }
    },
    {
      name: '--no-input',
      description: 'Disable prompting for input'
    },
    {
      name: '--proxy',
      description: 'Specify proxy in format [user:passwd@]proxy.server:port',
      args: { name: 'proxy' }
    },
    {
      name: '--retries',
      description: 'Maximum number of retries each connection should attempt',
      args: { name: 'retries' }
    },
    {
      name: '--timeout',
      description: 'Set socket timeout',
      args: { name: 'sec' }
    },
    {
      name: '--exists-action',
      description: 'Action when path already exists',
      args: {
        name: 'action',
        suggestions: [
          { name: 's', description: 'Switch' },
          { name: 'i', description: 'Ignore' },
          { name: 'w', description: 'Wipe' },
          { name: 'b', description: 'Backup' },
          { name: 'a', description: 'Abort' }
        ]
      }
    },
    {
      name: '--trusted-host',
      description: 'Mark host as trusted',
      args: { name: 'hostname', isVariadic: true }
    },
    {
      name: '--cert',
      description: 'Path to alternate CA bundle',
      args: {
        name: 'path',
        template: ['filepaths']
      }
    },
    {
      name: '--client-cert',
      description: 'Path to SSL client certificate',
      args: {
        name: 'path',
        template: ['filepaths']
      }
    },
    {
      name: '--cache-dir',
      description: 'Store cache files in directory',
      args: {
        name: 'dir',
        template: ['folders']
      }
    },
    {
      name: '--no-cache-dir',
      description: 'Disable cache'
    },
    {
      name: '--disable-pip-version-check',
      description: 'Do not check for new pip version'
    }
  ],
  subcommands: [
    {
      name: 'install',
      description: 'Install packages',
      args: {
        name: 'package',
        description: 'Package to install',
        generators: [pipPackageGenerator],
        isVariadic: true
      },
      options: [
        {
          name: ['-r', '--requirement'],
          description: 'Install from requirements file',
          args: {
            name: 'file',
            generators: [pipRequirementsGenerator],
            template: ['filepaths']
          }
        },
        {
          name: ['-c', '--constraint'],
          description: 'Constrain versions using given constraints file',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: '--no-deps',
          description: 'Do not install package dependencies'
        },
        {
          name: ['--pre'],
          description: 'Include pre-release and development versions'
        },
        {
          name: ['-e', '--editable'],
          description: 'Install in editable mode',
          args: {
            name: 'path/url',
            template: ['folders', 'filepaths']
          }
        },
        {
          name: ['-t', '--target'],
          description: 'Install packages into directory',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: '--platform',
          description: 'Only use wheels compatible with platform',
          args: { name: 'platform' }
        },
        {
          name: '--python-version',
          description: 'Python version to use for wheel selection',
          args: { name: 'python_version' }
        },
        {
          name: '--implementation',
          description: 'Python implementation to use for wheel selection',
          args: {
            name: 'implementation',
            suggestions: [
              { name: 'pp', description: 'PyPy' },
              { name: 'jy', description: 'Jython' },
              { name: 'cp', description: 'CPython' },
              { name: 'ip', description: 'IronPython' }
            ]
          }
        },
        {
          name: '--abi',
          description: 'Only use wheels compatible with Python ABI',
          args: { name: 'abi' }
        },
        {
          name: '--user',
          description: 'Install to user directory'
        },
        {
          name: '--root',
          description: 'Install everything relative to this alternate root directory',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: '--prefix',
          description: 'Installation prefix',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: ['-b', '--build'],
          description: 'Directory to unpack packages into',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: '--src',
          description: 'Directory to check out editable projects',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: ['-U', '--upgrade'],
          description: 'Upgrade packages to newest available version'
        },
        {
          name: '--upgrade-strategy',
          description: 'Strategy to upgrade dependencies',
          args: {
            name: 'upgrade_strategy',
            suggestions: [
              { name: 'eager', description: 'Upgrade all dependencies' },
              { name: 'only-if-needed', description: 'Upgrade only when needed' }
            ]
          }
        },
        {
          name: '--force-reinstall',
          description: 'Reinstall all packages even if up-to-date'
        },
        {
          name: ['-I', '--ignore-installed'],
          description: 'Ignore installed packages'
        },
        {
          name: '--ignore-requires-python',
          description: 'Ignore requires-python'
        },
        {
          name: '--no-build-isolation',
          description: 'Disable build isolation'
        },
        {
          name: '--use-pep517',
          description: 'Use PEP 517 for building source distributions'
        },
        {
          name: '--no-use-pep517',
          description: 'Do not use PEP 517 for building source distributions'
        },
        {
          name: '--install-option',
          description: 'Extra arguments to be supplied to setup.py install',
          args: { name: 'options', isVariadic: true }
        },
        {
          name: '--global-option',
          description: 'Extra global options to be supplied to setup.py',
          args: { name: 'options', isVariadic: true }
        },
        {
          name: '--compile',
          description: 'Compile Python source files to bytecode'
        },
        {
          name: '--no-compile',
          description: 'Do not compile Python source files'
        },
        {
          name: '--no-warn-script-location',
          description: 'Do not warn when installing scripts outside PATH'
        },
        {
          name: '--no-warn-conflicts',
          description: 'Do not warn about broken dependencies'
        },
        {
          name: '--no-binary',
          description: 'Do not use binary packages',
          args: { name: 'format_control' }
        },
        {
          name: '--only-binary',
          description: 'Do not use source packages',
          args: { name: 'format_control' }
        },
        {
          name: '--prefer-binary',
          description: 'Prefer older binary packages over newer source packages'
        },
        {
          name: '--require-hashes',
          description: 'Require hash for every requirement'
        },
        {
          name: '--progress-bar',
          description: 'Progress bar type',
          args: {
            name: 'progress_bar',
            suggestions: [
              { name: 'off', description: 'No progress bar' },
              { name: 'on', description: 'Use progress bar' },
              { name: 'ascii', description: 'ASCII progress bar' },
              { name: 'pretty', description: 'Pretty progress bar' },
              { name: 'emoji', description: 'Emoji progress bar' }
            ]
          }
        }
      ]
    },
    {
      name: 'download',
      description: 'Download packages',
      args: {
        name: 'package',
        description: 'Package to download',
        generators: [pipPackageGenerator],
        isVariadic: true
      },
      options: [
        {
          name: ['-r', '--requirement'],
          description: 'Download from requirements file',
          args: {
            name: 'file',
            generators: [pipRequirementsGenerator],
            template: ['filepaths']
          }
        },
        {
          name: ['-c', '--constraint'],
          description: 'Constrain versions using given constraints file',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: ['-d', '--dest'],
          description: 'Download packages into directory',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: '--platform',
          description: 'Only download wheels compatible with platform',
          args: { name: 'platform' }
        },
        {
          name: '--python-version',
          description: 'Python version to use for wheel selection',
          args: { name: 'python_version' }
        },
        {
          name: '--implementation',
          description: 'Python implementation to use for wheel selection',
          args: {
            name: 'implementation',
            suggestions: [
              { name: 'pp', description: 'PyPy' },
              { name: 'jy', description: 'Jython' },
              { name: 'cp', description: 'CPython' },
              { name: 'ip', description: 'IronPython' }
            ]
          }
        },
        {
          name: '--abi',
          description: 'Only download wheels compatible with Python ABI',
          args: { name: 'abi' }
        },
        {
          name: '--no-deps',
          description: 'Do not download package dependencies'
        },
        {
          name: '--pre',
          description: 'Include pre-release and development versions'
        },
        {
          name: '--no-binary',
          description: 'Do not use binary packages',
          args: { name: 'format_control' }
        },
        {
          name: '--only-binary',
          description: 'Do not use source packages',
          args: { name: 'format_control' }
        },
        {
          name: '--prefer-binary',
          description: 'Prefer binary packages over source packages'
        },
        {
          name: '--src',
          description: 'Directory to check out editable projects',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: '--require-hashes',
          description: 'Require hash for every requirement'
        }
      ]
    },
    {
      name: 'uninstall',
      description: 'Uninstall packages',
      args: {
        name: 'package',
        description: 'Package to uninstall',
        generators: [pipInstalledGenerator],
        isVariadic: true
      },
      options: [
        {
          name: ['-r', '--requirement'],
          description: 'Uninstall from requirements file',
          args: {
            name: 'file',
            generators: [pipRequirementsGenerator],
            template: ['filepaths']
          }
        },
        {
          name: ['-y', '--yes'],
          description: 'Do not ask for confirmation'
        }
      ]
    },
    {
      name: 'freeze',
      description: 'Output installed packages in requirements format',
      options: [
        {
          name: ['-r', '--requirement'],
          description: 'Use order of packages from given requirements file',
          args: {
            name: 'file',
            generators: [pipRequirementsGenerator],
            template: ['filepaths']
          }
        },
        {
          name: ['-l', '--local'],
          description: 'If in virtualenv, do not show globally-installed packages'
        },
        {
          name: '--user',
          description: 'Only output packages installed in user-site'
        },
        {
          name: '--all',
          description: 'Include packages distributed with Python'
        },
        {
          name: '--exclude-editable',
          description: 'Exclude editable package from output'
        },
        {
          name: '--exclude',
          description: 'Exclude specified package from output',
          args: { name: 'package', isVariadic: true }
        }
      ]
    },
    {
      name: 'list',
      description: 'List installed packages',
      options: [
        {
          name: ['-o', '--outdated'],
          description: 'List outdated packages'
        },
        {
          name: ['-u', '--uptodate'],
          description: 'List uptodate packages'
        },
        {
          name: ['-e', '--editable'],
          description: 'List editable projects'
        },
        {
          name: ['-l', '--local'],
          description: 'If in virtualenv, do not show globally-installed packages'
        },
        {
          name: '--user',
          description: 'Only output packages installed in user-site'
        },
        {
          name: '--format',
          description: 'Output format',
          args: {
            name: 'format',
            suggestions: [
              { name: 'columns', description: 'Columns format' },
              { name: 'freeze', description: 'Freeze format' },
              { name: 'json', description: 'JSON format' }
            ]
          }
        },
        {
          name: '--not-required',
          description: 'List packages that are not dependencies'
        },
        {
          name: '--exclude-editable',
          description: 'Exclude editable package from output'
        },
        {
          name: '--include-editable',
          description: 'Include editable package from output'
        },
        {
          name: '--exclude',
          description: 'Exclude specified package from output',
          args: { name: 'package', isVariadic: true }
        }
      ]
    },
    {
      name: 'show',
      description: 'Show information about installed packages',
      args: {
        name: 'package',
        description: 'Package to show info for',
        generators: [pipInstalledGenerator],
        isVariadic: true
      },
      options: [
        {
          name: ['-f', '--files'],
          description: 'Show full list of installed files'
        },
        {
          name: '--verbose',
          description: 'Show more information'
        }
      ]
    },
    {
      name: 'cache',
      description: 'Inspect and manage pip cache',
      subcommands: [
        {
          name: 'dir',
          description: 'Show cache directory'
        },
        {
          name: 'info',
          description: 'Show information about cache',
          args: {
            name: 'pattern',
            description: 'Pattern to match packages',
            isOptional: true
          }
        },
        {
          name: 'list',
          description: 'List cached packages',
          args: {
            name: 'pattern',
            description: 'Pattern to match packages',
            isOptional: true
          },
          options: [
            {
              name: '--format',
              description: 'Output format',
              args: {
                name: 'format',
                suggestions: [
                  { name: 'human', description: 'Human readable' },
                  { name: 'abspath', description: 'Absolute paths' }
                ]
              }
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove cached packages',
          args: {
            name: 'pattern',
            description: 'Pattern to match packages',
            isVariadic: true
          }
        },
        {
          name: 'purge',
          description: 'Remove all cached packages'
        }
      ]
    },
    {
      name: 'check',
      description: 'Verify installed packages have compatible dependencies',
      options: [
        {
          name: '--format',
          description: 'Output format',
          args: {
            name: 'format',
            suggestions: [
              { name: 'text', description: 'Text format' },
              { name: 'json', description: 'JSON format' }
            ]
          }
        }
      ]
    },
    {
      name: 'config',
      description: 'Manage local and global configuration',
      subcommands: [
        {
          name: 'list',
          description: 'List configuration'
        },
        {
          name: 'edit',
          description: 'Edit configuration file',
          options: [
            {
              name: '--editor',
              description: 'Editor to use',
              args: { name: 'editor' }
            },
            {
              name: '--global',
              description: 'Edit global configuration'
            },
            {
              name: '--user',
              description: 'Edit user configuration'
            },
            {
              name: '--site',
              description: 'Edit site configuration'
            }
          ]
        },
        {
          name: 'get',
          description: 'Get configuration value',
          args: {
            name: 'name',
            description: 'Configuration name'
          }
        },
        {
          name: 'set',
          description: 'Set configuration value',
          args: [
            {
              name: 'name',
              description: 'Configuration name'
            },
            {
              name: 'value',
              description: 'Configuration value'
            }
          ],
          options: [
            {
              name: '--global',
              description: 'Set global configuration'
            },
            {
              name: '--user',
              description: 'Set user configuration'
            },
            {
              name: '--site',
              description: 'Set site configuration'
            }
          ]
        },
        {
          name: 'unset',
          description: 'Unset configuration value',
          args: {
            name: 'name',
            description: 'Configuration name'
          },
          options: [
            {
              name: '--global',
              description: 'Unset global configuration'
            },
            {
              name: '--user',
              description: 'Unset user configuration'
            },
            {
              name: '--site',
              description: 'Unset site configuration'
            }
          ]
        }
      ]
    },
    {
      name: 'search',
      description: 'Search PyPI for packages',
      args: {
        name: 'query',
        description: 'Search query',
        isVariadic: true
      }
    },
    {
      name: 'wheel',
      description: 'Build wheels from requirements',
      args: {
        name: 'package',
        description: 'Package to build wheel for',
        generators: [pipPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: ['-w', '--wheel-dir'],
          description: 'Build wheels into directory',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: ['-r', '--requirement'],
          description: 'Build wheels from requirements file',
          args: {
            name: 'file',
            generators: [pipRequirementsGenerator],
            template: ['filepaths']
          }
        },
        {
          name: ['-c', '--constraint'],
          description: 'Constrain versions using given constraints file',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: ['-e', '--editable'],
          description: 'Build editable wheel',
          args: {
            name: 'path/url',
            template: ['folders', 'filepaths']
          }
        },
        {
          name: '--no-binary',
          description: 'Do not use binary packages',
          args: { name: 'format_control' }
        },
        {
          name: '--only-binary',
          description: 'Do not use source packages',
          args: { name: 'format_control' }
        },
        {
          name: '--prefer-binary',
          description: 'Prefer binary packages over source packages'
        },
        {
          name: '--no-build-isolation',
          description: 'Disable build isolation'
        },
        {
          name: '--use-pep517',
          description: 'Use PEP 517 for building source distributions'
        },
        {
          name: '--no-use-pep517',
          description: 'Do not use PEP 517 for building source distributions'
        },
        {
          name: '--no-deps',
          description: 'Do not build dependencies'
        },
        {
          name: ['-b', '--build'],
          description: 'Directory to unpack packages into',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: '--global-option',
          description: 'Extra global options to be supplied to setup.py',
          args: { name: 'options', isVariadic: true }
        },
        {
          name: '--pre',
          description: 'Include pre-release and development versions'
        },
        {
          name: '--require-hashes',
          description: 'Require hash for every requirement'
        }
      ]
    },
    {
      name: 'hash',
      description: 'Compute hashes of package archives',
      args: {
        name: 'file',
        description: 'File to hash',
        template: ['filepaths'],
        isVariadic: true
      },
      options: [
        {
          name: ['-a', '--algorithm'],
          description: 'Hash algorithm to use',
          args: {
            name: 'algorithm',
            suggestions: [
              { name: 'sha256', description: 'SHA256 algorithm' },
              { name: 'sha384', description: 'SHA384 algorithm' },
              { name: 'sha512', description: 'SHA512 algorithm' }
            ]
          }
        }
      ]
    },
    {
      name: 'completion',
      description: 'Generate shell completions',
      options: [
        {
          name: '--bash',
          description: 'Generate Bash completion'
        },
        {
          name: '--zsh',
          description: 'Generate Zsh completion'
        },
        {
          name: '--fish',
          description: 'Generate Fish completion'
        }
      ]
    },
    {
      name: 'debug',
      description: 'Show debug information',
      options: [
        {
          name: '--platform',
          description: 'Show platform tags'
        },
        {
          name: '--abi',
          description: 'Show ABI tags'
        },
        {
          name: '--implementation',
          description: 'Show implementation'
        }
      ]
    },
    {
      name: 'help',
      description: 'Show help for commands',
      args: {
        name: 'command',
        description: 'Command to get help for',
        isOptional: true
      }
    }
  ]
};