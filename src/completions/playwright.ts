// playwright completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const helpOption = {
  name: ["--help", "-h"],
  description: "Display help for command",
  priority: 1
};

const completionSpec = {
  name: "playwright",
  description: "",
  subcommands: [
    {
      name: "test",
      description: "Run tests with Playwright Test",
      args: {
        name: "tests",
        description: "Test files to run",
        isOptional: true,
        isVariadic: true,
        template: "filepaths"
      },
      options: [
        {
          name: "-g",
          description: "Run the test with the title",
          args: {
            name: "title"
          }
        },
        {
          name: "--headed",
          description: "Run tests in headed browsers"
        },
        helpOption
      ]
    },
    {
      name: "install",
      description: "Running without arguments will install default browsers",
      args: {
        name: "browsers",
        description: "Browser to install",
        isOptional: true,
        isVariadic: true
              },
      options: [
        {
          name: "--with-deps",
          description: "Install system dependencies for browsers"
        },
        helpOption
      ]
    }
  ],
  options: [
    {
      name: ["--version", "-V"],
      description: "Output the version number"
    },
    helpOption
  ]
};
export default completionSpec;
