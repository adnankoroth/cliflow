import { CompletionSpec } from '../types.js';

// Resource group generator for Azure
const azureResourceGroupGenerator = {
  script: 'az group list --query "[].name" -o tsv 2>/dev/null | head -20',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(rg => rg).map(rg => ({
      name: rg,
      description: `Resource group: ${rg}`,
      type: 'option' as const
    }));
  }
};

// Azure location generator
const azureLocationGenerator = {
  script: 'az account list-locations --query "[].name" -o tsv 2>/dev/null | head -20',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(loc => loc).map(loc => ({
      name: loc,
      description: `Azure region: ${loc}`,
      type: 'option' as const
    }));
  }
};

// VM size generator
const vmSizeGenerator = {
  script: 'az vm list-sizes --location eastus --query "[].name" -o tsv 2>/dev/null | head -20',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(size => size).map(size => ({
      name: size,
      description: `VM size: ${size}`,
      type: 'option' as const
    }));
  }
};

// Azure CLI completion spec
export const azureCliSpec: CompletionSpec = {
  name: 'az',
  description: 'Azure Command Line Interface',
  subcommands: [
    {
      name: 'login',
      description: 'Log in to Azure',
      options: [
        {
          name: '--service-principal',
          description: 'Log in using a service principal'
        },
        {
          name: '--username',
          description: 'Username for authentication',
          args: {
            name: 'username',
            description: 'Azure username'
          }
        },
        {
          name: '--password',
          description: 'Password for authentication',
          args: {
            name: 'password',
            description: 'Azure password'
          }
        },
        {
          name: '--tenant',
          description: 'Azure tenant ID',
          args: {
            name: 'tenant',
            description: 'Tenant ID or domain'
          }
        }
      ]
    },
    {
      name: 'account',
      description: 'Manage Azure subscriptions and accounts',
      subcommands: [
        {
          name: 'list',
          description: 'List subscriptions'
        },
        {
          name: 'show',
          description: 'Show subscription details'
        },
        {
          name: 'set',
          description: 'Set active subscription',
          options: [
            {
              name: ['-s', '--subscription'],
              description: 'Subscription ID or name',
              args: {
                name: 'subscription',
                description: 'Subscription identifier'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'group',
      description: 'Manage resource groups',
      subcommands: [
        {
          name: 'create',
          description: 'Create a resource group',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Resource group name',
              args: {
                name: 'name',
                description: 'Resource group name'
              }
            },
            {
              name: ['-l', '--location'],
              description: 'Location',
              args: {
                name: 'location',
                generators: [azureLocationGenerator]
              }
            }
          ]
        },
        {
          name: 'delete',
          description: 'Delete a resource group',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Resource group name',
              args: {
                name: 'name',
                generators: [azureResourceGroupGenerator]
              }
            },
            {
              name: ['-y', '--yes'],
              description: 'Skip confirmation'
            }
          ]
        },
        {
          name: 'list',
          description: 'List resource groups'
        },
        {
          name: 'show',
          description: 'Show resource group details',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Resource group name',
              args: {
                name: 'name',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'vm',
      description: 'Manage virtual machines',
      subcommands: [
        {
          name: 'create',
          description: 'Create a virtual machine',
          options: [
            {
              name: ['-n', '--name'],
              description: 'VM name',
              args: {
                name: 'name',
                description: 'Virtual machine name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            },
            {
              name: '--image',
              description: 'VM image',
              args: {
                name: 'image',
                suggestions: [
                  { name: 'Ubuntu2204', description: 'Ubuntu 22.04 LTS' },
                  { name: 'Win2022Datacenter', description: 'Windows Server 2022' },
                  { name: 'CentOS85Gen2', description: 'CentOS 8.5' },
                  { name: 'Debian11', description: 'Debian 11' }
                ]
              }
            },
            {
              name: '--size',
              description: 'VM size',
              args: {
                name: 'size',
                generators: [vmSizeGenerator]
              }
            },
            {
              name: '--admin-username',
              description: 'Admin username',
              args: {
                name: 'username',
                description: 'Administrator username'
              }
            },
            {
              name: '--admin-password',
              description: 'Admin password',
              args: {
                name: 'password',
                description: 'Administrator password'
              }
            },
            {
              name: '--ssh-key-values',
              description: 'SSH public key file path',
              args: {
                name: 'key',
                template: 'filepaths'
              }
            },
            {
              name: '--location',
              description: 'Location',
              args: {
                name: 'location',
                generators: [azureLocationGenerator]
              }
            }
          ]
        },
        {
          name: 'start',
          description: 'Start virtual machines',
          options: [
            {
              name: ['-n', '--name'],
              description: 'VM name',
              args: {
                name: 'name',
                description: 'Virtual machine name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        },
        {
          name: 'stop',
          description: 'Stop virtual machines',
          options: [
            {
              name: ['-n', '--name'],
              description: 'VM name',
              args: {
                name: 'name',
                description: 'Virtual machine name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        },
        {
          name: 'restart',
          description: 'Restart virtual machines',
          options: [
            {
              name: ['-n', '--name'],
              description: 'VM name',
              args: {
                name: 'name',
                description: 'Virtual machine name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        },
        {
          name: 'delete',
          description: 'Delete virtual machines',
          options: [
            {
              name: ['-n', '--name'],
              description: 'VM name',
              args: {
                name: 'name',
                description: 'Virtual machine name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            },
            {
              name: ['-y', '--yes'],
              description: 'Skip confirmation'
            }
          ]
        },
        {
          name: 'list',
          description: 'List virtual machines',
          options: [
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            },
            {
              name: ['-o', '--output'],
              description: 'Output format',
              args: {
                name: 'format',
                suggestions: [
                  { name: 'json', description: 'JSON format' },
                  { name: 'table', description: 'Table format' },
                  { name: 'tsv', description: 'Tab-separated values' }
                ]
              }
            }
          ]
        },
        {
          name: 'show',
          description: 'Show virtual machine details',
          options: [
            {
              name: ['-n', '--name'],
              description: 'VM name',
              args: {
                name: 'name',
                description: 'Virtual machine name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'webapp',
      description: 'Manage web apps',
      subcommands: [
        {
          name: 'create',
          description: 'Create a web app',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Web app name',
              args: {
                name: 'name',
                description: 'Web application name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            },
            {
              name: ['-p', '--plan'],
              description: 'App Service plan',
              args: {
                name: 'plan',
                description: 'App Service plan name'
              }
            },
            {
              name: '--runtime',
              description: 'Runtime stack',
              args: {
                name: 'runtime',
                suggestions: [
                  { name: 'NODE|18-lts', description: 'Node.js 18 LTS' },
                  { name: 'NODE|16-lts', description: 'Node.js 16 LTS' },
                  { name: 'PYTHON|3.9', description: 'Python 3.9' },
                  { name: 'PYTHON|3.10', description: 'Python 3.10' },
                  { name: 'DOTNETCORE|6.0', description: '.NET Core 6.0' },
                  { name: 'JAVA|11', description: 'Java 11' }
                ]
              }
            }
          ]
        },
        {
          name: 'list',
          description: 'List web apps',
          options: [
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        },
        {
          name: 'delete',
          description: 'Delete a web app',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Web app name',
              args: {
                name: 'name',
                description: 'Web application name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        },
        {
          name: 'restart',
          description: 'Restart a web app',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Web app name',
              args: {
                name: 'name',
                description: 'Web application name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'storage',
      description: 'Manage storage accounts',
      subcommands: [
        {
          name: 'account',
          description: 'Manage storage accounts',
          subcommands: [
            {
              name: 'create',
              description: 'Create a storage account',
              options: [
                {
                  name: ['-n', '--name'],
                  description: 'Storage account name',
                  args: {
                    name: 'name',
                    description: 'Storage account name'
                  }
                },
                {
                  name: ['-g', '--resource-group'],
                  description: 'Resource group',
                  args: {
                    name: 'resource-group',
                    generators: [azureResourceGroupGenerator]
                  }
                },
                {
                  name: ['-l', '--location'],
                  description: 'Location',
                  args: {
                    name: 'location',
                    generators: [azureLocationGenerator]
                  }
                },
                {
                  name: '--sku',
                  description: 'Storage account SKU',
                  args: {
                    name: 'sku',
                    suggestions: [
                      { name: 'Standard_LRS', description: 'Standard locally redundant' },
                      { name: 'Standard_GRS', description: 'Standard geo-redundant' },
                      { name: 'Standard_ZRS', description: 'Standard zone-redundant' },
                      { name: 'Premium_LRS', description: 'Premium locally redundant' }
                    ]
                  }
                }
              ]
            },
            {
              name: 'list',
              description: 'List storage accounts',
              options: [
                {
                  name: ['-g', '--resource-group'],
                  description: 'Resource group',
                  args: {
                    name: 'resource-group',
                    generators: [azureResourceGroupGenerator]
                  }
                }
              ]
            },
            {
              name: 'delete',
              description: 'Delete a storage account',
              options: [
                {
                  name: ['-n', '--name'],
                  description: 'Storage account name',
                  args: {
                    name: 'name',
                    description: 'Storage account name'
                  }
                },
                {
                  name: ['-g', '--resource-group'],
                  description: 'Resource group',
                  args: {
                    name: 'resource-group',
                    generators: [azureResourceGroupGenerator]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'aks',
      description: 'Manage Azure Kubernetes Service',
      subcommands: [
        {
          name: 'create',
          description: 'Create an AKS cluster',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Cluster name',
              args: {
                name: 'name',
                description: 'AKS cluster name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            },
            {
              name: '--node-count',
              description: 'Number of nodes',
              args: {
                name: 'count',
                suggestions: [
                  { name: '1', description: '1 node' },
                  { name: '3', description: '3 nodes' },
                  { name: '5', description: '5 nodes' }
                ]
              }
            },
            {
              name: '--kubernetes-version',
              description: 'Kubernetes version',
              args: {
                name: 'version',
                suggestions: [
                  { name: '1.28.3', description: 'Kubernetes 1.28.3' },
                  { name: '1.27.7', description: 'Kubernetes 1.27.7' }
                ]
              }
            },
            {
              name: '--node-vm-size',
              description: 'Node VM size',
              args: {
                name: 'size',
                generators: [vmSizeGenerator]
              }
            }
          ]
        },
        {
          name: 'get-credentials',
          description: 'Get cluster credentials',
          options: [
            {
              name: ['-n', '--name'],
              description: 'Cluster name',
              args: {
                name: 'name',
                description: 'AKS cluster name'
              }
            },
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        },
        {
          name: 'list',
          description: 'List AKS clusters',
          options: [
            {
              name: ['-g', '--resource-group'],
              description: 'Resource group',
              args: {
                name: 'resource-group',
                generators: [azureResourceGroupGenerator]
              }
            }
          ]
        }
      ]
    }
  ]
};