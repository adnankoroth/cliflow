// AWS SSM (Systems Manager) CLI completions
import { Subcommand } from '../../types.js';
import { s, ssmParameterGenerator, ec2InstanceGenerator } from './_shared.js';

// Document generator
const ssmDocumentGenerator = {
  script: 'aws ssm list-documents --query "DocumentIdentifiers[*].Name" --output text 2>/dev/null | head -30',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(d => d.trim()).map(doc => ({
      name: doc.trim(),
      description: 'SSM Document',
      icon: '📄',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Command invocation generator
const commandIdGenerator = {
  script: 'aws ssm list-commands --query "Commands[*].CommandId" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(c => c.trim()).map(cmd => ({
      name: cmd.trim(),
      description: 'Command Invocation',
      icon: '🔧',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Maintenance window generator
const maintenanceWindowGenerator = {
  script: 'aws ssm describe-maintenance-windows --query "WindowIdentities[*].WindowId" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(w => w.trim()).map(window => ({
      name: window.trim(),
      description: 'Maintenance Window',
      icon: '🔧',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Patch baseline generator
const patchBaselineGenerator = {
  script: 'aws ssm describe-patch-baselines --query "BaselineIdentities[*].BaselineId" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(b => b.trim()).map(baseline => ({
      name: baseline.trim(),
      description: 'Patch Baseline',
      icon: '🩹',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Association generator
const associationIdGenerator = {
  script: 'aws ssm list-associations --query "Associations[*].AssociationId" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(a => a.trim()).map(assoc => ({
      name: assoc.trim(),
      description: 'State Manager Association',
      icon: '🔗',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Automation execution generator
const automationExecutionIdGenerator = {
  script: 'aws ssm describe-automation-executions --query "AutomationExecutionMetadataList[*].AutomationExecutionId" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(e => e.trim()).map(exec => ({
      name: exec.trim(),
      description: 'Automation Execution',
      icon: '🤖',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// OpsItem generator
const opsItemIdGenerator = {
  script: 'aws ssm describe-ops-items --query "OpsItemSummaries[*].OpsItemId" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(o => o.trim()).map(opsItem => ({
      name: opsItem.trim(),
      description: 'OpsItem',
      icon: '📋',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

const parameterTypes = ['String', 'StringList', 'SecureString'];
const documentTypes = ['Command', 'Policy', 'Automation', 'Session', 'Package', 'ApplicationConfiguration', 'ApplicationConfigurationSchema', 'DeploymentStrategy', 'ChangeCalendar', 'ProblemAnalysis', 'ProblemAnalysisTemplate', 'QuickSetup'];
const documentFormats = ['YAML', 'JSON', 'TEXT'];
const platformTypes = ['Windows', 'Linux', 'MacOS'];

export const ssmSubcommands: Subcommand[] = [
  // Parameter Store
  {
    name: 'get-parameter',
    description: 'Get a parameter value',
    options: [
      { name: '--name', description: 'Parameter name', args: { name: 'name', generators: ssmParameterGenerator }, required: true },
      { name: '--with-decryption', description: 'Decrypt SecureString' },
      { name: '--no-with-decryption', description: 'Do not decrypt' }
    ]
  },
  {
    name: 'get-parameters',
    description: 'Get multiple parameter values',
    options: [
      { name: '--names', description: 'Parameter names', args: { name: 'names', generators: ssmParameterGenerator, isVariadic: true }, required: true },
      { name: '--with-decryption', description: 'Decrypt SecureString' },
      { name: '--no-with-decryption', description: 'Do not decrypt' }
    ]
  },
  {
    name: 'get-parameters-by-path',
    description: 'Get parameters by path',
    options: [
      { name: '--path', description: 'Parameter path', args: { name: 'path' }, required: true },
      { name: '--recursive', description: 'Include subpaths' },
      { name: '--no-recursive', description: 'Only direct children' },
      { name: '--parameter-filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--with-decryption', description: 'Decrypt SecureString' },
      { name: '--no-with-decryption', description: 'Do not decrypt' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-parameters',
    description: 'List parameters',
    options: [
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--parameter-filters', description: 'Parameter filters', args: { name: 'filters' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--shared', description: 'Include shared parameters' },
      { name: '--no-shared', description: 'Exclude shared parameters' }
    ]
  },
  {
    name: 'put-parameter',
    description: 'Create or update a parameter',
    options: [
      { name: '--name', description: 'Parameter name', args: { name: 'name' }, required: true },
      { name: '--description', description: 'Description', args: { name: 'description' } },
      { name: '--value', description: 'Parameter value', args: { name: 'value' }, required: true },
      { name: '--type', description: 'Parameter type', args: { name: 'type', suggestions: s(...parameterTypes) } },
      { name: '--key-id', description: 'KMS key ID', args: { name: 'key' } },
      { name: '--overwrite', description: 'Overwrite existing' },
      { name: '--no-overwrite', description: 'Do not overwrite' },
      { name: '--allowed-pattern', description: 'Validation pattern', args: { name: 'pattern' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--tier', description: 'Parameter tier', args: { name: 'tier', suggestions: s('Standard', 'Advanced', 'Intelligent-Tiering') } },
      { name: '--policies', description: 'Parameter policies', args: { name: 'policies' } },
      { name: '--data-type', description: 'Data type', args: { name: 'type', suggestions: s('text', 'aws:ec2:image', 'aws:ssm:integration') } }
    ]
  },
  {
    name: 'delete-parameter',
    description: 'Delete a parameter',
    options: [
      { name: '--name', description: 'Parameter name', args: { name: 'name', generators: ssmParameterGenerator }, required: true }
    ]
  },
  {
    name: 'delete-parameters',
    description: 'Delete multiple parameters',
    options: [
      { name: '--names', description: 'Parameter names', args: { name: 'names', generators: ssmParameterGenerator, isVariadic: true }, required: true }
    ]
  },
  {
    name: 'get-parameter-history',
    description: 'Get parameter history',
    options: [
      { name: '--name', description: 'Parameter name', args: { name: 'name', generators: ssmParameterGenerator }, required: true },
      { name: '--with-decryption', description: 'Decrypt SecureString' },
      { name: '--no-with-decryption', description: 'Do not decrypt' },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'label-parameter-version',
    description: 'Add labels to parameter version',
    options: [
      { name: '--name', description: 'Parameter name', args: { name: 'name', generators: ssmParameterGenerator }, required: true },
      { name: '--parameter-version', description: 'Version number', args: { name: 'version' } },
      { name: '--labels', description: 'Labels', args: { name: 'labels', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'unlabel-parameter-version',
    description: 'Remove labels from parameter version',
    options: [
      { name: '--name', description: 'Parameter name', args: { name: 'name', generators: ssmParameterGenerator }, required: true },
      { name: '--parameter-version', description: 'Version number', args: { name: 'version' }, required: true },
      { name: '--labels', description: 'Labels to remove', args: { name: 'labels', isVariadic: true }, required: true }
    ]
  },
  // Run Command
  {
    name: 'send-command',
    description: 'Run a command on instances',
    options: [
      { name: '--instance-ids', description: 'Instance IDs', args: { name: 'instances', generators: ec2InstanceGenerator, isVariadic: true } },
      { name: '--targets', description: 'Targets', args: { name: 'targets' } },
      { name: '--document-name', description: 'Document name', args: { name: 'document', generators: ssmDocumentGenerator }, required: true },
      { name: '--document-version', description: 'Document version', args: { name: 'version' } },
      { name: '--document-hash', description: 'Document hash', args: { name: 'hash' } },
      { name: '--document-hash-type', description: 'Document hash type', args: { name: 'type', suggestions: s('Sha256', 'Sha1') } },
      { name: '--timeout-seconds', description: 'Timeout seconds', args: { name: 'seconds' } },
      { name: '--comment', description: 'Comment', args: { name: 'comment' } },
      { name: '--parameters', description: 'Parameters', args: { name: 'parameters' } },
      { name: '--output-s3-region', description: 'S3 region', args: { name: 'region' } },
      { name: '--output-s3-bucket-name', description: 'S3 bucket', args: { name: 'bucket' } },
      { name: '--output-s3-key-prefix', description: 'S3 key prefix', args: { name: 'prefix' } },
      { name: '--max-concurrency', description: 'Max concurrency', args: { name: 'value' } },
      { name: '--max-errors', description: 'Max errors', args: { name: 'value' } },
      { name: '--service-role-arn', description: 'Service role ARN', args: { name: 'arn' } },
      { name: '--notification-config', description: 'Notification config', args: { name: 'config' } },
      { name: '--cloud-watch-output-config', description: 'CloudWatch output config', args: { name: 'config' } },
      { name: '--alarm-configuration', description: 'Alarm configuration', args: { name: 'config' } }
    ]
  },
  {
    name: 'list-commands',
    description: 'List commands',
    options: [
      { name: '--command-id', description: 'Command ID', args: { name: 'id', generators: commandIdGenerator } },
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } }
    ]
  },
  {
    name: 'list-command-invocations',
    description: 'List command invocations',
    options: [
      { name: '--command-id', description: 'Command ID', args: { name: 'id', generators: commandIdGenerator } },
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--details', description: 'Include command details' },
      { name: '--no-details', description: 'Exclude command details' }
    ]
  },
  {
    name: 'get-command-invocation',
    description: 'Get command invocation details',
    options: [
      { name: '--command-id', description: 'Command ID', args: { name: 'id', generators: commandIdGenerator }, required: true },
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator }, required: true },
      { name: '--plugin-name', description: 'Plugin name', args: { name: 'name' } }
    ]
  },
  {
    name: 'cancel-command',
    description: 'Cancel a running command',
    options: [
      { name: '--command-id', description: 'Command ID', args: { name: 'id', generators: commandIdGenerator }, required: true },
      { name: '--instance-ids', description: 'Instance IDs', args: { name: 'instances', generators: ec2InstanceGenerator, isVariadic: true } }
    ]
  },
  // Session Manager
  {
    name: 'start-session',
    description: 'Start a session with an instance',
    options: [
      { name: '--target', description: 'Instance ID', args: { name: 'target', generators: ec2InstanceGenerator }, required: true },
      { name: '--document-name', description: 'Session document', args: { name: 'document', generators: ssmDocumentGenerator } },
      { name: '--parameters', description: 'Session parameters', args: { name: 'parameters' } },
      { name: '--reason', description: 'Session reason', args: { name: 'reason' } }
    ]
  },
  {
    name: 'describe-sessions',
    description: 'List sessions',
    options: [
      { name: '--state', description: 'Session state', args: { name: 'state', suggestions: s('Active', 'History') }, required: true },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } }
    ]
  },
  {
    name: 'terminate-session',
    description: 'Terminate a session',
    options: [
      { name: '--session-id', description: 'Session ID', args: { name: 'id' }, required: true }
    ]
  },
  {
    name: 'resume-session',
    description: 'Resume a disconnected session',
    options: [
      { name: '--session-id', description: 'Session ID', args: { name: 'id' }, required: true }
    ]
  },
  // Documents
  {
    name: 'list-documents',
    description: 'List SSM documents',
    options: [
      { name: '--document-filter-list', description: 'Document filters', args: { name: 'filters' } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-document',
    description: 'Describe an SSM document',
    options: [
      { name: '--name', description: 'Document name', args: { name: 'name', generators: ssmDocumentGenerator }, required: true },
      { name: '--document-version', description: 'Document version', args: { name: 'version' } },
      { name: '--version-name', description: 'Version name', args: { name: 'name' } }
    ]
  },
  {
    name: 'get-document',
    description: 'Get an SSM document',
    options: [
      { name: '--name', description: 'Document name', args: { name: 'name', generators: ssmDocumentGenerator }, required: true },
      { name: '--version-name', description: 'Version name', args: { name: 'name' } },
      { name: '--document-version', description: 'Document version', args: { name: 'version' } },
      { name: '--document-format', description: 'Document format', args: { name: 'format', suggestions: s(...documentFormats) } }
    ]
  },
  {
    name: 'create-document',
    description: 'Create an SSM document',
    options: [
      { name: '--content', description: 'Document content', args: { name: 'content' }, required: true },
      { name: '--requires', description: 'Required documents', args: { name: 'requires' } },
      { name: '--attachments', description: 'Attachments', args: { name: 'attachments' } },
      { name: '--name', description: 'Document name', args: { name: 'name' }, required: true },
      { name: '--display-name', description: 'Display name', args: { name: 'name' } },
      { name: '--version-name', description: 'Version name', args: { name: 'name' } },
      { name: '--document-type', description: 'Document type', args: { name: 'type', suggestions: s(...documentTypes) } },
      { name: '--document-format', description: 'Document format', args: { name: 'format', suggestions: s(...documentFormats) } },
      { name: '--target-type', description: 'Target type', args: { name: 'type' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'update-document',
    description: 'Update an SSM document',
    options: [
      { name: '--content', description: 'Document content', args: { name: 'content' }, required: true },
      { name: '--attachments', description: 'Attachments', args: { name: 'attachments' } },
      { name: '--name', description: 'Document name', args: { name: 'name', generators: ssmDocumentGenerator }, required: true },
      { name: '--display-name', description: 'Display name', args: { name: 'name' } },
      { name: '--version-name', description: 'Version name', args: { name: 'name' } },
      { name: '--document-version', description: 'Document version', args: { name: 'version' } },
      { name: '--document-format', description: 'Document format', args: { name: 'format', suggestions: s(...documentFormats) } },
      { name: '--target-type', description: 'Target type', args: { name: 'type' } }
    ]
  },
  {
    name: 'delete-document',
    description: 'Delete an SSM document',
    options: [
      { name: '--name', description: 'Document name', args: { name: 'name', generators: ssmDocumentGenerator }, required: true },
      { name: '--document-version', description: 'Document version', args: { name: 'version' } },
      { name: '--version-name', description: 'Version name', args: { name: 'name' } },
      { name: '--force', description: 'Force deletion' },
      { name: '--no-force', description: 'Do not force deletion' }
    ]
  },
  {
    name: 'update-document-default-version',
    description: 'Update default document version',
    options: [
      { name: '--name', description: 'Document name', args: { name: 'name', generators: ssmDocumentGenerator }, required: true },
      { name: '--document-version', description: 'Document version', args: { name: 'version' }, required: true }
    ]
  },
  // State Manager
  {
    name: 'list-associations',
    description: 'List State Manager associations',
    options: [
      { name: '--association-filter-list', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-association',
    description: 'Describe an association',
    options: [
      { name: '--name', description: 'Document name', args: { name: 'name', generators: ssmDocumentGenerator } },
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator } },
      { name: '--association-id', description: 'Association ID', args: { name: 'id', generators: associationIdGenerator } },
      { name: '--association-version', description: 'Association version', args: { name: 'version' } }
    ]
  },
  {
    name: 'create-association',
    description: 'Create a State Manager association',
    options: [
      { name: '--name', description: 'Document name', args: { name: 'name', generators: ssmDocumentGenerator }, required: true },
      { name: '--document-version', description: 'Document version', args: { name: 'version' } },
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator } },
      { name: '--parameters', description: 'Parameters', args: { name: 'parameters' } },
      { name: '--targets', description: 'Targets', args: { name: 'targets' } },
      { name: '--schedule-expression', description: 'Schedule expression', args: { name: 'expression' } },
      { name: '--output-location', description: 'Output location', args: { name: 'location' } },
      { name: '--association-name', description: 'Association name', args: { name: 'name' } },
      { name: '--automation-target-parameter-name', description: 'Automation target parameter', args: { name: 'name' } },
      { name: '--max-errors', description: 'Max errors', args: { name: 'value' } },
      { name: '--max-concurrency', description: 'Max concurrency', args: { name: 'value' } },
      { name: '--compliance-severity', description: 'Compliance severity', args: { name: 'severity', suggestions: s('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNSPECIFIED') } },
      { name: '--sync-compliance', description: 'Sync compliance', args: { name: 'sync', suggestions: s('AUTO', 'MANUAL') } },
      { name: '--apply-only-at-cron-interval', description: 'Apply only at cron interval' },
      { name: '--no-apply-only-at-cron-interval', description: 'Apply immediately' },
      { name: '--calendar-names', description: 'Calendar names', args: { name: 'names', isVariadic: true } },
      { name: '--target-locations', description: 'Target locations', args: { name: 'locations' } },
      { name: '--schedule-offset', description: 'Schedule offset', args: { name: 'offset' } },
      { name: '--target-maps', description: 'Target maps', args: { name: 'maps' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--alarm-configuration', description: 'Alarm configuration', args: { name: 'config' } }
    ]
  },
  {
    name: 'update-association',
    description: 'Update a State Manager association',
    options: [
      { name: '--association-id', description: 'Association ID', args: { name: 'id', generators: associationIdGenerator }, required: true },
      { name: '--parameters', description: 'Parameters', args: { name: 'parameters' } },
      { name: '--document-version', description: 'Document version', args: { name: 'version' } },
      { name: '--schedule-expression', description: 'Schedule expression', args: { name: 'expression' } },
      { name: '--output-location', description: 'Output location', args: { name: 'location' } },
      { name: '--name', description: 'Document name', args: { name: 'name', generators: ssmDocumentGenerator } },
      { name: '--targets', description: 'Targets', args: { name: 'targets' } },
      { name: '--association-name', description: 'Association name', args: { name: 'name' } },
      { name: '--association-version', description: 'Association version', args: { name: 'version' } },
      { name: '--automation-target-parameter-name', description: 'Automation target parameter', args: { name: 'name' } },
      { name: '--max-errors', description: 'Max errors', args: { name: 'value' } },
      { name: '--max-concurrency', description: 'Max concurrency', args: { name: 'value' } },
      { name: '--compliance-severity', description: 'Compliance severity', args: { name: 'severity', suggestions: s('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNSPECIFIED') } },
      { name: '--sync-compliance', description: 'Sync compliance', args: { name: 'sync', suggestions: s('AUTO', 'MANUAL') } },
      { name: '--apply-only-at-cron-interval', description: 'Apply only at cron interval' },
      { name: '--no-apply-only-at-cron-interval', description: 'Apply immediately' },
      { name: '--calendar-names', description: 'Calendar names', args: { name: 'names', isVariadic: true } },
      { name: '--target-locations', description: 'Target locations', args: { name: 'locations' } },
      { name: '--schedule-offset', description: 'Schedule offset', args: { name: 'offset' } },
      { name: '--target-maps', description: 'Target maps', args: { name: 'maps' } },
      { name: '--alarm-configuration', description: 'Alarm configuration', args: { name: 'config' } }
    ]
  },
  {
    name: 'delete-association',
    description: 'Delete a State Manager association',
    options: [
      { name: '--name', description: 'Document name', args: { name: 'name', generators: ssmDocumentGenerator } },
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator } },
      { name: '--association-id', description: 'Association ID', args: { name: 'id', generators: associationIdGenerator } }
    ]
  },
  {
    name: 'start-associations-once',
    description: 'Run associations immediately',
    options: [
      { name: '--association-ids', description: 'Association IDs', args: { name: 'ids', generators: associationIdGenerator, isVariadic: true }, required: true }
    ]
  },
  // Automation
  {
    name: 'start-automation-execution',
    description: 'Start an automation execution',
    options: [
      { name: '--document-name', description: 'Automation document', args: { name: 'document', generators: ssmDocumentGenerator }, required: true },
      { name: '--document-version', description: 'Document version', args: { name: 'version' } },
      { name: '--parameters', description: 'Parameters', args: { name: 'parameters' } },
      { name: '--client-token', description: 'Client token', args: { name: 'token' } },
      { name: '--mode', description: 'Execution mode', args: { name: 'mode', suggestions: s('Auto', 'Interactive') } },
      { name: '--target-parameter-name', description: 'Target parameter name', args: { name: 'name' } },
      { name: '--targets', description: 'Targets', args: { name: 'targets' } },
      { name: '--target-maps', description: 'Target maps', args: { name: 'maps' } },
      { name: '--max-concurrency', description: 'Max concurrency', args: { name: 'value' } },
      { name: '--max-errors', description: 'Max errors', args: { name: 'value' } },
      { name: '--target-locations', description: 'Target locations', args: { name: 'locations' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--alarm-configuration', description: 'Alarm configuration', args: { name: 'config' } }
    ]
  },
  {
    name: 'describe-automation-executions',
    description: 'Describe automation executions',
    options: [
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-automation-execution',
    description: 'Get automation execution details',
    options: [
      { name: '--automation-execution-id', description: 'Automation execution ID', args: { name: 'id', generators: automationExecutionIdGenerator }, required: true }
    ]
  },
  {
    name: 'stop-automation-execution',
    description: 'Stop an automation execution',
    options: [
      { name: '--automation-execution-id', description: 'Automation execution ID', args: { name: 'id', generators: automationExecutionIdGenerator }, required: true },
      { name: '--type', description: 'Stop type', args: { name: 'type', suggestions: s('Complete', 'Cancel') } }
    ]
  },
  {
    name: 'describe-automation-step-executions',
    description: 'Describe automation step executions',
    options: [
      { name: '--automation-execution-id', description: 'Automation execution ID', args: { name: 'id', generators: automationExecutionIdGenerator }, required: true },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--reverse-order', description: 'Reverse order' },
      { name: '--no-reverse-order', description: 'Normal order' }
    ]
  },
  // Inventory
  {
    name: 'get-inventory',
    description: 'Get inventory data',
    options: [
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--aggregators', description: 'Aggregators', args: { name: 'aggregators' } },
      { name: '--result-attributes', description: 'Result attributes', args: { name: 'attributes' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'put-inventory',
    description: 'Put inventory data',
    options: [
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator }, required: true },
      { name: '--items', description: 'Inventory items', args: { name: 'items' }, required: true }
    ]
  },
  {
    name: 'get-inventory-schema',
    description: 'Get inventory schema',
    options: [
      { name: '--type-name', description: 'Type name', args: { name: 'type' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--aggregator', description: 'Include aggregator' },
      { name: '--no-aggregator', description: 'Exclude aggregator' },
      { name: '--sub-type', description: 'Include sub-types' },
      { name: '--no-sub-type', description: 'Exclude sub-types' }
    ]
  },
  // Patch Manager
  {
    name: 'describe-patch-baselines',
    description: 'Describe patch baselines',
    options: [
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-patch-baseline',
    description: 'Get patch baseline details',
    options: [
      { name: '--baseline-id', description: 'Baseline ID', args: { name: 'id', generators: patchBaselineGenerator }, required: true }
    ]
  },
  {
    name: 'create-patch-baseline',
    description: 'Create a patch baseline',
    options: [
      { name: '--operating-system', description: 'Operating system', args: { name: 'os', suggestions: s('WINDOWS', 'AMAZON_LINUX', 'AMAZON_LINUX_2', 'AMAZON_LINUX_2022', 'AMAZON_LINUX_2023', 'UBUNTU', 'REDHAT_ENTERPRISE_LINUX', 'SUSE', 'CENTOS', 'ORACLE_LINUX', 'DEBIAN', 'MACOS', 'RASPBIAN', 'ROCKY_LINUX', 'ALMA_LINUX') } },
      { name: '--name', description: 'Baseline name', args: { name: 'name' }, required: true },
      { name: '--global-filters', description: 'Global filters', args: { name: 'filters' } },
      { name: '--approval-rules', description: 'Approval rules', args: { name: 'rules' } },
      { name: '--approved-patches', description: 'Approved patches', args: { name: 'patches', isVariadic: true } },
      { name: '--approved-patches-compliance-level', description: 'Compliance level', args: { name: 'level', suggestions: s('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL', 'UNSPECIFIED') } },
      { name: '--approved-patches-enable-non-security', description: 'Enable non-security patches' },
      { name: '--no-approved-patches-enable-non-security', description: 'Disable non-security patches' },
      { name: '--rejected-patches', description: 'Rejected patches', args: { name: 'patches', isVariadic: true } },
      { name: '--rejected-patches-action', description: 'Rejected patches action', args: { name: 'action', suggestions: s('ALLOW_AS_DEPENDENCY', 'BLOCK') } },
      { name: '--description', description: 'Description', args: { name: 'description' } },
      { name: '--sources', description: 'Patch sources', args: { name: 'sources' } },
      { name: '--client-token', description: 'Client token', args: { name: 'token' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-patch-baseline',
    description: 'Delete a patch baseline',
    options: [
      { name: '--baseline-id', description: 'Baseline ID', args: { name: 'id', generators: patchBaselineGenerator }, required: true }
    ]
  },
  {
    name: 'describe-instance-patch-states',
    description: 'Describe instance patch states',
    options: [
      { name: '--instance-ids', description: 'Instance IDs', args: { name: 'instances', generators: ec2InstanceGenerator, isVariadic: true }, required: true },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'describe-instance-patches',
    description: 'Describe instance patches',
    options: [
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id', generators: ec2InstanceGenerator }, required: true },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  // OpsCenter
  {
    name: 'describe-ops-items',
    description: 'Describe OpsItems',
    options: [
      { name: '--ops-item-filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-ops-item',
    description: 'Get an OpsItem',
    options: [
      { name: '--ops-item-id', description: 'OpsItem ID', args: { name: 'id', generators: opsItemIdGenerator }, required: true },
      { name: '--ops-item-arn', description: 'OpsItem ARN', args: { name: 'arn' } }
    ]
  },
  {
    name: 'create-ops-item',
    description: 'Create an OpsItem',
    options: [
      { name: '--description', description: 'Description', args: { name: 'description' }, required: true },
      { name: '--ops-item-type', description: 'OpsItem type', args: { name: 'type' } },
      { name: '--operational-data', description: 'Operational data', args: { name: 'data' } },
      { name: '--notifications', description: 'Notifications', args: { name: 'notifications' } },
      { name: '--priority', description: 'Priority', args: { name: 'priority', suggestions: s('1', '2', '3', '4', '5') } },
      { name: '--related-ops-items', description: 'Related OpsItems', args: { name: 'items' } },
      { name: '--source', description: 'Source', args: { name: 'source' }, required: true },
      { name: '--title', description: 'Title', args: { name: 'title' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--category', description: 'Category', args: { name: 'category' } },
      { name: '--severity', description: 'Severity', args: { name: 'severity', suggestions: s('1', '2', '3', '4') } },
      { name: '--actual-start-time', description: 'Actual start time', args: { name: 'timestamp' } },
      { name: '--actual-end-time', description: 'Actual end time', args: { name: 'timestamp' } },
      { name: '--planned-start-time', description: 'Planned start time', args: { name: 'timestamp' } },
      { name: '--planned-end-time', description: 'Planned end time', args: { name: 'timestamp' } },
      { name: '--account-id', description: 'Account ID', args: { name: 'account' } }
    ]
  },
  {
    name: 'update-ops-item',
    description: 'Update an OpsItem',
    options: [
      { name: '--ops-item-id', description: 'OpsItem ID', args: { name: 'id', generators: opsItemIdGenerator }, required: true },
      { name: '--description', description: 'Description', args: { name: 'description' } },
      { name: '--operational-data', description: 'Operational data', args: { name: 'data' } },
      { name: '--operational-data-to-delete', description: 'Data keys to delete', args: { name: 'keys', isVariadic: true } },
      { name: '--notifications', description: 'Notifications', args: { name: 'notifications' } },
      { name: '--priority', description: 'Priority', args: { name: 'priority', suggestions: s('1', '2', '3', '4', '5') } },
      { name: '--related-ops-items', description: 'Related OpsItems', args: { name: 'items' } },
      { name: '--status', description: 'Status', args: { name: 'status', suggestions: s('Open', 'InProgress', 'Resolved', 'Pending', 'TimedOut', 'Cancelling', 'Cancelled', 'Failed', 'CompletedWithSuccess', 'CompletedWithFailure', 'Scheduled', 'RunbookInProgress', 'PendingChangeCalendarOverride', 'ChangeCalendarOverrideApproved', 'ChangeCalendarOverrideRejected', 'PendingApproval', 'Approved', 'Rejected', 'Closed') } },
      { name: '--title', description: 'Title', args: { name: 'title' } },
      { name: '--category', description: 'Category', args: { name: 'category' } },
      { name: '--severity', description: 'Severity', args: { name: 'severity', suggestions: s('1', '2', '3', '4') } },
      { name: '--actual-start-time', description: 'Actual start time', args: { name: 'timestamp' } },
      { name: '--actual-end-time', description: 'Actual end time', args: { name: 'timestamp' } },
      { name: '--planned-start-time', description: 'Planned start time', args: { name: 'timestamp' } },
      { name: '--planned-end-time', description: 'Planned end time', args: { name: 'timestamp' } },
      { name: '--ops-item-arn', description: 'OpsItem ARN', args: { name: 'arn' } }
    ]
  },
  // Managed instances
  {
    name: 'describe-instance-information',
    description: 'Describe managed instances',
    options: [
      { name: '--instance-information-filter-list', description: 'Filters', args: { name: 'filters' } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'deregister-managed-instance',
    description: 'Deregister a managed instance',
    options: [
      { name: '--instance-id', description: 'Instance ID', args: { name: 'id' }, required: true }
    ]
  },
  // Maintenance Windows
  {
    name: 'describe-maintenance-windows',
    description: 'Describe maintenance windows',
    options: [
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-maintenance-window',
    description: 'Get maintenance window details',
    options: [
      { name: '--window-id', description: 'Window ID', args: { name: 'id', generators: maintenanceWindowGenerator }, required: true }
    ]
  },
  {
    name: 'create-maintenance-window',
    description: 'Create a maintenance window',
    options: [
      { name: '--name', description: 'Window name', args: { name: 'name' }, required: true },
      { name: '--description', description: 'Description', args: { name: 'description' } },
      { name: '--start-date', description: 'Start date', args: { name: 'date' } },
      { name: '--end-date', description: 'End date', args: { name: 'date' } },
      { name: '--schedule', description: 'Schedule (cron/rate)', args: { name: 'schedule' }, required: true },
      { name: '--schedule-timezone', description: 'Schedule timezone', args: { name: 'timezone' } },
      { name: '--schedule-offset', description: 'Schedule offset', args: { name: 'days' } },
      { name: '--duration', description: 'Duration (hours)', args: { name: 'hours' }, required: true },
      { name: '--cutoff', description: 'Cutoff (hours)', args: { name: 'hours' }, required: true },
      { name: '--allow-unassociated-targets', description: 'Allow unassociated targets' },
      { name: '--no-allow-unassociated-targets', description: 'Require associated targets' },
      { name: '--client-token', description: 'Client token', args: { name: 'token' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-maintenance-window',
    description: 'Delete a maintenance window',
    options: [
      { name: '--window-id', description: 'Window ID', args: { name: 'id', generators: maintenanceWindowGenerator }, required: true }
    ]
  },
  // Tags
  {
    name: 'add-tags-to-resource',
    description: 'Add tags to a resource',
    options: [
      { name: '--resource-type', description: 'Resource type', args: { name: 'type', suggestions: s('Document', 'ManagedInstance', 'MaintenanceWindow', 'Parameter', 'PatchBaseline', 'OpsItem', 'OpsMetadata', 'Automation', 'Association') }, required: true },
      { name: '--resource-id', description: 'Resource ID', args: { name: 'id' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' }, required: true }
    ]
  },
  {
    name: 'remove-tags-from-resource',
    description: 'Remove tags from a resource',
    options: [
      { name: '--resource-type', description: 'Resource type', args: { name: 'type', suggestions: s('Document', 'ManagedInstance', 'MaintenanceWindow', 'Parameter', 'PatchBaseline', 'OpsItem', 'OpsMetadata', 'Automation', 'Association') }, required: true },
      { name: '--resource-id', description: 'Resource ID', args: { name: 'id' }, required: true },
      { name: '--tag-keys', description: 'Tag keys', args: { name: 'keys', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'list-tags-for-resource',
    description: 'List tags for a resource',
    options: [
      { name: '--resource-type', description: 'Resource type', args: { name: 'type', suggestions: s('Document', 'ManagedInstance', 'MaintenanceWindow', 'Parameter', 'PatchBaseline', 'OpsItem', 'OpsMetadata', 'Automation', 'Association') }, required: true },
      { name: '--resource-id', description: 'Resource ID', args: { name: 'id' }, required: true }
    ]
  }
];
