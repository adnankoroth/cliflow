// noglob completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "noglob",
  description: "ZSH pre-command modifier that disables glob expansion",
  hidden: true,
  args: {
    isCommand: true
  }
};

export default completionSpec;
