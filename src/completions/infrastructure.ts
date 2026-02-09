import { CompletionSpec } from '../types.js';

// Pulumi stack generator
const stackGenerator = {
  script: 'echo -e "dev\nstaging\nproduction\ntest"',
  postProcess: (output: string) => {
    return output.trim().split('\n').map(stack => ({
      name: stack,
      description: `Stack: ${stack}`,
      type: 'argument' as const
    }));
  }
};

// Pulumi project generator
const pulumProjectGenerator = {
  script: 'find . -maxdepth 2 -name "Pulumi.yaml" -o -name "Pulumi.yml" | head -5',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', '').replace('/Pulumi.y*ml', ''),
      description: `Pulumi project`,
      type: 'folder' as const
    }));
  }
};

// Serverless service generator
const serverlessServiceGenerator = {
  script: 'find . -maxdepth 2 -name "serverless.yml" -o -name "serverless.yaml" | head -5',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', '').replace('/serverless.y*ml', ''),
      description: `Serverless service`,
      type: 'folder' as const
    }));
  }
};

// Pulumi CLI completion spec
export const pulumiSpec: CompletionSpec = {
  name: 'pulumi',
  description: 'Modern Infrastructure as Code',
  subcommands: [
    {
      name: 'new',
      description: 'Create a new Pulumi project',
      options: [
        {
          name: ['-d', '--dir'],
          description: 'The location where the project will be created',
          args: {
            name: 'directory',
            template: 'folders'
          }
        },
        {
          name: ['-f', '--force'],
          description: 'Forces content to be generated even if it would overwrite existing files'
        },
        {
          name: ['-g', '--generate-only'],
          description: 'Generate the project and leave it uninitialized'
        },
        {
          name: ['-n', '--name'],
          description: 'The project name',
          args: {
            name: 'name',
            description: 'Project name'
          }
        },
        {
          name: ['-s', '--stack'],
          description: 'The stack name to create',
          args: {
            name: 'stack',
            generators: [stackGenerator]
          }
        },
        {
          name: '--secrets-provider',
          description: 'The type of the provider for secrets encryption',
          args: {
            name: 'provider',
            suggestions: [
              { name: 'default', description: 'Use Pulumi service' },
              { name: 'passphrase', description: 'Use passphrase' },
              { name: 'awskms', description: 'Use AWS KMS' },
              { name: 'azurekeyvault', description: 'Use Azure Key Vault' },
              { name: 'gcpkms', description: 'Use Google Cloud KMS' },
              { name: 'hashivault', description: 'Use HashiCorp Vault' }
            ]
          }
        }
      ],
      args: {
        name: 'template',
        description: 'Template name or URL',
        suggestions: [
          { name: 'aws-typescript', description: 'AWS TypeScript template' },
          { name: 'aws-javascript', description: 'AWS JavaScript template' },
          { name: 'aws-python', description: 'AWS Python template' },
          { name: 'aws-go', description: 'AWS Go template' },
          { name: 'aws-csharp', description: 'AWS C# template' },
          { name: 'azure-typescript', description: 'Azure TypeScript template' },
          { name: 'azure-javascript', description: 'Azure JavaScript template' },
          { name: 'azure-python', description: 'Azure Python template' },
          { name: 'azure-go', description: 'Azure Go template' },
          { name: 'azure-csharp', description: 'Azure C# template' },
          { name: 'gcp-typescript', description: 'Google Cloud TypeScript template' },
          { name: 'gcp-javascript', description: 'Google Cloud JavaScript template' },
          { name: 'gcp-python', description: 'Google Cloud Python template' },
          { name: 'gcp-go', description: 'Google Cloud Go template' },
          { name: 'gcp-csharp', description: 'Google Cloud C# template' },
          { name: 'kubernetes-typescript', description: 'Kubernetes TypeScript template' },
          { name: 'kubernetes-javascript', description: 'Kubernetes JavaScript template' },
          { name: 'kubernetes-python', description: 'Kubernetes Python template' },
          { name: 'kubernetes-go', description: 'Kubernetes Go template' },
          { name: 'kubernetes-csharp', description: 'Kubernetes C# template' }
        ],
        isOptional: true
      }
    },
    {
      name: 'stack',
      description: 'Manage stacks',
      subcommands: [
        {
          name: 'init',
          description: 'Create an empty stack',
          options: [
            {
              name: '--secrets-provider',
              description: 'The type of the provider for secrets encryption',
              args: {
                name: 'provider',
                suggestions: [
                  { name: 'default', description: 'Use Pulumi service' },
                  { name: 'passphrase', description: 'Use passphrase' },
                  { name: 'awskms', description: 'Use AWS KMS' },
                  { name: 'azurekeyvault', description: 'Use Azure Key Vault' },
                  { name: 'gcpkms', description: 'Use Google Cloud KMS' }
                ]
              }
            }
          ],
          args: {
            name: 'stack-name',
            description: 'Stack name',
            generators: [stackGenerator]
          }
        },
        {
          name: 'select',
          description: 'Switch the current workspace to the given stack',
          args: {
            name: 'stack-name',
            description: 'Stack name',
            generators: [stackGenerator]
          }
        },
        {
          name: 'ls',
          description: 'List stacks'
        },
        {
          name: 'rm',
          description: 'Remove a stack and its configuration',
          options: [
            {
              name: ['-f', '--force'],
              description: 'Forces deletion of the stack'
            }
          ],
          args: {
            name: 'stack-name',
            description: 'Stack name',
            generators: [stackGenerator]
          }
        },
        {
          name: 'output',
          description: 'Show a stack\'s output properties',
          options: [
            {
              name: '--json',
              description: 'Emit output as JSON'
            }
          ],
          args: {
            name: 'property-name',
            description: 'Output property name',
            isOptional: true
          }
        }
      ]
    },
    {
      name: 'config',
      description: 'Manage configuration',
      subcommands: [
        {
          name: 'set',
          description: 'Set configuration value',
          options: [
            {
              name: '--secret',
              description: 'Encrypt the value as a secret'
            },
            {
              name: '--path',
              description: 'The key contains a path to a property in a map or list to set'
            }
          ],
          args: [
            {
              name: 'key',
              description: 'Configuration key'
            },
            {
              name: 'value',
              description: 'Configuration value'
            }
          ]
        },
        {
          name: 'get',
          description: 'Get configuration value',
          options: [
            {
              name: '--json',
              description: 'Emit output as JSON'
            }
          ],
          args: {
            name: 'key',
            description: 'Configuration key'
          }
        },
        {
          name: 'rm',
          description: 'Remove configuration value',
          args: {
            name: 'key',
            description: 'Configuration key'
          }
        }
      ]
    },
    {
      name: 'up',
      description: 'Create or update the resources in a stack',
      options: [
        {
          name: ['-y', '--yes'],
          description: 'Automatically approve and perform the update'
        },
        {
          name: '--diff',
          description: 'Display operation as a rich diff showing the overall change'
        },
        {
          name: ['-t', '--target'],
          description: 'Specify a single resource URN to update',
          args: {
            name: 'urn',
            description: 'Resource URN'
          }
        },
        {
          name: '--target-dependents',
          description: 'Allows updating of dependent targets'
        },
        {
          name: '--replace',
          description: 'Specify resources to replace',
          args: {
            name: 'urn',
            description: 'Resource URN'
          }
        },
        {
          name: '--refresh',
          description: 'Refresh the state of the stack\'s resources before this update'
        },
        {
          name: '--skip-preview',
          description: 'Skip the preview step'
        }
      ]
    },
    {
      name: 'preview',
      description: 'Show a preview of updates to a stack\'s resources',
      options: [
        {
          name: '--diff',
          description: 'Display operation as a rich diff'
        },
        {
          name: '--json',
          description: 'Serialize the preview diffs, operations, and overall output as JSON'
        },
        {
          name: ['-t', '--target'],
          description: 'Specify a single resource URN to preview',
          args: {
            name: 'urn',
            description: 'Resource URN'
          }
        },
        {
          name: '--target-dependents',
          description: 'Include dependents of targeted resources'
        },
        {
          name: '--replace',
          description: 'Specify resources to replace',
          args: {
            name: 'urn',
            description: 'Resource URN'
          }
        },
        {
          name: '--refresh',
          description: 'Refresh the state of the stack\'s resources before previewing'
        }
      ]
    },
    {
      name: 'destroy',
      description: 'Destroy an existing stack and its resources',
      options: [
        {
          name: ['-y', '--yes'],
          description: 'Automatically approve and perform the destroy'
        },
        {
          name: '--skip-preview',
          description: 'Skip the preview step'
        },
        {
          name: ['-t', '--target'],
          description: 'Specify a single resource URN to destroy',
          args: {
            name: 'urn',
            description: 'Resource URN'
          }
        },
        {
          name: '--target-dependents',
          description: 'Include dependents of targeted resources'
        }
      ]
    },
    {
      name: 'refresh',
      description: 'Refresh the resources in a stack',
      options: [
        {
          name: ['-y', '--yes'],
          description: 'Automatically approve and perform the refresh'
        },
        {
          name: '--skip-preview',
          description: 'Skip the preview step'
        }
      ]
    },
    {
      name: 'import',
      description: 'Import resources into the stack',
      options: [
        {
          name: ['-y', '--yes'],
          description: 'Automatically approve and perform the import'
        },
        {
          name: ['-f', '--file'],
          description: 'The path to a JSON file containing the resources to import',
          args: {
            name: 'file',
            template: 'filepaths'
          }
        },
        {
          name: '--skip-preview',
          description: 'Skip the preview step'
        }
      ]
    },
    {
      name: 'login',
      description: 'Log in to the Pulumi service',
      args: {
        name: 'url',
        description: 'Backend URL (e.g., Pulumi service, self-hosted, or local)',
        isOptional: true
      }
    },
    {
      name: 'logout',
      description: 'Log out of the Pulumi service'
    },
    {
      name: 'whoami',
      description: 'Display the current logged-in user'
    },
    {
      name: 'version',
      description: 'Print Pulumi\'s version number'
    }
  ]
};

// Serverless Framework completion spec
export const serverlessSpec: CompletionSpec = {
  name: 'serverless',
  description: 'Serverless Framework - Build web, mobile and IoT applications with serverless architectures',
  subcommands: [
    {
      name: 'create',
      description: 'Create new Serverless service',
      options: [
        {
          name: ['-t', '--template'],
          description: 'Template for the service',
          args: {
            name: 'template',
            suggestions: [
              { name: 'aws-nodejs', description: 'AWS Node.js template' },
              { name: 'aws-nodejs-typescript', description: 'AWS Node.js TypeScript template' },
              { name: 'aws-python3', description: 'AWS Python 3 template' },
              { name: 'aws-java-maven', description: 'AWS Java Maven template' },
              { name: 'aws-java-gradle', description: 'AWS Java Gradle template' },
              { name: 'aws-csharp', description: 'AWS C# template' },
              { name: 'aws-go', description: 'AWS Go template' },
              { name: 'aws-ruby', description: 'AWS Ruby template' },
              { name: 'azure-nodejs', description: 'Azure Node.js template' },
              { name: 'azure-python', description: 'Azure Python template' },
              { name: 'azure-csharp', description: 'Azure C# template' },
              { name: 'google-nodejs', description: 'Google Cloud Node.js template' },
              { name: 'google-python', description: 'Google Cloud Python template' },
              { name: 'google-go', description: 'Google Cloud Go template' },
              { name: 'openwhisk-nodejs', description: 'OpenWhisk Node.js template' }
            ]
          }
        },
        {
          name: ['-p', '--path'],
          description: 'The path where the service should be created',
          args: {
            name: 'path',
            template: 'folders'
          }
        },
        {
          name: ['-n', '--name'],
          description: 'Name for the service',
          args: {
            name: 'name',
            description: 'Service name'
          }
        },
        {
          name: '--template-url',
          description: 'Template URL',
          args: {
            name: 'url',
            description: 'Template repository URL'
          }
        }
      ],
      args: {
        name: 'name',
        description: 'Name of the service',
        isOptional: true
      }
    },
    {
      name: 'deploy',
      description: 'Deploy a Serverless service',
      options: [
        {
          name: ['-s', '--stage'],
          description: 'Stage of the service',
          args: {
            name: 'stage',
            suggestions: [
              { name: 'dev', description: 'Development stage' },
              { name: 'staging', description: 'Staging stage' },
              { name: 'prod', description: 'Production stage' },
              { name: 'test', description: 'Test stage' }
            ]
          }
        },
        {
          name: ['-r', '--region'],
          description: 'Region of the service',
          args: {
            name: 'region',
            suggestions: [
              { name: 'us-east-1', description: 'US East (N. Virginia)' },
              { name: 'us-west-2', description: 'US West (Oregon)' },
              { name: 'eu-west-1', description: 'Europe (Ireland)' },
              { name: 'eu-central-1', description: 'Europe (Frankfurt)' },
              { name: 'ap-southeast-1', description: 'Asia Pacific (Singapore)' },
              { name: 'ap-northeast-1', description: 'Asia Pacific (Tokyo)' }
            ]
          }
        },
        {
          name: ['-f', '--function'],
          description: 'Function name. Deploys a single function',
          args: {
            name: 'function',
            description: 'Function name'
          }
        },
        {
          name: ['-p', '--package'],
          description: 'Path to a pre-packaged artifact',
          args: {
            name: 'package',
            template: 'filepaths'
          }
        },
        {
          name: ['-v', '--verbose'],
          description: 'Show all stack events during deployment'
        },
        {
          name: '--force',
          description: 'Ignore warnings and deploy anyway'
        },
        {
          name: '--aws-profile',
          description: 'AWS profile to use',
          args: {
            name: 'profile',
            description: 'AWS profile name'
          }
        }
      ]
    },
    {
      name: 'invoke',
      description: 'Invoke a deployed function',
      options: [
        {
          name: ['-f', '--function'],
          description: 'Function name',
          args: {
            name: 'function',
            description: 'Function name'
          }
        },
        {
          name: ['-s', '--stage'],
          description: 'Stage of the service',
          args: {
            name: 'stage',
            suggestions: [
              { name: 'dev', description: 'Development stage' },
              { name: 'staging', description: 'Staging stage' },
              { name: 'prod', description: 'Production stage' }
            ]
          }
        },
        {
          name: ['-r', '--region'],
          description: 'Region of the service',
          args: {
            name: 'region',
            description: 'AWS region'
          }
        },
        {
          name: ['-l', '--log'],
          description: 'Trigger logging data output'
        },
        {
          name: ['-d', '--data'],
          description: 'Data to be passed as input to the function',
          args: {
            name: 'data',
            description: 'Input data (JSON string or file path)'
          }
        },
        {
          name: ['-p', '--path'],
          description: 'Path to JSON file holding input data',
          args: {
            name: 'path',
            template: 'filepaths'
          }
        },
        {
          name: ['-t', '--type'],
          description: 'Type of invocation',
          args: {
            name: 'type',
            suggestions: [
              { name: 'RequestResponse', description: 'Synchronous execution' },
              { name: 'Event', description: 'Asynchronous execution' },
              { name: 'DryRun', description: 'Validate parameters without invoking' }
            ]
          }
        }
      ]
    },
    {
      name: 'logs',
      description: 'Output the logs of a deployed function',
      options: [
        {
          name: ['-f', '--function'],
          description: 'Function name',
          args: {
            name: 'function',
            description: 'Function name'
          }
        },
        {
          name: ['-s', '--stage'],
          description: 'Stage of the service',
          args: {
            name: 'stage',
            description: 'Stage name'
          }
        },
        {
          name: ['-r', '--region'],
          description: 'Region of the service',
          args: {
            name: 'region',
            description: 'AWS region'
          }
        },
        {
          name: ['-t', '--tail'],
          description: 'Tail the log output'
        },
        {
          name: '--startTime',
          description: 'Logs before this time will not be displayed',
          args: {
            name: 'time',
            description: 'Start time (e.g., 2h, 3d, 1970-01-01)'
          }
        },
        {
          name: '--filter',
          description: 'Filter pattern for logs',
          args: {
            name: 'filter',
            description: 'CloudWatch filter pattern'
          }
        }
      ]
    },
    {
      name: 'remove',
      description: 'Remove Serverless service and all resources',
      options: [
        {
          name: ['-s', '--stage'],
          description: 'Stage of the service',
          args: {
            name: 'stage',
            description: 'Stage name'
          }
        },
        {
          name: ['-r', '--region'],
          description: 'Region of the service',
          args: {
            name: 'region',
            description: 'AWS region'
          }
        },
        {
          name: ['-v', '--verbose'],
          description: 'Show all stack events during removal'
        }
      ]
    },
    {
      name: 'info',
      description: 'Display information about the service',
      options: [
        {
          name: ['-s', '--stage'],
          description: 'Stage of the service',
          args: {
            name: 'stage',
            description: 'Stage name'
          }
        },
        {
          name: ['-r', '--region'],
          description: 'Region of the service',
          args: {
            name: 'region',
            description: 'AWS region'
          }
        },
        {
          name: ['-v', '--verbose'],
          description: 'Show all stack outputs'
        }
      ]
    },
    {
      name: 'package',
      description: 'Packages a Serverless service',
      options: [
        {
          name: ['-s', '--stage'],
          description: 'Stage of the service',
          args: {
            name: 'stage',
            description: 'Stage name'
          }
        },
        {
          name: ['-r', '--region'],
          description: 'Region of the service',
          args: {
            name: 'region',
            description: 'AWS region'
          }
        },
        {
          name: ['-p', '--package'],
          description: 'Path to save the package',
          args: {
            name: 'path',
            template: 'folders'
          }
        }
      ]
    },
    {
      name: 'plugin',
      description: 'Plugin management for Serverless service',
      subcommands: [
        {
          name: 'install',
          description: 'Install a Serverless plugin',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Plugin name',
              args: {
                name: 'name',
                suggestions: [
                  { name: 'serverless-webpack', description: 'Webpack plugin for Serverless' },
                  { name: 'serverless-offline', description: 'Run Serverless offline' },
                  { name: 'serverless-dotenv-plugin', description: 'Environment variables plugin' },
                  { name: 'serverless-plugin-typescript', description: 'TypeScript support' },
                  { name: 'serverless-python-requirements', description: 'Python requirements handling' },
                  { name: 'serverless-dynamodb-local', description: 'DynamoDB local plugin' },
                  { name: 'serverless-step-functions', description: 'Step Functions plugin' }
                ]
              }
            }
          ]
        },
        {
          name: 'uninstall',
          description: 'Uninstall a Serverless plugin',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Plugin name',
              args: {
                name: 'name',
                description: 'Plugin name to uninstall'
              }
            }
          ]
        },
        {
          name: 'list',
          description: 'List installed plugins'
        }
      ]
    },
    {
      name: 'config',
      description: 'Configure Serverless',
      subcommands: [
        {
          name: 'credentials',
          description: 'Configures a new provider profile',
          options: [
            {
              name: '--provider',
              description: 'The provider',
              args: {
                name: 'provider',
                suggestions: [
                  { name: 'aws', description: 'Amazon Web Services' },
                  { name: 'azure', description: 'Microsoft Azure' },
                  { name: 'google', description: 'Google Cloud Platform' }
                ]
              }
            },
            {
              name: '--key',
              description: 'The providers access key',
              args: {
                name: 'key',
                description: 'Access key'
              }
            },
            {
              name: '--secret',
              description: 'The providers access secret',
              args: {
                name: 'secret',
                description: 'Secret key'
              }
            },
            {
              name: '--profile',
              description: 'Name of the profile to create',
              args: {
                name: 'profile',
                description: 'Profile name'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'offline',
      description: 'Start Serverless offline (requires serverless-offline plugin)',
      options: [
        {
          name: '--port',
          description: 'Port to listen on',
          args: {
            name: 'port',
            suggestions: [
              { name: '3000', description: 'Port 3000' },
              { name: '3001', description: 'Port 3001' },
              { name: '4000', description: 'Port 4000' },
              { name: '8000', description: 'Port 8000' }
            ]
          }
        },
        {
          name: '--host',
          description: 'Host name to listen on',
          args: {
            name: 'host',
            suggestions: [
              { name: 'localhost', description: 'Local host' },
              { name: '0.0.0.0', description: 'All interfaces' }
            ]
          }
        },
        {
          name: ['-s', '--stage'],
          description: 'Stage of the service',
          args: {
            name: 'stage',
            description: 'Stage name'
          }
        }
      ]
    }
  ]
};