// elif completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "elif",
  description: "Execute if the previous condition returned 0",
  args: {
    isCommand: true
  }
};

export default completionSpec;
