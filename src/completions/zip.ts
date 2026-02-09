// zip completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "zip",
  description: "Package and compress (archive) files into zip file",
  args: [
    {
      name: "name",
      description: "Name of archive"
    },
    {
      name: "dir",
      template: "folders"
    }
  ],
  options: [
    {
      name: "-r",
      description:
        "Package and compress a directory and its contents, recursively"
    },
    {
      name: "-e"
    },
    {
      name: "-s",
      args: {
        name: "split size"
      }
    },
    {
      name: "-d",
      args: {
        name: "file",
        template: "filepaths"
      }
    },
    {
      name: "-9",
      description:
        "Archive a directory and its contents with the highest level [9] of compression"
    }
  ]
};

export default completionSpec;
