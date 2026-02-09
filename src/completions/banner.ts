// banner completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "banner",
  description: "Prints a large, high quality banner on the standard output",
  args: { name: "text" },
  options: [
    {
      name: "-t",
      description: "Enable trace"
    },
    {
      name: "-d",
      description: "Enable debug"
    },
    {
      name: "-w",
      description:
        "Change the output from a width of 132 to width, suitable for a narrow terminal"
    }
  ]
};

export default completionSpec;
