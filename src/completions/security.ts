import { CompletionSpec } from '../types.js';

// SOPS file generator
const sopsFileGenerator = {
  script: 'find . -maxdepth 3 \\( -name "*.enc.yaml" -o -name "*.enc.yml" -o -name "*.enc.json" -o -name "*secrets*.yaml" -o -name "*secrets*.yml" \\) | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Encrypted file: ${file}`,
      type: 'file' as const
    }));
  }
};

// GPG key generator
const gpgKeyGenerator = {
  script: 'gpg --list-secret-keys --keyid-format SHORT 2>/dev/null | grep "sec" | awk \'{print $2}\' | cut -d"/" -f2 | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(k => k).map(key => ({
      name: key,
      description: `GPG key: ${key}`,
      type: 'option' as const
    }));
  }
};

// 1Password item generator
const onePasswordItemGenerator = {
  script: 'op item list --format=json 2>/dev/null | jq -r ".[].title" | head -20 || echo "Database Credentials\\nAPI Keys\\nSSH Keys"',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(item => item).map(item => ({
      name: item,
      description: `1Password item: ${item}`,
      type: 'option' as const
    }));
  }
};

// 1Password CLI completion spec
export const onePasswordSpec: CompletionSpec = {
  name: 'op',
  description: '1Password command line interface',
  subcommands: [
    {
      name: 'account',
      description: 'Manage accounts',
      subcommands: [
        {
          name: 'list',
          description: 'List accounts'
        },
        {
          name: 'add',
          description: 'Add an account',
          options: [
            {
              name: '--address',
              description: 'Account address',
              args: {
                name: 'address',
                description: 'Account URL'
              }
            },
            {
              name: '--email',
              description: 'Account email',
              args: {
                name: 'email',
                description: 'Email address'
              }
            }
          ]
        },
        {
          name: 'forget',
          description: 'Remove an account',
          args: {
            name: 'account',
            description: 'Account shorthand or URL'
          }
        },
        {
          name: 'get',
          description: 'Get account details',
          args: {
            name: 'account',
            description: 'Account shorthand or URL'
          }
        }
      ]
    },
    {
      name: 'signin',
      description: 'Sign in to your account',
      options: [
        {
          name: '--account',
          description: 'Account to sign in to',
          args: {
            name: 'account',
            description: 'Account shorthand or URL'
          }
        }
      ]
    },
    {
      name: 'signout',
      description: 'Sign out of your account',
      options: [
        {
          name: '--account',
          description: 'Account to sign out of',
          args: {
            name: 'account',
            description: 'Account shorthand or URL'
          }
        },
        {
          name: '--all',
          description: 'Sign out of all accounts'
        }
      ]
    },
    {
      name: 'item',
      description: 'Manage items',
      subcommands: [
        {
          name: 'list',
          description: 'List items',
          options: [
            {
              name: '--categories',
              description: 'Item categories to include',
              args: {
                name: 'categories',
                suggestions: [
                  { name: 'Login', description: 'Login items' },
                  { name: 'Password', description: 'Password items' },
                  { name: 'API Credential', description: 'API credentials' },
                  { name: 'Server', description: 'Server items' },
                  { name: 'Database', description: 'Database items' },
                  { name: 'Secure Note', description: 'Secure notes' }
                ]
              }
            },
            {
              name: '--vault',
              description: 'Vault to list items from',
              args: {
                name: 'vault',
                description: 'Vault name or ID'
              }
            }
          ]
        },
        {
          name: 'get',
          description: 'Get item details',
          options: [
            {
              name: '--fields',
              description: 'Fields to include in output',
              args: {
                name: 'fields',
                suggestions: [
                  { name: 'label,type', description: 'Labels and types' },
                  { name: 'username,password', description: 'Username and password' },
                  { name: 'notesPlain', description: 'Plain text notes' }
                ]
              }
            },
            {
              name: '--format',
              description: 'Output format',
              args: {
                name: 'format',
                suggestions: [
                  { name: 'json', description: 'JSON format' },
                  { name: 'yaml', description: 'YAML format' }
                ]
              }
            }
          ],
          args: {
            name: 'item',
            description: 'Item name or ID',
            generators: [onePasswordItemGenerator]
          }
        },
        {
          name: 'create',
          description: 'Create a new item',
          options: [
            {
              name: '--category',
              description: 'Item category',
              args: {
                name: 'category',
                suggestions: [
                  { name: 'Login', description: 'Login item' },
                  { name: 'Password', description: 'Password item' },
                  { name: 'API Credential', description: 'API credential' },
                  { name: 'Server', description: 'Server item' },
                  { name: 'Database', description: 'Database item' },
                  { name: 'Secure Note', description: 'Secure note' }
                ]
              }
            },
            {
              name: '--vault',
              description: 'Vault to create item in',
              args: {
                name: 'vault',
                description: 'Vault name or ID'
              }
            },
            {
              name: '--title',
              description: 'Item title',
              args: {
                name: 'title',
                description: 'Item title'
              }
            }
          ]
        },
        {
          name: 'edit',
          description: 'Edit an item',
          args: {
            name: 'item',
            description: 'Item name or ID',
            generators: [onePasswordItemGenerator]
          }
        },
        {
          name: 'delete',
          description: 'Delete an item',
          args: {
            name: 'item',
            description: 'Item name or ID',
            generators: [onePasswordItemGenerator]
          }
        }
      ]
    },
    {
      name: 'vault',
      description: 'Manage vaults',
      subcommands: [
        {
          name: 'list',
          description: 'List vaults'
        },
        {
          name: 'get',
          description: 'Get vault details',
          args: {
            name: 'vault',
            description: 'Vault name or ID'
          }
        },
        {
          name: 'create',
          description: 'Create a vault',
          args: {
            name: 'name',
            description: 'Vault name'
          },
          options: [
            {
              name: '--description',
              description: 'Vault description',
              args: {
                name: 'description',
                description: 'Description'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'document',
      description: 'Manage documents',
      subcommands: [
        {
          name: 'list',
          description: 'List documents'
        },
        {
          name: 'get',
          description: 'Download a document',
          options: [
            {
              name: '--output',
              description: 'Output file path',
              args: {
                name: 'path',
                template: 'filepaths'
              }
            }
          ],
          args: {
            name: 'document',
            description: 'Document name or ID'
          }
        },
        {
          name: 'create',
          description: 'Upload a document',
          options: [
            {
              name: '--vault',
              description: 'Vault to upload to',
              args: {
                name: 'vault',
                description: 'Vault name or ID'
              }
            },
            {
              name: '--title',
              description: 'Document title',
              args: {
                name: 'title',
                description: 'Title'
              }
            }
          ],
          args: {
            name: 'file',
            description: 'File to upload',
            template: 'filepaths'
          }
        }
      ]
    }
  ]
};

// SOPS completion spec
export const sopsSpec: CompletionSpec = {
  name: 'sops',
  description: 'Secrets OPerationS - encrypted file editor',
  options: [
    {
      name: ['-e', '--encrypt'],
      description: 'Encrypt a file and output the result',
      args: {
        name: 'file',
        description: 'File to encrypt',
        template: 'filepaths'
      }
    },
    {
      name: ['-d', '--decrypt'],
      description: 'Decrypt a file and output the result',
      args: {
        name: 'file',
        description: 'File to decrypt',
        generators: [sopsFileGenerator]
      }
    },
    {
      name: ['-i', '--in-place'],
      description: 'Edit file in place'
    },
    {
      name: '--extract',
      description: 'Extract a specific key from the file',
      args: {
        name: 'key',
        description: 'Key path to extract'
      }
    },
    {
      name: '--input-type',
      description: 'Input format',
      args: {
        name: 'type',
        suggestions: [
          { name: 'yaml', description: 'YAML format' },
          { name: 'json', description: 'JSON format' },
          { name: 'env', description: 'Environment format' },
          { name: 'ini', description: 'INI format' },
          { name: 'binary', description: 'Binary format' }
        ]
      }
    },
    {
      name: '--output-type',
      description: 'Output format',
      args: {
        name: 'type',
        suggestions: [
          { name: 'yaml', description: 'YAML format' },
          { name: 'json', description: 'JSON format' },
          { name: 'env', description: 'Environment format' },
          { name: 'ini', description: 'INI format' },
          { name: 'binary', description: 'Binary format' }
        ]
      }
    },
    {
      name: '--kms',
      description: 'KMS key to use',
      args: {
        name: 'key',
        description: 'KMS key ARN or ID'
      }
    },
    {
      name: '--aws-profile',
      description: 'AWS profile to use',
      args: {
        name: 'profile',
        description: 'AWS profile name'
      }
    },
    {
      name: '--pgp',
      description: 'PGP fingerprint to use',
      args: {
        name: 'fingerprint',
        generators: [gpgKeyGenerator]
      }
    },
    {
      name: '--age',
      description: 'Age recipient to use',
      args: {
        name: 'recipient',
        description: 'Age recipient'
      }
    },
    {
      name: '--azure-kv',
      description: 'Azure Key Vault URL',
      args: {
        name: 'url',
        description: 'Azure Key Vault URL'
      }
    },
    {
      name: '--gcp-kms',
      description: 'GCP KMS resource ID',
      args: {
        name: 'resource',
        description: 'GCP KMS resource ID'
      }
    },
    {
      name: '--hc-vault-transit',
      description: 'HashiCorp Vault transit key',
      args: {
        name: 'key',
        description: 'Vault transit key'
      }
    },
    {
      name: ['-s', '--show-master-keys'],
      description: 'Show master keys in output'
    },
    {
      name: '--ignore-mac',
      description: 'Ignore MAC verification'
    },
    {
      name: '--unencrypted-suffix',
      description: 'Suffix for unencrypted keys',
      args: {
        name: 'suffix',
        suggestions: [
          { name: '_unencrypted', description: 'Default suffix' },
          { name: '_plain', description: 'Plain suffix' },
          { name: '_raw', description: 'Raw suffix' }
        ]
      }
    },
    {
      name: '--encrypted-suffix',
      description: 'Suffix for encrypted keys',
      args: {
        name: 'suffix',
        suggestions: [
          { name: '_encrypted', description: 'Encrypted suffix' },
          { name: '_secret', description: 'Secret suffix' }
        ]
      }
    },
    {
      name: '--config',
      description: 'Config file path',
      args: {
        name: 'file',
        suggestions: [
          { name: '.sops.yaml', description: 'SOPS config file' },
          { name: '.sops.yml', description: 'SOPS config file (YAML)' }
        ]
      }
    },
    {
      name: '--set',
      description: 'Set a specific key to a value',
      args: [
        {
          name: 'key',
          description: 'Key to set'
        },
        {
          name: 'value',
          description: 'Value to set'
        }
      ]
    }
  ],
  args: {
    name: 'file',
    description: 'File to operate on',
    generators: [sopsFileGenerator],
    isOptional: true
  }
};

// Age completion spec
export const ageSpec: CompletionSpec = {
  name: 'age',
  description: 'Modern encryption tool with small explicit keys',
  options: [
    {
      name: ['-e', '--encrypt'],
      description: 'Encrypt files to recipients'
    },
    {
      name: ['-d', '--decrypt'],
      description: 'Decrypt files'
    },
    {
      name: ['-r', '--recipient'],
      description: 'Encrypt to the specified recipient',
      args: {
        name: 'recipient',
        description: 'Recipient public key or X25519 key'
      }
    },
    {
      name: ['-R', '--recipients-file'],
      description: 'File containing recipients',
      args: {
        name: 'file',
        description: 'Recipients file path',
        template: 'filepaths'
      }
    },
    {
      name: ['-i', '--identity'],
      description: 'Private key file to decrypt with',
      args: {
        name: 'file',
        description: 'Identity file path',
        template: 'filepaths'
      }
    },
    {
      name: ['-o', '--output'],
      description: 'Output file',
      args: {
        name: 'file',
        description: 'Output file path',
        template: 'filepaths'
      }
    },
    {
      name: ['-a', '--armor'],
      description: 'Encrypt to ASCII armored format'
    },
    {
      name: ['-p', '--passphrase'],
      description: 'Encrypt with a passphrase'
    }
  ],
  args: {
    name: 'files',
    description: 'Files to encrypt or decrypt',
    template: 'filepaths',
    isVariadic: true
  }
};

// GPG completion spec
export const gpgSpec: CompletionSpec = {
  name: 'gpg',
  description: 'GNU Privacy Guard - encryption and signing tool',
  options: [
    {
      name: ['-e', '--encrypt'],
      description: 'Encrypt data'
    },
    {
      name: ['-d', '--decrypt'],
      description: 'Decrypt data'
    },
    {
      name: ['-s', '--sign'],
      description: 'Make a signature'
    },
    {
      name: '--verify',
      description: 'Verify a signature'
    },
    {
      name: ['-c', '--symmetric'],
      description: 'Encrypt with symmetric cipher only'
    },
    {
      name: ['-r', '--recipient'],
      description: 'Encrypt for user id',
      args: {
        name: 'userid',
        description: 'User ID or key ID',
        generators: [gpgKeyGenerator]
      }
    },
    {
      name: ['-u', '--local-user'],
      description: 'Use userid to sign',
      args: {
        name: 'userid',
        description: 'User ID or key ID',
        generators: [gpgKeyGenerator]
      }
    },
    {
      name: ['-o', '--output'],
      description: 'Output file',
      args: {
        name: 'file',
        description: 'Output file path',
        template: 'filepaths'
      }
    },
    {
      name: ['-a', '--armor'],
      description: 'Create ASCII armored output'
    },
    {
      name: '--detach-sig',
      description: 'Make a detached signature'
    },
    {
      name: '--clearsign',
      description: 'Make a clear text signature'
    },
    {
      name: '--gen-key',
      description: 'Generate a new key pair'
    },
    {
      name: '--full-gen-key',
      description: 'Generate a new key pair with full options'
    },
    {
      name: '--gen-revoke',
      description: 'Generate a revocation certificate',
      args: {
        name: 'userid',
        description: 'User ID or key ID',
        generators: [gpgKeyGenerator]
      }
    },
    {
      name: '--edit-key',
      description: 'Edit a key',
      args: {
        name: 'userid',
        description: 'User ID or key ID',
        generators: [gpgKeyGenerator]
      }
    },
    {
      name: '--list-keys',
      description: 'List keys in the public keyring'
    },
    {
      name: '--list-secret-keys',
      description: 'List keys in the secret keyring'
    },
    {
      name: '--list-sigs',
      description: 'List keys and signatures'
    },
    {
      name: '--check-sigs',
      description: 'List and check key signatures'
    },
    {
      name: '--fingerprint',
      description: 'List keys and fingerprints'
    },
    {
      name: '--list-packets',
      description: 'List packet sequence'
    },
    {
      name: '--export',
      description: 'Export public keys',
      args: {
        name: 'userid',
        description: 'User ID or key ID',
        generators: [gpgKeyGenerator],
        isOptional: true
      }
    },
    {
      name: '--export-secret-keys',
      description: 'Export secret keys',
      args: {
        name: 'userid',
        description: 'User ID or key ID',
        generators: [gpgKeyGenerator],
        isOptional: true
      }
    },
    {
      name: '--export-secret-subkeys',
      description: 'Export secret subkeys',
      args: {
        name: 'userid',
        description: 'User ID or key ID',
        generators: [gpgKeyGenerator],
        isOptional: true
      }
    },
    {
      name: '--import',
      description: 'Import keys from key files'
    },
    {
      name: '--recv-keys',
      description: 'Import keys from a keyserver',
      args: {
        name: 'keyids',
        description: 'Key IDs to import',
        isVariadic: true
      }
    },
    {
      name: '--send-keys',
      description: 'Send keys to a keyserver',
      args: {
        name: 'keyids',
        description: 'Key IDs to send',
        generators: [gpgKeyGenerator],
        isVariadic: true
      }
    },
    {
      name: '--search-keys',
      description: 'Search for keys on a keyserver',
      args: {
        name: 'names',
        description: 'Names to search for',
        isVariadic: true
      }
    },
    {
      name: '--refresh-keys',
      description: 'Update keys from a keyserver'
    },
    {
      name: '--delete-key',
      description: 'Remove key from public keyring',
      args: {
        name: 'userid',
        description: 'User ID or key ID',
        generators: [gpgKeyGenerator]
      }
    },
    {
      name: '--delete-secret-key',
      description: 'Remove key from secret keyring',
      args: {
        name: 'userid',
        description: 'User ID or key ID',
        generators: [gpgKeyGenerator]
      }
    },
    {
      name: '--keyserver',
      description: 'Use this keyserver',
      args: {
        name: 'server',
        suggestions: [
          { name: 'hkps://keys.openpgp.org', description: 'OpenPGP keyserver' },
          { name: 'hkps://keyserver.ubuntu.com', description: 'Ubuntu keyserver' },
          { name: 'hkps://pgp.mit.edu', description: 'MIT keyserver' }
        ]
      }
    },
    {
      name: '--trust-model',
      description: 'Trust model to use',
      args: {
        name: 'model',
        suggestions: [
          { name: 'pgp', description: 'PGP trust model' },
          { name: 'classic', description: 'Classic trust model' },
          { name: 'direct', description: 'Direct trust model' },
          { name: 'always', description: 'Always trust model' },
          { name: 'auto', description: 'Auto trust model' }
        ]
      }
    },
    {
      name: '--cipher-algo',
      description: 'Cipher algorithm',
      args: {
        name: 'algo',
        suggestions: [
          { name: 'AES256', description: 'AES 256-bit' },
          { name: 'AES192', description: 'AES 192-bit' },
          { name: 'AES', description: 'AES 128-bit' },
          { name: 'CAMELLIA256', description: 'Camellia 256-bit' },
          { name: 'TWOFISH', description: 'Twofish cipher' }
        ]
      }
    },
    {
      name: '--digest-algo',
      description: 'Digest algorithm',
      args: {
        name: 'algo',
        suggestions: [
          { name: 'SHA512', description: 'SHA-512' },
          { name: 'SHA384', description: 'SHA-384' },
          { name: 'SHA256', description: 'SHA-256' },
          { name: 'SHA224', description: 'SHA-224' },
          { name: 'SHA1', description: 'SHA-1' }
        ]
      }
    },
    {
      name: '--compress-algo',
      description: 'Compression algorithm',
      args: {
        name: 'algo',
        suggestions: [
          { name: '0', description: 'Uncompressed' },
          { name: '1', description: 'ZIP compression' },
          { name: '2', description: 'ZLIB compression' },
          { name: '3', description: 'BZip2 compression' }
        ]
      }
    },
    {
      name: '--personal-cipher-preferences',
      description: 'Personal cipher preferences',
      args: {
        name: 'prefs',
        description: 'Cipher preference string'
      }
    },
    {
      name: '--personal-digest-preferences',
      description: 'Personal digest preferences',
      args: {
        name: 'prefs',
        description: 'Digest preference string'
      }
    }
  ],
  args: {
    name: 'files',
    description: 'Files to process',
    template: 'filepaths',
    isVariadic: true
  }
};