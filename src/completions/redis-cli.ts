// redis-cli - Redis command line interface
import { CompletionSpec } from '../types.js';

export const redisCliSpec: CompletionSpec = {
  name: 'redis-cli',
  description: 'Redis command line interface',
  options: [
    { name: ['-h', '--host'], description: 'Server hostname', args: { name: 'host' } },
    { name: ['-p', '--port'], description: 'Server port', args: { name: 'port' } },
    { name: ['-a', '--pass'], description: 'Password', args: { name: 'password' } },
    { name: ['-u', '--user'], description: 'ACL username', args: { name: 'user' } },
    { name: ['-n', '--db'], description: 'Database number', args: { name: 'db' } },
    { name: '--db', description: 'Database number', args: { name: 'db' } },
    { name: '--raw', description: 'Use raw formatting for replies' },
    { name: '--csv', description: 'Output in CSV format' },
    { name: '--json', description: 'Output in JSON format' },
    { name: '--no-auth-warning', description: 'Suppress auth warning' },
    { name: '--tls', description: 'Use TLS' },
    { name: '--sni', description: 'TLS SNI hostname', args: { name: 'hostname' } },
    { name: '--cacert', description: 'CA certificate file', args: { name: 'file', template: 'filepaths' } },
    { name: '--cert', description: 'Client certificate file', args: { name: 'file', template: 'filepaths' } },
    { name: '--key', description: 'Client key file', args: { name: 'file', template: 'filepaths' } },
    { name: '--insecure', description: 'Skip certificate validation' },
    { name: '-x', description: 'Read last argument from stdin' },
    { name: ['-r', '--repeat'], description: 'Repeat command', args: { name: 'count' } },
    { name: ['-i', '--interval'], description: 'Interval between repeats', args: { name: 'seconds' } },
    { name: '-c', description: 'Enable cluster mode' },
    { name: '--cluster', description: 'Cluster mode' },
    { name: '--cluster-call', description: 'Cluster call command', args: { name: 'command' } },
    { name: '--cluster-only-masters', description: 'Cluster only masters' },
    { name: ['-v', '--version'], description: 'Show version' },
    { name: ['-h', '--help'], description: 'Show help' },
  ],
  args: [
    { name: 'command', description: 'Redis command', isOptional: true },
    { name: 'args', description: 'Command arguments', isOptional: true, isVariadic: true },
  ],
};
