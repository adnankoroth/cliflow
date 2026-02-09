// tailcall completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "tailcall",
  description:
    "TailCall CLI for managing and optimizing GraphQL configurations",
  subcommands: [
    {
      name: "check",
      description: "Validate a composition spec",
      args: {
        name: "FILE_PATHS",
        template: "filepaths",
        isVariadic: true
      },
      options: [
        {
          name: "--n-plus-one-queries",
          description: "Detect N+1 issues",
          isPersistent: true
        },
        {
          name: "--schema",
          description: "Display the schema of the composition spec",
          isPersistent: true
        },
        {
          name: "--format",
          description: "Change the format of the input file",
          args: {
            suggestions: [{ name: "gql" }, { name: "graphql" }, { name: "yml" }, { name: "yaml" }, { name: "json" }]
          }
        }
      ]
    },
    {
      name: "start",
      description: "Launch the GraphQL Server for the specific configuration",
      args: {
        name: "PATHS",
        template: "filepaths",
        isVariadic: true
      }
    },
    {
      name: "init",
      description: "Bootstrap a new TailCall project",
      args: {
        name: "FILE_PATH",
        template: "folders"
      }
    },
    {
      name: "gen",
      description: "Generate GraphQL configurations from various sources",
      args: {
        name: "CONFIG_FILE",
        template: "filepaths"
      }
    }
  ]
};

export default completionSpec;
