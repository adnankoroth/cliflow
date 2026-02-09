// Shared utilities, generators, and types for AWS CLI completions
import { Generator, Suggestion } from '../../types.js';

// Helper to create simple suggestions
export const s = (...names: string[]): Suggestion[] => names.map(name => ({ name }));

// AWS Regions list (static, rarely changes)
export const awsRegions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'af-south-1', 'ap-east-1', 'ap-south-1', 'ap-south-2',
  'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
  'ap-southeast-1', 'ap-southeast-2', 'ap-southeast-3', 'ap-southeast-4',
  'ca-central-1', 'ca-west-1',
  'eu-central-1', 'eu-central-2', 'eu-west-1', 'eu-west-2', 'eu-west-3',
  'eu-south-1', 'eu-south-2', 'eu-north-1',
  'il-central-1', 'me-south-1', 'me-central-1',
  'sa-east-1'
];

// Output formats
export const outputFormats = ['json', 'text', 'table', 'yaml', 'yaml-stream'];

// Profile generator - must be declared before globalOptions
export const awsProfileGenerator: Generator = {
  script: 'aws configure list-profiles 2>/dev/null || cat ~/.aws/credentials 2>/dev/null | grep "^\\[" | tr -d "[]"',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => ({
      name: line.trim(),
      description: 'AWS Profile',
      icon: '👤',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Region generator (dynamic)
export const awsRegionGenerator: Generator = {
  script: 'aws ec2 describe-regions --query "Regions[].RegionName" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') {
      // Fall back to static list
      return awsRegions.map(r => ({ name: r, description: 'AWS Region', icon: '🌍' }));
    }
    return output.split(/\s+/).filter(r => r.trim()).map(region => ({
      name: region.trim(),
      description: 'AWS Region',
      icon: '🌍',
      priority: 100
    }));
  },
  cache: { ttl: 300000, strategy: 'ttl' as const }
};

// Common AWS CLI global options (declared after generators that it uses)
export const globalOptions = [
  { name: '--profile', description: 'Use a specific profile from your credential file', args: { name: 'profile', generators: awsProfileGenerator } },
  { name: '--region', description: 'The region to use', args: { name: 'region', suggestions: s(...awsRegions) } },
  { name: '--output', description: 'The formatting style for command output', args: { name: 'format', suggestions: s(...outputFormats) } },
  { name: '--endpoint-url', description: 'Override command endpoint URL', args: { name: 'url' } },
  { name: '--no-verify-ssl', description: 'Do not verify SSL certificates' },
  { name: '--no-paginate', description: 'Disable automatic pagination' },
  { name: '--no-sign-request', description: 'Do not sign requests' },
  { name: '--ca-bundle', description: 'CA certificate bundle to use', args: { name: 'path', template: 'filepaths' } },
  { name: '--cli-connect-timeout', description: 'TCP connection timeout (seconds)', args: { name: 'seconds' } },
  { name: '--cli-read-timeout', description: 'Read timeout (seconds)', args: { name: 'seconds' } },
  { name: '--debug', description: 'Turn on debug logging' },
  { name: '--query', description: 'JMESPath query string', args: { name: 'query' } },
  { name: '--color', description: 'Turn on/off color output', args: { name: 'value', suggestions: s('on', 'off', 'auto') } },
  { name: '--no-cli-pager', description: 'Disable CLI pager for output' },
  { name: '--cli-auto-prompt', description: 'Automatically prompt for CLI input parameters' },
  { name: '--no-cli-auto-prompt', description: 'Disable automatic prompt for CLI input parameters' }
];

// S3 bucket generator
export const s3BucketGenerator: Generator = {
  script: 'aws s3 ls 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split(/\s+/);
      const bucketName = parts[2];
      if (!bucketName) return null;
      return {
        name: bucketName,
        description: `S3 Bucket (created ${parts[0]})`,
        icon: '🪣',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// S3 URI generator (buckets with s3:// prefix)
export const s3UriGenerator: Generator = {
  script: 'aws s3 ls 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split(/\s+/);
      const bucketName = parts[2];
      if (!bucketName) return null;
      return {
        name: `s3://${bucketName}/`,
        description: `S3 Bucket`,
        icon: '🪣',
        priority: 100
      };
    }).filter(Boolean) as Suggestion[];
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// EC2 instance generator
export const ec2InstanceGenerator: Generator = {
  script: 'aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,Tags[?Key==\'Name\'].Value|[0],State.Name]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      const instanceId = parts[0];
      const name = parts[1] || 'unnamed';
      const state = parts[2] || 'unknown';
      return {
        name: instanceId,
        description: `${name} (${state})`,
        icon: state === 'running' ? '🟢' : state === 'stopped' ? '🔴' : '🟡',
        priority: state === 'running' ? 100 : 50
      };
    });
  },
  cache: { ttl: 15000, strategy: 'ttl' as const }
};

// Lambda function generator
export const lambdaFunctionGenerator: Generator = {
  script: 'aws lambda list-functions --query "Functions[].FunctionName" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(fn => fn.trim()).map(fn => ({
      name: fn.trim(),
      description: 'Lambda Function',
      icon: 'λ',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// IAM role generator
export const iamRoleGenerator: Generator = {
  script: 'aws iam list-roles --query "Roles[].RoleName" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(role => role.trim()).map(role => ({
      name: role.trim(),
      description: 'IAM Role',
      icon: '🔐',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// IAM user generator
export const iamUserGenerator: Generator = {
  script: 'aws iam list-users --query "Users[].UserName" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(user => user.trim()).map(user => ({
      name: user.trim(),
      description: 'IAM User',
      icon: '👤',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// IAM policy ARN generator
export const iamPolicyGenerator: Generator = {
  script: 'aws iam list-policies --scope Local --query "Policies[].[PolicyName,Arn]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[1] || parts[0],
        description: parts[0],
        icon: '📜',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// EKS cluster generator
export const eksClusterGenerator: Generator = {
  script: 'aws eks list-clusters --query "clusters" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(c => c.trim()).map(cluster => ({
      name: cluster.trim(),
      description: 'EKS Cluster',
      icon: '☸️',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// ECS cluster generator
export const ecsClusterGenerator: Generator = {
  script: 'aws ecs list-clusters --query "clusterArns" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(c => c.trim()).map(arn => {
      const name = arn.split('/').pop() || arn;
      return {
        name: name,
        description: 'ECS Cluster',
        icon: '🐳',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// DynamoDB table generator
export const dynamodbTableGenerator: Generator = {
  script: 'aws dynamodb list-tables --query "TableNames" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(t => t.trim()).map(table => ({
      name: table.trim(),
      description: 'DynamoDB Table',
      icon: '📊',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// RDS instance generator
export const rdsInstanceGenerator: Generator = {
  script: 'aws rds describe-db-instances --query "DBInstances[].DBInstanceIdentifier" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(i => i.trim()).map(instance => ({
      name: instance.trim(),
      description: 'RDS Instance',
      icon: '🗄️',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// CloudFormation stack generator
export const cfnStackGenerator: Generator = {
  script: 'aws cloudformation list-stacks --query "StackSummaries[?StackStatus!=\'DELETE_COMPLETE\'].StackName" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(stack => ({
      name: stack.trim(),
      description: 'CloudFormation Stack',
      icon: '📦',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// CloudWatch log group generator
export const cwLogGroupGenerator: Generator = {
  script: 'aws logs describe-log-groups --query "logGroups[].logGroupName" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(g => g.trim()).map(group => ({
      name: group.trim(),
      description: 'CloudWatch Log Group',
      icon: '📋',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// SNS topic generator
export const snsTopicGenerator: Generator = {
  script: 'aws sns list-topics --query "Topics[].TopicArn" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(t => t.trim()).map(arn => {
      const name = arn.split(':').pop() || arn;
      return {
        name: arn,
        description: name,
        icon: '📢',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// SQS queue generator
export const sqsQueueGenerator: Generator = {
  script: 'aws sqs list-queues --query "QueueUrls" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(q => q.trim()).map(url => {
      const name = url.split('/').pop() || url;
      return {
        name: url,
        description: name,
        icon: '📬',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Secrets Manager secret generator
export const secretsManagerGenerator: Generator = {
  script: 'aws secretsmanager list-secrets --query "SecretList[].Name" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(secret => ({
      name: secret.trim(),
      description: 'Secret',
      icon: '🔑',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// SSM Parameter generator
export const ssmParameterGenerator: Generator = {
  script: 'aws ssm describe-parameters --query "Parameters[].Name" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(p => p.trim()).map(param => ({
      name: param.trim(),
      description: 'SSM Parameter',
      icon: '⚙️',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// KMS key generator
export const kmsKeyGenerator: Generator = {
  script: 'aws kms list-aliases --query "Aliases[].AliasName" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(k => k.trim()).map(key => ({
      name: key.trim(),
      description: 'KMS Key Alias',
      icon: '🔐',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// VPC generator
export const vpcGenerator: Generator = {
  script: 'aws ec2 describe-vpcs --query "Vpcs[].[VpcId,Tags[?Key==\'Name\'].Value|[0]]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'VPC',
        icon: '🌐',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Subnet generator
export const subnetGenerator: Generator = {
  script: 'aws ec2 describe-subnets --query "Subnets[].[SubnetId,Tags[?Key==\'Name\'].Value|[0],CidrBlock]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: `${parts[1] || 'Subnet'} (${parts[2]})`,
        icon: '🔌',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Security group generator
export const securityGroupGenerator: Generator = {
  script: 'aws ec2 describe-security-groups --query "SecurityGroups[].[GroupId,GroupName]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Security Group',
        icon: '🛡️',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// ECR repository generator
export const ecrRepositoryGenerator: Generator = {
  script: 'aws ecr describe-repositories --query "repositories[].repositoryName" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(r => r.trim()).map(repo => ({
      name: repo.trim(),
      description: 'ECR Repository',
      icon: '📦',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// ACM certificate generator
export const acmCertificateGenerator: Generator = {
  script: 'aws acm list-certificates --query "CertificateSummaryList[].[CertificateArn,DomainName]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'Certificate',
        icon: '📜',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Route 53 hosted zone generator
export const route53ZoneGenerator: Generator = {
  script: 'aws route53 list-hosted-zones --query "HostedZones[].[Id,Name]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      const id = parts[0].replace('/hostedzone/', '');
      return {
        name: id,
        description: parts[1] || 'Hosted Zone',
        icon: '🌐',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// API Gateway REST API generator
export const apiGatewayGenerator: Generator = {
  script: 'aws apigateway get-rest-apis --query "items[].[id,name]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'REST API',
        icon: '🔗',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// ElastiCache cluster generator
export const elasticacheClusterGenerator: Generator = {
  script: 'aws elasticache describe-cache-clusters --query "CacheClusters[].CacheClusterId" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(c => c.trim()).map(cluster => ({
      name: cluster.trim(),
      description: 'ElastiCache Cluster',
      icon: '⚡',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Step Functions state machine generator
export const stepFunctionsGenerator: Generator = {
  script: 'aws stepfunctions list-state-machines --query "stateMachines[].[stateMachineArn,name]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'State Machine',
        icon: '🔄',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// EventBridge rule generator  
export const eventBridgeRuleGenerator: Generator = {
  script: 'aws events list-rules --query "Rules[].Name" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(r => r.trim()).map(rule => ({
      name: rule.trim(),
      description: 'EventBridge Rule',
      icon: '📅',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// Cognito User Pool generator
export const cognitoUserPoolGenerator: Generator = {
  script: 'aws cognito-idp list-user-pools --max-results 60 --query "UserPools[].[Id,Name]" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: parts[1] || 'User Pool',
        icon: '👥',
        priority: 100
      };
    });
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Glue database generator
export const glueDatabaseGenerator: Generator = {
  script: 'aws glue get-databases --query "DatabaseList[].Name" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(d => d.trim()).map(db => ({
      name: db.trim(),
      description: 'Glue Database',
      icon: '🗃️',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Athena workgroup generator
export const athenaWorkgroupGenerator: Generator = {
  script: 'aws athena list-work-groups --query "WorkGroups[].Name" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(w => w.trim()).map(workgroup => ({
      name: workgroup.trim(),
      description: 'Athena Workgroup',
      icon: '🔍',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Redshift cluster generator
export const redshiftClusterGenerator: Generator = {
  script: 'aws redshift describe-clusters --query "Clusters[].ClusterIdentifier" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(c => c.trim()).map(cluster => ({
      name: cluster.trim(),
      description: 'Redshift Cluster',
      icon: '📊',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Kinesis stream generator
export const kinesisStreamGenerator: Generator = {
  script: 'aws kinesis list-streams --query "StreamNames" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(s => s.trim()).map(stream => ({
      name: stream.trim(),
      description: 'Kinesis Stream',
      icon: '🌊',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// SageMaker endpoint generator
export const sagemakerEndpointGenerator: Generator = {
  script: 'aws sagemaker list-endpoints --query "Endpoints[].EndpointName" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(e => e.trim()).map(endpoint => ({
      name: endpoint.trim(),
      description: 'SageMaker Endpoint',
      icon: '🤖',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// CodeBuild project generator
export const codebuildProjectGenerator: Generator = {
  script: 'aws codebuild list-projects --query "projects" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(p => p.trim()).map(project => ({
      name: project.trim(),
      description: 'CodeBuild Project',
      icon: '🔨',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// CodePipeline pipeline generator
export const codepipelinePipelineGenerator: Generator = {
  script: 'aws codepipeline list-pipelines --query "pipelines[].name" --output text 2>/dev/null',
  postProcess: (output) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(p => p.trim()).map(pipeline => ({
      name: pipeline.trim(),
      description: 'CodePipeline',
      icon: '🔧',
      priority: 100
    }));
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};
