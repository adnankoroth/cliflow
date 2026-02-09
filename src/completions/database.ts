import { CompletionSpec } from '../types.js';

// Database name generator
const databaseGenerator = {
  script: 'echo -e "postgres\nmysql\ntest\ndevelopment\nproduction"',
  postProcess: (output: string) => {
    return output.trim().split('\n').map(db => ({
      name: db,
      description: `Database: ${db}`,
      type: 'argument' as const
    }));
  }
};

// Table name generator
const tableGenerator = {
  script: 'echo -e "users\nproducts\norders\ncustomers\npayments\ninventory"',
  postProcess: (output: string) => {
    return output.trim().split('\n').map(table => ({
      name: table,
      description: `Table: ${table}`,
      type: 'argument' as const
    }));
  }
};

// SQL file generator
const sqlFileGenerator = {
  script: 'find . -maxdepth 3 -name "*.sql" | head -20',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `SQL file: ${file}`,
      type: 'file' as const
    }));
  }
};

// Port generator for database ports
const dbPortGenerator = {
  script: 'echo -e "5432\n3306\n27017\n6379\n5433\n3307"',
  postProcess: (output: string) => {
    return output.trim().split('\n').map(port => ({
      name: port,
      description: `Database port ${port}`,
      type: 'argument' as const
    }));
  }
};

// PostgreSQL (psql) completion spec
export const psqlSpec: CompletionSpec = {
  name: 'psql',
  description: 'PostgreSQL interactive terminal',
  options: [
    {
      name: ['-h', '--host'],
      description: 'Database server host',
      args: {
        name: 'hostname',
        description: 'Hostname or IP address'
      }
    },
    {
      name: ['-p', '--port'],
      description: 'Database server port',
      args: {
        name: 'port',
        generators: [dbPortGenerator]
      }
    },
    {
      name: ['-U', '--username'],
      description: 'Database user name',
      args: {
        name: 'username',
        description: 'Database username'
      }
    },
    {
      name: ['-d', '--dbname'],
      description: 'Database name to connect to',
      args: {
        name: 'dbname',
        generators: [databaseGenerator]
      }
    },
    {
      name: ['-f', '--file'],
      description: 'Execute commands from file',
      args: {
        name: 'filename',
        generators: [sqlFileGenerator]
      }
    },
    {
      name: ['-c', '--command'],
      description: 'Run single command and exit',
      args: {
        name: 'command',
        description: 'SQL command to execute'
      }
    },
    {
      name: ['-l', '--list'],
      description: 'List available databases and exit'
    },
    {
      name: ['-t', '--tuples-only'],
      description: 'Print rows only'
    },
    {
      name: ['-A', '--no-align'],
      description: 'Unaligned table output mode'
    },
    {
      name: ['-H', '--html'],
      description: 'HTML table output mode'
    },
    {
      name: ['-x', '--expanded'],
      description: 'Turn on expanded table output'
    },
    {
      name: ['-q', '--quiet'],
      description: 'Run quietly'
    },
    {
      name: ['-v', '--set', '--variable'],
      description: 'Set psql variable NAME to VALUE',
      args: {
        name: 'assignment',
        description: 'NAME=VALUE'
      }
    },
    {
      name: ['-X', '--no-psqlrc'],
      description: 'Do not read startup file'
    },
    {
      name: ['-1', '--single-transaction'],
      description: 'Execute as single transaction'
    },
    {
      name: '--help',
      description: 'Show help and exit'
    },
    {
      name: '--version',
      description: 'Show version and exit'
    }
  ],
  args: {
    name: 'dbname',
    description: 'Database name',
    generators: [databaseGenerator],
    isOptional: true
  }
};

// MySQL completion spec
export const mysqlSpec: CompletionSpec = {
  name: 'mysql',
  description: 'MySQL command-line client',
  options: [
    {
      name: ['-h', '--host'],
      description: 'Connect to host',
      args: {
        name: 'name',
        description: 'Hostname or IP address'
      }
    },
    {
      name: ['-P', '--port'],
      description: 'Port number to use for connection',
      args: {
        name: 'port',
        generators: [dbPortGenerator]
      }
    },
    {
      name: ['-u', '--user'],
      description: 'User for login',
      args: {
        name: 'name',
        description: 'Username'
      }
    },
    {
      name: ['-p', '--password'],
      description: 'Password to use when connecting',
      args: {
        name: 'password',
        description: 'Password',
        isOptional: true
      }
    },
    {
      name: ['-D', '--database'],
      description: 'Database to use',
      args: {
        name: 'database',
        generators: [databaseGenerator]
      }
    },
    {
      name: ['-e', '--execute'],
      description: 'Execute statement and quit',
      args: {
        name: 'statement',
        description: 'SQL statement'
      }
    },
    {
      name: ['-s', '--silent'],
      description: 'Silent mode'
    },
    {
      name: ['-v', '--verbose'],
      description: 'Write more'
    },
    {
      name: ['-B', '--batch'],
      description: 'Print results with tab as column separator'
    },
    {
      name: ['-N', '--skip-column-names'],
      description: 'Don\'t write column names in results'
    },
    {
      name: ['-H', '--html'],
      description: 'Produce HTML output'
    },
    {
      name: ['-X', '--xml'],
      description: 'Produce XML output'
    },
    {
      name: ['-t', '--table'],
      description: 'Output in table format'
    },
    {
      name: ['-r', '--raw'],
      description: 'Write fields without conversion'
    },
    {
      name: '--default-character-set',
      description: 'Set the default character set',
      args: {
        name: 'charset',
        suggestions: [
          { name: 'utf8', description: 'UTF-8 Unicode' },
          { name: 'utf8mb4', description: 'UTF-8 Unicode' },
          { name: 'latin1', description: 'ISO 8859-1 West European' },
          { name: 'ascii', description: 'ASCII' }
        ]
      }
    },
    {
      name: '--ssl-mode',
      description: 'SSL connection mode',
      args: {
        name: 'mode',
        suggestions: [
          { name: 'DISABLED', description: 'No SSL' },
          { name: 'PREFERRED', description: 'SSL if available' },
          { name: 'REQUIRED', description: 'SSL required' },
          { name: 'VERIFY_CA', description: 'SSL with CA verification' },
          { name: 'VERIFY_IDENTITY', description: 'SSL with full verification' }
        ]
      }
    },
    {
      name: '--help',
      description: 'Display help and exit'
    },
    {
      name: '--version',
      description: 'Display version information and exit'
    }
  ],
  args: {
    name: 'database',
    description: 'Database name',
    generators: [databaseGenerator],
    isOptional: true
  }
};

// MongoDB shell (mongosh) completion spec
export const mongoshSpec: CompletionSpec = {
  name: 'mongosh',
  description: 'MongoDB Shell',
  options: [
    {
      name: '--host',
      description: 'Server to connect to',
      args: {
        name: 'hostname',
        description: 'Hostname and port (e.g., localhost:27017)'
      }
    },
    {
      name: '--port',
      description: 'Port to connect to',
      args: {
        name: 'port',
        generators: [dbPortGenerator]
      }
    },
    {
      name: ['-u', '--username'],
      description: 'Username for authentication',
      args: {
        name: 'username',
        description: 'Username'
      }
    },
    {
      name: ['-p', '--password'],
      description: 'Password for authentication',
      args: {
        name: 'password',
        description: 'Password',
        isOptional: true
      }
    },
    {
      name: '--authenticationDatabase',
      description: 'Authentication database',
      args: {
        name: 'dbname',
        generators: [databaseGenerator]
      }
    },
    {
      name: '--authenticationMechanism',
      description: 'Authentication mechanism',
      args: {
        name: 'mechanism',
        suggestions: [
          { name: 'SCRAM-SHA-1', description: 'SCRAM-SHA-1' },
          { name: 'SCRAM-SHA-256', description: 'SCRAM-SHA-256' },
          { name: 'MONGODB-CR', description: 'MongoDB Challenge Response' },
          { name: 'PLAIN', description: 'LDAP SASL PLAIN' },
          { name: 'GSSAPI', description: 'Kerberos' }
        ]
      }
    },
    {
      name: '--eval',
      description: 'Evaluate JavaScript',
      args: {
        name: 'javascript',
        description: 'JavaScript code to evaluate'
      }
    },
    {
      name: '--file',
      description: 'Execute JavaScript file',
      args: {
        name: 'filename',
        template: 'filepaths'
      }
    },
    {
      name: '--quiet',
      description: 'Silence output from shell during connection'
    },
    {
      name: '--norc',
      description: 'Will not run the .mongoshrc.js file'
    },
    {
      name: '--help',
      description: 'Show command line options'
    },
    {
      name: '--version',
      description: 'Show version information'
    }
  ],
  args: {
    name: 'connection-string',
    description: 'MongoDB connection string',
    isOptional: true
  }
};

// Redis CLI completion spec
export const redisCliSpec: CompletionSpec = {
  name: 'redis-cli',
  description: 'Redis command line interface',
  options: [
    {
      name: ['-h', '--hostname'],
      description: 'Server hostname',
      args: {
        name: 'hostname',
        description: 'Redis server hostname'
      }
    },
    {
      name: ['-p', '--port'],
      description: 'Server port',
      args: {
        name: 'port',
        generators: [dbPortGenerator]
      }
    },
    {
      name: ['-s', '--socket'],
      description: 'Server socket',
      args: {
        name: 'socket',
        description: 'Unix socket path'
      }
    },
    {
      name: ['-a', '--auth'],
      description: 'Password to use when connecting',
      args: {
        name: 'password',
        description: 'Authentication password'
      }
    },
    {
      name: '--user',
      description: 'Used to send ACL style user/pass',
      args: {
        name: 'username',
        description: 'Username for authentication'
      }
    },
    {
      name: ['-u', '--uri'],
      description: 'Server URI',
      args: {
        name: 'uri',
        description: 'Redis URI (redis://user:pass@host:port/db)'
      }
    },
    {
      name: ['-r', '--repeat'],
      description: 'Execute specified command N times',
      args: {
        name: 'times',
        description: 'Number of times to repeat'
      }
    },
    {
      name: ['-i', '--interval'],
      description: 'Interval between commands in seconds',
      args: {
        name: 'interval',
        description: 'Interval in seconds'
      }
    },
    {
      name: ['-n', '--db'],
      description: 'Database number',
      args: {
        name: 'db',
        description: 'Database number (0-15)'
      }
    },
    {
      name: ['-x', '--stdin'],
      description: 'Read last argument from STDIN'
    },
    {
      name: ['-d', '--delimiter'],
      description: 'Multi-bulk delimiter',
      args: {
        name: 'delimiter',
        description: 'Delimiter character'
      }
    },
    {
      name: ['-c', '--cluster'],
      description: 'Enable cluster mode'
    },
    {
      name: '--raw',
      description: 'Use raw formatting for replies'
    },
    {
      name: '--no-raw',
      description: 'Force formatted output even when writing to file'
    },
    {
      name: '--csv',
      description: 'Output in CSV format'
    },
    {
      name: '--stat',
      description: 'Print rolling stats about server'
    },
    {
      name: '--latency',
      description: 'Enter special mode continuously sampling latency'
    },
    {
      name: '--latency-history',
      description: 'Like --latency but tracking latency changes over time'
    },
    {
      name: '--latency-dist',
      description: 'Shows latency as a spectrum'
    },
    {
      name: '--lru-test',
      description: 'Simulate a cache workload',
      args: {
        name: 'keys',
        description: 'Number of keys to use'
      }
    },
    {
      name: '--slave',
      description: 'Simulate a slave showing commands received from master'
    },
    {
      name: '--replica',
      description: 'Simulate a replica showing commands received from master'
    },
    {
      name: '--rdb',
      description: 'Transfer an RDB dump from remote server to local file',
      args: {
        name: 'filename',
        template: 'filepaths'
      }
    },
    {
      name: '--pipe',
      description: 'Transfer raw Redis protocol from stdin to server'
    },
    {
      name: '--pipe-timeout',
      description: 'Set timeout for --pipe mode',
      args: {
        name: 'timeout',
        description: 'Timeout in seconds'
      }
    },
    {
      name: '--bigkeys',
      description: 'Sample Redis keys looking for big keys'
    },
    {
      name: '--memkeys',
      description: 'Sample Redis keys looking for keys consuming memory'
    },
    {
      name: '--memkeys-samples',
      description: 'Sample size for --memkeys',
      args: {
        name: 'samples',
        description: 'Number of samples'
      }
    },
    {
      name: '--hotkeys',
      description: 'Sample Redis keys looking for hot keys'
    },
    {
      name: '--scan',
      description: 'List all keys using SCAN command'
    },
    {
      name: '--pattern',
      description: 'Keys pattern when using --scan',
      args: {
        name: 'pattern',
        description: 'Pattern to match keys'
      }
    },
    {
      name: '--intrinsic-latency',
      description: 'Run test to measure intrinsic system latency',
      args: {
        name: 'seconds',
        description: 'Test duration in seconds'
      }
    },
    {
      name: '--eval',
      description: 'Send an EVAL command using the Lua script at <file>',
      args: {
        name: 'file',
        template: 'filepaths'
      }
    },
    {
      name: '--ldb',
      description: 'Used with --eval enable the Redis Lua debugger'
    },
    {
      name: '--ldb-sync-mode',
      description: 'Like --ldb but uses the synchronous Lua debugger'
    },
    {
      name: '--help',
      description: 'Output help and exit'
    },
    {
      name: '--version',
      description: 'Output version and exit'
    }
  ],
  args: {
    name: 'command',
    description: 'Redis command to execute',
    isOptional: true,
    suggestions: [
      { name: 'GET', description: 'Get the value of a key' },
      { name: 'SET', description: 'Set the string value of a key' },
      { name: 'DEL', description: 'Delete a key' },
      { name: 'EXISTS', description: 'Determine if a key exists' },
      { name: 'EXPIRE', description: 'Set a key\'s time to live in seconds' },
      { name: 'TTL', description: 'Get the time to live for a key' },
      { name: 'KEYS', description: 'Find all keys matching the given pattern' },
      { name: 'FLUSHALL', description: 'Remove all keys from all databases' },
      { name: 'FLUSHDB', description: 'Remove all keys from current database' },
      { name: 'SELECT', description: 'Select the database with index' },
      { name: 'PING', description: 'Ping the server' },
      { name: 'INFO', description: 'Get information and statistics about server' },
      { name: 'MONITOR', description: 'Listen for all requests received by server' },
      { name: 'DBSIZE', description: 'Return the number of keys in database' }
    ]
  }
};

// SQLite completion spec
export const sqliteSpec: CompletionSpec = {
  name: 'sqlite3',
  description: 'SQLite command-line shell',
  options: [
    {
      name: '-init',
      description: 'Read/process named file before processing other input',
      args: {
        name: 'file',
        template: 'filepaths'
      }
    },
    {
      name: '-echo',
      description: 'Print commands before execution'
    },
    {
      name: '-batch',
      description: 'Force batch I/O'
    },
    {
      name: '-bail',
      description: 'Stop after hitting an error'
    },
    {
      name: '-interactive',
      description: 'Force interactive I/O'
    },
    {
      name: '-quiet',
      description: 'No messages except errors'
    },
    {
      name: '-stats',
      description: 'Print memory stats before each finalize'
    },
    {
      name: '-safe',
      description: 'Enable safe mode'
    },
    {
      name: '-version',
      description: 'Show SQLite version'
    },
    {
      name: '-vfs',
      description: 'Use NAME as the default VFS',
      args: {
        name: 'name',
        description: 'VFS name'
      }
    },
    {
      name: '-zip',
      description: 'Open the file as a ZIP Archive'
    },
    {
      name: '-append',
      description: 'Append the database to the end of the file'
    },
    {
      name: '-deserialize',
      description: 'Read the database from memory'
    },
    {
      name: '-readonly',
      description: 'Open the database read-only'
    },
    {
      name: '-nofollow',
      description: 'Refuse to open symbolic links to database files'
    },
    {
      name: '-help',
      description: 'Show help message and exit'
    }
  ],
  args: {
    name: 'database',
    description: 'SQLite database file',
    template: 'filepaths',
    isOptional: true
  }
};

// Prisma CLI completion spec
export const prismaSpec: CompletionSpec = {
  name: 'prisma',
  description: 'Modern database access for TypeScript & Node.js',
  subcommands: [
    {
      name: 'init',
      description: 'Set up Prisma for your app',
      options: [
        {
          name: '--datasource-provider',
          description: 'Database provider',
          args: {
            name: 'provider',
            suggestions: [
              { name: 'postgresql', description: 'PostgreSQL database' },
              { name: 'mysql', description: 'MySQL database' },
              { name: 'sqlite', description: 'SQLite database' },
              { name: 'sqlserver', description: 'Microsoft SQL Server' },
              { name: 'mongodb', description: 'MongoDB database' },
              { name: 'cockroachdb', description: 'CockroachDB database' }
            ]
          }
        },
        {
          name: '--url',
          description: 'Database connection URL',
          args: {
            name: 'url',
            description: 'Database connection string'
          }
        }
      ]
    },
    {
      name: 'generate',
      description: 'Generate the Prisma Client',
      options: [
        {
          name: '--schema',
          description: 'Custom path to your Prisma schema',
          args: {
            name: 'path',
            template: 'filepaths'
          }
        },
        {
          name: '--watch',
          description: 'Watch the Prisma schema file and regenerate on changes'
        },
        {
          name: '--data-proxy',
          description: 'Enable Prisma Data Proxy'
        }
      ]
    },
    {
      name: 'introspect',
      description: 'Introspect your database',
      options: [
        {
          name: '--schema',
          description: 'Custom path to your Prisma schema',
          args: {
            name: 'path',
            template: 'filepaths'
          }
        },
        {
          name: '--print',
          description: 'Print the introspected schema to stdout'
        },
        {
          name: '--force',
          description: 'Force overwrite of manual changes made to schema'
        }
      ]
    },
    {
      name: 'migrate',
      description: 'Migrate your database',
      subcommands: [
        {
          name: 'dev',
          description: 'Create and apply migrations in development',
          options: [
            {
              name: '--name',
              description: 'Name of the migration',
              args: {
                name: 'name',
                description: 'Migration name'
              }
            },
            {
              name: '--create-only',
              description: 'Create migration but do not apply'
            },
            {
              name: '--skip-seed',
              description: 'Skip triggering seed'
            },
            {
              name: '--skip-generate',
              description: 'Skip triggering generators'
            }
          ]
        },
        {
          name: 'deploy',
          description: 'Apply pending migrations to the database in production/staging'
        },
        {
          name: 'status',
          description: 'Check the status of your database migrations'
        },
        {
          name: 'reset',
          description: 'Reset your database and apply all migrations',
          options: [
            {
              name: '--force',
              description: 'Skip the confirmation prompt'
            },
            {
              name: '--skip-seed',
              description: 'Skip triggering seed'
            },
            {
              name: '--skip-generate',
              description: 'Skip triggering generators'
            }
          ]
        },
        {
          name: 'resolve',
          description: 'Resolve issues with database migrations',
          options: [
            {
              name: '--applied',
              description: 'Record a specific migration as applied',
              args: {
                name: 'migration',
                description: 'Migration name'
              }
            },
            {
              name: '--rolled-back',
              description: 'Record a specific migration as rolled back',
              args: {
                name: 'migration',
                description: 'Migration name'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'db',
      description: 'Manage your database schema and lifecycle',
      subcommands: [
        {
          name: 'pull',
          description: 'Pull the database schema into your Prisma schema',
          options: [
            {
              name: '--print',
              description: 'Print the introspected schema to stdout'
            },
            {
              name: '--force',
              description: 'Force overwrite of manual changes'
            }
          ]
        },
        {
          name: 'push',
          description: 'Push the Prisma schema state to the database',
          options: [
            {
              name: '--accept-data-loss',
              description: 'Ignore data loss warnings'
            },
            {
              name: '--skip-generate',
              description: 'Skip triggering generators'
            },
            {
              name: '--force-reset',
              description: 'Force a reset of the database before push'
            }
          ]
        },
        {
          name: 'seed',
          description: 'Seed your database with custom data'
        },
        {
          name: 'execute',
          description: 'Execute native SQL against your database',
          options: [
            {
              name: '--file',
              description: 'Path to a file containing SQL to execute',
              args: {
                name: 'file',
                generators: [sqlFileGenerator]
              }
            },
            {
              name: '--stdin',
              description: 'Read SQL from stdin'
            }
          ]
        }
      ]
    },
    {
      name: 'studio',
      description: 'Browse your data with Prisma Studio',
      options: [
        {
          name: '--port',
          description: 'Port to start Studio on',
          args: {
            name: 'port',
            generators: [dbPortGenerator]
          }
        },
        {
          name: '--browser',
          description: 'Browser to auto-open Studio in',
          args: {
            name: 'browser',
            suggestions: [
              { name: 'chrome', description: 'Google Chrome' },
              { name: 'firefox', description: 'Mozilla Firefox' },
              { name: 'safari', description: 'Safari' },
              { name: 'edge', description: 'Microsoft Edge' }
            ]
          }
        },
        {
          name: '--hostname',
          description: 'Hostname to bind the Express server to',
          args: {
            name: 'hostname',
            description: 'Hostname'
          }
        }
      ]
    },
    {
      name: 'format',
      description: 'Format your Prisma schema file',
      options: [
        {
          name: '--schema',
          description: 'Custom path to your Prisma schema',
          args: {
            name: 'path',
            template: 'filepaths'
          }
        }
      ]
    },
    {
      name: 'validate',
      description: 'Validate your Prisma schema file',
      options: [
        {
          name: '--schema',
          description: 'Custom path to your Prisma schema',
          args: {
            name: 'path',
            template: 'filepaths'
          }
        }
      ]
    },
    {
      name: 'version',
      description: 'Display Prisma version info'
    }
  ],
  options: [
    {
      name: '--help',
      description: 'Display help message'
    },
    {
      name: '--version',
      description: 'Display version information'
    }
  ]
};