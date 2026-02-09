// copyfile completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "copyfile",
  description:
    "Oh-My-Zsh plugin that copies the contents of a file to the clipboard",
  args: {
    name: "file",
    template: "filepaths"
  }
};

export default completionSpec;
