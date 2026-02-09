#!/usr/bin/env node
/**
 * Convert modular cloud specs (gcloud, az) from Fig to CLIFlow
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIG_SRC_DIR = path.join(__dirname, '../../github.com/autocomplete/src');
const OUTPUT_DIR = path.join(__dirname, '../src/completions');

// Icon mapping
const ICON_MAP = {
  'fig://icon?type=gcp': '☁️',
  'fig://icon?type=azure': '🔷',
  'fig://icon?type=box': '📦',
  'fig://icon?type=string': '📝',
};

function convertIcon(iconStr) {
  if (!iconStr) return '⚡';
  for (const [figIcon, emoji] of Object.entries(ICON_MAP)) {
    if (iconStr.includes(figIcon)) return emoji;
  }
  return '⚡';
}

function toSpecName(name) {
  let camelCase = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  if (/^[0-9]/.test(camelCase)) {
    camelCase = '_' + camelCase;
  }
  camelCase = camelCase.replace(/\+/g, 'Plus');
  return camelCase + 'Spec';
}

function removeTypeAnnotations(code) {
  let result = code;
  result = result.replace(/import\s+type\s+.*?from\s+['"][^'"]+['"];?\n?/g, '');
  result = result.replace(/import\s*{\s*type\s+[^}]+}\s*from\s+['"][^'"]+['"];?\n?/g, '');
  result = result.replace(/:\s*Fig\.\w+(\[\])?(?=\s*[=,;)\n{])/g, '');
  result = result.replace(/<Fig\.\w+(\[\])?>/g, '');
  result = result.replace(/\s+as\s+Fig\.\w+(\[\])?/g, '');
  result = result.replace(/:\s*(?:string|number|boolean|any|void|null|undefined|Record<[^>]+>|Array<[^>]+>)(\[\])?\s*(?=[=;,)\n])/g, '');
  return result;
}

function removeFigImports(code) {
  let result = code;
  result = result.replace(/import\s*{[^}]*}\s*from\s+['"]@fig\/autocomplete-generators?['"];?\n?/g, '');
  result = result.replace(/import\s*{[^}]*}\s*from\s+['"]@fig\/autocomplete[^'"]*['"];?\n?/g, '');
  result = result.replace(/import\s*{[^}]*}\s*from\s+['"]\.\/[^'"]+['"];?\n?/g, '');
  result = result.replace(/import\s+\w+\s+from\s+['"]\.\/[^'"]+['"];?\n?/g, '');
  result = result.replace(/import\s*\*\s*as\s+\w+\s*from\s+['"][^'"]+['"];?\n?/g, '');
  return result;
}

function convertFilepathsGenerator(code) {
  let result = code;
  result = result.replace(/generators:\s*filepaths\s*\(\s*{[^}]*}\s*\)/g, 'template: "filepaths"');
  result = result.replace(/generators:\s*filepaths\s*\(\s*\)/g, 'template: "filepaths"');
  return result;
}

function handleGenerators(code) {
  let result = code;
  result = result.replace(/const\s+\w+(?:Generator|List)?\s*(?::\s*[\w.[\]<>]+)?\s*=\s*{\s*(?:script|custom|postProcess|getQueryTerm|trigger|cache)[\s\S]*?};\n*/g, '');
  result = result.replace(/const\s+generators\s*(?::\s*[\w.<>[\]]+)?\s*=\s*{[\s\S]*?};\n*/g, '');
  result = result.replace(/generators:\s*{\s*template:\s*['"]filepaths['"]\s*}/g, 'template: "filepaths"');
  result = result.replace(/generators:\s*{\s*template:\s*['"]folders['"]\s*}/g, 'template: "folders"');
  result = result.replace(/generators:\s*\w+Generator\s*,?\n?/g, '');
  result = result.replace(/generators:\s*\w+List\s*,?\n?/g, '');
  result = result.replace(/generators:\s*generators\.\w+\s*,?\n?/g, '');
  result = result.replace(/generators:\s*\[\s*\w+Generator\s*\]\s*,?\n?/g, '');
  result = result.replace(/generators:\s*{\s*(?:script|custom|postProcess|getQueryTerm|trigger)[\s\S]*?},?\n?/g, '');
  result = result.replace(/generators:\s*\[[^\]]*(?:script|custom|postProcess)[^\]]*\],?\n?/g, '');
  result = result.replace(/generators:\s*\w+,?\n?/g, '');
  return result;
}

function removeGenerateSpec(code) {
  let result = code;
  result = result.replace(/generateSpec:\s*async\s*\([^)]*\)\s*=>\s*{[^{}]*(?:{[^{}]*(?:{[^{}]*}[^{}]*)*}[^{}]*)*},?\n?/g, '');
  result = result.replace(/generateSpec:\s*\w+\s*,?\n?/g, '');
  return result;
}

function removeLoadSpec(code) {
  let result = code;
  result = result.replace(/loadSpec:\s*['"][^'"]+['"]\s*,?\n?/g, '');
  result = result.replace(/loadSpec:\s*\w+\s*,?\n?/g, '');
  return result;
}

function removeFigSpecificProps(code) {
  let result = code;
  result = result.replace(/parserDirectives:\s*{[^}]*},?\n?/g, '');
  result = result.replace(/deprecated:\s*(?:true|false)\s*,?\n?/g, '');
  result = result.replace(/requiresEquals:\s*(?:true|false)\s*,?\n?/g, '');
  result = result.replace(/insertValue:\s*['"][^'"]*['"]\s*,?\n?/g, '');
  result = result.replace(/insertValue:\s*`[^`]*`\s*,?\n?/g, '');
  result = result.replace(/priority:\s*(?![\d-])\w+\.?\w*\s*,?\n?/g, '');
  result = result.replace(/isDangerous:\s*(?:true|false)\s*,?\n?/g, '');
  result = result.replace(/dependsOn:\s*\[[^\]]*\]\s*,?\n?/g, '');
  result = result.replace(/exclusiveOn:\s*\[[^\]]*\]\s*,?\n?/g, '');
  result = result.replace(/displayName:\s*['"][^'"]*['"]\s*,?\n?/g, '');
  result = result.replace(/hidden:\s*(?:true|false)\s*,?\n?/g, '');
  result = result.replace(/filterStrategy:\s*['"][^'"]*['"]\s*,?\n?/g, '');
  return result;
}

function convertIcons(code) {
  let result = code;
  result = result.replace(/icon:\s*['"]fig:\/\/[^'"]+['"]/g, (match) => {
    const emoji = convertIcon(match);
    return `icon: '${emoji}'`;
  });
  result = result.replace(/icon:\s*['"]https?:\/\/[^'"]+['"]/g, "icon: '🔗'");
  return result;
}

function cleanupSyntax(code) {
  let result = code;
  result = result.replace(/args:\s*{}\s*,?\n?/g, '');
  result = result.replace(/options:\s*\[\s*\]\s*,?\n?/g, '');
  result = result.replace(/subcommands:\s*\[\s*\]\s*,?\n?/g, '');
  result = result.replace(/suggestions:\s*\[\s*\]\s*,?\n?/g, '');
  result = result.replace(/,(\s*,)+/g, ',');
  result = result.replace(/,(\s*[}\]])/g, '$1');
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.replace(/,\s*}/g, '\n}');
  result = result.replace(/{\s*,/g, '{');
  result = result.replace(/\[\s*,/g, '[');
  return result;
}

function convertStringSuggestions(code) {
  // Convert suggestions: ["a", "b", "c"] to suggestions: [{ name: "a" }, { name: "b" }, { name: "c" }]
  let result = code;
  result = result.replace(/suggestions:\s*\[((?:\s*["'][^"']+["']\s*,?\s*)+)\]/g, (match, items) => {
    const strings = items.match(/["'][^"']+["']/g) || [];
    const objects = strings.map(s => `{ name: ${s} }`).join(', ');
    return `suggestions: [${objects}]`;
  });
  return result;
}

function convertFigSpec(code, specName, cloudProvider) {
  let result = code;
  
  result = removeFigImports(result);
  result = removeTypeAnnotations(result);
  result = convertFilepathsGenerator(result);
  result = handleGenerators(result);
  result = removeGenerateSpec(result);
  result = removeLoadSpec(result);
  result = convertIcons(result);
  result = removeFigSpecificProps(result);
  result = convertStringSuggestions(result);  // Convert string[] suggestions to Suggestion[]
  result = cleanupSyntax(result);
  
  const exportName = toSpecName(specName);
  
  // Handle different export patterns
  result = result.replace(
    /const\s+completionSpec\s*=\s*({[\s\S]*});?\s*(?:export\s+default\s+completionSpec\s*;?)?$/,
    `export const ${exportName}: Subcommand = $1;`
  );
  
  result = result.replace(
    /export\s+default\s+({[\s\S]*})\s*(?:as\s+const)?\s*;?\s*$/,
    `export const ${exportName}: Subcommand = $1;`
  );
  
  const header = `// ${cloudProvider} ${specName} completion spec for CLIFlow
// Auto-converted from Fig.io spec

import { Subcommand, Option, Argument } from '../../types.js';

`;

  // If there's already a default export, leave it alone
  if (!result.includes('export default')) {
    // Change to default export
    result = result.replace(/export const \w+: Subcommand = /, 'const completion = ');
    result += '\n\nexport default completion;\n';
  }

  return header + result;
}

function convertCloudSpecs(provider, srcDir, outDir) {
  console.log(`\nConverting ${provider} specs from ${srcDir}`);
  
  if (!fs.existsSync(srcDir)) {
    console.log(`  ⚠️  Source directory not found: ${srcDir}`);
    return { converted: 0, errors: 0 };
  }
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  let converted = 0;
  let errors = 0;
  
  for (const file of files) {
    const specName = file.replace('.ts', '');
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(outDir, file);
    
    try {
      const code = fs.readFileSync(inputPath, 'utf-8');
      const convertedCode = convertFigSpec(code, specName, provider);
      fs.writeFileSync(outputPath, convertedCode);
      converted++;
      console.log(`  ✓ ${specName}`);
    } catch (err) {
      errors++;
      console.log(`  ✗ ${specName}: ${err.message}`);
    }
  }
  
  return { converted, errors };
}

// Main
console.log('Converting Cloud Provider Specs');
console.log('================================\n');

// Convert gcloud specs
const gcloudSrcDir = path.join(FIG_SRC_DIR, 'gcloud');
const gcloudOutDir = path.join(OUTPUT_DIR, 'gcloud');
const gcloudResult = convertCloudSpecs('gcloud', gcloudSrcDir, gcloudOutDir);

// Convert Azure specs
const azSrcDir = path.join(FIG_SRC_DIR, 'az', '2.53.0');
const azOutDir = path.join(OUTPUT_DIR, 'az');
const azResult = convertCloudSpecs('az', azSrcDir, azOutDir);

console.log('\n================================');
console.log('Summary:');
console.log(`  gcloud: ${gcloudResult.converted} converted, ${gcloudResult.errors} errors`);
console.log(`  az:     ${azResult.converted} converted, ${azResult.errors} errors`);
console.log(`  Total:  ${gcloudResult.converted + azResult.converted} specs`);
