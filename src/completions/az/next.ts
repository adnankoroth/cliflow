// az next completion spec for CLIFlow
// Auto-converted from Fig.io spec

import { Subcommand, Option, Argument } from '../../types.js';

const completion = {
  name: "next",
  description: "Recommend the possible next set of commands to take",
  options: [
    {
      name: ["--command", "-c"],
      description: "Specify this parameter will only recommend commands"
    },
    {
      name: ["--scenario", "-s"],
      description: "Specify this parameter will only recommend E2E scenarios"
    }
  ]
};

export default completion;
