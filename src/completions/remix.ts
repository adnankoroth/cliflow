// remix completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const icon = "https://remix.run/favicon-dark.1.png";

const dirArgument= {
  name: "dir",
  description: "Represent the directory of the Remix application",
  template: "folders",
  isOptional: true
};

const completionSpec= {
  name: "remix",
  description: "Remix CLI to start, build and export your application",
  options: [
    {
      name: "--help",
      description: "Output usage information"
    },
    {
      name: ["-v", "--version"],
      description: "Output the version number"
    }
  ],
  subcommands: [
    {
      name: "build",
      description: "Create an optimized production build of your application",
      icon,
      args: dirArgument,
      options: [
        {
          name: "--sourcemap",
          description: "Enables production sourcemap"
        }
      ]
    },
    {
      name: "dev",
      description: "Start the application in development mode",
      icon,
      args: dirArgument
    },
    {
      name: "setup",
      description:
        "Prepare node_modules/remix folder (after installation of packages)",
      icon,
      args: dirArgument
    },
    {
      name: "routes",
      description: "Generate the route config of the application",
      icon,
      args: dirArgument,
      options: [
        { name: "--json", description: "Print the route config as JSON" }
      ]
    }
  ]
};

export default completionSpec;
