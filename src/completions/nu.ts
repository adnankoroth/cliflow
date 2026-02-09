// nu completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "nu",
  description: "Use the right package manage - upgrade",
  options: [
    {
      name: "-i",
      description:
        "Display the outdated packages before performing any upgrade"
    },
    {
      name: ["-h", "--help"],
      description: "Output usage information"
    }
  ]
};
export default completionSpec;
