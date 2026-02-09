import { CompletionSpec, CompletionContext, Suggestion, Subcommand } from '../types.js';
import { installFigHelpers } from './fig-helpers.js';

export class CompletionEngine {
  private specs: Map<string, CompletionSpec> = new Map();
  private cache: Map<string, { data: Suggestion[]; expires: number }> = new Map();
  private inFlightGenerators: Map<string, Promise<Suggestion[]>> = new Map();
  private initialized: boolean = false;
  private communitySpecsAvailable: Set<string> = new Set();
  private dynamicSpecsAvailable: Set<string> = new Set();
  
  constructor() {
    // Don't load specs in constructor
  }
  
  async initialize() {
    if (!this.initialized) {
      // Some converted specs reference Fig helper globals (e.g. valueList, filepaths).
      // Install lightweight polyfills up-front so lazy imports don't crash.
      installFigHelpers();
      await this.loadBuiltInSpecs();
      await this.loadDynamicSpecsList();
      await this.loadCommunitySpecsList();
      this.initialized = true;
    }
  }
  
  /**
   * Load list of available dynamic specs from completions directory (lazy)
   */
  private async loadDynamicSpecsList() {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const completionsDir = path.join(__dirname, '..', 'completions');
      
      const walk = (dir: string, prefixParts: string[] = []) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          // Skip hidden folders/files and source maps
          if (entry.name.startsWith('.')) continue;
          if (entry.name.startsWith('_')) continue;
          if (entry.isDirectory()) {
            if (entry.name === 'community') continue;
            walk(path.join(dir, entry.name), [...prefixParts, entry.name]);
            continue;
          }

          if (!entry.isFile()) continue;
          if (!entry.name.endsWith('.js')) continue;
          if (entry.name.endsWith('.d.js') || entry.name.endsWith('.js.map')) continue;

          const baseName = entry.name.replace(/\.js$/, '');
          const specName = [...prefixParts, baseName].join('/');
          const topLevel = prefixParts.length === 0 ? baseName : null;

          // Skip already loaded built-in specs and certain files (top-level only)
          if (topLevel && (this.specs.has(topLevel) || ['index', 'types'].includes(topLevel) || topLevel.startsWith('_'))) {
            continue;
          }

          this.dynamicSpecsAvailable.add(specName);
        }
      };

      if (fs.existsSync(completionsDir)) {
        walk(completionsDir);
      }
    } catch {
      // Dynamic specs listing failed, that's okay
    }
  }
  
  /**
   * Lazy load a dynamic spec when needed
   */
  private async loadDynamicSpec(commandName: string): Promise<CompletionSpec | null> {
    if (!this.dynamicSpecsAvailable.has(commandName)) {
      return null;
    }
    
    try {
      installFigHelpers();
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const specPath = path.join(__dirname, '..', 'completions', `${commandName}.js`);
      
      const module = await import(specPath);
      
      // Find the spec export - try common patterns
      const cleanName = commandName.replace(/[^a-zA-Z0-9]/g, '');
      const specNames = [
        `${cleanName}Spec`,
        `${cleanName}CompletionSpec`,
        'completionSpec',
        'default'
      ];
      
      let spec = null;
      for (const name of specNames) {
        if (module[name]) {
          spec = module[name];
          break;
        }
      }
      
      if (!spec) {
        // Try first export that looks like a spec
        const exports = Object.values(module);
        for (const exp of exports) {
          if (exp && typeof exp === 'object' && 'name' in (exp as any)) {
            spec = exp as CompletionSpec;
            break;
          }
        }
      }
      
      if (spec) {
        // Cache it for future use
        this.specs.set(commandName, spec);
        this.dynamicSpecsAvailable.delete(commandName);
        return spec;
      }
      
      return null;
    } catch {
      // Failed to load dynamic spec
      this.dynamicSpecsAvailable.delete(commandName);
      return null;
    }
  }

  private async resolveLoadSpecRef(ref: any): Promise<CompletionSpec | null> {
    if (!ref) return null;

    if (typeof ref === 'string') {
      return (
        this.specs.get(ref) ||
        (await this.loadDynamicSpec(ref)) ||
        (await this.loadCommunitySpec(ref)) ||
        null
      );
    }

    if (typeof ref === 'object') {
      return ref as CompletionSpec;
    }

    return null;
  }

  /**
   * Apply Fig-compatible `loadSpec` on-demand.
   * This is intentionally shallow: it merges the loaded spec subtree into `target`.
   */
  private async ensureLoadSpecApplied(target: any): Promise<void> {
    if (!target || typeof target !== 'object') return;

    const internal = target as CompletionSpec & { __loadSpecApplied?: boolean };
    if (internal.__loadSpecApplied) return;
    if (!('loadSpec' in target) || !(target as any).loadSpec) return;

    internal.__loadSpecApplied = true;
    const ref = (target as any).loadSpec as any;
    const loaded = await this.resolveLoadSpecRef(ref);
    if (loaded) {
      this.mergeSpec(target, loaded);
    }
  }
  
  /**
   * Get list of all available spec names
   */
  getAvailableSpecs(): string[] {
    const all = new Set([
      ...this.specs.keys(),
      ...this.dynamicSpecsAvailable,
      ...this.communitySpecsAvailable
    ]);
    return Array.from(all).sort();
  }
  
  /**
   * Load list of available community specs (lazy - doesn't load the actual specs)
   */
  private async loadCommunitySpecsList() {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const communityDir = path.join(__dirname, '..', 'completions', 'community');
      
      if (fs.existsSync(communityDir)) {
        const files = fs.readdirSync(communityDir);
        for (const file of files) {
          if (file.endsWith('.mjs') && file !== 'index.mjs') {
            const specName = file.replace('.mjs', '');
            // Only add to available list if not already a built-in
            if (!this.specs.has(specName)) {
              this.communitySpecsAvailable.add(specName);
            }
          }
        }
      }
    } catch {
      // Community specs not available, that's okay
    }
  }
  
  /**
   * Lazy load a community spec when needed
   */
  private async loadCommunitySpec(commandName: string): Promise<CompletionSpec | null> {
    if (!this.communitySpecsAvailable.has(commandName)) {
      return null;
    }
    
    try {
      installFigHelpers();
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const specPath = path.join(__dirname, '..', 'completions', 'community', `${commandName}.mjs`);
      
      const module = await import(specPath);
      
      // The spec is exported as <commandName>Spec (e.g., lsSpec, gitSpec)
      const cleanName = commandName.replace(/[^a-zA-Z0-9]/g, '');
      const specName = `${cleanName}Spec`;
      
      let spec = module[specName] || module.default;
      
      if (!spec) {
        // Try first export
        const exports = Object.values(module);
        if (exports.length > 0) {
          spec = exports[0] as CompletionSpec;
        }
      }
      
      if (spec) {
        // Cache it for future use
        this.specs.set(commandName, spec);
        this.communitySpecsAvailable.delete(commandName);
        return spec;
      }
      
      return null;
    } catch {
      // Failed to load community spec
      this.communitySpecsAvailable.delete(commandName);
      return null;
    }
  }
  
  private async loadBuiltInSpecs() {
    // Dynamically load all completion specs
    const { gitSpec } = await import('../completions/git.js');
    const { dockerSpec } = await import('../completions/docker.js');
    const { npmSpec } = await import('../completions/npm.js');
    const { awsSpec } = await import('../completions/aws.js');
    const { kubectlSpec } = await import('../completions/kubectl.js');
    const { terraformSpec } = await import('../completions/terraform.js');
    const { helmSpec } = await import('../completions/helm.js');
    const { dockerComposeSpec } = await import('../completions/docker-compose.js');
    const { cargoSpec } = await import('../completions/cargo.js');
    const { goSpec } = await import('../completions/go.js');
    const { pipSpec } = await import('../completions/pip.js');
    const { yarnSpec } = await import('../completions/yarn.js');
    const { gcpSpec } = await import('../completions/gcp.js');
    const { kubectxSpec, kubeNsSpec } = await import('../completions/kubectx.js');
    const { 
      lsSpec, cdSpec, mkdirSpec, rmSpec, cpSpec, mvSpec, findSpec, grepSpec, 
      catSpec, tailSpec, headSpec, psSpec, killSpec, chmodSpec, chownSpec, 
      tarSpec, wgetSpec, curlSpec, sshSpec, scpSpec 
    } = await import('../completions/linux.js');
    const { 
      nextjsSpec, viteSpec, vueCliSpec, createReactAppSpec, 
      nuxtSpec, storybookSpec 
    } = await import('../completions/frontend.js');
    const { angularCliSpec } = await import('../completions/angular.js');
    const { 
      psqlSpec, mysqlSpec, mongoshSpec, redisCliSpec, sqliteSpec, prismaSpec 
    } = await import('../completions/database.js');
    const { azureCliSpec } = await import('../completions/azure.js');
    const { 
      alibabaCloudSpec, tailscaleSpec 
    } = await import('../completions/cloud.js');
    const { ghSpec } = await import('../completions/gh.js');
    const { ansibleSpec, ansiblePlaybookSpec } = await import('../completions/ansible.js');
    const { 
      pulumiSpec, serverlessSpec 
    } = await import('../completions/infrastructure.js');
    const { 
      jestSpec, cypressSpec, playwrightSpec, eslintSpec, prettierSpec, vitestSpec 
    } = await import('../completions/testing.js');
    const { 
      prometheusSpec, grafanaCliSpec, datadogSpec, jaegerSpec, opentelemetrySpec 
    } = await import('../completions/monitoring.js');
    const { vaultSpec } = await import('../completions/vault.js');
    const { 
      onePasswordSpec, sopsSpec, ageSpec, gpgSpec 
    } = await import('../completions/security.js');
    const { 
      kustomizeSpec, skaffoldSpec, kindSpec, minikubeSpec, fluxSpec 
    } = await import('../completions/devops.js');
    
    this.specs.set('git', gitSpec);
    this.specs.set('docker', dockerSpec);
    this.specs.set('npm', npmSpec);
    this.specs.set('aws', awsSpec);
    this.specs.set('kubectl', kubectlSpec);
    this.specs.set('terraform', terraformSpec);
    this.specs.set('helm', helmSpec);
    this.specs.set('docker-compose', dockerComposeSpec);
    this.specs.set('cargo', cargoSpec);
    this.specs.set('go', goSpec);
    this.specs.set('pip', pipSpec);
    this.specs.set('yarn', yarnSpec);
    this.specs.set('gcloud', gcpSpec);
    this.specs.set('kubectx', kubectxSpec);
    this.specs.set('kubens', kubeNsSpec);
    
    // Linux commands
    this.specs.set('ls', lsSpec);
    this.specs.set('cd', cdSpec);
    this.specs.set('mkdir', mkdirSpec);
    this.specs.set('rm', rmSpec);
    this.specs.set('cp', cpSpec);
    this.specs.set('mv', mvSpec);
    this.specs.set('find', findSpec);
    this.specs.set('grep', grepSpec);
    this.specs.set('cat', catSpec);
    this.specs.set('tail', tailSpec);
    this.specs.set('head', headSpec);
    this.specs.set('ps', psSpec);
    this.specs.set('kill', killSpec);
    this.specs.set('chmod', chmodSpec);
    this.specs.set('chown', chownSpec);
    this.specs.set('tar', tarSpec);
    this.specs.set('wget', wgetSpec);
    this.specs.set('curl', curlSpec);
    this.specs.set('ssh', sshSpec);
    this.specs.set('scp', scpSpec);
    
    // Frontend framework tools
    this.specs.set('next', nextjsSpec);
    this.specs.set('vite', viteSpec);
    this.specs.set('vue', vueCliSpec);
    this.specs.set('ng', angularCliSpec);
    this.specs.set('create-react-app', createReactAppSpec);
    this.specs.set('nuxt', nuxtSpec);
    this.specs.set('storybook', storybookSpec);
    
    // Database tools
    this.specs.set('psql', psqlSpec);
    this.specs.set('mysql', mysqlSpec);
    this.specs.set('mongosh', mongoshSpec);
    this.specs.set('redis-cli', redisCliSpec);
    this.specs.set('sqlite3', sqliteSpec);
    this.specs.set('prisma', prismaSpec);
    
    // Cloud and infrastructure tools
    this.specs.set('az', azureCliSpec);
    this.specs.set('gh', ghSpec);
    this.specs.set('aliyun', alibabaCloudSpec);
    this.specs.set('tailscale', tailscaleSpec);
    
    // Infrastructure automation tools
    this.specs.set('ansible', ansibleSpec);
    this.specs.set('ansible-playbook', ansiblePlaybookSpec);
    this.specs.set('pulumi', pulumiSpec);
    this.specs.set('serverless', serverlessSpec);
    this.specs.set('sls', serverlessSpec); // Serverless alias
    
    // Testing and quality assurance tools
    this.specs.set('jest', jestSpec);
    this.specs.set('cypress', cypressSpec);
    this.specs.set('playwright', playwrightSpec);
    this.specs.set('eslint', eslintSpec);
    this.specs.set('prettier', prettierSpec);
    this.specs.set('vitest', vitestSpec);
    
    // Monitoring and observability tools
    this.specs.set('prometheus', prometheusSpec);
    this.specs.set('grafana-cli', grafanaCliSpec);
    this.specs.set('datadog', datadogSpec);
    this.specs.set('jaeger', jaegerSpec);
    this.specs.set('opentelemetry', opentelemetrySpec);
    
    // Security and secrets management tools
    this.specs.set('vault', vaultSpec);
    this.specs.set('op', onePasswordSpec);
    this.specs.set('sops', sopsSpec);
    this.specs.set('age', ageSpec);
    this.specs.set('gpg', gpgSpec);
    
    // Advanced DevOps and orchestration tools
    this.specs.set('kustomize', kustomizeSpec);
    this.specs.set('skaffold', skaffoldSpec);
    this.specs.set('kind', kindSpec);
    this.specs.set('minikube', minikubeSpec);
    this.specs.set('flux', fluxSpec);
  }
  
  /**
   * Register a new completion spec
   */
  registerSpec(spec: CompletionSpec) {
    this.specs.set(spec.name, spec);
  }
  
  /**
   * Get completions for a given command line
   */
  async getCompletions(context: CompletionContext): Promise<Suggestion[]> {
    await this.initialize();
    
    const { tokens } = context;
    
    if (tokens.length === 0) {
      return this.getAvailableCommands();
    }
    
    const commandName = tokens[0];
    let spec = this.specs.get(commandName);
    
    // If not found in built-in specs, try loading dynamic spec
    if (!spec) {
      const dynamicSpec = await this.loadDynamicSpec(commandName);
      if (dynamicSpec) {
        spec = dynamicSpec;
      }
    }
    
    // If still not found, try community specs
    if (!spec) {
      const communitySpec = await this.loadCommunitySpec(commandName);
      if (communitySpec) {
        spec = communitySpec;
      }
    }
    
    if (!spec) {
      return this.getAvailableCommands().filter(cmd => 
        cmd.name.startsWith(commandName)
      );
    }
    
    return this.getSpecCompletions(spec, context);
  }
  
  /**
   * Get total spec count (built-in + dynamic + community)
   */
  getSpecCount(): { builtin: number; dynamic: number; community: number; total: number } {
    return {
      builtin: this.specs.size,
      dynamic: this.dynamicSpecsAvailable.size,
      community: this.communitySpecsAvailable.size,
      total: this.specs.size + this.dynamicSpecsAvailable.size + this.communitySpecsAvailable.size
    };
  }
  
  /**
   * Normalize a name that might be an array (common in Fig specs)
   */
  private normalizeName(name: string | string[] | undefined): string {
    if (!name) return '';
    if (Array.isArray(name)) return name[0] || '';
    return String(name);
  }
  
  /**
   * Get list of all available commands
   */
  private getAvailableCommands(): Suggestion[] {
    return Array.from(this.specs.values()).map(spec => ({
      name: spec.name,
      description: spec.description || '',
      type: 'subcommand' as const,
      priority: 100
    }));
  }

  /**
   * Ensure any dynamic spec generation has been applied
   */
  private async ensureSpecGenerated(spec: CompletionSpec, context: CompletionContext): Promise<void> {
    const internalSpec = spec as CompletionSpec & { __generated?: boolean };

    if (internalSpec.__generated || !spec.generateSpec) {
      return;
    }

    internalSpec.__generated = true;

    if (typeof spec.generateSpec === 'function') {
      const result = await spec.generateSpec(context);
      if (result) {
        this.mergeSpec(spec, result);
      }
      return;
    }

    const generators = Array.isArray(spec.generateSpec) ? spec.generateSpec : [spec.generateSpec];
    const generatedSubcommands: Subcommand[] = [];

    for (const generator of generators) {
      const suggestions = await this.getGeneratorCompletions(generator, context);
      for (const suggestion of suggestions) {
        const name = this.normalizeName(suggestion.name);
        if (!name) continue;
        generatedSubcommands.push({
          name,
          description: suggestion.description,
          priority: suggestion.priority
        });
      }
    }

    if (generatedSubcommands.length > 0) {
      this.mergeSpec(spec, { subcommands: generatedSubcommands });
    }
  }

  private mergeSpec(target: CompletionSpec, patch: Partial<CompletionSpec>) {
    if (patch.subcommands) {
      const existing = target.subcommands || [];
      const byName = new Map(existing.map(sub => [this.normalizeName(sub.name), sub]));

      for (const sub of patch.subcommands) {
        const key = this.normalizeName(sub.name);
        if (!key) continue;
        if (!byName.has(key)) {
          byName.set(key, sub);
        }
      }

      target.subcommands = Array.from(byName.values());
    }

    if (patch.options) {
      target.options = [...(target.options || []), ...patch.options];
    }

    if (patch.args && !target.args) {
      target.args = patch.args;
    }

    if (patch.examples) {
      target.examples = [...(target.examples || []), ...patch.examples];
    }

    if (patch.additionalSuggestions) {
      target.additionalSuggestions = [...(target.additionalSuggestions || []), ...patch.additionalSuggestions];
    }
  }
  
  /**
   * Get completions from a specific spec
   */
  private async getSpecCompletions(
    spec: CompletionSpec, 
    context: CompletionContext
  ): Promise<Suggestion[]> {
    await this.ensureLoadSpecApplied(spec);
    await this.ensureSpecGenerated(spec, context);

    const { tokens, cursorPosition } = context;
    const currentTokenIndex = this.getCurrentTokenIndex(tokens, cursorPosition);
    const currentToken = tokens[currentTokenIndex] || '';

    // Fig-style: args.loadSpec unlocks additional options/subcommands after an arg is provided
    const internal = spec as CompletionSpec & { __argsLoadSpecApplied?: boolean };
    if (!internal.__argsLoadSpecApplied && spec.args) {
      const argSpec = Array.isArray(spec.args) ? spec.args[0] : spec.args;
      const argLoadSpecRef = (argSpec as any)?.loadSpec;

      // Apply when user is past the arg position (tokens length >= 2), or is completing options.
      if (argLoadSpecRef && (tokens.length >= 2 || currentToken.startsWith('-'))) {
        const loaded = await this.resolveLoadSpecRef(argLoadSpecRef);
        if (loaded) {
          this.mergeSpec(spec, loaded);
        }
        internal.__argsLoadSpecApplied = true;
      }
    }


    // Find the active subcommand first - this is crucial for proper nesting
    let activeSubcommand = null;
    let subcommandIndex = -1;
    
    // For the root command, start from index 1 (skip command name)
    // For recursive calls, start from index 0 (all tokens are subcommand tokens)  
    const startIndex = tokens[0] === spec.name ? 1 : 0;
    
    for (let i = startIndex; i < tokens.length; i++) {
      const token = tokens[i];
      if (token && token.length > 0 && !token.startsWith('-')) {  // Only consider non-empty, non-option tokens
        activeSubcommand = spec.subcommands?.find(sub => 
          sub.name === token || sub.aliases?.includes(token)
        );
        if (activeSubcommand) {
          subcommandIndex = i;
          break;
        }
      }
    }


    if (activeSubcommand && subcommandIndex !== -1) {
      // Create new context with tokens after the subcommand
      const newTokens = tokens.slice(subcommandIndex + 1);
      const originalCommandLength = tokens.slice(0, subcommandIndex + 1).join(' ').length + 1; // +1 for space
      const newCursorPosition = Math.max(0, cursorPosition - originalCommandLength);

      await this.ensureLoadSpecApplied(activeSubcommand);

      await this.ensureSpecGenerated(activeSubcommand, {
        ...context,
        tokens: newTokens,
        cursorPosition: newCursorPosition
      });
      
      
      // If we have tokens after the subcommand OR if the cursor is past the subcommand,
      // recurse into the subcommand
      if (newTokens.length > 0 || currentTokenIndex > subcommandIndex) {
        return this.getSpecCompletions(activeSubcommand, {
          ...context,
          tokens: newTokens,
          cursorPosition: newCursorPosition
        });
      }
    }
    
    // If we're completing the first token or have no tokens, return subcommands
    // Handle the case where we have empty tokens (user typed space after command/subcommand)
    const isRootCommand = tokens[0] === spec.name;
    const subcommandContextIndex = isRootCommand ? 1 : 0;
    
    // Only enter this block for subcommand completion logic
    if ((currentTokenIndex <= subcommandContextIndex || tokens.length === 0) || 
        (currentTokenIndex >= 0 && currentToken === '')) {
      // When we have an empty current token, show subcommands
      if (currentToken === '' && spec.subcommands) {
        return this.getSubcommandCompletions(spec, '');
      }
      // Original logic for non-empty tokens - filtering subcommands
      // ONLY try subcommand matching if the spec HAS subcommands
      if (spec.subcommands && tokens.length > 0 && currentToken && currentToken.length > 0 && !currentToken.startsWith('-')) {
        const filterToken = currentToken;
        const subcommandMatches = this.getSubcommandCompletions(spec, filterToken);
        // Only return subcommand matches if we found some
        // If no matches and we have args, fall through to argument completion
        if (subcommandMatches.length > 0 || !spec.args) {
          return subcommandMatches;
        }
      }
    }


    // Handle options and arguments at this level
    const suggestions: Suggestion[] = [];
    let hasPathTemplate = false;
    
    // Add arguments first if we're not completing an option
    if (!currentToken.startsWith('-') && spec.args) {
      const argSuggestions = await this.getArgumentCompletions(spec.args, context);
      suggestions.push(...argSuggestions);
      
      // Check if this arg has a path template (folders, files, filepaths)
      const argSpec = Array.isArray(spec.args) ? spec.args[0] : spec.args;
      if (argSpec.template) {
        const templates = Array.isArray(argSpec.template) ? argSpec.template : [argSpec.template];
        if (templates.some(t => ['folders', 'files', 'filepaths'].includes(t))) {
          hasPathTemplate = true;
        }
      }
    }
    
    // Add options
    if (spec.options) {
      suggestions.push(...this.getOptionCompletions(spec.options, currentToken, tokens));
    }

    // For path templates, don't filter by currentToken since paths are already resolved
    // The path resolution happens in getSmartPathCompletions
    return this.rankAndFilter(suggestions, hasPathTemplate ? '' : currentToken);
  }
  
  /**
   * Get subcommand completions
   */
  private getSubcommandCompletions(spec: CompletionSpec, currentToken: string): Suggestion[] {
    if (!spec.subcommands) return [];
    
    const suggestions = spec.subcommands
      .filter(sub => !sub.hidden)
      .map(sub => ({
        name: this.normalizeName(sub.name),
        description: sub.description || '',
        type: 'subcommand' as const,
        priority: sub.priority || 100
      }));
    
    // Use fuzzy matching for filtering
    if (!currentToken) return suggestions;
    return this.rankAndFilter(suggestions, currentToken);
  }
  
  /**
   * Get option completions
   */
  private getOptionCompletions(options: any[], currentToken: string, tokens: string[]): Suggestion[] {
    const suggestions = options
      .filter(opt => !opt.hidden)
      .flatMap(opt => {
        const names = Array.isArray(opt.name) ? opt.name : [opt.name];
        return names.map((name: string) => ({
          name: this.normalizeName(name),
          description: opt.description || '',
          type: 'option' as const,
          priority: opt.priority || 80
        }));
      });
    
    // Use fuzzy matching for filtering
    if (!currentToken) return suggestions;
    return this.rankAndFilter(suggestions, currentToken);
  }
  
  /**
   * Get argument completions
   */
  private async getArgumentCompletions(args: any, context: CompletionContext): Promise<Suggestion[]> {
    const argSpec = Array.isArray(args) ? args[0] : args;
    const suggestions: Suggestion[] = [];
    
    // Static suggestions - normalize names from Fig specs
    if (argSpec.suggestions) {
      suggestions.push(...argSpec.suggestions.map((s: any) => ({
        ...s,
        name: this.normalizeName(s.name),
        type: s.type || 'argument' as const
      })));
    }
    
    // Template-based suggestions
    if (argSpec.template) {
      const templates = Array.isArray(argSpec.template) ? argSpec.template : [argSpec.template];
      for (const template of templates) {
        suggestions.push(...await this.getTemplateCompletions(template, context));
      }
    }
    
    // Generator-based suggestions
    if (argSpec.generators) {
      const generators = Array.isArray(argSpec.generators) ? argSpec.generators : [argSpec.generators];
      for (const generator of generators) {
        suggestions.push(...await this.getGeneratorCompletions(generator, context));
      }
    }
    
    return suggestions;
  }
  
  /**
   * Get completions from templates
   */
  private async getTemplateCompletions(template: string, context: CompletionContext): Promise<Suggestion[]> {
    const { currentWorkingDirectory, tokens } = context;
    
    // Get the current token (partial path being typed)
    const currentToken = tokens[tokens.length - 1] || '';
    
    switch (template) {
      case 'filepaths':
        return this.getSmartPathCompletions(currentWorkingDirectory, currentToken, true, true);
      case 'files':
        return this.getSmartPathCompletions(currentWorkingDirectory, currentToken, true, false);
      case 'folders':
        return this.getSmartPathCompletions(currentWorkingDirectory, currentToken, false, true);
      default:
        return [];
    }
  }
  
  /**
   * Unescape shell-escaped characters in a path (e.g., "\ " -> " ")
   */
  private unescapePath(inputPath: string): string {
    // Remove backslash escapes: \<space> -> <space>, \\ -> \
    return inputPath.replace(/\\(.)/g, '$1');
  }
  
  /**
   * Escape special characters in a path for shell (e.g., " " -> "\ ")
   */
  private escapePathForShell(inputPath: string): string {
    // Escape spaces and other special shell characters
    return inputPath.replace(/ /g, '\\ ');
  }
  
  /**
   * Resolve a path that may contain ~ or be relative
   */
  private resolvePath(inputPath: string, cwd: string): string {
    if (!inputPath) return cwd;
    
    // First, unescape shell escaping to get the actual path
    const unescaped = this.unescapePath(inputPath);
    
    // Handle home directory
    if (unescaped.startsWith('~')) {
      const home = process.env.HOME || '/';
      return unescaped.replace(/^~/, home);
    }
    
    // Handle absolute paths
    if (unescaped.startsWith('/')) {
      return unescaped;
    }
    
    // Handle relative paths - use simple string concatenation since we're in a sync function
    // Remove leading ./ if present
    const normalizedPath = unescaped.startsWith('./') ? unescaped.slice(2) : unescaped;
    // Join paths, ensuring proper separator
    const result = cwd.endsWith('/') ? cwd + normalizedPath : cwd + '/' + normalizedPath;
    return result;
  }
  
  /**
   * Smart path completion that handles partial paths
   */
  private async getSmartPathCompletions(
    cwd: string,
    partialPath: string,
    includeFiles: boolean,
    includeFolders: boolean
  ): Promise<Suggestion[]> {
    try {
      const { readdir, stat } = await import('fs/promises');
      const { join, dirname, basename } = await import('path');
      const { existsSync } = await import('fs');
      
      let targetDir: string;
      let filterPrefix: string;
      
      if (!partialPath) {
        // No path typed yet - list current directory
        targetDir = cwd;
        filterPrefix = '';
      } else if (partialPath.endsWith('/')) {
        // Path ends with / - list contents of that directory
        targetDir = this.resolvePath(partialPath, cwd);
        filterPrefix = '';
      } else {
        // Partial path - list parent directory and filter
        const resolvedPath = this.resolvePath(partialPath, cwd);
        targetDir = dirname(resolvedPath);
        filterPrefix = basename(resolvedPath).toLowerCase();
      }
      
      // Check if target directory exists
      if (!existsSync(targetDir)) {
        return [];
      }
      
      const targetStat = await stat(targetDir).catch(() => null);
      if (!targetStat || !targetStat.isDirectory()) {
        return [];
      }
      
      const entries = await readdir(targetDir);
      const suggestions: Suggestion[] = [];
      
      for (const entry of entries) {
        // Skip hidden files unless user is typing a dot
        if (entry.startsWith('.') && !filterPrefix.startsWith('.') && !partialPath.includes('/.')) {
          continue;
        }
        
        const fullPath = join(targetDir, entry);
        const stats = await stat(fullPath).catch(() => null);
        
        if (!stats) continue;
        
        const isDir = stats.isDirectory();
        
        // Skip based on include settings
        if (isDir && !includeFolders) continue;
        if (!isDir && !includeFiles) continue;
        
        // Apply filter if there's a partial name
        if (filterPrefix && !entry.toLowerCase().startsWith(filterPrefix)) {
          continue;
        }
        
        // Determine the full suggestion value (what will be inserted)
        // Return the ACTUAL path (with real spaces) - let the shell handle escaping
        // We need to unescape the partialPath first since it may contain shell escapes
        const unescapedPartial = this.unescapePath(partialPath);
        let insertValue: string;
        if (!unescapedPartial || unescapedPartial.endsWith('/')) {
          // No partial path or ends with / - actual path prefix + entry name
          insertValue = unescapedPartial + (isDir ? entry + '/' : entry);
        } else {
          // Has partial path - replace the partial name with full name
          const pathPrefix = unescapedPartial.substring(0, unescapedPartial.lastIndexOf('/') + 1);
          insertValue = pathPrefix + (isDir ? entry + '/' : entry);
        }
        
        suggestions.push({
          name: isDir ? entry + '/' : entry,
          insertValue: insertValue,
          description: isDir ? 'Directory' : 'File',
          icon: isDir ? '📁' : '📄',
          type: isDir ? 'folder' : 'file',
          priority: isDir ? 90 : 85
        });
      }
      
      return suggestions;
    } catch {
      return [];
    }
  }
  
  /**
   * Get file path completions (legacy - kept for compatibility)
   */
  private async getFilePathCompletions(
    directory: string, 
    includeFiles: boolean, 
    includeFolders: boolean
  ): Promise<Suggestion[]> {
    try {
      const { readdir, stat } = await import('fs/promises');
      const { join } = await import('path');
      
      const entries = await readdir(directory);
      const suggestions: Suggestion[] = [];
      
      for (const entry of entries) {
        const fullPath = join(directory, entry);
        const stats = await stat(fullPath).catch(() => null);
        
        if (!stats) continue;
        
        if (stats.isDirectory() && includeFolders) {
          suggestions.push({
            name: entry + '/',
            description: 'Directory',
            type: 'folder',
            priority: 90
          });
        } else if (stats.isFile() && includeFiles) {
          suggestions.push({
            name: entry,
            description: 'File',
            type: 'file',
            priority: 85
          });
        }
      }
      
      return suggestions;
    } catch {
      return [];
    }
  }
  
  /**
   * Get completions from generators
   */
  private async getGeneratorCompletions(generator: any, context: CompletionContext): Promise<Suggestion[]> {
    const scriptKey =
      typeof generator.script === 'string'
        ? generator.script
        : generator.script
          ? generator.script.toString()
          : generator.scriptWithContext
            ? generator.scriptWithContext.toString()
            : generator.custom
              ? generator.custom.toString()
              : 'unknown';
    const tokensKey = context.tokens.join('\u0000');
    const cacheKey = `gen-${scriptKey}-${context.currentWorkingDirectory}-${tokensKey}`;
    
    // Check cache
    if (generator.cache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() < cached.expires) {
        return cached.data;
      }
    }

    const inFlight = this.inFlightGenerators.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const computePromise = (async (): Promise<Suggestion[]> => {
      try {
        let results: Suggestion[] = [];

        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);

        const executeShellCommand = async (command: string, cwd?: string) => {
          const timeout = typeof generator.timeout === 'number' ? generator.timeout : 1500;
          const maxBuffer = 1024 * 1024; // 1MB

          try {
            const { stdout, stderr } = await execAsync(command, {
              cwd: cwd || context.currentWorkingDirectory,
              timeout,
              maxBuffer,
              windowsHide: true,
            } as any);
            return { stdout: String(stdout ?? ''), stderr: String(stderr ?? ''), exitCode: 0 };
          } catch (err: any) {
            return {
              stdout: String(err?.stdout ?? ''),
              stderr: String(err?.stderr ?? err?.message ?? ''),
              exitCode: typeof err?.code === 'number' ? err.code : 1,
            };
          }
        };

        if (typeof generator.script === 'function') {
          results = await generator.script(context.tokens, executeShellCommand);
        } else if (generator.custom) {
          results = await generator.custom(context.tokens);
        } else {
          const script = typeof generator.script === 'string'
            ? generator.script
            : generator.scriptWithContext
              ? generator.scriptWithContext(context.tokens)
              : undefined;

          if (script) {
            const { stdout } = await executeShellCommand(script, context.currentWorkingDirectory);

            if (generator.postProcess) {
              results = generator.postProcess(stdout, { cwd: context.currentWorkingDirectory });
            } else {
              results = String(stdout)
                .split('\n')
                .filter(line => line.trim())
                .map(line => ({
                  name: line.trim(),
                  type: 'argument' as const,
                  priority: 75
                }));
            }
          }
        }

        // Cache results if caching is enabled
        if (generator.cache !== false) {
          const ttl = generator.cache?.ttl || 5000;
          this.cache.set(cacheKey, {
            data: results,
            expires: Date.now() + ttl
          });
        }

        return results;
      } catch {
        return [];
      } finally {
        this.inFlightGenerators.delete(cacheKey);
      }
    })();

    this.inFlightGenerators.set(cacheKey, computePromise);
    return computePromise;
  }
  
  /**
   * Calculate fuzzy match score between input and target
   * Returns -1 if no match, higher score = better match
   */
  private fuzzyMatch(input: string, target: string): number {
    const inputLower = input.toLowerCase();
    const targetLower = target.toLowerCase();
    
    // Exact match - highest score
    if (targetLower === inputLower) {
      return 10000;
    }
    
    // Prefix match - very high score
    if (targetLower.startsWith(inputLower)) {
      return 5000 + (100 - target.length); // Shorter matches score higher
    }
    
    // Word boundary match (e.g., "gc" matches "git-commit" at word boundaries)
    const wordBoundaryScore = this.wordBoundaryMatch(inputLower, targetLower);
    if (wordBoundaryScore > 0) {
      return 2000 + wordBoundaryScore;
    }
    
    // Substring match anywhere
    if (targetLower.includes(inputLower)) {
      const index = targetLower.indexOf(inputLower);
      return 1000 - index; // Earlier matches score higher
    }
    
    // Fuzzy match - characters in sequence but not necessarily consecutive
    const fuzzyScore = this.fuzzySequenceMatch(inputLower, targetLower);
    if (fuzzyScore > 0) {
      return fuzzyScore;
    }
    
    return -1; // No match
  }
  
  /**
   * Match at word boundaries (camelCase, kebab-case, snake_case)
   * e.g., "gc" matches "gitCommit", "git-commit", "git_commit"
   */
  private wordBoundaryMatch(input: string, target: string): number {
    // Extract word boundary characters
    const boundaries: number[] = [0]; // First char is always a boundary
    for (let i = 1; i < target.length; i++) {
      const prev = target[i - 1];
      const curr = target[i];
      // Boundary after separator or at camelCase transition
      if (prev === '-' || prev === '_' || prev === '.' || prev === '/') {
        boundaries.push(i);
      } else if (prev >= 'a' && prev <= 'z' && curr >= 'A' && curr <= 'Z') {
        boundaries.push(i);
      }
    }
    
    // Try to match input chars to boundary chars
    let inputIdx = 0;
    let score = 0;
    for (const boundaryIdx of boundaries) {
      if (inputIdx >= input.length) break;
      if (target[boundaryIdx].toLowerCase() === input[inputIdx]) {
        inputIdx++;
        score += 10;
      }
    }
    
    // All input chars matched at boundaries
    if (inputIdx === input.length) {
      return score;
    }
    
    return 0;
  }
  
  /**
   * Fuzzy sequence match - all input chars appear in order in target
   */
  private fuzzySequenceMatch(input: string, target: string): number {
    let inputIdx = 0;
    let lastMatchIdx = -1;
    let score = 0;
    let consecutiveBonus = 0;
    
    for (let i = 0; i < target.length && inputIdx < input.length; i++) {
      if (target[i] === input[inputIdx]) {
        // Bonus for consecutive matches
        if (lastMatchIdx === i - 1) {
          consecutiveBonus += 5;
        }
        // Bonus for matching at start
        if (i === 0) {
          score += 10;
        }
        // Penalty for gaps
        if (lastMatchIdx >= 0) {
          score -= (i - lastMatchIdx - 1);
        }
        
        lastMatchIdx = i;
        inputIdx++;
        score += 10;
      }
    }
    
    // All input characters found in sequence
    if (inputIdx === input.length) {
      return Math.max(1, score + consecutiveBonus);
    }
    
    return 0;
  }
  
  /**
   * Rank and filter suggestions based on user input with fuzzy matching
   */
  private rankAndFilter(suggestions: Suggestion[], input: string): Suggestion[] {
    if (!input) return suggestions;
    
    // Score all suggestions
    const scored = suggestions
      .map(suggestion => {
        const name = this.normalizeName(suggestion.name);
        const score = this.fuzzyMatch(input, name);
        return { suggestion, score };
      })
      .filter(({ score }) => score > 0) // Only keep matches
      .sort((a, b) => {
        // Sort by score first (higher is better)
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;
        
        // Then by priority
        const priorityDiff = (b.suggestion.priority || 0) - (a.suggestion.priority || 0);
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then alphabetically
        return a.suggestion.name.localeCompare(b.suggestion.name);
      });
    
    return scored.map(({ suggestion }) => suggestion);
  }
  
  /**
   * Determine which token the cursor is currently in
   */
  private getCurrentTokenIndex(tokens: string[], cursorPosition: number): number {
    let position = 0;
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const tokenEnd = position + token.length;
      
      if (cursorPosition >= position && cursorPosition <= tokenEnd) {
        return i;
      }
      
      position = tokenEnd + 1; // +1 for space
    }
    
    return tokens.length;
  }
  
  /**
   * Clear completion cache
   */
  clearCache() {
    this.cache.clear();
  }
  
  /**
   * Load specs (alias for initialize - for daemon compatibility)
   */
  async loadSpecs() {
    await this.initialize();
  }
  
  /**
   * Get completions with a simplified API (for daemon use)
   */
  async getCompletionsSimple(params: {
    command: string;
    tokens: string[];
    currentToken: string;
    cwd: string;
    cursorPosition: number;
  }): Promise<Array<{
    name: string;
    description?: string;
    type?: string;
    icon?: string;
    priority?: number;
  }>> {
    const context: CompletionContext = {
      currentWorkingDirectory: params.cwd,
      commandLine: params.tokens.join(' '),
      tokens: params.tokens,
      cursorPosition: params.cursorPosition,
      environmentVariables: process.env as Record<string, string>,
      shell: 'zsh',
      isGitRepository: false,
    };
    
    return this.getCompletions(context);
  }
}