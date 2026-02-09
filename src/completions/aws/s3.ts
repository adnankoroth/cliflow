// AWS S3 CLI completions
import { Subcommand } from '../../types.js';
import { s, s3BucketGenerator, s3UriGenerator, globalOptions } from './_shared.js';

const storageClasses = ['STANDARD', 'REDUCED_REDUNDANCY', 'STANDARD_IA', 'ONEZONE_IA', 'INTELLIGENT_TIERING', 'GLACIER', 'GLACIER_IR', 'DEEP_ARCHIVE'];
const acl = ['private', 'public-read', 'public-read-write', 'authenticated-read', 'aws-exec-read', 'bucket-owner-read', 'bucket-owner-full-control', 'log-delivery-write'];
const sseOptions = ['AES256', 'aws:kms', 'aws:kms:dsse'];
const metadataDirective = ['COPY', 'REPLACE'];

const commonCopyOptions = [
  { name: '--dryrun', description: 'Display operations without executing them' },
  { name: '--quiet', description: 'Does not display operations performed' },
  { name: '--include', description: 'Include files matching pattern', args: { name: 'pattern' } },
  { name: '--exclude', description: 'Exclude files matching pattern', args: { name: 'pattern' } },
  { name: '--acl', description: 'ACL for the object', args: { name: 'acl', suggestions: s(...acl) } },
  { name: '--follow-symlinks', description: 'Follow symbolic links' },
  { name: '--no-follow-symlinks', description: 'Do not follow symbolic links' },
  { name: '--no-guess-mime-type', description: 'Do not guess MIME type' },
  { name: '--sse', description: 'Server-side encryption', args: { name: 'method', suggestions: s(...sseOptions) } },
  { name: '--sse-c', description: 'Server-side encryption with customer key', args: { name: 'algorithm', suggestions: s('AES256') } },
  { name: '--sse-c-key', description: 'Customer encryption key', args: { name: 'key' } },
  { name: '--sse-kms-key-id', description: 'KMS key ID for SSE-KMS', args: { name: 'key-id' } },
  { name: '--sse-c-copy-source', description: 'SSE-C algorithm for source', args: { name: 'algorithm' } },
  { name: '--sse-c-copy-source-key', description: 'SSE-C key for source', args: { name: 'key' } },
  { name: '--storage-class', description: 'Storage class', args: { name: 'class', suggestions: s(...storageClasses) } },
  { name: '--grants', description: 'Grant permissions', args: { name: 'grants' } },
  { name: '--website-redirect', description: 'Redirect location for website', args: { name: 'url' } },
  { name: '--content-type', description: 'Content type', args: { name: 'mime-type' } },
  { name: '--cache-control', description: 'Cache control header', args: { name: 'header' } },
  { name: '--content-disposition', description: 'Content disposition header', args: { name: 'header' } },
  { name: '--content-encoding', description: 'Content encoding', args: { name: 'encoding' } },
  { name: '--content-language', description: 'Content language', args: { name: 'language' } },
  { name: '--expires', description: 'Expiration date', args: { name: 'date' } },
  { name: '--source-region', description: 'Source region for cross-region copy', args: { name: 'region' } },
  { name: '--only-show-errors', description: 'Only show errors' },
  { name: '--no-progress', description: 'Do not show progress' },
  { name: '--page-size', description: 'Page size for list operations', args: { name: 'size' } },
  { name: '--ignore-glacier-warnings', description: 'Ignore Glacier warnings' },
  { name: '--force-glacier-transfer', description: 'Force transfer of Glacier objects' },
  { name: '--request-payer', description: 'Request payer', args: { name: 'payer', suggestions: s('requester') } },
  { name: '--metadata', description: 'Metadata to add', args: { name: 'map' } },
  { name: '--metadata-directive', description: 'Metadata directive', args: { name: 'directive', suggestions: s(...metadataDirective) } },
  { name: '--expected-size', description: 'Expected file size', args: { name: 'bytes' } },
  { name: '--recursive', description: 'Recursive operation' },
  { name: '--checksum-mode', description: 'Checksum mode', args: { name: 'mode', suggestions: s('ENABLED') } },
  { name: '--checksum-algorithm', description: 'Checksum algorithm', args: { name: 'algorithm', suggestions: s('CRC32', 'CRC32C', 'SHA1', 'SHA256') } }
];

export const s3Subcommands: Subcommand[] = [
  {
    name: 'ls',
    description: 'List S3 objects and buckets',
    args: { name: 's3-uri', generators: s3UriGenerator, isOptional: true },
    options: [
      { name: '--recursive', description: 'List all objects recursively' },
      { name: '--page-size', description: 'Number of results per page', args: { name: 'size' } },
      { name: '--human-readable', description: 'Display file sizes in human readable format' },
      { name: '--summarize', description: 'Display summary information' },
      { name: '--request-payer', description: 'Request payer', args: { name: 'payer', suggestions: s('requester') } }
    ]
  },
  {
    name: 'cp',
    description: 'Copy files to/from S3',
    args: [
      { name: 'source', generators: s3UriGenerator, template: 'filepaths' },
      { name: 'destination', generators: s3UriGenerator, template: 'filepaths' }
    ],
    options: commonCopyOptions
  },
  {
    name: 'mv',
    description: 'Move files to/from S3',
    args: [
      { name: 'source', generators: s3UriGenerator, template: 'filepaths' },
      { name: 'destination', generators: s3UriGenerator, template: 'filepaths' }
    ],
    options: commonCopyOptions
  },
  {
    name: 'rm',
    description: 'Delete S3 objects',
    args: { name: 's3-uri', generators: s3UriGenerator },
    options: [
      { name: '--dryrun', description: 'Display operations without executing' },
      { name: '--quiet', description: 'Do not display operations' },
      { name: '--recursive', description: 'Delete all objects with prefix' },
      { name: '--include', description: 'Include files matching pattern', args: { name: 'pattern' } },
      { name: '--exclude', description: 'Exclude files matching pattern', args: { name: 'pattern' } },
      { name: '--only-show-errors', description: 'Only show errors' },
      { name: '--page-size', description: 'Page size', args: { name: 'size' } },
      { name: '--request-payer', description: 'Request payer', args: { name: 'payer', suggestions: s('requester') } }
    ]
  },
  {
    name: 'sync',
    description: 'Sync directories with S3',
    args: [
      { name: 'source', generators: s3UriGenerator, template: 'filepaths' },
      { name: 'destination', generators: s3UriGenerator, template: 'filepaths' }
    ],
    options: [
      ...commonCopyOptions,
      { name: '--delete', description: 'Delete files that exist in destination but not in source' },
      { name: '--exact-timestamps', description: 'Use exact timestamp comparison' },
      { name: '--size-only', description: 'Compare only file sizes' }
    ]
  },
  {
    name: 'mb',
    description: 'Create an S3 bucket',
    args: { name: 's3-uri', description: 's3://bucket-name' },
    options: [
      { name: '--region', description: 'Region to create bucket in', args: { name: 'region' } }
    ]
  },
  {
    name: 'rb',
    description: 'Remove an S3 bucket',
    args: { name: 's3-uri', generators: s3UriGenerator },
    options: [
      { name: '--force', description: 'Delete all objects then delete bucket' }
    ]
  },
  {
    name: 'website',
    description: 'Configure S3 bucket website hosting',
    args: { name: 's3-uri', generators: s3UriGenerator },
    options: [
      { name: '--index-document', description: 'Index document', args: { name: 'suffix', suggestions: s('index.html') } },
      { name: '--error-document', description: 'Error document', args: { name: 'key', suggestions: s('error.html') } }
    ]
  },
  {
    name: 'presign',
    description: 'Generate a pre-signed URL',
    args: { name: 's3-uri', generators: s3UriGenerator },
    options: [
      { name: '--expires-in', description: 'URL expiration time in seconds', args: { name: 'seconds', suggestions: s('3600', '86400', '604800') } }
    ]
  }
];

// S3API subcommands (lower-level API)
export const s3apiSubcommands: Subcommand[] = [
  {
    name: 'create-bucket',
    description: 'Create a new S3 bucket',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'name' }, required: true },
      { name: '--acl', description: 'Canned ACL', args: { name: 'acl', suggestions: s(...acl) } },
      { name: '--create-bucket-configuration', description: 'Configuration', args: { name: 'config' } },
      { name: '--grant-full-control', description: 'Grant full control', args: { name: 'grantee' } },
      { name: '--grant-read', description: 'Grant read', args: { name: 'grantee' } },
      { name: '--grant-read-acp', description: 'Grant read ACP', args: { name: 'grantee' } },
      { name: '--grant-write', description: 'Grant write', args: { name: 'grantee' } },
      { name: '--grant-write-acp', description: 'Grant write ACP', args: { name: 'grantee' } },
      { name: '--object-lock-enabled-for-bucket', description: 'Enable object lock' },
      { name: '--object-ownership', description: 'Object ownership', args: { name: 'ownership', suggestions: s('BucketOwnerPreferred', 'ObjectWriter', 'BucketOwnerEnforced') } }
    ]
  },
  {
    name: 'delete-bucket',
    description: 'Delete an S3 bucket',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'list-buckets',
    description: 'List all S3 buckets',
    options: []
  },
  {
    name: 'head-bucket',
    description: 'Check if bucket exists',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'put-object',
    description: 'Upload an object to S3',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--key', description: 'Object key', args: { name: 'key' }, required: true },
      { name: '--body', description: 'Object data', args: { name: 'file', template: 'filepaths' } },
      { name: '--acl', description: 'Canned ACL', args: { name: 'acl', suggestions: s(...acl) } },
      { name: '--cache-control', description: 'Cache control', args: { name: 'header' } },
      { name: '--content-disposition', description: 'Content disposition', args: { name: 'header' } },
      { name: '--content-encoding', description: 'Content encoding', args: { name: 'encoding' } },
      { name: '--content-language', description: 'Content language', args: { name: 'language' } },
      { name: '--content-length', description: 'Content length', args: { name: 'bytes' } },
      { name: '--content-md5', description: 'Content MD5', args: { name: 'md5' } },
      { name: '--content-type', description: 'Content type', args: { name: 'mime-type' } },
      { name: '--expires', description: 'Expires header', args: { name: 'timestamp' } },
      { name: '--grant-full-control', description: 'Grant full control', args: { name: 'grantee' } },
      { name: '--grant-read', description: 'Grant read', args: { name: 'grantee' } },
      { name: '--grant-read-acp', description: 'Grant read ACP', args: { name: 'grantee' } },
      { name: '--grant-write-acp', description: 'Grant write ACP', args: { name: 'grantee' } },
      { name: '--metadata', description: 'Metadata', args: { name: 'map' } },
      { name: '--server-side-encryption', description: 'SSE type', args: { name: 'sse', suggestions: s(...sseOptions) } },
      { name: '--storage-class', description: 'Storage class', args: { name: 'class', suggestions: s(...storageClasses) } },
      { name: '--website-redirect-location', description: 'Website redirect', args: { name: 'url' } },
      { name: '--ssekms-key-id', description: 'KMS key ID', args: { name: 'key-id' } },
      { name: '--ssekms-encryption-context', description: 'KMS encryption context', args: { name: 'context' } },
      { name: '--bucket-key-enabled', description: 'Enable bucket key' },
      { name: '--no-bucket-key-enabled', description: 'Disable bucket key' },
      { name: '--tagging', description: 'Object tags', args: { name: 'tagging' } },
      { name: '--object-lock-mode', description: 'Object lock mode', args: { name: 'mode', suggestions: s('GOVERNANCE', 'COMPLIANCE') } },
      { name: '--object-lock-retain-until-date', description: 'Retain until date', args: { name: 'timestamp' } },
      { name: '--object-lock-legal-hold-status', description: 'Legal hold status', args: { name: 'status', suggestions: s('ON', 'OFF') } },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } },
      { name: '--checksum-algorithm', description: 'Checksum algorithm', args: { name: 'algorithm', suggestions: s('CRC32', 'CRC32C', 'SHA1', 'SHA256') } },
      { name: '--checksum-crc32', description: 'CRC32 checksum', args: { name: 'checksum' } },
      { name: '--checksum-crc32c', description: 'CRC32C checksum', args: { name: 'checksum' } },
      { name: '--checksum-sha1', description: 'SHA1 checksum', args: { name: 'checksum' } },
      { name: '--checksum-sha256', description: 'SHA256 checksum', args: { name: 'checksum' } }
    ]
  },
  {
    name: 'get-object',
    description: 'Download an object from S3',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--key', description: 'Object key', args: { name: 'key' }, required: true },
      { name: '--if-match', description: 'Return if ETag matches', args: { name: 'etag' } },
      { name: '--if-modified-since', description: 'Return if modified since', args: { name: 'timestamp' } },
      { name: '--if-none-match', description: 'Return if ETag does not match', args: { name: 'etag' } },
      { name: '--if-unmodified-since', description: 'Return if not modified since', args: { name: 'timestamp' } },
      { name: '--range', description: 'Byte range', args: { name: 'range' } },
      { name: '--response-cache-control', description: 'Cache-Control header', args: { name: 'header' } },
      { name: '--response-content-disposition', description: 'Content-Disposition header', args: { name: 'header' } },
      { name: '--response-content-encoding', description: 'Content-Encoding header', args: { name: 'encoding' } },
      { name: '--response-content-language', description: 'Content-Language header', args: { name: 'language' } },
      { name: '--response-content-type', description: 'Content-Type header', args: { name: 'mime-type' } },
      { name: '--response-expires', description: 'Expires header', args: { name: 'timestamp' } },
      { name: '--version-id', description: 'Object version ID', args: { name: 'version-id' } },
      { name: '--sse-customer-algorithm', description: 'SSE-C algorithm', args: { name: 'algorithm' } },
      { name: '--sse-customer-key', description: 'SSE-C key', args: { name: 'key' } },
      { name: '--sse-customer-key-md5', description: 'SSE-C key MD5', args: { name: 'md5' } },
      { name: '--request-payer', description: 'Request payer', args: { name: 'payer', suggestions: s('requester') } },
      { name: '--part-number', description: 'Part number', args: { name: 'number' } },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } },
      { name: '--checksum-mode', description: 'Checksum mode', args: { name: 'mode', suggestions: s('ENABLED') } }
    ],
    args: { name: 'outfile', template: 'filepaths' }
  },
  {
    name: 'delete-object',
    description: 'Delete an object from S3',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--key', description: 'Object key', args: { name: 'key' }, required: true },
      { name: '--mfa', description: 'MFA token', args: { name: 'mfa' } },
      { name: '--version-id', description: 'Object version ID', args: { name: 'version-id' } },
      { name: '--request-payer', description: 'Request payer', args: { name: 'payer', suggestions: s('requester') } },
      { name: '--bypass-governance-retention', description: 'Bypass governance retention' },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'delete-objects',
    description: 'Delete multiple objects from S3',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--delete', description: 'Delete specification', args: { name: 'structure' }, required: true },
      { name: '--mfa', description: 'MFA token', args: { name: 'mfa' } },
      { name: '--request-payer', description: 'Request payer', args: { name: 'payer', suggestions: s('requester') } },
      { name: '--bypass-governance-retention', description: 'Bypass governance retention' },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } },
      { name: '--checksum-algorithm', description: 'Checksum algorithm', args: { name: 'algorithm', suggestions: s('CRC32', 'CRC32C', 'SHA1', 'SHA256') } }
    ]
  },
  {
    name: 'head-object',
    description: 'Get object metadata',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--key', description: 'Object key', args: { name: 'key' }, required: true },
      { name: '--if-match', description: 'Return if ETag matches', args: { name: 'etag' } },
      { name: '--if-modified-since', description: 'Return if modified since', args: { name: 'timestamp' } },
      { name: '--if-none-match', description: 'Return if ETag does not match', args: { name: 'etag' } },
      { name: '--if-unmodified-since', description: 'Return if not modified since', args: { name: 'timestamp' } },
      { name: '--range', description: 'Byte range', args: { name: 'range' } },
      { name: '--version-id', description: 'Object version ID', args: { name: 'version-id' } },
      { name: '--sse-customer-algorithm', description: 'SSE-C algorithm', args: { name: 'algorithm' } },
      { name: '--sse-customer-key', description: 'SSE-C key', args: { name: 'key' } },
      { name: '--sse-customer-key-md5', description: 'SSE-C key MD5', args: { name: 'md5' } },
      { name: '--request-payer', description: 'Request payer', args: { name: 'payer', suggestions: s('requester') } },
      { name: '--part-number', description: 'Part number', args: { name: 'number' } },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } },
      { name: '--checksum-mode', description: 'Checksum mode', args: { name: 'mode', suggestions: s('ENABLED') } }
    ]
  },
  {
    name: 'list-objects-v2',
    description: 'List objects in a bucket (v2)',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--delimiter', description: 'Delimiter character', args: { name: 'char' } },
      { name: '--encoding-type', description: 'Encoding type', args: { name: 'type', suggestions: s('url') } },
      { name: '--max-keys', description: 'Maximum keys to return', args: { name: 'number' } },
      { name: '--prefix', description: 'Key prefix', args: { name: 'prefix' } },
      { name: '--continuation-token', description: 'Continuation token', args: { name: 'token' } },
      { name: '--fetch-owner', description: 'Include owner information' },
      { name: '--start-after', description: 'Start listing after key', args: { name: 'key' } },
      { name: '--request-payer', description: 'Request payer', args: { name: 'payer', suggestions: s('requester') } },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'copy-object',
    description: 'Copy an object within S3',
    options: [
      { name: '--bucket', description: 'Destination bucket', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--copy-source', description: 'Source bucket/key', args: { name: 'source' }, required: true },
      { name: '--key', description: 'Destination key', args: { name: 'key' }, required: true },
      { name: '--acl', description: 'Canned ACL', args: { name: 'acl', suggestions: s(...acl) } },
      { name: '--cache-control', description: 'Cache control', args: { name: 'header' } },
      { name: '--content-disposition', description: 'Content disposition', args: { name: 'header' } },
      { name: '--content-encoding', description: 'Content encoding', args: { name: 'encoding' } },
      { name: '--content-language', description: 'Content language', args: { name: 'language' } },
      { name: '--content-type', description: 'Content type', args: { name: 'mime-type' } },
      { name: '--copy-source-if-match', description: 'Copy if source ETag matches', args: { name: 'etag' } },
      { name: '--copy-source-if-modified-since', description: 'Copy if source modified since', args: { name: 'timestamp' } },
      { name: '--copy-source-if-none-match', description: 'Copy if source ETag does not match', args: { name: 'etag' } },
      { name: '--copy-source-if-unmodified-since', description: 'Copy if source not modified since', args: { name: 'timestamp' } },
      { name: '--expires', description: 'Expires header', args: { name: 'timestamp' } },
      { name: '--grant-full-control', description: 'Grant full control', args: { name: 'grantee' } },
      { name: '--grant-read', description: 'Grant read', args: { name: 'grantee' } },
      { name: '--grant-read-acp', description: 'Grant read ACP', args: { name: 'grantee' } },
      { name: '--grant-write-acp', description: 'Grant write ACP', args: { name: 'grantee' } },
      { name: '--metadata', description: 'Metadata', args: { name: 'map' } },
      { name: '--metadata-directive', description: 'Metadata directive', args: { name: 'directive', suggestions: s(...metadataDirective) } },
      { name: '--tagging-directive', description: 'Tagging directive', args: { name: 'directive', suggestions: s('COPY', 'REPLACE') } },
      { name: '--server-side-encryption', description: 'SSE type', args: { name: 'sse', suggestions: s(...sseOptions) } },
      { name: '--storage-class', description: 'Storage class', args: { name: 'class', suggestions: s(...storageClasses) } },
      { name: '--website-redirect-location', description: 'Website redirect', args: { name: 'url' } },
      { name: '--sse-customer-algorithm', description: 'SSE-C algorithm for destination', args: { name: 'algorithm' } },
      { name: '--sse-customer-key', description: 'SSE-C key for destination', args: { name: 'key' } },
      { name: '--sse-customer-key-md5', description: 'SSE-C key MD5 for destination', args: { name: 'md5' } },
      { name: '--ssekms-key-id', description: 'KMS key ID', args: { name: 'key-id' } },
      { name: '--ssekms-encryption-context', description: 'KMS encryption context', args: { name: 'context' } },
      { name: '--bucket-key-enabled', description: 'Enable bucket key' },
      { name: '--no-bucket-key-enabled', description: 'Disable bucket key' },
      { name: '--copy-source-sse-customer-algorithm', description: 'Source SSE-C algorithm', args: { name: 'algorithm' } },
      { name: '--copy-source-sse-customer-key', description: 'Source SSE-C key', args: { name: 'key' } },
      { name: '--copy-source-sse-customer-key-md5', description: 'Source SSE-C key MD5', args: { name: 'md5' } },
      { name: '--request-payer', description: 'Request payer', args: { name: 'payer', suggestions: s('requester') } },
      { name: '--tagging', description: 'Object tags', args: { name: 'tagging' } },
      { name: '--object-lock-mode', description: 'Object lock mode', args: { name: 'mode', suggestions: s('GOVERNANCE', 'COMPLIANCE') } },
      { name: '--object-lock-retain-until-date', description: 'Retain until date', args: { name: 'timestamp' } },
      { name: '--object-lock-legal-hold-status', description: 'Legal hold status', args: { name: 'status', suggestions: s('ON', 'OFF') } },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } },
      { name: '--expected-source-bucket-owner', description: 'Expected source bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'get-bucket-versioning',
    description: 'Get bucket versioning configuration',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'put-bucket-versioning',
    description: 'Set bucket versioning configuration',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--versioning-configuration', description: 'Versioning configuration', args: { name: 'config' }, required: true },
      { name: '--mfa', description: 'MFA token', args: { name: 'mfa' } },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'get-bucket-policy',
    description: 'Get bucket policy',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'put-bucket-policy',
    description: 'Set bucket policy',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--policy', description: 'Policy document', args: { name: 'policy' }, required: true },
      { name: '--confirm-remove-self-bucket-access', description: 'Confirm removing self access' },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'delete-bucket-policy',
    description: 'Delete bucket policy',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'get-bucket-encryption',
    description: 'Get bucket encryption configuration',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'put-bucket-encryption',
    description: 'Set bucket encryption configuration',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--server-side-encryption-configuration', description: 'Encryption configuration', args: { name: 'config' }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'delete-bucket-encryption',
    description: 'Delete bucket encryption configuration',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'put-public-access-block',
    description: 'Set bucket public access block',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--public-access-block-configuration', description: 'Public access block configuration', args: { name: 'config' }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'get-public-access-block',
    description: 'Get bucket public access block',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  },
  {
    name: 'delete-public-access-block',
    description: 'Delete bucket public access block',
    options: [
      { name: '--bucket', description: 'Bucket name', args: { name: 'bucket', generators: s3BucketGenerator }, required: true },
      { name: '--expected-bucket-owner', description: 'Expected bucket owner', args: { name: 'account-id' } }
    ]
  }
];
