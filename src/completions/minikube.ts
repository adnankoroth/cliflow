// minikube - Local Kubernetes
import { CompletionSpec } from '../types.js';

export const minikubeSpec: CompletionSpec = {
  name: 'minikube',
  description: 'Run a local Kubernetes cluster',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--v'], description: 'Log verbosity', args: { name: 'level' } },
    { name: '--profile', description: 'Profile name', args: { name: 'profile' } },
  ],
  subcommands: [
    {
      name: 'start',
      description: 'Start a cluster',
      options: [
        { name: '--driver', description: 'Driver', args: { name: 'driver' } },
        { name: '--cpus', description: 'Number of CPUs', args: { name: 'cpus' } },
        { name: '--memory', description: 'Memory (MB)', args: { name: 'mb' } },
        { name: '--disk-size', description: 'Disk size', args: { name: 'size' } },
        { name: '--kubernetes-version', description: 'Kubernetes version', args: { name: 'version' } },
        { name: '--container-runtime', description: 'Container runtime', args: { name: 'runtime', suggestions: [{ name: 'docker' }, { name: 'containerd' }, { name: 'cri-o' }] } },
        { name: '--nodes', description: 'Number of nodes', args: { name: 'count' } },
        { name: '--addons', description: 'Enable addons', args: { name: 'addons', isVariadic: true } },
        { name: '--mount', description: 'Mount host directory' },
        { name: '--mount-string', description: 'Mount string', args: { name: 'spec' } },
      ],
    },
    { name: 'stop', description: 'Stop a running cluster' },
    { name: 'delete', description: 'Delete a cluster' },
    { name: 'status', description: 'Get cluster status' },
    { name: 'ip', description: 'Get cluster IP' },
    { name: 'dashboard', description: 'Open dashboard', options: [{ name: '--url', description: 'Print URL only' }] },
    {
      name: 'service',
      description: 'Get URL of a service',
      options: [{ name: '--url', description: 'Print URL only' }],
      args: [{ name: 'service' }, { name: 'namespace', isOptional: true }],
    },
    {
      name: 'addons',
      description: 'Manage addons',
      subcommands: [
        { name: 'list', description: 'List addons' },
        { name: 'enable', description: 'Enable addon', args: { name: 'addon' } },
        { name: 'disable', description: 'Disable addon', args: { name: 'addon' } },
      ],
    },
    { name: 'docker-env', description: 'Set up Docker environment' },
    { name: 'ssh', description: 'Log into the VM' },
    { name: 'logs', description: 'Show logs', options: [{ name: '--follow', description: 'Follow logs' }] },
    { name: 'config', description: 'Modify config', args: { name: 'property', isOptional: true } },
    { name: 'cache', description: 'Manage cached images' },
    { name: 'profile', description: 'Manage profiles' },
    { name: 'update-context', description: 'Update kubeconfig context' },
    { name: 'mount', description: 'Mount host path', args: [{ name: 'source' }, { name: 'target' }] },
  ],
};
