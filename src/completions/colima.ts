// colima - Container runtimes on macOS
import { CompletionSpec } from '../types.js';

export const colimaSpec: CompletionSpec = {
  name: 'colima',
  description: 'Container runtimes on macOS with Lima',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--verbose'], description: 'Verbose output' },
    { name: '--profile', description: 'Profile name', args: { name: 'profile' } },
  ],
  subcommands: [
    {
      name: 'start',
      description: 'Start Colima',
      options: [
        { name: '--cpu', description: 'Number of CPUs', args: { name: 'count' } },
        { name: '--memory', description: 'Memory (GB)', args: { name: 'gb' } },
        { name: '--disk', description: 'Disk size (GB)', args: { name: 'gb' } },
        { name: '--arch', description: 'CPU architecture', args: { name: 'arch', suggestions: [{ name: 'x86_64' }, { name: 'aarch64' }] } },
        { name: '--vm-type', description: 'VM type', args: { name: 'type', suggestions: [{ name: 'qemu' }, { name: 'vz' }] } },
        { name: '--runtime', description: 'Container runtime', args: { name: 'runtime', suggestions: [{ name: 'docker' }, { name: 'containerd' }] } },
        { name: '--kubernetes', description: 'Enable Kubernetes' },
        { name: '--kubernetes-version', description: 'Kubernetes version', args: { name: 'version' } },
        { name: '--mount', description: 'Mount directory', args: { name: 'mount' } },
        { name: '--ssh-config', description: 'Write ssh config file', args: { name: 'file', template: 'filepaths' } },
      ],
    },
    { name: 'stop', description: 'Stop Colima' },
    { name: 'restart', description: 'Restart Colima' },
    { name: 'status', description: 'Show status' },
    { name: 'list', description: 'List profiles' },
    { name: 'delete', description: 'Delete profile' },
    { name: 'ssh', description: 'SSH into Colima VM' },
    { name: 'shell', description: 'Open shell in VM' },
    { name: 'nerdctl', description: 'Run nerdctl with containerd', args: { name: 'args', isVariadic: true, isOptional: true } },
  ],
};
