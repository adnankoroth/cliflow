import { CompletionSpec } from '../types.js';

// Angular project name generator
const angularProjectGenerator = {
  script: 'find . -maxdepth 2 -name "angular.json" | head -5',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', '').replace('/angular.json', ''),
      description: `Angular project`,
      type: 'folder' as const
    }));
  }
};

// Angular component generator
const angularComponentGenerator = {
  script: 'find src/app -name "*.component.ts" 2>/dev/null | sed "s|src/app/||" | sed "s|.component.ts||" | head -20',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(c => c).map(component => ({
      name: component,
      description: `Component: ${component}`,
      type: 'option' as const
    }));
  }
};

// Angular service generator
const angularServiceGenerator = {
  script: 'find src/app -name "*.service.ts" 2>/dev/null | sed "s|src/app/||" | sed "s|.service.ts||" | head -20',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(s => s).map(service => ({
      name: service,
      description: `Service: ${service}`,
      type: 'option' as const
    }));
  }
};

// Angular CLI completion spec
export const angularCliSpec: CompletionSpec = {
  name: 'ng',
  description: 'Angular CLI - command line interface for Angular',
  subcommands: [
    {
      name: 'new',
      description: 'Creates a new Angular workspace and initial app',
      args: {
        name: 'name',
        description: 'The name of the new workspace and initial app'
      },
      options: [
        {
          name: '--collection',
          description: 'A collection of schematics to use in generating the initial app',
          args: {
            name: 'collection',
            description: 'Schematic collection name'
          }
        },
        {
          name: '--commit',
          description: 'Initial git repository commit information'
        },
        {
          name: '--create-application',
          description: 'Create a new initial application project in the new workspace'
        },
        {
          name: '--directory',
          description: 'The directory name to create the workspace in',
          args: {
            name: 'directory',
            template: 'folders'
          }
        },
        {
          name: '--dry-run',
          description: 'Run through and reports activity without writing out results'
        },
        {
          name: '--force',
          description: 'Force overwriting of existing files'
        },
        {
          name: '--inline-style',
          description: 'Include styles inline in the component.ts file'
        },
        {
          name: '--inline-template',
          description: 'Include template inline in the component.ts file'
        },
        {
          name: '--interactive',
          description: 'Enable interactive input prompts'
        },
        {
          name: '--new-project-root',
          description: 'The path where new projects will be created',
          args: {
            name: 'path',
            description: 'Project root path'
          }
        },
        {
          name: '--package-manager',
          description: 'The package manager used to install dependencies',
          args: {
            name: 'package-manager',
            suggestions: [
              { name: 'npm', description: 'Use npm' },
              { name: 'yarn', description: 'Use yarn' },
              { name: 'pnpm', description: 'Use pnpm' },
              { name: 'cnpm', description: 'Use cnpm' }
            ]
          }
        },
        {
          name: '--prefix',
          description: 'The prefix to apply to generated selectors for the initial app',
          args: {
            name: 'prefix',
            description: 'Selector prefix'
          }
        },
        {
          name: '--routing',
          description: 'Generate a routing module for the initial app'
        },
        {
          name: '--skip-git',
          description: 'Do not initialize a git repository'
        },
        {
          name: '--skip-install',
          description: 'Do not install dependency packages'
        },
        {
          name: '--skip-tests',
          description: 'Do not generate test files'
        },
        {
          name: '--strict',
          description: 'Creates a workspace with stricter type checking options'
        },
        {
          name: '--style',
          description: 'The file extension or preprocessor to use for style files',
          args: {
            name: 'style',
            suggestions: [
              { name: 'css', description: 'CSS' },
              { name: 'scss', description: 'SCSS' },
              { name: 'sass', description: 'Sass' },
              { name: 'less', description: 'Less' },
              { name: 'styl', description: 'Stylus' }
            ]
          }
        },
        {
          name: '--verbose',
          description: 'Add more details to output logging'
        },
        {
          name: '--view-encapsulation',
          description: 'View encapsulation strategy for the initial app',
          args: {
            name: 'encapsulation',
            suggestions: [
              { name: 'Emulated', description: 'Emulated encapsulation' },
              { name: 'None', description: 'No encapsulation' },
              { name: 'ShadowDom', description: 'Shadow DOM encapsulation' }
            ]
          }
        }
      ]
    },
    {
      name: 'generate',
      description: 'Generate files based on a schematic',
      args: {
        name: 'schematic',
        description: 'The schematic or collection:schematic to generate',
        suggestions: [
          { name: 'component', description: 'Generate a component' },
          { name: 'directive', description: 'Generate a directive' },
          { name: 'pipe', description: 'Generate a pipe' },
          { name: 'service', description: 'Generate a service' },
          { name: 'class', description: 'Generate a class' },
          { name: 'guard', description: 'Generate a guard' },
          { name: 'interface', description: 'Generate an interface' },
          { name: 'enum', description: 'Generate an enum' },
          { name: 'module', description: 'Generate a module' },
          { name: 'application', description: 'Generate an application' },
          { name: 'library', description: 'Generate a library' }
        ]
      },
      options: [
        {
          name: '--dry-run',
          description: 'Run through without making changes'
        },
        {
          name: '--force',
          description: 'Force overwriting files'
        },
        {
          name: '--interactive',
          description: 'Enable interactive input prompts'
        },
        {
          name: '--project',
          description: 'The name of the project',
          args: {
            name: 'project',
            generators: [angularProjectGenerator]
          }
        }
      ]
    },
    {
      name: 'build',
      description: 'Compile Angular app into output directory',
      options: [
        {
          name: '--project',
          description: 'Name of the project to build',
          args: {
            name: 'project',
            generators: [angularProjectGenerator]
          }
        },
        {
          name: '--configuration',
          description: 'Target configuration',
          args: {
            name: 'configuration',
            suggestions: [
              { name: 'production', description: 'Production build' },
              { name: 'development', description: 'Development build' },
              { name: 'staging', description: 'Staging build' }
            ]
          }
        },
        {
          name: '--aot',
          description: 'Build using Ahead of Time compilation'
        },
        {
          name: '--base-href',
          description: 'Base url for the application',
          args: {
            name: 'base-href',
            description: 'Base href'
          }
        },
        {
          name: '--build-optimizer',
          description: 'Enable build optimizer'
        },
        {
          name: '--common-chunk',
          description: 'Use a separate bundle containing common code'
        },
        {
          name: '--delete-output-path',
          description: 'Delete output path before build'
        },
        {
          name: '--deploy-url',
          description: 'URL where files will be deployed',
          args: {
            name: 'deploy-url',
            description: 'Deploy URL'
          }
        },
        {
          name: '--extract-css',
          description: 'Extract CSS from global styles into CSS files'
        },
        {
          name: '--extract-licenses',
          description: 'Extract all licenses into a separate file'
        },
        {
          name: '--i18n-file',
          description: 'Localization file to use for i18n',
          args: {
            name: 'i18n-file',
            template: 'filepaths'
          }
        },
        {
          name: '--i18n-format',
          description: 'Format of the localization file',
          args: {
            name: 'i18n-format',
            suggestions: [
              { name: 'xlf', description: 'XLIFF format' },
              { name: 'xlf2', description: 'XLIFF 2.0 format' },
              { name: 'xmb', description: 'XMB format' },
              { name: 'xtb', description: 'XTB format' }
            ]
          }
        },
        {
          name: '--i18n-locale',
          description: 'Locale to use for i18n',
          args: {
            name: 'i18n-locale',
            suggestions: [
              { name: 'en', description: 'English' },
              { name: 'es', description: 'Spanish' },
              { name: 'fr', description: 'French' },
              { name: 'de', description: 'German' },
              { name: 'it', description: 'Italian' }
            ]
          }
        },
        {
          name: '--main',
          description: 'The name of the main entry-point file',
          args: {
            name: 'main',
            template: 'filepaths'
          }
        },
        {
          name: '--named-chunks',
          description: 'Use file name for lazy loaded chunks'
        },
        {
          name: '--optimization',
          description: 'Enable optimization'
        },
        {
          name: '--output-hashing',
          description: 'Define output filename cache-busting hashing mode',
          args: {
            name: 'output-hashing',
            suggestions: [
              { name: 'none', description: 'No hashing' },
              { name: 'all', description: 'Hash all files' },
              { name: 'media', description: 'Hash media files' },
              { name: 'bundles', description: 'Hash bundles' }
            ]
          }
        },
        {
          name: '--output-path',
          description: 'Path where output will be placed',
          args: {
            name: 'output-path',
            template: 'folders'
          }
        },
        {
          name: '--poll',
          description: 'Enable and configure file watching poll time period in ms',
          args: {
            name: 'poll',
            description: 'Poll interval in milliseconds'
          }
        },
        {
          name: '--preserve-symlinks',
          description: 'Do not use real path of symlinks'
        },
        {
          name: '--prod',
          description: 'Shorthand for "--configuration=production"'
        },
        {
          name: '--progress',
          description: 'Log progress to console'
        },
        {
          name: '--service-worker',
          description: 'Generate service worker config'
        },
        {
          name: '--show-circular-dependencies',
          description: 'Show circular dependencies in build'
        },
        {
          name: '--source-map',
          description: 'Output source maps'
        },
        {
          name: '--stats-json',
          description: 'Generate webpack stats JSON file'
        },
        {
          name: '--subresource-integrity',
          description: 'Enable subresource integrity checks'
        },
        {
          name: '--vendor-chunk',
          description: 'Use a separate bundle containing only vendor libraries'
        },
        {
          name: '--verbose',
          description: 'Add more details to output logging'
        },
        {
          name: '--watch',
          description: 'Run build when files change'
        }
      ]
    },
    {
      name: 'serve',
      description: 'Build and serve your app, rebuilding on file changes',
      options: [
        {
          name: '--project',
          description: 'Name of the project to serve',
          args: {
            name: 'project',
            generators: [angularProjectGenerator]
          }
        },
        {
          name: '--configuration',
          description: 'Target configuration',
          args: {
            name: 'configuration',
            suggestions: [
              { name: 'development', description: 'Development configuration' },
              { name: 'production', description: 'Production configuration' }
            ]
          }
        },
        {
          name: '--host',
          description: 'Host to listen on',
          args: {
            name: 'host',
            suggestions: [
              { name: 'localhost', description: 'Local host' },
              { name: '0.0.0.0', description: 'All interfaces' },
              { name: '127.0.0.1', description: 'Loopback' }
            ]
          }
        },
        {
          name: '--port',
          description: 'Port to listen on',
          args: {
            name: 'port',
            suggestions: [
              { name: '4200', description: 'Default Angular port' },
              { name: '3000', description: 'Alternative port' },
              { name: '8080', description: 'Common dev port' }
            ]
          }
        },
        {
          name: '--aot',
          description: 'Build using Ahead of Time compilation'
        },
        {
          name: '--base-href',
          description: 'Base url for the application',
          args: {
            name: 'base-href',
            description: 'Base href'
          }
        },
        {
          name: '--deploy-url',
          description: 'URL where files will be deployed',
          args: {
            name: 'deploy-url',
            description: 'Deploy URL'
          }
        },
        {
          name: '--disable-host-check',
          description: 'Don\'t verify connected clients are part of allowed hosts'
        },
        {
          name: '--hmr',
          description: 'Enable hot module replacement'
        },
        {
          name: '--live-reload',
          description: 'Reload on change'
        },
        {
          name: '--open',
          description: 'Open browser on server start'
        },
        {
          name: '--poll',
          description: 'Enable and configure file watching poll time',
          args: {
            name: 'poll',
            description: 'Poll interval'
          }
        },
        {
          name: '--progress',
          description: 'Log progress to console'
        },
        {
          name: '--proxy-config',
          description: 'Proxy configuration file',
          args: {
            name: 'proxy-config',
            template: 'filepaths'
          }
        },
        {
          name: '--public-host',
          description: 'The URL that the browser client should use',
          args: {
            name: 'public-host',
            description: 'Public host URL'
          }
        },
        {
          name: '--serve-path',
          description: 'The pathname where the app will be served',
          args: {
            name: 'serve-path',
            description: 'Serve path'
          }
        },
        {
          name: '--ssl',
          description: 'Serve using HTTPS'
        },
        {
          name: '--ssl-cert',
          description: 'SSL certificate to use for serving HTTPS',
          args: {
            name: 'ssl-cert',
            template: 'filepaths'
          }
        },
        {
          name: '--ssl-key',
          description: 'SSL key to use for serving HTTPS',
          args: {
            name: 'ssl-key',
            template: 'filepaths'
          }
        },
        {
          name: '--verbose',
          description: 'Add more details to output logging'
        },
        {
          name: '--watch',
          description: 'Rebuild on change'
        }
      ]
    },
    {
      name: 'test',
      description: 'Run unit tests in a project',
      options: [
        {
          name: '--project',
          description: 'Name of the project to test',
          args: {
            name: 'project',
            generators: [angularProjectGenerator]
          }
        },
        {
          name: '--browsers',
          description: 'Override browsers list in config',
          args: {
            name: 'browsers',
            suggestions: [
              { name: 'Chrome', description: 'Chrome browser' },
              { name: 'Firefox', description: 'Firefox browser' },
              { name: 'Safari', description: 'Safari browser' },
              { name: 'ChromeHeadless', description: 'Headless Chrome' }
            ]
          }
        },
        {
          name: '--code-coverage',
          description: 'Output code coverage report'
        },
        {
          name: '--include',
          description: 'Glob pattern for additional test files',
          args: {
            name: 'include',
            description: 'Include pattern'
          }
        },
        {
          name: '--karma-config',
          description: 'The name of the Karma configuration file',
          args: {
            name: 'karma-config',
            template: 'filepaths'
          }
        },
        {
          name: '--main',
          description: 'Name of the main entry-point file for test',
          args: {
            name: 'main',
            template: 'filepaths'
          }
        },
        {
          name: '--poll',
          description: 'Enable and configure file watching poll time',
          args: {
            name: 'poll',
            description: 'Poll interval'
          }
        },
        {
          name: '--preserve-symlinks',
          description: 'Do not use real path of symlinks'
        },
        {
          name: '--progress',
          description: 'Log progress to console'
        },
        {
          name: '--reporters',
          description: 'Karma reporters to use',
          args: {
            name: 'reporters',
            suggestions: [
              { name: 'progress', description: 'Progress reporter' },
              { name: 'kjhtml', description: 'Karma HTML reporter' },
              { name: 'coverage', description: 'Coverage reporter' }
            ]
          }
        },
        {
          name: '--source-map',
          description: 'Output source maps'
        },
        {
          name: '--verbose',
          description: 'Add more details to output logging'
        },
        {
          name: '--watch',
          description: 'Execute test in watch mode'
        }
      ]
    },
    {
      name: 'e2e',
      description: 'Build and serve your app, then run end-to-end tests',
      options: [
        {
          name: '--project',
          description: 'Name of the project to test',
          args: {
            name: 'project',
            generators: [angularProjectGenerator]
          }
        },
        {
          name: '--configuration',
          description: 'Target configuration',
          args: {
            name: 'configuration',
            suggestions: [
              { name: 'development', description: 'Development configuration' },
              { name: 'production', description: 'Production configuration' }
            ]
          }
        },
        {
          name: '--dev-server-target',
          description: 'Dev server target to run tests against',
          args: {
            name: 'dev-server-target',
            description: 'Dev server target'
          }
        },
        {
          name: '--host',
          description: 'Host to listen on',
          args: {
            name: 'host',
            description: 'Host address'
          }
        },
        {
          name: '--port',
          description: 'Port to listen on',
          args: {
            name: 'port',
            description: 'Port number'
          }
        },
        {
          name: '--webdriver-update',
          description: 'Try to update webdriver'
        }
      ]
    },
    {
      name: 'lint',
      description: 'Run linting tools on Angular app code in given project folder',
      options: [
        {
          name: '--project',
          description: 'Name of the project to lint',
          args: {
            name: 'project',
            generators: [angularProjectGenerator]
          }
        },
        {
          name: '--configuration',
          description: 'Target configuration',
          args: {
            name: 'configuration',
            description: 'Configuration name'
          }
        },
        {
          name: '--exclude',
          description: 'Files to exclude from linting',
          args: {
            name: 'exclude',
            description: 'Exclude pattern'
          }
        },
        {
          name: '--files',
          description: 'Files to include in linting',
          args: {
            name: 'files',
            description: 'File patterns'
          }
        },
        {
          name: '--fix',
          description: 'Fix lint errors (if supported by linter)'
        },
        {
          name: '--force',
          description: 'Succeed even if lint errors'
        },
        {
          name: '--format',
          description: 'Output format',
          args: {
            name: 'format',
            suggestions: [
              { name: 'prose', description: 'Prose format' },
              { name: 'json', description: 'JSON format' },
              { name: 'stylish', description: 'Stylish format' }
            ]
          }
        },
        {
          name: '--silent',
          description: 'Show only warnings and errors'
        },
        {
          name: '--type-check',
          description: 'Control type check for linting'
        }
      ]
    },
    {
      name: 'extract-i18n',
      description: 'Extract i18n messages from source code',
      options: [
        {
          name: '--project',
          description: 'Name of the project to extract from',
          args: {
            name: 'project',
            generators: [angularProjectGenerator]
          }
        },
        {
          name: '--configuration',
          description: 'Target configuration',
          args: {
            name: 'configuration',
            description: 'Configuration name'
          }
        },
        {
          name: '--format',
          description: 'Output format for the generated file',
          args: {
            name: 'format',
            suggestions: [
              { name: 'xlf', description: 'XLIFF format' },
              { name: 'xlf2', description: 'XLIFF 2.0 format' },
              { name: 'xmb', description: 'XMB format' }
            ]
          }
        },
        {
          name: '--ivy',
          description: 'Use the new Ivy based extraction'
        },
        {
          name: '--out-file',
          description: 'Name of the file to output',
          args: {
            name: 'out-file',
            description: 'Output file name'
          }
        },
        {
          name: '--output-path',
          description: 'Path where output will be placed',
          args: {
            name: 'output-path',
            template: 'folders'
          }
        },
        {
          name: '--progress',
          description: 'Log progress to console'
        }
      ]
    },
    {
      name: 'update',
      description: 'Update Angular app dependencies',
      args: {
        name: 'packages',
        description: 'Package names to update',
        isVariadic: true,
        isOptional: true
      },
      options: [
        {
          name: '--all',
          description: 'Update all packages'
        },
        {
          name: '--allow-dirty',
          description: 'Allow updating when repository has uncommitted changes'
        },
        {
          name: '--create-commits',
          description: 'Create source control commits for updates and migrations'
        },
        {
          name: '--dry-run',
          description: 'Run through without making changes'
        },
        {
          name: '--force',
          description: 'Force overwriting files'
        },
        {
          name: '--from',
          description: 'Version from which to migrate from',
          args: {
            name: 'from',
            description: 'From version'
          }
        },
        {
          name: '--migrate-only',
          description: 'Only perform migrations, skip package update'
        },
        {
          name: '--next',
          description: 'Use largest version, including pre-releases'
        },
        {
          name: '--registry',
          description: 'NPM registry to use',
          args: {
            name: 'registry',
            description: 'Registry URL'
          }
        },
        {
          name: '--to',
          description: 'Version up to which to apply migrations',
          args: {
            name: 'to',
            description: 'To version'
          }
        },
        {
          name: '--verbose',
          description: 'Display additional details'
        }
      ]
    },
    {
      name: 'add',
      description: 'Add support for an external library to your project',
      args: {
        name: 'collection',
        description: 'The package to add',
        suggestions: [
          { name: '@angular/material', description: 'Angular Material' },
          { name: '@angular/cdk', description: 'Angular CDK' },
          { name: '@angular/pwa', description: 'PWA support' },
          { name: '@angular/elements', description: 'Angular Elements' },
          { name: '@ngrx/store', description: 'NgRx Store' },
          { name: '@ngrx/effects', description: 'NgRx Effects' },
          { name: '@angular/fire', description: 'AngularFire' }
        ]
      },
      options: [
        {
          name: '--defaults',
          description: 'Use default options for the added library'
        },
        {
          name: '--dry-run',
          description: 'Run through without making changes'
        },
        {
          name: '--force',
          description: 'Force overwriting files'
        },
        {
          name: '--interactive',
          description: 'Enable interactive input prompts'
        },
        {
          name: '--registry',
          description: 'NPM registry to use',
          args: {
            name: 'registry',
            description: 'Registry URL'
          }
        },
        {
          name: '--skip-confirmation',
          description: 'Skip asking a confirmation prompt'
        },
        {
          name: '--verbose',
          description: 'Display additional details'
        }
      ]
    },
    {
      name: 'config',
      description: 'Get/set configuration values',
      args: [
        {
          name: 'json-path',
          description: 'The configuration key to set or query',
          isOptional: true,
          suggestions: [
            { name: 'projects', description: 'Project configurations' },
            { name: 'defaultProject', description: 'Default project name' },
            { name: 'schematics', description: 'Schematic configurations' },
            { name: 'cli', description: 'CLI configurations' }
          ]
        },
        {
          name: 'value',
          description: 'The value to set',
          isOptional: true
        }
      ],
      options: [
        {
          name: '--global',
          description: 'Access global configuration'
        },
        {
          name: '--type',
          description: 'Value type',
          args: {
            name: 'type',
            suggestions: [
              { name: 'boolean', description: 'Boolean value' },
              { name: 'number', description: 'Number value' },
              { name: 'string', description: 'String value' }
            ]
          }
        }
      ]
    },
    {
      name: 'version',
      description: 'Output Angular CLI version'
    },
    {
      name: 'help',
      description: 'Show help information',
      args: {
        name: 'command',
        description: 'Command to get help for',
        isOptional: true
      }
    }
  ],
  options: [
    {
      name: '--help',
      description: 'Show help'
    },
    {
      name: '--version',
      description: 'Show version'
    }
  ]
};