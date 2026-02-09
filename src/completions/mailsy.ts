// mailsy completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "mailsy",
  description: "⚡️ Quickly generate a disposable email straight from terminal",
  subcommands: [
    {
      name: "g",
      description: "Generate a new email"
    },
    {
      name: "m",
      description: "Fetch messages from the inbox"
    },
    {
      name: "d",
      description: "Delete account"
    },
    {
      name: "me",
      description: "Show details of the account"
    },
    {
      name: "help",
      description: "Get help for a command",
      args: { name: "command", isOptional: true, template: "help" }
    }
  ],
  options: [
    { name: ["-v", "--version"], description: "Output the current version" },
    {
      name: ["-h", "--help"],
      description: "Display help for command",
      priority: 49,
      isPersistent: true
    }
  ]
};

export default completionSpec;
