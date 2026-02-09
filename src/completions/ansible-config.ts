// ansible-config completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "ansible-config",
  description: "View ansible configuration",
  subcommands: [
    {
      name: "list",
      description: "List and output available configs",
      options: [
        {
          name: ["--help", "-h"],
          description: "Show help and exit"
        },
        {
          name: "--verbose",
          description:
            "Verbose mode (-vvv for more, -vvvv to enable connection debugging)",
          exclusiveOn: ["-v"]
        },
        {
          name: "-v",
          description:
            "Verbose mode (-vvv for more, -vvvv to enable connection debugging)",
          exclusiveOn: ["--verbose"],
          isRepeatable: 4
        },
        {
          name: ["--config", "-c"],
          description:
            "Path to configuration file, defaults to first file found in precedence",
          args: {
            name: "CONFIG_FILE",
            description: "Path to configuration file",
            template: "filepaths"
          }
        },
        {
          name: ["--type", "-t"],
          description: "Filter down to a specific plugin type",
          args: {
            name: "TYPE",
            description: "Plugin type",
            suggestions: [{ name: "all" }, { name: "base" }, { name: "become" }, { name: "cache" }, { name: "callback" }, { name: "cliconf" }, { name: "connection" }, { name: "httpapi" }, { name: "inventory" }, { name: "lookup" }, { name: "netconf" }, { name: "shell" }, { name: "vars" }],
            default: "all"
          }
        }
      ],
      args: {
        name: "args",
        description:
          "Specific plugin to target, requires type of plugin to be set",
        isOptional: true,
        isVariadic: true
      }
    },
    {
      name: "dump",
      description:
        "Shows the current settings, merges ansible.cfg if specified",
      options: [
        {
          name: ["--help", "-h"],
          description: "Show help and exit"
        },
        {
          name: "--verbose",
          description:
            "Verbose mode (-vvv for more, -vvvv to enable connection debugging)",
          exclusiveOn: ["-v"]
        },
        {
          name: "-v",
          description:
            "Verbose mode (-vvv for more, -vvvv to enable connection debugging)",
          exclusiveOn: ["--verbose"],
          isRepeatable: 4
        },
        {
          name: ["--only-changed", "--changed-only"],
          description:
            "Only show configurations that have changed from the default"
        },
        {
          name: ["--config", "-c"],
          description:
            "Path to configuration file, defaults to first file found in precedence",
          args: {
            name: "CONFIG_FILE",
            description: "Path to configuration file",
            template: "filepaths"
          }
        },
        {
          name: ["--type", "-t"],
          description: "Filter down to a specific plugin type",
          args: {
            name: "TYPE",
            description: "Plugin type",
            suggestions: [{ name: "all" }, { name: "base" }, { name: "become" }, { name: "cache" }, { name: "callback" }, { name: "cliconf" }, { name: "connection" }, { name: "httpapi" }, { name: "inventory" }, { name: "lookup" }, { name: "netconf" }, { name: "shell" }, { name: "vars" }],
            default: "all"
          }
        }
      ],
      args: {
        name: "args",
        description:
          "Specific plugin to target, requires type of plugin to be set",
        isOptional: true,
        isVariadic: true
      }
    },
    {
      name: "view",
      description: "Displays the current config file",
      options: [
        {
          name: ["--help", "-h"],
          description: "Show help and exit"
        },
        {
          name: "--verbose",
          description:
            "Verbose mode (-vvv for more, -vvvv to enable connection debugging)",
          exclusiveOn: ["-v"]
        },
        {
          name: "-v",
          description:
            "Verbose mode (-vvv for more, -vvvv to enable connection debugging)",
          exclusiveOn: ["--verbose"],
          isRepeatable: 4
        },
        {
          name: ["--config", "-c"],
          description:
            "Path to configuration file, defaults to first file found in precedence",
          args: {
            name: "CONFIG_FILE",
            description: "Path to configuration file",
            template: "filepaths"
          }
        },
        {
          name: ["--type", "-t"],
          description: "Filter down to a specific plugin type",
          args: {
            name: "TYPE",
            description: "Plugin type",
            suggestions: [{ name: "all" }, { name: "base" }, { name: "become" }, { name: "cache" }, { name: "callback" }, { name: "cliconf" }, { name: "connection" }, { name: "httpapi" }, { name: "inventory" }, { name: "lookup" }, { name: "netconf" }, { name: "shell" }, { name: "vars" }],
            default: "all"
          }
        }
      ],
      args: {
        name: "args",
        description:
          "Specific plugin to target, requires type of plugin to be set",
        isOptional: true,
        isVariadic: true
      }
    },
    {
      name: "init",
      description: "Initializes a new config file (to stdout)",
      options: [
        {
          name: ["--help", "-h"],
          description: "Show help and exit"
        },
        {
          name: "--verbose",
          description:
            "Verbose mode (-vvv for more, -vvvv to enable connection debugging)",
          exclusiveOn: ["-v"]
        },
        {
          name: "-v",
          description:
            "Verbose mode (-vvv for more, -vvvv to enable connection debugging)",
          exclusiveOn: ["--verbose"],
          isRepeatable: 4
        },
        {
          name: "--disabled",
          description:
            "Prefixes all entries with a comment character to disable them"
        },
        {
          name: ["--format", "-f"],
          description: "Output format for init",
          args: {
            name: "FORMAT",
            description: "Output format",
            isOptional: true,
            suggestions: [{ name: "ini" }, { name: "env" }, { name: "vars" }],
            default: "ini"
          }
        },
        {
          name: ["--config", "-c"],
          description:
            "Path to configuration file, defaults to first file found in precedence",
          args: {
            name: "CONFIG_FILE",
            description: "Path to configuration file",
            template: "filepaths"
          }
        },
        {
          name: ["--type", "-t"],
          description: "Filter down to a specific plugin type",
          args: {
            name: "TYPE",
            description: "Plugin type",
            suggestions: [{ name: "all" }, { name: "base" }, { name: "become" }, { name: "cache" }, { name: "callback" }, { name: "cliconf" }, { name: "connection" }, { name: "httpapi" }, { name: "inventory" }, { name: "lookup" }, { name: "netconf" }, { name: "shell" }, { name: "vars" }],
            default: "all"
          }
        }
      ],
      args: {
        name: "args",
        description:
          "Specific plugin to target, requires type of plugin to be set",
        isOptional: true,
        isVariadic: true
      }
    }
  ],
  options: [
    {
      name: "--version",
      description:
        "Shows version number, config file location, module search path, module location, executable location and exit"
    },
    {
      name: ["--help", "-h"],
      description: "Show help and exit"
    }
  ]
};
export default completionSpec;
