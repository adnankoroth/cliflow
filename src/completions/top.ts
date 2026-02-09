// top completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "top",
  description: "Display Linux tasks",
  options: [
    {
      name: ["-h", "-v"],
      description: "Show library version and usage prompt"
    },
    {
      name: "-b",
      description: "Starts top in Batch mode",
      args: {
        name: "operation"
      }
    },
    {
      name: "-c",
      description: "Starts top with last remembered c state reversed",
      args: {
        name: "toggle"
      }
    },
    {
      name: "-i",
      description:
        "Starts top with the last remembered 'i' state reversed. When this toggle is Off, tasks that are idled or zombied will not be displayed",
      args: {
        name: "toggle"
      }
    },
    {
      name: "-s",
      description: "Starts top with secure mode forced",
      args: {
        name: "delay"
      }
    },
    {
      name: "-pid",
      description: "Monitor pids",
      args: {
        name: "process ids",
        isVariadic: true
      }
    }
  ]
};

export default completionSpec;
