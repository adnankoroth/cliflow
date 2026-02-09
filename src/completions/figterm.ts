// figterm completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "figterm",
  description: "Fig's terminal layer",
  options: [
    {
      name: ["--help", "-h"],
      description: "Print help information"
    },
    {
      name: ["--version", "-V"],
      description: "Print version information"
    }
  ]
};

export default completionSpec;
