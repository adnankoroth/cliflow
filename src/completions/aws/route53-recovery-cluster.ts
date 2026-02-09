// ROUTE53-RECOVERY-CLUSTER service completions for AWS CLI
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { Subcommand } from '../../types.js';

export const route53recoveryclusterSubcommands: Subcommand[] = [
    {
      name: "get-routing-control-state",
      description:
        "Get the state for a routing control. A routing control is a simple on/off switch that you can use to route traffic to cells. When a routing control state is set to ON, traffic flows to a cell. When the state is set to OFF, traffic does not flow.  Before you can create a routing control, you must first create a cluster, and then host the control in a control panel on the cluster. For more information, see  Create routing control structures in the Amazon Route 53 Application Recovery Controller Developer Guide. You access one of the endpoints for the cluster to get or update the routing control state to redirect traffic for your application.   You must specify Regional endpoints when you work with API cluster operations to get or update routing control states in Route 53 ARC.  To see a code example for getting a routing control state, including accessing Regional cluster endpoints in sequence, see API examples in the Amazon Route 53 Application Recovery Controller Developer Guide. Learn more about working with routing controls in the following topics in the Amazon Route 53 Application Recovery Controller Developer Guide:     Viewing and updating routing control states     Working with routing controls in Route 53 ARC",
      options: [
        {
          name: "--routing-control-arn",
          description:
            "The Amazon Resource Name (ARN) for the routing control that you want to get the state for",
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
      name: "list-routing-controls",
      description:
        "List routing control names and Amazon Resource Names (ARNs), as well as the routing control state for each routing control, along with the control panel name and control panel ARN for the routing controls. If you specify a control panel ARN, this call lists the routing controls in the control panel. Otherwise, it lists all the routing controls in the cluster. A routing control is a simple on/off switch in Route 53 ARC that you can use to route traffic to cells. When a routing control state is set to ON, traffic flows to a cell. When the state is set to OFF, traffic does not flow. Before you can create a routing control, you must first create a cluster, and then host the control in a control panel on the cluster. For more information, see  Create routing control structures in the Amazon Route 53 Application Recovery Controller Developer Guide. You access one of the endpoints for the cluster to get or update the routing control state to redirect traffic for your application.   You must specify Regional endpoints when you work with API cluster operations to use this API operation to list routing controls in Route 53 ARC.  Learn more about working with routing controls in the following topics in the Amazon Route 53 Application Recovery Controller Developer Guide:     Viewing and updating routing control states     Working with routing controls in Route 53 ARC",
      options: [
        {
          name: "--control-panel-arn",
          description:
            "The Amazon Resource Name (ARN) of the control panel of the routing controls to list",
          args: {
            name: "string",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. You receive this token from a previous call",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description:
            "The number of routing controls objects that you want to return with this call. The default value is 500",
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
      name: "update-routing-control-state",
      description:
        'Set the state of the routing control to reroute traffic. You can set the value to ON or OFF. When the state is ON, traffic flows to a cell. When the state is OFF, traffic does not flow. With Route 53 ARC, you can add safety rules for routing controls, which are safeguards for routing control state updates that help prevent unexpected outcomes, like fail open traffic routing. However, there are scenarios when you might want to bypass the routing control safeguards that are enforced with safety rules that you\'ve configured. For example, you might want to fail over quickly for disaster recovery, and one or more safety rules might be unexpectedly preventing you from updating a routing control state to reroute traffic. In a "break glass" scenario like this, you can override one or more safety rules to change a routing control state and fail over your application. The SafetyRulesToOverride property enables you override one or more safety rules and update routing control states. For more information, see  Override safety rules to reroute traffic in the Amazon Route 53 Application Recovery Controller Developer Guide.  You must specify Regional endpoints when you work with API cluster operations to get or update routing control states in Route 53 ARC.  To see a code example for getting a routing control state, including accessing Regional cluster endpoints in sequence, see API examples in the Amazon Route 53 Application Recovery Controller Developer Guide.     Viewing and updating routing control states     Working with routing controls overall',
      options: [
        {
          name: "--routing-control-arn",
          description:
            "The Amazon Resource Name (ARN) for the routing control that you want to update the state for",
          args: {
            name: "string",
          },
        },
        {
          name: "--routing-control-state",
          description:
            "The state of the routing control. You can set the value to ON or OFF",
          args: {
            name: "string",
          },
        },
        {
          name: "--safety-rules-to-override",
          description:
            "The Amazon Resource Names (ARNs) for the safety rules that you want to override when you're updating the state of a routing control. You can override one safety rule or multiple safety rules by including one or more ARNs, separated by commas. For more information, see  Override safety rules to reroute traffic in the Amazon Route 53 Application Recovery Controller Developer Guide",
          args: {
            name: "list",
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
      name: "update-routing-control-states",
      description:
        "Set multiple routing control states. You can set the value for each state to be ON or OFF. When the state is ON, traffic flows to a cell. When it's OFF, traffic does not flow. With Route 53 ARC, you can add safety rules for routing controls, which are safeguards for routing control state updates that help prevent unexpected outcomes, like fail open traffic routing. However, there are scenarios when you might want to bypass the routing control safeguards that are enforced with safety rules that you've configured. For example, you might want to fail over quickly for disaster recovery, and one or more safety rules might be unexpectedly preventing you from updating a routing control state to reroute traffic. In a \"break glass\" scenario like this, you can override one or more safety rules to change a routing control state and fail over your application. The SafetyRulesToOverride property enables you override one or more safety rules and update routing control states. For more information, see  Override safety rules to reroute traffic in the Amazon Route 53 Application Recovery Controller Developer Guide.  You must specify Regional endpoints when you work with API cluster operations to get or update routing control states in Route 53 ARC.  To see a code example for getting a routing control state, including accessing Regional cluster endpoints in sequence, see API examples in the Amazon Route 53 Application Recovery Controller Developer Guide.     Viewing and updating routing control states     Working with routing controls overall",
      options: [
        {
          name: "--update-routing-control-state-entries",
          description:
            "A set of routing control entries that you want to update",
          args: {
            name: "list",
          },
        },
        {
          name: "--safety-rules-to-override",
          description:
            "The Amazon Resource Names (ARNs) for the safety rules that you want to override when you're updating routing control states. You can override one safety rule or multiple safety rules by including one or more ARNs, separated by commas. For more information, see  Override safety rules to reroute traffic in the Amazon Route 53 Application Recovery Controller Developer Guide",
          args: {
            name: "list",
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