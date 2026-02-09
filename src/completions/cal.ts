// cal completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';


const completionSpec= {
  name: "cal",
    description: "Displays a calendar and the date of Easter",
  args: {
    name: "year",
    description: "Year to print calendar of"
  },
  options: [
    {
      name: "-h",
      description: "Turns off highlighting of today"
    },
    {
      name: "-j",
      description:
        "Display Julian days (days one-based, numbered from January 1)"
    },
    {
      name: "-m",
      description:
        "Display the specified month.  If month is specified as a decimal number, it may be followed by the letter ‘f’ or ‘p’ to indicate the following or preceding month of that number, respectively",
      exclusiveOn: ["-y"],
      args: {
        name: "month"
              }
    },
    {
      name: "-y",
      description: "Display a calendar for the specified year",
      exclusiveOn: ["-m"]
    }
  ]
};
export default completionSpec;
