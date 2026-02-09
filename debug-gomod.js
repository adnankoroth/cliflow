import { CompletionEngine } from './build/engine/completion-engine.js';

async function debugGoMod() {
  const engine = new CompletionEngine();
  
  // Test case: "go mod download " should show arguments, not subcommands
  const context = {
    tokens: ['go', 'mod', 'download', ''],
    cursorPosition: 17,
    currentWorkingDirectory: '/Users/adnankoroth/go/cliflow'
  };
  
  console.log('Testing go mod download:');
  console.log('Context:', JSON.stringify(context, null, 2));
  
  try {
    const completions = await engine.getCompletions(context);
    console.log('Completions found:', completions.length);
    if (completions.length > 0) {
      console.log('First few completions:');
      completions.slice(0, 3).forEach(c => {
        console.log(`  ${c.type}: ${c.name} - ${c.description || 'N/A'}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugGoMod();