// unset completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';


const completionSpec= {
  name: "unset",
  description: "Named variable shall be undefined",
  args: {
    name: "string"
      },
  options: [
    {
      name: "-v",
      description: "Variable definition will be unset"
    }
  ]
};
export default completionSpec;
