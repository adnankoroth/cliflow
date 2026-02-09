// unzip completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "unzip",
  description: "Extract compressed files in a ZIP archive",
  args: {
    name: "file",
    template: "filepaths"
  },
  options: [
    {
      name: "-l",
      description: "List the contents of a zip file without extracting",
      args: {
        name: "file",
        template: "filepaths"
      }
    },
    {
      name: "-c",
      args: {
        name: "file",
        template: "filepaths"
      }
    },
    {
      name: "-0",
      description:
        "Extract a zip file created in windows, containing files with non-ascii (chinese) filenames",
      args: [
        {
          name: "gbk"
        },
        {
          name: "file",
          template: "filepaths"
        }
      ]
    },
    {
      name: "-d",
      args: {
        name: "destination",
        template: "folders"
      }
    }
  ]
};

export default completionSpec;
