// Azure CLI (az) completion spec for CLIFlow
// Comprehensive Azure CLI completions with modular subcommands

import { CompletionSpec, Subcommand, Option } from '../types.js';

// Import all subcommand modules (228 total - default exports)
import accountSpec from './az/account.js';
import acrSpec from './az/acr.js';
import adSpec from './az/ad.js';
import adpSpec from './az/adp.js';
import advisorSpec from './az/advisor.js';
import afdSpec from './az/afd.js';
import aiExamplesSpec from './az/ai-examples.js';
import aksSpec from './az/aks.js';
import alertsManagementSpec from './az/alerts-management.js';
import aliasSpec from './az/alias.js';
import amlfsSpec from './az/amlfs.js';
import amsSpec from './az/ams.js';
import apimSpec from './az/apim.js';
import appconfigSpec from './az/appconfig.js';
import appserviceSpec from './az/appservice.js';
import arcapplianceSpec from './az/arcappliance.js';
import arcdataSpec from './az/arcdata.js';
import aroSpec from './az/aro.js';
import artifactsSpec from './az/artifacts.js';
import attestationSpec from './az/attestation.js';
import automanageSpec from './az/automanage.js';
import automationSpec from './az/automation.js';
import azurestackhciSpec from './az/azurestackhci.js';
import backupSpec from './az/backup.js';
import baremetalinstanceSpec from './az/baremetalinstance.js';
import batchSpec from './az/batch.js';
import batchaiSpec from './az/batchai.js';
import bicepSpec from './az/bicep.js';
import billingBenefitsSpec from './az/billing-benefits.js';
import billingSpec from './az/billing.js';
import blockchainSpec from './az/blockchain.js';
import blueprintSpec from './az/blueprint.js';
import boardsSpec from './az/boards.js';
import botSpec from './az/bot.js';
import cacheSpec from './az/cache.js';
import capacitySpec from './az/capacity.js';
import cdnSpec from './az/cdn.js';
import changeAnalysisSpec from './az/change-analysis.js';
import cliTranslatorSpec from './az/cli-translator.js';
import cloudServiceSpec from './az/cloud-service.js';
import cloudSpec from './az/cloud.js';
import cognitiveservicesSpec from './az/cognitiveservices.js';
import commandChangeSpec from './az/command-change.js';
import communicationSpec from './az/communication.js';
import confcomSpec from './az/confcom.js';
import confidentialledgerSpec from './az/confidentialledger.js';
import configSpec from './az/config.js';
import configureSpec from './az/configure.js';
import confluentSpec from './az/confluent.js';
import connectedk8sSpec from './az/connectedk8s.js';
import connectedmachineSpec from './az/connectedmachine.js';
import connectedvmwareSpec from './az/connectedvmware.js';
import connectionSpec from './az/connection.js';
import consumptionSpec from './az/consumption.js';
import containerSpec from './az/container.js';
import containerappSpec from './az/containerapp.js';
import cosmosdbSpec from './az/cosmosdb.js';
import costmanagementSpec from './az/costmanagement.js';
import csvmwareSpec from './az/csvmware.js';
import customProvidersSpec from './az/custom-providers.js';
import customlocationSpec from './az/customlocation.js';
import databoxSpec from './az/databox.js';
import databoxedgeSpec from './az/databoxedge.js';
import databricksSpec from './az/databricks.js';
import datadogSpec from './az/datadog.js';
import datafactorySpec from './az/datafactory.js';
import datamigrationSpec from './az/datamigration.js';
import dataprotectionSpec from './az/dataprotection.js';
import datashareSpec from './az/datashare.js';
import dedicatedHsmSpec from './az/dedicated-hsm.js';
import demoSpec from './az/demo.js';
import deploymentScriptsSpec from './az/deployment-scripts.js';
import deploymentSpec from './az/deployment.js';
import desktopvirtualizationSpec from './az/desktopvirtualization.js';
import devcenterSpec from './az/devcenter.js';
import devopsSpec from './az/devops.js';
import diskAccessSpec from './az/disk-access.js';
import diskEncryptionSetSpec from './az/disk-encryption-set.js';
import diskPoolSpec from './az/disk-pool.js';
import diskSpec from './az/disk.js';
import dlaSpec from './az/dla.js';
import dlsSpec from './az/dls.js';
import dmsSpec from './az/dms.js';
import dncSpec from './az/dnc.js';
import dnsResolverSpec from './az/dns-resolver.js';
import dtSpec from './az/dt.js';
import dynatraceSpec from './az/dynatrace.js';
import edgeorderSpec from './az/edgeorder.js';
import elasticSanSpec from './az/elastic-san.js';
import elasticSpec from './az/elastic.js';
import eventgridSpec from './az/eventgrid.js';
import eventhubsSpec from './az/eventhubs.js';
import extensionSpec from './az/extension.js';
import featureSpec from './az/feature.js';
import feedbackSpec from './az/feedback.js';
import findSpec from './az/find.js';
import fleetSpec from './az/fleet.js';
import fluidRelaySpec from './az/fluid-relay.js';
import footprintSpec from './az/footprint.js';
import functionappSpec from './az/functionapp.js';
import fzfSpec from './az/fzf.js';
import grafanaSpec from './az/grafana.js';
import graphServicesSpec from './az/graph-services.js';
import graphSpec from './az/graph.js';
import groupSpec from './az/group.js';
import guestconfigSpec from './az/guestconfig.js';
import hackSpec from './az/hack.js';
import hanainstanceSpec from './az/hanainstance.js';
import hdinsightSpec from './az/hdinsight.js';
import healthbotSpec from './az/healthbot.js';
import healthcareapisSpec from './az/healthcareapis.js';
import hpcCacheSpec from './az/hpc-cache.js';
import hybridaksSpec from './az/hybridaks.js';
import identitySpec from './az/identity.js';
import imageSpec from './az/image.js';
import importExportSpec from './az/import-export.js';
import initSpec from './az/init.js';
import interactiveSpec from './az/interactive.js';
import internetAnalyzerSpec from './az/internet-analyzer.js';
import iotSpec from './az/iot.js';
import k8sConfigurationSpec from './az/k8s-configuration.js';
import k8sExtensionSpec from './az/k8s-extension.js';
import k8sconfigurationSpec from './az/k8sconfiguration.js';
import keyvaultSpec from './az/keyvault.js';
import kustoSpec from './az/kusto.js';
import labSpec from './az/lab.js';
import loadSpec from './az/load.js';
import lockSpec from './az/lock.js';
import logicSpec from './az/logic.js';
import logicappSpec from './az/logicapp.js';
import loginSpec from './az/login.js';
import logoutSpec from './az/logout.js';
import logzSpec from './az/logz.js';
import maintenanceSpec from './az/maintenance.js';
import managedCassandraSpec from './az/managed-cassandra.js';
import managedappSpec from './az/managedapp.js';
import managedservicesSpec from './az/managedservices.js';
import managementpartnerSpec from './az/managementpartner.js';
import mapsSpec from './az/maps.js';
import mariadbSpec from './az/mariadb.js';
import meshSpec from './az/mesh.js';
import mlSpec from './az/ml.js';
import mobileNetworkSpec from './az/mobile-network.js';
import monitorSpec from './az/monitor.js';
import mysqlSpec from './az/mysql.js';
import netappfilesSpec from './az/netappfiles.js';
import networkFunctionSpec from './az/network-function.js';
import networkSpec from './az/network.js';
import networkcloudSpec from './az/networkcloud.js';
import networkfabricSpec from './az/networkfabric.js';
import newRelicSpec from './az/new-relic.js';
import nextSpec from './az/next.js';
import nginxSpec from './az/nginx.js';
import notificationHubSpec from './az/notification-hub.js';
import offazureSpec from './az/offazure.js';
import orbitalSpec from './az/orbital.js';
import paloAltoSpec from './az/palo-alto.js';
import partnercenterSpec from './az/partnercenter.js';
import peeringSpec from './az/peering.js';
import pipelinesSpec from './az/pipelines.js';
import policySpec from './az/policy.js';
import portalSpec from './az/portal.js';
import postgresSpec from './az/postgres.js';
import powerbiSpec from './az/powerbi.js';
import ppgSpec from './az/ppg.js';
import privateLinkSpec from './az/private-link.js';
import providerSpec from './az/provider.js';
import providerhubSpec from './az/providerhub.js';
import purviewSpec from './az/purview.js';
import quantumSpec from './az/quantum.js';
import qumuloSpec from './az/qumulo.js';
import quotaSpec from './az/quota.js';
import redisSpec from './az/redis.js';
import redisenterpriseSpec from './az/redisenterprise.js';
import relaySpec from './az/relay.js';
import remoteRenderingAccountSpec from './az/remote-rendering-account.js';
import reposSpec from './az/repos.js';
import reservationsSpec from './az/reservations.js';
import resourceMoverSpec from './az/resource-mover.js';
import resourceSpec from './az/resource.js';
import resourcemanagementSpec from './az/resourcemanagement.js';
import restSpec from './az/rest.js';
import restorePointSpec from './az/restore-point.js';
import roleSpec from './az/role.js';
import sapmonitorSpec from './az/sapmonitor.js';
import scenarioSpec from './az/scenario.js';
import scvmmSpec from './az/scvmm.js';
import searchSpec from './az/search.js';
import securitySpec from './az/security.js';
import selfHelpSpec from './az/self-help.js';
import selfTestSpec from './az/self-test.js';
import sentinelSpec from './az/sentinel.js';
import serialConsoleSpec from './az/serial-console.js';
import servicebusSpec from './az/servicebus.js';
import sfSpec from './az/sf.js';
import sigSpec from './az/sig.js';
import signalrSpec from './az/signalr.js';
import siteRecoverySpec from './az/site-recovery.js';
import snapshotSpec from './az/snapshot.js';
import spatialAnchorsAccountSpec from './az/spatial-anchors-account.js';
import sphereSpec from './az/sphere.js';
import springCloudSpec from './az/spring-cloud.js';
import springSpec from './az/spring.js';
import sqlSpec from './az/sql.js';
import sshSpec from './az/ssh.js';
import sshkeySpec from './az/sshkey.js';
import stackHciSpec from './az/stack-hci.js';
import stackSpec from './az/stack.js';
import staticwebappSpec from './az/staticwebapp.js';
import storageMoverSpec from './az/storage-mover.js';
import storageSpec from './az/storage.js';
import storagesyncSpec from './az/storagesync.js';
import streamAnalyticsSpec from './az/stream-analytics.js';
import supportSpec from './az/support.js';
import surveySpec from './az/survey.js';
import synapseSpec from './az/synapse.js';
import tagSpec from './az/tag.js';
import termSpec from './az/term.js';
import tsSpec from './az/ts.js';
import tsiSpec from './az/tsi.js';
import upgradeSpec from './az/upgrade.js';
import versionSpec from './az/version.js';
import vmSpec from './az/vm.js';
import vmssSpec from './az/vmss.js';
import vmwareSpec from './az/vmware.js';
import webappSpec from './az/webapp.js';
import webpubsubSpec from './az/webpubsub.js';
import workloadsSpec from './az/workloads.js';

// Global options available for all az commands
const globalOptions: Option[] = [
  { name: '--debug', description: 'Increase logging verbosity to show all debug logs' },
  { name: ['-h', '--help'], description: 'Show this help message and exit' },
  { name: '--only-show-errors', description: 'Only show errors, suppressing warnings' },
  { name: ['-o', '--output'], description: 'Output format', args: { name: 'format', suggestions: [{ name: 'json' }, { name: 'jsonc' }, { name: 'none' }, { name: 'table' }, { name: 'tsv' }, { name: 'yaml' }, { name: 'yamlc' }] } },
  { name: '--query', description: 'JMESPath query string', args: { name: 'query' } },
  { name: '--subscription', description: 'Name or ID of subscription', args: { name: 'subscription' } },
  { name: '--verbose', description: 'Increase logging verbosity' },
];

export const azSpec: CompletionSpec = {
  name: 'az',
  description: 'Azure CLI - Manage Azure resources',
  subcommands: [
    // Compute
    { ...vmSpec, name: 'vm', description: 'Manage Linux or Windows virtual machines' },
    { ...vmssSpec, name: 'vmss', description: 'Manage groupings of virtual machines in a scale set' },
    { ...aksSpec, name: 'aks', description: 'Manage Azure Kubernetes Services' },
    { ...containerSpec, name: 'container', description: 'Manage Azure Container Instances' },
    { ...containerappSpec, name: 'containerapp', description: 'Manage Azure Container Apps' },
    { ...functionappSpec, name: 'functionapp', description: 'Manage function apps' },
    { ...webappSpec, name: 'webapp', description: 'Manage web apps' },
    { ...appserviceSpec, name: 'appservice', description: 'Manage App Service plans' },
    { ...sfSpec, name: 'sf', description: 'Manage Service Fabric clusters' },
    { ...batchSpec, name: 'batch', description: 'Manage Azure Batch' },
    { ...springSpec, name: 'spring', description: 'Commands to manage Azure Spring Apps' },
    { ...springCloudSpec, name: 'spring-cloud', description: 'Commands to manage Azure Spring Cloud' },
    
    // Storage
    { ...storageSpec, name: 'storage', description: 'Manage Azure Cloud Storage resources' },
    { ...diskSpec, name: 'disk', description: 'Manage Azure Managed Disks' },
    { ...snapshotSpec, name: 'snapshot', description: 'Manage point-in-time copies of managed disks, native blobs, or other snapshots' },
    { ...imageSpec, name: 'image', description: 'Manage custom VM images' },
    { ...netappfilesSpec, name: 'netappfiles', description: 'Manage Azure NetApp Files resources' },
    { ...storageMoverSpec, name: 'storage-mover', description: 'Manage Storage Mover' },
    { ...storagesyncSpec, name: 'storagesync', description: 'Manage Azure File Sync' },
    
    // Databases
    { ...sqlSpec, name: 'sql', description: 'Manage Azure SQL Databases and Data Warehouses' },
    { ...mysqlSpec, name: 'mysql', description: 'Manage Azure Database for MySQL servers' },
    { ...postgresSpec, name: 'postgres', description: 'Manage Azure Database for PostgreSQL servers' },
    { ...cosmosdbSpec, name: 'cosmosdb', description: 'Manage Azure Cosmos DB database accounts' },
    { ...redisSpec, name: 'redis', description: 'Manage dedicated Redis caches' },
    { ...redisenterpriseSpec, name: 'redisenterprise', description: 'Manage Azure Cache for Redis Enterprise' },
    { ...mariadbSpec, name: 'mariadb', description: 'Manage Azure Database for MariaDB servers' },
    { ...kustoSpec, name: 'kusto', description: 'Manage Azure Kusto resources' },
    { ...managedCassandraSpec, name: 'managed-cassandra', description: 'Azure Managed Cassandra' },
    
    // Networking
    { ...networkSpec, name: 'network', description: 'Manage Azure Network resources' },
    { ...cdnSpec, name: 'cdn', description: 'Manage Azure Content Delivery Networks (CDNs)' },
    { ...afdSpec, name: 'afd', description: 'Manage Azure Front Door Standard/Premium' },
    { ...dnsResolverSpec, name: 'dns-resolver', description: 'Manage DNS Resolver' },
    { ...privateLinkSpec, name: 'private-link', description: 'Private-link association CLI command group' },
    { ...relaySpec, name: 'relay', description: 'Manage Azure Relay Service namespaces' },
    { ...signalrSpec, name: 'signalr', description: 'Manage Azure SignalR Service' },
    { ...webpubsubSpec, name: 'webpubsub', description: 'Commands to manage Webpubsub' },
    
    // Security & Identity
    { ...adSpec, name: 'ad', description: 'Manage Azure Active Directory Graph entities' },
    { ...keyvaultSpec, name: 'keyvault', description: 'Manage KeyVault keys, secrets, and certificates' },
    { ...roleSpec, name: 'role', description: 'Manage role assignments and definitions' },
    { ...identitySpec, name: 'identity', description: 'Managed Identities' },
    { ...securitySpec, name: 'security', description: 'Manage your security posture with Microsoft Defender for Cloud' },
    { ...sentinelSpec, name: 'sentinel', description: 'Manage Microsoft Sentinel' },
    { ...attestationSpec, name: 'attestation', description: 'Manage Microsoft Azure Attestation' },
    { ...confidentialledgerSpec, name: 'confidentialledger', description: 'Manage Confidential Ledger' },
    
    // AI & ML
    { ...cognitiveservicesSpec, name: 'cognitiveservices', description: 'Manage Azure Cognitive Services accounts' },
    { ...mlSpec, name: 'ml', description: 'Manage Azure Machine Learning resources' },
    { ...aiExamplesSpec, name: 'ai-examples', description: 'Add AI powered examples to help content' },
    
    // DevOps & Developer
    { ...devopsSpec, name: 'devops', description: 'Manage Azure DevOps organization level operations' },
    { ...reposSpec, name: 'repos', description: 'Manage Azure Repos' },
    { ...pipelinesSpec, name: 'pipelines', description: 'Manage Azure Pipelines' },
    { ...boardsSpec, name: 'boards', description: 'Manage Azure Boards' },
    { ...artifactsSpec, name: 'artifacts', description: 'Manage Azure Artifacts' },
    { ...acrSpec, name: 'acr', description: 'Manage Azure Container Registries' },
    { ...devcenterSpec, name: 'devcenter', description: 'Manage resources with Microsoft Dev Box' },
    { ...labSpec, name: 'lab', description: 'Manage Azure DevTest Labs' },
    { ...staticwebappSpec, name: 'staticwebapp', description: 'Manage static apps' },
    
    // Integration
    { ...eventhubsSpec, name: 'eventhubs', description: 'Manage Azure Event Hubs namespaces, eventhubs, consumer groups and geo recovery configs' },
    { ...servicebusSpec, name: 'servicebus', description: 'Manage Azure Service Bus namespaces, queues, topics, subscriptions, rules and geo-disaster recovery config alias' },
    { ...eventgridSpec, name: 'eventgrid', description: 'Manage Azure Event Grid topics, domains, domain topics, system topics, partner topics, event subscriptions, system topic event subscriptions and partner topic event subscriptions' },
    { ...logicSpec, name: 'logic', description: 'Manage logic' },
    { ...logicappSpec, name: 'logicapp', description: 'Manage logic apps' },
    { ...apimSpec, name: 'apim', description: 'Manage Azure API Management services' },
    { ...datafactorySpec, name: 'datafactory', description: 'Manage Data Factory' },
    
    // Analytics & Big Data
    { ...synapseSpec, name: 'synapse', description: 'Manage and operate Synapse Workspace, Spark Pool, SQL Pool' },
    { ...hdinsightSpec, name: 'hdinsight', description: 'Manage HDInsight resources' },
    { ...databricksSpec, name: 'databricks', description: 'Manage Azure Databricks workspaces' },
    { ...streamAnalyticsSpec, name: 'stream-analytics', description: 'Manage Stream Analytics' },
    { ...datashareSpec, name: 'datashare', description: 'Manage Data Share' },
    { ...purviewSpec, name: 'purview', description: 'Manage Purview' },
    
    // IoT
    { ...iotSpec, name: 'iot', description: 'Manage Internet of Things (IoT) assets' },
    { ...dtSpec, name: 'dt', description: 'Manage Azure Digital Twins solutions & infrastructure' },
    { ...sphereSpec, name: 'sphere', description: 'Manage Azure Sphere' },
    
    // Monitoring & Management
    { ...monitorSpec, name: 'monitor', description: 'Manage Azure Monitor Service' },
    { ...alertsManagementSpec, name: 'alerts-management', description: 'Manage Azure Alerts Management Service' },
    { ...grafanaSpec, name: 'grafana', description: 'Commands to manage Azure Grafana instances' },
    { ...logzSpec, name: 'logz', description: 'Manage Microsoft Logz' },
    { ...datadogSpec, name: 'datadog', description: 'Manage datadog' },
    { ...newRelicSpec, name: 'new-relic', description: 'Manage Azure NewRelic' },
    { ...dynatraceSpec, name: 'dynatrace', description: 'Manage dynatrace' },
    
    // Resource Management
    { ...groupSpec, name: 'group', description: 'Manage resource groups and template deployments' },
    { ...resourceSpec, name: 'resource', description: 'Manage Azure resources' },
    { ...deploymentSpec, name: 'deployment', description: 'Manage Azure Resource Manager template deployment at subscription scope' },
    { ...policySpec, name: 'policy', description: 'Manage resource policies' },
    { ...lockSpec, name: 'lock', description: 'Manage Azure locks' },
    { ...tagSpec, name: 'tag', description: 'Tag Management on a resource' },
    { ...blueprintSpec, name: 'blueprint', description: 'Commands to manage blueprint' },
    { ...managedappSpec, name: 'managedapp', description: 'Manage template solutions' },
    { ...bicepSpec, name: 'bicep', description: 'Bicep CLI command group' },
    { ...stackSpec, name: 'stack', description: 'Deployment stacks' },
    { ...tsSpec, name: 'ts', description: 'Manage template specs at subscription or resource group scope' },
    
    // Backup & Recovery
    { ...backupSpec, name: 'backup', description: 'Manage Azure Backups' },
    { ...dataprotectionSpec, name: 'dataprotection', description: 'Manage Data Protection' },
    { ...siteRecoverySpec, name: 'site-recovery', description: 'Manage Site Recovery' },
    { ...restorePointSpec, name: 'restore-point', description: 'Manage restore point' },
    
    // Hybrid & Edge
    { ...arcapplianceSpec, name: 'arcappliance', description: 'Commands to manage Arc resource bridge' },
    { ...arcdataSpec, name: 'arcdata', description: 'Commands for using Azure Arc-enabled data services' },
    { ...aroSpec, name: 'aro', description: 'Manage Azure Red Hat OpenShift clusters' },
    { ...connectedk8sSpec, name: 'connectedk8s', description: 'Commands to manage connected kubernetes clusters' },
    { ...connectedmachineSpec, name: 'connectedmachine', description: 'Manage Connected Machine' },
    { ...connectedvmwareSpec, name: 'connectedvmware', description: 'Commands to manage Connected VMware' },
    { ...azurestackhciSpec, name: 'azurestackhci', description: 'Manage Azure Stack HCI' },
    { ...stackHciSpec, name: 'stack-hci', description: 'Manage Azure Stack HCI' },
    { ...databoxSpec, name: 'databox', description: 'Manage Data Box' },
    { ...databoxedgeSpec, name: 'databoxedge', description: 'Manage device with databoxedge' },
    { ...edgeorderSpec, name: 'edgeorder', description: 'Manage Edge Order' },
    
    // Cost Management
    { ...costmanagementSpec, name: 'costmanagement', description: 'Manage cost management' },
    { ...consumptionSpec, name: 'consumption', description: 'Manage consumption of Azure resources' },
    { ...billingSpec, name: 'billing', description: 'Manage Azure Billing' },
    { ...billingBenefitsSpec, name: 'billing-benefits', description: 'Azure billing benefits commands' },
    { ...reservationsSpec, name: 'reservations', description: 'Manage Azure Reservations' },
    { ...quotaSpec, name: 'quota', description: 'Manage Azure Quota Extension API' },
    
    // Account & Auth
    { ...accountSpec, name: 'account', description: 'Manage Azure subscription information' },
    { ...loginSpec, name: 'login', description: 'Log in to Azure' },
    { ...logoutSpec, name: 'logout', description: 'Log out to remove access to Azure subscriptions' },
    
    // Configuration & Tools
    { ...configSpec, name: 'config', description: 'Manage Azure CLI configuration' },
    { ...configureSpec, name: 'configure', description: 'Manage Azure CLI configuration (interactive)' },
    { ...extensionSpec, name: 'extension', description: 'Manage and update CLI extensions' },
    { ...cloudSpec, name: 'cloud', description: 'Manage registered Azure clouds' },
    { ...aliasSpec, name: 'alias', description: 'Manage Azure CLI Aliases' },
    { ...feedbackSpec, name: 'feedback', description: 'Send feedback to the Azure CLI Team' },
    { ...findSpec, name: 'find', description: "I'm an AI robot, my advice is based on our Azure documentation" },
    { ...interactiveSpec, name: 'interactive', description: 'Start interactive mode' },
    { ...nextSpec, name: 'next', description: 'Recommend the next command' },
    { ...upgradeSpec, name: 'upgrade', description: 'Upgrade Azure CLI and extensions' },
    { ...versionSpec, name: 'version', description: 'Show version information' },
    { ...restSpec, name: 'rest', description: 'Invoke custom requests using Azure CLI' },
    { ...surveySpec, name: 'survey', description: 'Take Azure CLI survey' },
    
    // Additional Services
    { ...healthcareapisSpec, name: 'healthcareapis', description: 'Manage Healthcare Apis' },
    { ...healthbotSpec, name: 'healthbot', description: 'Manage bot with healthbot' },
    { ...botSpec, name: 'bot', description: 'Manage Microsoft Azure Bot Service' },
    { ...amsSpec, name: 'ams', description: 'Manage Azure Media Services resources' },
    { ...communicationSpec, name: 'communication', description: 'Manage communication service' },
    { ...mapsSpec, name: 'maps', description: 'Manage Azure Maps' },
    { ...searchSpec, name: 'search', description: 'Manage Azure Search services' },
    { ...notificationHubSpec, name: 'notification-hub', description: 'Manage Notification Hubs' },
    { ...vmwareSpec, name: 'vmware', description: 'Commands to manage Azure VMware Solution' },
    { ...orbitalSpec, name: 'orbital', description: 'Azure Orbital Ground Station as-a-Service' },
    { ...quantumSpec, name: 'quantum', description: 'Manage Azure Quantum Workspaces' },
    { ...meshSpec, name: 'mesh', description: 'Deploy Service Fabric Mesh applications' },
    { ...workloadsSpec, name: 'workloads', description: 'Manage workloads' },
    
    // Additional modules
    { ...adpSpec, name: 'adp', description: 'Manage ADP' },
    { ...advisorSpec, name: 'advisor', description: 'Manage Azure Advisor' },
    { ...amlfsSpec, name: 'amlfs', description: 'Manage Azure Managed Lustre' },
    { ...appconfigSpec, name: 'appconfig', description: 'Manage App Configurations' },
    { ...automanageSpec, name: 'automanage', description: 'Manage Automanage' },
    { ...automationSpec, name: 'automation', description: 'Manage Automation Account' },
    { ...baremetalinstanceSpec, name: 'baremetalinstance', description: 'Handle operations for BareMetal Instances' },
    { ...batchaiSpec, name: 'batchai', description: 'Manage Batch AI resources' },
    { ...blockchainSpec, name: 'blockchain', description: 'Manage blockchain' },
    { ...cacheSpec, name: 'cache', description: 'Commands to manage CLI cache' },
    { ...capacitySpec, name: 'capacity', description: 'Manage capacity' },
    { ...changeAnalysisSpec, name: 'change-analysis', description: 'List changes for resources' },
    { ...cliTranslatorSpec, name: 'cli-translator', description: 'Translate ARM template to CLI commands' },
    { ...cloudServiceSpec, name: 'cloud-service', description: 'Manage cloud service' },
    { ...commandChangeSpec, name: 'command-change', description: 'Commands for CLI migration guidance' },
    { ...confcomSpec, name: 'confcom', description: 'Commands to generate security policies for confidential containers' },
    { ...confluentSpec, name: 'confluent', description: 'Manage confluent organization' },
    { ...connectionSpec, name: 'connection', description: 'Commands to manage Service Connector local connections' },
    { ...csvmwareSpec, name: 'csvmware', description: 'Manage Azure VMware Solution by CloudSimple' },
    { ...customProvidersSpec, name: 'custom-providers', description: 'Commands to manage custom providers' },
    { ...customlocationSpec, name: 'customlocation', description: 'Commands to Create, Get, List and Delete CustomLocations' },
    { ...datamigrationSpec, name: 'datamigration', description: 'Manage Data Migration' },
    { ...dedicatedHsmSpec, name: 'dedicated-hsm', description: 'Manage dedicated HSM' },
    { ...demoSpec, name: 'demo', description: 'Demos for designing, developing and demonstrating Azure CLI' },
    { ...deploymentScriptsSpec, name: 'deployment-scripts', description: 'Manage deployment scripts at subscription or resource group scope' },
    { ...desktopvirtualizationSpec, name: 'desktopvirtualization', description: 'Manage desktop virtualization' },
    { ...diskAccessSpec, name: 'disk-access', description: 'Manage disk access resources' },
    { ...diskEncryptionSetSpec, name: 'disk-encryption-set', description: 'Manage disk encryption set' },
    { ...diskPoolSpec, name: 'disk-pool', description: 'Manage Azure disk pool' },
    { ...dlaSpec, name: 'dla', description: 'Manage Data Lake Analytics accounts, jobs, and catalogs' },
    { ...dlsSpec, name: 'dls', description: 'Manage Data Lake Store accounts and filesystems' },
    { ...dmsSpec, name: 'dms', description: 'Manage Azure Data Migration Service (DMS) instances' },
    { ...dncSpec, name: 'dnc', description: 'Manage Delegated Network' },
    { ...elasticSanSpec, name: 'elastic-san', description: 'Manage Elastic SAN' },
    { ...elasticSpec, name: 'elastic', description: 'Manage Microsoft Elastic' },
    { ...featureSpec, name: 'feature', description: 'Manage resource provider features' },
    { ...fleetSpec, name: 'fleet', description: 'Commands to manage fleet' },
    { ...fluidRelaySpec, name: 'fluid-relay', description: 'Manage Fluid Relay' },
    { ...footprintSpec, name: 'footprint', description: 'Manage footprint' },
    { ...fzfSpec, name: 'fzf', description: 'Commands to select active subscription or manage resource groups using fzf' },
    { ...graphServicesSpec, name: 'graph-services', description: 'Make API calls against the Microsoft Graph' },
    { ...graphSpec, name: 'graph', description: 'Query the resources managed by Azure Resource Manager' },
    { ...guestconfigSpec, name: 'guestconfig', description: 'Manage Guest Configuration' },
    { ...hackSpec, name: 'hack', description: 'Commands to manage resources commonly used for student hacks' },
    { ...hanainstanceSpec, name: 'hanainstance', description: 'Manage Azure SAP HANA Instance' },
    { ...hpcCacheSpec, name: 'hpc-cache', description: 'Commands to manage HPC Cache' },
    { ...hybridaksSpec, name: 'hybridaks', description: 'Manage Azure Arc Provisioned Clusters' },
    { ...importExportSpec, name: 'import-export', description: 'Manage Import Export' },
    { ...initSpec, name: 'init', description: 'Initialize Azure CLI interactive environment' },
    { ...internetAnalyzerSpec, name: 'internet-analyzer', description: 'Commands to manage internet analyzer' },
    { ...k8sConfigurationSpec, name: 'k8s-configuration', description: 'Commands to manage resources from Microsoft.KubernetesConfiguration' },
    { ...k8sExtensionSpec, name: 'k8s-extension', description: 'Commands to manage K8s-extensions' },
    { ...k8sconfigurationSpec, name: 'k8sconfiguration', description: 'Commands to manage K8s Configuration' },
    { ...loadSpec, name: 'load', description: 'Manage Azure Load Testing resources' },
    { ...maintenanceSpec, name: 'maintenance', description: 'Manage Maintenance' },
    { ...managedservicesSpec, name: 'managedservices', description: 'Manage the registration assignments and definitions in Azure' },
    { ...managementpartnerSpec, name: 'managementpartner', description: "Allows the partners to associate their ID with a user/service principal in customer's Azure directory" },
    { ...mobileNetworkSpec, name: 'mobile-network', description: 'Manage mobile network' },
    { ...networkFunctionSpec, name: 'network-function', description: 'Manage network function' },
    { ...networkcloudSpec, name: 'networkcloud', description: 'Manage Network Cloud resources' },
    { ...networkfabricSpec, name: 'networkfabric', description: 'Manage Azure Network Fabric Management Service API' },
    { ...nginxSpec, name: 'nginx', description: 'Manage NGINX deployment resources' },
    { ...offazureSpec, name: 'offazure', description: 'Manage on-premise resources for migrate' },
    { ...paloAltoSpec, name: 'palo-alto', description: 'Manage palo-alto networks resource' },
    { ...partnercenterSpec, name: 'partnercenter', description: 'Partner Center management' },
    { ...peeringSpec, name: 'peering', description: 'Manage peering' },
    { ...portalSpec, name: 'portal', description: 'Manage Portal' },
    { ...powerbiSpec, name: 'powerbi', description: 'Manage PowerBI resources' },
    { ...ppgSpec, name: 'ppg', description: 'Manage proximity placement groups' },
    { ...providerSpec, name: 'provider', description: 'Manage resource providers' },
    { ...providerhubSpec, name: 'providerhub', description: 'Manage resources with ProviderHub' },
    { ...qumuloSpec, name: 'qumulo', description: 'Manage qumulo' },
    { ...remoteRenderingAccountSpec, name: 'remote-rendering-account', description: 'Manage remote rendering account' },
    { ...resourceMoverSpec, name: 'resource-mover', description: 'Manage Resource Mover' },
    { ...resourcemanagementSpec, name: 'resourcemanagement', description: 'Manage Azure Resource Management' },
    { ...sapmonitorSpec, name: 'sapmonitor', description: 'Manage Azure SAP Monitor' },
    { ...scenarioSpec, name: 'scenario', description: 'E2E Scenario Usage Guidance' },
    { ...scvmmSpec, name: 'scvmm', description: 'Commands for managing Arc for SCVMM resources' },
    { ...selfHelpSpec, name: 'self-help', description: 'Azure SelfHelp' },
    { ...selfTestSpec, name: 'self-test', description: 'Runs a self-test of the CLI' },
    { ...serialConsoleSpec, name: 'serial-console', description: 'Connect to the serial console of a Linux or Windows VM' },
    { ...sigSpec, name: 'sig', description: 'Manage shared image gallery' },
    { ...spatialAnchorsAccountSpec, name: 'spatial-anchors-account', description: 'Manage spatial anchor account' },
    { ...sshSpec, name: 'ssh', description: 'SSH to Azure VMs using AAD credentials' },
    { ...sshkeySpec, name: 'sshkey', description: 'Manage ssh public keys with vm' },
    { ...supportSpec, name: 'support', description: 'Manage Azure support resource' },
    { ...termSpec, name: 'term', description: 'Manage marketplace agreement with marketplaceordering' },
    { ...tsiSpec, name: 'tsi', description: 'Manage Azure Time Series Insights' },
  ],
  options: globalOptions,
};
