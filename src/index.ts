// Main entry point for CLIFlow
export { CompletionEngine } from './engine/completion-engine.js';
export * from './types.js';

// Re-export completion specs
export { gitSpec } from './completions/git.js';
export { dockerSpec } from './completions/docker.js';
export { npmSpec } from './completions/npm.js';
export { awsSpec } from './completions/aws.js';
export { kubectlSpec } from './completions/kubectl.js';
export { terraformSpec } from './completions/terraform.js';
export { helmSpec } from './completions/helm.js';
export { dockerComposeSpec } from './completions/docker-compose.js';
export { cargoSpec } from './completions/cargo.js';
export { goSpec } from './completions/go.js';
export { pipSpec } from './completions/pip.js';
export { yarnSpec } from './completions/yarn.js';
export { ghSpec } from './completions/gh.js';