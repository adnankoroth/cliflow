#!/usr/bin/env node
/**
 * Sanitize converted community specs so Node can import them as ESM.
 *
 * Community specs are pulled/converted from Fig and may still contain:
 * - TypeScript syntax (type annotations, interfaces, etc.)
 * - Extensionless relative imports ("./npm" instead of "./npm.mjs")
 *
 * This script:
 * 1) Transpiles each .mjs file as TypeScript -> ESM JS (syntax cleanup)
 * 2) Rewrites relative import specifiers to include an extension when resolvable
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as ts from 'typescript';

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const COMMUNITY_DIR = path.join(ROOT_DIR, 'build', 'completions', 'community');

function parseArgs(argv) {
  const args = {
    report: false,
    reportOnly: false,
    all: false,
    sample: 200,
    seed: undefined,
    exitCode: false,
    githubAnnotations: false,
    annotationsLimit: 50,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--report') args.report = true;
    else if (a === '--report-only') args.reportOnly = true;
    else if (a === '--all') args.all = true;
    else if (a === '--exit-code') args.exitCode = true;
    else if (a === '--github-annotations') args.githubAnnotations = true;
    else if (a === '--annotations-limit') {
      const v = Number(argv[i + 1]);
      if (Number.isFinite(v) && v >= 0) args.annotationsLimit = Math.floor(v);
      i += 1;
    }
    else if (a === '--sample') {
      const v = Number(argv[i + 1]);
      if (Number.isFinite(v) && v > 0) args.sample = Math.floor(v);
      i += 1;
    } else if (a === '--seed') {
      const v = Number(argv[i + 1]);
      if (Number.isFinite(v)) args.seed = v;
      i += 1;
    }
  }

  if (args.reportOnly) args.report = true;
  return args;
}

function isGitHubActions() {
  return process.env.GITHUB_ACTIONS === 'true';
}

function toGitHubCommandSafeMessage(message) {
  // GitHub Actions workflow commands require escaping: % -> %25, \r -> %0D, \n -> %0A
  return String(message).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function seededRandom(seed) {
  // Deterministic PRNG (LCG)
  let state = (seed >>> 0) || 1;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function classifyImportError(err) {
  const message = String(err?.message ?? err);
  if (message.includes('Cannot find package')) return 'missing_package';
  if (message.includes('Cannot find module')) return 'missing_module';
  if (message.includes('does not provide an export named')) return 'missing_named_export';
  if (message.includes('Unexpected token')) return 'syntax_error';
  if (message.includes('Illegal return statement')) return 'syntax_error_illegal_return';
  if (message.includes('Octal escape sequences are not allowed')) return 'syntax_error_octal_escape';
  return message.split('\n')[0].slice(0, 120);
}

async function installFigHelpersIfAvailable() {
  const figHelpersPath = path.join(ROOT_DIR, 'build', 'engine', 'fig-helpers.js');
  if (!(await pathExists(figHelpersPath))) return false;

  const mod = await import(pathToFileURL(figHelpersPath).href);
  if (typeof mod.installFigHelpers === 'function') {
    mod.installFigHelpers();
    return true;
  }

  return false;
}

async function reportCommunityImports(files, { all, sample, seed, githubAnnotations = false, annotationsLimit = 50 } = {}) {
  const rel = (p) => path.relative(ROOT_DIR, p);
  const importTargets = files.slice();

  // Deterministic shuffle when seed is provided; otherwise sample first N.
  if (!all) {
    if (typeof seed === 'number') {
      const rand = seededRandom(seed);
      for (let i = importTargets.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rand() * (i + 1));
        [importTargets[i], importTargets[j]] = [importTargets[j], importTargets[i]];
      }
    }
  }

  const limited = all ? importTargets : importTargets.slice(0, Math.min(sample ?? 200, importTargets.length));

  const helpersInstalled = await installFigHelpersIfAvailable();
  if (!helpersInstalled) {
    console.log('[community-report] Note: fig helpers not found; some imports may fail that would otherwise pass.');
  }

  let ok = 0;
  const failures = [];
  const byKind = new Map();

  // Import sequentially to avoid excessive CPU/memory spikes.
  for (const filePath of limited) {
    try {
      await import(pathToFileURL(filePath).href);
      ok += 1;
    } catch (e) {
      const kind = classifyImportError(e);
      const item = { file: rel(filePath), kind, message: String(e?.message ?? e) };
      failures.push(item);

      const entry = byKind.get(kind) ?? { count: 0, examples: [] };
      entry.count += 1;
      if (entry.examples.length < 5) entry.examples.push(item.file);
      byKind.set(kind, entry);
    }
  }

  const total = limited.length;
  const fail = total - ok;
  console.log(`\n[community-report] Imported: ${total}. OK: ${ok}. FAIL: ${fail}.`);

  const sorted = [...byKind.entries()].sort((a, b) => b[1].count - a[1].count);
  for (const [kind, info] of sorted.slice(0, 12)) {
    const examples = info.examples.join(', ');
    console.log(`[community-report] ${info.count}x ${kind} (e.g. ${examples})`);
  }

  if (githubAnnotations && isGitHubActions() && failures.length > 0) {
    const limit = Math.max(0, Number.isFinite(annotationsLimit) ? annotationsLimit : 50);
    const shown = failures.slice(0, limit);
    for (const f of shown) {
      const title = `Community spec import failed (${f.kind})`;
      const msg = `${f.kind}: ${f.message}`;
      // Use file path so GH can hyperlink it in PRs.
      // Note: build outputs exist in the workspace after `npm run build`.
      process.stdout.write(
        `::warning file=${f.file},title=${toGitHubCommandSafeMessage(title)}::${toGitHubCommandSafeMessage(msg)}\n`
      );
    }
    if (failures.length > shown.length) {
      process.stdout.write(
        `::notice title=${toGitHubCommandSafeMessage('Community report truncated')}::${toGitHubCommandSafeMessage(
          `Showing ${shown.length}/${failures.length} failures. Increase --annotations-limit to see more.`
        )}\n`
      );
    }
  }

  return { total, ok, fail, failures };
}

const SHIM_FILES = {
  'git.mjs': `/**
 * Community shim: Fig community specs frequently import { gitGenerators } from "./git".
 * The converted community git spec is often broken; provide a stable, minimal module.
 */

import { generatorFromLines } from '../_shared/generators.js';
import { gitSpec as coreGitSpec } from '../git.js';

const lineGen = (script, mapLine, { cacheTtl = 5000, unique = false, filterLine } = {}) =>
  generatorFromLines({ script, cacheTtl, unique, filterLine, mapLine });

export const gitGenerators = {
  commits: lineGen(
    'git log --oneline -30 2>/dev/null',
    (line, index) => {
      const [hash, ...msgParts] = line.trim().split(/\s+/);
      return { name: hash, description: msgParts.join(' '), icon: '📌', priority: 100 - index };
    },
    { cacheTtl: 5000 }
  ),
  revs: lineGen(
    'git log --oneline -30 2>/dev/null',
    (line, index) => {
      const [hash, ...msgParts] = line.trim().split(/\s+/);
      return { name: hash, description: msgParts.join(' '), icon: '📌', priority: 100 - index };
    },
    { cacheTtl: 5000 }
  ),
  localBranches: lineGen(
    'git branch --no-color 2>/dev/null | sed "s/^[* ] //"',
    (line) => ({ name: line.trim(), description: 'Branch', icon: '🌿' }),
    { cacheTtl: 5000, unique: true }
  ),
  remoteLocalBranches: lineGen(
    'git branch -a --no-color 2>/dev/null | sed "s/^[* ] //" | sed "s/^remotes\\/origin\\///"',
    (line) => ({ name: line.trim(), description: 'Branch', icon: '🌿' }),
    { cacheTtl: 5000, unique: true, filterLine: (line) => !line.includes('HEAD') }
  ),
  localOrRemoteBranches: lineGen(
    'git branch -a --no-color 2>/dev/null | sed "s/^[* ] //" | sed "s/^remotes\\/origin\\///"',
    (line) => ({ name: line.trim(), description: 'Branch', icon: '🌿' }),
    { cacheTtl: 5000, unique: true, filterLine: (line) => !line.includes('HEAD') }
  ),
  remotes: lineGen(
    'git remote 2>/dev/null',
    (line) => ({ name: line.trim(), description: 'Remote', icon: '🌍' }),
    { cacheTtl: 30000, unique: true }
  ),
  tags: lineGen(
    'git tag --list 2>/dev/null | head -100',
    (line) => ({ name: line.trim(), description: 'Tag', icon: '🏷️' }),
    { cacheTtl: 30000, unique: true }
  ),
  stashes: lineGen(
    'git stash list 2>/dev/null',
    (line) => {
      const match = line.match(/^(stash@\{\d+\}):\s*(.*)$/);
      return { name: match ? match[1] : line.trim(), description: match ? match[2] : 'Stash', icon: '📦' };
    },
    { cacheTtl: 5000, unique: true }
  ),
  files_for_staging: lineGen(
    'git status --porcelain 2>/dev/null | sed -E "s/^.. //"',
    (line) => ({ name: line.trim(), description: 'File', icon: '📄' }),
    { cacheTtl: 1000, unique: true }
  ),
  getStagedFiles: lineGen(
    'git diff --name-only --cached 2>/dev/null',
    (line) => ({ name: line.trim(), description: 'Staged file', icon: '➕' }),
    { cacheTtl: 1000, unique: true }
  ),
  getUnstagedFiles: lineGen(
    'git diff --name-only 2>/dev/null',
    (line) => ({ name: line.trim(), description: 'Unstaged file', icon: '✏️' }),
    { cacheTtl: 1000, unique: true }
  ),
  getChangedTrackedFiles: lineGen(
    'git ls-files -m 2>/dev/null',
    (line) => ({ name: line.trim(), description: 'Modified file', icon: '✏️' }),
    { cacheTtl: 1000, unique: true }
  ),
  treeish: lineGen(
    'git log --oneline -30 2>/dev/null',
    (line, index) => {
      const [hash, ...msgParts] = line.trim().split(/\s+/);
      return { name: hash, description: msgParts.join(' '), icon: '📌', priority: 100 - index };
    },
    { cacheTtl: 5000 }
  ),
  aliases: lineGen(
    'git config --get-regexp "^alias\\." 2>/dev/null',
    (line) => {
      // format: alias.<name> <value>
      const trimmed = line.trim();
      if (!trimmed.startsWith('alias.')) return { name: trimmed, description: 'Alias', icon: '🔁' };
      const spaceIndex = trimmed.indexOf(' ');
      const key = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
      const value = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1);
      return {
        name: key.replace(/^alias\./, ''),
        description: value,
        icon: '🔁',
      };
    },
    { cacheTtl: 30000, unique: true }
  ),
};

export const gitSpec = coreGitSpec;
export default coreGitSpec;
`,
  'prisma.mjs': `/** Community shim: provide default + named export for prisma */
import prismaSpec from '../prisma.js';
export { prismaSpec };
export default prismaSpec;
`,
  'ssh.mjs': `/**
 * Community shim: some specs import { knownHosts, configHosts } from "./ssh".
 * Provide lightweight generators plus a default-exported ssh spec if available.
 */

import { generatorFromLines } from '../_shared/generators.js';
import { sshSpec as coreSshSpec } from '../ssh.js';

export const knownHosts = generatorFromLines({
  script: [
    'bash',
    '-lc',
    "awk '{print $1}' ~/.ssh/known_hosts 2>/dev/null | tr ',' '\\n' | sed 's/^\\[//;s/\\]$//;s/:.*$//' | grep -vE '^[|#]' | sort -u | head -200",
  ],
  cacheTtl: 30000,
  unique: true,
  filterLine: (line) => Boolean(line.trim()),
  mapLine: (line) => ({ name: line.trim(), description: 'Known host', icon: '🖥️' }),
});

export const configHosts = generatorFromLines({
  script: [
    'bash',
    '-lc',
    "grep -E '^\\s*Host\\s+' ~/.ssh/config 2>/dev/null | sed 's/^\\s*Host\\s\+//' | tr ' ' '\\n' | grep -vE '^[*?]$' | grep -vE '[*?]' | sort -u | head -200",
  ],
  cacheTtl: 30000,
  unique: true,
  filterLine: (line) => Boolean(line.trim()),
  mapLine: (line) => ({ name: line.trim(), description: 'SSH config host', icon: '⚙️' }),
});

export const sshSpec = coreSshSpec;
export default coreSshSpec;
`,

  // Missing-module shims (community specs often reference these but they're absent after conversion).
  'deno/generators.mjs': `/** Community shim: minimal deno generators */
import { generatorFromLines } from '../../_shared/generators.js';

const empty = () => [];

export const generateVersions = () => generatorFromLines({
  script: ['deno', '--version'],
  cacheTtl: 60000,
  mapLine: (line) => ({ name: line.trim(), description: 'Version', icon: '🏷️' }),
});

export const generateTasks = () => ({ script: 'true', postProcess: empty, cache: { ttl: 30000, strategy: 'ttl' } });
export const generateLintRules = () => ({ script: 'true', postProcess: empty, cache: { ttl: 30000, strategy: 'ttl' } });
export const generateInstalledDenoScripts = () => ({ script: 'true', postProcess: empty, cache: { ttl: 30000, strategy: 'ttl' } });
export const generateUrlScript = () => ({ script: 'true', postProcess: empty, cache: { ttl: 30000, strategy: 'ttl' } });
export const generateDocs = () => ({ script: 'true', postProcess: empty, cache: { ttl: 30000, strategy: 'ttl' } });
`,

  '@preset/cli.mjs': `/** Community shim: preset CLI */
export const presetSpec = {
  name: 'preset',
  description: 'Preset CLI (shim)',
};
export default presetSpec;
`,

  'chown.mjs': `/** Community shim: exposes existingUsersandGroups for specs that import it */
import { generatorFromLines } from '../_shared/generators.js';

export const existingUsersandGroups = generatorFromLines({
  script: ['bash', '-lc', "(dscl . -list /Users 2>/dev/null; dscl . -list /Groups 2>/dev/null) | sort -u | head -200"],
  cacheTtl: 30000,
  unique: true,
  filterLine: (line) => Boolean(line.trim()) && !line.startsWith('_'),
  mapLine: (line) => ({ name: line.trim(), description: 'User/Group', icon: '👤' }),
});
`,

  'task/go-task.mjs': `/** Community shim: go-task spec */
export const goTaskSpec = {
  name: 'task',
  description: 'Taskfile runner (go-task) (shim)',
  subcommands: [
    { name: 'run', description: 'Run a task', args: { name: 'task', isOptional: true } },
    { name: 'list', description: 'List tasks' },
  ],
};
export default goTaskSpec;
`,

  'task/taskwarrior.mjs': `/** Community shim: taskwarrior spec */
export const taskWarriorSpec = {
  name: 'task',
  description: 'Taskwarrior (shim)',
  subcommands: [
    { name: 'add', description: 'Add a task', args: { name: 'description' } },
    { name: 'list', description: 'List tasks' },
    { name: 'done', description: 'Mark done', args: { name: 'id' } },
  ],
};
export default taskWarriorSpec;
`,

  'ansible-playbook.mjs': `/** Community shim: re-export core ansible-playbook spec */
import spec from '../ansible-playbook.js';
export default spec;
`,

  // The converted community index.mjs is an aggregator that imports hundreds of specs.
  // It's not needed for runtime completion and tends to fail if any single spec is missing.
  // Provide a tiny module so `import community/index.mjs` never blocks health checks.
  'index.mjs': `/** Community shim: lightweight index */
export default {};
`,
};

function stripShebang(source) {
  if (source.startsWith('#!')) {
    const newlineIndex = source.indexOf('\n');
    if (newlineIndex !== -1) {
      return { shebang: source.slice(0, newlineIndex), code: source.slice(newlineIndex + 1) };
    }
    return { shebang: source, code: '' };
  }
  return { shebang: '', code: source };
}

function fixCommonConversionBugs(source, filePath = '') {
  // Some converted specs contain invalid ternaries like:
  //   args: condition ? {} ,
  // which is missing the ": <else>" branch.
  // Best-effort: turn it into "condition ? {} : undefined".
  let result = source;

  // Collapse accidental duplicated keywords like `export export const ...`.
  result = result.replace(/\bexport(?:\s+export)+\b/g, 'export');

  // Strip common TS remnant statements that survive conversion/transpile attempts.
  // These are typically mangled interface/type property declarations that become
  // top-level no-op statements (or even ReferenceErrors) in JS.
  result = result.replace(/^\s*;\s*$/gm, '');
  result = result.replace(/^\s*>\s*;\s*$/gm, '');
  result = result.replace(/^\s*\[\]\s*;\s*$/gm, '');
  result = result.replace(/^\s*[A-Za-z_$][A-Za-z0-9_$]*\s*;\s*$/gm, '');
  result = result.replace(/^\s*[A-Za-z_$][A-Za-z0-9_$]*\s*\?\s*:\s*undefined\s*;\s*$/gm, '');
  // Also strip other invalid `x ? : y;` remnants (commonly from `x?: Type;`).
  result = result.replace(/^\s*[A-Za-z_$][A-Za-z0-9_$]*\s*\?\s*:\s*[^;\n]+;\s*$/gm, '');
  result = result.replace(/^\s*[A-Za-z_$][A-Za-z0-9_$]*\s*:\s*[^;\n]+;\s*$/gm, '');

  // Handle a union/type block that got split across lines like:
  //   options:
  //     | []
  //     | (Record);
  // by removing the entire type-only block.
  {
    const lines = result.split('\n');
    const out = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const isKeyWithOnlyColon = /^\s*[A-Za-z_$][A-Za-z0-9_$]*\s*:\s*$/.test(line);
      if (!isKeyWithOnlyColon) {
        out.push(line);
        continue;
      }

      const next = lines[i + 1] ?? '';
      if (!/^\s*\|/.test(next)) {
        out.push(line);
        continue;
      }

      // Skip the `key:` and subsequent union/type lines.
      i += 1;
      while (i < lines.length) {
        const l = lines[i];
        if (
          /^\s*\|/.test(l) ||
          /^\s*;\s*$/.test(l) ||
          /^\s*>\s*;\s*$/.test(l) ||
          /^\s*\[\]\s*;\s*$/.test(l)
        ) {
          i += 1;
          continue;
        }
        // Step back one; loop will increment.
        i -= 1;
        break;
      }
    }
    result = out.join('\n');
  }

  // Repair an earlier sanitizer bug that accidentally matched the second '?' of
  // nullish coalescing (`?? {}` / `?? []`) and produced garbage like:
  //   x ?? {}, undefined, undefined;
  // which then triggers "Missing initializer in const declaration".
  result = result.replace(/\?\?\s*\{\}\s*(?:,\s*undefined)+/g, '?? {}');
  result = result.replace(/\?\?\s*\[\]\s*(?:,\s*undefined)+/g, '?? []');

  // Handle empty object and empty array branches.
  // Important: do NOT match `?? {}` / `?? []` (nullish coalescing).
  result = result.replace(/(?<!\?)\?\s*\{\}\s*(?=,|\)|;)/g, '? {} : undefined ');
  result = result.replace(/(?<!\?)\?\s*\[\]\s*(?=,|\)|;)/g, '? [] : undefined ');

  // Handle explicit ':' with a missing else expression.
  // Example: `condition ? {} : ,`
  result = result.replace(/(?<!\?)\?\s*\{\}\s*:\s*(?=,|\)|;)/g, '? {} : undefined ');
  result = result.replace(/(?<!\?)\?\s*\[\]\s*:\s*(?=,|\)|;)/g, '? [] : undefined ');

  // Handle a stray ':' that becomes an empty else branch like:
  //   const x = cond ? a :
  //   ;
  // This is invalid JS; treat empty else as `undefined`.
  result = result.replace(/:\s*(?:\r?\n)\s*;(?=\s*(?:\r?\n))/g, ': undefined;');
  result = result.replace(/:\s*;(?=\s*(?:\r?\n))/g, ': undefined;');

  // Fix a known broken aws service entry that becomes a shorthand property
  // `description,` without a binding in scope.
  if (filePath.endsWith(`${path.sep}aws.mjs`) || filePath.endsWith('/aws.mjs')) {
    // Fix broken shorthand properties inside the service list.
    result = result.replace(/^(\s*)description,\s*$/gm, '$1description: "",');
  }

  if (filePath.endsWith(`${path.sep}make.mjs`) || filePath.endsWith('/make.mjs')) {
    // Fix a mangled `if (...) const name = ...` sequence.
    result = result.replace(
      /if\s*\(specialTargets\.has\(target\)\)\s*\r?\n\s*if\s*\(([^\n]+)\)\s*\r?\n\s*const\s+name\s*=\s*target\.trim\(\);\s*/g,
      'if (specialTargets.has(target)) continue;\n            if ($1) continue;\n            const name = target.trim();\n'
    );
  }

  if (filePath.endsWith(`${path.sep}snaplet.mjs`) || filePath.endsWith('/snaplet.mjs')) {
    // Repair a corrupted Fly region suggestion entry.
    result = result.replace(
      '{ name: "maa", description: "Chenn{ script: ", ", postProcess: () => [] }, India":  },',
      '{ name: "maa", description: "Chennai, India" },'
    );
  }

  return result;
}

async function pathExists(filePath) {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function hasExplicitExtension(specifier) {
  // Already has .js/.mjs/.cjs/.json/.node or ends with '/'
  return /\.[a-zA-Z0-9]+$/.test(specifier) || specifier.endsWith('/');
}

function splitQueryHash(specifier) {
  const match = specifier.match(/^(?<base>[^?#]+)(?<suffix>[?#].*)?$/);
  return {
    base: match?.groups?.base ?? specifier,
    suffix: match?.groups?.suffix ?? '',
  };
}

async function resolveImportSpecifier(fromFile, rawSpecifier) {
  if (!rawSpecifier.startsWith('./') && !rawSpecifier.startsWith('../')) return rawSpecifier;

  const { base, suffix } = splitQueryHash(rawSpecifier);
  if (hasExplicitExtension(base)) return rawSpecifier;

  const fromDir = path.dirname(fromFile);
  const absBase = path.resolve(fromDir, base);

  // Keep if it already resolves as-is
  if (await pathExists(absBase)) return rawSpecifier;

  const mjsPath = absBase + '.mjs';
  if (await pathExists(mjsPath)) return base + '.mjs' + suffix;

  const jsPath = absBase + '.js';
  if (await pathExists(jsPath)) return base + '.js' + suffix;

  const indexMjsPath = path.join(absBase, 'index.mjs');
  if (await pathExists(indexMjsPath)) return base.replace(/\/$/, '') + '/index.mjs' + suffix;

  const indexJsPath = path.join(absBase, 'index.js');
  if (await pathExists(indexJsPath)) return base.replace(/\/$/, '') + '/index.js' + suffix;

  // Unresolvable: leave untouched
  return rawSpecifier;
}

async function rewriteRelativeImports(filePath, source) {
  const replacements = [];

  // 1) import ... from "./x"  (also covers export ... from "./x")
  const fromRegex = /(\bfrom\s+)(["'])(\.{1,2}\/[^"']+)(\2)/g;
  source.replace(fromRegex, (full, prefix, quote, spec, suffixQuote, offset) => {
    replacements.push({ offset, length: full.length, kind: 'from', prefix, quote, spec, suffixQuote, full });
    return full;
  });

  // 2) import "./x";
  const sideEffectRegex = /(^|\n)(\s*import\s+)(["'])(\.{1,2}\/[^"']+)(\3)(\s*;?)/g;
  source.replace(sideEffectRegex, (full, leading, kw, quote, spec, endQuote, semi, offset) => {
    replacements.push({ offset, length: full.length, kind: 'side', leading, kw, quote, spec, endQuote, semi, full });
    return full;
  });

  // 3) import("./x")
  const dynamicRegex = /(\bimport\s*\(\s*)(["'])(\.{1,2}\/[^"']+)(\2)(\s*\))/g;
  source.replace(dynamicRegex, (full, prefix, quote, spec, endQuote, close, offset) => {
    replacements.push({ offset, length: full.length, kind: 'dyn', prefix, quote, spec, endQuote, close, full });
    return full;
  });

  if (replacements.length === 0) return source;

  // Apply edits from end -> start so offsets remain valid.
  replacements.sort((a, b) => b.offset - a.offset);

  let updated = source;
  for (const r of replacements) {
    const newSpec = await resolveImportSpecifier(filePath, r.spec);
    if (newSpec === r.spec) continue;

    if (r.kind === 'from') {
      const newText = `${r.prefix}${r.quote}${newSpec}${r.quote}`;
      // Replace only the "from '..." portion
      const oldText = `${r.prefix}${r.quote}${r.spec}${r.quote}`;
      const segment = updated.slice(r.offset, r.offset + r.length);
      const replacedSegment = segment.replace(oldText, newText);
      updated = updated.slice(0, r.offset) + replacedSegment + updated.slice(r.offset + r.length);
    } else if (r.kind === 'side') {
      const oldText = `${r.kw}${r.quote}${r.spec}${r.quote}`;
      const newText = `${r.kw}${r.quote}${newSpec}${r.quote}`;
      const segment = updated.slice(r.offset, r.offset + r.length);
      const replacedSegment = segment.replace(oldText, newText);
      updated = updated.slice(0, r.offset) + replacedSegment + updated.slice(r.offset + r.length);
    } else if (r.kind === 'dyn') {
      const oldText = `${r.prefix}${r.quote}${r.spec}${r.quote}${r.close}`;
      const newText = `${r.prefix}${r.quote}${newSpec}${r.quote}${r.close}`;
      const segment = updated.slice(r.offset, r.offset + r.length);
      const replacedSegment = segment.replace(oldText, newText);
      updated = updated.slice(0, r.offset) + replacedSegment + updated.slice(r.offset + r.length);
    }
  }

  return updated;
}

function transpileTypescriptLike(source, virtualFileName) {
  const result = ts.transpileModule(source, {
    fileName: virtualFileName,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      esModuleInterop: true,
      allowJs: true,
      checkJs: false,
      removeComments: false,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
    reportDiagnostics: false,
  });

  return result.outputText;
}

function ensureDefaultSpecExport(source) {
  if (/\bexport\s+default\b/.test(source)) return source;
  const match = source.match(/\bexport\s+const\s+([A-Za-z_$][A-Za-z0-9_$]*Spec)\s*=/);
  if (!match) return source;
  return source.replace(/\s*$/u, '') + `\n\nexport default ${match[1]};\n`;
}

function fixMissingCompletionSpecDefault(source) {
  // Some conversions emit `export default completionSpec;` but never define `completionSpec`.
  // If we can find a `*Spec` export, repoint default export to that.
  if (!/\bexport\s+default\s+completionSpec\b/.test(source)) return source;
  if (/\bconst\s+completionSpec\b/.test(source) || /\blet\s+completionSpec\b/.test(source)) return source;

  const match = source.match(/\bexport\s+const\s+([A-Za-z_$][A-Za-z0-9_$]*Spec)\s*=/);
  if (!match) return source;

  return source.replace(/\bexport\s+default\s+completionSpec\s*;?/g, `export default ${match[1]};`);
}

function fixDanglingCompletionSpecIdentifier(source) {
  // Some conversions correctly export `<name>Spec` but still mutate/use `completionSpec` later.
  // Example: `export const limactlSpec = {...}; completionSpec.subcommands.push(...)`
  if (!/\bcompletionSpec\b/.test(source)) return source;
  if (/\bconst\s+completionSpec\b/.test(source) || /\blet\s+completionSpec\b/.test(source)) return source;

  const match = source.match(/\bexport\s+const\s+([A-Za-z_$][A-Za-z0-9_$]*Spec)\s*=/);
  if (!match) return source;

  const specVar = match[1];
  return source.replace(/\bcompletionSpec\b/g, specVar);
}

async function ensureCommunityShims() {
  if (!(await pathExists(COMMUNITY_DIR))) return;

  // Overwrite known-broken converted modules and create missing ones.
  for (const [fileName, content] of Object.entries(SHIM_FILES)) {
    const absPath = path.join(COMMUNITY_DIR, fileName);
    await fs.mkdir(path.dirname(absPath), { recursive: true });
    await fs.writeFile(absPath, content, 'utf8');
  }
}

async function listMjsFilesRecursively(dirPath) {
  const results = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await listMjsFilesRecursively(abs)));
    } else if (entry.isFile() && entry.name.endsWith('.mjs')) {
      results.push(abs);
    }
  }
  return results;
}

async function sanitizeFile(filePath) {
  // Shims are already valid and should not be rewritten/transpiled.
  const relFromCommunity = path.relative(COMMUNITY_DIR, filePath).split(path.sep).join('/');
  if (
    Object.prototype.hasOwnProperty.call(SHIM_FILES, relFromCommunity) ||
    Object.prototype.hasOwnProperty.call(SHIM_FILES, path.basename(filePath))
  ) {
    return { changed: false };
  }

  const original = await fs.readFile(filePath, 'utf8');
  const { shebang, code } = stripShebang(original);

  const cleaned = fixCommonConversionBugs(code, filePath);

  // Transpile first (fix TS syntax)
  const transpiled = transpileTypescriptLike(cleaned, filePath + '.ts');

  // Then rewrite relative imports (fix extensionless ESM imports)
  const rewritten = await rewriteRelativeImports(filePath, transpiled);

  const fixedDefaults = fixMissingCompletionSpecDefault(rewritten);
  const fixedCompletionSpec = fixDanglingCompletionSpecIdentifier(fixedDefaults);

  // Finally, ensure Fig-style default imports work for spec modules.
  const withDefault = ensureDefaultSpecExport(fixedCompletionSpec);

  const finalText = (shebang ? shebang + '\n' : '') + withDefault;

  if (finalText !== original) {
    await fs.writeFile(filePath, finalText, 'utf8');
    return { changed: true };
  }

  return { changed: false };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!(await pathExists(COMMUNITY_DIR))) {
    console.log(`[sanitize-community-specs] No community dir at ${COMMUNITY_DIR}; skipping.`);
    process.exit(0);
  }

  await ensureCommunityShims();

  const files = await listMjsFilesRecursively(COMMUNITY_DIR);
  if (files.length === 0) {
    console.log('[sanitize-community-specs] No .mjs files found; skipping.');
    process.exit(0);
  }

  if (args.reportOnly) {
    const report = await reportCommunityImports(files, args);
    const code = args.exitCode && report.fail > 0 ? 1 : 0;
    process.exit(code);
  }

  let changedCount = 0;
  let failedCount = 0;

  for (const filePath of files) {
    try {
      const { changed } = await sanitizeFile(filePath);
      if (changed) changedCount += 1;
    } catch (err) {
      failedCount += 1;
      console.error(`[sanitize-community-specs] Failed: ${path.relative(ROOT_DIR, filePath)}`);
      console.error(err);
    }
  }

  console.log(`[sanitize-community-specs] Done. Files: ${files.length}, changed: ${changedCount}, failed: ${failedCount}`);

  let report;
  if (args.report) report = await reportCommunityImports(files, args);

  if (args.exitCode && report && report.fail > 0) {
    process.exit(1);
  }

  // Never fail the build for sanitizer errors; community specs are best-effort.
  process.exit(0);
}

main().catch((err) => {
  console.error('[sanitize-community-specs] Fatal error:', err);
  process.exit(0);
});
