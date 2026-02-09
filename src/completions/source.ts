// source completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "source",
  description: "Source files in shell",
  args: {
    isVariadic: true,
    name: "File to source",
    template: "filepaths"
  }
};

export default completionSpec;
