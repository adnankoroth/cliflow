// sw_vers completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "sw_vers",
  description: "Print macOS version information",
  options: [
    {
      name: "-productName",
      description: "Print product name"
    },
    {
      name: "-productVersion",
      description: "Print product version"
    },
    {
      name: "-buildVersion",
      description: "Print build version"
    }
  ]
};

export default completionSpec;
