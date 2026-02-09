#!/usr/bin/env node
/**
 * Fig.io Spec Converter for CLIFlow
 * 
 * Converts Fig.io TypeScript completion specs to CLIFlow JavaScript format.
 * 
 * Usage:
 *   node scripts/convert-fig-spec.mjs <fig-spec.ts> [output-dir]
 *   node scripts/convert-fig-spec.mjs --batch <fig-src-dir> [output-dir]
 * 
 * The Fig autocomplete repo uses TypeScript with Fig-specific types.
 * This converter:
 *   1. Strips TypeScript types
 *   2. Converts Fig icon URLs to emoji/simple icons
 *   3. Handles Fig-specific generator patterns
 *   4. Exports in CLIFlow format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Specs to skip during conversion - CLIFlow has better built-in versions
// These either have smart path templates or are more comprehensive
const SKIP_SPECS = new Set([
  // Basic Linux commands - CLIFlow has smart path-aware templates
  'cd', 'ls', 'cat', 'grep', 'find', 'rm', 'mv', 'cp', 'chmod', 'chown',
  'head', 'tail', 'ssh', 'scp', 'tar', 'mkdir', 'ps', 'kill',
  // Tools where CLIFlow built-in is more comprehensive
  'nuxt', 'kubens', 'kubectx', 'create-react-app', 'next', 'playwright',
  'ng', 'sqlite3', 'psql', 'mongosh', 'ansible-playbook', 'ansible',
  'vite', 'eslint', 'prettier', 'kind', 'gcloud', 'jest', 'terraform',
  'prisma', 'serverless', 'vue', 'tailscale', 'mysql', 'wget', 'gpg',
  'go', 'minikube', 'docker-compose', 'curl', 'sls',
  // Note: git, docker, kubectl, npm, aws, pip, cargo, gh, helm, vault, 
  // yarn, op, pulumi are kept - community has more subcommands/options
]);

// Icon mapping from Fig icons to CLIFlow/emoji icons
const ICON_MAP = {
  'fig://icon?type=kubernetes': '☸️',
  'fig://icon?type=docker': '🐳',
  'fig://icon?type=git': '🔀',
  'fig://icon?type=github': '🐙',
  'fig://icon?type=folder': '📁',
  'fig://icon?type=file': '📄',
  'fig://icon?type=string': '📝',
  'fig://icon?type=option': '⚙️',
  'fig://icon?type=command': '⚡',
  'fig://icon?type=npm': '📦',
  'fig://icon?type=yarn': '🧶',
  'fig://icon?type=node': '🟢',
  'fig://icon?type=python': '🐍',
  'fig://icon?type=rust': '🦀',
  'fig://icon?type=go': '🐹',
  'fig://icon?type=java': '☕',
  'fig://icon?type=aws': '☁️',
  'fig://icon?type=azure': '🔷',
  'fig://icon?type=gcp': '🔶',
  'fig://icon?type=terraform': '🏗️',
  'fig://icon?type=ansible': '🅰️',
  'fig://icon?type=box': '📦',
  'fig://icon?type=alert': '⚠️',
  'fig://icon?type=asterisk': '✳️',
  'fig://icon?type=carrot': '🥕',
};

// Default icon for unknown types
const DEFAULT_ICON = '⚡';

/**
 * Convert a Fig icon URL to CLIFlow icon
 */
function convertIcon(figIcon) {
  if (!figIcon) return DEFAULT_ICON;
  
  // Direct match
  if (ICON_MAP[figIcon]) {
    return ICON_MAP[figIcon];
  }
  
  // Pattern match for fig://icon?type=X
  const match = figIcon.match(/fig:\/\/icon\?type=(\w+)/);
  if (match) {
    const type = match[1].toLowerCase();
    // Check common types
    if (type.includes('folder') || type.includes('directory')) return '📁';
    if (type.includes('file')) return '📄';
    if (type.includes('git')) return '🔀';
    if (type.includes('branch')) return '🌿';
    if (type.includes('commit')) return '📝';
    if (type.includes('remote')) return '🌐';
    if (type.includes('tag')) return '🏷️';
    if (type.includes('stash')) return '📦';
    if (type.includes('user') || type.includes('person')) return '👤';
    if (type.includes('container') || type.includes('docker')) return '🐳';
    if (type.includes('pod') || type.includes('kubernetes')) return '☸️';
    if (type.includes('service')) return '🔌';
    if (type.includes('secret')) return '🔐';
    if (type.includes('config')) return '⚙️';
    if (type.includes('namespace')) return '📂';
    if (type.includes('node')) return '🖥️';
    if (type.includes('database') || type.includes('db')) return '🗄️';
    if (type.includes('network')) return '🌐';
    if (type.includes('volume')) return '💾';
    if (type.includes('image')) return '🖼️';
    if (type.includes('key')) return '🔑';
    if (type.includes('cert') || type.includes('certificate')) return '📜';
    if (type.includes('log')) return '📋';
    if (type.includes('error')) return '❌';
    if (type.includes('warning')) return '⚠️';
    if (type.includes('success') || type.includes('check')) return '✅';
    if (type.includes('info')) return 'ℹ️';
  }
  
  // Check for file extension patterns
  const extMatch = figIcon.match(/fig:\/\/icon\?type=(\.\w+)/);
  if (extMatch) {
    const ext = extMatch[1].toLowerCase();
    if (['.js', '.ts', '.mjs', '.cjs'].includes(ext)) return '🟨';
    if (['.py', '.pyw'].includes(ext)) return '🐍';
    if (['.go'].includes(ext)) return '🐹';
    if (['.rs'].includes(ext)) return '🦀';
    if (['.java', '.class', '.jar'].includes(ext)) return '☕';
    if (['.json', '.yaml', '.yml', '.toml'].includes(ext)) return '📋';
    if (['.md', '.txt', '.doc'].includes(ext)) return '📝';
    if (['.sh', '.bash', '.zsh', '.fish'].includes(ext)) return '🖥️';
    return '📄';
  }
  
  return DEFAULT_ICON;
}

/**
 * Remove TypeScript type annotations from code
 */
function stripTypeAnnotations(code) {
  let result = code;
  
  // Remove type imports
  result = result.replace(/import\s+type\s+.*?from\s+['"][^'"]+['"];?\n?/g, '');
  result = result.replace(/import\s*{\s*type\s+[^}]+}\s*from\s+['"][^'"]+['"];?\n?/g, '');
  
  // Remove @fig/autocomplete-generators imports (we'll handle these differently)
  result = result.replace(/import\s*{[^}]*}\s*from\s+['"]@fig\/autocomplete-generators['"];?\n?/g, '');
  result = result.replace(/import\s+\*\s+as\s+\w+\s+from\s+['"]@fig\/autocomplete-generators['"];?\n?/g, '');
  
  // Remove Fig. type prefixes (e.g., Fig.Spec, Fig.Generator, Fig.Suggestion[])
  result = result.replace(/:\s*Fig\.\w+(\[\])?\s*(?=[=,;)\n])/g, '');
  result = result.replace(/<Fig\.\w+(\[\])?>/g, '');
  result = result.replace(/\s+as\s+Fig\.\w+(\[\])?/g, '');
  
  // Remove type annotations on variables (: Type =)
  result = result.replace(/:\s*(?:string|number|boolean|any|void|null|undefined|object|unknown|never)(\[\])?\s*(?=[=;,)\n])/g, '');
  
  // Remove Record<...> type annotations
  result = result.replace(/:\s*Record<[^>]+>\s*(?=[=;,)\n])/g, '');
  
  // Remove inline type assertions (as Type)
  result = result.replace(/\s+as\s+(?:string|number|boolean|any|void|null|undefined|object|unknown|never)(\[\])?/g, '');
  result = result.replace(/\s+as\s+const/g, '');
  
  // Remove generic type parameters on function declarations
  result = result.replace(/<[A-Z]\w*(?:\s*extends\s*[^>]+)?>/g, '');
  
  // Remove function return type annotations
  result = result.replace(/\)\s*:\s*(?:\w+|{[^}]+}|\([^)]+\))\s*(?:=>|{)/g, (match) => {
    if (match.includes('=>')) return ') =>';
    return ') {';
  });
  
  // Remove interface declarations
  result = result.replace(/interface\s+\w+\s*{[^}]*}\n?/g, '');
  
  // Remove type declarations
  result = result.replace(/type\s+\w+\s*=\s*[^;]+;\n?/g, '');
  
  return result;
}

/**
 * Convert Fig icon references in the code
 */
function convertIconReferences(code) {
  // Replace fig://icon URLs with emoji equivalents
  return code.replace(/['"]fig:\/\/icon\?[^'"]+['"]/g, (match) => {
    const iconUrl = match.slice(1, -1); // Remove quotes
    const emoji = convertIcon(iconUrl);
    return `'${emoji}'`;
  });
}

/**
 * Convert the export statement
 */
function convertExport(code, specName) {
  // Replace "export default completionSpec" with "export const <name>Spec = ..."
  const cleanName = specName.replace(/[^a-zA-Z0-9]/g, '');
  
  // Handle "const completionSpec: Fig.Spec = {...}; export default completionSpec;"
  code = code.replace(
    /const\s+completionSpec\s*(?::\s*Fig\.Spec\s*)?=\s*/g,
    `export const ${cleanName}Spec = `
  );
  code = code.replace(/export\s+default\s+completionSpec\s*;?\s*$/g, '');
  
  return code;
}

/**
 * Handle Fig-specific generator patterns
 */
function convertGenerators(code) {
  let result = code;
  
  // Remove ai() generator calls (these are Fig-specific AI generators)
  // Replace with a simple placeholder that returns empty
  result = result.replace(
    /ai\s*\([^)]*\)/g,
    '{ script: "", postProcess: () => [] }'
  );
  
  // Convert Fig.Generator["postProcess"] type pattern
  result = result.replace(/Fig\.Generator\["postProcess"\]/g, '');
  
  return result;
}

/**
 * Add CLIFlow header comment
 */
function addHeader(code, originalFile) {
  const header = `/**
 * CLIFlow Completion Spec
 * Converted from Fig.io spec: ${path.basename(originalFile)}
 * 
 * Original source: https://github.com/withfig/autocomplete
 * License: MIT
 */

`;
  return header + code;
}

/**
 * Convert a single Fig spec file to CLIFlow format
 */
function convertSpec(inputPath, outputPath) {
  const specName = path.basename(inputPath, '.ts');
  
  console.log(`Converting: ${specName}`);
  
  let code = fs.readFileSync(inputPath, 'utf-8');
  
  // Apply conversions in order
  code = stripTypeAnnotations(code);
  code = convertIconReferences(code);
  code = convertGenerators(code);
  code = convertExport(code, specName);
  code = addHeader(code, inputPath);
  
  // Write output
  const outFile = outputPath || path.join(
    __dirname, '..', 'fig-specs', `${specName}.mjs`
  );
  
  const outDir = path.dirname(outFile);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  fs.writeFileSync(outFile, code);
  console.log(`  → ${outFile}`);
  
  return outFile;
}

/**
 * Batch convert all specs in a directory
 */
function batchConvert(inputDir, outputDir) {
  const files = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts'));
  
  console.log(`Found ${files.length} Fig specs to convert\n`);
  
  const converted = [];
  const failed = [];
  
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const specName = path.basename(file, '.ts');
    const outputPath = path.join(outputDir, `${specName}.mjs`);
    
    // Skip specs where CLIFlow has a better built-in version
    if (SKIP_SPECS.has(specName)) {
      console.log(`  ⏭️  Skipping ${specName} (CLIFlow has better built-in)`);
      continue;
    }
    
    try {
      convertSpec(inputPath, outputPath);
      converted.push(specName);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      failed.push({ name: specName, error: err.message });
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`Converted: ${converted.length}/${files.length} specs`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.length}`);
    failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
  }
  
  return { converted, failed };
}

/**
 * Create an index file that exports all specs
 */
function createIndex(outputDir, specs) {
  const indexContent = `/**
 * CLIFlow Fig Specs Index
 * Auto-generated index of converted Fig.io completion specs
 */

${specs.map(s => `import { ${s.replace(/[^a-zA-Z0-9]/g, '')}Spec } from './${s}.mjs';`).join('\n')}

export const figSpecs = {
${specs.map(s => `  '${s}': ${s.replace(/[^a-zA-Z0-9]/g, '')}Spec,`).join('\n')}
};

export default figSpecs;
`;
  
  fs.writeFileSync(path.join(outputDir, 'index.mjs'), indexContent);
  console.log(`Created index.mjs with ${specs.length} specs`);
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Fig.io Spec Converter for CLIFlow
=================================

Usage:
  # Convert a single spec
  node scripts/convert-fig-spec.mjs <fig-spec.ts> [output.mjs]
  
  # Batch convert all specs in a directory
  node scripts/convert-fig-spec.mjs --batch <fig-src-dir> [output-dir]

Examples:
  # Convert ls.ts
  node scripts/convert-fig-spec.mjs ~/go/github.com/autocomplete/src/ls.ts
  
  # Batch convert all Fig specs
  node scripts/convert-fig-spec.mjs --batch ~/go/github.com/autocomplete/src ./fig-specs

The converter will:
  1. Strip TypeScript type annotations
  2. Convert Fig icon URLs to emoji icons
  3. Handle Fig-specific generators
  4. Export in CLIFlow format
`);
  process.exit(0);
}

if (args[0] === '--batch') {
  const inputDir = args[1] || path.join(__dirname, '../../github.com/autocomplete/src');
  const outputDir = args[2] || path.join(__dirname, '..', 'fig-specs');
  
  if (!fs.existsSync(inputDir)) {
    console.error(`Error: Input directory not found: ${inputDir}`);
    process.exit(1);
  }
  
  const { converted } = batchConvert(inputDir, outputDir);
  createIndex(outputDir, converted);
} else {
  const inputPath = args[0];
  const outputPath = args[1];
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
  }
  
  convertSpec(inputPath, outputPath);
}
