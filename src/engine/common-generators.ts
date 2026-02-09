/**
 * Common Generators Library
 * 
 * Reusable generators for common CLI patterns.
 * Specs can reference these instead of writing custom generators.
 */

import { Generator, Suggestion } from '../types.js';

// =============================================================================
// AWS Generators
// =============================================================================

/** List S3 buckets */
export const awsS3Buckets: Generator = {
  script: 'aws s3 ls',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const parts = line.trim().split(/\s+/);
      const bucket = parts[2];
      if (!bucket) return null;
      return {
        name: `s3://${bucket}/`,
        description: `S3 Bucket (created ${parts[0]})`,
        type: 'argument' as const,
        icon: '🪣',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 300000, strategy: 'ttl' as const },
  timeout: 3000
};

/** List EC2 instances */
export const awsEc2Instances: Generator = {
  script: 'aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,Tags[?Key==\'Name\'].Value|[0],State.Name]" --output text',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [id, name, state] = line.trim().split('\t');
      if (!id) return null;
      const stateIcon = state === 'running' ? '🟢' : state === 'stopped' ? '🔴' : '🟡';
      return {
        name: id,
        description: `${stateIcon} ${name || 'unnamed'} (${state})`,
        type: 'argument' as const,
        icon: '💻',
        priority: state === 'running' ? 100 : 50
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 60000, strategy: 'ttl' as const },
  timeout: 5000
};

/** List AWS profiles */
export const awsProfiles: Generator = {
  script: 'aws configure list-profiles',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(name => ({
      name: name.trim(),
      description: 'AWS Profile',
      type: 'argument' as const,
      icon: '👤',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

/** List AWS regions */
export const awsRegions: Generator = {
  script: 'aws ec2 describe-regions --query "Regions[].RegionName" --output text',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split(/\s+/).filter(r => r.trim()).map(region => ({
      name: region.trim(),
      description: 'AWS Region',
      type: 'argument' as const,
      icon: '🌍',
      priority: 100
    }));
  },
  cache: { ttl: 300000, strategy: 'ttl' as const }
};

// =============================================================================
// Docker Generators
// =============================================================================

/** List Docker containers */
export const dockerContainers: Generator = {
  script: 'docker ps -a --format "{{.ID}}\\t{{.Names}}\\t{{.Status}}\\t{{.Image}}"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [id, name, status, image] = line.split('\t');
      if (!id) return null;
      const isRunning = status?.startsWith('Up');
      return {
        name: name || id,
        description: `${isRunning ? '🟢' : '⏹️'} ${image} (${id.slice(0, 12)})`,
        type: 'argument' as const,
        icon: '🐳',
        priority: isRunning ? 100 : 50
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 5000, strategy: 'ttl' as const }
};

/** List running Docker containers only */
export const dockerRunningContainers: Generator = {
  script: 'docker ps --format "{{.ID}}\\t{{.Names}}\\t{{.Image}}"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [id, name, image] = line.split('\t');
      if (!id) return null;
      return {
        name: name || id,
        description: `🟢 ${image} (${id.slice(0, 12)})`,
        type: 'argument' as const,
        icon: '🐳',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 5000, strategy: 'ttl' as const }
};

/** List Docker images */
export const dockerImages: Generator = {
  script: 'docker images --format "{{.Repository}}:{{.Tag}}\\t{{.ID}}\\t{{.Size}}"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [name, id, size] = line.split('\t');
      if (!name || name === '<none>:<none>') return null;
      return {
        name: name,
        description: `${size} (${id?.slice(0, 12)})`,
        type: 'argument' as const,
        icon: '📦',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 10000, strategy: 'ttl' as const }
};

/** List Docker volumes */
export const dockerVolumes: Generator = {
  script: 'docker volume ls --format "{{.Name}}\\t{{.Driver}}"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [name, driver] = line.split('\t');
      if (!name) return null;
      return {
        name: name,
        description: `Volume (${driver || 'local'})`,
        type: 'argument' as const,
        icon: '💾',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 10000, strategy: 'ttl' as const }
};

/** List Docker networks */
export const dockerNetworks: Generator = {
  script: 'docker network ls --format "{{.Name}}\\t{{.Driver}}\\t{{.Scope}}"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [name, driver, scope] = line.split('\t');
      if (!name) return null;
      return {
        name: name,
        description: `${driver} network (${scope})`,
        type: 'argument' as const,
        icon: '🌐',
        priority: name === 'bridge' || name === 'host' || name === 'none' ? 50 : 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 10000, strategy: 'ttl' as const }
};

// =============================================================================
// Kubernetes Generators
// =============================================================================

/** List Kubernetes namespaces */
export const k8sNamespaces: Generator = {
  script: 'kubectl get namespaces -o jsonpath="{.items[*].metadata.name}"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split(/\s+/).filter(n => n.trim()).map(name => ({
      name: name.trim(),
      description: 'Namespace',
      type: 'argument' as const,
      icon: '📁',
      priority: name.startsWith('kube-') ? 50 : 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

/** List Kubernetes pods */
export const k8sPods: Generator = {
  script: 'kubectl get pods --all-namespaces -o jsonpath="{range .items[*]}{.metadata.name}\\t{.metadata.namespace}\\t{.status.phase}\\n{end}"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [name, namespace, phase] = line.split('\t');
      if (!name) return null;
      const icon = phase === 'Running' ? '🟢' : phase === 'Pending' ? '🟡' : '🔴';
      return {
        name: name,
        description: `${icon} ${namespace} (${phase})`,
        type: 'argument' as const,
        icon: '🫛',
        priority: phase === 'Running' ? 100 : 50
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 10000, strategy: 'ttl' as const }
};

/** List Kubernetes deployments */
export const k8sDeployments: Generator = {
  script: 'kubectl get deployments --all-namespaces -o jsonpath="{range .items[*]}{.metadata.name}\\t{.metadata.namespace}\\t{.status.readyReplicas}/{.status.replicas}\\n{end}"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [name, namespace, replicas] = line.split('\t');
      if (!name) return null;
      return {
        name: name,
        description: `${namespace} (${replicas || '0/0'} ready)`,
        type: 'argument' as const,
        icon: '🚀',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 15000, strategy: 'ttl' as const }
};

/** List Kubernetes services */
export const k8sServices: Generator = {
  script: 'kubectl get services --all-namespaces -o jsonpath="{range .items[*]}{.metadata.name}\\t{.metadata.namespace}\\t{.spec.type}\\n{end}"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [name, namespace, type] = line.split('\t');
      if (!name) return null;
      return {
        name: name,
        description: `${namespace} (${type})`,
        type: 'argument' as const,
        icon: '🔌',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

/** List Kubernetes contexts */
export const k8sContexts: Generator = {
  script: 'kubectl config get-contexts -o name',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(name => ({
      name: name.trim(),
      description: 'Kubernetes context',
      type: 'argument' as const,
      icon: '☸️',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// =============================================================================
// Git Generators
// =============================================================================

/** List git branches */
export const gitBranches: Generator = {
  script: 'git branch -a --format="%(refname:short)\\t%(objectname:short)\\t%(upstream:short)"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [name, commit, upstream] = line.split('\t');
      if (!name) return null;
      const isRemote = name.startsWith('origin/');
      return {
        name: name,
        description: `${commit}${upstream ? ` → ${upstream}` : ''}`,
        type: 'argument' as const,
        icon: isRemote ? '🌐' : '🔀',
        priority: isRemote ? 50 : 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 5000, strategy: 'ttl' as const }
};

/** List git remotes */
export const gitRemotes: Generator = {
  script: 'git remote -v',
  postProcess: (output) => {
    if (!output.trim()) return [];
    const seen = new Set<string>();
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [name, url] = line.split(/\s+/);
      if (!name || seen.has(name)) return null;
      seen.add(name);
      return {
        name: name,
        description: url?.replace(/\s*\(.*\)/, '') || '',
        type: 'argument' as const,
        icon: '🔗',
        priority: name === 'origin' ? 100 : 80
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

/** List git tags */
export const gitTags: Generator = {
  script: 'git tag -l --sort=-version:refname',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).slice(0, 50).map((name, i) => ({
      name: name.trim(),
      description: 'Tag',
      type: 'argument' as const,
      icon: '🏷️',
      priority: 100 - i  // Most recent first
    }));
  },
  cache: { ttl: 10000, strategy: 'ttl' as const }
};

/** List git stashes */
export const gitStashes: Generator = {
  script: 'git stash list --format="%gd\\t%s"',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.trim()).map(line => {
      const [ref, message] = line.split('\t');
      if (!ref) return null;
      return {
        name: ref,
        description: message || 'stash',
        type: 'argument' as const,
        icon: '📦',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 5000, strategy: 'ttl' as const }
};

// =============================================================================
// NPM/Node Generators
// =============================================================================

/** List npm scripts from package.json */
export const npmScripts: Generator = {
  script: 'cat package.json 2>/dev/null',
  postProcess: (output) => {
    if (!output.trim()) return [];
    try {
      const pkg = JSON.parse(output);
      if (!pkg.scripts) return [];
      return Object.entries(pkg.scripts).map(([name, cmd]) => ({
        name: name,
        description: String(cmd).slice(0, 50),
        type: 'argument' as const,
        icon: '📜',
        priority: 100
      }));
    } catch {
      return [];
    }
  },
  cache: { ttl: 10000, strategy: 'ttl' as const }
};

/** List installed npm packages */
export const npmPackages: Generator = {
  script: 'npm ls --depth=0 --json 2>/dev/null',
  postProcess: (output) => {
    if (!output.trim()) return [];
    try {
      const data = JSON.parse(output);
      if (!data.dependencies) return [];
      return Object.entries(data.dependencies).map(([name, info]: [string, any]) => ({
        name: name,
        description: info.version || '',
        type: 'argument' as const,
        icon: '📦',
        priority: 100
      }));
    } catch {
      return [];
    }
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// =============================================================================
// System Generators
// =============================================================================

/** List running processes */
export const processes: Generator = {
  script: 'ps aux --sort=-%mem | head -20',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').slice(1).filter(l => l.trim()).map(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[1];
      const cpu = parts[2];
      const mem = parts[3];
      const cmd = parts.slice(10).join(' ').slice(0, 40);
      if (!pid) return null;
      return {
        name: pid,
        description: `${cmd} (CPU: ${cpu}%, MEM: ${mem}%)`,
        type: 'argument' as const,
        icon: '⚙️',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 5000, strategy: 'ttl' as const }
};

/** List environment variables */
export const envVars: Generator = {
  script: 'env',
  postProcess: (output) => {
    if (!output.trim()) return [];
    return output.split('\n').filter(l => l.includes('=')).map(line => {
      const [name, ...rest] = line.split('=');
      const value = rest.join('=').slice(0, 50);
      if (!name) return null;
      return {
        name: name,
        description: value || '(empty)',
        type: 'argument' as const,
        icon: '🔧',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// =============================================================================
// Generator Registry - Easy lookup by name
// =============================================================================

export const generators: Record<string, Generator> = {
  // AWS
  'aws:s3-buckets': awsS3Buckets,
  'aws:ec2-instances': awsEc2Instances,
  'aws:profiles': awsProfiles,
  'aws:regions': awsRegions,
  
  // Docker
  'docker:containers': dockerContainers,
  'docker:running-containers': dockerRunningContainers,
  'docker:images': dockerImages,
  'docker:volumes': dockerVolumes,
  'docker:networks': dockerNetworks,
  
  // Kubernetes
  'k8s:namespaces': k8sNamespaces,
  'k8s:pods': k8sPods,
  'k8s:deployments': k8sDeployments,
  'k8s:services': k8sServices,
  'k8s:contexts': k8sContexts,
  
  // Git
  'git:branches': gitBranches,
  'git:remotes': gitRemotes,
  'git:tags': gitTags,
  'git:stashes': gitStashes,
  
  // NPM
  'npm:scripts': npmScripts,
  'npm:packages': npmPackages,
  
  // System
  'system:processes': processes,
  'system:env-vars': envVars,
};

/**
 * Get a generator by name
 */
export function getGenerator(name: string): Generator | undefined {
  return generators[name];
}

/**
 * List all available generators
 */
export function listGenerators(): string[] {
  return Object.keys(generators);
}
