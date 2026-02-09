// CLIFlow Generators - Dynamic completion generators
import { readdirSync, statSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import { execSync } from 'child_process';
import { Generator, Suggestion } from '../types.js';

/**
 * File generator - lists files in the current directory
 */
export const fileGenerator: Generator = {
  script: 'ls -1a',
  postProcess: (output: string, context?: { cwd?: string }): Suggestion[] => {
    const cwd = context?.cwd || process.cwd();
    try {
      const entries = readdirSync(cwd);
      return entries
        .filter(entry => {
          const fullPath = join(cwd, entry);
          try {
            return statSync(fullPath).isFile();
          } catch {
            return false;
          }
        })
        .map(file => ({
          name: file,
          description: 'File',
          icon: '📄',
          type: 'file' as const,
        }));
    } catch {
      return [];
    }
  }
};

/**
 * Folder generator - lists directories in the current directory
 */
export const folderGenerator: Generator = {
  script: 'ls -1d */',
  postProcess: (output: string, context?: { cwd?: string }): Suggestion[] => {
    const cwd = context?.cwd || process.cwd();
    try {
      const entries = readdirSync(cwd);
      return entries
        .filter(entry => {
          const fullPath = join(cwd, entry);
          try {
            return statSync(fullPath).isDirectory();
          } catch {
            return false;
          }
        })
        .map(dir => ({
          name: dir + '/',
          description: 'Directory',
          icon: '📁',
          type: 'folder' as const,
        }));
    } catch {
      return [];
    }
  }
};

/**
 * File and folder generator - lists both files and directories
 */
export const fileAndFolderGenerator: Generator = {
  script: 'ls -1a',
  postProcess: (output: string, context?: { cwd?: string }): Suggestion[] => {
    const cwd = context?.cwd || process.cwd();
    try {
      const entries = readdirSync(cwd);
      return entries
        .filter(e => e !== '.' && e !== '..')
        .map(entry => {
          const fullPath = join(cwd, entry);
          try {
            const isDir = statSync(fullPath).isDirectory();
            return {
              name: isDir ? entry + '/' : entry,
              description: isDir ? 'Directory' : 'File',
              icon: isDir ? '📁' : '📄',
              type: (isDir ? 'folder' : 'file') as 'folder' | 'file',
            };
          } catch {
            return {
              name: entry,
              description: 'Unknown',
              icon: '📄',
              type: 'file' as const,
            };
          }
        });
    } catch {
      return [];
    }
  }
};

/**
 * Git branch generator
 */
export const gitBranchGenerator: Generator = {
  script: 'git branch -a --format="%(refname:short)"',
  postProcess: (output: string): Suggestion[] => {
    if (!output || output.includes('fatal:')) return [];
    return output
      .split('\n')
      .filter(line => line.trim())
      .map(branch => ({
        name: branch.trim(),
        description: branch.includes('origin/') ? 'Remote branch' : 'Local branch',
        icon: '🌿',
        type: 'argument' as const,
      }));
  }
};

/**
 * Git tag generator
 */
export const gitTagGenerator: Generator = {
  script: 'git tag -l',
  postProcess: (output: string): Suggestion[] => {
    if (!output || output.includes('fatal:')) return [];
    return output
      .split('\n')
      .filter(line => line.trim())
      .map(tag => ({
        name: tag.trim(),
        description: 'Git tag',
        icon: '🏷️',
        type: 'argument' as const,
      }));
  }
};

/**
 * Git remote generator
 */
export const gitRemoteGenerator: Generator = {
  script: 'git remote -v',
  postProcess: (output: string): Suggestion[] => {
    if (!output || output.includes('fatal:')) return [];
    const remotes = new Set<string>();
    output.split('\n').forEach(line => {
      const match = line.match(/^(\S+)/);
      if (match) remotes.add(match[1]);
    });
    return Array.from(remotes).map(remote => ({
      name: remote,
      description: 'Git remote',
      icon: '🌐',
      type: 'argument' as const,
    }));
  }
};

/**
 * Docker container generator
 */
export const dockerContainerGenerator: Generator = {
  script: 'docker ps -a --format "{{.Names}}"',
  postProcess: (output: string): Suggestion[] => {
    if (!output) return [];
    return output
      .split('\n')
      .filter(line => line.trim())
      .map(container => ({
        name: container.trim(),
        description: 'Docker container',
        icon: '📦',
        type: 'argument' as const,
      }));
  }
};

/**
 * Docker image generator
 */
export const dockerImageGenerator: Generator = {
  script: 'docker images --format "{{.Repository}}:{{.Tag}}"',
  postProcess: (output: string): Suggestion[] => {
    if (!output) return [];
    return output
      .split('\n')
      .filter(line => line.trim() && !line.includes('<none>'))
      .map(image => ({
        name: image.trim(),
        description: 'Docker image',
        icon: '🐳',
        type: 'argument' as const,
      }));
  }
};

/**
 * npm script generator - reads from package.json
 */
export const npmScriptGenerator: Generator = {
  script: 'cat package.json',
  postProcess: (output: string, context?: { cwd?: string }): Suggestion[] => {
    const cwd = context?.cwd || process.cwd();
    const packagePath = join(cwd, 'package.json');
    
    try {
      if (!existsSync(packagePath)) return [];
      const pkg = JSON.parse(output || require('fs').readFileSync(packagePath, 'utf-8'));
      if (!pkg.scripts) return [];
      
      return Object.entries(pkg.scripts).map(([name, cmd]) => ({
        name,
        description: String(cmd).slice(0, 50),
        icon: '📜',
        type: 'argument' as const,
      }));
    } catch {
      return [];
    }
  }
};

/**
 * Package generator - for npm/yarn package names
 */
export const packageGenerator: Generator = {
  script: 'cat package.json',
  postProcess: (output: string, context?: { cwd?: string }): Suggestion[] => {
    const cwd = context?.cwd || process.cwd();
    const packagePath = join(cwd, 'package.json');
    
    try {
      if (!existsSync(packagePath)) return [];
      const pkg = JSON.parse(output || require('fs').readFileSync(packagePath, 'utf-8'));
      const deps = [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
      ];
      
      return deps.map(name => ({
        name,
        description: 'Installed package',
        icon: '📦',
        type: 'argument' as const,
      }));
    } catch {
      return [];
    }
  }
};

/**
 * Port generator - suggests common ports
 */
export const portGenerator: Generator = {
  custom: async (): Promise<Suggestion[]> => {
    const commonPorts = [
      { port: '80', desc: 'HTTP' },
      { port: '443', desc: 'HTTPS' },
      { port: '3000', desc: 'Node.js/React dev' },
      { port: '3001', desc: 'Alt dev server' },
      { port: '4000', desc: 'GraphQL/Phoenix' },
      { port: '5000', desc: 'Flask/Python' },
      { port: '5173', desc: 'Vite' },
      { port: '5432', desc: 'PostgreSQL' },
      { port: '6379', desc: 'Redis' },
      { port: '8000', desc: 'Django/FastAPI' },
      { port: '8080', desc: 'HTTP alt/Tomcat' },
      { port: '8443', desc: 'HTTPS alt' },
      { port: '9000', desc: 'PHP-FPM/SonarQube' },
      { port: '27017', desc: 'MongoDB' },
    ];
    
    return commonPorts.map(({ port, desc }) => ({
      name: port,
      description: desc,
      icon: '🔌',
      type: 'argument' as const,
    }));
  }
};

/**
 * Kubernetes namespace generator
 */
export const kubeNamespaceGenerator: Generator = {
  script: 'kubectl get namespaces -o jsonpath="{.items[*].metadata.name}"',
  postProcess: (output: string): Suggestion[] => {
    if (!output) return [];
    return output
      .split(/\s+/)
      .filter(ns => ns.trim())
      .map(ns => ({
        name: ns.trim(),
        description: 'Kubernetes namespace',
        icon: '☸️',
        type: 'argument' as const,
      }));
  }
};

/**
 * Kubernetes pod generator
 */
export const kubePodGenerator: Generator = {
  script: 'kubectl get pods -o jsonpath="{.items[*].metadata.name}"',
  postProcess: (output: string): Suggestion[] => {
    if (!output) return [];
    return output
      .split(/\s+/)
      .filter(pod => pod.trim())
      .map(pod => ({
        name: pod.trim(),
        description: 'Kubernetes pod',
        icon: '🫛',
        type: 'argument' as const,
      }));
  }
};

/**
 * Kubernetes context generator
 */
export const kubeContextGenerator: Generator = {
  script: 'kubectl config get-contexts -o name',
  postProcess: (output: string): Suggestion[] => {
    if (!output) return [];
    return output
      .split('\n')
      .filter(ctx => ctx.trim())
      .map(ctx => ({
        name: ctx.trim(),
        description: 'Kubernetes context',
        icon: '🎯',
        type: 'argument' as const,
      }));
  }
};

/**
 * AWS profile generator
 */
export const awsProfileGenerator: Generator = {
  script: 'cat ~/.aws/credentials',
  postProcess: (output: string): Suggestion[] => {
    if (!output) return [];
    const profiles: string[] = [];
    output.split('\n').forEach(line => {
      const match = line.match(/^\[([^\]]+)\]/);
      if (match) profiles.push(match[1]);
    });
    return profiles.map(profile => ({
      name: profile,
      description: 'AWS profile',
      icon: '☁️',
      type: 'argument' as const,
    }));
  }
};

/**
 * AWS region generator
 */
export const awsRegionGenerator: Generator = {
  custom: async (): Promise<Suggestion[]> => {
    const regions = [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
      'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-north-1',
      'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
      'ap-southeast-1', 'ap-southeast-2',
      'ap-south-1', 'sa-east-1', 'ca-central-1',
    ];
    return regions.map(region => ({
      name: region,
      description: 'AWS region',
      icon: '🌍',
      type: 'argument' as const,
    }));
  }
};

/**
 * Resolve a path that may contain ~ or be relative
 */
function resolvePath(inputPath: string, cwd: string): string {
  if (!inputPath) return cwd;
  
  // Handle home directory
  if (inputPath.startsWith('~')) {
    const home = process.env.HOME || '/';
    return inputPath.replace(/^~/, home);
  }
  
  // Handle absolute paths
  if (inputPath.startsWith('/')) {
    return inputPath;
  }
  
  // Handle relative paths
  return join(cwd, inputPath);
}

/**
 * Smart path-aware folder generator for cd command
 * Parses the partial path being typed and lists directories in that location
 */
export const smartFolderGenerator: Generator = {
  custom: async (context?: string[]): Promise<Suggestion[]> => {
    const cwd = context?.[0] || process.cwd();
    const partialPath = context?.[1] || '';
    
    try {
      // Determine the directory to list and the prefix to filter by
      let targetDir: string;
      let filterPrefix: string;
      
      if (!partialPath) {
        // No path typed yet - list current directory
        targetDir = cwd;
        filterPrefix = '';
      } else if (partialPath.endsWith('/')) {
        // Path ends with / - list contents of that directory
        targetDir = resolvePath(partialPath, cwd);
        filterPrefix = '';
      } else {
        // Partial path - list parent directory and filter
        const resolvedPath = resolvePath(partialPath, cwd);
        targetDir = dirname(resolvedPath);
        filterPrefix = basename(resolvedPath).toLowerCase();
      }
      
      // Check if target directory exists
      if (!existsSync(targetDir)) {
        return [];
      }
      
      const stat = statSync(targetDir);
      if (!stat.isDirectory()) {
        return [];
      }
      
      // List directories in the target
      const entries = readdirSync(targetDir);
      const suggestions: Suggestion[] = [];
      
      for (const entry of entries) {
        // Skip hidden files unless user is typing a dot
        if (entry.startsWith('.') && !filterPrefix.startsWith('.')) {
          continue;
        }
        
        const fullPath = join(targetDir, entry);
        try {
          const entryStat = statSync(fullPath);
          if (entryStat.isDirectory()) {
            // Apply filter if there's a partial name
            if (filterPrefix && !entry.toLowerCase().startsWith(filterPrefix)) {
              continue;
            }
            
            // Determine the suggestion name (what to insert)
            let suggestionName: string;
            if (!partialPath || partialPath.endsWith('/')) {
              suggestionName = entry + '/';
            } else {
              // Replace the partial name with the full name
              const pathPrefix = partialPath.substring(0, partialPath.lastIndexOf('/') + 1);
              suggestionName = pathPrefix + entry + '/';
            }
            
            suggestions.push({
              name: entry + '/',
              insertValue: suggestionName,
              description: 'Directory',
              icon: '📁',
              type: 'folder' as const,
              priority: 90
            });
          }
        } catch {
          // Skip entries we can't stat
        }
      }
      
      return suggestions;
    } catch {
      return [];
    }
  }
};

/**
 * Smart path-aware file and folder generator
 * For commands that accept both files and directories
 */
export const smartFileAndFolderGenerator: Generator = {
  custom: async (context?: string[]): Promise<Suggestion[]> => {
    const cwd = context?.[0] || process.cwd();
    const partialPath = context?.[1] || '';
    
    try {
      let targetDir: string;
      let filterPrefix: string;
      
      if (!partialPath) {
        targetDir = cwd;
        filterPrefix = '';
      } else if (partialPath.endsWith('/')) {
        targetDir = resolvePath(partialPath, cwd);
        filterPrefix = '';
      } else {
        const resolvedPath = resolvePath(partialPath, cwd);
        targetDir = dirname(resolvedPath);
        filterPrefix = basename(resolvedPath).toLowerCase();
      }
      
      if (!existsSync(targetDir)) {
        return [];
      }
      
      const stat = statSync(targetDir);
      if (!stat.isDirectory()) {
        return [];
      }
      
      const entries = readdirSync(targetDir);
      const suggestions: Suggestion[] = [];
      
      for (const entry of entries) {
        if (entry.startsWith('.') && !filterPrefix.startsWith('.')) {
          continue;
        }
        
        const fullPath = join(targetDir, entry);
        try {
          const entryStat = statSync(fullPath);
          const isDir = entryStat.isDirectory();
          
          if (filterPrefix && !entry.toLowerCase().startsWith(filterPrefix)) {
            continue;
          }
          
          let suggestionName: string;
          if (!partialPath || partialPath.endsWith('/')) {
            suggestionName = isDir ? entry + '/' : entry;
          } else {
            const pathPrefix = partialPath.substring(0, partialPath.lastIndexOf('/') + 1);
            suggestionName = pathPrefix + (isDir ? entry + '/' : entry);
          }
          
          suggestions.push({
            name: isDir ? entry + '/' : entry,
            insertValue: suggestionName,
            description: isDir ? 'Directory' : 'File',
            icon: isDir ? '📁' : '📄',
            type: isDir ? 'folder' as const : 'file' as const,
            priority: isDir ? 90 : 85
          });
        } catch {
          // Skip entries we can't stat
        }
      }
      
      return suggestions;
    } catch {
      return [];
    }
  }
};

/**
 * Environment variable generator
 */
export const envVarGenerator: Generator = {
  custom: async (): Promise<Suggestion[]> => {
    return Object.keys(process.env)
      .filter(key => key.length > 0)
      .slice(0, 50)
      .map(key => ({
        name: key,
        description: 'Environment variable',
        icon: '🔐',
        type: 'argument' as const,
      }));
  }
};

/**
 * Execute a generator and get suggestions
 */
export async function executeGenerator(
  generator: Generator,
  context?: { cwd?: string }
): Promise<Suggestion[]> {
  try {
    if (generator.custom) {
      return await generator.custom(context?.cwd ? [context.cwd] : []);
    }
    
    if (generator.script) {
      // If script is a function, call it directly
      if (typeof generator.script === 'function') {
        return await generator.script(context?.cwd ? [context.cwd] : [], async (cmd, cwd) => {
          try {
            const output = execSync(cmd, { encoding: 'utf-8', cwd: cwd || process.cwd() });
            return { stdout: output, stderr: '', exitCode: 0 };
          } catch (e: unknown) {
            const err = e as { stdout?: string; stderr?: string; status?: number };
            return { stdout: err.stdout || '', stderr: err.stderr || '', exitCode: err.status || 1 };
          }
        });
      }
      
      // Script is a string command
      const output = execSync(generator.script, {
        encoding: 'utf-8',
        cwd: context?.cwd || process.cwd(),
        timeout: 5000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      
      if (generator.postProcess) {
        return generator.postProcess(output, context);
      }
      
      return output
        .split('\n')
        .filter(line => line.trim())
        .map(line => ({
          name: line.trim(),
          type: 'argument' as const,
        }));
    }
    
    return [];
  } catch {
    return [];
  }
}
