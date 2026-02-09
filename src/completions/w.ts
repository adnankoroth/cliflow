// w completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "w",
  description: "Display who is logged in and what they are doing",
    options: [
    {
      name: "-h",
      description: "Suppress the heading"
    },
    {
      name: "-i",
      description: "Output is sorted by idle time"
    }
  ],
  args: {
    name: "user",
    isVariadic: true,
    isOptional: true
  }
};
export default completionSpec;
