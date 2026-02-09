// gcloud completion spec for CLIFlow
// Comprehensive Google Cloud Platform CLI completions with modular subcommands

import { CompletionSpec, Subcommand, Option } from '../types.js';

// Import all subcommand modules (default exports)
import accessContextManagerSpec from './gcloud/access-context-manager.js';
import activeDirectorySpec from './gcloud/active-directory.js';
import aiPlatformSpec from './gcloud/ai-platform.js';
import anthosSpec from './gcloud/anthos.js';
import apigeeSpec from './gcloud/apigee.js';
import appSpec from './gcloud/app.js';
import artifactsSpec from './gcloud/artifacts.js';
import assetSpec from './gcloud/asset.js';
import authSpec from './gcloud/auth.js';
import bigtableSpec from './gcloud/bigtable.js';
import buildsSpec from './gcloud/builds.js';
import cloudShellSpec from './gcloud/cloud-shell.js';
import componentsSpec from './gcloud/components.js';
import composerSpec from './gcloud/composer.js';
import computeSpec from './gcloud/compute.js';
import configSpec from './gcloud/config.js';
import containerSpec from './gcloud/container.js';
import dataCatalogSpec from './gcloud/data-catalog.js';
import dataflowSpec from './gcloud/dataflow.js';
import dataprocSpec from './gcloud/dataproc.js';
import datastoreSpec from './gcloud/datastore.js';
import debugSpec from './gcloud/debug.js';
import deploymentManagerSpec from './gcloud/deployment-manager.js';
import dnsSpec from './gcloud/dns.js';
import domainsSpec from './gcloud/domains.js';
import endpointsSpec from './gcloud/endpoints.js';
import filestoreSpec from './gcloud/filestore.js';
import firebaseSpec from './gcloud/firebase.js';
import firestoreSpec from './gcloud/firestore.js';
import functionsSpec from './gcloud/functions.js';
import healthcareSpec from './gcloud/healthcare.js';
import iamSpec from './gcloud/iam.js';
import iapSpec from './gcloud/iap.js';
import identitySpec from './gcloud/identity.js';
import iotSpec from './gcloud/iot.js';
import kmsSpec from './gcloud/kms.js';
import loggingSpec from './gcloud/logging.js';
import mlSpec from './gcloud/ml.js';
import mlEngineSpec from './gcloud/ml-engine.js';
import monitoringSpec from './gcloud/monitoring.js';
import networkManagementSpec from './gcloud/network-management.js';
import organizationsSpec from './gcloud/organizations.js';
import projectsSpec from './gcloud/projects.js';
import pubsubSpec from './gcloud/pubsub.js';
import recommenderSpec from './gcloud/recommender.js';
import redisSpec from './gcloud/redis.js';
import resourceManagerSpec from './gcloud/resource-manager.js';
import runSpec from './gcloud/run.js';
import schedulerSpec from './gcloud/scheduler.js';
import secretsSpec from './gcloud/secrets.js';
import servicesSpec from './gcloud/services.js';
import sourceSpec from './gcloud/source.js';
import spannerSpec from './gcloud/spanner.js';
import sqlSpec from './gcloud/sql.js';
import tasksSpec from './gcloud/tasks.js';
import topicSpec from './gcloud/topic.js';

// Global options available for all gcloud commands
const globalOptions: Option[] = [
  { name: '--account', description: 'Google Cloud user account to use for invocation', args: { name: 'ACCOUNT' } },
  { name: '--billing-project', description: 'Project that will be charged quota for operations', args: { name: 'PROJECT' } },
  { name: '--configuration', description: 'The configuration to use for this command invocation', args: { name: 'CONFIGURATION' } },
  { name: '--flags-file', description: 'A YAML or JSON file that specifies a --flag:value dictionary', args: { name: 'FILE', template: 'filepaths' } },
  { name: '--flatten', description: 'Flatten name[] output resource slices in KEY', args: { name: 'KEY' } },
  { name: '--format', description: 'Set the output format', args: { name: 'FORMAT', suggestions: [{ name: 'config' }, { name: 'csv' }, { name: 'default' }, { name: 'diff' }, { name: 'disable' }, { name: 'flattened' }, { name: 'get' }, { name: 'json' }, { name: 'list' }, { name: 'multi' }, { name: 'none' }, { name: 'object' }, { name: 'table' }, { name: 'text' }, { name: 'value' }, { name: 'yaml' }] } },
  { name: '--help', description: 'Display detailed help' },
  { name: ['-h', '--help'], description: 'Display help' },
  { name: '--impersonate-service-account', description: 'For this gcloud invocation, all API requests will be made as the given service account', args: { name: 'SERVICE_ACCOUNT_EMAILS' } },
  { name: '--log-http', description: 'Log all HTTP server requests and responses to stderr' },
  { name: '--project', description: 'The Google Cloud project ID to use for this invocation', args: { name: 'PROJECT_ID' } },
  { name: ['-q', '--quiet'], description: 'Disable all interactive prompts' },
  { name: '--trace-token', description: 'Token used to route traces of service requests for investigation', args: { name: 'TOKEN' } },
  { name: '--user-output-enabled', description: 'Print user intended output to the console' },
  { name: '--verbosity', description: 'Override the default verbosity for this command', args: { name: 'VERBOSITY', suggestions: [{ name: 'debug' }, { name: 'info' }, { name: 'warning' }, { name: 'error' }, { name: 'critical' }, { name: 'none' }] } },
];

export const gcloudSpec: CompletionSpec = {
  name: 'gcloud',
  description: 'Google Cloud Platform CLI - Manage GCP resources and services',
  subcommands: [
    // Core services
    { ...computeSpec, name: 'compute', description: 'Read and manipulate Compute Engine resources' },
    { ...containerSpec, name: 'container', description: 'Deploy and manage clusters of machines for running containers' },
    { ...functionsSpec, name: 'functions', description: 'Manage Google Cloud Functions' },
    { ...runSpec, name: 'run', description: 'Manage Cloud Run resources' },
    { ...appSpec, name: 'app', description: 'Manage your App Engine deployments' },
    
    // Data & Storage
    { ...sqlSpec, name: 'sql', description: 'Create and manage Cloud SQL databases' },
    { ...bigtableSpec, name: 'bigtable', description: 'Manage Cloud Bigtable resources' },
    { ...spannerSpec, name: 'spanner', description: 'Command groups for Cloud Spanner' },
    { ...firestoreSpec, name: 'firestore', description: 'Manage Firestore resources' },
    { ...datastoreSpec, name: 'datastore', description: 'Manage Datastore resources' },
    { ...redisSpec, name: 'redis', description: 'Manage Cloud Memorystore Redis resources' },
    
    // AI & Machine Learning  
    { ...aiPlatformSpec, name: 'ai-platform', description: 'Manage AI Platform jobs and models' },
    { ...mlSpec, name: 'ml', description: 'Manage Cloud ML resources' },
    { ...mlEngineSpec, name: 'ml-engine', description: 'Manage Cloud ML Engine resources' },
    
    // Data Processing
    { ...dataflowSpec, name: 'dataflow', description: 'Manage Google Cloud Dataflow resources' },
    { ...dataprocSpec, name: 'dataproc', description: 'Create and manage Dataproc clusters and jobs' },
    { ...pubsubSpec, name: 'pubsub', description: 'Manage Cloud Pub/Sub topics and subscriptions' },
    { ...tasksSpec, name: 'tasks', description: 'Manage Cloud Tasks queues and tasks' },
    { ...schedulerSpec, name: 'scheduler', description: 'Manage Cloud Scheduler jobs' },
    
    // Networking
    { ...dnsSpec, name: 'dns', description: 'Manage Cloud DNS' },
    { ...networkManagementSpec, name: 'network-management', description: 'Manage Network Intelligence Center resources' },
    { ...endpointsSpec, name: 'endpoints', description: 'Create, enable and manage API services' },
    
    // Identity & Security
    { ...iamSpec, name: 'iam', description: 'Manage IAM service accounts and keys' },
    { ...kmsSpec, name: 'kms', description: 'Manage cryptographic keys in Key Management Service' },
    { ...secretsSpec, name: 'secrets', description: 'Manage secrets on Google Cloud' },
    { ...identitySpec, name: 'identity', description: 'Manage Cloud Identity Groups and Memberships' },
    { ...iapSpec, name: 'iap', description: 'Manage Identity-Aware Proxy resources' },
    
    // Resource Management
    { ...projectsSpec, name: 'projects', description: 'Create and manage project access policies' },
    { ...organizationsSpec, name: 'organizations', description: 'Create and manage Google Cloud Organizations' },
    { ...resourceManagerSpec, name: 'resource-manager', description: 'Manage Cloud Resources' },
    { ...deploymentManagerSpec, name: 'deployment-manager', description: 'Manage deployments with Deployment Manager' },
    
    // Monitoring & Logging
    { ...loggingSpec, name: 'logging', description: 'Manage Cloud Logging' },
    { ...monitoringSpec, name: 'monitoring', description: 'Manage Cloud Monitoring resources' },
    { ...debugSpec, name: 'debug', description: 'Commands for interacting with Cloud Debugger' },
    
    // Other Services
    { ...authSpec, name: 'auth', description: 'Manage oauth2 credentials for the Google Cloud SDK' },
    { ...configSpec, name: 'config', description: 'View and edit Cloud SDK properties' },
    { ...componentsSpec, name: 'components', description: 'List, install, update, or remove SDK components' },
    { ...servicesSpec, name: 'services', description: 'List, enable and disable APIs and services' },
    { ...sourceSpec, name: 'source', description: 'Cloud git repository commands' },
    { ...buildsSpec, name: 'builds', description: 'Create and manage builds for Google Cloud Build' },
    { ...artifactsSpec, name: 'artifacts', description: 'Manage Artifact Registry resources' },
    { ...anthosSpec, name: 'anthos', description: 'Anthos command group' },
    { ...firebaseSpec, name: 'firebase', description: 'Work with Firebase' },
    { ...healthcareSpec, name: 'healthcare', description: 'Manage Cloud Healthcare resources' },
    { ...iotSpec, name: 'iot', description: 'Manage Cloud IoT resources' },
    { ...apigeeSpec, name: 'apigee', description: 'Manage Apigee resources' },
    { ...recommenderSpec, name: 'recommender', description: 'Manage Cloud Recommendations' },
    { ...assetSpec, name: 'asset', description: 'Manage Cloud Asset Inventory' },
    { ...accessContextManagerSpec, name: 'access-context-manager', description: 'Manage Access Context Manager resources' },
    { ...activeDirectorySpec, name: 'active-directory', description: 'Manage Managed Microsoft AD' },
    { ...dataCatalogSpec, name: 'data-catalog', description: 'Manage Data Catalog resources' },
    { ...domainsSpec, name: 'domains', description: 'Manage domains for your Google Cloud projects' },
    { ...filestoreSpec, name: 'filestore', description: 'Create and manage Cloud Filestore resources' },
    { ...cloudShellSpec, name: 'cloud-shell', description: 'Manage Google Cloud Shell' },
    { ...composerSpec, name: 'composer', description: 'Manage Cloud Composer environments' },
    
    // Meta commands
    {
      name: 'init',
      description: 'Initialize or reinitialize gcloud',
      options: globalOptions,
    },
    {
      name: 'info',
      description: 'Display information about the current gcloud environment',
      options: [
        ...globalOptions,
        { name: '--anonymize', description: 'Minimize any personal identifiable information' },
        { name: '--run-diagnostics', description: 'Run diagnostics on your installation' },
      ],
    },
    {
      name: 'version',
      description: 'Print version information for Cloud SDK components',
      options: globalOptions,
    },
    {
      name: 'help',
      description: 'Search gcloud help text',
      args: { name: 'command', isOptional: true },
      options: globalOptions,
    },
    {
      name: 'feedback',
      description: 'Provide feedback to the Google Cloud CLI team',
      options: globalOptions,
    },
    {
      name: 'survey',
      description: 'Prompts you to opt-in or opt-out of gcloud usage reporting',
      options: globalOptions,
    },
    {
      name: 'alpha',
      description: 'Alpha versions of gcloud commands',
      options: globalOptions,
    },
    {
      name: 'beta',
      description: 'Beta versions of gcloud commands',
      options: globalOptions,
    },
    { ...topicSpec, name: 'topic', description: 'gcloud supplementary help' },
  ],
  options: globalOptions,
};
