import { CompletionEngine } from './build/engine/completion-engine.js';

async function testYarnWorkspace() {
  const engine = new CompletionEngine();
  const input = 'yarn workspace ';
  const tokens = input.split(' ');
  
  console.log('=== Testing yarn workspace ===');
  
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
    console.log(`Found ${completions.length} completions:`);
    completions.slice(0, 10).forEach(c => 
      console.log(`  - ${c.name} (${c.type}) ${c.description ? '- ' + c.description : ''}`)
    );
  } catch (error) {
    console.error('Error:', error.message);
  }
}

await testYarnWorkspace();