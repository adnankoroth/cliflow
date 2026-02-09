// Quick script to compile daemon
import { execSync } from 'child_process';
import { mkdirSync } from 'fs';

try {
  mkdirSync('./build/daemon', { recursive: true });
  console.log('Created build/daemon directory');
  
  const result = execSync('npx tsc -p daemon/tsconfig.json', { 
    encoding: 'utf8',
    stdio: 'pipe' 
  });
  console.log('TypeScript compilation successful!');
  if (result) console.log(result);
} catch (err) {
  console.error('Compilation failed:', err.stdout || err.stderr || err.message);
  process.exit(1);
}
