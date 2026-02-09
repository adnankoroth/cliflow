import { CompletionSpec } from '../types.js';
import { fileGenerator, folderGenerator, portGenerator, packageGenerator } from '../engine/generators.js';

export const nextjsSpec: CompletionSpec = {
  name: 'next',
  description: 'The React Framework for Production - Next.js CLI',
  subcommands: [
    {
      name: 'build',
      description: 'Create an optimized production build of your application',
      options: [
        {
          name: '--profile',
          description: 'Enable production profiling for React'
        },
        {
          name: '--debug',
          description: 'Enable debug mode'
        },
        {
          name: '--no-lint',
          description: 'Disable linting during build'
        },
        {
          name: '--no-mangling',
          description: 'Disable mangling during build'
        },
        {
          name: '--experimental-app-only',
          description: 'Only build app directory pages'
        }
      ]
    },
    {
      name: 'start',
      description: 'Start the production server',
      options: [
        {
          name: ['-p', '--port'],
          description: 'Specify port to run the application',
          args: {
            name: 'port',
            generators: [portGenerator]
          }
        },
        {
          name: ['-H', '--hostname'],
          description: 'Specify hostname to run the application',
          args: {
            name: 'hostname',
            suggestions: [
              { name: 'localhost', description: 'Local development' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        },
        {
          name: '--keepAliveTimeout',
          description: 'Max milliseconds to wait before closing inactive connections',
          args: {
            name: 'timeout',
            suggestions: [
              { name: '5000', description: '5 seconds' },
              { name: '10000', description: '10 seconds' }
            ]
          }
        }
      ]
    },
    {
      name: 'dev',
      description: 'Start the development server',
      options: [
        {
          name: ['-p', '--port'],
          description: 'Specify port to run the application',
          args: {
            name: 'port',
            generators: [portGenerator]
          }
        },
        {
          name: ['-H', '--hostname'],
          description: 'Specify hostname to run the application',
          args: {
            name: 'hostname',
            suggestions: [
              { name: 'localhost', description: 'Local development' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        },
        {
          name: '--turbo',
          description: 'Enable Turbopack (alpha)'
        },
        {
          name: '--experimental-turbo',
          description: 'Enable experimental Turbopack features'
        }
      ]
    },
    {
      name: 'lint',
      description: 'Run ESLint for all files in the pages/, components/, and lib/ directories',
      options: [
        {
          name: '--dir',
          description: 'Set base directory to lint',
          args: {
            name: 'directory',
            generators: [folderGenerator]
          }
        },
        {
          name: '--file',
          description: 'Set specific file(s) to lint',
          args: {
            name: 'file',
            generators: [fileGenerator]
          }
        },
        {
          name: '--ext',
          description: 'Set file extensions to lint',
          args: {
            name: 'extensions',
            suggestions: [
              { name: '.js,.jsx,.ts,.tsx', description: 'All supported extensions' },
              { name: '.js', description: 'JavaScript files only' },
              { name: '.ts', description: 'TypeScript files only' }
            ]
          }
        },
        {
          name: '--resolve-plugins-relative-to',
          description: 'Specify directory for ESLint to resolve plugins',
          args: {
            name: 'directory',
            generators: [folderGenerator]
          }
        },
        {
          name: '--strict',
          description: 'Create .eslintrc.json file with strict rules'
        },
        {
          name: '--fix',
          description: 'Automatically fix problems'
        },
        {
          name: '--fix-type',
          description: 'Specify types of fixes to apply',
          args: {
            name: 'types',
            suggestions: [
              { name: 'problem', description: 'Fix potential errors' },
              { name: 'suggestion', description: 'Apply suggestions' },
              { name: 'layout', description: 'Fix formatting issues' }
            ]
          }
        },
        {
          name: '--format',
          description: 'Specify output format',
          args: {
            name: 'format',
            suggestions: [
              { name: 'stylish', description: 'Human-readable format' },
              { name: 'compact', description: 'Compact output' },
              { name: 'json', description: 'JSON format' }
            ]
          }
        },
        {
          name: '--max-warnings',
          description: 'Specify maximum number of warnings',
          args: {
            name: 'count',
            suggestions: [
              { name: '0', description: 'No warnings allowed' },
              { name: '10', description: 'Up to 10 warnings' }
            ]
          }
        },
        {
          name: '--output-file',
          description: 'Specify output file for results',
          args: {
            name: 'file',
            generators: [fileGenerator]
          }
        },
        {
          name: '--quiet',
          description: 'Report errors only - no warnings'
        }
      ]
    },
    {
      name: 'telemetry',
      description: 'Control Next.js telemetry settings',
      subcommands: [
        {
          name: 'status',
          description: 'Show telemetry status'
        },
        {
          name: 'enable',
          description: 'Enable telemetry collection'
        },
        {
          name: 'disable',
          description: 'Disable telemetry collection'
        }
      ]
    },
    {
      name: 'info',
      description: 'Print relevant details about current system for bug reports'
    },
    {
      name: 'export',
      description: 'Export your Next.js application to static HTML',
      options: [
        {
          name: ['-o', '--outdir'],
          description: 'Set custom build directory (defaults to "out")',
          args: {
            name: 'directory',
            generators: [folderGenerator]
          }
        },
        {
          name: '--silent',
          description: 'Prevent printing any messages to console'
        }
      ]
    }
  ],
  options: [
    {
      name: ['-h', '--help'],
      description: 'Show help information'
    },
    {
      name: ['-v', '--version'],
      description: 'Show version information'
    }
  ]
};

export const viteSpec: CompletionSpec = {
  name: 'vite',
  description: 'Next generation frontend tooling - fast and modern build tool',
  subcommands: [
    {
      name: 'dev',
      description: 'Start development server (alias: serve)',
      options: [
        {
          name: '--host',
          description: 'Specify hostname',
          args: {
            name: 'hostname',
            suggestions: [
              { name: 'localhost', description: 'Local development' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        },
        {
          name: '--port',
          description: 'Specify port',
          args: {
            name: 'port',
            generators: [portGenerator]
          }
        },
        {
          name: '--https',
          description: 'Use TLS + HTTP/2'
        },
        {
          name: '--open',
          description: 'Open browser on startup',
          args: {
            name: 'path',
            isOptional: true,
            suggestions: [
              { name: '/', description: 'Root path' },
              { name: '/docs', description: 'Documentation path' }
            ]
          }
        },
        {
          name: '--cors',
          description: 'Enable CORS'
        },
        {
          name: '--strictPort',
          description: 'Exit if specified port is already in use'
        },
        {
          name: '--force',
          description: 'Force the optimizer to ignore the cache and re-bundle'
        }
      ]
    },
    {
      name: 'build',
      description: 'Build for production',
      options: [
        {
          name: '--target',
          description: 'Transpile target',
          args: {
            name: 'target',
            suggestions: [
              { name: 'es2015', description: 'ES2015 target' },
              { name: 'es2017', description: 'ES2017 target' },
              { name: 'es2018', description: 'ES2018 target' },
              { name: 'es2019', description: 'ES2019 target' },
              { name: 'es2020', description: 'ES2020 target' },
              { name: 'esnext', description: 'Latest ES features' }
            ]
          }
        },
        {
          name: '--outDir',
          description: 'Output directory',
          args: {
            name: 'directory',
            generators: [folderGenerator]
          }
        },
        {
          name: '--assetsDir',
          description: 'Directory under outDir to place assets in',
          args: {
            name: 'directory',
            suggestions: [
              { name: 'assets', description: 'Default assets directory' },
              { name: 'static', description: 'Static assets directory' }
            ]
          }
        },
        {
          name: '--assetsInlineLimit',
          description: 'Static asset base64 inline threshold in bytes',
          args: {
            name: 'limit',
            suggestions: [
              { name: '4096', description: '4KB (default)' },
              { name: '8192', description: '8KB' }
            ]
          }
        },
        {
          name: '--ssr',
          description: 'Build for server-side rendering',
          args: {
            name: 'entry',
            generators: [fileGenerator]
          }
        },
        {
          name: '--sourcemap',
          description: 'Output source maps for build',
          args: {
            name: 'type',
            isOptional: true,
            suggestions: [
              { name: 'inline', description: 'Inline source maps' },
              { name: 'hidden', description: 'Hidden source maps' }
            ]
          }
        },
        {
          name: '--minify',
          description: 'Enable/disable minification',
          args: {
            name: 'minifier',
            suggestions: [
              { name: 'terser', description: 'Use Terser' },
              { name: 'esbuild', description: 'Use esbuild (default)' },
              { name: 'false', description: 'Disable minification' }
            ]
          }
        },
        {
          name: '--manifest',
          description: 'Emit build manifest json'
        },
        {
          name: '--ssrManifest',
          description: 'Emit SSR manifest json'
        },
        {
          name: '--emptyOutDir',
          description: 'Force empty outDir when it\'s outside of root'
        },
        {
          name: '--watch',
          description: 'Rebuild when files change'
        }
      ]
    },
    {
      name: 'preview',
      description: 'Locally preview production build',
      options: [
        {
          name: '--host',
          description: 'Specify hostname',
          args: {
            name: 'hostname',
            suggestions: [
              { name: 'localhost', description: 'Local development' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        },
        {
          name: '--port',
          description: 'Specify port',
          args: {
            name: 'port',
            generators: [portGenerator]
          }
        },
        {
          name: '--https',
          description: 'Use TLS + HTTP/2'
        },
        {
          name: '--open',
          description: 'Open browser on startup',
          args: {
            name: 'path',
            isOptional: true
          }
        },
        {
          name: '--strictPort',
          description: 'Exit if specified port is already in use'
        }
      ]
    },
    {
      name: 'optimize',
      description: 'Pre-bundle dependencies',
      options: [
        {
          name: '--force',
          description: 'Force the optimizer to ignore the cache and re-bundle'
        }
      ]
    }
  ],
  options: [
    {
      name: ['-c', '--config'],
      description: 'Use specified config file',
      args: {
        name: 'config',
        generators: [fileGenerator]
      }
    },
    {
      name: '--root',
      description: 'Use specified root directory',
      args: {
        name: 'directory',
        generators: [folderGenerator]
      }
    },
    {
      name: '--base',
      description: 'Public base path',
      args: {
        name: 'path',
        suggestions: [
          { name: '/', description: 'Root path' },
          { name: '/app/', description: 'App subdirectory' }
        ]
      }
    },
    {
      name: ['-l', '--logLevel'],
      description: 'Specify log level',
      args: {
        name: 'level',
        suggestions: [
          { name: 'info', description: 'Info level (default)' },
          { name: 'warn', description: 'Warning level' },
          { name: 'error', description: 'Error level' },
          { name: 'silent', description: 'No output' }
        ]
      }
    },
    {
      name: '--clearScreen',
      description: 'Allow/disable clearing the screen when logging'
    },
    {
      name: ['-d', '--debug'],
      description: 'Show debug logs',
      args: {
        name: 'namespace',
        isOptional: true,
        suggestions: [
          { name: 'vite:*', description: 'All Vite debug logs' },
          { name: 'vite:deps', description: 'Dependencies debug logs' }
        ]
      }
    },
    {
      name: ['-f', '--filter'],
      description: 'Filter debug logs',
      args: {
        name: 'filter'
      }
    },
    {
      name: ['-m', '--mode'],
      description: 'Set env mode',
      args: {
        name: 'mode',
        suggestions: [
          { name: 'development', description: 'Development mode' },
          { name: 'production', description: 'Production mode' },
          { name: 'test', description: 'Test mode' }
        ]
      }
    },
    {
      name: ['-h', '--help'],
      description: 'Show help information'
    },
    {
      name: ['-v', '--version'],
      description: 'Show version information'
    }
  ]
};

export const vueCliSpec: CompletionSpec = {
  name: 'vue',
  description: 'Vue.js command line interface',
  subcommands: [
    {
      name: 'create',
      description: 'Create a new project powered by vue-cli-service',
      args: {
        name: 'project-name',
        description: 'Name of the new project'
      },
      options: [
        {
          name: ['-p', '--preset'],
          description: 'Skip prompts and use saved or remote preset',
          args: {
            name: 'preset',
            suggestions: [
              { name: 'default', description: 'Default preset' },
              { name: 'manually', description: 'Manually select features' }
            ]
          }
        },
        {
          name: ['-d', '--default'],
          description: 'Skip prompts and use default preset'
        },
        {
          name: ['-i', '--inlinePreset'],
          description: 'Skip prompts and use inline JSON string as preset',
          args: {
            name: 'json'
          }
        },
        {
          name: ['-m', '--packageManager'],
          description: 'Use specified npm client when installing dependencies',
          args: {
            name: 'manager',
            suggestions: [
              { name: 'npm', description: 'Use npm' },
              { name: 'yarn', description: 'Use Yarn' },
              { name: 'pnpm', description: 'Use pnpm' }
            ]
          }
        },
        {
          name: ['-r', '--registry'],
          description: 'Use specified npm registry when installing dependencies',
          args: {
            name: 'url',
            suggestions: [
              { name: 'https://registry.npmjs.org/', description: 'Default npm registry' },
              { name: 'https://registry.npm.taobao.org/', description: 'Taobao registry' }
            ]
          }
        },
        {
          name: ['-g', '--git'],
          description: 'Force git initialization with initial commit message',
          args: {
            name: 'message',
            isOptional: true,
            suggestions: [
              { name: 'Initial commit', description: 'Default commit message' }
            ]
          }
        },
        {
          name: ['-n', '--no-git'],
          description: 'Skip git initialization'
        },
        {
          name: ['-f', '--force'],
          description: 'Overwrite target directory if it exists'
        },
        {
          name: ['-c', '--clone'],
          description: 'Use git clone when fetching remote preset'
        },
        {
          name: ['-x', '--proxy'],
          description: 'Use specified proxy when creating project',
          args: {
            name: 'proxy'
          }
        },
        {
          name: ['-b', '--bare'],
          description: 'Scaffold project without beginner instructions'
        },
        {
          name: '--merge',
          description: 'Merge target dir if exists'
        }
      ]
    },
    {
      name: 'add',
      description: 'Add a plugin and invoke its generator',
      args: {
        name: 'plugin',
        description: 'Plugin name',
        generators: [packageGenerator]
      },
      options: [
        {
          name: '--registry',
          description: 'Use specified npm registry when installing plugin',
          args: {
            name: 'url'
          }
        }
      ]
    },
    {
      name: 'invoke',
      description: 'Invoke the generator of a plugin',
      args: {
        name: 'plugin',
        description: 'Plugin name',
        generators: [packageGenerator]
      }
    },
    {
      name: 'inspect',
      description: 'Inspect the webpack config in a Vue CLI project',
      options: [
        {
          name: '--mode',
          description: 'Specify env mode',
          args: {
            name: 'mode',
            suggestions: [
              { name: 'development', description: 'Development mode' },
              { name: 'production', description: 'Production mode' }
            ]
          }
        },
        {
          name: '--rule',
          description: 'Inspect a specific module rule',
          args: {
            name: 'rule',
            suggestions: [
              { name: 'vue', description: 'Vue files rule' },
              { name: 'js', description: 'JavaScript files rule' },
              { name: 'css', description: 'CSS files rule' }
            ]
          }
        },
        {
          name: '--plugin',
          description: 'Inspect a specific plugin',
          args: {
            name: 'plugin',
            suggestions: [
              { name: 'vue-loader', description: 'Vue loader plugin' },
              { name: 'html', description: 'HTML webpack plugin' }
            ]
          }
        },
        {
          name: '--rules',
          description: 'List all module rule names'
        },
        {
          name: '--plugins',
          description: 'List all plugin names'
        },
        {
          name: '--verbose',
          description: 'Show full function definitions in output'
        }
      ]
    },
    {
      name: 'serve',
      description: 'Serve the app in development mode',
      options: [
        {
          name: '--open',
          description: 'Open browser on server start'
        },
        {
          name: '--copy',
          description: 'Copy local url to clipboard on server start'
        },
        {
          name: '--mode',
          description: 'Specify env mode',
          args: {
            name: 'mode',
            suggestions: [
              { name: 'development', description: 'Development mode' },
              { name: 'production', description: 'Production mode' }
            ]
          }
        },
        {
          name: '--host',
          description: 'Specify host',
          args: {
            name: 'host',
            suggestions: [
              { name: 'localhost', description: 'Local development' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        },
        {
          name: '--port',
          description: 'Specify port',
          args: {
            name: 'port',
            generators: [portGenerator]
          }
        },
        {
          name: '--https',
          description: 'Use https'
        },
        {
          name: '--public',
          description: 'Specify the public network URL for HMR client',
          args: {
            name: 'url'
          }
        },
        {
          name: '--skip-plugins',
          description: 'Comma-separated list of plugin names to skip for this run',
          args: {
            name: 'plugins'
          }
        }
      ]
    },
    {
      name: 'build',
      description: 'Build the app for production',
      options: [
        {
          name: '--mode',
          description: 'Specify env mode',
          args: {
            name: 'mode',
            suggestions: [
              { name: 'development', description: 'Development mode' },
              { name: 'production', description: 'Production mode' }
            ]
          }
        },
        {
          name: '--dest',
          description: 'Specify output directory',
          args: {
            name: 'directory',
            generators: [folderGenerator]
          }
        },
        {
          name: '--modern',
          description: 'Build app targeting modern browsers with auto fallback'
        },
        {
          name: '--target',
          description: 'Build target',
          args: {
            name: 'target',
            suggestions: [
              { name: 'app', description: 'Build as application (default)' },
              { name: 'lib', description: 'Build as library' },
              { name: 'wc', description: 'Build as web component' },
              { name: 'wc-async', description: 'Build as async web component' }
            ]
          }
        },
        {
          name: '--formats',
          description: 'List of output formats for library builds',
          args: {
            name: 'formats',
            suggestions: [
              { name: 'commonjs,umd,umd-min', description: 'All formats' },
              { name: 'commonjs', description: 'CommonJS format' },
              { name: 'umd', description: 'UMD format' },
              { name: 'umd-min', description: 'Minified UMD format' }
            ]
          }
        },
        {
          name: '--name',
          description: 'Name for lib or web-component mode',
          args: {
            name: 'name'
          }
        },
        {
          name: '--filename',
          description: 'File name for lib',
          args: {
            name: 'filename'
          }
        },
        {
          name: '--no-clean',
          description: 'Do not remove the dist directory before building the project'
        },
        {
          name: '--report',
          description: 'Generate report.html to help analyze bundle content'
        },
        {
          name: '--report-json',
          description: 'Generate report.json to help analyze bundle content'
        },
        {
          name: '--skip-plugins',
          description: 'Comma-separated list of plugin names to skip for this run',
          args: {
            name: 'plugins'
          }
        },
        {
          name: '--watch',
          description: 'Watch for changes'
        }
      ]
    },
    {
      name: 'ui',
      description: 'Start and open the vue-cli ui',
      options: [
        {
          name: ['-H', '--host'],
          description: 'Host used for the UI server',
          args: {
            name: 'host'
          }
        },
        {
          name: ['-p', '--port'],
          description: 'Port used for the UI server',
          args: {
            name: 'port',
            generators: [portGenerator]
          }
        },
        {
          name: ['-D', '--dev'],
          description: 'Run in dev mode'
        },
        {
          name: '--quiet',
          description: 'Don\'t output starting messages'
        },
        {
          name: '--headless',
          description: 'Don\'t open browser on start and output port'
        }
      ]
    },
    {
      name: 'init',
      description: 'Generate a project from a remote template (legacy API, requires @vue/cli-init)',
      args: [
        {
          name: 'template',
          description: 'Template name'
        },
        {
          name: 'project-name',
          description: 'Project name'
        }
      ],
      options: [
        {
          name: ['-c', '--clone'],
          description: 'Use git clone'
        },
        {
          name: '--offline',
          description: 'Use cached template'
        }
      ]
    },
    {
      name: 'config',
      description: 'Inspect and modify the config',
      subcommands: [
        {
          name: 'set',
          description: 'Set a config value',
          args: [
            {
              name: 'key',
              description: 'Config key'
            },
            {
              name: 'value',
              description: 'Config value'
            }
          ]
        },
        {
          name: 'get',
          description: 'Get a config value',
          args: {
            name: 'key',
            description: 'Config key'
          }
        },
        {
          name: 'delete',
          description: 'Delete a config value',
          args: {
            name: 'key',
            description: 'Config key'
          }
        },
        {
          name: 'list',
          description: 'List all config values'
        },
        {
          name: 'edit',
          description: 'Open config file in editor'
        }
      ]
    },
    {
      name: 'upgrade',
      description: 'Upgrade vue cli service / plugins',
      args: {
        name: 'plugin-name',
        description: 'Plugin to upgrade',
        isOptional: true,
        generators: [packageGenerator]
      },
      options: [
        {
          name: ['-t', '--to'],
          description: 'Upgrade to a version that is not latest',
          args: {
            name: 'version'
          }
        },
        {
          name: ['-f', '--from'],
          description: 'Skip probing installed plugin, assuming it is upgraded from the designated version',
          args: {
            name: 'version'
          }
        },
        {
          name: ['-r', '--registry'],
          description: 'Use specified npm registry when installing dependencies',
          args: {
            name: 'url'
          }
        },
        {
          name: '--all',
          description: 'Upgrade all plugins'
        },
        {
          name: '--next',
          description: 'Also check for alpha / beta / rc versions when upgrading'
        }
      ]
    },
    {
      name: 'migrate',
      description: 'Run migrator for an already-installed CLI plugin',
      args: {
        name: 'plugin-name',
        description: 'Plugin to migrate',
        generators: [packageGenerator]
      },
      options: [
        {
          name: ['-f', '--from'],
          description: 'The base version for the migrator to migrate from',
          args: {
            name: 'version'
          }
        }
      ]
    },
    {
      name: 'info',
      description: 'Print debugging information about your environment'
    }
  ],
  options: [
    {
      name: ['-V', '--version'],
      description: 'Output the version number'
    },
    {
      name: ['-h', '--help'],
      description: 'Display help for command'
    }
  ]
};
export const createReactAppSpec: CompletionSpec = {
  name: 'create-react-app',
  description: 'Create React apps with no build configuration',
  args: {
    name: 'project-directory',
    description: 'Directory name for the new React app'
  },
  options: [
    {
      name: '--template',
      description: 'The template to use for creating the app',
      args: {
        name: 'template',
        suggestions: [
          { name: 'typescript', description: 'TypeScript template' },
          { name: 'redux', description: 'Redux template' },
          { name: 'redux-typescript', description: 'Redux + TypeScript template' }
        ]
      }
    },
    {
      name: '--use-npm',
      description: 'Use npm as the package manager'
    },
    {
      name: '--use-pnp',
      description: 'Use Yarn Plug\'n\'Play for dependency resolution'
    },
    {
      name: '--verbose',
      description: 'Display additional logging'
    },
    {
      name: '--scripts-version',
      description: 'Use a non-standard version of react-scripts',
      args: {
        name: 'version'
      }
    }
  ]
};

export const nuxtSpec: CompletionSpec = {
  name: 'nuxt',
  description: 'The Intuitive Vue Framework - Nuxt.js CLI',
  subcommands: [
    {
      name: 'dev',
      description: 'Start development server',
      options: [
        {
          name: ['-p', '--port'],
          description: 'Port to listen on',
          args: {
            name: 'port',
            generators: [portGenerator]
          }
        },
        {
          name: ['-H', '--hostname'],
          description: 'Hostname to listen on',
          args: {
            name: 'hostname',
            suggestions: [
              { name: 'localhost', description: 'Local development' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        },
        {
          name: ['-c', '--config-file'],
          description: 'Path to Nuxt config file',
          args: {
            name: 'config',
            generators: [fileGenerator]
          }
        },
        {
          name: '--spa',
          description: 'Launch in SPA mode'
        },
        {
          name: '--universal',
          description: 'Launch in Universal mode (default)'
        },
        {
          name: '--quiet',
          description: 'Hide build output (except for errors)'
        }
      ]
    },
    {
      name: 'build',
      description: 'Build the application for production deployment',
      options: [
        {
          name: ['-c', '--config-file'],
          description: 'Path to Nuxt config file',
          args: {
            name: 'config',
            generators: [fileGenerator]
          }
        },
        {
          name: ['-a', '--analyze'],
          description: 'Launch webpack-bundle-analyzer to optimize your bundles'
        },
        {
          name: '--spa',
          description: 'Build in SPA mode'
        },
        {
          name: '--universal',
          description: 'Build in Universal mode (default)'
        },
        {
          name: '--quiet',
          description: 'Hide build output (except for errors)'
        },
        {
          name: '--modern',
          description: 'Build/Start app for modern browsers'
        }
      ]
    },
    {
      name: 'start',
      description: 'Start the application in production mode',
      options: [
        {
          name: ['-p', '--port'],
          description: 'Port to listen on',
          args: {
            name: 'port',
            generators: [portGenerator]
          }
        },
        {
          name: ['-H', '--hostname'],
          description: 'Hostname to listen on',
          args: {
            name: 'hostname',
            suggestions: [
              { name: 'localhost', description: 'Local development' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        },
        {
          name: ['-c', '--config-file'],
          description: 'Path to Nuxt config file',
          args: {
            name: 'config',
            generators: [fileGenerator]
          }
        },
        {
          name: '--spa',
          description: 'Start in SPA mode'
        },
        {
          name: '--universal',
          description: 'Start in Universal mode (default)'
        },
        {
          name: '--quiet',
          description: 'Hide build output (except for errors)'
        }
      ]
    },
    {
      name: 'export',
      description: 'Export the application as static website to dist/ directory',
      options: [
        {
          name: ['-c', '--config-file'],
          description: 'Path to Nuxt config file',
          args: {
            name: 'config',
            generators: [fileGenerator]
          }
        },
        {
          name: '--fail-on-error',
          description: 'Exit with non-zero status code if any error happens when exporting pages'
        },
        {
          name: '--quiet',
          description: 'Hide build output (except for errors)'
        }
      ]
    },
    {
      name: 'generate',
      description: 'Generate a static web application (server-side rendered)',
      options: [
        {
          name: ['-c', '--config-file'],
          description: 'Path to Nuxt config file',
          args: {
            name: 'config',
            generators: [fileGenerator]
          }
        },
        {
          name: '--fail-on-error',
          description: 'Exit with non-zero status code if any error happens when generating pages'
        },
        {
          name: '--quiet',
          description: 'Hide build output (except for errors)'
        },
        {
          name: '--modern',
          description: 'Generate app for modern browsers'
        }
      ]
    },
    {
      name: 'info',
      description: 'Get environment info for bug reports'
    }
  ],
  options: [
    {
      name: ['-h', '--help'],
      description: 'Show help'
    },
    {
      name: ['-v', '--version'],
      description: 'Show version number'
    }
  ]
};

export const storybookSpec: CompletionSpec = {
  name: 'storybook',
  description: 'Build bulletproof UI components - Storybook CLI',
  subcommands: [
    {
      name: 'init',
      description: 'Initialize Storybook for your project',
      options: [
        {
          name: ['-f', '--force'],
          description: 'Forcely add Storybook'
        },
        {
          name: ['-s', '--skip-install'],
          description: 'Skip installing dependencies'
        },
        {
          name: ['-N', '--use-npm'],
          description: 'Use npm as package manager'
        },
        {
          name: ['-p', '--parser'],
          description: 'jscodeshift parser',
          args: {
            name: 'parser',
            suggestions: [
              { name: 'babel', description: 'Babel parser' },
              { name: 'babylon', description: 'Babylon parser' },
              { name: 'flow', description: 'Flow parser' },
              { name: 'ts', description: 'TypeScript parser' },
              { name: 'tsx', description: 'TSX parser' }
            ]
          }
        },
        {
          name: ['-t', '--type'],
          description: 'Add Storybook for a specific project type',
          args: {
            name: 'type',
            suggestions: [
              { name: 'react', description: 'React' },
              { name: 'vue', description: 'Vue.js' },
              { name: 'angular', description: 'Angular' },
              { name: 'web-components', description: 'Web Components' },
              { name: 'react-native', description: 'React Native' },
              { name: 'ember', description: 'Ember.js' },
              { name: 'html', description: 'HTML' },
              { name: 'svelte', description: 'Svelte' },
              { name: 'preact', description: 'Preact' }
            ]
          }
        },
        {
          name: ['-b', '--builder'],
          description: 'Builder to use',
          args: {
            name: 'builder',
            suggestions: [
              { name: 'webpack4', description: 'Webpack 4' },
              { name: 'webpack5', description: 'Webpack 5' },
              { name: 'vite', description: 'Vite' }
            ]
          }
        },
        {
          name: '--package-manager',
          description: 'Package manager to use',
          args: {
            name: 'manager',
            suggestions: [
              { name: 'npm', description: 'npm' },
              { name: 'yarn1', description: 'Yarn 1' },
              { name: 'yarn2', description: 'Yarn 2+' },
              { name: 'pnpm', description: 'pnpm' }
            ]
          }
        }
      ]
    },
    {
      name: 'dev',
      description: 'Start Storybook development server',
      options: [
        {
          name: ['-p', '--port'],
          description: 'Port to run Storybook',
          args: {
            name: 'port',
            generators: [portGenerator]
          }
        },
        {
          name: ['-h', '--host'],
          description: 'Host to run Storybook',
          args: {
            name: 'host',
            suggestions: [
              { name: 'localhost', description: 'Local development' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        },
        {
          name: ['-s', '--static-dir'],
          description: 'Directory where to load static files from',
          args: {
            name: 'dirs',
            generators: [folderGenerator]
          }
        },
        {
          name: ['-c', '--config-dir'],
          description: 'Directory where to load Storybook configurations from',
          args: {
            name: 'dir-name',
            generators: [folderGenerator]
          }
        },
        {
          name: '--https',
          description: 'Serve Storybook over HTTPS. Note: You must provide your own certificate information.'
        },
        {
          name: '--ssl-ca',
          description: 'Provide an SSL certificate authority',
          args: {
            name: 'ca',
            generators: [fileGenerator]
          }
        },
        {
          name: '--ssl-cert',
          description: 'Provide an SSL certificate',
          args: {
            name: 'cert',
            generators: [fileGenerator]
          }
        },
        {
          name: '--ssl-key',
          description: 'Provide an SSL key',
          args: {
            name: 'key',
            generators: [fileGenerator]
          }
        },
        {
          name: '--smoke-test',
          description: 'Exit after successful start'
        },
        {
          name: '--ci',
          description: 'CI mode (skip interactive prompts, don\'t open browser)'
        },
        {
          name: '--no-open',
          description: 'Do not open Storybook automatically in browser'
        },
        {
          name: '--quiet',
          description: 'Suppress verbose build output'
        },
        {
          name: '--no-version-updates',
          description: 'Suppress update check and version info'
        },
        {
          name: '--docs',
          description: 'Starts Storybook in documentation mode. Learn more about it in https://storybook.js.org/docs/react/writing-docs/build-documentation#publish-storybooks-documentation'
        },
        {
          name: '--debug-webpack',
          description: 'Display final webpack configurations for debugging purposes'
        },
        {
          name: '--webpack-stats-json',
          description: 'Write Webpack Stats JSON to disk'
        },
        {
          name: '--preview-url',
          description: 'Disables the default storybook preview and lets your use your own',
          args: {
            name: 'string'
          }
        },
        {
          name: '--force-build-preview',
          description: 'Build the preview iframe even if you are using --preview-url'
        }
      ]
    },
    {
      name: 'build',
      description: 'Build Storybook for production',
      options: [
        {
          name: ['-s', '--static-dir'],
          description: 'Directory where to load static files from',
          args: {
            name: 'dirs',
            generators: [folderGenerator]
          }
        },
        {
          name: ['-o', '--output-dir'],
          description: 'Directory where to store built files',
          args: {
            name: 'dir-name',
            generators: [folderGenerator]
          }
        },
        {
          name: ['-c', '--config-dir'],
          description: 'Directory where to load Storybook configurations from',
          args: {
            name: 'dir-name',
            generators: [folderGenerator]
          }
        },
        {
          name: '--quiet',
          description: 'Suppress verbose build output'
        },
        {
          name: '--loglevel',
          description: 'Control level of logging during build',
          args: {
            name: 'level',
            suggestions: [
              { name: 'silly', description: 'Silly level' },
              { name: 'verbose', description: 'Verbose level' },
              { name: 'info', description: 'Info level' },
              { name: 'warn', description: 'Warning level' },
              { name: 'error', description: 'Error level' }
            ]
          }
        },
        {
          name: '--docs',
          description: 'Build a documentation-only site'
        },
        {
          name: '--debug-webpack',
          description: 'Display final webpack configurations for debugging purposes'
        },
        {
          name: '--webpack-stats-json',
          description: 'Write Webpack Stats JSON to disk'
        },
        {
          name: '--preview-url',
          description: 'Disables the default storybook preview and lets your use your own',
          args: {
            name: 'string'
          }
        },
        {
          name: '--force-build-preview',
          description: 'Build the preview iframe even if you are using --preview-url'
        }
      ]
    },
    {
      name: 'extract',
      description: 'Extract stories.json from a built Storybook',
      args: {
        name: 'location',
        description: 'Path to Storybook built with the --extract option',
        generators: [folderGenerator]
      },
      options: [
        {
          name: '--output-dir',
          description: 'Directory where to store the stories.json file',
          args: {
            name: 'dir-name',
            generators: [folderGenerator]
          }
        }
      ]
    },
    {
      name: 'upgrade',
      description: 'Upgrade your Storybook dependencies to the latest version',
      options: [
        {
          name: '--dry-run',
          description: 'Only check for upgrades, don\'t install'
        },
        {
          name: '--skip-check',
          description: 'Skip postinstall version and automigration checks'
        },
        {
          name: '--config-dir',
          description: 'Directory where to load Storybook configurations from',
          args: {
            name: 'dir-name',
            generators: [folderGenerator]
          }
        },
        {
          name: '--package-manager',
          description: 'Package manager to use',
          args: {
            name: 'manager',
            suggestions: [
              { name: 'npm', description: 'npm' },
              { name: 'yarn1', description: 'Yarn 1' },
              { name: 'yarn2', description: 'Yarn 2+' },
              { name: 'pnpm', description: 'pnpm' }
            ]
          }
        }
      ]
    },
    {
      name: 'info',
      description: 'Prints debugging information about the local environment'
    },
    {
      name: 'migrate',
      description: 'Run a Storybook codemod migration on your source files',
      args: {
        name: 'migration',
        description: 'Name of the migration to run',
        suggestions: [
          { name: 'upgrade-hierarchy-separators', description: 'Upgrade hierarchy separators' },
          { name: 'add-component-parameters', description: 'Add component parameters' },
          { name: 'storiesof-to-csf', description: 'Convert storiesOf to CSF' }
        ]
      },
      options: [
        {
          name: '--glob',
          description: 'Glob pattern for files to migrate',
          args: {
            name: 'glob'
          }
        },
        {
          name: '--dry-run',
          description: 'Dry run mode'
        },
        {
          name: '--list',
          description: 'List available migrations'
        },
        {
          name: '--rename',
          description: 'Rename suffix of matching files after codemod has been applied',
          args: {
            name: 'rename'
          }
        },
        {
          name: '--parser',
          description: 'jscodeshift parser',
          args: {
            name: 'parser',
            suggestions: [
              { name: 'babel', description: 'Babel parser' },
              { name: 'babylon', description: 'Babylon parser' },
              { name: 'flow', description: 'Flow parser' },
              { name: 'ts', description: 'TypeScript parser' },
              { name: 'tsx', description: 'TSX parser' }
            ]
          }
        }
      ]
    }
  ],
  options: [
    {
      name: ['-V', '--version'],
      description: 'Output the version number'
    },
    {
      name: ['-h', '--help'],
      description: 'Display help for command'
    }
  ]
};