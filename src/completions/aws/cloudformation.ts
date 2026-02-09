// AWS CloudFormation CLI completions
import { Subcommand } from '../../types.js';
import { s, cfnStackGenerator, iamRoleGenerator, awsRegions } from './_shared.js';

// Stack Set generator
const stackSetGenerator = {
  script: 'aws cloudformation list-stack-sets --query "Summaries[?Status==\'ACTIVE\'].[StackSetName]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(name => ({
      name: name.trim(),
      description: 'CloudFormation Stack Set',
      icon: '📚',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Change Set generator
const changeSetGenerator = {
  script: 'aws cloudformation list-stacks --query "StackSummaries[?StackStatus!=\'DELETE_COMPLETE\'].StackName" --output text 2>/dev/null | head -1 | xargs -I{} aws cloudformation list-change-sets --stack-name {} --query "Summaries[].ChangeSetName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(c => c.trim()).map(name => ({
      name: name.trim(),
      description: 'Change Set',
      icon: '📝',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

const stackStatuses = [
  'CREATE_IN_PROGRESS', 'CREATE_FAILED', 'CREATE_COMPLETE',
  'ROLLBACK_IN_PROGRESS', 'ROLLBACK_FAILED', 'ROLLBACK_COMPLETE',
  'DELETE_IN_PROGRESS', 'DELETE_FAILED', 'DELETE_COMPLETE',
  'UPDATE_IN_PROGRESS', 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS', 'UPDATE_COMPLETE',
  'UPDATE_FAILED', 'UPDATE_ROLLBACK_IN_PROGRESS', 'UPDATE_ROLLBACK_FAILED',
  'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS', 'UPDATE_ROLLBACK_COMPLETE',
  'REVIEW_IN_PROGRESS', 'IMPORT_IN_PROGRESS', 'IMPORT_COMPLETE',
  'IMPORT_ROLLBACK_IN_PROGRESS', 'IMPORT_ROLLBACK_FAILED', 'IMPORT_ROLLBACK_COMPLETE'
];

const capabilities = ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_AUTO_EXPAND'];
const onFailure = ['DO_NOTHING', 'ROLLBACK', 'DELETE'];
const changeSetTypes = ['CREATE', 'UPDATE', 'IMPORT'];
const deletionModes = ['STANDARD', 'FORCE_DELETE_STACK'];

export const cloudformationSubcommands: Subcommand[] = [
  // Stack operations
  {
    name: 'list-stacks',
    description: 'List CloudFormation stacks',
    options: [
      { name: '--stack-status-filter', description: 'Filter by status', args: { name: 'status', suggestions: s(...stackStatuses), isVariadic: true } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-stacks',
    description: 'Describe stacks',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-stack',
    description: 'Create a CloudFormation stack',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name' }, required: true },
      { name: '--template-body', description: 'Template body', args: { name: 'body' } },
      { name: '--template-url', description: 'Template URL', args: { name: 'url' } },
      { name: '--parameters', description: 'Stack parameters', args: { name: 'params' } },
      { name: '--disable-rollback', description: 'Disable rollback on failure' },
      { name: '--no-disable-rollback', description: 'Enable rollback' },
      { name: '--rollback-configuration', description: 'Rollback configuration', args: { name: 'config' } },
      { name: '--timeout-in-minutes', description: 'Timeout in minutes', args: { name: 'minutes', suggestions: s('5', '10', '15', '30', '60', '120') } },
      { name: '--notification-arns', description: 'SNS notification ARNs', args: { name: 'arns', isVariadic: true } },
      { name: '--capabilities', description: 'Stack capabilities', args: { name: 'caps', suggestions: s(...capabilities), isVariadic: true } },
      { name: '--resource-types', description: 'Resource types', args: { name: 'types', isVariadic: true } },
      { name: '--role-arn', description: 'IAM role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--on-failure', description: 'On failure action', args: { name: 'action', suggestions: s(...onFailure) } },
      { name: '--stack-policy-body', description: 'Stack policy body', args: { name: 'policy' } },
      { name: '--stack-policy-url', description: 'Stack policy URL', args: { name: 'url' } },
      { name: '--tags', description: 'Stack tags', args: { name: 'tags' } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--enable-termination-protection', description: 'Enable termination protection' },
      { name: '--no-enable-termination-protection', description: 'Disable termination protection' },
      { name: '--retain-except-on-create', description: 'Retain resources on failed create' },
      { name: '--no-retain-except-on-create', description: 'Do not retain on failed create' }
    ]
  },
  {
    name: 'update-stack',
    description: 'Update a CloudFormation stack',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--template-body', description: 'Template body', args: { name: 'body' } },
      { name: '--template-url', description: 'Template URL', args: { name: 'url' } },
      { name: '--use-previous-template', description: 'Use previous template' },
      { name: '--no-use-previous-template', description: 'Do not use previous template' },
      { name: '--stack-policy-during-update-body', description: 'Temporary stack policy body', args: { name: 'policy' } },
      { name: '--stack-policy-during-update-url', description: 'Temporary stack policy URL', args: { name: 'url' } },
      { name: '--parameters', description: 'Stack parameters', args: { name: 'params' } },
      { name: '--capabilities', description: 'Stack capabilities', args: { name: 'caps', suggestions: s(...capabilities), isVariadic: true } },
      { name: '--resource-types', description: 'Resource types', args: { name: 'types', isVariadic: true } },
      { name: '--role-arn', description: 'IAM role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--rollback-configuration', description: 'Rollback configuration', args: { name: 'config' } },
      { name: '--stack-policy-body', description: 'Stack policy body', args: { name: 'policy' } },
      { name: '--stack-policy-url', description: 'Stack policy URL', args: { name: 'url' } },
      { name: '--notification-arns', description: 'SNS notification ARNs', args: { name: 'arns', isVariadic: true } },
      { name: '--tags', description: 'Stack tags', args: { name: 'tags' } },
      { name: '--disable-rollback', description: 'Disable rollback on failure' },
      { name: '--no-disable-rollback', description: 'Enable rollback' },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--retain-except-on-create', description: 'Retain resources on failed create' },
      { name: '--no-retain-except-on-create', description: 'Do not retain on failed create' }
    ]
  },
  {
    name: 'delete-stack',
    description: 'Delete a CloudFormation stack',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--retain-resources', description: 'Resources to retain', args: { name: 'resources', isVariadic: true } },
      { name: '--role-arn', description: 'IAM role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--deletion-mode', description: 'Deletion mode', args: { name: 'mode', suggestions: s(...deletionModes) } }
    ]
  },
  {
    name: 'describe-stack-events',
    description: 'Describe stack events',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-stack-resources',
    description: 'Describe stack resources',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator } },
      { name: '--logical-resource-id', description: 'Logical resource ID', args: { name: 'id' } },
      { name: '--physical-resource-id', description: 'Physical resource ID', args: { name: 'id' } }
    ]
  },
  {
    name: 'describe-stack-resource',
    description: 'Describe a stack resource',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--logical-resource-id', description: 'Logical resource ID', args: { name: 'id' }, required: true }
    ]
  },
  {
    name: 'list-stack-resources',
    description: 'List stack resources',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-template',
    description: 'Get stack template',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator } },
      { name: '--change-set-name', description: 'Change set name', args: { name: 'name', generators: changeSetGenerator } },
      { name: '--template-stage', description: 'Template stage', args: { name: 'stage', suggestions: s('Original', 'Processed') } }
    ]
  },
  {
    name: 'get-template-summary',
    description: 'Get template summary',
    options: [
      { name: '--template-body', description: 'Template body', args: { name: 'body' } },
      { name: '--template-url', description: 'Template URL', args: { name: 'url' } },
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator } },
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator } },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } },
      { name: '--template-summary-config', description: 'Template summary config', args: { name: 'config' } }
    ]
  },
  {
    name: 'validate-template',
    description: 'Validate a CloudFormation template',
    options: [
      { name: '--template-body', description: 'Template body', args: { name: 'body' } },
      { name: '--template-url', description: 'Template URL', args: { name: 'url' } }
    ]
  },
  {
    name: 'estimate-template-cost',
    description: 'Estimate template cost',
    options: [
      { name: '--template-body', description: 'Template body', args: { name: 'body' } },
      { name: '--template-url', description: 'Template URL', args: { name: 'url' } },
      { name: '--parameters', description: 'Stack parameters', args: { name: 'params' } }
    ]
  },
  // Change Set operations
  {
    name: 'list-change-sets',
    description: 'List change sets for a stack',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-change-set',
    description: 'Describe a change set',
    options: [
      { name: '--change-set-name', description: 'Change set name', args: { name: 'name', generators: changeSetGenerator }, required: true },
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--include-property-values', description: 'Include property values' },
      { name: '--no-include-property-values', description: 'Do not include property values' }
    ]
  },
  {
    name: 'create-change-set',
    description: 'Create a change set',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--change-set-name', description: 'Change set name', args: { name: 'name' }, required: true },
      { name: '--template-body', description: 'Template body', args: { name: 'body' } },
      { name: '--template-url', description: 'Template URL', args: { name: 'url' } },
      { name: '--use-previous-template', description: 'Use previous template' },
      { name: '--no-use-previous-template', description: 'Do not use previous template' },
      { name: '--parameters', description: 'Stack parameters', args: { name: 'params' } },
      { name: '--capabilities', description: 'Stack capabilities', args: { name: 'caps', suggestions: s(...capabilities), isVariadic: true } },
      { name: '--resource-types', description: 'Resource types', args: { name: 'types', isVariadic: true } },
      { name: '--role-arn', description: 'IAM role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--rollback-configuration', description: 'Rollback configuration', args: { name: 'config' } },
      { name: '--notification-arns', description: 'SNS notification ARNs', args: { name: 'arns', isVariadic: true } },
      { name: '--tags', description: 'Stack tags', args: { name: 'tags' } },
      { name: '--client-token', description: 'Client token', args: { name: 'token' } },
      { name: '--description', description: 'Change set description', args: { name: 'desc' } },
      { name: '--change-set-type', description: 'Change set type', args: { name: 'type', suggestions: s(...changeSetTypes) } },
      { name: '--resources-to-import', description: 'Resources to import', args: { name: 'resources' } },
      { name: '--include-nested-stacks', description: 'Include nested stacks' },
      { name: '--no-include-nested-stacks', description: 'Do not include nested stacks' },
      { name: '--on-stack-failure', description: 'On stack failure action', args: { name: 'action', suggestions: s(...onFailure) } },
      { name: '--import-existing-resources', description: 'Import existing resources' },
      { name: '--no-import-existing-resources', description: 'Do not import existing resources' }
    ]
  },
  {
    name: 'execute-change-set',
    description: 'Execute a change set',
    options: [
      { name: '--change-set-name', description: 'Change set name', args: { name: 'name', generators: changeSetGenerator }, required: true },
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--disable-rollback', description: 'Disable rollback' },
      { name: '--no-disable-rollback', description: 'Enable rollback' },
      { name: '--retain-except-on-create', description: 'Retain resources on failed create' },
      { name: '--no-retain-except-on-create', description: 'Do not retain on failed create' }
    ]
  },
  {
    name: 'delete-change-set',
    description: 'Delete a change set',
    options: [
      { name: '--change-set-name', description: 'Change set name', args: { name: 'name', generators: changeSetGenerator }, required: true },
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator } }
    ]
  },
  // Stack Set operations
  {
    name: 'list-stack-sets',
    description: 'List stack sets',
    options: [
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--status', description: 'Filter by status', args: { name: 'status', suggestions: s('ACTIVE', 'DELETED') } },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } }
    ]
  },
  {
    name: 'describe-stack-set',
    description: 'Describe a stack set',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator }, required: true },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } }
    ]
  },
  {
    name: 'create-stack-set',
    description: 'Create a stack set',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name' }, required: true },
      { name: '--description', description: 'Stack set description', args: { name: 'desc' } },
      { name: '--template-body', description: 'Template body', args: { name: 'body' } },
      { name: '--template-url', description: 'Template URL', args: { name: 'url' } },
      { name: '--stack-id', description: 'Stack ID to import', args: { name: 'id' } },
      { name: '--parameters', description: 'Stack parameters', args: { name: 'params' } },
      { name: '--capabilities', description: 'Stack capabilities', args: { name: 'caps', suggestions: s(...capabilities), isVariadic: true } },
      { name: '--tags', description: 'Stack set tags', args: { name: 'tags' } },
      { name: '--administration-role-arn', description: 'Administration role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--execution-role-name', description: 'Execution role name', args: { name: 'name' } },
      { name: '--permission-model', description: 'Permission model', args: { name: 'model', suggestions: s('SERVICE_MANAGED', 'SELF_MANAGED') } },
      { name: '--auto-deployment', description: 'Auto deployment settings', args: { name: 'settings' } },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--managed-execution', description: 'Managed execution', args: { name: 'config' } }
    ]
  },
  {
    name: 'update-stack-set',
    description: 'Update a stack set',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator }, required: true },
      { name: '--description', description: 'Stack set description', args: { name: 'desc' } },
      { name: '--template-body', description: 'Template body', args: { name: 'body' } },
      { name: '--template-url', description: 'Template URL', args: { name: 'url' } },
      { name: '--use-previous-template', description: 'Use previous template' },
      { name: '--no-use-previous-template', description: 'Do not use previous template' },
      { name: '--parameters', description: 'Stack parameters', args: { name: 'params' } },
      { name: '--capabilities', description: 'Stack capabilities', args: { name: 'caps', suggestions: s(...capabilities), isVariadic: true } },
      { name: '--tags', description: 'Stack set tags', args: { name: 'tags' } },
      { name: '--operation-preferences', description: 'Operation preferences', args: { name: 'prefs' } },
      { name: '--administration-role-arn', description: 'Administration role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--execution-role-name', description: 'Execution role name', args: { name: 'name' } },
      { name: '--deployment-targets', description: 'Deployment targets', args: { name: 'targets' } },
      { name: '--permission-model', description: 'Permission model', args: { name: 'model', suggestions: s('SERVICE_MANAGED', 'SELF_MANAGED') } },
      { name: '--auto-deployment', description: 'Auto deployment settings', args: { name: 'settings' } },
      { name: '--operation-id', description: 'Operation ID', args: { name: 'id' } },
      { name: '--accounts', description: 'Accounts', args: { name: 'accounts', isVariadic: true } },
      { name: '--regions', description: 'Regions', args: { name: 'regions', suggestions: s(...awsRegions), isVariadic: true } },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } },
      { name: '--managed-execution', description: 'Managed execution', args: { name: 'config' } }
    ]
  },
  {
    name: 'delete-stack-set',
    description: 'Delete a stack set',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator }, required: true },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } }
    ]
  },
  // Stack instances
  {
    name: 'list-stack-instances',
    description: 'List stack instances',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator }, required: true },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--stack-instance-account', description: 'Account filter', args: { name: 'account' } },
      { name: '--stack-instance-region', description: 'Region filter', args: { name: 'region', suggestions: s(...awsRegions) } },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } }
    ]
  },
  {
    name: 'describe-stack-instance',
    description: 'Describe a stack instance',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator }, required: true },
      { name: '--stack-instance-account', description: 'Account', args: { name: 'account' }, required: true },
      { name: '--stack-instance-region', description: 'Region', args: { name: 'region', suggestions: s(...awsRegions) }, required: true },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } }
    ]
  },
  {
    name: 'create-stack-instances',
    description: 'Create stack instances',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator }, required: true },
      { name: '--accounts', description: 'Accounts', args: { name: 'accounts', isVariadic: true } },
      { name: '--deployment-targets', description: 'Deployment targets', args: { name: 'targets' } },
      { name: '--regions', description: 'Regions', args: { name: 'regions', suggestions: s(...awsRegions), isVariadic: true }, required: true },
      { name: '--parameter-overrides', description: 'Parameter overrides', args: { name: 'params' } },
      { name: '--operation-preferences', description: 'Operation preferences', args: { name: 'prefs' } },
      { name: '--operation-id', description: 'Operation ID', args: { name: 'id' } },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } }
    ]
  },
  {
    name: 'update-stack-instances',
    description: 'Update stack instances',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator }, required: true },
      { name: '--accounts', description: 'Accounts', args: { name: 'accounts', isVariadic: true } },
      { name: '--deployment-targets', description: 'Deployment targets', args: { name: 'targets' } },
      { name: '--regions', description: 'Regions', args: { name: 'regions', suggestions: s(...awsRegions), isVariadic: true }, required: true },
      { name: '--parameter-overrides', description: 'Parameter overrides', args: { name: 'params' } },
      { name: '--operation-preferences', description: 'Operation preferences', args: { name: 'prefs' } },
      { name: '--operation-id', description: 'Operation ID', args: { name: 'id' } },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } }
    ]
  },
  {
    name: 'delete-stack-instances',
    description: 'Delete stack instances',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator }, required: true },
      { name: '--accounts', description: 'Accounts', args: { name: 'accounts', isVariadic: true } },
      { name: '--deployment-targets', description: 'Deployment targets', args: { name: 'targets' } },
      { name: '--regions', description: 'Regions', args: { name: 'regions', suggestions: s(...awsRegions), isVariadic: true }, required: true },
      { name: '--operation-preferences', description: 'Operation preferences', args: { name: 'prefs' } },
      { name: '--retain-stacks', description: 'Retain stacks' },
      { name: '--no-retain-stacks', description: 'Delete stacks' },
      { name: '--operation-id', description: 'Operation ID', args: { name: 'id' } },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } }
    ]
  },
  // Drift detection
  {
    name: 'detect-stack-drift',
    description: 'Detect drift for a stack',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--logical-resource-ids', description: 'Logical resource IDs', args: { name: 'ids', isVariadic: true } }
    ]
  },
  {
    name: 'describe-stack-drift-detection-status',
    description: 'Describe drift detection status',
    options: [
      { name: '--stack-drift-detection-id', description: 'Drift detection ID', args: { name: 'id' }, required: true }
    ]
  },
  {
    name: 'describe-stack-resource-drifts',
    description: 'Describe resource drifts',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--stack-resource-drift-status-filters', description: 'Status filters', args: { name: 'filters', suggestions: s('IN_SYNC', 'MODIFIED', 'DELETED', 'NOT_CHECKED'), isVariadic: true } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'detect-stack-resource-drift',
    description: 'Detect drift for a resource',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--logical-resource-id', description: 'Logical resource ID', args: { name: 'id' }, required: true }
    ]
  },
  {
    name: 'detect-stack-set-drift',
    description: 'Detect drift for a stack set',
    options: [
      { name: '--stack-set-name', description: 'Stack set name', args: { name: 'name', generators: stackSetGenerator }, required: true },
      { name: '--operation-preferences', description: 'Operation preferences', args: { name: 'prefs' } },
      { name: '--operation-id', description: 'Operation ID', args: { name: 'id' } },
      { name: '--call-as', description: 'Call as', args: { name: 'type', suggestions: s('SELF', 'DELEGATED_ADMIN') } }
    ]
  },
  // Stack policy
  {
    name: 'get-stack-policy',
    description: 'Get stack policy',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true }
    ]
  },
  {
    name: 'set-stack-policy',
    description: 'Set stack policy',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--stack-policy-body', description: 'Stack policy body', args: { name: 'policy' } },
      { name: '--stack-policy-url', description: 'Stack policy URL', args: { name: 'url' } }
    ]
  },
  // Termination protection
  {
    name: 'update-termination-protection',
    description: 'Update termination protection',
    options: [
      { name: '--enable-termination-protection', description: 'Enable termination protection' },
      { name: '--no-enable-termination-protection', description: 'Disable termination protection' },
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true }
    ]
  },
  // Continue update rollback
  {
    name: 'continue-update-rollback',
    description: 'Continue update rollback',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--role-arn', description: 'IAM role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--resources-to-skip', description: 'Resources to skip', args: { name: 'resources', isVariadic: true } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } }
    ]
  },
  // Cancel update
  {
    name: 'cancel-update-stack',
    description: 'Cancel stack update',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } }
    ]
  },
  // Signal resource
  {
    name: 'signal-resource',
    description: 'Signal a resource',
    options: [
      { name: '--stack-name', description: 'Stack name', args: { name: 'name', generators: cfnStackGenerator }, required: true },
      { name: '--logical-resource-id', description: 'Logical resource ID', args: { name: 'id' }, required: true },
      { name: '--unique-id', description: 'Unique ID', args: { name: 'id' }, required: true },
      { name: '--status', description: 'Status', args: { name: 'status', suggestions: s('SUCCESS', 'FAILURE') }, required: true }
    ]
  },
  // Exports
  {
    name: 'list-exports',
    description: 'List exports',
    options: [
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'list-imports',
    description: 'List imports for an export',
    options: [
      { name: '--export-name', description: 'Export name', args: { name: 'name' }, required: true },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  // Types
  {
    name: 'list-types',
    description: 'List CloudFormation types',
    options: [
      { name: '--visibility', description: 'Visibility', args: { name: 'visibility', suggestions: s('PUBLIC', 'PRIVATE') } },
      { name: '--provisioning-type', description: 'Provisioning type', args: { name: 'type', suggestions: s('NON_PROVISIONABLE', 'IMMUTABLE', 'FULLY_MUTABLE') } },
      { name: '--deprecated-status', description: 'Deprecated status', args: { name: 'status', suggestions: s('LIVE', 'DEPRECATED') } },
      { name: '--type', description: 'Type category', args: { name: 'type', suggestions: s('RESOURCE', 'MODULE', 'HOOK') } },
      { name: '--filters', description: 'Filters', args: { name: 'filters' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-type',
    description: 'Describe a CloudFormation type',
    options: [
      { name: '--type', description: 'Type category', args: { name: 'type', suggestions: s('RESOURCE', 'MODULE', 'HOOK') } },
      { name: '--type-name', description: 'Type name', args: { name: 'name' } },
      { name: '--arn', description: 'Type ARN', args: { name: 'arn' } },
      { name: '--version-id', description: 'Version ID', args: { name: 'id' } },
      { name: '--publisher-id', description: 'Publisher ID', args: { name: 'id' } },
      { name: '--public-version-number', description: 'Public version number', args: { name: 'version' } }
    ]
  },
  // Package and deploy (high-level commands)
  {
    name: 'package',
    description: 'Package local artifacts',
    options: [
      { name: '--template-file', description: 'Template file', args: { name: 'file', template: 'filepaths' }, required: true },
      { name: '--s3-bucket', description: 'S3 bucket', args: { name: 'bucket' }, required: true },
      { name: '--s3-prefix', description: 'S3 prefix', args: { name: 'prefix' } },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key-id' } },
      { name: '--output-template-file', description: 'Output template file', args: { name: 'file', template: 'filepaths' } },
      { name: '--use-json', description: 'Use JSON format' },
      { name: '--force-upload', description: 'Force upload' },
      { name: '--metadata', description: 'Metadata', args: { name: 'metadata' } }
    ]
  },
  {
    name: 'deploy',
    description: 'Deploy a CloudFormation stack',
    options: [
      { name: '--template-file', description: 'Template file', args: { name: 'file', template: 'filepaths' }, required: true },
      { name: '--stack-name', description: 'Stack name', args: { name: 'name' }, required: true },
      { name: '--s3-bucket', description: 'S3 bucket', args: { name: 'bucket' } },
      { name: '--s3-prefix', description: 'S3 prefix', args: { name: 'prefix' } },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key-id' } },
      { name: '--parameter-overrides', description: 'Parameter overrides', args: { name: 'params', isVariadic: true } },
      { name: '--capabilities', description: 'Stack capabilities', args: { name: 'caps', suggestions: s(...capabilities), isVariadic: true } },
      { name: '--no-execute-changeset', description: 'Do not execute change set' },
      { name: '--disable-rollback', description: 'Disable rollback' },
      { name: '--no-disable-rollback', description: 'Enable rollback' },
      { name: '--role-arn', description: 'IAM role ARN', args: { name: 'arn', generators: iamRoleGenerator } },
      { name: '--notification-arns', description: 'SNS notification ARNs', args: { name: 'arns', isVariadic: true } },
      { name: '--fail-on-empty-changeset', description: 'Fail on empty change set' },
      { name: '--no-fail-on-empty-changeset', description: 'Do not fail on empty change set' },
      { name: '--tags', description: 'Stack tags', args: { name: 'tags', isVariadic: true } }
    ]
  }
];
