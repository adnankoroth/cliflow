// for completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "for",
  description: "Perform a set of commands multiple times",
  args: [
    {
      name: "var"
    },
    {
      suggestions: [{ name: "in" }]
    },
    {
      name: "values",
      isVariadic: true
    }
  ]
};

export default completionSpec;
