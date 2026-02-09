// CODEARTIFACT service completions for AWS CLI
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { Subcommand } from '../../types.js';

export const codeartifactSubcommands: Subcommand[] = [
    {
      name: "associate-external-connection",
      description:
        "Adds an existing external connection to a repository. One external connection is allowed per repository.  A repository can have one or more upstream repositories, or an external connection",
      options: [
        {
          name: "--domain",
          description: "The name of the domain that contains the repository",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository to which the external connection is added",
          args: {
            name: "string",
          },
        },
        {
          name: "--external-connection",
          description:
            "The name of the external connection to add to the repository. The following values are supported:     public:npmjs - for the npm public repository.     public:nuget-org - for the NuGet Gallery.     public:pypi - for the Python Package Index.     public:maven-central - for Maven Central.     public:maven-googleandroid - for the Google Android repository.     public:maven-gradleplugins - for the Gradle plugins repository.     public:maven-commonsware - for the CommonsWare Android repository.     public:maven-clojars - for the Clojars repository.     public:ruby-gems-org - for RubyGems.org.     public:crates-io - for Crates.io",
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
      name: "copy-package-versions",
      description:
        "Copies package versions from one repository to another repository in the same domain.    You must specify versions or versionRevisions. You cannot specify both",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the source and destination repositories",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--source-repository",
          description:
            "The name of the repository that contains the package versions to be copied",
          args: {
            name: "string",
          },
        },
        {
          name: "--destination-repository",
          description:
            "The name of the repository into which package versions are copied",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description: "The format of the package versions to be copied",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package versions to be copied. The package component that specifies its namespace depends on its type. For example:  The namespace is required when copying package versions of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description:
            "The name of the package that contains the versions to be copied",
          args: {
            name: "string",
          },
        },
        {
          name: "--versions",
          description:
            "The versions of the package to be copied.    You must specify versions or versionRevisions. You cannot specify both",
          args: {
            name: "list",
          },
        },
        {
          name: "--version-revisions",
          description:
            "A list of key-value pairs. The keys are package versions and the values are package version revisions. A CopyPackageVersion operation succeeds if the specified versions in the source repository match the specified package version revision.    You must specify versions or versionRevisions. You cannot specify both",
          args: {
            name: "map",
          },
        },
        {
          name: "--allow-overwrite",
          description:
            "Set to true to overwrite a package version that already exists in the destination repository. If set to false and the package version already exists in the destination repository, the package version is returned in the failedVersions field of the response with an ALREADY_EXISTS error code",
        },
        {
          name: "--no-allow-overwrite",
          description:
            "Set to true to overwrite a package version that already exists in the destination repository. If set to false and the package version already exists in the destination repository, the package version is returned in the failedVersions field of the response with an ALREADY_EXISTS error code",
        },
        {
          name: "--include-from-upstream",
          description:
            "Set to true to copy packages from repositories that are upstream from the source repository to the destination repository. The default setting is false. For more information, see Working with upstream repositories",
        },
        {
          name: "--no-include-from-upstream",
          description:
            "Set to true to copy packages from repositories that are upstream from the source repository to the destination repository. The default setting is false. For more information, see Working with upstream repositories",
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
      name: "create-domain",
      description:
        "Creates a domain. CodeArtifact domains make it easier to manage multiple repositories across an organization. You can use a domain to apply permissions across many repositories owned by different Amazon Web Services accounts. An asset is stored only once in a domain, even if it's in multiple repositories.  Although you can have multiple domains, we recommend a single production domain that contains all published artifacts so that your development teams can find and share packages. You can use a second pre-production domain to test changes to the production domain configuration",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain to create. All domain names in an Amazon Web Services Region that are in the same Amazon Web Services account must be unique. The domain name is used as the prefix in DNS hostnames. Do not use sensitive information in a domain name because it is publicly discoverable",
          args: {
            name: "string",
          },
        },
        {
          name: "--encryption-key",
          description:
            "The encryption key for the domain. This is used to encrypt content stored in a domain. An encryption key can be a key ID, a key Amazon Resource Name (ARN), a key alias, or a key alias ARN. To specify an encryptionKey, your IAM role must have kms:DescribeKey and kms:CreateGrant permissions on the encryption key that is used. For more information, see DescribeKey in the Key Management Service API Reference and Key Management Service API Permissions Reference in the Key Management Service Developer Guide.    CodeArtifact supports only symmetric CMKs. Do not associate an asymmetric CMK with your domain. For more information, see Using symmetric and asymmetric keys in the Key Management Service Developer Guide",
          args: {
            name: "string",
          },
        },
        {
          name: "--tags",
          description: "One or more tag key-value pairs for the domain",
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
      name: "create-package-group",
      description:
        "Creates a package group. For more information about creating package groups, including example CLI commands, see Create a package group in the CodeArtifact User Guide",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain in which you want to create a package group",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-group",
          description:
            "The pattern of the package group to create. The pattern is also the identifier of the package group",
          args: {
            name: "string",
          },
        },
        {
          name: "--contact-info",
          description: "The contact information for the created package group",
          args: {
            name: "string",
          },
        },
        {
          name: "--description",
          description: "A description of the package group",
          args: {
            name: "string",
          },
        },
        {
          name: "--tags",
          description: "One or more tag key-value pairs for the package group",
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
      name: "create-repository",
      description: "Creates a repository",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the created repository",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description: "The name of the repository to create",
          args: {
            name: "string",
          },
        },
        {
          name: "--description",
          description: "A description of the created repository",
          args: {
            name: "string",
          },
        },
        {
          name: "--upstreams",
          description:
            "A list of upstream repositories to associate with the repository. The order of the upstream repositories in the list determines their priority order when CodeArtifact looks for a requested package version. For more information, see Working with upstream repositories",
          args: {
            name: "list",
          },
        },
        {
          name: "--tags",
          description: "One or more tag key-value pairs for the repository",
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
      name: "delete-domain",
      description:
        "Deletes a domain. You cannot delete a domain that contains repositories. If you want to delete a domain with repositories, first delete its repositories",
      options: [
        {
          name: "--domain",
          description: "The name of the domain to delete",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
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
      name: "delete-domain-permissions-policy",
      description: "Deletes the resource policy set on a domain",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain associated with the resource policy to be deleted",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--policy-revision",
          description:
            "The current revision of the resource policy to be deleted. This revision is used for optimistic locking, which prevents others from overwriting your changes to the domain's resource policy",
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
      name: "delete-package",
      description:
        "Deletes a package and all associated package versions. A deleted package cannot be restored. To delete one or more package versions, use the DeletePackageVersions API",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the package to delete",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that contains the package to delete",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description: "The format of the requested package to delete",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package to delete. The package component that specifies its namespace depends on its type. For example:  The namespace is required when deleting packages of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description: "The name of the package to delete",
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
      name: "delete-package-group",
      description:
        "Deletes a package group. Deleting a package group does not delete packages or package versions associated with the package group. When a package group is deleted, the direct child package groups will become children of the package group's direct parent package group. Therefore, if any of the child groups are inheriting any settings from the parent, those settings could change",
      options: [
        {
          name: "--domain",
          description:
            "The domain that contains the package group to be deleted",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-group",
          description: "The pattern of the package group to be deleted",
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
      name: "delete-package-versions",
      description:
        "Deletes one or more versions of a package. A deleted package version cannot be restored in your repository. If you want to remove a package version from your repository and be able to restore it later, set its status to Archived. Archived packages cannot be downloaded from a repository and don't show up with list package APIs (for example, ListPackageVersions), but you can restore them using UpdatePackageVersionsStatus",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the package to delete",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that contains the package versions to delete",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description: "The format of the package versions to delete",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package versions to be deleted. The package component that specifies its namespace depends on its type. For example:  The namespace is required when deleting package versions of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description: "The name of the package with the versions to delete",
          args: {
            name: "string",
          },
        },
        {
          name: "--versions",
          description:
            "An array of strings that specify the versions of the package to delete",
          args: {
            name: "list",
          },
        },
        {
          name: "--expected-status",
          description: "The expected status of the package version to delete",
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
      name: "delete-repository",
      description: "Deletes a repository",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository to delete",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description: "The name of the repository to delete",
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
      name: "delete-repository-permissions-policy",
      description:
        "Deletes the resource policy that is set on a repository. After a resource policy is deleted, the permissions allowed and denied by the deleted policy are removed. The effect of deleting a resource policy might not be immediate.    Use DeleteRepositoryPermissionsPolicy with caution. After a policy is deleted, Amazon Web Services users, roles, and accounts lose permissions to perform the repository actions granted by the deleted policy",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository associated with the resource policy to be deleted",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that is associated with the resource policy to be deleted",
          args: {
            name: "string",
          },
        },
        {
          name: "--policy-revision",
          description:
            "The revision of the repository's resource policy to be deleted. This revision is used for optimistic locking, which prevents others from accidentally overwriting your changes to the repository's resource policy",
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
      name: "describe-domain",
      description:
        "Returns a DomainDescription object that contains information about the requested domain",
      options: [
        {
          name: "--domain",
          description:
            "A string that specifies the name of the requested domain",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
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
      name: "describe-package",
      description:
        "Returns a PackageDescription object that contains information about the requested package",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the package",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that contains the requested package",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "A format that specifies the type of the requested package",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the requested package. The package component that specifies its namespace depends on its type. For example:  The namespace is required when requesting packages of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description: "The name of the requested package",
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
      name: "describe-package-group",
      description:
        "Returns a PackageGroupDescription object that contains information about the requested package group",
      options: [
        {
          name: "--domain",
          description: "The name of the domain that contains the package group",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-group",
          description: "The pattern of the requested package group",
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
      name: "describe-package-version",
      description:
        "Returns a PackageVersionDescription object that contains information about the requested package version",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the package version",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that contains the package version",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "A format that specifies the type of the requested package version",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the requested package version. The package component that specifies its namespace depends on its type. For example:  The namespace is required when requesting package versions of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description: "The name of the requested package version",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-version",
          description:
            "A string that contains the package version (for example, 3.5.2)",
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
      name: "describe-repository",
      description:
        "Returns a RepositoryDescription object that contains detailed information about the requested repository",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository to describe",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "A string that specifies the name of the requested repository",
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
      name: "disassociate-external-connection",
      description: "Removes an existing external connection from a repository",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository from which to remove the external repository",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository from which the external connection will be removed",
          args: {
            name: "string",
          },
        },
        {
          name: "--external-connection",
          description:
            "The name of the external connection to be removed from the repository",
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
      name: "dispose-package-versions",
      description:
        "Deletes the assets in package versions and sets the package versions' status to Disposed. A disposed package version cannot be restored in your repository because its assets are deleted.   To view all disposed package versions in a repository, use ListPackageVersions and set the status parameter to Disposed.   To view information about a disposed package version, use DescribePackageVersion",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository you want to dispose",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that contains the package versions you want to dispose",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "A format that specifies the type of package versions you want to dispose",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package versions to be disposed. The package component that specifies its namespace depends on its type. For example:  The namespace is required when disposing package versions of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description:
            "The name of the package with the versions you want to dispose",
          args: {
            name: "string",
          },
        },
        {
          name: "--versions",
          description: "The versions of the package you want to dispose",
          args: {
            name: "list",
          },
        },
        {
          name: "--version-revisions",
          description:
            "The revisions of the package versions you want to dispose",
          args: {
            name: "map",
          },
        },
        {
          name: "--expected-status",
          description: "The expected status of the package version to dispose",
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
      name: "get-associated-package-group",
      description:
        "Returns the most closely associated package group to the specified package. This API does not require that the package exist in any repository in the domain. As such, GetAssociatedPackageGroup can be used to see which package group's origin configuration applies to a package before that package is in a repository. This can be helpful to check if public packages are blocked without ingesting them. For information package group association and matching, see Package group definition syntax and matching behavior in the CodeArtifact User Guide",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the package from which to get the associated package group",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "The format of the package from which to get the associated package group",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package from which to get the associated package group. The package component that specifies its namespace depends on its type. For example:  The namespace is required when getting associated package groups from packages of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description:
            "The package from which to get the associated package group",
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
      name: "get-authorization-token",
      description:
        "Generates a temporary authorization token for accessing repositories in the domain. This API requires the codeartifact:GetAuthorizationToken and sts:GetServiceBearerToken permissions. For more information about authorization tokens, see CodeArtifact authentication and tokens.   CodeArtifact authorization tokens are valid for a period of 12 hours when created with the login command. You can call login periodically to refresh the token. When you create an authorization token with the GetAuthorizationToken API, you can set a custom authorization period, up to a maximum of 12 hours, with the durationSeconds parameter. The authorization period begins after login or GetAuthorizationToken is called. If login or GetAuthorizationToken is called while assuming a role, the token lifetime is independent of the maximum session duration of the role. For example, if you call sts assume-role and specify a session duration of 15 minutes, then generate a CodeArtifact authorization token, the token will be valid for the full authorization period even though this is longer than the 15-minute session duration. See Using IAM Roles for more information on controlling session duration",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that is in scope for the generated authorization token",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--duration-seconds",
          description:
            "The time, in seconds, that the generated authorization token is valid. Valid values are 0 and any number between 900 (15 minutes) and 43200 (12 hours). A value of 0 will set the expiration of the authorization token to the same expiration of the user's role's temporary credentials",
          args: {
            name: "long",
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
      name: "get-domain-permissions-policy",
      description:
        "Returns the resource policy attached to the specified domain.    The policy is a resource-based policy, not an identity-based policy. For more information, see Identity-based policies and resource-based policies  in the IAM User Guide",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain to which the resource policy is attached",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
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
      name: "get-package-version-asset",
      description:
        "Returns an asset (or file) that is in a package. For example, for a Maven package version, use GetPackageVersionAsset to download a JAR file, a POM file, or any other assets in the package version",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the package version with the requested asset",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The repository that contains the package version with the requested asset",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "A format that specifies the type of the package version with the requested asset file",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package version with the requested asset file. The package component that specifies its namespace depends on its type. For example:  The namespace is required when requesting assets from package versions of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description:
            "The name of the package that contains the requested asset",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-version",
          description:
            "A string that contains the package version (for example, 3.5.2)",
          args: {
            name: "string",
          },
        },
        {
          name: "--asset",
          description: "The name of the requested asset",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-version-revision",
          description:
            "The name of the package version revision that contains the requested asset",
          args: {
            name: "string",
          },
        },
        {
          name: "outfile",
          description: "Filename where the content will be saved",
          args: {
            name: "string",
          },
        },
      ],
    },
    {
      name: "get-package-version-readme",
      description:
        "Gets the readme file or descriptive text for a package version.   The returned text might contain formatting. For example, it might contain formatting for Markdown or reStructuredText",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the package version with the requested readme file",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The repository that contains the package with the requested readme file",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "A format that specifies the type of the package version with the requested readme file",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package version with the requested readme file. The package component that specifies its namespace depends on its type. For example:  The namespace is required when requesting the readme from package versions of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description:
            "The name of the package version that contains the requested readme file",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-version",
          description:
            "A string that contains the package version (for example, 3.5.2)",
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
      name: "get-repository-endpoint",
      description:
        "Returns the endpoint of a repository for a specific package format. A repository has one endpoint for each package format:     cargo     generic     maven     npm     nuget     pypi     ruby     swift",
      options: [
        {
          name: "--domain",
          description: "The name of the domain that contains the repository",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain that contains the repository. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description: "The name of the repository",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "Returns which endpoint of a repository to return. A repository has one endpoint for each package format",
          args: {
            name: "string",
          },
        },
        {
          name: "--endpoint-type",
          description: "A string that specifies the type of endpoint",
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
      name: "get-repository-permissions-policy",
      description: "Returns the resource policy that is set on a repository",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain containing the repository whose associated resource policy is to be retrieved",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository whose associated resource policy is to be retrieved",
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
      name: "list-allowed-repositories-for-group",
      description:
        "Lists the repositories in the added repositories list of the specified restriction type for a package group. For more information about restriction types and added repository lists, see Package group origin controls in the CodeArtifact User Guide",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the package group from which to list allowed repositories",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-group",
          description:
            "The pattern of the package group from which to list allowed repositories",
          args: {
            name: "string",
          },
        },
        {
          name: "--origin-restriction-type",
          description:
            "The origin configuration restriction type of which to list allowed repositories",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
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
      name: "list-associated-packages",
      description:
        "Returns a list of packages associated with the requested package group. For information package group association and matching, see Package group definition syntax and matching behavior in the CodeArtifact User Guide",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the package group from which to list associated packages",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-group",
          description:
            "The pattern of the package group from which to list associated packages",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
          args: {
            name: "string",
          },
        },
        {
          name: "--preview",
          description:
            "When this flag is included, ListAssociatedPackages will return a list of packages that would be associated with a package group, even if it does not exist",
        },
        {
          name: "--no-preview",
          description:
            "When this flag is included, ListAssociatedPackages will return a list of packages that would be associated with a package group, even if it does not exist",
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
      name: "list-domains",
      description:
        "Returns a list of DomainSummary objects for all domains owned by the Amazon Web Services account that makes this call. Each returned DomainSummary object contains information about a domain",
      options: [
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
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
      name: "list-package-groups",
      description: "Returns a list of package groups in the requested domain",
      options: [
        {
          name: "--domain",
          description: "The domain for which you want to list package groups",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
          args: {
            name: "string",
          },
        },
        {
          name: "--prefix",
          description:
            "A prefix for which to search package groups. When included, ListPackageGroups will return only package groups with patterns that match the prefix",
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
      name: "list-package-version-assets",
      description:
        "Returns a list of AssetSummary objects for assets in a package version",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository associated with the package version assets",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that contains the package that contains the requested package version assets",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "The format of the package that contains the requested package version assets",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package version that contains the requested package version assets. The package component that specifies its namespace depends on its type. For example:  The namespace is required requesting assets from package versions of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description:
            "The name of the package that contains the requested package version assets",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-version",
          description:
            "A string that contains the package version (for example, 3.5.2)",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
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
      name: "list-package-version-dependencies",
      description:
        "Returns the direct dependencies for a package version. The dependencies are returned as PackageDependency objects. CodeArtifact extracts the dependencies for a package version from the metadata file for the package format (for example, the package.json file for npm packages and the pom.xml file for Maven). Any package version dependencies that are not listed in the configuration file are not returned",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the requested package version dependencies",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that contains the requested package version",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "The format of the package with the requested dependencies",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package version with the requested dependencies. The package component that specifies its namespace depends on its type. For example:  The namespace is required when listing dependencies from package versions of the following formats:   Maven       The namespace of a Maven package version is its groupId.     The namespace of an npm package version is its scope.     Python and NuGet package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description: "The name of the package versions' package",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-version",
          description:
            "A string that contains the package version (for example, 3.5.2)",
          args: {
            name: "string",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
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
      name: "list-package-versions",
      description:
        "Returns a list of PackageVersionSummary objects for package versions in a repository that match the request parameters. Package versions of all statuses will be returned by default when calling list-package-versions with no --status parameter",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the requested package versions",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that contains the requested package versions",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description: "The format of the package versions you want to list",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package that contains the requested package versions. The package component that specifies its namespace depends on its type. For example:  The namespace is required when deleting package versions of the following formats:   Maven   Swift   generic       The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description:
            "The name of the package for which you want to request package versions",
          args: {
            name: "string",
          },
        },
        {
          name: "--status",
          description:
            "A string that filters the requested package versions by status",
          args: {
            name: "string",
          },
        },
        {
          name: "--sort-by",
          description: "How to sort the requested list of package versions",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
          args: {
            name: "string",
          },
        },
        {
          name: "--origin-type",
          description:
            "The originType used to filter package versions. Only package versions with the provided originType will be returned",
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
      name: "list-packages",
      description:
        "Returns a list of PackageSummary objects for packages in a repository that match the request parameters",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the requested packages",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that contains the requested packages",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "The format used to filter requested packages. Only packages from the provided format will be returned",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace prefix used to filter requested packages. Only packages with a namespace that starts with the provided string value are returned. Note that although this option is called --namespace and not --namespace-prefix, it has prefix-matching behavior. Each package format uses namespace as follows:    The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-prefix",
          description:
            "A prefix used to filter requested packages. Only packages with names that start with packagePrefix are returned",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
          args: {
            name: "string",
          },
        },
        {
          name: "--publish",
          description:
            "The value of the Publish package origin control restriction used to filter requested packages. Only packages with the provided restriction are returned. For more information, see PackageOriginRestrictions",
          args: {
            name: "string",
          },
        },
        {
          name: "--upstream",
          description:
            "The value of the Upstream package origin control restriction used to filter requested packages. Only packages with the provided restriction are returned. For more information, see PackageOriginRestrictions",
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
      name: "list-repositories",
      description:
        "Returns a list of RepositorySummary objects. Each RepositorySummary contains information about a repository in the specified Amazon Web Services account and that matches the input parameters",
      options: [
        {
          name: "--repository-prefix",
          description:
            "A prefix used to filter returned repositories. Only repositories with names that start with repositoryPrefix are returned",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
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
      name: "list-repositories-in-domain",
      description:
        "Returns a list of RepositorySummary objects. Each RepositorySummary contains information about a repository in the specified domain and that matches the input parameters",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the returned list of repositories",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--administrator-account",
          description:
            "Filter the list of repositories to only include those that are managed by the Amazon Web Services account ID",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository-prefix",
          description:
            "A prefix used to filter returned repositories. Only repositories with names that start with repositoryPrefix are returned",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
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
      name: "list-sub-package-groups",
      description:
        "Returns a list of direct children of the specified package group. For information package group hierarchy, see Package group definition syntax and matching behavior in the CodeArtifact User Guide",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain which contains the package group from which to list sub package groups",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-group",
          description:
            "The pattern of the package group from which to list sub package groups",
          args: {
            name: "string",
          },
        },
        {
          name: "--max-results",
          description: "The maximum number of results to return per page",
          args: {
            name: "integer",
          },
        },
        {
          name: "--next-token",
          description:
            "The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results",
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
      name: "list-tags-for-resource",
      description:
        "Gets information about Amazon Web Services tags for a specified Amazon Resource Name (ARN) in CodeArtifact",
      options: [
        {
          name: "--resource-arn",
          description:
            "The Amazon Resource Name (ARN) of the resource to get tags for",
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
      name: "publish-package-version",
      description:
        "Creates a new package version containing one or more assets (or files). The unfinished flag can be used to keep the package version in the Unfinished state until all of its assets have been uploaded (see Package version status in the CodeArtifact user guide). To set the package version\u2019s status to Published, omit the unfinished flag when uploading the final asset, or set the status using UpdatePackageVersionStatus. Once a package version\u2019s status is set to Published, it cannot change back to Unfinished.  Only generic packages can be published using this API. For more information, see Using generic packages in the CodeArtifact User Guide",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the package version to publish",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository that the package version will be published to",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "A format that specifies the type of the package version with the requested asset file. The only supported value is generic",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description: "The namespace of the package version to publish",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description: "The name of the package version to publish",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-version",
          description: "The package version to publish (for example, 3.5.2)",
          args: {
            name: "string",
          },
        },
        {
          name: "--asset-content",
          description: "The content of the asset to publish",
          args: {
            name: "blob",
          },
        },
        {
          name: "--asset-name",
          description:
            "The name of the asset to publish. Asset names can include Unicode letters and numbers, and the following special characters: ~ ! @ ^ & ( ) - ` _ + [ ] { } ; , . `",
          args: {
            name: "string",
          },
        },
        {
          name: "--asset-sha256",
          description:
            "The SHA256 hash of the assetContent to publish. This value must be calculated by the caller and provided with the request (see Publishing a generic package in the CodeArtifact User Guide). This value is used as an integrity check to verify that the assetContent has not changed after it was originally sent",
          args: {
            name: "string",
          },
        },
        {
          name: "--unfinished",
          description:
            "Specifies whether the package version should remain in the unfinished state. If omitted, the package version status will be set to Published (see Package version status in the CodeArtifact User Guide). Valid values: unfinished",
        },
        {
          name: "--no-unfinished",
          description:
            "Specifies whether the package version should remain in the unfinished state. If omitted, the package version status will be set to Published (see Package version status in the CodeArtifact User Guide). Valid values: unfinished",
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
      name: "put-domain-permissions-policy",
      description:
        "Sets a resource policy on a domain that specifies permissions to access it.   When you call PutDomainPermissionsPolicy, the resource policy on the domain is ignored when evaluting permissions. This ensures that the owner of a domain cannot lock themselves out of the domain, which would prevent them from being able to update the resource policy",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain on which to set the resource policy",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--policy-revision",
          description:
            "The current revision of the resource policy to be set. This revision is used for optimistic locking, which prevents others from overwriting your changes to the domain's resource policy",
          args: {
            name: "string",
          },
        },
        {
          name: "--policy-document",
          description:
            "A valid displayable JSON Aspen policy string to be set as the access control resource policy on the provided domain",
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
      name: "put-package-origin-configuration",
      description:
        "Sets the package origin configuration for a package. The package origin configuration determines how new versions of a package can be added to a repository. You can allow or block direct publishing of new package versions, or ingestion and retaining of new package versions from an external connection or upstream source. For more information about package origin controls and configuration, see Editing package origin controls in the CodeArtifact User Guide.  PutPackageOriginConfiguration can be called on a package that doesn't yet exist in the repository. When called on a package that does not exist, a package is created in the repository with no versions and the requested restrictions are set on the package. This can be used to preemptively block ingesting or retaining any versions from external connections or upstream repositories, or to block publishing any versions of the package into the repository before connecting any package managers or publishers to the repository",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the package",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description: "The name of the repository that contains the package",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "A format that specifies the type of the package to be updated",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package to be updated. The package component that specifies its namespace depends on its type. For example:    The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description: "The name of the package to be updated",
          args: {
            name: "string",
          },
        },
        {
          name: "--restrictions",
          description:
            "A PackageOriginRestrictions object that contains information about the upstream and publish package origin restrictions. The upstream restriction determines if new package versions can be ingested or retained from external connections or upstream repositories. The publish restriction determines if new package versions can be published directly to the repository. You must include both the desired upstream and publish restrictions",
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
      name: "put-repository-permissions-policy",
      description:
        "Sets the resource policy on a repository that specifies permissions to access it.   When you call PutRepositoryPermissionsPolicy, the resource policy on the repository is ignored when evaluting permissions. This ensures that the owner of a repository cannot lock themselves out of the repository, which would prevent them from being able to update the resource policy",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain containing the repository to set the resource policy on",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The name of the repository to set the resource policy on",
          args: {
            name: "string",
          },
        },
        {
          name: "--policy-revision",
          description:
            "Sets the revision of the resource policy that specifies permissions to access the repository. This revision is used for optimistic locking, which prevents others from overwriting your changes to the repository's resource policy",
          args: {
            name: "string",
          },
        },
        {
          name: "--policy-document",
          description:
            "A valid displayable JSON Aspen policy string to be set as the access control resource policy on the provided repository",
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
      name: "tag-resource",
      description: "Adds or updates tags for a resource in CodeArtifact",
      options: [
        {
          name: "--resource-arn",
          description:
            "The Amazon Resource Name (ARN) of the resource that you want to add or update tags for",
          args: {
            name: "string",
          },
        },
        {
          name: "--tags",
          description: "The tags you want to modify or add to the resource",
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
      name: "untag-resource",
      description: "Removes tags from a resource in CodeArtifact",
      options: [
        {
          name: "--resource-arn",
          description:
            "The Amazon Resource Name (ARN) of the resource that you want to remove tags from",
          args: {
            name: "string",
          },
        },
        {
          name: "--tag-keys",
          description:
            "The tag key for each tag that you want to remove from the resource",
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
      name: "update-package-group",
      description:
        "Updates a package group. This API cannot be used to update a package group's origin configuration or pattern. To update a package group's origin configuration, use UpdatePackageGroupOriginConfiguration",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain which contains the package group to be updated",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-group",
          description: "The pattern of the package group to be updated",
          args: {
            name: "string",
          },
        },
        {
          name: "--contact-info",
          description:
            "Contact information which you want to update the requested package group with",
          args: {
            name: "string",
          },
        },
        {
          name: "--description",
          description:
            "The description you want to update the requested package group with",
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
      name: "update-package-group-origin-configuration",
      description:
        "Updates the package origin configuration for a package group. The package origin configuration determines how new versions of a package can be added to a repository. You can allow or block direct publishing of new package versions, or ingestion and retaining of new package versions from an external connection or upstream source. For more information about package group origin controls and configuration, see Package group origin controls in the CodeArtifact User Guide",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain which contains the package group for which to update the origin configuration",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--package-group",
          description:
            "The pattern of the package group for which to update the origin configuration",
          args: {
            name: "string",
          },
        },
        {
          name: "--restrictions",
          description:
            "The origin configuration settings that determine how package versions can enter repositories",
          args: {
            name: "map",
          },
        },
        {
          name: "--add-allowed-repositories",
          description:
            "The repository name and restrictions to add to the allowed repository list of the specified package group",
          args: {
            name: "list",
          },
        },
        {
          name: "--remove-allowed-repositories",
          description:
            "The repository name and restrictions to remove from the allowed repository list of the specified package group",
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
      name: "update-package-versions-status",
      description:
        "Updates the status of one or more versions of a package. Using UpdatePackageVersionsStatus, you can update the status of package versions to Archived, Published, or Unlisted. To set the status of a package version to Disposed, use DisposePackageVersions",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain that contains the repository that contains the package versions with a status to be updated",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description:
            "The repository that contains the package versions with the status you want to update",
          args: {
            name: "string",
          },
        },
        {
          name: "--format",
          description:
            "A format that specifies the type of the package with the statuses to update",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description:
            "The namespace of the package version to be updated. The package component that specifies its namespace depends on its type. For example:    The namespace of a Maven package version is its groupId.     The namespace of an npm or Swift package version is its scope.    The namespace of a generic package is its namespace.    Python, NuGet, Ruby, and Cargo package versions do not contain a corresponding component, package versions of those formats do not have a namespace",
          args: {
            name: "string",
          },
        },
        {
          name: "--package",
          description:
            "The name of the package with the version statuses to update",
          args: {
            name: "string",
          },
        },
        {
          name: "--versions",
          description:
            "An array of strings that specify the versions of the package with the statuses to update",
          args: {
            name: "list",
          },
        },
        {
          name: "--version-revisions",
          description:
            "A map of package versions and package version revisions. The map key is the package version (for example, 3.5.2), and the map value is the package version revision",
          args: {
            name: "map",
          },
        },
        {
          name: "--expected-status",
          description:
            "The package version\u2019s expected status before it is updated. If expectedStatus is provided, the package version's status is updated only if its status at the time UpdatePackageVersionsStatus is called matches expectedStatus",
          args: {
            name: "string",
          },
        },
        {
          name: "--target-status",
          description:
            "The status you want to change the package version status to",
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
      name: "update-repository",
      description: "Update the properties of a repository",
      options: [
        {
          name: "--domain",
          description:
            "The name of the domain associated with the repository to update",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description:
            "The 12-digit account number of the Amazon Web Services account that owns the domain. It does not include dashes or spaces",
          args: {
            name: "string",
          },
        },
        {
          name: "--repository",
          description: "The name of the repository to update",
          args: {
            name: "string",
          },
        },
        {
          name: "--description",
          description: "An updated repository description",
          args: {
            name: "string",
          },
        },
        {
          name: "--upstreams",
          description:
            "A list of upstream repositories to associate with the repository. The order of the upstream repositories in the list determines their priority order when CodeArtifact looks for a requested package version. For more information, see Working with upstream repositories",
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
      name: "login",
      description:
        "Sets up the idiomatic tool for your package format to use your CodeArtifact repository. Your login information is valid for up to 12 hours after which you must login again",
      options: [
        {
          name: "--tool",
          description: "The tool you want to connect with your repository",
          args: {
            name: "string",
            suggestions: [{ name: "swift" }, { name: "nuget" }, { name: "dotnet" }, { name: "npm" }, { name: "pip" }, { name: "twine" }],
          },
        },
        {
          name: "--domain",
          description: "Your CodeArtifact domain name",
          args: {
            name: "string",
          },
        },
        {
          name: "--domain-owner",
          description: "The AWS account ID that owns your CodeArtifact domain",
          args: {
            name: "string",
          },
        },
        {
          name: "--namespace",
          description: "Associates a namespace with your repository tool",
          args: {
            name: "string",
          },
        },
        {
          name: "--duration-seconds",
          description:
            "The time, in seconds, that the login information is valid",
          args: {
            name: "integer",
          },
        },
        {
          name: "--repository",
          description: "Your CodeArtifact repository name",
          args: {
            name: "string",
          },
        },
        {
          name: "--endpoint-type",
          description:
            "The type of endpoint you want the tool to interact with",
          args: {
            name: "string",
          },
        },
        {
          name: "--dry-run",
          description:
            "Only print the commands that would be executed to connect your tool with your repository without making any changes to your configuration. Note that this prints the unredacted auth token as part of the output",
        },
      ],
    },
  ];