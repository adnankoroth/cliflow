#!/usr/bin/env node
// CLIFlow CLI - Main entry point
// Provides commands for managing the completion system

import { spawn, exec } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { connect } from 'net';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = join(homedir(), '.cliflow');
const SOCKET_PATH = join(CONFIG_DIR, 'cliflow.sock');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

function printBanner() {
  console.log(`
${colors.cyan}${colors.bold}
   _____ _      _____ ______ _                 
  / ____| |    |_   _|  ____| |                
 | |    | |      | | | |__  | | _____      __  
 | |    | |      | | |  __| | |/ _ \\ \\ /\\ / /  
 | |____| |____ _| |_| |    | | (_) \\ V  V /   
  \\_____|______|_____|_|    |_|\\___/ \\_/\\_/    
${colors.reset}
${colors.dim}IDE-like autocomplete for your terminal${colors.reset}
`);
}

function printHelp() {
  printBanner();
  console.log(`
${colors.bold}USAGE${colors.reset}
  cliflow <command> [options]

${colors.bold}COMMANDS${colors.reset}
  ${colors.cyan}setup${colors.reset}        Configure shell integration
  ${colors.cyan}daemon${colors.reset}       Manage the completion daemon
    start      Start the daemon
    stop       Stop the daemon
    restart    Restart the daemon
    status     Check daemon status
  ${colors.cyan}status${colors.reset}       Show overall status
  ${colors.cyan}repair${colors.reset}       Diagnose and fix issues
    --fix      Auto-fix issues
  ${colors.cyan}specs${colors.reset}        List available completion specs
  ${colors.cyan}test${colors.reset}         Test completions for a command
  ${colors.cyan}help${colors.reset}         Show this help message

${colors.bold}EXAMPLES${colors.reset}
  ${colors.dim}# Initial setup${colors.reset}
  cliflow setup
  
  ${colors.dim}# Start the daemon${colors.reset}
  cliflow daemon start
  
  ${colors.dim}# Test completions${colors.reset}
  cliflow test "git ch"
  
  ${colors.dim}# Diagnose issues${colors.reset}
  cliflow repair
  
${colors.bold}DOCUMENTATION${colors.reset}
  https://github.com/adnankoroth/cliflow
`);
}

function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function isDaemonRunning(): boolean {
  return existsSync(SOCKET_PATH);
}

function getShellConfig() {
  const shell = process.env.SHELL || '/bin/zsh';
  const shellName = shell.split('/').pop() || 'zsh';

  let rcFile = '';
  let integrationFile = '';

  switch (shellName) {
    case 'zsh':
      rcFile = join(homedir(), '.zshrc');
      integrationFile = 'cliflow.zsh';
      break;
    case 'bash':
      rcFile = join(homedir(), '.bashrc');
      integrationFile = 'cliflow.bash';
      break;
    case 'fish':
      rcFile = join(homedir(), '.config', 'fish', 'config.fish');
      integrationFile = 'cliflow.fish';
      break;
    default:
      rcFile = join(homedir(), '.zshrc');
      integrationFile = 'cliflow.zsh';
      break;
  }

  return { shellName, rcFile, integrationFile };
}

function getDesiredSourcePath(integrationFile: string) {
  const homebrewIntegration = `/opt/homebrew/opt/cliflow/share/cliflow/shell-integration/${integrationFile}`;
  const destIntegration = join(CONFIG_DIR, integrationFile);

  if (existsSync(homebrewIntegration)) {
    return homebrewIntegration;
  }

  return destIntegration;
}

async function setup() {
  log.info('Setting up CLIFlow...');
  ensureConfigDir();
  
  // Detect shell
  const { shellName, rcFile, integrationFile } = getShellConfig();
  
  log.info(`Detected shell: ${shellName}`);
  
  // Determine RC file
  if (!['zsh', 'bash', 'fish'].includes(shellName)) {
    log.error(`Unsupported shell: ${shellName}`);
    log.info('Supported shells: zsh, bash, fish');
    return;
  }
  
  // Copy shell integration file
  // First, try to find shell integration in Homebrew location
  const homebrewIntegration = `/opt/homebrew/opt/cliflow/share/cliflow/shell-integration/${integrationFile}`;
  const sourceIntegration = join(__dirname, '..', 'shell-integration', integrationFile);
  const destIntegration = join(CONFIG_DIR, integrationFile);
  
  // Use Homebrew path if it exists, otherwise use local path
  let actualSource = '';
  let sourcePath = '';
  
  if (existsSync(homebrewIntegration)) {
    actualSource = homebrewIntegration;
    sourcePath = homebrewIntegration;
  } else if (existsSync(sourceIntegration)) {
    actualSource = sourceIntegration;
    copyFileSync(sourceIntegration, destIntegration);
    sourcePath = destIntegration;
    log.success(`Copied shell integration to ${destIntegration}`);
  } else {
    log.warn(`Shell integration file not found: ${sourceIntegration}`);
    log.warn(`Also not found at: ${homebrewIntegration}`);
    sourcePath = destIntegration; // Fallback
  }
  
  // For Homebrew, source directly from /opt/homebrew, don't copy
  if (actualSource === homebrewIntegration) {
    sourcePath = homebrewIntegration;
    log.success(`Using Homebrew shell integration: ${sourcePath}`);
  }
  
  // Check if already configured
  const rcContent = existsSync(rcFile) ? readFileSync(rcFile, 'utf-8') : '';
  const desiredSourceLine = `source "${sourcePath}"`;
  const existingSourceRegex = /^\s*source\s+["']?[^"']*cliflow\.(zsh|bash|fish)["']?\s*$/m;

  if (rcContent.includes(desiredSourceLine)) {
    log.info('CLIFlow already configured in your shell RC file');
  } else if (existingSourceRegex.test(rcContent)) {
    const updatedRc = rcContent.replace(existingSourceRegex, desiredSourceLine);
    writeFileSync(rcFile, updatedRc);
    log.success(`Updated CLIFlow source path in ${rcFile}`);
  } else if (rcContent.includes('# CLIFlow - IDE-like autocomplete')) {
    const updatedRc = rcContent.replace(
      /# CLIFlow - IDE-like autocomplete\s*\n?/,
      `# CLIFlow - IDE-like autocomplete\n${desiredSourceLine}\n`
    );
    writeFileSync(rcFile, updatedRc);
    log.success(`Added CLIFlow source line to ${rcFile}`);
  } else {
    // Add to RC file
    const addition = `
# CLIFlow - IDE-like autocomplete
${desiredSourceLine}
`;
    writeFileSync(rcFile, rcContent + addition);
    log.success(`Added CLIFlow to ${rcFile}`);
  }
  
  console.log(`
${colors.green}${colors.bold}Setup complete!${colors.reset}

${colors.bold}Next steps:${colors.reset}
1. Restart your terminal or run:
   ${colors.cyan}source ${rcFile}${colors.reset}

2. Start the completion daemon:
   ${colors.cyan}cliflow daemon start${colors.reset}

3. Start typing and press TAB to see completions!
`);
}

function daemonStart() {
  if (isDaemonRunning()) {
    log.warn('Daemon is already running');
    return;
  }
  
  log.info('Starting CLIFlow daemon...');
  
  const daemonPath = join(__dirname, '..', 'daemon', 'server.js');
  
  // Check if compiled daemon exists
  if (!existsSync(daemonPath)) {
    log.error('Daemon not compiled. Run: npm run build');
    return;
  }
  
  // Start daemon in background
  const child = spawn('node', [daemonPath, 'start'], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: join(__dirname, '..'),
  });
  
  child.stdout?.on('data', (data) => {
    console.log(data.toString().trim());
  });
  
  child.stderr?.on('data', (data) => {
    console.error(data.toString().trim());
  });
  
  child.unref();
  
  // Wait a bit and check if it started
  setTimeout(() => {
    if (isDaemonRunning()) {
      log.success('Daemon started successfully');
      log.info(`PID: ${child.pid}`);
    } else {
      log.error('Daemon failed to start');
    }
  }, 1000);
}

function daemonStop() {
  if (!isDaemonRunning()) {
    log.info('Daemon is not running');
    return;
  }
  
  log.info('Stopping CLIFlow daemon...');
  
  // Send shutdown command via socket
  
  const client = connect(SOCKET_PATH);
  
  client.write(JSON.stringify({ type: 'shutdown' }) + '\n');
  client.on('data', () => {
    log.success('Daemon stopped');
  });
  client.on('error', () => {
    log.error('Failed to stop daemon');
  });
}

function daemonStatus() {
  if (isDaemonRunning()) {
    log.success('Daemon is running');
    log.info(`Socket: ${SOCKET_PATH}`);
  } else {
    log.warn('Daemon is not running');
    log.info('Start with: cliflow daemon start');
  }
}

function showStatus() {
  printBanner();
  
  console.log(`${colors.bold}Status${colors.reset}`);
  console.log('─'.repeat(40));
  
  // Daemon status
  if (isDaemonRunning()) {
    console.log(`  Daemon:        ${colors.green}● Running${colors.reset}`);
  } else {
    console.log(`  Daemon:        ${colors.yellow}○ Stopped${colors.reset}`);
  }
  
  // Config directory
  console.log(`  Config:        ${CONFIG_DIR}`);
  
  // Shell integration
  const { shellName, rcFile, integrationFile } = getShellConfig();
  console.log(`  Shell:         ${shellName}`);
  const desiredSourcePath = getDesiredSourcePath(integrationFile);
  const desiredSourceLine = `source "${desiredSourcePath}"`;
  let rcConfigured = false;
  let rcHasAnyCliflowSource = false;
  if (existsSync(rcFile)) {
    const rcContent = readFileSync(rcFile, 'utf-8');
    const existingSourceRegex = /^\s*source\s+["']?[^"']*cliflow\.(zsh|bash|fish)["']?\s*$/m;
    rcHasAnyCliflowSource = existingSourceRegex.test(rcContent);
    rcConfigured = rcContent.includes(desiredSourceLine);
  }
  if (rcConfigured) {
    console.log(`  Shell setup:   ${colors.green}● Configured${colors.reset}`);
  } else if (rcHasAnyCliflowSource) {
    console.log(`  Shell setup:   ${colors.yellow}● Needs update${colors.reset}`);
  } else {
    console.log(`  Shell setup:   ${colors.yellow}● Not configured${colors.reset}`);
  }
  
  // Specs count - read from completions directory
  const specsPath = join(__dirname, '..', 'completions');
  let specsCount = 0;
  if (existsSync(specsPath)) {
    specsCount = readdirSync(specsPath).filter((f: string) => f.endsWith('.js') && !f.endsWith('.d.js')).length;
  }
  console.log(`  Specs loaded:  ${specsCount} commands`);
  
  console.log('');
}

async function listSpecs() {
  log.info('Available completion specs:');
  console.log('');
  
  // Load specs from completions directory
  const specsPath = join(__dirname, '..', 'completions');
  let specs: string[] = [];
  
  if (existsSync(specsPath)) {
    specs = readdirSync(specsPath)
      .filter((f: string) => f.endsWith('.js') && !f.endsWith('.d.js') && !['index.js', 'types.js'].includes(f))
      .map((f: string) => f.replace('.js', ''))
      .sort();
  }
  
  const columns = 5;
  const columnWidth = 15;
  
  for (let i = 0; i < specs.length; i += columns) {
    const row = specs.slice(i, i + columns);
    console.log('  ' + row.map(s => s.padEnd(columnWidth)).join(''));
  }
  
  console.log('');
  log.info(`Total: ${specs.length} specs`);
}

async function repair(autoFix: boolean = false) {
  console.log(`\n${colors.bold}CLIFlow Diagnostic${colors.reset}\n`);
  console.log('Running system checks...\n');
  
  const checks: { name: string; status: 'pass' | 'fail' | 'warn'; message: string; fix?: () => void }[] = [];
  
  // Check 1: Config directory
  const configExists = existsSync(CONFIG_DIR);
  checks.push({
    name: 'Config Directory',
    status: configExists ? 'pass' : 'fail',
    message: configExists ? `${CONFIG_DIR} exists` : `${CONFIG_DIR} not found`,
    fix: () => {
      mkdirSync(CONFIG_DIR, { recursive: true });
      log.success('Created config directory');
    }
  });
  
  // Check 2: Socket file
  const socketExists = existsSync(SOCKET_PATH);
  checks.push({
    name: 'Socket File',
    status: socketExists ? 'pass' : 'warn',
    message: socketExists ? 'Socket exists' : 'Socket not found (daemon not running?)'
  });
  
  // Check 3: Daemon process
  const daemonRunning = isDaemonRunning();
  checks.push({
    name: 'Daemon Status',
    status: daemonRunning ? 'pass' : 'warn',
    message: daemonRunning ? 'Daemon is running' : 'Daemon is not running',
    fix: () => {
      log.info('Starting daemon...');
      daemonStart();
    }
  });
  
  // Check 4: Shell integration
  const { shellName, rcFile, integrationFile } = getShellConfig();
  const homebrewIntegration = `/opt/homebrew/opt/cliflow/share/cliflow/shell-integration/${integrationFile}`;
  const localIntegration = join(__dirname, '..', 'shell-integration', integrationFile);
  const integrationExists = existsSync(homebrewIntegration) || existsSync(localIntegration);
  checks.push({
    name: 'Shell Integration',
    status: integrationExists ? 'pass' : 'fail',
    message: integrationExists ? `${shellName} integration found` : `${shellName} integration missing`
  });
  
  // Check 5: RC file setup
  let rcConfigured = false;
  let rcHasAnyCliflowSource = false;
  const desiredSourcePath = getDesiredSourcePath(integrationFile);
  const desiredSourceLine = `source "${desiredSourcePath}"`;
  if (existsSync(rcFile)) {
    const rcContent = readFileSync(rcFile, 'utf-8');
    const existingSourceRegex = /^\s*source\s+["']?[^"']*cliflow\.(zsh|bash|fish)["']?\s*$/m;
    rcHasAnyCliflowSource = existingSourceRegex.test(rcContent);
    rcConfigured = rcContent.includes(desiredSourceLine);
  }
  checks.push({
    name: 'RC File',
    status: rcConfigured ? 'pass' : 'warn',
    message: rcConfigured
      ? `${rcFile} configured`
      : rcHasAnyCliflowSource
        ? `${rcFile} points to old path`
        : `${rcFile} not configured for CLIFlow`,
    fix: () => {
      log.info('Running setup...');
      setup();
    }
  });
  
  // Check 6: Built-in specs
  const specsPath = join(__dirname, '..', 'completions');
  const specsExist = existsSync(specsPath);
  let specsCount = 0;
  if (specsExist) {
    
    const files = readdirSync(specsPath);
    specsCount = files.filter((f: string) => f.endsWith('.js')).length;
  }
  checks.push({
    name: 'Built-in Specs',
    status: specsExist && specsCount > 0 ? 'pass' : 'fail',
    message: specsExist ? `${specsCount} built-in specs found` : 'Built-in specs not found'
  });
  
  // Check 7: Community specs
  const communityPath = join(__dirname, '..', 'completions', 'community');
  const communityExists = existsSync(communityPath);
  let communityCount = 0;
  if (communityExists) {
    
    const files = readdirSync(communityPath);
    communityCount = files.filter((f: string) => f.endsWith('.mjs') || f.endsWith('.js')).length;
  }
  checks.push({
    name: 'Community Specs',
    status: communityExists && communityCount > 0 ? 'pass' : 'warn',
    message: communityExists ? `${communityCount} community specs available` : 'Community specs not found'
  });
  
  // Check 8: Custom specs
  const customPath = join(CONFIG_DIR, 'specs');
  const customExists = existsSync(customPath);
  let customCount = 0;
  if (customExists) {
    
    const files = readdirSync(customPath);
    customCount = files.filter((f: string) => f.endsWith('.mjs') || f.endsWith('.js')).length;
  }
  checks.push({
    name: 'Custom Specs',
    status: 'pass',
    message: customExists ? `${customCount} custom specs found` : 'No custom specs (optional)'
  });
  
  // Print results
  for (const check of checks) {
    const icon = check.status === 'pass' ? `${colors.green}✓${colors.reset}` :
                 check.status === 'warn' ? `${colors.yellow}⚠${colors.reset}` :
                 `${colors.red}✗${colors.reset}`;
    console.log(`${icon} ${check.name.padEnd(20)} ${check.message}`);
  }
  
  // Summary
  const failures = checks.filter(c => c.status === 'fail');
  const warnings = checks.filter(c => c.status === 'warn');
  
  console.log('');
  if (failures.length === 0 && warnings.length === 0) {
    log.success('All checks passed! CLIFlow is healthy.');
  } else {
    if (failures.length > 0) {
      log.error(`${failures.length} issue(s) need attention`);
    }
    if (warnings.length > 0) {
      log.warn(`${warnings.length} warning(s)`);
    }
    
    // Auto-fix if requested
    if (autoFix) {
      console.log('');
      log.info('Attempting auto-fix...');
      for (const check of [...failures, ...warnings]) {
        if (check.fix) {
          check.fix();
        }
      }
    } else {
      console.log(`\nRun ${colors.cyan}cliflow repair --fix${colors.reset} to auto-fix issues.`);
    }
  }
}

async function testCompletions(commandLine: string) {
  if (!isDaemonRunning()) {
    log.error('Daemon is not running. Start it first:');
    console.log('  cliflow daemon start');
    return;
  }
  
  log.info(`Testing completions for: "${commandLine}"`);
  
  
  const client = connect(SOCKET_PATH);
  
  const request = JSON.stringify({
    type: 'complete',
    commandLine,
    cursorPosition: commandLine.length,
    cwd: process.cwd(),
    shell: 'zsh'
  }) + '\n';
  
  client.write(request);
  
  client.on('data', (data: Buffer) => {
    const response = JSON.parse(data.toString().trim());
    
    if (response.success) {
      console.log('');
      console.log(`${colors.bold}Suggestions:${colors.reset}`);
      console.log('─'.repeat(60));
      
      if (response.suggestions.length === 0) {
        console.log('  No completions available');
      } else {
        for (const s of response.suggestions.slice(0, 20)) {
          const icon = s.icon || '•';
          // Handle case where name might be an array (from some Fig specs)
          const name = Array.isArray(s.name) ? s.name[0] : (s.name || '');
          const desc = s.description ? `${colors.dim}${String(s.description).slice(0, 40)}${colors.reset}` : '';
          console.log(`  ${icon} ${String(name).padEnd(20)} ${desc}`);
        }
        
        if (response.suggestions.length > 20) {
          console.log(`  ${colors.dim}... and ${response.suggestions.length - 20} more${colors.reset}`);
        }
      }
    } else {
      log.error(`Error: ${response.error}`);
    }
    
    client.destroy();
  });
  
  client.on('error', (err: Error) => {
    log.error(`Connection error: ${err.message}`);
  });
}

// Main CLI handler
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'setup':
    setup();
    break;
    
  case 'daemon':
    const subcommand = args[1];
    switch (subcommand) {
      case 'start':
        daemonStart();
        break;
      case 'stop':
        daemonStop();
        break;
      case 'restart':
        daemonStop();
        setTimeout(daemonStart, 1000);
        break;
      case 'status':
        daemonStatus();
        break;
      default:
        log.error(`Unknown daemon command: ${subcommand}`);
        console.log('Usage: cliflow daemon [start|stop|restart|status]');
    }
    break;
    
  case 'status':
    showStatus();
    break;
    
  case 'repair':
    const autoFix = args.includes('--fix') || args.includes('-f');
    repair(autoFix);
    break;
    
  case 'specs':
    listSpecs();
    break;
    
  case 'test':
    if (args[1]) {
      testCompletions(args.slice(1).join(' '));
    } else {
      log.error('Please provide a command to test');
      console.log('Usage: cliflow test "git ch"');
    }
    break;
    
  case 'help':
  case '--help':
  case '-h':
    printHelp();
    break;
    
  case undefined:
    printHelp();
    break;
    
  default:
    log.error(`Unknown command: ${command}`);
    console.log('Run "cliflow help" for usage information');
}
