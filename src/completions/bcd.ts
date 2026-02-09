// bcd completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completion= {
  name: "bcd",
  description: "Bookmark directories and move to them",
  options: [
    {
      name: ["-s", "--store"],
      description: "Store the current directory as a bookmark",
      isRepeatable: true,
      args: {
        name: "store",
        isOptional: true
      }
    },
    {
      name: ["-r", "--remove"],
      description: "Remove a specified bookmark",
      isRepeatable: true,
      args: {
        name: "remove",
        isOptional: true
      }
    },
    {
      name: ["-i", "--install"],
      description: "Setup the shell init script"
    },
    {
      name: ["-l", "--list"],
      description: "List the stored bookmarks"
    },
    {
      name: ["-V", "--version"],
      description: "Print version information"
    },
    {
      name: ["-h", "--help"],
      description: "Print help information"
    }
  ],
  args: {
    name: "bookmark",
    isOptional: true
  }
};

export default completion;
