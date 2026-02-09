// expo - Expo CLI
import { CompletionSpec } from '../types.js';

export const expoSpec: CompletionSpec = {
  name: 'expo',
  description: 'Expo CLI',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-V', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'start', description: 'Start development server', options: [{ name: '--web', description: 'Start for web' }, { name: '--android', description: 'Start for Android' }, { name: '--ios', description: 'Start for iOS' }, { name: ['-c', '--clear'], description: 'Clear cache' }, { name: ['-p', '--port'], description: 'Port', args: { name: 'port' } }] },
    { name: 'run', description: 'Run on a device', subcommands: [
      { name: 'android', description: 'Run on Android' },
      { name: 'ios', description: 'Run on iOS' },
      { name: 'web', description: 'Run on Web' },
    ] },
    { name: 'build', description: 'Build a project', subcommands: [
      { name: 'android', description: 'Build Android app' },
      { name: 'ios', description: 'Build iOS app' },
      { name: 'web', description: 'Build web app' },
    ] },
    { name: 'prebuild', description: 'Prebuild project' },
    { name: 'config', description: 'Show config' },
    { name: 'whoami', description: 'Show logged-in user' },
    { name: 'login', description: 'Log in' },
    { name: 'logout', description: 'Log out' },
  ],
};
