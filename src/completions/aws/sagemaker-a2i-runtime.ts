// SAGEMAKER-A2I-RUNTIME service completions for AWS CLI
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { Subcommand } from '../../types.js';

export const sagemakera2iruntimeSubcommands: Subcommand[] = [
    {
      name: "delete-human-loop",
      description:
        "Deletes the specified human loop for a flow definition. If the human loop was deleted, this operation will return a ResourceNotFoundException",
      options: [
        {
          name: "--human-loop-name",
          description: "The name of the human loop that you want to delete",
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
      name: "describe-human-loop",
      description:
        "Returns information about the specified human loop. If the human loop was deleted, this operation will return a ResourceNotFoundException error",
      options: [
        {
          name: "--human-loop-name",
          description:
            "The name of the human loop that you want information about",
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
      name: "list-human-loops",
      description:
        "Returns information about human loops, given the specified parameters. If a human loop was deleted, it will not be included",
      options: [
        {
          name: "--creation-time-after",
          description:
            "(Optional) The timestamp of the date when you want the human loops to begin in ISO 8601 format. For example, 2020-02-24",
          args: {
            name: "timestamp",
          },
        },
        {
          name: "--creation-time-before",
          description:
            "(Optional) The timestamp of the date before which you want the human loops to begin in ISO 8601 format. For example, 2020-02-24",
          args: {
            name: "timestamp",
          },
        },
        {
          name: "--flow-definition-arn",
          description: "The Amazon Resource Name (ARN) of a flow definition",
          args: {
            name: "string",
          },
        },
        {
          name: "--sort-order",
          description:
            "Optional. The order for displaying results. Valid values: Ascending and Descending",
          args: {
            name: "string",
          },
        },
        {
          name: "--next-token",
          description: "A token to display the next page of results",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description:
            "The total number of items to return. If the total number of available items is more than the value specified in MaxResults, then a NextToken is returned in the output. You can use this token to display the next page of results",
          args: {
            name: "integer",
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
          name: "--starting-token",
          description:
            "A token to specify where to start paginating.  This is the\nNextToken from a previously truncated response.\nFor usage examples, see Pagination in the AWS Command Line Interface User\nGuide",
          args: {
            name: "string",
          },
        },
        {
          name: "--page-size",
          description:
            "The size of each page to get in the AWS service call.  This\ndoes not affect the number of items returned in the command's\noutput.  Setting a smaller page size results in more calls to\nthe AWS service, retrieving fewer items in each call.  This can\nhelp prevent the AWS service calls from timing out.\nFor usage examples, see Pagination in the AWS Command Line Interface User\nGuide",
          args: {
            name: "integer",
          },
        },
        {
          name: "--max-items",
          description:
            "The total number of items to return in the command's output.\nIf the total number of items available is more than the value\nspecified, a NextToken is provided in the command's\noutput.  To resume pagination, provide the\nNextToken value in the starting-token\nargument of a subsequent command.  Do not use the\nNextToken response element directly outside of the\nAWS CLI.\nFor usage examples, see Pagination in the AWS Command Line Interface User\nGuide",
          args: {
            name: "integer",
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
      name: "start-human-loop",
      description:
        "Starts a human loop, provided that at least one activation condition is met",
      options: [
        {
          name: "--human-loop-name",
          description: "The name of the human loop",
          args: {
            name: "string",
          },
        },
        {
          name: "--flow-definition-arn",
          description:
            "The Amazon Resource Name (ARN) of the flow definition associated with this human loop",
          args: {
            name: "string",
          },
        },
        {
          name: "--human-loop-input",
          description:
            "An object that contains information about the human loop",
          args: {
            name: "structure",
          },
        },
        {
          name: "--data-attributes",
          description:
            "Attributes of the specified data. Use DataAttributes to specify if your data is free of personally identifiable information and/or free of adult content",
          args: {
            name: "structure",
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
      name: "stop-human-loop",
      description: "Stops the specified human loop",
      options: [
        {
          name: "--human-loop-name",
          description: "The name of the human loop that you want to stop",
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