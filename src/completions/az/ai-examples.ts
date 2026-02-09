// az ai-examples completion spec for CLIFlow
// Auto-converted from Fig.io spec

import { Subcommand, Option, Argument } from '../../types.js';

const completion = {
  name: "ai-examples",
  description: "Add AI powered examples to help content",
  subcommands: [
    {
      name: "check-connection",
      description: "Check if the client can connect to the AI example service"
    }
  ]
};

export default completion;
