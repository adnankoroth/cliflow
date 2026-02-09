// repeat completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "repeat",
  description:
    "Interpret the result as a number and repeat the commands this many times",
  args: {
    isCommand: true
  }
};

export default completionSpec;
