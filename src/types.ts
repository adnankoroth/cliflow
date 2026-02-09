// Core types for CLIFlow completion specs
// CLIFlow's own completion spec format

export interface CompletionSpec {
  /** The name of the CLI command */
  name: string;
  
  /** Description of what this command does */
  description?: string;
  
  /** Subcommands available for this command */
  subcommands?: Subcommand[];
  
  /** Options/flags available for this command */
  options?: Option[];
  
  /** Arguments that this command accepts */
  args?: Argument | Argument[];
  
  /** Examples of how to use this command */
  examples?: Example[];
  
  /** Additional information about this command */
  additionalSuggestions?: Suggestion[];
  
  /** Custom generators for dynamic completions */
  generateSpec?: Generator | Generator[] | GenerateSpec;

  /** Lazy-load/attach another spec subtree (Fig-compatible) */
  loadSpec?: string | CompletionSpec | Subcommand;
}

export interface Subcommand extends CompletionSpec {
  /** Alternative names for this subcommand */
  aliases?: string[];
  
  /** Priority for sorting (higher = appears first) */
  priority?: number;
  
  /** Whether this subcommand is hidden from completions */
  hidden?: boolean;
}

export interface Option {
  /** The option flag(s) - can be string or array for aliases */
  name: string | string[];
  
  /** Description of what this option does */
  description?: string;
  
  /** Arguments that this option accepts */
  args?: Argument | Argument[];
  
  /** Whether this option is required */
  required?: boolean;
  
  /** Whether this option can be used multiple times */
  isRepeatable?: boolean;
  
  /** Options that conflict with this one */
  exclusiveOn?: string[];
  
  /** Options that are required when this one is used */
  dependsOn?: string[];
  
  /** Priority for sorting */
  priority?: number;
  
  /** Whether this option is hidden */
  hidden?: boolean;
}

export interface Argument {
  /** Name of the argument (for display purposes) */
  name?: string;
  
  /** Description of the argument */
  description?: string;
  
  /** Whether this argument is optional */
  isOptional?: boolean;
  
  /** Whether this argument can accept multiple values */
  isVariadic?: boolean;
  
  /** Template for completion suggestions */
  template?: Template | Template[];
  
  /** Static suggestions for this argument */
  suggestions?: Suggestion[];
  
  /** Custom generator for dynamic suggestions */
  generators?: Generator | Generator[];
  
  /** Debounce time for generators (in ms) */
  debounce?: number;
  
  /** Filter strategy for matching user input */
  filterStrategy?: 'fuzzy' | 'prefix' | 'substring';

  /** Lazy-load/attach another spec subtree after this arg (Fig-compatible) */
  loadSpec?: string | CompletionSpec | Subcommand;
}

export interface Suggestion {
  /** The text to complete */
  name: string;
  
  /** Description shown alongside the suggestion */
  description?: string;
  
  /** Icon to display (file path or built-in icon name) */
  icon?: string;
  
  /** Priority for sorting */
  priority?: number;
  
  /** Additional text to insert when selected */
  insertValue?: string;
  
  /** Replace the entire current token when selected */
  replaceValue?: string;
  
  /** Type of suggestion (for styling) */
  type?: 'file' | 'folder' | 'option' | 'subcommand' | 'argument' | 'custom';
}

export interface Example {
  /** The example command */
  command: string;
  
  /** Description of what this example does */
  description: string;
  
  /** Name/title for this example */
  name?: string;
}

export type Template = 
  | 'filepaths'      // Files and directories
  | 'folders'        // Directories only
  | 'files'          // Files only
  | 'history'        // Command history
  | 'help'           // Help text
  | string;          // Custom template name

export interface Generator {
  /** Function that generates suggestions */
  script?: string | ((tokens: string[], executeShellCommand: ExecuteShellCommand) => Promise<Suggestion[]>);
  
  /** Script that uses context (e.g., current argument value) */
  scriptWithContext?: (context: string[]) => string;
  
  /** Custom async function to generate suggestions */
  custom?: (context?: string[]) => Promise<Suggestion[]>;
  
  /** Post-process the output of the script */
  postProcess?: (output: string, context?: { cwd?: string }) => Suggestion[];
  
  /** How long to wait before running the generator (ms) */
  debounce?: number;
  
  /** Timeout for script execution (ms) */
  timeout?: number;
  
  /** Custom function to determine when to run this generator */
  trigger?: (newToken: string, oldToken: string) => boolean;
  
  /** Whether to cache results */
  cache?: boolean | {
    /** How long to cache results (ms) */
    ttl?: number;
    /** Strategy for cache invalidation */
    strategy?: 'ttl' | 'directory-change' | 'git-status-change';
  };
  
  /** Custom templates this generator provides */
  template?: Template;
  
  /** Filter strategy for the results */
  filterStrategy?: 'fuzzy' | 'prefix' | 'substring' | 'none';
}

export type ExecuteShellCommand = (command: string, cwd?: string) => Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
}>;

export interface CompletionContext {
  /** Current working directory */
  currentWorkingDirectory: string;
  
  /** Full command line being typed */
  commandLine: string;
  
  /** Individual tokens from the command line */
  tokens: string[];
  
  /** Current cursor position in the command line */
  cursorPosition: number;
  
  /** Environment variables */
  environmentVariables: Record<string, string>;
  
  /** Current shell being used */
  shell: 'bash' | 'zsh' | 'fish';
  
  /** Whether we're in a git repository */
  isGitRepository: boolean;
  
  /** Git branch if in a repository */
  gitBranch?: string;
  
  /** Files in current directory */
  directoryFiles?: string[];
}

export type GenerateSpec = (
  context: CompletionContext
) => Promise<Partial<CompletionSpec> | void> | Partial<CompletionSpec> | void;