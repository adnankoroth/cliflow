// clear completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "clear",
  description: "Clear the terminal screen",
  options: [
    {
      name: "-T",
      description: "Indicates the type of terminal",
      args: {
        name: "type"
      }
    },
    {
      name: "-V",
      description: "Reports version of ncurses used in this program, and exits"
    },
    {
      name: "-x",
      description:
        "Do not attempt to clear terminal's scrollback buffer using the extended E3 capability"
    }
  ]
};

export default completionSpec;
