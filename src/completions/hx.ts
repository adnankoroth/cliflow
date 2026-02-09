// hx completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "hx",
  description: "A post-modern text editor",
    args: {
    name: "files",
    template: "filepaths",
    isVariadic: true
  },
  options: [
    {
      name: ["-h", "--help"],
      description: "Show help"
    },
    {
      name: "--tutor",
      description: "Open the tutorial"
    },
    {
      name: "--health",
      description: "Check for errors in editor setup",
      args: {
        name: "language",
        isOptional: true
      }
    },
    {
      name: "-v",
      description: "Increases logging verbosity",
      isRepeatable: true
    },
    {
      name: ["-g", "--grammar"],
      description: "Fetch or build tree-sitter grammars",
      args: {
        name: "action",
        suggestions: [
          { name: "fetch", icon: '⚡' },
          { name: "build", icon: '⚡' }
        ]
      }
    },
    {
      name: ["-V", "--version"],
      description: "Print version information"
    }
  ]
};

export default completionSpec;
