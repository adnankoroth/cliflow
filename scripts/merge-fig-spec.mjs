#!/usr/bin/env node

/**
 * Merge Fig.io's comprehensive completion spec with CLIFlow's dynamic generators
 * 
 * This script:
 * 1. Reads Fig's spec (with comprehensive options and subcommands)
 * 2. Converts Fig.Generator references to our generators
 * 3. Outputs a merged TypeScript spec
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Generator mapping: Fig generator name -> CLIFlow generator import
const generatorMapping = {
  // Git
  'gitGenerators.commits': 'gitCommitsGenerator',
  'gitGenerators.remoteLocalBranches': 'gitBranches',
  'gitGenerators.localBranches': 'gitBranches',
  'gitGenerators.localOrRemoteBranches': 'gitBranches',
  'gitGenerators.remotes': 'gitRemotes',
  'gitGenerators.tags': 'gitTags',
  'gitGenerators.stashes': 'gitStashes',
  'gitGenerators.files_for_staging': 'gitStatusGenerator',
  'gitGenerators.getStagedFiles': 'gitStatusGenerator',
  'gitGenerators.getUnstagedFiles': 'gitStatusGenerator',
  'gitGenerators.getChangedTrackedFiles': 'gitStatusGenerator',
  'gitGenerators.treeish': 'gitStatusGenerator',
  'gitGenerators.revs': 'gitCommitsGenerator',
  'gitGenerators.aliases': null, // Skip AI generators
  
  // Docker
  'generators.runningContainers': 'dockerRunningContainers',
  'generators.allContainers': 'dockerContainers',
  'generators.listDockerImages': 'dockerImages',
  'generators.listDockerVolumes': 'dockerVolumes',
  'generators.listDockerNetworks': 'dockerNetworks',
  
  // Kubernetes
  'generators.listPods': 'k8sPods',
  'generators.listDeployments': 'k8sDeployments',
  'generators.listServices': 'k8sServices',
  'generators.listNamespaces': 'k8sNamespaces',
  'generators.listContexts': 'k8sContexts',
  
  // NPM
  'npmScriptsGenerator': 'npmScripts',
  'npmSearchGenerator': null, // Skip
  'installedDependencies': 'npmPackages',
};

// Function to convert Fig spec to CLIFlow format
function convertSpec(figSpecContent, specName, imports, generators) {
  let result = figSpecContent;
  
  // Remove Fig imports
  result = result.replace(/import\s*{[^}]*}\s*from\s*['"]@fig\/[^'"]*['"];?\n?/g, '');
  result = result.replace(/import\s+.*\s+from\s*['"]@fig\/[^'"]*['"];?\n?/g, '');
  
  // Replace Fig.Generator type references
  result = result.replace(/Fig\.Generator/g, 'Generator');
  result = result.replace(/Fig\.Subcommand/g, 'Subcommand');
  result = result.replace(/Fig\.Option/g, 'Option');
  result = result.replace(/Fig\.Arg/g, 'Arg');
  result = result.replace(/Fig\.Suggestion/g, 'Suggestion');
  result = result.replace(/: Fig\./g, ': ');
  
  // Replace fig:// icons with emojis
  result = result.replace(/fig:\/\/icon\?type=git/g, '🔀');
  result = result.replace(/fig:\/\/icon\?type=github/g, '🐙');
  result = result.replace(/fig:\/\/icon\?type=gitlab/g, '🦊');
  result = result.replace(/fig:\/\/icon\?type=node/g, '📌');
  result = result.replace(/fig:\/\/icon\?type=folder/g, '📁');
  result = result.replace(/fig:\/\/icon\?type=file/g, '📄');
  result = result.replace(/fig:\/\/icon\?type=commandkey/g, '⌘');
  result = result.replace(/fig:\/\/icon\?type=[^"'`}]+/g, '📦');
  result = result.replace(/`fig:\/\/[^`]+`/g, "'📦'");
  
  // Replace generator references
  for (const [figGen, cliGen] of Object.entries(generatorMapping)) {
    if (cliGen) {
      // Handle generators: [gitGenerators.commits]
      const pattern1 = new RegExp(`generators:\\s*\\[?${figGen.replace('.', '\\.')}\\]?`, 'g');
      result = result.replace(pattern1, `generators: [${cliGen}]`);
      
      // Handle generators: gitGenerators.commits (without array)
      const pattern2 = new RegExp(`generators:\\s*${figGen.replace('.', '\\.')}([,\\s\\n])`, 'g');
      result = result.replace(pattern2, `generators: [${cliGen}]$1`);
    } else {
      // Remove unsupported generators (like AI)
      const pattern = new RegExp(`generators:\\s*\\[?${figGen.replace('.', '\\.')}[^,\\n}]*\\]?,?\\n?`, 'g');
      result = result.replace(pattern, '');
    }
  }
  
  // Remove AI generator calls
  result = result.replace(/generators:\s*ai\([^)]+\),?\n?/gs, '');
  
  // Remove custom generators with executeShellCommand (too complex)
  result = result.replace(/custom:\s*async\s*\([^)]*\)\s*=>\s*{[\s\S]*?},\n?/g, '');
  
  // Replace template arrays with single strings where needed
  result = result.replace(/template:\s*\["filepaths"\]/g, "template: 'filepaths'");
  result = result.replace(/template:\s*\["folders"\]/g, "template: 'folders'");
  result = result.replace(/template:\s*\["files"\]/g, "template: 'files'");
  
  // Add our imports
  const importStatement = `import { CompletionSpec, Generator } from '../types.js';
${imports}

${generators}
`;
  
  // Add export statement if needed
  if (!result.includes('export const')) {
    result = result.replace(/const completionSpec/, 'export const ' + specName + 'Spec');
  }
  
  return importStatement + result;
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node merge-fig-spec.mjs <fig-spec-path> <output-path> [spec-name]');
    console.log('');
    console.log('Examples:');
    console.log('  node merge-fig-spec.mjs ../github.com/autocomplete/src/git.ts ./src/completions/git.ts git');
    console.log('  node merge-fig-spec.mjs ../github.com/autocomplete/src/docker.ts ./src/completions/docker.ts docker');
    process.exit(1);
  }
  
  const [figPath, outputPath, specName = 'spec'] = args;
  
  // Check if file exists
  const fullFigPath = figPath.startsWith('/') ? figPath : join(process.cwd(), figPath);
  if (!existsSync(fullFigPath)) {
    console.error(`Error: Fig spec not found at ${fullFigPath}`);
    process.exit(1);
  }
  
  console.log(`Reading Fig spec from: ${fullFigPath}`);
  const figContent = readFileSync(fullFigPath, 'utf-8');
  
  // Determine imports and generators based on spec name
  let imports = '';
  let generators = '';
  
  if (specName === 'git') {
    imports = `import { 
  gitBranches, 
  gitRemotes, 
  gitTags, 
  gitStashes 
} from '../engine/common-generators.js';`;
    
    generators = `// Git status generator for modified files
const gitStatusGenerator: Generator = {
  script: 'git status --porcelain 2>/dev/null',
  postProcess: (output) => {
    if (output.startsWith('fatal:') || !output.trim()) return [];
    return output.split('\\n').filter(l => l.trim()).map(line => {
      const status = line.substring(0, 2);
      const filename = line.substring(3);
      let icon = '📄', description = 'Modified';
      if (status.includes('A')) { description = 'Added'; icon = '➕'; }
      if (status.includes('D')) { description = 'Deleted'; icon = '🗑️'; }
      if (status.includes('??')) { description = 'Untracked'; icon = '❓'; }
      return { name: filename, description, icon, type: 'file' as const, priority: status === '??' ? 50 : 100 };
    });
  },
  cache: { ttl: 1000, strategy: 'ttl' as const }
};

// Git commits generator
const gitCommitsGenerator: Generator = {
  script: 'git log --oneline -30 2>/dev/null',
  postProcess: (output) => {
    if (output.startsWith('fatal:') || !output.trim()) return [];
    return output.split('\\n').filter(l => l.trim()).map((line, i) => {
      const [hash, ...msgParts] = line.split(' ');
      return { name: hash, description: msgParts.join(' ').slice(0, 60), type: 'argument' as const, icon: '📌', priority: 100 - i };
    });
  },
  cache: { ttl: 5000, strategy: 'ttl' as const }
};`;
  } else if (specName === 'docker') {
    imports = `import { 
  dockerContainers, 
  dockerRunningContainers, 
  dockerImages, 
  dockerVolumes, 
  dockerNetworks 
} from '../engine/common-generators.js';`;
    generators = '';
  } else if (specName === 'kubectl') {
    imports = `import { 
  k8sNamespaces, 
  k8sPods, 
  k8sDeployments, 
  k8sServices, 
  k8sContexts 
} from '../engine/common-generators.js';`;
    generators = '';
  } else if (specName === 'npm') {
    imports = `import { npmScripts, npmPackages } from '../engine/common-generators.js';`;
    generators = '';
  }
  
  console.log(`Converting spec: ${specName}`);
  const convertedContent = convertSpec(figContent, specName, imports, generators);
  
  // Write output
  const fullOutputPath = outputPath.startsWith('/') ? outputPath : join(process.cwd(), outputPath);
  console.log(`Writing to: ${fullOutputPath}`);
  writeFileSync(fullOutputPath, convertedContent, 'utf-8');
  
  console.log('Done! You may need to manually fix some TypeScript issues.');
}

main();
