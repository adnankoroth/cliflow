import { readFileSync, existsSync, statSync, watchFile } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

interface HistoryEntry {
  command: string;
  count: number;
  lastUsed: number;
}

interface HistoryStats {
  // Maps "command subcommand" -> usage count
  // e.g., "git commit" -> 50, "aws s3 ls" -> 20
  commandFrequency: Map<string, HistoryEntry>;
  totalCommands: number;
  lastParsed: number;
}

export class HistoryManager {
  private historyPath: string;
  private stats: HistoryStats;
  private lastMtime: number = 0;

  constructor() {
    this.historyPath = join(homedir(), '.zsh_history');
    this.stats = {
      commandFrequency: new Map(),
      totalCommands: 0,
      lastParsed: 0
    };
  }

  /**
   * Initialize and parse history
   */
  async initialize(): Promise<void> {
    await this.parseHistory();
    
    // Watch for changes (re-parse when history updates)
    if (existsSync(this.historyPath)) {
      watchFile(this.historyPath, { interval: 30000 }, () => {
        this.parseHistory().catch(console.error);
      });
    }
  }

  /**
   * Parse zsh history file
   */
  private async parseHistory(): Promise<void> {
    if (!existsSync(this.historyPath)) {
      console.log('[History] No history file found at', this.historyPath);
      return;
    }

    try {
      const stat = statSync(this.historyPath);
      if (stat.mtimeMs === this.lastMtime) {
        return; // No changes
      }
      this.lastMtime = stat.mtimeMs;

      const content = readFileSync(this.historyPath, 'utf-8');
      const lines = content.split('\n');
      
      const newFrequency = new Map<string, HistoryEntry>();
      let lineIndex = 0;

      for (const line of lines) {
        if (!line.trim()) continue;
        
        let command = line;
        
        // Handle extended history format: ": timestamp:0;command"
        if (line.startsWith(':')) {
          const match = line.match(/^:\s*\d+:\d+;(.*)$/);
          if (match) {
            command = match[1];
          } else {
            continue;
          }
        }

        // Skip empty or very short commands
        command = command.trim();
        if (command.length < 2) continue;

        // Extract command prefix (first 1-3 tokens for matching)
        const prefixes = this.extractPrefixes(command);
        
        for (const prefix of prefixes) {
          const existing = newFrequency.get(prefix);
          if (existing) {
            existing.count++;
            existing.lastUsed = lineIndex;
          } else {
            newFrequency.set(prefix, {
              command: prefix,
              count: 1,
              lastUsed: lineIndex
            });
          }
        }
        
        lineIndex++;
      }

      this.stats.commandFrequency = newFrequency;
      this.stats.totalCommands = lineIndex;
      this.stats.lastParsed = Date.now();

      console.log(`[History] Parsed ${lineIndex} commands, ${newFrequency.size} unique prefixes`);
    } catch (err) {
      console.error('[History] Failed to parse history:', err);
    }
  }

  /**
   * Extract command prefixes for matching
   * e.g., "git commit -m 'msg'" -> ["git", "git commit"]
   */
  private extractPrefixes(command: string): string[] {
    const prefixes: string[] = [];
    const tokens = this.tokenize(command);
    
    if (tokens.length === 0) return prefixes;
    
    // First token (command name)
    prefixes.push(tokens[0]);
    
    // First two tokens if second isn't a flag
    if (tokens.length > 1 && !tokens[1].startsWith('-')) {
      prefixes.push(`${tokens[0]} ${tokens[1]}`);
    }
    
    // First three tokens for deep subcommands
    if (tokens.length > 2 && !tokens[1].startsWith('-') && !tokens[2].startsWith('-')) {
      prefixes.push(`${tokens[0]} ${tokens[1]} ${tokens[2]}`);
    }
    
    return prefixes;
  }

  /**
   * Simple tokenizer for history commands
   */
  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';

    for (const char of input) {
      if (inQuote) {
        if (char === quoteChar) {
          inQuote = false;
        }
        current += char;
        continue;
      }

      if (char === '"' || char === "'") {
        inQuote = true;
        quoteChar = char;
        current += char;
        continue;
      }

      if (char === ' ' || char === '\t') {
        if (current) {
          tokens.push(current);
          current = '';
        }
        continue;
      }

      current += char;
    }

    if (current) {
      tokens.push(current);
    }

    return tokens;
  }

  /**
   * Get history-based suggestions for a command prefix
   * @param input - What the user has typed so far
   * @param limit - Max suggestions to return
   */
  getHistorySuggestions(input: string, limit: number = 5): Array<{
    name: string;
    description: string;
    type: 'history';
    icon: string;
    priority: number;
    insertValue?: string;
  }> {
    if (!input || input.length < 1) return [];

    const inputLower = input.toLowerCase().trim();
    const inputTokens = input.trim().split(/\s+/);
    const matches: Array<{ entry: HistoryEntry; score: number }> = [];

    for (const [prefix, entry] of this.stats.commandFrequency) {
      if (prefix.toLowerCase().startsWith(inputLower)) {
        // Score based on frequency and recency
        const frequencyScore = Math.min(entry.count, 100) / 100; // Cap at 100
        const recencyScore = entry.lastUsed / Math.max(this.stats.totalCommands, 1);
        const score = (frequencyScore * 0.7) + (recencyScore * 0.3);
        
        matches.push({ entry, score });
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return matches.slice(0, limit).map(({ entry }) => {
      // Extract only the part after what's already typed
      const entryTokens = entry.command.split(/\s+/);
      
      // If user typed "aws s" and entry is "aws sso", return just "sso"
      // If user typed "git" and entry is "git commit", return "commit"
      let displayName: string;
      let insertValue: string;
      
      if (inputTokens.length >= entryTokens.length) {
        // User has typed same or more tokens than this entry - return full last token
        displayName = entryTokens[entryTokens.length - 1];
        insertValue = displayName;
      } else {
        // Return the remaining tokens after what user has typed
        const remainingTokens = entryTokens.slice(inputTokens.length - 1);
        displayName = remainingTokens.join(' ');
        insertValue = remainingTokens.join(' ');
      }
      
      return {
        name: displayName,
        description: `${entry.command} (${entry.count}x)`,
        type: 'history' as const,
        icon: '🕐',
        priority: 150 + Math.min(entry.count, 50), // High priority for history
        insertValue
      };
    }).filter(s => s.name && s.name.length > 0);
  }

  /**
   * Get frequency boost for a suggestion
   * Returns a priority boost (0-50) based on how often user has used this command
   */
  getFrequencyBoost(commandPrefix: string): number {
    const entry = this.stats.commandFrequency.get(commandPrefix);
    if (!entry) return 0;
    
    // Logarithmic scaling: frequent commands get a boost, but diminishing returns
    return Math.min(Math.log2(entry.count + 1) * 5, 50);
  }

  /**
   * Check if a command has been used before
   */
  hasBeenUsed(commandPrefix: string): boolean {
    return this.stats.commandFrequency.has(commandPrefix);
  }

  /**
   * Get stats for debugging
   */
  getStats(): { totalCommands: number; uniquePrefixes: number; lastParsed: Date } {
    return {
      totalCommands: this.stats.totalCommands,
      uniquePrefixes: this.stats.commandFrequency.size,
      lastParsed: new Date(this.stats.lastParsed)
    };
  }
}
