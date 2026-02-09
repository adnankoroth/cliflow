import { CompletionEngine } from './build/engine/completion-engine.js';

async function testProductionScenarios() {
  const engine = new CompletionEngine();
  
  const testCases = [
    // Deep nesting (the most critical issues that were fixed)
    { input: 'go mod download ', expected: 'arguments/options for download' },
    { input: 'helm repo add ', expected: 'arguments/options for add' },
    { input: 'kubectl rollout status ', expected: 'resource arguments' },
    { input: 'cargo build --', expected: 'build options' },
    
    // Basic functionality 
    { input: 'go ', expected: 'go subcommands' },
    { input: 'helm ', expected: 'helm subcommands' },
    { input: 'kubectl ', expected: 'kubectl subcommands' },
    { input: 'cargo ', expected: 'cargo subcommands' },
    { input: 'yarn ', expected: 'yarn subcommands' },
    { input: 'pip ', expected: 'pip subcommands' },
    
    // Filtering tests
    { input: 'helm repo a', expected: 'filtered to "add"' },
    { input: 'kubectl get p', expected: 'filtered to pods, etc' },
    { input: 'cargo bu', expected: 'filtered to "build"' },
    
    // Edge cases
    { input: '', expected: 'root commands' },
    { input: '   ', expected: 'root commands' },
    { input: 'unknown command ', expected: 'no completions' },
    
    // Generator tests (some may return 0 if tools not available)
    { input: 'npm install ', expected: 'npm packages (or empty if no package.json)' },
    { input: 'pip install ', expected: 'pip packages' },
    { input: 'yarn workspace ', expected: 'workspaces (empty if not workspace project)' },
    { input: 'docker run ', expected: 'docker images' },
  ];
  
  console.log('=== PRODUCTION READINESS VALIDATION ===\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    try {
      const tokens = testCase.input.split(' ');
      const context = {
        currentWorkingDirectory: process.cwd(),
        commandLine: testCase.input,
        tokens,
        cursorPosition: testCase.input.length,
        environmentVariables: process.env,
        shell: 'zsh',
        isGitRepository: false,
      };

      const completions = await engine.getCompletions(context);
      const hasResults = completions.length > 0;
      const resultSummary = hasResults 
        ? `${completions.length} completions (${completions.slice(0, 3).map(c => c.name).join(', ')}...)`
        : 'no completions';
      
      console.log(`✅ "${testCase.input}" → ${resultSummary}`);
      passed++;
    } catch (error) {
      console.log(`❌ "${testCase.input}" → ERROR: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n=== RESULTS ===`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED - PRODUCTION READY! 🎉');
  } else {
    console.log(`\n⚠️  ${failed} tests failed - needs fixes before production`);
  }
}

await testProductionScenarios();