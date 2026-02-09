// dotslash completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "dotslash",
  args: {
    // This was previously just "filepaths", however, we added folders so
    // users of ohmyzsh could cd into a folder by typing the folder name without `cd`
    template: "filepaths"
  }
};

export default completionSpec;
