// nr completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';


const completionSpec= {
  name: "nr",
  description: "Use the right package manager - run",
  options: [
    {
      name: ["-h", "--help"],
      description: "Output usage information"
    }
  ],
  args: {
    name: "script",
    description: "The script to run",
    filterStrategy: "fuzzy"
      },
  additionalSuggestions: [
    {
      name: "-",
      // Run the suggestion directory on insert
      // eslint-disable-next-line @withfig/fig-linter/no-useless-insertvalue
      insertValue: "-\n",
      description: "Run the last command",
      type: "shortcut"
    }
  ]
};
export default completionSpec;
