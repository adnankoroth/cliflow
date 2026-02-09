#!/usr/bin/env node
/**
 * AWS Spec Converter for CLIFlow
 * 
 * Converts Fig.io AWS service TypeScript specs to CLIFlow TypeScript format.
 * 
 * Usage:
 *   node scripts/convert-aws-specs.mjs                    # Convert all AWS services
 *   node scripts/convert-aws-specs.mjs s3 ec2 lambda      # Convert specific services
 * 
 * Output goes to src/completions/aws/<service>.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIG_AWS_DIR = path.join(__dirname, '../../github.com/autocomplete/src/aws');
const OUTPUT_DIR = path.join(__dirname, '../src/completions/aws');

// Services we've already manually created with better implementations
const SKIP_SERVICES = new Set([
  '_shared',
  's3', 's3api',
  'ec2',
  'lambda',
  'iam',
  'eks',
  'ecs',
  'rds',
  'dynamodb',
  'cloudformation',
  'logs',
  'ssm',
  'sts',
  'configure', // Part of main aws.ts
]);

// Icon mapping from Fig to emoji
const ICON_MAP = {
  'fig://icon?type=aws': '☁️',
  'fig://icon?type=box': '📦',
  'fig://icon?type=string': '📝',
  'fig://icon?type=option': '⚙️',
  'fig://icon?type=command': '⚡',
  'fig://icon?type=folder': '📁',
  'fig://icon?type=file': '📄',
  'fig://icon?type=alert': '⚠️',
};

/**
 * Convert Fig icon to emoji
 */
function convertIcon(iconStr) {
  if (!iconStr) return '⚡';
  
  for (const [figIcon, emoji] of Object.entries(ICON_MAP)) {
    if (iconStr.includes(figIcon)) return emoji;
  }
  
  // Extract type from fig://icon?type=X
  const match = iconStr.match(/fig:\/\/icon\?type=(\w+)/);
  if (match) {
    const type = match[1].toLowerCase();
    if (type.includes('bucket')) return '🪣';
    if (type.includes('database') || type.includes('db')) return '🗄️';
    if (type.includes('function') || type.includes('lambda')) return '⚡';
    if (type.includes('container')) return '🐳';
    if (type.includes('cluster')) return '☸️';
    if (type.includes('instance')) return '🖥️';
    if (type.includes('role')) return '👤';
    if (type.includes('policy')) return '📋';
    if (type.includes('secret')) return '🔐';
    if (type.includes('key')) return '🔑';
    if (type.includes('network')) return '🌐';
    if (type.includes('volume')) return '💾';
    if (type.includes('snapshot')) return '📸';
    if (type.includes('log')) return '📋';
    if (type.includes('queue')) return '📬';
    if (type.includes('topic')) return '📢';
  }
  
  return '⚡';
}

/**
 * Convert Fig TypeScript spec to CLIFlow TypeScript format
 */
function convertFigSpec(code, serviceName) {
  let result = code;
  
  // Remove Fig type imports
  result = result.replace(/import\s+type\s+.*?from\s+['"][^'"]+['"];?\n?/g, '');
  result = result.replace(/import\s*{\s*type\s+[^}]+}\s*from\s+['"][^'"]+['"];?\n?/g, '');
  
  // Remove @fig/autocomplete imports
  result = result.replace(/import\s*{[^}]*}\s*from\s+['"]@fig\/autocomplete[^'"]*['"];?\n?/g, '');
  result = result.replace(/import\s+\*\s+as\s+\w+\s+from\s+['"]@fig\/autocomplete[^'"]*['"];?\n?/g, '');
  
  // Remove Fig. type prefixes
  result = result.replace(/:\s*Fig\.\w+(\[\])?\s*(?=[=,;)\n{])/g, '');
  result = result.replace(/<Fig\.\w+(\[\])?>/g, '');
  result = result.replace(/\s+as\s+Fig\.\w+(\[\])?/g, '');
  
  // Remove basic TypeScript type annotations (but keep the structure)
  result = result.replace(/:\s*(?:string|number|boolean|any|void|null|undefined)(\[\])?\s*(?=[=;,)\n])/g, '');
  
  // Convert Fig icons to emoji
  result = result.replace(/['"]fig:\/\/icon\?[^'"]+['"]/g, (match) => {
    const emoji = convertIcon(match);
    return `'${emoji}'`;
  });
  
  // Remove dynamic Array.from expressions used for suggestions
  // These span multiple lines and can't be converted easily
  result = result.replace(/suggestions:\s*Array\.from\([^)]+\)[^,}]*,?/gs, '');
  
  // Convert string array suggestions to Suggestion object arrays
  // Fig: suggestions: ["input", "output"]
  // CLIFlow: suggestions: [{ name: "input" }, { name: "output" }]
  // Handle both single-line and multi-line arrays
  result = result.replace(
    /suggestions:\s*\[([\s\S]*?)\]/g,
    (match, content) => {
      // Check if it's already object format (has curly braces with 'name')
      if (content.includes('name:')) return match;
      
      // Check if it's a dynamic expression like Array.from(...) - remove dynamic suggestions
      if (content.includes('Array.from') || content.includes('.map(')) {
        return 'suggestions: []';
      }
      
      // Split by comma and convert strings to objects
      const items = content.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0 && s !== '')
        .map(s => {
          // Remove any trailing/leading whitespace and newlines
          s = s.trim();
          // If it's a string literal, convert to object
          if (s.match(/^['"][^'"]*['"]$/)) {
            return `{ name: ${s} }`;
          }
          return s;
        })
        .filter(s => s.length > 0);
      
      if (items.length === 0) return 'suggestions: []';
      return `suggestions: [${items.join(', ')}]`;
    }
  );
  
  // Remove template: "filepaths" array syntax - convert to string
  result = result.replace(/template:\s*\[\s*['"]filepaths['"]\s*\]/g, 'template: "filepaths"');
  result = result.replace(/template:\s*\[\s*['"]folders['"]\s*\]/g, 'template: "folders"');
  
  // Handle loadSpec - replace with comment (we'll need to import separately)
  result = result.replace(
    /loadSpec:\s*['"]([^'"]+)['"]/g, 
    '// loadSpec: "$1" - TODO: Import from ./$1.js'
  );
  
  // Remove Fig generators references (generators.xxx) - these require @fig/autocomplete-generators
  // Replace with empty generator or remove the generators property entirely
  result = result.replace(/generators:\s*generators\.\w+,?\n?/g, '');
  result = result.replace(/generators:\s*\[generators\.\w+\],?\n?/g, '');
  result = result.replace(/generators:\s*\[\s*generators\.\w+,\s*generators\.\w+\s*\],?\n?/g, '');
  // Handle multi-line generator arrays
  result = result.replace(/generators:\s*\[\s*\n\s*generators\.\w+,?\s*\n\s*(?:generators\.\w+,?\s*\n\s*)*\],?\n?/g, '');
  
  // Remove awsRegions references that come from Fig's shared module
  result = result.replace(/awsRegions/g, '[]');
  
  // Remove spread operator references to local variables
  result = result.replace(/,\s*\.\.\.\w+/g, '');
  
  // Remove local const variable references that Fig defines at the top
  // These are typically arrays like branchStages, metricTypes, etc.
  // We'll just remove the suggestions line that references them
  result = result.replace(/suggestions:\s*\w+(?:Types|Stages|States|Names)?,?\n?/g, '');
  result = result.replace(/suggestions:\s*(?:statistics|unit|namespaces|attributes|alarmStates|metricTypes|branchStages),?\n?/g, '');
  
  // Extract just the subcommands array from the spec
  // Fig format: const completionSpec: Fig.Spec = { name: "...", description: "...", subcommands: [...] }
  // We want just the subcommands array
  
  const subcommandsMatch = result.match(/subcommands:\s*\[([\s\S]*)\]\s*,?\s*}\s*;?\s*(?:export\s+default\s+completionSpec)?/);
  
  if (subcommandsMatch) {
    const subcommandsContent = subcommandsMatch[1];
    
    // Create the clean export
    const cleanName = serviceName.replace(/[^a-zA-Z0-9]/g, '');
    
    result = `export const ${cleanName}Subcommands: Subcommand[] = [${subcommandsContent}];`;
  } else {
    // Fallback: try to at least clean up the structure
    const cleanName = serviceName.replace(/[^a-zA-Z0-9]/g, '');
    result = result.replace(
      /const\s+completionSpec\s*(?::\s*[\w.]+\s*)?=\s*{[\s\S]*?name:\s*["'][^"']+["'],\s*description:\s*["'][^"']*["'],\s*subcommands:\s*/,
      `export const ${cleanName}Subcommands: Subcommand[] = `
    );
    // Remove trailing }; and export default
    result = result.replace(/}\s*;\s*export\s+default\s+completionSpec\s*;?\s*$/, '];');
    result = result.replace(/export\s+default\s+completionSpec\s*;?\s*$/, '');
  }
  
  // Add CLIFlow imports header
  const cleanName = serviceName.replace(/[^a-zA-Z0-9]/g, '');
  const header = `// ${serviceName.toUpperCase()} service completions for AWS CLI
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { Subcommand } from '../../types.js';

`;

  return header + result;
}

/**
 * Process a single AWS service spec
 */
function convertService(serviceName) {
  const inputPath = path.join(FIG_AWS_DIR, `${serviceName}.ts`);
  const outputPath = path.join(OUTPUT_DIR, `${serviceName}.ts`);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠️  Not found: ${serviceName}.ts`);
    return null;
  }
  
  console.log(`  Converting: ${serviceName}`);
  
  try {
    const code = fs.readFileSync(inputPath, 'utf-8');
    const converted = convertFigSpec(code, serviceName);
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, converted);
    console.log(`    → ${outputPath}`);
    return serviceName;
  } catch (err) {
    console.error(`    ✗ Error: ${err.message}`);
    return null;
  }
}

/**
 * Get list of all AWS services from Fig
 */
function getAllServices() {
  if (!fs.existsSync(FIG_AWS_DIR)) {
    console.error(`Error: Fig AWS directory not found: ${FIG_AWS_DIR}`);
    process.exit(1);
  }
  
  return fs.readdirSync(FIG_AWS_DIR)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts'))
    .map(f => f.replace('.ts', ''))
    .filter(s => !SKIP_SERVICES.has(s));
}

/**
 * Main
 */
function main() {
  const args = process.argv.slice(2);
  
  console.log('AWS Spec Converter for CLIFlow');
  console.log('==============================\n');
  
  let services;
  
  if (args.length > 0 && args[0] !== '--all') {
    // Convert specific services
    services = args;
  } else {
    // Convert all services
    services = getAllServices();
  }
  
  console.log(`Processing ${services.length} AWS services...\n`);
  
  const converted = [];
  const failed = [];
  const skipped = [];
  
  for (const service of services) {
    if (SKIP_SERVICES.has(service)) {
      console.log(`  ⏭️  Skipping ${service} (already have better implementation)`);
      skipped.push(service);
      continue;
    }
    
    const result = convertService(service);
    if (result) {
      converted.push(result);
    } else {
      failed.push(service);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`Results:`);
  console.log(`  Converted: ${converted.length}`);
  console.log(`  Skipped:   ${skipped.length}`);
  console.log(`  Failed:    ${failed.length}`);
  
  if (converted.length > 0) {
    console.log('\n📝 Next steps:');
    console.log('  1. Review converted files in src/completions/aws/');
    console.log('  2. Update src/completions/aws.ts to import new services');
    console.log('  3. Run: npm run build');
  }
}

main();
