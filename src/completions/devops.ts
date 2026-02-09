import { CompletionSpec } from '../types.js';

// Kubernetes resource generator
const kubernetesResourceGenerator = {
  script: 'kubectl api-resources --no-headers 2>/dev/null | awk \'{print $1}\' | head -30 || echo "pods\\nservices\\ndeployments\\nconfigmaps\\nsecrets"',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(r => r).map(resource => ({
      name: resource,
      description: `Kubernetes resource: ${resource}`,
      type: 'option' as const
    }));
  }
};

// Kustomization file generator
const kustomizationGenerator = {
  script: 'find . -maxdepth 3 \\( -name "kustomization.yaml" -o -name "kustomization.yml" -o -name "Kustomization" \\) | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Kustomization: ${file}`,
      type: 'file' as const
    }));
  }
};

// Skaffold config generator
const skaffoldConfigGenerator = {
  script: 'find . -maxdepth 3 \\( -name "skaffold.yaml" -o -name "skaffold.yml" \\) | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Skaffold config: ${file}`,
      type: 'file' as const
    }));
  }
};

// Kind cluster generator
const kindClusterGenerator = {
  script: 'kind get clusters 2>/dev/null | head -10 || echo "kind\\ndev\\ntest"',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(c => c).map(cluster => ({
      name: cluster,
      description: `Kind cluster: ${cluster}`,
      type: 'option' as const
    }));
  }
};

// Minikube profile generator
const minikubeProfileGenerator = {
  script: 'minikube profile list -o json 2>/dev/null | jq -r ".valid[].Name" | head -10 || echo "minikube\\ndev\\nstaging"',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(p => p).map(profile => ({
      name: profile,
      description: `Minikube profile: ${profile}`,
      type: 'option' as const
    }));
  }
};

// Flux source generator
const fluxSourceGenerator = {
  script: 'flux get sources all --no-header 2>/dev/null | awk \'{print $1}\' | head -10 || echo "podinfo\\napp-source\\ninfra-source"',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(s => s).map(source => ({
      name: source,
      description: `Flux source: ${source}`,
      type: 'option' as const
    }));
  }
};

// Kustomize completion spec
export const kustomizeSpec: CompletionSpec = {
  name: 'kustomize',
  description: 'Kubernetes configuration customization tool',
  subcommands: [
    {
      name: 'build',
      description: 'Build a kustomization target from a directory or URL',
      options: [
        {
          name: ['-o', '--output'],
          description: 'Output file',
          args: {
            name: 'file',
            template: 'filepaths'
          }
        },
        {
          name: '--reorder',
          description: 'Reorder resources before output',
          args: {
            name: 'reorder',
            suggestions: [
              { name: 'legacy', description: 'Legacy ordering' },
              { name: 'none', description: 'No reordering' }
            ]
          }
        },
        {
          name: '--load-restrictor',
          description: 'Load restrictions',
          args: {
            name: 'restrictor',
            suggestions: [
              { name: 'LoadRestrictionsRootOnly', description: 'Root only' },
              { name: 'LoadRestrictionsNone', description: 'No restrictions' }
            ]
          }
        },
        {
          name: '--enable-alpha-plugins',
          description: 'Enable alpha plugins'
        },
        {
          name: '--enable-helm',
          description: 'Enable Helm chart inflation'
        }
      ],
      args: {
        name: 'path',
        description: 'Path to kustomization directory',
        generators: [kustomizationGenerator],
        isOptional: true
      }
    },
    {
      name: 'create',
      description: 'Create a new kustomization file',
      options: [
        {
          name: '--resources',
          description: 'Resource files to include',
          args: {
            name: 'resources',
            template: 'filepaths',
            isVariadic: true
          }
        },
        {
          name: '--namespace',
          description: 'Set namespace for resources',
          args: {
            name: 'namespace',
            description: 'Kubernetes namespace'
          }
        },
        {
          name: '--nameprefix',
          description: 'Name prefix for resources',
          args: {
            name: 'prefix',
            description: 'Name prefix'
          }
        },
        {
          name: '--namesuffix',
          description: 'Name suffix for resources',
          args: {
            name: 'suffix',
            description: 'Name suffix'
          }
        },
        {
          name: '--labels',
          description: 'Labels to add to resources',
          args: {
            name: 'labels',
            description: 'key:value pairs'
          }
        },
        {
          name: '--annotations',
          description: 'Annotations to add to resources',
          args: {
            name: 'annotations',
            description: 'key:value pairs'
          }
        }
      ]
    },
    {
      name: 'edit',
      description: 'Edit kustomization file subcommands',
      subcommands: [
        {
          name: 'add',
          description: 'Add resources to kustomization',
          subcommands: [
            {
              name: 'resource',
              description: 'Add resources',
              args: {
                name: 'resources',
                description: 'Resource files or URLs',
                template: 'filepaths',
                isVariadic: true
              }
            },
            {
              name: 'base',
              description: 'Add bases',
              args: {
                name: 'bases',
                description: 'Base directories or URLs',
                template: 'folders',
                isVariadic: true
              }
            },
            {
              name: 'patch',
              description: 'Add patches',
              options: [
                {
                  name: '--path',
                  description: 'Path to patch file',
                  args: {
                    name: 'path',
                    template: 'filepaths'
                  }
                },
                {
                  name: '--patch',
                  description: 'Inline patch',
                  args: {
                    name: 'patch',
                    description: 'Inline patch content'
                  }
                },
                {
                  name: '--target',
                  description: 'Target selector',
                  args: {
                    name: 'target',
                    description: 'Target selector'
                  }
                }
              ]
            },
            {
              name: 'configmap',
              description: 'Add configmap generator',
              options: [
                {
                  name: '--from-literal',
                  description: 'Literal key-value pairs',
                  args: {
                    name: 'literal',
                    description: 'key=value pairs'
                  }
                },
                {
                  name: '--from-file',
                  description: 'File to include',
                  args: {
                    name: 'file',
                    template: 'filepaths'
                  }
                },
                {
                  name: '--from-env-file',
                  description: 'Env file to include',
                  args: {
                    name: 'file',
                    template: 'filepaths'
                  }
                }
              ],
              args: {
                name: 'name',
                description: 'ConfigMap name'
              }
            },
            {
              name: 'secret',
              description: 'Add secret generator',
              options: [
                {
                  name: '--from-literal',
                  description: 'Literal key-value pairs',
                  args: {
                    name: 'literal',
                    description: 'key=value pairs'
                  }
                },
                {
                  name: '--from-file',
                  description: 'File to include',
                  args: {
                    name: 'file',
                    template: 'filepaths'
                  }
                },
                {
                  name: '--from-env-file',
                  description: 'Env file to include',
                  args: {
                    name: 'file',
                    template: 'filepaths'
                  }
                },
                {
                  name: '--type',
                  description: 'Secret type',
                  args: {
                    name: 'type',
                    suggestions: [
                      { name: 'Opaque', description: 'Opaque secret' },
                      { name: 'kubernetes.io/tls', description: 'TLS secret' },
                      { name: 'kubernetes.io/dockerconfigjson', description: 'Docker config' }
                    ]
                  }
                }
              ],
              args: {
                name: 'name',
                description: 'Secret name'
              }
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove from kustomization',
          subcommands: [
            {
              name: 'resource',
              description: 'Remove resources',
              args: {
                name: 'resources',
                description: 'Resource files to remove',
                isVariadic: true
              }
            },
            {
              name: 'patch',
              description: 'Remove patches',
              args: {
                name: 'patches',
                description: 'Patches to remove',
                isVariadic: true
              }
            }
          ]
        },
        {
          name: 'set',
          description: 'Set kustomization fields',
          subcommands: [
            {
              name: 'namespace',
              description: 'Set namespace',
              args: {
                name: 'namespace',
                description: 'Namespace to set'
              }
            },
            {
              name: 'nameprefix',
              description: 'Set name prefix',
              args: {
                name: 'prefix',
                description: 'Name prefix to set'
              }
            },
            {
              name: 'namesuffix',
              description: 'Set name suffix',
              args: {
                name: 'suffix',
                description: 'Name suffix to set'
              }
            },
            {
              name: 'image',
              description: 'Set image',
              args: {
                name: 'image',
                description: 'Image name and tag'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'version',
      description: 'Show version information'
    },
    {
      name: 'completion',
      description: 'Generate completion script',
      subcommands: [
        {
          name: 'bash',
          description: 'Generate bash completion script'
        },
        {
          name: 'zsh',
          description: 'Generate zsh completion script'
        },
        {
          name: 'fish',
          description: 'Generate fish completion script'
        },
        {
          name: 'powershell',
          description: 'Generate PowerShell completion script'
        }
      ]
    }
  ]
};

// Skaffold completion spec
export const skaffoldSpec: CompletionSpec = {
  name: 'skaffold',
  description: 'Kubernetes development workflow tool',
  subcommands: [
    {
      name: 'dev',
      description: 'Run continuous development workflow',
      options: [
        {
          name: ['-f', '--filename'],
          description: 'Skaffold config file',
          args: {
            name: 'file',
            generators: [skaffoldConfigGenerator]
          }
        },
        {
          name: ['-p', '--profile'],
          description: 'Profile to activate',
          args: {
            name: 'profile',
            description: 'Profile name'
          }
        },
        {
          name: '--port-forward',
          description: 'Enable port forwarding'
        },
        {
          name: '--no-prune',
          description: 'Skip image pruning'
        },
        {
          name: '--no-prune-children',
          description: 'Skip pruning child images'
        },
        {
          name: '--cache-artifacts',
          description: 'Enable build artifact caching'
        },
        {
          name: '--skip-tests',
          description: 'Skip tests during dev workflow'
        },
        {
          name: '--cleanup',
          description: 'Delete deployments after dev loop'
        },
        {
          name: '--tail',
          description: 'Stream logs from deployed objects'
        },
        {
          name: '--trigger',
          description: 'Trigger mechanism',
          args: {
            name: 'trigger',
            suggestions: [
              { name: 'polling', description: 'File polling' },
              { name: 'notify', description: 'File system notifications' },
              { name: 'manual', description: 'Manual trigger' }
            ]
          }
        }
      ]
    },
    {
      name: 'run',
      description: 'Run a pipeline',
      options: [
        {
          name: ['-f', '--filename'],
          description: 'Skaffold config file',
          args: {
            name: 'file',
            generators: [skaffoldConfigGenerator]
          }
        },
        {
          name: ['-p', '--profile'],
          description: 'Profile to activate',
          args: {
            name: 'profile',
            description: 'Profile name'
          }
        },
        {
          name: '--tail',
          description: 'Stream logs after deploy'
        },
        {
          name: '--skip-tests',
          description: 'Skip tests'
        },
        {
          name: '--cache-artifacts',
          description: 'Enable build artifact caching'
        }
      ]
    },
    {
      name: 'build',
      description: 'Build artifacts',
      options: [
        {
          name: ['-f', '--filename'],
          description: 'Skaffold config file',
          args: {
            name: 'file',
            generators: [skaffoldConfigGenerator]
          }
        },
        {
          name: ['-t', '--tag'],
          description: 'Tag to use for images',
          args: {
            name: 'tag',
            description: 'Image tag'
          }
        },
        {
          name: '--file-output',
          description: 'Output built artifacts to file',
          args: {
            name: 'file',
            template: 'filepaths'
          }
        },
        {
          name: '--push',
          description: 'Push images after building'
        },
        {
          name: '--skip-tests',
          description: 'Skip tests during build'
        },
        {
          name: '--cache-artifacts',
          description: 'Enable build artifact caching'
        }
      ]
    },
    {
      name: 'deploy',
      description: 'Deploy artifacts',
      options: [
        {
          name: ['-f', '--filename'],
          description: 'Skaffold config file',
          args: {
            name: 'file',
            generators: [skaffoldConfigGenerator]
          }
        },
        {
          name: '--images',
          description: 'Image built artifacts file',
          args: {
            name: 'file',
            template: 'filepaths'
          }
        },
        {
          name: '--tail',
          description: 'Stream logs after deploy'
        },
        {
          name: '--skip-render',
          description: 'Skip rendering step'
        }
      ]
    },
    {
      name: 'delete',
      description: 'Delete deployed artifacts',
      options: [
        {
          name: ['-f', '--filename'],
          description: 'Skaffold config file',
          args: {
            name: 'file',
            generators: [skaffoldConfigGenerator]
          }
        }
      ]
    },
    {
      name: 'debug',
      description: 'Run in debug mode',
      options: [
        {
          name: ['-f', '--filename'],
          description: 'Skaffold config file',
          args: {
            name: 'file',
            generators: [skaffoldConfigGenerator]
          }
        },
        {
          name: '--port-forward',
          description: 'Enable port forwarding'
        },
        {
          name: '--auto-build',
          description: 'Enable auto build'
        },
        {
          name: '--auto-deploy',
          description: 'Enable auto deploy'
        },
        {
          name: '--auto-sync',
          description: 'Enable auto sync'
        }
      ]
    },
    {
      name: 'init',
      description: 'Generate initial Skaffold configuration',
      options: [
        {
          name: '--force',
          description: 'Force initialization'
        },
        {
          name: '--compose-file',
          description: 'Docker Compose file',
          args: {
            name: 'file',
            template: 'filepaths'
          }
        },
        {
          name: '--skip-build',
          description: 'Skip build configuration'
        },
        {
          name: '--skip-deploy',
          description: 'Skip deploy configuration'
        },
        {
          name: '--generate-manifests',
          description: 'Generate Kubernetes manifests'
        }
      ]
    },
    {
      name: 'fix',
      description: 'Fix/upgrade Skaffold configuration',
      options: [
        {
          name: ['-f', '--filename'],
          description: 'Skaffold config file',
          args: {
            name: 'file',
            generators: [skaffoldConfigGenerator]
          }
        },
        {
          name: '--overwrite',
          description: 'Overwrite original config file'
        }
      ]
    },
    {
      name: 'render',
      description: 'Render Kubernetes manifests',
      options: [
        {
          name: ['-f', '--filename'],
          description: 'Skaffold config file',
          args: {
            name: 'file',
            generators: [skaffoldConfigGenerator]
          }
        },
        {
          name: ['-o', '--output'],
          description: 'Output file or directory',
          args: {
            name: 'output',
            template: 'filepaths'
          }
        },
        {
          name: '--offline',
          description: 'Do not connect to Kubernetes cluster'
        }
      ]
    }
  ],
  options: [
    {
      name: ['-v', '--verbosity'],
      description: 'Log level verbosity',
      args: {
        name: 'level',
        suggestions: [
          { name: 'info', description: 'Info level' },
          { name: 'warn', description: 'Warning level' },
          { name: 'error', description: 'Error level' },
          { name: 'fatal', description: 'Fatal level' },
          { name: 'debug', description: 'Debug level' },
          { name: 'trace', description: 'Trace level' }
        ]
      }
    },
    {
      name: '--kube-context',
      description: 'Kubernetes context to use',
      args: {
        name: 'context',
        description: 'Kubernetes context'
      }
    }
  ]
};

// Kind completion spec
export const kindSpec: CompletionSpec = {
  name: 'kind',
  description: 'Kubernetes in Docker - local Kubernetes clusters',
  subcommands: [
    {
      name: 'create',
      description: 'Create resources',
      subcommands: [
        {
          name: 'cluster',
          description: 'Create a Kubernetes cluster',
          options: [
            {
              name: '--name',
              description: 'Cluster name',
              args: {
                name: 'name',
                description: 'Cluster name'
              }
            },
            {
              name: '--config',
              description: 'Cluster config file',
              args: {
                name: 'file',
                template: 'filepaths'
              }
            },
            {
              name: '--image',
              description: 'Node image to use',
              args: {
                name: 'image',
                suggestions: [
                  { name: 'kindest/node:v1.28.0', description: 'Kubernetes v1.28.0' },
                  { name: 'kindest/node:v1.27.3', description: 'Kubernetes v1.27.3' },
                  { name: 'kindest/node:v1.26.6', description: 'Kubernetes v1.26.6' },
                  { name: 'kindest/node:v1.25.11', description: 'Kubernetes v1.25.11' }
                ]
              }
            },
            {
              name: '--retain',
              description: 'Retain nodes after cluster deletion'
            },
            {
              name: '--wait',
              description: 'Wait for control plane to be ready',
              args: {
                name: 'duration',
                suggestions: [
                  { name: '0s', description: 'No wait' },
                  { name: '60s', description: '60 seconds' },
                  { name: '5m', description: '5 minutes' }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'delete',
      description: 'Delete resources',
      subcommands: [
        {
          name: 'cluster',
          description: 'Delete a cluster',
          options: [
            {
              name: '--name',
              description: 'Cluster name',
              args: {
                name: 'name',
                generators: [kindClusterGenerator]
              }
            }
          ]
        },
        {
          name: 'clusters',
          description: 'Delete all clusters'
        }
      ]
    },
    {
      name: 'get',
      description: 'Get information about resources',
      subcommands: [
        {
          name: 'clusters',
          description: 'List all clusters'
        },
        {
          name: 'nodes',
          description: 'List nodes in a cluster',
          options: [
            {
              name: '--name',
              description: 'Cluster name',
              args: {
                name: 'name',
                generators: [kindClusterGenerator]
              }
            }
          ]
        },
        {
          name: 'kubeconfig',
          description: 'Get cluster kubeconfig',
          options: [
            {
              name: '--name',
              description: 'Cluster name',
              args: {
                name: 'name',
                generators: [kindClusterGenerator]
              }
            },
            {
              name: '--internal',
              description: 'Use internal IP address'
            }
          ]
        }
      ]
    },
    {
      name: 'load',
      description: 'Load resources into cluster',
      subcommands: [
        {
          name: 'docker-image',
          description: 'Load Docker images into cluster',
          options: [
            {
              name: '--name',
              description: 'Cluster name',
              args: {
                name: 'name',
                generators: [kindClusterGenerator]
              }
            },
            {
              name: '--nodes',
              description: 'Nodes to load image into',
              args: {
                name: 'nodes',
                description: 'Node names (comma-separated)'
              }
            }
          ],
          args: {
            name: 'images',
            description: 'Docker images to load',
            isVariadic: true
          }
        },
        {
          name: 'image-archive',
          description: 'Load image archive into cluster',
          options: [
            {
              name: '--name',
              description: 'Cluster name',
              args: {
                name: 'name',
                generators: [kindClusterGenerator]
              }
            }
          ],
          args: {
            name: 'archive',
            description: 'Image archive file',
            template: 'filepaths'
          }
        }
      ]
    },
    {
      name: 'export',
      description: 'Export resources from cluster',
      subcommands: [
        {
          name: 'kubeconfig',
          description: 'Export kubeconfig',
          options: [
            {
              name: '--name',
              description: 'Cluster name',
              args: {
                name: 'name',
                generators: [kindClusterGenerator]
              }
            },
            {
              name: '--kubeconfig',
              description: 'Kubeconfig file path',
              args: {
                name: 'file',
                template: 'filepaths'
              }
            },
            {
              name: '--internal',
              description: 'Use internal IP address'
            }
          ]
        },
        {
          name: 'logs',
          description: 'Export cluster logs',
          options: [
            {
              name: '--name',
              description: 'Cluster name',
              args: {
                name: 'name',
                generators: [kindClusterGenerator]
              }
            }
          ],
          args: {
            name: 'destination',
            description: 'Destination directory',
            template: 'folders'
          }
        }
      ]
    },
    {
      name: 'build',
      description: 'Build node images',
      subcommands: [
        {
          name: 'node-image',
          description: 'Build node image',
          options: [
            {
              name: '--image',
              description: 'Image name and tag',
              args: {
                name: 'image',
                description: 'Image name:tag'
              }
            },
            {
              name: '--base-image',
              description: 'Base image to use',
              args: {
                name: 'image',
                suggestions: [
                  { name: 'kindest/base:v20230430-c7c756e', description: 'Latest base image' }
                ]
              }
            },
            {
              name: '--kube-root',
              description: 'Path to Kubernetes source',
              args: {
                name: 'path',
                template: 'folders'
              }
            }
          ]
        }
      ]
    }
  ],
  options: [
    {
      name: ['-h', '--help'],
      description: 'Help for kind'
    },
    {
      name: '--loglevel',
      description: 'Log level',
      args: {
        name: 'level',
        suggestions: [
          { name: 'panic', description: 'Panic level' },
          { name: 'fatal', description: 'Fatal level' },
          { name: 'error', description: 'Error level' },
          { name: 'warn', description: 'Warning level' },
          { name: 'info', description: 'Info level' },
          { name: 'debug', description: 'Debug level' },
          { name: 'trace', description: 'Trace level' }
        ]
      }
    }
  ]
};

// Minikube completion spec
export const minikubeSpec: CompletionSpec = {
  name: 'minikube',
  description: 'Local Kubernetes cluster',
  subcommands: [
    {
      name: 'start',
      description: 'Start a cluster',
      options: [
        {
          name: ['-p', '--profile'],
          description: 'Profile name',
          args: {
            name: 'profile',
            description: 'Profile name'
          }
        },
        {
          name: '--driver',
          description: 'Driver to use',
          args: {
            name: 'driver',
            suggestions: [
              { name: 'docker', description: 'Docker driver' },
              { name: 'hyperkit', description: 'HyperKit driver (macOS)' },
              { name: 'virtualbox', description: 'VirtualBox driver' },
              { name: 'vmware', description: 'VMware driver' },
              { name: 'kvm2', description: 'KVM2 driver (Linux)' },
              { name: 'none', description: 'Bare metal driver' }
            ]
          }
        },
        {
          name: '--kubernetes-version',
          description: 'Kubernetes version',
          args: {
            name: 'version',
            suggestions: [
              { name: 'v1.28.3', description: 'Kubernetes v1.28.3' },
              { name: 'v1.27.7', description: 'Kubernetes v1.27.7' },
              { name: 'v1.26.10', description: 'Kubernetes v1.26.10' },
              { name: 'latest', description: 'Latest stable version' }
            ]
          }
        },
        {
          name: '--cpus',
          description: 'Number of CPUs',
          args: {
            name: 'cpus',
            suggestions: [
              { name: '2', description: '2 CPUs' },
              { name: '4', description: '4 CPUs' },
              { name: '6', description: '6 CPUs' },
              { name: '8', description: '8 CPUs' }
            ]
          }
        },
        {
          name: '--memory',
          description: 'Memory allocation',
          args: {
            name: 'memory',
            suggestions: [
              { name: '2048mb', description: '2GB RAM' },
              { name: '4096mb', description: '4GB RAM' },
              { name: '6144mb', description: '6GB RAM' },
              { name: '8192mb', description: '8GB RAM' }
            ]
          }
        },
        {
          name: '--disk-size',
          description: 'Disk size',
          args: {
            name: 'size',
            suggestions: [
              { name: '20gb', description: '20GB disk' },
              { name: '40gb', description: '40GB disk' },
              { name: '100gb', description: '100GB disk' }
            ]
          }
        },
        {
          name: '--nodes',
          description: 'Number of nodes',
          args: {
            name: 'nodes',
            suggestions: [
              { name: '1', description: '1 node' },
              { name: '2', description: '2 nodes' },
              { name: '3', description: '3 nodes' }
            ]
          }
        },
        {
          name: '--container-runtime',
          description: 'Container runtime',
          args: {
            name: 'runtime',
            suggestions: [
              { name: 'docker', description: 'Docker runtime' },
              { name: 'containerd', description: 'Containerd runtime' },
              { name: 'cri-o', description: 'CRI-O runtime' }
            ]
          }
        },
        {
          name: '--network-plugin',
          description: 'Network plugin',
          args: {
            name: 'plugin',
            suggestions: [
              { name: 'cni', description: 'CNI plugin' },
              { name: 'kubenet', description: 'Kubenet plugin' }
            ]
          }
        },
        {
          name: '--cni',
          description: 'CNI plugin',
          args: {
            name: 'cni',
            suggestions: [
              { name: 'auto', description: 'Auto-detect CNI' },
              { name: 'bridge', description: 'Bridge CNI' },
              { name: 'calico', description: 'Calico CNI' },
              { name: 'cilium', description: 'Cilium CNI' },
              { name: 'flannel', description: 'Flannel CNI' }
            ]
          }
        },
        {
          name: '--addons',
          description: 'Enable addons',
          args: {
            name: 'addons',
            suggestions: [
              { name: 'dashboard', description: 'Kubernetes dashboard' },
              { name: 'ingress', description: 'Ingress controller' },
              { name: 'metrics-server', description: 'Metrics server' },
              { name: 'registry', description: 'Docker registry' }
            ]
          }
        },
        {
          name: '--mount',
          description: 'Mount host directories'
        },
        {
          name: '--mount-string',
          description: 'Mount specification',
          args: {
            name: 'mount',
            description: 'source:target:options'
          }
        }
      ]
    },
    {
      name: 'stop',
      description: 'Stop a cluster',
      options: [
        {
          name: ['-p', '--profile'],
          description: 'Profile name',
          args: {
            name: 'profile',
            generators: [minikubeProfileGenerator]
          }
        },
        {
          name: '--all',
          description: 'Stop all profiles'
        }
      ]
    },
    {
      name: 'delete',
      description: 'Delete a cluster',
      options: [
        {
          name: ['-p', '--profile'],
          description: 'Profile name',
          args: {
            name: 'profile',
            generators: [minikubeProfileGenerator]
          }
        },
        {
          name: '--all',
          description: 'Delete all profiles'
        },
        {
          name: '--purge',
          description: 'Purge minikube config'
        }
      ]
    },
    {
      name: 'status',
      description: 'Get cluster status',
      options: [
        {
          name: ['-p', '--profile'],
          description: 'Profile name',
          args: {
            name: 'profile',
            generators: [minikubeProfileGenerator]
          }
        },
        {
          name: ['-f', '--format'],
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
      name: 'dashboard',
      description: 'Open Kubernetes dashboard',
      options: [
        {
          name: ['-p', '--profile'],
          description: 'Profile name',
          args: {
            name: 'profile',
            generators: [minikubeProfileGenerator]
          }
        },
        {
          name: '--url',
          description: 'Display dashboard URL instead of opening'
        }
      ]
    },
    {
      name: 'service',
      description: 'Get service URL',
      options: [
        {
          name: ['-p', '--profile'],
          description: 'Profile name',
          args: {
            name: 'profile',
            generators: [minikubeProfileGenerator]
          }
        },
        {
          name: ['-n', '--namespace'],
          description: 'Namespace',
          args: {
            name: 'namespace',
            description: 'Kubernetes namespace'
          }
        },
        {
          name: '--url',
          description: 'Display service URL'
        },
        {
          name: '--https',
          description: 'Use HTTPS'
        }
      ],
      args: {
        name: 'service',
        description: 'Service name'
      }
    },
    {
      name: 'addons',
      description: 'Manage addons',
      subcommands: [
        {
          name: 'list',
          description: 'List available addons',
          options: [
            {
              name: ['-p', '--profile'],
              description: 'Profile name',
              args: {
                name: 'profile',
                generators: [minikubeProfileGenerator]
              }
            }
          ]
        },
        {
          name: 'enable',
          description: 'Enable an addon',
          options: [
            {
              name: ['-p', '--profile'],
              description: 'Profile name',
              args: {
                name: 'profile',
                generators: [minikubeProfileGenerator]
              }
            }
          ],
          args: {
            name: 'addon',
            description: 'Addon name',
            suggestions: [
              { name: 'dashboard', description: 'Kubernetes dashboard' },
              { name: 'ingress', description: 'Ingress controller' },
              { name: 'ingress-dns', description: 'Ingress DNS' },
              { name: 'metrics-server', description: 'Metrics server' },
              { name: 'registry', description: 'Docker registry' },
              { name: 'storage-provisioner', description: 'Storage provisioner' },
              { name: 'helm-tiller', description: 'Helm Tiller' },
              { name: 'istio', description: 'Istio service mesh' }
            ]
          }
        },
        {
          name: 'disable',
          description: 'Disable an addon',
          options: [
            {
              name: ['-p', '--profile'],
              description: 'Profile name',
              args: {
                name: 'profile',
                generators: [minikubeProfileGenerator]
              }
            }
          ],
          args: {
            name: 'addon',
            description: 'Addon name'
          }
        }
      ]
    },
    {
      name: 'profile',
      description: 'Manage profiles',
      subcommands: [
        {
          name: 'list',
          description: 'List profiles'
        }
      ]
    },
    {
      name: 'kubectl',
      description: 'Run kubectl inside minikube',
      options: [
        {
          name: ['-p', '--profile'],
          description: 'Profile name',
          args: {
            name: 'profile',
            generators: [minikubeProfileGenerator]
          }
        }
      ],
      args: {
        name: 'kubectl-args',
        description: 'kubectl arguments',
        isVariadic: true
      }
    },
    {
      name: 'docker-env',
      description: 'Configure environment to use Docker daemon inside minikube',
      options: [
        {
          name: ['-p', '--profile'],
          description: 'Profile name',
          args: {
            name: 'profile',
            generators: [minikubeProfileGenerator]
          }
        },
        {
          name: '--shell',
          description: 'Force shell type',
          args: {
            name: 'shell',
            suggestions: [
              { name: 'bash', description: 'Bash shell' },
              { name: 'zsh', description: 'Zsh shell' },
              { name: 'fish', description: 'Fish shell' },
              { name: 'powershell', description: 'PowerShell' }
            ]
          }
        },
        {
          name: ['-u', '--unset'],
          description: 'Unset environment variables'
        }
      ]
    },
    {
      name: 'image',
      description: 'Manage images',
      subcommands: [
        {
          name: 'load',
          description: 'Load an image into minikube',
          options: [
            {
              name: ['-p', '--profile'],
              description: 'Profile name',
              args: {
                name: 'profile',
                generators: [minikubeProfileGenerator]
              }
            }
          ],
          args: {
            name: 'image',
            description: 'Image name'
          }
        },
        {
          name: 'build',
          description: 'Build an image',
          options: [
            {
              name: ['-p', '--profile'],
              description: 'Profile name',
              args: {
                name: 'profile',
                generators: [minikubeProfileGenerator]
              }
            },
            {
              name: ['-t', '--tag'],
              description: 'Image tag',
              args: {
                name: 'tag',
                description: 'Image tag'
              }
            },
            {
              name: ['-f', '--file'],
              description: 'Dockerfile path',
              args: {
                name: 'file',
                template: 'filepaths'
              }
            }
          ],
          args: {
            name: 'path',
            description: 'Build context path',
            template: 'folders'
          }
        }
      ]
    }
  ]
};

// Flux completion spec
export const fluxSpec: CompletionSpec = {
  name: 'flux',
  description: 'GitOps toolkit for Kubernetes',
  subcommands: [
    {
      name: 'bootstrap',
      description: 'Bootstrap toolkit components',
      subcommands: [
        {
          name: 'github',
          description: 'Bootstrap using GitHub',
          options: [
            {
              name: '--owner',
              description: 'GitHub owner',
              args: {
                name: 'owner',
                description: 'GitHub username or organization'
              }
            },
            {
              name: '--repository',
              description: 'GitHub repository',
              args: {
                name: 'repository',
                description: 'Repository name'
              }
            },
            {
              name: '--branch',
              description: 'Branch name',
              args: {
                name: 'branch',
                suggestions: [
                  { name: 'main', description: 'Main branch' },
                  { name: 'master', description: 'Master branch' },
                  { name: 'flux-system', description: 'Flux system branch' }
                ]
              }
            },
            {
              name: '--path',
              description: 'Path in repository',
              args: {
                name: 'path',
                suggestions: [
                  { name: 'clusters/production', description: 'Production cluster path' },
                  { name: 'clusters/staging', description: 'Staging cluster path' },
                  { name: 'flux-system', description: 'Flux system path' }
                ]
              }
            },
            {
              name: '--personal',
              description: 'Use personal GitHub account'
            },
            {
              name: '--private',
              description: 'Create private repository'
            },
            {
              name: '--team',
              description: 'GitHub team with write access',
              args: {
                name: 'team',
                description: 'Team name'
              }
            }
          ]
        },
        {
          name: 'gitlab',
          description: 'Bootstrap using GitLab',
          options: [
            {
              name: '--owner',
              description: 'GitLab owner',
              args: {
                name: 'owner',
                description: 'GitLab username or group'
              }
            },
            {
              name: '--repository',
              description: 'GitLab repository',
              args: {
                name: 'repository',
                description: 'Repository name'
              }
            },
            {
              name: '--branch',
              description: 'Branch name',
              args: {
                name: 'branch',
                suggestions: [
                  { name: 'main', description: 'Main branch' },
                  { name: 'master', description: 'Master branch' },
                  { name: 'flux-system', description: 'Flux system branch' }
                ]
              }
            },
            {
              name: '--hostname',
              description: 'GitLab hostname',
              args: {
                name: 'hostname',
                suggestions: [
                  { name: 'gitlab.com', description: 'GitLab.com' },
                  { name: 'gitlab.example.com', description: 'Self-hosted GitLab' }
                ]
              }
            }
          ]
        },
        {
          name: 'git',
          description: 'Bootstrap using generic Git',
          options: [
            {
              name: '--url',
              description: 'Git repository URL',
              args: {
                name: 'url',
                description: 'Repository URL'
              }
            },
            {
              name: '--branch',
              description: 'Branch name',
              args: {
                name: 'branch',
                suggestions: [
                  { name: 'main', description: 'Main branch' },
                  { name: 'master', description: 'Master branch' },
                  { name: 'flux-system', description: 'Flux system branch' }
                ]
              }
            },
            {
              name: '--username',
              description: 'Git username',
              args: {
                name: 'username',
                description: 'Username for Git authentication'
              }
            },
            {
              name: '--password',
              description: 'Git password or token',
              args: {
                name: 'password',
                description: 'Password or access token'
              }
            }
          ]
        }
      ],
      options: [
        {
          name: '--version',
          description: 'Flux version',
          args: {
            name: 'version',
            suggestions: [
              { name: 'latest', description: 'Latest version' },
              { name: 'v2.1.2', description: 'Version 2.1.2' },
              { name: 'v2.1.1', description: 'Version 2.1.1' }
            ]
          }
        },
        {
          name: '--network-policy',
          description: 'Enable network policy'
        },
        {
          name: '--watch-all-namespaces',
          description: 'Watch all namespaces'
        },
        {
          name: '--components',
          description: 'Components to install',
          args: {
            name: 'components',
            suggestions: [
              { name: 'source-controller', description: 'Source controller' },
              { name: 'kustomize-controller', description: 'Kustomize controller' },
              { name: 'helm-controller', description: 'Helm controller' },
              { name: 'notification-controller', description: 'Notification controller' },
              { name: 'image-reflector-controller', description: 'Image reflector' },
              { name: 'image-automation-controller', description: 'Image automation' }
            ]
          }
        }
      ]
    },
    {
      name: 'check',
      description: 'Check requirements and installation',
      options: [
        {
          name: '--pre',
          description: 'Check prerequisites only'
        }
      ]
    },
    {
      name: 'install',
      description: 'Install Flux components',
      options: [
        {
          name: '--version',
          description: 'Flux version to install',
          args: {
            name: 'version',
            suggestions: [
              { name: 'latest', description: 'Latest version' }
            ]
          }
        },
        {
          name: '--dry-run',
          description: 'Only print the manifests'
        },
        {
          name: '--export',
          description: 'Export manifests to stdout'
        },
        {
          name: '--components',
          description: 'Components to install',
          args: {
            name: 'components',
            description: 'Comma-separated list of components'
          }
        }
      ]
    },
    {
      name: 'uninstall',
      description: 'Uninstall Flux components',
      options: [
        {
          name: '--dry-run',
          description: 'Only print what would be deleted'
        },
        {
          name: '--silent',
          description: 'Skip confirmation prompts'
        }
      ]
    },
    {
      name: 'create',
      description: 'Create Flux resources',
      subcommands: [
        {
          name: 'source',
          description: 'Create sources',
          subcommands: [
            {
              name: 'git',
              description: 'Create Git source',
              options: [
                {
                  name: '--url',
                  description: 'Git repository URL',
                  args: {
                    name: 'url',
                    description: 'Repository URL'
                  }
                },
                {
                  name: '--branch',
                  description: 'Branch to track',
                  args: {
                    name: 'branch',
                    suggestions: [
                      { name: 'main', description: 'Main branch' },
                      { name: 'master', description: 'Master branch' },
                      { name: 'develop', description: 'Development branch' }
                    ]
                  }
                },
                {
                  name: '--tag',
                  description: 'Tag to track',
                  args: {
                    name: 'tag',
                    description: 'Git tag'
                  }
                },
                {
                  name: '--interval',
                  description: 'Sync interval',
                  args: {
                    name: 'interval',
                    suggestions: [
                      { name: '1m', description: '1 minute' },
                      { name: '5m', description: '5 minutes' },
                      { name: '10m', description: '10 minutes' },
                      { name: '1h', description: '1 hour' }
                    ]
                  }
                },
                {
                  name: '--secret-ref',
                  description: 'Reference to secret for authentication',
                  args: {
                    name: 'secret',
                    description: 'Secret name'
                  }
                }
              ],
              args: {
                name: 'name',
                description: 'Source name'
              }
            },
            {
              name: 'helm',
              description: 'Create Helm repository source',
              options: [
                {
                  name: '--url',
                  description: 'Helm repository URL',
                  args: {
                    name: 'url',
                    description: 'Repository URL'
                  }
                },
                {
                  name: '--interval',
                  description: 'Sync interval',
                  args: {
                    name: 'interval',
                    suggestions: [
                      { name: '5m', description: '5 minutes' },
                      { name: '10m', description: '10 minutes' },
                      { name: '1h', description: '1 hour' }
                    ]
                  }
                }
              ],
              args: {
                name: 'name',
                description: 'Source name'
              }
            }
          ]
        },
        {
          name: 'kustomization',
          description: 'Create Kustomization',
          options: [
            {
              name: '--source',
              description: 'Source reference',
              args: {
                name: 'source',
                generators: [fluxSourceGenerator]
              }
            },
            {
              name: '--path',
              description: 'Path in source',
              args: {
                name: 'path',
                suggestions: [
                  { name: './', description: 'Root path' },
                  { name: './clusters/production', description: 'Production path' },
                  { name: './clusters/staging', description: 'Staging path' },
                  { name: './apps', description: 'Apps path' }
                ]
              }
            },
            {
              name: '--prune',
              description: 'Enable pruning'
            },
            {
              name: '--interval',
              description: 'Sync interval',
              args: {
                name: 'interval',
                suggestions: [
                  { name: '1m', description: '1 minute' },
                  { name: '5m', description: '5 minutes' },
                  { name: '10m', description: '10 minutes' }
                ]
              }
            },
            {
              name: '--target-namespace',
              description: 'Target namespace',
              args: {
                name: 'namespace',
                description: 'Kubernetes namespace'
              }
            },
            {
              name: '--health-check',
              description: 'Health check configuration',
              args: {
                name: 'check',
                description: 'Health check spec'
              }
            }
          ],
          args: {
            name: 'name',
            description: 'Kustomization name'
          }
        },
        {
          name: 'helmrelease',
          description: 'Create Helm release',
          options: [
            {
              name: '--source',
              description: 'Helm source reference',
              args: {
                name: 'source',
                generators: [fluxSourceGenerator]
              }
            },
            {
              name: '--chart',
              description: 'Helm chart name',
              args: {
                name: 'chart',
                description: 'Chart name'
              }
            },
            {
              name: '--chart-version',
              description: 'Chart version',
              args: {
                name: 'version',
                description: 'Chart version'
              }
            },
            {
              name: '--interval',
              description: 'Reconciliation interval',
              args: {
                name: 'interval',
                suggestions: [
                  { name: '5m', description: '5 minutes' },
                  { name: '10m', description: '10 minutes' },
                  { name: '1h', description: '1 hour' }
                ]
              }
            },
            {
              name: '--target-namespace',
              description: 'Target namespace',
              args: {
                name: 'namespace',
                description: 'Kubernetes namespace'
              }
            },
            {
              name: '--values',
              description: 'Values file',
              args: {
                name: 'file',
                template: 'filepaths'
              }
            }
          ],
          args: {
            name: 'name',
            description: 'Release name'
          }
        }
      ]
    },
    {
      name: 'get',
      description: 'Get Flux resources',
      subcommands: [
        {
          name: 'sources',
          description: 'Get sources',
          subcommands: [
            {
              name: 'git',
              description: 'Get Git sources'
            },
            {
              name: 'helm',
              description: 'Get Helm sources'
            },
            {
              name: 'all',
              description: 'Get all sources'
            }
          ]
        },
        {
          name: 'kustomizations',
          description: 'Get Kustomizations'
        },
        {
          name: 'helmreleases',
          description: 'Get Helm releases'
        },
        {
          name: 'all',
          description: 'Get all resources'
        }
      ],
      options: [
        {
          name: ['-A', '--all-namespaces'],
          description: 'List across all namespaces'
        },
        {
          name: ['-o', '--output'],
          description: 'Output format',
          args: {
            name: 'format',
            suggestions: [
              { name: 'table', description: 'Table format' },
              { name: 'yaml', description: 'YAML format' },
              { name: 'json', description: 'JSON format' }
            ]
          }
        }
      ]
    },
    {
      name: 'reconcile',
      description: 'Reconcile Flux resources',
      subcommands: [
        {
          name: 'source',
          description: 'Reconcile sources',
          subcommands: [
            {
              name: 'git',
              description: 'Reconcile Git source',
              args: {
                name: 'name',
                description: 'Source name'
              }
            },
            {
              name: 'helm',
              description: 'Reconcile Helm source',
              args: {
                name: 'name',
                description: 'Source name'
              }
            }
          ]
        },
        {
          name: 'kustomization',
          description: 'Reconcile Kustomization',
          args: {
            name: 'name',
            description: 'Kustomization name'
          }
        },
        {
          name: 'helmrelease',
          description: 'Reconcile Helm release',
          args: {
            name: 'name',
            description: 'Release name'
          }
        }
      ]
    },
    {
      name: 'suspend',
      description: 'Suspend Flux resources',
      subcommands: [
        {
          name: 'source',
          description: 'Suspend sources'
        },
        {
          name: 'kustomization',
          description: 'Suspend Kustomization'
        },
        {
          name: 'helmrelease',
          description: 'Suspend Helm release'
        }
      ]
    },
    {
      name: 'resume',
      description: 'Resume Flux resources',
      subcommands: [
        {
          name: 'source',
          description: 'Resume sources'
        },
        {
          name: 'kustomization',
          description: 'Resume Kustomization'
        },
        {
          name: 'helmrelease',
          description: 'Resume Helm release'
        }
      ]
    },
    {
      name: 'delete',
      description: 'Delete Flux resources',
      subcommands: [
        {
          name: 'source',
          description: 'Delete sources'
        },
        {
          name: 'kustomization',
          description: 'Delete Kustomization'
        },
        {
          name: 'helmrelease',
          description: 'Delete Helm release'
        }
      ]
    },
    {
      name: 'export',
      description: 'Export Flux resources',
      subcommands: [
        {
          name: 'source',
          description: 'Export sources'
        },
        {
          name: 'kustomization',
          description: 'Export Kustomization'
        },
        {
          name: 'helmrelease',
          description: 'Export Helm release'
        }
      ]
    }
  ],
  options: [
    {
      name: '--kubeconfig',
      description: 'Path to kubeconfig file',
      args: {
        name: 'file',
        template: 'filepaths'
      }
    },
    {
      name: '--context',
      description: 'Kubernetes context',
      args: {
        name: 'context',
        description: 'Kubernetes context'
      }
    },
    {
      name: ['-n', '--namespace'],
      description: 'Kubernetes namespace',
      args: {
        name: 'namespace',
        description: 'Namespace'
      }
    },
    {
      name: '--timeout',
      description: 'Timeout for operations',
      args: {
        name: 'timeout',
        suggestions: [
          { name: '5m', description: '5 minutes' },
          { name: '10m', description: '10 minutes' },
          { name: '30m', description: '30 minutes' }
        ]
      }
    }
  ]
};