// Docker completion spec for CLIFlow
// Comprehensive docker command completions

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';
import { generatorFromLines, generatorFromSeparatedFields, subcommandsFromHelp } from './_shared/generators.js';

// Helper to create simple suggestions
const s = (...names: string[]): Suggestion[] => names.map(name => ({ name }));

// Docker generators
const dockerGenerators = {
  containers: generatorFromSeparatedFields({
    script: 'docker ps -a --format "{{.Names}}\t{{.Image}}\t{{.Status}}"',
    cacheTtl: 5000,
    mapFields: ([name, image, status]) => {
      if (!name) return null;
      const isRunning = status?.includes('Up');
      return {
        name,
        description: `${image} - ${status}`,
        icon: isRunning ? '🟢' : '🔴',
      };
    },
  }),

  runningContainers: generatorFromSeparatedFields({
    script: 'docker ps --format "{{.Names}}\t{{.Image}}"',
    cacheTtl: 5000,
    mapFields: ([name, image]) => (name ? { name, description: image, icon: '🟢' } : null),
  }),

  images: generatorFromSeparatedFields({
    script: 'docker images --format "{{.Repository}}:{{.Tag}}\t{{.Size}}"',
    cacheTtl: 30000,
    mapFields: ([name, size]) => (name ? { name, description: size, icon: '📦' } : null),
  }),

  volumes: generatorFromLines({
    script: 'docker volume ls --format "{{.Name}}"',
    cacheTtl: 30000,
    mapLine: (name) => ({ name, icon: '💾', description: 'Volume' }),
  }),

  networks: generatorFromSeparatedFields({
    script: 'docker network ls --format "{{.Name}}\t{{.Driver}}"',
    cacheTtl: 30000,
    mapFields: ([name, driver]) => (name ? { name, description: driver, icon: '🌐' } : null),
  }),

  contexts: generatorFromSeparatedFields({
    script: 'docker context ls --format "{{.Name}}\t{{.Description}}"',
    cacheTtl: 60000,
    mapFields: ([name, desc]) => (name ? { name, description: desc, icon: '🔧' } : null),
  }),
};

const dockerSubcommandGenerator = subcommandsFromHelp({
  script: 'docker help -a 2>/dev/null',
  cacheTtl: 60000,
  lineRegex: /^\s{2,}([a-z0-9][\w-]+)\s+(.*)$/i,
});

export const dockerSpec: CompletionSpec = {
  name: 'docker',
  description: 'Container platform for building and running applications',
  generateSpec: dockerSubcommandGenerator,
  subcommands: [
    // Container Commands
    {
      name: 'run',
      description: 'Create and run a new container from an image',
      args: [
        { name: 'image', generators: dockerGenerators.images },
        { name: 'command', isOptional: true, isVariadic: true }
      ],
      options: [
        { name: ['-d', '--detach'], description: 'Run container in background' },
        { name: ['-i', '--interactive'], description: 'Keep STDIN open' },
        { name: ['-t', '--tty'], description: 'Allocate pseudo-TTY' },
        { name: '--name', description: 'Assign name to container', args: { name: 'name' } },
        { name: ['-p', '--publish'], description: 'Publish port', args: { name: 'hostPort:containerPort' } },
        { name: ['-P', '--publish-all'], description: 'Publish all exposed ports' },
        { name: ['-v', '--volume'], description: 'Bind mount volume', args: { name: 'host:container' } },
        { name: '--mount', description: 'Attach filesystem mount', args: { name: 'mount' } },
        { name: ['-e', '--env'], description: 'Set environment variable', args: { name: 'VAR=value' } },
        { name: '--env-file', description: 'Read env from file', args: { name: 'file', template: 'filepaths' } },
        { name: ['-w', '--workdir'], description: 'Working directory', args: { name: 'dir' } },
        { name: ['-u', '--user'], description: 'Username or UID', args: { name: 'user' } },
        { name: '--rm', description: 'Remove container when it exits' },
        { name: '--restart', description: 'Restart policy', args: { name: 'policy', suggestions: s('no', 'always', 'unless-stopped', 'on-failure') } },
        { name: '--network', description: 'Connect to network', args: { name: 'network', generators: dockerGenerators.networks } },
        { name: '--link', description: 'Link to container', args: { name: 'container:alias' } },
        { name: ['-h', '--hostname'], description: 'Container hostname', args: { name: 'hostname' } },
        { name: '--add-host', description: 'Add host-to-IP mapping', args: { name: 'host:ip' } },
        { name: '--dns', description: 'Custom DNS servers', args: { name: 'ip' } },
        { name: '--entrypoint', description: 'Override entrypoint', args: { name: 'entrypoint' } },
        { name: '--cpus', description: 'Number of CPUs', args: { name: 'number' } },
        { name: ['-m', '--memory'], description: 'Memory limit', args: { name: 'bytes' } },
        { name: '--memory-swap', description: 'Swap limit', args: { name: 'bytes' } },
        { name: '--gpus', description: 'GPU devices', args: { name: 'gpu', suggestions: s('all', '0', '1', '2') } },
        { name: '--privileged', description: 'Give extended privileges' },
        { name: '--cap-add', description: 'Add capability', args: { name: 'cap' } },
        { name: '--cap-drop', description: 'Drop capability', args: { name: 'cap' } },
        { name: '--security-opt', description: 'Security options', args: { name: 'option' } },
        { name: ['-l', '--label'], description: 'Set metadata label', args: { name: 'key=value' } },
        { name: '--pid', description: 'PID namespace', args: { name: 'string' } },
        { name: '--ipc', description: 'IPC namespace', args: { name: 'string' } },
        { name: '--uts', description: 'UTS namespace', args: { name: 'string' } },
        { name: '--init', description: 'Run init inside container' },
        { name: '--read-only', description: 'Mount root filesystem read-only' },
        { name: '--tmpfs', description: 'Mount tmpfs directory', args: { name: 'path' } },
        { name: '--log-driver', description: 'Logging driver', args: { name: 'driver', suggestions: s('json-file', 'syslog', 'journald', 'none', 'awslogs', 'fluentd', 'gcplogs') } },
        { name: '--log-opt', description: 'Log driver options', args: { name: 'option' } },
        { name: '--platform', description: 'Set platform', args: { name: 'platform', suggestions: s('linux/amd64', 'linux/arm64', 'linux/arm/v7') } },
        { name: '--pull', description: 'Pull image policy', args: { name: 'policy', suggestions: s('always', 'missing', 'never') } }
      ]
    },
    {
      name: 'exec',
      description: 'Execute command in running container',
      args: [
        { name: 'container', generators: dockerGenerators.runningContainers },
        { name: 'command', isVariadic: true }
      ],
      options: [
        { name: ['-i', '--interactive'], description: 'Keep STDIN open' },
        { name: ['-t', '--tty'], description: 'Allocate pseudo-TTY' },
        { name: ['-d', '--detach'], description: 'Run in background' },
        { name: ['-e', '--env'], description: 'Set environment variable', args: { name: 'VAR=value' } },
        { name: ['-w', '--workdir'], description: 'Working directory', args: { name: 'dir' } },
        { name: ['-u', '--user'], description: 'Username or UID', args: { name: 'user' } },
        { name: '--privileged', description: 'Give extended privileges' }
      ]
    },
    {
      name: 'start',
      description: 'Start stopped containers',
      args: { name: 'container', isVariadic: true, generators: dockerGenerators.containers },
      options: [
        { name: ['-a', '--attach'], description: 'Attach STDOUT/STDERR' },
        { name: ['-i', '--interactive'], description: 'Attach STDIN' }
      ]
    },
    {
      name: 'stop',
      description: 'Stop running containers',
      args: { name: 'container', isVariadic: true, generators: dockerGenerators.runningContainers },
      options: [
        { name: ['-t', '--time'], description: 'Seconds to wait before killing', args: { name: 'seconds' } },
        { name: ['-s', '--signal'], description: 'Signal to send', args: { name: 'signal' } }
      ]
    },
    {
      name: 'restart',
      description: 'Restart containers',
      args: { name: 'container', isVariadic: true, generators: dockerGenerators.containers },
      options: [
        { name: ['-t', '--time'], description: 'Seconds to wait', args: { name: 'seconds' } },
        { name: ['-s', '--signal'], description: 'Signal to send', args: { name: 'signal' } }
      ]
    },
    {
      name: 'kill',
      description: 'Kill running containers',
      args: { name: 'container', isVariadic: true, generators: dockerGenerators.runningContainers },
      options: [
        { name: ['-s', '--signal'], description: 'Signal to send', args: { name: 'signal', suggestions: s('SIGTERM', 'SIGKILL', 'SIGHUP', 'SIGUSR1') } }
      ]
    },
    {
      name: 'rm',
      description: 'Remove containers',
      args: { name: 'container', isVariadic: true, generators: dockerGenerators.containers },
      options: [
        { name: ['-f', '--force'], description: 'Force removal of running container' },
        { name: ['-v', '--volumes'], description: 'Remove anonymous volumes' },
        { name: ['-l', '--link'], description: 'Remove specified link' }
      ]
    },
    {
      name: 'pause',
      description: 'Pause processes in containers',
      args: { name: 'container', isVariadic: true, generators: dockerGenerators.runningContainers }
    },
    {
      name: 'unpause',
      description: 'Unpause processes in containers',
      args: { name: 'container', isVariadic: true, generators: dockerGenerators.containers }
    },
    {
      name: 'attach',
      description: 'Attach to running container',
      args: { name: 'container', generators: dockerGenerators.runningContainers },
      options: [
        { name: '--no-stdin', description: 'Do not attach STDIN' },
        { name: '--sig-proxy', description: 'Proxy signals to process' },
        { name: '--detach-keys', description: 'Override detach key sequence', args: { name: 'string' } }
      ]
    },
    {
      name: 'logs',
      description: 'Fetch container logs',
      args: { name: 'container', generators: dockerGenerators.containers },
      options: [
        { name: ['-f', '--follow'], description: 'Follow log output' },
        { name: ['-t', '--timestamps'], description: 'Show timestamps' },
        { name: '--since', description: 'Show logs since timestamp', args: { name: 'time' } },
        { name: '--until', description: 'Show logs until timestamp', args: { name: 'time' } },
        { name: ['-n', '--tail'], description: 'Number of lines', args: { name: 'lines', suggestions: s('10', '50', '100', '500', 'all') } },
        { name: '--details', description: 'Show extra details' }
      ]
    },
    {
      name: 'ps',
      description: 'List containers',
      options: [
        { name: ['-a', '--all'], description: 'Show all containers' },
        { name: ['-q', '--quiet'], description: 'Only display container IDs' },
        { name: ['-s', '--size'], description: 'Display total file sizes' },
        { name: ['-n', '--last'], description: 'Show n last created containers', args: { name: 'n' } },
        { name: ['-l', '--latest'], description: 'Show latest created container' },
        { name: '--no-trunc', description: 'Don\'t truncate output' },
        { name: ['-f', '--filter'], description: 'Filter output', args: { name: 'filter' } },
        { name: '--format', description: 'Pretty-print using template', args: { name: 'string' } }
      ]
    },
    {
      name: 'inspect',
      description: 'Display detailed information',
      args: { name: 'object', isVariadic: true, generators: dockerGenerators.containers },
      options: [
        { name: ['-f', '--format'], description: 'Format output', args: { name: 'string' } },
        { name: ['-s', '--size'], description: 'Display total file sizes' },
        { name: '--type', description: 'Return JSON for object type', args: { name: 'type', suggestions: s('container', 'image', 'network', 'volume') } }
      ]
    },
    {
      name: 'top',
      description: 'Display running processes of a container',
      args: [
        { name: 'container', generators: dockerGenerators.runningContainers },
        { name: 'ps options', isOptional: true, isVariadic: true }
      ]
    },
    {
      name: 'stats',
      description: 'Display container resource usage statistics',
      args: { name: 'container', isOptional: true, isVariadic: true, generators: dockerGenerators.runningContainers },
      options: [
        { name: ['-a', '--all'], description: 'Show all containers' },
        { name: '--no-stream', description: 'Disable streaming stats' },
        { name: '--no-trunc', description: 'Don\'t truncate output' },
        { name: '--format', description: 'Pretty-print using template', args: { name: 'string' } }
      ]
    },
    {
      name: 'port',
      description: 'List port mappings or specific mapping',
      args: [
        { name: 'container', generators: dockerGenerators.containers },
        { name: 'port', isOptional: true }
      ]
    },
    {
      name: 'rename',
      description: 'Rename a container',
      args: [
        { name: 'container', generators: dockerGenerators.containers },
        { name: 'new_name' }
      ]
    },
    {
      name: 'update',
      description: 'Update container configuration',
      args: { name: 'container', isVariadic: true, generators: dockerGenerators.containers },
      options: [
        { name: '--cpus', description: 'Number of CPUs', args: { name: 'number' } },
        { name: ['-m', '--memory'], description: 'Memory limit', args: { name: 'bytes' } },
        { name: '--memory-swap', description: 'Swap limit', args: { name: 'bytes' } },
        { name: '--restart', description: 'Restart policy', args: { name: 'policy', suggestions: s('no', 'always', 'unless-stopped', 'on-failure') } }
      ]
    },
    {
      name: 'wait',
      description: 'Block until containers stop',
      args: { name: 'container', isVariadic: true, generators: dockerGenerators.runningContainers }
    },
    {
      name: 'cp',
      description: 'Copy files between container and filesystem',
      args: [
        { name: 'source', description: 'CONTAINER:SRC_PATH or SRC_PATH' },
        { name: 'dest', description: 'CONTAINER:DEST_PATH or DEST_PATH' }
      ],
      options: [
        { name: ['-a', '--archive'], description: 'Archive mode (copy all uid/gid info)' },
        { name: ['-L', '--follow-link'], description: 'Follow symbolic links' },
        { name: ['-q', '--quiet'], description: 'Suppress progress output' }
      ]
    },
    {
      name: 'diff',
      description: 'Inspect changes to container filesystem',
      args: { name: 'container', generators: dockerGenerators.containers }
    },
    {
      name: 'commit',
      description: 'Create new image from container changes',
      args: [
        { name: 'container', generators: dockerGenerators.containers },
        { name: 'repository:tag', isOptional: true }
      ],
      options: [
        { name: ['-a', '--author'], description: 'Author', args: { name: 'string' } },
        { name: ['-m', '--message'], description: 'Commit message', args: { name: 'string' } },
        { name: ['-c', '--change'], description: 'Apply Dockerfile instruction', args: { name: 'string' } },
        { name: ['-p', '--pause'], description: 'Pause container during commit' }
      ]
    },
    {
      name: 'export',
      description: 'Export container filesystem as tar archive',
      args: { name: 'container', generators: dockerGenerators.containers },
      options: [
        { name: ['-o', '--output'], description: 'Write to file', args: { name: 'file', template: 'filepaths' } }
      ]
    },

    // Image Commands
    {
      name: 'images',
      description: 'List images',
      args: { name: 'repository', isOptional: true },
      options: [
        { name: ['-a', '--all'], description: 'Show all images' },
        { name: ['-q', '--quiet'], description: 'Only show image IDs' },
        { name: '--digests', description: 'Show digests' },
        { name: '--no-trunc', description: 'Don\'t truncate output' },
        { name: ['-f', '--filter'], description: 'Filter output', args: { name: 'filter' } },
        { name: '--format', description: 'Pretty-print using template', args: { name: 'string' } }
      ]
    },
    {
      name: 'pull',
      description: 'Download image from registry',
      args: { name: 'image' },
      options: [
        { name: ['-a', '--all-tags'], description: 'Download all tagged images' },
        { name: '--disable-content-trust', description: 'Skip image verification' },
        { name: '--platform', description: 'Set platform', args: { name: 'platform', suggestions: s('linux/amd64', 'linux/arm64', 'linux/arm/v7') } },
        { name: ['-q', '--quiet'], description: 'Suppress verbose output' }
      ]
    },
    {
      name: 'push',
      description: 'Upload image to registry',
      args: { name: 'image', generators: dockerGenerators.images },
      options: [
        { name: ['-a', '--all-tags'], description: 'Push all tagged images' },
        { name: '--disable-content-trust', description: 'Skip image signing' },
        { name: ['-q', '--quiet'], description: 'Suppress verbose output' }
      ]
    },
    {
      name: 'build',
      description: 'Build image from Dockerfile',
      args: { name: 'path', template: 'folders' },
      options: [
        { name: ['-t', '--tag'], description: 'Name and optionally tag', args: { name: 'name:tag' } },
        { name: ['-f', '--file'], description: 'Dockerfile path', args: { name: 'file', template: 'filepaths' } },
        { name: '--build-arg', description: 'Set build-time variable', args: { name: 'var=value' } },
        { name: '--target', description: 'Set target build stage', args: { name: 'stage' } },
        { name: '--no-cache', description: 'Do not use cache' },
        { name: '--pull', description: 'Always pull newer base image' },
        { name: '--rm', description: 'Remove intermediate containers' },
        { name: '--force-rm', description: 'Always remove intermediate containers' },
        { name: ['-q', '--quiet'], description: 'Suppress build output' },
        { name: '--network', description: 'Network mode for RUN', args: { name: 'string' } },
        { name: '--platform', description: 'Set platform', args: { name: 'platform', suggestions: s('linux/amd64', 'linux/arm64', 'linux/arm/v7') } },
        { name: '--progress', description: 'Progress output type', args: { name: 'string', suggestions: s('auto', 'plain', 'tty') } },
        { name: '--secret', description: 'Secret to expose', args: { name: 'string' } },
        { name: '--ssh', description: 'SSH agent socket', args: { name: 'string' } },
        { name: '--cache-from', description: 'Images to use as cache source', args: { name: 'strings' } },
        { name: '--label', description: 'Set metadata for image', args: { name: 'string' } },
        { name: '--output', description: 'Output destination', args: { name: 'string' } },
        { name: '--load', description: 'Load result to docker images' },
        { name: '--push', description: 'Push result to registry' }
      ]
    },
    {
      name: 'rmi',
      description: 'Remove images',
      args: { name: 'image', isVariadic: true, generators: dockerGenerators.images },
      options: [
        { name: ['-f', '--force'], description: 'Force removal' },
        { name: '--no-prune', description: 'Do not delete untagged parents' }
      ]
    },
    {
      name: 'tag',
      description: 'Create tag TARGET_IMAGE that refers to SOURCE_IMAGE',
      args: [
        { name: 'source', generators: dockerGenerators.images },
        { name: 'target' }
      ]
    },
    {
      name: 'save',
      description: 'Save images to tar archive',
      args: { name: 'image', isVariadic: true, generators: dockerGenerators.images },
      options: [
        { name: ['-o', '--output'], description: 'Write to file', args: { name: 'file', template: 'filepaths' } }
      ]
    },
    {
      name: 'load',
      description: 'Load image from tar archive',
      options: [
        { name: ['-i', '--input'], description: 'Read from file', args: { name: 'file', template: 'filepaths' } },
        { name: ['-q', '--quiet'], description: 'Suppress load output' }
      ]
    },
    {
      name: 'import',
      description: 'Import contents from tarball to create image',
      args: [
        { name: 'file|URL|-' },
        { name: 'repository:tag', isOptional: true }
      ],
      options: [
        { name: ['-c', '--change'], description: 'Apply Dockerfile instruction', args: { name: 'string' } },
        { name: ['-m', '--message'], description: 'Set commit message', args: { name: 'string' } },
        { name: '--platform', description: 'Set platform', args: { name: 'string' } }
      ]
    },
    {
      name: 'history',
      description: 'Show history of an image',
      args: { name: 'image', generators: dockerGenerators.images },
      options: [
        { name: '--no-trunc', description: 'Don\'t truncate output' },
        { name: ['-q', '--quiet'], description: 'Only show image IDs' },
        { name: ['-H', '--human'], description: 'Print sizes and dates in human readable format' },
        { name: '--format', description: 'Pretty-print using template', args: { name: 'string' } }
      ]
    },
    {
      name: 'search',
      description: 'Search Docker Hub for images',
      args: { name: 'term' },
      options: [
        { name: '--limit', description: 'Max number of results', args: { name: 'int' } },
        { name: ['-f', '--filter'], description: 'Filter output', args: { name: 'filter' } },
        { name: '--format', description: 'Pretty-print using template', args: { name: 'string' } },
        { name: '--no-trunc', description: 'Don\'t truncate output' }
      ]
    },

    // Volume Commands
    {
      name: 'volume',
      description: 'Manage volumes',
      subcommands: [
        {
          name: 'create',
          description: 'Create volume',
          args: { name: 'name', isOptional: true },
          options: [
            { name: ['-d', '--driver'], description: 'Volume driver', args: { name: 'string' } },
            { name: ['-o', '--opt'], description: 'Driver options', args: { name: 'map' } },
            { name: '--label', description: 'Set metadata', args: { name: 'list' } }
          ]
        },
        {
          name: 'ls',
          description: 'List volumes',
          options: [
            { name: ['-q', '--quiet'], description: 'Only display volume names' },
            { name: ['-f', '--filter'], description: 'Filter output', args: { name: 'filter' } },
            { name: '--format', description: 'Pretty-print using template', args: { name: 'string' } }
          ]
        },
        {
          name: 'inspect',
          description: 'Display volume information',
          args: { name: 'volume', isVariadic: true, generators: dockerGenerators.volumes },
          options: [
            { name: ['-f', '--format'], description: 'Format output', args: { name: 'string' } }
          ]
        },
        {
          name: 'rm',
          description: 'Remove volumes',
          args: { name: 'volume', isVariadic: true, generators: dockerGenerators.volumes },
          options: [
            { name: ['-f', '--force'], description: 'Force removal' }
          ]
        },
        {
          name: 'prune',
          description: 'Remove unused volumes',
          options: [
            { name: ['-f', '--force'], description: 'Do not prompt for confirmation' },
            { name: ['-a', '--all'], description: 'Remove all unused volumes' },
            { name: '--filter', description: 'Provide filter values', args: { name: 'filter' } }
          ]
        }
      ]
    },

    // Network Commands
    {
      name: 'network',
      description: 'Manage networks',
      subcommands: [
        {
          name: 'create',
          description: 'Create network',
          args: { name: 'network' },
          options: [
            { name: ['-d', '--driver'], description: 'Driver', args: { name: 'string', suggestions: s('bridge', 'host', 'overlay', 'macvlan', 'none') } },
            { name: '--subnet', description: 'Subnet in CIDR format', args: { name: 'strings' } },
            { name: '--ip-range', description: 'IP address range', args: { name: 'strings' } },
            { name: '--gateway', description: 'Gateway address', args: { name: 'strings' } },
            { name: '--ipv6', description: 'Enable IPv6' },
            { name: '--internal', description: 'Restrict external access' },
            { name: '--attachable', description: 'Enable manual container attachment' },
            { name: '-o', description: 'Driver options', args: { name: 'map' } },
            { name: '--label', description: 'Set metadata', args: { name: 'list' } }
          ]
        },
        {
          name: 'ls',
          description: 'List networks',
          options: [
            { name: ['-q', '--quiet'], description: 'Only display network IDs' },
            { name: ['-f', '--filter'], description: 'Filter output', args: { name: 'filter' } },
            { name: '--format', description: 'Pretty-print using template', args: { name: 'string' } },
            { name: '--no-trunc', description: 'Don\'t truncate output' }
          ]
        },
        {
          name: 'inspect',
          description: 'Display network information',
          args: { name: 'network', isVariadic: true, generators: dockerGenerators.networks },
          options: [
            { name: ['-f', '--format'], description: 'Format output', args: { name: 'string' } },
            { name: ['-v', '--verbose'], description: 'Verbose output' }
          ]
        },
        {
          name: 'rm',
          description: 'Remove networks',
          args: { name: 'network', isVariadic: true, generators: dockerGenerators.networks },
          options: [
            { name: ['-f', '--force'], description: 'Do not error if network does not exist' }
          ]
        },
        {
          name: 'prune',
          description: 'Remove unused networks',
          options: [
            { name: ['-f', '--force'], description: 'Do not prompt for confirmation' },
            { name: '--filter', description: 'Provide filter values', args: { name: 'filter' } }
          ]
        },
        {
          name: 'connect',
          description: 'Connect container to network',
          args: [
            { name: 'network', generators: dockerGenerators.networks },
            { name: 'container', generators: dockerGenerators.containers }
          ],
          options: [
            { name: '--ip', description: 'IPv4 address', args: { name: 'string' } },
            { name: '--ip6', description: 'IPv6 address', args: { name: 'string' } },
            { name: '--alias', description: 'Network-scoped alias', args: { name: 'strings' } },
            { name: '--link', description: 'Link to another container', args: { name: 'list' } }
          ]
        },
        {
          name: 'disconnect',
          description: 'Disconnect container from network',
          args: [
            { name: 'network', generators: dockerGenerators.networks },
            { name: 'container', generators: dockerGenerators.containers }
          ],
          options: [
            { name: ['-f', '--force'], description: 'Force disconnection' }
          ]
        }
      ]
    },

    // System Commands
    {
      name: 'system',
      description: 'Manage Docker',
      subcommands: [
        { name: 'df', description: 'Show disk usage', options: [{ name: ['-v', '--verbose'], description: 'Show detailed information' }, { name: '--format', description: 'Pretty-print using template', args: { name: 'string' } }] },
        { name: 'events', description: 'Get real time events', options: [{ name: '--since', description: 'Show events since timestamp', args: { name: 'string' } }, { name: '--until', description: 'Show events until timestamp', args: { name: 'string' } }, { name: ['-f', '--filter'], description: 'Filter output', args: { name: 'filter' } }, { name: '--format', description: 'Format the output', args: { name: 'string' } }] },
        { name: 'info', description: 'Display system-wide information', options: [{ name: ['-f', '--format'], description: 'Format output', args: { name: 'string' } }] },
        { name: 'prune', description: 'Remove unused data', options: [{ name: ['-a', '--all'], description: 'Remove all unused images' }, { name: ['-f', '--force'], description: 'Do not prompt for confirmation' }, { name: '--volumes', description: 'Prune volumes' }, { name: '--filter', description: 'Provide filter values', args: { name: 'filter' } }] }
      ]
    },

    // Compose Commands (Docker Compose v2 integrated)
    {
      name: 'compose',
      description: 'Docker Compose commands',
      options: [
        { name: ['-f', '--file'], description: 'Compose file', args: { name: 'file', template: 'filepaths' } },
        { name: ['-p', '--project-name'], description: 'Project name', args: { name: 'name' } },
        { name: '--profile', description: 'Profile to enable', args: { name: 'strings' } },
        { name: '--env-file', description: 'Alternate env file', args: { name: 'string', template: 'filepaths' } }
      ],
      subcommands: [
        { name: 'up', description: 'Create and start containers', options: [{ name: ['-d', '--detach'], description: 'Detached mode' }, { name: '--build', description: 'Build images before starting' }, { name: '--force-recreate', description: 'Recreate containers' }, { name: '--no-build', description: 'Don\'t build images' }, { name: '--no-start', description: 'Don\'t start services' }, { name: '--remove-orphans', description: 'Remove orphan containers' }, { name: '--scale', description: 'Scale service', args: { name: 'SERVICE=NUM' } }, { name: ['-t', '--timeout'], description: 'Shutdown timeout', args: { name: 'int' } }, { name: '--wait', description: 'Wait for services to be healthy' }] },
        { name: 'down', description: 'Stop and remove containers', options: [{ name: ['-v', '--volumes'], description: 'Remove volumes' }, { name: '--rmi', description: 'Remove images', args: { name: 'string', suggestions: s('all', 'local') } }, { name: '--remove-orphans', description: 'Remove orphan containers' }, { name: ['-t', '--timeout'], description: 'Shutdown timeout', args: { name: 'int' } }] },
        { name: 'start', description: 'Start services', args: { name: 'service', isOptional: true, isVariadic: true } },
        { name: 'stop', description: 'Stop services', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: ['-t', '--timeout'], description: 'Shutdown timeout', args: { name: 'int' } }] },
        { name: 'restart', description: 'Restart services', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: ['-t', '--timeout'], description: 'Shutdown timeout', args: { name: 'int' } }] },
        { name: 'ps', description: 'List containers', options: [{ name: ['-a', '--all'], description: 'Show all containers' }, { name: ['-q', '--quiet'], description: 'Only display IDs' }, { name: '--status', description: 'Filter by status', args: { name: 'string' } }, { name: '--format', description: 'Format output', args: { name: 'string' } }] },
        { name: 'logs', description: 'View output from containers', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: ['-f', '--follow'], description: 'Follow log output' }, { name: ['-t', '--timestamps'], description: 'Show timestamps' }, { name: '--tail', description: 'Number of lines', args: { name: 'string' } }, { name: '--since', description: 'Show logs since', args: { name: 'string' } }, { name: '--until', description: 'Show logs until', args: { name: 'string' } }] },
        { name: 'exec', description: 'Execute a command in a running container', args: [{ name: 'service' }, { name: 'command', isVariadic: true }], options: [{ name: ['-d', '--detach'], description: 'Detached mode' }, { name: ['-T', '--no-TTY'], description: 'Disable TTY' }, { name: ['-e', '--env'], description: 'Set environment variables', args: { name: 'KEY=VAL' } }, { name: ['-w', '--workdir'], description: 'Working directory', args: { name: 'string' } }, { name: ['-u', '--user'], description: 'Run as user', args: { name: 'string' } }] },
        { name: 'run', description: 'Run a one-off command', args: [{ name: 'service' }, { name: 'command', isOptional: true, isVariadic: true }], options: [{ name: ['-d', '--detach'], description: 'Detached mode' }, { name: ['-T', '--no-TTY'], description: 'Disable TTY' }, { name: '--rm', description: 'Remove container after exit' }, { name: '--name', description: 'Assign a name', args: { name: 'string' } }, { name: ['-e', '--env'], description: 'Set environment variables', args: { name: 'KEY=VAL' } }, { name: ['-v', '--volume'], description: 'Bind mount a volume', args: { name: 'string' } }, { name: ['-p', '--publish'], description: 'Publish port', args: { name: 'string' } }, { name: ['-w', '--workdir'], description: 'Working directory', args: { name: 'string' } }, { name: ['-u', '--user'], description: 'Run as user', args: { name: 'string' } }, { name: '--no-deps', description: 'Don\'t start dependencies' }] },
        { name: 'build', description: 'Build or rebuild services', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: '--build-arg', description: 'Build argument', args: { name: 'key=val' } }, { name: '--no-cache', description: 'Do not use cache' }, { name: '--pull', description: 'Always pull images' }, { name: ['-m', '--memory'], description: 'Memory limit', args: { name: 'bytes' } }, { name: ['-q', '--quiet'], description: 'Don\'t print anything' }, { name: '--progress', description: 'Progress output type', args: { name: 'string', suggestions: s('auto', 'plain', 'tty') } }] },
        { name: 'pull', description: 'Pull service images', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: ['-q', '--quiet'], description: 'Pull without printing' }, { name: '--ignore-pull-failures', description: 'Ignore pull failures' }, { name: '--include-deps', description: 'Pull dependencies' }] },
        { name: 'push', description: 'Push service images', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: '--ignore-push-failures', description: 'Ignore push failures' }] },
        { name: 'config', description: 'Validate and view compose file', options: [{ name: '--format', description: 'Format output', args: { name: 'string', suggestions: s('yaml', 'json') } }, { name: '--profiles', description: 'Print profile names' }, { name: '--services', description: 'Print service names' }, { name: '--volumes', description: 'Print volume names' }, { name: ['-q', '--quiet'], description: 'Only validate' }] },
        { name: 'images', description: 'List images used by services', options: [{ name: ['-q', '--quiet'], description: 'Only display IDs' }, { name: '--format', description: 'Format output', args: { name: 'string' } }] },
        { name: 'top', description: 'Display running processes', args: { name: 'service', isOptional: true, isVariadic: true } },
        { name: 'events', description: 'Receive real time events', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: '--json', description: 'Output events as JSON' }] },
        { name: 'rm', description: 'Remove stopped containers', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: ['-f', '--force'], description: 'Don\'t ask for confirmation' }, { name: ['-s', '--stop'], description: 'Stop containers first' }, { name: ['-v', '--volumes'], description: 'Remove volumes' }] },
        { name: 'kill', description: 'Kill containers', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: ['-s', '--signal'], description: 'Signal to send', args: { name: 'string' } }] },
        { name: 'pause', description: 'Pause services', args: { name: 'service', isOptional: true, isVariadic: true } },
        { name: 'unpause', description: 'Unpause services', args: { name: 'service', isOptional: true, isVariadic: true } },
        { name: 'port', description: 'Print port binding', args: [{ name: 'service' }, { name: 'port' }], options: [{ name: '--index', description: 'Container index', args: { name: 'int' } }, { name: '--protocol', description: 'Protocol', args: { name: 'string', suggestions: s('tcp', 'udp') } }] },
        { name: 'ls', description: 'List running compose projects', options: [{ name: ['-a', '--all'], description: 'Show all projects' }, { name: ['-q', '--quiet'], description: 'Only display IDs' }, { name: '--format', description: 'Format output', args: { name: 'string', suggestions: s('table', 'json') } }, { name: '--filter', description: 'Filter output', args: { name: 'filter' } }] },
        { name: 'cp', description: 'Copy files between container and filesystem', args: [{ name: 'source' }, { name: 'dest' }], options: [{ name: ['-a', '--archive'], description: 'Archive mode' }, { name: ['-L', '--follow-link'], description: 'Follow symbolic links' }] },
        { name: 'create', description: 'Create containers', args: { name: 'service', isOptional: true, isVariadic: true }, options: [{ name: '--build', description: 'Build images before creating' }, { name: '--force-recreate', description: 'Recreate containers' }, { name: '--no-build', description: 'Don\'t build images' }, { name: '--no-recreate', description: 'Don\'t recreate containers' }] }
      ]
    },

    // Context Commands
    {
      name: 'context',
      description: 'Manage contexts',
      subcommands: [
        { name: 'create', description: 'Create context', args: { name: 'context' }, options: [{ name: '--docker', description: 'Docker endpoint', args: { name: 'string' } }, { name: '--description', description: 'Description', args: { name: 'string' } }, { name: '--from', description: 'Create from existing', args: { name: 'string', generators: dockerGenerators.contexts } }] },
        { name: 'ls', description: 'List contexts', options: [{ name: ['-q', '--quiet'], description: 'Only show names' }, { name: '--format', description: 'Format output', args: { name: 'string' } }] },
        { name: 'rm', description: 'Remove contexts', args: { name: 'context', isVariadic: true, generators: dockerGenerators.contexts }, options: [{ name: ['-f', '--force'], description: 'Force removal' }] },
        { name: 'use', description: 'Set current context', args: { name: 'context', generators: dockerGenerators.contexts } },
        { name: 'inspect', description: 'Display context information', args: { name: 'context', isVariadic: true, generators: dockerGenerators.contexts }, options: [{ name: ['-f', '--format'], description: 'Format output', args: { name: 'string' } }] },
        { name: 'update', description: 'Update context', args: { name: 'context', generators: dockerGenerators.contexts }, options: [{ name: '--docker', description: 'Docker endpoint', args: { name: 'string' } }, { name: '--description', description: 'Description', args: { name: 'string' } }] },
        { name: 'export', description: 'Export context', args: [{ name: 'context', generators: dockerGenerators.contexts }, { name: 'file', isOptional: true, template: 'filepaths' }] },
        { name: 'import', description: 'Import context', args: [{ name: 'context' }, { name: 'file', template: 'filepaths' }] },
        { name: 'show', description: 'Print current context name' }
      ]
    },

    // Buildx Commands
    {
      name: 'buildx',
      description: 'Docker Buildx',
      subcommands: [
        { name: 'build', description: 'Start a build', args: { name: 'path', template: 'folders' }, options: [{ name: ['-t', '--tag'], description: 'Name and tag', args: { name: 'name:tag' } }, { name: ['-f', '--file'], description: 'Dockerfile path', args: { name: 'file', template: 'filepaths' } }, { name: '--build-arg', description: 'Build argument', args: { name: 'var=value' } }, { name: '--target', description: 'Target build stage', args: { name: 'stage' } }, { name: '--no-cache', description: 'Do not use cache' }, { name: '--pull', description: 'Always pull images' }, { name: '--push', description: 'Push image' }, { name: '--load', description: 'Load image' }, { name: '--platform', description: 'Target platforms', args: { name: 'platforms' } }, { name: '--progress', description: 'Progress type', args: { name: 'type', suggestions: s('auto', 'plain', 'tty') } }, { name: '--cache-from', description: 'External cache', args: { name: 'string' } }, { name: '--cache-to', description: 'Cache destination', args: { name: 'string' } }, { name: '--output', description: 'Output destination', args: { name: 'string' } }] },
        { name: 'create', description: 'Create builder instance', args: { name: 'name', isOptional: true }, options: [{ name: '--name', description: 'Builder name', args: { name: 'string' } }, { name: '--driver', description: 'Driver', args: { name: 'string', suggestions: s('docker', 'docker-container', 'kubernetes', 'remote') } }, { name: '--platform', description: 'Platforms', args: { name: 'strings' } }, { name: '--use', description: 'Set as current builder' }, { name: '--bootstrap', description: 'Boot builder' }] },
        { name: 'use', description: 'Set current builder instance', args: { name: 'name' }, options: [{ name: '--default', description: 'Set as default' }, { name: '--global', description: 'Use as global builder' }] },
        { name: 'ls', description: 'List builder instances' },
        { name: 'inspect', description: 'Inspect builder instance', args: { name: 'name', isOptional: true }, options: [{ name: '--bootstrap', description: 'Ensure builder is running' }] },
        { name: 'rm', description: 'Remove builder instance', args: { name: 'name', isVariadic: true }, options: [{ name: '--all-inactive', description: 'Remove all inactive' }, { name: ['-f', '--force'], description: 'Do not prompt' }, { name: '--keep-state', description: 'Keep state' }] },
        { name: 'stop', description: 'Stop builder instance', args: { name: 'name', isOptional: true } },
        { name: 'prune', description: 'Remove build cache', options: [{ name: ['-a', '--all'], description: 'Include internal caches' }, { name: ['-f', '--force'], description: 'Do not prompt' }, { name: '--keep-storage', description: 'Keep cache smaller than', args: { name: 'bytes' } }] },
        { name: 'imagetools', description: 'Commands to work with images', subcommands: [{ name: 'create', description: 'Create new image', args: { name: 'source', isVariadic: true } }, { name: 'inspect', description: 'Show details of image', args: { name: 'name' } }] },
        { name: 'bake', description: 'Build from HCL file', args: { name: 'target', isOptional: true, isVariadic: true }, options: [{ name: ['-f', '--file'], description: 'Build file', args: { name: 'file', template: 'filepaths' } }, { name: '--push', description: 'Push images' }, { name: '--load', description: 'Load images' }, { name: '--no-cache', description: 'Do not use cache' }, { name: '--print', description: 'Print options without building' }] },
        { name: 'du', description: 'Disk usage', options: [{ name: '--filter', description: 'Filter', args: { name: 'filter' } }, { name: '--verbose', description: 'Verbose output' }] },
        { name: 'version', description: 'Show buildx version info' }
      ]
    },

    // Manifest Commands
    {
      name: 'manifest',
      description: 'Manage Docker image manifests',
      subcommands: [
        { name: 'create', description: 'Create manifest list', args: { name: 'manifest', isVariadic: true }, options: [{ name: '--amend', description: 'Amend existing manifest' }, { name: '--insecure', description: 'Allow insecure registry' }] },
        { name: 'annotate', description: 'Add annotations', args: [{ name: 'manifest' }, { name: 'image' }], options: [{ name: '--arch', description: 'Architecture', args: { name: 'string' } }, { name: '--os', description: 'Operating system', args: { name: 'string' } }, { name: '--variant', description: 'Variant', args: { name: 'string' } }] },
        { name: 'inspect', description: 'Display manifest', args: { name: 'manifest' }, options: [{ name: '--insecure', description: 'Allow insecure' }, { name: ['-v', '--verbose'], description: 'Verbose output' }] },
        { name: 'push', description: 'Push manifest list', args: { name: 'manifest' }, options: [{ name: '--insecure', description: 'Allow insecure' }, { name: ['-p', '--purge'], description: 'Remove local copy' }] },
        { name: 'rm', description: 'Delete manifest list', args: { name: 'manifest', isVariadic: true } }
      ]
    },

    // Plugin Commands
    {
      name: 'plugin',
      description: 'Manage plugins',
      subcommands: [
        { name: 'install', description: 'Install plugin', args: { name: 'plugin' }, options: [{ name: '--alias', description: 'Local name', args: { name: 'string' } }, { name: '--disable', description: 'Do not enable' }, { name: '--grant-all-permissions', description: 'Grant permissions' }] },
        { name: 'ls', description: 'List plugins', options: [{ name: ['-q', '--quiet'], description: 'Only display IDs' }, { name: '--format', description: 'Format output', args: { name: 'string' } }, { name: '--no-trunc', description: 'Don\'t truncate' }] },
        { name: 'rm', description: 'Remove plugins', args: { name: 'plugin', isVariadic: true }, options: [{ name: ['-f', '--force'], description: 'Force removal' }] },
        { name: 'enable', description: 'Enable plugin', args: { name: 'plugin' }, options: [{ name: '--timeout', description: 'Timeout', args: { name: 'int' } }] },
        { name: 'disable', description: 'Disable plugin', args: { name: 'plugin' }, options: [{ name: ['-f', '--force'], description: 'Force disable' }] },
        { name: 'inspect', description: 'Display plugin information', args: { name: 'plugin', isVariadic: true }, options: [{ name: ['-f', '--format'], description: 'Format output', args: { name: 'string' } }] },
        { name: 'upgrade', description: 'Upgrade plugin', args: [{ name: 'plugin' }, { name: 'remote', isOptional: true }], options: [{ name: '--skip-remote-check', description: 'Skip remote check' }, { name: '--grant-all-permissions', description: 'Grant permissions' }] },
        { name: 'create', description: 'Create plugin from rootfs', args: [{ name: 'plugin' }, { name: 'path', template: 'folders' }], options: [{ name: '--compress', description: 'Compress context' }] },
        { name: 'push', description: 'Push plugin to registry', args: { name: 'plugin' }, options: [{ name: '--disable-content-trust', description: 'Skip signing' }] },
        { name: 'set', description: 'Change settings for plugin', args: [{ name: 'plugin' }, { name: 'key=value', isVariadic: true }] }
      ]
    },

    // Trust Commands
    {
      name: 'trust',
      description: 'Manage trust on Docker images',
      subcommands: [
        { name: 'inspect', description: 'Return trust information', args: { name: 'image', isVariadic: true }, options: [{ name: '--pretty', description: 'Pretty-print output' }] },
        { name: 'revoke', description: 'Remove trust for an image', args: { name: 'image' }, options: [{ name: ['-y', '--yes'], description: 'Skip confirmation' }] },
        { name: 'sign', description: 'Sign an image', args: { name: 'image' }, options: [{ name: '--local', description: 'Sign a locally tagged image' }] },
        { name: 'key', description: 'Manage keys for signing', subcommands: [{ name: 'generate', description: 'Generate a signing key', args: { name: 'name' } }, { name: 'load', description: 'Load a private key', args: { name: 'keyfile', template: 'filepaths' }, options: [{ name: '--name', description: 'Key name', args: { name: 'string' } }] }] },
        { name: 'signer', description: 'Manage signers', subcommands: [{ name: 'add', description: 'Add a signer', args: [{ name: 'name' }, { name: 'repository', isVariadic: true }], options: [{ name: '--key', description: 'Key file', args: { name: 'list', template: 'filepaths' } }] }, { name: 'remove', description: 'Remove a signer', args: [{ name: 'name' }, { name: 'repository', isVariadic: true }], options: [{ name: ['-f', '--force'], description: 'Do not prompt' }] }] }
      ]
    },

    // Login/Logout
    {
      name: 'login',
      description: 'Log in to a registry',
      args: { name: 'server', isOptional: true },
      options: [
        { name: ['-u', '--username'], description: 'Username', args: { name: 'string' } },
        { name: ['-p', '--password'], description: 'Password', args: { name: 'string' } },
        { name: '--password-stdin', description: 'Read password from stdin' }
      ]
    },
    {
      name: 'logout',
      description: 'Log out from a registry',
      args: { name: 'server', isOptional: true }
    },

    // Info Commands
    {
      name: 'version',
      description: 'Show Docker version information',
      options: [
        { name: ['-f', '--format'], description: 'Format output', args: { name: 'string' } }
      ]
    },
    {
      name: 'info',
      description: 'Display system-wide information',
      options: [
        { name: ['-f', '--format'], description: 'Format output', args: { name: 'string' } }
      ]
    },
    {
      name: 'events',
      description: 'Get real time events from the server',
      options: [
        { name: '--since', description: 'Show since timestamp', args: { name: 'string' } },
        { name: '--until', description: 'Show until timestamp', args: { name: 'string' } },
        { name: ['-f', '--filter'], description: 'Filter output', args: { name: 'filter' } },
        { name: '--format', description: 'Format the output', args: { name: 'string' } }
      ]
    }
  ],
  options: [
    { name: ['-D', '--debug'], description: 'Enable debug mode' },
    { name: ['-H', '--host'], description: 'Daemon socket to connect to', args: { name: 'list' } },
    { name: ['-l', '--log-level'], description: 'Set logging level', args: { name: 'string', suggestions: s('debug', 'info', 'warn', 'error', 'fatal') } },
    { name: '--tls', description: 'Use TLS' },
    { name: '--tlscacert', description: 'CA certificate', args: { name: 'string', template: 'filepaths' } },
    { name: '--tlscert', description: 'TLS certificate', args: { name: 'string', template: 'filepaths' } },
    { name: '--tlskey', description: 'TLS key', args: { name: 'string', template: 'filepaths' } },
    { name: '--tlsverify', description: 'Verify TLS remote daemon' },
    { name: ['-c', '--context'], description: 'Name of context to use', args: { name: 'string', generators: dockerGenerators.contexts } },
    { name: ['-v', '--version'], description: 'Print version information' },
    { name: '--config', description: 'Location of client config files', args: { name: 'string', template: 'folders' } }
  ]
};
