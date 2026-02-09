// fold completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "fold",
  description: "Fold long lines for finite width output device",
    options: [
    {
      name: "-b",
      description: `Count width in bytes rather than column positions`
    },
    {
      name: "-s",
      description: `Fold line after the last blank character within the first width
column positions (or bytes)`
    },
    {
      name: "-w",
      description: `Specify a line width to use instead of the default 80 columns.
The width value should be a multiple of 8 if tabs are present,
or the tabs should be expanded using expand(1) before using
fold`,
      args: {
        name: "width",
        suggestions: [{ name: "80" }, { name: "90" }, { name: "100" }, { name: "110" }, { name: "120" }],
        default: "80"
      }
    }
  ],
  args: {
    name: "file",
    description: "File(s) to fold",
    isOptional: true,
    isVariadic: true,
    template: "filepaths"
  }
};
export default completionSpec;
