// MARKETPLACE-REPORTING service completions for AWS CLI
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { Subcommand } from '../../types.js';

export const marketplacereportingSubcommands: Subcommand[] = [
    {
      name: "get-buyer-dashboard",
      description:
        "Generates an embedding URL for an Amazon QuickSight dashboard for an anonymous user.  This API is available only to Amazon Web Services Organization management accounts or delegated administrators registered for the procurement insights (procurement-insights.marketplace.amazonaws.com) feature.  The following rules apply to a generated URL:   It contains a temporary bearer token, valid for 5 minutes after it is generated. Once redeemed within that period, it cannot be re-used again.   It has a session lifetime of one hour. The 5-minute validity period runs separately from the session lifetime",
      options: [
        {
          name: "--dashboard-identifier",
          description: "The ARN of the requested dashboard",
          args: {
            name: "string",
          },
        },
        {
          name: "--embedding-domains",
          description:
            "Fully qualified domains that you add to the allow list for access to the generated URL that is then embedded. You can list up to two domains or subdomains in each API call. To include all subdomains under a specific domain, use *. For example, https://*.amazon.com includes all subdomains under https://aws.amazon.com",
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