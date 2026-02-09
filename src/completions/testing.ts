import { CompletionSpec } from '../types.js';

// Test file generator
const testFileGenerator = {
  script: 'find . -maxdepth 3 \\( -name "*.test.js" -o -name "*.test.ts" -o -name "*.spec.js" -o -name "*.spec.ts" -o -name "*.test.jsx" -o -name "*.test.tsx" \\) | head -20',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Test file: ${file}`,
      type: 'file' as const
    }));
  }
};

// Config file generator for testing/linting tools
const configFileGenerator = {
  script: 'find . -maxdepth 2 \\( -name "jest.config.*" -o -name "cypress.config.*" -o -name "playwright.config.*" -o -name ".eslintrc.*" -o -name "prettier.config.*" -o -name "vitest.config.*" \\) | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Config file: ${file}`,
      type: 'file' as const
    }));
  }
};

// Jest completion spec
export const jestSpec: CompletionSpec = {
  name: 'jest',
  description: 'JavaScript testing framework',
  options: [
    {
      name: ['-c', '--config'],
      description: 'Path to Jest config file',
      args: {
        name: 'path',
        generators: [configFileGenerator]
      }
    },
    {
      name: '--watch',
      description: 'Watch files for changes and rerun tests'
    },
    {
      name: '--watchAll',
      description: 'Watch all files for changes'
    },
    {
      name: '--coverage',
      description: 'Generate code coverage report'
    },
    {
      name: '--coverageDirectory',
      description: 'Directory for coverage reports',
      args: {
        name: 'path',
        template: 'folders'
      }
    },
    {
      name: '--testMatch',
      description: 'Glob patterns to detect test files',
      args: {
        name: 'patterns',
        description: 'Test file patterns'
      }
    },
    {
      name: '--testPathPattern',
      description: 'Regexp pattern to match against test paths',
      args: {
        name: 'pattern',
        description: 'Test path pattern'
      }
    },
    {
      name: ['-t', '--testNamePattern'],
      description: 'Run only tests with matching names',
      args: {
        name: 'pattern',
        description: 'Test name pattern'
      }
    },
    {
      name: '--maxWorkers',
      description: 'Maximum number of workers',
      args: {
        name: 'num',
        suggestions: [
          { name: '1', description: '1 worker' },
          { name: '2', description: '2 workers' },
          { name: '4', description: '4 workers' },
          { name: '50%', description: '50% of CPU cores' }
        ]
      }
    },
    {
      name: '--runInBand',
      description: 'Run tests serially in current process'
    },
    {
      name: '--silent',
      description: 'Prevent tests from printing messages'
    },
    {
      name: '--verbose',
      description: 'Display individual test results'
    },
    {
      name: '--bail',
      description: 'Stop running tests after first test failure',
      args: {
        name: 'n',
        description: 'Number of failures before bailing',
        isOptional: true
      }
    },
    {
      name: '--updateSnapshot',
      description: 'Update snapshots'
    },
    {
      name: ['-u', '--updateSnapshot'],
      description: 'Update snapshots'
    },
    {
      name: '--detectOpenHandles',
      description: 'Detect handles that prevent Jest from exiting'
    },
    {
      name: '--forceExit',
      description: 'Force Jest to exit after tests complete'
    },
    {
      name: '--passWithNoTests',
      description: 'Allow the test suite to pass when no files are found'
    }
  ],
  args: {
    name: 'testPattern',
    description: 'Test files or patterns to run',
    generators: [testFileGenerator],
    isOptional: true
  }
};

// Cypress completion spec
export const cypressSpec: CompletionSpec = {
  name: 'cypress',
  description: 'End-to-end testing framework',
  subcommands: [
    {
      name: 'open',
      description: 'Open Cypress Test Runner',
      options: [
        {
          name: ['-C', '--config-file'],
          description: 'Path to config file',
          args: {
            name: 'file',
            generators: [configFileGenerator]
          }
        },
        {
          name: ['-e', '--env'],
          description: 'Environment variables',
          args: {
            name: 'env',
            description: 'key=value pairs'
          }
        },
        {
          name: ['-P', '--project'],
          description: 'Path to project',
          args: {
            name: 'path',
            template: 'folders'
          }
        },
        {
          name: ['-b', '--browser'],
          description: 'Browser to launch',
          args: {
            name: 'browser',
            suggestions: [
              { name: 'chrome', description: 'Google Chrome' },
              { name: 'firefox', description: 'Mozilla Firefox' },
              { name: 'edge', description: 'Microsoft Edge' },
              { name: 'electron', description: 'Electron browser' }
            ]
          }
        }
      ]
    },
    {
      name: 'run',
      description: 'Run Cypress tests in headless mode',
      options: [
        {
          name: ['-C', '--config-file'],
          description: 'Path to config file',
          args: {
            name: 'file',
            generators: [configFileGenerator]
          }
        },
        {
          name: ['-e', '--env'],
          description: 'Environment variables',
          args: {
            name: 'env',
            description: 'key=value pairs'
          }
        },
        {
          name: ['-s', '--spec'],
          description: 'Spec files to run',
          args: {
            name: 'spec',
            description: 'Spec file pattern'
          }
        },
        {
          name: ['-b', '--browser'],
          description: 'Browser to run tests in',
          args: {
            name: 'browser',
            suggestions: [
              { name: 'chrome', description: 'Google Chrome' },
              { name: 'firefox', description: 'Mozilla Firefox' },
              { name: 'edge', description: 'Microsoft Edge' },
              { name: 'electron', description: 'Electron browser' }
            ]
          }
        },
        {
          name: '--headed',
          description: 'Run browser in headed mode'
        },
        {
          name: '--headless',
          description: 'Run browser in headless mode'
        },
        {
          name: '--record',
          description: 'Record test results to Cypress Dashboard'
        },
        {
          name: '--key',
          description: 'Cypress Dashboard record key',
          args: {
            name: 'key',
            description: 'Record key'
          }
        },
        {
          name: '--parallel',
          description: 'Run tests in parallel across multiple machines'
        },
        {
          name: '--group',
          description: 'Group recorded tests',
          args: {
            name: 'name',
            description: 'Group name'
          }
        }
      ]
    },
    {
      name: 'info',
      description: 'Print Cypress and system information'
    },
    {
      name: 'version',
      description: 'Print Cypress version'
    },
    {
      name: 'verify',
      description: 'Verify Cypress installation'
    },
    {
      name: 'cache',
      description: 'Manage Cypress binary cache',
      subcommands: [
        {
          name: 'clear',
          description: 'Clear Cypress binary cache'
        },
        {
          name: 'list',
          description: 'List cached Cypress versions'
        },
        {
          name: 'path',
          description: 'Print Cypress cache path'
        }
      ]
    }
  ]
};

// Playwright completion spec
export const playwrightSpec: CompletionSpec = {
  name: 'playwright',
  description: 'End-to-end testing framework for modern web apps',
  subcommands: [
    {
      name: 'test',
      description: 'Run tests',
      options: [
        {
          name: ['-c', '--config'],
          description: 'Configuration file',
          args: {
            name: 'file',
            generators: [configFileGenerator]
          }
        },
        {
          name: '--debug',
          description: 'Run tests in debug mode'
        },
        {
          name: '--headed',
          description: 'Run tests in headed browsers'
        },
        {
          name: '--browser',
          description: 'Browser to use',
          args: {
            name: 'browser',
            suggestions: [
              { name: 'chromium', description: 'Chromium browser' },
              { name: 'firefox', description: 'Firefox browser' },
              { name: 'webkit', description: 'WebKit browser' },
              { name: 'all', description: 'All browsers' }
            ]
          }
        },
        {
          name: '--project',
          description: 'Project to run',
          args: {
            name: 'project',
            description: 'Project name'
          }
        },
        {
          name: ['-g', '--grep'],
          description: 'Only run tests matching this regex',
          args: {
            name: 'pattern',
            description: 'Test name pattern'
          }
        },
        {
          name: '--grep-invert',
          description: 'Only run tests NOT matching regex',
          args: {
            name: 'pattern',
            description: 'Test name pattern to exclude'
          }
        },
        {
          name: '--max-failures',
          description: 'Stop after N failures',
          args: {
            name: 'N',
            description: 'Number of failures'
          }
        },
        {
          name: '--workers',
          description: 'Number of concurrent workers',
          args: {
            name: 'workers',
            suggestions: [
              { name: '1', description: '1 worker' },
              { name: '2', description: '2 workers' },
              { name: '4', description: '4 workers' },
              { name: '50%', description: '50% of logical CPU cores' }
            ]
          }
        },
        {
          name: '--reporter',
          description: 'Test reporter',
          args: {
            name: 'reporter',
            suggestions: [
              { name: 'list', description: 'List reporter' },
              { name: 'dot', description: 'Dot reporter' },
              { name: 'line', description: 'Line reporter' },
              { name: 'json', description: 'JSON reporter' },
              { name: 'junit', description: 'JUnit XML reporter' },
              { name: 'html', description: 'HTML reporter' }
            ]
          }
        },
        {
          name: '--ui',
          description: 'Run tests in UI mode'
        }
      ],
      args: {
        name: 'testFiles',
        description: 'Test files to run',
        generators: [testFileGenerator],
        isOptional: true,
        isVariadic: true
      }
    },
    {
      name: 'show-report',
      description: 'Show HTML test report',
      options: [
        {
          name: '--port',
          description: 'Port for the report server',
          args: {
            name: 'port',
            suggestions: [
              { name: '3000', description: 'Port 3000' },
              { name: '8080', description: 'Port 8080' },
              { name: '9323', description: 'Port 9323 (default)' }
            ]
          }
        }
      ]
    },
    {
      name: 'install',
      description: 'Install browsers',
      options: [
        {
          name: '--with-deps',
          description: 'Install system dependencies for browsers'
        }
      ],
      args: {
        name: 'browsers',
        description: 'Browsers to install',
        suggestions: [
          { name: 'chromium', description: 'Install Chromium' },
          { name: 'firefox', description: 'Install Firefox' },
          { name: 'webkit', description: 'Install WebKit' },
          { name: 'msedge', description: 'Install MS Edge' }
        ],
        isOptional: true,
        isVariadic: true
      }
    },
    {
      name: 'codegen',
      description: 'Generate test code by recording actions',
      options: [
        {
          name: '--target',
          description: 'Language to generate',
          args: {
            name: 'language',
            suggestions: [
              { name: 'javascript', description: 'JavaScript' },
              { name: 'typescript', description: 'TypeScript' },
              { name: 'python', description: 'Python' },
              { name: 'python-async', description: 'Python async' },
              { name: 'csharp', description: 'C#' },
              { name: 'java', description: 'Java' }
            ]
          }
        },
        {
          name: ['-o', '--output'],
          description: 'Output file',
          args: {
            name: 'file',
            template: 'filepaths'
          }
        },
        {
          name: '--browser',
          description: 'Browser to use',
          args: {
            name: 'browser',
            suggestions: [
              { name: 'chromium', description: 'Chromium' },
              { name: 'firefox', description: 'Firefox' },
              { name: 'webkit', description: 'WebKit' }
            ]
          }
        }
      ],
      args: {
        name: 'url',
        description: 'URL to start recording from',
        isOptional: true
      }
    }
  ]
};

// ESLint completion spec
export const eslintSpec: CompletionSpec = {
  name: 'eslint',
  description: 'JavaScript and TypeScript linter',
  options: [
    {
      name: ['-c', '--config'],
      description: 'Path to configuration file',
      args: {
        name: 'path',
        generators: [configFileGenerator]
      }
    },
    {
      name: '--no-eslintrc',
      description: 'Disable use of configuration from .eslintrc.*'
    },
    {
      name: ['-f', '--format'],
      description: 'Output format',
      args: {
        name: 'format',
        suggestions: [
          { name: 'stylish', description: 'Stylish format (default)' },
          { name: 'compact', description: 'Compact format' },
          { name: 'json', description: 'JSON format' },
          { name: 'unix', description: 'Unix format' },
          { name: 'checkstyle', description: 'Checkstyle XML format' },
          { name: 'junit', description: 'JUnit XML format' },
          { name: 'tap', description: 'TAP format' }
        ]
      }
    },
    {
      name: ['-o', '--output-file'],
      description: 'Output file',
      args: {
        name: 'path',
        template: 'filepaths'
      }
    },
    {
      name: '--fix',
      description: 'Automatically fix problems'
    },
    {
      name: '--fix-dry-run',
      description: 'Fix problems without saving changes'
    },
    {
      name: '--fix-type',
      description: 'Types of fixes to apply',
      args: {
        name: 'type',
        suggestions: [
          { name: 'problem', description: 'Fix code problems' },
          { name: 'suggestion', description: 'Apply suggested fixes' },
          { name: 'layout', description: 'Fix layout issues' }
        ]
      }
    },
    {
      name: '--ignore-path',
      description: 'Path to ignore file',
      args: {
        name: 'path',
        template: 'filepaths'
      }
    },
    {
      name: '--no-ignore',
      description: 'Disable use of ignore files and patterns'
    },
    {
      name: '--ignore-pattern',
      description: 'Pattern of files to ignore',
      args: {
        name: 'pattern',
        description: 'Ignore pattern'
      }
    },
    {
      name: '--quiet',
      description: 'Report errors only'
    },
    {
      name: '--max-warnings',
      description: 'Number of warnings to trigger nonzero exit code',
      args: {
        name: 'number',
        description: 'Maximum warnings allowed'
      }
    },
    {
      name: ['-ext', '--ext'],
      description: 'File extension to lint',
      args: {
        name: 'extension',
        suggestions: [
          { name: '.js', description: 'JavaScript files' },
          { name: '.jsx', description: 'React JSX files' },
          { name: '.ts', description: 'TypeScript files' },
          { name: '.tsx', description: 'TypeScript React files' },
          { name: '.vue', description: 'Vue.js files' }
        ]
      }
    },
    {
      name: '--global',
      description: 'Define global variables',
      args: {
        name: 'globals',
        description: 'Global variable names'
      }
    },
    {
      name: '--parser',
      description: 'Parser to use',
      args: {
        name: 'parser',
        suggestions: [
          { name: '@typescript-eslint/parser', description: 'TypeScript parser' },
          { name: '@babel/eslint-parser', description: 'Babel parser' },
          { name: 'vue-eslint-parser', description: 'Vue parser' }
        ]
      }
    },
    {
      name: '--parser-options',
      description: 'Parser options',
      args: {
        name: 'options',
        description: 'Parser options JSON'
      }
    },
    {
      name: '--resolve-plugins-relative-to',
      description: 'Directory to resolve plugins from',
      args: {
        name: 'path',
        template: 'folders'
      }
    },
    {
      name: '--rulesdir',
      description: 'Directory for custom rules',
      args: {
        name: 'path',
        template: 'folders'
      }
    },
    {
      name: '--plugin',
      description: 'Plugin to load',
      args: {
        name: 'plugin',
        suggestions: [
          { name: '@typescript-eslint', description: 'TypeScript ESLint plugin' },
          { name: 'react', description: 'React plugin' },
          { name: 'react-hooks', description: 'React Hooks plugin' },
          { name: 'vue', description: 'Vue.js plugin' },
          { name: 'import', description: 'Import/export plugin' },
          { name: 'jsx-a11y', description: 'Accessibility plugin' }
        ]
      }
    },
    {
      name: '--rule',
      description: 'Rule configuration',
      args: {
        name: 'rule',
        description: 'Rule name and configuration'
      }
    },
    {
      name: '--env',
      description: 'Environment to enable',
      args: {
        name: 'env',
        suggestions: [
          { name: 'browser', description: 'Browser environment' },
          { name: 'node', description: 'Node.js environment' },
          { name: 'es6', description: 'ES6 environment' },
          { name: 'jest', description: 'Jest environment' },
          { name: 'mocha', description: 'Mocha environment' }
        ]
      }
    },
    {
      name: '--cache',
      description: 'Store results in cache file'
    },
    {
      name: '--cache-file',
      description: 'Path to cache file',
      args: {
        name: 'path',
        template: 'filepaths'
      }
    },
    {
      name: '--cache-location',
      description: 'Path to cache directory or file',
      args: {
        name: 'path',
        template: 'folders'
      }
    }
  ],
  args: {
    name: 'files',
    description: 'Files or directories to lint',
    template: 'filepaths',
    isVariadic: true
  }
};

// Prettier completion spec
export const prettierSpec: CompletionSpec = {
  name: 'prettier',
  description: 'Code formatter',
  options: [
    {
      name: '--write',
      description: 'Edit files in-place'
    },
    {
      name: ['-c', '--check'],
      description: 'Check if given files are formatted'
    },
    {
      name: '--list-different',
      description: 'Print filenames of files that differ from Prettier formatting'
    },
    {
      name: '--config',
      description: 'Path to configuration file',
      args: {
        name: 'path',
        generators: [configFileGenerator]
      }
    },
    {
      name: '--no-config',
      description: 'Do not look for configuration file'
    },
    {
      name: '--config-precedence',
      description: 'Define how config file should be evaluated',
      args: {
        name: 'precedence',
        suggestions: [
          { name: 'cli-override', description: 'CLI options override config' },
          { name: 'file-override', description: 'Config file overrides CLI' },
          { name: 'prefer-file', description: 'Use config file when available' }
        ]
      }
    },
    {
      name: '--ignore-path',
      description: 'Path to ignore file',
      args: {
        name: 'path',
        template: 'filepaths'
      }
    },
    {
      name: '--print-width',
      description: 'Line length to wrap on',
      args: {
        name: 'width',
        suggestions: [
          { name: '80', description: '80 characters' },
          { name: '100', description: '100 characters' },
          { name: '120', description: '120 characters' }
        ]
      }
    },
    {
      name: '--tab-width',
      description: 'Number of spaces per indentation level',
      args: {
        name: 'width',
        suggestions: [
          { name: '2', description: '2 spaces' },
          { name: '4', description: '4 spaces' },
          { name: '8', description: '8 spaces' }
        ]
      }
    },
    {
      name: '--use-tabs',
      description: 'Indent lines with tabs instead of spaces'
    },
    {
      name: '--semi',
      description: 'Print semicolons at the end of statements'
    },
    {
      name: '--no-semi',
      description: 'Do not print semicolons'
    },
    {
      name: '--single-quote',
      description: 'Use single quotes instead of double quotes'
    },
    {
      name: '--quote-props',
      description: 'Change when properties in objects are quoted',
      args: {
        name: 'mode',
        suggestions: [
          { name: 'as-needed', description: 'Only add quotes when required' },
          { name: 'consistent', description: 'All or none' },
          { name: 'preserve', description: 'Respect input' }
        ]
      }
    },
    {
      name: '--jsx-single-quote',
      description: 'Use single quotes in JSX'
    },
    {
      name: '--trailing-comma',
      description: 'Print trailing commas wherever possible',
      args: {
        name: 'mode',
        suggestions: [
          { name: 'none', description: 'No trailing commas' },
          { name: 'es5', description: 'ES5-valid trailing commas' },
          { name: 'all', description: 'All possible trailing commas' }
        ]
      }
    },
    {
      name: '--bracket-spacing',
      description: 'Print spaces between brackets in object literals'
    },
    {
      name: '--no-bracket-spacing',
      description: 'Do not print spaces between brackets'
    },
    {
      name: '--jsx-bracket-same-line',
      description: 'Put > on the same line in JSX'
    },
    {
      name: '--arrow-parens',
      description: 'Include parentheses around a sole arrow function parameter',
      args: {
        name: 'mode',
        suggestions: [
          { name: 'avoid', description: 'Omit parens when possible' },
          { name: 'always', description: 'Always include parens' }
        ]
      }
    },
    {
      name: '--parser',
      description: 'Parser to use',
      args: {
        name: 'parser',
        suggestions: [
          { name: 'babel', description: 'JavaScript' },
          { name: 'typescript', description: 'TypeScript' },
          { name: 'css', description: 'CSS' },
          { name: 'scss', description: 'SCSS' },
          { name: 'json', description: 'JSON' },
          { name: 'markdown', description: 'Markdown' },
          { name: 'html', description: 'HTML' },
          { name: 'vue', description: 'Vue' },
          { name: 'yaml', description: 'YAML' }
        ]
      }
    },
    {
      name: '--range-start',
      description: 'Format code starting at character offset',
      args: {
        name: 'offset',
        description: 'Character offset'
      }
    },
    {
      name: '--range-end',
      description: 'Format code ending at character offset',
      args: {
        name: 'offset',
        description: 'Character offset'
      }
    }
  ],
  args: {
    name: 'files',
    description: 'Files or globs to format',
    template: 'filepaths',
    isVariadic: true
  }
};

// Vitest completion spec
export const vitestSpec: CompletionSpec = {
  name: 'vitest',
  description: 'Vite-native unit test framework',
  subcommands: [
    {
      name: 'run',
      description: 'Run tests',
      options: [
        {
          name: ['-c', '--config'],
          description: 'Path to config file',
          args: {
            name: 'path',
            generators: [configFileGenerator]
          }
        },
        {
          name: ['-t', '--testNamePattern'],
          description: 'Run tests with names matching pattern',
          args: {
            name: 'pattern',
            description: 'Test name pattern'
          }
        },
        {
          name: '--coverage',
          description: 'Enable coverage report'
        },
        {
          name: '--reporter',
          description: 'Test reporter',
          args: {
            name: 'reporter',
            suggestions: [
              { name: 'default', description: 'Default reporter' },
              { name: 'verbose', description: 'Verbose reporter' },
              { name: 'dot', description: 'Dot reporter' },
              { name: 'json', description: 'JSON reporter' },
              { name: 'junit', description: 'JUnit reporter' }
            ]
          }
        },
        {
          name: '--threads',
          description: 'Enable threads',
          args: {
            name: 'threads',
            suggestions: [
              { name: 'true', description: 'Enable threads' },
              { name: 'false', description: 'Disable threads' }
            ]
          }
        },
        {
          name: '--single-thread',
          description: 'Run tests in single thread'
        },
        {
          name: '--isolate',
          description: 'Isolate environment for each test file',
          args: {
            name: 'isolate',
            suggestions: [
              { name: 'true', description: 'Enable isolation' },
              { name: 'false', description: 'Disable isolation' }
            ]
          }
        }
      ],
      args: {
        name: 'files',
        description: 'Test files to run',
        generators: [testFileGenerator],
        isOptional: true,
        isVariadic: true
      }
    },
    {
      name: 'watch',
      description: 'Run tests in watch mode',
      options: [
        {
          name: ['-c', '--config'],
          description: 'Path to config file',
          args: {
            name: 'path',
            generators: [configFileGenerator]
          }
        },
        {
          name: '--coverage',
          description: 'Enable coverage report'
        }
      ]
    },
    {
      name: 'ui',
      description: 'Start Vitest UI',
      options: [
        {
          name: '--port',
          description: 'Port for UI server',
          args: {
            name: 'port',
            suggestions: [
              { name: '3000', description: 'Port 3000' },
              { name: '5173', description: 'Port 5173' },
              { name: '51204', description: 'Default port' }
            ]
          }
        },
        {
          name: '--host',
          description: 'Host for UI server',
          args: {
            name: 'host',
            suggestions: [
              { name: 'localhost', description: 'Local only' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        }
      ]
    }
  ],
  options: [
    {
      name: ['-c', '--config'],
      description: 'Path to config file',
      args: {
        name: 'path',
        generators: [configFileGenerator]
      }
    },
    {
      name: ['-r', '--root'],
      description: 'Root directory',
      args: {
        name: 'path',
        template: 'folders'
      }
    },
    {
      name: '--version',
      description: 'Show version'
    },
    {
      name: ['-h', '--help'],
      description: 'Show help'
    }
  ]
};