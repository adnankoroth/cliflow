// vr completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const SCRIPT_KEYWORD = "    • ";

const completionSpec = {
  name: "vr",
  description: "The npm-style script runner for Deno",
  subcommands: [
    {
      name: "run",
      description: "Run a script",
      args: {
        name: "script"
              }
    },
    {
      name: "export",
      description: "Export one or more scripts as standalone executable files",
      args: {
        name: "script",
        isVariadic: true
              }
    },
    {
      name: "upgrade",
      description:
        "Upgrade Velociraptor to the latest version or to a specific one",
      args: {
        name: "version",
        isOptional: true
      },
      options: [
        {
          name: ["-o", "--out-dir"],
          description: "The folder where the scripts will be exported",
          args: {
            name: "dir"
          }
        }
      ]
    }
  ],

  options: [
    {
      name: ["--help", "-h"],
      description: "Show help for Velociraptor",
      isPersistent: true
    },
    {
      name: ["-V", "--version"],
      description: "Show the version number for Velociraptor"
    }
  ],

  args: {
    name: "script"
      }
};

export default completionSpec;
