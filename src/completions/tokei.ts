// tokei completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';


const compleation= {
  name: "tokei",
  description: "Count your code, quickly",
  options: [
    {
      name: ["-f", "--files"],
      description: "Will print out statistics on individual files"
    },
    {
      name: ["-h", "--help"],
      description: "Prints help information"
    },
    {
      name: "--hidden",
      description: "Count hidden files"
    },
    {
      name: ["-l", "--languages"],
      description: "Prints out supported languages and their extensions"
    },
    {
      name: "--no-ignore",
      description: "Don't respect ignore files (.gitignore, .ignore, etc.)"
    },
    {
      name: "--no-ignore-dot",
      description:
        "Don't respect .ignore and .tokeignore files, including those in parent directories"
    },
    {
      name: "--no-ignore-parent",
      description:
        "Don't respect ignore files (.gitignore, .ignore, etc.) in parent directories"
    },
    {
      name: "--no-ignore-vcs",
      description:
        "Don't respect VCS ignore files (.gitignore, .hgignore, etc.), including those in parent directories"
    },
    {
      name: ["-V", "--version"],
      description: "Prints version information"
    },
    {
      name: ["-v", "--verbose"],
      description: "Set log output level:",
      isRepeatable: 3
    },
    {
      name: ["-c", "--columns"],
      description:
        "Sets a strict column width of the output, only available for terminal output",
      args: {
        name: "columns"
      }
    },
    {
      name: ["-e", "--exclude"],
      description: "Ignore all files & directories matching the pattern",
      isRepeatable: true,
      args: {
        name: "exclude",
        template: "filepaths"
      }
    },
    {
      name: ["-i", "--input"],
      description:
        'Gives statistics from a previous tokei run. Can be given a file path, or "stdin" to read from stdin',
      args: {
        name: "input",
        suggestions: [{ name: "stdin" }],
        template: "filepaths"
      }
    },
    {
      name: ["-o", "--output"],
      description: "Outputs Tokei in a specific format",
      args: {
        name: "output",
        suggestions: [{ name: "cbor" }, { name: "json" }, { name: "yaml" }]
      }
    },
    {
      name: ["-s", "--sort"],
      description: "Sort languages based on column",
      args: {
        name: "sort",
        suggestions: [{ name: "files" }, { name: "lines" }, { name: "blanks" }, { name: "code" }, { name: "comments" }]
      }
    },
    {
      name: ["-t", "--type"],
      description:
        "Filters output by language type, seperated by a comma. i.e. -t=Rust,Markdown",
      args: {
        name: "type"
              }
    }
  ]
};

export default compleation;
