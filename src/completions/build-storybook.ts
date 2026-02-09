// build-storybook completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';


const completionSpec= {
  name: "build-storybook",
  description: "Storybook build CLI tools",
  options: [
    {
      name: ["-o", "--output-dir"],
      description: "Directory where to store built files",
      args: {
        name: "directory",
        template: "folders"
      }
    },
    {
      name: ["-w", "--watch"],
      description: "Enables watch mode"
    },
    {
      name: "--loglevel",
      description: "Controls level of logging during build",
      args: {
        name: "level",
        suggestions: [{ name: "silly" }, { name: "verbose" }, { name: "info" }, { name: "warn" }, { name: "error" }, { name: "silent" }],
        default: "info"
      }
    }
      ]
};

export default completionSpec;
