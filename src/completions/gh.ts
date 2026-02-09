// GitHub CLI (gh) completion spec
// Comprehensive completions for GitHub's official CLI tool

import { CompletionSpec, Generator, Suggestion, Subcommand, Option } from '../types.js';

// Helper to create simple suggestions
const s = (...names: string[]): Suggestion[] => names.map(name => ({ name }));

// Generators for dynamic completions
const ghGenerators = {
  // List repositories for the authenticated user
  listRepositories: {
    script: 'gh repo list --limit 100 --json nameWithOwner,description,isPrivate 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      try {
        const repos = JSON.parse(output);
        return repos.map((repo: any) => ({
          name: repo.nameWithOwner,
          description: repo.description || 'Repository',
          icon: repo.isPrivate ? '🔒' : '📂',
          priority: 100
        }));
      } catch {
        return [];
      }
    },
    cache: { ttl: 30000, strategy: 'ttl' as const }
  } as Generator,

  // List pull requests
  listPR: {
    script: 'gh pr list --json number,title,headRefName,state --limit 50 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      try {
        const prs = JSON.parse(output);
        return prs.map((pr: any) => ({
          name: pr.number.toString(),
          description: `${pr.title} (${pr.headRefName})`,
          icon: pr.state === 'OPEN' ? '🟢' : '🔴',
          priority: 100
        }));
      } catch {
        return [];
      }
    },
    cache: { ttl: 15000, strategy: 'ttl' as const }
  } as Generator,

  // List issues
  listIssues: {
    script: 'gh issue list --json number,title,state --limit 50 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      try {
        const issues = JSON.parse(output);
        return issues.map((issue: any) => ({
          name: issue.number.toString(),
          description: issue.title,
          icon: issue.state === 'OPEN' ? '🟢' : '🟣',
          priority: 100
        }));
      } catch {
        return [];
      }
    },
    cache: { ttl: 15000, strategy: 'ttl' as const }
  } as Generator,

  // List releases
  listReleases: {
    script: 'gh release list --json tagName,name,isDraft,isPrerelease --limit 30 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      try {
        const releases = JSON.parse(output);
        return releases.map((r: any) => ({
          name: r.tagName,
          description: r.name || r.tagName,
          icon: r.isDraft ? '📝' : r.isPrerelease ? '🔶' : '🏷️',
          priority: 100
        }));
      } catch {
        return [];
      }
    },
    cache: { ttl: 30000, strategy: 'ttl' as const }
  } as Generator,

  // List workflows
  listWorkflows: {
    script: 'gh workflow list --json name,state --limit 50 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      try {
        const workflows = JSON.parse(output);
        return workflows.map((w: any) => ({
          name: w.name,
          description: `Workflow (${w.state})`,
          icon: w.state === 'active' ? '✅' : '⏸️',
          priority: 100
        }));
      } catch {
        return [];
      }
    },
    cache: { ttl: 30000, strategy: 'ttl' as const }
  } as Generator,

  // List runs
  listRuns: {
    script: 'gh run list --json databaseId,displayTitle,status,conclusion --limit 30 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      try {
        const runs = JSON.parse(output);
        return runs.map((r: any) => ({
          name: r.databaseId.toString(),
          description: r.displayTitle,
          icon: r.conclusion === 'success' ? '✅' : r.conclusion === 'failure' ? '❌' : '🔄',
          priority: 100
        }));
      } catch {
        return [];
      }
    },
    cache: { ttl: 10000, strategy: 'ttl' as const }
  } as Generator,

  // List aliases
  listAliases: {
    script: 'gh alias list 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      return output.split('\n').filter(line => line.includes(':')).map(line => {
        const [name, ...rest] = line.split(':');
        return {
          name: name.trim(),
          description: `Alias: ${rest.join(':').trim()}`,
          icon: '⚡',
          priority: 100
        };
      });
    },
    cache: { ttl: 60000, strategy: 'ttl' as const }
  } as Generator,

  // List gists
  listGists: {
    script: 'gh gist list --limit 30 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      return output.split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split('\t');
        return {
          name: parts[0] || line,
          description: parts[1] || 'Gist',
          icon: '📝',
          priority: 100
        };
      });
    },
    cache: { ttl: 30000, strategy: 'ttl' as const }
  } as Generator,

  // List SSH keys
  listSSHKeys: {
    script: 'gh ssh-key list 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      return output.split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split('\t');
        return {
          name: parts[0] || line,
          description: 'SSH Key',
          icon: '🔑',
          priority: 100
        };
      });
    },
    cache: { ttl: 60000, strategy: 'ttl' as const }
  } as Generator,

  // List GPG keys
  listGPGKeys: {
    script: 'gh gpg-key list 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      return output.split('\n').filter(line => line.trim()).map(line => ({
        name: line.split('\t')[0] || line,
        description: 'GPG Key',
        icon: '🔐',
        priority: 100
      }));
    },
    cache: { ttl: 60000, strategy: 'ttl' as const }
  } as Generator,

  // List labels
  listLabels: {
    script: 'gh label list --json name,description,color --limit 100 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      try {
        const labels = JSON.parse(output);
        return labels.map((l: any) => ({
          name: l.name,
          description: l.description || 'Label',
          icon: '🏷️',
          priority: 100
        }));
      } catch {
        return [];
      }
    },
    cache: { ttl: 30000, strategy: 'ttl' as const }
  } as Generator,

  // Git branches
  gitBranches: {
    script: 'git branch -a --no-color 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      return output.split('\n').filter(line => line.trim() && !line.includes('HEAD')).map(line => {
        const name = line.replace('*', '').replace('remotes/origin/', '').trim();
        const isCurrent = line.startsWith('*');
        return {
          name,
          description: isCurrent ? 'Current branch' : 'Branch',
          icon: isCurrent ? '⭐' : '🌿',
          priority: isCurrent ? 100 : 75
        };
      });
    },
    cache: { ttl: 5000, strategy: 'ttl' as const }
  } as Generator,

  // Codespaces
  listCodespaces: {
    script: 'gh codespace list --json name,displayName,state --limit 30 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      try {
        const codespaces = JSON.parse(output);
        return codespaces.map((c: any) => ({
          name: c.name,
          description: c.displayName || c.name,
          icon: c.state === 'Available' ? '🟢' : '🟡',
          priority: 100
        }));
      } catch {
        return [];
      }
    },
    cache: { ttl: 15000, strategy: 'ttl' as const }
  } as Generator,

  // Environments
  listEnvironments: {
    script: 'gh api repos/{owner}/{repo}/environments --jq ".environments[].name" 2>/dev/null',
    postProcess: (output: string) => {
      if (!output || output.trim() === '') return [];
      return output.split('\n').filter(line => line.trim()).map(name => ({
        name,
        description: 'Environment',
        icon: '🌍',
        priority: 100
      }));
    },
    cache: { ttl: 30000, strategy: 'ttl' as const }
  } as Generator
};

// Common options used across commands
const repoOption: Option = {
  name: ['-R', '--repo'],
  description: 'Select another repository using [HOST/]OWNER/REPO format',
  args: { name: 'repo', generators: ghGenerators.listRepositories }
};

const jsonOption: Option = {
  name: '--json',
  description: 'Output JSON with specified fields',
  args: { name: 'fields' }
};

const jqOption: Option = {
  name: ['-q', '--jq'],
  description: 'Filter JSON output using jq syntax',
  args: { name: 'expression' }
};

const templateOption: Option = {
  name: ['-t', '--template'],
  description: 'Format output using Go template',
  args: { name: 'template' }
};

const webOption: Option = {
  name: ['-w', '--web'],
  description: 'Open in web browser'
};

const limitOption: Option = {
  name: ['-L', '--limit'],
  description: 'Maximum number of items to fetch',
  args: { name: 'number', suggestions: s('10', '25', '50', '100') }
};

// PR subcommands
const prSubcommands: Subcommand[] = [
  {
    name: 'checkout',
    description: 'Check out a pull request in git',
    args: { name: 'number', generators: ghGenerators.listPR },
    options: [
      { name: ['-b', '--branch'], description: 'Local branch name', args: { name: 'branch' } },
      { name: '--detach', description: 'Checkout PR in detached HEAD state' },
      { name: ['-f', '--force'], description: 'Reset branch even if it already exists' },
      { name: '--recurse-submodules', description: 'Update submodules after checkout' }
    ]
  },
  {
    name: 'checks',
    description: 'Show CI status for a pull request',
    args: { name: 'number', isOptional: true, generators: ghGenerators.listPR },
    options: [
      { name: '--fail-fast', description: 'Exit watch mode on first check failure' },
      { name: ['-i', '--interval'], description: 'Refresh interval', args: { name: 'seconds' } },
      { name: '--required', description: 'Only show required checks' },
      { name: '--watch', description: 'Watch for check status updates' },
      webOption
    ]
  },
  {
    name: 'close',
    description: 'Close a pull request',
    args: { name: 'number', generators: ghGenerators.listPR },
    options: [
      { name: ['-c', '--comment'], description: 'Add comment when closing', args: { name: 'text' } },
      { name: ['-d', '--delete-branch'], description: 'Delete local and remote branch' }
    ]
  },
  {
    name: 'comment',
    description: 'Add a comment to a pull request',
    args: { name: 'number', generators: ghGenerators.listPR },
    options: [
      { name: ['-b', '--body'], description: 'Comment body', args: { name: 'text' } },
      { name: ['-F', '--body-file'], description: 'Read body from file', args: { name: 'file', template: 'filepaths' } },
      { name: ['-e', '--editor'], description: 'Open editor for body' },
      webOption
    ]
  },
  {
    name: 'create',
    description: 'Create a pull request',
    options: [
      { name: ['-a', '--assignee'], description: 'Assign users', args: { name: 'users' } },
      { name: ['-B', '--base'], description: 'Base branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: ['-b', '--body'], description: 'PR body', args: { name: 'text' } },
      { name: ['-F', '--body-file'], description: 'Read body from file', args: { name: 'file', template: 'filepaths' } },
      { name: ['-d', '--draft'], description: 'Create as draft PR' },
      { name: ['-f', '--fill'], description: 'Use commit info for title/body' },
      { name: '--fill-first', description: 'Use first commit info' },
      { name: ['-H', '--head'], description: 'Head branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: ['-l', '--label'], description: 'Add labels', args: { name: 'labels', generators: ghGenerators.listLabels } },
      { name: ['-m', '--milestone'], description: 'Add to milestone', args: { name: 'milestone' } },
      { name: '--no-maintainer-edit', description: 'Disallow maintainer edits' },
      { name: ['-p', '--project'], description: 'Add to project', args: { name: 'project' } },
      { name: '--recover', description: 'Recover from failed create', args: { name: 'file', template: 'filepaths' } },
      { name: ['-r', '--reviewer'], description: 'Request reviews', args: { name: 'users' } },
      { name: ['-t', '--title'], description: 'PR title', args: { name: 'title' } },
      webOption
    ]
  },
  {
    name: 'diff',
    description: 'View changes in a pull request',
    args: { name: 'number', isOptional: true, generators: ghGenerators.listPR },
    options: [
      { name: '--color', description: 'Color output', args: { name: 'when', suggestions: s('always', 'never', 'auto') } },
      { name: '--name-only', description: 'Show only file names' },
      { name: '--patch', description: 'Show patch format' }
    ]
  },
  {
    name: 'edit',
    description: 'Edit a pull request',
    args: { name: 'number', generators: ghGenerators.listPR },
    options: [
      { name: '--add-assignee', description: 'Add assignees', args: { name: 'users' } },
      { name: '--add-label', description: 'Add labels', args: { name: 'labels', generators: ghGenerators.listLabels } },
      { name: '--add-project', description: 'Add to project', args: { name: 'project' } },
      { name: '--add-reviewer', description: 'Add reviewers', args: { name: 'users' } },
      { name: ['-B', '--base'], description: 'Change base branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: ['-b', '--body'], description: 'Set body', args: { name: 'text' } },
      { name: ['-F', '--body-file'], description: 'Read body from file', args: { name: 'file', template: 'filepaths' } },
      { name: ['-m', '--milestone'], description: 'Set milestone', args: { name: 'milestone' } },
      { name: '--remove-assignee', description: 'Remove assignees', args: { name: 'users' } },
      { name: '--remove-label', description: 'Remove labels', args: { name: 'labels', generators: ghGenerators.listLabels } },
      { name: '--remove-project', description: 'Remove from project', args: { name: 'project' } },
      { name: '--remove-reviewer', description: 'Remove reviewers', args: { name: 'users' } },
      { name: ['-t', '--title'], description: 'Set title', args: { name: 'title' } }
    ]
  },
  {
    name: 'list',
    description: 'List pull requests',
    options: [
      { name: ['-a', '--assignee'], description: 'Filter by assignee', args: { name: 'user' } },
      { name: ['-A', '--author'], description: 'Filter by author', args: { name: 'user' } },
      { name: ['-B', '--base'], description: 'Filter by base branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: ['-d', '--draft'], description: 'Filter by draft state' },
      { name: ['-H', '--head'], description: 'Filter by head branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: ['-l', '--label'], description: 'Filter by label', args: { name: 'label', generators: ghGenerators.listLabels } },
      limitOption,
      { name: ['-S', '--search'], description: 'Search query', args: { name: 'query' } },
      { name: ['-s', '--state'], description: 'Filter by state', args: { name: 'state', suggestions: s('open', 'closed', 'merged', 'all') } },
      jsonOption, jqOption, templateOption, webOption
    ]
  },
  {
    name: 'merge',
    description: 'Merge a pull request',
    args: { name: 'number', isOptional: true, generators: ghGenerators.listPR },
    options: [
      { name: '--admin', description: 'Use admin privileges to merge' },
      { name: '--auto', description: 'Enable auto-merge' },
      { name: ['-b', '--body'], description: 'Merge commit body', args: { name: 'text' } },
      { name: ['-F', '--body-file'], description: 'Read body from file', args: { name: 'file', template: 'filepaths' } },
      { name: ['-d', '--delete-branch'], description: 'Delete branch after merge' },
      { name: '--disable-auto', description: 'Disable auto-merge' },
      { name: ['-m', '--merge'], description: 'Merge commit' },
      { name: ['-r', '--rebase'], description: 'Rebase and merge' },
      { name: ['-s', '--squash'], description: 'Squash and merge' },
      { name: ['-t', '--subject'], description: 'Merge commit subject', args: { name: 'text' } }
    ]
  },
  {
    name: 'ready',
    description: 'Mark a draft PR as ready for review',
    args: { name: 'number', isOptional: true, generators: ghGenerators.listPR },
    options: [
      { name: '--undo', description: 'Convert ready PR back to draft' }
    ]
  },
  {
    name: 'reopen',
    description: 'Reopen a closed pull request',
    args: { name: 'number', generators: ghGenerators.listPR },
    options: [
      { name: ['-c', '--comment'], description: 'Add comment when reopening', args: { name: 'text' } }
    ]
  },
  {
    name: 'review',
    description: 'Add a review to a pull request',
    args: { name: 'number', isOptional: true, generators: ghGenerators.listPR },
    options: [
      { name: ['-a', '--approve'], description: 'Approve the PR' },
      { name: ['-b', '--body'], description: 'Review body', args: { name: 'text' } },
      { name: ['-F', '--body-file'], description: 'Read body from file', args: { name: 'file', template: 'filepaths' } },
      { name: ['-c', '--comment'], description: 'Comment without approval' },
      { name: ['-r', '--request-changes'], description: 'Request changes' }
    ]
  },
  {
    name: 'status',
    description: 'Show status of relevant PRs',
    options: [
      { name: ['-c', '--conflict-status'], description: 'Show merge conflict status' },
      jsonOption, jqOption, templateOption
    ]
  },
  {
    name: 'view',
    description: 'View a pull request',
    args: { name: 'number', isOptional: true, generators: ghGenerators.listPR },
    options: [
      { name: ['-c', '--comments'], description: 'View comments' },
      jsonOption, jqOption, templateOption, webOption
    ]
  }
];

// Issue subcommands
const issueSubcommands: Subcommand[] = [
  {
    name: 'close',
    description: 'Close an issue',
    args: { name: 'number', generators: ghGenerators.listIssues },
    options: [
      { name: ['-c', '--comment'], description: 'Add comment when closing', args: { name: 'text' } },
      { name: ['-r', '--reason'], description: 'Reason for closing', args: { name: 'reason', suggestions: s('completed', 'not planned', 'reopened') } }
    ]
  },
  {
    name: 'comment',
    description: 'Add a comment to an issue',
    args: { name: 'number', generators: ghGenerators.listIssues },
    options: [
      { name: ['-b', '--body'], description: 'Comment body', args: { name: 'text' } },
      { name: ['-F', '--body-file'], description: 'Read body from file', args: { name: 'file', template: 'filepaths' } },
      { name: ['-e', '--editor'], description: 'Open editor for body' },
      webOption
    ]
  },
  {
    name: 'create',
    description: 'Create a new issue',
    options: [
      { name: ['-a', '--assignee'], description: 'Assign users', args: { name: 'users' } },
      { name: ['-b', '--body'], description: 'Issue body', args: { name: 'text' } },
      { name: ['-F', '--body-file'], description: 'Read body from file', args: { name: 'file', template: 'filepaths' } },
      { name: ['-l', '--label'], description: 'Add labels', args: { name: 'labels', generators: ghGenerators.listLabels } },
      { name: ['-m', '--milestone'], description: 'Add to milestone', args: { name: 'milestone' } },
      { name: ['-p', '--project'], description: 'Add to project', args: { name: 'project' } },
      { name: '--recover', description: 'Recover from failed create', args: { name: 'file', template: 'filepaths' } },
      { name: ['-t', '--title'], description: 'Issue title', args: { name: 'title' } },
      webOption
    ]
  },
  {
    name: 'delete',
    description: 'Delete an issue',
    args: { name: 'number', generators: ghGenerators.listIssues },
    options: [
      { name: '--yes', description: 'Skip confirmation prompt' }
    ]
  },
  {
    name: 'develop',
    description: 'Create a branch to work on an issue',
    args: { name: 'number', generators: ghGenerators.listIssues },
    options: [
      { name: ['-b', '--base'], description: 'Base branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: ['-c', '--checkout'], description: 'Checkout the branch after creating it' },
      { name: ['-l', '--list'], description: 'List branches for the issue' },
      { name: ['-n', '--name'], description: 'Branch name', args: { name: 'name' } }
    ]
  },
  {
    name: 'edit',
    description: 'Edit an issue',
    args: { name: 'number', generators: ghGenerators.listIssues },
    options: [
      { name: '--add-assignee', description: 'Add assignees', args: { name: 'users' } },
      { name: '--add-label', description: 'Add labels', args: { name: 'labels', generators: ghGenerators.listLabels } },
      { name: '--add-project', description: 'Add to project', args: { name: 'project' } },
      { name: ['-b', '--body'], description: 'Set body', args: { name: 'text' } },
      { name: ['-F', '--body-file'], description: 'Read body from file', args: { name: 'file', template: 'filepaths' } },
      { name: ['-m', '--milestone'], description: 'Set milestone', args: { name: 'milestone' } },
      { name: '--remove-assignee', description: 'Remove assignees', args: { name: 'users' } },
      { name: '--remove-label', description: 'Remove labels', args: { name: 'labels', generators: ghGenerators.listLabels } },
      { name: '--remove-project', description: 'Remove from project', args: { name: 'project' } },
      { name: ['-t', '--title'], description: 'Set title', args: { name: 'title' } }
    ]
  },
  {
    name: 'list',
    description: 'List issues',
    options: [
      { name: ['-a', '--assignee'], description: 'Filter by assignee', args: { name: 'user' } },
      { name: ['-A', '--author'], description: 'Filter by author', args: { name: 'user' } },
      { name: ['-l', '--label'], description: 'Filter by label', args: { name: 'label', generators: ghGenerators.listLabels } },
      limitOption,
      { name: ['-m', '--milestone'], description: 'Filter by milestone', args: { name: 'milestone' } },
      { name: ['-S', '--search'], description: 'Search query', args: { name: 'query' } },
      { name: ['-s', '--state'], description: 'Filter by state', args: { name: 'state', suggestions: s('open', 'closed', 'all') } },
      jsonOption, jqOption, templateOption, webOption
    ]
  },
  {
    name: 'lock',
    description: 'Lock an issue',
    args: { name: 'number', generators: ghGenerators.listIssues },
    options: [
      { name: ['-r', '--reason'], description: 'Reason for locking', args: { name: 'reason', suggestions: s('off-topic', 'resolved', 'spam', 'too heated') } }
    ]
  },
  {
    name: 'pin',
    description: 'Pin an issue',
    args: { name: 'number', generators: ghGenerators.listIssues }
  },
  {
    name: 'reopen',
    description: 'Reopen a closed issue',
    args: { name: 'number', generators: ghGenerators.listIssues },
    options: [
      { name: ['-c', '--comment'], description: 'Add comment when reopening', args: { name: 'text' } }
    ]
  },
  {
    name: 'status',
    description: 'Show status of relevant issues',
    options: [jsonOption, jqOption, templateOption]
  },
  {
    name: 'transfer',
    description: 'Transfer an issue to another repository',
    args: [
      { name: 'number', generators: ghGenerators.listIssues },
      { name: 'destination-repo', generators: ghGenerators.listRepositories }
    ]
  },
  {
    name: 'unlock',
    description: 'Unlock an issue',
    args: { name: 'number', generators: ghGenerators.listIssues }
  },
  {
    name: 'unpin',
    description: 'Unpin an issue',
    args: { name: 'number', generators: ghGenerators.listIssues }
  },
  {
    name: 'view',
    description: 'View an issue',
    args: { name: 'number', generators: ghGenerators.listIssues },
    options: [
      { name: ['-c', '--comments'], description: 'View comments' },
      jsonOption, jqOption, templateOption, webOption
    ]
  }
];

// Repo subcommands
const repoSubcommands: Subcommand[] = [
  {
    name: 'archive',
    description: 'Archive a repository',
    args: { name: 'repository', isOptional: true, generators: ghGenerators.listRepositories },
    options: [
      { name: ['-y', '--yes'], description: 'Skip confirmation prompt' }
    ]
  },
  {
    name: 'clone',
    description: 'Clone a repository locally',
    args: { name: 'repository', generators: ghGenerators.listRepositories },
    options: [
      { name: ['-u', '--upstream-remote-name'], description: 'Upstream remote name', args: { name: 'name' } },
      { name: '--', description: 'Pass flags to git clone', args: { name: 'git-flags', isVariadic: true } }
    ]
  },
  {
    name: 'create',
    description: 'Create a new repository',
    args: { name: 'name', isOptional: true },
    options: [
      { name: ['-c', '--clone'], description: 'Clone repository after creating' },
      { name: ['-d', '--description'], description: 'Repository description', args: { name: 'description' } },
      { name: '--disable-issues', description: 'Disable issues' },
      { name: '--disable-wiki', description: 'Disable wiki' },
      { name: ['-g', '--gitignore'], description: 'Add gitignore template', args: { name: 'template' } },
      { name: ['-h', '--homepage'], description: 'Homepage URL', args: { name: 'url' } },
      { name: '--include-all-branches', description: 'Include all branches from template' },
      { name: '--internal', description: 'Make repository internal' },
      { name: ['-l', '--license'], description: 'Add license', args: { name: 'license' } },
      { name: '--private', description: 'Make repository private' },
      { name: '--public', description: 'Make repository public' },
      { name: '--push', description: 'Push local commits to the new repository' },
      { name: ['-r', '--remote'], description: 'Remote name', args: { name: 'name' } },
      { name: ['-s', '--source'], description: 'Path to local repository', args: { name: 'path', template: 'folders' } },
      { name: ['-t', '--team'], description: 'Team with write access', args: { name: 'team' } },
      { name: ['-p', '--template'], description: 'Create from template repository', args: { name: 'repo', generators: ghGenerators.listRepositories } }
    ]
  },
  {
    name: 'delete',
    description: 'Delete a repository',
    args: { name: 'repository', generators: ghGenerators.listRepositories },
    options: [
      { name: '--yes', description: 'Skip confirmation prompt' }
    ]
  },
  {
    name: 'deploy-key',
    description: 'Manage deploy keys',
    subcommands: [
      { name: 'add', description: 'Add a deploy key', args: { name: 'key-file', template: 'filepaths' }, options: [{ name: ['-t', '--title'], description: 'Key title', args: { name: 'title' } }, { name: ['-w', '--allow-write'], description: 'Allow write access' }] },
      { name: 'delete', description: 'Delete a deploy key', args: { name: 'key-id' } },
      { name: 'list', description: 'List deploy keys', options: [jsonOption, jqOption, templateOption] }
    ]
  },
  {
    name: 'edit',
    description: 'Edit repository settings',
    args: { name: 'repository', isOptional: true, generators: ghGenerators.listRepositories },
    options: [
      { name: '--add-topic', description: 'Add topics', args: { name: 'topics' } },
      { name: '--allow-forking', description: 'Allow forking', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--default-branch', description: 'Set default branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: '--delete-branch-on-merge', description: 'Delete branch after merge', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: ['-d', '--description'], description: 'Set description', args: { name: 'description' } },
      { name: '--enable-auto-merge', description: 'Enable auto-merge', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--enable-discussions', description: 'Enable discussions', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--enable-issues', description: 'Enable issues', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--enable-merge-commit', description: 'Enable merge commits', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--enable-projects', description: 'Enable projects', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--enable-rebase-merge', description: 'Enable rebase merge', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--enable-squash-merge', description: 'Enable squash merge', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--enable-wiki', description: 'Enable wiki', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: ['-h', '--homepage'], description: 'Set homepage', args: { name: 'url' } },
      { name: '--remove-topic', description: 'Remove topics', args: { name: 'topics' } },
      { name: '--template', description: 'Make template repository', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--visibility', description: 'Set visibility', args: { name: 'visibility', suggestions: s('public', 'private', 'internal') } }
    ]
  },
  {
    name: 'fork',
    description: 'Create a fork of a repository',
    args: { name: 'repository', isOptional: true, generators: ghGenerators.listRepositories },
    options: [
      { name: '--clone', description: 'Clone fork after creating' },
      { name: '--default-branch-only', description: 'Only include default branch' },
      { name: '--fork-name', description: 'Fork name', args: { name: 'name' } },
      { name: '--org', description: 'Create fork in organization', args: { name: 'org' } },
      { name: '--remote', description: 'Add remote for fork' },
      { name: '--remote-name', description: 'Remote name', args: { name: 'name' } }
    ]
  },
  {
    name: 'list',
    description: 'List repositories',
    args: { name: 'owner', isOptional: true },
    options: [
      { name: '--archived', description: 'Show only archived repos' },
      { name: '--fork', description: 'Show only forks' },
      { name: ['-l', '--language'], description: 'Filter by language', args: { name: 'language' } },
      limitOption,
      { name: '--no-archived', description: 'Exclude archived repos' },
      { name: '--source', description: 'Show only non-forks' },
      { name: '--topic', description: 'Filter by topic', args: { name: 'topic' } },
      { name: '--visibility', description: 'Filter by visibility', args: { name: 'visibility', suggestions: s('public', 'private', 'internal') } },
      jsonOption, jqOption, templateOption
    ]
  },
  {
    name: 'rename',
    description: 'Rename a repository',
    args: [
      { name: 'repository', generators: ghGenerators.listRepositories },
      { name: 'new-name' }
    ],
    options: [
      { name: ['-y', '--yes'], description: 'Skip confirmation prompt' }
    ]
  },
  {
    name: 'set-default',
    description: 'Set the default remote repository',
    args: { name: 'repository', isOptional: true, generators: ghGenerators.listRepositories },
    options: [
      { name: ['-u', '--unset'], description: 'Unset current default' },
      { name: ['-v', '--view'], description: 'View current default' }
    ]
  },
  {
    name: 'sync',
    description: 'Sync a fork with its upstream',
    args: { name: 'repository', isOptional: true, generators: ghGenerators.listRepositories },
    options: [
      { name: ['-b', '--branch'], description: 'Branch to sync', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: '--force', description: 'Force sync' },
      { name: ['-s', '--source'], description: 'Source repository', args: { name: 'repo', generators: ghGenerators.listRepositories } }
    ]
  },
  {
    name: 'unarchive',
    description: 'Unarchive a repository',
    args: { name: 'repository', generators: ghGenerators.listRepositories },
    options: [
      { name: ['-y', '--yes'], description: 'Skip confirmation prompt' }
    ]
  },
  {
    name: 'view',
    description: 'View a repository',
    args: { name: 'repository', isOptional: true, generators: ghGenerators.listRepositories },
    options: [
      { name: ['-b', '--branch'], description: 'View specific branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      jsonOption, jqOption, templateOption, webOption
    ]
  }
];

// Release subcommands
const releaseSubcommands: Subcommand[] = [
  {
    name: 'create',
    description: 'Create a new release',
    args: { name: 'tag', isOptional: true },
    options: [
      { name: '--discussion-category', description: 'Discussion category', args: { name: 'category' } },
      { name: ['-d', '--draft'], description: 'Create as draft' },
      { name: '--generate-notes', description: 'Auto-generate release notes' },
      { name: ['-n', '--notes'], description: 'Release notes', args: { name: 'notes' } },
      { name: ['-F', '--notes-file'], description: 'Read notes from file', args: { name: 'file', template: 'filepaths' } },
      { name: '--notes-start-tag', description: 'Tag to start generating notes from', args: { name: 'tag' } },
      { name: ['-p', '--prerelease'], description: 'Mark as prerelease' },
      { name: '--target', description: 'Target branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: ['-t', '--title'], description: 'Release title', args: { name: 'title' } },
      { name: '--verify-tag', description: 'Abort if tag does not exist' }
    ]
  },
  {
    name: 'delete',
    description: 'Delete a release',
    args: { name: 'tag', generators: ghGenerators.listReleases },
    options: [
      { name: '--cleanup-tag', description: 'Delete associated tag' },
      { name: ['-y', '--yes'], description: 'Skip confirmation prompt' }
    ]
  },
  {
    name: 'delete-asset',
    description: 'Delete a release asset',
    args: [
      { name: 'tag', generators: ghGenerators.listReleases },
      { name: 'asset-name' }
    ],
    options: [
      { name: ['-y', '--yes'], description: 'Skip confirmation prompt' }
    ]
  },
  {
    name: 'download',
    description: 'Download release assets',
    args: { name: 'tag', isOptional: true, generators: ghGenerators.listReleases },
    options: [
      { name: ['-A', '--archive'], description: 'Download archive', args: { name: 'format', suggestions: s('zip', 'tar.gz') } },
      { name: '--clobber', description: 'Overwrite existing files' },
      { name: ['-D', '--dir'], description: 'Download directory', args: { name: 'dir', template: 'folders' } },
      { name: ['-O', '--output'], description: 'Output filename', args: { name: 'file' } },
      { name: ['-p', '--pattern'], description: 'Download matching patterns', args: { name: 'pattern' } },
      { name: '--skip-existing', description: 'Skip files that already exist' }
    ]
  },
  {
    name: 'edit',
    description: 'Edit a release',
    args: { name: 'tag', generators: ghGenerators.listReleases },
    options: [
      { name: '--discussion-category', description: 'Discussion category', args: { name: 'category' } },
      { name: '--draft', description: 'Mark as draft', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--latest', description: 'Mark as latest', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: ['-n', '--notes'], description: 'Release notes', args: { name: 'notes' } },
      { name: ['-F', '--notes-file'], description: 'Read notes from file', args: { name: 'file', template: 'filepaths' } },
      { name: '--prerelease', description: 'Mark as prerelease', args: { name: 'bool', suggestions: s('true', 'false') } },
      { name: '--tag', description: 'Change tag name', args: { name: 'tag' } },
      { name: '--target', description: 'Target branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: ['-t', '--title'], description: 'Release title', args: { name: 'title' } }
    ]
  },
  {
    name: 'list',
    description: 'List releases',
    options: [
      { name: '--exclude-drafts', description: 'Exclude drafts' },
      { name: '--exclude-pre-releases', description: 'Exclude prereleases' },
      limitOption,
      jsonOption, jqOption, templateOption
    ]
  },
  {
    name: 'upload',
    description: 'Upload release assets',
    args: [
      { name: 'tag', generators: ghGenerators.listReleases },
      { name: 'files', isVariadic: true, template: 'filepaths' }
    ],
    options: [
      { name: '--clobber', description: 'Overwrite existing assets' }
    ]
  },
  {
    name: 'view',
    description: 'View a release',
    args: { name: 'tag', isOptional: true, generators: ghGenerators.listReleases },
    options: [
      jsonOption, jqOption, templateOption, webOption
    ]
  }
];

// Workflow/Run subcommands
const runSubcommands: Subcommand[] = [
  {
    name: 'cancel',
    description: 'Cancel a workflow run',
    args: { name: 'run-id', generators: ghGenerators.listRuns }
  },
  {
    name: 'delete',
    description: 'Delete a workflow run',
    args: { name: 'run-id', generators: ghGenerators.listRuns }
  },
  {
    name: 'download',
    description: 'Download artifacts from a run',
    args: { name: 'run-id', isOptional: true, generators: ghGenerators.listRuns },
    options: [
      { name: ['-D', '--dir'], description: 'Download directory', args: { name: 'dir', template: 'folders' } },
      { name: ['-n', '--name'], description: 'Artifact name', args: { name: 'name' } },
      { name: ['-p', '--pattern'], description: 'Matching pattern', args: { name: 'pattern' } }
    ]
  },
  {
    name: 'list',
    description: 'List workflow runs',
    options: [
      { name: ['-b', '--branch'], description: 'Filter by branch', args: { name: 'branch', generators: ghGenerators.gitBranches } },
      { name: ['-c', '--commit'], description: 'Filter by commit SHA', args: { name: 'sha' } },
      { name: ['-e', '--event'], description: 'Filter by event', args: { name: 'event', suggestions: s('push', 'pull_request', 'workflow_dispatch', 'schedule', 'release') } },
      limitOption,
      { name: ['-s', '--status'], description: 'Filter by status', args: { name: 'status', suggestions: s('queued', 'in_progress', 'completed', 'waiting', 'requested', 'action_required', 'cancelled', 'failure', 'neutral', 'skipped', 'stale', 'success', 'timed_out') } },
      { name: ['-u', '--user'], description: 'Filter by user', args: { name: 'user' } },
      { name: ['-w', '--workflow'], description: 'Filter by workflow', args: { name: 'workflow', generators: ghGenerators.listWorkflows } },
      jsonOption, jqOption, templateOption
    ]
  },
  {
    name: 'rerun',
    description: 'Rerun a failed workflow run',
    args: { name: 'run-id', isOptional: true, generators: ghGenerators.listRuns },
    options: [
      { name: ['-d', '--debug'], description: 'Rerun with debug logging' },
      { name: '--failed', description: 'Only rerun failed jobs' },
      { name: ['-j', '--job'], description: 'Rerun specific job', args: { name: 'job-id' } }
    ]
  },
  {
    name: 'view',
    description: 'View a workflow run',
    args: { name: 'run-id', isOptional: true, generators: ghGenerators.listRuns },
    options: [
      { name: '--exit-status', description: 'Exit with run status' },
      { name: ['-j', '--job'], description: 'View specific job', args: { name: 'job-id' } },
      { name: '--log', description: 'View full log' },
      { name: '--log-failed', description: 'View failed job log' },
      { name: ['-v', '--verbose'], description: 'Show job steps' },
      jsonOption, jqOption, templateOption, webOption
    ]
  },
  {
    name: 'watch',
    description: 'Watch a workflow run',
    args: { name: 'run-id', isOptional: true, generators: ghGenerators.listRuns },
    options: [
      { name: '--exit-status', description: 'Exit with run status' },
      { name: ['-i', '--interval'], description: 'Refresh interval', args: { name: 'seconds' } }
    ]
  }
];

const workflowSubcommands: Subcommand[] = [
  {
    name: 'disable',
    description: 'Disable a workflow',
    args: { name: 'workflow', generators: ghGenerators.listWorkflows }
  },
  {
    name: 'enable',
    description: 'Enable a workflow',
    args: { name: 'workflow', generators: ghGenerators.listWorkflows }
  },
  {
    name: 'list',
    description: 'List workflows',
    options: [
      { name: ['-a', '--all'], description: 'Include disabled workflows' },
      limitOption,
      jsonOption, jqOption, templateOption
    ]
  },
  {
    name: 'run',
    description: 'Run a workflow',
    args: { name: 'workflow', generators: ghGenerators.listWorkflows },
    options: [
      { name: ['-F', '--field'], description: 'Workflow input field', args: { name: 'key=value' } },
      { name: '--json', description: 'JSON input', args: { name: 'json' } },
      { name: ['-r', '--ref'], description: 'Branch/tag to run', args: { name: 'ref', generators: ghGenerators.gitBranches } },
      { name: ['-f', '--raw-field'], description: 'Raw string field', args: { name: 'key=value' } }
    ]
  },
  {
    name: 'view',
    description: 'View a workflow',
    args: { name: 'workflow', isOptional: true, generators: ghGenerators.listWorkflows },
    options: [
      { name: ['-r', '--ref'], description: 'Branch/tag', args: { name: 'ref', generators: ghGenerators.gitBranches } },
      { name: ['-y', '--yaml'], description: 'View workflow YAML' },
      jsonOption, jqOption, templateOption, webOption
    ]
  }
];

// Auth subcommands
const authSubcommands: Subcommand[] = [
  {
    name: 'login',
    description: 'Authenticate with GitHub',
    options: [
      { name: ['-h', '--hostname'], description: 'GitHub hostname', args: { name: 'hostname' } },
      { name: '--insecure-storage', description: 'Save auth in plain text' },
      { name: ['-p', '--git-protocol'], description: 'Git protocol', args: { name: 'protocol', suggestions: s('https', 'ssh') } },
      { name: ['-s', '--scopes'], description: 'Auth scopes', args: { name: 'scopes' } },
      { name: '--skip-ssh-key', description: 'Skip adding SSH key' },
      { name: ['-w', '--web'], description: 'Use web browser for auth' },
      { name: '--with-token', description: 'Read token from stdin' }
    ]
  },
  {
    name: 'logout',
    description: 'Log out of GitHub',
    options: [
      { name: ['-h', '--hostname'], description: 'GitHub hostname', args: { name: 'hostname' } }
    ]
  },
  {
    name: 'refresh',
    description: 'Refresh authentication credentials',
    options: [
      { name: ['-h', '--hostname'], description: 'GitHub hostname', args: { name: 'hostname' } },
      { name: '--insecure-storage', description: 'Save auth in plain text' },
      { name: ['-r', '--remove-scopes'], description: 'Remove scopes', args: { name: 'scopes' } },
      { name: '--reset-scopes', description: 'Reset to default scopes' },
      { name: ['-s', '--scopes'], description: 'Add scopes', args: { name: 'scopes' } }
    ]
  },
  { name: 'setup-git', description: 'Configure git to use GitHub CLI', options: [{ name: ['-h', '--hostname'], description: 'GitHub hostname', args: { name: 'hostname' } }] },
  { name: 'status', description: 'View authentication status', options: [{ name: ['-h', '--hostname'], description: 'GitHub hostname', args: { name: 'hostname' } }, { name: ['-t', '--show-token'], description: 'Show token' }] },
  { name: 'token', description: 'Print authentication token', options: [{ name: ['-h', '--hostname'], description: 'GitHub hostname', args: { name: 'hostname' } }] }
];

// Codespace subcommands
const codespaceSubcommands: Subcommand[] = [
  { name: 'code', description: 'Open codespace in VS Code', args: { name: 'codespace', isOptional: true, generators: ghGenerators.listCodespaces }, options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }, { name: '--insiders', description: 'Use VS Code Insiders' }, webOption] },
  { name: 'cp', description: 'Copy files to/from codespace', args: [{ name: 'source' }, { name: 'destination' }], options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }, { name: ['-e', '--expand'], description: 'Expand remote path' }, { name: ['-r', '--recursive'], description: 'Copy recursively' }] },
  { name: 'create', description: 'Create a codespace', options: [{ name: ['-b', '--branch'], description: 'Branch', args: { name: 'branch', generators: ghGenerators.gitBranches } }, { name: ['-m', '--machine'], description: 'Machine type', args: { name: 'machine' } }, repoOption, { name: '--retention-period', description: 'Retention period', args: { name: 'duration' } }, { name: ['-s', '--status'], description: 'Show status' }] },
  { name: 'delete', description: 'Delete codespaces', options: [{ name: '--all', description: 'Delete all codespaces' }, { name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }, { name: '--days', description: 'Delete older than days', args: { name: 'days' } }, { name: '--force', description: 'Force delete' }, repoOption] },
  { name: 'edit', description: 'Edit a codespace', options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }, { name: ['-d', '--display-name'], description: 'Display name', args: { name: 'name' } }, { name: ['-m', '--machine'], description: 'Machine type', args: { name: 'machine' } }] },
  { name: 'jupyter', description: 'Open Jupyter in browser', options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }] },
  { name: 'list', description: 'List codespaces', options: [limitOption, repoOption, jsonOption, jqOption, templateOption] },
  { name: 'logs', description: 'View codespace logs', options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }, { name: ['-f', '--follow'], description: 'Follow log output' }] },
  { name: 'ports', description: 'List forwarded ports', subcommands: [{ name: 'forward', description: 'Forward ports', args: { name: 'ports' } }, { name: 'visibility', description: 'Set port visibility', args: [{ name: 'port' }, { name: 'visibility', suggestions: s('private', 'org', 'public') }] }], options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }, jsonOption, jqOption, templateOption] },
  { name: 'rebuild', description: 'Rebuild a codespace', options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }, { name: '--full', description: 'Full rebuild' }] },
  { name: 'ssh', description: 'SSH into a codespace', args: { name: 'command', isOptional: true }, options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }, { name: ['-d', '--debug'], description: 'Debug mode' }, { name: '--profile', description: 'SSH config profile', args: { name: 'profile' } }] },
  { name: 'stop', description: 'Stop a codespace', options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }] },
  { name: 'view', description: 'View codespace details', options: [{ name: ['-c', '--codespace'], description: 'Codespace name', args: { name: 'name', generators: ghGenerators.listCodespaces } }, jsonOption, jqOption, templateOption] }
];

// Gist subcommands
const gistSubcommands: Subcommand[] = [
  { name: 'clone', description: 'Clone a gist', args: { name: 'gist', generators: ghGenerators.listGists }, options: [{ name: '--', description: 'Git clone flags', args: { name: 'flags', isVariadic: true } }] },
  { name: 'create', description: 'Create a gist', args: { name: 'files', isVariadic: true, template: 'filepaths' }, options: [{ name: ['-d', '--desc'], description: 'Description', args: { name: 'description' } }, { name: ['-f', '--filename'], description: 'Filename for stdin', args: { name: 'name' } }, { name: ['-p', '--public'], description: 'Make public' }, webOption] },
  { name: 'delete', description: 'Delete a gist', args: { name: 'gist', generators: ghGenerators.listGists } },
  { name: 'edit', description: 'Edit a gist', args: { name: 'gist', generators: ghGenerators.listGists }, options: [{ name: ['-a', '--add'], description: 'Add file', args: { name: 'file', template: 'filepaths' } }, { name: ['-d', '--desc'], description: 'Set description', args: { name: 'description' } }, { name: ['-f', '--filename'], description: 'Edit specific file', args: { name: 'name' } }, { name: ['-r', '--remove'], description: 'Remove file', args: { name: 'name' } }] },
  { name: 'list', description: 'List gists', options: [limitOption, { name: '--public', description: 'Only public gists' }, { name: '--secret', description: 'Only secret gists' }] },
  { name: 'rename', description: 'Rename a gist file', args: [{ name: 'gist', generators: ghGenerators.listGists }, { name: 'old-filename' }, { name: 'new-filename' }] },
  { name: 'view', description: 'View a gist', args: { name: 'gist', isOptional: true, generators: ghGenerators.listGists }, options: [{ name: ['-f', '--filename'], description: 'View specific file', args: { name: 'name' } }, { name: ['-r', '--raw'], description: 'Raw output' }, { name: '--files', description: 'List files only' }, webOption] }
];

// Secret/Variable subcommands
const secretSubcommands: Subcommand[] = [
  { name: 'delete', description: 'Delete a secret', args: { name: 'name' }, options: [{ name: ['-a', '--app'], description: 'App type', args: { name: 'type', suggestions: s('actions', 'codespaces', 'dependabot') } }, { name: ['-e', '--env'], description: 'Environment', args: { name: 'env', generators: ghGenerators.listEnvironments } }, { name: ['-o', '--org'], description: 'Organization', args: { name: 'org' } }] },
  { name: 'list', description: 'List secrets', options: [{ name: ['-a', '--app'], description: 'App type', args: { name: 'type', suggestions: s('actions', 'codespaces', 'dependabot') } }, { name: ['-e', '--env'], description: 'Environment', args: { name: 'env', generators: ghGenerators.listEnvironments } }, { name: ['-o', '--org'], description: 'Organization', args: { name: 'org' } }, jsonOption, jqOption, templateOption] },
  { name: 'set', description: 'Create or update a secret', args: { name: 'name' }, options: [{ name: ['-a', '--app'], description: 'App type', args: { name: 'type', suggestions: s('actions', 'codespaces', 'dependabot') } }, { name: ['-b', '--body'], description: 'Secret value', args: { name: 'value' } }, { name: ['-e', '--env'], description: 'Environment', args: { name: 'env', generators: ghGenerators.listEnvironments } }, { name: ['-f', '--env-file'], description: 'Read from env file', args: { name: 'file', template: 'filepaths' } }, { name: '--no-store', description: "Don't store in credential store" }, { name: ['-o', '--org'], description: 'Organization', args: { name: 'org' } }, { name: ['-v', '--visibility'], description: 'Repository access', args: { name: 'visibility', suggestions: s('all', 'private', 'selected') } }] }
];

const variableSubcommands: Subcommand[] = [
  { name: 'delete', description: 'Delete a variable', args: { name: 'name' }, options: [{ name: ['-e', '--env'], description: 'Environment', args: { name: 'env', generators: ghGenerators.listEnvironments } }, { name: ['-o', '--org'], description: 'Organization', args: { name: 'org' } }] },
  { name: 'get', description: 'Get a variable', args: { name: 'name' }, options: [{ name: ['-e', '--env'], description: 'Environment', args: { name: 'env', generators: ghGenerators.listEnvironments } }, { name: ['-o', '--org'], description: 'Organization', args: { name: 'org' } }, jsonOption, jqOption, templateOption] },
  { name: 'list', description: 'List variables', options: [{ name: ['-e', '--env'], description: 'Environment', args: { name: 'env', generators: ghGenerators.listEnvironments } }, { name: ['-o', '--org'], description: 'Organization', args: { name: 'org' } }, jsonOption, jqOption, templateOption] },
  { name: 'set', description: 'Create or update a variable', args: { name: 'name' }, options: [{ name: ['-b', '--body'], description: 'Variable value', args: { name: 'value' } }, { name: ['-e', '--env'], description: 'Environment', args: { name: 'env', generators: ghGenerators.listEnvironments } }, { name: ['-f', '--env-file'], description: 'Read from env file', args: { name: 'file', template: 'filepaths' } }, { name: ['-o', '--org'], description: 'Organization', args: { name: 'org' } }, { name: ['-v', '--visibility'], description: 'Repository access', args: { name: 'visibility', suggestions: s('all', 'private', 'selected') } }] }
];

export const ghSpec: CompletionSpec = {
  name: 'gh',
  description: "GitHub's official command line tool",
  options: [
    { name: '--help', description: 'Show help' },
    { name: '--version', description: 'Show version' }
  ],
  subcommands: [
    // Core commands
    {
      name: 'pr',
      description: 'Manage pull requests',
      options: [repoOption],
      subcommands: prSubcommands
    },
    {
      name: 'issue',
      description: 'Manage issues',
      options: [repoOption],
      subcommands: issueSubcommands
    },
    {
      name: 'repo',
      description: 'Manage repositories',
      subcommands: repoSubcommands
    },
    {
      name: 'release',
      description: 'Manage releases',
      options: [repoOption],
      subcommands: releaseSubcommands
    },
    
    // Actions
    {
      name: 'run',
      description: 'View and manage workflow runs',
      options: [repoOption],
      subcommands: runSubcommands
    },
    {
      name: 'workflow',
      description: 'View and manage workflows',
      options: [repoOption],
      subcommands: workflowSubcommands
    },
    
    // Auth & Config
    {
      name: 'auth',
      description: 'Authenticate gh and git with GitHub',
      subcommands: authSubcommands
    },
    {
      name: 'config',
      description: 'Manage configuration',
      subcommands: [
        { name: 'get', description: 'Get config value', args: { name: 'key', suggestions: s('git_protocol', 'editor', 'prompt', 'pager', 'http_unix_socket', 'browser') } },
        { name: 'list', description: 'List all config values', options: [{ name: ['-h', '--host'], description: 'Host', args: { name: 'host' } }] },
        { name: 'set', description: 'Set config value', args: [{ name: 'key', suggestions: s('git_protocol', 'editor', 'prompt', 'pager', 'http_unix_socket', 'browser') }, { name: 'value' }], options: [{ name: ['-h', '--host'], description: 'Host', args: { name: 'host' } }] }
      ]
    },
    
    // Codespaces & Gists
    {
      name: 'codespace',
      description: 'Manage Codespaces',
      subcommands: codespaceSubcommands
    },
    {
      name: 'cs',
      description: 'Manage Codespaces (alias)',
      subcommands: codespaceSubcommands
    },
    {
      name: 'gist',
      description: 'Manage gists',
      subcommands: gistSubcommands
    },
    
    // Secrets & Variables
    {
      name: 'secret',
      description: 'Manage secrets',
      options: [repoOption],
      subcommands: secretSubcommands
    },
    {
      name: 'variable',
      description: 'Manage variables',
      options: [repoOption],
      subcommands: variableSubcommands
    },
    
    // SSH & GPG Keys
    {
      name: 'ssh-key',
      description: 'Manage SSH keys',
      subcommands: [
        { name: 'add', description: 'Add SSH key', args: { name: 'key-file', template: 'filepaths' }, options: [{ name: ['-t', '--title'], description: 'Key title', args: { name: 'title' } }, { name: '--type', description: 'Key type', args: { name: 'type', suggestions: s('authentication', 'signing') } }] },
        { name: 'delete', description: 'Delete SSH key', args: { name: 'key-id', generators: ghGenerators.listSSHKeys }, options: [{ name: ['-y', '--yes'], description: 'Skip confirmation' }] },
        { name: 'list', description: 'List SSH keys', options: [jsonOption, jqOption, templateOption] }
      ]
    },
    {
      name: 'gpg-key',
      description: 'Manage GPG keys',
      subcommands: [
        { name: 'add', description: 'Add GPG key', args: { name: 'key-file', template: 'filepaths' } },
        { name: 'delete', description: 'Delete GPG key', args: { name: 'key-id', generators: ghGenerators.listGPGKeys }, options: [{ name: ['-y', '--yes'], description: 'Skip confirmation' }] },
        { name: 'list', description: 'List GPG keys', options: [jsonOption, jqOption, templateOption] }
      ]
    },
    
    // Aliases
    {
      name: 'alias',
      description: 'Create command shortcuts',
      subcommands: [
        { name: 'delete', description: 'Delete alias', args: { name: 'alias', generators: ghGenerators.listAliases } },
        { name: 'import', description: 'Import aliases', args: { name: 'file', template: 'filepaths' }, options: [{ name: '--clobber', description: 'Overwrite existing' }] },
        { name: 'list', description: 'List aliases', options: [jsonOption, jqOption, templateOption] },
        { name: 'set', description: 'Create alias', args: [{ name: 'alias' }, { name: 'expansion' }], options: [{ name: ['-s', '--shell'], description: 'Shell alias' }] }
      ]
    },
    
    // API & Extensions
    {
      name: 'api',
      description: 'Make authenticated GitHub API request',
      args: { name: 'endpoint' },
      options: [
        { name: '--cache', description: 'Cache response', args: { name: 'duration' } },
        { name: ['-F', '--field'], description: 'Request field', args: { name: 'key=value' } },
        { name: ['-H', '--header'], description: 'HTTP header', args: { name: 'header' } },
        { name: '--hostname', description: 'GitHub hostname', args: { name: 'host' } },
        { name: ['-i', '--include'], description: 'Include response headers' },
        { name: '--input', description: 'Input file', args: { name: 'file', template: 'filepaths' } },
        { name: jqOption.name, description: jqOption.description, args: jqOption.args },
        { name: ['-X', '--method'], description: 'HTTP method', args: { name: 'method', suggestions: s('GET', 'POST', 'PUT', 'PATCH', 'DELETE') } },
        { name: '--paginate', description: 'Paginate results' },
        { name: ['-p', '--preview'], description: 'API preview', args: { name: 'names' } },
        { name: ['-f', '--raw-field'], description: 'Raw string field', args: { name: 'key=value' } },
        { name: '--silent', description: 'Suppress output' },
        { name: templateOption.name, description: templateOption.description, args: templateOption.args }
      ]
    },
    {
      name: 'extension',
      description: 'Manage gh extensions',
      subcommands: [
        { name: 'browse', description: 'Browse extensions', options: [{ name: '--debug', description: 'Debug mode' }] },
        { name: 'create', description: 'Create extension', args: { name: 'name' }, options: [{ name: '--precompiled', description: 'Create precompiled extension', args: { name: 'language', suggestions: s('go', 'other') } }] },
        { name: 'exec', description: 'Execute extension', args: { name: 'name' } },
        { name: 'install', description: 'Install extension', args: { name: 'repository', generators: ghGenerators.listRepositories }, options: [{ name: '--force', description: 'Force reinstall' }, { name: '--pin', description: 'Pin to version', args: { name: 'version' } }] },
        { name: 'list', description: 'List installed extensions' },
        { name: 'remove', description: 'Remove extension', args: { name: 'name' } },
        { name: 'search', description: 'Search extensions', args: { name: 'query' }, options: [limitOption, jsonOption, jqOption, templateOption, webOption] },
        { name: 'upgrade', description: 'Upgrade extensions', args: { name: 'name', isOptional: true }, options: [{ name: '--all', description: 'Upgrade all' }, { name: '--dry-run', description: 'Dry run' }, { name: '--force', description: 'Force upgrade' }] }
      ]
    },
    
    // Other commands
    { name: 'browse', description: 'Open repo in browser', options: [{ name: ['-b', '--branch'], description: 'Branch', args: { name: 'branch', generators: ghGenerators.gitBranches } }, { name: ['-c', '--commit'], description: 'Open commit' }, { name: ['-n', '--no-browser'], description: "Print URL only" }, { name: ['-p', '--projects'], description: 'Open projects' }, { name: ['-r', '--releases'], description: 'Open releases' }, { name: ['-s', '--settings'], description: 'Open settings' }, { name: ['-w', '--wiki'], description: 'Open wiki' }, repoOption] },
    { name: 'completion', description: 'Generate shell completion', args: { name: 'shell', suggestions: s('bash', 'zsh', 'fish', 'powershell') } },
    { name: 'label', description: 'Manage labels', options: [repoOption], subcommands: [{ name: 'clone', description: 'Clone labels', args: { name: 'source-repo', generators: ghGenerators.listRepositories }, options: [{ name: ['-f', '--force'], description: 'Overwrite existing' }] }, { name: 'create', description: 'Create label', args: { name: 'name' }, options: [{ name: ['-c', '--color'], description: 'Color', args: { name: 'color' } }, { name: ['-d', '--description'], description: 'Description', args: { name: 'description' } }, { name: ['-f', '--force'], description: 'Update if exists' }] }, { name: 'delete', description: 'Delete label', args: { name: 'name', generators: ghGenerators.listLabels }, options: [{ name: '--yes', description: 'Skip confirmation' }] }, { name: 'edit', description: 'Edit label', args: { name: 'name', generators: ghGenerators.listLabels }, options: [{ name: ['-c', '--color'], description: 'Color', args: { name: 'color' } }, { name: ['-d', '--description'], description: 'Description', args: { name: 'description' } }, { name: ['-n', '--name'], description: 'New name', args: { name: 'name' } }] }, { name: 'list', description: 'List labels', options: [limitOption, jsonOption, jqOption, templateOption, webOption] }] },
    { name: 'search', description: 'Search across GitHub', subcommands: [{ name: 'code', description: 'Search code', args: { name: 'query' }, options: [limitOption, jsonOption, jqOption, templateOption, webOption] }, { name: 'commits', description: 'Search commits', args: { name: 'query' }, options: [limitOption, jsonOption, jqOption, templateOption, webOption] }, { name: 'issues', description: 'Search issues', args: { name: 'query' }, options: [limitOption, jsonOption, jqOption, templateOption, webOption] }, { name: 'prs', description: 'Search PRs', args: { name: 'query' }, options: [limitOption, jsonOption, jqOption, templateOption, webOption] }, { name: 'repos', description: 'Search repos', args: { name: 'query' }, options: [limitOption, jsonOption, jqOption, templateOption, webOption] }] },
    { name: 'status', description: 'View GitHub status', options: [{ name: ['-e', '--exclude'], description: 'Exclude repos', args: { name: 'repos' } }, { name: ['-o', '--org'], description: 'Filter by org', args: { name: 'org' } }] },
    { name: 'version', description: 'Show version' },
    
    // Project commands
    {
      name: 'project',
      description: 'Manage projects',
      subcommands: [
        { name: 'close', description: 'Close a project', args: { name: 'number' }, options: [{ name: '--owner', description: 'Project owner', args: { name: 'owner' } }, { name: '--undo', description: 'Reopen project' }] },
        { name: 'copy', description: 'Copy a project', args: { name: 'number' }, options: [{ name: '--drafts', description: 'Include draft issues' }, { name: '--source-owner', description: 'Source owner', args: { name: 'owner' } }, { name: '--target-owner', description: 'Target owner', args: { name: 'owner' } }, { name: '--title', description: 'New title', args: { name: 'title' } }] },
        { name: 'create', description: 'Create a project', options: [{ name: '--owner', description: 'Project owner', args: { name: 'owner' } }, { name: '--title', description: 'Project title', args: { name: 'title' } }] },
        { name: 'delete', description: 'Delete a project', args: { name: 'number' }, options: [{ name: '--owner', description: 'Project owner', args: { name: 'owner' } }] },
        { name: 'edit', description: 'Edit a project', args: { name: 'number' }, options: [{ name: ['-d', '--description'], description: 'Description', args: { name: 'description' } }, { name: '--owner', description: 'Project owner', args: { name: 'owner' } }, { name: '--readme', description: 'Readme', args: { name: 'readme' } }, { name: '--title', description: 'Title', args: { name: 'title' } }, { name: '--visibility', description: 'Visibility', args: { name: 'visibility', suggestions: s('PUBLIC', 'PRIVATE') } }] },
        { name: 'field-create', description: 'Create field', args: [{ name: 'number' }, { name: 'name' }], options: [{ name: '--data-type', description: 'Data type', args: { name: 'type', suggestions: s('TEXT', 'NUMBER', 'DATE', 'SINGLE_SELECT', 'ITERATION') } }, { name: '--owner', description: 'Project owner', args: { name: 'owner' } }, { name: '--single-select-options', description: 'Options', args: { name: 'options' } }] },
        { name: 'field-delete', description: 'Delete field', args: { name: 'field-id' }, options: [{ name: '--owner', description: 'Project owner', args: { name: 'owner' } }] },
        { name: 'field-list', description: 'List fields', args: { name: 'number' }, options: [{ name: '--owner', description: 'Project owner', args: { name: 'owner' } }, limitOption, jsonOption, jqOption, templateOption] },
        { name: 'item-add', description: 'Add item', args: { name: 'number' }, options: [{ name: '--owner', description: 'Project owner', args: { name: 'owner' } }, { name: '--url', description: 'Issue/PR URL', args: { name: 'url' } }] },
        { name: 'item-archive', description: 'Archive item', args: { name: 'number' }, options: [{ name: '--id', description: 'Item ID', args: { name: 'id' } }, { name: '--owner', description: 'Project owner', args: { name: 'owner' } }, { name: '--undo', description: 'Unarchive item' }] },
        { name: 'item-create', description: 'Create draft item', args: { name: 'number' }, options: [{ name: '--body', description: 'Body', args: { name: 'body' } }, { name: '--owner', description: 'Project owner', args: { name: 'owner' } }, { name: '--title', description: 'Title', args: { name: 'title' } }] },
        { name: 'item-delete', description: 'Delete item', args: { name: 'number' }, options: [{ name: '--id', description: 'Item ID', args: { name: 'id' } }, { name: '--owner', description: 'Project owner', args: { name: 'owner' } }] },
        { name: 'item-edit', description: 'Edit item', args: { name: 'number' }, options: [{ name: '--body', description: 'Body', args: { name: 'body' } }, { name: '--field-id', description: 'Field ID', args: { name: 'id' } }, { name: '--id', description: 'Item ID', args: { name: 'id' } }, { name: '--owner', description: 'Project owner', args: { name: 'owner' } }, { name: '--text', description: 'Text value', args: { name: 'value' } }, { name: '--title', description: 'Title', args: { name: 'title' } }] },
        { name: 'item-list', description: 'List items', args: { name: 'number' }, options: [{ name: '--owner', description: 'Project owner', args: { name: 'owner' } }, limitOption, jsonOption, jqOption, templateOption] },
        { name: 'list', description: 'List projects', options: [{ name: '--closed', description: 'Include closed' }, { name: '--owner', description: 'Project owner', args: { name: 'owner' } }, limitOption, jsonOption, jqOption, templateOption, webOption] },
        { name: 'view', description: 'View project', args: { name: 'number', isOptional: true }, options: [{ name: '--owner', description: 'Project owner', args: { name: 'owner' } }, jsonOption, jqOption, templateOption, webOption] }
      ]
    }
  ]
};
