// az upgrade completion spec for CLIFlow
// Auto-converted from Fig.io spec

import { Subcommand, Option, Argument } from '../../types.js';

const completion = {
  name: "upgrade",
  description: "Upgrade Azure CLI and extensions",
  options: [
    {
      name: "--all",
      description: "Enable updating extensions as well",
      args: { name: "all", suggestions: [{ name: "false" }, { name: "true" }] }
    },
    {
      name: ["--yes", "-y"],
      description: "Do not prompt for checking release notes"
    }
  ]
};

export default completion;
