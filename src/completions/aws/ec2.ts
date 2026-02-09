// AWS EC2 CLI completions
import { Subcommand } from '../../types.js';
import { s, ec2InstanceGenerator, vpcGenerator, subnetGenerator, securityGroupGenerator, awsRegions } from './_shared.js';

const instanceTypes = [
  // General Purpose
  't3.nano', 't3.micro', 't3.small', 't3.medium', 't3.large', 't3.xlarge', 't3.2xlarge',
  't3a.nano', 't3a.micro', 't3a.small', 't3a.medium', 't3a.large', 't3a.xlarge', 't3a.2xlarge',
  'm6i.large', 'm6i.xlarge', 'm6i.2xlarge', 'm6i.4xlarge', 'm6i.8xlarge', 'm6i.12xlarge', 'm6i.16xlarge', 'm6i.24xlarge', 'm6i.32xlarge', 'm6i.metal',
  'm6a.large', 'm6a.xlarge', 'm6a.2xlarge', 'm6a.4xlarge', 'm6a.8xlarge', 'm6a.12xlarge', 'm6a.16xlarge', 'm6a.24xlarge', 'm6a.32xlarge', 'm6a.48xlarge', 'm6a.metal',
  'm7i.large', 'm7i.xlarge', 'm7i.2xlarge', 'm7i.4xlarge', 'm7i.8xlarge', 'm7i.12xlarge', 'm7i.16xlarge', 'm7i.24xlarge', 'm7i.48xlarge', 'm7i.metal-24xl', 'm7i.metal-48xl',
  // Compute Optimized
  'c6i.large', 'c6i.xlarge', 'c6i.2xlarge', 'c6i.4xlarge', 'c6i.8xlarge', 'c6i.12xlarge', 'c6i.16xlarge', 'c6i.24xlarge', 'c6i.32xlarge', 'c6i.metal',
  'c7i.large', 'c7i.xlarge', 'c7i.2xlarge', 'c7i.4xlarge', 'c7i.8xlarge', 'c7i.12xlarge', 'c7i.16xlarge', 'c7i.24xlarge', 'c7i.48xlarge', 'c7i.metal-24xl', 'c7i.metal-48xl',
  // Memory Optimized
  'r6i.large', 'r6i.xlarge', 'r6i.2xlarge', 'r6i.4xlarge', 'r6i.8xlarge', 'r6i.12xlarge', 'r6i.16xlarge', 'r6i.24xlarge', 'r6i.32xlarge', 'r6i.metal',
  'r7i.large', 'r7i.xlarge', 'r7i.2xlarge', 'r7i.4xlarge', 'r7i.8xlarge', 'r7i.12xlarge', 'r7i.16xlarge', 'r7i.24xlarge', 'r7i.48xlarge', 'r7i.metal-24xl', 'r7i.metal-48xl',
  'x2idn.large', 'x2idn.xlarge', 'x2idn.2xlarge', 'x2idn.4xlarge', 'x2idn.8xlarge', 'x2idn.16xlarge', 'x2idn.24xlarge', 'x2idn.32xlarge', 'x2idn.metal',
  // Storage Optimized
  'i3.large', 'i3.xlarge', 'i3.2xlarge', 'i3.4xlarge', 'i3.8xlarge', 'i3.16xlarge', 'i3.metal',
  'i4i.large', 'i4i.xlarge', 'i4i.2xlarge', 'i4i.4xlarge', 'i4i.8xlarge', 'i4i.16xlarge', 'i4i.32xlarge', 'i4i.metal',
  'd3.xlarge', 'd3.2xlarge', 'd3.4xlarge', 'd3.8xlarge',
  // Accelerated Computing
  'p4d.24xlarge', 'p5.48xlarge',
  'g4dn.xlarge', 'g4dn.2xlarge', 'g4dn.4xlarge', 'g4dn.8xlarge', 'g4dn.12xlarge', 'g4dn.16xlarge', 'g4dn.metal',
  'g5.xlarge', 'g5.2xlarge', 'g5.4xlarge', 'g5.8xlarge', 'g5.12xlarge', 'g5.16xlarge', 'g5.24xlarge', 'g5.48xlarge',
  'inf2.xlarge', 'inf2.8xlarge', 'inf2.24xlarge', 'inf2.48xlarge',
  'trn1.2xlarge', 'trn1.32xlarge', 'trn1n.32xlarge'
];

const instanceStates = ['pending', 'running', 'shutting-down', 'terminated', 'stopping', 'stopped'];
const volumeTypes = ['gp2', 'gp3', 'io1', 'io2', 'st1', 'sc1', 'standard'];

// AMI generators
const amiGenerator = {
  script: 'aws ec2 describe-images --owners self amazon --query "Images[*].[ImageId,Name]" --output text 2>/dev/null | head -50',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'AMI',
        icon: '💿',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Key pair generator
const keyPairGenerator = {
  script: 'aws ec2 describe-key-pairs --query "KeyPairs[].KeyName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(k => k.trim()).map(key => ({
      name: key.trim(),
      description: 'EC2 Key Pair',
      icon: '🔑',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Snapshot generator
const snapshotGenerator = {
  script: 'aws ec2 describe-snapshots --owner-ids self --query "Snapshots[*].[SnapshotId,Description]" --output text 2>/dev/null | head -50',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Snapshot',
        icon: '📸',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Volume generator
const volumeGenerator = {
  script: 'aws ec2 describe-volumes --query "Volumes[*].[VolumeId,Size,State]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: `${parts[1]} GB (${parts[2]})`,
        icon: '💾',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Elastic IP generator
const eipGenerator = {
  script: 'aws ec2 describe-addresses --query "Addresses[*].[AllocationId,PublicIp]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Elastic IP',
        icon: '🌐',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Internet Gateway generator
const igwGenerator = {
  script: 'aws ec2 describe-internet-gateways --query "InternetGateways[*].[InternetGatewayId,Tags[?Key==\'Name\'].Value|[0]]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Internet Gateway',
        icon: '🌐',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// NAT Gateway generator
const natGatewayGenerator = {
  script: 'aws ec2 describe-nat-gateways --query "NatGateways[*].[NatGatewayId,State]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: `NAT Gateway (${parts[1]})`,
        icon: '🌐',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Route Table generator
const routeTableGenerator = {
  script: 'aws ec2 describe-route-tables --query "RouteTables[*].[RouteTableId,Tags[?Key==\'Name\'].Value|[0]]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Route Table',
        icon: '🔀',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Network Interface generator
const eniGenerator = {
  script: 'aws ec2 describe-network-interfaces --query "NetworkInterfaces[*].[NetworkInterfaceId,Description]" --output text 2>/dev/null | head -50',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Network Interface',
        icon: '🔌',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Launch Template generator
const launchTemplateGenerator = {
  script: 'aws ec2 describe-launch-templates --query "LaunchTemplates[*].[LaunchTemplateId,LaunchTemplateName]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Launch Template',
        icon: '📄',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const ec2Subcommands: Subcommand[] = [
  // Instance operations
  {
    name: 'describe-instances',
    description: 'Describe EC2 instances',
    options: [
      { name: '--instance-ids', description: 'Instance IDs', args: { name: 'ids', generators: ec2InstanceGenerator, isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'run-instances',
    description: 'Launch EC2 instances',
    options: [
      { name: '--image-id', description: 'AMI ID', args: { name: 'ami-id', generators: amiGenerator }, required: true },
      { name: '--instance-type', description: 'Instance type', args: { name: 'type', suggestions: s(...instanceTypes) }, required: true },
      { name: '--key-name', description: 'Key pair name', args: { name: 'key', generators: keyPairGenerator } },
      { name: '--security-group-ids', description: 'Security group IDs', args: { name: 'sg-ids', generators: securityGroupGenerator, isVariadic: true } },
      { name: '--security-groups', description: 'Security group names', args: { name: 'names', isVariadic: true } },
      { name: '--subnet-id', description: 'Subnet ID', args: { name: 'subnet', generators: subnetGenerator } },
      { name: '--count', description: 'Number of instances', args: { name: 'count', suggestions: s('1', '2', '3', '5', '10') } },
      { name: '--user-data', description: 'User data script', args: { name: 'data' } },
      { name: '--iam-instance-profile', description: 'IAM instance profile', args: { name: 'profile' } },
      { name: '--launch-template', description: 'Launch template', args: { name: 'template' } },
      { name: '--block-device-mappings', description: 'Block device mappings', args: { name: 'mappings' } },
      { name: '--monitoring', description: 'Enable detailed monitoring', args: { name: 'config' } },
      { name: '--placement', description: 'Placement options', args: { name: 'placement' } },
      { name: '--private-ip-address', description: 'Private IP address', args: { name: 'ip' } },
      { name: '--ebs-optimized', description: 'Enable EBS optimization' },
      { name: '--no-ebs-optimized', description: 'Disable EBS optimization' },
      { name: '--disable-api-termination', description: 'Disable API termination' },
      { name: '--enable-api-termination', description: 'Enable API termination' },
      { name: '--instance-initiated-shutdown-behavior', description: 'Shutdown behavior', args: { name: 'behavior', suggestions: s('stop', 'terminate') } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--cpu-options', description: 'CPU options', args: { name: 'options' } },
      { name: '--credit-specification', description: 'Credit specification', args: { name: 'spec' } },
      { name: '--capacity-reservation-specification', description: 'Capacity reservation', args: { name: 'spec' } },
      { name: '--hibernation-options', description: 'Hibernation options', args: { name: 'options' } },
      { name: '--metadata-options', description: 'Instance metadata options', args: { name: 'options' } },
      { name: '--enclave-options', description: 'Nitro Enclave options', args: { name: 'options' } },
      { name: '--private-dns-name-options', description: 'Private DNS options', args: { name: 'options' } },
      { name: '--maintenance-options', description: 'Maintenance options', args: { name: 'options' } },
      { name: '--disable-api-stop', description: 'Disable API stop' },
      { name: '--enable-api-stop', description: 'Enable API stop' },
      { name: '--network-interfaces', description: 'Network interfaces', args: { name: 'interfaces' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'start-instances',
    description: 'Start stopped EC2 instances',
    options: [
      { name: '--instance-ids', description: 'Instance IDs', args: { name: 'ids', generators: ec2InstanceGenerator, isVariadic: true }, required: true },
      { name: '--additional-info', description: 'Additional info', args: { name: 'info' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'stop-instances',
    description: 'Stop running EC2 instances',
    options: [
      { name: '--instance-ids', description: 'Instance IDs', args: { name: 'ids', generators: ec2InstanceGenerator, isVariadic: true }, required: true },
      { name: '--hibernate', description: 'Hibernate the instance' },
      { name: '--no-hibernate', description: 'Do not hibernate' },
      { name: '--force', description: 'Force stop' },
      { name: '--no-force', description: 'No force stop' },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'reboot-instances',
    description: 'Reboot EC2 instances',
    options: [
      { name: '--instance-ids', description: 'Instance IDs', args: { name: 'ids', generators: ec2InstanceGenerator, isVariadic: true }, required: true },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'terminate-instances',
    description: 'Terminate EC2 instances',
    options: [
      { name: '--instance-ids', description: 'Instance IDs', args: { name: 'ids', generators: ec2InstanceGenerator, isVariadic: true }, required: true },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'describe-instance-status',
    description: 'Describe instance status',
    options: [
      { name: '--instance-ids', description: 'Instance IDs', args: { name: 'ids', generators: ec2InstanceGenerator, isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--include-all-instances', description: 'Include all instances' },
      { name: '--no-include-all-instances', description: 'Only running instances' },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'modify-instance-attribute',
    description: 'Modify instance attributes',
    options: [
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator }, required: true },
      { name: '--attribute', description: 'Attribute name', args: { name: 'attr', suggestions: s('instanceType', 'kernel', 'ramdisk', 'userData', 'disableApiTermination', 'instanceInitiatedShutdownBehavior', 'rootDeviceName', 'blockDeviceMapping', 'productCodes', 'sourceDestCheck', 'groupSet', 'ebsOptimized', 'sriovNetSupport', 'enaSupport', 'enclaveOptions', 'disableApiStop') } },
      { name: '--value', description: 'Attribute value', args: { name: 'value' } },
      { name: '--instance-type', description: 'Instance type', args: { name: 'type', suggestions: s(...instanceTypes) } },
      { name: '--groups', description: 'Security groups', args: { name: 'groups', generators: securityGroupGenerator, isVariadic: true } },
      { name: '--ebs-optimized', description: 'EBS optimized', args: { name: 'value' } },
      { name: '--source-dest-check', description: 'Source/dest check', args: { name: 'value' } },
      { name: '--disable-api-termination', description: 'Disable API termination', args: { name: 'value' } },
      { name: '--instance-initiated-shutdown-behavior', description: 'Shutdown behavior', args: { name: 'behavior' } },
      { name: '--user-data', description: 'User data', args: { name: 'data' } },
      { name: '--block-device-mappings', description: 'Block device mappings', args: { name: 'mappings' } },
      { name: '--disable-api-stop', description: 'Disable API stop', args: { name: 'value' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // AMI operations
  {
    name: 'describe-images',
    description: 'Describe AMIs',
    options: [
      { name: '--image-ids', description: 'AMI IDs', args: { name: 'ids', generators: amiGenerator, isVariadic: true } },
      { name: '--owners', description: 'Image owners', args: { name: 'owners', suggestions: s('self', 'amazon', 'aws-marketplace'), isVariadic: true } },
      { name: '--executable-users', description: 'Executable users', args: { name: 'users', suggestions: s('self', 'all'), isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--include-deprecated', description: 'Include deprecated AMIs' },
      { name: '--no-include-deprecated', description: 'Exclude deprecated AMIs' },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-image',
    description: 'Create an AMI from an instance',
    options: [
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator }, required: true },
      { name: '--name', description: 'AMI name', args: { name: 'name' }, required: true },
      { name: '--description', description: 'AMI description', args: { name: 'desc' } },
      { name: '--no-reboot', description: 'Do not reboot instance' },
      { name: '--reboot', description: 'Reboot instance' },
      { name: '--block-device-mappings', description: 'Block device mappings', args: { name: 'mappings' } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'deregister-image',
    description: 'Deregister an AMI',
    options: [
      { name: '--image-id', description: 'AMI ID', args: { name: 'id', generators: amiGenerator }, required: true },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'copy-image',
    description: 'Copy an AMI to another region',
    options: [
      { name: '--source-image-id', description: 'Source AMI ID', args: { name: 'id', generators: amiGenerator }, required: true },
      { name: '--source-region', description: 'Source region', args: { name: 'region', suggestions: s(...awsRegions) }, required: true },
      { name: '--name', description: 'New AMI name', args: { name: 'name' }, required: true },
      { name: '--description', description: 'AMI description', args: { name: 'desc' } },
      { name: '--encrypted', description: 'Encrypt the AMI' },
      { name: '--no-encrypted', description: 'Do not encrypt' },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key-id' } },
      { name: '--copy-image-tags', description: 'Copy source tags' },
      { name: '--no-copy-image-tags', description: 'Do not copy tags' },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // VPC operations
  {
    name: 'describe-vpcs',
    description: 'Describe VPCs',
    options: [
      { name: '--vpc-ids', description: 'VPC IDs', args: { name: 'ids', generators: vpcGenerator, isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-vpc',
    description: 'Create a VPC',
    options: [
      { name: '--cidr-block', description: 'IPv4 CIDR block', args: { name: 'cidr', suggestions: s('10.0.0.0/16', '172.16.0.0/16', '192.168.0.0/16') } },
      { name: '--ipv6-cidr-block-network-border-group', description: 'IPv6 network border group', args: { name: 'group' } },
      { name: '--amazon-provided-ipv6-cidr-block', description: 'Amazon provided IPv6' },
      { name: '--no-amazon-provided-ipv6-cidr-block', description: 'No Amazon IPv6' },
      { name: '--ipv6-pool', description: 'IPv6 pool', args: { name: 'pool' } },
      { name: '--ipv6-cidr-block', description: 'IPv6 CIDR block', args: { name: 'cidr' } },
      { name: '--ipv4-ipam-pool-id', description: 'IPv4 IPAM pool ID', args: { name: 'pool-id' } },
      { name: '--ipv4-netmask-length', description: 'IPv4 netmask length', args: { name: 'length' } },
      { name: '--ipv6-ipam-pool-id', description: 'IPv6 IPAM pool ID', args: { name: 'pool-id' } },
      { name: '--ipv6-netmask-length', description: 'IPv6 netmask length', args: { name: 'length' } },
      { name: '--instance-tenancy', description: 'Instance tenancy', args: { name: 'tenancy', suggestions: s('default', 'dedicated', 'host') } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'delete-vpc',
    description: 'Delete a VPC',
    options: [
      { name: '--vpc-id', description: 'VPC ID', args: { name: 'id', generators: vpcGenerator }, required: true },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // Subnet operations
  {
    name: 'describe-subnets',
    description: 'Describe subnets',
    options: [
      { name: '--subnet-ids', description: 'Subnet IDs', args: { name: 'ids', generators: subnetGenerator, isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-subnet',
    description: 'Create a subnet',
    options: [
      { name: '--vpc-id', description: 'VPC ID', args: { name: 'id', generators: vpcGenerator }, required: true },
      { name: '--cidr-block', description: 'IPv4 CIDR block', args: { name: 'cidr' } },
      { name: '--ipv6-cidr-block', description: 'IPv6 CIDR block', args: { name: 'cidr' } },
      { name: '--ipv6-native', description: 'IPv6 native subnet' },
      { name: '--no-ipv6-native', description: 'Not IPv6 native' },
      { name: '--availability-zone', description: 'Availability zone', args: { name: 'az' } },
      { name: '--availability-zone-id', description: 'Availability zone ID', args: { name: 'az-id' } },
      { name: '--outpost-arn', description: 'Outpost ARN', args: { name: 'arn' } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'delete-subnet',
    description: 'Delete a subnet',
    options: [
      { name: '--subnet-id', description: 'Subnet ID', args: { name: 'id', generators: subnetGenerator }, required: true },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // Security Group operations
  {
    name: 'describe-security-groups',
    description: 'Describe security groups',
    options: [
      { name: '--group-ids', description: 'Security group IDs', args: { name: 'ids', generators: securityGroupGenerator, isVariadic: true } },
      { name: '--group-names', description: 'Security group names', args: { name: 'names', isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-security-group',
    description: 'Create a security group',
    options: [
      { name: '--group-name', description: 'Security group name', args: { name: 'name' }, required: true },
      { name: '--description', description: 'Security group description', args: { name: 'desc' }, required: true },
      { name: '--vpc-id', description: 'VPC ID', args: { name: 'id', generators: vpcGenerator } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'delete-security-group',
    description: 'Delete a security group',
    options: [
      { name: '--group-id', description: 'Security group ID', args: { name: 'id', generators: securityGroupGenerator } },
      { name: '--group-name', description: 'Security group name', args: { name: 'name' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'authorize-security-group-ingress',
    description: 'Add inbound rules to security group',
    options: [
      { name: '--group-id', description: 'Security group ID', args: { name: 'id', generators: securityGroupGenerator } },
      { name: '--group-name', description: 'Security group name', args: { name: 'name' } },
      { name: '--ip-permissions', description: 'IP permissions', args: { name: 'permissions' } },
      { name: '--protocol', description: 'Protocol', args: { name: 'proto', suggestions: s('tcp', 'udp', 'icmp', '-1') } },
      { name: '--port', description: 'Port number', args: { name: 'port' } },
      { name: '--cidr', description: 'CIDR block', args: { name: 'cidr', suggestions: s('0.0.0.0/0', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16') } },
      { name: '--source-group', description: 'Source security group', args: { name: 'group' } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'revoke-security-group-ingress',
    description: 'Remove inbound rules from security group',
    options: [
      { name: '--group-id', description: 'Security group ID', args: { name: 'id', generators: securityGroupGenerator } },
      { name: '--group-name', description: 'Security group name', args: { name: 'name' } },
      { name: '--ip-permissions', description: 'IP permissions', args: { name: 'permissions' } },
      { name: '--protocol', description: 'Protocol', args: { name: 'proto', suggestions: s('tcp', 'udp', 'icmp', '-1') } },
      { name: '--port', description: 'Port number', args: { name: 'port' } },
      { name: '--cidr', description: 'CIDR block', args: { name: 'cidr' } },
      { name: '--source-group', description: 'Source security group', args: { name: 'group' } },
      { name: '--security-group-rule-ids', description: 'Security group rule IDs', args: { name: 'ids', isVariadic: true } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'authorize-security-group-egress',
    description: 'Add outbound rules to security group',
    options: [
      { name: '--group-id', description: 'Security group ID', args: { name: 'id', generators: securityGroupGenerator }, required: true },
      { name: '--ip-permissions', description: 'IP permissions', args: { name: 'permissions' } },
      { name: '--protocol', description: 'Protocol', args: { name: 'proto', suggestions: s('tcp', 'udp', 'icmp', '-1') } },
      { name: '--port', description: 'Port number', args: { name: 'port' } },
      { name: '--cidr', description: 'CIDR block', args: { name: 'cidr' } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'revoke-security-group-egress',
    description: 'Remove outbound rules from security group',
    options: [
      { name: '--group-id', description: 'Security group ID', args: { name: 'id', generators: securityGroupGenerator }, required: true },
      { name: '--ip-permissions', description: 'IP permissions', args: { name: 'permissions' } },
      { name: '--security-group-rule-ids', description: 'Security group rule IDs', args: { name: 'ids', isVariadic: true } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // Key Pair operations
  {
    name: 'describe-key-pairs',
    description: 'Describe key pairs',
    options: [
      { name: '--key-names', description: 'Key pair names', args: { name: 'names', generators: keyPairGenerator, isVariadic: true } },
      { name: '--key-pair-ids', description: 'Key pair IDs', args: { name: 'ids', isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--include-public-key', description: 'Include public key' },
      { name: '--no-include-public-key', description: 'Do not include public key' },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'create-key-pair',
    description: 'Create a key pair',
    options: [
      { name: '--key-name', description: 'Key pair name', args: { name: 'name' }, required: true },
      { name: '--key-type', description: 'Key type', args: { name: 'type', suggestions: s('rsa', 'ed25519') } },
      { name: '--key-format', description: 'Key format', args: { name: 'format', suggestions: s('pem', 'ppk') } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'delete-key-pair',
    description: 'Delete a key pair',
    options: [
      { name: '--key-name', description: 'Key pair name', args: { name: 'name', generators: keyPairGenerator } },
      { name: '--key-pair-id', description: 'Key pair ID', args: { name: 'id' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'import-key-pair',
    description: 'Import a key pair',
    options: [
      { name: '--key-name', description: 'Key pair name', args: { name: 'name' }, required: true },
      { name: '--public-key-material', description: 'Public key material', args: { name: 'key' }, required: true },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // Volume operations
  {
    name: 'describe-volumes',
    description: 'Describe EBS volumes',
    options: [
      { name: '--volume-ids', description: 'Volume IDs', args: { name: 'ids', generators: volumeGenerator, isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-volume',
    description: 'Create an EBS volume',
    options: [
      { name: '--availability-zone', description: 'Availability zone', args: { name: 'az' }, required: true },
      { name: '--size', description: 'Volume size (GiB)', args: { name: 'size' } },
      { name: '--snapshot-id', description: 'Snapshot ID', args: { name: 'id', generators: snapshotGenerator } },
      { name: '--volume-type', description: 'Volume type', args: { name: 'type', suggestions: s(...volumeTypes) } },
      { name: '--iops', description: 'IOPS', args: { name: 'iops' } },
      { name: '--throughput', description: 'Throughput (MiB/s)', args: { name: 'throughput' } },
      { name: '--encrypted', description: 'Encrypt the volume' },
      { name: '--no-encrypted', description: 'Do not encrypt' },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key-id' } },
      { name: '--multi-attach-enabled', description: 'Enable multi-attach' },
      { name: '--no-multi-attach-enabled', description: 'Disable multi-attach' },
      { name: '--outpost-arn', description: 'Outpost ARN', args: { name: 'arn' } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'delete-volume',
    description: 'Delete an EBS volume',
    options: [
      { name: '--volume-id', description: 'Volume ID', args: { name: 'id', generators: volumeGenerator }, required: true },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'attach-volume',
    description: 'Attach an EBS volume to an instance',
    options: [
      { name: '--volume-id', description: 'Volume ID', args: { name: 'id', generators: volumeGenerator }, required: true },
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator }, required: true },
      { name: '--device', description: 'Device name', args: { name: 'device', suggestions: s('/dev/sdf', '/dev/sdg', '/dev/sdh', '/dev/xvdf', '/dev/xvdg') }, required: true },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'detach-volume',
    description: 'Detach an EBS volume from an instance',
    options: [
      { name: '--volume-id', description: 'Volume ID', args: { name: 'id', generators: volumeGenerator }, required: true },
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator } },
      { name: '--device', description: 'Device name', args: { name: 'device' } },
      { name: '--force', description: 'Force detach' },
      { name: '--no-force', description: 'No force detach' },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // Snapshot operations
  {
    name: 'describe-snapshots',
    description: 'Describe EBS snapshots',
    options: [
      { name: '--snapshot-ids', description: 'Snapshot IDs', args: { name: 'ids', generators: snapshotGenerator, isVariadic: true } },
      { name: '--owner-ids', description: 'Owner IDs', args: { name: 'ids', suggestions: s('self', 'amazon'), isVariadic: true } },
      { name: '--restorable-by-user-ids', description: 'Restorable by user IDs', args: { name: 'ids', isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-snapshot',
    description: 'Create an EBS snapshot',
    options: [
      { name: '--volume-id', description: 'Volume ID', args: { name: 'id', generators: volumeGenerator }, required: true },
      { name: '--description', description: 'Snapshot description', args: { name: 'desc' } },
      { name: '--outpost-arn', description: 'Outpost ARN', args: { name: 'arn' } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'delete-snapshot',
    description: 'Delete an EBS snapshot',
    options: [
      { name: '--snapshot-id', description: 'Snapshot ID', args: { name: 'id', generators: snapshotGenerator }, required: true },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'copy-snapshot',
    description: 'Copy an EBS snapshot',
    options: [
      { name: '--source-snapshot-id', description: 'Source snapshot ID', args: { name: 'id', generators: snapshotGenerator }, required: true },
      { name: '--source-region', description: 'Source region', args: { name: 'region', suggestions: s(...awsRegions) }, required: true },
      { name: '--description', description: 'Snapshot description', args: { name: 'desc' } },
      { name: '--destination-outpost-arn', description: 'Destination outpost ARN', args: { name: 'arn' } },
      { name: '--destination-region', description: 'Destination region', args: { name: 'region', suggestions: s(...awsRegions) } },
      { name: '--encrypted', description: 'Encrypt the snapshot' },
      { name: '--no-encrypted', description: 'Do not encrypt' },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key-id' } },
      { name: '--presigned-url', description: 'Presigned URL', args: { name: 'url' } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // Elastic IP operations
  {
    name: 'describe-addresses',
    description: 'Describe Elastic IP addresses',
    options: [
      { name: '--allocation-ids', description: 'Allocation IDs', args: { name: 'ids', generators: eipGenerator, isVariadic: true } },
      { name: '--public-ips', description: 'Public IP addresses', args: { name: 'ips', isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'allocate-address',
    description: 'Allocate an Elastic IP address',
    options: [
      { name: '--domain', description: 'Domain', args: { name: 'domain', suggestions: s('vpc', 'standard') } },
      { name: '--address', description: 'Specific address', args: { name: 'ip' } },
      { name: '--public-ipv4-pool', description: 'Public IPv4 pool', args: { name: 'pool' } },
      { name: '--network-border-group', description: 'Network border group', args: { name: 'group' } },
      { name: '--customer-owned-ipv4-pool', description: 'Customer owned pool', args: { name: 'pool' } },
      { name: '--tag-specifications', description: 'Tag specifications', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'release-address',
    description: 'Release an Elastic IP address',
    options: [
      { name: '--allocation-id', description: 'Allocation ID', args: { name: 'id', generators: eipGenerator } },
      { name: '--public-ip', description: 'Public IP address', args: { name: 'ip' } },
      { name: '--network-border-group', description: 'Network border group', args: { name: 'group' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'associate-address',
    description: 'Associate an Elastic IP address with an instance',
    options: [
      { name: '--allocation-id', description: 'Allocation ID', args: { name: 'id', generators: eipGenerator } },
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator } },
      { name: '--public-ip', description: 'Public IP address', args: { name: 'ip' } },
      { name: '--network-interface-id', description: 'Network interface ID', args: { name: 'id', generators: eniGenerator } },
      { name: '--private-ip-address', description: 'Private IP address', args: { name: 'ip' } },
      { name: '--allow-reassociation', description: 'Allow reassociation' },
      { name: '--no-allow-reassociation', description: 'Do not allow reassociation' },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'disassociate-address',
    description: 'Disassociate an Elastic IP address',
    options: [
      { name: '--association-id', description: 'Association ID', args: { name: 'id' } },
      { name: '--public-ip', description: 'Public IP address', args: { name: 'ip' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // Region and AZ operations
  {
    name: 'describe-regions',
    description: 'Describe AWS regions',
    options: [
      { name: '--region-names', description: 'Region names', args: { name: 'names', suggestions: s(...awsRegions), isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--all-regions', description: 'Include all regions' },
      { name: '--no-all-regions', description: 'Only enabled regions' },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'describe-availability-zones',
    description: 'Describe availability zones',
    options: [
      { name: '--zone-names', description: 'Zone names', args: { name: 'names', isVariadic: true } },
      { name: '--zone-ids', description: 'Zone IDs', args: { name: 'ids', isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--all-availability-zones', description: 'Include all AZs' },
      { name: '--no-all-availability-zones', description: 'Only enabled AZs' },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  // Tags
  {
    name: 'create-tags',
    description: 'Create tags for resources',
    options: [
      { name: '--resources', description: 'Resource IDs', args: { name: 'ids', isVariadic: true }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' }, required: true },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'delete-tags',
    description: 'Delete tags from resources',
    options: [
      { name: '--resources', description: 'Resource IDs', args: { name: 'ids', isVariadic: true }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' }
    ]
  },
  {
    name: 'describe-tags',
    description: 'Describe tags',
    options: [
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  }
];
