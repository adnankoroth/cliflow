// mv completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "mv",
  description: "Move & rename files and folders",
  args: [
    {
      name: "source",
      isVariadic: true,
      template: "filepaths"
    },
    {
      name: "target",
      template: "filepaths"
    }
  ],
  options: [
    {
      name: "-f",
      description:
        "Do not prompt for confirmation before overwriting the destination path",
      exclusiveOn: ["-i", "-n"]
    },
    {
      name: "-i",
      description:
        "Cause mv to write a prompt to standard error before moving a file that would overwrite an existing file",
      exclusiveOn: ["-f", "-n"]
    },
    {
      name: "-n",
      description: "Do not overwrite existing file",
      exclusiveOn: ["-f", "-i"]
    },
    {
      name: "-v",
      description: "Cause mv to be verbose, showing files after they are moved"
    }
  ]
};

export default completionSpec;
