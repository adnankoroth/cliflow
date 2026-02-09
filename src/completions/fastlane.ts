// fastlane - iOS/Android automation
import { CompletionSpec } from '../types.js';

export const fastlaneSpec: CompletionSpec = {
  name: 'fastlane',
  description: 'iOS/Android automation',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: ['-v', '--version'], description: 'Show version' },
  ],
  subcommands: [
    { name: 'init', description: 'Initialize fastlane' },
    { name: 'install', description: 'Install fastlane' },
    { name: 'update_fastlane', description: 'Update fastlane' },
    { name: 'run', description: 'Run an action', args: { name: 'action', isOptional: true, isVariadic: true } },
    { name: 'lanes', description: 'List lanes' },
    { name: 'gym', description: 'Build and sign iOS app' },
    { name: 'scan', description: 'Run tests' },
    { name: 'match', description: 'Manage certificates' },
    { name: 'deliver', description: 'Upload screenshots and metadata' },
    { name: 'pilot', description: 'Upload to TestFlight' },
  ],
};
