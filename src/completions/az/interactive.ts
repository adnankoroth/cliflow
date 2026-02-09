// az interactive completion spec for CLIFlow
// Auto-converted from Fig.io spec

import { Subcommand, Option, Argument } from '../../types.js';

const completion = {
  name: "interactive",
  description:
    "Start interactive mode. Installs the Interactive extension if not installed already",
  options: [
    {
      name: ["--style", "-s"],
      description: "The colors of the shell",
      args: {
        name: "style",
        suggestions: [{ name: "bg" }, { name: "br" }, { name: "contrast" }, { name: "default" }, { name: "grey" }, { name: "halloween" }, { name: "neon" }, { name: "none" }, { name: "pastel" }, { name: "primary" }, { name: "purple" }, { name: "quiet" }]
      }
    },
    {
      name: "--update",
      description: "Update the Interactive extension to the latest available",
      args: { name: "update" }
    }
  ]
};

export default completion;
