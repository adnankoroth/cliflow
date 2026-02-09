#!/usr/bin/env node
/**
 * Build standalone executables for CLIFlow
 * Uses `pkg` to compile Node.js app into native binaries
 * 
 * Output: Single binary with no runtime dependencies
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const TARGETS = [
  { name: 'macos-arm64', pkg: 'node20-macos-arm64' },
  { name: 'macos-x64', pkg: 'node20-macos-x64' },
  { name: 'linux-x64', pkg: 'node20-linux-x64' },
  { name: 'linux-arm64', pkg: 'node20-linux-arm64' },
];

async function build() {
  console.log('🔨 Building CLIFlow standalone binaries...\n');

  // Ensure dist directory
  if (!existsSync(DIST)) {
    mkdirSync(DIST, { recursive: true });
  }

  // Build TypeScript first
  console.log('📦 Compiling TypeScript...');
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

  // Install pkg if not present
  try {
    execSync('which pkg', { stdio: 'pipe' });
  } catch {
    console.log('📥 Installing pkg...');
    execSync('npm install -g pkg', { stdio: 'inherit' });
  }

  // Build for each target
  for (const target of TARGETS) {
    console.log(`\n🎯 Building for ${target.name}...`);
    
    const outputName = `cliflow-${target.name}${target.name.includes('win') ? '.exe' : ''}`;
    const outputPath = join(DIST, outputName);
    
    try {
      execSync(
        `pkg build/bin/cliflow.js ` +
        `--target ${target.pkg} ` +
        `--output ${outputPath} ` +
        `--compress GZip`,
        { cwd: ROOT, stdio: 'inherit' }
      );
      
      console.log(`   ✓ Created ${outputName}`);
    } catch (err) {
      console.error(`   ✗ Failed to build ${target.name}`);
    }
  }

  // Copy shell integrations
  console.log('\n📋 Copying shell integrations...');
  const shellDist = join(DIST, 'shell-integration');
  mkdirSync(shellDist, { recursive: true });
  cpSync(join(ROOT, 'shell-integration'), shellDist, { recursive: true });

  // Copy completion specs
  console.log('📋 Copying completion specs...');
  const specsDist = join(DIST, 'completions');
  mkdirSync(specsDist, { recursive: true });
  cpSync(join(ROOT, 'build', 'completions'), specsDist, { recursive: true });

  console.log('\n✅ Build complete! Binaries in ./dist/');
  console.log('\nTo create releases:');
  console.log('  cd dist && tar -czvf cliflow-macos-arm64.tar.gz cliflow-macos-arm64 shell-integration completions');
}

build().catch(console.error);
