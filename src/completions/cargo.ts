import { CompletionSpec, Generator } from '../types.js';

// cargo completion spec for CLIFlow
const cargoPackageGenerator: Generator = {
  script: 'cargo search --limit 20 --quiet 2>/dev/null || echo',
  postProcess: (output) => {
    if (output.includes('error:') || output.trim() === '') {
      return [];
    }
    return output.split('\n')
      .filter(line => line.trim() && !line.startsWith(' '))
      .slice(0, 10)
      .map(line => {
        const parts = line.split(' = ');
        const name = parts[0]?.trim() || line.trim();
        const version = parts[1]?.replace(/"/g, '') || '';
        return {
          name: name,
          description: version ? `Version: ${version}` : 'Rust crate',
          type: 'argument' as const,
          icon: '📦',
          priority: 100
        };
      });
  },
  cache: { ttl: 600000, strategy: 'ttl' as const }
};

const cargoBinaryGenerator: Generator = {
  script: 'ls target/debug/ 2>/dev/null | grep -v "\\." | head -10',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n').filter(line => line.trim()).map(binary => ({
      name: binary.trim(),
      description: 'Debug binary',
      type: 'argument' as const,
      icon: '🔧',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

const cargoTargetGenerator: Generator = {
  script: 'rustup target list --installed 2>/dev/null || echo',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [
        { name: 'x86_64-unknown-linux-gnu', description: 'Linux x86_64', type: 'argument' as const, icon: '🎯', priority: 100 },
        { name: 'x86_64-pc-windows-gnu', description: 'Windows x86_64', type: 'argument' as const, icon: '🎯', priority: 100 },
        { name: 'x86_64-apple-darwin', description: 'macOS x86_64', type: 'argument' as const, icon: '🎯', priority: 100 }
      ];
    }
    return output.split('\n').filter(line => line.trim()).map(target => ({
      name: target.trim(),
      description: 'Rust target',
      type: 'argument' as const,
      icon: '🎯',
      priority: 100
    }));
  },
  cache: { ttl: 300000, strategy: 'ttl' as const }
};

export const cargoSpec: CompletionSpec = {
  name: 'cargo',
  description: 'Rust package manager and build tool',
  options: [
    {
      name: ['-V', '--version'],
      description: 'Print version info and exit'
    },
    {
      name: '--list',
      description: 'List installed commands'
    },
    {
      name: '--explain',
      description: 'Provide a detailed explanation of an error message',
      args: { name: 'code' }
    },
    {
      name: ['-v', '--verbose'],
      description: 'Use verbose output'
    },
    {
      name: ['-q', '--quiet'],
      description: 'Do not print cargo log messages'
    },
    {
      name: '--color',
      description: 'Control when colored output is used',
      args: {
        name: 'when',
        suggestions: [
          { name: 'auto', description: 'Automatically detect if color support is available' },
          { name: 'always', description: 'Always display colors' },
          { name: 'never', description: 'Never display colors' }
        ]
      }
    },
    {
      name: '--frozen',
      description: 'Require Cargo.lock and cache are up to date'
    },
    {
      name: '--locked',
      description: 'Require Cargo.lock is up to date'
    },
    {
      name: '--offline',
      description: 'Run without accessing the network'
    },
    {
      name: '--config',
      description: 'Override a configuration value',
      args: { name: 'KEY=VALUE', isVariadic: true }
    },
    {
      name: ['-Z'],
      description: 'Unstable (nightly-only) flags',
      args: { name: 'FLAG', isVariadic: true }
    },
    {
      name: ['-h', '--help'],
      description: 'Print help information'
    }
  ],
  subcommands: [
    {
      name: 'build',
      description: 'Compile packages and dependencies',
      options: [
        {
          name: ['-p', '--package'],
          description: 'Package to build',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: '--workspace',
          description: 'Build all packages in the workspace'
        },
        {
          name: '--exclude',
          description: 'Exclude packages from build',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: ['-j', '--jobs'],
          description: 'Number of parallel jobs',
          args: { name: 'N' }
        },
        {
          name: '--lib',
          description: 'Build only library'
        },
        {
          name: '--bin',
          description: 'Build only specified binary',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--bins',
          description: 'Build all binaries'
        },
        {
          name: '--example',
          description: 'Build only specified example',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--examples',
          description: 'Build all examples'
        },
        {
          name: '--test',
          description: 'Build only specified test target',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--tests',
          description: 'Build all tests'
        },
        {
          name: '--bench',
          description: 'Build only specified bench target',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--benches',
          description: 'Build all benches'
        },
        {
          name: '--all-targets',
          description: 'Build all targets'
        },
        {
          name: ['-r', '--release'],
          description: 'Build artifacts in release mode'
        },
        {
          name: '--profile',
          description: 'Build artifacts with the specified profile',
          args: { name: 'PROFILE-NAME' }
        },
        {
          name: '--features',
          description: 'Space or comma separated list of features to activate',
          args: { name: 'FEATURES' }
        },
        {
          name: '--all-features',
          description: 'Activate all available features'
        },
        {
          name: '--no-default-features',
          description: 'Do not activate default features'
        },
        {
          name: '--target',
          description: 'Build for the target triple',
          args: {
            name: 'TRIPLE',
            generators: [cargoTargetGenerator]
          }
        },
        {
          name: '--target-dir',
          description: 'Directory for build artifacts',
          args: {
            name: 'DIRECTORY',
            template: ['folders']
          }
        }
      ]
    },
    {
      name: 'check',
      description: 'Analyze packages and report errors without building',
      options: [
        {
          name: ['-p', '--package'],
          description: 'Package to check',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: '--workspace',
          description: 'Check all packages in the workspace'
        },
        {
          name: '--exclude',
          description: 'Exclude packages from check',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: '--lib',
          description: 'Check only library'
        },
        {
          name: '--bin',
          description: 'Check only specified binary',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--bins',
          description: 'Check all binaries'
        },
        {
          name: '--example',
          description: 'Check only specified example',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--examples',
          description: 'Check all examples'
        },
        {
          name: '--test',
          description: 'Check only specified test target',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--tests',
          description: 'Check all tests'
        },
        {
          name: '--bench',
          description: 'Check only specified bench target',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--benches',
          description: 'Check all benches'
        },
        {
          name: '--all-targets',
          description: 'Check all targets'
        },
        {
          name: ['-r', '--release'],
          description: 'Check artifacts in release mode'
        },
        {
          name: '--profile',
          description: 'Check artifacts with the specified profile',
          args: { name: 'PROFILE-NAME' }
        },
        {
          name: '--features',
          description: 'Space or comma separated list of features to activate',
          args: { name: 'FEATURES' }
        },
        {
          name: '--all-features',
          description: 'Activate all available features'
        },
        {
          name: '--no-default-features',
          description: 'Do not activate default features'
        },
        {
          name: '--target',
          description: 'Check for the target triple',
          args: {
            name: 'TRIPLE',
            generators: [cargoTargetGenerator]
          }
        }
      ]
    },
    {
      name: 'clean',
      description: 'Remove generated artifacts',
      options: [
        {
          name: ['-p', '--package'],
          description: 'Package to clean',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: '--doc',
          description: 'Remove doc artifacts only'
        },
        {
          name: ['-r', '--release'],
          description: 'Remove release artifacts only'
        },
        {
          name: '--profile',
          description: 'Remove artifacts for the specified profile',
          args: { name: 'PROFILE-NAME' }
        },
        {
          name: '--target',
          description: 'Clean for the target triple',
          args: {
            name: 'TRIPLE',
            generators: [cargoTargetGenerator]
          }
        },
        {
          name: '--target-dir',
          description: 'Directory for build artifacts',
          args: {
            name: 'DIRECTORY',
            template: ['folders']
          }
        }
      ]
    },
    {
      name: 'doc',
      description: 'Build documentation',
      options: [
        {
          name: '--open',
          description: 'Open docs in browser after build'
        },
        {
          name: '--no-deps',
          description: 'Do not build documentation for dependencies'
        },
        {
          name: '--document-private-items',
          description: 'Document private items'
        },
        {
          name: ['-p', '--package'],
          description: 'Package to document',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: '--workspace',
          description: 'Document all packages in the workspace'
        },
        {
          name: '--exclude',
          description: 'Exclude packages from documentation',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: ['-j', '--jobs'],
          description: 'Number of parallel jobs',
          args: { name: 'N' }
        },
        {
          name: '--lib',
          description: 'Document only library'
        },
        {
          name: '--bin',
          description: 'Document only specified binary',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--bins',
          description: 'Document all binaries'
        }
      ]
    },
    {
      name: 'new',
      description: 'Create a new Rust package',
      args: {
        name: 'path',
        description: 'Path for the new package'
      },
      options: [
        {
          name: '--bin',
          description: 'Create a binary package'
        },
        {
          name: '--lib',
          description: 'Create a library package'
        },
        {
          name: '--name',
          description: 'Set package name',
          args: { name: 'NAME' }
        },
        {
          name: '--edition',
          description: 'Rust edition to use',
          args: {
            name: 'YEAR',
            suggestions: [
              { name: '2015', description: 'Rust 2015 edition' },
              { name: '2018', description: 'Rust 2018 edition' },
              { name: '2021', description: 'Rust 2021 edition' }
            ]
          }
        },
        {
          name: '--vcs',
          description: 'Initialize version control',
          args: {
            name: 'VCS',
            suggestions: [
              { name: 'git', description: 'Git version control' },
              { name: 'hg', description: 'Mercurial version control' },
              { name: 'pijul', description: 'Pijul version control' },
              { name: 'fossil', description: 'Fossil version control' },
              { name: 'none', description: 'No version control' }
            ]
          }
        },
        {
          name: '--registry',
          description: 'Registry to use',
          args: { name: 'REGISTRY' }
        }
      ]
    },
    {
      name: 'init',
      description: 'Create a new Rust package in current directory',
      options: [
        {
          name: '--bin',
          description: 'Create a binary package'
        },
        {
          name: '--lib',
          description: 'Create a library package'
        },
        {
          name: '--name',
          description: 'Set package name',
          args: { name: 'NAME' }
        },
        {
          name: '--edition',
          description: 'Rust edition to use',
          args: {
            name: 'YEAR',
            suggestions: [
              { name: '2015', description: 'Rust 2015 edition' },
              { name: '2018', description: 'Rust 2018 edition' },
              { name: '2021', description: 'Rust 2021 edition' }
            ]
          }
        },
        {
          name: '--vcs',
          description: 'Initialize version control',
          args: {
            name: 'VCS',
            suggestions: [
              { name: 'git', description: 'Git version control' },
              { name: 'hg', description: 'Mercurial version control' },
              { name: 'pijul', description: 'Pijul version control' },
              { name: 'fossil', description: 'Fossil version control' },
              { name: 'none', description: 'No version control' }
            ]
          }
        }
      ]
    },
    {
      name: 'run',
      description: 'Run a binary or example of the local package',
      args: {
        name: 'args',
        description: 'Arguments to pass to the program',
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: '--bin',
          description: 'Run the specified binary',
          args: {
            name: 'NAME',
            generators: [cargoBinaryGenerator]
          }
        },
        {
          name: '--example',
          description: 'Run the specified example',
          args: { name: 'NAME' }
        },
        {
          name: ['-p', '--package'],
          description: 'Package with the target to run',
          args: { name: 'SPEC' }
        },
        {
          name: ['-j', '--jobs'],
          description: 'Number of parallel jobs',
          args: { name: 'N' }
        },
        {
          name: ['-r', '--release'],
          description: 'Run optimized artifacts with release profile'
        },
        {
          name: '--profile',
          description: 'Run artifacts with the specified profile',
          args: { name: 'PROFILE-NAME' }
        },
        {
          name: '--features',
          description: 'Space or comma separated list of features to activate',
          args: { name: 'FEATURES' }
        },
        {
          name: '--all-features',
          description: 'Activate all available features'
        },
        {
          name: '--no-default-features',
          description: 'Do not activate default features'
        },
        {
          name: '--target',
          description: 'Run for the target triple',
          args: {
            name: 'TRIPLE',
            generators: [cargoTargetGenerator]
          }
        }
      ]
    },
    {
      name: 'test',
      description: 'Run unit and integration tests',
      args: {
        name: 'testname',
        description: 'Test name to filter',
        isOptional: true
      },
      options: [
        {
          name: '--lib',
          description: 'Test only library unit tests'
        },
        {
          name: '--bin',
          description: 'Test only specified binary',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--bins',
          description: 'Test all binaries'
        },
        {
          name: '--example',
          description: 'Test only specified example',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--examples',
          description: 'Test all examples'
        },
        {
          name: '--test',
          description: 'Test only specified integration test',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--tests',
          description: 'Test all integration tests'
        },
        {
          name: '--bench',
          description: 'Test only specified benchmark',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--benches',
          description: 'Test all benchmarks'
        },
        {
          name: '--all-targets',
          description: 'Test all targets'
        },
        {
          name: '--doc',
          description: 'Test only documentation tests'
        },
        {
          name: '--no-run',
          description: 'Compile but do not run tests'
        },
        {
          name: '--no-fail-fast',
          description: 'Run all tests regardless of failures'
        },
        {
          name: ['-p', '--package'],
          description: 'Package to test',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: '--workspace',
          description: 'Test all packages in the workspace'
        },
        {
          name: '--exclude',
          description: 'Exclude packages from test',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: ['-j', '--jobs'],
          description: 'Number of parallel jobs',
          args: { name: 'N' }
        },
        {
          name: ['-r', '--release'],
          description: 'Test optimized artifacts with release profile'
        },
        {
          name: '--features',
          description: 'Space or comma separated list of features to activate',
          args: { name: 'FEATURES' }
        },
        {
          name: ['--all-features'],
          description: 'Activate all available features'
        },
        {
          name: '--no-default-features',
          description: 'Do not activate default features'
        }
      ]
    },
    {
      name: 'bench',
      description: 'Run benchmarks',
      args: {
        name: 'benchname',
        description: 'Benchmark name to filter',
        isOptional: true
      },
      options: [
        {
          name: '--lib',
          description: 'Benchmark only library unit benchmarks'
        },
        {
          name: '--bin',
          description: 'Benchmark only specified binary',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--bins',
          description: 'Benchmark all binaries'
        },
        {
          name: '--example',
          description: 'Benchmark only specified example',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--examples',
          description: 'Benchmark all examples'
        },
        {
          name: '--test',
          description: 'Benchmark only specified test target',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--tests',
          description: 'Benchmark all tests'
        },
        {
          name: '--bench',
          description: 'Benchmark only specified bench target',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--benches',
          description: 'Benchmark all benches'
        },
        {
          name: '--all-targets',
          description: 'Benchmark all targets'
        },
        {
          name: '--no-run',
          description: 'Compile but do not run benchmarks'
        },
        {
          name: ['-p', '--package'],
          description: 'Package to benchmark',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: '--workspace',
          description: 'Benchmark all packages in the workspace'
        },
        {
          name: '--exclude',
          description: 'Exclude packages from benchmark',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: ['-j', '--jobs'],
          description: 'Number of parallel jobs',
          args: { name: 'N' }
        },
        {
          name: '--features',
          description: 'Space or comma separated list of features to activate',
          args: { name: 'FEATURES' }
        },
        {
          name: '--all-features',
          description: 'Activate all available features'
        },
        {
          name: '--no-default-features',
          description: 'Do not activate default features'
        }
      ]
    },
    {
      name: 'update',
      description: 'Update dependencies listed in Cargo.lock',
      args: {
        name: 'spec',
        description: 'Package to update',
        isOptional: true,
        isVariadic: true
      },
      options: [
        {
          name: '--aggressive',
          description: 'Update all dependencies'
        },
        {
          name: '--precise',
          description: 'Update to exactly this version',
          args: { name: 'PRECISE' }
        },
        {
          name: ['-w', '--workspace'],
          description: 'Update workspace packages'
        },
        {
          name: '--dry-run',
          description: 'Do not actually write the lockfile'
        }
      ]
    },
    {
      name: 'search',
      description: 'Search packages in crates.io',
      args: {
        name: 'query',
        description: 'Search query',
        isVariadic: true
      },
      options: [
        {
          name: '--limit',
          description: 'Limit the number of results',
          args: { name: 'LIMIT' }
        },
        {
          name: '--index',
          description: 'Registry index to search',
          args: { name: 'INDEX' }
        },
        {
          name: '--registry',
          description: 'Registry to search',
          args: { name: 'REGISTRY' }
        }
      ]
    },
    {
      name: 'publish',
      description: 'Upload package to crates.io',
      options: [
        {
          name: '--index',
          description: 'Registry index',
          args: { name: 'INDEX' }
        },
        {
          name: '--registry',
          description: 'Registry to publish to',
          args: { name: 'REGISTRY' }
        },
        {
          name: '--token',
          description: 'Token to use when uploading',
          args: { name: 'TOKEN' }
        },
        {
          name: '--no-verify',
          description: 'Do not verify package before publish'
        },
        {
          name: '--allow-dirty',
          description: 'Allow publishing with uncommitted changes'
        },
        {
          name: '--dry-run',
          description: 'Perform all checks without uploading'
        }
      ]
    },
    {
      name: 'install',
      description: 'Install a Rust binary',
      args: {
        name: 'crate',
        description: 'Crate to install',
        generators: [cargoPackageGenerator],
        isVariadic: true
      },
      options: [
        {
          name: '--version',
          description: 'Specify version to install',
          args: { name: 'VERSION' }
        },
        {
          name: '--git',
          description: 'Git repository to install from',
          args: { name: 'URL' }
        },
        {
          name: '--branch',
          description: 'Branch to use when installing from git',
          args: { name: 'BRANCH' }
        },
        {
          name: '--tag',
          description: 'Tag to use when installing from git',
          args: { name: 'TAG' }
        },
        {
          name: '--rev',
          description: 'Specific commit to use when installing from git',
          args: { name: 'SHA' }
        },
        {
          name: '--path',
          description: 'Filesystem path to local crate',
          args: {
            name: 'PATH',
            template: ['folders']
          }
        },
        {
          name: '--list',
          description: 'List all installed packages'
        },
        {
          name: ['-j', '--jobs'],
          description: 'Number of parallel jobs',
          args: { name: 'N' }
        },
        {
          name: '--force',
          description: 'Force overwriting existing crates or binaries'
        },
        {
          name: '--no-track',
          description: 'Do not save tracking information'
        },
        {
          name: '--features',
          description: 'Space or comma separated list of features to activate',
          args: { name: 'FEATURES' }
        },
        {
          name: '--all-features',
          description: 'Activate all available features'
        },
        {
          name: '--no-default-features',
          description: 'Do not activate default features'
        },
        {
          name: '--profile',
          description: 'Install artifacts with the specified profile',
          args: { name: 'PROFILE-NAME' }
        },
        {
          name: '--target',
          description: 'Install for the target triple',
          args: {
            name: 'TRIPLE',
            generators: [cargoTargetGenerator]
          }
        },
        {
          name: '--bin',
          description: 'Install only the specified binary',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--bins',
          description: 'Install all binaries'
        },
        {
          name: '--example',
          description: 'Install only the specified example',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--examples',
          description: 'Install all examples'
        },
        {
          name: '--root',
          description: 'Directory to install packages to',
          args: {
            name: 'DIR',
            template: ['folders']
          }
        },
        {
          name: '--registry',
          description: 'Registry to use',
          args: { name: 'REGISTRY' }
        },
        {
          name: '--index',
          description: 'Registry index to use',
          args: { name: 'INDEX' }
        }
      ]
    },
    {
      name: 'uninstall',
      description: 'Remove a Rust binary',
      args: {
        name: 'spec',
        description: 'Package to uninstall',
        isVariadic: true
      },
      options: [
        {
          name: ['-p', '--package'],
          description: 'Package to uninstall',
          args: { name: 'SPEC', isVariadic: true }
        },
        {
          name: '--bin',
          description: 'Only uninstall the binary NAME',
          args: { name: 'NAME', isVariadic: true }
        },
        {
          name: '--root',
          description: 'Directory to uninstall packages from',
          args: {
            name: 'DIR',
            template: ['folders']
          }
        }
      ]
    },
    {
      name: 'version',
      description: 'Show version information',
      options: [
        {
          name: '--verbose',
          description: 'Show extended version information'
        }
      ]
    },
    {
      name: 'help',
      description: 'Display help information about Cargo',
      args: {
        name: 'command',
        description: 'Command to get help for',
        isOptional: true
      }
    }
  ]
};