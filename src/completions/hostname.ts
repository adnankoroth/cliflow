// hostname completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "hostname",
  description: "Set or print name of current host system",
  options: [
    {
      name: "-f",
      description: "Include domain information in the printed name"
    },
    {
      name: "-s",
      description: "Trim off any domain information from the printed name"
    },
    {
      name: "-d",
      description: "Only print domain information"
    }
  ],
  args: {
    name: "hostname",
    description: "The hostname to use for this machine"
  }
};
export default completionSpec;
