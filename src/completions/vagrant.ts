// vagrant - Development environments made easy
import { CompletionSpec } from '../types.js';

export const vagrantSpec: CompletionSpec = {
  name: 'vagrant',
  description: 'Manage virtualized development environments',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    {
      name: 'init',
      description: 'Initialize a new Vagrant environment',
      options: [
        { name: '--minimal', description: 'Minimal Vagrantfile' },
        { name: '--output', description: 'Output file', args: { name: 'file', template: 'filepaths' } },
      ],
      args: [{ name: 'box', description: 'Box name', isOptional: true }, { name: 'url', description: 'Box URL', isOptional: true }],
    },
    {
      name: 'up',
      description: 'Start and provision the environment',
      options: [
        { name: '--provider', description: 'Provider name', args: { name: 'provider' } },
        { name: '--provision', description: 'Enable provisioning' },
        { name: '--no-provision', description: 'Disable provisioning' },
        { name: '--destroy-on-error', description: 'Destroy on error' },
        { name: '--parallel', description: 'Parallel up' },
      ],
      args: { name: 'machine', description: 'Machine name', isOptional: true },
    },
    { name: 'halt', description: 'Stop the environment', args: { name: 'machine', isOptional: true } },
    {
      name: 'reload',
      description: 'Restart the environment',
      options: [
        { name: '--provision', description: 'Enable provisioning' },
        { name: '--no-provision', description: 'Disable provisioning' },
      ],
      args: { name: 'machine', isOptional: true },
    },
    { name: 'suspend', description: 'Suspend the environment', args: { name: 'machine', isOptional: true } },
    { name: 'resume', description: 'Resume a suspended environment', args: { name: 'machine', isOptional: true } },
    {
      name: 'destroy',
      description: 'Stop and delete all traces of the environment',
      options: [
        { name: ['-f', '--force'], description: 'Force destroy' },
        { name: '--parallel', description: 'Destroy in parallel' },
      ],
      args: { name: 'machine', isOptional: true },
    },
    { name: 'status', description: 'Show status', args: { name: 'machine', isOptional: true } },
    {
      name: 'ssh',
      description: 'SSH into a running machine',
      options: [
        { name: ['-c', '--command'], description: 'Execute command', args: { name: 'command' } },
      ],
      args: { name: 'machine', isOptional: true },
    },
    { name: 'ssh-config', description: 'Output SSH config', args: { name: 'machine', isOptional: true } },
    {
      name: 'provision',
      description: 'Run provisioners',
      options: [
        { name: '--provision-with', description: 'Provisioners to run', args: { name: 'list' } },
      ],
      args: { name: 'machine', isOptional: true },
    },
    {
      name: 'box',
      description: 'Manage boxes',
      subcommands: [
        { name: 'add', description: 'Add a box', args: { name: 'name', isOptional: true } },
        { name: 'list', description: 'List boxes' },
        { name: 'remove', description: 'Remove a box', args: { name: 'name' } },
        { name: 'update', description: 'Update boxes', args: { name: 'name', isOptional: true } },
        { name: 'repackage', description: 'Repackage a box', args: [{ name: 'name' }, { name: 'provider' }, { name: 'version', isOptional: true }] },
      ],
    },
    {
      name: 'plugin',
      description: 'Manage plugins',
      subcommands: [
        { name: 'install', description: 'Install plugin', args: { name: 'name', isVariadic: true } },
        { name: 'list', description: 'List plugins' },
        { name: 'update', description: 'Update plugins', args: { name: 'name', isOptional: true } },
        { name: 'uninstall', description: 'Uninstall plugin', args: { name: 'name', isVariadic: true } },
      ],
    },
    {
      name: 'snapshot',
      description: 'Manage snapshots',
      subcommands: [
        { name: 'save', description: 'Save snapshot', args: [{ name: 'machine', isOptional: true }, { name: 'name' }] },
        { name: 'list', description: 'List snapshots', args: { name: 'machine', isOptional: true } },
        { name: 'restore', description: 'Restore snapshot', args: [{ name: 'machine', isOptional: true }, { name: 'name' }] },
        { name: 'delete', description: 'Delete snapshot', args: [{ name: 'machine', isOptional: true }, { name: 'name' }] },
      ],
    },
    { name: 'global-status', description: 'Show global status' },
    { name: 'validate', description: 'Validate Vagrantfile' },
    { name: 'version', description: 'Show version' },
  ],
};
