// AWS RDS CLI completions
import { Subcommand } from '../../types.js';
import { s, rdsInstanceGenerator, securityGroupGenerator, subnetGenerator } from './_shared.js';

const engineTypes = ['mysql', 'postgres', 'mariadb', 'oracle-ee', 'oracle-se2', 'sqlserver-ee', 'sqlserver-se', 'sqlserver-ex', 'sqlserver-web', 'aurora-mysql', 'aurora-postgresql'];
const storageTypes = ['standard', 'gp2', 'gp3', 'io1', 'io2'];
const instanceClasses = ['db.t3.micro', 'db.t3.small', 'db.t3.medium', 'db.t3.large', 'db.t3.xlarge', 'db.t3.2xlarge', 'db.r5.large', 'db.r5.xlarge', 'db.r5.2xlarge', 'db.r5.4xlarge', 'db.m5.large', 'db.m5.xlarge', 'db.m5.2xlarge', 'db.m5.4xlarge'];
const dbInstanceStatus = ['available', 'backing-up', 'creating', 'deleting', 'failed', 'modifying', 'rebooting', 'resetting-master-credentials', 'starting', 'stopped', 'stopping', 'storage-optimization'];

// DB cluster generator
const dbClusterGenerator = {
  script: 'aws rds describe-db-clusters --query "DBClusters[*].DBClusterIdentifier" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(c => c.trim()).map(cluster => ({
      name: cluster.trim(),
      description: 'DB Cluster',
      icon: '🔷',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// DB subnet group generator
const dbSubnetGroupGenerator = {
  script: 'aws rds describe-db-subnet-groups --query "DBSubnetGroups[*].DBSubnetGroupName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(g => g.trim()).map(group => ({
      name: group.trim(),
      description: 'DB Subnet Group',
      icon: '🌐',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// DB parameter group generator
const dbParameterGroupGenerator = {
  script: 'aws rds describe-db-parameter-groups --query "DBParameterGroups[*].DBParameterGroupName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(g => g.trim()).map(group => ({
      name: group.trim(),
      description: 'DB Parameter Group',
      icon: '⚙️',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// DB option group generator
const dbOptionGroupGenerator = {
  script: 'aws rds describe-option-groups --query "OptionGroupsList[*].OptionGroupName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(g => g.trim()).map(group => ({
      name: group.trim(),
      description: 'DB Option Group',
      icon: '📦',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// DB snapshot generator
const dbSnapshotGenerator = {
  script: 'aws rds describe-db-snapshots --query "DBSnapshots[*].DBSnapshotIdentifier" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(snapshot => ({
      name: snapshot.trim(),
      description: 'DB Snapshot',
      icon: '📸',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// DB cluster snapshot generator
const dbClusterSnapshotGenerator = {
  script: 'aws rds describe-db-cluster-snapshots --query "DBClusterSnapshots[*].DBClusterSnapshotIdentifier" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(snapshot => ({
      name: snapshot.trim(),
      description: 'DB Cluster Snapshot',
      icon: '📸',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// DB event subscription generator
const dbEventSubscriptionGenerator = {
  script: 'aws rds describe-event-subscriptions --query "EventSubscriptionsList[*].CustSubscriptionId" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(sub => ({
      name: sub.trim(),
      description: 'Event Subscription',
      icon: '📨',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const rdsSubcommands: Subcommand[] = [
  // DB instance operations
  {
    name: 'describe-db-instances',
    description: 'Describe DB instances',
    options: [
      { name: '--db-instance-identifier', description: 'DB instance identifier', args: { name: 'identifier', generators: rdsInstanceGenerator } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } }
    ]
  },
  {
    name: 'create-db-instance',
    description: 'Create a DB instance',
    options: [
      { name: '--db-instance-identifier', description: 'DB instance identifier', args: { name: 'identifier' }, required: true },
      { name: '--db-instance-class', description: 'Instance class', args: { name: 'class', suggestions: s(...instanceClasses) }, required: true },
      { name: '--engine', description: 'Database engine', args: { name: 'engine', suggestions: s(...engineTypes) }, required: true },
      { name: '--master-username', description: 'Master username', args: { name: 'username' } },
      { name: '--master-user-password', description: 'Master password', args: { name: 'password' } },
      { name: '--db-name', description: 'Database name', args: { name: 'name' } },
      { name: '--allocated-storage', description: 'Allocated storage (GB)', args: { name: 'size' } },
      { name: '--db-subnet-group-name', description: 'DB subnet group', args: { name: 'group', generators: dbSubnetGroupGenerator } },
      { name: '--db-security-groups', description: 'DB security groups', args: { name: 'groups', isVariadic: true } },
      { name: '--vpc-security-group-ids', description: 'VPC security groups', args: { name: 'groups', generators: securityGroupGenerator, isVariadic: true } },
      { name: '--availability-zone', description: 'Availability zone', args: { name: 'zone' } },
      { name: '--port', description: 'Port', args: { name: 'port' } },
      { name: '--engine-version', description: 'Engine version', args: { name: 'version' } },
      { name: '--license-model', description: 'License model', args: { name: 'model', suggestions: s('license-included', 'bring-your-own-license', 'general-public-license') } },
      { name: '--iops', description: 'IOPS', args: { name: 'iops' } },
      { name: '--storage-type', description: 'Storage type', args: { name: 'type', suggestions: s(...storageTypes) } },
      { name: '--storage-throughput', description: 'Storage throughput', args: { name: 'throughput' } },
      { name: '--db-parameter-group-name', description: 'DB parameter group', args: { name: 'group', generators: dbParameterGroupGenerator } },
      { name: '--option-group-name', description: 'Option group', args: { name: 'group', generators: dbOptionGroupGenerator } },
      { name: '--backup-retention-period', description: 'Backup retention (days)', args: { name: 'days' } },
      { name: '--preferred-backup-window', description: 'Backup window', args: { name: 'window' } },
      { name: '--preferred-maintenance-window', description: 'Maintenance window', args: { name: 'window' } },
      { name: '--multi-az', description: 'Enable Multi-AZ' },
      { name: '--no-multi-az', description: 'Disable Multi-AZ' },
      { name: '--publicly-accessible', description: 'Publicly accessible' },
      { name: '--no-publicly-accessible', description: 'Not publicly accessible' },
      { name: '--auto-minor-version-upgrade', description: 'Auto minor version upgrade' },
      { name: '--no-auto-minor-version-upgrade', description: 'No auto minor version upgrade' },
      { name: '--monitoring-interval', description: 'Monitoring interval', args: { name: 'seconds', suggestions: s('0', '1', '5', '10', '15', '30', '60') } },
      { name: '--monitoring-role-arn', description: 'Monitoring role ARN', args: { name: 'arn' } },
      { name: '--enable-iam-database-authentication', description: 'Enable IAM auth' },
      { name: '--no-enable-iam-database-authentication', description: 'Disable IAM auth' },
      { name: '--enable-performance-insights', description: 'Enable Performance Insights' },
      { name: '--no-enable-performance-insights', description: 'Disable Performance Insights' },
      { name: '--performance-insights-kms-key-id', description: 'Performance Insights KMS key', args: { name: 'key' } },
      { name: '--performance-insights-retention-period', description: 'Performance Insights retention', args: { name: 'days', suggestions: s('7', '31', '62', '93', '124', '155', '186', '217', '248', '279', '310', '341', '372', '403', '434', '465', '496', '527', '558', '589', '620', '651', '682', '713', '731') } },
      { name: '--deletion-protection', description: 'Enable deletion protection' },
      { name: '--no-deletion-protection', description: 'Disable deletion protection' },
      { name: '--enable-cloudwatch-logs-exports', description: 'Enable CloudWatch logs exports', args: { name: 'logs', isVariadic: true } },
      { name: '--storage-encrypted', description: 'Enable storage encryption' },
      { name: '--no-storage-encrypted', description: 'Disable storage encryption' },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key' } },
      { name: '--copy-tags-to-snapshot', description: 'Copy tags to snapshot' },
      { name: '--no-copy-tags-to-snapshot', description: 'Do not copy tags to snapshot' },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--max-allocated-storage', description: 'Max allocated storage for autoscaling', args: { name: 'size' } },
      { name: '--manage-master-user-password', description: 'Manage master user password in Secrets Manager' },
      { name: '--no-manage-master-user-password', description: 'Do not manage master user password' },
      { name: '--master-user-secret-kms-key-id', description: 'KMS key for master user secret', args: { name: 'key' } }
    ]
  },
  {
    name: 'delete-db-instance',
    description: 'Delete a DB instance',
    options: [
      { name: '--db-instance-identifier', description: 'DB instance identifier', args: { name: 'identifier', generators: rdsInstanceGenerator }, required: true },
      { name: '--skip-final-snapshot', description: 'Skip final snapshot' },
      { name: '--no-skip-final-snapshot', description: 'Create final snapshot' },
      { name: '--final-db-snapshot-identifier', description: 'Final snapshot identifier', args: { name: 'identifier' } },
      { name: '--delete-automated-backups', description: 'Delete automated backups' },
      { name: '--no-delete-automated-backups', description: 'Keep automated backups' }
    ]
  },
  {
    name: 'modify-db-instance',
    description: 'Modify a DB instance',
    options: [
      { name: '--db-instance-identifier', description: 'DB instance identifier', args: { name: 'identifier', generators: rdsInstanceGenerator }, required: true },
      { name: '--allocated-storage', description: 'Allocated storage (GB)', args: { name: 'size' } },
      { name: '--db-instance-class', description: 'Instance class', args: { name: 'class', suggestions: s(...instanceClasses) } },
      { name: '--db-subnet-group-name', description: 'DB subnet group', args: { name: 'group', generators: dbSubnetGroupGenerator } },
      { name: '--db-security-groups', description: 'DB security groups', args: { name: 'groups', isVariadic: true } },
      { name: '--vpc-security-group-ids', description: 'VPC security groups', args: { name: 'groups', generators: securityGroupGenerator, isVariadic: true } },
      { name: '--apply-immediately', description: 'Apply immediately' },
      { name: '--no-apply-immediately', description: 'Apply during maintenance window' },
      { name: '--master-user-password', description: 'Master password', args: { name: 'password' } },
      { name: '--db-parameter-group-name', description: 'DB parameter group', args: { name: 'group', generators: dbParameterGroupGenerator } },
      { name: '--backup-retention-period', description: 'Backup retention (days)', args: { name: 'days' } },
      { name: '--preferred-backup-window', description: 'Backup window', args: { name: 'window' } },
      { name: '--preferred-maintenance-window', description: 'Maintenance window', args: { name: 'window' } },
      { name: '--multi-az', description: 'Enable Multi-AZ' },
      { name: '--no-multi-az', description: 'Disable Multi-AZ' },
      { name: '--engine-version', description: 'Engine version', args: { name: 'version' } },
      { name: '--allow-major-version-upgrade', description: 'Allow major version upgrade' },
      { name: '--no-allow-major-version-upgrade', description: 'Disallow major version upgrade' },
      { name: '--auto-minor-version-upgrade', description: 'Auto minor version upgrade' },
      { name: '--no-auto-minor-version-upgrade', description: 'No auto minor version upgrade' },
      { name: '--iops', description: 'IOPS', args: { name: 'iops' } },
      { name: '--storage-type', description: 'Storage type', args: { name: 'type', suggestions: s(...storageTypes) } },
      { name: '--storage-throughput', description: 'Storage throughput', args: { name: 'throughput' } },
      { name: '--option-group-name', description: 'Option group', args: { name: 'group', generators: dbOptionGroupGenerator } },
      { name: '--new-db-instance-identifier', description: 'New instance identifier', args: { name: 'identifier' } },
      { name: '--publicly-accessible', description: 'Publicly accessible' },
      { name: '--no-publicly-accessible', description: 'Not publicly accessible' },
      { name: '--monitoring-interval', description: 'Monitoring interval', args: { name: 'seconds', suggestions: s('0', '1', '5', '10', '15', '30', '60') } },
      { name: '--monitoring-role-arn', description: 'Monitoring role ARN', args: { name: 'arn' } },
      { name: '--enable-iam-database-authentication', description: 'Enable IAM auth' },
      { name: '--no-enable-iam-database-authentication', description: 'Disable IAM auth' },
      { name: '--enable-performance-insights', description: 'Enable Performance Insights' },
      { name: '--no-enable-performance-insights', description: 'Disable Performance Insights' },
      { name: '--performance-insights-kms-key-id', description: 'Performance Insights KMS key', args: { name: 'key' } },
      { name: '--performance-insights-retention-period', description: 'Performance Insights retention', args: { name: 'days' } },
      { name: '--deletion-protection', description: 'Enable deletion protection' },
      { name: '--no-deletion-protection', description: 'Disable deletion protection' },
      { name: '--max-allocated-storage', description: 'Max allocated storage', args: { name: 'size' } },
      { name: '--certificate-rotation-restart', description: 'Restart for certificate rotation' },
      { name: '--no-certificate-rotation-restart', description: 'No restart for certificate rotation' },
      { name: '--replica-mode', description: 'Replica mode', args: { name: 'mode', suggestions: s('open-read-only', 'mounted') } },
      { name: '--cloudwatch-logs-export-configuration', description: 'CloudWatch logs export config', args: { name: 'config' } },
      { name: '--manage-master-user-password', description: 'Manage master user password' },
      { name: '--no-manage-master-user-password', description: 'Do not manage master user password' },
      { name: '--rotate-master-user-password', description: 'Rotate master user password' },
      { name: '--no-rotate-master-user-password', description: 'Do not rotate master user password' },
      { name: '--master-user-secret-kms-key-id', description: 'KMS key for master user secret', args: { name: 'key' } }
    ]
  },
  {
    name: 'reboot-db-instance',
    description: 'Reboot a DB instance',
    options: [
      { name: '--db-instance-identifier', description: 'DB instance identifier', args: { name: 'identifier', generators: rdsInstanceGenerator }, required: true },
      { name: '--force-failover', description: 'Force failover' },
      { name: '--no-force-failover', description: 'No force failover' }
    ]
  },
  {
    name: 'start-db-instance',
    description: 'Start a stopped DB instance',
    options: [
      { name: '--db-instance-identifier', description: 'DB instance identifier', args: { name: 'identifier', generators: rdsInstanceGenerator }, required: true }
    ]
  },
  {
    name: 'stop-db-instance',
    description: 'Stop a DB instance',
    options: [
      { name: '--db-instance-identifier', description: 'DB instance identifier', args: { name: 'identifier', generators: rdsInstanceGenerator }, required: true },
      { name: '--db-snapshot-identifier', description: 'Snapshot identifier', args: { name: 'identifier' } }
    ]
  },
  // DB cluster operations (Aurora)
  {
    name: 'describe-db-clusters',
    description: 'Describe DB clusters',
    options: [
      { name: '--db-cluster-identifier', description: 'DB cluster identifier', args: { name: 'identifier', generators: dbClusterGenerator } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } },
      { name: '--include-shared', description: 'Include shared clusters' },
      { name: '--no-include-shared', description: 'Exclude shared clusters' }
    ]
  },
  {
    name: 'create-db-cluster',
    description: 'Create a DB cluster',
    options: [
      { name: '--db-cluster-identifier', description: 'DB cluster identifier', args: { name: 'identifier' }, required: true },
      { name: '--engine', description: 'Database engine', args: { name: 'engine', suggestions: s('aurora-mysql', 'aurora-postgresql', 'mysql', 'postgres') }, required: true },
      { name: '--engine-version', description: 'Engine version', args: { name: 'version' } },
      { name: '--engine-mode', description: 'Engine mode', args: { name: 'mode', suggestions: s('provisioned', 'serverless', 'parallelquery', 'global', 'multimaster') } },
      { name: '--master-username', description: 'Master username', args: { name: 'username' } },
      { name: '--master-user-password', description: 'Master password', args: { name: 'password' } },
      { name: '--database-name', description: 'Database name', args: { name: 'name' } },
      { name: '--db-subnet-group-name', description: 'DB subnet group', args: { name: 'group', generators: dbSubnetGroupGenerator } },
      { name: '--vpc-security-group-ids', description: 'VPC security groups', args: { name: 'groups', generators: securityGroupGenerator, isVariadic: true } },
      { name: '--availability-zones', description: 'Availability zones', args: { name: 'zones', isVariadic: true } },
      { name: '--port', description: 'Port', args: { name: 'port' } },
      { name: '--db-cluster-parameter-group-name', description: 'Parameter group', args: { name: 'group' } },
      { name: '--backup-retention-period', description: 'Backup retention (days)', args: { name: 'days' } },
      { name: '--preferred-backup-window', description: 'Backup window', args: { name: 'window' } },
      { name: '--preferred-maintenance-window', description: 'Maintenance window', args: { name: 'window' } },
      { name: '--storage-encrypted', description: 'Enable storage encryption' },
      { name: '--no-storage-encrypted', description: 'Disable storage encryption' },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key' } },
      { name: '--enable-iam-database-authentication', description: 'Enable IAM auth' },
      { name: '--no-enable-iam-database-authentication', description: 'Disable IAM auth' },
      { name: '--enable-http-endpoint', description: 'Enable HTTP endpoint' },
      { name: '--no-enable-http-endpoint', description: 'Disable HTTP endpoint' },
      { name: '--copy-tags-to-snapshot', description: 'Copy tags to snapshot' },
      { name: '--no-copy-tags-to-snapshot', description: 'Do not copy tags to snapshot' },
      { name: '--deletion-protection', description: 'Enable deletion protection' },
      { name: '--no-deletion-protection', description: 'Disable deletion protection' },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--scaling-configuration', description: 'Scaling configuration (serverless)', args: { name: 'config' } },
      { name: '--serverless-v2-scaling-configuration', description: 'Serverless v2 scaling config', args: { name: 'config' } },
      { name: '--enable-cloudwatch-logs-exports', description: 'Enable CloudWatch logs exports', args: { name: 'logs', isVariadic: true } },
      { name: '--manage-master-user-password', description: 'Manage master user password' },
      { name: '--no-manage-master-user-password', description: 'Do not manage master user password' },
      { name: '--master-user-secret-kms-key-id', description: 'KMS key for master user secret', args: { name: 'key' } }
    ]
  },
  {
    name: 'delete-db-cluster',
    description: 'Delete a DB cluster',
    options: [
      { name: '--db-cluster-identifier', description: 'DB cluster identifier', args: { name: 'identifier', generators: dbClusterGenerator }, required: true },
      { name: '--skip-final-snapshot', description: 'Skip final snapshot' },
      { name: '--no-skip-final-snapshot', description: 'Create final snapshot' },
      { name: '--final-db-snapshot-identifier', description: 'Final snapshot identifier', args: { name: 'identifier' } },
      { name: '--delete-automated-backups', description: 'Delete automated backups' },
      { name: '--no-delete-automated-backups', description: 'Keep automated backups' }
    ]
  },
  {
    name: 'modify-db-cluster',
    description: 'Modify a DB cluster',
    options: [
      { name: '--db-cluster-identifier', description: 'DB cluster identifier', args: { name: 'identifier', generators: dbClusterGenerator }, required: true },
      { name: '--new-db-cluster-identifier', description: 'New cluster identifier', args: { name: 'identifier' } },
      { name: '--apply-immediately', description: 'Apply immediately' },
      { name: '--no-apply-immediately', description: 'Apply during maintenance window' },
      { name: '--backup-retention-period', description: 'Backup retention (days)', args: { name: 'days' } },
      { name: '--db-cluster-parameter-group-name', description: 'Parameter group', args: { name: 'group' } },
      { name: '--vpc-security-group-ids', description: 'VPC security groups', args: { name: 'groups', generators: securityGroupGenerator, isVariadic: true } },
      { name: '--port', description: 'Port', args: { name: 'port' } },
      { name: '--master-user-password', description: 'Master password', args: { name: 'password' } },
      { name: '--option-group-name', description: 'Option group', args: { name: 'group', generators: dbOptionGroupGenerator } },
      { name: '--preferred-backup-window', description: 'Backup window', args: { name: 'window' } },
      { name: '--preferred-maintenance-window', description: 'Maintenance window', args: { name: 'window' } },
      { name: '--enable-iam-database-authentication', description: 'Enable IAM auth' },
      { name: '--no-enable-iam-database-authentication', description: 'Disable IAM auth' },
      { name: '--cloudwatch-logs-export-configuration', description: 'CloudWatch logs export config', args: { name: 'config' } },
      { name: '--engine-version', description: 'Engine version', args: { name: 'version' } },
      { name: '--allow-major-version-upgrade', description: 'Allow major version upgrade' },
      { name: '--no-allow-major-version-upgrade', description: 'Disallow major version upgrade' },
      { name: '--deletion-protection', description: 'Enable deletion protection' },
      { name: '--no-deletion-protection', description: 'Disable deletion protection' },
      { name: '--copy-tags-to-snapshot', description: 'Copy tags to snapshot' },
      { name: '--no-copy-tags-to-snapshot', description: 'Do not copy tags to snapshot' },
      { name: '--scaling-configuration', description: 'Scaling configuration', args: { name: 'config' } },
      { name: '--serverless-v2-scaling-configuration', description: 'Serverless v2 scaling config', args: { name: 'config' } },
      { name: '--enable-http-endpoint', description: 'Enable HTTP endpoint' },
      { name: '--no-enable-http-endpoint', description: 'Disable HTTP endpoint' },
      { name: '--manage-master-user-password', description: 'Manage master user password' },
      { name: '--no-manage-master-user-password', description: 'Do not manage master user password' },
      { name: '--rotate-master-user-password', description: 'Rotate master user password' },
      { name: '--no-rotate-master-user-password', description: 'Do not rotate master user password' },
      { name: '--master-user-secret-kms-key-id', description: 'KMS key for master user secret', args: { name: 'key' } }
    ]
  },
  {
    name: 'start-db-cluster',
    description: 'Start a stopped DB cluster',
    options: [
      { name: '--db-cluster-identifier', description: 'DB cluster identifier', args: { name: 'identifier', generators: dbClusterGenerator }, required: true }
    ]
  },
  {
    name: 'stop-db-cluster',
    description: 'Stop a DB cluster',
    options: [
      { name: '--db-cluster-identifier', description: 'DB cluster identifier', args: { name: 'identifier', generators: dbClusterGenerator }, required: true }
    ]
  },
  {
    name: 'failover-db-cluster',
    description: 'Failover a DB cluster',
    options: [
      { name: '--db-cluster-identifier', description: 'DB cluster identifier', args: { name: 'identifier', generators: dbClusterGenerator }, required: true },
      { name: '--target-db-instance-identifier', description: 'Target instance', args: { name: 'identifier', generators: rdsInstanceGenerator } }
    ]
  },
  // Snapshots
  {
    name: 'describe-db-snapshots',
    description: 'Describe DB snapshots',
    options: [
      { name: '--db-instance-identifier', description: 'Filter by instance', args: { name: 'identifier', generators: rdsInstanceGenerator } },
      { name: '--db-snapshot-identifier', description: 'Snapshot identifier', args: { name: 'identifier', generators: dbSnapshotGenerator } },
      { name: '--snapshot-type', description: 'Snapshot type', args: { name: 'type', suggestions: s('automated', 'manual', 'shared', 'public', 'awsbackup') } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } },
      { name: '--include-shared', description: 'Include shared snapshots' },
      { name: '--no-include-shared', description: 'Exclude shared snapshots' },
      { name: '--include-public', description: 'Include public snapshots' },
      { name: '--no-include-public', description: 'Exclude public snapshots' }
    ]
  },
  {
    name: 'create-db-snapshot',
    description: 'Create a DB snapshot',
    options: [
      { name: '--db-snapshot-identifier', description: 'Snapshot identifier', args: { name: 'identifier' }, required: true },
      { name: '--db-instance-identifier', description: 'DB instance identifier', args: { name: 'identifier', generators: rdsInstanceGenerator }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-db-snapshot',
    description: 'Delete a DB snapshot',
    options: [
      { name: '--db-snapshot-identifier', description: 'Snapshot identifier', args: { name: 'identifier', generators: dbSnapshotGenerator }, required: true }
    ]
  },
  {
    name: 'copy-db-snapshot',
    description: 'Copy a DB snapshot',
    options: [
      { name: '--source-db-snapshot-identifier', description: 'Source snapshot', args: { name: 'identifier', generators: dbSnapshotGenerator }, required: true },
      { name: '--target-db-snapshot-identifier', description: 'Target snapshot', args: { name: 'identifier' }, required: true },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--copy-tags', description: 'Copy tags' },
      { name: '--no-copy-tags', description: 'Do not copy tags' },
      { name: '--pre-signed-url', description: 'Pre-signed URL', args: { name: 'url' } },
      { name: '--option-group-name', description: 'Option group', args: { name: 'group', generators: dbOptionGroupGenerator } }
    ]
  },
  {
    name: 'restore-db-instance-from-db-snapshot',
    description: 'Restore DB instance from snapshot',
    options: [
      { name: '--db-instance-identifier', description: 'New instance identifier', args: { name: 'identifier' }, required: true },
      { name: '--db-snapshot-identifier', description: 'Source snapshot', args: { name: 'identifier', generators: dbSnapshotGenerator }, required: true },
      { name: '--db-instance-class', description: 'Instance class', args: { name: 'class', suggestions: s(...instanceClasses) } },
      { name: '--port', description: 'Port', args: { name: 'port' } },
      { name: '--availability-zone', description: 'Availability zone', args: { name: 'zone' } },
      { name: '--db-subnet-group-name', description: 'DB subnet group', args: { name: 'group', generators: dbSubnetGroupGenerator } },
      { name: '--multi-az', description: 'Enable Multi-AZ' },
      { name: '--no-multi-az', description: 'Disable Multi-AZ' },
      { name: '--publicly-accessible', description: 'Publicly accessible' },
      { name: '--no-publicly-accessible', description: 'Not publicly accessible' },
      { name: '--auto-minor-version-upgrade', description: 'Auto minor version upgrade' },
      { name: '--no-auto-minor-version-upgrade', description: 'No auto minor version upgrade' },
      { name: '--license-model', description: 'License model', args: { name: 'model' } },
      { name: '--db-name', description: 'Database name', args: { name: 'name' } },
      { name: '--engine', description: 'Engine', args: { name: 'engine', suggestions: s(...engineTypes) } },
      { name: '--iops', description: 'IOPS', args: { name: 'iops' } },
      { name: '--option-group-name', description: 'Option group', args: { name: 'group', generators: dbOptionGroupGenerator } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--storage-type', description: 'Storage type', args: { name: 'type', suggestions: s(...storageTypes) } },
      { name: '--vpc-security-group-ids', description: 'VPC security groups', args: { name: 'groups', generators: securityGroupGenerator, isVariadic: true } },
      { name: '--domain', description: 'Active Directory domain', args: { name: 'domain' } },
      { name: '--copy-tags-to-snapshot', description: 'Copy tags to snapshot' },
      { name: '--no-copy-tags-to-snapshot', description: 'Do not copy tags to snapshot' },
      { name: '--domain-iam-role-name', description: 'Domain IAM role', args: { name: 'role' } },
      { name: '--enable-iam-database-authentication', description: 'Enable IAM auth' },
      { name: '--no-enable-iam-database-authentication', description: 'Disable IAM auth' },
      { name: '--enable-cloudwatch-logs-exports', description: 'Enable CloudWatch logs exports', args: { name: 'logs', isVariadic: true } },
      { name: '--deletion-protection', description: 'Enable deletion protection' },
      { name: '--no-deletion-protection', description: 'Disable deletion protection' }
    ]
  },
  // Cluster snapshots
  {
    name: 'describe-db-cluster-snapshots',
    description: 'Describe DB cluster snapshots',
    options: [
      { name: '--db-cluster-identifier', description: 'Filter by cluster', args: { name: 'identifier', generators: dbClusterGenerator } },
      { name: '--db-cluster-snapshot-identifier', description: 'Snapshot identifier', args: { name: 'identifier', generators: dbClusterSnapshotGenerator } },
      { name: '--snapshot-type', description: 'Snapshot type', args: { name: 'type', suggestions: s('automated', 'manual', 'shared', 'public') } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } },
      { name: '--include-shared', description: 'Include shared snapshots' },
      { name: '--no-include-shared', description: 'Exclude shared snapshots' },
      { name: '--include-public', description: 'Include public snapshots' },
      { name: '--no-include-public', description: 'Exclude public snapshots' }
    ]
  },
  {
    name: 'create-db-cluster-snapshot',
    description: 'Create a DB cluster snapshot',
    options: [
      { name: '--db-cluster-snapshot-identifier', description: 'Snapshot identifier', args: { name: 'identifier' }, required: true },
      { name: '--db-cluster-identifier', description: 'DB cluster identifier', args: { name: 'identifier', generators: dbClusterGenerator }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-db-cluster-snapshot',
    description: 'Delete a DB cluster snapshot',
    options: [
      { name: '--db-cluster-snapshot-identifier', description: 'Snapshot identifier', args: { name: 'identifier', generators: dbClusterSnapshotGenerator }, required: true }
    ]
  },
  // Subnet groups
  {
    name: 'describe-db-subnet-groups',
    description: 'Describe DB subnet groups',
    options: [
      { name: '--db-subnet-group-name', description: 'Subnet group name', args: { name: 'name', generators: dbSubnetGroupGenerator } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } }
    ]
  },
  {
    name: 'create-db-subnet-group',
    description: 'Create a DB subnet group',
    options: [
      { name: '--db-subnet-group-name', description: 'Subnet group name', args: { name: 'name' }, required: true },
      { name: '--db-subnet-group-description', description: 'Description', args: { name: 'description' }, required: true },
      { name: '--subnet-ids', description: 'Subnet IDs', args: { name: 'subnets', generators: subnetGenerator, isVariadic: true }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-db-subnet-group',
    description: 'Delete a DB subnet group',
    options: [
      { name: '--db-subnet-group-name', description: 'Subnet group name', args: { name: 'name', generators: dbSubnetGroupGenerator }, required: true }
    ]
  },
  {
    name: 'modify-db-subnet-group',
    description: 'Modify a DB subnet group',
    options: [
      { name: '--db-subnet-group-name', description: 'Subnet group name', args: { name: 'name', generators: dbSubnetGroupGenerator }, required: true },
      { name: '--db-subnet-group-description', description: 'Description', args: { name: 'description' } },
      { name: '--subnet-ids', description: 'Subnet IDs', args: { name: 'subnets', generators: subnetGenerator, isVariadic: true }, required: true }
    ]
  },
  // Parameter groups
  {
    name: 'describe-db-parameter-groups',
    description: 'Describe DB parameter groups',
    options: [
      { name: '--db-parameter-group-name', description: 'Parameter group name', args: { name: 'name', generators: dbParameterGroupGenerator } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } }
    ]
  },
  {
    name: 'create-db-parameter-group',
    description: 'Create a DB parameter group',
    options: [
      { name: '--db-parameter-group-name', description: 'Parameter group name', args: { name: 'name' }, required: true },
      { name: '--db-parameter-group-family', description: 'Parameter group family', args: { name: 'family', suggestions: s('mysql8.0', 'mysql5.7', 'postgres15', 'postgres14', 'postgres13', 'aurora-mysql8.0', 'aurora-postgresql15') }, required: true },
      { name: '--description', description: 'Description', args: { name: 'description' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-db-parameter-group',
    description: 'Delete a DB parameter group',
    options: [
      { name: '--db-parameter-group-name', description: 'Parameter group name', args: { name: 'name', generators: dbParameterGroupGenerator }, required: true }
    ]
  },
  {
    name: 'describe-db-parameters',
    description: 'Describe DB parameters',
    options: [
      { name: '--db-parameter-group-name', description: 'Parameter group name', args: { name: 'name', generators: dbParameterGroupGenerator }, required: true },
      { name: '--source', description: 'Parameter source', args: { name: 'source', suggestions: s('user', 'system', 'engine-default') } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } }
    ]
  },
  {
    name: 'modify-db-parameter-group',
    description: 'Modify a DB parameter group',
    options: [
      { name: '--db-parameter-group-name', description: 'Parameter group name', args: { name: 'name', generators: dbParameterGroupGenerator }, required: true },
      { name: '--parameters', description: 'Parameters', args: { name: 'parameters' }, required: true }
    ]
  },
  {
    name: 'reset-db-parameter-group',
    description: 'Reset a DB parameter group',
    options: [
      { name: '--db-parameter-group-name', description: 'Parameter group name', args: { name: 'name', generators: dbParameterGroupGenerator }, required: true },
      { name: '--reset-all-parameters', description: 'Reset all parameters' },
      { name: '--no-reset-all-parameters', description: 'Do not reset all parameters' },
      { name: '--parameters', description: 'Parameters to reset', args: { name: 'parameters' } }
    ]
  },
  // Events
  {
    name: 'describe-events',
    description: 'Describe events',
    options: [
      { name: '--source-identifier', description: 'Source identifier', args: { name: 'identifier' } },
      { name: '--source-type', description: 'Source type', args: { name: 'type', suggestions: s('db-instance', 'db-parameter-group', 'db-security-group', 'db-snapshot', 'db-cluster', 'db-cluster-snapshot', 'custom-engine-version', 'db-proxy', 'blue-green-deployment') } },
      { name: '--start-time', description: 'Start time', args: { name: 'timestamp' } },
      { name: '--end-time', description: 'End time', args: { name: 'timestamp' } },
      { name: '--duration', description: 'Duration (minutes)', args: { name: 'minutes' } },
      { name: '--event-categories', description: 'Event categories', args: { name: 'categories', isVariadic: true } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } }
    ]
  },
  {
    name: 'describe-event-subscriptions',
    description: 'Describe event subscriptions',
    options: [
      { name: '--subscription-name', description: 'Subscription name', args: { name: 'name', generators: dbEventSubscriptionGenerator } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } }
    ]
  },
  {
    name: 'create-event-subscription',
    description: 'Create an event subscription',
    options: [
      { name: '--subscription-name', description: 'Subscription name', args: { name: 'name' }, required: true },
      { name: '--sns-topic-arn', description: 'SNS topic ARN', args: { name: 'arn' }, required: true },
      { name: '--source-type', description: 'Source type', args: { name: 'type', suggestions: s('db-instance', 'db-cluster', 'db-parameter-group', 'db-security-group', 'db-snapshot', 'db-cluster-snapshot') } },
      { name: '--event-categories', description: 'Event categories', args: { name: 'categories', isVariadic: true } },
      { name: '--source-ids', description: 'Source IDs', args: { name: 'ids', isVariadic: true } },
      { name: '--enabled', description: 'Enable subscription' },
      { name: '--no-enabled', description: 'Disable subscription' },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-event-subscription',
    description: 'Delete an event subscription',
    options: [
      { name: '--subscription-name', description: 'Subscription name', args: { name: 'name', generators: dbEventSubscriptionGenerator }, required: true }
    ]
  },
  // Tags
  {
    name: 'add-tags-to-resource',
    description: 'Add tags to a resource',
    options: [
      { name: '--resource-name', description: 'Resource ARN', args: { name: 'arn' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' }, required: true }
    ]
  },
  {
    name: 'remove-tags-from-resource',
    description: 'Remove tags from a resource',
    options: [
      { name: '--resource-name', description: 'Resource ARN', args: { name: 'arn' }, required: true },
      { name: '--tag-keys', description: 'Tag keys', args: { name: 'keys', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'list-tags-for-resource',
    description: 'List tags for a resource',
    options: [
      { name: '--resource-name', description: 'Resource ARN', args: { name: 'arn' }, required: true }
    ]
  },
  // Engine versions
  {
    name: 'describe-db-engine-versions',
    description: 'Describe DB engine versions',
    options: [
      { name: '--engine', description: 'Engine', args: { name: 'engine', suggestions: s(...engineTypes) } },
      { name: '--engine-version', description: 'Engine version', args: { name: 'version' } },
      { name: '--db-parameter-group-family', description: 'Parameter group family', args: { name: 'family' } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } },
      { name: '--default-only', description: 'Default versions only' },
      { name: '--no-default-only', description: 'All versions' },
      { name: '--list-supported-character-sets', description: 'List supported character sets' },
      { name: '--no-list-supported-character-sets', description: 'Do not list character sets' },
      { name: '--list-supported-timezones', description: 'List supported timezones' },
      { name: '--no-list-supported-timezones', description: 'Do not list timezones' },
      { name: '--include-all', description: 'Include all versions' },
      { name: '--no-include-all', description: 'Do not include all versions' }
    ]
  },
  // Misc
  {
    name: 'describe-orderable-db-instance-options',
    description: 'Describe orderable DB instance options',
    options: [
      { name: '--engine', description: 'Engine', args: { name: 'engine', suggestions: s(...engineTypes) }, required: true },
      { name: '--engine-version', description: 'Engine version', args: { name: 'version' } },
      { name: '--db-instance-class', description: 'Instance class', args: { name: 'class', suggestions: s(...instanceClasses) } },
      { name: '--license-model', description: 'License model', args: { name: 'model' } },
      { name: '--vpc', description: 'VPC only' },
      { name: '--no-vpc', description: 'Not VPC only' },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } },
      { name: '--availability-zone-group', description: 'AZ group', args: { name: 'group' } }
    ]
  },
  {
    name: 'describe-certificates',
    description: 'Describe certificates',
    options: [
      { name: '--certificate-identifier', description: 'Certificate identifier', args: { name: 'identifier' } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-records', description: 'Maximum records', args: { name: 'number' } },
      { name: '--marker', description: 'Pagination marker', args: { name: 'marker' } }
    ]
  }
];
