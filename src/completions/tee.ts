// tee completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "tee",
  description: "Duplicate standard input",
  options: [
    {
      name: "-a",
      description:
        "Append the output to the files rather than overwriting them"
    },
    {
      name: "-i",
      description: "Ignore the SIGINT signal"
    }
  ],
  args: {
    name: "file",
    description: "Pathname of an output file",
    isVariadic: true,
    template: "filepaths"
  }
};
export default completionSpec;
