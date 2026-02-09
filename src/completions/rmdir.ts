// rmdir completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "rmdir",
  description: "Remove directories",
  args: {
    isVariadic: true,
    template: "folders"
  },

  options: [
    {
      name: "-p",
      description: "Remove each directory of path",
      isDangerous: true
    }
  ]
};

export default completionSpec;
