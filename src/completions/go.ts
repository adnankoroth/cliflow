import { CompletionSpec, Generator } from '../types.js';

// go completion spec for CLIFlow  
const goPackageGenerator: Generator = {
  script: 'go list -m all 2>/dev/null | head -20',
  postProcess: (output) => {
    if (output.includes('no go.mod file') || output.trim() === '') {
      return [];
    }
    return output.split('\n').filter(line => line.trim() && !line.includes(' ')).map(pkg => ({
      name: pkg.trim(),
      description: 'Go module',
      type: 'argument' as const,
      icon: '📦',
      priority: 100
    }));
  },
  cache: { ttl: 300000, strategy: 'ttl' as const }
};

const goTestPackageGenerator: Generator = {
  script: 'go list ./... 2>/dev/null',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [{ name: './...', description: 'All packages', type: 'argument' as const, icon: '📦', priority: 100 }];
    }
    return output.split('\n').filter(line => line.trim()).map(pkg => ({
      name: pkg.trim(),
      description: 'Go package',
      type: 'argument' as const,
      icon: '📦',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

const goBenchmarkGenerator: Generator = {
  script: 'find . -name "*.go" -exec grep -l "func Benchmark" {} \\; 2>/dev/null | head -10',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n').filter(line => line.trim()).map(file => {
      const name = file.replace('./', '').replace('.go', '');
      return {
        name: name,
        description: 'Benchmark file',
        type: 'argument' as const,
        icon: '🏃',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

const goEnvironmentGenerator: Generator = {
  script: 'go env',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n').filter(line => line.includes('=')).slice(0, 15).map(line => {
      const [key] = line.split('=');
      return {
        name: key,
        description: 'Go environment variable',
        type: 'argument' as const,
        icon: '🔧',
        priority: 100
      };
    });
  },
  cache: { ttl: 300000, strategy: 'ttl' as const }
};

export const goSpec: CompletionSpec = {
  name: 'go',
  description: 'Go programming language toolchain',
  options: [
    {
      name: ['-h', '--help'],
      description: 'Print help message'
    }
  ],
  subcommands: [
    {
      name: 'bug',
      description: 'Start a bug report'
    },
    {
      name: 'build',
      description: 'Compile packages and dependencies',
      args: {
        name: 'packages',
        description: 'Packages to build',
        generators: [goPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: '-a',
          description: 'Force rebuilding of packages that are already up-to-date'
        },
        {
          name: '-n',
          description: 'Print commands but do not run them'
        },
        {
          name: ['-p'],
          description: 'Number of programs to run in parallel',
          args: { name: 'n' }
        },
        {
          name: '-race',
          description: 'Enable data race detection'
        },
        {
          name: '-msan',
          description: 'Enable memory sanitizer'
        },
        {
          name: '-asan',
          description: 'Enable address sanitizer'
        },
        {
          name: ['-v'],
          description: 'Print names of packages as they are compiled'
        },
        {
          name: '-work',
          description: 'Print temporary work directory and do not delete it'
        },
        {
          name: ['-x'],
          description: 'Print commands as they are executed'
        },
        {
          name: '-asmflags',
          description: 'Arguments to pass to go tool asm',
          args: { name: 'flags' }
        },
        {
          name: '-buildmode',
          description: 'Build mode',
          args: {
            name: 'mode',
            suggestions: [
              { name: 'archive', description: 'Build into archive (.a) files' },
              { name: 'c-archive', description: 'Build into C archive' },
              { name: 'c-shared', description: 'Build into C shared library' },
              { name: 'default', description: 'Default build mode' },
              { name: 'shared', description: 'Build into shared library' },
              { name: 'exe', description: 'Build into executable' },
              { name: 'pie', description: 'Build into position independent executable' },
              { name: 'plugin', description: 'Build into plugin' }
            ]
          }
        },
        {
          name: '-buildvcs',
          description: 'Include VCS information',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'Include VCS info' },
              { name: 'false', description: 'Exclude VCS info' },
              { name: 'auto', description: 'Auto-detect VCS info' }
            ]
          }
        },
        {
          name: '-compiler',
          description: 'Compiler to use',
          args: {
            name: 'name',
            suggestions: [
              { name: 'gc', description: 'Go compiler' },
              { name: 'gccgo', description: 'GCC Go compiler' }
            ]
          }
        },
        {
          name: '-gccgoflags',
          description: 'Arguments to pass to gccgo',
          args: { name: 'flags' }
        },
        {
          name: '-gcflags',
          description: 'Arguments to pass to go tool compile',
          args: { name: 'flags' }
        },
        {
          name: '-installsuffix',
          description: 'Suffix to use in package installation directory',
          args: { name: 'suffix' }
        },
        {
          name: '-ldflags',
          description: 'Arguments to pass to go tool link',
          args: { name: 'flags' }
        },
        {
          name: '-linkshared',
          description: 'Link against shared libraries'
        },
        {
          name: '-mod',
          description: 'Module download mode',
          args: {
            name: 'mode',
            suggestions: [
              { name: 'readonly', description: 'Disallow updates to go.mod' },
              { name: 'vendor', description: 'Use vendor directory' },
              { name: 'mod', description: 'Download modules to module cache' }
            ]
          }
        },
        {
          name: '-modcacherw',
          description: 'Leave newly-created directories in module cache read-write'
        },
        {
          name: '-modfile',
          description: 'Read go.mod from alternate location',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: '-o',
          description: 'Output file or directory',
          args: {
            name: 'file',
            template: ['filepaths', 'folders']
          }
        },
        {
          name: '-overlay',
          description: 'Read build overlay from JSON file',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: '-pkgdir',
          description: 'Install and load packages from dir',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: '-tags',
          description: 'Comma-separated list of build tags',
          args: { name: 'tags' }
        },
        {
          name: '-trimpath',
          description: 'Remove all file system paths from executable'
        },
        {
          name: '-toolexec',
          description: 'Program to use to invoke toolchain programs',
          args: { name: 'cmd' }
        }
      ]
    },
    {
      name: 'clean',
      description: 'Remove object files and cached files',
      args: {
        name: 'packages',
        description: 'Packages to clean',
        generators: [goPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: '-i',
          description: 'Remove corresponding installed archive or binary'
        },
        {
          name: '-n',
          description: 'Print commands but do not run them'
        },
        {
          name: ['-r'],
          description: 'Clean recursively on all dependencies'
        },
        {
          name: ['-x'],
          description: 'Print commands as they are executed'
        },
        {
          name: '-cache',
          description: 'Remove entire module download cache'
        },
        {
          name: '-testcache',
          description: 'Remove all cached test results'
        },
        {
          name: '-modcache',
          description: 'Remove entire module download cache'
        },
        {
          name: '-fuzzcache',
          description: 'Remove files stored in fuzz cache'
        }
      ]
    },
    {
      name: 'doc',
      description: 'Show documentation for package or symbol',
      args: {
        name: 'package',
        description: 'Package or symbol to document',
        generators: [goPackageGenerator],
        isOptional: true
      },
      options: [
        {
          name: ['-all'],
          description: 'Show all documentation'
        },
        {
          name: ['-c'],
          description: 'Show constants'
        },
        {
          name: ['-cmd'],
          description: 'Treat command as package'
        },
        {
          name: ['-short'],
          description: 'Show short documentation'
        },
        {
          name: ['-src'],
          description: 'Show source code'
        },
        {
          name: ['-u'],
          description: 'Show unexported symbols'
        }
      ]
    },
    {
      name: 'env',
      description: 'Print Go environment information',
      args: {
        name: 'var',
        description: 'Environment variable to print',
        generators: [goEnvironmentGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: '-json',
          description: 'Print environment in JSON format'
        },
        {
          name: ['-u'],
          description: 'Unset default value for named environment variables',
          args: { name: 'var', isVariadic: true }
        },
        {
          name: ['-w'],
          description: 'Set default value for named environment variables',
          args: { name: 'var=value', isVariadic: true }
        }
      ]
    },
    {
      name: 'fix',
      description: 'Update packages to use new APIs',
      args: {
        name: 'packages',
        description: 'Packages to fix',
        generators: [goPackageGenerator],
        isOptional: true,
        isVariadic: true
      }
    },
    {
      name: 'fmt',
      description: 'Format Go source files',
      args: {
        name: 'packages',
        description: 'Packages to format',
        generators: [goPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: ['-n'],
          description: 'Print commands but do not run them'
        },
        {
          name: ['-x'],
          description: 'Print commands as they are executed'
        }
      ]
    },
    {
      name: 'generate',
      description: 'Generate Go files by processing source',
      args: {
        name: 'packages',
        description: 'Packages to generate',
        generators: [goPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: ['-n'],
          description: 'Print commands but do not run them'
        },
        {
          name: ['-v'],
          description: 'Print names of packages as they are compiled'
        },
        {
          name: ['-x'],
          description: 'Print commands as they are executed'
        },
        {
          name: '-run',
          description: 'Run only generators matching regexp',
          args: { name: 'regexp' }
        }
      ]
    },
    {
      name: 'get',
      description: 'Add dependencies to current module and install them',
      args: {
        name: 'packages',
        description: 'Packages to get',
        generators: [goPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: ['-d'],
          description: 'Download only; do not install'
        },
        {
          name: ['-f'],
          description: 'Force get to ignore checked-out or dirty state'
        },
        {
          name: ['-t'],
          description: 'Download test dependencies'
        },
        {
          name: ['-u'],
          description: 'Update modules providing named packages'
        },
        {
          name: ['-v'],
          description: 'Enable verbose progress and debug output'
        },
        {
          name: '-fix',
          description: 'Run fix tool before resolving dependencies'
        },
        {
          name: '-insecure',
          description: 'Allow fetching from insecure schemes'
        }
      ]
    },
    {
      name: 'install',
      description: 'Compile and install packages and dependencies',
      args: {
        name: 'packages',
        description: 'Packages to install',
        generators: [goPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: ['-a'],
          description: 'Force rebuilding of packages that are already up-to-date'
        },
        {
          name: ['-n'],
          description: 'Print commands but do not run them'
        },
        {
          name: ['-race'],
          description: 'Enable data race detection'
        },
        {
          name: ['-msan'],
          description: 'Enable memory sanitizer'
        },
        {
          name: ['-asan'],
          description: 'Enable address sanitizer'
        },
        {
          name: ['-v'],
          description: 'Print names of packages as they are compiled'
        },
        {
          name: ['-work'],
          description: 'Print temporary work directory and do not delete it'
        },
        {
          name: ['-x'],
          description: 'Print commands as they are executed'
        }
      ]
    },
    {
      name: 'list',
      description: 'List packages or modules',
      args: {
        name: 'packages',
        description: 'Packages to list',
        generators: [goPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: ['-compiled'],
          description: 'Set CompiledGoFiles to compiled Go source files'
        },
        {
          name: ['-deps'],
          description: 'Iterate over dependencies as well as named packages'
        },
        {
          name: ['-e'],
          description: 'Change handling of erroneous packages'
        },
        {
          name: ['-export'],
          description: 'Set Export to file containing export data'
        },
        {
          name: ['-f'],
          description: 'Specify alternate format for output',
          args: { name: 'format' }
        },
        {
          name: ['-find'],
          description: 'Identify named packages but do not resolve dependencies'
        },
        {
          name: ['-json'],
          description: 'Print package data in JSON format'
        },
        {
          name: ['-m'],
          description: 'List modules instead of packages'
        },
        {
          name: ['-test'],
          description: 'Report test binaries as well'
        },
        {
          name: ['-u'],
          description: 'Add information about available upgrades'
        },
        {
          name: ['-versions'],
          description: 'Set Module.Versions to list available versions'
        }
      ]
    },
    {
      name: 'mod',
      description: 'Module maintenance',
      subcommands: [
        {
          name: 'download',
          description: 'Download modules to local cache',
          args: {
            name: 'modules',
            description: 'Modules to download',
            generators: [goPackageGenerator],
            isOptional: true,
            isVariadic: true
          },
          options: [
            {
              name: ['-json'],
              description: 'Print sequence of JSON objects'
            },
            {
              name: ['-x'],
              description: 'Print commands as they are executed'
            }
          ]
        },
        {
          name: 'edit',
          description: 'Edit go.mod from tools or scripts',
          options: [
            {
              name: '-fmt',
              description: 'Reformat go.mod file without making changes'
            },
            {
              name: '-module',
              description: 'Change module path',
              args: { name: 'path' }
            },
            {
              name: '-require',
              description: 'Add requirement',
              args: { name: 'path@version', isVariadic: true }
            },
            {
              name: '-droprequire',
              description: 'Drop requirement',
              args: { name: 'path', isVariadic: true }
            },
            {
              name: '-exclude',
              description: 'Add exclusion',
              args: { name: 'path@version', isVariadic: true }
            },
            {
              name: '-dropexclude',
              description: 'Drop exclusion',
              args: { name: 'path@version', isVariadic: true }
            },
            {
              name: '-replace',
              description: 'Add replacement',
              args: { name: 'old[@v]=new[@w]', isVariadic: true }
            },
            {
              name: '-dropreplace',
              description: 'Drop replacement',
              args: { name: 'old[@v]', isVariadic: true }
            },
            {
              name: '-retract',
              description: 'Add retraction',
              args: { name: '[v1.1.0|v1.2.0]', isVariadic: true }
            },
            {
              name: '-dropretract',
              description: 'Drop retraction',
              args: { name: '[v1.1.0|v1.2.0]', isVariadic: true }
            },
            {
              name: '-go',
              description: 'Set Go version requirement',
              args: { name: 'version' }
            },
            {
              name: '-print',
              description: 'Print final go.mod in text format'
            },
            {
              name: '-json',
              description: 'Print final go.mod in JSON format'
            }
          ]
        },
        {
          name: 'graph',
          description: 'Print module requirement graph'
        },
        {
          name: 'init',
          description: 'Initialize new module in current directory',
          args: {
            name: 'module',
            description: 'Module path',
            isOptional: true
          }
        },
        {
          name: 'tidy',
          description: 'Add missing and remove unused modules',
          options: [
            {
              name: ['-v'],
              description: 'Print information about removed modules'
            },
            {
              name: ['-e'],
              description: 'Attempt to proceed despite errors'
            },
            {
              name: '-go',
              description: 'Update go.mod to given Go version',
              args: { name: 'version' }
            },
            {
              name: '-compat',
              description: 'Preserve compatibility with given Go version',
              args: { name: 'version' }
            }
          ]
        },
        {
          name: 'vendor',
          description: 'Make vendored copy of dependencies',
          options: [
            {
              name: ['-v'],
              description: 'Print names of vendored modules'
            },
            {
              name: ['-e'],
              description: 'Attempt to proceed despite errors'
            },
            {
              name: ['-o'],
              description: 'Create vendor directory at given path',
              args: {
                name: 'dir',
                template: ['folders']
              }
            }
          ]
        },
        {
          name: 'verify',
          description: 'Verify dependencies have expected content'
        },
        {
          name: 'why',
          description: 'Explain why packages or modules are needed',
          args: {
            name: 'packages',
            description: 'Packages to explain',
            generators: [goPackageGenerator],
            isVariadic: true
          },
          options: [
            {
              name: ['-m'],
              description: 'Treat arguments as modules'
            },
            {
              name: ['-vendor'],
              description: 'Exclude tests of dependencies'
            }
          ]
        }
      ]
    },
    {
      name: 'work',
      description: 'Workspace maintenance',
      subcommands: [
        {
          name: 'edit',
          description: 'Edit go.work from tools or scripts',
          options: [
            {
              name: '-fmt',
              description: 'Reformat go.work file without making changes'
            },
            {
              name: '-use',
              description: 'Add use directive',
              args: { name: 'path', isVariadic: true }
            },
            {
              name: '-dropuse',
              description: 'Drop use directive',
              args: { name: 'path', isVariadic: true }
            },
            {
              name: '-replace',
              description: 'Add replacement',
              args: { name: 'old[@v]=new[@w]', isVariadic: true }
            },
            {
              name: '-dropreplace',
              description: 'Drop replacement',
              args: { name: 'old[@v]', isVariadic: true }
            },
            {
              name: '-go',
              description: 'Set Go version requirement',
              args: { name: 'version' }
            },
            {
              name: '-print',
              description: 'Print final go.work in text format'
            },
            {
              name: '-json',
              description: 'Print final go.work in JSON format'
            }
          ]
        },
        {
          name: 'init',
          description: 'Initialize workspace file',
          args: {
            name: 'moddirs',
            description: 'Module directories',
            template: ['folders'],
            isOptional: true,
            isVariadic: true
          }
        },
        {
          name: 'sync',
          description: 'Sync workspace build list back to modules'
        },
        {
          name: 'use',
          description: 'Add modules to workspace file',
          args: {
            name: 'moddirs',
            description: 'Module directories',
            template: ['folders'],
            isVariadic: true
          },
          options: [
            {
              name: ['-r'],
              description: 'Search recursively for modules'
            }
          ]
        }
      ]
    },
    {
      name: 'run',
      description: 'Compile and run Go program',
      args: [
        {
          name: 'gofiles',
          description: 'Go files to run',
          template: ['filepaths']
        },
        {
          name: 'arguments',
          description: 'Arguments to pass to program',
          isOptional: true,
          isVariadic: true
        }
      ],
      options: [
        {
          name: ['-exec'],
          description: 'Invoke binary using given command',
          args: { name: 'xprog' }
        }
      ]
    },
    {
      name: 'test',
      description: 'Run tests',
      args: {
        name: 'packages',
        description: 'Packages to test',
        generators: [goTestPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: ['-bench'],
          description: 'Run benchmarks matching regexp',
          args: { name: 'regexp' }
        },
        {
          name: ['-benchtime'],
          description: 'Run benchmarks for duration',
          args: { name: 'd' }
        },
        {
          name: ['-benchmem'],
          description: 'Print memory allocations for benchmarks'
        },
        {
          name: ['-blockprofile'],
          description: 'Write goroutine blocking profile',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: ['-blockprofilerate'],
          description: 'Control detail provided in goroutine blocking profiles',
          args: { name: 'rate' }
        },
        {
          name: ['-count'],
          description: 'Run each test and benchmark n times',
          args: { name: 'n' }
        },
        {
          name: ['-cover'],
          description: 'Enable coverage analysis'
        },
        {
          name: ['-covermode'],
          description: 'Coverage analysis mode',
          args: {
            name: 'mode',
            suggestions: [
              { name: 'set', description: 'Did each statement run?' },
              { name: 'count', description: 'How many times did each statement run?' },
              { name: 'atomic', description: 'Like count, but safe for concurrent use' }
            ]
          }
        },
        {
          name: ['-coverpkg'],
          description: 'Apply coverage analysis to packages matching patterns',
          args: { name: 'pattern,pattern,pattern' }
        },
        {
          name: ['-coverprofile'],
          description: 'Write coverage profile',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: ['-cpu'],
          description: 'Comma-separated list of cpu counts',
          args: { name: '1,2,4' }
        },
        {
          name: ['-cpuprofile'],
          description: 'Write cpu profile',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: ['-failfast'],
          description: 'Do not start new tests after first failure'
        },
        {
          name: ['-fuzz'],
          description: 'Run fuzz test matching regexp',
          args: { name: 'regexp' }
        },
        {
          name: ['-fuzztime'],
          description: 'Run fuzz tests for duration',
          args: { name: 'd' }
        },
        {
          name: ['-fuzzminimizetime'],
          description: 'Minimize fuzz tests for duration',
          args: { name: 'd' }
        },
        {
          name: ['-json'],
          description: 'Convert test output to JSON'
        },
        {
          name: ['-ldflags'],
          description: 'Arguments to pass to go tool link',
          args: { name: 'flags' }
        },
        {
          name: ['-list'],
          description: 'List tests, benchmarks, or examples matching regexp',
          args: { name: 'regexp' }
        },
        {
          name: ['-memprofile'],
          description: 'Write memory profile',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: ['-memprofilerate'],
          description: 'Enable more precise memory profiles',
          args: { name: 'rate' }
        },
        {
          name: ['-mutexprofile'],
          description: 'Write mutex contention profile',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: ['-mutexprofilefraction'],
          description: 'Sample 1 in n mutex contention events',
          args: { name: 'n' }
        },
        {
          name: ['-outputdir'],
          description: 'Place output files from profiling in directory',
          args: {
            name: 'dir',
            template: ['folders']
          }
        },
        {
          name: ['-parallel'],
          description: 'Maximum test parallelism',
          args: { name: 'n' }
        },
        {
          name: ['-run'],
          description: 'Run tests and examples matching regexp',
          args: { name: 'regexp' }
        },
        {
          name: ['-short'],
          description: 'Tell long-running tests to shorten their run time'
        },
        {
          name: ['-shuffle'],
          description: 'Randomize execution order of tests and benchmarks',
          args: {
            name: 'mode',
            suggestions: [
              { name: 'off', description: 'Disable shuffling' },
              { name: 'on', description: 'Enable shuffling with random seed' },
              { name: 'N', description: 'Enable shuffling with seed N' }
            ]
          }
        },
        {
          name: ['-timeout'],
          description: 'Timeout for tests',
          args: { name: 'd' }
        },
        {
          name: ['-trace'],
          description: 'Write execution trace',
          args: {
            name: 'file',
            template: ['filepaths']
          }
        },
        {
          name: ['-v'],
          description: 'Verbose: print additional output'
        },
        {
          name: ['-vet'],
          description: 'Configure vet during go test',
          args: { name: 'list' }
        }
      ]
    },
    {
      name: 'tool',
      description: 'Run specified go tool',
      args: {
        name: 'tool',
        description: 'Tool to run',
        suggestions: [
          { name: 'addr2line', description: 'Translate addresses to file and line numbers' },
          { name: 'asm', description: 'Go assembler' },
          { name: 'buildid', description: 'Display or update build ID' },
          { name: 'cgo', description: 'Generate Go bindings for C code' },
          { name: 'compile', description: 'Go compiler' },
          { name: 'cover', description: 'Coverage analysis' },
          { name: 'doc', description: 'Documentation tool' },
          { name: 'fix', description: 'Fix tool for Go source code' },
          { name: 'link', description: 'Go linker' },
          { name: 'nm', description: 'List symbols in object files' },
          { name: 'objdump', description: 'Disassembler for object files' },
          { name: 'pack', description: 'Archive manipulation' },
          { name: 'pprof', description: 'CPU and memory profiler' },
          { name: 'test2json', description: 'Convert test output to JSON' },
          { name: 'trace', description: 'Execution tracer' },
          { name: 'vet', description: 'Go source code analyzer' }
        ]
      },
      options: [
        {
          name: ['-n'],
          description: 'Print command but do not run it'
        }
      ]
    },
    {
      name: 'version',
      description: 'Print Go version',
      options: [
        {
          name: ['-m'],
          description: 'Print module information'
        },
        {
          name: ['-v'],
          description: 'Print verbose information'
        }
      ]
    },
    {
      name: 'vet',
      description: 'Report likely mistakes in packages',
      args: {
        name: 'packages',
        description: 'Packages to vet',
        generators: [goPackageGenerator],
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: ['-n'],
          description: 'Print commands but do not run them'
        },
        {
          name: ['-x'],
          description: 'Print commands as they are executed'
        }
      ]
    }
  ]
};