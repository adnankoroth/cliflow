// svokit completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

// can be found at https://github.com/mavthedev/svokit.io
/*
  Svokit is a library that combines sveltekit with socket.io.
*/

const completionSpec= {
  name: "svokit",
  description: "Runs built svokit project",
  subcommands: [
    {
      name: "setup",
      description: "Creates svokit config (experimental)"
    },
    {
      name: "run",
      description: "Runs build svokit project"
    }
  ],
  options: [
    {
      name: ["--help", "-h"],
      description: "Show help for svokit"
    }
  ]
};
export default completionSpec;
