#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createConnection } from 'net';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { spawn, execSync } from 'child_process';
import { CompletionEngine } from './engine/completion-engine.js';
import { CompletionContext } from './types.js';

const CLIFLOW_HOME = process.env.CLIFLOW_HOME || join(homedir(), '.cliflow');
const SOCKET_PATH = join(CLIFLOW_HOME, 'cliflow.sock');
const CONFIG_FILE = join(CLIFLOW_HOME, 'config.json');

const program = new Command();

program
  .name('cliflow')
  .description('CLIFlow - IDE-style terminal autocompletion')
  .version('0.1.0');

program
  .command('complete')
  .description('Get completions for a command line')
  .argument('<command>', 'Command line to complete')
  .option('-d, --directory <dir>', 'Working directory', process.cwd())
  .option('-p, --position <pos>', 'Cursor position', (val) => parseInt(val), -1)
  .action(async (commandLine: string, options) => {
    const engine = new CompletionEngine();
    
    // Don't filter out empty tokens - they're important for completion context
    const tokens = commandLine.split(' ');
    const cursorPosition = options.position === -1 ? commandLine.length : options.position;
    
    const context: CompletionContext = {
      currentWorkingDirectory: options.directory,
      commandLine,
      tokens,
      cursorPosition,
      environmentVariables: process.env as Record<string, string>,
      shell: 'zsh', // Default to zsh for now
      isGitRepository: false, // TODO: detect git repository
    };
    
    try {
      const completions = await engine.getCompletions(context);
      
      if (completions.length === 0) {
        console.log(chalk.yellow('No completions found'));
        return;
      }
      
      console.log(chalk.green(`Found ${completions.length} completions:\n`));
      
      for (const completion of completions.slice(0, 20)) { // Limit to 20 results
        const icon = getTypeIcon(completion.type || 'custom');
        const name = chalk.bold(completion.name);
        const description = completion.description ? chalk.gray(` - ${completion.description}`) : '';
        console.log(`${icon} ${name}${description}`);
      }
      
      if (completions.length > 20) {
        console.log(chalk.gray(`\n... and ${completions.length - 20} more`));
      }
    } catch (error) {
      console.error(chalk.red('Error getting completions:'), error);
    }
  });

program
  .command('test')
  .description('Test completions interactively')
  .action(async () => {
    console.log(chalk.blue('CLIFlow Interactive Test Mode\n'));
    console.log('Type commands to see completions. Type "exit" to quit.\n');
    
    const engine = new CompletionEngine();
    const readline = await import('readline');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('> ')
    });
    
    rl.prompt();
    
    rl.on('line', async (input) => {
      const line = input.trim();
      
      if (line === 'exit') {
        rl.close();
        return;
      }
      
      if (line === '') {
        rl.prompt();
        return;
      }
      
      const tokens = line.split(' ');
      
      const context: CompletionContext = {
        currentWorkingDirectory: process.cwd(),
        commandLine: line,
        tokens,
        cursorPosition: line.length,
        environmentVariables: process.env as Record<string, string>,
        shell: 'zsh',
        isGitRepository: false,
      };
      
      try {
        const completions = await engine.getCompletions(context);
        
        if (completions.length === 0) {
          console.log(chalk.yellow('  No completions found'));
        } else {
          console.log(chalk.green(`  ${completions.length} completions:`));
          
          for (const completion of completions.slice(0, 10)) {
            const icon = getTypeIcon(completion.type || 'custom');
            const name = chalk.bold(completion.name);
            const description = completion.description ? chalk.gray(` - ${completion.description}`) : '';
            console.log(`  ${icon} ${name}${description}`);
          }
          
          if (completions.length > 10) {
            console.log(chalk.gray(`  ... and ${completions.length - 10} more`));
          }
        }
      } catch (error) {
        console.error(chalk.red('  Error:'), error);
      }
      
      console.log();
      rl.prompt();
    });
    
    rl.on('close', () => {
      console.log(chalk.blue('\nGoodbye!'));
      process.exit(0);
    });
  });

function getTypeIcon(type: string): string {
  switch (type) {
    case 'subcommand': return '🔧';
    case 'option': return '⚙️';
    case 'file': return '📄';
    case 'folder': return '📁';
    case 'argument': return '💬';
    default: return '•';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Daemon Management Commands
// ═══════════════════════════════════════════════════════════════════════════════

function isDaemonRunning(): boolean {
  return existsSync(SOCKET_PATH);
}

function pingDaemon(): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection(SOCKET_PATH);
    socket.setTimeout(1000);
    
    socket.on('connect', () => {
      socket.write('{"cmd":"ping"}\n');
    });
    
    socket.on('data', () => {
      socket.end();
      resolve(true);
    });
    
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => {
      socket.end();
      resolve(false);
    });
  });
}

program
  .command('status')
  .description('Check CLIFlow daemon status')
  .action(async () => {
    console.log(chalk.bold('\n  CLIFlow Status\n'));
    
    // Check installation
    if (existsSync(CLIFLOW_HOME)) {
      console.log(`  ${chalk.green('✓')} Installation: ${chalk.gray(CLIFLOW_HOME)}`);
    } else {
      console.log(`  ${chalk.red('✗')} Installation: ${chalk.red('Not installed')}`);
      return;
    }
    
    // Check daemon
    if (isDaemonRunning()) {
      const responsive = await pingDaemon();
      if (responsive) {
        console.log(`  ${chalk.green('✓')} Daemon: ${chalk.green('Running')}`);
      } else {
        console.log(`  ${chalk.yellow('⚠')} Daemon: ${chalk.yellow('Socket exists but not responding')}`);
      }
    } else {
      console.log(`  ${chalk.red('✗')} Daemon: ${chalk.red('Not running')}`);
    }
    
    // Check shell integration
    const zshrc = join(homedir(), '.zshrc');
    const bashrc = join(homedir(), '.bashrc');
    
    let shellIntegration = [];
    if (existsSync(zshrc) && readFileSync(zshrc, 'utf-8').includes('cliflow')) {
      shellIntegration.push('zsh');
    }
    if (existsSync(bashrc) && readFileSync(bashrc, 'utf-8').includes('cliflow')) {
      shellIntegration.push('bash');
    }
    
    if (shellIntegration.length > 0) {
      console.log(`  ${chalk.green('✓')} Shell integration: ${chalk.gray(shellIntegration.join(', '))}`);
    } else {
      console.log(`  ${chalk.yellow('⚠')} Shell integration: ${chalk.yellow('Not configured')}`);
    }
    
    console.log();
  });

program
  .command('start')
  .description('Start the CLIFlow daemon')
  .action(async () => {
    if (isDaemonRunning() && await pingDaemon()) {
      console.log(chalk.yellow('Daemon is already running'));
      return;
    }
    
    console.log('Starting CLIFlow daemon...');
    
    const serverPath = join(CLIFLOW_HOME, 'build', 'daemon', 'server.js');
    
    if (!existsSync(serverPath)) {
      console.error(chalk.red('Daemon script not found. Please reinstall CLIFlow.'));
      process.exit(1);
    }
    
    const daemon = spawn('node', [serverPath, 'start'], {
      cwd: CLIFLOW_HOME,
      detached: true,
      stdio: 'ignore'
    });
    
    daemon.unref();
    
    // Wait for daemon to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (await pingDaemon()) {
      console.log(chalk.green('✓ Daemon started successfully'));
    } else {
      console.log(chalk.yellow('Daemon started but not responding yet'));
    }
  });

program
  .command('stop')
  .description('Stop the CLIFlow daemon')
  .action(async () => {
    console.log('Stopping CLIFlow daemon...');
    
    try {
      execSync('pkill -f "cliflow.*daemon" 2>/dev/null || true', { stdio: 'ignore' });
      execSync('pkill -f "node.*server.js" 2>/dev/null || true', { stdio: 'ignore' });
      
      if (existsSync(SOCKET_PATH)) {
        execSync(`rm -f "${SOCKET_PATH}"`, { stdio: 'ignore' });
      }
      
      console.log(chalk.green('✓ Daemon stopped'));
    } catch {
      console.log(chalk.yellow('Could not stop daemon (may not be running)'));
    }
  });

program
  .command('restart')
  .description('Restart the CLIFlow daemon')
  .action(async () => {
    console.log('Restarting CLIFlow daemon...');
    
    // Stop
    try {
      execSync('pkill -f "cliflow.*daemon" 2>/dev/null || true', { stdio: 'ignore' });
      execSync('pkill -f "node.*server.js" 2>/dev/null || true', { stdio: 'ignore' });
      if (existsSync(SOCKET_PATH)) {
        execSync(`rm -f "${SOCKET_PATH}"`, { stdio: 'ignore' });
      }
    } catch { /* ignore */ }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Start
    const serverPath = join(CLIFLOW_HOME, 'build', 'daemon', 'server.js');
    
    if (!existsSync(serverPath)) {
      console.error(chalk.red('Daemon script not found. Please reinstall CLIFlow.'));
      process.exit(1);
    }
    
    const daemon = spawn('node', [serverPath, 'start'], {
      cwd: CLIFLOW_HOME,
      detached: true,
      stdio: 'ignore'
    });
    
    daemon.unref();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (await pingDaemon()) {
      console.log(chalk.green('✓ Daemon restarted successfully'));
    } else {
      console.log(chalk.yellow('Daemon started but not responding yet'));
    }
  });

program
  .command('enable')
  .description('Enable CLIFlow completions')
  .action(() => {
    const config = loadConfig();
    config.enabled = true;
    saveConfig(config);
    console.log(chalk.green('✓ CLIFlow enabled'));
    console.log(chalk.gray('  Restart your terminal for changes to take effect'));
  });

program
  .command('disable')
  .description('Disable CLIFlow completions')
  .action(() => {
    const config = loadConfig();
    config.enabled = false;
    saveConfig(config);
    console.log(chalk.yellow('✓ CLIFlow disabled'));
    console.log(chalk.gray('  Restart your terminal for changes to take effect'));
  });

program
  .command('logs')
  .description('Show daemon logs')
  .option('-f, --follow', 'Follow log output')
  .option('-n, --lines <n>', 'Number of lines to show', '50')
  .action((options) => {
    const logFile = join(CLIFLOW_HOME, 'daemon.log');
    
    if (!existsSync(logFile)) {
      console.log(chalk.yellow('No log file found'));
      return;
    }
    
    if (options.follow) {
      const tail = spawn('tail', ['-f', logFile], { stdio: 'inherit' });
      process.on('SIGINT', () => {
        tail.kill();
        process.exit(0);
      });
    } else {
      const tail = spawn('tail', ['-n', options.lines, logFile], { stdio: 'inherit' });
    }
  });

// ═══════════════════════════════════════════════════════════════════════════════
// Config helpers
// ═══════════════════════════════════════════════════════════════════════════════

interface CLIFlowConfig {
  enabled: boolean;
  maxSuggestions: number;
  fuzzyMatch: boolean;
  historyEnabled: boolean;
}

function loadConfig(): CLIFlowConfig {
  const defaults: CLIFlowConfig = {
    enabled: true,
    maxSuggestions: 15,
    fuzzyMatch: true,
    historyEnabled: true
  };
  
  if (!existsSync(CONFIG_FILE)) {
    return defaults;
  }
  
  try {
    const content = readFileSync(CONFIG_FILE, 'utf-8');
    return { ...defaults, ...JSON.parse(content) };
  } catch {
    return defaults;
  }
}

function saveConfig(config: CLIFlowConfig): void {
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

program.parse();