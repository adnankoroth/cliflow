import { CompletionSpec, Generator } from '../types.js';

// Generator for Kubernetes contexts
const kubeContextGenerator: Generator = {
  script: 'kubectl config get-contexts -o name 2>/dev/null',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n')
      .filter(line => line.trim())
      .map(context => ({
        name: context.trim(),
        description: `Kubernetes context: ${context.trim()}`,
        type: 'argument' as const,
        icon: '⎈',
        priority: 100
      }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const } // 30 seconds
};

// Generator for Kubernetes namespaces
const kubeNamespaceGenerator: Generator = {
  script: 'kubectl get namespaces -o name 2>/dev/null | sed "s/^namespace\\///"',
  postProcess: (output) => {
    if (output.trim() === '') {
      return [];
    }
    return output.split('\n')
      .filter(line => line.trim())
      .map(namespace => ({
        name: namespace.trim(),
        description: `Kubernetes namespace: ${namespace.trim()}`,
        type: 'argument' as const,
        icon: '📦',
        priority: 100
      }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const } // 1 minute
};

export const kubectxSpec: CompletionSpec = {
  name: 'kubectx',
  description: 'Switch between Kubernetes contexts',
  args: {
    name: 'context',
    description: 'Kubernetes context to switch to',
    generators: [kubeContextGenerator],
    isOptional: true
  },
  options: [
    {
      name: ['-c', '--current'],
      description: 'Show the current context'
    },
    {
      name: ['-d', '--delete'],
      description: 'Delete the given context from the kubeconfig',
      args: {
        name: 'context',
        description: 'Context to delete',
        generators: [kubeContextGenerator]
      }
    },
    {
      name: ['-h', '--help'],
      description: 'Show help'
    }
  ]
};

export const kubeNsSpec: CompletionSpec = {
  name: 'kubens',
  description: 'Switch between Kubernetes namespaces',
  args: {
    name: 'namespace',
    description: 'Kubernetes namespace to switch to',
    generators: [kubeNamespaceGenerator],
    isOptional: true
  },
  options: [
    {
      name: ['-c', '--current'],
      description: 'Show the current namespace'
    },
    {
      name: ['-h', '--help'],
      description: 'Show help'
    }
  ]
};