// lima completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "lima",
  description: 'Lima is an alias for "limactl shell $LIMA_INSTANCE"',
  args: {
    name: "COMMAND",
    isVariadic: true,
    isOptional: true,
    isCommand: true
  },
  options: [
    {
      name: ["-h", "--help"],
      description: "Help for lima"
    }
  ]
};

export default completionSpec;
