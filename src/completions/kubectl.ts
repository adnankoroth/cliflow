// Kubectl completion spec for CLIFlow
// Comprehensive kubernetes kubectl command completions

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';
import { generatorFromLines, subcommandsFromHelp } from './_shared/generators.js';

// Helper to create simple suggestions
const s = (...names: string[]): Suggestion[] => names.map(name => ({ name }));

// Kubectl generators
const kubectlGenerators = {
  pods: generatorFromLines({
    script: 'kubectl get pods --no-headers -o custom-columns=":metadata.name" 2>/dev/null',
    timeout: 2500,
    cacheTtl: 5000,
    mapLine: (name) => ({ name, icon: '🔷', description: 'Pod' }),
  }),

  deployments: generatorFromLines({
    script: 'kubectl get deployments --no-headers -o custom-columns=":metadata.name" 2>/dev/null',
    timeout: 2500,
    cacheTtl: 10000,
    mapLine: (name) => ({ name, icon: '🚀', description: 'Deployment' }),
  }),

  services: generatorFromLines({
    script: 'kubectl get services --no-headers -o custom-columns=":metadata.name" 2>/dev/null',
    timeout: 2500,
    cacheTtl: 10000,
    mapLine: (name) => ({ name, icon: '🌐', description: 'Service' }),
  }),

  namespaces: generatorFromLines({
    script: 'kubectl get namespaces --no-headers -o custom-columns=":metadata.name" 2>/dev/null',
    timeout: 2500,
    cacheTtl: 30000,
    mapLine: (name) => ({ name, icon: '📁', description: 'Namespace' }),
  }),

  contexts: generatorFromLines({
    script: 'kubectl config get-contexts --no-headers -o name 2>/dev/null',
    timeout: 2500,
    cacheTtl: 60000,
    mapLine: (name) => ({ name, icon: '🔧', description: 'Context' }),
  }),

  configmaps: generatorFromLines({
    script: 'kubectl get configmaps --no-headers -o custom-columns=":metadata.name" 2>/dev/null',
    timeout: 2500,
    cacheTtl: 10000,
    mapLine: (name) => ({ name, icon: '⚙️', description: 'ConfigMap' }),
  }),

  secrets: generatorFromLines({
    script: 'kubectl get secrets --no-headers -o custom-columns=":metadata.name" 2>/dev/null',
    timeout: 2500,
    cacheTtl: 10000,
    mapLine: (name) => ({ name, icon: '🔐', description: 'Secret' }),
  }),

  nodes: generatorFromLines({
    script: 'kubectl get nodes --no-headers -o custom-columns=":metadata.name" 2>/dev/null',
    timeout: 2500,
    cacheTtl: 30000,
    mapLine: (name) => ({ name, icon: '🖥️', description: 'Node' }),
  }),
};

const kubectlSubcommandGenerator = subcommandsFromHelp({
  script: 'kubectl help 2>/dev/null',
  cacheTtl: 60000,
  lineRegex: /^\s{2,}([a-z0-9][\w-]+)\s+(.*)$/i,
});

// Common resource types
const resourceTypes: Suggestion[] = [
  { name: 'pods', description: 'Pod (po)' },
  { name: 'pod', description: 'Pod' },
  { name: 'po', description: 'Pod' },
  { name: 'deployments', description: 'Deployment (deploy)' },
  { name: 'deployment', description: 'Deployment' },
  { name: 'deploy', description: 'Deployment' },
  { name: 'services', description: 'Service (svc)' },
  { name: 'service', description: 'Service' },
  { name: 'svc', description: 'Service' },
  { name: 'replicasets', description: 'ReplicaSet (rs)' },
  { name: 'replicaset', description: 'ReplicaSet' },
  { name: 'rs', description: 'ReplicaSet' },
  { name: 'statefulsets', description: 'StatefulSet (sts)' },
  { name: 'statefulset', description: 'StatefulSet' },
  { name: 'sts', description: 'StatefulSet' },
  { name: 'daemonsets', description: 'DaemonSet (ds)' },
  { name: 'daemonset', description: 'DaemonSet' },
  { name: 'ds', description: 'DaemonSet' },
  { name: 'jobs', description: 'Job' },
  { name: 'job', description: 'Job' },
  { name: 'cronjobs', description: 'CronJob (cj)' },
  { name: 'cronjob', description: 'CronJob' },
  { name: 'cj', description: 'CronJob' },
  { name: 'configmaps', description: 'ConfigMap (cm)' },
  { name: 'configmap', description: 'ConfigMap' },
  { name: 'cm', description: 'ConfigMap' },
  { name: 'secrets', description: 'Secret' },
  { name: 'secret', description: 'Secret' },
  { name: 'namespaces', description: 'Namespace (ns)' },
  { name: 'namespace', description: 'Namespace' },
  { name: 'ns', description: 'Namespace' },
  { name: 'nodes', description: 'Node (no)' },
  { name: 'node', description: 'Node' },
  { name: 'no', description: 'Node' },
  { name: 'persistentvolumes', description: 'PersistentVolume (pv)' },
  { name: 'persistentvolume', description: 'PersistentVolume' },
  { name: 'pv', description: 'PersistentVolume' },
  { name: 'persistentvolumeclaims', description: 'PersistentVolumeClaim (pvc)' },
  { name: 'persistentvolumeclaim', description: 'PersistentVolumeClaim' },
  { name: 'pvc', description: 'PersistentVolumeClaim' },
  { name: 'ingresses', description: 'Ingress (ing)' },
  { name: 'ingress', description: 'Ingress' },
  { name: 'ing', description: 'Ingress' },
  { name: 'serviceaccounts', description: 'ServiceAccount (sa)' },
  { name: 'serviceaccount', description: 'ServiceAccount' },
  { name: 'sa', description: 'ServiceAccount' },
  { name: 'endpoints', description: 'Endpoints (ep)' },
  { name: 'ep', description: 'Endpoints' },
  { name: 'events', description: 'Event (ev)' },
  { name: 'event', description: 'Event' },
  { name: 'ev', description: 'Event' },
  { name: 'horizontalpodautoscalers', description: 'HorizontalPodAutoscaler (hpa)' },
  { name: 'hpa', description: 'HorizontalPodAutoscaler' },
  { name: 'networkpolicies', description: 'NetworkPolicy (netpol)' },
  { name: 'networkpolicy', description: 'NetworkPolicy' },
  { name: 'netpol', description: 'NetworkPolicy' },
  { name: 'poddisruptionbudgets', description: 'PodDisruptionBudget (pdb)' },
  { name: 'pdb', description: 'PodDisruptionBudget' },
  { name: 'roles', description: 'Role' },
  { name: 'role', description: 'Role' },
  { name: 'rolebindings', description: 'RoleBinding' },
  { name: 'rolebinding', description: 'RoleBinding' },
  { name: 'clusterroles', description: 'ClusterRole' },
  { name: 'clusterrole', description: 'ClusterRole' },
  { name: 'clusterrolebindings', description: 'ClusterRoleBinding' },
  { name: 'clusterrolebinding', description: 'ClusterRoleBinding' },
  { name: 'all', description: 'All resources' }
];

// Common options
const namespaceOption: Option = { name: ['-n', '--namespace'], description: 'Namespace', args: { name: 'namespace', generators: kubectlGenerators.namespaces } };
const allNamespacesOption: Option = { name: ['-A', '--all-namespaces'], description: 'All namespaces' };
const selectorOption: Option = { name: ['-l', '--selector'], description: 'Label selector', args: { name: 'selector' } };
const outputOption: Option = { name: ['-o', '--output'], description: 'Output format', args: { name: 'format', suggestions: s('json', 'yaml', 'wide', 'name', 'jsonpath=', 'jsonpath-file=', 'go-template=', 'go-template-file=', 'custom-columns=', 'custom-columns-file=') } };
const dryRunOption: Option = { name: '--dry-run', description: 'Dry run mode', args: { name: 'strategy', suggestions: s('none', 'server', 'client') } };
const fieldSelectorOption: Option = { name: '--field-selector', description: 'Field selector', args: { name: 'selector' } };

export const kubectlSpec: CompletionSpec = {
  name: 'kubectl',
  description: 'Kubernetes command-line tool',
  generateSpec: kubectlSubcommandGenerator,
  subcommands: [
    // Basic Commands (Beginner)
    {
      name: 'create',
      description: 'Create a resource from a file or from stdin',
      args: { name: 'resource', isOptional: true, suggestions: resourceTypes },
      options: [
        { name: ['-f', '--filename'], description: 'Filename, directory, or URL', args: { name: 'file', template: 'filepaths' } },
        { name: ['-k', '--kustomize'], description: 'Process kustomization directory', args: { name: 'dir', template: 'folders' } },
        namespaceOption,
        dryRunOption,
        outputOption,
        { name: '--save-config', description: 'Save config annotation' },
        { name: '--edit', description: 'Edit before creating' },
        { name: '--raw', description: 'Raw URI to POST', args: { name: 'uri' } }
      ],
      subcommands: [
        { name: 'namespace', description: 'Create a namespace', args: { name: 'name' }, options: [dryRunOption, outputOption] },
        { name: 'configmap', description: 'Create a configmap', args: { name: 'name' }, options: [{ name: '--from-file', description: 'Key files', args: { name: 'file', template: 'filepaths' } }, { name: '--from-literal', description: 'Key-value pairs', args: { name: 'key=value' } }, { name: '--from-env-file', description: 'Env file', args: { name: 'file', template: 'filepaths' } }, namespaceOption, dryRunOption, outputOption] },
        { name: 'secret', description: 'Create a secret', subcommands: [{ name: 'generic', description: 'Create generic secret', args: { name: 'name' }, options: [{ name: '--from-file', description: 'Key files', args: { name: 'file', template: 'filepaths' } }, { name: '--from-literal', description: 'Key-value pairs', args: { name: 'key=value' } }, { name: '--from-env-file', description: 'Env file', args: { name: 'file', template: 'filepaths' } }, namespaceOption, dryRunOption, outputOption] }, { name: 'docker-registry', description: 'Create docker registry secret', args: { name: 'name' }, options: [{ name: '--docker-server', description: 'Docker registry server', args: { name: 'server' } }, { name: '--docker-username', description: 'Docker username', args: { name: 'username' } }, { name: '--docker-password', description: 'Docker password', args: { name: 'password' } }, { name: '--docker-email', description: 'Docker email', args: { name: 'email' } }, namespaceOption, dryRunOption, outputOption] }, { name: 'tls', description: 'Create TLS secret', args: { name: 'name' }, options: [{ name: '--cert', description: 'TLS cert file', args: { name: 'file', template: 'filepaths' } }, { name: '--key', description: 'TLS key file', args: { name: 'file', template: 'filepaths' } }, namespaceOption, dryRunOption, outputOption] }] },
        { name: 'deployment', description: 'Create a deployment', args: { name: 'name' }, options: [{ name: '--image', description: 'Image name', args: { name: 'image' } }, { name: '--replicas', description: 'Number of replicas', args: { name: 'count' } }, { name: '--port', description: 'Container port', args: { name: 'port' } }, namespaceOption, dryRunOption, outputOption] },
        { name: 'service', description: 'Create a service', subcommands: [{ name: 'clusterip', description: 'Create ClusterIP service', args: { name: 'name' }, options: [{ name: '--tcp', description: 'Port pairs', args: { name: 'port:targetPort' } }, { name: '--clusterip', description: 'ClusterIP', args: { name: 'ip' } }, namespaceOption, dryRunOption, outputOption] }, { name: 'nodeport', description: 'Create NodePort service', args: { name: 'name' }, options: [{ name: '--tcp', description: 'Port pairs', args: { name: 'port:targetPort' } }, { name: '--node-port', description: 'NodePort', args: { name: 'port' } }, namespaceOption, dryRunOption, outputOption] }, { name: 'loadbalancer', description: 'Create LoadBalancer service', args: { name: 'name' }, options: [{ name: '--tcp', description: 'Port pairs', args: { name: 'port:targetPort' } }, namespaceOption, dryRunOption, outputOption] }, { name: 'externalname', description: 'Create ExternalName service', args: { name: 'name' }, options: [{ name: '--external-name', description: 'External name', args: { name: 'name' } }, namespaceOption, dryRunOption, outputOption] }] },
        { name: 'job', description: 'Create a job', args: { name: 'name' }, options: [{ name: '--image', description: 'Image name', args: { name: 'image' } }, { name: '--from', description: 'Create from cronjob', args: { name: 'cronjob' } }, namespaceOption, dryRunOption, outputOption] },
        { name: 'cronjob', description: 'Create a cronjob', args: { name: 'name' }, options: [{ name: '--image', description: 'Image name', args: { name: 'image' } }, { name: '--schedule', description: 'Cron schedule', args: { name: 'schedule' } }, namespaceOption, dryRunOption, outputOption] },
        { name: 'serviceaccount', description: 'Create a service account', args: { name: 'name' }, options: [namespaceOption, dryRunOption, outputOption] },
        { name: 'role', description: 'Create a role', args: { name: 'name' }, options: [{ name: '--verb', description: 'Verbs', args: { name: 'verb' } }, { name: '--resource', description: 'Resources', args: { name: 'resource' } }, namespaceOption, dryRunOption, outputOption] },
        { name: 'rolebinding', description: 'Create a role binding', args: { name: 'name' }, options: [{ name: '--role', description: 'Role name', args: { name: 'role' } }, { name: '--clusterrole', description: 'ClusterRole name', args: { name: 'clusterrole' } }, { name: '--user', description: 'User', args: { name: 'user' } }, { name: '--group', description: 'Group', args: { name: 'group' } }, { name: '--serviceaccount', description: 'Service account', args: { name: 'namespace:name' } }, namespaceOption, dryRunOption, outputOption] },
        { name: 'clusterrole', description: 'Create a cluster role', args: { name: 'name' }, options: [{ name: '--verb', description: 'Verbs', args: { name: 'verb' } }, { name: '--resource', description: 'Resources', args: { name: 'resource' } }, { name: '--non-resource-url', description: 'Non-resource URLs', args: { name: 'url' } }, dryRunOption, outputOption] },
        { name: 'clusterrolebinding', description: 'Create a cluster role binding', args: { name: 'name' }, options: [{ name: '--clusterrole', description: 'ClusterRole name', args: { name: 'clusterrole' } }, { name: '--user', description: 'User', args: { name: 'user' } }, { name: '--group', description: 'Group', args: { name: 'group' } }, { name: '--serviceaccount', description: 'Service account', args: { name: 'namespace:name' } }, dryRunOption, outputOption] },
        { name: 'ingress', description: 'Create an ingress', args: { name: 'name' }, options: [{ name: '--rule', description: 'Rule', args: { name: 'host/path=service:port' } }, { name: '--annotation', description: 'Annotation', args: { name: 'key=value' } }, { name: '--class', description: 'Ingress class', args: { name: 'class' } }, { name: '--default-backend', description: 'Default backend', args: { name: 'service:port' } }, namespaceOption, dryRunOption, outputOption] }
      ]
    },
    {
      name: 'expose',
      description: 'Expose a resource as a new Kubernetes service',
      args: [
        { name: 'type', suggestions: s('pod', 'deployment', 'replicaset', 'service', 'replicationcontroller') },
        { name: 'name' }
      ],
      options: [
        { name: '--port', description: 'Service port', args: { name: 'port' } },
        { name: '--target-port', description: 'Container port', args: { name: 'port' } },
        { name: '--protocol', description: 'Protocol', args: { name: 'protocol', suggestions: s('TCP', 'UDP', 'SCTP') } },
        { name: '--name', description: 'Service name', args: { name: 'name' } },
        { name: '--type', description: 'Service type', args: { name: 'type', suggestions: s('ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName') } },
        { name: '--external-ip', description: 'External IP', args: { name: 'ip' } },
        { name: '--load-balancer-ip', description: 'LoadBalancer IP', args: { name: 'ip' } },
        namespaceOption,
        selectorOption,
        dryRunOption,
        outputOption
      ]
    },
    {
      name: 'run',
      description: 'Run a particular image on the cluster',
      args: { name: 'name' },
      options: [
        { name: '--image', description: 'Image to run', args: { name: 'image' } },
        { name: '--command', description: 'Use command instead of entrypoint' },
        { name: '--env', description: 'Environment variable', args: { name: 'key=value' } },
        { name: '--labels', description: 'Labels', args: { name: 'key=value' } },
        { name: '--port', description: 'Container port', args: { name: 'port' } },
        { name: '--restart', description: 'Restart policy', args: { name: 'policy', suggestions: s('Always', 'OnFailure', 'Never') } },
        { name: '--rm', description: 'Delete pod after completion' },
        { name: ['-i', '--stdin'], description: 'Pass stdin to container' },
        { name: ['-t', '--tty'], description: 'Stdin is a TTY' },
        { name: '--attach', description: 'Attach to container' },
        { name: '--leave-stdin-open', description: 'Leave stdin open after first attach' },
        { name: '--serviceaccount', description: 'Service account', args: { name: 'name' } },
        { name: '--image-pull-policy', description: 'Image pull policy', args: { name: 'policy', suggestions: s('Always', 'Never', 'IfNotPresent') } },
        { name: '--overrides', description: 'JSON override', args: { name: 'json' } },
        namespaceOption,
        dryRunOption,
        outputOption
      ]
    },
    {
      name: 'set',
      description: 'Set specific features on objects',
      subcommands: [
        { name: 'image', description: 'Update image of a resource', args: [{ name: 'type/name' }, { name: 'container=image', isVariadic: true }], options: [namespaceOption, selectorOption, dryRunOption, outputOption, { name: '--all', description: 'Select all resources' }, { name: '--record', description: 'Record command in annotation' }] },
        { name: 'resources', description: 'Update resource requests/limits', args: { name: 'type/name' }, options: [{ name: '--requests', description: 'Resource requests', args: { name: 'cpu=,memory=' } }, { name: '--limits', description: 'Resource limits', args: { name: 'cpu=,memory=' } }, { name: ['-c', '--containers'], description: 'Containers', args: { name: 'name' } }, namespaceOption, selectorOption, dryRunOption, outputOption] },
        { name: 'selector', description: 'Set selector on a resource', args: [{ name: 'type/name' }, { name: 'selector' }], options: [namespaceOption, dryRunOption, outputOption, { name: '--all', description: 'Select all resources' }, { name: '--resource-version', description: 'Resource version', args: { name: 'version' } }] },
        { name: 'serviceaccount', description: 'Update ServiceAccount of a resource', args: [{ name: 'type/name' }, { name: 'serviceaccount' }], options: [namespaceOption, dryRunOption, outputOption, { name: '--all', description: 'Select all resources' }] },
        { name: 'subject', description: 'Update subject of role binding', args: { name: 'type/name' }, options: [{ name: '--user', description: 'Usernames', args: { name: 'name' } }, { name: '--group', description: 'Groups', args: { name: 'name' } }, { name: '--serviceaccount', description: 'ServiceAccount', args: { name: 'namespace:name' } }, namespaceOption, dryRunOption, outputOption] },
        { name: 'env', description: 'Update environment variables', args: { name: 'type/name' }, options: [{ name: '--env', description: 'Environment variable', args: { name: 'key=value' } }, { name: '--from', description: 'Source (configmap/secret)', args: { name: 'source' } }, { name: '--keys', description: 'Keys to import', args: { name: 'key' } }, { name: ['-c', '--containers'], description: 'Containers', args: { name: 'name' } }, { name: '--list', description: 'List environment variables' }, { name: '--resolve', description: 'Resolve references' }, namespaceOption, selectorOption, dryRunOption, outputOption] }
      ]
    },

    // Basic Commands (Intermediate)
    {
      name: 'get',
      description: 'Display one or many resources',
      args: [
        { name: 'type', suggestions: resourceTypes },
        { name: 'name', isOptional: true, isVariadic: true }
      ],
      options: [
        namespaceOption,
        allNamespacesOption,
        selectorOption,
        fieldSelectorOption,
        outputOption,
        { name: ['-w', '--watch'], description: 'Watch for changes' },
        { name: '--watch-only', description: 'Watch changes only' },
        { name: '--show-labels', description: 'Show labels in output' },
        { name: '--show-kind', description: 'Show resource kind' },
        { name: '--sort-by', description: 'Sort by field', args: { name: 'field' } },
        { name: '--no-headers', description: 'Don\'t print headers' },
        { name: '--ignore-not-found', description: 'Return without error if not found' },
        { name: ['-f', '--filename'], description: 'Filename, directory, or URL', args: { name: 'file', template: 'filepaths' } },
        { name: ['-k', '--kustomize'], description: 'Kustomization directory', args: { name: 'dir', template: 'folders' } },
        { name: ['-R', '--recursive'], description: 'Process directories recursively' },
        { name: '--chunk-size', description: 'Chunk size for list calls', args: { name: 'size' } }
      ]
    },
    {
      name: 'edit',
      description: 'Edit a resource on the server',
      args: [
        { name: 'type', suggestions: resourceTypes },
        { name: 'name', isOptional: true }
      ],
      options: [
        namespaceOption,
        { name: ['-f', '--filename'], description: 'Filename, directory, or URL', args: { name: 'file', template: 'filepaths' } },
        { name: ['-k', '--kustomize'], description: 'Kustomization directory', args: { name: 'dir', template: 'folders' } },
        outputOption,
        { name: '--save-config', description: 'Save config annotation' },
        { name: '--windows-line-endings', description: 'Use Windows line endings' }
      ]
    },
    {
      name: 'delete',
      description: 'Delete resources',
      args: [
        { name: 'type', suggestions: resourceTypes },
        { name: 'name', isOptional: true, isVariadic: true }
      ],
      options: [
        namespaceOption,
        allNamespacesOption,
        selectorOption,
        fieldSelectorOption,
        { name: ['-f', '--filename'], description: 'Filename, directory, or URL', args: { name: 'file', template: 'filepaths' } },
        { name: ['-k', '--kustomize'], description: 'Kustomization directory', args: { name: 'dir', template: 'folders' } },
        { name: '--all', description: 'Delete all resources' },
        { name: '--force', description: 'Immediate deletion' },
        { name: '--grace-period', description: 'Grace period in seconds', args: { name: 'seconds' } },
        { name: '--now', description: 'Immediate deletion with grace-period=1' },
        { name: '--cascade', description: 'Cascade deletion', args: { name: 'mode', suggestions: s('background', 'orphan', 'foreground') } },
        { name: '--ignore-not-found', description: 'Return without error if not found' },
        { name: '--wait', description: 'Wait for deletion' },
        { name: '--timeout', description: 'Timeout for waiting', args: { name: 'duration' } },
        dryRunOption,
        outputOption
      ]
    },

    // Deploy Commands
    {
      name: 'rollout',
      description: 'Manage the rollout of a resource',
      subcommands: [
        { name: 'status', description: 'Show rollout status', args: [{ name: 'type', suggestions: s('deployment', 'daemonset', 'statefulset') }, { name: 'name' }], options: [namespaceOption, { name: ['-w', '--watch'], description: 'Watch status updates' }, { name: '--timeout', description: 'Timeout', args: { name: 'duration' } }, { name: '--revision', description: 'Specific revision', args: { name: 'revision' } }] },
        { name: 'history', description: 'View rollout history', args: [{ name: 'type', suggestions: s('deployment', 'daemonset', 'statefulset') }, { name: 'name' }], options: [namespaceOption, { name: '--revision', description: 'Specific revision', args: { name: 'revision' } }, outputOption] },
        { name: 'pause', description: 'Pause rollout', args: [{ name: 'type', suggestions: s('deployment', 'daemonset', 'statefulset') }, { name: 'name' }], options: [namespaceOption, dryRunOption, outputOption] },
        { name: 'resume', description: 'Resume rollout', args: [{ name: 'type', suggestions: s('deployment', 'daemonset', 'statefulset') }, { name: 'name' }], options: [namespaceOption, dryRunOption, outputOption] },
        { name: 'restart', description: 'Restart rollout', args: [{ name: 'type', suggestions: s('deployment', 'daemonset', 'statefulset') }, { name: 'name' }], options: [namespaceOption, selectorOption, dryRunOption, outputOption] },
        { name: 'undo', description: 'Undo rollout', args: [{ name: 'type', suggestions: s('deployment', 'daemonset', 'statefulset') }, { name: 'name' }], options: [namespaceOption, { name: '--to-revision', description: 'Revision to rollback to', args: { name: 'revision' } }, dryRunOption, outputOption] }
      ]
    },
    {
      name: 'scale',
      description: 'Set a new size for a deployment, ReplicaSet, or StatefulSet',
      args: [
        { name: 'type/name' }
      ],
      options: [
        { name: '--replicas', description: 'New number of replicas', args: { name: 'count' } },
        { name: '--current-replicas', description: 'Current replicas for validation', args: { name: 'count' } },
        { name: '--resource-version', description: 'Resource version for validation', args: { name: 'version' } },
        { name: '--timeout', description: 'Timeout', args: { name: 'duration' } },
        namespaceOption,
        selectorOption,
        dryRunOption,
        outputOption
      ]
    },
    {
      name: 'autoscale',
      description: 'Auto-scale a deployment, ReplicaSet, or StatefulSet',
      args: [
        { name: 'type/name' }
      ],
      options: [
        { name: '--min', description: 'Minimum replicas', args: { name: 'count' } },
        { name: '--max', description: 'Maximum replicas', args: { name: 'count' } },
        { name: '--cpu-percent', description: 'CPU utilization target', args: { name: 'percent' } },
        { name: '--name', description: 'HPA name', args: { name: 'name' } },
        namespaceOption,
        dryRunOption,
        outputOption
      ]
    },

    // Cluster Management Commands
    {
      name: 'certificate',
      description: 'Modify certificate resources',
      subcommands: [
        { name: 'approve', description: 'Approve a certificate signing request', args: { name: 'csr', isVariadic: true }, options: [dryRunOption, outputOption, { name: '--force', description: 'Force approval' }] },
        { name: 'deny', description: 'Deny a certificate signing request', args: { name: 'csr', isVariadic: true }, options: [dryRunOption, outputOption, { name: '--force', description: 'Force denial' }] }
      ]
    },
    {
      name: 'cluster-info',
      description: 'Display cluster info',
      subcommands: [
        { name: 'dump', description: 'Dump cluster state', options: [{ name: '--output-directory', description: 'Output directory', args: { name: 'dir', template: 'folders' } }, { name: '--pod-running-timeout', description: 'Pod running timeout', args: { name: 'duration' } }, namespaceOption, allNamespacesOption] }
      ]
    },
    {
      name: 'top',
      description: 'Display resource usage',
      subcommands: [
        { name: 'node', description: 'Display node resource usage', args: { name: 'name', isOptional: true, generators: kubectlGenerators.nodes }, options: [{ name: '--no-headers', description: 'Don\'t print headers' }, { name: '--use-protocol-buffers', description: 'Use protocol buffers' }, selectorOption, { name: '--sort-by', description: 'Sort by field', args: { name: 'field', suggestions: s('cpu', 'memory') } }] },
        { name: 'pod', description: 'Display pod resource usage', args: { name: 'name', isOptional: true, generators: kubectlGenerators.pods }, options: [namespaceOption, allNamespacesOption, { name: '--containers', description: 'Show container metrics' }, { name: '--no-headers', description: 'Don\'t print headers' }, selectorOption, { name: '--sort-by', description: 'Sort by field', args: { name: 'field', suggestions: s('cpu', 'memory') } }] }
      ]
    },
    {
      name: 'cordon',
      description: 'Mark node as unschedulable',
      args: { name: 'node', generators: kubectlGenerators.nodes },
      options: [dryRunOption, selectorOption]
    },
    {
      name: 'uncordon',
      description: 'Mark node as schedulable',
      args: { name: 'node', generators: kubectlGenerators.nodes },
      options: [dryRunOption, selectorOption]
    },
    {
      name: 'drain',
      description: 'Drain node in preparation for maintenance',
      args: { name: 'node', generators: kubectlGenerators.nodes },
      options: [
        { name: '--force', description: 'Continue even if there are pods not managed by a ReplicationController, ReplicaSet, Job, DaemonSet or StatefulSet' },
        { name: '--grace-period', description: 'Grace period', args: { name: 'seconds' } },
        { name: '--ignore-daemonsets', description: 'Ignore DaemonSet pods' },
        { name: '--delete-emptydir-data', description: 'Continue even if there are pods using emptyDir' },
        { name: '--timeout', description: 'Timeout', args: { name: 'duration' } },
        { name: '--pod-selector', description: 'Pod selector', args: { name: 'selector' } },
        { name: '--skip-wait-for-delete-timeout', description: 'Skip waiting for pod deletion', args: { name: 'seconds' } },
        { name: '--disable-eviction', description: 'Force delete pods' },
        dryRunOption,
        selectorOption
      ]
    },
    {
      name: 'taint',
      description: 'Update taints on nodes',
      args: [
        { name: 'node', generators: kubectlGenerators.nodes },
        { name: 'taint', isVariadic: true }
      ],
      options: [
        { name: '--all', description: 'Select all nodes' },
        { name: '--overwrite', description: 'Overwrite existing taints' },
        dryRunOption,
        outputOption
      ]
    },

    // Troubleshooting and Debugging Commands
    {
      name: 'describe',
      description: 'Show details of a specific resource',
      args: [
        { name: 'type', suggestions: resourceTypes },
        { name: 'name', isOptional: true, isVariadic: true }
      ],
      options: [
        namespaceOption,
        allNamespacesOption,
        selectorOption,
        { name: ['-f', '--filename'], description: 'Filename, directory, or URL', args: { name: 'file', template: 'filepaths' } },
        { name: ['-k', '--kustomize'], description: 'Kustomization directory', args: { name: 'dir', template: 'folders' } },
        { name: '--show-events', description: 'Show events related to the object' }
      ]
    },
    {
      name: 'logs',
      description: 'Print the logs for a container in a pod',
      args: { name: 'pod', generators: kubectlGenerators.pods },
      options: [
        namespaceOption,
        { name: ['-c', '--container'], description: 'Container name', args: { name: 'container' } },
        { name: ['-f', '--follow'], description: 'Follow log output' },
        { name: ['-p', '--previous'], description: 'Previous terminated container' },
        { name: '--since', description: 'Only logs newer than relative duration', args: { name: 'duration' } },
        { name: '--since-time', description: 'Only logs after specific date', args: { name: 'time' } },
        { name: '--timestamps', description: 'Include timestamps' },
        { name: '--tail', description: 'Lines of recent log file', args: { name: 'lines' } },
        { name: '--limit-bytes', description: 'Max bytes to return', args: { name: 'bytes' } },
        { name: '--all-containers', description: 'Get logs from all containers' },
        { name: '--max-log-requests', description: 'Max concurrent log requests', args: { name: 'count' } },
        { name: '--prefix', description: 'Prefix each log line with pod name and container name' },
        selectorOption,
        { name: '--ignore-errors', description: 'Ignore errors when retrieving logs' }
      ]
    },
    {
      name: 'attach',
      description: 'Attach to a running container',
      args: { name: 'pod', generators: kubectlGenerators.pods },
      options: [
        namespaceOption,
        { name: ['-c', '--container'], description: 'Container name', args: { name: 'container' } },
        { name: ['-i', '--stdin'], description: 'Pass stdin to container' },
        { name: ['-t', '--tty'], description: 'Stdin is a TTY' },
        { name: '--pod-running-timeout', description: 'Timeout for pod to be running', args: { name: 'duration' } }
      ]
    },
    {
      name: 'exec',
      description: 'Execute a command in a container',
      args: [
        { name: 'pod', generators: kubectlGenerators.pods },
        { name: 'command', isVariadic: true }
      ],
      options: [
        namespaceOption,
        { name: ['-c', '--container'], description: 'Container name', args: { name: 'container' } },
        { name: ['-i', '--stdin'], description: 'Pass stdin to container' },
        { name: ['-t', '--tty'], description: 'Stdin is a TTY' },
        { name: '--pod-running-timeout', description: 'Timeout for pod to be running', args: { name: 'duration' } }
      ]
    },
    {
      name: 'port-forward',
      description: 'Forward local ports to a pod',
      args: [
        { name: 'pod', generators: kubectlGenerators.pods },
        { name: 'ports', isVariadic: true }
      ],
      options: [
        namespaceOption,
        { name: '--address', description: 'Addresses to listen on', args: { name: 'addresses' } },
        { name: '--pod-running-timeout', description: 'Timeout for pod to be running', args: { name: 'duration' } }
      ]
    },
    {
      name: 'proxy',
      description: 'Run a proxy to the Kubernetes API server',
      options: [
        { name: ['-p', '--port'], description: 'Port to run proxy on', args: { name: 'port' } },
        { name: '--address', description: 'Address to bind to', args: { name: 'ip' } },
        { name: '--api-prefix', description: 'Prefix for API paths', args: { name: 'prefix' } },
        { name: '--accept-hosts', description: 'Regular expression for hosts', args: { name: 'regex' } },
        { name: '--accept-paths', description: 'Regular expression for paths', args: { name: 'regex' } },
        { name: '--reject-methods', description: 'Rejected HTTP methods', args: { name: 'methods' } },
        { name: '--reject-paths', description: 'Rejected path regex', args: { name: 'regex' } },
        { name: '--www', description: 'Static file directory', args: { name: 'dir', template: 'folders' } },
        { name: '--www-prefix', description: 'Prefix for static files', args: { name: 'prefix' } },
        { name: '--disable-filter', description: 'Disable request filtering' },
        { name: ['-u', '--unix-socket'], description: 'Unix socket to listen on', args: { name: 'path' } }
      ]
    },
    {
      name: 'cp',
      description: 'Copy files to and from containers',
      args: [
        { name: 'source' },
        { name: 'dest' }
      ],
      options: [
        namespaceOption,
        { name: ['-c', '--container'], description: 'Container name', args: { name: 'container' } },
        { name: '--no-preserve', description: 'Don\'t preserve ownership and permissions' },
        { name: '--retries', description: 'Retries on network errors', args: { name: 'count' } }
      ]
    },
    {
      name: 'auth',
      description: 'Inspect authorization',
      subcommands: [
        { name: 'can-i', description: 'Check whether an action is allowed', args: [{ name: 'verb', suggestions: s('get', 'list', 'watch', 'create', 'update', 'patch', 'delete', 'deletecollection', '*') }, { name: 'resource', suggestions: resourceTypes }, { name: 'name', isOptional: true }], options: [namespaceOption, allNamespacesOption, { name: '--list', description: 'List allowed actions' }, { name: '--subresource', description: 'Subresource', args: { name: 'subresource' } }, { name: '--as', description: 'Username to impersonate', args: { name: 'user' } }, { name: '--as-group', description: 'Group to impersonate', args: { name: 'group' } }] },
        { name: 'reconcile', description: 'Reconciles rules for RBAC resources', options: [{ name: ['-f', '--filename'], description: 'Filename', args: { name: 'file', template: 'filepaths' } }, { name: ['-k', '--kustomize'], description: 'Kustomization directory', args: { name: 'dir', template: 'folders' } }, { name: '--remove-extra-permissions', description: 'Remove extra permissions' }, { name: '--remove-extra-subjects', description: 'Remove extra subjects' }, dryRunOption, outputOption] },
        { name: 'whoami', description: 'Display current authentication info' }
      ]
    },
    {
      name: 'debug',
      description: 'Create debugging sessions for troubleshooting workloads',
      args: [
        { name: 'type/name' }
      ],
      options: [
        namespaceOption,
        { name: ['-c', '--container'], description: 'Container name', args: { name: 'name' } },
        { name: '--image', description: 'Image for debug container', args: { name: 'image' } },
        { name: '--image-pull-policy', description: 'Image pull policy', args: { name: 'policy', suggestions: s('Always', 'Never', 'IfNotPresent') } },
        { name: '--copy-to', description: 'Create copy of target pod with debug container', args: { name: 'name' } },
        { name: '--replace', description: 'Delete original pod' },
        { name: '--same-node', description: 'Schedule copied pod on same node' },
        { name: '--share-processes', description: 'Share process namespace' },
        { name: '--set-image', description: 'Override container image', args: { name: 'container=image' } },
        { name: '--env', description: 'Environment variables', args: { name: 'key=value' } },
        { name: '--target', description: 'Target container', args: { name: 'container' } },
        { name: ['-i', '--stdin'], description: 'Keep stdin open' },
        { name: ['-t', '--tty'], description: 'Allocate a TTY' },
        { name: '--attach', description: 'Automatically attach' },
        { name: '--quiet', description: 'Suppress informational messages' }
      ]
    },
    {
      name: 'events',
      description: 'List events',
      options: [
        namespaceOption,
        allNamespacesOption,
        { name: '--for', description: 'Filter events for resource', args: { name: 'type/name' } },
        { name: '--types', description: 'Filter by event types', args: { name: 'types', suggestions: s('Normal', 'Warning') } },
        { name: '--watch', description: 'Watch events' },
        { name: '--no-headers', description: 'Don\'t print headers' },
        outputOption
      ]
    },

    // Advanced Commands
    {
      name: 'diff',
      description: 'Diff a version of the configuration with the current state',
      options: [
        { name: ['-f', '--filename'], description: 'Filename, directory, or URL', args: { name: 'file', template: 'filepaths' } },
        { name: ['-k', '--kustomize'], description: 'Kustomization directory', args: { name: 'dir', template: 'folders' } },
        { name: ['-R', '--recursive'], description: 'Process directories recursively' },
        { name: '--field-manager', description: 'Name of field manager', args: { name: 'name' } },
        { name: '--force-conflicts', description: 'Force conflicts' },
        { name: '--server-side', description: 'Run diff server-side' }
      ]
    },
    {
      name: 'apply',
      description: 'Apply a configuration to a resource by filename or stdin',
      options: [
        { name: ['-f', '--filename'], description: 'Filename, directory, or URL', args: { name: 'file', template: 'filepaths' } },
        { name: ['-k', '--kustomize'], description: 'Kustomization directory', args: { name: 'dir', template: 'folders' } },
        { name: ['-R', '--recursive'], description: 'Process directories recursively' },
        namespaceOption,
        selectorOption,
        { name: '--prune', description: 'Automatically delete removed resources' },
        { name: '--prune-whitelist', description: 'Prune whitelist', args: { name: 'group/version/kind' } },
        { name: '--force', description: 'Force apply' },
        { name: '--force-conflicts', description: 'Force conflicts' },
        { name: '--server-side', description: 'Run apply server-side' },
        { name: '--field-manager', description: 'Name of field manager', args: { name: 'name' } },
        { name: '--validate', description: 'Validate input', args: { name: 'mode', suggestions: s('strict', 'warn', 'ignore') } },
        dryRunOption,
        outputOption
      ],
      subcommands: [
        { name: 'edit-last-applied', description: 'Edit latest applied configuration', args: [{ name: 'type', suggestions: resourceTypes }, { name: 'name' }], options: [namespaceOption, { name: ['-f', '--filename'], description: 'Filename', args: { name: 'file', template: 'filepaths' } }] },
        { name: 'set-last-applied', description: 'Set last-applied annotation', options: [{ name: ['-f', '--filename'], description: 'Filename', args: { name: 'file', template: 'filepaths' } }, namespaceOption, { name: '--create-annotation', description: 'Create annotation if missing' }, dryRunOption, outputOption] },
        { name: 'view-last-applied', description: 'View latest applied configuration', args: [{ name: 'type', suggestions: resourceTypes }, { name: 'name' }], options: [namespaceOption, { name: ['-f', '--filename'], description: 'Filename', args: { name: 'file', template: 'filepaths' } }, outputOption] }
      ]
    },
    {
      name: 'patch',
      description: 'Update fields of a resource',
      args: [
        { name: 'type', suggestions: resourceTypes },
        { name: 'name' }
      ],
      options: [
        { name: ['-p', '--patch'], description: 'Patch content', args: { name: 'patch' } },
        { name: '--patch-file', description: 'Patch file', args: { name: 'file', template: 'filepaths' } },
        { name: '--type', description: 'Patch type', args: { name: 'type', suggestions: s('json', 'merge', 'strategic') } },
        namespaceOption,
        dryRunOption,
        outputOption
      ]
    },
    {
      name: 'replace',
      description: 'Replace a resource by filename or stdin',
      options: [
        { name: ['-f', '--filename'], description: 'Filename, directory, or URL', args: { name: 'file', template: 'filepaths' } },
        { name: ['-k', '--kustomize'], description: 'Kustomization directory', args: { name: 'dir', template: 'folders' } },
        { name: '--force', description: 'Delete and recreate resource' },
        { name: '--grace-period', description: 'Grace period', args: { name: 'seconds' } },
        { name: '--cascade', description: 'Cascade deletion', args: { name: 'mode', suggestions: s('background', 'orphan', 'foreground') } },
        { name: '--timeout', description: 'Timeout', args: { name: 'duration' } },
        namespaceOption,
        dryRunOption,
        outputOption
      ]
    },
    {
      name: 'wait',
      description: 'Wait for a specific condition on resources',
      args: [
        { name: 'type', suggestions: resourceTypes },
        { name: 'name', isOptional: true }
      ],
      options: [
        { name: '--for', description: 'Condition to wait for', args: { name: 'condition', suggestions: s('condition=Ready', 'condition=Available', 'condition=Complete', 'delete', 'jsonpath=') } },
        { name: '--timeout', description: 'Timeout', args: { name: 'duration' } },
        namespaceOption,
        allNamespacesOption,
        selectorOption,
        { name: ['-f', '--filename'], description: 'Filename', args: { name: 'file', template: 'filepaths' } }
      ]
    },
    {
      name: 'kustomize',
      description: 'Build a kustomization target',
      args: { name: 'dir', template: 'folders' },
      options: [
        { name: ['-o', '--output'], description: 'Output file', args: { name: 'file', template: 'filepaths' } },
        { name: '--enable-helm', description: 'Enable Helm chart rendering' },
        { name: '--enable-alpha-plugins', description: 'Enable alpha plugins' },
        { name: '--as-current-user', description: 'Use current user credentials' },
        { name: '--helm-command', description: 'Helm command', args: { name: 'command' } },
        { name: '--load-restrictor', description: 'Load restrictor', args: { name: 'mode', suggestions: s('LoadRestrictionsNone', 'LoadRestrictionsRootOnly') } },
        { name: '--network', description: 'Enable network access' },
        { name: '--network-name', description: 'Network name', args: { name: 'name' } },
        { name: '--reorder', description: 'Reorder resources', args: { name: 'mode', suggestions: s('legacy', 'none') } }
      ]
    },
    {
      name: 'label',
      description: 'Update labels on a resource',
      args: [
        { name: 'type', suggestions: resourceTypes },
        { name: 'name' },
        { name: 'labels', isVariadic: true }
      ],
      options: [
        namespaceOption,
        allNamespacesOption,
        selectorOption,
        { name: '--all', description: 'Select all resources' },
        { name: '--overwrite', description: 'Overwrite existing labels' },
        { name: '--resource-version', description: 'Resource version', args: { name: 'version' } },
        { name: ['-f', '--filename'], description: 'Filename', args: { name: 'file', template: 'filepaths' } },
        dryRunOption,
        outputOption
      ]
    },
    {
      name: 'annotate',
      description: 'Update annotations on a resource',
      args: [
        { name: 'type', suggestions: resourceTypes },
        { name: 'name' },
        { name: 'annotations', isVariadic: true }
      ],
      options: [
        namespaceOption,
        allNamespacesOption,
        selectorOption,
        { name: '--all', description: 'Select all resources' },
        { name: '--overwrite', description: 'Overwrite existing annotations' },
        { name: '--resource-version', description: 'Resource version', args: { name: 'version' } },
        { name: ['-f', '--filename'], description: 'Filename', args: { name: 'file', template: 'filepaths' } },
        dryRunOption,
        outputOption
      ]
    },

    // Settings Commands
    {
      name: 'completion',
      description: 'Output shell completion code',
      args: { name: 'shell', suggestions: s('bash', 'zsh', 'fish', 'powershell') }
    },

    // Other Commands
    {
      name: 'api-resources',
      description: 'Print supported API resources',
      options: [
        { name: '--api-group', description: 'Filter by API group', args: { name: 'group' } },
        { name: '--namespaced', description: 'Filter by namespaced', args: { name: 'bool', suggestions: s('true', 'false') } },
        { name: '--verbs', description: 'Filter by supported verbs', args: { name: 'verbs' } },
        { name: '--sort-by', description: 'Sort by field', args: { name: 'field', suggestions: s('name', 'kind') } },
        outputOption,
        { name: '--no-headers', description: 'Don\'t print headers' }
      ]
    },
    {
      name: 'api-versions',
      description: 'Print supported API versions'
    },
    {
      name: 'config',
      description: 'Modify kubeconfig files',
      subcommands: [
        { name: 'view', description: 'Display kubeconfig settings', options: [{ name: '--flatten', description: 'Flatten output' }, { name: '--merge', description: 'Merge multiple kubeconfigs' }, { name: '--minify', description: 'Remove unused information' }, { name: '--raw', description: 'Display raw byte data' }, outputOption] },
        { name: 'current-context', description: 'Display current context' },
        { name: 'get-contexts', description: 'Describe contexts', args: { name: 'name', isOptional: true, generators: kubectlGenerators.contexts }, options: [outputOption, { name: '--no-headers', description: 'Don\'t print headers' }] },
        { name: 'get-clusters', description: 'Display clusters' },
        { name: 'get-users', description: 'Display users' },
        { name: 'use-context', description: 'Set current context', args: { name: 'context', generators: kubectlGenerators.contexts } },
        { name: 'set-context', description: 'Set a context entry', args: { name: 'name' }, options: [{ name: '--current', description: 'Modify current context' }, { name: '--cluster', description: 'Cluster', args: { name: 'name' } }, { name: '--user', description: 'User', args: { name: 'name' } }, { name: '--namespace', description: 'Namespace', args: { name: 'namespace', generators: kubectlGenerators.namespaces } }] },
        { name: 'set-cluster', description: 'Set a cluster entry', args: { name: 'name' }, options: [{ name: '--server', description: 'Server address', args: { name: 'url' } }, { name: '--certificate-authority', description: 'CA cert file', args: { name: 'file', template: 'filepaths' } }, { name: '--insecure-skip-tls-verify', description: 'Skip TLS verification' }, { name: '--tls-server-name', description: 'TLS server name', args: { name: 'name' } }] },
        { name: 'set-credentials', description: 'Set a user entry', args: { name: 'name' }, options: [{ name: '--client-certificate', description: 'Client cert file', args: { name: 'file', template: 'filepaths' } }, { name: '--client-key', description: 'Client key file', args: { name: 'file', template: 'filepaths' } }, { name: '--token', description: 'Bearer token', args: { name: 'token' } }, { name: '--username', description: 'Username', args: { name: 'name' } }, { name: '--password', description: 'Password', args: { name: 'password' } }, { name: '--exec-api-version', description: 'Exec API version', args: { name: 'version' } }, { name: '--exec-command', description: 'Exec command', args: { name: 'command' } }, { name: '--exec-arg', description: 'Exec argument', args: { name: 'arg' } }, { name: '--exec-env', description: 'Exec env var', args: { name: 'key=value' } }] },
        { name: 'delete-context', description: 'Delete a context', args: { name: 'name', generators: kubectlGenerators.contexts } },
        { name: 'delete-cluster', description: 'Delete a cluster', args: { name: 'name' } },
        { name: 'delete-user', description: 'Delete a user', args: { name: 'name' } },
        { name: 'rename-context', description: 'Rename a context', args: [{ name: 'old', generators: kubectlGenerators.contexts }, { name: 'new' }] },
        { name: 'unset', description: 'Unset individual values', args: { name: 'property-name' } }
      ]
    },
    {
      name: 'plugin',
      description: 'Provides utilities for interacting with plugins',
      subcommands: [
        { name: 'list', description: 'List available plugins' }
      ]
    },
    {
      name: 'version',
      description: 'Print client and server version information',
      options: [
        { name: '--client', description: 'Client version only' },
        { name: '--short', description: 'Short version output' },
        outputOption
      ]
    }
  ],
  options: [
    { name: '--kubeconfig', description: 'Path to kubeconfig file', args: { name: 'file', template: 'filepaths' } },
    { name: '--context', description: 'Context to use', args: { name: 'name', generators: kubectlGenerators.contexts } },
    { name: '--cluster', description: 'Cluster to use', args: { name: 'name' } },
    { name: '--user', description: 'User to use', args: { name: 'name' } },
    { name: ['-n', '--namespace'], description: 'Namespace scope', args: { name: 'namespace', generators: kubectlGenerators.namespaces } },
    { name: ['-s', '--server'], description: 'API server address', args: { name: 'url' } },
    { name: '--tls-server-name', description: 'Server name for TLS validation', args: { name: 'name' } },
    { name: '--insecure-skip-tls-verify', description: 'Skip certificate validation' },
    { name: '--certificate-authority', description: 'CA certificate', args: { name: 'file', template: 'filepaths' } },
    { name: '--client-certificate', description: 'Client certificate', args: { name: 'file', template: 'filepaths' } },
    { name: '--client-key', description: 'Client key', args: { name: 'file', template: 'filepaths' } },
    { name: '--token', description: 'Bearer token', args: { name: 'token' } },
    { name: '--as', description: 'Username to impersonate', args: { name: 'user' } },
    { name: '--as-group', description: 'Group to impersonate', args: { name: 'group' } },
    { name: '--as-uid', description: 'UID to impersonate', args: { name: 'uid' } },
    { name: '--cache-dir', description: 'Cache directory', args: { name: 'dir', template: 'folders' } },
    { name: '--request-timeout', description: 'Request timeout', args: { name: 'duration' } },
    { name: ['-v', '--v'], description: 'Log level verbosity', args: { name: 'level' } },
    { name: '--vmodule', description: 'File log pattern', args: { name: 'pattern' } },
    { name: '--warnings-as-errors', description: 'Treat warnings as errors' }
  ]
};
