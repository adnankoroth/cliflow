#!/usr/bin/env node
/**
 * Fig Spec Converter for CLIFlow - Improved Version
 * 
 * Converts Fig.io TypeScript specs to CLIFlow TypeScript format.
 * Handles complex patterns including:
 *   - @fig/autocomplete-generators imports (filepaths, keyValue, knownHosts, etc.)
 *   - Inline generator functions with postProcess
 *   - TypeScript type annotations
 *   - Fig.* type references
 *   - Cross-file imports and loadSpec
 *   - generateSpec async functions
 * 
 * Usage:
 *   node scripts/convert-fig-specs.mjs git docker kubectl    # Convert specific specs
 *   node scripts/convert-fig-specs.mjs --all                  # Convert all specs
 *   node scripts/convert-fig-specs.mjs --list                 # List available specs
 *   node scripts/convert-fig-specs.mjs --top 50               # Convert top 50 by size
 *   node scripts/convert-fig-specs.mjs --missing              # Convert specs CLIFlow doesn't have
 *   node scripts/convert-fig-specs.mjs --force git            # Force overwrite existing
 *   node scripts/convert-fig-specs.mjs --strict               # Fail on unconvertible patterns
 * 
 * Output goes to src/completions/<spec>.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIG_SRC_DIR = path.join(__dirname, '../../github.com/autocomplete/src');
const OUTPUT_DIR = path.join(__dirname, '../src/completions');

// Specs we've already created or don't want to convert
const SKIP_SPECS = new Set([
  // Already have comprehensive custom implementations
  'aws',  // Has modular structure in aws/
  'gh',   // Custom comprehensive version
  'git',  // Custom comprehensive version  
  'docker', // Custom comprehensive version
  'kubectl', // Custom comprehensive version
  
  // Non-spec files in Fig
  '_shortcuts',
  'index',
  'danger',
  'dangerfile',
  
  // Internal/test files
  'test',
  'example',
]);

// Map of Fig spec names to CLIFlow export names (when different)
const NAME_MAP = {
  'docker-compose': 'dockerComposeSpec',
  'npm': 'npmSpec',
};

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
  'fig://icon?type=github': '🐙',
  'fig://icon?type=git': '📚',
  'fig://icon?type=npm': '📦',
  'fig://icon?type=node': '💚',
  'fig://icon?type=docker': '🐳',
  'fig://icon?type=kubernetes': '☸️',
  'fig://icon?type=terminal': '💻',
  'fig://icon?type=asterisk': '✨',
  'fig://icon?type=package': '📦',
  'fig://icon?type=bluetooth': '📶',
  'fig://icon?type=cpu': '🖥️',
  'fig://icon?type=yarn': '🧶',
  'fig://icon?type=pnpm': '📦',
  'fig://icon?type=python': '🐍',
  'fig://icon?type=ruby': '💎',
  'fig://icon?type=rust': '🦀',
  'fig://icon?type=go': '🐹',
  'fig://icon?type=java': '☕',
  'fig://icon?type=php': '🐘',
  'fig://icon?type=swift': '🐦',
  'fig://icon?type=elixir': '💧',
};

/**
 * Convert Fig icon to emoji
 */
function convertIcon(iconStr) {
  if (!iconStr) return '⚡';
  
  // Handle URL icons (github avatars, etc.)
  if (iconStr.includes('http://') || iconStr.includes('https://')) {
    return '🔗';
  }
  
  // Direct mapping
  for (const [figIcon, emoji] of Object.entries(ICON_MAP)) {
    if (iconStr.includes(figIcon)) return emoji;
  }
  
  // Extract type from fig://icon?type=X or fig://template?badge=X
  const match = iconStr.match(/fig:\/\/(?:icon|template)\?(?:type|badge|color)=([^&'"]+)/);
  if (match) {
    const type = match[1].toLowerCase();
    if (type.includes('bucket')) return '🪣';
    if (type.includes('database') || type.includes('db')) return '🗄️';
    if (type.includes('function') || type.includes('lambda')) return '⚡';
    if (type.includes('container') || type.includes('docker')) return '🐳';
    if (type.includes('cluster') || type.includes('kubernetes') || type.includes('k8s')) return '☸️';
    if (type.includes('instance') || type.includes('server')) return '🖥️';
    if (type.includes('role') || type.includes('user')) return '👤';
    if (type.includes('policy') || type.includes('rule')) return '📋';
    if (type.includes('secret') || type.includes('password')) return '🔐';
    if (type.includes('key')) return '🔑';
    if (type.includes('network') || type.includes('vpc')) return '🌐';
    if (type.includes('volume') || type.includes('disk')) return '💾';
    if (type.includes('snapshot') || type.includes('backup')) return '📸';
    if (type.includes('log')) return '📋';
    if (type.includes('queue') || type.includes('sqs')) return '📬';
    if (type.includes('topic') || type.includes('sns')) return '📢';
    if (type.includes('branch')) return '🌿';
    if (type.includes('commit')) return '📝';
    if (type.includes('tag')) return '🏷️';
    if (type.includes('remote')) return '🌍';
    if (type.includes('stash')) return '📦';
    if (type.includes('package')) return '📦';
    if (type.includes('test')) return '🧪';
    if (type.includes('run') || type.includes('execute')) return '▶️';
    if (type.includes('build')) return '🔨';
    if (type.includes('deploy')) return '🚀';
    if (type.includes('config') || type.includes('setting')) return '⚙️';
    if (type.includes('plus') || type.includes('add')) return '➕';
    if (type.includes('minus') || type.includes('remove')) return '➖';
    if (type.includes('check') || type.includes('success')) return '✅';
    if (type.includes('cross') || type.includes('error')) return '❌';
    if (type.includes('warning') || type.includes('alert')) return '⚠️';
    if (type.includes('info')) return 'ℹ️';
    if (type.includes('question') || type.includes('help')) return '❓';
  }
  
  return '⚡';
}

/**
 * Convert spec name to valid TypeScript variable name
 */
function toSpecName(name) {
  // Handle special cases
  if (NAME_MAP[name]) return NAME_MAP[name];
  
  // Convert kebab-case to camelCase and add Spec suffix
  let camelCase = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  // Handle names starting with numbers or special chars
  if (/^[0-9]/.test(camelCase)) {
    camelCase = '_' + camelCase;
  }
  // Handle names with +
  camelCase = camelCase.replace(/\+/g, 'Plus');
  return camelCase + 'Spec';
}

/**
 * Remove TypeScript type annotations while preserving structure
 */
function removeTypeAnnotations(code) {
  let result = code;
  
  // Remove type imports
  result = result.replace(/import\s+type\s+.*?from\s+['"][^'"]+['"];?\n?/g, '');
  result = result.replace(/import\s*{\s*type\s+[^}]+}\s*from\s+['"][^'"]+['"];?\n?/g, '');
  
  // Remove Fig.* type annotations (preserving the value)
  // : Fig.Spec, : Fig.Option[], : Fig.Generator, etc.
  result = result.replace(/:\s*Fig\.\w+(\[\])?(?=\s*[=,;)\n{])/g, '');
  result = result.replace(/<Fig\.\w+(\[\])?>/g, '');
  result = result.replace(/\s+as\s+Fig\.\w+(\[\])?/g, '');
  
  // Remove basic TypeScript type annotations on variables
  result = result.replace(/:\s*(?:string|number|boolean|any|void|null|undefined|Record<[^>]+>|Array<[^>]+>)(\[\])?\s*(?=[=;,)\n])/g, '');
  
  // Remove function parameter types - be more careful here
  result = result.replace(/\(\s*(\w+)\s*:\s*(?:string|number|boolean|any)\s*\)/g, '($1)');
  result = result.replace(/\(\s*(\w+)\s*:\s*(?:string|number|boolean|any)\s*,/g, '($1,');
  result = result.replace(/,\s*(\w+)\s*:\s*(?:string|number|boolean|any)\s*\)/g, ', $1)');
  result = result.replace(/,\s*(\w+)\s*:\s*(?:string|number|boolean|any)\s*,/g, ', $1,');
  
  // Remove return type annotations
  result = result.replace(/\)\s*:\s*(?:string|number|boolean|any|void|Promise<[^>]+>)\s*(?=[{=])/g, ') ');
  
  // Remove interface declarations
  result = result.replace(/interface\s+\w+\s*{[\s\S]*?}\n*/g, '');
  
  // Remove type declarations  
  result = result.replace(/type\s+\w+\s*=\s*[^;]+;\n*/g, '');
  
  return result;
}

/**
 * Convert filepaths() generator calls to template
 */
function convertFilepathsGenerator(code) {
  let result = code;
  
  // Pattern: generators: filepaths({ extensions: [...] })
  // Convert to: template: "filepaths"
  result = result.replace(
    /generators:\s*filepaths\s*\(\s*{[^}]*}\s*\)/g,
    'template: "filepaths"'
  );
  
  // Pattern: generators: filepaths()
  result = result.replace(
    /generators:\s*filepaths\s*\(\s*\)/g,
    'template: "filepaths"'
  );
  
  return result;
}

/**
 * Convert keyValue() and similar generator calls
 */
function convertKeyValueGenerators(code) {
  let result = code;
  
  // Remove keyValue generator usage - replace with simple comment
  result = result.replace(
    /generators:\s*keyValue\s*\(\s*{[\s\S]*?}\s*\),?/g,
    ''
  );
  
  // Remove keyValueList generator usage
  result = result.replace(
    /generators:\s*keyValueList\s*\(\s*{[\s\S]*?}\s*\),?/g,
    ''
  );
  
  // Remove valueList generator usage
  result = result.replace(
    /generators:\s*valueList\s*\(\s*{[\s\S]*?}\s*\),?/g,
    ''
  );
  
  return result;
}

/**
 * Remove imports from @fig/autocomplete-generators and relative files
 */
function removeFigImports(code) {
  let result = code;
  
  // Remove @fig/autocomplete-generators imports
  result = result.replace(
    /import\s*{[^}]*}\s*from\s+['"]@fig\/autocomplete-generators?['"];?\n?/g,
    ''
  );
  
  // Remove @fig/autocomplete imports
  result = result.replace(
    /import\s*{[^}]*}\s*from\s+['"]@fig\/autocomplete[^'"]*['"];?\n?/g,
    ''
  );
  
  // Remove relative imports to other fig files (like ./ssh, ./deno/generators)
  result = result.replace(
    /import\s*{[^}]*}\s*from\s+['"]\.\/[^'"]+['"];?\n?/g,
    ''
  );
  
  // Remove default imports from relative files
  result = result.replace(
    /import\s+\w+\s+from\s+['"]\.\/[^'"]+['"];?\n?/g,
    ''
  );
  
  // Remove wildcard imports
  result = result.replace(
    /import\s*\*\s*as\s+\w+\s*from\s+['"][^'"]+['"];?\n?/g,
    ''
  );
  
  return result;
}

/**
 * Remove or convert inline generator definitions
 */
function handleGenerators(code) {
  let result = code;
  
  // Remove generator variable declarations that are complex
  // const someGenerator: Fig.Generator = { script: ..., postProcess: ... }
  result = result.replace(
    /const\s+\w+(?:Generator|List)?\s*(?::\s*[\w.[\]<>]+)?\s*=\s*{\s*(?:script|custom|postProcess|getQueryTerm|trigger|cache)[\s\S]*?};\n*/g,
    ''
  );
  
  // Remove generators object declarations
  result = result.replace(
    /const\s+generators\s*(?::\s*[\w.<>[\]]+)?\s*=\s*{[\s\S]*?};\n*/g,
    ''
  );
  
  // Convert inline generator objects to template where possible
  result = result.replace(
    /generators:\s*{\s*template:\s*['"]filepaths['"]\s*}/g,
    'template: "filepaths"'
  );
  
  result = result.replace(
    /generators:\s*{\s*template:\s*['"]folders['"]\s*}/g,
    'template: "folders"'
  );
  
  // Remove generator property references that point to undefined vars
  result = result.replace(/generators:\s*\w+Generator\s*,?\n?/g, '');
  result = result.replace(/generators:\s*\w+List\s*,?\n?/g, '');
  result = result.replace(/generators:\s*generators\.\w+\s*,?\n?/g, '');
  result = result.replace(/generators:\s*\[\s*\w+Generator\s*\]\s*,?\n?/g, '');
  result = result.replace(/generators:\s*\[\s*generators\.\w+\s*\]\s*,?\n?/g, '');
  
  // Remove complex inline generator objects (with script, postProcess, custom, etc.)
  result = result.replace(
    /generators:\s*{\s*(?:script|custom|postProcess|getQueryTerm|trigger)[\s\S]*?},?\n?/g,
    ''
  );
  
  // Remove generators arrays with multiple elements containing complex patterns
  result = result.replace(
    /generators:\s*\[[^\]]*(?:script|custom|postProcess)[^\]]*\],?\n?/g,
    ''
  );
  
  // Remove standalone generator references
  result = result.replace(/generators:\s*\w+,?\n?/g, '');
  
  return result;
}

/**
 * Remove generateSpec async functions (dynamic spec generation)
 */
function removeGenerateSpec(code) {
  let result = code;
  
  // Remove generateSpec property with async function - match nested braces
  // This is a simplified approach - match common patterns
  result = result.replace(
    /generateSpec:\s*async\s*\([^)]*\)\s*=>\s*{[^{}]*(?:{[^{}]*(?:{[^{}]*}[^{}]*)*}[^{}]*)*},?\n?/g,
    ''
  );
  
  // Simpler pattern for short generateSpec
  result = result.replace(
    /generateSpec:\s*async\s*\([^)]*\)\s*=>\s*{[\s\S]*?(?=\n\s*(?:name|description|options|subcommands|args):)/g,
    ''
  );
  
  // Remove simpler generateSpec patterns
  result = result.replace(
    /generateSpec:\s*\w+\s*,?\n?/g,
    ''
  );
  
  return result;
}

/**
 * Remove loadSpec references (cross-file dependencies)
 */
function removeLoadSpec(code) {
  let result = code;
  
  result = result.replace(/loadSpec:\s*['"][^'"]+['"]\s*,?\n?/g, '');
  result = result.replace(/loadSpec:\s*\w+\s*,?\n?/g, '');
  
  return result;
}

/**
 * Convert suggestions that reference variables to inline arrays
 */
function handleSuggestions(code) {
  let result = code;
  
  // Remove suggestions that spread undefined variables
  result = result.replace(/suggestions:\s*\[\s*\.\.\.(\w+)\s*\],?\n?/g, '');
  result = result.replace(/suggestions:\s*\[\s*\.\.\.(\w+)\s*,/g, 'suggestions: [');
  
  // Remove Array.from dynamic suggestions
  result = result.replace(/suggestions:\s*Array\.from\([^)]+\)[^,}]*,?\n?/gs, '');
  
  // Remove suggestions that are just variable references (not arrays or objects)
  // But keep array literals and object literals
  result = result.replace(/suggestions:\s*(?![\[{])[\w.]+(?:\([^)]*\))?\s*,?\n?/g, '');
  
  return result;
}

/**
 * Convert Fig icons to emoji
 */
function convertIcons(code) {
  let result = code;
  
  // Convert fig:// icon URLs to emoji
  result = result.replace(/icon:\s*['"]fig:\/\/[^'"]+['"]/g, (match) => {
    const emoji = convertIcon(match);
    return `icon: '${emoji}'`;
  });
  
  // Convert http/https icon URLs to emoji
  result = result.replace(/icon:\s*['"]https?:\/\/[^'"]+['"]/g, "icon: '🔗'");
  
  return result;
}

/**
 * Remove Fig-specific properties not used in CLIFlow
 */
function removeFigSpecificProps(code) {
  let result = code;
  
  // Remove parserDirectives
  result = result.replace(/parserDirectives:\s*{[^}]*},?\n?/g, '');
  
  // Remove deprecated flag
  result = result.replace(/deprecated:\s*(?:true|false)\s*,?\n?/g, '');
  
  // Remove requiresEquals/requiresSeparator
  result = result.replace(/requiresEquals:\s*(?:true|false)\s*,?\n?/g, '');
  result = result.replace(/requiresSeparator:\s*(?:true|false)\s*,?\n?/g, '');
  
  // Remove insertValue
  result = result.replace(/insertValue:\s*['"][^'"]*['"]\s*,?\n?/g, '');
  result = result.replace(/insertValue:\s*`[^`]*`\s*,?\n?/g, '');
  
  // Remove priority that references variables (keep numeric priorities)
  result = result.replace(/priority:\s*(?![\d-])\w+\.?\w*\s*,?\n?/g, '');
  
  // Remove isScript, isModule, isCommand (Fig-specific arg properties)
  result = result.replace(/isScript:\s*(?:true|false)\s*,?\n?/g, '');
  result = result.replace(/isModule:\s*['"][^'"]*['"]\s*,?\n?/g, '');
  result = result.replace(/isCommand:\s*(?:true|false)\s*,?\n?/g, '');
  
  // Remove isDangerous
  result = result.replace(/isDangerous:\s*(?:true|false)\s*,?\n?/g, '');
  
  // Remove dependsOn and exclusiveOn arrays
  result = result.replace(/dependsOn:\s*\[[^\]]*\]\s*,?\n?/g, '');
  result = result.replace(/exclusiveOn:\s*\[[^\]]*\]\s*,?\n?/g, '');
  
  // Remove displayName (we use description)
  result = result.replace(/displayName:\s*['"][^'"]*['"]\s*,?\n?/g, '');
  result = result.replace(/displayName:\s*\w+\([^)]*\)\s*,?\n?/g, '');
  result = result.replace(/displayName:\s*`[^`]*`\s*,?\n?/g, '');
  
  // Remove hidden
  result = result.replace(/hidden:\s*(?:true|false)\s*,?\n?/g, '');
  
  // Remove filterStrategy
  result = result.replace(/filterStrategy:\s*['"][^'"]*['"]\s*,?\n?/g, '');
  
  return result;
}

/**
 * Fix template arrays to strings
 */
function fixTemplates(code) {
  let result = code;
  
  result = result.replace(/template:\s*\[\s*['"]filepaths['"]\s*\]/g, 'template: "filepaths"');
  result = result.replace(/template:\s*\[\s*['"]folders['"]\s*\]/g, 'template: "folders"');
  result = result.replace(/template:\s*\[\s*['"]filepaths['"]\s*,\s*['"]folders['"]\s*\]/g, 'template: "filepaths"');
  
  return result;
}

/**
 * Remove helper functions defined in the file
 */
function removeHelperFunctions(code) {
  let result = code;
  
  // Remove named function declarations (not anonymous)
  // Be careful not to remove too much
  result = result.replace(/^function\s+\w+\s*\([^)]*\)(?:\s*:\s*\w+)?\s*{[\s\S]*?^}\n*/gm, '');
  
  // Remove arrow function const declarations that aren't the main spec
  // Match const name = (...) => { ... } or const name = (...) => value
  result = result.replace(
    /^const\s+(?!completionSpec|completion)(\w+)\s*(?::\s*[\w.<>[\]|]+)?\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*(?:{[\s\S]*?^}|[^;]+);?\n*/gm,
    ''
  );
  
  return result;
}

/**
 * Remove const declarations for arrays/objects that might cause issues
 */
function removeUnusedConsts(code) {
  let result = code;
  
  // Remove const arrays/objects that define suggestion lists, option lists, etc.
  // These are often referenced but their definitions should be inlined or removed
  
  // Pattern: const someName: SomeType[] = [...]
  // or const someName = [...]
  const patterns = [
    /const\s+(\w+Options)\s*(?::\s*[\w.[\]<>]+)?\s*=\s*\[[\s\S]*?\];\n*/g,
    /const\s+(\w+Args)\s*(?::\s*[\w.[\]<>]+)?\s*=\s*\[[\s\S]*?\];\n*/g,
    /const\s+(\w+Flags)\s*(?::\s*[\w.[\]<>]+)?\s*=\s*\[[\s\S]*?\];\n*/g,
    /const\s+(\w+Suggestions)\s*(?::\s*[\w.[\]<>]+)?\s*=\s*\[[\s\S]*?\];\n*/g,
    /const\s+(common\w+)\s*(?::\s*[\w.[\]<>]+)?\s*=\s*[\[{][\s\S]*?[\]}];\n*/g,
    /const\s+(shared\w+)\s*(?::\s*[\w.[\]<>]+)?\s*=\s*[\[{][\s\S]*?[\]}];\n*/g,
  ];
  
  for (const pattern of patterns) {
    result = result.replace(pattern, '');
  }
  
  return result;
}

/**
 * Clean up spread operators that reference undefined vars
 */
function cleanupSpreads(code) {
  let result = code;
  
  // Remove spread operators for undefined variables
  result = result.replace(/\.\.\.(?!{)(\w+Options|\w+Args|\w+Flags|commonOptions|sharedOptions)\s*,?\n?/g, '');
  
  // More general spread cleanup
  result = result.replace(/\.\.\.(?!{)\w+\s*,\s*(?=\n\s*[}\]])/g, '');
  
  // Clean up options: [...something] where something is undefined
  result = result.replace(/options:\s*\[\s*\.\.\.(\w+)\s*\],?/g, '');
  result = result.replace(/subcommands:\s*\[\s*\.\.\.(\w+)\s*\],?/g, '');
  
  return result;
}

/**
 * Clean up syntax issues
 */
function cleanupSyntax(code) {
  let result = code;
  
  // Remove empty args objects
  result = result.replace(/args:\s*{}\s*,?\n?/g, '');
  
  // Remove empty arrays for certain properties
  result = result.replace(/options:\s*\[\s*\]\s*,?\n?/g, '');
  result = result.replace(/subcommands:\s*\[\s*\]\s*,?\n?/g, '');
  result = result.replace(/suggestions:\s*\[\s*\]\s*,?\n?/g, '');
  
  // Clean up double/triple commas
  result = result.replace(/,(\s*,)+/g, ',');
  
  // Clean up trailing commas before closing brackets/braces
  result = result.replace(/,(\s*[}\]])/g, '$1');
  
  // Clean up empty lines (more than 2 consecutive)
  result = result.replace(/\n{3,}/g, '\n\n');
  
  // Clean up any remaining empty properties
  result = result.replace(/,\s*}/g, '\n}');
  result = result.replace(/{\s*,/g, '{');
  result = result.replace(/\[\s*,/g, '[');
  
  // Fix objects that end up empty
  result = result.replace(/{\s*}/g, '{}');
  
  return result;
}

/**
 * Convert Fig TypeScript spec to CLIFlow TypeScript format
 */
function convertFigSpec(code, specName) {
  let result = code;
  
  // Step 1: Remove imports
  result = removeFigImports(result);
  
  // Step 2: Remove type annotations
  result = removeTypeAnnotations(result);
  
  // Step 3: Handle filepaths generators -> template
  result = convertFilepathsGenerator(result);
  
  // Step 4: Handle keyValue and similar generators
  result = convertKeyValueGenerators(result);
  
  // Step 5: Remove/convert generator definitions and references
  result = handleGenerators(result);
  
  // Step 6: Remove generateSpec
  result = removeGenerateSpec(result);
  
  // Step 7: Remove loadSpec
  result = removeLoadSpec(result);
  
  // Step 8: Handle suggestions
  result = handleSuggestions(result);
  
  // Step 9: Convert icons
  result = convertIcons(result);
  
  // Step 10: Remove Fig-specific properties
  result = removeFigSpecificProps(result);
  
  // Step 11: Fix templates
  result = fixTemplates(result);
  
  // Step 12: Remove helper functions
  result = removeHelperFunctions(result);
  
  // Step 13: Remove unused consts
  result = removeUnusedConsts(result);
  
  // Step 14: Clean up spreads
  result = cleanupSpreads(result);
  
  // Step 15: Clean up syntax
  result = cleanupSyntax(result);
  
  // Final: Fix the export
  const exportName = toSpecName(specName);
  
  // Handle different export patterns Fig uses
  // Pattern 1: const completionSpec = { ... }; export default completionSpec;
  result = result.replace(
    /const\s+completionSpec\s*=\s*({[\s\S]*});?\s*(?:export\s+default\s+completionSpec\s*;?)?$/,
    `export const ${exportName}: CompletionSpec = $1;`
  );
  
  // Pattern 2: const completion = { ... }; export default completion;
  result = result.replace(
    /const\s+completion\s*=\s*({[\s\S]*});?\s*(?:export\s+default\s+completion\s*;?)?$/,
    `export const ${exportName}: CompletionSpec = $1;`
  );
  
  // Pattern 3: export default { ... } as const;
  result = result.replace(
    /export\s+default\s+({[\s\S]*})\s*(?:as\s+const)?\s*;?\s*$/,
    `export const ${exportName}: CompletionSpec = $1;`
  );
  
  // Add CLIFlow imports header
  const header = `// ${specName} completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

`;

  return header + result;
}

/**
 * Validate converted code for common issues
 */
function validateConversion(code, specName) {
  const issues = [];
  
  // Check for remaining Fig references
  if (code.includes('Fig.')) {
    issues.push('Contains Fig. type references');
  }
  
  // Check for remaining fig:// URLs
  if (code.includes('fig://')) {
    issues.push('Contains fig:// URLs');
  }
  
  // Check for @fig imports
  if (code.includes('@fig/')) {
    issues.push('Contains @fig/ imports');
  }
  
  // Check for undefined generators (but not template references)
  if (code.match(/generators:\s*\w+(?!:\s)/)) {
    issues.push('References undefined generator');
  }
  
  // Check for filepaths function (not template)
  if (code.match(/filepaths\s*\(/)) {
    issues.push('Contains unconverted filepaths() call');
  }
  
  // Check for keyValue/valueList functions
  if (code.match(/(?:keyValue|valueList|keyValueList)\s*\(/)) {
    issues.push('Contains unconverted generator function');
  }
  
  // Check for remaining TypeScript-only syntax that would break
  if (code.match(/:\s*Record</)) {
    issues.push('Contains TypeScript Record type');
  }
  
  // Check for generateSpec (should be removed)
  if (code.match(/generateSpec\s*:/)) {
    issues.push('Contains generateSpec (dynamic generation)');
  }
  
  // Check for relative imports (should be removed)
  if (code.match(/from\s+['"]\.\/[^'"]+['"]/)) {
    issues.push('Contains relative import');
  }
  
  return issues;
}

/**
 * Get list of all specs from Fig
 */
function getAllSpecs() {
  if (!fs.existsSync(FIG_SRC_DIR)) {
    console.error(`Error: Fig directory not found: ${FIG_SRC_DIR}`);
    process.exit(1);
  }
  
  return fs.readdirSync(FIG_SRC_DIR)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts'))
    .filter(f => !fs.statSync(path.join(FIG_SRC_DIR, f)).isDirectory())
    .map(f => f.replace('.ts', ''))
    .filter(s => !SKIP_SPECS.has(s) && !s.startsWith('_'));
}

/**
 * Get specs that CLIFlow doesn't have
 */
function getMissingSpecs() {
  const figSpecs = getAllSpecs();
  const cliflowFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.ts'))
    .map(f => f.replace('.ts', ''));
  
  return figSpecs.filter(s => !cliflowFiles.includes(s));
}

/**
 * Get specs sorted by file size (larger = more complete)
 */
function getSpecsBySize(limit = 50) {
  const specs = getAllSpecs();
  
  return specs
    .map(s => ({
      name: s,
      size: fs.statSync(path.join(FIG_SRC_DIR, `${s}.ts`)).size
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, limit)
    .map(s => s.name);
}

/**
 * Process a single spec
 */
function convertSpec(specName, options = {}) {
  const inputPath = path.join(FIG_SRC_DIR, `${specName}.ts`);
  const outputPath = path.join(OUTPUT_DIR, `${specName}.ts`);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠️  Not found: ${specName}.ts`);
    return { status: 'notfound', name: specName };
  }
  
  // Check if already exists and not forcing
  if (fs.existsSync(outputPath) && !options.force) {
    if (options.verbose) {
      console.log(`  ⏭️  Exists: ${specName}.ts`);
    }
    return { status: 'exists', name: specName };
  }
  
  console.log(`  Converting: ${specName}`);
  
  try {
    const code = fs.readFileSync(inputPath, 'utf-8');
    const converted = convertFigSpec(code, specName);
    
    // Validate conversion
    const issues = validateConversion(converted, specName);
    
    if (issues.length > 0) {
      if (options.strict) {
        console.log(`    ✗ Validation failed: ${issues.join(', ')}`);
        return { status: 'error', name: specName, error: issues.join(', ') };
      } else if (options.verbose) {
        console.log(`    ⚠️  Warnings: ${issues.join(', ')}`);
      }
    }
    
    fs.writeFileSync(outputPath, converted);
    
    // Get file sizes for comparison
    const origSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const ratio = ((newSize / origSize) * 100).toFixed(0);
    
    if (issues.length > 0) {
      console.log(`    ⚠️  ${specName}.ts (${ratio}% of original) - warnings`);
      return { status: 'warning', name: specName, origSize, newSize, issues };
    } else {
      console.log(`    ✓ ${specName}.ts (${ratio}% of original)`);
      return { status: 'converted', name: specName, origSize, newSize };
    }
  } catch (err) {
    console.error(`    ✗ Error: ${err.message}`);
    return { status: 'error', name: specName, error: err.message };
  }
}

/**
 * List available specs
 */
function listSpecs() {
  const specs = getAllSpecs();
  const cliflowFiles = new Set(
    fs.readdirSync(OUTPUT_DIR)
      .filter(f => f.endsWith('.ts'))
      .map(f => f.replace('.ts', ''))
  );
  
  console.log(`\nFig Autocomplete Specs (${specs.length} total)\n`);
  
  // Group by first letter
  const groups = {};
  for (const spec of specs) {
    const letter = spec[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push({
      name: spec,
      hasCLIFlow: cliflowFiles.has(spec),
      size: fs.statSync(path.join(FIG_SRC_DIR, `${spec}.ts`)).size
    });
  }
  
  for (const letter of Object.keys(groups).sort()) {
    console.log(`\n${letter}:`);
    for (const spec of groups[letter].sort((a, b) => b.size - a.size)) {
      const marker = spec.hasCLIFlow ? '✓' : ' ';
      const sizeKb = (spec.size / 1024).toFixed(1);
      console.log(`  ${marker} ${spec.name.padEnd(25)} ${sizeKb}kb`);
    }
  }
  
  const existing = specs.filter(s => cliflowFiles.has(s)).length;
  console.log(`\n✓ = Already in CLIFlow (${existing}/${specs.length})`);
}

/**
 * Generate import statements for completion-engine.ts
 */
function generateEngineImports(specs) {
  console.log('\n📝 Add these imports to src/engine/completion-engine.ts:\n');
  
  for (const spec of specs.slice(0, 20)) {
    const exportName = toSpecName(spec);
    console.log(`    const { ${exportName} } = await import('../completions/${spec}.js');`);
  }
  
  if (specs.length > 20) {
    console.log(`    // ... and ${specs.length - 20} more`);
  }
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  
  console.log('Fig Spec Converter for CLIFlow (Improved)');
  console.log('==========================================\n');
  
  // Parse options
  const options = {
    force: args.includes('--force') || args.includes('-f'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    strict: args.includes('--strict'),
  };
  
  // Filter out option flags
  const positionalArgs = args.filter(a => !a.startsWith('-'));
  
  // Handle special commands
  if (args.includes('--list') || args.includes('-l')) {
    listSpecs();
    return;
  }
  
  let specs;
  
  if (args.includes('--all')) {
    specs = getAllSpecs();
  } else if (args.includes('--missing')) {
    specs = getMissingSpecs();
    console.log(`Found ${specs.length} specs not in CLIFlow\n`);
  } else if (args.includes('--top')) {
    const topIndex = args.indexOf('--top');
    const limit = parseInt(args[topIndex + 1]) || 50;
    specs = getSpecsBySize(limit);
    console.log(`Converting top ${limit} specs by size\n`);
  } else if (positionalArgs.length > 0) {
    specs = positionalArgs;
  } else {
    console.log('Usage:');
    console.log('  node scripts/convert-fig-specs.mjs git docker kubectl  # Convert specific specs');
    console.log('  node scripts/convert-fig-specs.mjs --all               # Convert all');
    console.log('  node scripts/convert-fig-specs.mjs --missing           # Convert missing');
    console.log('  node scripts/convert-fig-specs.mjs --top 50            # Convert top 50 by size');
    console.log('  node scripts/convert-fig-specs.mjs --list              # List available');
    console.log('  node scripts/convert-fig-specs.mjs --force git         # Force overwrite');
    console.log('  node scripts/convert-fig-specs.mjs --strict            # Fail on warnings');
    console.log('  node scripts/convert-fig-specs.mjs --verbose           # Show all details');
    return;
  }
  
  console.log(`Processing ${specs.length} specs...\n`);
  
  const results = { converted: [], warning: [], exists: [], notfound: [], error: [] };
  
  for (const spec of specs) {
    if (SKIP_SPECS.has(spec)) {
      console.log(`  ⏭️  Skipping: ${spec}`);
      continue;
    }
    
    const result = convertSpec(spec, options);
    results[result.status].push(result);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Results:');
  console.log(`  ✅ Converted:  ${results.converted.length}`);
  console.log(`  ⚠️  Warnings:   ${results.warning.length}`);
  console.log(`  ⏭️  Existing:   ${results.exists.length}`);
  console.log(`  ❓ Not found:  ${results.notfound.length}`);
  console.log(`  ❌ Errors:     ${results.error.length}`);
  
  const successSpecs = [...results.converted, ...results.warning].map(r => r.name);
  
  if (successSpecs.length > 0) {
    generateEngineImports(successSpecs);
    
    console.log('\n🔧 Next steps:');
    console.log('  1. Run: npm run build');
    console.log('  2. Fix any TypeScript errors that appear');
    console.log('  3. Review files with warnings');
  }
  
  if (results.error.length > 0) {
    console.log('\n❌ Errors:');
    for (const err of results.error.slice(0, 10)) {
      console.log(`  ${err.name}: ${err.error}`);
    }
    if (results.error.length > 10) {
      console.log(`  ... and ${results.error.length - 10} more`);
    }
  }
}

main();
