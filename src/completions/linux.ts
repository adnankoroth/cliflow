import { CompletionSpec, Generator } from '../types.js';
import { processes, envVars } from '../engine/common-generators.js';

// Generator for users
const userGenerator: Generator = {
  script: 'cut -d: -f1 /etc/passwd 2>/dev/null | head -20',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n')
      .filter(line => line.trim())
      .map(user => ({
        name: user.trim(),
        description: `User: ${user.trim()}`,
        type: 'argument' as const,
        icon: '👤',
        priority: 100
      }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const } // 1 minute
};

// Generator for groups
const groupGenerator: Generator = {
  script: 'cut -d: -f1 /etc/group 2>/dev/null | head -20',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n')
      .filter(line => line.trim())
      .map(group => ({
        name: group.trim(),
        description: `Group: ${group.trim()}`,
        type: 'argument' as const,
        icon: '👥',
        priority: 100
      }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const lsSpec: CompletionSpec = {
  name: 'ls',
  description: 'List directory contents',
  args: {
    name: 'paths',
    description: 'Files or directories to list',
    template: 'filepaths',  // Smart path-aware completions
    isOptional: true,
    isVariadic: true
  },
  options: [
    {
      name: ['-l'],
      description: 'Use long listing format'
    },
    {
      name: ['-a', '--all'],
      description: 'Show all files including hidden ones'
    },
    {
      name: ['-h', '--human-readable'],
      description: 'Human readable sizes'
    },
    {
      name: ['-t'],
      description: 'Sort by modification time'
    },
    {
      name: ['-r', '--reverse'],
      description: 'Reverse order while sorting'
    },
    {
      name: ['-S'],
      description: 'Sort by file size'
    },
    {
      name: ['-R', '--recursive'],
      description: 'List subdirectories recursively'
    }
  ]
};

export const cdSpec: CompletionSpec = {
  name: 'cd',
  description: 'Change directory',
  args: {
    name: 'directory',
    description: 'Directory to change to',
    template: 'folders',  // Use built-in template for better path handling
    isOptional: true
  }
};

export const mkdirSpec: CompletionSpec = {
  name: 'mkdir',
  description: 'Create directories',
  args: {
    name: 'directories',
    description: 'Directories to create',
    isVariadic: true
  },
  options: [
    {
      name: ['-p', '--parents'],
      description: 'Create parent directories as needed'
    },
    {
      name: ['-m', '--mode'],
      description: 'Set file mode (permissions)',
      args: {
        name: 'mode',
        description: 'File permission mode'
      }
    }
  ]
};

export const rmSpec: CompletionSpec = {
  name: 'rm',
  description: 'Remove files and directories',
  args: {
    name: 'files',
    description: 'Files or directories to remove',
    template: 'filepaths',  // Smart path-aware completions
    isVariadic: true
  },
  options: [
    {
      name: ['-r', '-R', '--recursive'],
      description: 'Remove directories and their contents recursively'
    },
    {
      name: ['-f', '--force'],
      description: 'Ignore nonexistent files and arguments, never prompt'
    },
    {
      name: ['-i'],
      description: 'Prompt before every removal'
    },
    {
      name: ['-v', '--verbose'],
      description: 'Explain what is being done'
    }
  ]
};

export const cpSpec: CompletionSpec = {
  name: 'cp',
  description: 'Copy files or directories',
  args: [
    {
      name: 'source',
      description: 'Source files or directories',
      template: 'filepaths',  // Smart path-aware completions
      isVariadic: true
    },
    {
      name: 'destination',
      description: 'Destination file or directory',
      template: 'filepaths'
    }
  ],
  options: [
    {
      name: ['-r', '-R', '--recursive'],
      description: 'Copy directories recursively'
    },
    {
      name: ['-f', '--force'],
      description: 'Force copy by removing the destination file if needed'
    },
    {
      name: ['-i', '--interactive'],
      description: 'Prompt before overwrite'
    },
    {
      name: ['-v', '--verbose'],
      description: 'Explain what is being done'
    },
    {
      name: ['-p'],
      description: 'Preserve file attributes'
    }
  ]
};

export const mvSpec: CompletionSpec = {
  name: 'mv',
  description: 'Move or rename files and directories',
  args: [
    {
      name: 'source',
      description: 'Source files or directories',
      template: 'filepaths',  // Smart path-aware completions
      isVariadic: true
    },
    {
      name: 'destination',
      description: 'Destination file or directory',
      template: 'filepaths'
    }
  ],
  options: [
    {
      name: ['-f', '--force'],
      description: 'Force move by overwriting destination files'
    },
    {
      name: ['-i', '--interactive'],
      description: 'Prompt before overwrite'
    },
    {
      name: ['-v', '--verbose'],
      description: 'Explain what is being done'
    }
  ]
};

export const findSpec: CompletionSpec = {
  name: 'find',
  description: 'Search for files and directories',
  args: {
    name: 'path',
    description: 'Starting directory for search',
    template: 'folders',  // Smart path-aware completions
    isOptional: true
  },
  options: [
    {
      name: ['-name'],
      description: 'Base of file name matches shell pattern',
      args: {
        name: 'pattern',
        description: 'File name pattern'
      }
    },
    {
      name: ['-type'],
      description: 'File type',
      args: {
        name: 'type',
        description: 'f=file, d=directory, l=link',
        suggestions: [
          { name: 'f', description: 'Regular file' },
          { name: 'd', description: 'Directory' },
          { name: 'l', description: 'Symbolic link' }
        ]
      }
    },
    {
      name: ['-size'],
      description: 'File size',
      args: {
        name: 'size',
        description: 'File size (e.g., +100k, -1M)'
      }
    },
    {
      name: ['-exec'],
      description: 'Execute command on found files'
    },
    {
      name: ['-delete'],
      description: 'Delete found files'
    }
  ]
};

export const grepSpec: CompletionSpec = {
  name: 'grep',
  description: 'Search text patterns in files',
  args: [
    {
      name: 'pattern',
      description: 'Search pattern'
    },
    {
      name: 'files',
      description: 'Files to search',
      template: 'filepaths',  // Smart path-aware completions (files and folders for recursive)
      isOptional: true,
      isVariadic: true
    }
  ],
  options: [
    {
      name: ['-i', '--ignore-case'],
      description: 'Ignore case distinctions'
    },
    {
      name: ['-v', '--invert-match'],
      description: 'Invert the sense of matching'
    },
    {
      name: ['-r', '--recursive'],
      description: 'Search directories recursively'
    },
    {
      name: ['-n', '--line-number'],
      description: 'Show line numbers'
    },
    {
      name: ['-l', '--files-with-matches'],
      description: 'Show only names of matching files'
    },
    {
      name: ['-c', '--count'],
      description: 'Show only count of matching lines'
    }
  ]
};

export const catSpec: CompletionSpec = {
  name: 'cat',
  description: 'Display file contents',
  args: {
    name: 'files',
    description: 'Files to display',
    template: 'files',  // Smart path-aware completions (files only)
    isVariadic: true
  },
  options: [
    {
      name: ['-n', '--number'],
      description: 'Number all output lines'
    },
    {
      name: ['-b', '--number-nonblank'],
      description: 'Number nonempty output lines'
    },
    {
      name: ['-s', '--squeeze-blank'],
      description: 'Suppress repeated empty output lines'
    }
  ]
};

export const tailSpec: CompletionSpec = {
  name: 'tail',
  description: 'Display the last part of files',
  args: {
    name: 'files',
    description: 'Files to display',
    template: 'files',  // Smart path-aware completions (files only)
    isVariadic: true
  },
  options: [
    {
      name: ['-n', '--lines'],
      description: 'Number of lines to show',
      args: {
        name: 'num',
        description: 'Number of lines'
      }
    },
    {
      name: ['-f', '--follow'],
      description: 'Follow file changes'
    },
    {
      name: ['-c', '--bytes'],
      description: 'Number of bytes to show',
      args: {
        name: 'num',
        description: 'Number of bytes'
      }
    }
  ]
};

export const headSpec: CompletionSpec = {
  name: 'head',
  description: 'Display the first part of files',
  args: {
    name: 'files',
    description: 'Files to display',
    template: 'files',  // Smart path-aware completions (files only)
    isVariadic: true
  },
  options: [
    {
      name: ['-n', '--lines'],
      description: 'Number of lines to show',
      args: {
        name: 'num',
        description: 'Number of lines'
      }
    },
    {
      name: ['-c', '--bytes'],
      description: 'Number of bytes to show',
      args: {
        name: 'num',
        description: 'Number of bytes'
      }
    }
  ]
};

export const psSpec: CompletionSpec = {
  name: 'ps',
  description: 'Show running processes',
  options: [
    {
      name: ['-a'],
      description: 'Show processes for all users'
    },
    {
      name: ['-u'],
      description: 'Display user-oriented format'
    },
    {
      name: ['-x'],
      description: 'Include processes not attached to terminal'
    },
    {
      name: ['-f'],
      description: 'Full format listing'
    },
    {
      name: ['-e'],
      description: 'Show all processes'
    },
    {
      name: ['-o'],
      description: 'Specify output format',
      args: {
        name: 'format',
        description: 'Output format (pid,ppid,user,comm,etc.)'
      }
    }
  ]
};

export const killSpec: CompletionSpec = {
  name: 'kill',
  description: 'Terminate processes',
  args: {
    name: 'pids',
    description: 'Process IDs to kill',
    generators: [processes],
    filterStrategy: 'fuzzy',
    isVariadic: true
  },
  options: [
    {
      name: ['-9'],
      description: 'Force kill (SIGKILL)'
    },
    {
      name: ['-15'],
      description: 'Terminate gracefully (SIGTERM)'
    },
    {
      name: ['-l'],
      description: 'List available signals'
    },
    {
      name: ['-s'],
      description: 'Specify signal to send',
      args: {
        name: 'signal',
        description: 'Signal name or number'
      }
    }
  ]
};

export const chmodSpec: CompletionSpec = {
  name: 'chmod',
  description: 'Change file permissions',
  args: [
    {
      name: 'mode',
      description: 'Permission mode (e.g., 755, u+x, go-w)',
      suggestions: [
        { name: '755', description: 'rwxr-xr-x' },
        { name: '644', description: 'rw-r--r--' },
        { name: '600', description: 'rw-------' },
        { name: 'u+x', description: 'Add execute for owner' },
        { name: 'g+w', description: 'Add write for group' },
        { name: 'o-r', description: 'Remove read for others' }
      ]
    },
    {
      name: 'files',
      description: 'Files to modify',
      template: 'filepaths',  // Smart path-aware completions
      isVariadic: true
    }
  ],
  options: [
    {
      name: ['-R', '--recursive'],
      description: 'Change permissions recursively'
    },
    {
      name: ['-v', '--verbose'],
      description: 'Output a diagnostic for every file processed'
    }
  ]
};

export const chownSpec: CompletionSpec = {
  name: 'chown',
  description: 'Change file ownership',
  args: [
    {
      name: 'owner',
      description: 'New owner (user:group or user)',
      generators: [userGenerator]
    },
    {
      name: 'files',
      description: 'Files to modify',
      template: 'filepaths',  // Smart path-aware completions
      isVariadic: true
    }
  ],
  options: [
    {
      name: ['-R', '--recursive'],
      description: 'Change ownership recursively'
    },
    {
      name: ['-v', '--verbose'],
      description: 'Output a diagnostic for every file processed'
    }
  ]
};

export const tarSpec: CompletionSpec = {
  name: 'tar',
  description: 'Archive files',
  args: {
    name: 'files',
    description: 'Files to archive or archive to extract',
    template: 'filepaths',  // Smart path-aware completions
    isVariadic: true
  },
  options: [
    {
      name: ['-c', '--create'],
      description: 'Create a new archive'
    },
    {
      name: ['-x', '--extract'],
      description: 'Extract files from archive'
    },
    {
      name: ['-t', '--list'],
      description: 'List contents of archive'
    },
    {
      name: ['-f', '--file'],
      description: 'Specify archive file name',
      args: {
        name: 'archive',
        description: 'Archive file name',
        template: 'files'  // Smart path-aware completions
      }
    },
    {
      name: ['-v', '--verbose'],
      description: 'Verbose output'
    },
    {
      name: ['-z', '--gzip'],
      description: 'Filter through gzip'
    },
    {
      name: ['-j', '--bzip2'],
      description: 'Filter through bzip2'
    }
  ]
};

export const wgetSpec: CompletionSpec = {
  name: 'wget',
  description: 'Download files from web',
  args: {
    name: 'urls',
    description: 'URLs to download',
    isVariadic: true
  },
  options: [
    {
      name: ['-O', '--output-document'],
      description: 'Write output to file',
      args: {
        name: 'file',
        description: 'Output file name'
      }
    },
    {
      name: ['-c', '--continue'],
      description: 'Resume partial download'
    },
    {
      name: ['-r', '--recursive'],
      description: 'Turn on recursive retrieving'
    },
    {
      name: ['-np', '--no-parent'],
      description: 'Do not ascend to parent directory'
    },
    {
      name: ['-q', '--quiet'],
      description: 'Quiet mode'
    }
  ]
};

export const curlSpec: CompletionSpec = {
  name: 'curl',
  description: 'Transfer data from servers',
  args: {
    name: 'urls',
    description: 'URLs to request',
    isVariadic: true
  },
  options: [
    {
      name: ['-o', '--output'],
      description: 'Write output to file',
      args: {
        name: 'file',
        description: 'Output file name'
      }
    },
    {
      name: ['-O', '--remote-name'],
      description: 'Write output to file named like remote file'
    },
    {
      name: ['-L', '--location'],
      description: 'Follow redirects'
    },
    {
      name: ['-H', '--header'],
      description: 'Add header to request',
      args: {
        name: 'header',
        description: 'Header string'
      }
    },
    {
      name: ['-X', '--request'],
      description: 'Specify request method',
      args: {
        name: 'method',
        description: 'HTTP method',
        suggestions: [
          { name: 'GET', description: 'GET request' },
          { name: 'POST', description: 'POST request' },
          { name: 'PUT', description: 'PUT request' },
          { name: 'DELETE', description: 'DELETE request' }
        ]
      }
    },
    {
      name: ['-d', '--data'],
      description: 'Send data in POST request',
      args: {
        name: 'data',
        description: 'Data to send'
      }
    }
  ]
};

export const sshSpec: CompletionSpec = {
  name: 'ssh',
  description: 'Secure Shell remote login',
  args: {
    name: 'destination',
    description: 'user@hostname or hostname'
  },
  options: [
    {
      name: ['-p'],
      description: 'Port to connect to',
      args: {
        name: 'port',
        description: 'Port number'
      }
    },
    {
      name: ['-i'],
      description: 'Identity file (private key)',
      args: {
        name: 'identity_file',
        description: 'Private key file',
        template: 'files'  // Smart path-aware completions
      }
    },
    {
      name: ['-l'],
      description: 'Login name',
      args: {
        name: 'login_name',
        description: 'User name'
      }
    },
    {
      name: ['-v'],
      description: 'Verbose mode'
    }
  ]
};

export const scpSpec: CompletionSpec = {
  name: 'scp',
  description: 'Secure copy files over SSH',
  args: [
    {
      name: 'source',
      description: 'Source file or remote file',
      template: 'filepaths'  // Smart path-aware completions
    },
    {
      name: 'destination',
      description: 'Destination file or remote destination',
      template: 'filepaths'
    }
  ],
  options: [
    {
      name: ['-r'],
      description: 'Recursively copy directories'
    },
    {
      name: ['-p'],
      description: 'Preserve file attributes'
    },
    {
      name: ['-P'],
      description: 'Port to connect to',
      args: {
        name: 'port',
        description: 'Port number'
      }
    },
    {
      name: ['-i'],
      description: 'Identity file (private key)',
      args: {
        name: 'identity_file',
        description: 'Private key file',
        template: 'files'  // Smart path-aware completions
      }
    }
  ]
};