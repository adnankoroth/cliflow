// tail completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "tail",
  description: "Display the last part of a file",
  args: {
    isVariadic: true,
    template: "filepaths"
  },
  options: [
    {
      name: "-f",
      description: "Wait for additional data to be appended"
    },
    {
      name: "-r",
      description: "Display in reverse order"
    }
  ]
};

export default completionSpec;
