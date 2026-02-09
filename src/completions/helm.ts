import { CompletionSpec, Generator } from '../types.js';
import { k8sNamespaces, k8sContexts } from '../engine/common-generators.js';

// helm completion spec for CLIFlow  
const helmReleaseGenerator: Generator = {
  script: 'helm list --short 2>/dev/null',
  postProcess: (output) => {
    if (output.includes('Error:') || output.trim() === '') {
      return [];
    }
    return output.split('\n').filter(line => line.trim()).map(release => ({
      name: release.trim(),
      description: 'Helm release',
      type: 'argument' as const,
      icon: '⚓',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

const helmRepoGenerator: Generator = {
  script: 'helm repo list -o json 2>/dev/null',
  postProcess: (output) => {
    try {
      if (output.includes('Error:') || output.trim() === '' || output.trim() === 'null') {
        return [];
      }
      const repos = JSON.parse(output);
      return repos.map((repo: any) => ({
        name: repo.name,
        description: `Repository: ${repo.url}`,
        type: 'argument' as const,
        icon: '📚',
        priority: 100
      }));
    } catch {
      return [];
    }
  },
  cache: { ttl: 300000, strategy: 'ttl' as const }
};

const helmChartGenerator: Generator = {
  script: 'helm search repo --output json 2>/dev/null',
  postProcess: (output) => {
    try {
      if (output.includes('Error:') || output.trim() === '' || output.trim() === 'null') {
        return [];
      }
      const charts = JSON.parse(output);
      return charts.slice(0, 50).map((chart: any) => ({
        name: chart.name,
        description: `${chart.description || 'Helm chart'} (${chart.version})`,
        type: 'argument' as const,
        icon: '📦',
        priority: 100
      }));
    } catch {
      return [];
    }
  },
  cache: { ttl: 600000, strategy: 'ttl' as const }
};

export const helmSpec: CompletionSpec = {
  name: 'helm',
  description: 'The Kubernetes package manager',
  options: [
    {
      name: '--debug',
      description: 'Enable verbose output'
    },
    {
      name: ['-h', '--help'],
      description: 'Help for helm'
    },
    {
      name: '--kube-context',
      description: 'Name of the kubeconfig context to use',
      args: { name: 'context', generators: [k8sContexts] }
    },
    {
      name: '--kubeconfig',
      description: 'Path to the kubeconfig file',
      args: {
        name: 'string',
        template: ['filepaths']
      }
    },
    {
      name: ['-n', '--namespace'],
      description: 'Namespace scope',
      args: { name: 'namespace', generators: [k8sNamespaces], filterStrategy: 'fuzzy' }
    },
    {
      name: '--registry-config',
      description: 'Path to the registry config file',
      args: {
        name: 'string',
        template: ['filepaths']
      }
    },
    {
      name: '--repository-cache',
      description: 'Path to the repository cache directory',
      args: {
        name: 'string',
        template: ['folders']
      }
    },
    {
      name: '--repository-config',
      description: 'Path to the repositories file',
      args: {
        name: 'string',
        template: ['filepaths']
      }
    }
  ],
  subcommands: [
    {
      name: 'install',
      description: 'Install a chart',
      args: [
        {
          name: 'release-name',
          description: 'Name of the release'
        },
        {
          name: 'chart',
          description: 'Chart reference',
          generators: [helmChartGenerator]
        }
      ],
      options: [
        {
          name: '--atomic',
          description: 'Rollback changes if install fails'
        },
        {
          name: '--ca-file',
          description: 'Chart repository CA bundle',
          args: {
            name: 'string',
            template: ['filepaths']
          }
        },
        {
          name: '--cert-file',
          description: 'Client certificate file',
          args: {
            name: 'string',
            template: ['filepaths']
          }
        },
        {
          name: '--create-namespace',
          description: 'Create namespace if not present'
        },
        {
          name: '--dependency-update',
          description: 'Update dependencies before install'
        },
        {
          name: '--description',
          description: 'Custom description',
          args: { name: 'string' }
        },
        {
          name: '--devel',
          description: 'Use development versions'
        },
        {
          name: '--disable-openapi-validation',
          description: 'Disable OpenAPI validation'
        },
        {
          name: '--dry-run',
          description: 'Simulate install'
        },
        {
          name: '--force',
          description: 'Force resource updates'
        },
        {
          name: '--generate-name',
          description: 'Generate name for release'
        },
        {
          name: '--insecure-skip-tls-verify',
          description: 'Skip TLS certificate checks'
        },
        {
          name: '--key-file',
          description: 'Client private key file',
          args: {
            name: 'string',
            template: ['filepaths']
          }
        },
        {
          name: '--name-template',
          description: 'Template for generated name',
          args: { name: 'string' }
        },
        {
          name: '--no-hooks',
          description: 'Skip running hooks'
        },
        {
          name: '--output',
          description: 'Output format',
          args: {
            name: 'format',
            suggestions: [
              { name: 'table', description: 'Table output' },
              { name: 'json', description: 'JSON output' },
              { name: 'yaml', description: 'YAML output' }
            ]
          }
        },
        {
          name: '--pass-credentials',
          description: 'Pass credentials to all domains'
        },
        {
          name: '--password',
          description: 'Chart repository password',
          args: { name: 'string' }
        },
        {
          name: '--post-renderer',
          description: 'Path to executable for post-rendering',
          args: {
            name: 'postrenderer',
            template: ['filepaths']
          }
        },
        {
          name: '--render-subchart-notes',
          description: 'Render subchart notes'
        },
        {
          name: '--replace',
          description: 'Re-use release name'
        },
        {
          name: '--repo',
          description: 'Chart repository URL',
          args: { name: 'string' }
        },
        {
          name: '--set',
          description: 'Set values on command line',
          args: { name: 'stringArray', isVariadic: true }
        },
        {
          name: '--set-file',
          description: 'Set values from files',
          args: { name: 'stringArray', isVariadic: true }
        },
        {
          name: '--set-json',
          description: 'Set JSON values',
          args: { name: 'stringArray', isVariadic: true }
        },
        {
          name: '--set-literal',
          description: 'Set literal string values',
          args: { name: 'stringArray', isVariadic: true }
        },
        {
          name: '--set-string',
          description: 'Set string values',
          args: { name: 'stringArray', isVariadic: true }
        },
        {
          name: '--skip-crds',
          description: 'Skip installing CRDs'
        },
        {
          name: '--timeout',
          description: 'Time to wait for operations',
          args: { name: 'duration' }
        },
        {
          name: '--username',
          description: 'Chart repository username',
          args: { name: 'string' }
        },
        {
          name: ['-f', '--values'],
          description: 'Values file',
          args: {
            name: 'valueFiles',
            template: ['filepaths'],
            isVariadic: true
          }
        },
        {
          name: '--verify',
          description: 'Verify package signature'
        },
        {
          name: '--version',
          description: 'Chart version constraint',
          args: { name: 'string' }
        },
        {
          name: '--wait',
          description: 'Wait for resources to be ready'
        },
        {
          name: '--wait-for-jobs',
          description: 'Wait for Jobs to complete'
        }
      ]
    },
    {
      name: 'upgrade',
      description: 'Upgrade a release',
      args: [
        {
          name: 'release',
          description: 'Release name',
          generators: [helmReleaseGenerator]
        },
        {
          name: 'chart',
          description: 'Chart reference',
          generators: [helmChartGenerator]
        }
      ],
      options: [
        {
          name: '--atomic',
          description: 'Rollback changes if upgrade fails'
        },
        {
          name: '--cleanup-on-fail',
          description: 'Delete new resources on failure'
        },
        {
          name: '--create-namespace',
          description: 'Create namespace if not present'
        },
        {
          name: '--description',
          description: 'Custom description',
          args: { name: 'string' }
        },
        {
          name: '--devel',
          description: 'Use development versions'
        },
        {
          name: '--disable-openapi-validation',
          description: 'Disable OpenAPI validation'
        },
        {
          name: '--dry-run',
          description: 'Simulate upgrade'
        },
        {
          name: '--force',
          description: 'Force resource updates'
        },
        {
          name: '--history-max',
          description: 'Maximum number of revisions',
          args: { name: 'int' }
        },
        {
          name: ['-i', '--install'],
          description: 'Install if release does not exist'
        },
        {
          name: '--no-hooks',
          description: 'Skip running hooks'
        },
        {
          name: '--recreate-pods',
          description: 'Perform pods restart'
        },
        {
          name: '--reset-values',
          description: 'Reset values to chart defaults'
        },
        {
          name: '--reuse-values',
          description: 'Reuse last release values'
        },
        {
          name: '--set',
          description: 'Set values on command line',
          args: { name: 'stringArray', isVariadic: true }
        },
        {
          name: '--timeout',
          description: 'Time to wait for operations',
          args: { name: 'duration' }
        },
        {
          name: ['-f', '--values'],
          description: 'Values file',
          args: {
            name: 'valueFiles',
            template: ['filepaths'],
            isVariadic: true
          }
        },
        {
          name: '--version',
          description: 'Chart version constraint',
          args: { name: 'string' }
        },
        {
          name: '--wait',
          description: 'Wait for resources to be ready'
        }
      ]
    },
    {
      name: 'uninstall',
      description: 'Uninstall a release',
      args: {
        name: 'release',
        description: 'Release name',
        generators: [helmReleaseGenerator],
        isVariadic: true
      },
      options: [
        {
          name: '--cascade',
          description: 'Cascade deletion policy',
          args: {
            name: 'string',
            suggestions: [
              { name: 'background', description: 'Background cascade' },
              { name: 'foreground', description: 'Foreground cascade' },
              { name: 'orphan', description: 'Orphan resources' }
            ]
          }
        },
        {
          name: '--description',
          description: 'Custom description',
          args: { name: 'string' }
        },
        {
          name: '--dry-run',
          description: 'Simulate uninstall'
        },
        {
          name: '--keep-history',
          description: 'Remove release from default list, keep history'
        },
        {
          name: '--no-hooks',
          description: 'Skip running hooks'
        },
        {
          name: '--timeout',
          description: 'Time to wait for operations',
          args: { name: 'duration' }
        },
        {
          name: '--wait',
          description: 'Wait for deletion to complete'
        }
      ]
    },
    {
      name: 'list',
      description: 'List releases',
      options: [
        {
          name: ['-a', '--all'],
          description: 'Show all releases'
        },
        {
          name: '--all-namespaces',
          description: 'List across all namespaces'
        },
        {
          name: ['-d', '--date'],
          description: 'Sort by release date'
        },
        {
          name: '--deployed',
          description: 'Show deployed releases'
        },
        {
          name: '--failed',
          description: 'Show failed releases'
        },
        {
          name: ['-f', '--filter'],
          description: 'Regular expression filter',
          args: { name: 'string' }
        },
        {
          name: ['-m', '--max'],
          description: 'Maximum number of releases',
          args: { name: 'int' }
        },
        {
          name: ['-o', '--offset'],
          description: 'Skip first N releases',
          args: { name: 'int' }
        },
        {
          name: '--output',
          description: 'Output format',
          args: {
            name: 'format',
            suggestions: [
              { name: 'table', description: 'Table output' },
              { name: 'json', description: 'JSON output' },
              { name: 'yaml', description: 'YAML output' }
            ]
          }
        },
        {
          name: '--pending',
          description: 'Show pending releases'
        },
        {
          name: ['-r', '--reverse'],
          description: 'Reverse sort order'
        },
        {
          name: ['-q', '--short'],
          description: 'Output short listing format'
        },
        {
          name: '--superseded',
          description: 'Show superseded releases'
        },
        {
          name: '--uninstalled',
          description: 'Show uninstalled releases'
        },
        {
          name: '--uninstalling',
          description: 'Show releases being uninstalled'
        }
      ]
    },
    {
      name: 'status',
      description: 'Display status of release',
      args: {
        name: 'release',
        description: 'Release name',
        generators: [helmReleaseGenerator]
      },
      options: [
        {
          name: '--output',
          description: 'Output format',
          args: {
            name: 'format',
            suggestions: [
              { name: 'table', description: 'Table output' },
              { name: 'json', description: 'JSON output' },
              { name: 'yaml', description: 'YAML output' }
            ]
          }
        },
        {
          name: '--revision',
          description: 'Revision number',
          args: { name: 'int' }
        }
      ]
    },
    {
      name: 'history',
      description: 'Fetch release history',
      args: {
        name: 'release',
        description: 'Release name',
        generators: [helmReleaseGenerator]
      },
      options: [
        {
          name: '--max',
          description: 'Maximum number of revisions',
          args: { name: 'int' }
        },
        {
          name: '--output',
          description: 'Output format',
          args: {
            name: 'format',
            suggestions: [
              { name: 'table', description: 'Table output' },
              { name: 'json', description: 'JSON output' },
              { name: 'yaml', description: 'YAML output' }
            ]
          }
        }
      ]
    },
    {
      name: 'rollback',
      description: 'Roll back a release to previous revision',
      args: [
        {
          name: 'release',
          description: 'Release name',
          generators: [helmReleaseGenerator]
        },
        {
          name: 'revision',
          description: 'Revision number',
          isOptional: true
        }
      ],
      options: [
        {
          name: '--cleanup-on-fail',
          description: 'Delete new resources on failure'
        },
        {
          name: '--dry-run',
          description: 'Simulate rollback'
        },
        {
          name: '--force',
          description: 'Force resource update'
        },
        {
          name: '--history-max',
          description: 'Maximum number of revisions',
          args: { name: 'int' }
        },
        {
          name: '--no-hooks',
          description: 'Skip running hooks'
        },
        {
          name: '--recreate-pods',
          description: 'Perform pods restart'
        },
        {
          name: '--timeout',
          description: 'Time to wait for operations',
          args: { name: 'duration' }
        },
        {
          name: '--wait',
          description: 'Wait for resources to be ready'
        }
      ]
    },
    {
      name: 'repo',
      description: 'Manage chart repositories',
      subcommands: [
        {
          name: 'add',
          description: 'Add chart repository',
          args: [
            {
              name: 'name',
              description: 'Repository name'
            },
            {
              name: 'url',
              description: 'Repository URL'
            }
          ],
          options: [
            {
              name: '--ca-file',
              description: 'CA bundle file',
              args: {
                name: 'string',
                template: ['filepaths']
              }
            },
            {
              name: '--cert-file',
              description: 'Client certificate file',
              args: {
                name: 'string',
                template: ['filepaths']
              }
            },
            {
              name: '--insecure-skip-tls-verify',
              description: 'Skip TLS certificate checks'
            },
            {
              name: '--key-file',
              description: 'Client private key file',
              args: {
                name: 'string',
                template: ['filepaths']
              }
            },
            {
              name: '--no-update',
              description: 'Do not update local cache'
            },
            {
              name: '--password',
              description: 'Repository password',
              args: { name: 'string' }
            },
            {
              name: '--pass-credentials',
              description: 'Pass credentials to all domains'
            },
            {
              name: '--username',
              description: 'Repository username',
              args: { name: 'string' }
            }
          ]
        },
        {
          name: 'list',
          description: 'List chart repositories',
          options: [
            {
              name: '--output',
              description: 'Output format',
              args: {
                name: 'format',
                suggestions: [
                  { name: 'table', description: 'Table output' },
                  { name: 'json', description: 'JSON output' },
                  { name: 'yaml', description: 'YAML output' }
                ]
              }
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove chart repository',
          args: {
            name: 'name',
            description: 'Repository name',
            generators: [helmRepoGenerator],
            isVariadic: true
          }
        },
        {
          name: 'update',
          description: 'Update information on available charts',
          args: {
            name: 'repo',
            description: 'Repository name',
            generators: [helmRepoGenerator],
            isOptional: true,
            isVariadic: true
          }
        },
        {
          name: 'index',
          description: 'Generate an index file',
          args: {
            name: 'dir',
            description: 'Directory to index',
            template: ['folders']
          },
          options: [
            {
              name: '--merge',
              description: 'Merge with existing index',
              args: {
                name: 'string',
                template: ['filepaths']
              }
            },
            {
              name: '--url',
              description: 'URL of repository',
              args: { name: 'string' }
            }
          ]
        }
      ]
    },
    {
      name: 'search',
      description: 'Search for charts',
      subcommands: [
        {
          name: 'repo',
          description: 'Search repositories for keyword',
          args: {
            name: 'keyword',
            description: 'Search keyword',
            isOptional: true
          },
          options: [
            {
              name: '--devel',
              description: 'Use development versions'
            },
            {
              name: '--max-col-width',
              description: 'Maximum column width',
              args: { name: 'uint' }
            },
            {
              name: '--output',
              description: 'Output format',
              args: {
                name: 'format',
                suggestions: [
                  { name: 'table', description: 'Table output' },
                  { name: 'json', description: 'JSON output' },
                  { name: 'yaml', description: 'YAML output' }
                ]
              }
            },
            {
              name: ['-r', '--regexp'],
              description: 'Use regular expressions'
            },
            {
              name: '--version',
              description: 'Search using semantic version constraints',
              args: { name: 'string' }
            },
            {
              name: ['-l', '--versions'],
              description: 'Show all versions'
            }
          ]
        },
        {
          name: 'hub',
          description: 'Search Helm Hub for charts',
          args: {
            name: 'keyword',
            description: 'Search keyword',
            isOptional: true
          },
          options: [
            {
              name: '--endpoint',
              description: 'Hub endpoint URL',
              args: { name: 'string' }
            },
            {
              name: '--max-col-width',
              description: 'Maximum column width',
              args: { name: 'uint' }
            },
            {
              name: '--output',
              description: 'Output format',
              args: {
                name: 'format',
                suggestions: [
                  { name: 'table', description: 'Table output' },
                  { name: 'json', description: 'JSON output' },
                  { name: 'yaml', description: 'YAML output' }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'create',
      description: 'Create a new chart',
      args: {
        name: 'name',
        description: 'Chart name'
      },
      options: [
        {
          name: ['-p', '--starter'],
          description: 'Named starter to base chart on',
          args: { name: 'string' }
        }
      ]
    },
    {
      name: 'package',
      description: 'Package a chart directory into chart archive',
      args: {
        name: 'chart-path',
        description: 'Path to chart',
        template: ['folders']
      },
      options: [
        {
          name: '--app-version',
          description: 'Set app version',
          args: { name: 'string' }
        },
        {
          name: ['-u', '--dependency-update'],
          description: 'Update dependencies'
        },
        {
          name: ['-d', '--destination'],
          description: 'Location to write archive',
          args: {
            name: 'string',
            template: ['folders']
          }
        },
        {
          name: '--key',
          description: 'Name of key to use for signing',
          args: { name: 'string' }
        },
        {
          name: '--keyring',
          description: 'Location of public keys',
          args: {
            name: 'string',
            template: ['filepaths']
          }
        },
        {
          name: '--passphrase-file',
          description: 'Location of passphrase file',
          args: {
            name: 'string',
            template: ['filepaths']
          }
        },
        {
          name: '--sign',
          description: 'Use PGP private key to sign package'
        },
        {
          name: '--version',
          description: 'Set chart version',
          args: { name: 'string' }
        }
      ]
    },
    {
      name: 'lint',
      description: 'Verify chart follows best practices',
      args: {
        name: 'path',
        description: 'Path to chart',
        template: ['folders'],
        isVariadic: true
      },
      options: [
        {
          name: '--set',
          description: 'Set values on command line',
          args: { name: 'stringArray', isVariadic: true }
        },
        {
          name: '--strict',
          description: 'Fail on lint warnings'
        },
        {
          name: ['-f', '--values'],
          description: 'Values file',
          args: {
            name: 'valueFiles',
            template: ['filepaths'],
            isVariadic: true
          }
        },
        {
          name: '--with-subcharts',
          description: 'Lint subcharts'
        }
      ]
    },
    {
      name: 'template',
      description: 'Render chart templates locally',
      args: [
        {
          name: 'name',
          description: 'Release name'
        },
        {
          name: 'chart',
          description: 'Chart reference',
          generators: [helmChartGenerator]
        }
      ],
      options: [
        {
          name: ['-a', '--api-versions'],
          description: 'Kubernetes api versions',
          args: { name: 'stringSlice', isVariadic: true }
        },
        {
          name: '--ca-file',
          description: 'Chart repository CA bundle',
          args: {
            name: 'string',
            template: ['filepaths']
          }
        },
        {
          name: '--cert-file',
          description: 'Client certificate file',
          args: {
            name: 'string',
            template: ['filepaths']
          }
        },
        {
          name: '--create-namespace',
          description: 'Create namespace if not present'
        },
        {
          name: '--dependency-update',
          description: 'Update dependencies'
        },
        {
          name: '--description',
          description: 'Custom description',
          args: { name: 'string' }
        },
        {
          name: '--devel',
          description: 'Use development versions'
        },
        {
          name: '--disable-openapi-validation',
          description: 'Disable OpenAPI validation'
        },
        {
          name: '--generate-name',
          description: 'Generate name for release'
        },
        {
          name: '--include-crds',
          description: 'Include CRDs in output'
        },
        {
          name: '--insecure-skip-tls-verify',
          description: 'Skip TLS certificate checks'
        },
        {
          name: '--is-upgrade',
          description: 'Set .Release.IsUpgrade'
        },
        {
          name: '--key-file',
          description: 'Client private key file',
          args: {
            name: 'string',
            template: ['filepaths']
          }
        },
        {
          name: '--kube-version',
          description: 'Kubernetes version',
          args: { name: 'string' }
        },
        {
          name: '--name-template',
          description: 'Template for generated name',
          args: { name: 'string' }
        },
        {
          name: '--no-hooks',
          description: 'Skip running hooks'
        },
        {
          name: '--output-dir',
          description: 'Write to files in directory',
          args: {
            name: 'string',
            template: ['folders']
          }
        },
        {
          name: '--pass-credentials',
          description: 'Pass credentials to all domains'
        },
        {
          name: '--password',
          description: 'Repository password',
          args: { name: 'string' }
        },
        {
          name: '--post-renderer',
          description: 'Path to executable for post-rendering',
          args: {
            name: 'postrenderer',
            template: ['filepaths']
          }
        },
        {
          name: '--render-subchart-notes',
          description: 'Render subchart notes'
        },
        {
          name: '--repo',
          description: 'Chart repository URL',
          args: { name: 'string' }
        },
        {
          name: ['-s', '--show-only'],
          description: 'Show only specified templates',
          args: { name: 'stringSlice', isVariadic: true }
        },
        {
          name: '--skip-crds',
          description: 'Skip CRDs'
        },
        {
          name: '--skip-tests',
          description: 'Skip test files'
        },
        {
          name: '--username',
          description: 'Repository username',
          args: { name: 'string' }
        },
        {
          name: '--validate',
          description: 'Validate templates against schema'
        },
        {
          name: ['-f', '--values'],
          description: 'Values file',
          args: {
            name: 'valueFiles',
            template: ['filepaths'],
            isVariadic: true
          }
        },
        {
          name: '--verify',
          description: 'Verify package signature'
        },
        {
          name: '--version',
          description: 'Chart version constraint',
          args: { name: 'string' }
        }
      ]
    },
    {
      name: 'get',
      description: 'Download extended information about a release',
      subcommands: [
        {
          name: 'all',
          description: 'Get all information for a release',
          args: {
            name: 'release',
            description: 'Release name',
            generators: [helmReleaseGenerator]
          }
        },
        {
          name: 'hooks',
          description: 'Get hooks for a release',
          args: {
            name: 'release',
            description: 'Release name',
            generators: [helmReleaseGenerator]
          }
        },
        {
          name: 'manifest',
          description: 'Get manifest for a release',
          args: {
            name: 'release',
            description: 'Release name',
            generators: [helmReleaseGenerator]
          }
        },
        {
          name: 'notes',
          description: 'Get notes for a release',
          args: {
            name: 'release',
            description: 'Release name',
            generators: [helmReleaseGenerator]
          }
        },
        {
          name: 'values',
          description: 'Get values for a release',
          args: {
            name: 'release',
            description: 'Release name',
            generators: [helmReleaseGenerator]
          },
          options: [
            {
              name: ['-a', '--all'],
              description: 'Show all values'
            },
            {
              name: '--output',
              description: 'Output format',
              args: {
                name: 'format',
                suggestions: [
                  { name: 'table', description: 'Table output' },
                  { name: 'json', description: 'JSON output' },
                  { name: 'yaml', description: 'YAML output' }
                ]
              }
            },
            {
              name: '--revision',
              description: 'Revision number',
              args: { name: 'int' }
            }
          ]
        }
      ]
    },
    {
      name: 'test',
      description: 'Run tests for a release',
      args: {
        name: 'release',
        description: 'Release name',
        generators: [helmReleaseGenerator]
      },
      options: [
        {
          name: '--filter',
          description: 'Filter tests by name',
          args: { name: 'stringSlice', isVariadic: true }
        },
        {
          name: '--logs',
          description: 'Fetch logs for each test pod'
        },
        {
          name: '--timeout',
          description: 'Time to wait for operations',
          args: { name: 'duration' }
        }
      ]
    },
    {
      name: 'version',
      description: 'Show client and server version information',
      options: [
        {
          name: '--client',
          description: 'Client version only'
        },
        {
          name: ['-c', '--short'],
          description: 'Short version'
        },
        {
          name: '--template',
          description: 'Go template for formatting version',
          args: { name: 'string' }
        }
      ]
    },
    {
      name: 'env',
      description: 'Show Helm client environment information'
    },
    {
      name: 'plugin',
      description: 'Install, list, or uninstall Helm plugins',
      subcommands: [
        {
          name: 'install',
          description: 'Install Helm plugin',
          args: {
            name: 'path',
            description: 'Plugin path or URL',
            isVariadic: true
          },
          options: [
            {
              name: '--version',
              description: 'Plugin version',
              args: { name: 'string' }
            }
          ]
        },
        {
          name: 'list',
          description: 'List installed plugins'
        },
        {
          name: 'uninstall',
          description: 'Uninstall Helm plugin',
          args: {
            name: 'plugin',
            description: 'Plugin name',
            isVariadic: true
          }
        },
        {
          name: 'update',
          description: 'Update Helm plugins',
          args: {
            name: 'plugin',
            description: 'Plugin name',
            isVariadic: true
          }
        }
      ]
    }
  ]
};