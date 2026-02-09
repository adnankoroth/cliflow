// HISTORY service completions for AWS CLI
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { Subcommand } from '../../types.js';

export const historySubcommands: Subcommand[] = [
    {
      name: "show",
      description:
        "Shows the various events related to running a specific CLI command. If this command is ran without any positional arguments, it will display the events for the last CLI command ran",
      options: [
        {
          name: "--include",
          description:
            "Specifies which events to **only** include when showing the CLI command. This argument is mutually exclusive with ``--exclude``",
          args: {
            name: "string",
            isVariadic: true,
          },
        },
        {
          name: "--exclude",
          description:
            "Specifies which events to exclude when showing the CLI command. This argument is mutually exclusive with ``--include``",
          args: {
            name: "string",
            isVariadic: true,
          },
        },
        {
          name: "--format",
          description:
            "Specifies which format to use in showing the events for the specified CLI command. The following formats are supported:\n\n detailed - This the default format. It prints out a detailed overview of the CLI command ran. It displays all of the key events in the command lifecycle where each important event has a title and its important values underneath. The events are ordered by timestamp and events of the same API call are associated together with the [``api_id``] notation where events that share the same ``api_id`` belong to the lifecycle of the same API call",
          args: {
            name: "string",
            suggestions: [{ name: "detailed" }],
          },
        },
      ],
      args: {
        name: "command_id",
        description:
          "The ID of the CLI command to show. If this positional argument is omitted, it will show the last the CLI command ran",
      },
    },
    {
      name: "list",
      description:
        "Shows a list of previously run commands and their command_ids. Each row shows only a bare minimum of details including the command_id, date, arguments and return code. You can use the ``history show`` with the command_id to see more details about a particular entry",
    },
  ];