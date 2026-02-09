import { CompletionEngine } from './build/engine/completion-engine.js';

async function testSingle(input) {
  const engine = new CompletionEngine();
  const tokens = input.split(' ');
  
  console.log(`\n=== Testing: "${input}" ===`);
  
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
    console.log(`✅ SUCCESS: ${completions.length} completions found`);
    console.log('First 5:', completions.slice(0, 5).map(c => `${c.name} (${c.type})`));
    return true;
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    return false;
  }
}

// Test the critical deep nesting issues
console.log('=== DEEP NESTING TESTS ===');
await testSingle('go mod download ');
await testSingle('helm repo add ');
await testSingle('kubectl rollout status ');