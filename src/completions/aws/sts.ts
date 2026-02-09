// AWS STS CLI completions
import { Subcommand } from '../../types.js';
import { s, iamRoleGenerator, awsRegions } from './_shared.js';

export const stsSubcommands: Subcommand[] = [
  {
    name: 'get-caller-identity',
    description: 'Get details about the IAM identity making the call'
  },
  {
    name: 'get-access-key-info',
    description: 'Get account ID for an access key',
    options: [
      { name: '--access-key-id', description: 'Access key ID', args: { name: 'key-id' }, required: true }
    ]
  },
  {
    name: 'assume-role',
    description: 'Assume an IAM role',
    options: [
      { name: '--role-arn', description: 'Role ARN', args: { name: 'arn', generators: iamRoleGenerator }, required: true },
      { name: '--role-session-name', description: 'Session name', args: { name: 'name' }, required: true },
      { name: '--policy-arns', description: 'Policy ARNs', args: { name: 'arns' } },
      { name: '--policy', description: 'Session policy', args: { name: 'policy' } },
      { name: '--duration-seconds', description: 'Duration (seconds)', args: { name: 'seconds', suggestions: s('900', '1800', '3600', '7200', '14400', '28800', '43200') } },
      { name: '--tags', description: 'Session tags', args: { name: 'tags' } },
      { name: '--transitive-tag-keys', description: 'Transitive tag keys', args: { name: 'keys', isVariadic: true } },
      { name: '--external-id', description: 'External ID', args: { name: 'id' } },
      { name: '--serial-number', description: 'MFA device serial', args: { name: 'serial' } },
      { name: '--token-code', description: 'MFA token code', args: { name: 'code' } },
      { name: '--source-identity', description: 'Source identity', args: { name: 'identity' } },
      { name: '--provided-contexts', description: 'Provided contexts', args: { name: 'contexts' } }
    ]
  },
  {
    name: 'assume-role-with-saml',
    description: 'Assume role with SAML assertion',
    options: [
      { name: '--role-arn', description: 'Role ARN', args: { name: 'arn', generators: iamRoleGenerator }, required: true },
      { name: '--principal-arn', description: 'SAML provider ARN', args: { name: 'arn' }, required: true },
      { name: '--saml-assertion', description: 'SAML assertion', args: { name: 'assertion' }, required: true },
      { name: '--policy-arns', description: 'Policy ARNs', args: { name: 'arns' } },
      { name: '--policy', description: 'Session policy', args: { name: 'policy' } },
      { name: '--duration-seconds', description: 'Duration (seconds)', args: { name: 'seconds' } }
    ]
  },
  {
    name: 'assume-role-with-web-identity',
    description: 'Assume role with web identity token',
    options: [
      { name: '--role-arn', description: 'Role ARN', args: { name: 'arn', generators: iamRoleGenerator }, required: true },
      { name: '--role-session-name', description: 'Session name', args: { name: 'name' }, required: true },
      { name: '--web-identity-token', description: 'Web identity token', args: { name: 'token' }, required: true },
      { name: '--provider-id', description: 'Provider ID', args: { name: 'id' } },
      { name: '--policy-arns', description: 'Policy ARNs', args: { name: 'arns' } },
      { name: '--policy', description: 'Session policy', args: { name: 'policy' } },
      { name: '--duration-seconds', description: 'Duration (seconds)', args: { name: 'seconds' } }
    ]
  },
  {
    name: 'get-federation-token',
    description: 'Get federation token for federated user',
    options: [
      { name: '--name', description: 'Federated user name', args: { name: 'name' }, required: true },
      { name: '--policy', description: 'Session policy', args: { name: 'policy' } },
      { name: '--policy-arns', description: 'Policy ARNs', args: { name: 'arns' } },
      { name: '--duration-seconds', description: 'Duration (seconds)', args: { name: 'seconds', suggestions: s('900', '1800', '3600', '7200', '14400', '28800', '43200', '129600') } },
      { name: '--tags', description: 'Session tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'get-session-token',
    description: 'Get session token for MFA-protected API access',
    options: [
      { name: '--duration-seconds', description: 'Duration (seconds)', args: { name: 'seconds', suggestions: s('900', '1800', '3600', '7200', '14400', '28800', '43200', '129600') } },
      { name: '--serial-number', description: 'MFA device serial', args: { name: 'serial' } },
      { name: '--token-code', description: 'MFA token code', args: { name: 'code' } }
    ]
  },
  {
    name: 'decode-authorization-message',
    description: 'Decode an encoded authorization failure message',
    options: [
      { name: '--encoded-message', description: 'Encoded message', args: { name: 'message' }, required: true }
    ]
  }
];
