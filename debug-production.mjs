import { CompletionEngine } from './build/engine/completion-engine.js';

async function testCompletion(input) {
  const engine = new CompletionEngine();
  
  const tokens = input.split(' ');
  
  console.log('\n=== Testing:', JSON.stringify(input), '===');
  console.log('Tokens:', JSON.stringify(tokens));
  
  const context = {
    currentWorkingDirectory: process.cwd(),
    commandLine: input,
    tokens,
    cursorPosition: input.length,
    environmentVariables: process.env,
    shell: 'zsh',
    isGitRepository: false,
  };

  try {
    const completions = await engine.getCompletions(context);
    console.log('Completions found:', completions.length);
    console.log('First 10:', completions.slice(0, 10).map(c => `${c.name} (${c.type})`));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test critical production scenarios
console.log('=== PRODUCTION READINESS TESTS ===');

// Deep nesting tests
await testCompletion('go mod download ');
await testCompletion('helm repo add ');
await testCompletion('kubectl rollout status ');
await testCompletion('cargo build --');
await testCompletion('yarn workspace ');

// Edge cases
await testCompletion('go ');
await testCompletion('helm ');
await testCompletion('kubectl ');
await testCompletion('cargo ');
await testCompletion('yarn ');

// Unknown commands
await testCompletion('unknown command ');
await testCompletion('');
await testCompletion('   ');