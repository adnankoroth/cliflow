
import { describe, it, expect, beforeEach } from 'vitest';
import { CompletionEngine } from '../src/engine/completion-engine';
import { CompletionContext } from '../src/types';

describe('CompletionEngine', () => {
    let engine: CompletionEngine;

    beforeEach(() => {
        engine = new CompletionEngine();
    });

    it('should initialize with correct spec count', async () => {
        await engine.initialize();
        const count = engine.getSpecCount();
        expect(count.builtin).toBeGreaterThan(0);
    });

    it('should lazy load built-in spec (git)', async () => {
        // Access private property for testing
        const specsMap = (engine as any).specs;
        expect(specsMap.has('git')).toBe(false);

        const context: CompletionContext = {
            commandLine: 'git ',
            cursorPosition: 4,
            currentWorkingDirectory: '/tmp',
            tokens: ['git', ''],
            environmentVariables: {},
            shell: 'zsh',
            isGitRepository: false
        };

        const suggestions = await engine.getCompletions(context);

        // Spec should now be loaded
        expect(specsMap.has('git')).toBe(true);

        // Should return suggestions
        expect(suggestions.length).toBeGreaterThan(0);
        expect(suggestions.some(s => s.name === 'commit')).toBe(true);
        expect(suggestions.some(s => s.name === 'checkout')).toBe(true);
    });

    it('should return nothing for unknown command', async () => {
        const context: CompletionContext = {
            commandLine: 'unknown-cmd ',
            cursorPosition: 12,
            currentWorkingDirectory: '/tmp',
            tokens: ['unknown-cmd', ''],
            environmentVariables: {},
            shell: 'zsh',
            isGitRepository: false
        };

        const suggestions = await engine.getCompletions(context);
        expect(suggestions.length).toBe(0);
    });

    it('should list available commands including unloaded built-ins', async () => {
        await engine.initialize();

        // Create empty context (should return list of all commands)
        const context: CompletionContext = {
            commandLine: '',
            cursorPosition: 0,
            currentWorkingDirectory: '/tmp',
            tokens: [],
            environmentVariables: {},
            shell: 'zsh',
            isGitRepository: false
        };

        const suggestions = await engine.getCompletions(context);

        expect(suggestions.some(s => s.name === 'git')).toBe(true);
        expect(suggestions.some(s => s.name === 'docker')).toBe(true);
        // Even if not loaded
        expect((engine as any).specs.has('docker')).toBe(false);
    });
});
