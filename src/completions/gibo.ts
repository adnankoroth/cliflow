// gibo completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const boilerplates= {
  script: ["gibo", "list"],
  splitOn: "\n"
};

const completionSpec= {
  name: "gibo",
  description: "Easy access to gitignore boilerplates",
  subcommands: [
    {
      name: "dump",
      description: "Dump one or more boilerplates to STDOUT",
      args: {
        name: "boilerplate",
        description: "Name of the boilerplate to dump",
        generators: boilerplates,
        isVariadic: true
      }
    },
    {
      name: "search",
      description: "Search for boilerplates",
      args: {
        name: "search term",
        description: "Name of the language or framework to search for"
      }
    },
    {
      name: "root",
      description: "Show the directory where gibo stores its boilerplates"
    },
    { name: "help", description: "Show help information" },
    { name: "list", description: "Show the list of available boilerplates" },
    {
      name: "update",
      description: "Update the list of available boilerplates"
    },
    {
      name: "version",
      description: "Show the current version of gibo installed"
    }
  ],
  options: [
    {
      name: ["--help", "-h"],
      description: "Show help for gibo"
    }
  ]
};
export default completionSpec;
