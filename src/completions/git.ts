// Git completion spec for CLIFlow
// Comprehensive git command completions

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';
import { generatorFromLines, subcommandsFromHelp } from './_shared/generators.js';

// Helper to create simple suggestions
const s = (...names: string[]): Suggestion[] => names.map(name => ({ name }));

// Git generators
const gitGenerators = {
  branches: generatorFromLines({
    script: 'git branch -a --no-color 2>/dev/null | sed "s/^[* ] //" | sed "s/remotes\\/origin\\///"',
    cacheTtl: 5000,
    unique: true,
    filterLine: (line) => !line.includes('HEAD'),
    mapLine: (line) => ({ name: line.trim(), icon: '🌿', description: 'Branch' }),
  }),

  remotes: generatorFromLines({
    script: 'git remote 2>/dev/null',
    cacheTtl: 30000,
    mapLine: (line) => ({ name: line.trim(), icon: '🌍', description: 'Remote' }),
  }),

  tags: generatorFromLines({
    script: 'git tag --list 2>/dev/null | head -50',
    cacheTtl: 30000,
    mapLine: (line) => ({ name: line.trim(), icon: '🏷️', description: 'Tag' }),
  }),

  stashes: generatorFromLines({
    script: 'git stash list 2>/dev/null',
    cacheTtl: 5000,
    mapLine: (line) => {
      const match = line.match(/^(stash@\{\d+\}): (.*)$/);
      return {
        name: match ? match[1] : line,
        description: match ? match[2] : 'Stash',
        icon: '📦',
      };
    },
  }),
};

const gitSubcommandGenerator = subcommandsFromHelp({
  script: 'git help -a 2>/dev/null',
  cacheTtl: 60000,
});

export const gitSpec: CompletionSpec = {
  name: 'git',
  description: 'Distributed version control system',
  generateSpec: gitSubcommandGenerator,
  subcommands: [
    // Basic Commands
    {
      name: 'init',
      description: 'Create empty Git repository',
      options: [
        { name: '--bare', description: 'Create bare repository' },
        { name: ['-b', '--initial-branch'], description: 'Initial branch name', args: { name: 'branch' } },
        { name: '--shared', description: 'Specify sharing permissions', args: { name: 'permissions', suggestions: s('false', 'true', 'umask', 'group', 'all', 'world', 'everybody') } }
      ]
    },
    {
      name: 'clone',
      description: 'Clone repository into new directory',
      args: [
        { name: 'repository', description: 'Repository URL' },
        { name: 'directory', isOptional: true, template: 'folders' }
      ],
      options: [
        { name: ['-b', '--branch'], description: 'Branch to clone', args: { name: 'branch' } },
        { name: '--depth', description: 'Shallow clone depth', args: { name: 'depth', suggestions: s('1', '10', '100') } },
        { name: '--single-branch', description: 'Clone only one branch' },
        { name: '--recursive', description: 'Initialize submodules' },
        { name: '--shallow-submodules', description: 'Shallow clone submodules' },
        { name: ['-o', '--origin'], description: 'Remote name', args: { name: 'name' } },
        { name: '--bare', description: 'Clone as bare repository' },
        { name: '--mirror', description: 'Clone as mirror' }
      ]
    },
    
    // Staging Commands
    {
      name: 'add',
      description: 'Add file contents to the index',
      args: { name: 'pathspec', isVariadic: true, template: 'filepaths' },
      options: [
        { name: ['-A', '--all'], description: 'Add all changes' },
        { name: ['-u', '--update'], description: 'Update tracked files' },
        { name: ['-p', '--patch'], description: 'Interactively choose hunks' },
        { name: ['-n', '--dry-run'], description: 'Dry run' },
        { name: ['-f', '--force'], description: 'Allow adding ignored files' },
        { name: ['-i', '--interactive'], description: 'Interactive mode' },
        { name: ['-e', '--edit'], description: 'Edit diff before staging' }
      ]
    },
    {
      name: 'rm',
      description: 'Remove files from working tree and index',
      args: { name: 'file', isVariadic: true, template: 'filepaths' },
      options: [
        { name: ['-f', '--force'], description: 'Force removal' },
        { name: ['-r'], description: 'Remove recursively' },
        { name: '--cached', description: 'Only remove from index' },
        { name: ['-n', '--dry-run'], description: 'Dry run' }
      ]
    },
    {
      name: 'mv',
      description: 'Move or rename file/directory',
      args: [
        { name: 'source', template: 'filepaths' },
        { name: 'destination', template: 'filepaths' }
      ],
      options: [
        { name: ['-f', '--force'], description: 'Force move' },
        { name: ['-k'], description: 'Skip move errors' },
        { name: ['-n', '--dry-run'], description: 'Dry run' }
      ]
    },
    {
      name: 'restore',
      description: 'Restore working tree files',
      args: { name: 'pathspec', isVariadic: true, template: 'filepaths' },
      options: [
        { name: ['-s', '--source'], description: 'Restore from source', args: { name: 'tree-ish', generators: gitGenerators.branches } },
        { name: ['-p', '--patch'], description: 'Select hunks interactively' },
        { name: ['-W', '--worktree'], description: 'Restore working tree' },
        { name: ['-S', '--staged'], description: 'Restore index' },
        { name: '--ours', description: 'Use our version for conflicts' },
        { name: '--theirs', description: 'Use their version for conflicts' }
      ]
    },
    
    // Commit Commands
    {
      name: 'commit',
      description: 'Record changes to the repository',
      options: [
        { name: ['-m', '--message'], description: 'Commit message', args: { name: 'message' } },
        { name: ['-a', '--all'], description: 'Stage all modified files' },
        { name: '--amend', description: 'Amend previous commit' },
        { name: ['-n', '--no-verify'], description: 'Skip pre-commit hooks' },
        { name: ['-s', '--signoff'], description: 'Add Signed-off-by' },
        { name: ['-S', '--gpg-sign'], description: 'GPG sign commit', args: { name: 'keyid', isOptional: true } },
        { name: '--no-edit', description: 'Use selected commit message without editing' },
        { name: ['-C', '--reuse-message'], description: 'Reuse message from commit', args: { name: 'commit' } },
        { name: ['-c', '--reedit-message'], description: 'Reuse and edit message', args: { name: 'commit' } },
        { name: '--fixup', description: 'Create fixup commit', args: { name: 'commit' } },
        { name: '--squash', description: 'Create squash commit', args: { name: 'commit' } },
        { name: ['-F', '--file'], description: 'Read message from file', args: { name: 'file', template: 'filepaths' } },
        { name: '--allow-empty', description: 'Allow empty commit' },
        { name: '--allow-empty-message', description: 'Allow empty message' }
      ]
    },
    {
      name: 'reset',
      description: 'Reset current HEAD to specified state',
      args: { name: 'commit', isOptional: true, generators: gitGenerators.branches },
      options: [
        { name: '--soft', description: 'Keep changes staged' },
        { name: '--mixed', description: 'Unstage changes (default)' },
        { name: '--hard', description: 'Discard all changes' },
        { name: '--merge', description: 'Reset keeping local changes' },
        { name: '--keep', description: 'Reset keeping local changes if possible' },
        { name: ['-p', '--patch'], description: 'Select hunks interactively' }
      ]
    },
    
    // Branch Commands
    {
      name: 'branch',
      description: 'List, create, or delete branches',
      args: { name: 'branch', isOptional: true, generators: gitGenerators.branches },
      options: [
        { name: ['-a', '--all'], description: 'List all branches' },
        { name: ['-r', '--remotes'], description: 'List remote branches' },
        { name: ['-d', '--delete'], description: 'Delete branch' },
        { name: ['-D'], description: 'Force delete branch' },
        { name: ['-m', '--move'], description: 'Rename branch', args: { name: 'new-name' } },
        { name: ['-M'], description: 'Force rename branch', args: { name: 'new-name' } },
        { name: ['-c', '--copy'], description: 'Copy branch', args: { name: 'new-name' } },
        { name: ['-C'], description: 'Force copy branch', args: { name: 'new-name' } },
        { name: ['-u', '--set-upstream-to'], description: 'Set upstream', args: { name: 'upstream', generators: gitGenerators.branches } },
        { name: '--unset-upstream', description: 'Remove upstream' },
        { name: ['-v', '--verbose'], description: 'Show hash and subject' },
        { name: ['-vv'], description: 'Show upstream too' },
        { name: '--merged', description: 'List merged branches', args: { name: 'commit', isOptional: true } },
        { name: '--no-merged', description: 'List unmerged branches', args: { name: 'commit', isOptional: true } },
        { name: '--contains', description: 'Branches containing commit', args: { name: 'commit' } }
      ]
    },
    {
      name: 'checkout',
      description: 'Switch branches or restore files',
      args: { name: 'branch', generators: gitGenerators.branches },
      options: [
        { name: ['-b'], description: 'Create and checkout branch', args: { name: 'branch' } },
        { name: ['-B'], description: 'Create/reset and checkout branch', args: { name: 'branch' } },
        { name: ['-t', '--track'], description: 'Set up tracking' },
        { name: '--no-track', description: 'Do not set up tracking' },
        { name: ['-f', '--force'], description: 'Force checkout' },
        { name: '--detach', description: 'Detach HEAD' },
        { name: ['-m', '--merge'], description: 'Merge local modifications' },
        { name: '--orphan', description: 'Create orphan branch', args: { name: 'branch' } },
        { name: ['-p', '--patch'], description: 'Select hunks interactively' }
      ]
    },
    {
      name: 'switch',
      description: 'Switch branches',
      args: { name: 'branch', generators: gitGenerators.branches },
      options: [
        { name: ['-c', '--create'], description: 'Create and switch', args: { name: 'branch' } },
        { name: ['-C', '--force-create'], description: 'Force create and switch', args: { name: 'branch' } },
        { name: ['-d', '--detach'], description: 'Detach HEAD' },
        { name: ['-f', '--force'], description: 'Force switch' },
        { name: ['-t', '--track'], description: 'Set up tracking' },
        { name: '--no-track', description: 'Do not set up tracking' },
        { name: '--orphan', description: 'Create orphan branch', args: { name: 'branch' } }
      ]
    },
    
    // Merge Commands
    {
      name: 'merge',
      description: 'Join development histories together',
      args: { name: 'branch', generators: gitGenerators.branches },
      options: [
        { name: '--no-ff', description: 'Create merge commit' },
        { name: '--ff-only', description: 'Fast-forward only' },
        { name: '--squash', description: 'Squash commits' },
        { name: ['-m', '--message'], description: 'Merge commit message', args: { name: 'message' } },
        { name: '--abort', description: 'Abort merge' },
        { name: '--continue', description: 'Continue merge' },
        { name: '--no-commit', description: 'Perform merge without commit' },
        { name: ['-s', '--strategy'], description: 'Merge strategy', args: { name: 'strategy', suggestions: s('recursive', 'resolve', 'octopus', 'ours', 'subtree') } },
        { name: ['-X', '--strategy-option'], description: 'Strategy option', args: { name: 'option', suggestions: s('ours', 'theirs', 'patience', 'ignore-space-change') } },
        { name: '--allow-unrelated-histories', description: 'Allow unrelated histories' },
        { name: ['-S', '--gpg-sign'], description: 'GPG sign merge commit', args: { name: 'keyid', isOptional: true } }
      ]
    },
    {
      name: 'rebase',
      description: 'Reapply commits on top of another base',
      args: { name: 'upstream', isOptional: true, generators: gitGenerators.branches },
      options: [
        { name: ['-i', '--interactive'], description: 'Interactive rebase' },
        { name: '--onto', description: 'Rebase onto branch', args: { name: 'newbase', generators: gitGenerators.branches } },
        { name: '--abort', description: 'Abort rebase' },
        { name: '--continue', description: 'Continue rebase' },
        { name: '--skip', description: 'Skip current patch' },
        { name: '--edit-todo', description: 'Edit todo list' },
        { name: ['-m', '--merge'], description: 'Use merging strategies' },
        { name: ['-s', '--strategy'], description: 'Merge strategy', args: { name: 'strategy' } },
        { name: ['-X', '--strategy-option'], description: 'Strategy option', args: { name: 'option' } },
        { name: '--root', description: 'Rebase all reachable commits' },
        { name: '--autosquash', description: 'Automatic squash/fixup' },
        { name: '--no-autosquash', description: 'Disable autosquash' },
        { name: '--autostash', description: 'Stash before rebase' },
        { name: ['-S', '--gpg-sign'], description: 'GPG sign commits', args: { name: 'keyid', isOptional: true } }
      ]
    },
    {
      name: 'cherry-pick',
      description: 'Apply changes from existing commits',
      args: { name: 'commit', isVariadic: true },
      options: [
        { name: ['-e', '--edit'], description: 'Edit commit message' },
        { name: ['-n', '--no-commit'], description: 'Apply without commit' },
        { name: ['-x'], description: 'Record original commit' },
        { name: '--abort', description: 'Abort cherry-pick' },
        { name: '--continue', description: 'Continue cherry-pick' },
        { name: '--skip', description: 'Skip current commit' },
        { name: ['-m', '--mainline'], description: 'Parent number', args: { name: 'parent' } },
        { name: ['-S', '--gpg-sign'], description: 'GPG sign commits', args: { name: 'keyid', isOptional: true } }
      ]
    },
    
    // Remote Commands
    {
      name: 'remote',
      description: 'Manage remote repositories',
      subcommands: [
        { name: 'add', description: 'Add remote', args: [{ name: 'name' }, { name: 'url' }], options: [{ name: ['-t', '--track'], description: 'Track branch', args: { name: 'branch' } }, { name: ['-f', '--fetch'], description: 'Fetch after adding' }] },
        { name: 'remove', description: 'Remove remote', args: { name: 'name', generators: gitGenerators.remotes } },
        { name: 'rename', description: 'Rename remote', args: [{ name: 'old', generators: gitGenerators.remotes }, { name: 'new' }] },
        { name: 'set-url', description: 'Set remote URL', args: [{ name: 'name', generators: gitGenerators.remotes }, { name: 'url' }], options: [{ name: '--push', description: 'Set push URL' }] },
        { name: 'get-url', description: 'Get remote URL', args: { name: 'name', generators: gitGenerators.remotes }, options: [{ name: '--push', description: 'Get push URL' }, { name: '--all', description: 'Get all URLs' }] },
        { name: 'show', description: 'Show remote info', args: { name: 'name', generators: gitGenerators.remotes } },
        { name: 'prune', description: 'Prune stale branches', args: { name: 'name', generators: gitGenerators.remotes }, options: [{ name: ['-n', '--dry-run'], description: 'Dry run' }] },
        { name: 'update', description: 'Fetch updates', args: { name: 'group', isOptional: true }, options: [{ name: ['-p', '--prune'], description: 'Prune stale branches' }] }
      ],
      options: [
        { name: ['-v', '--verbose'], description: 'Verbose output' }
      ]
    },
    {
      name: 'fetch',
      description: 'Download objects and refs from remote',
      args: [
        { name: 'remote', isOptional: true, generators: gitGenerators.remotes },
        { name: 'refspec', isOptional: true }
      ],
      options: [
        { name: '--all', description: 'Fetch all remotes' },
        { name: ['-p', '--prune'], description: 'Prune stale refs' },
        { name: '--prune-tags', description: 'Prune stale tags' },
        { name: ['-t', '--tags'], description: 'Fetch tags' },
        { name: '--no-tags', description: 'Do not fetch tags' },
        { name: '--depth', description: 'Shallow fetch depth', args: { name: 'depth' } },
        { name: '--unshallow', description: 'Convert shallow to complete' },
        { name: ['-f', '--force'], description: 'Force update refs' },
        { name: ['-j', '--jobs'], description: 'Parallel fetches', args: { name: 'n' } }
      ]
    },
    {
      name: 'pull',
      description: 'Fetch and integrate changes',
      args: [
        { name: 'remote', isOptional: true, generators: gitGenerators.remotes },
        { name: 'branch', isOptional: true, generators: gitGenerators.branches }
      ],
      options: [
        { name: '--rebase', description: 'Rebase instead of merge', args: { name: 'mode', isOptional: true, suggestions: s('false', 'true', 'merges', 'interactive') } },
        { name: '--no-rebase', description: 'Do not rebase' },
        { name: '--ff-only', description: 'Fast-forward only' },
        { name: '--no-ff', description: 'Create merge commit' },
        { name: '--squash', description: 'Squash commits' },
        { name: '--autostash', description: 'Stash before pull' },
        { name: ['-t', '--tags'], description: 'Fetch tags' },
        { name: ['-p', '--prune'], description: 'Prune stale refs' },
        { name: ['-j', '--jobs'], description: 'Parallel fetches', args: { name: 'n' } }
      ]
    },
    {
      name: 'push',
      description: 'Update remote refs',
      args: [
        { name: 'remote', isOptional: true, generators: gitGenerators.remotes },
        { name: 'refspec', isOptional: true, generators: gitGenerators.branches }
      ],
      options: [
        { name: ['-u', '--set-upstream'], description: 'Set upstream' },
        { name: ['-f', '--force'], description: 'Force push' },
        { name: '--force-with-lease', description: 'Force if remote unchanged', args: { name: 'refname', isOptional: true } },
        { name: '--all', description: 'Push all branches' },
        { name: '--tags', description: 'Push tags' },
        { name: ['-d', '--delete'], description: 'Delete remote ref' },
        { name: '--prune', description: 'Prune local refs' },
        { name: ['-n', '--dry-run'], description: 'Dry run' },
        { name: '--no-verify', description: 'Skip pre-push hooks' },
        { name: ['-o', '--push-option'], description: 'Push option', args: { name: 'option' } }
      ]
    },
    
    // Inspection Commands
    {
      name: 'status',
      description: 'Show working tree status',
      options: [
        { name: ['-s', '--short'], description: 'Short format' },
        { name: ['-b', '--branch'], description: 'Show branch info' },
        { name: '--porcelain', description: 'Machine-readable format', args: { name: 'version', isOptional: true, suggestions: s('v1', 'v2') } },
        { name: ['-u', '--untracked-files'], description: 'Show untracked files', args: { name: 'mode', suggestions: s('no', 'normal', 'all') } },
        { name: '--ignored', description: 'Show ignored files', args: { name: 'mode', isOptional: true, suggestions: s('traditional', 'no', 'matching') } },
        { name: ['-v', '--verbose'], description: 'Verbose output' }
      ]
    },
    {
      name: 'log',
      description: 'Show commit logs',
      args: { name: 'revision', isOptional: true },
      options: [
        { name: ['-n', '--max-count'], description: 'Limit commits', args: { name: 'number', suggestions: s('5', '10', '20', '50') } },
        { name: '--oneline', description: 'One line per commit' },
        { name: '--graph', description: 'Draw ASCII graph' },
        { name: '--decorate', description: 'Print ref names', args: { name: 'style', isOptional: true, suggestions: s('short', 'full', 'auto', 'no') } },
        { name: '--all', description: 'Show all refs' },
        { name: ['-p', '--patch'], description: 'Show diffs' },
        { name: '--stat', description: 'Show diffstat' },
        { name: '--shortstat', description: 'Show short diffstat' },
        { name: '--name-only', description: 'Show file names only' },
        { name: '--name-status', description: 'Show file names and status' },
        { name: '--pretty', description: 'Pretty format', args: { name: 'format', suggestions: s('oneline', 'short', 'medium', 'full', 'fuller', 'email', 'raw') } },
        { name: '--format', description: 'Format string', args: { name: 'format' } },
        { name: '--author', description: 'Filter by author', args: { name: 'pattern' } },
        { name: '--grep', description: 'Filter by message', args: { name: 'pattern' } },
        { name: '--since', description: 'Commits since date', args: { name: 'date' } },
        { name: '--until', description: 'Commits until date', args: { name: 'date' } },
        { name: '--after', description: 'Commits after date', args: { name: 'date' } },
        { name: '--before', description: 'Commits before date', args: { name: 'date' } },
        { name: ['-S'], description: 'Filter by string change', args: { name: 'string' } },
        { name: ['-G'], description: 'Filter by regex change', args: { name: 'regex' } },
        { name: '--follow', description: 'Follow file history' },
        { name: '--first-parent', description: 'Follow only first parent' },
        { name: '--merges', description: 'Show only merges' },
        { name: '--no-merges', description: 'Hide merges' }
      ]
    },
    {
      name: 'diff',
      description: 'Show changes between commits',
      args: [
        { name: 'commit', isOptional: true, generators: gitGenerators.branches },
        { name: 'commit', isOptional: true, generators: gitGenerators.branches }
      ],
      options: [
        { name: '--cached', description: 'Diff staged changes' },
        { name: '--staged', description: 'Diff staged changes' },
        { name: '--stat', description: 'Show diffstat' },
        { name: '--shortstat', description: 'Show short diffstat' },
        { name: '--numstat', description: 'Show numeric diffstat' },
        { name: '--name-only', description: 'Show file names only' },
        { name: '--name-status', description: 'Show file names and status' },
        { name: '--no-index', description: 'Compare two paths' },
        { name: ['-p', '--patch'], description: 'Generate patch' },
        { name: '--raw', description: 'Raw output format' },
        { name: '--word-diff', description: 'Word diff', args: { name: 'mode', isOptional: true, suggestions: s('color', 'plain', 'porcelain', 'none') } },
        { name: '--color', description: 'Show colored diff', args: { name: 'when', suggestions: s('always', 'never', 'auto') } },
        { name: '--no-color', description: 'Disable colors' },
        { name: '-U', description: 'Context lines', args: { name: 'n' } },
        { name: '--ignore-space-change', description: 'Ignore space changes' },
        { name: '--ignore-all-space', description: 'Ignore all spaces' },
        { name: '--ignore-blank-lines', description: 'Ignore blank line changes' }
      ]
    },
    {
      name: 'show',
      description: 'Show various types of objects',
      args: { name: 'object', isOptional: true },
      options: [
        { name: '--stat', description: 'Show diffstat' },
        { name: '--name-only', description: 'Show file names only' },
        { name: '--name-status', description: 'Show file names and status' },
        { name: '--pretty', description: 'Pretty format', args: { name: 'format', suggestions: s('oneline', 'short', 'medium', 'full', 'fuller', 'email', 'raw') } },
        { name: '--format', description: 'Format string', args: { name: 'format' } },
        { name: ['-s', '--no-patch'], description: 'Suppress diff output' }
      ]
    },
    {
      name: 'blame',
      description: 'Show what revision last modified each line',
      args: { name: 'file', template: 'filepaths' },
      options: [
        { name: ['-L'], description: 'Line range', args: { name: 'start,end' } },
        { name: ['-l'], description: 'Show long revision' },
        { name: ['-s'], description: 'Suppress author and timestamp' },
        { name: ['-w'], description: 'Ignore whitespace' },
        { name: ['-M'], description: 'Detect moved lines' },
        { name: ['-C'], description: 'Detect copied lines' },
        { name: '--color-lines', description: 'Color lines by age' },
        { name: '--color-by-age', description: 'Color by commit age' }
      ]
    },
    
    // Stash Commands
    {
      name: 'stash',
      description: 'Stash changes in dirty working directory',
      subcommands: [
        { name: 'push', description: 'Save changes to stash', args: { name: 'pathspec', isOptional: true, isVariadic: true, template: 'filepaths' }, options: [{ name: ['-m', '--message'], description: 'Stash message', args: { name: 'message' } }, { name: ['-p', '--patch'], description: 'Select hunks interactively' }, { name: ['-k', '--keep-index'], description: 'Keep staged changes' }, { name: ['-u', '--include-untracked'], description: 'Include untracked files' }, { name: ['-a', '--all'], description: 'Include ignored files' }] },
        { name: 'pop', description: 'Apply and remove stash', args: { name: 'stash', isOptional: true, generators: gitGenerators.stashes }, options: [{ name: '--index', description: 'Restore index too' }] },
        { name: 'apply', description: 'Apply stash', args: { name: 'stash', isOptional: true, generators: gitGenerators.stashes }, options: [{ name: '--index', description: 'Restore index too' }] },
        { name: 'drop', description: 'Remove stash', args: { name: 'stash', isOptional: true, generators: gitGenerators.stashes } },
        { name: 'list', description: 'List stashes' },
        { name: 'show', description: 'Show stash changes', args: { name: 'stash', isOptional: true, generators: gitGenerators.stashes }, options: [{ name: ['-p', '--patch'], description: 'Show diff' }] },
        { name: 'branch', description: 'Create branch from stash', args: [{ name: 'branch' }, { name: 'stash', isOptional: true, generators: gitGenerators.stashes }] },
        { name: 'clear', description: 'Remove all stashes' }
      ],
      options: [
        { name: ['-m', '--message'], description: 'Stash message', args: { name: 'message' } },
        { name: ['-p', '--patch'], description: 'Select hunks interactively' },
        { name: ['-k', '--keep-index'], description: 'Keep staged changes' },
        { name: ['-u', '--include-untracked'], description: 'Include untracked files' },
        { name: ['-a', '--all'], description: 'Include ignored files' }
      ]
    },
    
    // Tag Commands
    {
      name: 'tag',
      description: 'Create, list, delete or verify tags',
      args: [
        { name: 'tagname', isOptional: true },
        { name: 'commit', isOptional: true }
      ],
      options: [
        { name: ['-a', '--annotate'], description: 'Create annotated tag' },
        { name: ['-s', '--sign'], description: 'Create signed tag' },
        { name: ['-u', '--local-user'], description: 'GPG sign with key', args: { name: 'keyid' } },
        { name: ['-f', '--force'], description: 'Replace existing tag' },
        { name: ['-d', '--delete'], description: 'Delete tag' },
        { name: ['-v', '--verify'], description: 'Verify tag signature' },
        { name: ['-l', '--list'], description: 'List tags', args: { name: 'pattern', isOptional: true } },
        { name: ['-m', '--message'], description: 'Tag message', args: { name: 'message' } },
        { name: ['-F', '--file'], description: 'Read message from file', args: { name: 'file', template: 'filepaths' } },
        { name: '--sort', description: 'Sort tags', args: { name: 'key', suggestions: s('version:refname', '-version:refname', 'creatordate', '-creatordate') } },
        { name: '--contains', description: 'Tags containing commit', args: { name: 'commit' } }
      ]
    },
    
    // Config Commands
    {
      name: 'config',
      description: 'Get and set repository or global options',
      args: [
        { name: 'name', isOptional: true },
        { name: 'value', isOptional: true }
      ],
      options: [
        { name: '--global', description: 'Use global config' },
        { name: '--system', description: 'Use system config' },
        { name: '--local', description: 'Use repository config' },
        { name: '--worktree', description: 'Use worktree config' },
        { name: ['-l', '--list'], description: 'List all variables' },
        { name: ['-e', '--edit'], description: 'Edit config file' },
        { name: '--unset', description: 'Unset value' },
        { name: '--unset-all', description: 'Unset all matching' },
        { name: '--get', description: 'Get value' },
        { name: '--get-all', description: 'Get all values' },
        { name: '--get-regexp', description: 'Get matching values' },
        { name: '--add', description: 'Add new value' },
        { name: '--replace-all', description: 'Replace all matching' }
      ]
    },
    
    // Misc Commands
    {
      name: 'clean',
      description: 'Remove untracked files',
      args: { name: 'path', isOptional: true, isVariadic: true, template: 'filepaths' },
      options: [
        { name: ['-d'], description: 'Remove directories' },
        { name: ['-f', '--force'], description: 'Force clean' },
        { name: ['-i', '--interactive'], description: 'Interactive mode' },
        { name: ['-n', '--dry-run'], description: 'Dry run' },
        { name: ['-x'], description: 'Remove ignored files too' },
        { name: ['-X'], description: 'Remove only ignored files' },
        { name: ['-e', '--exclude'], description: 'Exclude pattern', args: { name: 'pattern' } }
      ]
    },
    {
      name: 'revert',
      description: 'Revert existing commits',
      args: { name: 'commit', isVariadic: true },
      options: [
        { name: ['-e', '--edit'], description: 'Edit commit message' },
        { name: ['-n', '--no-commit'], description: 'Revert without commit' },
        { name: ['-m', '--mainline'], description: 'Parent number', args: { name: 'parent' } },
        { name: '--abort', description: 'Abort revert' },
        { name: '--continue', description: 'Continue revert' },
        { name: '--skip', description: 'Skip current commit' }
      ]
    },
    {
      name: 'bisect',
      description: 'Find commit that introduced a bug',
      subcommands: [
        { name: 'start', description: 'Start bisect', args: [{ name: 'bad', isOptional: true }, { name: 'good', isOptional: true }] },
        { name: 'bad', description: 'Mark commit as bad', args: { name: 'rev', isOptional: true } },
        { name: 'good', description: 'Mark commit as good', args: { name: 'rev', isOptional: true } },
        { name: 'skip', description: 'Skip commit', args: { name: 'rev', isOptional: true } },
        { name: 'reset', description: 'End bisect' },
        { name: 'run', description: 'Run script', args: { name: 'cmd' } },
        { name: 'log', description: 'Show bisect log' },
        { name: 'replay', description: 'Replay bisect log', args: { name: 'file', template: 'filepaths' } }
      ]
    },
    {
      name: 'worktree',
      description: 'Manage multiple working trees',
      subcommands: [
        { name: 'add', description: 'Create working tree', args: [{ name: 'path', template: 'folders' }, { name: 'commit', isOptional: true, generators: gitGenerators.branches }], options: [{ name: ['-b'], description: 'Create new branch', args: { name: 'branch' } }, { name: ['-B'], description: 'Create/reset branch', args: { name: 'branch' } }, { name: ['-d', '--detach'], description: 'Detached HEAD' }] },
        { name: 'list', description: 'List working trees', options: [{ name: '--porcelain', description: 'Machine-readable output' }] },
        { name: 'move', description: 'Move working tree', args: [{ name: 'worktree' }, { name: 'new-path', template: 'folders' }] },
        { name: 'remove', description: 'Remove working tree', args: { name: 'worktree' }, options: [{ name: ['-f', '--force'], description: 'Force remove' }] },
        { name: 'prune', description: 'Prune working tree info', options: [{ name: ['-n', '--dry-run'], description: 'Dry run' }] },
        { name: 'lock', description: 'Lock working tree', args: { name: 'worktree' }, options: [{ name: '--reason', description: 'Lock reason', args: { name: 'reason' } }] },
        { name: 'unlock', description: 'Unlock working tree', args: { name: 'worktree' } }
      ]
    },
    {
      name: 'submodule',
      description: 'Initialize, update or inspect submodules',
      subcommands: [
        { name: 'add', description: 'Add submodule', args: [{ name: 'repository' }, { name: 'path', isOptional: true, template: 'folders' }], options: [{ name: ['-b', '--branch'], description: 'Track branch', args: { name: 'branch' } }, { name: ['-f', '--force'], description: 'Force add' }] },
        { name: 'init', description: 'Initialize submodules', args: { name: 'path', isOptional: true, isVariadic: true, template: 'folders' } },
        { name: 'deinit', description: 'Unregister submodules', args: { name: 'path', isVariadic: true, template: 'folders' }, options: [{ name: ['-f', '--force'], description: 'Force deinit' }, { name: '--all', description: 'Deinit all' }] },
        { name: 'update', description: 'Update submodules', args: { name: 'path', isOptional: true, isVariadic: true, template: 'folders' }, options: [{ name: '--init', description: 'Initialize first' }, { name: '--recursive', description: 'Update recursively' }, { name: ['-f', '--force'], description: 'Force update' }, { name: '--remote', description: 'Use remote tracking branch' }, { name: '--merge', description: 'Merge remote changes' }, { name: '--rebase', description: 'Rebase on remote changes' }] },
        { name: 'status', description: 'Show submodule status', args: { name: 'path', isOptional: true, isVariadic: true, template: 'folders' }, options: [{ name: '--recursive', description: 'Recursive status' }] },
        { name: 'foreach', description: 'Run command in each submodule', args: { name: 'command' }, options: [{ name: '--recursive', description: 'Run recursively' }] },
        { name: 'sync', description: 'Sync submodule URLs', args: { name: 'path', isOptional: true, isVariadic: true, template: 'folders' }, options: [{ name: '--recursive', description: 'Sync recursively' }] },
        { name: 'absorbgitdirs', description: 'Move .git directories' }
      ]
    },
    {
      name: 'reflog',
      description: 'Manage reflog information',
      subcommands: [
        { name: 'show', description: 'Show reflog', args: { name: 'ref', isOptional: true } },
        { name: 'expire', description: 'Prune old reflog entries', options: [{ name: '--all', description: 'Process all refs' }, { name: ['-n', '--dry-run'], description: 'Dry run' }] },
        { name: 'delete', description: 'Delete reflog entries', args: { name: 'ref' } }
      ],
      args: { name: 'ref', isOptional: true }
    },
    {
      name: 'shortlog',
      description: 'Summarize git log output',
      options: [
        { name: ['-n', '--numbered'], description: 'Sort by number' },
        { name: ['-s', '--summary'], description: 'Suppress descriptions' },
        { name: ['-e', '--email'], description: 'Show email' },
        { name: '--group', description: 'Group commits', args: { name: 'type', suggestions: s('author', 'committer', 'trailer') } }
      ]
    },
    {
      name: 'describe',
      description: 'Give object human readable name',
      args: { name: 'commit', isOptional: true },
      options: [
        { name: '--all', description: 'Use any ref' },
        { name: '--tags', description: 'Use any tag' },
        { name: '--contains', description: 'Find tag after commit' },
        { name: '--abbrev', description: 'Abbreviation length', args: { name: 'n' } },
        { name: '--long', description: 'Always use long format' },
        { name: '--dirty', description: 'Describe working tree', args: { name: 'mark', isOptional: true } }
      ]
    },
    {
      name: 'rev-parse',
      description: 'Parse revision parameters',
      args: { name: 'args', isVariadic: true },
      options: [
        { name: '--verify', description: 'Verify parameter' },
        { name: '--short', description: 'Shorten output', args: { name: 'length', isOptional: true } },
        { name: '--abbrev-ref', description: 'Show ref name' },
        { name: '--symbolic', description: 'Show symbolic refs' },
        { name: '--symbolic-full-name', description: 'Show full ref path' }
      ]
    },
    {
      name: 'ls-files',
      description: 'Show information about files in index',
      options: [
        { name: ['-c', '--cached'], description: 'Show cached files' },
        { name: ['-d', '--deleted'], description: 'Show deleted files' },
        { name: ['-m', '--modified'], description: 'Show modified files' },
        { name: ['-o', '--others'], description: 'Show other files' },
        { name: ['-i', '--ignored'], description: 'Show ignored files' },
        { name: ['-s', '--stage'], description: 'Show staged contents' },
        { name: ['-u', '--unmerged'], description: 'Show unmerged files' }
      ]
    },
    {
      name: 'archive',
      description: 'Create archive of files from tree',
      args: { name: 'tree-ish' },
      options: [
        { name: '--format', description: 'Archive format', args: { name: 'format', suggestions: s('tar', 'zip', 'tar.gz', 'tgz') } },
        { name: '-o', description: 'Output file', args: { name: 'file', template: 'filepaths' } },
        { name: '--prefix', description: 'Prepend prefix to paths', args: { name: 'prefix' } },
        { name: '--remote', description: 'Retrieve from remote', args: { name: 'repo' } }
      ]
    },
    {
      name: 'gc',
      description: 'Cleanup and optimize repository',
      options: [
        { name: '--aggressive', description: 'More aggressive optimization' },
        { name: '--auto', description: 'Auto-detect if needed' },
        { name: '--prune', description: 'Prune loose objects', args: { name: 'date', isOptional: true } },
        { name: '--no-prune', description: 'Do not prune' },
        { name: '--quiet', description: 'Suppress output' }
      ]
    },
    {
      name: 'fsck',
      description: 'Verify connectivity and validity of objects',
      options: [
        { name: '--full', description: 'Full check' },
        { name: '--strict', description: 'Strict checking' },
        { name: '--unreachable', description: 'Show unreachable objects' },
        { name: '--dangling', description: 'Show dangling objects' },
        { name: '--no-reflogs', description: 'Ignore reflog entries' }
      ]
    }
  ],
  options: [
    { name: ['-C'], description: 'Run in directory', args: { name: 'path', template: 'folders' } },
    { name: ['-c'], description: 'Set config option', args: { name: 'name=value' } },
    { name: '--version', description: 'Show version' },
    { name: '--help', description: 'Show help' },
    { name: '--no-pager', description: 'Do not use pager' },
    { name: '--git-dir', description: 'Set git directory', args: { name: 'path', template: 'folders' } },
    { name: '--work-tree', description: 'Set working tree', args: { name: 'path', template: 'folders' } }
  ]
};
