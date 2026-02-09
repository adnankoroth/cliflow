import { CompletionSpec, Generator } from '../types.js';

// Generator for GCP projects
const gcpProjectGenerator: Generator = {
  script: 'gcloud projects list --format="value(projectId)" 2>/dev/null',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n')
      .filter(line => line.trim())
      .map(project => ({
        name: project.trim(),
        description: `GCP Project: ${project.trim()}`,
        type: 'argument' as const,
        icon: '☁️',
        priority: 100
      }));
  },
  cache: { ttl: 300000, strategy: 'ttl' as const } // 5 minutes
};

// Generator for GCP compute instances
const gcpInstanceGenerator: Generator = {
  script: 'gcloud compute instances list --format="value(name)" 2>/dev/null',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n')
      .filter(line => line.trim())
      .map(instance => ({
        name: instance.trim(),
        description: `Compute instance: ${instance.trim()}`,
        type: 'argument' as const,
        icon: '🖥️',
        priority: 100
      }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const } // 1 minute
};

// Generator for GCP zones
const gcpZoneGenerator: Generator = {
  script: 'gcloud compute zones list --format="value(name)" 2>/dev/null',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n')
      .filter(line => line.trim())
      .map(zone => ({
        name: zone.trim(),
        description: `GCP Zone: ${zone.trim()}`,
        type: 'argument' as const,
        icon: '🌍',
        priority: 100
      }));
  },
  cache: { ttl: 3600000, strategy: 'ttl' as const } // 1 hour
};

export const gcpSpec: CompletionSpec = {
  name: 'gcloud',
  description: 'Google Cloud Platform CLI',
  subcommands: [
    {
      name: 'auth',
      description: 'Manage oauth2 credentials for the Google Cloud SDK',
      subcommands: [
        {
          name: 'login',
          description: 'Authorize gcloud to access the Cloud Platform with Google user credentials',
          options: [
            {
              name: '--brief',
              description: 'Minimal user output'
            },
            {
              name: '--enable-gdrive-access',
              description: 'Enable Google Drive access'
            },
            {
              name: '--force',
              description: 'Re-run the web authorization flow even if the given account has valid credentials'
            },
            {
              name: '--no-launch-browser',
              description: 'Do not launch a browser for authorization'
            }
          ]
        },
        {
          name: 'logout',
          description: 'Revoke access credentials for the specified account',
          args: {
            name: 'account',
            description: 'Account to logout',
            isOptional: true
          }
        },
        {
          name: 'list',
          description: 'Lists credentialed accounts',
          options: [
            {
              name: '--filter-account',
              description: 'List only credentials for one account'
            },
            {
              name: '--format',
              description: 'Set the format for printing command output resources'
            }
          ]
        },
        {
          name: 'activate-service-account',
          description: 'Authorize access to Google Cloud Platform with a service account',
          args: {
            name: 'account',
            description: 'Service account email address'
          },
          options: [
            {
              name: '--key-file',
              description: 'Path to the private key file'
            },
            {
              name: '--password-file',
              description: 'Path to a file containing the password for the private key'
            },
            {
              name: '--prompt-for-password',
              description: 'Prompt for the password for the private key'
            }
          ]
        }
      ]
    },
    {
      name: 'compute',
      description: 'Create and manipulate Compute Engine resources',
      subcommands: [
        {
          name: 'instances',
          description: 'Read and manipulate Compute Engine virtual machine instances',
          subcommands: [
            {
              name: 'list',
              description: 'List Google Compute Engine instances',
              options: [
                {
                  name: '--zones',
                  description: 'Zones to list instances from',
                  args: {
                    name: 'zones',
                    generators: [gcpZoneGenerator],
                    isVariadic: true
                  }
                },
                {
                  name: '--format',
                  description: 'Set the format for printing command output resources'
                }
              ]
            },
            {
              name: 'create',
              description: 'Create Google Compute Engine virtual machine instances',
              args: {
                name: 'instance-names',
                description: 'Names of the instances to create',
                isVariadic: true
              },
              options: [
                {
                  name: '--zone',
                  description: 'Zone of the instance to create',
                  args: {
                    name: 'zone',
                    generators: [gcpZoneGenerator]
                  }
                },
                {
                  name: '--machine-type',
                  description: 'Machine type of the instance to create'
                },
                {
                  name: '--image-family',
                  description: 'Image family for the operating system'
                },
                {
                  name: '--image-project',
                  description: 'Project against which all image and image family references will be resolved'
                },
                {
                  name: '--boot-disk-size',
                  description: 'Size of the boot disk'
                },
                {
                  name: '--boot-disk-type',
                  description: 'Type of the boot disk'
                }
              ]
            },
            {
              name: 'delete',
              description: 'Delete Google Compute Engine virtual machine instances',
              args: {
                name: 'instance-names',
                description: 'Names of the instances to delete',
                generators: [gcpInstanceGenerator],
                isVariadic: true
              },
              options: [
                {
                  name: '--zone',
                  description: 'Zone of the instance to delete',
                  args: {
                    name: 'zone',
                    generators: [gcpZoneGenerator]
                  }
                },
                {
                  name: '--quiet',
                  description: 'Disable all interactive prompts'
                }
              ]
            },
            {
              name: 'start',
              description: 'Start a stopped virtual machine instance',
              args: {
                name: 'instance-names',
                description: 'Names of the instances to start',
                generators: [gcpInstanceGenerator],
                isVariadic: true
              },
              options: [
                {
                  name: '--zone',
                  description: 'Zone of the instance to start',
                  args: {
                    name: 'zone',
                    generators: [gcpZoneGenerator]
                  }
                },
                {
                  name: '--async',
                  description: 'Return immediately, without waiting for the operation in progress to complete'
                }
              ]
            },
            {
              name: 'stop',
              description: 'Stop a virtual machine instance',
              args: {
                name: 'instance-names',
                description: 'Names of the instances to stop',
                generators: [gcpInstanceGenerator],
                isVariadic: true
              },
              options: [
                {
                  name: '--zone',
                  description: 'Zone of the instance to stop',
                  args: {
                    name: 'zone',
                    generators: [gcpZoneGenerator]
                  }
                },
                {
                  name: '--async',
                  description: 'Return immediately, without waiting for the operation in progress to complete'
                }
              ]
            },
            {
              name: 'ssh',
              description: 'SSH into a virtual machine instance',
              args: {
                name: 'instance-name',
                description: 'Name of the instance to SSH into',
                generators: [gcpInstanceGenerator]
              },
              options: [
                {
                  name: '--zone',
                  description: 'Zone of the instance to connect to',
                  args: {
                    name: 'zone',
                    generators: [gcpZoneGenerator]
                  }
                },
                {
                  name: '--command',
                  description: 'Command to run on the remote host'
                },
                {
                  name: '--ssh-key-file',
                  description: 'Path to the SSH key file'
                }
              ]
            }
          ]
        },
        {
          name: 'zones',
          description: 'List Compute Engine zones',
          subcommands: [
            {
              name: 'list',
              description: 'List Google Compute Engine zones',
              options: [
                {
                  name: '--filter',
                  description: 'Apply a Boolean filter'
                },
                {
                  name: '--format',
                  description: 'Set the format for printing command output resources'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'container',
      description: 'Deploy and manage clusters of machines for running containers',
      subcommands: [
        {
          name: 'clusters',
          description: 'Deploy and teardown Google Kubernetes Engine clusters',
          subcommands: [
            {
              name: 'create',
              description: 'Create a cluster for running containers',
              args: {
                name: 'name',
                description: 'Name of the cluster'
              },
              options: [
                {
                  name: '--zone',
                  description: 'Zone to run in',
                  args: {
                    name: 'zone',
                    generators: [gcpZoneGenerator]
                  }
                },
                {
                  name: '--machine-type',
                  description: 'Machine type to use for nodes'
                },
                {
                  name: '--num-nodes',
                  description: 'Number of nodes in the cluster'
                },
                {
                  name: '--enable-autoscaling',
                  description: 'Enable cluster autoscaling'
                },
                {
                  name: '--max-nodes',
                  description: 'Maximum number of nodes in the node pool'
                },
                {
                  name: '--min-nodes',
                  description: 'Minimum number of nodes in the node pool'
                }
              ]
            },
            {
              name: 'delete',
              description: 'Delete an existing cluster for running containers',
              args: {
                name: 'name',
                description: 'Name of the cluster to delete'
              },
              options: [
                {
                  name: '--zone',
                  description: 'Zone of the cluster',
                  args: {
                    name: 'zone',
                    generators: [gcpZoneGenerator]
                  }
                },
                {
                  name: '--async',
                  description: 'Return immediately, without waiting for the operation in progress to complete'
                }
              ]
            },
            {
              name: 'get-credentials',
              description: 'Fetch credentials for a running cluster',
              args: {
                name: 'name',
                description: 'Name of the cluster to get credentials for'
              },
              options: [
                {
                  name: '--zone',
                  description: 'Zone of the cluster',
                  args: {
                    name: 'zone',
                    generators: [gcpZoneGenerator]
                  }
                }
              ]
            },
            {
              name: 'list',
              description: 'List existing clusters for running containers',
              options: [
                {
                  name: '--zone',
                  description: 'Zone to list clusters from',
                  args: {
                    name: 'zone',
                    generators: [gcpZoneGenerator]
                  }
                },
                {
                  name: '--format',
                  description: 'Set the format for printing command output resources'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'projects',
      description: 'Create and manage project access policies',
      subcommands: [
        {
          name: 'list',
          description: 'List projects accessible by the active account',
          options: [
            {
              name: '--filter',
              description: 'Apply a Boolean filter'
            },
            {
              name: '--format',
              description: 'Set the format for printing command output resources'
            }
          ]
        },
        {
          name: 'describe',
          description: 'Show metadata for a project',
          args: {
            name: 'project-id',
            description: 'ID of the project to describe',
            generators: [gcpProjectGenerator]
          }
        }
      ]
    },
    {
      name: 'config',
      description: 'View and edit Cloud SDK properties',
      subcommands: [
        {
          name: 'set',
          description: 'Set a Cloud SDK property',
          args: {
            name: 'property',
            description: 'Property to set'
          }
        },
        {
          name: 'get',
          description: 'Get a Cloud SDK property',
          args: {
            name: 'property',
            description: 'Property to get'
          }
        },
        {
          name: 'list',
          description: 'List Cloud SDK properties for the currently active configuration',
          options: [
            {
              name: '--all',
              description: 'List all set and unset properties'
            }
          ]
        }
      ]
    },
    {
      name: 'version',
      description: 'Print version information for Cloud SDK components'
    },
    {
      name: 'info',
      description: 'Display information about the current gcloud environment'
    }
  ],
  options: [
    {
      name: ['--project'],
      description: 'Google Cloud Platform project to use for this invocation',
      args: {
        name: 'project',
        generators: [gcpProjectGenerator]
      }
    },
    {
      name: ['--quiet', '-q'],
      description: 'Disable all interactive prompts'
    },
    {
      name: ['--verbosity'],
      description: 'Override the default verbosity for this command'
    },
    {
      name: ['--format'],
      description: 'Set the format for printing command output resources'
    },
    {
      name: ['--help', '-h'],
      description: 'Display detailed help'
    }
  ]
};