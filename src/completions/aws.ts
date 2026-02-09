import { CompletionSpec, Subcommand, Generator } from '../types.js';
import { globalOptions, awsProfileGenerator, awsRegionGenerator, s } from './aws/_shared.js';

// Import service-specific subcommands - core services
import { s3Subcommands, s3apiSubcommands } from './aws/s3.js';
import { ec2Subcommands } from './aws/ec2.js';
import { lambdaSubcommands } from './aws/lambda.js';
import { iamSubcommands } from './aws/iam.js';
import { eksSubcommands } from './aws/eks.js';
import { stsSubcommands } from './aws/sts.js';
import { cloudformationSubcommands } from './aws/cloudformation.js';
import { dynamodbSubcommands } from './aws/dynamodb.js';
import { ecsSubcommands } from './aws/ecs.js';
import { rdsSubcommands } from './aws/rds.js';
import { logsSubcommands } from './aws/logs.js';
import { ssmSubcommands } from './aws/ssm.js';

// Additional services (auto-converted from Fig)
import { snsSubcommands } from './aws/sns.js';
import { sqsSubcommands } from './aws/sqs.js';
import { secretsmanagerSubcommands } from './aws/secretsmanager.js';
import { kmsSubcommands } from './aws/kms.js';
import { ecrSubcommands } from './aws/ecr.js';
import { cloudwatchSubcommands } from './aws/cloudwatch.js';
import { route53Subcommands } from './aws/route53.js';
import { apigatewaySubcommands } from './aws/apigateway.js';
import { apigatewayv2Subcommands } from './aws/apigatewayv2.js';
import { eventsSubcommands } from './aws/events.js';
import { stepfunctionsSubcommands } from './aws/stepfunctions.js';
import { codebuildSubcommands } from './aws/codebuild.js';
import { codepipelineSubcommands } from './aws/codepipeline.js';
import { codecommitSubcommands } from './aws/codecommit.js';
import { guarddutySubcommands } from './aws/guardduty.js';
import { securityhubSubcommands } from './aws/securityhub.js';
import { wafv2Subcommands } from './aws/wafv2.js';
import { acmSubcommands } from './aws/acm.js';
import { organizationsSubcommands } from './aws/organizations.js';
import { cloudtrailSubcommands } from './aws/cloudtrail.js';
import { elasticacheSubcommands } from './aws/elasticache.js';
import { redshiftSubcommands } from './aws/redshift.js';
import { athenaSubcommands } from './aws/athena.js';
import { glueSubcommands } from './aws/glue.js';
import { kinesisSubcommands } from './aws/kinesis.js';
import { firehoseSubcommands } from './aws/firehose.js';
import { bedrockSubcommands } from './aws/bedrock.js';
import { sagemakerSubcommands } from './aws/sagemaker.js';
import { cognitoidpSubcommands } from './aws/cognito-idp.js';
import { cognitoidentitySubcommands } from './aws/cognito-identity.js';
import { elbv2Subcommands } from './aws/elbv2.js';
import { elbSubcommands } from './aws/elb.js';
import { autoscalingSubcommands } from './aws/autoscaling.js';
import { backupSubcommands } from './aws/backup.js';
import { transferSubcommands } from './aws/transfer.js';
import { sesv2Subcommands } from './aws/sesv2.js';

const awsOutputFormats = s('json', 'text', 'table', 'yaml', 'yaml-stream');
const awsColors = s('on', 'off', 'auto');

const awsSubcommandGenerator: Generator = {
  script: 'aws help 2>/dev/null',
  postProcess: (output: string) => {
    if (!output) return [];
    return output
      .split('\n')
      .map(line => line.trimEnd())
      .map(line => line.match(/^\s{2,}([a-z0-9][\w-]+)\s+(.*)$/i))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map(match => ({
        name: match[1],
        description: match[2]?.trim() || 'AWS command',
        type: 'subcommand' as const,
        priority: 90
      }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const awsSpec: CompletionSpec = {
  name: 'aws',
  description: 'AWS Command Line Interface',
  generateSpec: awsSubcommandGenerator,
  options: [
    ...globalOptions,
    {
      name: '--profile',
      description: 'Use a specific profile from your credential file',
      args: { name: 'profile-name', generators: awsProfileGenerator, filterStrategy: 'fuzzy' }
    },
    {
      name: '--region',
      description: 'The region to use. Overrides config/env settings',
      args: { name: 'region-name', generators: awsRegionGenerator, filterStrategy: 'fuzzy' }
    },
    {
      name: '--output',
      description: 'The formatting style for command output',
      args: { name: 'format', suggestions: awsOutputFormats }
    },
    {
      name: '--color',
      description: 'Turn on/off color output',
      args: { name: 'color', suggestions: awsColors }
    }
  ],
  subcommands: [
    // Core configuration
    {
      name: 'configure',
      description: 'Configure AWS CLI settings',
      subcommands: [
        { name: 'list', description: 'List configuration data' },
        { name: 'list-profiles', description: 'List all profile names' },
        {
          name: 'get',
          description: 'Get a configuration variable',
          args: {
            name: 'varname',
            suggestions: s('aws_access_key_id', 'aws_secret_access_key', 'region', 'output')
          }
        },
        {
          name: 'set',
          description: 'Set a configuration variable',
          args: [
            { name: 'varname', suggestions: s('aws_access_key_id', 'aws_secret_access_key', 'region', 'output') },
            { name: 'value' }
          ]
        },
        { name: 'sso', description: 'Configure AWS SSO' },
        { name: 'sso-session', description: 'Configure AWS SSO session' },
        { name: 'import', description: 'Import CSV credentials' },
        { name: 'export-credentials', description: 'Export credentials' },
        {
          name: 'add-model',
          description: 'Add custom service model',
          options: [
            { name: '--service-model', description: 'Service model file', args: { name: 'file', template: 'filepaths' } },
            { name: '--service-name', description: 'Service name', args: { name: 'name' } }
          ]
        }
      ]
    },
    { name: 'help', description: 'Display help information about AWS CLI', args: { name: 'command', isOptional: true } },

    // Storage - S3
    {
      name: 's3',
      description: 'High-level S3 commands (cp, mv, sync, etc.)',
      subcommands: s3Subcommands as Subcommand[]
    },
    {
      name: 's3api',
      description: 'Low-level S3 API commands',
      subcommands: s3apiSubcommands as Subcommand[]
    },

    // Compute - EC2
    {
      name: 'ec2',
      description: 'Amazon EC2 - Elastic Compute Cloud',
      subcommands: ec2Subcommands as Subcommand[]
    },

    // Compute - Lambda
    {
      name: 'lambda',
      description: 'AWS Lambda - Serverless compute',
      subcommands: lambdaSubcommands as Subcommand[]
    },

    // Containers - ECS
    {
      name: 'ecs',
      description: 'Amazon ECS - Elastic Container Service',
      subcommands: ecsSubcommands as Subcommand[]
    },

    // Containers - EKS
    {
      name: 'eks',
      description: 'Amazon EKS - Elastic Kubernetes Service',
      subcommands: eksSubcommands as Subcommand[]
    },

    // Databases - RDS
    {
      name: 'rds',
      description: 'Amazon RDS - Relational Database Service',
      subcommands: rdsSubcommands as Subcommand[]
    },

    // Databases - DynamoDB
    {
      name: 'dynamodb',
      description: 'Amazon DynamoDB - NoSQL database',
      subcommands: dynamodbSubcommands as Subcommand[]
    },

    // Security - IAM
    {
      name: 'iam',
      description: 'AWS IAM - Identity and Access Management',
      subcommands: iamSubcommands as Subcommand[]
    },

    // Security - STS
    {
      name: 'sts',
      description: 'AWS STS - Security Token Service',
      subcommands: stsSubcommands as Subcommand[]
    },

    // Infrastructure - CloudFormation
    {
      name: 'cloudformation',
      description: 'AWS CloudFormation - Infrastructure as Code',
      subcommands: cloudformationSubcommands as Subcommand[]
    },

    // Monitoring - CloudWatch Logs
    {
      name: 'logs',
      description: 'Amazon CloudWatch Logs',
      subcommands: logsSubcommands as Subcommand[]
    },

    // Management - SSM
    {
      name: 'ssm',
      description: 'AWS Systems Manager',
      subcommands: ssmSubcommands as Subcommand[]
    },

    // Messaging
    { name: 'sns', description: 'Amazon SNS - Simple Notification Service', subcommands: snsSubcommands as Subcommand[] },
    { name: 'sqs', description: 'Amazon SQS - Simple Queue Service', subcommands: sqsSubcommands as Subcommand[] },
    { name: 'events', description: 'Amazon EventBridge', subcommands: eventsSubcommands as Subcommand[] },
    
    // Security
    { name: 'secretsmanager', description: 'AWS Secrets Manager', subcommands: secretsmanagerSubcommands as Subcommand[] },
    { name: 'kms', description: 'AWS KMS - Key Management Service', subcommands: kmsSubcommands as Subcommand[] },
    { name: 'acm', description: 'AWS ACM - Certificate Manager', subcommands: acmSubcommands as Subcommand[] },
    { name: 'guardduty', description: 'Amazon GuardDuty', subcommands: guarddutySubcommands as Subcommand[] },
    { name: 'securityhub', description: 'AWS Security Hub', subcommands: securityhubSubcommands as Subcommand[] },
    { name: 'wafv2', description: 'AWS WAF V2', subcommands: wafv2Subcommands as Subcommand[] },
    
    // Containers
    { name: 'ecr', description: 'Amazon ECR - Elastic Container Registry', subcommands: ecrSubcommands as Subcommand[] },
    
    // Networking
    { name: 'route53', description: 'Amazon Route 53', subcommands: route53Subcommands as Subcommand[] },
    { name: 'elbv2', description: 'Elastic Load Balancing V2', subcommands: elbv2Subcommands as Subcommand[] },
    { name: 'elb', description: 'Elastic Load Balancing Classic', subcommands: elbSubcommands as Subcommand[] },
    { name: 'apigateway', description: 'Amazon API Gateway (REST)', subcommands: apigatewaySubcommands as Subcommand[] },
    { name: 'apigatewayv2', description: 'Amazon API Gateway V2 (HTTP/WebSocket)', subcommands: apigatewayv2Subcommands as Subcommand[] },
    
    // Monitoring
    { name: 'cloudwatch', description: 'Amazon CloudWatch Metrics', subcommands: cloudwatchSubcommands as Subcommand[] },
    { name: 'cloudtrail', description: 'AWS CloudTrail', subcommands: cloudtrailSubcommands as Subcommand[] },
    
    // Compute
    { name: 'autoscaling', description: 'EC2 Auto Scaling', subcommands: autoscalingSubcommands as Subcommand[] },
    
    // Databases
    { name: 'elasticache', description: 'Amazon ElastiCache', subcommands: elasticacheSubcommands as Subcommand[] },
    { name: 'redshift', description: 'Amazon Redshift', subcommands: redshiftSubcommands as Subcommand[] },
    
    // Analytics
    { name: 'athena', description: 'Amazon Athena', subcommands: athenaSubcommands as Subcommand[] },
    { name: 'glue', description: 'AWS Glue', subcommands: glueSubcommands as Subcommand[] },
    { name: 'kinesis', description: 'Amazon Kinesis', subcommands: kinesisSubcommands as Subcommand[] },
    { name: 'firehose', description: 'Amazon Kinesis Data Firehose', subcommands: firehoseSubcommands as Subcommand[] },
    
    // CI/CD
    { name: 'codebuild', description: 'AWS CodeBuild', subcommands: codebuildSubcommands as Subcommand[] },
    { name: 'codepipeline', description: 'AWS CodePipeline', subcommands: codepipelineSubcommands as Subcommand[] },
    { name: 'codecommit', description: 'AWS CodeCommit', subcommands: codecommitSubcommands as Subcommand[] },
    { name: 'stepfunctions', description: 'AWS Step Functions', subcommands: stepfunctionsSubcommands as Subcommand[] },
    
    // AI/ML
    { name: 'bedrock', description: 'Amazon Bedrock', subcommands: bedrockSubcommands as Subcommand[] },
    { name: 'sagemaker', description: 'Amazon SageMaker', subcommands: sagemakerSubcommands as Subcommand[] },
    
    // Identity
    { name: 'cognito-idp', description: 'Amazon Cognito User Pools', subcommands: cognitoidpSubcommands as Subcommand[] },
    { name: 'cognito-identity', description: 'Amazon Cognito Identity', subcommands: cognitoidentitySubcommands as Subcommand[] },
    { name: 'organizations', description: 'AWS Organizations', subcommands: organizationsSubcommands as Subcommand[] },
    
    // SSO / IAM Identity Center
    {
      name: 'sso',
      description: 'AWS IAM Identity Center (SSO)',
      subcommands: [
        {
          name: 'login',
          description: 'Login to AWS IAM Identity Center and cache credentials',
          options: [
            { name: '--profile', description: 'Named profile to use', args: { name: 'profile' } },
            { name: '--no-browser', description: 'Do not automatically open the browser' },
            { name: '--sso-session', description: 'SSO session name', args: { name: 'session' } }
          ]
        },
        {
          name: 'logout',
          description: 'Logout from AWS IAM Identity Center',
          options: [
            { name: '--profile', description: 'Named profile to use', args: { name: 'profile' } },
            { name: '--sso-session', description: 'SSO session name', args: { name: 'session' } }
          ]
        },
        { name: 'get-role-credentials', description: 'Get short-term credentials for a role' },
        { name: 'list-account-roles', description: 'List roles for an account' },
        { name: 'list-accounts', description: 'List accounts available to the user' }
      ]
    },
    
    // Other
    { name: 'backup', description: 'AWS Backup', subcommands: backupSubcommands as Subcommand[] },
    { name: 'transfer', description: 'AWS Transfer Family', subcommands: transferSubcommands as Subcommand[] },
    { name: 'sesv2', description: 'Amazon SES V2', subcommands: sesv2Subcommands as Subcommand[] },

    // Services with stubs (can be expanded later from aws/ folder)
    { name: 'ecr-public', description: 'Amazon ECR Public' },
    { name: 'workspaces', description: 'Amazon WorkSpaces' },
    { name: 'appstream', description: 'Amazon AppStream 2.0' },
    { name: 'inspector2', description: 'Amazon Inspector' },
    { name: 'config', description: 'AWS Config' }
  ]
};

