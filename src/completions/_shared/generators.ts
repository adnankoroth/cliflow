import type { Generator, Suggestion } from '../../types.js';

type LineMapper = (line: string) => Suggestion | null;

type CacheStrategy = 'ttl' | 'directory-change' | 'git-status-change';

type LinesGeneratorOptions = {
  script: string;
  cwd?: string;
  timeout?: number;
  cacheTtl?: number;
  cacheStrategy?: CacheStrategy;
  unique?: boolean;
  filterLine?: (line: string) => boolean;
  mapLine?: LineMapper;
  defaultType?: Suggestion['type'];
  defaultPriority?: number;
};

export function generatorFromLines({
  script,
  timeout,
  cacheTtl,
  cacheStrategy = 'ttl',
  unique = false,
  filterLine,
  mapLine,
  defaultType = 'argument',
  defaultPriority = 75,
}: LinesGeneratorOptions): Generator {
  return {
    script,
    timeout,
    postProcess: (output: string) => {
      if (!output) return [];

      const rawLines = output
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const filtered = filterLine ? rawLines.filter(filterLine) : rawLines;
      const lines = unique ? [...new Set(filtered)] : filtered;

      if (mapLine) {
        return lines.map(mapLine).filter((s): s is Suggestion => Boolean(s));
      }

      return lines.map((name) => ({
        name,
        type: defaultType,
        priority: defaultPriority,
      }));
    },
    cache: cacheTtl
      ? {
          ttl: cacheTtl,
          strategy: cacheStrategy,
        }
      : false,
  } satisfies Generator;
}

type TsvGeneratorOptions = Omit<LinesGeneratorOptions, 'mapLine'> & {
  delimiter?: string;
  mapFields: (fields: string[]) => Suggestion | null;
};

export function generatorFromSeparatedFields({
  script,
  timeout,
  cacheTtl,
  cacheStrategy = 'ttl',
  unique = false,
  filterLine,
  delimiter = '\t',
  mapFields,
}: TsvGeneratorOptions): Generator {
  return generatorFromLines({
    script,
    timeout,
    cacheTtl,
    cacheStrategy,
    unique,
    filterLine,
    mapLine: (line) => mapFields(line.split(delimiter)),
  });
}

type HelpSubcommandGeneratorOptions = {
  script: string;
  lineRegex?: RegExp;
  cacheTtl?: number;
  timeout?: number;
  priority?: number;
};

export function subcommandsFromHelp({
  script,
  lineRegex = /^\s{2,}([a-z0-9][\w.-]+)\s+(.*)$/i,
  cacheTtl = 60000,
  timeout,
  priority = 90,
}: HelpSubcommandGeneratorOptions): Generator {
  return {
    script,
    timeout,
    postProcess: (output: string) => {
      if (!output) return [];
      return output
        .split('\n')
        .map((line) => line.trimEnd())
        .map((line) => line.match(lineRegex))
        .filter((match): match is RegExpMatchArray => Boolean(match))
        .map((match) => ({
          name: match[1],
          description: match[2]?.trim() || 'Command',
          type: 'subcommand' as const,
          priority,
        }));
    },
    cache: { ttl: cacheTtl, strategy: 'ttl' as const },
  } satisfies Generator;
}
