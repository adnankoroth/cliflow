// copypath completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "copypath",
  description:
    "Oh-My-Zsh plugin that copies the path of given directory or file to the clipboard",
  args: {
    name: "path",
    isOptional: true,
    template: "filepaths"
  }
};

export default completionSpec;
