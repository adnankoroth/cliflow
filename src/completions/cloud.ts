import { CompletionSpec } from '../types.js';

// GitHub repository generator
const repoGenerator = {
  script: 'echo -e "my-repo\nwebsite\napi\nfrontend\nbackend\nmobile-app"',
  postProcess: (output: string) => {
    return output.trim().split('\n').map(repo => ({
      name: repo,
      description: `Repository: ${repo}`,
      type: 'argument' as const
    }));
  }
};

// File generator for config files
const configFileGenerator = {
  script: 'find . -maxdepth 2 -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.toml" | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Config file: ${file}`,
      type: 'file' as const
    }));
  }
};

// GitHub CLI completion spec
export const githubCliSpec: CompletionSpec = {
  name: 'gh',
  description: 'GitHub CLI',
  subcommands: [
    {
      name: 'auth',
      description: 'Authenticate gh and git with GitHub',
      subcommands: [
        {
          name: 'login',
          description: 'Authenticate with a GitHub host',
          options: [
            {
              name: ['-p', '--git-protocol'],
              description: 'The protocol to use for git clone/push operations',
              args: {
                name: 'protocol',
                suggestions: [
                  { name: 'https', description: 'Use HTTPS for git operations' },
                  { name: 'ssh', description: 'Use SSH for git operations' }
                ]
              }
            },
            {
              name: ['-h', '--hostname'],
              description: 'The hostname of the GitHub instance to authenticate with',
              args: {
                name: 'hostname',
                description: 'GitHub hostname'
              }
            },
            {
              name: ['-s', '--scopes'],
              description: 'Additional authentication scopes to request',
              args: {
                name: 'scopes',
                description: 'Comma-separated list of scopes'
              }
            },
            {
              name: ['-w', '--web'],
              description: 'Open a browser to authenticate'
            }
          ]
        },
        {
          name: 'logout',
          description: 'Log out of a GitHub host',
          options: [
            {
              name: ['-h', '--hostname'],
              description: 'The hostname of the GitHub instance to log out of',
              args: {
                name: 'hostname',
                description: 'GitHub hostname'
              }
            }
          ]
        },
        {
          name: 'status',
          description: 'View authentication status'
        },
        {
          name: 'refresh',
          description: 'Refresh stored authentication credentials'
        }
      ]
    },
    {
      name: 'repo',
      description: 'Manage repositories',
      subcommands: [
        {
          name: 'create',
          description: 'Create a new repository',
          options: [
            {
              name: '--public',
              description: 'Make the new repository public'
            },
            {
              name: '--private',
              description: 'Make the new repository private'
            },
            {
              name: '--clone',
              description: 'Clone the new repository locally'
            },
            {
              name: '--description',
              description: 'Description of the repository',
              args: {
                name: 'description',
                description: 'Repository description'
              }
            },
            {
              name: '--homepage',
              description: 'Repository home page URL',
              args: {
                name: 'url',
                description: 'Homepage URL'
              }
            },
            {
              name: '--team',
              description: 'The name of the team that gets admin access',
              args: {
                name: 'team',
                description: 'Team name'
              }
            },
            {
              name: '--template',
              description: 'Make the new repository based on a template repository',
              args: {
                name: 'repository',
                description: 'Template repository (owner/repo)'
              }
            },
            {
              name: '--gitignore',
              description: 'Specify a gitignore template for the repository',
              args: {
                name: 'template',
                suggestions: [
                  { name: 'Node', description: 'Node.js gitignore' },
                  { name: 'Python', description: 'Python gitignore' },
                  { name: 'Go', description: 'Go gitignore' },
                  { name: 'Java', description: 'Java gitignore' },
                  { name: 'C++', description: 'C++ gitignore' }
                ]
              }
            },
            {
              name: '--license',
              description: 'Specify a license for the repository',
              args: {
                name: 'license',
                suggestions: [
                  { name: 'mit', description: 'MIT License' },
                  { name: 'apache-2.0', description: 'Apache License 2.0' },
                  { name: 'gpl-3.0', description: 'GNU General Public License v3.0' },
                  { name: 'bsd-3-clause', description: 'BSD 3-Clause License' },
                  { name: 'unlicense', description: 'The Unlicense' }
                ]
              }
            }
          ],
          args: {
            name: 'name',
            description: 'Repository name'
          }
        },
        {
          name: 'clone',
          description: 'Clone a repository locally',
          args: {
            name: 'repository',
            description: 'Repository to clone (owner/repo)'
          }
        },
        {
          name: 'fork',
          description: 'Create a fork of a repository',
          options: [
            {
              name: '--clone',
              description: 'Clone the fork locally'
            },
            {
              name: '--remote',
              description: 'Add a remote for the fork'
            }
          ],
          args: {
            name: 'repository',
            description: 'Repository to fork (owner/repo)'
          }
        },
        {
          name: 'list',
          description: 'List repositories owned by user or organization',
          options: [
            {
              name: ['-L', '--limit'],
              description: 'Maximum number of repositories to fetch',
              args: {
                name: 'limit',
                description: 'Number of repositories'
              }
            },
            {
              name: '--public',
              description: 'Show only public repositories'
            },
            {
              name: '--private',
              description: 'Show only private repositories'
            }
          ]
        },
        {
          name: 'view',
          description: 'View a repository',
          options: [
            {
              name: ['-w', '--web'],
              description: 'Open a repository in the browser'
            }
          ],
          args: {
            name: 'repository',
            description: 'Repository to view (owner/repo)',
            isOptional: true
          }
        },
        {
          name: 'delete',
          description: 'Delete a repository',
          args: {
            name: 'repository',
            description: 'Repository to delete (owner/repo)'
          }
        }
      ]
    },
    {
      name: 'pr',
      description: 'Manage pull requests',
      subcommands: [
        {
          name: 'create',
          description: 'Create a pull request',
          options: [
            {
              name: ['-t', '--title'],
              description: 'Title for the pull request',
              args: {
                name: 'title',
                description: 'PR title'
              }
            },
            {
              name: ['-b', '--body'],
              description: 'Body for the pull request',
              args: {
                name: 'body',
                description: 'PR body text'
              }
            },
            {
              name: ['-B', '--base'],
              description: 'The branch into which you want your code merged',
              args: {
                name: 'branch',
                description: 'Base branch name'
              }
            },
            {
              name: ['-H', '--head'],
              description: 'The branch that contains commits for your pull request',
              args: {
                name: 'branch',
                description: 'Head branch name'
              }
            },
            {
              name: ['-d', '--draft'],
              description: 'Mark pull request as a draft'
            },
            {
              name: ['-w', '--web'],
              description: 'Open the web browser to create a pull request'
            },
            {
              name: '--assignee',
              description: 'Assign people by their login',
              args: {
                name: 'login',
                description: 'GitHub username'
              }
            },
            {
              name: '--reviewer',
              description: 'Request reviews from people by their login',
              args: {
                name: 'login',
                description: 'GitHub username'
              }
            }
          ]
        },
        {
          name: 'list',
          description: 'List pull requests in a repository',
          options: [
            {
              name: ['-s', '--state'],
              description: 'Filter by state',
              args: {
                name: 'state',
                suggestions: [
                  { name: 'open', description: 'Open pull requests' },
                  { name: 'closed', description: 'Closed pull requests' },
                  { name: 'merged', description: 'Merged pull requests' },
                  { name: 'all', description: 'All pull requests' }
                ]
              }
            },
            {
              name: ['-L', '--limit'],
              description: 'Maximum number of items to fetch',
              args: {
                name: 'limit',
                description: 'Number of PRs'
              }
            }
          ]
        },
        {
          name: 'view',
          description: 'View a pull request',
          options: [
            {
              name: ['-w', '--web'],
              description: 'Open a pull request in the browser'
            }
          ],
          args: {
            name: 'number',
            description: 'Pull request number'
          }
        },
        {
          name: 'checkout',
          description: 'Check out a pull request in git',
          args: {
            name: 'number',
            description: 'Pull request number'
          }
        },
        {
          name: 'merge',
          description: 'Merge a pull request',
          options: [
            {
              name: ['-m', '--merge'],
              description: 'Merge the commits with a merge commit'
            },
            {
              name: ['-s', '--squash'],
              description: 'Squash the commits into one commit and merge'
            },
            {
              name: ['-r', '--rebase'],
              description: 'Rebase the commits onto the base branch'
            },
            {
              name: ['-d', '--delete-branch'],
              description: 'Delete the local and remote branch after merge'
            }
          ],
          args: {
            name: 'number',
            description: 'Pull request number'
          }
        }
      ]
    },
    {
      name: 'issue',
      description: 'Manage issues',
      subcommands: [
        {
          name: 'create',
          description: 'Create a new issue',
          options: [
            {
              name: ['-t', '--title'],
              description: 'Supply a title for the issue',
              args: {
                name: 'title',
                description: 'Issue title'
              }
            },
            {
              name: ['-b', '--body'],
              description: 'Supply a body for the issue',
              args: {
                name: 'body',
                description: 'Issue body text'
              }
            },
            {
              name: '--assignee',
              description: 'Assign people by their login',
              args: {
                name: 'login',
                description: 'GitHub username'
              }
            },
            {
              name: '--label',
              description: 'Add labels by name',
              args: {
                name: 'label',
                suggestions: [
                  { name: 'bug', description: 'Bug report' },
                  { name: 'enhancement', description: 'Feature request' },
                  { name: 'documentation', description: 'Documentation' },
                  { name: 'help wanted', description: 'Help wanted' },
                  { name: 'good first issue', description: 'Good first issue' }
                ]
              }
            },
            {
              name: ['-w', '--web'],
              description: 'Open the web browser to create an issue'
            }
          ]
        },
        {
          name: 'list',
          description: 'List issues in a repository',
          options: [
            {
              name: ['-s', '--state'],
              description: 'Filter by state',
              args: {
                name: 'state',
                suggestions: [
                  { name: 'open', description: 'Open issues' },
                  { name: 'closed', description: 'Closed issues' },
                  { name: 'all', description: 'All issues' }
                ]
              }
            },
            {
              name: ['-L', '--limit'],
              description: 'Maximum number of items to fetch',
              args: {
                name: 'limit',
                description: 'Number of issues'
              }
            }
          ]
        },
        {
          name: 'view',
          description: 'View an issue',
          options: [
            {
              name: ['-w', '--web'],
              description: 'Open an issue in the browser'
            }
          ],
          args: {
            name: 'number',
            description: 'Issue number'
          }
        },
        {
          name: 'close',
          description: 'Close an issue',
          args: {
            name: 'number',
            description: 'Issue number'
          }
        }
      ]
    },
    {
      name: 'gist',
      description: 'Manage gists',
      subcommands: [
        {
          name: 'create',
          description: 'Create a new gist',
          options: [
            {
              name: ['-d', '--desc'],
              description: 'A description for this gist',
              args: {
                name: 'description',
                description: 'Gist description'
              }
            },
            {
              name: ['-f', '--filename'],
              description: 'Provide a filename to be used when reading from stdin',
              args: {
                name: 'filename',
                description: 'Filename for stdin content'
              }
            },
            {
              name: ['-p', '--public'],
              description: 'List the gist publicly (default: private)'
            },
            {
              name: ['-w', '--web'],
              description: 'Open the web browser with created gist'
            }
          ],
          args: {
            name: 'files',
            description: 'Files to include in gist',
            isVariadic: true,
            template: 'filepaths'
          }
        },
        {
          name: 'list',
          description: 'List your gists',
          options: [
            {
              name: ['-L', '--limit'],
              description: 'Maximum number of gists to fetch',
              args: {
                name: 'limit',
                description: 'Number of gists'
              }
            },
            {
              name: '--public',
              description: 'Show only public gists'
            },
            {
              name: '--secret',
              description: 'Show only secret gists'
            }
          ]
        },
        {
          name: 'view',
          description: 'View a gist',
          options: [
            {
              name: ['-w', '--web'],
              description: 'Open gist in the browser'
            }
          ],
          args: {
            name: 'id',
            description: 'Gist ID'
          }
        }
      ]
    },
    {
      name: 'workflow',
      description: 'View details about GitHub Actions workflows',
      subcommands: [
        {
          name: 'list',
          description: 'List workflows'
        },
        {
          name: 'view',
          description: 'View the summary of a workflow',
          args: {
            name: 'workflow',
            description: 'Workflow ID or filename'
          }
        },
        {
          name: 'run',
          description: 'Run a workflow by creating a workflow_dispatch event',
          args: {
            name: 'workflow',
            description: 'Workflow ID or filename'
          }
        }
      ]
    },
    {
      name: 'release',
      description: 'Manage releases',
      subcommands: [
        {
          name: 'create',
          description: 'Create a new release',
          options: [
            {
              name: ['-t', '--title'],
              description: 'Release title',
              args: {
                name: 'title',
                description: 'Release title'
              }
            },
            {
              name: ['-n', '--notes'],
              description: 'Release notes',
              args: {
                name: 'notes',
                description: 'Release notes text'
              }
            },
            {
              name: ['-d', '--draft'],
              description: 'Save the release as a draft instead of publishing it'
            },
            {
              name: ['-p', '--prerelease'],
              description: 'Mark the release as a prerelease'
            }
          ],
          args: {
            name: 'tag',
            description: 'Tag name for the release'
          }
        },
        {
          name: 'list',
          description: 'List releases in a repository',
          options: [
            {
              name: ['-L', '--limit'],
              description: 'Maximum number of items to fetch',
              args: {
                name: 'limit',
                description: 'Number of releases'
              }
            }
          ]
        },
        {
          name: 'view',
          description: 'View information about a release',
          options: [
            {
              name: ['-w', '--web'],
              description: 'Open the release in the browser'
            }
          ],
          args: {
            name: 'tag',
            description: 'Release tag'
          }
        }
      ]
    }
  ]
};

// Alibaba Cloud CLI completion spec  
export const alibabaCloudSpec: CompletionSpec = {
  name: 'aliyun',
  description: 'Alibaba Cloud CLI',
  subcommands: [
    {
      name: 'configure',
      description: 'Configure Alibaba Cloud CLI',
      options: [
        {
          name: '--profile',
          description: 'Specify profile name',
          args: {
            name: 'profile',
            description: 'Profile name'
          }
        },
        {
          name: '--mode',
          description: 'Configure mode',
          args: {
            name: 'mode',
            suggestions: [
              { name: 'AK', description: 'AccessKey mode' },
              { name: 'StsToken', description: 'STS Token mode' },
              { name: 'RamRoleArn', description: 'RAM Role ARN mode' },
              { name: 'EcsRamRole', description: 'ECS RAM Role mode' }
            ]
          }
        }
      ]
    },
    {
      name: 'ecs',
      description: 'Elastic Compute Service',
      subcommands: [
        {
          name: 'DescribeInstances',
          description: 'Query ECS instances',
          options: [
            {
              name: '--RegionId',
              description: 'Region ID',
              args: {
                name: 'region',
                suggestions: [
                  { name: 'cn-hangzhou', description: 'China (Hangzhou)' },
                  { name: 'cn-shanghai', description: 'China (Shanghai)' },
                  { name: 'cn-beijing', description: 'China (Beijing)' },
                  { name: 'cn-shenzhen', description: 'China (Shenzhen)' },
                  { name: 'ap-southeast-1', description: 'Singapore' },
                  { name: 'us-east-1', description: 'US (Virginia)' }
                ]
              }
            },
            {
              name: '--InstanceIds',
              description: 'Instance IDs',
              args: {
                name: 'ids',
                description: 'JSON array of instance IDs'
              }
            }
          ]
        },
        {
          name: 'CreateInstance',
          description: 'Create ECS instance',
          options: [
            {
              name: '--RegionId',
              description: 'Region ID',
              args: {
                name: 'region',
                suggestions: [
                  { name: 'cn-hangzhou', description: 'China (Hangzhou)' },
                  { name: 'cn-shanghai', description: 'China (Shanghai)' },
                  { name: 'cn-beijing', description: 'China (Beijing)' }
                ]
              }
            },
            {
              name: '--ImageId',
              description: 'Image ID',
              args: {
                name: 'image',
                description: 'System image ID'
              }
            },
            {
              name: '--InstanceType',
              description: 'Instance type',
              args: {
                name: 'type',
                suggestions: [
                  { name: 'ecs.t5-lc1m1.small', description: '1 vCPU 1 GB' },
                  { name: 'ecs.t5-lc1m2.small', description: '1 vCPU 2 GB' },
                  { name: 'ecs.t5-lc1m4.large', description: '2 vCPU 4 GB' },
                  { name: 'ecs.t5-lc2m8.large', description: '4 vCPU 8 GB' }
                ]
              }
            }
          ]
        },
        {
          name: 'StartInstance',
          description: 'Start ECS instance',
          options: [
            {
              name: '--InstanceId',
              description: 'Instance ID',
              args: {
                name: 'id',
                description: 'ECS instance ID'
              }
            }
          ]
        },
        {
          name: 'StopInstance',
          description: 'Stop ECS instance',
          options: [
            {
              name: '--InstanceId',
              description: 'Instance ID',
              args: {
                name: 'id',
                description: 'ECS instance ID'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'rds',
      description: 'Relational Database Service',
      subcommands: [
        {
          name: 'DescribeDBInstances',
          description: 'Query RDS instances',
          options: [
            {
              name: '--RegionId',
              description: 'Region ID',
              args: {
                name: 'region',
                suggestions: [
                  { name: 'cn-hangzhou', description: 'China (Hangzhou)' },
                  { name: 'cn-shanghai', description: 'China (Shanghai)' },
                  { name: 'cn-beijing', description: 'China (Beijing)' }
                ]
              }
            }
          ]
        },
        {
          name: 'CreateDBInstance',
          description: 'Create RDS instance',
          options: [
            {
              name: '--RegionId',
              description: 'Region ID',
              args: {
                name: 'region',
                description: 'Region identifier'
              }
            },
            {
              name: '--Engine',
              description: 'Database engine',
              args: {
                name: 'engine',
                suggestions: [
                  { name: 'MySQL', description: 'MySQL database' },
                  { name: 'PostgreSQL', description: 'PostgreSQL database' },
                  { name: 'SQLServer', description: 'SQL Server database' },
                  { name: 'MariaDB', description: 'MariaDB database' }
                ]
              }
            },
            {
              name: '--EngineVersion',
              description: 'Engine version',
              args: {
                name: 'version',
                suggestions: [
                  { name: '8.0', description: 'MySQL 8.0' },
                  { name: '5.7', description: 'MySQL 5.7' },
                  { name: '13.0', description: 'PostgreSQL 13.0' },
                  { name: '12.0', description: 'PostgreSQL 12.0' }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'oss',
      description: 'Object Storage Service',
      subcommands: [
        {
          name: 'cp',
          description: 'Copy objects',
          options: [
            {
              name: '--recursive',
              description: 'Copy recursively'
            },
            {
              name: '--force',
              description: 'Force overwrite'
            }
          ],
          args: [
            {
              name: 'source',
              description: 'Source path or OSS URL'
            },
            {
              name: 'destination',
              description: 'Destination path or OSS URL'
            }
          ]
        },
        {
          name: 'ls',
          description: 'List buckets or objects',
          args: {
            name: 'path',
            description: 'OSS path or bucket',
            isOptional: true
          }
        },
        {
          name: 'mb',
          description: 'Make bucket',
          options: [
            {
              name: '--storage-class',
              description: 'Storage class',
              args: {
                name: 'class',
                suggestions: [
                  { name: 'Standard', description: 'Standard storage' },
                  { name: 'IA', description: 'Infrequent Access storage' },
                  { name: 'Archive', description: 'Archive storage' },
                  { name: 'ColdArchive', description: 'Cold Archive storage' }
                ]
              }
            }
          ],
          args: {
            name: 'bucket',
            description: 'Bucket name'
          }
        },
        {
          name: 'rb',
          description: 'Remove bucket',
          options: [
            {
              name: '--force',
              description: 'Force delete non-empty bucket'
            }
          ],
          args: {
            name: 'bucket',
            description: 'Bucket name'
          }
        }
      ]
    }
  ]
};

// Tailscale CLI completion spec
export const tailscaleSpec: CompletionSpec = {
  name: 'tailscale',
  description: 'The Tailscale VPN',
  subcommands: [
    {
      name: 'up',
      description: 'Connect to Tailscale',
      options: [
        {
          name: '--login-server',
          description: 'Base URL of control server',
          args: {
            name: 'url',
            description: 'Control server URL'
          }
        },
        {
          name: '--authkey',
          description: 'Node authorization key',
          args: {
            name: 'key',
            description: 'Authorization key'
          }
        },
        {
          name: '--hostname',
          description: 'Hostname to use instead of the one provided by the OS',
          args: {
            name: 'hostname',
            description: 'Custom hostname'
          }
        },
        {
          name: '--advertise-routes',
          description: 'Routes to advertise to other Tailscale users',
          args: {
            name: 'routes',
            description: 'Comma-separated list of routes'
          }
        },
        {
          name: '--advertise-exit-node',
          description: 'Offer to be an exit node for internet traffic'
        },
        {
          name: '--exit-node',
          description: 'Tailscale exit node to use',
          args: {
            name: 'node',
            description: 'Exit node hostname or IP'
          }
        },
        {
          name: '--exit-node-allow-lan-access',
          description: 'Allow access to the local network when routing via an exit node'
        },
        {
          name: '--accept-routes',
          description: 'Accept routes advertised by other Tailscale users'
        },
        {
          name: '--accept-dns',
          description: 'Accept DNS configuration from the admin console'
        },
        {
          name: '--shields-up',
          description: 'Block incoming connections'
        },
        {
          name: '--reset',
          description: 'Reset unspecified settings to their default values'
        },
        {
          name: '--force-reauth',
          description: 'Force reauthentication'
        },
        {
          name: '--operator',
          description: 'Unix username to allow to operate on tailscaled without sudo',
          args: {
            name: 'username',
            description: 'Unix username'
          }
        }
      ]
    },
    {
      name: 'down',
      description: 'Disconnect from Tailscale'
    },
    {
      name: 'logout',
      description: 'Disconnect from Tailscale and expire current node key'
    },
    {
      name: 'status',
      description: 'Show state of tailscaled and its connections',
      options: [
        {
          name: '--peers',
          description: 'Show peer nodes'
        },
        {
          name: '--self',
          description: 'Show only local node'
        },
        {
          name: '--active',
          description: 'Filter to only nodes with recent activity'
        },
        {
          name: '--web',
          description: 'Run a web server for status'
        },
        {
          name: '--listen',
          description: 'Listen address for web mode',
          args: {
            name: 'address',
            description: 'Listen address (default localhost:8384)'
          }
        },
        {
          name: '--json',
          description: 'Output in JSON format'
        }
      ]
    },
    {
      name: 'ping',
      description: 'Ping a host via Tailscale',
      options: [
        {
          name: ['-c', '--count'],
          description: 'Number of pings to send',
          args: {
            name: 'count',
            description: 'Number of pings'
          }
        },
        {
          name: '--timeout',
          description: 'Timeout for each ping',
          args: {
            name: 'duration',
            description: 'Timeout duration'
          }
        },
        {
          name: '--tsmp',
          description: 'Send Tailscale Message Protocol pings'
        },
        {
          name: '--icmp',
          description: 'Send ICMP pings'
        }
      ],
      args: {
        name: 'hostname-or-ip',
        description: 'Hostname or IP address to ping'
      }
    },
    {
      name: 'nc',
      description: 'Connect to a port on a host via Tailscale',
      args: [
        {
          name: 'hostname-or-ip',
          description: 'Hostname or IP address'
        },
        {
          name: 'port',
          description: 'Port number'
        }
      ]
    },
    {
      name: 'ssh',
      description: 'SSH to a Tailscale machine',
      args: {
        name: 'hostname-or-ip',
        description: 'Hostname or IP address to SSH to'
      }
    },
    {
      name: 'version',
      description: 'Print Tailscale version'
    },
    {
      name: 'web',
      description: 'Run a web server for controlling Tailscale',
      options: [
        {
          name: '--listen',
          description: 'Listen address',
          args: {
            name: 'address',
            description: 'Listen address (default localhost:8088)'
          }
        },
        {
          name: '--cgi',
          description: 'Run in CGI mode'
        }
      ]
    },
    {
      name: 'file',
      description: 'Send or receive files',
      subcommands: [
        {
          name: 'cp',
          description: 'Copy files to a node',
          args: [
            {
              name: 'files',
              description: 'Files to copy',
              isVariadic: true,
              template: 'filepaths'
            },
            {
              name: 'target',
              description: 'Target node (hostname or IP)'
            }
          ]
        },
        {
          name: 'get',
          description: 'Download files sent to this node',
          options: [
            {
              name: '--wait',
              description: 'Wait for a file to be sent'
            },
            {
              name: '--conflict',
              description: 'Behavior when a file already exists',
              args: {
                name: 'action',
                suggestions: [
                  { name: 'skip', description: 'Skip existing files' },
                  { name: 'overwrite', description: 'Overwrite existing files' },
                  { name: 'rename', description: 'Rename new files' }
                ]
              }
            }
          ],
          args: {
            name: 'target-directory',
            description: 'Directory to save files',
            template: 'folders',
            isOptional: true
          }
        }
      ]
    },
    {
      name: 'lock',
      description: 'Manage Tailscale lock',
      subcommands: [
        {
          name: 'status',
          description: 'Show the status of the tailnet lock'
        },
        {
          name: 'init',
          description: 'Initialize tailnet lock',
          args: {
            name: 'keys',
            description: 'Trusted signing keys',
            isVariadic: true
          }
        },
        {
          name: 'sign',
          description: 'Sign a node or rotation key',
          args: {
            name: 'nodekey',
            description: 'Node key to sign'
          }
        }
      ]
    },
    {
      name: 'cert',
      description: 'Get TLS certificates',
      options: [
        {
          name: '--cert-file',
          description: 'Certificate output file',
          args: {
            name: 'file',
            template: 'filepaths'
          }
        },
        {
          name: '--key-file',
          description: 'Private key output file',
          args: {
            name: 'file',
            template: 'filepaths'
          }
        }
      ],
      args: {
        name: 'domain',
        description: 'Domain to get certificate for'
      }
    },
    {
      name: 'netcheck',
      description: 'Print an analysis of local network conditions'
    },
    {
      name: 'ip',
      description: 'Show Tailscale IP addresses',
      options: [
        {
          name: ['-1', '--single'],
          description: 'Only print one IP address'
        },
        {
          name: ['-4', '--ipv4'],
          description: 'Only print IPv4 address'
        },
        {
          name: ['-6', '--ipv6'],
          description: 'Only print IPv6 address'
        }
      ],
      args: {
        name: 'hostname',
        description: 'Hostname to lookup',
        isOptional: true
      }
    }
  ]
};