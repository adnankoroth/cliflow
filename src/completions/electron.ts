// electron completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "electron",
  description:
    "Build cross platform desktop apps with JavaScript, HTML and CSS",
  args: {
    name: "path",
    description: "A path to an electron app",
    template: "filepaths"
  },
  options: [
    {
      name: ["-i", "--interactive"],
      description: "Open a REPL to the main process"
    },
    {
      name: ["-r", "--require"],
      description: "Module to preload",
      args: {
        name: "module",
        template: "filepaths"
      }
    },
    {
      name: ["-v", "--version"],
      description: "Print the version"
    },
    {
      name: ["-a", "--abi"],
      description: "Print the Node ABI version"
    }
  ]
};

export default completionSpec;
