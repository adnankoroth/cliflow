// pushd completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "pushd",
  description:
    "Change the current directory, and push the old current directory onto the directory stack",
  args: {
    template: "folders"
  }
};

export default completionSpec;
