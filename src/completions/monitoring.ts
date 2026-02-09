import { CompletionSpec } from '../types.js';

// Prometheus config generator
const prometheusConfigGenerator = {
  script: 'find . -maxdepth 3 \\( -name "prometheus.yml" -o -name "prometheus.yaml" -o -name "*prometheus*.yml" -o -name "*prometheus*.yaml" \\) | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Prometheus config: ${file}`,
      type: 'file' as const
    }));
  }
};

// Grafana dashboard generator
const grafanaDashboardGenerator = {
  script: 'find . -maxdepth 3 \\( -name "*.json" -path "*/dashboards/*" -o -name "*dashboard*.json" \\) | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Dashboard: ${file}`,
      type: 'file' as const
    }));
  }
};

// Service discovery generator
const serviceGenerator = {
  script: 'kubectl get services 2>/dev/null | grep -v NAME | awk \'{print $1}\' | head -20 || echo "web-service\\napi-service\\ndata-service"',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(s => s).map(service => ({
      name: service,
      description: `Service: ${service}`,
      type: 'option' as const
    }));
  }
};

// Prometheus completion spec
export const prometheusSpec: CompletionSpec = {
  name: 'prometheus',
  description: 'Monitoring system and time series database',
  options: [
    {
      name: '--config.file',
      description: 'Prometheus configuration file path',
      args: {
        name: 'file',
        generators: [prometheusConfigGenerator]
      }
    },
    {
      name: '--storage.tsdb.path',
      description: 'Base path for metrics storage',
      args: {
        name: 'path',
        template: 'folders'
      }
    },
    {
      name: '--storage.tsdb.retention.time',
      description: 'How long to retain samples in storage',
      args: {
        name: 'duration',
        suggestions: [
          { name: '15d', description: '15 days' },
          { name: '30d', description: '30 days' },
          { name: '90d', description: '90 days' },
          { name: '1y', description: '1 year' }
        ]
      }
    },
    {
      name: '--storage.tsdb.retention.size',
      description: 'Maximum number of bytes to store',
      args: {
        name: 'size',
        suggestions: [
          { name: '1GB', description: '1 Gigabyte' },
          { name: '10GB', description: '10 Gigabytes' },
          { name: '100GB', description: '100 Gigabytes' },
          { name: '1TB', description: '1 Terabyte' }
        ]
      }
    },
    {
      name: '--web.listen-address',
      description: 'Address to listen on for web interface and API',
      args: {
        name: 'address',
        suggestions: [
          { name: '0.0.0.0:9090', description: 'All interfaces port 9090' },
          { name: 'localhost:9090', description: 'Local only port 9090' },
          { name: ':9090', description: 'Port 9090' }
        ]
      }
    },
    {
      name: '--web.external-url',
      description: 'External URL for Prometheus',
      args: {
        name: 'url',
        description: 'External URL'
      }
    },
    {
      name: '--web.route-prefix',
      description: 'Prefix for web endpoints',
      args: {
        name: 'prefix',
        description: 'Route prefix'
      }
    },
    {
      name: '--web.console.templates',
      description: 'Path to console template files',
      args: {
        name: 'path',
        template: 'folders'
      }
    },
    {
      name: '--web.console.libraries',
      description: 'Path to console library files',
      args: {
        name: 'path',
        template: 'folders'
      }
    },
    {
      name: '--web.enable-lifecycle',
      description: 'Enable shutdown and reload via HTTP requests'
    },
    {
      name: '--web.enable-admin-api',
      description: 'Enable API endpoints for admin control actions'
    },
    {
      name: '--web.enable-remote-shutdown',
      description: 'Enable remote shutdown via web endpoint'
    },
    {
      name: '--log.level',
      description: 'Log level',
      args: {
        name: 'level',
        suggestions: [
          { name: 'debug', description: 'Debug level' },
          { name: 'info', description: 'Info level' },
          { name: 'warn', description: 'Warning level' },
          { name: 'error', description: 'Error level' }
        ]
      }
    },
    {
      name: '--log.format',
      description: 'Log format',
      args: {
        name: 'format',
        suggestions: [
          { name: 'logfmt', description: 'Logfmt format' },
          { name: 'json', description: 'JSON format' }
        ]
      }
    },
    {
      name: '--query.lookback-delta',
      description: 'Delta difference allowed for retrieving metrics',
      args: {
        name: 'duration',
        suggestions: [
          { name: '5m', description: '5 minutes' },
          { name: '10m', description: '10 minutes' },
          { name: '15m', description: '15 minutes' }
        ]
      }
    },
    {
      name: '--query.timeout',
      description: 'Maximum time a query may take before being aborted',
      args: {
        name: 'duration',
        suggestions: [
          { name: '2m', description: '2 minutes' },
          { name: '5m', description: '5 minutes' },
          { name: '10m', description: '10 minutes' }
        ]
      }
    },
    {
      name: '--query.max-concurrency',
      description: 'Maximum number of queries executed concurrently',
      args: {
        name: 'number',
        suggestions: [
          { name: '20', description: '20 concurrent queries' },
          { name: '50', description: '50 concurrent queries' },
          { name: '100', description: '100 concurrent queries' }
        ]
      }
    },
    {
      name: '--alertmanager.notification-queue-capacity',
      description: 'Capacity of the queue for pending alert manager notifications',
      args: {
        name: 'number',
        suggestions: [
          { name: '10000', description: '10,000 notifications' },
          { name: '20000', description: '20,000 notifications' }
        ]
      }
    },
    {
      name: '--alertmanager.timeout',
      description: 'Timeout for sending alerts to Alertmanager',
      args: {
        name: 'duration',
        suggestions: [
          { name: '10s', description: '10 seconds' },
          { name: '30s', description: '30 seconds' },
          { name: '1m', description: '1 minute' }
        ]
      }
    }
  ]
};

// Grafana CLI completion spec
export const grafanaCliSpec: CompletionSpec = {
  name: 'grafana-cli',
  description: 'Grafana command line interface',
  subcommands: [
    {
      name: 'plugins',
      description: 'Manage plugins',
      subcommands: [
        {
          name: 'install',
          description: 'Install a plugin',
          args: {
            name: 'plugin',
            description: 'Plugin ID or URL',
            suggestions: [
              { name: 'grafana-clock-panel', description: 'Clock panel plugin' },
              { name: 'grafana-simple-json-datasource', description: 'Simple JSON datasource' },
              { name: 'grafana-piechart-panel', description: 'Pie chart panel' },
              { name: 'alexanderzobnin-zabbix-app', description: 'Zabbix application' },
              { name: 'camptocamp-prometheus-alertmanager-datasource', description: 'Alertmanager datasource' }
            ]
          }
        },
        {
          name: 'uninstall',
          description: 'Uninstall a plugin',
          args: {
            name: 'plugin',
            description: 'Plugin ID'
          }
        },
        {
          name: 'list-remote',
          description: 'List available plugins'
        },
        {
          name: 'list-installed',
          description: 'List installed plugins'
        },
        {
          name: 'update',
          description: 'Update a plugin',
          args: {
            name: 'plugin',
            description: 'Plugin ID',
            isOptional: true
          }
        },
        {
          name: 'update-all',
          description: 'Update all plugins'
        }
      ]
    },
    {
      name: 'admin',
      description: 'Administrative commands',
      subcommands: [
        {
          name: 'reset-admin-password',
          description: 'Reset admin password',
          args: {
            name: 'password',
            description: 'New password'
          }
        },
        {
          name: 'data-migration',
          description: 'Run data migration'
        }
      ]
    }
  ],
  options: [
    {
      name: '--pluginsDir',
      description: 'Path to plugins directory',
      args: {
        name: 'path',
        template: 'folders'
      }
    },
    {
      name: '--repo',
      description: 'Plugin repository URL',
      args: {
        name: 'url',
        description: 'Repository URL'
      }
    },
    {
      name: '--pluginUrl',
      description: 'Plugin download URL',
      args: {
        name: 'url',
        description: 'Plugin URL'
      }
    },
    {
      name: '--insecure',
      description: 'Skip TLS verification'
    },
    {
      name: '--debug',
      description: 'Enable debug logging'
    },
    {
      name: '--configOverrides',
      description: 'Configuration overrides',
      args: {
        name: 'overrides',
        description: 'Config overrides'
      }
    },
    {
      name: '--homepath',
      description: 'Path to Grafana installation',
      args: {
        name: 'path',
        template: 'folders'
      }
    },
    {
      name: '--config',
      description: 'Path to config file',
      args: {
        name: 'file',
        template: 'filepaths'
      }
    }
  ]
};

// Datadog CLI completion spec
export const datadogSpec: CompletionSpec = {
  name: 'datadog',
  description: 'Datadog command line interface',
  subcommands: [
    {
      name: 'dashboard',
      description: 'Manage dashboards',
      subcommands: [
        {
          name: 'list',
          description: 'List all dashboards'
        },
        {
          name: 'get',
          description: 'Get a dashboard',
          args: {
            name: 'dashboard-id',
            description: 'Dashboard ID'
          }
        },
        {
          name: 'create',
          description: 'Create a dashboard',
          options: [
            {
              name: '--file',
              description: 'Dashboard definition file',
              args: {
                name: 'file',
                generators: [grafanaDashboardGenerator]
              }
            }
          ]
        },
        {
          name: 'update',
          description: 'Update a dashboard',
          args: {
            name: 'dashboard-id',
            description: 'Dashboard ID'
          },
          options: [
            {
              name: '--file',
              description: 'Dashboard definition file',
              args: {
                name: 'file',
                generators: [grafanaDashboardGenerator]
              }
            }
          ]
        },
        {
          name: 'delete',
          description: 'Delete a dashboard',
          args: {
            name: 'dashboard-id',
            description: 'Dashboard ID'
          }
        }
      ]
    },
    {
      name: 'monitor',
      description: 'Manage monitors',
      subcommands: [
        {
          name: 'list',
          description: 'List all monitors'
        },
        {
          name: 'get',
          description: 'Get a monitor',
          args: {
            name: 'monitor-id',
            description: 'Monitor ID'
          }
        },
        {
          name: 'create',
          description: 'Create a monitor',
          options: [
            {
              name: '--file',
              description: 'Monitor definition file',
              args: {
                name: 'file',
                template: 'filepaths'
              }
            }
          ]
        },
        {
          name: 'update',
          description: 'Update a monitor',
          args: {
            name: 'monitor-id',
            description: 'Monitor ID'
          }
        },
        {
          name: 'delete',
          description: 'Delete a monitor',
          args: {
            name: 'monitor-id',
            description: 'Monitor ID'
          }
        },
        {
          name: 'mute',
          description: 'Mute a monitor',
          args: {
            name: 'monitor-id',
            description: 'Monitor ID'
          }
        },
        {
          name: 'unmute',
          description: 'Unmute a monitor',
          args: {
            name: 'monitor-id',
            description: 'Monitor ID'
          }
        }
      ]
    },
    {
      name: 'logs',
      description: 'Query logs',
      options: [
        {
          name: '--query',
          description: 'Log query',
          args: {
            name: 'query',
            description: 'Log search query'
          }
        },
        {
          name: '--from',
          description: 'Start time',
          args: {
            name: 'timestamp',
            suggestions: [
              { name: '1h', description: '1 hour ago' },
              { name: '24h', description: '24 hours ago' },
              { name: '7d', description: '7 days ago' }
            ]
          }
        },
        {
          name: '--to',
          description: 'End time',
          args: {
            name: 'timestamp',
            suggestions: [
              { name: 'now', description: 'Now' }
            ]
          }
        },
        {
          name: '--limit',
          description: 'Maximum number of logs',
          args: {
            name: 'limit',
            suggestions: [
              { name: '100', description: '100 logs' },
              { name: '500', description: '500 logs' },
              { name: '1000', description: '1000 logs' }
            ]
          }
        },
        {
          name: '--sort',
          description: 'Sort order',
          args: {
            name: 'order',
            suggestions: [
              { name: 'desc', description: 'Descending (newest first)' },
              { name: 'asc', description: 'Ascending (oldest first)' }
            ]
          }
        }
      ]
    },
    {
      name: 'metrics',
      description: 'Query metrics',
      options: [
        {
          name: '--query',
          description: 'Metrics query',
          args: {
            name: 'query',
            description: 'Metrics query'
          }
        },
        {
          name: '--from',
          description: 'Start time',
          args: {
            name: 'timestamp',
            suggestions: [
              { name: '1h', description: '1 hour ago' },
              { name: '24h', description: '24 hours ago' },
              { name: '7d', description: '7 days ago' }
            ]
          }
        },
        {
          name: '--to',
          description: 'End time',
          args: {
            name: 'timestamp',
            suggestions: [
              { name: 'now', description: 'Now' }
            ]
          }
        }
      ]
    },
    {
      name: 'synthetics',
      description: 'Manage synthetic tests',
      subcommands: [
        {
          name: 'list',
          description: 'List synthetic tests'
        },
        {
          name: 'get',
          description: 'Get a synthetic test',
          args: {
            name: 'test-id',
            description: 'Test ID'
          }
        },
        {
          name: 'create',
          description: 'Create a synthetic test'
        },
        {
          name: 'update',
          description: 'Update a synthetic test',
          args: {
            name: 'test-id',
            description: 'Test ID'
          }
        },
        {
          name: 'delete',
          description: 'Delete a synthetic test',
          args: {
            name: 'test-id',
            description: 'Test ID'
          }
        }
      ]
    }
  ],
  options: [
    {
      name: '--api-key',
      description: 'Datadog API key',
      args: {
        name: 'key',
        description: 'API key'
      }
    },
    {
      name: '--app-key',
      description: 'Datadog application key',
      args: {
        name: 'key',
        description: 'Application key'
      }
    },
    {
      name: '--site',
      description: 'Datadog site',
      args: {
        name: 'site',
        suggestions: [
          { name: 'datadoghq.com', description: 'US site' },
          { name: 'datadoghq.eu', description: 'EU site' },
          { name: 'us3.datadoghq.com', description: 'US3 site' },
          { name: 'us5.datadoghq.com', description: 'US5 site' }
        ]
      }
    },
    {
      name: '--output',
      description: 'Output format',
      args: {
        name: 'format',
        suggestions: [
          { name: 'json', description: 'JSON format' },
          { name: 'yaml', description: 'YAML format' },
          { name: 'table', description: 'Table format' }
        ]
      }
    }
  ]
};

// Jaeger completion spec
export const jaegerSpec: CompletionSpec = {
  name: 'jaeger',
  description: 'Jaeger distributed tracing system',
  subcommands: [
    {
      name: 'query',
      description: 'Start Jaeger Query service',
      options: [
        {
          name: '--query.port',
          description: 'Port for Query service',
          args: {
            name: 'port',
            suggestions: [
              { name: '16686', description: 'Default Jaeger Query port' },
              { name: '8080', description: 'Alternative port' }
            ]
          }
        },
        {
          name: '--query.host',
          description: 'Host for Query service',
          args: {
            name: 'host',
            suggestions: [
              { name: '0.0.0.0', description: 'All interfaces' },
              { name: 'localhost', description: 'Local only' }
            ]
          }
        },
        {
          name: '--query.base-path',
          description: 'Base path for Query service',
          args: {
            name: 'path',
            description: 'Base path'
          }
        },
        {
          name: '--query.static-files',
          description: 'Path to static files',
          args: {
            name: 'path',
            template: 'folders'
          }
        },
        {
          name: '--query.ui-config',
          description: 'Path to UI config file',
          args: {
            name: 'file',
            template: 'filepaths'
          }
        }
      ]
    },
    {
      name: 'collector',
      description: 'Start Jaeger Collector',
      options: [
        {
          name: '--collector.grpc-port',
          description: 'gRPC port for the collector',
          args: {
            name: 'port',
            suggestions: [
              { name: '14250', description: 'Default gRPC port' }
            ]
          }
        },
        {
          name: '--collector.http-port',
          description: 'HTTP port for the collector',
          args: {
            name: 'port',
            suggestions: [
              { name: '14268', description: 'Default HTTP port' }
            ]
          }
        },
        {
          name: '--collector.zipkin.http-port',
          description: 'HTTP port for Zipkin collector',
          args: {
            name: 'port',
            suggestions: [
              { name: '9411', description: 'Zipkin HTTP port' }
            ]
          }
        }
      ]
    },
    {
      name: 'agent',
      description: 'Start Jaeger Agent',
      options: [
        {
          name: '--agent.grpc-port',
          description: 'gRPC port for the agent',
          args: {
            name: 'port',
            suggestions: [
              { name: '14250', description: 'Default gRPC port' }
            ]
          }
        },
        {
          name: '--agent.http-port',
          description: 'HTTP port for the agent',
          args: {
            name: 'port',
            suggestions: [
              { name: '5778', description: 'Default HTTP port' }
            ]
          }
        }
      ]
    },
    {
      name: 'all-in-one',
      description: 'Start all Jaeger services in one process',
      options: [
        {
          name: '--memory.max-traces',
          description: 'Maximum number of traces in memory',
          args: {
            name: 'number',
            suggestions: [
              { name: '10000', description: '10,000 traces' },
              { name: '50000', description: '50,000 traces' },
              { name: '100000', description: '100,000 traces' }
            ]
          }
        },
        {
          name: '--query.port',
          description: 'Port for Query service',
          args: {
            name: 'port',
            suggestions: [
              { name: '16686', description: 'Default port' }
            ]
          }
        }
      ]
    }
  ],
  options: [
    {
      name: '--log-level',
      description: 'Logging level',
      args: {
        name: 'level',
        suggestions: [
          { name: 'debug', description: 'Debug level' },
          { name: 'info', description: 'Info level' },
          { name: 'warn', description: 'Warning level' },
          { name: 'error', description: 'Error level' }
        ]
      }
    },
    {
      name: '--span-storage.type',
      description: 'Storage backend type',
      args: {
        name: 'type',
        suggestions: [
          { name: 'memory', description: 'In-memory storage' },
          { name: 'cassandra', description: 'Cassandra storage' },
          { name: 'elasticsearch', description: 'Elasticsearch storage' },
          { name: 'kafka', description: 'Kafka storage' }
        ]
      }
    }
  ]
};

// OpenTelemetry CLI completion spec
export const opentelemetrySpec: CompletionSpec = {
  name: 'opentelemetry',
  description: 'OpenTelemetry observability framework',
  subcommands: [
    {
      name: 'collector',
      description: 'OpenTelemetry Collector',
      subcommands: [
        {
          name: 'start',
          description: 'Start the collector',
          options: [
            {
              name: '--config',
              description: 'Configuration file',
              args: {
                name: 'file',
                template: 'filepaths'
              }
            },
            {
              name: '--log-level',
              description: 'Log level',
              args: {
                name: 'level',
                suggestions: [
                  { name: 'debug', description: 'Debug level' },
                  { name: 'info', description: 'Info level' },
                  { name: 'warn', description: 'Warning level' },
                  { name: 'error', description: 'Error level' }
                ]
              }
            },
            {
              name: '--set',
              description: 'Set configuration override',
              args: {
                name: 'override',
                description: 'Configuration override'
              }
            }
          ]
        },
        {
          name: 'validate',
          description: 'Validate configuration',
          options: [
            {
              name: '--config',
              description: 'Configuration file',
              args: {
                name: 'file',
                template: 'filepaths'
              }
            }
          ]
        },
        {
          name: 'components',
          description: 'List available components'
        }
      ]
    },
    {
      name: 'trace',
      description: 'Trace utilities',
      subcommands: [
        {
          name: 'export',
          description: 'Export traces',
          options: [
            {
              name: '--endpoint',
              description: 'OTLP endpoint',
              args: {
                name: 'endpoint',
                suggestions: [
                  { name: 'http://localhost:4318', description: 'Local OTLP HTTP' },
                  { name: 'grpc://localhost:4317', description: 'Local OTLP gRPC' }
                ]
              }
            },
            {
              name: '--format',
              description: 'Export format',
              args: {
                name: 'format',
                suggestions: [
                  { name: 'otlp', description: 'OTLP format' },
                  { name: 'jaeger', description: 'Jaeger format' },
                  { name: 'zipkin', description: 'Zipkin format' }
                ]
              }
            }
          ]
        },
        {
          name: 'generate',
          description: 'Generate sample traces',
          options: [
            {
              name: '--service',
              description: 'Service name',
              args: {
                name: 'service',
                generators: [serviceGenerator]
              }
            },
            {
              name: '--traces',
              description: 'Number of traces to generate',
              args: {
                name: 'count',
                suggestions: [
                  { name: '10', description: '10 traces' },
                  { name: '100', description: '100 traces' },
                  { name: '1000', description: '1000 traces' }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};