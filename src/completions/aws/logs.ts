// AWS CloudWatch Logs CLI completions
import { Subcommand } from '../../types.js';
import { s, cwLogGroupGenerator } from './_shared.js';

// Log stream generator
const logStreamGenerator = {
  script: 'aws logs describe-log-streams --log-group-name "$1" --order-by LastEventTime --descending --limit 20 --query "logStreams[*].logStreamName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(stream => ({
      name: stream.trim(),
      description: 'Log Stream',
      icon: '📜',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Metric filter generator
const metricFilterGenerator = {
  script: 'aws logs describe-metric-filters --query "metricFilters[*].filterName" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(f => f.trim()).map(filter => ({
      name: filter.trim(),
      description: 'Metric Filter',
      icon: '📊',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Subscription filter generator
const subscriptionFilterGenerator = {
  script: 'aws logs describe-subscription-filters --log-group-name "$1" --query "subscriptionFilters[*].filterName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(f => f.trim()).map(filter => ({
      name: filter.trim(),
      description: 'Subscription Filter',
      icon: '📨',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Query definition generator
const queryDefinitionGenerator = {
  script: 'aws logs describe-query-definitions --query "queryDefinitions[*].name" --output text 2>/dev/null | head -20',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(q => q.trim()).map(query => ({
      name: query.trim(),
      description: 'Query Definition',
      icon: '🔍',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Destinations generator
const destinationGenerator = {
  script: 'aws logs describe-destinations --query "destinations[*].destinationName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(d => d.trim()).map(dest => ({
      name: dest.trim(),
      description: 'Destination',
      icon: '📤',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const logsSubcommands: Subcommand[] = [
  // Log group operations
  {
    name: 'describe-log-groups',
    description: 'List log groups',
    options: [
      { name: '--log-group-name-prefix', description: 'Filter by prefix', args: { name: 'prefix' } },
      { name: '--log-group-name-pattern', description: 'Filter by pattern', args: { name: 'pattern' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--limit', description: 'Maximum groups', args: { name: 'number' } },
      { name: '--include-linked-accounts', description: 'Include linked accounts' },
      { name: '--no-include-linked-accounts', description: 'Exclude linked accounts' },
      { name: '--log-group-class', description: 'Log group class', args: { name: 'class', suggestions: s('STANDARD', 'INFREQUENT_ACCESS') } },
      { name: '--account-identifiers', description: 'Account identifiers', args: { name: 'accounts', isVariadic: true } }
    ]
  },
  {
    name: 'create-log-group',
    description: 'Create a log group',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name' }, required: true },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--log-group-class', description: 'Log group class', args: { name: 'class', suggestions: s('STANDARD', 'INFREQUENT_ACCESS') } }
    ]
  },
  {
    name: 'delete-log-group',
    description: 'Delete a log group',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true }
    ]
  },
  {
    name: 'put-retention-policy',
    description: 'Set log group retention',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--retention-in-days', description: 'Retention in days', args: { name: 'days', suggestions: s('1', '3', '5', '7', '14', '30', '60', '90', '120', '150', '180', '365', '400', '545', '731', '1096', '1827', '2192', '2557', '2922', '3288', '3653') }, required: true }
    ]
  },
  {
    name: 'delete-retention-policy',
    description: 'Delete retention policy',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true }
    ]
  },
  // Log stream operations
  {
    name: 'describe-log-streams',
    description: 'List log streams',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator } },
      { name: '--log-group-identifier', description: 'Log group identifier', args: { name: 'identifier' } },
      { name: '--log-stream-name-prefix', description: 'Filter by prefix', args: { name: 'prefix' } },
      { name: '--order-by', description: 'Order by', args: { name: 'order', suggestions: s('LogStreamName', 'LastEventTime') } },
      { name: '--descending', description: 'Descending order' },
      { name: '--no-descending', description: 'Ascending order' },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--limit', description: 'Maximum streams', args: { name: 'number' } }
    ]
  },
  {
    name: 'create-log-stream',
    description: 'Create a log stream',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--log-stream-name', description: 'Log stream name', args: { name: 'name' }, required: true }
    ]
  },
  {
    name: 'delete-log-stream',
    description: 'Delete a log stream',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--log-stream-name', description: 'Log stream name', args: { name: 'name', generators: logStreamGenerator }, required: true }
    ]
  },
  // Log events
  {
    name: 'get-log-events',
    description: 'Get log events from a stream',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator } },
      { name: '--log-group-identifier', description: 'Log group identifier', args: { name: 'identifier' } },
      { name: '--log-stream-name', description: 'Log stream name', args: { name: 'name', generators: logStreamGenerator }, required: true },
      { name: '--start-time', description: 'Start time (epoch ms)', args: { name: 'timestamp' } },
      { name: '--end-time', description: 'End time (epoch ms)', args: { name: 'timestamp' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--limit', description: 'Maximum events', args: { name: 'number' } },
      { name: '--start-from-head', description: 'Start from oldest' },
      { name: '--no-start-from-head', description: 'Start from newest' },
      { name: '--unmask', description: 'Unmask sensitive data' },
      { name: '--no-unmask', description: 'Keep data masked' }
    ]
  },
  {
    name: 'put-log-events',
    description: 'Put log events to a stream',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--log-stream-name', description: 'Log stream name', args: { name: 'name', generators: logStreamGenerator }, required: true },
      { name: '--log-events', description: 'Log events', args: { name: 'events' }, required: true },
      { name: '--sequence-token', description: 'Sequence token', args: { name: 'token' } }
    ]
  },
  {
    name: 'filter-log-events',
    description: 'Filter log events',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator } },
      { name: '--log-group-identifier', description: 'Log group identifier', args: { name: 'identifier' } },
      { name: '--log-stream-names', description: 'Log stream names', args: { name: 'streams', isVariadic: true } },
      { name: '--log-stream-name-prefix', description: 'Stream name prefix', args: { name: 'prefix' } },
      { name: '--start-time', description: 'Start time (epoch ms)', args: { name: 'timestamp' } },
      { name: '--end-time', description: 'End time (epoch ms)', args: { name: 'timestamp' } },
      { name: '--filter-pattern', description: 'Filter pattern', args: { name: 'pattern' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--limit', description: 'Maximum events', args: { name: 'number' } },
      { name: '--interleaved', description: 'Interleave streams (deprecated)' },
      { name: '--no-interleaved', description: 'Do not interleave (deprecated)' },
      { name: '--unmask', description: 'Unmask sensitive data' },
      { name: '--no-unmask', description: 'Keep data masked' }
    ]
  },
  // Insights queries
  {
    name: 'start-query',
    description: 'Start a Logs Insights query',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator } },
      { name: '--log-group-names', description: 'Log group names', args: { name: 'names', isVariadic: true } },
      { name: '--log-group-identifiers', description: 'Log group identifiers', args: { name: 'identifiers', isVariadic: true } },
      { name: '--start-time', description: 'Start time (epoch seconds)', args: { name: 'timestamp' }, required: true },
      { name: '--end-time', description: 'End time (epoch seconds)', args: { name: 'timestamp' }, required: true },
      { name: '--query-string', description: 'Query string', args: { name: 'query' }, required: true },
      { name: '--limit', description: 'Maximum results', args: { name: 'number' } }
    ]
  },
  {
    name: 'get-query-results',
    description: 'Get query results',
    options: [
      { name: '--query-id', description: 'Query ID', args: { name: 'id' }, required: true }
    ]
  },
  {
    name: 'stop-query',
    description: 'Stop a running query',
    options: [
      { name: '--query-id', description: 'Query ID', args: { name: 'id' }, required: true }
    ]
  },
  {
    name: 'describe-queries',
    description: 'List recent queries',
    options: [
      { name: '--log-group-name', description: 'Filter by log group', args: { name: 'name', generators: cwLogGroupGenerator } },
      { name: '--status', description: 'Filter by status', args: { name: 'status', suggestions: s('Scheduled', 'Running', 'Complete', 'Failed', 'Cancelled', 'Timeout', 'Unknown') } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'describe-query-definitions',
    description: 'List query definitions',
    options: [
      { name: '--query-definition-name-prefix', description: 'Filter by prefix', args: { name: 'prefix' } },
      { name: '--max-results', description: 'Maximum results', args: { name: 'number' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } }
    ]
  },
  {
    name: 'put-query-definition',
    description: 'Create/update query definition',
    options: [
      { name: '--name', description: 'Query name', args: { name: 'name' }, required: true },
      { name: '--query-definition-id', description: 'Query definition ID (for update)', args: { name: 'id', generators: queryDefinitionGenerator } },
      { name: '--log-group-names', description: 'Log group names', args: { name: 'names', isVariadic: true } },
      { name: '--query-string', description: 'Query string', args: { name: 'query' }, required: true },
      { name: '--client-token', description: 'Client token', args: { name: 'token' } }
    ]
  },
  {
    name: 'delete-query-definition',
    description: 'Delete a query definition',
    options: [
      { name: '--query-definition-id', description: 'Query definition ID', args: { name: 'id', generators: queryDefinitionGenerator }, required: true }
    ]
  },
  // Metric filters
  {
    name: 'describe-metric-filters',
    description: 'List metric filters',
    options: [
      { name: '--log-group-name', description: 'Filter by log group', args: { name: 'name', generators: cwLogGroupGenerator } },
      { name: '--filter-name-prefix', description: 'Filter by prefix', args: { name: 'prefix' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--limit', description: 'Maximum filters', args: { name: 'number' } },
      { name: '--metric-name', description: 'Filter by metric name', args: { name: 'name' } },
      { name: '--metric-namespace', description: 'Filter by metric namespace', args: { name: 'namespace' } }
    ]
  },
  {
    name: 'put-metric-filter',
    description: 'Create/update metric filter',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--filter-name', description: 'Filter name', args: { name: 'name' }, required: true },
      { name: '--filter-pattern', description: 'Filter pattern', args: { name: 'pattern' }, required: true },
      { name: '--metric-transformations', description: 'Metric transformations', args: { name: 'transformations' }, required: true }
    ]
  },
  {
    name: 'delete-metric-filter',
    description: 'Delete a metric filter',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--filter-name', description: 'Filter name', args: { name: 'name', generators: metricFilterGenerator }, required: true }
    ]
  },
  // Subscription filters
  {
    name: 'describe-subscription-filters',
    description: 'List subscription filters',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--filter-name-prefix', description: 'Filter by prefix', args: { name: 'prefix' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--limit', description: 'Maximum filters', args: { name: 'number' } }
    ]
  },
  {
    name: 'put-subscription-filter',
    description: 'Create/update subscription filter',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--filter-name', description: 'Filter name', args: { name: 'name' }, required: true },
      { name: '--filter-pattern', description: 'Filter pattern', args: { name: 'pattern' }, required: true },
      { name: '--destination-arn', description: 'Destination ARN', args: { name: 'arn' }, required: true },
      { name: '--role-arn', description: 'Role ARN', args: { name: 'arn' } },
      { name: '--distribution', description: 'Distribution', args: { name: 'distribution', suggestions: s('Random', 'ByLogStream') } }
    ]
  },
  {
    name: 'delete-subscription-filter',
    description: 'Delete subscription filter',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--filter-name', description: 'Filter name', args: { name: 'name', generators: subscriptionFilterGenerator }, required: true }
    ]
  },
  // Destinations
  {
    name: 'describe-destinations',
    description: 'List destinations',
    options: [
      { name: '--destination-name-prefix', description: 'Filter by prefix', args: { name: 'prefix' } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--limit', description: 'Maximum destinations', args: { name: 'number' } }
    ]
  },
  {
    name: 'put-destination',
    description: 'Create/update destination',
    options: [
      { name: '--destination-name', description: 'Destination name', args: { name: 'name' }, required: true },
      { name: '--target-arn', description: 'Target ARN', args: { name: 'arn' }, required: true },
      { name: '--role-arn', description: 'Role ARN', args: { name: 'arn' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'put-destination-policy',
    description: 'Set destination policy',
    options: [
      { name: '--destination-name', description: 'Destination name', args: { name: 'name', generators: destinationGenerator }, required: true },
      { name: '--access-policy', description: 'Access policy', args: { name: 'policy' }, required: true },
      { name: '--force-update', description: 'Force update' },
      { name: '--no-force-update', description: 'Do not force update' }
    ]
  },
  {
    name: 'delete-destination',
    description: 'Delete a destination',
    options: [
      { name: '--destination-name', description: 'Destination name', args: { name: 'name', generators: destinationGenerator }, required: true }
    ]
  },
  // Export tasks
  {
    name: 'describe-export-tasks',
    description: 'List export tasks',
    options: [
      { name: '--task-id', description: 'Task ID', args: { name: 'id' } },
      { name: '--status-code', description: 'Status code', args: { name: 'status', suggestions: s('CANCELLED', 'COMPLETED', 'FAILED', 'PENDING', 'PENDING_CANCEL', 'RUNNING') } },
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--limit', description: 'Maximum tasks', args: { name: 'number' } }
    ]
  },
  {
    name: 'create-export-task',
    description: 'Create an export task',
    options: [
      { name: '--task-name', description: 'Task name', args: { name: 'name' } },
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--log-stream-name-prefix', description: 'Stream name prefix', args: { name: 'prefix' } },
      { name: '--from', description: 'From time (epoch ms)', args: { name: 'timestamp' }, required: true },
      { name: '--to', description: 'To time (epoch ms)', args: { name: 'timestamp' }, required: true },
      { name: '--destination', description: 'S3 bucket', args: { name: 'bucket' }, required: true },
      { name: '--destination-prefix', description: 'S3 prefix', args: { name: 'prefix' } }
    ]
  },
  {
    name: 'cancel-export-task',
    description: 'Cancel an export task',
    options: [
      { name: '--task-id', description: 'Task ID', args: { name: 'id' }, required: true }
    ]
  },
  // Data protection
  {
    name: 'describe-account-policies',
    description: 'List account policies',
    options: [
      { name: '--policy-type', description: 'Policy type', args: { name: 'type', suggestions: s('DATA_PROTECTION_POLICY', 'SUBSCRIPTION_FILTER_POLICY') }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'name' } },
      { name: '--account-identifiers', description: 'Account identifiers', args: { name: 'accounts', isVariadic: true } }
    ]
  },
  {
    name: 'put-account-policy',
    description: 'Set account policy',
    options: [
      { name: '--policy-name', description: 'Policy name', args: { name: 'name' }, required: true },
      { name: '--policy-document', description: 'Policy document', args: { name: 'document' }, required: true },
      { name: '--policy-type', description: 'Policy type', args: { name: 'type', suggestions: s('DATA_PROTECTION_POLICY', 'SUBSCRIPTION_FILTER_POLICY') }, required: true },
      { name: '--scope', description: 'Scope', args: { name: 'scope', suggestions: s('ALL') } },
      { name: '--selection-criteria', description: 'Selection criteria', args: { name: 'criteria' } }
    ]
  },
  {
    name: 'delete-account-policy',
    description: 'Delete account policy',
    options: [
      { name: '--policy-name', description: 'Policy name', args: { name: 'name' }, required: true },
      { name: '--policy-type', description: 'Policy type', args: { name: 'type', suggestions: s('DATA_PROTECTION_POLICY', 'SUBSCRIPTION_FILTER_POLICY') }, required: true }
    ]
  },
  {
    name: 'get-data-protection-policy',
    description: 'Get data protection policy',
    options: [
      { name: '--log-group-identifier', description: 'Log group identifier', args: { name: 'identifier', generators: cwLogGroupGenerator }, required: true }
    ]
  },
  {
    name: 'put-data-protection-policy',
    description: 'Set data protection policy',
    options: [
      { name: '--log-group-identifier', description: 'Log group identifier', args: { name: 'identifier', generators: cwLogGroupGenerator }, required: true },
      { name: '--policy-document', description: 'Policy document', args: { name: 'document' }, required: true }
    ]
  },
  {
    name: 'delete-data-protection-policy',
    description: 'Delete data protection policy',
    options: [
      { name: '--log-group-identifier', description: 'Log group identifier', args: { name: 'identifier', generators: cwLogGroupGenerator }, required: true }
    ]
  },
  // Resource policy
  {
    name: 'describe-resource-policies',
    description: 'List resource policies',
    options: [
      { name: '--next-token', description: 'Pagination token', args: { name: 'token' } },
      { name: '--limit', description: 'Maximum policies', args: { name: 'number' } }
    ]
  },
  {
    name: 'put-resource-policy',
    description: 'Set resource policy',
    options: [
      { name: '--policy-name', description: 'Policy name', args: { name: 'name' } },
      { name: '--policy-document', description: 'Policy document', args: { name: 'document' } }
    ]
  },
  {
    name: 'delete-resource-policy',
    description: 'Delete resource policy',
    options: [
      { name: '--policy-name', description: 'Policy name', args: { name: 'name' } }
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
  {
    name: 'list-tags-log-group',
    description: 'List tags for a log group',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true }
    ]
  },
  {
    name: 'tag-log-group',
    description: 'Add tags to a log group',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' }, required: true }
    ]
  },
  {
    name: 'untag-log-group',
    description: 'Remove tags from a log group',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--tags', description: 'Tag keys', args: { name: 'keys', isVariadic: true }, required: true }
    ]
  },
  // Misc
  {
    name: 'associate-kms-key',
    description: 'Associate KMS key with log group',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator } },
      { name: '--kms-key-id', description: 'KMS key ID', args: { name: 'key' }, required: true },
      { name: '--resource-identifier', description: 'Resource identifier', args: { name: 'identifier' } }
    ]
  },
  {
    name: 'disassociate-kms-key',
    description: 'Disassociate KMS key from log group',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator } },
      { name: '--resource-identifier', description: 'Resource identifier', args: { name: 'identifier' } }
    ]
  },
  {
    name: 'test-metric-filter',
    description: 'Test a metric filter pattern',
    options: [
      { name: '--filter-pattern', description: 'Filter pattern', args: { name: 'pattern' }, required: true },
      { name: '--log-event-messages', description: 'Log event messages', args: { name: 'messages', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'get-log-record',
    description: 'Get a specific log record',
    options: [
      { name: '--log-record-pointer', description: 'Log record pointer', args: { name: 'pointer' }, required: true },
      { name: '--unmask', description: 'Unmask sensitive data' },
      { name: '--no-unmask', description: 'Keep data masked' }
    ]
  },
  // High-level commands
  {
    name: 'tail',
    description: 'Tail log group events in real-time',
    options: [
      { name: '--log-group-name', description: 'Log group name', args: { name: 'name', generators: cwLogGroupGenerator }, required: true },
      { name: '--log-stream-names', description: 'Log stream names', args: { name: 'streams', isVariadic: true } },
      { name: '--log-stream-name-prefix', description: 'Stream name prefix', args: { name: 'prefix' } },
      { name: '--filter-pattern', description: 'Filter pattern', args: { name: 'pattern' } },
      { name: '--format', description: 'Output format', args: { name: 'format', suggestions: s('detailed', 'short', 'json') } },
      { name: '--since', description: 'Start time', args: { name: 'time' } },
      { name: '--follow', description: 'Follow logs' },
      { name: '--no-follow', description: 'Do not follow logs' }
    ]
  }
];
