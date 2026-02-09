import type { Generator, Suggestion } from '../types.js';

type ValueListOptions = {
  values?: Array<string | Suggestion>;
  insertDelimiter?: boolean;
  delimiter?: string;
};

type KeyValueOptions = {
  keys?: string[];
  values?: string[];
  separator?: string;
  cache?: boolean;
};

type KeyValueListOptions = KeyValueOptions & {
  delimiter?: string;
  insertDelimiter?: boolean;
};

type FilepathsOptions = {
  extensions?: string[];
};

type HistoryOptions = {
  limit?: number;
};

function normalizeValue(value: string | Suggestion): Suggestion {
  if (typeof value === 'string') return { name: value };
  return { ...value, name: String(value.name ?? '') };
}

function getCurrentToken(tokens: string[] | undefined): string {
  if (!tokens || tokens.length === 0) return '';
  return String(tokens[tokens.length - 1] ?? '');
}

function splitOnLast(input: string, delimiter: string): { head: string; tail: string } {
  const idx = input.lastIndexOf(delimiter);
  if (idx === -1) return { head: '', tail: input };
  return { head: input.slice(0, idx + delimiter.length), tail: input.slice(idx + delimiter.length) };
}

function shEscapePosix(value: string): string {
  // Safe single-quote escaping for POSIX shells.
  return `'${String(value).replace(/'/g, `'"'"'`)}'`;
}

function valueList(options: ValueListOptions = {}): Generator {
  const values = Array.isArray(options.values) ? options.values : [];
  const delimiter = options.delimiter ?? ',';
  const insertDelimiter = Boolean(options.insertDelimiter);

  return {
    custom: async (tokens?: string[]) => {
      const currentToken = getCurrentToken(tokens);

      // Support comma-delimited lists by completing only the last segment,
      // but keeping the already-typed prefix so rankAndFilter still works.
      const { head, tail } = splitOnLast(currentToken, delimiter);
      const typedPrefix = head;
      const typedFragment = tail;

      const normalized = values.map(normalizeValue).filter((s) => s.name.length > 0);

      const filtered = !typedFragment
        ? normalized
        : normalized.filter((s) => s.name.toLowerCase().startsWith(typedFragment.toLowerCase()));

      return filtered.map((s) => {
        const base = `${typedPrefix}${s.name}`;
        const insertValue = insertDelimiter ? `${base}${delimiter}` : base;
        return {
          ...s,
          name: base,
          insertValue,
          type: s.type ?? ('argument' as const),
          priority: s.priority ?? 75,
        } satisfies Suggestion;
      });
    },
    cache: { ttl: 60000, strategy: 'ttl' },
  } satisfies Generator;
}

function keyValue(options: KeyValueOptions = {}): Generator {
  const keys = options.keys ?? [];
  const values = options.values ?? [];
  const separator = options.separator ?? '=';

  return {
    custom: async (tokens?: string[]) => {
      const currentToken = getCurrentToken(tokens);
      const hasSep = currentToken.includes(separator);

      if (!hasSep) {
        return keys
          .filter((k) => !currentToken || k.toLowerCase().startsWith(currentToken.toLowerCase()))
          .map((k) => ({
            name: k,
            insertValue: `${k}${separator}`,
            description: 'Key',
            type: 'argument' as const,
            priority: 80,
          }));
      }

      const idx = currentToken.indexOf(separator);
      const keyPart = currentToken.slice(0, idx);
      const valuePart = currentToken.slice(idx + separator.length);
      const prefix = `${keyPart}${separator}`;

      return values
        .filter((v) => !valuePart || v.toLowerCase().startsWith(valuePart.toLowerCase()))
        .map((v) => ({
          name: `${prefix}${v}`,
          insertValue: `${prefix}${v}`,
          description: 'Value',
          type: 'argument' as const,
          priority: 75,
        }));
    },
    cache: options.cache ? { ttl: 60000, strategy: 'ttl' } : false,
  } satisfies Generator;
}

function keyValueList(options: KeyValueListOptions = {}): Generator {
  const separator = options.separator ?? '=';
  const delimiter = options.delimiter ?? ',';
  const insertDelimiter = options.insertDelimiter ?? true;

  // Treat the whole token as a delimiter-separated list of key/value pairs.
  return {
    custom: async (tokens?: string[]) => {
      const currentToken = getCurrentToken(tokens);
      const { head, tail } = splitOnLast(currentToken, delimiter);

      // Complete within the last segment of the list.
      const segment = tail;
      const segmentHasSep = segment.includes(separator);

      const keys = options.keys ?? [];
      const values = options.values ?? [];

      if (!segmentHasSep) {
        const typed = segment;
        return keys
          .filter((k) => !typed || k.toLowerCase().startsWith(typed.toLowerCase()))
          .map((k) => {
            const base = `${head}${k}${separator}`;
            return {
              name: base,
              insertValue: base,
              description: 'Key',
              type: 'argument' as const,
              priority: 80,
            };
          });
      }

      const idx = segment.indexOf(separator);
      const keyPart = segment.slice(0, idx);
      const valuePart = segment.slice(idx + separator.length);
      const prefix = `${head}${keyPart}${separator}`;

      return values
        .filter((v) => !valuePart || v.toLowerCase().startsWith(valuePart.toLowerCase()))
        .map((v) => {
          const base = `${prefix}${v}`;
          const insertValue = insertDelimiter ? `${base}${delimiter}` : base;
          return {
            name: base,
            insertValue,
            description: 'Value',
            type: 'argument' as const,
            priority: 75,
          };
        });
    },
    cache: options.cache ? { ttl: 60000, strategy: 'ttl' } : false,
  } satisfies Generator;
}

function filepaths(options: FilepathsOptions = {}, only: 'files' | 'folders' | 'both' = 'both'): Generator {
  const exts = Array.isArray(options.extensions) ? options.extensions.filter(Boolean) : [];

  // Implemented via a node helper executed in the request cwd (via executeShellCommand).
  // This avoids relying on the daemon process cwd.
  const nodeProgram = String.raw`
const fs = require('fs');
const path = require('path');

const partialEscaped = process.env.CLIFLOW_PARTIAL || '';
const extsCsv = process.env.CLIFLOW_EXTS || '';
const only = process.env.CLIFLOW_ONLY || 'both';
const exts = extsCsv ? extsCsv.split(',').filter(Boolean) : [];

// Unescape shell escaping to get real path (e.g., "\ " -> " ")
function unescapePath(p) {
  return p.replace(/\\(.)/g, '$1');
}

// partial for path resolution (unescaped)
const partial = unescapePath(partialEscaped);

function isHiddenAllowed(partialPath) {
  if (!partialPath) return false;
  // Allow hidden when user is typing a dot anywhere in the current segment
  const seg = partialPath.split('/').pop() || '';
  return seg.startsWith('.');
}

let dir = process.cwd();
let prefix = '';
let typedPrefix = '';  // For reconstructing the full path

if (partial) {
  if (partial.endsWith('/')) {
    dir = path.resolve(process.cwd(), partial);
    prefix = '';
    // Use the unescaped path for output (shell will escape)
    typedPrefix = partial;
  } else if (partial.includes('/')) {
    // Get the unescaped prefix up to last /
    const lastSlash = partial.lastIndexOf('/');
    typedPrefix = partial.slice(0, lastSlash + 1);
    const resolved = path.resolve(process.cwd(), partial);
    dir = path.dirname(resolved);
    prefix = partial.slice(partial.lastIndexOf('/') + 1);
  } else {
    dir = process.cwd();
    prefix = partial;
    typedPrefix = '';
  }
}

let entries = [];
try {
  entries = fs.readdirSync(dir, { withFileTypes: true });
} catch {
  process.exit(0);
}

const allowHidden = isHiddenAllowed(partial);

for (const ent of entries) {
  const name = ent.name;
  if (!allowHidden && name.startsWith('.')) continue;
  if (prefix && !name.toLowerCase().startsWith(prefix.toLowerCase())) continue;

  const isDir = ent.isDirectory();
  if (only === 'files' && isDir) continue;
  if (only === 'folders' && !isDir) continue;
  if (!isDir && exts.length > 0) {
    const ok = exts.some((e) => name.endsWith(e));
    if (!ok) continue;
  }

  // Return ACTUAL path (with real spaces) - shell will handle escaping
  // Unescape the typedPrefix first since it may contain shell escapes
  const unescapedPrefix = unescapePath(typedPrefix);
  const out = unescapedPrefix + name + (isDir ? '/' : '');
  console.log(out);
}
`;

  return {
    script: async (tokens: string[], executeShellCommand) => {
      const currentToken = getCurrentToken(tokens);
      const partial = currentToken;

      const envPrefix = `CLIFLOW_PARTIAL=${shEscapePosix(partial)} CLIFLOW_EXTS=${shEscapePosix(exts.join(','))} CLIFLOW_ONLY=${shEscapePosix(only)}`;
      const cmd = `${envPrefix} node -e ${shEscapePosix(nodeProgram)}`;

      const { stdout } = await executeShellCommand(cmd);
      return String(stdout)
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((name) => ({
          name,
          insertValue: name,
          type: name.endsWith('/') ? ('folder' as const) : ('file' as const),
          priority: 70,
        }));
    },
    cache: { ttl: 5000, strategy: 'ttl' },
  } satisfies Generator;
}

function files(options: FilepathsOptions = {}): Generator {
  return filepaths(options, 'files');
}

function folders(): Generator {
  return filepaths({}, 'folders');
}

function history(options: HistoryOptions = {}): Generator {
  const limit = typeof options.limit === 'number' && options.limit > 0 ? options.limit : 200;

  return {
    custom: async () => {
      try {
        const fs = await import('fs');
        const os = await import('os');
        const path = await import('path');

        const candidates = [
          process.env.HISTFILE,
          path.join(os.homedir(), '.zsh_history'),
          path.join(os.homedir(), '.bash_history'),
          path.join(os.homedir(), '.config', 'fish', 'fish_history'),
        ].filter((p): p is string => Boolean(p));

        let content = '';
        for (const file of candidates) {
          try {
            if (fs.existsSync(file)) {
              content = fs.readFileSync(file, 'utf8');
              if (content) break;
            }
          } catch {
            // ignore
          }
        }

        if (!content) return [];

        const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

        const commands: string[] = [];
        for (let i = lines.length - 1; i >= 0 && commands.length < limit * 3; i--) {
          const line = lines[i];

          // zsh extended history: ": 1700000000:0;cmd"
          const zshMatch = line.match(/^: \d+:\d+;(.*)$/);
          if (zshMatch && zshMatch[1]) {
            commands.push(zshMatch[1].trim());
            continue;
          }

          // fish history is YAML-ish; best-effort: lines starting with "- cmd:"
          const fishMatch = line.match(/^- cmd:\s*(.*)$/);
          if (fishMatch && fishMatch[1]) {
            commands.push(fishMatch[1].trim());
            continue;
          }

          // bash history: raw command lines
          commands.push(line);
        }

        const unique = Array.from(new Set(commands)).slice(0, limit);
        return unique.map((cmd) => ({
          name: cmd,
          description: 'History',
          type: 'argument' as const,
          priority: 50,
        }));
      } catch {
        return [];
      }
    },
    cache: { ttl: 5000, strategy: 'ttl' },
  } satisfies Generator;
}

export function installFigHelpers(): void {
  const g = globalThis as any;
  if (g.__cliflowFigHelpersInstalled) return;

  g.__cliflowFigHelpersInstalled = true;

  // Minimal polyfills for common Fig helper utilities referenced by converted specs.
  g.valueList = valueList;
  g.filepaths = filepaths;
  g.files = files;
  g.folders = folders;
  g.history = history;
  g.keyValue = keyValue;
  g.keyValueList = keyValueList;
}
