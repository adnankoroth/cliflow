// AWS IAM CLI completions
import { Subcommand } from '../../types.js';
import { s, iamRoleGenerator, iamUserGenerator, iamPolicyGenerator } from './_shared.js';

// IAM Group generator
const iamGroupGenerator = {
  script: 'aws iam list-groups --query "Groups[*].[GroupName]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(g => g.trim()).map(group => ({
      name: group.trim(),
      description: 'IAM Group',
      icon: '👥',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Instance profile generator
const instanceProfileGenerator = {
  script: 'aws iam list-instance-profiles --query "InstanceProfiles[*].[InstanceProfileName]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(p => p.trim()).map(profile => ({
      name: profile.trim(),
      description: 'IAM Instance Profile',
      icon: '📋',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// SAML provider generator
const samlProviderGenerator = {
  script: 'aws iam list-saml-providers --query "SAMLProviderList[*].Arn" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(a => a.trim()).map(arn => ({
      name: arn.trim(),
      description: 'SAML Provider',
      icon: '🔐',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// OIDC provider generator
const oidcProviderGenerator = {
  script: 'aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[*].Arn" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(a => a.trim()).map(arn => ({
      name: arn.trim(),
      description: 'OIDC Provider',
      icon: '🔐',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Server certificate generator
const serverCertificateGenerator = {
  script: 'aws iam list-server-certificates --query "ServerCertificateMetadataList[*].ServerCertificateName" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(c => c.trim()).map(cert => ({
      name: cert.trim(),
      description: 'Server Certificate',
      icon: '📜',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

// Access key generator (for current user)
const accessKeyGenerator = {
  script: 'aws iam list-access-keys --query "AccessKeyMetadata[*].[AccessKeyId,Status]" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.trim().split('\t');
      return {
        name: parts[0],
        description: `Access Key (${parts[1]})`,
        icon: '🔑',
        priority: 100
      };
    });
  },
  cache: { ttl: 30000, strategy: 'ttl' as const }
};

// MFA device generator
const mfaDeviceGenerator = {
  script: 'aws iam list-virtual-mfa-devices --query "VirtualMFADevices[*].SerialNumber" --output text 2>/dev/null',
  postProcess: (output: string) => {
    if (!output || output.trim() === '') return [];
    return output.split(/\s+/).filter(d => d.trim()).map(device => ({
      name: device.trim(),
      description: 'MFA Device',
      icon: '📱',
      priority: 100
    }));
  },
  cache: { ttl: 60000, strategy: 'ttl' as const }
};

export const iamSubcommands: Subcommand[] = [
  // User operations
  {
    name: 'list-users',
    description: 'List IAM users',
    options: [
      { name: '--path-prefix', description: 'Path prefix', args: { name: 'path' } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-user',
    description: 'Get IAM user details',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator } }
    ]
  },
  {
    name: 'create-user',
    description: 'Create an IAM user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name' }, required: true },
      { name: '--path', description: 'Path', args: { name: 'path' } },
      { name: '--permissions-boundary', description: 'Permissions boundary ARN', args: { name: 'arn' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-user',
    description: 'Delete an IAM user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true }
    ]
  },
  {
    name: 'update-user',
    description: 'Update an IAM user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--new-path', description: 'New path', args: { name: 'path' } },
      { name: '--new-user-name', description: 'New user name', args: { name: 'name' } }
    ]
  },
  // Group operations
  {
    name: 'list-groups',
    description: 'List IAM groups',
    options: [
      { name: '--path-prefix', description: 'Path prefix', args: { name: 'path' } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-group',
    description: 'Get IAM group details',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-group',
    description: 'Create an IAM group',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name' }, required: true },
      { name: '--path', description: 'Path', args: { name: 'path' } }
    ]
  },
  {
    name: 'delete-group',
    description: 'Delete an IAM group',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true }
    ]
  },
  {
    name: 'update-group',
    description: 'Update an IAM group',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--new-path', description: 'New path', args: { name: 'path' } },
      { name: '--new-group-name', description: 'New group name', args: { name: 'name' } }
    ]
  },
  {
    name: 'add-user-to-group',
    description: 'Add user to group',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true }
    ]
  },
  {
    name: 'remove-user-from-group',
    description: 'Remove user from group',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true }
    ]
  },
  {
    name: 'list-groups-for-user',
    description: 'List groups for a user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Role operations
  {
    name: 'list-roles',
    description: 'List IAM roles',
    options: [
      { name: '--path-prefix', description: 'Path prefix', args: { name: 'path' } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-role',
    description: 'Get IAM role details',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true }
    ]
  },
  {
    name: 'create-role',
    description: 'Create an IAM role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name' }, required: true },
      { name: '--assume-role-policy-document', description: 'Trust policy document', args: { name: 'policy' }, required: true },
      { name: '--path', description: 'Path', args: { name: 'path' } },
      { name: '--description', description: 'Role description', args: { name: 'desc' } },
      { name: '--max-session-duration', description: 'Max session duration (seconds)', args: { name: 'duration', suggestions: s('3600', '7200', '14400', '28800', '43200') } },
      { name: '--permissions-boundary', description: 'Permissions boundary ARN', args: { name: 'arn' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-role',
    description: 'Delete an IAM role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true }
    ]
  },
  {
    name: 'update-role',
    description: 'Update an IAM role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--description', description: 'Role description', args: { name: 'desc' } },
      { name: '--max-session-duration', description: 'Max session duration (seconds)', args: { name: 'duration' } }
    ]
  },
  {
    name: 'update-assume-role-policy',
    description: 'Update role trust policy',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--policy-document', description: 'Trust policy document', args: { name: 'policy' }, required: true }
    ]
  },
  {
    name: 'get-role-policy',
    description: 'Get role inline policy',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'policy' }, required: true }
    ]
  },
  {
    name: 'put-role-policy',
    description: 'Create/update role inline policy',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'policy' }, required: true },
      { name: '--policy-document', description: 'Policy document', args: { name: 'document' }, required: true }
    ]
  },
  {
    name: 'delete-role-policy',
    description: 'Delete role inline policy',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'policy' }, required: true }
    ]
  },
  {
    name: 'list-role-policies',
    description: 'List role inline policies',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'attach-role-policy',
    description: 'Attach managed policy to role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true }
    ]
  },
  {
    name: 'detach-role-policy',
    description: 'Detach managed policy from role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true }
    ]
  },
  {
    name: 'list-attached-role-policies',
    description: 'List attached managed policies for role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--path-prefix', description: 'Path prefix', args: { name: 'path' } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Policy operations
  {
    name: 'list-policies',
    description: 'List IAM policies',
    options: [
      { name: '--scope', description: 'Policy scope', args: { name: 'scope', suggestions: s('All', 'AWS', 'Local') } },
      { name: '--only-attached', description: 'Only attached policies' },
      { name: '--no-only-attached', description: 'All policies' },
      { name: '--path-prefix', description: 'Path prefix', args: { name: 'path' } },
      { name: '--policy-usage-filter', description: 'Usage filter', args: { name: 'filter', suggestions: s('PermissionsPolicy', 'PermissionsBoundary') } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-policy',
    description: 'Get IAM policy details',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true }
    ]
  },
  {
    name: 'create-policy',
    description: 'Create an IAM policy',
    options: [
      { name: '--policy-name', description: 'Policy name', args: { name: 'name' }, required: true },
      { name: '--policy-document', description: 'Policy document', args: { name: 'document' }, required: true },
      { name: '--path', description: 'Path', args: { name: 'path' } },
      { name: '--description', description: 'Policy description', args: { name: 'desc' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-policy',
    description: 'Delete an IAM policy',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true }
    ]
  },
  {
    name: 'get-policy-version',
    description: 'Get policy version',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true },
      { name: '--version-id', description: 'Version ID', args: { name: 'version', suggestions: s('v1', 'v2', 'v3', 'v4', 'v5') }, required: true }
    ]
  },
  {
    name: 'create-policy-version',
    description: 'Create a new policy version',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true },
      { name: '--policy-document', description: 'Policy document', args: { name: 'document' }, required: true },
      { name: '--set-as-default', description: 'Set as default version' },
      { name: '--no-set-as-default', description: 'Do not set as default' }
    ]
  },
  {
    name: 'delete-policy-version',
    description: 'Delete a policy version',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true },
      { name: '--version-id', description: 'Version ID', args: { name: 'version' }, required: true }
    ]
  },
  {
    name: 'list-policy-versions',
    description: 'List policy versions',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'set-default-policy-version',
    description: 'Set default policy version',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true },
      { name: '--version-id', description: 'Version ID', args: { name: 'version' }, required: true }
    ]
  },
  // User policy operations
  {
    name: 'get-user-policy',
    description: 'Get user inline policy',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'policy' }, required: true }
    ]
  },
  {
    name: 'put-user-policy',
    description: 'Create/update user inline policy',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'policy' }, required: true },
      { name: '--policy-document', description: 'Policy document', args: { name: 'document' }, required: true }
    ]
  },
  {
    name: 'delete-user-policy',
    description: 'Delete user inline policy',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'policy' }, required: true }
    ]
  },
  {
    name: 'list-user-policies',
    description: 'List user inline policies',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'attach-user-policy',
    description: 'Attach managed policy to user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true }
    ]
  },
  {
    name: 'detach-user-policy',
    description: 'Detach managed policy from user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true }
    ]
  },
  {
    name: 'list-attached-user-policies',
    description: 'List attached managed policies for user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--path-prefix', description: 'Path prefix', args: { name: 'path' } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Group policy operations
  {
    name: 'get-group-policy',
    description: 'Get group inline policy',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'policy' }, required: true }
    ]
  },
  {
    name: 'put-group-policy',
    description: 'Create/update group inline policy',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'policy' }, required: true },
      { name: '--policy-document', description: 'Policy document', args: { name: 'document' }, required: true }
    ]
  },
  {
    name: 'delete-group-policy',
    description: 'Delete group inline policy',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--policy-name', description: 'Policy name', args: { name: 'policy' }, required: true }
    ]
  },
  {
    name: 'list-group-policies',
    description: 'List group inline policies',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'attach-group-policy',
    description: 'Attach managed policy to group',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true }
    ]
  },
  {
    name: 'detach-group-policy',
    description: 'Detach managed policy from group',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true }
    ]
  },
  {
    name: 'list-attached-group-policies',
    description: 'List attached managed policies for group',
    options: [
      { name: '--group-name', description: 'Group name', args: { name: 'name', generators: iamGroupGenerator }, required: true },
      { name: '--path-prefix', description: 'Path prefix', args: { name: 'path' } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Instance profile operations
  {
    name: 'list-instance-profiles',
    description: 'List instance profiles',
    options: [
      { name: '--path-prefix', description: 'Path prefix', args: { name: 'path' } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-instance-profile',
    description: 'Get instance profile details',
    options: [
      { name: '--instance-profile-name', description: 'Instance profile name', args: { name: 'name', generators: instanceProfileGenerator }, required: true }
    ]
  },
  {
    name: 'create-instance-profile',
    description: 'Create an instance profile',
    options: [
      { name: '--instance-profile-name', description: 'Instance profile name', args: { name: 'name' }, required: true },
      { name: '--path', description: 'Path', args: { name: 'path' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-instance-profile',
    description: 'Delete an instance profile',
    options: [
      { name: '--instance-profile-name', description: 'Instance profile name', args: { name: 'name', generators: instanceProfileGenerator }, required: true }
    ]
  },
  {
    name: 'add-role-to-instance-profile',
    description: 'Add role to instance profile',
    options: [
      { name: '--instance-profile-name', description: 'Instance profile name', args: { name: 'name', generators: instanceProfileGenerator }, required: true },
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true }
    ]
  },
  {
    name: 'remove-role-from-instance-profile',
    description: 'Remove role from instance profile',
    options: [
      { name: '--instance-profile-name', description: 'Instance profile name', args: { name: 'name', generators: instanceProfileGenerator }, required: true },
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true }
    ]
  },
  {
    name: 'list-instance-profiles-for-role',
    description: 'List instance profiles for role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  // Access key operations
  {
    name: 'list-access-keys',
    description: 'List access keys',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-access-key',
    description: 'Create an access key',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator } }
    ]
  },
  {
    name: 'delete-access-key',
    description: 'Delete an access key',
    options: [
      { name: '--access-key-id', description: 'Access key ID', args: { name: 'id', generators: accessKeyGenerator }, required: true },
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator } }
    ]
  },
  {
    name: 'update-access-key',
    description: 'Update access key status',
    options: [
      { name: '--access-key-id', description: 'Access key ID', args: { name: 'id', generators: accessKeyGenerator }, required: true },
      { name: '--status', description: 'Key status', args: { name: 'status', suggestions: s('Active', 'Inactive') }, required: true },
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator } }
    ]
  },
  {
    name: 'get-access-key-last-used',
    description: 'Get access key last used info',
    options: [
      { name: '--access-key-id', description: 'Access key ID', args: { name: 'id', generators: accessKeyGenerator }, required: true }
    ]
  },
  // Password operations
  {
    name: 'create-login-profile',
    description: 'Create console password for user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--password', description: 'Password', args: { name: 'password' }, required: true },
      { name: '--password-reset-required', description: 'Require password reset' },
      { name: '--no-password-reset-required', description: 'No password reset required' }
    ]
  },
  {
    name: 'get-login-profile',
    description: 'Get login profile for user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true }
    ]
  },
  {
    name: 'update-login-profile',
    description: 'Update login profile for user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--password', description: 'Password', args: { name: 'password' } },
      { name: '--password-reset-required', description: 'Require password reset' },
      { name: '--no-password-reset-required', description: 'No password reset required' }
    ]
  },
  {
    name: 'delete-login-profile',
    description: 'Delete login profile for user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true }
    ]
  },
  {
    name: 'change-password',
    description: 'Change your IAM password',
    options: [
      { name: '--old-password', description: 'Current password', args: { name: 'password' }, required: true },
      { name: '--new-password', description: 'New password', args: { name: 'password' }, required: true }
    ]
  },
  {
    name: 'get-account-password-policy',
    description: 'Get account password policy'
  },
  {
    name: 'update-account-password-policy',
    description: 'Update account password policy',
    options: [
      { name: '--minimum-password-length', description: 'Minimum password length', args: { name: 'length', suggestions: s('8', '12', '14', '16', '20') } },
      { name: '--require-symbols', description: 'Require symbols' },
      { name: '--no-require-symbols', description: 'Do not require symbols' },
      { name: '--require-numbers', description: 'Require numbers' },
      { name: '--no-require-numbers', description: 'Do not require numbers' },
      { name: '--require-uppercase-characters', description: 'Require uppercase' },
      { name: '--no-require-uppercase-characters', description: 'Do not require uppercase' },
      { name: '--require-lowercase-characters', description: 'Require lowercase' },
      { name: '--no-require-lowercase-characters', description: 'Do not require lowercase' },
      { name: '--allow-users-to-change-password', description: 'Allow password change' },
      { name: '--no-allow-users-to-change-password', description: 'Disallow password change' },
      { name: '--max-password-age', description: 'Max password age (days)', args: { name: 'days', suggestions: s('30', '60', '90', '180', '365') } },
      { name: '--password-reuse-prevention', description: 'Password reuse prevention', args: { name: 'count', suggestions: s('1', '5', '10', '24') } },
      { name: '--hard-expiry', description: 'Hard password expiry' },
      { name: '--no-hard-expiry', description: 'No hard password expiry' }
    ]
  },
  {
    name: 'delete-account-password-policy',
    description: 'Delete account password policy'
  },
  // MFA operations
  {
    name: 'list-mfa-devices',
    description: 'List MFA devices',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'list-virtual-mfa-devices',
    description: 'List virtual MFA devices',
    options: [
      { name: '--assignment-status', description: 'Assignment status', args: { name: 'status', suggestions: s('Assigned', 'Unassigned', 'Any') } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'create-virtual-mfa-device',
    description: 'Create a virtual MFA device',
    options: [
      { name: '--virtual-mfa-device-name', description: 'MFA device name', args: { name: 'name' }, required: true },
      { name: '--outfile', description: 'Output file', args: { name: 'file', template: 'filepaths' }, required: true },
      { name: '--bootstrap-method', description: 'Bootstrap method', args: { name: 'method', suggestions: s('QRCodePNG', 'Base32StringSeed') }, required: true },
      { name: '--path', description: 'Path', args: { name: 'path' } },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'delete-virtual-mfa-device',
    description: 'Delete a virtual MFA device',
    options: [
      { name: '--serial-number', description: 'MFA device serial number', args: { name: 'serial', generators: mfaDeviceGenerator }, required: true }
    ]
  },
  {
    name: 'enable-mfa-device',
    description: 'Enable MFA device for user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--serial-number', description: 'MFA device serial number', args: { name: 'serial', generators: mfaDeviceGenerator }, required: true },
      { name: '--authentication-code1', description: 'First authentication code', args: { name: 'code' }, required: true },
      { name: '--authentication-code2', description: 'Second authentication code', args: { name: 'code' }, required: true }
    ]
  },
  {
    name: 'deactivate-mfa-device',
    description: 'Deactivate MFA device for user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--serial-number', description: 'MFA device serial number', args: { name: 'serial', generators: mfaDeviceGenerator }, required: true }
    ]
  },
  {
    name: 'resync-mfa-device',
    description: 'Resync MFA device',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--serial-number', description: 'MFA device serial number', args: { name: 'serial', generators: mfaDeviceGenerator }, required: true },
      { name: '--authentication-code1', description: 'First authentication code', args: { name: 'code' }, required: true },
      { name: '--authentication-code2', description: 'Second authentication code', args: { name: 'code' }, required: true }
    ]
  },
  // SAML/OIDC provider operations
  {
    name: 'list-saml-providers',
    description: 'List SAML providers'
  },
  {
    name: 'get-saml-provider',
    description: 'Get SAML provider details',
    options: [
      { name: '--saml-provider-arn', description: 'SAML provider ARN', args: { name: 'arn', generators: samlProviderGenerator }, required: true }
    ]
  },
  {
    name: 'create-saml-provider',
    description: 'Create a SAML provider',
    options: [
      { name: '--saml-metadata-document', description: 'SAML metadata document', args: { name: 'document' }, required: true },
      { name: '--name', description: 'Provider name', args: { name: 'name' }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'update-saml-provider',
    description: 'Update a SAML provider',
    options: [
      { name: '--saml-provider-arn', description: 'SAML provider ARN', args: { name: 'arn', generators: samlProviderGenerator }, required: true },
      { name: '--saml-metadata-document', description: 'SAML metadata document', args: { name: 'document' }, required: true }
    ]
  },
  {
    name: 'delete-saml-provider',
    description: 'Delete a SAML provider',
    options: [
      { name: '--saml-provider-arn', description: 'SAML provider ARN', args: { name: 'arn', generators: samlProviderGenerator }, required: true }
    ]
  },
  {
    name: 'list-open-id-connect-providers',
    description: 'List OIDC providers'
  },
  {
    name: 'get-open-id-connect-provider',
    description: 'Get OIDC provider details',
    options: [
      { name: '--open-id-connect-provider-arn', description: 'OIDC provider ARN', args: { name: 'arn', generators: oidcProviderGenerator }, required: true }
    ]
  },
  {
    name: 'create-open-id-connect-provider',
    description: 'Create an OIDC provider',
    options: [
      { name: '--url', description: 'Provider URL', args: { name: 'url' }, required: true },
      { name: '--client-id-list', description: 'Client IDs', args: { name: 'ids', isVariadic: true } },
      { name: '--thumbprint-list', description: 'Thumbprints', args: { name: 'thumbprints', isVariadic: true }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' } }
    ]
  },
  {
    name: 'update-open-id-connect-provider-thumbprint',
    description: 'Update OIDC provider thumbprints',
    options: [
      { name: '--open-id-connect-provider-arn', description: 'OIDC provider ARN', args: { name: 'arn', generators: oidcProviderGenerator }, required: true },
      { name: '--thumbprint-list', description: 'Thumbprints', args: { name: 'thumbprints', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'delete-open-id-connect-provider',
    description: 'Delete an OIDC provider',
    options: [
      { name: '--open-id-connect-provider-arn', description: 'OIDC provider ARN', args: { name: 'arn', generators: oidcProviderGenerator }, required: true }
    ]
  },
  // Account operations
  {
    name: 'get-account-summary',
    description: 'Get account summary'
  },
  {
    name: 'get-account-authorization-details',
    description: 'Get account authorization details',
    options: [
      { name: '--filter', description: 'Filter', args: { name: 'filter', suggestions: s('User', 'Role', 'Group', 'LocalManagedPolicy', 'AWSManagedPolicy'), isVariadic: true } },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'get-credential-report',
    description: 'Get credential report'
  },
  {
    name: 'generate-credential-report',
    description: 'Generate credential report'
  },
  // Service-linked roles
  {
    name: 'create-service-linked-role',
    description: 'Create a service-linked role',
    options: [
      { name: '--aws-service-name', description: 'AWS service name', args: { name: 'service' }, required: true },
      { name: '--description', description: 'Role description', args: { name: 'desc' } },
      { name: '--custom-suffix', description: 'Custom suffix', args: { name: 'suffix' } }
    ]
  },
  {
    name: 'delete-service-linked-role',
    description: 'Delete a service-linked role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true }
    ]
  },
  {
    name: 'get-service-linked-role-deletion-status',
    description: 'Get service-linked role deletion status',
    options: [
      { name: '--deletion-task-id', description: 'Deletion task ID', args: { name: 'id' }, required: true }
    ]
  },
  // Tags
  {
    name: 'tag-role',
    description: 'Add tags to role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' }, required: true }
    ]
  },
  {
    name: 'untag-role',
    description: 'Remove tags from role',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--tag-keys', description: 'Tag keys', args: { name: 'keys', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'list-role-tags',
    description: 'List role tags',
    options: [
      { name: '--role-name', description: 'Role name', args: { name: 'name', generators: iamRoleGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'tag-user',
    description: 'Add tags to user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' }, required: true }
    ]
  },
  {
    name: 'untag-user',
    description: 'Remove tags from user',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--tag-keys', description: 'Tag keys', args: { name: 'keys', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'list-user-tags',
    description: 'List user tags',
    options: [
      { name: '--user-name', description: 'User name', args: { name: 'name', generators: iamUserGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  },
  {
    name: 'tag-policy',
    description: 'Add tags to policy',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true },
      { name: '--tags', description: 'Tags', args: { name: 'tags' }, required: true }
    ]
  },
  {
    name: 'untag-policy',
    description: 'Remove tags from policy',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true },
      { name: '--tag-keys', description: 'Tag keys', args: { name: 'keys', isVariadic: true }, required: true }
    ]
  },
  {
    name: 'list-policy-tags',
    description: 'List policy tags',
    options: [
      { name: '--policy-arn', description: 'Policy ARN', args: { name: 'arn', generators: iamPolicyGenerator }, required: true },
      { name: '--max-items', description: 'Maximum items', args: { name: 'number' } },
      { name: '--page-size', description: 'Page size', args: { name: 'number' } },
      { name: '--starting-token', description: 'Starting token', args: { name: 'token' } }
    ]
  }
];
