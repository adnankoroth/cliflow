// which completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';


const completionSpec= {
  name: "which",
  description: "Locate a program in the user's PATH",
  args: {
    name: "names",
    isVariadic: true,
        filterStrategy: "fuzzy",
    suggestCurrentToken: true
  },
  options: [
    {
      name: "-s",
      description:
        "No output, return 0 if all the executables are found, 1 if not"
    },
    {
      name: "-a",
      description:
        "List all instances of executables found, instead of just the first"
    }
  ]
};

export default completionSpec;
