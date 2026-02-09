// create-remix completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "create-remix",
  icon: "https://remix.run/favicon-light.1.png",
  options: [
    {
      name: ["-h", "--help"],
      description: "Display help for command"
    },
    {
      name: ["-v", "--version"],
      description: "Display version for command"
    }
  ]
};

export default completionSpec;
