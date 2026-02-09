// MIGRATIONHUB-CONFIG service completions for AWS CLI
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { Subcommand } from '../../types.js';

export const migrationhubconfigSubcommands: Subcommand[] = [
    {
      name: "create-home-region-control",
      description:
        "This API sets up the home region for the calling account only",
      options: [
        {
          name: "--home-region",
          description: "The name of the home region of the calling account",
          args: {
            name: "string",
          },
        },
        {
          name: "--target",
          description:
            "The account for which this command sets up a home region control. The Target is always of type ACCOUNT",
          args: {
            name: "structure",
          },
        },
        {
          name: "--dry-run",
          description:
            "Optional Boolean flag to indicate whether any effect should take place. It tests whether the caller has permission to make the call",
        },
        {
          name: "--no-dry-run",
          description:
            "Optional Boolean flag to indicate whether any effect should take place. It tests whether the caller has permission to make the call",
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
    {
      name: "delete-home-region-control",
      description:
        "This operation deletes the home region configuration for the calling account. The operation does not delete discovery or migration tracking data in the home region",
      options: [
        {
          name: "--control-id",
          description:
            "A unique identifier that's generated for each home region control. It's always a string that begins with \"hrc-\" followed by 12 lowercase letters and numbers",
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
    {
      name: "describe-home-region-controls",
      description:
        "This API permits filtering on the ControlId and HomeRegion fields",
      options: [
        {
          name: "--control-id",
          description:
            "The ControlID is a unique identifier string of your HomeRegionControl object",
          args: {
            name: "string",
          },
        },
        {
          name: "--home-region",
          description: "The name of the home region you'd like to view",
          args: {
            name: "string",
          },
        },
        {
          name: "--target",
          description:
            "The target parameter specifies the identifier to which the home region is applied, which is always of type ACCOUNT. It applies the home region to the current ACCOUNT",
          args: {
            name: "structure",
          },
        },
        {
          name: "--max-results",
          description:
            "The maximum number of filtering results to display per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "If a NextToken was returned by a previous call, more results are available. To retrieve the next page of results, make the call again using the returned token in NextToken",
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
    {
      name: "get-home-region",
      description:
        "Returns the calling account\u2019s home region, if configured. This API is used by other AWS services to determine the regional endpoint for calling AWS Application Discovery Service and Migration Hub. You must call GetHomeRegion at least once before you call any other AWS Application Discovery Service and AWS Migration Hub APIs, to obtain the account's Migration Hub home region",
      options: [
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