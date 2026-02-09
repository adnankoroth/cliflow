// rustup - Rust toolchain installer
import { CompletionSpec } from '../types.js';

export const rustupSpec: CompletionSpec = {
  name: 'rustup',
  description: 'Rust toolchain installer',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-V', '--version'], description: 'Show version' },
    { name: ['-v', '--verbose'], description: 'Verbose output' },
    { name: ['-q', '--quiet'], description: 'Quiet output' },
  ],
  subcommands: [
    { name: 'show', description: 'Show current toolchain info' },
    { name: 'update', description: 'Update Rust toolchains', args: { name: 'toolchain', isOptional: true } },
    { name: 'default', description: 'Set default toolchain', args: { name: 'toolchain' } },
    {
      name: 'toolchain',
      description: 'Manage toolchains',
      subcommands: [
        { name: 'install', description: 'Install a toolchain', args: { name: 'toolchain', isVariadic: true } },
        { name: 'uninstall', description: 'Uninstall a toolchain', args: { name: 'toolchain', isVariadic: true } },
        { name: 'list', description: 'List toolchains' },
        { name: 'link', description: 'Link custom toolchain', args: [{ name: 'name' }, { name: 'path', template: 'folders' }] },
      ],
    },
    {
      name: 'component',
      description: 'Manage components',
      subcommands: [
        { name: 'add', description: 'Add component', args: { name: 'component', isVariadic: true } },
        { name: 'remove', description: 'Remove component', args: { name: 'component', isVariadic: true } },
        { name: 'list', description: 'List components' },
      ],
    },
    {
      name: 'target',
      description: 'Manage targets',
      subcommands: [
        { name: 'add', description: 'Add target', args: { name: 'target', isVariadic: true } },
        { name: 'remove', description: 'Remove target', args: { name: 'target', isVariadic: true } },
        { name: 'list', description: 'List targets' },
      ],
    },
    { name: 'run', description: 'Run a command with a toolchain', args: [{ name: 'toolchain' }, { name: 'command', isOptional: true, isVariadic: true }] },
    { name: 'which', description: 'Show path to a Rust tool', args: { name: 'command' } },
    { name: 'doc', description: 'Open documentation', options: [{ name: '--book', description: 'Open The Book' }] },
    {
      name: 'self',
      description: 'Manage rustup itself',
      subcommands: [
        { name: 'update', description: 'Update rustup' },
        { name: 'uninstall', description: 'Uninstall rustup' },
      ],
    },
    { name: 'completions', description: 'Generate shell completions', args: { name: 'shell', suggestions: [{ name: 'bash' }, { name: 'fish' }, { name: 'zsh' }, { name: 'powershell' }] } },
  ],
};
