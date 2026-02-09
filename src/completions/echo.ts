// echo completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec = {
  name: "echo",
  description: "Write arguments to the standard output",
  args: {
    name: "string",
    isVariadic: true,
    optionsCanBreakVariadicArg: false,
    suggestCurrentToken: true
      },
  options: [
    {
      name: "-n",
      description: "Do not print the trailing newline character"
    },
    {
      name: "-e",
      description: "Interpret escape sequences"
    },
    {
      name: "-E",
      description: "Disable escape sequences"
    }
  ]
};

export default completionSpec;
