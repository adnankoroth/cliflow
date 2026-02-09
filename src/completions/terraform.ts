import { CompletionSpec, Generator } from '../types.js';

// terraform completion spec for CLIFlow
const terraformWorkspaceGenerator: Generator = {
  script: 'terraform workspace list',
  postProcess: (output) => {
    if (output.includes('No workspaces found') || output.includes('error')) {
      return [];
    }
    return output.split('\n').filter(line => line.trim()).map(workspace => ({
      name: workspace.replace('* ', '').trim(),
      description: 'Terraform workspace',
      type: 'argument' as const,
      icon: '🏗️',
      priority: workspace.startsWith('* ') ? 150 : 100
    }));
  },
  cache: { ttl: 30000, strategy: 'directory-change' as const }
};

const terraformStateListGenerator: Generator = {
  script: 'terraform state list',
  postProcess: (output) => {
    if (output.includes('No state file') || output.includes('error')) {
      return [];
    }
    return output.split('\n').filter(line => line.trim()).map(resource => ({
      name: resource.trim(),
      description: 'Terraform resource',
      type: 'argument' as const,
      icon: '📦',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'directory-change' as const }
};

export const terraformSpec: CompletionSpec = {
  name: 'terraform',
  description: 'Infrastructure as Code tool',
  options: [
    {
      name: ['-h', '--help'],
      description: 'Show help'
    },
    {
      name: ['-v', '--version'],
      description: 'Show version'
    },
    {
      name: '-chdir',
      description: 'Switch to a different working directory',
      args: {
        name: 'directory',
        template: ['folders']
      }
    }
  ],
  subcommands: [
    {
      name: 'init',
      description: 'Initialize a Terraform working directory',
      options: [
        {
          name: '-upgrade',
          description: 'Upgrade modules and plugins'
        },
        {
          name: '-get',
          description: 'Download modules',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'Download modules (default)' },
              { name: 'false', description: 'Skip downloading modules' }
            ]
          }
        },
        {
          name: '-backend',
          description: 'Configure backend',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'Configure backend (default)' },
              { name: 'false', description: 'Skip backend configuration' }
            ]
          }
        },
        {
          name: '-reconfigure',
          description: 'Reconfigure backend ignoring existing configuration'
        },
        {
          name: '-migrate-state',
          description: 'Migrate existing state to new backend'
        },
        {
          name: '-force-copy',
          description: 'Force copying state from existing backend'
        },
        {
          name: '-from-module',
          description: 'Copy configuration from module',
          args: { name: 'source' }
        }
      ]
    },
    {
      name: 'plan',
      description: 'Create an execution plan',
      options: [
        {
          name: '-out',
          description: 'Save plan to file',
          args: {
            name: 'path',
            template: ['filepaths']
          }
        },
        {
          name: '-var',
          description: 'Set a variable',
          args: { name: 'assignment', isVariadic: true }
        },
        {
          name: '-var-file',
          description: 'Load variables from file',
          args: {
            name: 'filename',
            template: ['filepaths']
          }
        },
        {
          name: '-target',
          description: 'Target specific resources',
          args: {
            name: 'resource',
            generators: [terraformStateListGenerator],
            isVariadic: true
          }
        },
        {
          name: '-destroy',
          description: 'Create a plan to destroy all resources'
        },
        {
          name: '-detailed-exitcode',
          description: 'Return detailed exit codes'
        },
        {
          name: '-refresh',
          description: 'Update state prior to checking for differences',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'Refresh state (default)' },
              { name: 'false', description: 'Skip state refresh' }
            ]
          }
        },
        {
          name: '-parallelism',
          description: 'Limit concurrent operations',
          args: { name: 'n' }
        },
        {
          name: '-no-color',
          description: 'Disable colored output'
        },
        {
          name: '-compact-warnings',
          description: 'Show compact warning summaries'
        }
      ]
    },
    {
      name: 'apply',
      description: 'Apply changes to infrastructure',
      args: {
        name: 'plan-file',
        description: 'Plan file to apply',
        template: ['filepaths'],
        isOptional: true
      },
      options: [
        {
          name: '-auto-approve',
          description: 'Skip interactive approval'
        },
        {
          name: '-var',
          description: 'Set a variable',
          args: { name: 'assignment', isVariadic: true }
        },
        {
          name: '-var-file',
          description: 'Load variables from file',
          args: {
            name: 'filename',
            template: ['filepaths']
          }
        },
        {
          name: '-target',
          description: 'Target specific resources',
          args: {
            name: 'resource',
            generators: [terraformStateListGenerator],
            isVariadic: true
          }
        },
        {
          name: '-replace',
          description: 'Force replacement of resources',
          args: {
            name: 'resource',
            generators: [terraformStateListGenerator],
            isVariadic: true
          }
        },
        {
          name: '-destroy',
          description: 'Destroy all resources'
        },
        {
          name: '-parallelism',
          description: 'Limit concurrent operations',
          args: { name: 'n' }
        },
        {
          name: '-refresh',
          description: 'Update state prior to checking for differences',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'Refresh state (default)' },
              { name: 'false', description: 'Skip state refresh' }
            ]
          }
        },
        {
          name: '-no-color',
          description: 'Disable colored output'
        },
        {
          name: '-compact-warnings',
          description: 'Show compact warning summaries'
        }
      ]
    },
    {
      name: 'destroy',
      description: 'Destroy infrastructure',
      options: [
        {
          name: '-auto-approve',
          description: 'Skip interactive approval'
        },
        {
          name: '-var',
          description: 'Set a variable',
          args: { name: 'assignment', isVariadic: true }
        },
        {
          name: '-var-file',
          description: 'Load variables from file',
          args: {
            name: 'filename',
            template: ['filepaths']
          }
        },
        {
          name: '-target',
          description: 'Target specific resources',
          args: {
            name: 'resource',
            generators: [terraformStateListGenerator],
            isVariadic: true
          }
        },
        {
          name: '-parallelism',
          description: 'Limit concurrent operations',
          args: { name: 'n' }
        },
        {
          name: '-no-color',
          description: 'Disable colored output'
        }
      ]
    },
    {
      name: 'validate',
      description: 'Validate configuration files',
      options: [
        {
          name: '-json',
          description: 'Output in JSON format'
        },
        {
          name: '-no-color',
          description: 'Disable colored output'
        }
      ]
    },
    {
      name: 'fmt',
      description: 'Format configuration files',
      options: [
        {
          name: '-list',
          description: 'List files that need formatting',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'List files (default)' },
              { name: 'false', description: 'Don\'t list files' }
            ]
          }
        },
        {
          name: '-write',
          description: 'Write formatted files',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'Write files (default)' },
              { name: 'false', description: 'Don\'t write files' }
            ]
          }
        },
        {
          name: '-diff',
          description: 'Show diffs for formatting changes'
        },
        {
          name: '-check',
          description: 'Check if files are formatted'
        },
        {
          name: '-recursive',
          description: 'Process subdirectories recursively'
        }
      ],
      args: {
        name: 'target',
        description: 'File or directory to format',
        template: ['filepaths', 'folders'],
        isOptional: true
      }
    },
    {
      name: 'show',
      description: 'Show current state or plan',
      args: {
        name: 'path',
        description: 'State file or plan file',
        template: ['filepaths'],
        isOptional: true
      },
      options: [
        {
          name: '-json',
          description: 'Output in JSON format'
        },
        {
          name: '-no-color',
          description: 'Disable colored output'
        }
      ]
    },
    {
      name: 'output',
      description: 'Show output values',
      args: {
        name: 'name',
        description: 'Output name',
        isOptional: true
      },
      options: [
        {
          name: '-json',
          description: 'Output in JSON format'
        },
        {
          name: '-raw',
          description: 'Raw output without quotes'
        },
        {
          name: '-no-color',
          description: 'Disable colored output'
        }
      ]
    },
    {
      name: 'refresh',
      description: 'Update state to match real resources',
      options: [
        {
          name: '-var',
          description: 'Set a variable',
          args: { name: 'assignment', isVariadic: true }
        },
        {
          name: '-var-file',
          description: 'Load variables from file',
          args: {
            name: 'filename',
            template: ['filepaths']
          }
        },
        {
          name: '-target',
          description: 'Target specific resources',
          args: {
            name: 'resource',
            generators: [terraformStateListGenerator],
            isVariadic: true
          }
        }
      ]
    },
    {
      name: 'import',
      description: 'Import existing infrastructure',
      args: [
        {
          name: 'address',
          description: 'Resource address'
        },
        {
          name: 'id',
          description: 'Resource ID'
        }
      ],
      options: [
        {
          name: '-config',
          description: 'Path to configuration',
          args: {
            name: 'path',
            template: ['folders']
          }
        },
        {
          name: '-input',
          description: 'Ask for input if necessary',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'Ask for input (default)' },
              { name: 'false', description: 'Don\'t ask for input' }
            ]
          }
        },
        {
          name: '-no-color',
          description: 'Disable colored output'
        }
      ]
    },
    {
      name: 'taint',
      description: 'Mark a resource for recreation',
      args: {
        name: 'address',
        description: 'Resource address',
        generators: [terraformStateListGenerator]
      },
      options: [
        {
          name: '-allow-missing',
          description: 'Succeed even if resource is missing'
        },
        {
          name: '-lock',
          description: 'Lock state file',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'Lock state (default)' },
              { name: 'false', description: 'Don\'t lock state' }
            ]
          }
        }
      ]
    },
    {
      name: 'untaint',
      description: 'Remove taint from a resource',
      args: {
        name: 'address',
        description: 'Resource address',
        generators: [terraformStateListGenerator]
      },
      options: [
        {
          name: '-allow-missing',
          description: 'Succeed even if resource is missing'
        },
        {
          name: '-lock',
          description: 'Lock state file',
          args: {
            name: 'bool',
            suggestions: [
              { name: 'true', description: 'Lock state (default)' },
              { name: 'false', description: 'Don\'t lock state' }
            ]
          }
        }
      ]
    },
    {
      name: 'workspace',
      description: 'Manage workspaces',
      subcommands: [
        {
          name: 'list',
          description: 'List workspaces'
        },
        {
          name: 'new',
          description: 'Create a new workspace',
          args: {
            name: 'name',
            description: 'Workspace name'
          }
        },
        {
          name: 'select',
          description: 'Select a workspace',
          args: {
            name: 'name',
            description: 'Workspace name',
            generators: [terraformWorkspaceGenerator]
          }
        },
        {
          name: 'show',
          description: 'Show current workspace name'
        },
        {
          name: 'delete',
          description: 'Delete a workspace',
          args: {
            name: 'name',
            description: 'Workspace name',
            generators: [terraformWorkspaceGenerator]
          },
          options: [
            {
              name: '-force',
              description: 'Delete even if not empty'
            }
          ]
        }
      ]
    },
    {
      name: 'state',
      description: 'Advanced state management',
      subcommands: [
        {
          name: 'list',
          description: 'List resources in state'
        },
        {
          name: 'show',
          description: 'Show resource in state',
          args: {
            name: 'address',
            description: 'Resource address',
            generators: [terraformStateListGenerator]
          }
        },
        {
          name: 'mv',
          description: 'Move resource in state',
          args: [
            {
              name: 'source',
              description: 'Source address',
              generators: [terraformStateListGenerator]
            },
            {
              name: 'destination',
              description: 'Destination address'
            }
          ]
        },
        {
          name: 'rm',
          description: 'Remove resource from state',
          args: {
            name: 'address',
            description: 'Resource address',
            generators: [terraformStateListGenerator],
            isVariadic: true
          }
        },
        {
          name: 'pull',
          description: 'Pull current state and output to stdout'
        },
        {
          name: 'push',
          description: 'Update remote state from local state file',
          args: {
            name: 'path',
            description: 'Path to state file',
            template: ['filepaths']
          },
          options: [
            {
              name: '-force',
              description: 'Write state even if lineage differs'
            }
          ]
        }
      ]
    },
    {
      name: 'providers',
      description: 'Show provider requirements and usage',
      options: [
        {
          name: '-json',
          description: 'Output in JSON format'
        }
      ]
    },
    {
      name: 'version',
      description: 'Show Terraform version'
    },
    {
      name: 'force-unlock',
      description: 'Release a stuck lock',
      args: {
        name: 'lock-id',
        description: 'Lock ID to release'
      },
      options: [
        {
          name: '-force',
          description: 'Don\'t ask for input'
        }
      ]
    },
    {
      name: 'graph',
      description: 'Generate a visual graph of resources',
      options: [
        {
          name: '-type',
          description: 'Type of graph to generate',
          args: {
            name: 'type',
            suggestions: [
              { name: 'plan', description: 'Plan graph' },
              { name: 'plan-destroy', description: 'Destroy plan graph' },
              { name: 'apply', description: 'Apply graph' },
              { name: 'validate', description: 'Validation graph' },
              { name: 'input', description: 'Input graph' },
              { name: 'refresh', description: 'Refresh graph' }
            ]
          }
        },
        {
          name: '-draw-cycles',
          description: 'Highlight cycles in the graph'
        }
      ]
    },
    {
      name: 'get',
      description: 'Download and install modules',
      options: [
        {
          name: '-update',
          description: 'Check for updates to downloaded modules'
        },
        {
          name: '-no-color',
          description: 'Disable colored output'
        }
      ]
    }
  ]
};