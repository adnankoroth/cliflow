// goto completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec = {
  name: "goto",
    options: [
    {
      name: ["--help", "-h"],
      description: "Show help for goto"
    },
    {
      name: ["--register", "-r"],
      description: "Registers an alias",
      isPersistent: true,
      args: [
        {
          name: "alias"
        },
        {
          name: "target",
          template: "folders"
        }
      ]
    },
    {
      name: ["--unregister", "-u"],
      description: "Unregister an alias",
      isPersistent: true,
      args: {
        name: "alias"
                              }
    },
    {
      name: ["--push", "-p"],
      description:
        "Pushes the current directory onto the stack, then performs goto"
    },
    {
      name: ["--pop", "-o"],
      description:
        "Pops the top directory from the stack, then changes to that directory"
    },
    {
      name: ["--list", "-l"],
      description:
        "Pops the top directory from the stack, then changes to that directory"
    },
    {
      name: ["--expand", "-x"],
      description: "Expands an alias",
      args: {
        name: "alias"
              }
    },
    {
      name: ["--cleanup", "-c"],
      description: "Cleans up non existent directory aliases"
    },
    {
      name: ["--version", "-v"],
      description: "Displays the version of the goto script"
    }
  ],
  args: {
    name: "alias"
      }
};
export default completionSpec;
