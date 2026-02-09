import { CompletionSpec } from '../types.js';

// Ansible inventory generator
const inventoryGenerator = {
  script: 'find . -maxdepth 3 \\( -name "inventory" -o -name "hosts" -o -name "*.ini" -o -name "*.yml" -o -name "*.yaml" \\) -type f | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Inventory file: ${file}`,
      type: 'file' as const
    }));
  }
};

// Playbook generator
const playbookGenerator = {
  script: 'find . -maxdepth 3 -name "*.yml" -o -name "*.yaml" | grep -E "(playbook|play)" | head -10',
  postProcess: (output: string) => {
    return output.trim().split('\n').filter(f => f).map(file => ({
      name: file.replace('./', ''),
      description: `Playbook: ${file}`,
      type: 'file' as const
    }));
  }
};

// Ansible completion spec
export const ansibleSpec: CompletionSpec = {
  name: 'ansible',
  description: 'Configuration management and orchestration tool',
  options: [
    {
      name: ['-i', '--inventory'],
      description: 'Inventory file path',
      args: {
        name: 'inventory',
        generators: [inventoryGenerator]
      }
    },
    {
      name: ['-m', '--module-name'],
      description: 'Module name',
      args: {
        name: 'module',
        suggestions: [
          { name: 'ping', description: 'Test connectivity' },
          { name: 'setup', description: 'Gather facts' },
          { name: 'command', description: 'Run commands' },
          { name: 'shell', description: 'Execute shell commands' },
          { name: 'copy', description: 'Copy files' },
          { name: 'file', description: 'Manage files and directories' },
          { name: 'service', description: 'Manage services' },
          { name: 'package', description: 'Manage packages' },
          { name: 'user', description: 'Manage users' },
          { name: 'group', description: 'Manage groups' },
          { name: 'template', description: 'Template files' },
          { name: 'git', description: 'Git operations' },
          { name: 'apt', description: 'APT package management' },
          { name: 'yum', description: 'YUM package management' },
          { name: 'systemd', description: 'Systemd service management' }
        ]
      }
    },
    {
      name: ['-a', '--args'],
      description: 'Module arguments',
      args: {
        name: 'args',
        description: 'Module arguments'
      }
    },
    {
      name: ['-u', '--user'],
      description: 'Connect as this user',
      args: {
        name: 'user',
        description: 'Remote user'
      }
    },
    {
      name: ['-k', '--ask-pass'],
      description: 'Ask for connection password'
    },
    {
      name: ['-K', '--ask-become-pass'],
      description: 'Ask for privilege escalation password'
    },
    {
      name: ['-b', '--become'],
      description: 'Run operations with become'
    },
    {
      name: '--become-method',
      description: 'Privilege escalation method',
      args: {
        name: 'method',
        suggestions: [
          { name: 'sudo', description: 'Use sudo' },
          { name: 'su', description: 'Use su' },
          { name: 'doas', description: 'Use doas' },
          { name: 'pbrun', description: 'Use pbrun' }
        ]
      }
    },
    {
      name: '--become-user',
      description: 'Run operations as this user',
      args: {
        name: 'user',
        suggestions: [
          { name: 'root', description: 'Root user' }
        ]
      }
    },
    {
      name: ['-c', '--connection'],
      description: 'Connection type',
      args: {
        name: 'connection',
        suggestions: [
          { name: 'ssh', description: 'SSH connection' },
          { name: 'local', description: 'Local connection' },
          { name: 'docker', description: 'Docker connection' }
        ]
      }
    },
    {
      name: ['-f', '--forks'],
      description: 'Number of parallel processes',
      args: {
        name: 'forks',
        suggestions: [
          { name: '5', description: '5 forks (default)' },
          { name: '10', description: '10 forks' },
          { name: '20', description: '20 forks' }
        ]
      }
    },
    {
      name: ['-v', '--verbose'],
      description: 'Verbose mode (-vvv for more)'
    },
    {
      name: '--check',
      description: 'Run in check mode (dry run)'
    },
    {
      name: '--diff',
      description: 'Show differences when changing files'
    },
    {
      name: ['-l', '--limit'],
      description: 'Limit to subset of hosts',
      args: {
        name: 'subset',
        description: 'Host pattern'
      }
    },
    {
      name: ['-t', '--tree'],
      description: 'Log output to this directory',
      args: {
        name: 'directory',
        template: 'folders'
      }
    },
    {
      name: '--private-key',
      description: 'Private key file',
      args: {
        name: 'key_file',
        template: 'filepaths'
      }
    },
    {
      name: '--ssh-common-args',
      description: 'SSH common arguments',
      args: {
        name: 'args',
        description: 'SSH arguments'
      }
    },
    {
      name: '--timeout',
      description: 'Connection timeout',
      args: {
        name: 'timeout',
        suggestions: [
          { name: '10', description: '10 seconds' },
          { name: '30', description: '30 seconds' },
          { name: '60', description: '60 seconds' }
        ]
      }
    }
  ],
  args: {
    name: 'pattern',
    description: 'Host pattern',
    suggestions: [
      { name: 'all', description: 'All hosts' },
      { name: 'localhost', description: 'Local machine' },
      { name: 'webservers', description: 'Web server group' },
      { name: 'databases', description: 'Database server group' }
    ]
  }
};

// Ansible-playbook completion spec
export const ansiblePlaybookSpec: CompletionSpec = {
  name: 'ansible-playbook',
  description: 'Run Ansible playbooks',
  options: [
    {
      name: ['-i', '--inventory'],
      description: 'Inventory file path',
      args: {
        name: 'inventory',
        generators: [inventoryGenerator]
      }
    },
    {
      name: ['-u', '--user'],
      description: 'Connect as this user',
      args: {
        name: 'user',
        description: 'Remote user'
      }
    },
    {
      name: ['-k', '--ask-pass'],
      description: 'Ask for connection password'
    },
    {
      name: ['-K', '--ask-become-pass'],
      description: 'Ask for privilege escalation password'
    },
    {
      name: ['-b', '--become'],
      description: 'Run operations with become'
    },
    {
      name: '--become-method',
      description: 'Privilege escalation method',
      args: {
        name: 'method',
        suggestions: [
          { name: 'sudo', description: 'Use sudo' },
          { name: 'su', description: 'Use su' },
          { name: 'doas', description: 'Use doas' },
          { name: 'pbrun', description: 'Use pbrun' }
        ]
      }
    },
    {
      name: '--become-user',
      description: 'Run operations as this user',
      args: {
        name: 'user',
        suggestions: [
          { name: 'root', description: 'Root user' }
        ]
      }
    },
    {
      name: ['-c', '--connection'],
      description: 'Connection type',
      args: {
        name: 'connection',
        suggestions: [
          { name: 'ssh', description: 'SSH connection' },
          { name: 'local', description: 'Local connection' },
          { name: 'docker', description: 'Docker connection' }
        ]
      }
    },
    {
      name: ['-f', '--forks'],
      description: 'Number of parallel processes',
      args: {
        name: 'forks',
        suggestions: [
          { name: '5', description: '5 forks (default)' },
          { name: '10', description: '10 forks' },
          { name: '20', description: '20 forks' }
        ]
      }
    },
    {
      name: ['-v', '--verbose'],
      description: 'Verbose mode (-vvv for more)'
    },
    {
      name: '--check',
      description: 'Run in check mode (dry run)'
    },
    {
      name: '--diff',
      description: 'Show differences when changing files'
    },
    {
      name: ['-l', '--limit'],
      description: 'Limit to subset of hosts',
      args: {
        name: 'subset',
        description: 'Host pattern'
      }
    },
    {
      name: ['-t', '--tags'],
      description: 'Only run plays and tasks tagged with these values',
      args: {
        name: 'tags',
        description: 'Tag names (comma-separated)'
      }
    },
    {
      name: '--skip-tags',
      description: 'Skip plays and tasks with these tags',
      args: {
        name: 'tags',
        description: 'Tag names (comma-separated)'
      }
    },
    {
      name: '--start-at-task',
      description: 'Start playbook at this task',
      args: {
        name: 'task',
        description: 'Task name'
      }
    },
    {
      name: '--step',
      description: 'One-step-at-a-time confirmation'
    },
    {
      name: ['-e', '--extra-vars'],
      description: 'Set additional variables',
      args: {
        name: 'vars',
        description: 'key=value pairs or JSON/YAML'
      }
    },
    {
      name: '--vault-id',
      description: 'Vault identity',
      args: {
        name: 'vault_id',
        description: 'Vault identity'
      }
    },
    {
      name: '--vault-password-file',
      description: 'Vault password file',
      args: {
        name: 'file',
        template: 'filepaths'
      }
    },
    {
      name: '--ask-vault-pass',
      description: 'Ask for vault password'
    },
    {
      name: '--private-key',
      description: 'Private key file',
      args: {
        name: 'key_file',
        template: 'filepaths'
      }
    },
    {
      name: '--ssh-common-args',
      description: 'SSH common arguments',
      args: {
        name: 'args',
        description: 'SSH arguments'
      }
    },
    {
      name: '--timeout',
      description: 'Connection timeout',
      args: {
        name: 'timeout',
        suggestions: [
          { name: '10', description: '10 seconds' },
          { name: '30', description: '30 seconds' },
          { name: '60', description: '60 seconds' }
        ]
      }
    },
    {
      name: '--syntax-check',
      description: 'Perform syntax check on playbook'
    },
    {
      name: '--list-hosts',
      description: 'List matching hosts'
    },
    {
      name: '--list-tasks',
      description: 'List tasks that would be executed'
    },
    {
      name: '--list-tags',
      description: 'List available tags'
    }
  ],
  args: {
    name: 'playbook',
    description: 'Playbook file',
    generators: [playbookGenerator],
    isVariadic: true
  }
};