// AWS DynamoDB CLI completions
import { Subcommand } from '../../types.js';
import { s, dynamodbTableGenerator } from './_shared.js';

// Global secondary index generator (placeholder - would need table context)
const billingModes = ['PROVISIONED', 'PAY_PER_REQUEST'];
const tableClasses = ['STANDARD', 'STANDARD_INFREQUENT_ACCESS'];
const streamViewTypes = ['KEYS_ONLY', 'NEW_IMAGE', 'OLD_IMAGE', 'NEW_AND_OLD_IMAGES'];
const keyTypes = ['HASH', 'RANGE'];
const attributeTypes = ['S', 'N', 'B'];
const projectionTypes = ['ALL', 'KEYS_ONLY', 'INCLUDE'];
const returnValues = ['NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', 'UPDATED_NEW'];
const returnConsumedCapacity = ['INDEXES', 'TOTAL', 'NONE'];
const returnItemCollectionMetrics = ['SIZE', 'NONE'];
const conditionalOperators = ['AND', 'OR'];
const selectValues = ['ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', 'COUNT'];

// Backup generator
const backupGenerator = {
  script: 'aws dynamodb list-backups --query "BackupSummaries[*].[BackupName,BackupArn]" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[1] || parts[0],
        description: parts[0] || 'DynamoDB Backup',
        icon: '💾',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Global table generator
const globalTableGenerator = {
  script: 'aws dynamodb list-global-tables --query "GlobalTables[*].GlobalTableName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(t => t.trim()).map(table => ({
      name: table.trim(),
      description: 'Global Table',
      icon: '🌍',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const dynamodbSubcommands: Subcommand[] = [
  // Table operations
  {
    name: 'list-tables',
    description: 'List DynamoDB tables',
    options: [
      { name: '--exclusive-start-table-name', description: 'Start table name', args: { name: 'name', generators: dynamodbTableGenerator } },
      { name: '--limit', description: 'Maximum tables to return', args: { name: 'limit', suggestions: s('10', '25', '50', '100') } }
    ]
  },
  {
    name: 'describe-table',
    description: 'Describe a DynamoDB table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true }
    ]
  },
  {
    name: 'create-table',
    description: 'Create a DynamoDB table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name' }, required: true },
      { name: '--attribute-definitions', description: 'Attribute definitions', args: { name: 'attrs' }, required: true },
      { name: '--key-schema', description: 'Key schema', args: { name: 'schema' }, required: true },
      { name: '--local-secondary-indexes', description: 'Local secondary indexes', args: { name: 'indexes' } },
      { name: '--global-secondary-indexes', description: 'Global secondary indexes', args: { name: 'indexes' } },
      { name: '--billing-mode', description: 'Billing mode', args: { name: 'mode', suggestions: s(...billingModes) } },
      { name: '--provisioned-throughput', description: 'Provisioned throughput', args: { name: 'throughput' } },
      { name: '--stream-specification', description: 'Stream specification', args: { name: 'spec' } },
      { name: '--sse-specification', description: 'SSE specification', args: { name: 'spec' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--table-class', description: 'Table class', args: { name: 'class', suggestions: s(...tableClasses) } },
      { name: '--deletion-protection-enabled', description: 'Enable deletion protection' },
      { name: '--no-deletion-protection-enabled', description: 'Disable deletion protection' },
      { name: '--resource-policy', description: 'Resource policy', args: { name: 'policy' } },
      { name: '--on-demand-throughput', description: 'On-demand throughput', args: { name: 'throughput' } }
    ]
  },
  {
    name: 'delete-table',
    description: 'Delete a DynamoDB table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true }
    ]
  },
  {
    name: 'update-table',
    description: 'Update a DynamoDB table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--attribute-definitions', description: 'Attribute definitions', args: { name: 'attrs' } },
      { name: '--billing-mode', description: 'Billing mode', args: { name: 'mode', suggestions: s(...billingModes) } },
      { name: '--provisioned-throughput', description: 'Provisioned throughput', args: { name: 'throughput' } },
      { name: '--global-secondary-index-updates', description: 'GSI updates', args: { name: 'updates' } },
      { name: '--stream-specification', description: 'Stream specification', args: { name: 'spec' } },
      { name: '--sse-specification', description: 'SSE specification', args: { name: 'spec' } },
      { name: '--replica-updates', description: 'Replica updates', args: { name: 'updates' } },
      { name: '--table-class', description: 'Table class', args: { name: 'class', suggestions: s(...tableClasses) } },
      { name: '--deletion-protection-enabled', description: 'Enable deletion protection' },
      { name: '--no-deletion-protection-enabled', description: 'Disable deletion protection' },
      { name: '--on-demand-throughput', description: 'On-demand throughput', args: { name: 'throughput' } }
    ]
  },
  {
    name: 'describe-table-replica-auto-scaling',
    description: 'Describe table replica auto scaling',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true }
    ]
  },
  {
    name: 'update-table-replica-auto-scaling',
    description: 'Update table replica auto scaling',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--global-secondary-index-updates', description: 'GSI updates', args: { name: 'updates' } },
      { name: '--provisioned-write-capacity-auto-scaling-update', description: 'Write capacity update', args: { name: 'update' } },
      { name: '--replica-updates', description: 'Replica updates', args: { name: 'updates' } }
    ]
  },
  // Item operations
  {
    name: 'get-item',
    description: 'Get an item from a table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--key', description: 'Item key', args: { name: 'key' }, required: true },
      { name: '--attributes-to-get', description: 'Attributes to get', args: { name: 'attrs', isVariadic: true } },
      { name: '--consistent-read', description: 'Use consistent read' },
      { name: '--no-consistent-read', description: 'Use eventually consistent read' },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } },
      { name: '--projection-expression', description: 'Projection expression', args: { name: 'expr' } },
      { name: '--expression-attribute-names', description: 'Expression attribute names', args: { name: 'names' } }
    ]
  },
  {
    name: 'put-item',
    description: 'Put an item into a table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--item', description: 'Item to put', args: { name: 'item' }, required: true },
      { name: '--expected', description: 'Expected conditions', args: { name: 'expected' } },
      { name: '--return-values', description: 'Return values', args: { name: 'mode', suggestions: s('NONE', 'ALL_OLD') } },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } },
      { name: '--return-item-collection-metrics', description: 'Return item collection metrics', args: { name: 'mode', suggestions: s(...returnItemCollectionMetrics) } },
      { name: '--conditional-operator', description: 'Conditional operator', args: { name: 'op', suggestions: s(...conditionalOperators) } },
      { name: '--condition-expression', description: 'Condition expression', args: { name: 'expr' } },
      { name: '--expression-attribute-names', description: 'Expression attribute names', args: { name: 'names' } },
      { name: '--expression-attribute-values', description: 'Expression attribute values', args: { name: 'values' } },
      { name: '--return-values-on-condition-check-failure', description: 'Return values on condition check failure', args: { name: 'mode', suggestions: s('ALL_OLD', 'NONE') } }
    ]
  },
  {
    name: 'update-item',
    description: 'Update an item in a table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--key', description: 'Item key', args: { name: 'key' }, required: true },
      { name: '--attribute-updates', description: 'Attribute updates', args: { name: 'updates' } },
      { name: '--expected', description: 'Expected conditions', args: { name: 'expected' } },
      { name: '--conditional-operator', description: 'Conditional operator', args: { name: 'op', suggestions: s(...conditionalOperators) } },
      { name: '--return-values', description: 'Return values', args: { name: 'mode', suggestions: s(...returnValues) } },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } },
      { name: '--return-item-collection-metrics', description: 'Return item collection metrics', args: { name: 'mode', suggestions: s(...returnItemCollectionMetrics) } },
      { name: '--update-expression', description: 'Update expression', args: { name: 'expr' } },
      { name: '--condition-expression', description: 'Condition expression', args: { name: 'expr' } },
      { name: '--expression-attribute-names', description: 'Expression attribute names', args: { name: 'names' } },
      { name: '--expression-attribute-values', description: 'Expression attribute values', args: { name: 'values' } },
      { name: '--return-values-on-condition-check-failure', description: 'Return values on condition check failure', args: { name: 'mode', suggestions: s('ALL_OLD', 'NONE') } }
    ]
  },
  {
    name: 'delete-item',
    description: 'Delete an item from a table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--key', description: 'Item key', args: { name: 'key' }, required: true },
      { name: '--expected', description: 'Expected conditions', args: { name: 'expected' } },
      { name: '--conditional-operator', description: 'Conditional operator', args: { name: 'op', suggestions: s(...conditionalOperators) } },
      { name: '--return-values', description: 'Return values', args: { name: 'mode', suggestions: s('NONE', 'ALL_OLD') } },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } },
      { name: '--return-item-collection-metrics', description: 'Return item collection metrics', args: { name: 'mode', suggestions: s(...returnItemCollectionMetrics) } },
      { name: '--condition-expression', description: 'Condition expression', args: { name: 'expr' } },
      { name: '--expression-attribute-names', description: 'Expression attribute names', args: { name: 'names' } },
      { name: '--expression-attribute-values', description: 'Expression attribute values', args: { name: 'values' } },
      { name: '--return-values-on-condition-check-failure', description: 'Return values on condition check failure', args: { name: 'mode', suggestions: s('ALL_OLD', 'NONE') } }
    ]
  },
  // Query and Scan
  {
    name: 'query',
    description: 'Query items from a table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--index-name', description: 'Index name', args: { name: 'index' } },
      { name: '--select', description: 'Select mode', args: { name: 'mode', suggestions: s(...selectValues) } },
      { name: '--attributes-to-get', description: 'Attributes to get', args: { name: 'attrs', isVariadic: true } },
      { name: '--limit', description: 'Maximum items', args: { name: 'limit' } },
      { name: '--consistent-read', description: 'Use consistent read' },
      { name: '--no-consistent-read', description: 'Use eventually consistent read' },
      { name: '--key-conditions', description: 'Key conditions', args: { name: 'conditions' } },
      { name: '--query-filter', description: 'Query filter', args: { name: 'filter' } },
      { name: '--conditional-operator', description: 'Conditional operator', args: { name: 'op', suggestions: s(...conditionalOperators) } },
      { name: '--scan-index-forward', description: 'Scan index forward' },
      { name: '--no-scan-index-forward', description: 'Scan index backward' },
      { name: '--exclusive-start-key', description: 'Exclusive start key', args: { name: 'key' } },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } },
      { name: '--projection-expression', description: 'Projection expression', args: { name: 'expr' } },
      { name: '--filter-expression', description: 'Filter expression', args: { name: 'expr' } },
      { name: '--key-condition-expression', description: 'Key condition expression', args: { name: 'expr' } },
      { name: '--expression-attribute-names', description: 'Expression attribute names', args: { name: 'names' } },
      { name: '--expression-attribute-values', description: 'Expression attribute values', args: { name: 'values' } }
    ]
  },
  {
    name: 'scan',
    description: 'Scan items from a table',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--index-name', description: 'Index name', args: { name: 'index' } },
      { name: '--attributes-to-get', description: 'Attributes to get', args: { name: 'attrs', isVariadic: true } },
      { name: '--limit', description: 'Maximum items', args: { name: 'limit' } },
      { name: '--select', description: 'Select mode', args: { name: 'mode', suggestions: s(...selectValues) } },
      { name: '--scan-filter', description: 'Scan filter', args: { name: 'filter' } },
      { name: '--conditional-operator', description: 'Conditional operator', args: { name: 'op', suggestions: s(...conditionalOperators) } },
      { name: '--exclusive-start-key', description: 'Exclusive start key', args: { name: 'key' } },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } },
      { name: '--total-segments', description: 'Total segments for parallel scan', args: { name: 'segments' } },
      { name: '--segment', description: 'Segment to scan', args: { name: 'segment' } },
      { name: '--projection-expression', description: 'Projection expression', args: { name: 'expr' } },
      { name: '--filter-expression', description: 'Filter expression', args: { name: 'expr' } },
      { name: '--expression-attribute-names', description: 'Expression attribute names', args: { name: 'names' } },
      { name: '--expression-attribute-values', description: 'Expression attribute values', args: { name: 'values' } },
      { name: '--consistent-read', description: 'Use consistent read' },
      { name: '--no-consistent-read', description: 'Use eventually consistent read' }
    ]
  },
  // Batch operations
  {
    name: 'batch-get-item',
    description: 'Batch get items from tables',
    options: [
      { name: '--request-items', description: 'Request items', args: { name: 'items' }, required: true },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } }
    ]
  },
  {
    name: 'batch-write-item',
    description: 'Batch write items to tables',
    options: [
      { name: '--request-items', description: 'Request items', args: { name: 'items' }, required: true },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } },
      { name: '--return-item-collection-metrics', description: 'Return item collection metrics', args: { name: 'mode', suggestions: s(...returnItemCollectionMetrics) } }
    ]
  },
  {
    name: 'transact-get-items',
    description: 'Transactional get items',
    options: [
      { name: '--transact-items', description: 'Transaction items', args: { name: 'items' }, required: true },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } }
    ]
  },
  {
    name: 'transact-write-items',
    description: 'Transactional write items',
    options: [
      { name: '--transact-items', description: 'Transaction items', args: { name: 'items' }, required: true },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } },
      { name: '--return-item-collection-metrics', description: 'Return item collection metrics', args: { name: 'mode', suggestions: s(...returnItemCollectionMetrics) } },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } }
    ]
  },
  {
    name: 'batch-execute-statement',
    description: 'Batch execute PartiQL statements',
    options: [
      { name: '--statements', description: 'PartiQL statements', args: { name: 'statements' }, required: true },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } }
    ]
  },
  {
    name: 'execute-statement',
    description: 'Execute a PartiQL statement',
    options: [
      { name: '--statement', description: 'PartiQL statement', args: { name: 'statement' }, required: true },
      { name: '--parameters', description: 'Statement parameters', args: { name: 'params' } },
      { name: '--consistent-read', description: 'Use consistent read' },
      { name: '--no-consistent-read', description: 'Use eventually consistent read' },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } },
      { name: '--limit', description: 'Maximum items', args: { name: 'limit' } },
      { name: '--return-values-on-condition-check-failure', description: 'Return values on condition check failure', args: { name: 'mode', suggestions: s('ALL_OLD', 'NONE') } }
    ]
  },
  {
    name: 'execute-transaction',
    description: 'Execute a PartiQL transaction',
    options: [
      { name: '--transact-statements', description: 'Transaction statements', args: { name: 'statements' }, required: true },
      { name: '--client-request-token', description: 'Client request token', args: { name: 'token' } },
      { name: '--return-consumed-capacity', description: 'Return consumed capacity', args: { name: 'mode', suggestions: s(...returnConsumedCapacity) } }
    ]
  },
  // Backup operations
  {
    name: 'list-backups',
    description: 'List DynamoDB backups',
    options: [
      { name: '--table-name', description: 'Filter by table name', args: { name: 'name', generators: dynamodbTableGenerator } },
      { name: '--limit', description: 'Maximum backups', args: { name: 'limit' } },
      { name: '--time-range-lower-bound', description: 'Time range lower bound', args: { name: 'timestamp' } },
      { name: '--time-range-upper-bound', description: 'Time range upper bound', args: { name: 'timestamp' } },
      { name: '--exclusive-start-backup-arn', description: 'Exclusive start backup ARN', args: { name: 'arn' } },
      { name: '--backup-type', description: 'Backup type', args: { name: 'type', suggestions: s('USER', 'SYSTEM', 'AWS_BACKUP', 'ALL') } }
    ]
  },
  {
    name: 'describe-backup',
    description: 'Describe a backup',
    options: [
      { name: '--backup-arn', description: 'Backup ARN', args: { name: 'arn', generators: backupGenerator }, required: true }
    ]
  },
  {
    name: 'create-backup',
    description: 'Create a backup',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--backup-name', description: 'Backup name', args: { name: 'name' }, required: true }
    ]
  },
  {
    name: 'delete-backup',
    description: 'Delete a backup',
    options: [
      { name: '--backup-arn', description: 'Backup ARN', args: { name: 'arn', generators: backupGenerator }, required: true }
    ]
  },
  {
    name: 'restore-table-from-backup',
    description: 'Restore a table from backup',
    options: [
      { name: '--target-table-name', description: 'Target table name', args: { name: 'name' }, required: true },
      { name: '--backup-arn', description: 'Backup ARN', args: { name: 'arn', generators: backupGenerator }, required: true },
      { name: '--billing-mode-override', description: 'Billing mode override', args: { name: 'mode', suggestions: s(...billingModes) } },
      { name: '--global-secondary-index-override', description: 'GSI override', args: { name: 'indexes' } },
      { name: '--local-secondary-index-override', description: 'LSI override', args: { name: 'indexes' } },
      { name: '--provisioned-throughput-override', description: 'Provisioned throughput override', args: { name: 'throughput' } },
      { name: '--sse-specification-override', description: 'SSE specification override', args: { name: 'spec' } },
      { name: '--on-demand-throughput-override', description: 'On-demand throughput override', args: { name: 'throughput' } }
    ]
  },
  {
    name: 'restore-table-to-point-in-time',
    description: 'Restore a table to a point in time',
    options: [
      { name: '--source-table-arn', description: 'Source table ARN', args: { name: 'arn' } },
      { name: '--source-table-name', description: 'Source table name', args: { name: 'name', generators: dynamodbTableGenerator } },
      { name: '--target-table-name', description: 'Target table name', args: { name: 'name' }, required: true },
      { name: '--use-latest-restorable-time', description: 'Use latest restorable time' },
      { name: '--no-use-latest-restorable-time', description: 'Do not use latest restorable time' },
      { name: '--restore-date-time', description: 'Restore date time', args: { name: 'timestamp' } },
      { name: '--billing-mode-override', description: 'Billing mode override', args: { name: 'mode', suggestions: s(...billingModes) } },
      { name: '--global-secondary-index-override', description: 'GSI override', args: { name: 'indexes' } },
      { name: '--local-secondary-index-override', description: 'LSI override', args: { name: 'indexes' } },
      { name: '--provisioned-throughput-override', description: 'Provisioned throughput override', args: { name: 'throughput' } },
      { name: '--sse-specification-override', description: 'SSE specification override', args: { name: 'spec' } },
      { name: '--on-demand-throughput-override', description: 'On-demand throughput override', args: { name: 'throughput' } }
    ]
  },
  // Point-in-time recovery
  {
    name: 'describe-continuous-backups',
    description: 'Describe continuous backups',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true }
    ]
  },
  {
    name: 'update-continuous-backups',
    description: 'Update continuous backups',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--point-in-time-recovery-specification', description: 'PITR specification', args: { name: 'spec' }, required: true }
    ]
  },
  // Global tables
  {
    name: 'list-global-tables',
    description: 'List global tables',
    options: [
      { name: '--exclusive-start-global-table-name', description: 'Exclusive start global table name', args: { name: 'name' } },
      { name: '--limit', description: 'Maximum tables', args: { name: 'limit' } },
      { name: '--region-name', description: 'Filter by region', args: { name: 'region' } }
    ]
  },
  {
    name: 'describe-global-table',
    description: 'Describe a global table',
    options: [
      { name: '--global-table-name', description: 'Global table name', args: { name: 'name', generators: globalTableGenerator }, required: true }
    ]
  },
  {
    name: 'describe-global-table-settings',
    description: 'Describe global table settings',
    options: [
      { name: '--global-table-name', description: 'Global table name', args: { name: 'name', generators: globalTableGenerator }, required: true }
    ]
  },
  {
    name: 'create-global-table',
    description: 'Create a global table',
    options: [
      { name: '--global-table-name', description: 'Global table name', args: { name: 'name' }, required: true },
      { name: '--replication-group', description: 'Replication group', args: { name: 'group' }, required: true }
    ]
  },
  {
    name: 'update-global-table',
    description: 'Update a global table',
    options: [
      { name: '--global-table-name', description: 'Global table name', args: { name: 'name', generators: globalTableGenerator }, required: true },
      { name: '--replica-updates', description: 'Replica updates', args: { name: 'updates' }, required: true }
    ]
  },
  {
    name: 'update-global-table-settings',
    description: 'Update global table settings',
    options: [
      { name: '--global-table-name', description: 'Global table name', args: { name: 'name', generators: globalTableGenerator }, required: true },
      { name: '--global-table-billing-mode', description: 'Billing mode', args: { name: 'mode', suggestions: s(...billingModes) } },
      { name: '--global-table-provisioned-write-capacity-units', description: 'Write capacity units', args: { name: 'units' } },
      { name: '--global-table-provisioned-write-capacity-auto-scaling-settings-update', description: 'Write capacity auto scaling update', args: { name: 'settings' } },
      { name: '--global-table-global-secondary-index-settings-update', description: 'GSI settings update', args: { name: 'settings' } },
      { name: '--replica-settings-update', description: 'Replica settings update', args: { name: 'settings' } }
    ]
  },
  // Streams
  {
    name: 'describe-kinesis-streaming-destination',
    description: 'Describe Kinesis streaming destination',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true }
    ]
  },
  {
    name: 'enable-kinesis-streaming-destination',
    description: 'Enable Kinesis streaming destination',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--stream-arn', description: 'Kinesis stream ARN', args: { name: 'arn' }, required: true },
      { name: '--enable-kinesis-streaming-configuration', description: 'Streaming configuration', args: { name: 'config' } }
    ]
  },
  {
    name: 'disable-kinesis-streaming-destination',
    description: 'Disable Kinesis streaming destination',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--stream-arn', description: 'Kinesis stream ARN', args: { name: 'arn' }, required: true },
      { name: '--enable-kinesis-streaming-configuration', description: 'Streaming configuration', args: { name: 'config' } }
    ]
  },
  // Time to live
  {
    name: 'describe-time-to-live',
    description: 'Describe time to live settings',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true }
    ]
  },
  {
    name: 'update-time-to-live',
    description: 'Update time to live settings',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--time-to-live-specification', description: 'TTL specification', args: { name: 'spec' }, required: true }
    ]
  },
  // Contributor insights
  {
    name: 'describe-contributor-insights',
    description: 'Describe contributor insights',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--index-name', description: 'Index name', args: { name: 'index' } }
    ]
  },
  {
    name: 'list-contributor-insights',
    description: 'List contributor insights',
    options: [
      { name: '--table-name', description: 'Filter by table name', args: { name: 'name', generators: dynamodbTableGenerator } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'update-contributor-insights',
    description: 'Update contributor insights',
    options: [
      { name: '--table-name', description: 'Table name', args: { name: 'name', generators: dynamodbTableGenerator }, required: true },
      { name: '--index-name', description: 'Index name', args: { name: 'index' } },
      { name: '--contributor-insights-action', description: 'Action', args: { name: 'action', suggestions: s('ENABLE', 'DISABLE') }, required: true }
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
    name: 'list-tags-of-resource',
    description: 'List tags for a resource',
    options: [
      { name: '--resource-arn', description: 'Resource ARN', args: { name: 'arn' }, required: true },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  // Limits
  {
    name: 'describe-limits',
    description: 'Describe account limits'
  },
  // Endpoints
  {
    name: 'describe-endpoints',
    description: 'Describe service endpoints'
  }
];
