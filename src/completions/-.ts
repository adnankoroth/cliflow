// - completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "-",
  description:
    "ZSH pre-command modifier that prepends a '-' to the argv[0] string",
  hidden: true,
  args: {
    isCommand: true
  }
};

export default completionSpec;
