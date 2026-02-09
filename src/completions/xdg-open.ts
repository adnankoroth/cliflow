// xdg-open completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "xdg-open",
  description: "Opens a file or URL in the user's preferred application",
  args: {
    name: "FILE or URL",
    template: "filepaths"
  },
  options: [
    {
      name: "--help",
      description: "Show command synopsis"
    },
    {
      name: "--manual",
      description: "Show manual page"
    },
    {
      name: "--version",
      description: "Show the xdg-utils version information"
    }
  ]
};
export default completionSpec;
