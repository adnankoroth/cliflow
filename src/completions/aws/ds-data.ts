// DS-DATA service completions for AWS CLI
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { Subcommand } from '../../types.js';

export const dsdataSubcommands: Subcommand[] = [
    {
      name: "add-group-member",
      description:
        "Adds an existing user, group, or computer as a group member",
      options: [
        {
          name: "--client-token",
          description:
            "A unique and case-sensitive identifier that you provide to make sure the idempotency of the request, so multiple identical calls have the same effect as one single call.   A client token is valid for 8 hours after the first request that uses it completes. After 8 hours, any request with the same client token is treated as a new request. If the request succeeds, any future uses of that token will be idempotent for another 8 hours.   If you submit a request with the same client token but change one of the other parameters within the 8-hour idempotency window, Directory Service Data returns an ConflictException.    This parameter is optional when using the CLI or SDK",
          args: {
            name: "string",
          },
        },
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--group-name",
          description: "The name of the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--member-name",
          description:
            "The SAMAccountName of the user, group, or computer to add as a group member",
          args: {
            name: "string",
          },
        },
        {
          name: "--member-realm",
          description:
            "The domain name that's associated with the group member. This parameter is required only when adding a member outside of your Managed Microsoft AD domain to a group inside of your Managed Microsoft AD domain. This parameter defaults to the Managed Microsoft AD domain.    This parameter is case insensitive",
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
      name: "create-group",
      description: "Creates a new group",
      options: [
        {
          name: "--client-token",
          description:
            "A unique and case-sensitive identifier that you provide to make sure the idempotency of the request, so multiple identical calls have the same effect as one single call.   A client token is valid for 8 hours after the first request that uses it completes. After 8 hours, any request with the same client token is treated as a new request. If the request succeeds, any future uses of that token will be idempotent for another 8 hours.   If you submit a request with the same client token but change one of the other parameters within the 8-hour idempotency window, Directory Service Data returns an ConflictException.    This parameter is optional when using the CLI or SDK",
          args: {
            name: "string",
          },
        },
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--group-scope",
          description:
            "The scope of the AD group. For details, see Active Directory security group scope",
          args: {
            name: "string",
          },
        },
        {
          name: "--group-type",
          description:
            "The AD group type. For details, see Active Directory security group type",
          args: {
            name: "string",
          },
        },
        {
          name: "--other-attributes",
          description:
            "An expression that defines one or more attributes with the data type and value of each attribute",
          args: {
            name: "map",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the group",
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
      name: "create-user",
      description: "Creates a new user",
      options: [
        {
          name: "--client-token",
          description:
            "A unique and case-sensitive identifier that you provide to make sure the idempotency of the request, so multiple identical calls have the same effect as one single call.   A client token is valid for 8 hours after the first request that uses it completes. After 8 hours, any request with the same client token is treated as a new request. If the request succeeds, any future uses of that token will be idempotent for another 8 hours.   If you submit a request with the same client token but change one of the other parameters within the 8-hour idempotency window, Directory Service Data returns an ConflictException.    This parameter is optional when using the CLI or SDK",
          args: {
            name: "string",
          },
        },
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that\u2019s associated with the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--email-address",
          description: "The email address of the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--given-name",
          description: "The first name of the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--other-attributes",
          description:
            "An expression that defines one or more attribute names with the data type and value of each attribute. A key is an attribute name, and the value is a list of maps. For a list of supported attributes, see Directory Service Data Attributes.    Attribute names are case insensitive",
          args: {
            name: "map",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--surname",
          description: "The last name of the user",
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
      name: "delete-group",
      description: "Deletes a group",
      options: [
        {
          name: "--client-token",
          description:
            "A unique and case-sensitive identifier that you provide to make sure the idempotency of the request, so multiple identical calls have the same effect as one single call.   A client token is valid for 8 hours after the first request that uses it completes. After 8 hours, any request with the same client token is treated as a new request. If the request succeeds, any future uses of that token will be idempotent for another 8 hours.   If you submit a request with the same client token but change one of the other parameters within the 8-hour idempotency window, Directory Service Data returns an ConflictException.    This parameter is optional when using the CLI or SDK",
          args: {
            name: "string",
          },
        },
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the group",
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
      name: "delete-user",
      description: "Deletes a user",
      options: [
        {
          name: "--client-token",
          description:
            "A unique and case-sensitive identifier that you provide to make sure the idempotency of the request, so multiple identical calls have the same effect as one single call.   A client token is valid for 8 hours after the first request that uses it completes. After 8 hours, any request with the same client token is treated as a new request. If the request succeeds, any future uses of that token will be idempotent for another 8 hours.   If you submit a request with the same client token but change one of the other parameters within the 8-hour idempotency window, Directory Service Data returns an ConflictException.    This parameter is optional when using the CLI or SDK",
          args: {
            name: "string",
          },
        },
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the user",
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
      name: "describe-group",
      description: "Returns information about a specific group",
      options: [
        {
          name: "--directory-id",
          description:
            "The Identifier (ID) of the directory associated with the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--other-attributes",
          description:
            "One or more attributes to be returned for the group. For a list of supported attributes, see Directory Service Data Attributes",
          args: {
            name: "list",
          },
        },
        {
          name: "--realm",
          description:
            "The domain name that's associated with the group.    This parameter is optional, so you can return groups outside of your Managed Microsoft AD domain. When no value is defined, only your Managed Microsoft AD groups are returned.   This value is case insensitive",
          args: {
            name: "string",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the group",
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
      name: "describe-user",
      description: "Returns information about a specific user",
      options: [
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--other-attributes",
          description:
            "One or more attribute names to be returned for the user. A key is an attribute name, and the value is a list of maps. For a list of supported attributes, see Directory Service Data Attributes",
          args: {
            name: "list",
          },
        },
        {
          name: "--realm",
          description:
            "The domain name that's associated with the user.    This parameter is optional, so you can return users outside your Managed Microsoft AD domain. When no value is defined, only your Managed Microsoft AD users are returned.   This value is case insensitive",
          args: {
            name: "string",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the user",
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
      name: "disable-user",
      description:
        "Deactivates an active user account. For information about how to enable an inactive user account, see ResetUserPassword in the Directory Service API Reference",
      options: [
        {
          name: "--client-token",
          description:
            "A unique and case-sensitive identifier that you provide to make sure the idempotency of the request, so multiple identical calls have the same effect as one single call.   A client token is valid for 8 hours after the first request that uses it completes. After 8 hours, any request with the same client token is treated as a new request. If the request succeeds, any future uses of that token will be idempotent for another 8 hours.   If you submit a request with the same client token but change one of the other parameters within the 8-hour idempotency window, Directory Service Data returns an ConflictException.    This parameter is optional when using the CLI or SDK",
          args: {
            name: "string",
          },
        },
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the user",
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
      name: "list-group-members",
      description:
        "Returns member information for the specified group.   This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the ListGroupMembers.NextToken member contains a token that you pass in the next call to ListGroupMembers. This retrieves the next set of items.   You can also specify a maximum number of return results with the MaxResults parameter",
      options: [
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description:
            "The maximum number of results to be returned per request",
          args: {
            name: "integer",
          },
        },
        {
          name: "--member-realm",
          description:
            "The domain name that's associated with the group member. This parameter defaults to the Managed Microsoft AD domain.    This parameter is optional and case insensitive",
          args: {
            name: "string",
          },
        },
        {
          name: "--next-token",
          description:
            "An encoded paging token for paginated calls that can be passed back to retrieve the next page",
          args: {
            name: "string",
          },
        },
        {
          name: "--realm",
          description:
            "The domain name that's associated with the group.    This parameter is optional, so you can return members from a group outside of your Managed Microsoft AD domain. When no value is defined, only members of your Managed Microsoft AD groups are returned.   This value is case insensitive",
          args: {
            name: "string",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the group",
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
      name: "list-groups",
      description:
        "Returns group information for the specified directory.   This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the ListGroups.NextToken member contains a token that you pass in the next call to ListGroups. This retrieves the next set of items.   You can also specify a maximum number of return results with the MaxResults parameter",
      options: [
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description:
            "The maximum number of results to be returned per request",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "An encoded paging token for paginated calls that can be passed back to retrieve the next page",
          args: {
            name: "string",
          },
        },
        {
          name: "--realm",
          description:
            "The domain name associated with the directory.    This parameter is optional, so you can return groups outside of your Managed Microsoft AD domain. When no value is defined, only your Managed Microsoft AD groups are returned.   This value is case insensitive",
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
      name: "list-groups-for-member",
      description:
        "Returns group information for the specified member.   This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the ListGroupsForMember.NextToken member contains a token that you pass in the next call to ListGroupsForMember. This retrieves the next set of items.   You can also specify a maximum number of return results with the MaxResults parameter",
      options: [
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the member",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description:
            "The maximum number of results to be returned per request",
          args: {
            name: "integer",
          },
        },
        {
          name: "--member-realm",
          description:
            "The domain name that's associated with the group member.    This parameter is optional, so you can limit your results to the group members in a specific domain.   This parameter is case insensitive and defaults to Realm",
          args: {
            name: "string",
          },
        },
        {
          name: "--next-token",
          description:
            "An encoded paging token for paginated calls that can be passed back to retrieve the next page",
          args: {
            name: "string",
          },
        },
        {
          name: "--realm",
          description:
            "The domain name that's associated with the group.    This parameter is optional, so you can return groups outside of your Managed Microsoft AD domain. When no value is defined, only your Managed Microsoft AD groups are returned.   This value is case insensitive and defaults to your Managed Microsoft AD domain",
          args: {
            name: "string",
          },
        },
        {
          name: "--sam-account-name",
          description:
            "The SAMAccountName of the user, group, or computer that's a member of the group",
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
      name: "list-users",
      description:
        "Returns user information for the specified directory.   This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the ListUsers.NextToken member contains a token that you pass in the next call to ListUsers. This retrieves the next set of items.   You can also specify a maximum number of return results with the MaxResults parameter",
      options: [
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description:
            "The maximum number of results to be returned per request",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "An encoded paging token for paginated calls that can be passed back to retrieve the next page",
          args: {
            name: "string",
          },
        },
        {
          name: "--realm",
          description:
            "The domain name that's associated with the user.    This parameter is optional, so you can return users outside of your Managed Microsoft AD domain. When no value is defined, only your Managed Microsoft AD users are returned.   This value is case insensitive",
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
      name: "remove-group-member",
      description: "Removes a member from a group",
      options: [
        {
          name: "--client-token",
          description:
            "A unique and case-sensitive identifier that you provide to make sure the idempotency of the request, so multiple identical calls have the same effect as one single call.   A client token is valid for 8 hours after the first request that uses it completes. After 8 hours, any request with the same client token is treated as a new request. If the request succeeds, any future uses of that token will be idempotent for another 8 hours.   If you submit a request with the same client token but change one of the other parameters within the 8-hour idempotency window, Directory Service Data returns an ConflictException.    This parameter is optional when using the CLI or SDK",
          args: {
            name: "string",
          },
        },
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the member",
          args: {
            name: "string",
          },
        },
        {
          name: "--group-name",
          description: "The name of the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--member-name",
          description:
            "The SAMAccountName of the user, group, or computer to remove from the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--member-realm",
          description:
            "The domain name that's associated with the group member. This parameter defaults to the Managed Microsoft AD domain.    This parameter is optional and case insensitive",
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
      name: "search-groups",
      description:
        "Searches the specified directory for a group. You can find groups that match the SearchString parameter with the value of their attributes included in the SearchString parameter.   This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the SearchGroups.NextToken member contains a token that you pass in the next call to SearchGroups. This retrieves the next set of items.   You can also specify a maximum number of return results with the MaxResults parameter",
      options: [
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description:
            "The maximum number of results to be returned per request",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "An encoded paging token for paginated calls that can be passed back to retrieve the next page",
          args: {
            name: "string",
          },
        },
        {
          name: "--realm",
          description:
            "The domain name that's associated with the group.    This parameter is optional, so you can return groups outside of your Managed Microsoft AD domain. When no value is defined, only your Managed Microsoft AD groups are returned.   This value is case insensitive",
          args: {
            name: "string",
          },
        },
        {
          name: "--search-attributes",
          description:
            "One or more data attributes that are used to search for a group. For a list of supported attributes, see Directory Service Data Attributes",
          args: {
            name: "list",
          },
        },
        {
          name: "--search-string",
          description:
            "The attribute value that you want to search for.    Wildcard (*) searches aren't supported. For a list of supported attributes, see Directory Service Data Attributes",
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
      name: "search-users",
      description:
        "Searches the specified directory for a user. You can find users that match the SearchString parameter with the value of their attributes included in the SearchString parameter.  This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the SearchUsers.NextToken member contains a token that you pass in the next call to SearchUsers. This retrieves the next set of items.   You can also specify a maximum number of return results with the MaxResults parameter",
      options: [
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description:
            "The maximum number of results to be returned per request",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "An encoded paging token for paginated calls that can be passed back to retrieve the next page",
          args: {
            name: "string",
          },
        },
        {
          name: "--realm",
          description:
            "The domain name that's associated with the user.    This parameter is optional, so you can return users outside of your Managed Microsoft AD domain. When no value is defined, only your Managed Microsoft AD users are returned.   This value is case insensitive",
          args: {
            name: "string",
          },
        },
        {
          name: "--search-attributes",
          description:
            "One or more data attributes that are used to search for a user. For a list of supported attributes, see Directory Service Data Attributes",
          args: {
            name: "list",
          },
        },
        {
          name: "--search-string",
          description:
            "The attribute value that you want to search for.    Wildcard (*) searches aren't supported. For a list of supported attributes, see Directory Service Data Attributes",
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
      name: "update-group",
      description: "Updates group information",
      options: [
        {
          name: "--client-token",
          description:
            "A unique and case-sensitive identifier that you provide to make sure the idempotency of the request, so multiple identical calls have the same effect as one single call.   A client token is valid for 8 hours after the first request that uses it completes. After 8 hours, any request with the same client token is treated as a new request. If the request succeeds, any future uses of that token will be idempotent for another 8 hours.   If you submit a request with the same client token but change one of the other parameters within the 8-hour idempotency window, Directory Service Data returns an ConflictException.    This parameter is optional when using the CLI or SDK",
          args: {
            name: "string",
          },
        },
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--group-scope",
          description:
            "The scope of the AD group. For details, see Active Directory security groups",
          args: {
            name: "string",
          },
        },
        {
          name: "--group-type",
          description:
            "The AD group type. For details, see Active Directory security group type",
          args: {
            name: "string",
          },
        },
        {
          name: "--other-attributes",
          description:
            "An expression that defines one or more attributes with the data type and the value of each attribute",
          args: {
            name: "map",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the group",
          args: {
            name: "string",
          },
        },
        {
          name: "--update-type",
          description:
            "The type of update to be performed. If no value exists for the attribute, use ADD. Otherwise, use REPLACE to change an attribute value or REMOVE to clear the attribute value",
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
      name: "update-user",
      description: "Updates user information",
      options: [
        {
          name: "--client-token",
          description:
            "A unique and case-sensitive identifier that you provide to make sure the idempotency of the request, so multiple identical calls have the same effect as one single call.   A client token is valid for 8 hours after the first request that uses it completes. After 8 hours, any request with the same client token is treated as a new request. If the request succeeds, any future uses of that token will be idempotent for another 8 hours.   If you submit a request with the same client token but change one of the other parameters within the 8-hour idempotency window, Directory Service Data returns an ConflictException.    This parameter is optional when using the CLI or SDK",
          args: {
            name: "string",
          },
        },
        {
          name: "--directory-id",
          description:
            "The identifier (ID) of the directory that's associated with the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--email-address",
          description: "The email address of the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--given-name",
          description: "The first name of the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--other-attributes",
          description:
            "An expression that defines one or more attribute names with the data type and value of each attribute. A key is an attribute name, and the value is a list of maps. For a list of supported attributes, see Directory Service Data Attributes.    Attribute names are case insensitive",
          args: {
            name: "map",
          },
        },
        {
          name: "--sam-account-name",
          description: "The name of the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--surname",
          description: "The last name of the user",
          args: {
            name: "string",
          },
        },
        {
          name: "--update-type",
          description:
            "The type of update to be performed. If no value exists for the attribute, use ADD. Otherwise, use REPLACE to change an attribute value or REMOVE to clear the attribute value",
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