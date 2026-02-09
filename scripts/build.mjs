#!/usr/bin/env node
// Build script for CLIFlow components
import { execSync, spawn } from 'child_process';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function runCommand(cmd, description) {
  console.log(`\n📦 ${description}...`);
  try {
    const result = execSync(cmd, { 
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    if (result) console.log(result);
    console.log(`✓ ${description} complete`);
    return true;
  } catch (err) {
    console.error(`✗ ${description} failed:`);
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    return false;
  }
}

async function main() {
  console.log('🔨 CLIFlow Build Script\n');
  
  // Ensure build directories exist
  mkdirSync(join(rootDir, 'build/daemon'), { recursive: true });
  mkdirSync(join(rootDir, 'build/bin'), { recursive: true });
  
  // Build main src
  if (!runCommand('npx tsc', 'Building src/')) {
    console.log('Main build failed, continuing...');
  }
  
  // Build daemon
  if (!runCommand('npx tsc --project daemon/tsconfig.json', 'Building daemon/')) {
    console.log('Daemon build failed');
  }
  
  // Check what was built
  console.log('\n📂 Build output:');
  runCommand('find build -name "*.js" | head -20', 'Listing built files');
}

main().catch(console.error);
