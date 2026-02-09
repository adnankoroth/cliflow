// vi completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "vi",
  description:
    "Vi[m] is an one of two powerhouse text editors in the Unix world, the other being EMACS",
  args: {
    template: "filepaths"
  },
  options: [
    {
      name: ["-h", "--help"],
      description: "Print help message for vi and exit"
    }
  ]
};

export default completionSpec;
