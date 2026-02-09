// AWS EKS CLI completions
import { Subcommand } from '../../types.js';
import { s, eksClusterGenerator, iamRoleGenerator, subnetGenerator, securityGroupGenerator, awsRegions } from './_shared.js';

// EKS nodegroup generator
const nodegroupGenerator = {
  script: 'aws eks list-clusters --query "clusters[]" --output text 2>/dev/null | head -1 | xargs -I{} aws eks list-nodegroups --cluster-name {} --query "nodegroups[]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(n => n.trim()).map(nodegroup => ({
      name: nodegroup.trim(),
      description: 'EKS Node Group',
      icon: '🖥️',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// EKS Fargate profile generator
const fargateProfileGenerator = {
  script: 'aws eks list-clusters --query "clusters[]" --output text 2>/dev/null | head -1 | xargs -I{} aws eks list-fargate-profiles --cluster-name {} --query "fargateProfileNames[]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(f => f.trim()).map(profile => ({
      name: profile.trim(),
      description: 'EKS Fargate Profile',
      icon: '🚀',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// EKS addon generator
const addonGenerator = {
  script: 'aws eks describe-addon-versions --query "addons[].addonName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(a => a.trim()).map(addon => ({
      name: addon.trim(),
      description: 'EKS Addon',
      icon: '🔌',
      priority: 100
    }));
  },
  cache: { ttl: 300000, strategy: 'ttl' as const }
};

// EKS identity provider config generator
const identityProviderGenerator = {
  script: 'aws eks list-clusters --query "clusters[]" --output text 2>/dev/null | head -1 | xargs -I{} aws eks list-identity-provider-configs --cluster-name {} --query "identityProviderConfigs[].name" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(i => i.trim()).map(provider => ({
      name: provider.trim(),
      description: 'Identity Provider Config',
      icon: '🔐',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

const kubernetesVersions = ['1.31', '1.30', '1.29', '1.28', '1.27'];
const instanceTypes = ['t3.micro', 't3.small', 't3.medium', 't3.large', 't3.xlarge', 't3.2xlarge', 'm5.large', 'm5.xlarge', 'm5.2xlarge', 'm5.4xlarge', 'm5.8xlarge', 'm5.12xlarge', 'm5.16xlarge', 'm5.24xlarge', 'c5.large', 'c5.xlarge', 'c5.2xlarge', 'c5.4xlarge', 'c5.9xlarge', 'c5.12xlarge', 'c5.18xlarge', 'c5.24xlarge', 'r5.large', 'r5.xlarge', 'r5.2xlarge', 'r5.4xlarge', 'r5.8xlarge', 'r5.12xlarge', 'r5.16xlarge', 'r5.24xlarge'];
const capacityTypes = ['ON_DEMAND', 'SPOT'];
const amiTypes = ['AL2_x86_64', 'AL2_x86_64_GPU', 'AL2_ARM_64', 'CUSTOM', 'BOTTLEROCKET_ARM_64', 'BOTTLEROCKET_x86_64', 'BOTTLEROCKET_ARM_64_NVIDIA', 'BOTTLEROCKET_x86_64_NVIDIA', 'WINDOWS_CORE_2019_x86_64', 'WINDOWS_FULL_2019_x86_64', 'WINDOWS_CORE_2022_x86_64', 'WINDOWS_FULL_2022_x86_64', 'AL2023_x86_64_STANDARD', 'AL2023_ARM_64_STANDARD'];
const updateTypes = ['VersionUpdate', 'EndpointAccessUpdate', 'LoggingUpdate', 'ConfigUpdate', 'AddonUpdate', 'VpcConfigUpdate', 'AccessConfigUpdate'];
const authenticationModes = ['CONFIG_MAP', 'API', 'API_AND_CONFIG_MAP'];
const accessScopeTypes = ['cluster', 'namespace'];

export const eksSubcommands: Subcommand[] = [
  // Cluster operations
  {
    name: 'list-clusters',
    description: 'List EKS clusters',
    options: [
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--include', description: 'Include additional info', args: { name: 'info', isVariadic: true } }
    ]
  },
  {
    name: 'describe-cluster',
    description: 'Describe an EKS cluster',
    options: [
      { name: '--name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true }
    ]
  },
  {
    name: 'create-cluster',
    description: 'Create an EKS cluster',
    options: [
      { name: '--name', description: 'Cluster name', args: { name: 'name' }, required: true },
      { name: '--role-arn', description: 'Cluster role ARN', args: { name: 'arn', generators: iamRoleGenerator }, required: true },
      { name: '--resources-vpc-config', description: 'VPC configuration', args: { name: 'config' }, required: true },
      { name: '--kubernetes-network-config', description: 'Kubernetes network config', args: { name: 'config' } },
      { name: '--logging', description: 'Logging configuration', args: { name: 'config' } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--encryption-config', description: 'Encryption configuration', args: { name: 'config' } },
      { name: '--outpost-config', description: 'Outpost configuration', args: { name: 'config' } },
      { name: '--access-config', description: 'Access configuration', args: { name: 'config' } },
      { name: '--version', description: 'Kubernetes version', args: { name: 'version', suggestions: s(...kubernetesVersions) } }
    ]
  },
  {
    name: 'delete-cluster',
    description: 'Delete an EKS cluster',
    options: [
      { name: '--name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true }
    ]
  },
  {
    name: 'update-cluster-version',
    description: 'Update cluster Kubernetes version',
    options: [
      { name: '--name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--version', description: 'Kubernetes version', args: { name: 'version', suggestions: s(...kubernetesVersions) }, required: true },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } }
    ]
  },
  {
    name: 'update-cluster-config',
    description: 'Update cluster configuration',
    options: [
      { name: '--name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--resources-vpc-config', description: 'VPC configuration', args: { name: 'config' } },
      { name: '--logging', description: 'Logging configuration', args: { name: 'config' } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--access-config', description: 'Access configuration', args: { name: 'config' } }
    ]
  },
  // Nodegroup operations
  {
    name: 'list-nodegroups',
    description: 'List node groups for a cluster',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-nodegroup',
    description: 'Describe a node group',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--nodegroup-name', description: 'Node group name', args: { name: 'name', generators: nodegroupGenerator }, required: true }
    ]
  },
  {
    name: 'create-nodegroup',
    description: 'Create a node group',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--nodegroup-name', description: 'Node group name', args: { name: 'name' }, required: true },
      { name: '--scaling-config', description: 'Scaling configuration', args: { name: 'config' } },
      { name: '--disk-size', description: 'Disk size (GB)', args: { name: 'size', suggestions: s('20', '50', '100', '200', '500') } },
      { name: '--subnets', description: 'Subnet IDs', args: { name: 'subnets', generators: subnetGenerator, isVariadic: true }, required: true },
      { name: '--instance-types', description: 'Instance types', args: { name: 'types', suggestions: s(...instanceTypes), isVariadic: true } },
      { name: '--ami-type', description: 'AMI type', args: { name: 'type', suggestions: s(...amiTypes) } },
      { name: '--remote-access', description: 'Remote access configuration', args: { name: 'config' } },
      { name: '--node-role', description: 'Node role ARN', args: { name: 'arn', generators: iamRoleGenerator }, required: true },
      { name: '--labels', description: 'Kubernetes labels', args: { name: 'labels' } },
      { name: '--taints', description: 'Kubernetes taints', args: { name: 'taints' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--launch-template', description: 'Launch template', args: { name: 'template' } },
      { name: '--update-config', description: 'Update configuration', args: { name: 'config' } },
      { name: '--capacity-type', description: 'Capacity type', args: { name: 'type', suggestions: s(...capacityTypes) } },
      { name: '--version', description: 'Kubernetes version', args: { name: 'version', suggestions: s(...kubernetesVersions) } },
      { name: '--release-version', description: 'AMI release version', args: { name: 'version' } }
    ]
  },
  {
    name: 'delete-nodegroup',
    description: 'Delete a node group',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--nodegroup-name', description: 'Node group name', args: { name: 'name', generators: nodegroupGenerator }, required: true }
    ]
  },
  {
    name: 'update-nodegroup-config',
    description: 'Update node group configuration',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--nodegroup-name', description: 'Node group name', args: { name: 'name', generators: nodegroupGenerator }, required: true },
      { name: '--labels', description: 'Kubernetes labels', args: { name: 'labels' } },
      { name: '--taints', description: 'Kubernetes taints', args: { name: 'taints' } },
      { name: '--scaling-config', description: 'Scaling configuration', args: { name: 'config' } },
      { name: '--update-config', description: 'Update configuration', args: { name: 'config' } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } }
    ]
  },
  {
    name: 'update-nodegroup-version',
    description: 'Update node group version',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--nodegroup-name', description: 'Node group name', args: { name: 'name', generators: nodegroupGenerator }, required: true },
      { name: '--version', description: 'Kubernetes version', args: { name: 'version', suggestions: s(...kubernetesVersions) } },
      { name: '--release-version', description: 'AMI release version', args: { name: 'version' } },
      { name: '--launch-template', description: 'Launch template', args: { name: 'template' } },
      { name: '--force', description: 'Force update' },
      { name: '--no-force', description: 'No force update' },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } }
    ]
  },
  // Fargate profile operations
  {
    name: 'list-fargate-profiles',
    description: 'List Fargate profiles for a cluster',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-fargate-profile',
    description: 'Describe a Fargate profile',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--fargate-profile-name', description: 'Fargate profile name', args: { name: 'name', generators: fargateProfileGenerator }, required: true }
    ]
  },
  {
    name: 'create-fargate-profile',
    description: 'Create a Fargate profile',
    options: [
      { name: '--fargate-profile-name', description: 'Fargate profile name', args: { name: 'name' }, required: true },
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--pod-execution-role-arn', description: 'Pod execution role ARN', args: { name: 'arn', generators: iamRoleGenerator }, required: true },
      { name: '--subnets', description: 'Subnet IDs', args: { name: 'subnets', generators: subnetGenerator, isVariadic: true } },
      { name: '--selectors', description: 'Selectors', args: { name: 'selectors' }, required: true },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-fargate-profile',
    description: 'Delete a Fargate profile',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--fargate-profile-name', description: 'Fargate profile name', args: { name: 'name', generators: fargateProfileGenerator }, required: true }
    ]
  },
  // Addon operations
  {
    name: 'list-addons',
    description: 'List addons for a cluster',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-addon',
    description: 'Describe an addon',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--addon-name', description: 'Addon name', args: { name: 'name', generators: addonGenerator }, required: true }
    ]
  },
  {
    name: 'create-addon',
    description: 'Create an addon',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--addon-name', description: 'Addon name', args: { name: 'name', generators: addonGenerator }, required: true },
      { name: '--addon-version', description: 'Addon version', args: { name: 'version' } },
      { name: '--service-account-role-arn', description: 'Service account role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--resolve-conflicts', description: 'Resolve conflicts', args: { name: 'strategy', suggestions: s('OVERWRITE', 'NONE', 'PRESERVE') } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--configuration-values', description: 'Configuration values', args: { name: 'values' } }
    ]
  },
  {
    name: 'update-addon',
    description: 'Update an addon',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--addon-name', description: 'Addon name', args: { name: 'name', generators: addonGenerator }, required: true },
      { name: '--addon-version', description: 'Addon version', args: { name: 'version' } },
      { name: '--service-account-role-arn', description: 'Service account role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--resolve-conflicts', description: 'Resolve conflicts', args: { name: 'strategy', suggestions: s('OVERWRITE', 'NONE', 'PRESERVE') } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--configuration-values', description: 'Configuration values', args: { name: 'values' } }
    ]
  },
  {
    name: 'delete-addon',
    description: 'Delete an addon',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--addon-name', description: 'Addon name', args: { name: 'name', generators: addonGenerator }, required: true },
      { name: '--preserve', description: 'Preserve addon resources' },
      { name: '--no-preserve', description: 'Delete addon resources' }
    ]
  },
  {
    name: 'describe-addon-versions',
    description: 'Describe available addon versions',
    options: [
      { name: '--kubernetes-version', description: 'Kubernetes version', args: { name: 'version', suggestions: s(...kubernetesVersions) } },
      { name: '--addon-name', description: 'Addon name', args: { name: 'name', generators: addonGenerator } },
      { name: '--owners', description: 'Addon owners', args: { name: 'owners', isVariadic: true } },
      { name: '--publishers', description: 'Addon publishers', args: { name: 'publishers', isVariadic: true } },
      { name: '--types', description: 'Addon types', args: { name: 'types', isVariadic: true } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-addon-configuration',
    description: 'Describe addon configuration schema',
    options: [
      { name: '--addon-name', description: 'Addon name', args: { name: 'name', generators: addonGenerator }, required: true },
      { name: '--addon-version', description: 'Addon version', args: { name: 'version' }, required: true }
    ]
  },
  // Update operations
  {
    name: 'list-updates',
    description: 'List updates for a cluster',
    options: [
      { name: '--name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--nodegroup-name', description: 'Node group name', args: { name: 'name', generators: nodegroupGenerator } },
      { name: '--addon-name', description: 'Addon name', args: { name: 'name', generators: addonGenerator } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-update',
    description: 'Describe an update',
    options: [
      { name: '--name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--update-id', description: 'Update ID', args: { name: 'id' }, required: true },
      { name: '--nodegroup-name', description: 'Node group name', args: { name: 'name', generators: nodegroupGenerator } },
      { name: '--addon-name', description: 'Addon name', args: { name: 'name', generators: addonGenerator } }
    ]
  },
  // Identity provider operations
  {
    name: 'list-identity-provider-configs',
    description: 'List identity provider configs',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-identity-provider-config',
    description: 'Describe an identity provider config',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--identity-provider-config', description: 'Identity provider config', args: { name: 'config' }, required: true }
    ]
  },
  {
    name: 'associate-identity-provider-config',
    description: 'Associate an identity provider config',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--oidc', description: 'OIDC configuration', args: { name: 'config' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } }
    ]
  },
  {
    name: 'disassociate-identity-provider-config',
    description: 'Disassociate an identity provider config',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--identity-provider-config', description: 'Identity provider config', args: { name: 'config' }, required: true },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } }
    ]
  },
  // Access entry operations
  {
    name: 'list-access-entries',
    description: 'List access entries for a cluster',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--associated-policy-arn', description: 'Filter by policy ARN', args: { name: 'arn' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-access-entry',
    description: 'Describe an access entry',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' }, required: true }
    ]
  },
  {
    name: 'create-access-entry',
    description: 'Create an access entry',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' }, required: true },
      { name: '--kubernetes-groups', description: 'Kubernetes groups', args: { name: 'groups', isVariadic: true } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--username', description: 'Username', args: { name: 'username' } },
      { name: '--type', description: 'Access entry type', args: { name: 'type', suggestions: s('STANDARD', 'FARGATE_LINUX', 'EC2_LINUX', 'EC2_WINDOWS') } }
    ]
  },
  {
    name: 'update-access-entry',
    description: 'Update an access entry',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' }, required: true },
      { name: '--kubernetes-groups', description: 'Kubernetes groups', args: { name: 'groups', isVariadic: true } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--username', description: 'Username', args: { name: 'username' } }
    ]
  },
  {
    name: 'delete-access-entry',
    description: 'Delete an access entry',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' }, required: true }
    ]
  },
  // Access policy operations
  {
    name: 'list-access-policies',
    description: 'List access policies',
    options: [
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'list-associated-access-policies',
    description: 'List associated access policies for an access entry',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' }, required: true },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'associate-access-policy',
    description: 'Associate an access policy with an access entry',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' }, required: true },
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn' }, required: true },
      { name: '--access-scope', description: 'Access scope', args: { name: 'scope' }, required: true }
    ]
  },
  {
    name: 'disassociate-access-policy',
    description: 'Disassociate an access policy from an access entry',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--principal-arn', description: 'Principal ARN', args: { name: 'arn' }, required: true },
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn' }, required: true }
    ]
  },
  // Pod identity operations
  {
    name: 'list-pod-identity-associations',
    description: 'List pod identity associations',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--namespace', description: 'Namespace', args: { name: 'namespace' } },
      { name: '--service-account', description: 'Service account', args: { name: 'account' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-pod-identity-association',
    description: 'Describe a pod identity association',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--association-id', description: 'Association ID', args: { name: 'id' }, required: true }
    ]
  },
  {
    name: 'create-pod-identity-association',
    description: 'Create a pod identity association',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--namespace', description: 'Namespace', args: { name: 'namespace' }, required: true },
      { name: '--service-account', description: 'Service account', args: { name: 'account' }, required: true },
      { name: '--role-arn', description: 'Role ARN', args: { name: 'arn', generators: iamRoleGenerator }, required: true },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'update-pod-identity-association',
    description: 'Update a pod identity association',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--association-id', description: 'Association ID', args: { name: 'id' }, required: true },
      { name: '--role-arn', description: 'Role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } }
    ]
  },
  {
    name: 'delete-pod-identity-association',
    description: 'Delete a pod identity association',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--association-id', description: 'Association ID', args: { name: 'id' }, required: true }
    ]
  },
  // Kubeconfig management
  {
    name: 'update-kubeconfig',
    description: 'Update kubeconfig for cluster',
    options: [
      { name: '--name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--kubeconfig', description: 'Kubeconfig file path', args: { name: 'path', template: 'filepaths' } },
      { name: '--role-arn', description: 'Role ARN to assume', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--verbose', description: 'Verbose output' },
      { name: '--alias', description: 'Context alias', args: { name: 'alias' } },
      { name: '--user-alias', description: 'User alias', args: { name: 'alias' } }
    ]
  },
  {
    name: 'get-token',
    description: 'Get authentication token',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--role-arn', description: 'Role ARN to assume', args: { name: 'arn', generators: iamRoleGenerator } }
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
  // Insights
  {
    name: 'list-insights',
    description: 'List insights for a cluster',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--filter', description: 'Filter', args: { name: 'filter' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-insight',
    description: 'Describe an insight',
    options: [
      { name: '--cluster-name', description: 'Cluster name', args: { name: 'name', generators: eksClusterGenerator }, required: true },
      { name: '--id', description: 'Insight ID', args: { name: 'id' }, required: true }
    ]
  }
];
