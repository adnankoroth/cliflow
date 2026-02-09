// az logout completion spec for CLIFlow
// Auto-converted from Fig.io spec

import { Subcommand, Option, Argument } from '../../types.js';

const completion = {
  name: "logout",
  description: "Log out to remove access to Azure subscriptions",
  options: [
    {
      name: "--username",
      description:
        "Account user, if missing, logout the current active account",
      args: { name: "username" }
    }
  ]
};

export default completion;
