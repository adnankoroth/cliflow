#!/usr/bin/env node
// CLIFlow Terminal UI - React-based terminal interface using Ink
// This provides the dropdown popup for completions

import React, { useState, useEffect, useCallback } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import { connect } from 'net';
import { homedir } from 'os';
import { join } from 'path';

const SOCKET_PATH = join(homedir(), '.cliflow', 'cliflow.sock');

// Types
interface Suggestion {
  name: string;
  description?: string;
  icon?: string;
  type?: string;
  priority?: number;
}

interface Props {
  commandLine: string;
  cursorPosition: number;
  cwd: string;
}

// Icon component with proper styling
const Icon: React.FC<{ icon?: string; type?: string }> = ({ icon, type }) => {
  const defaultIcons: Record<string, string> = {
    subcommand: '⚡',
    option: '🔧',
    argument: '📝',
    file: '📄',
    folder: '📁',
    branch: '🌿',
    service: '☁️',
  };
  
  const displayIcon = icon || defaultIcons[type || 'argument'] || '•';
  return <Text>{displayIcon} </Text>;
};

// Single suggestion item
const SuggestionItem: React.FC<{
  suggestion: Suggestion;
  isSelected: boolean;
  index: number;
}> = ({ suggestion, isSelected, index }) => {
  return (
    <Box>
      <Text
        backgroundColor={isSelected ? 'blue' : undefined}
        color={isSelected ? 'white' : undefined}
      >
        <Icon icon={suggestion.icon} type={suggestion.type} />
        <Text bold={isSelected}>{suggestion.name}</Text>
        {suggestion.description && (
          <Text dimColor> - {suggestion.description.slice(0, 40)}</Text>
        )}
      </Text>
    </Box>
  );
};

// Main dropdown component
const CompletionDropdown: React.FC<{
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  onCancel: () => void;
}> = ({ suggestions, onSelect, onCancel }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { exit } = useApp();
  
  const maxVisible = 10;
  const startIndex = Math.max(0, Math.min(selectedIndex - 4, suggestions.length - maxVisible));
  const visibleSuggestions = suggestions.slice(startIndex, startIndex + maxVisible);
  
  useInput((input, key) => {
    if (key.upArrow || (key.ctrl && input === 'p')) {
      setSelectedIndex(i => Math.max(0, i - 1));
    } else if (key.downArrow || (key.ctrl && input === 'n')) {
      setSelectedIndex(i => Math.min(suggestions.length - 1, i + 1));
    } else if (key.return || key.tab) {
      onSelect(suggestions[selectedIndex]);
      exit();
    } else if (key.escape || (key.ctrl && input === 'c')) {
      onCancel();
      exit();
    }
  });
  
  if (suggestions.length === 0) {
    return (
      <Box borderStyle="round" borderColor="gray" paddingX={1}>
        <Text dimColor>No completions available</Text>
      </Box>
    );
  }
  
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          CLIFlow
        </Text>
        <Text dimColor> ({suggestions.length} suggestions)</Text>
      </Box>
      
      {/* Suggestions list */}
      {visibleSuggestions.map((suggestion, index) => (
        <SuggestionItem
          key={`${suggestion.name}-${index}`}
          suggestion={suggestion}
          isSelected={startIndex + index === selectedIndex}
          index={startIndex + index}
        />
      ))}
      
      {/* Scroll indicator */}
      {suggestions.length > maxVisible && (
        <Box marginTop={1}>
          <Text dimColor>
            {startIndex > 0 ? '↑ ' : '  '}
            {selectedIndex + 1}/{suggestions.length}
            {startIndex + maxVisible < suggestions.length ? ' ↓' : '  '}
          </Text>
        </Box>
      )}
      
      {/* Help text */}
      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text dimColor>
          ↑↓ navigate • Enter/Tab select • Esc cancel
        </Text>
      </Box>
    </Box>
  );
};

// Main App component
const App: React.FC<Props> = ({ commandLine, cursorPosition, cwd }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { exit } = useApp();
  
  // Fetch completions from daemon
  useEffect(() => {
    const fetchCompletions = async () => {
      try {
        const client = connect(SOCKET_PATH);
        
        const request = JSON.stringify({
          type: 'complete',
          commandLine,
          cursorPosition,
          cwd,
          shell: 'zsh'
        }) + '\n';
        
        client.write(request);
        
        let data = '';
        client.on('data', (chunk) => {
          data += chunk.toString();
          if (data.includes('\n')) {
            const response = JSON.parse(data.trim());
            if (response.success) {
              setSuggestions(response.suggestions);
            } else {
              setError(response.error || 'Unknown error');
            }
            setLoading(false);
            client.destroy();
          }
        });
        
        client.on('error', (err) => {
          setError(`Connection failed: ${err.message}`);
          setLoading(false);
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };
    
    fetchCompletions();
  }, [commandLine, cursorPosition, cwd]);
  
  const handleSelect = useCallback((suggestion: Suggestion) => {
    // Output the selected completion to stdout for the shell to use
    console.log(JSON.stringify({ selected: suggestion.name }));
    exit();
  }, [exit]);
  
  const handleCancel = useCallback(() => {
    console.log(JSON.stringify({ cancelled: true }));
    exit();
  }, [exit]);
  
  if (loading) {
    return (
      <Box>
        <Text color="cyan">⏳ Loading completions...</Text>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box borderStyle="round" borderColor="red" paddingX={1}>
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }
  
  return (
    <CompletionDropdown
      suggestions={suggestions}
      onSelect={handleSelect}
      onCancel={handleCancel}
    />
  );
};

// CLI entry point
const args = process.argv.slice(2);
const commandLine = args[0] || '';
const cursorPosition = parseInt(args[1] || '0', 10);
const cwd = args[2] || process.cwd();

render(
  <App
    commandLine={commandLine}
    cursorPosition={cursorPosition}
    cwd={cwd}
  />
);
