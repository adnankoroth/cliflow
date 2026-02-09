// passwd completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec = {
  name: "passwd",
  description: "Modify a user's password",
  options: [
    {
      name: "-i",
      description: "Specify where the password update should be applied",
      args: {
        name: "infosystem",
        description: "The directory system",
        suggestions: ["PAM", "opendirectory", "file", "nis"]
      }
    },
    {
      name: "-l",
      description:
        "Causes the password to be updated in the given location of the chosen directory system",
      args: {
        name: "location",
        description: "The location of the chosen directory system",
        template: "filepaths"
      }
    },
    {
      name: "-u",
      description:
        "Specify the user name to use when authenticating to the directory node",
      args: {
        name: "authname",
        description: "The user name"
              }
    }
  ]
};

export default completionSpec;
