// pwd completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "pwd",
  description: "Return working directory name",
  options: [
    {
      name: "-L",
      description: "Display the logical current working directory"
    },
    {
      name: "-P",
      description: "Display the physical current working directory"
    }
  ]
};

export default completionSpec;
