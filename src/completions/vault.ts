import { CompletionSpec } from '../types.js';

// Vault path generator
const vaultPathGenerator = {
  script: 'vault kv list secret/ 2>/dev/null | grep -v "Keys" | grep -v "----" | head -20 || echo "app/\\ndb/\\napi/"',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(p => p).map(path => ({
      name: path.replace('/', ''),
      description: `Vault path: ${path}`,
      type: 'option' as const
    }));
  }
};

// HashiCorp Vault completion spec
export const vaultSpec: CompletionSpec = {
  name: 'vault',
  description: 'HashiCorp Vault secrets management',
  subcommands: [
    {
      name: 'kv',
      description: 'Interact with Vault KV secrets engine',
      subcommands: [
        {
          name: 'put',
          description: 'Write data to a KV secret',
          args: [
            {
              name: 'path',
              description: 'Secret path',
              generators: [vaultPathGenerator]
            },
            {
              name: 'data',
              description: 'Key-value pairs (key=value)',
              isVariadic: true
            }
          ]
        },
        {
          name: 'get',
          description: 'Read data from a KV secret',
          options: [
            {
              name: '-field',
              description: 'Print only the field with the given name',
              args: {
                name: 'field',
                description: 'Field name'
              }
            },
            {
              name: '-format',
              description: 'Output format',
              args: {
                name: 'format',
                suggestions: [
                  { name: 'table', description: 'Table format' },
                  { name: 'json', description: 'JSON format' },
                  { name: 'yaml', description: 'YAML format' }
                ]
              }
            },
            {
              name: '-version',
              description: 'Version of secret to read',
              args: {
                name: 'version',
                description: 'Secret version number'
              }
            }
          ],
          args: {
            name: 'path',
            description: 'Secret path',
            generators: [vaultPathGenerator]
          }
        },
        {
          name: 'delete',
          description: 'Delete versions of a KV secret',
          options: [
            {
              name: '-versions',
              description: 'Versions to delete',
              args: {
                name: 'versions',
                description: 'Version numbers (comma-separated)'
              }
            }
          ],
          args: {
            name: 'path',
            description: 'Secret path',
            generators: [vaultPathGenerator]
          }
        },
        {
          name: 'undelete',
          description: 'Undelete versions of a KV secret',
          options: [
            {
              name: '-versions',
              description: 'Versions to undelete',
              args: {
                name: 'versions',
                description: 'Version numbers (comma-separated)'
              }
            }
          ],
          args: {
            name: 'path',
            description: 'Secret path',
            generators: [vaultPathGenerator]
          }
        },
        {
          name: 'destroy',
          description: 'Permanently delete versions of a KV secret',
          options: [
            {
              name: '-versions',
              description: 'Versions to destroy',
              args: {
                name: 'versions',
                description: 'Version numbers (comma-separated)'
              }
            }
          ],
          args: {
            name: 'path',
            description: 'Secret path',
            generators: [vaultPathGenerator]
          }
        },
        {
          name: 'list',
          description: 'List keys at a path',
          args: {
            name: 'path',
            description: 'Path to list',
            generators: [vaultPathGenerator],
            isOptional: true
          }
        },
        {
          name: 'metadata',
          description: 'Interact with KV metadata',
          subcommands: [
            {
              name: 'get',
              description: 'Read metadata for a KV secret',
              args: {
                name: 'path',
                description: 'Secret path',
                generators: [vaultPathGenerator]
              }
            },
            {
              name: 'put',
              description: 'Write metadata for a KV secret',
              options: [
                {
                  name: '-max-versions',
                  description: 'Maximum number of versions',
                  args: {
                    name: 'versions',
                    suggestions: [
                      { name: '10', description: '10 versions' },
                      { name: '20', description: '20 versions' },
                      { name: '50', description: '50 versions' }
                    ]
                  }
                },
                {
                  name: '-cas-required',
                  description: 'Require check-and-set',
                  args: {
                    name: 'required',
                    suggestions: [
                      { name: 'true', description: 'Require CAS' },
                      { name: 'false', description: 'Do not require CAS' }
                    ]
                  }
                }
              ],
              args: {
                name: 'path',
                description: 'Secret path',
                generators: [vaultPathGenerator]
              }
            },
            {
              name: 'delete',
              description: 'Delete metadata for a KV secret',
              args: {
                name: 'path',
                description: 'Secret path',
                generators: [vaultPathGenerator]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'auth',
      description: 'Interact with auth methods',
      options: [
        {
          name: '-method',
          description: 'Auth method type',
          args: {
            name: 'method',
            suggestions: [
              { name: 'userpass', description: 'Username/password auth' },
              { name: 'ldap', description: 'LDAP auth' },
              { name: 'github', description: 'GitHub auth' },
              { name: 'aws', description: 'AWS auth' },
              { name: 'kubernetes', description: 'Kubernetes auth' },
              { name: 'jwt', description: 'JWT auth' },
              { name: 'oidc', description: 'OIDC auth' }
            ]
          }
        },
        {
          name: '-path',
          description: 'Auth method path',
          args: {
            name: 'path',
            description: 'Auth method path'
          }
        }
      ]
    },
    {
      name: 'policy',
      description: 'Interact with policies',
      subcommands: [
        {
          name: 'list',
          description: 'List available policies'
        },
        {
          name: 'read',
          description: 'Read a policy',
          args: {
            name: 'name',
            description: 'Policy name'
          }
        },
        {
          name: 'write',
          description: 'Write a policy',
          args: [
            {
              name: 'name',
              description: 'Policy name'
            },
            {
              name: 'policy',
              description: 'Policy content or file path'
            }
          ]
        },
        {
          name: 'delete',
          description: 'Delete a policy',
          args: {
            name: 'name',
            description: 'Policy name'
          }
        }
      ]
    },
    {
      name: 'secrets',
      description: 'Interact with secrets engines',
      subcommands: [
        {
          name: 'list',
          description: 'List enabled secrets engines'
        },
        {
          name: 'enable',
          description: 'Enable a secrets engine',
          options: [
            {
              name: '-path',
              description: 'Mount path',
              args: {
                name: 'path',
                description: 'Mount path'
              }
            },
            {
              name: '-description',
              description: 'Human-readable description',
              args: {
                name: 'description',
                description: 'Description'
              }
            }
          ],
          args: {
            name: 'type',
            description: 'Secrets engine type',
            suggestions: [
              { name: 'kv', description: 'Key-Value secrets engine' },
              { name: 'database', description: 'Database secrets engine' },
              { name: 'aws', description: 'AWS secrets engine' },
              { name: 'pki', description: 'PKI secrets engine' },
              { name: 'ssh', description: 'SSH secrets engine' },
              { name: 'transit', description: 'Transit secrets engine' }
            ]
          }
        },
        {
          name: 'disable',
          description: 'Disable a secrets engine',
          args: {
            name: 'path',
            description: 'Mount path'
          }
        },
        {
          name: 'tune',
          description: 'Tune a secrets engine',
          options: [
            {
              name: '-default-lease-ttl',
              description: 'Default lease TTL',
              args: {
                name: 'ttl',
                suggestions: [
                  { name: '1h', description: '1 hour' },
                  { name: '24h', description: '24 hours' },
                  { name: '720h', description: '30 days' }
                ]
              }
            },
            {
              name: '-max-lease-ttl',
              description: 'Maximum lease TTL',
              args: {
                name: 'ttl',
                suggestions: [
                  { name: '24h', description: '24 hours' },
                  { name: '720h', description: '30 days' },
                  { name: '8760h', description: '1 year' }
                ]
              }
            }
          ],
          args: {
            name: 'path',
            description: 'Mount path'
          }
        }
      ]
    },
    {
      name: 'server',
      description: 'Start Vault development server',
      options: [
        {
          name: '-dev',
          description: 'Enable development mode'
        },
        {
          name: '-dev-root-token-id',
          description: 'Initial root token',
          args: {
            name: 'token',
            description: 'Root token'
          }
        },
        {
          name: '-dev-listen-address',
          description: 'Development server listen address',
          args: {
            name: 'address',
            suggestions: [
              { name: '127.0.0.1:8200', description: 'Default address' },
              { name: '0.0.0.0:8200', description: 'All interfaces' }
            ]
          }
        },
        {
          name: '-config',
          description: 'Configuration file or directory',
          args: {
            name: 'path',
            template: 'filepaths'
          }
        }
      ]
    }
  ],
  options: [
    {
      name: '-address',
      description: 'Vault server address',
      args: {
        name: 'address',
        suggestions: [
          { name: 'https://127.0.0.1:8200', description: 'Default local address' },
          { name: 'https://vault.example.com', description: 'Remote vault server' }
        ]
      }
    },
    {
      name: '-token',
      description: 'Vault token',
      args: {
        name: 'token',
        description: 'Authentication token'
      }
    },
    {
      name: '-ca-cert',
      description: 'Path to CA certificate',
      args: {
        name: 'path',
        template: 'filepaths'
      }
    },
    {
      name: '-client-cert',
      description: 'Path to client certificate',
      args: {
        name: 'path',
        template: 'filepaths'
      }
    },
    {
      name: '-client-key',
      description: 'Path to client key',
      args: {
        name: 'path',
        template: 'filepaths'
      }
    },
    {
      name: '-tls-skip-verify',
      description: 'Skip TLS certificate verification'
    },
    {
      name: '-format',
      description: 'Output format',
      args: {
        name: 'format',
        suggestions: [
          { name: 'table', description: 'Table format' },
          { name: 'json', description: 'JSON format' },
          { name: 'yaml', description: 'YAML format' }
        ]
      }
    }
  ]
};