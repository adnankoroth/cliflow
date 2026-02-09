// CLOUDTRAIL-DATA service completions for AWS CLI
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { Subcommand } from '../../types.js';

export const cloudtraildataSubcommands: Subcommand[] = [
    {
      name: "put-audit-events",
      description:
        "Ingests your application events into CloudTrail Lake. A required parameter, auditEvents, accepts the JSON records (also called payload) of events that you want CloudTrail to ingest. You can add up to 100 of these events (or up to 1 MB) per PutAuditEvents request",
      options: [
        {
          name: "--audit-events",
          description:
            "The JSON payload of events that you want to ingest. You can also point to the JSON event payload in a file",
          args: {
            name: "list",
          },
        },
        {
          name: "--channel-arn",
          description: "The ARN or ID (the ARN suffix) of a channel",
          args: {
            name: "string",
          },
        },
        {
          name: "--external-id",
          description:
            "A unique identifier that is conditionally required when the channel's resource policy includes an external ID. This value can be any string, such as a passphrase or account number",
          args: {
            name: "string",
          },
        },
        {
          name: "--cli-input-json",
          description:
            "Performs service operation based on the JSON string provided. The JSON string follows the format provided by ``--generate-cli-skeleton``. If other arguments are provided on the command line, the CLI values will override the JSON-provided values. It is not possible to pass arbitrary binary values using a JSON-provided value as the string will be taken literally",
          args: {
            name: "string",
          },
        },
        {
          name: "--generate-cli-skeleton",
          description:
            "Prints a JSON skeleton to standard output without sending an API request. If provided with no value or the value ``input``, prints a sample input JSON that can be used as an argument for ``--cli-input-json``. If provided with the value ``output``, it validates the command inputs and returns a sample output JSON for that command",
          args: {
            name: "string",
            suggestions: [{ name: "input" }, { name: "output" }],
          },
        },
      ],
    },
  ];