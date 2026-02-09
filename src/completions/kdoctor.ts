// kdoctor completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "kdoctor",
  description:
    "Tool that helps to set up the environment for Kotlin Multiplatform Mobile app development",
  options: [
    {
      name: "--version",
      description: "Report a version of KDoctor"
    },
    {
      name: ["--verbose", "-v"],
      description: "Report an extended information"
    },
    {
      name: ["--all", "-a"],
      description: "Run extra diagnostics"
    },
    {
      name: "--team-ids",
      description: "Report all available Apple dev team ids"
    },
    {
      name: ["--help", "-h"],
      description: "Usage info"
    }
  ]
};
export default completionSpec;
