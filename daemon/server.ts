// CLIFlow Daemon - Unix Socket Server
// Handles completion requests from shell integrations

import { createServer, Socket } from 'net';
import { existsSync, unlinkSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { HistoryManager } from './history.js';

// We'll use dynamic import after build
let CompletionEngine: any;

const SOCKET_PATH = join(homedir(), '.cliflow', 'cliflow.sock');
const CONFIG_DIR = join(homedir(), '.cliflow');

interface CompletionRequest {
  type: 'complete' | 'health' | 'shutdown';
  commandLine: string;
  cursorPosition: number;
  cwd: string;
  shell: 'zsh' | 'bash' | 'fish';
}

interface CompletionResponse {
  success: boolean;
  suggestions: Suggestion[];
  error?: string;
}

interface Suggestion {
  name: string;
  description?: string;
  icon?: string;
  type: 'subcommand' | 'option' | 'argument' | 'file' | 'folder' | 'history';
  insertValue?: string;
  priority?: number;
}

class CLIFlowDaemon {
  private server: ReturnType<typeof createServer> | null = null;
  private engine: any = null;
  private history: HistoryManager;
  private connections: Set<Socket> = new Set();
  private specCount: number = 0;
  
  constructor() {
    this.history = new HistoryManager();
  }
  
  async start(): Promise<void> {
    // Ensure config directory exists
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
    }
    
    // Initialize history manager
    await this.history.initialize();
    const historyStats = this.history.getStats();
    console.log(`✓ Loaded shell history (${historyStats.totalCommands} commands, ${historyStats.uniquePrefixes} unique)`);
    
    // Remove stale socket file
    if (existsSync(SOCKET_PATH)) {
      unlinkSync(SOCKET_PATH);
    }
    
    // Load completion engine (relative path from build/daemon/ to build/engine/)
    try {
      // @ts-ignore - Dynamic import resolved at runtime after main build
      const engineModule = await import('../engine/completion-engine.js');
      CompletionEngine = engineModule.CompletionEngine;
      this.engine = new CompletionEngine();
      await this.engine.initialize();
      const counts = this.engine.getSpecCount();
      this.specCount = counts.total;
      console.log(`✓ Loaded ${counts.builtin} built-in + ${counts.dynamic} dynamic specs (${counts.total} total)`);
    } catch (err) {
      console.error('Failed to load completion engine:', err);
      console.log('Make sure to run: npm run build');
      process.exit(1);
    }
    
    // Create Unix socket server
    this.server = createServer((socket) => {
      this.handleConnection(socket);
    });
    
    this.server.listen(SOCKET_PATH, () => {
      console.log(`✓ CLIFlow daemon listening on ${SOCKET_PATH}`);
      console.log('  Ready for completions!');
    });
    
    this.server.on('error', (err) => {
      console.error('Server error:', err);
    });
    
    // Handle shutdown signals
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }
  
  private handleConnection(socket: Socket): void {
    this.connections.add(socket);
    let buffer = '';
    
    socket.on('data', async (data) => {
      buffer += data.toString();
      
      // Messages are newline-delimited JSON
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        try {
          const request: CompletionRequest = JSON.parse(line);
          const response = await this.handleRequest(request);
          socket.write(JSON.stringify(response) + '\n');
        } catch (err) {
          const errorResponse: CompletionResponse = {
            success: false,
            suggestions: [],
            error: err instanceof Error ? err.message : 'Unknown error'
          };
          socket.write(JSON.stringify(errorResponse) + '\n');
        }
      }
    });
    
    socket.on('close', () => {
      this.connections.delete(socket);
    });
    
    socket.on('error', (err) => {
      console.error('Socket error:', err);
      this.connections.delete(socket);
    });
  }
  
  private async handleRequest(request: CompletionRequest): Promise<CompletionResponse> {
    switch (request.type) {
      case 'health':
        return { success: true, suggestions: [] };
        
      case 'shutdown':
        setTimeout(() => this.shutdown(), 100);
        return { success: true, suggestions: [] };
        
      case 'complete':
        return this.getCompletions(request);
        
      default:
        return { success: false, suggestions: [], error: 'Unknown request type' };
    }
  }
  
  private async getCompletions(request: CompletionRequest): Promise<CompletionResponse> {
    const { commandLine, cursorPosition, cwd } = request;
    
    // Parse the command line into tokens
    const tokens = this.tokenize(commandLine.slice(0, cursorPosition));
    if (tokens.length === 0) {
      return { success: true, suggestions: [] };
    }
    
    const command = tokens[0];
    const currentToken = tokens[tokens.length - 1] || '';
    
    try {
      // Get completions from engine
      const context = {
        currentWorkingDirectory: cwd,
        commandLine: commandLine.slice(0, cursorPosition),
        tokens,
        cursorPosition,
        environmentVariables: process.env as Record<string, string>,
        shell: 'zsh' as const,
        isGitRepository: false,
      };
      
      const suggestions = await this.engine.getCompletions(context);
      
      // Add icons based on type and apply history boost
      const commandPrefix = tokens.slice(0, Math.min(tokens.length, 3)).join(' ');
      const enrichedSuggestions = suggestions.map((s: Suggestion) => {
        // Calculate history boost for this suggestion
        const suggestionPrefix = tokens.length === 1 
          ? s.name 
          : `${command} ${s.name}`;
        const historyBoost = this.history.getFrequencyBoost(suggestionPrefix);
        
        return {
          ...s,
          icon: s.icon || this.getIcon(s.type || 'argument'),
          priority: (s.priority || 50) + historyBoost
        };
      });
      
      // Get history-based suggestions for command names (first token)
      // Don't show history when we're clearly in a file path context (token contains /)
      let historySuggestions: Suggestion[] = [];
      const isFilePath = currentToken.includes('/');
      if (!isFilePath && tokens.length === 1 && currentToken.length >= 1) {
        // Show history when typing command name
        historySuggestions = this.history.getHistorySuggestions(currentToken, 3);
      } else if (!isFilePath && tokens.length === 2 && !currentToken.startsWith('-')) {
        // Show history for subcommands too (e.g., "git c" -> "git commit")
        const prefix = `${command} ${currentToken}`;
        historySuggestions = this.history.getHistorySuggestions(prefix, 2);
      }
      
      // Combine: history first, then engine suggestions
      const allSuggestions = [...historySuggestions, ...enrichedSuggestions];
      
      // Sort by priority descending
      allSuggestions.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      
      // Deduplicate by name
      const seen = new Set<string>();
      const uniqueSuggestions = allSuggestions.filter(s => {
        if (seen.has(s.name)) return false;
        seen.add(s.name);
        return true;
      });
      
      return {
        success: true,
        suggestions: uniqueSuggestions.slice(0, 50) // Limit to 50 suggestions
      };
    } catch (err) {
      console.error('Completion error:', err);
      return {
        success: false,
        suggestions: [],
        error: err instanceof Error ? err.message : 'Completion failed'
      };
    }
  }
  
  private tokenize(input: string): string[] {
    // Tokenization that handles quoting and escaped spaces
    const tokens: string[] = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';
    let escaped = false;
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if (escaped) {
        // Previous char was backslash - include this char literally
        current += char;
        escaped = false;
        continue;
      }
      
      if (char === '\\') {
        // Escape character - next char is literal
        escaped = true;
        current += char; // Keep the backslash for the shell
        continue;
      }
      
      if (inQuote) {
        if (char === quoteChar) {
          inQuote = false;
        } else {
          current += char;
        }
      } else if (char === '"' || char === "'") {
        inQuote = true;
        quoteChar = char;
      } else if (char === ' ' || char === '\t') {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    // Don't forget the last token (even if empty - indicates new token position)
    tokens.push(current);
    
    return tokens;
  }
  
  private getIcon(type: string): string {
    const icons: Record<string, string> = {
      subcommand: '⚡',
      option: '🔧',
      argument: '📝',
      file: '📄',
      folder: '📁',
      branch: '🌿',
      commit: '📌',
      remote: '🌐',
      tag: '🏷️',
      service: '☁️',
      default: '•'
    };
    return icons[type] || icons.default;
  }
  
  private shutdown(): void {
    console.log('\n🛑 Shutting down CLIFlow daemon...');
    
    // Close all connections
    for (const socket of this.connections) {
      socket.destroy();
    }
    
    // Close server
    if (this.server) {
      this.server.close();
    }
    
    // Remove socket file
    if (existsSync(SOCKET_PATH)) {
      unlinkSync(SOCKET_PATH);
    }
    
    process.exit(0);
  }
}

// CLI entry point
const args = process.argv.slice(2);
const command = args[0];

if (command === 'start' || !command) {
  const daemon = new CLIFlowDaemon();
  daemon.start().catch(console.error);
} else if (command === 'stop') {
  // Send shutdown command to running daemon
  import('net').then(({ connect }) => {
    const client = connect(SOCKET_PATH);
    client.write(JSON.stringify({ type: 'shutdown' }) + '\n');
    client.on('data', () => {
      console.log('✓ Daemon stopped');
      process.exit(0);
    });
    client.on('error', () => {
      console.log('Daemon not running');
      process.exit(0);
    });
  });
} else {
  console.log(`
CLIFlow Daemon

Usage:
  cliflow-daemon start    Start the completion daemon
  cliflow-daemon stop     Stop the running daemon
`);
}
