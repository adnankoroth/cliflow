#!/usr/bin/env node
import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputFile = join(rootDir, 'build-output.log');

let output = [];

function log(msg) {
  output.push(msg);
  console.log(msg);
}

function runCommand(cmd) {
  try {
    const result = execSync(cmd, { 
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { success: true, output: result };
  } catch (err) {
    return { success: false, output: err.stdout + '\n' + err.stderr };
  }
}

async function main() {
  log('=== CLIFlow Build ===');
  log('');
  
  // Ensure build directories
  mkdirSync(join(rootDir, 'build/daemon'), { recursive: true });
  mkdirSync(join(rootDir, 'build/bin'), { recursive: true });
  log('Created build directories');
  
  // Build main src
  log('Building src/...');
  const srcResult = runCommand('npx tsc');
  log(srcResult.success ? '✓ src/ built' : '✗ src/ build failed');
  if (srcResult.output) log(srcResult.output);
  
  // Build daemon
  log('Building daemon/...');
  const daemonResult = runCommand('npx tsc --project daemon/tsconfig.json');
  log(daemonResult.success ? '✓ daemon/ built' : '✗ daemon/ build failed');
  if (daemonResult.output) log(daemonResult.output);
  
  // List build output
  log('\nBuild files:');
  const listResult = runCommand('ls -la build/daemon/ 2>&1 || echo "daemon dir missing"');
  log(listResult.output);
  
  // Write output to file
  writeFileSync(outputFile, output.join('\n'));
  log('\nOutput written to: build-output.log');
}

main().catch(err => {
  log('Error: ' + err.message);
  writeFileSync(outputFile, output.join('\n'));
});
