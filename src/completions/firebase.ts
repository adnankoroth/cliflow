// firebase - Firebase CLI
import { CompletionSpec } from '../types.js';

export const firebaseSpec: CompletionSpec = {
  name: 'firebase',
  description: 'Firebase CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-V', '--version'], description: 'Show version' },
    { name: ['-P', '--project'], description: 'Select project', args: { name: 'project' } },
    { name: '--json', description: 'JSON output' },
    { name: '--token', description: 'Auth token', args: { name: 'token' } },
  ],
  subcommands: [
    { name: 'login', description: 'Authenticate to Firebase' },
    { name: 'logout', description: 'Log out of Firebase' },
    { name: 'init', description: 'Initialize a Firebase project' },
    { name: 'deploy', description: 'Deploy to Firebase', options: [{ name: ['-m', '--message'], description: 'Deployment message', args: { name: 'message' } }, { name: '--only', description: 'Only deploy these targets', args: { name: 'targets' } }, { name: '--except', description: 'Exclude targets', args: { name: 'targets' } }] },
    { name: 'serve', description: 'Serve locally', options: [{ name: '--only', description: 'Only serve targets', args: { name: 'targets' } }, { name: '--port', description: 'Port', args: { name: 'port' } }] },
    { name: 'emulators', description: 'Manage emulators', subcommands: [
      { name: 'start', description: 'Start emulators' },
      { name: 'stop', description: 'Stop emulators' },
    ] },
    { name: 'projects', description: 'Manage projects', subcommands: [
      { name: 'list', description: 'List projects' },
      { name: 'create', description: 'Create project', args: { name: 'name' } },
      { name: 'addfirebase', description: 'Add Firebase to GCP project', args: { name: 'project' } },
    ] },
    { name: 'functions', description: 'Manage Cloud Functions', subcommands: [
      { name: 'shell', description: 'Start functions shell' },
      { name: 'log', description: 'View function logs', args: { name: 'name', isOptional: true } },
    ] },
  ],
};
