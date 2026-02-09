// git-profile completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

// https://github.com/dotzero/git-profile
const completionSpec = {
  name: "git-profile",
  description: "Switch profiles",
  subcommands: [
    {
      name: "use",
      description: "Use a profile",
      args: {
        name: "profile",
        description: "Profile you want to apply in this repository"
              }
    }
  ],
  options: [
    {
      name: ["--help", "-h"],
      description: "Help for git-profile script"
    },
    {
      name: ["--config", "-c"],
      description: 'Config file (default "~/.gitprofile")'
    }
  ]
};

export default completionSpec;
