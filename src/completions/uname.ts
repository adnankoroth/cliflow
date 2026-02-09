// uname completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "uname",
  description: "Print operating system name",
  options: [
    {
      name: "-a",
      description: "Print all available system information"
    },
    {
      name: "-m",
      description: "Print the machine hardware name"
    },
    {
      name: "-n",
      description: "Print the system hostname"
    },
    {
      name: "-p",
      description: "Print the machine processor architecture name"
    },
    {
      name: "-r",
      description: "Print the operating system release"
    },
    {
      name: "-s",
      description: "Print the operating system name"
    },
    {
      name: "-v",
      description: "Print the operating system version"
    }
  ]
};

export default completionSpec;
