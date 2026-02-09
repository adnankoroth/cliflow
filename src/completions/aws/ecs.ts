// AWS ECS CLI completions
import { Subcommand } from '../../types.js';
import { s, ecsClusterGenerator } from './_shared.js';

// Launch types
const launchTypes = ['EC2', 'FARGATE', 'EXTERNAL'];
const schedulingStrategies = ['REPLICA', 'DAEMON'];
const deploymentControllerTypes = ['ECS', 'CODE_DEPLOY', 'EXTERNAL'];
const capacityProviderStrategies = ['FARGATE', 'FARGATE_SPOT'];
const networkModes = ['bridge', 'host', 'awsvpc', 'none'];
const taskDefinitionStatus = ['ACTIVE', 'INACTIVE', 'DELETE_IN_PROGRESS'];
const desiredStatus = ['RUNNING', 'PENDING', 'STOPPED'];
const propagateTags = ['TASK_DEFINITION', 'SERVICE', 'NONE'];
const containerInstanceStatus = ['ACTIVE', 'DRAINING', 'REGISTERING', 'DEREGISTERING', 'REGISTRATION_FAILED'];

// Service generator
const ecsServiceGenerator = {
  script: 'aws ecs list-services --query "serviceArns[*]" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(arn => {
      const name = arn.split('/').pop() || arn;
      return {
        name: name,
        description: 'ECS Service',
        icon: '🔄',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Task definition generator
const taskDefinitionGenerator = {
  script: 'aws ecs list-task-definitions --status ACTIVE --query "taskDefinitionArns[-10:]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(arn => {
      const parts = arn.split('/');
      const familyRev = parts.pop() || arn;
      return {
        name: familyRev,
        description: 'Task Definition',
        icon: '📋',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Task definition family generator
const taskDefinitionFamilyGenerator = {
  script: 'aws ecs list-task-definition-families --status ACTIVE --query "families[*]" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(f => f.trim()).map(family => ({
      name: family.trim(),
      description: 'Task Definition Family',
      icon: '👨‍👩‍👧‍👦',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Task generator (needs cluster context)
const taskGenerator = {
  script: 'aws ecs list-tasks --query "taskArns[*]" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(t => t.trim()).map(arn => {
      const taskId = arn.split('/').pop() || arn;
      return {
        name: taskId,
        description: 'ECS Task',
        icon: '📦',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Container instance generator
const containerInstanceGenerator = {
  script: 'aws ecs list-container-instances --query "containerInstanceArns[*]" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(c => c.trim()).map(arn => {
      const instanceId = arn.split('/').pop() || arn;
      return {
        name: instanceId,
        description: 'Container Instance',
        icon: '🖥️',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Capacity provider generator
const capacityProviderGenerator = {
  script: 'aws ecs describe-capacity-providers --query "capacityProviders[*].name" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(p => p.trim()).map(provider => ({
      name: provider.trim(),
      description: 'Capacity Provider',
      icon: '⚡',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Task set generator
const taskSetGenerator = {
  script: 'aws ecs list-task-sets --query "taskSets[*].id" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(t => t.trim()).map(taskSet => ({
      name: taskSet.trim(),
      description: 'Task Set',
      icon: '📦',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const ecsSubcommands: Subcommand[] = [
  // Cluster operations
  {
    name: 'list-clusters',
    description: 'List ECS clusters',
    options: [
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'describe-clusters',
    description: 'Describe ECS clusters',
    options: [
      { name: '--clusters', description: 'Cluster names or ARNs', args: { name: 'clusters', generators: ecsClusterGenerator, isVariadic: true } },
      { name: '--include', description: 'Include additional info', args: { name: 'info', suggestions: s('ATTACHMENTS', 'CONFIGURATIONS', 'SETTINGS', 'STATISTICS', 'TAGS') } }
    ]
  },
  {
    name: 'create-cluster',
    description: 'Create an ECS cluster',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--settings', description: 'Cluster settings', args: { name: 'settings' } },
      { name: '--configuration', description: 'Cluster configuration', args: { name: 'config' } },
      { name: '--capacity-providers', description: 'Capacity providers', args: { name: 'providers', isVariadic: true } },
      { name: '--default-capacity-provider-strategy', description: 'Default capacity provider strategy', args: { name: 'strategy' } },
      { name: '--service-connect-defaults', description: 'Service Connect defaults', args: { name: 'defaults' } }
    ]
  },
  {
    name: 'delete-cluster',
    description: 'Delete an ECS cluster',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true }
    ]
  },
  {
    name: 'update-cluster',
    description: 'Update an ECS cluster',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--settings', description: 'Cluster settings', args: { name: 'settings' } },
      { name: '--configuration', description: 'Cluster configuration', args: { name: 'config' } },
      { name: '--service-connect-defaults', description: 'Service Connect defaults', args: { name: 'defaults' } }
    ]
  },
  {
    name: 'update-cluster-settings',
    description: 'Update cluster settings',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--settings', description: 'Settings', args: { name: 'settings' }, required: true }
    ]
  },
  {
    name: 'put-cluster-capacity-providers',
    description: 'Put cluster capacity providers',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--capacity-providers', description: 'Capacity providers', args: { name: 'providers', isVariadic: true }, required: true },
      { name: '--default-capacity-provider-strategy', description: 'Default strategy', args: { name: 'strategy' }, required: true }
    ]
  },
  // Service operations
  {
    name: 'list-services',
    description: 'List services in a cluster',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--launch-type', description: 'Filter by launch type', args: { name: 'type', suggestions: s(...launchTypes) } },
      { name: '--scheduling-strategy', description: 'Filter by scheduling strategy', args: { name: 'strategy', suggestions: s(...schedulingStrategies) } }
    ]
  },
  {
    name: 'describe-services',
    description: 'Describe ECS services',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--services', description: 'Service names or ARNs', args: { name: 'services', generators: ecsServiceGenerator, isVariadic: true }, required: true },
      { name: '--include', description: 'Include additional info', args: { name: 'info', suggestions: s('TAGS') } }
    ]
  },
  {
    name: 'create-service',
    description: 'Create an ECS service',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--service-name', description: 'Service name', args: { name: 'name' }, required: true },
      { name: '--task-definition', description: 'Task definition', args: { name: 'definition', generators: taskDefinitionGenerator } },
      { name: '--load-balancers', description: 'Load balancers', args: { name: 'balancers' } },
      { name: '--service-registries', description: 'Service registries', args: { name: 'registries' } },
      { name: '--desired-count', description: 'Desired count', args: { name: 'count' } },
      { name: '--client-token', description: 'Client token', args: { name: 'token' } },
      { name: '--launch-type', description: 'Launch type', args: { name: 'type', suggestions: s(...launchTypes) } },
      { name: '--capacity-provider-strategy', description: 'Capacity provider strategy', args: { name: 'strategy' } },
      { name: '--platform-version', description: 'Platform version', args: { name: 'version' } },
      { name: '--role', description: 'IAM role', args: { name: 'role' } },
      { name: '--deployment-configuration', description: 'Deployment configuration', args: { name: 'config' } },
      { name: '--placement-constraints', description: 'Placement constraints', args: { name: 'constraints' } },
      { name: '--placement-strategy', description: 'Placement strategy', args: { name: 'strategy' } },
      { name: '--network-configuration', description: 'Network configuration', args: { name: 'config' } },
      { name: '--health-check-grace-period-seconds', description: 'Health check grace period', args: { name: 'seconds' } },
      { name: '--scheduling-strategy', description: 'Scheduling strategy', args: { name: 'strategy', suggestions: s(...schedulingStrategies) } },
      { name: '--deployment-controller', description: 'Deployment controller', args: { name: 'controller' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--enable-ecs-managed-tags', description: 'Enable ECS managed tags' },
      { name: '--no-enable-ecs-managed-tags', description: 'Disable ECS managed tags' },
      { name: '--propagate-tags', description: 'Propagate tags', args: { name: 'mode', suggestions: s(...propagateTags) } },
      { name: '--enable-execute-command', description: 'Enable execute command' },
      { name: '--no-enable-execute-command', description: 'Disable execute command' },
      { name: '--service-connect-configuration', description: 'Service Connect configuration', args: { name: 'config' } },
      { name: '--volume-configurations', description: 'Volume configurations', args: { name: 'configs' } }
    ]
  },
  {
    name: 'update-service',
    description: 'Update an ECS service',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--service', description: 'Service name or ARN', args: { name: 'service', generators: ecsServiceGenerator }, required: true },
      { name: '--desired-count', description: 'Desired count', args: { name: 'count' } },
      { name: '--task-definition', description: 'Task definition', args: { name: 'definition', generators: taskDefinitionGenerator } },
      { name: '--capacity-provider-strategy', description: 'Capacity provider strategy', args: { name: 'strategy' } },
      { name: '--deployment-configuration', description: 'Deployment configuration', args: { name: 'config' } },
      { name: '--network-configuration', description: 'Network configuration', args: { name: 'config' } },
      { name: '--placement-constraints', description: 'Placement constraints', args: { name: 'constraints' } },
      { name: '--placement-strategy', description: 'Placement strategy', args: { name: 'strategy' } },
      { name: '--platform-version', description: 'Platform version', args: { name: 'version' } },
      { name: '--force-new-deployment', description: 'Force new deployment' },
      { name: '--no-force-new-deployment', description: 'Do not force new deployment' },
      { name: '--health-check-grace-period-seconds', description: 'Health check grace period', args: { name: 'seconds' } },
      { name: '--enable-execute-command', description: 'Enable execute command' },
      { name: '--disable-execute-command', description: 'Disable execute command' },
      { name: '--enable-ecs-managed-tags', description: 'Enable ECS managed tags' },
      { name: '--disable-ecs-managed-tags', description: 'Disable ECS managed tags' },
      { name: '--load-balancers', description: 'Load balancers', args: { name: 'balancers' } },
      { name: '--propagate-tags', description: 'Propagate tags', args: { name: 'mode', suggestions: s(...propagateTags) } },
      { name: '--service-registries', description: 'Service registries', args: { name: 'registries' } },
      { name: '--service-connect-configuration', description: 'Service Connect configuration', args: { name: 'config' } },
      { name: '--volume-configurations', description: 'Volume configurations', args: { name: 'configs' } }
    ]
  },
  {
    name: 'delete-service',
    description: 'Delete an ECS service',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--service', description: 'Service name or ARN', args: { name: 'service', generators: ecsServiceGenerator }, required: true },
      { name: '--force', description: 'Force deletion' },
      { name: '--no-force', description: 'Do not force deletion' }
    ]
  },
  // Task definition operations
  {
    name: 'list-task-definitions',
    description: 'List task definitions',
    options: [
      { name: '--family-prefix', description: 'Filter by family prefix', args: { name: 'prefix', generators: taskDefinitionFamilyGenerator } },
      { name: '--status', description: 'Status filter', args: { name: 'status', suggestions: s(...taskDefinitionStatus) } },
      { name: '--sort', description: 'Sort order', args: { name: 'order', suggestions: s('ASC', 'DESC') } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'list-task-definition-families',
    description: 'List task definition families',
    options: [
      { name: '--family-prefix', description: 'Filter by family prefix', args: { name: 'prefix' } },
      { name: '--status', description: 'Status filter', args: { name: 'status', suggestions: s('ACTIVE', 'INACTIVE', 'ALL') } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'describe-task-definition',
    description: 'Describe a task definition',
    options: [
      { name: '--task-definition', description: 'Task definition', args: { name: 'definition', generators: taskDefinitionGenerator }, required: true },
      { name: '--include', description: 'Include additional info', args: { name: 'info', suggestions: s('TAGS') } }
    ]
  },
  {
    name: 'register-task-definition',
    description: 'Register a task definition',
    options: [
      { name: '--family', description: 'Family name', args: { name: 'family' }, required: true },
      { name: '--task-role-arn', description: 'Task role ARN', args: { name: 'arn' } },
      { name: '--execution-role-arn', description: 'Execution role ARN', args: { name: 'arn' } },
      { name: '--network-mode', description: 'Network mode', args: { name: 'mode', suggestions: s(...networkModes) } },
      { name: '--container-definitions', description: 'Container definitions', args: { name: 'definitions' }, required: true },
      { name: '--volumes', description: 'Volumes', args: { name: 'volumes' } },
      { name: '--placement-constraints', description: 'Placement constraints', args: { name: 'constraints' } },
      { name: '--requires-compatibilities', description: 'Required compatibilities', args: { name: 'compatibilities', suggestions: s(...launchTypes), isVariadic: true } },
      { name: '--cpu', description: 'CPU', args: { name: 'cpu', suggestions: s('256', '512', '1024', '2048', '4096') } },
      { name: '--memory', description: 'Memory', args: { name: 'memory', suggestions: s('512', '1024', '2048', '4096', '8192', '16384') } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--pid-mode', description: 'PID mode', args: { name: 'mode', suggestions: s('host', 'task') } },
      { name: '--ipc-mode', description: 'IPC mode', args: { name: 'mode', suggestions: s('host', 'task', 'none') } },
      { name: '--proxy-configuration', description: 'Proxy configuration', args: { name: 'config' } },
      { name: '--inference-accelerators', description: 'Inference accelerators', args: { name: 'accelerators' } },
      { name: '--ephemeral-storage', description: 'Ephemeral storage', args: { name: 'storage' } },
      { name: '--runtime-platform', description: 'Runtime platform', args: { name: 'platform' } }
    ]
  },
  {
    name: 'deregister-task-definition',
    description: 'Deregister a task definition',
    options: [
      { name: '--task-definition', description: 'Task definition', args: { name: 'definition', generators: taskDefinitionGenerator }, required: true }
    ]
  },
  {
    name: 'delete-task-definitions',
    description: 'Delete task definitions',
    options: [
      { name: '--task-definitions', description: 'Task definitions', args: { name: 'definitions', generators: taskDefinitionGenerator, isVariadic: true }, required: true }
    ]
  },
  // Task operations
  {
    name: 'list-tasks',
    description: 'List tasks in a cluster',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--container-instance', description: 'Container instance', args: { name: 'instance', generators: containerInstanceGenerator } },
      { name: '--family', description: 'Task definition family', args: { name: 'family', generators: taskDefinitionFamilyGenerator } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--started-by', description: 'Started by filter', args: { name: 'identifier' } },
      { name: '--service-name', description: 'Service name filter', args: { name: 'service', generators: ecsServiceGenerator } },
      { name: '--desired-status', description: 'Desired status filter', args: { name: 'status', suggestions: s(...desiredStatus) } },
      { name: '--launch-type', description: 'Launch type filter', args: { name: 'type', suggestions: s(...launchTypes) } }
    ]
  },
  {
    name: 'describe-tasks',
    description: 'Describe tasks',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--tasks', description: 'Task IDs or ARNs', args: { name: 'tasks', generators: taskGenerator, isVariadic: true }, required: true },
      { name: '--include', description: 'Include additional info', args: { name: 'info', suggestions: s('TAGS') } }
    ]
  },
  {
    name: 'run-task',
    description: 'Run a task',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--task-definition', description: 'Task definition', args: { name: 'definition', generators: taskDefinitionGenerator }, required: true },
      { name: '--overrides', description: 'Task overrides', args: { name: 'overrides' } },
      { name: '--count', description: 'Task count', args: { name: 'count', suggestions: s('1', '2', '5', '10') } },
      { name: '--started-by', description: 'Started by identifier', args: { name: 'identifier' } },
      { name: '--group', description: 'Task group', args: { name: 'group' } },
      { name: '--placement-constraints', description: 'Placement constraints', args: { name: 'constraints' } },
      { name: '--placement-strategy', description: 'Placement strategy', args: { name: 'strategy' } },
      { name: '--launch-type', description: 'Launch type', args: { name: 'type', suggestions: s(...launchTypes) } },
      { name: '--capacity-provider-strategy', description: 'Capacity provider strategy', args: { name: 'strategy' } },
      { name: '--platform-version', description: 'Platform version', args: { name: 'version' } },
      { name: '--network-configuration', description: 'Network configuration', args: { name: 'config' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--enable-ecs-managed-tags', description: 'Enable ECS managed tags' },
      { name: '--no-enable-ecs-managed-tags', description: 'Disable ECS managed tags' },
      { name: '--propagate-tags', description: 'Propagate tags', args: { name: 'mode', suggestions: s(...propagateTags) } },
      { name: '--reference-id', description: 'Reference ID', args: { name: 'id' } },
      { name: '--enable-execute-command', description: 'Enable execute command' },
      { name: '--no-enable-execute-command', description: 'Disable execute command' },
      { name: '--volume-configurations', description: 'Volume configurations', args: { name: 'configs' } }
    ]
  },
  {
    name: 'start-task',
    description: 'Start a task on specific container instances',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--task-definition', description: 'Task definition', args: { name: 'definition', generators: taskDefinitionGenerator }, required: true },
      { name: '--overrides', description: 'Task overrides', args: { name: 'overrides' } },
      { name: '--container-instances', description: 'Container instances', args: { name: 'instances', generators: containerInstanceGenerator, isVariadic: true }, required: true },
      { name: '--started-by', description: 'Started by identifier', args: { name: 'identifier' } },
      { name: '--group', description: 'Task group', args: { name: 'group' } },
      { name: '--network-configuration', description: 'Network configuration', args: { name: 'config' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--enable-ecs-managed-tags', description: 'Enable ECS managed tags' },
      { name: '--no-enable-ecs-managed-tags', description: 'Disable ECS managed tags' },
      { name: '--propagate-tags', description: 'Propagate tags', args: { name: 'mode', suggestions: s(...propagateTags) } },
      { name: '--reference-id', description: 'Reference ID', args: { name: 'id' } },
      { name: '--enable-execute-command', description: 'Enable execute command' },
      { name: '--no-enable-execute-command', description: 'Disable execute command' },
      { name: '--volume-configurations', description: 'Volume configurations', args: { name: 'configs' } }
    ]
  },
  {
    name: 'stop-task',
    description: 'Stop a task',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--task', description: 'Task ID or ARN', args: { name: 'task', generators: taskGenerator }, required: true },
      { name: '--reason', description: 'Stop reason', args: { name: 'reason' } }
    ]
  },
  // Execute command
  {
    name: 'execute-command',
    description: 'Execute a command in a container',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--task', description: 'Task ID or ARN', args: { name: 'task', generators: taskGenerator }, required: true },
      { name: '--container', description: 'Container name', args: { name: 'container' } },
      { name: '--command', description: 'Command to run', args: { name: 'command' }, required: true },
      { name: '--interactive', description: 'Interactive mode', required: true }
    ]
  },
  // Container instances
  {
    name: 'list-container-instances',
    description: 'List container instances',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--filter', description: 'Filter expression', args: { name: 'filter' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--status', description: 'Status filter', args: { name: 'status', suggestions: s(...containerInstanceStatus) } }
    ]
  },
  {
    name: 'describe-container-instances',
    description: 'Describe container instances',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--container-instances', description: 'Container instances', args: { name: 'instances', generators: containerInstanceGenerator, isVariadic: true }, required: true },
      { name: '--include', description: 'Include additional info', args: { name: 'info', suggestions: s('TAGS', 'CONTAINER_INSTANCE_HEALTH') } }
    ]
  },
  {
    name: 'register-container-instance',
    description: 'Register a container instance',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--instance-identity-document', description: 'Instance identity document', args: { name: 'document' } },
      { name: '--instance-identity-document-signature', description: 'Instance identity signature', args: { name: 'signature' } },
      { name: '--total-resources', description: 'Total resources', args: { name: 'resources' } },
      { name: '--version-info', description: 'Version info', args: { name: 'info' } },
      { name: '--container-instance-arn', description: 'Container instance ARN', args: { name: 'arn' } },
      { name: '--attributes', description: 'Attributes', args: { name: 'attributes' } },
      { name: '--platform-devices', description: 'Platform devices', args: { name: 'devices' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'deregister-container-instance',
    description: 'Deregister a container instance',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--container-instance', description: 'Container instance', args: { name: 'instance', generators: containerInstanceGenerator }, required: true },
      { name: '--force', description: 'Force deregistration' },
      { name: '--no-force', description: 'Do not force deregistration' }
    ]
  },
  {
    name: 'update-container-instances-state',
    description: 'Update container instances state',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--container-instances', description: 'Container instances', args: { name: 'instances', generators: containerInstanceGenerator, isVariadic: true }, required: true },
      { name: '--status', description: 'New status', args: { name: 'status', suggestions: s('DRAINING', 'ACTIVE') }, required: true }
    ]
  },
  // Capacity providers
  {
    name: 'describe-capacity-providers',
    description: 'Describe capacity providers',
    options: [
      { name: '--capacity-providers', description: 'Capacity providers', args: { name: 'providers', generators: capacityProviderGenerator, isVariadic: true } },
      { name: '--include', description: 'Include additional info', args: { name: 'info', suggestions: s('TAGS') } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-capacity-provider',
    description: 'Create a capacity provider',
    options: [
      { name: '--name', description: 'Capacity provider name', args: { name: 'name' }, required: true },
      { name: '--auto-scaling-group-provider', description: 'Auto Scaling group provider', args: { name: 'provider' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'update-capacity-provider',
    description: 'Update a capacity provider',
    options: [
      { name: '--name', description: 'Capacity provider name', args: { name: 'name', generators: capacityProviderGenerator }, required: true },
      { name: '--auto-scaling-group-provider', description: 'Auto Scaling group provider', args: { name: 'provider' }, required: true }
    ]
  },
  {
    name: 'delete-capacity-provider',
    description: 'Delete a capacity provider',
    options: [
      { name: '--capacity-provider', description: 'Capacity provider', args: { name: 'provider', generators: capacityProviderGenerator }, required: true }
    ]
  },
  // Account settings
  {
    name: 'list-account-settings',
    description: 'List account settings',
    options: [
      { name: '--name', description: 'Setting name', args: { name: 'name', suggestions: s('serviceLongArnFormat', 'taskLongArnFormat', 'containerInstanceLongArnFormat', 'awsvpcTrunking', 'containerInsights', 'fargateFIPSMode', 'tagResourceAuthorization') } },
      { name: '--value', description: 'Setting value', args: { name: 'value' } },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' } },
      { name: '--effective-settings', description: 'Get effective settings' },
      { name: '--no-effective-settings', description: 'Do not get effective settings' },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'put-account-setting',
    description: 'Put an account setting',
    options: [
      { name: '--name', description: 'Setting name', args: { name: 'name', suggestions: s('serviceLongArnFormat', 'taskLongArnFormat', 'containerInstanceLongArnFormat', 'awsvpcTrunking', 'containerInsights', 'fargateFIPSMode', 'tagResourceAuthorization') }, required: true },
      { name: '--value', description: 'Setting value', args: { name: 'value' }, required: true },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' } }
    ]
  },
  {
    name: 'put-account-setting-default',
    description: 'Put default account setting',
    options: [
      { name: '--name', description: 'Setting name', args: { name: 'name', suggestions: s('serviceLongArnFormat', 'taskLongArnFormat', 'containerInstanceLongArnFormat', 'awsvpcTrunking', 'containerInsights', 'fargateFIPSMode', 'tagResourceAuthorization') }, required: true },
      { name: '--value', description: 'Setting value', args: { name: 'value' }, required: true }
    ]
  },
  {
    name: 'delete-account-setting',
    description: 'Delete an account setting',
    options: [
      { name: '--name', description: 'Setting name', args: { name: 'name', suggestions: s('serviceLongArnFormat', 'taskLongArnFormat', 'containerInstanceLongArnFormat', 'awsvpcTrunking', 'containerInsights', 'fargateFIPSMode', 'tagResourceAuthorization') }, required: true },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' } }
    ]
  },
  // Tags
  {
    name: 'tag-resource',
    description: 'Add tags to a resource',
    options: [
      { name: '--resource-arn', description: 'Resource ARN', args: { name: 'arn' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' }, required: true }
    ]
  },
  {
    name: 'untag-resource',
    description: 'Remove tags from a resource',
    options: [
      { name: '--resource-arn', description: 'Resource ARN', args: { name: 'arn' }, required: true },
      { name: '--tag-keys', description: 'Tag keys', args: { name: 'keys', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'list-tags-for-resource',
    description: 'List tags for a resource',
    options: [
      { name: '--resource-arn', description: 'Resource ARN', args: { name: 'arn' }, required: true }
    ]
  },
  // Attributes
  {
    name: 'list-attributes',
    description: 'List attributes',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--target-type', description: 'Target type', args: { name: 'type', suggestions: s('container-instance') }, required: true },
      { name: '--attribute-name', description: 'Attribute name', args: { name: 'name' } },
      { name: '--attribute-value', description: 'Attribute value', args: { name: 'value' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'put-attributes',
    description: 'Put attributes',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--attributes', description: 'Attributes', args: { name: 'attributes' }, required: true }
    ]
  },
  {
    name: 'delete-attributes',
    description: 'Delete attributes',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--attributes', description: 'Attributes', args: { name: 'attributes' }, required: true }
    ]
  },
  // Deployments
  {
    name: 'describe-task-sets',
    description: 'Describe task sets',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--service', description: 'Service name or ARN', args: { name: 'service', generators: ecsServiceGenerator }, required: true },
      { name: '--task-sets', description: 'Task set IDs', args: { name: 'task-sets', generators: taskSetGenerator, isVariadic: true } },
      { name: '--include', description: 'Include additional info', args: { name: 'info', suggestions: s('TAGS') } }
    ]
  },
  {
    name: 'create-task-set',
    description: 'Create a task set',
    options: [
      { name: '--service', description: 'Service name or ARN', args: { name: 'service', generators: ecsServiceGenerator }, required: true },
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--external-id', description: 'External ID', args: { name: 'id' } },
      { name: '--task-definition', description: 'Task definition', args: { name: 'definition', generators: taskDefinitionGenerator }, required: true },
      { name: '--network-configuration', description: 'Network configuration', args: { name: 'config' } },
      { name: '--load-balancers', description: 'Load balancers', args: { name: 'balancers' } },
      { name: '--service-registries', description: 'Service registries', args: { name: 'registries' } },
      { name: '--launch-type', description: 'Launch type', args: { name: 'type', suggestions: s(...launchTypes) } },
      { name: '--capacity-provider-strategy', description: 'Capacity provider strategy', args: { name: 'strategy' } },
      { name: '--platform-version', description: 'Platform version', args: { name: 'version' } },
      { name: '--scale', description: 'Scale', args: { name: 'scale' } },
      { name: '--client-token', description: 'Client token', args: { name: 'token' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'update-task-set',
    description: 'Update a task set',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--service', description: 'Service name or ARN', args: { name: 'service', generators: ecsServiceGenerator }, required: true },
      { name: '--task-set', description: 'Task set ID or ARN', args: { name: 'task-set', generators: taskSetGenerator }, required: true },
      { name: '--scale', description: 'Scale', args: { name: 'scale' }, required: true }
    ]
  },
  {
    name: 'delete-task-set',
    description: 'Delete a task set',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--service', description: 'Service name or ARN', args: { name: 'service', generators: ecsServiceGenerator }, required: true },
      { name: '--task-set', description: 'Task set ID or ARN', args: { name: 'task-set', generators: taskSetGenerator }, required: true },
      { name: '--force', description: 'Force deletion' },
      { name: '--no-force', description: 'Do not force deletion' }
    ]
  },
  {
    name: 'update-service-primary-task-set',
    description: 'Update service primary task set',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--service', description: 'Service name or ARN', args: { name: 'service', generators: ecsServiceGenerator }, required: true },
      { name: '--primary-task-set', description: 'Primary task set', args: { name: 'task-set', generators: taskSetGenerator }, required: true }
    ]
  },
  // Misc
  {
    name: 'get-task-protection',
    description: 'Get task protection',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--tasks', description: 'Task IDs or ARNs', args: { name: 'tasks', generators: taskGenerator, isVariadic: true } }
    ]
  },
  {
    name: 'update-task-protection',
    description: 'Update task protection',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator }, required: true },
      { name: '--tasks', description: 'Task IDs or ARNs', args: { name: 'tasks', generators: taskGenerator, isVariadic: true }, required: true },
      { name: '--protection-enabled', description: 'Enable protection' },
      { name: '--no-protection-enabled', description: 'Disable protection' },
      { name: '--expires-in-minutes', description: 'Expiration in minutes', args: { name: 'minutes' } }
    ]
  },
  {
    name: 'discover-poll-endpoint',
    description: 'Discover poll endpoint',
    options: [
      { name: '--container-instance', description: 'Container instance', args: { name: 'instance', generators: containerInstanceGenerator } },
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } }
    ]
  },
  {
    name: 'submit-attachment-state-changes',
    description: 'Submit attachment state changes',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--attachments', description: 'Attachments', args: { name: 'attachments' }, required: true }
    ]
  },
  {
    name: 'submit-container-state-change',
    description: 'Submit container state change',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--task', description: 'Task ARN', args: { name: 'task' } },
      { name: '--container-name', description: 'Container name', args: { name: 'name' } },
      { name: '--runtime-id', description: 'Runtime ID', args: { name: 'id' } },
      { name: '--status', description: 'Status', args: { name: 'status' } },
      { name: '--exit-code', description: 'Exit code', args: { name: 'code' } },
      { name: '--reason', description: 'Reason', args: { name: 'reason' } },
      { name: '--network-bindings', description: 'Network bindings', args: { name: 'bindings' } }
    ]
  },
  {
    name: 'submit-task-state-change',
    description: 'Submit task state change',
    options: [
      { name: '--cluster', description: 'Cluster name or ARN', args: { name: 'cluster', generators: ecsClusterGenerator } },
      { name: '--task', description: 'Task ARN', args: { name: 'task' } },
      { name: '--status', description: 'Status', args: { name: 'status' } },
      { name: '--reason', description: 'Reason', args: { name: 'reason' } },
      { name: '--containers', description: 'Containers', args: { name: 'containers' } },
      { name: '--attachments', description: 'Attachments', args: { name: 'attachments' } },
      { name: '--managed-agents', description: 'Managed agents', args: { name: 'agents' } },
      { name: '--pull-started-at', description: 'Pull started at', args: { name: 'timestamp' } },
      { name: '--pull-stopped-at', description: 'Pull stopped at', args: { name: 'timestamp' } },
      { name: '--execution-stopped-at', description: 'Execution stopped at', args: { name: 'timestamp' } }
    ]
  }
];
