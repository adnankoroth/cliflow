// dbt - Data build tool
import { CompletionSpec } from '../types.js';

const dbtCommonOptions = [
  { name: ['-h', '--help'], description: 'Show help' },
  { name: ['--profiles-dir'], description: 'Profiles directory', args: { name: 'dir', template: 'folders' } },
  { name: ['-t', '--target'], description: 'Target profile', args: { name: 'target' } },
  { name: ['--select'], description: 'Select resources', args: { name: 'selector' } },
  { name: ['--exclude'], description: 'Exclude resources', args: { name: 'selector' } },
];

export const dbtSpec: CompletionSpec = {
  name: 'dbt',
  description: 'Data build tool',
  options: dbtCommonOptions,
  subcommands: [
    { name: 'build', description: 'Build models', options: dbtCommonOptions },
    { name: 'run', description: 'Run models', options: dbtCommonOptions },
    { name: 'test', description: 'Test models', options: dbtCommonOptions },
    { name: 'seed', description: 'Load seed data', options: dbtCommonOptions },
    { name: 'snapshot', description: 'Run snapshots', options: dbtCommonOptions },
    { name: 'compile', description: 'Compile models', options: dbtCommonOptions },
    { name: 'deps', description: 'Install dependencies', options: dbtCommonOptions },
    { name: 'clean', description: 'Clean project', options: dbtCommonOptions },
    { name: 'debug', description: 'Debug configuration', options: dbtCommonOptions },
    { name: 'list', description: 'List resources', options: dbtCommonOptions },
    { name: 'docs', description: 'Generate/serve docs', subcommands: [
      { name: 'generate', description: 'Generate docs', options: dbtCommonOptions },
      { name: 'serve', description: 'Serve docs', options: dbtCommonOptions },
    ] },
  ],
};
