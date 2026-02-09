// zoxide completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completion= {
  name: "zoxide",
  description: "A smarter cd command for your terminal",
  subcommands: [
    {
      name: "add",
      description: "Add a new directory or increment its rank",
      options: [
        {
          name: ["-h", "--help"],
          description: "Print help information"
        },
        {
          name: ["-V", "--version"],
          description: "Print version information"
        }
      ],
      args: {
        name: "paths",
        isVariadic: true,
        template: "folders"
      }
    },
    {
      name: "import",
      description: "Import entries from another application",
      options: [
        {
          name: "--from",
          description: "Application to import from",
          args: {
            name: "from",
            suggestions: [{ name: "autojump" }, { name: "z" }]
          }
        },
        {
          name: "--merge",
          description: "Merge into existing database"
        },
        {
          name: ["-h", "--help"],
          description: "Print help information"
        },
        {
          name: ["-V", "--version"],
          description: "Print version information"
        }
      ],
      args: {
        name: "path",
        template: "filepaths"
      }
    },
    {
      name: "init",
      description: "Generate shell configuration",
      options: [
        {
          name: "--cmd",
          description: "Changes the prefix of the `z` and `zi` commands",
          args: {
            name: "cmd",
            isOptional: true
          }
        },
        {
          name: "--hook",
          description:
            "Changes how often zoxide increments a directory's score",
          args: {
            name: "hook",
            isOptional: true,
            suggestions: [{ name: "none" }, { name: "prompt" }, { name: "pwd" }]
          }
        },
        {
          name: "--no-cmd",
          description:
            "Prevents zoxide from defining the `z` and `zi` commands"
        },
        {
          name: ["-h", "--help"],
          description: "Print help information"
        },
        {
          name: ["-V", "--version"],
          description: "Print version information"
        }
      ],
      args: {
        name: "shell",
        suggestions: [{ name: "bash" }, { name: "elvish" }, { name: "fish" }, { name: "nushell" }, { name: "posix" }, { name: "powershell" }, { name: "xonsh" }, { name: "zsh" }]
      }
    },
    {
      name: "query",
      description: "Search for a directory in the database",
      options: [
        {
          name: "--exclude",
          description: "Exclude a path from results",
          args: {
            name: "exclude",
            isOptional: true,
            template: "folders"
          }
        },
        {
          name: "--all",
          description: "Show deleted directories"
        },
        {
          name: ["-i", "--interactive"],
          description: "Use interactive selection",
          exclusiveOn: ["-l", "--list"]
        },
        {
          name: ["-l", "--list"],
          description: "List all matching directories",
          exclusiveOn: ["-i", "--interactive"]
        },
        {
          name: ["-s", "--score"],
          description: "Print score with results"
        },
        {
          name: ["-h", "--help"],
          description: "Print help information"
        },
        {
          name: ["-V", "--version"],
          description: "Print version information"
        }
      ],
      args: {
        name: "keywords",
        isOptional: true
      }
    },
    {
      name: "remove",
      description: "Remove a directory from the database",
      options: [
        {
          name: ["-i", "--interactive"],
          description: "Use interactive selection"
        },
        {
          name: ["-h", "--help"],
          description: "Print help information"
        },
        {
          name: ["-V", "--version"],
          description: "Print version information"
        }
      ],
      args: {
        name: "paths",
        isOptional: true,
        template: "folders"
      }
    }
  ],
  options: [
    {
      name: ["-h", "--help"],
      description: "Print help information"
    },
    {
      name: ["-V", "--version"],
      description: "Print version information"
    }
  ]
};

export default completion;
