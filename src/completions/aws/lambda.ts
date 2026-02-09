// AWS Lambda CLI completions
import { Subcommand } from '../../types.js';
import { s, lambdaFunctionGenerator, iamRoleGenerator, awsRegions } from './_shared.js';

const runtimes = [
  'nodejs20.x', 'nodejs18.x', 'nodejs16.x',
  'python3.12', 'python3.11', 'python3.10', 'python3.9', 'python3.8',
  'java21', 'java17', 'java11', 'java8.al2',
  'dotnet8', 'dotnet6',
  'ruby3.3', 'ruby3.2',
  'provided.al2023', 'provided.al2',
  'go1.x'
];

const architectures = ['x86_64', 'arm64'];
const packageTypes = ['Zip', 'Image'];
const invokeTypes = ['RequestResponse', 'Event', 'DryRun'];
const logTypes = ['None', 'Tail'];
const eventSourcePositions = ['TRIM_HORIZON', 'LATEST', 'AT_TIMESTAMP'];

// Lambda layer generator
const layerGenerator = {
  script: 'aws lambda list-layers --query "Layers[*].[LayerName,LatestMatchingVersion.Description]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Lambda Layer',
        icon: '📦',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Lambda alias generator
const aliasGenerator = (functionName: string) => ({
  script: `aws lambda list-aliases --function-name ${functionName} --query "Aliases[*].[Name,Description]" --output text 2>/dev/null`,
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Function Alias',
        icon: '🏷️',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
});

// Event source mapping generator
const eventSourceMappingGenerator = {
  script: 'aws lambda list-event-source-mappings --query "EventSourceMappings[*].[UUID,EventSourceArn]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Event Source Mapping',
        icon: '🔗',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Code signing config generator
const codeSigningConfigGenerator = {
  script: 'aws lambda list-code-signing-configs --query "CodeSigningConfigs[*].[CodeSigningConfigId,Description]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Code Signing Config',
        icon: '🔏',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const lambdaSubcommands: Subcommand[] = [
  // Function operations
  {
    name: 'list-functions',
    description: 'List Lambda functions',
    options: [
      { name: '--master-region', description: 'Filter by master region', args: { name: 'region', suggestions: s(...awsRegions, 'ALL') } },
      { name: '--function-version', description: 'Filter by version', args: { name: 'version', suggestions: s('ALL') } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-function',
    description: 'Get Lambda function details',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } }
    ]
  },
  {
    name: 'create-function',
    description: 'Create a Lambda function',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name' }, required: true },
      { name: '--runtime', description: 'Runtime', args: { name: 'runtime', suggestions: s(...runtimes) } },
      { name: '--role', description: 'Execution role ARN', args: { name: 'role', generators: iamRoleGenerator }, required: true },
      { name: '--handler', description: 'Handler', args: { name: 'handler' } },
      { name: '--code', description: 'Code location', args: { name: 'code' } },
      { name: '--description', description: 'Description', args: { name: 'desc' } },
      { name: '--timeout', description: 'Timeout (seconds)', args: { name: 'seconds', suggestions: s('3', '15', '30', '60', '300', '900') } },
      { name: '--memory-size', description: 'Memory (MB)', args: { name: 'mb', suggestions: s('128', '256', '512', '1024', '2048', '3008', '10240') } },
      { name: '--publish', description: 'Publish a version' },
      { name: '--no-publish', description: 'Do not publish' },
      { name: '--vpc-config', description: 'VPC configuration', args: { name: 'config' } },
      { name: '--package-type', description: 'Package type', args: { name: 'type', suggestions: s(...packageTypes) } },
      { name: '--dead-letter-config', description: 'Dead letter config', args: { name: 'config' } },
      { name: '--environment', description: 'Environment variables', args: { name: 'env' } },
      { name: '--kms-key-arn', description: 'KMS key ARN', args: { name: 'arn' } },
      { name: '--tracing-config', description: 'X-Ray tracing config', args: { name: 'config' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } },
      { name: '--layers', description: 'Layer ARNs', args: { name: 'layers', isVariadic: true } },
      { name: '--file-system-configs', description: 'EFS configs', args: { name: 'configs' } },
      { name: '--image-config', description: 'Container image config', args: { name: 'config' } },
      { name: '--code-signing-config-arn', description: 'Code signing config ARN', args: { name: 'arn' } },
      { name: '--architectures', description: 'Architectures', args: { name: 'arch', suggestions: s(...architectures) } },
      { name: '--ephemeral-storage', description: 'Ephemeral storage', args: { name: 'storage' } },
      { name: '--snap-start', description: 'SnapStart config', args: { name: 'config' } },
      { name: '--logging-config', description: 'Logging config', args: { name: 'config' } },
      { name: '--zip-file', description: 'Zip file path', args: { name: 'file', template: 'filepaths' } }
    ]
  },
  {
    name: 'update-function-code',
    description: 'Update Lambda function code',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--zip-file', description: 'Zip file path', args: { name: 'file', template: 'filepaths' } },
      { name: '--s3-bucket', description: 'S3 bucket', args: { name: 'bucket' } },
      { name: '--s3-key', description: 'S3 key', args: { name: 'key' } },
      { name: '--s3-object-version', description: 'S3 object version', args: { name: 'version' } },
      { name: '--image-uri', description: 'Container image URI', args: { name: 'uri' } },
      { name: '--publish', description: 'Publish a version' },
      { name: '--no-publish', description: 'Do not publish' },
      { name: '--dry-run', description: 'Dry run' },
      { name: '--no-dry-run', description: 'No dry run' },
      { name: '--revision-id', description: 'Revision ID', args: { name: 'id' } },
      { name: '--architectures', description: 'Architectures', args: { name: 'arch', suggestions: s(...architectures) } }
    ]
  },
  {
    name: 'update-function-configuration',
    description: 'Update Lambda function configuration',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--role', description: 'Execution role ARN', args: { name: 'role', generators: iamRoleGenerator } },
      { name: '--handler', description: 'Handler', args: { name: 'handler' } },
      { name: '--description', description: 'Description', args: { name: 'desc' } },
      { name: '--timeout', description: 'Timeout (seconds)', args: { name: 'seconds' } },
      { name: '--memory-size', description: 'Memory (MB)', args: { name: 'mb' } },
      { name: '--vpc-config', description: 'VPC configuration', args: { name: 'config' } },
      { name: '--environment', description: 'Environment variables', args: { name: 'env' } },
      { name: '--runtime', description: 'Runtime', args: { name: 'runtime', suggestions: s(...runtimes) } },
      { name: '--dead-letter-config', description: 'Dead letter config', args: { name: 'config' } },
      { name: '--kms-key-arn', description: 'KMS key ARN', args: { name: 'arn' } },
      { name: '--tracing-config', description: 'X-Ray tracing config', args: { name: 'config' } },
      { name: '--revision-id', description: 'Revision ID', args: { name: 'id' } },
      { name: '--layers', description: 'Layer ARNs', args: { name: 'layers', isVariadic: true } },
      { name: '--file-system-configs', description: 'EFS configs', args: { name: 'configs' } },
      { name: '--image-config', description: 'Container image config', args: { name: 'config' } },
      { name: '--ephemeral-storage', description: 'Ephemeral storage', args: { name: 'storage' } },
      { name: '--snap-start', description: 'SnapStart config', args: { name: 'config' } },
      { name: '--logging-config', description: 'Logging config', args: { name: 'config' } }
    ]
  },
  {
    name: 'delete-function',
    description: 'Delete a Lambda function',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } }
    ]
  },
  {
    name: 'invoke',
    description: 'Invoke a Lambda function',
    args: { name: 'outfile', template: 'filepaths' },
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--invocation-type', description: 'Invocation type', args: { name: 'type', suggestions: s(...invokeTypes) } },
      { name: '--log-type', description: 'Log type', args: { name: 'type', suggestions: s(...logTypes) } },
      { name: '--client-context', description: 'Client context', args: { name: 'context' } },
      { name: '--payload', description: 'Payload', args: { name: 'payload' } },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } }
    ]
  },
  {
    name: 'get-function-configuration',
    description: 'Get function configuration',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } }
    ]
  },
  // Version operations
  {
    name: 'publish-version',
    description: 'Publish a new version',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--code-sha256', description: 'Code SHA256', args: { name: 'hash' } },
      { name: '--description', description: 'Version description', args: { name: 'desc' } },
      { name: '--revision-id', description: 'Revision ID', args: { name: 'id' } }
    ]
  },
  {
    name: 'list-versions-by-function',
    description: 'List function versions',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Alias operations
  {
    name: 'create-alias',
    description: 'Create a function alias',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--name', description: 'Alias name', args: { name: 'alias' }, required: true },
      { name: '--function-version', description: 'Version number', args: { name: 'version' }, required: true },
      { name: '--description', description: 'Alias description', args: { name: 'desc' } },
      { name: '--routing-config', description: 'Routing config', args: { name: 'config' } }
    ]
  },
  {
    name: 'update-alias',
    description: 'Update a function alias',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--name', description: 'Alias name', args: { name: 'alias' }, required: true },
      { name: '--function-version', description: 'Version number', args: { name: 'version' } },
      { name: '--description', description: 'Alias description', args: { name: 'desc' } },
      { name: '--routing-config', description: 'Routing config', args: { name: 'config' } },
      { name: '--revision-id', description: 'Revision ID', args: { name: 'id' } }
    ]
  },
  {
    name: 'delete-alias',
    description: 'Delete a function alias',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--name', description: 'Alias name', args: { name: 'alias' }, required: true }
    ]
  },
  {
    name: 'get-alias',
    description: 'Get alias details',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--name', description: 'Alias name', args: { name: 'alias' }, required: true }
    ]
  },
  {
    name: 'list-aliases',
    description: 'List function aliases',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--function-version', description: 'Filter by version', args: { name: 'version' } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Layer operations
  {
    name: 'list-layers',
    description: 'List Lambda layers',
    options: [
      { name: '--compatible-runtime', description: 'Filter by runtime', args: { name: 'runtime', suggestions: s(...runtimes) } },
      { name: '--compatible-architecture', description: 'Filter by architecture', args: { name: 'arch', suggestions: s(...architectures) } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'publish-layer-version',
    description: 'Publish a new layer version',
    options: [
      { name: '--layer-name', description: 'Layer name', args: { name: 'name' }, required: true },
      { name: '--description', description: 'Layer description', args: { name: 'desc' } },
      { name: '--content', description: 'Layer content', args: { name: 'content' } },
      { name: '--compatible-runtimes', description: 'Compatible runtimes', args: { name: 'runtimes', suggestions: s(...runtimes), isVariadic: true } },
      { name: '--license-info', description: 'License info', args: { name: 'license' } },
      { name: '--compatible-architectures', description: 'Compatible architectures', args: { name: 'archs', suggestions: s(...architectures), isVariadic: true } },
      { name: '--zip-file', description: 'Zip file path', args: { name: 'file', template: 'filepaths' } }
    ]
  },
  {
    name: 'get-layer-version',
    description: 'Get layer version details',
    options: [
      { name: '--layer-name', description: 'Layer name', args: { name: 'name', generators: layerGenerator }, required: true },
      { name: '--version-number', description: 'Version number', args: { name: 'version' }, required: true }
    ]
  },
  {
    name: 'delete-layer-version',
    description: 'Delete a layer version',
    options: [
      { name: '--layer-name', description: 'Layer name', args: { name: 'name', generators: layerGenerator }, required: true },
      { name: '--version-number', description: 'Version number', args: { name: 'version' }, required: true }
    ]
  },
  {
    name: 'list-layer-versions',
    description: 'List layer versions',
    options: [
      { name: '--layer-name', description: 'Layer name', args: { name: 'name', generators: layerGenerator }, required: true },
      { name: '--compatible-runtime', description: 'Filter by runtime', args: { name: 'runtime', suggestions: s(...runtimes) } },
      { name: '--compatible-architecture', description: 'Filter by architecture', args: { name: 'arch', suggestions: s(...architectures) } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Event source mapping operations
  {
    name: 'create-event-source-mapping',
    description: 'Create an event source mapping',
    options: [
      { name: '--event-source-arn', description: 'Event source ARN', args: { name: 'arn' } },
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--enabled', description: 'Enable mapping' },
      { name: '--no-enabled', description: 'Disable mapping' },
      { name: '--batch-size', description: 'Batch size', args: { name: 'size', suggestions: s('1', '10', '100', '1000', '10000') } },
      { name: '--filter-criteria', description: 'Filter criteria', args: { name: 'criteria' } },
      { name: '--maximum-batching-window-in-seconds', description: 'Max batching window', args: { name: 'seconds' } },
      { name: '--parallelization-factor', description: 'Parallelization factor', args: { name: 'factor', suggestions: s('1', '2', '5', '10') } },
      { name: '--starting-position', description: 'Starting position', args: { name: 'position', suggestions: s(...eventSourcePositions) } },
      { name: '--starting-position-timestamp', description: 'Starting timestamp', args: { name: 'timestamp' } },
      { name: '--destination-config', description: 'Destination config', args: { name: 'config' } },
      { name: '--maximum-record-age-in-seconds', description: 'Max record age', args: { name: 'seconds' } },
      { name: '--bisect-batch-on-function-error', description: 'Bisect on error' },
      { name: '--no-bisect-batch-on-function-error', description: 'No bisect on error' },
      { name: '--maximum-retry-attempts', description: 'Max retries', args: { name: 'retries', suggestions: s('0', '1', '2', '5', '10000') } },
      { name: '--tumbling-window-in-seconds', description: 'Tumbling window', args: { name: 'seconds' } },
      { name: '--topics', description: 'Kafka topics', args: { name: 'topics', isVariadic: true } },
      { name: '--queues', description: 'MQ queues', args: { name: 'queues', isVariadic: true } },
      { name: '--source-access-configurations', description: 'Source access configs', args: { name: 'configs' } },
      { name: '--self-managed-event-source', description: 'Self-managed source', args: { name: 'source' } },
      { name: '--function-response-types', description: 'Response types', args: { name: 'types', suggestions: s('ReportBatchItemFailures'), isVariadic: true } },
      { name: '--amazon-managed-kafka-event-source-config', description: 'Kafka config', args: { name: 'config' } },
      { name: '--self-managed-kafka-event-source-config', description: 'Self-managed Kafka config', args: { name: 'config' } },
      { name: '--scaling-config', description: 'Scaling config', args: { name: 'config' } },
      { name: '--document-db-event-source-config', description: 'DocumentDB config', args: { name: 'config' } }
    ]
  },
  {
    name: 'update-event-source-mapping',
    description: 'Update an event source mapping',
    options: [
      { name: '--uuid', description: 'Mapping UUID', args: { name: 'uuid', generators: eventSourceMappingGenerator }, required: true },
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator } },
      { name: '--enabled', description: 'Enable mapping' },
      { name: '--no-enabled', description: 'Disable mapping' },
      { name: '--batch-size', description: 'Batch size', args: { name: 'size' } },
      { name: '--filter-criteria', description: 'Filter criteria', args: { name: 'criteria' } },
      { name: '--maximum-batching-window-in-seconds', description: 'Max batching window', args: { name: 'seconds' } },
      { name: '--parallelization-factor', description: 'Parallelization factor', args: { name: 'factor' } },
      { name: '--destination-config', description: 'Destination config', args: { name: 'config' } },
      { name: '--maximum-record-age-in-seconds', description: 'Max record age', args: { name: 'seconds' } },
      { name: '--bisect-batch-on-function-error', description: 'Bisect on error' },
      { name: '--no-bisect-batch-on-function-error', description: 'No bisect on error' },
      { name: '--maximum-retry-attempts', description: 'Max retries', args: { name: 'retries' } },
      { name: '--tumbling-window-in-seconds', description: 'Tumbling window', args: { name: 'seconds' } },
      { name: '--source-access-configurations', description: 'Source access configs', args: { name: 'configs' } },
      { name: '--function-response-types', description: 'Response types', args: { name: 'types', isVariadic: true } },
      { name: '--scaling-config', description: 'Scaling config', args: { name: 'config' } },
      { name: '--document-db-event-source-config', description: 'DocumentDB config', args: { name: 'config' } }
    ]
  },
  {
    name: 'delete-event-source-mapping',
    description: 'Delete an event source mapping',
    options: [
      { name: '--uuid', description: 'Mapping UUID', args: { name: 'uuid', generators: eventSourceMappingGenerator }, required: true }
    ]
  },
  {
    name: 'get-event-source-mapping',
    description: 'Get event source mapping details',
    options: [
      { name: '--uuid', description: 'Mapping UUID', args: { name: 'uuid', generators: eventSourceMappingGenerator }, required: true }
    ]
  },
  {
    name: 'list-event-source-mappings',
    description: 'List event source mappings',
    options: [
      { name: '--event-source-arn', description: 'Filter by event source ARN', args: { name: 'arn' } },
      { name: '--function-name', description: 'Filter by function', args: { name: 'name', generators: lambdaFunctionGenerator } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Permission operations
  {
    name: 'add-permission',
    description: 'Add a permission to a function policy',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--statement-id', description: 'Statement ID', args: { name: 'id' }, required: true },
      { name: '--action', description: 'Action', args: { name: 'action', suggestions: s('lambda:InvokeFunction', 'lambda:InvokeAsync') }, required: true },
      { name: '--principal', description: 'Principal', args: { name: 'principal' }, required: true },
      { name: '--source-arn', description: 'Source ARN', args: { name: 'arn' } },
      { name: '--source-account', description: 'Source account', args: { name: 'account' } },
      { name: '--event-source-token', description: 'Event source token', args: { name: 'token' } },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } },
      { name: '--revision-id', description: 'Revision ID', args: { name: 'id' } },
      { name: '--principal-org-id', description: 'Principal org ID', args: { name: 'org-id' } },
      { name: '--function-url-auth-type', description: 'URL auth type', args: { name: 'type', suggestions: s('NONE', 'AWS_IAM') } }
    ]
  },
  {
    name: 'remove-permission',
    description: 'Remove a permission from function policy',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--statement-id', description: 'Statement ID', args: { name: 'id' }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } },
      { name: '--revision-id', description: 'Revision ID', args: { name: 'id' } }
    ]
  },
  {
    name: 'get-policy',
    description: 'Get function resource policy',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } }
    ]
  },
  // Concurrency operations
  {
    name: 'put-function-concurrency',
    description: 'Set function reserved concurrency',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--reserved-concurrent-executions', description: 'Reserved concurrent executions', args: { name: 'number' }, required: true }
    ]
  },
  {
    name: 'delete-function-concurrency',
    description: 'Remove function reserved concurrency',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true }
    ]
  },
  {
    name: 'get-function-concurrency',
    description: 'Get function concurrency settings',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true }
    ]
  },
  {
    name: 'put-provisioned-concurrency-config',
    description: 'Set provisioned concurrency',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' }, required: true },
      { name: '--provisioned-concurrent-executions', description: 'Provisioned concurrent executions', args: { name: 'number' }, required: true }
    ]
  },
  {
    name: 'delete-provisioned-concurrency-config',
    description: 'Remove provisioned concurrency',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' }, required: true }
    ]
  },
  {
    name: 'get-provisioned-concurrency-config',
    description: 'Get provisioned concurrency settings',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' }, required: true }
    ]
  },
  {
    name: 'list-provisioned-concurrency-configs',
    description: 'List provisioned concurrency configs',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // URL operations
  {
    name: 'create-function-url-config',
    description: 'Create a function URL',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--auth-type', description: 'Auth type', args: { name: 'type', suggestions: s('NONE', 'AWS_IAM') }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } },
      { name: '--cors', description: 'CORS config', args: { name: 'config' } },
      { name: '--invoke-mode', description: 'Invoke mode', args: { name: 'mode', suggestions: s('BUFFERED', 'RESPONSE_STREAM') } }
    ]
  },
  {
    name: 'update-function-url-config',
    description: 'Update a function URL',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--auth-type', description: 'Auth type', args: { name: 'type', suggestions: s('NONE', 'AWS_IAM') } },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } },
      { name: '--cors', description: 'CORS config', args: { name: 'config' } },
      { name: '--invoke-mode', description: 'Invoke mode', args: { name: 'mode', suggestions: s('BUFFERED', 'RESPONSE_STREAM') } }
    ]
  },
  {
    name: 'delete-function-url-config',
    description: 'Delete a function URL',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } }
    ]
  },
  {
    name: 'get-function-url-config',
    description: 'Get function URL configuration',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--qualifier', description: 'Version or alias', args: { name: 'qualifier' } }
    ]
  },
  {
    name: 'list-function-url-configs',
    description: 'List function URL configs',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Code signing operations
  {
    name: 'create-code-signing-config',
    description: 'Create a code signing config',
    options: [
      { name: '--description', description: 'Description', args: { name: 'desc' } },
      { name: '--allowed-publishers', description: 'Allowed publishers', args: { name: 'publishers' }, required: true },
      { name: '--code-signing-policies', description: 'Code signing policies', args: { name: 'policies' } }
    ]
  },
  {
    name: 'update-code-signing-config',
    description: 'Update a code signing config',
    options: [
      { name: '--code-signing-config-arn', description: 'Config ARN', args: { name: 'arn', generators: codeSigningConfigGenerator }, required: true },
      { name: '--description', description: 'Description', args: { name: 'desc' } },
      { name: '--allowed-publishers', description: 'Allowed publishers', args: { name: 'publishers' } },
      { name: '--code-signing-policies', description: 'Code signing policies', args: { name: 'policies' } }
    ]
  },
  {
    name: 'delete-code-signing-config',
    description: 'Delete a code signing config',
    options: [
      { name: '--code-signing-config-arn', description: 'Config ARN', args: { name: 'arn', generators: codeSigningConfigGenerator }, required: true }
    ]
  },
  {
    name: 'get-code-signing-config',
    description: 'Get code signing config details',
    options: [
      { name: '--code-signing-config-arn', description: 'Config ARN', args: { name: 'arn', generators: codeSigningConfigGenerator }, required: true }
    ]
  },
  {
    name: 'list-code-signing-configs',
    description: 'List code signing configs',
    options: [
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'put-function-code-signing-config',
    description: 'Attach code signing config to function',
    options: [
      { name: '--code-signing-config-arn', description: 'Config ARN', args: { name: 'arn', generators: codeSigningConfigGenerator }, required: true },
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true }
    ]
  },
  {
    name: 'delete-function-code-signing-config',
    description: 'Remove code signing config from function',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true }
    ]
  },
  {
    name: 'get-function-code-signing-config',
    description: 'Get function code signing config',
    options: [
      { name: '--function-name', description: 'Function name', args: { name: 'name', generators: lambdaFunctionGenerator }, required: true }
    ]
  },
  {
    name: 'list-functions-by-code-signing-config',
    description: 'List functions using a code signing config',
    options: [
      { name: '--code-signing-config-arn', description: 'Config ARN', args: { name: 'arn', generators: codeSigningConfigGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Tags
  {
    name: 'tag-resource',
    description: 'Add tags to a function',
    options: [
      { name: '--resource', description: 'Function ARN', args: { name: 'arn' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' }, required: true }
    ]
  },
  {
    name: 'untag-resource',
    description: 'Remove tags from a function',
    options: [
      { name: '--resource', description: 'Function ARN', args: { name: 'arn' }, required: true },
      { name: '--tag-keys', description: 'Tag keys', args: { name: 'keys', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'list-tags',
    description: 'List function tags',
    options: [
      { name: '--resource', description: 'Function ARN', args: { name: 'arn' }, required: true }
    ]
  }
];
