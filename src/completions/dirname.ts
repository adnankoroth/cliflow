// dirname completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "dirname",
  description: "Return directory portion of pathname",
  args: {
    name: "string",
    description: "String to operate on (typically filenames)",
    isVariadic: true,
    template: "filepaths"
  }
};
export default completionSpec;
