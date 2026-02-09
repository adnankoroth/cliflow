// cdk completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "cdk",
  description: "AWS CDK CLI",
  subcommands: [
    {
      name: "init",
      description: "Create a new, empty CDK project from a template"
    },
    {
      name: "metadata",
      description: "Returns all metadata associated with this stack"
    },
    { name: "doctor", description: "Check your set-up for potential problems" },
    {
      name: "diff",
      description: "Compares the specified stack with the deployed stack"
    },
    { name: "destroy", description: "Destroy the specified stack(s)" },
    {
      name: "deploy",
      description: "Deploy the specified stack(s) into your AWS account"
    },
    {
      name: "bootstrap",
      description: "Deploys the CDK toolkit stack into an AWS environment"
    },
    {
      name: ["synth", "synthesize"],
      description:
        "Synthesizes and prints the CloudFormation template for this stack"
    },
    { name: ["ls", "list"], description: "List all stacks in the app" },
    {
      name: "import",
      description: "Import existing resource(s) into the given STACK"
    },
    {
      name: "watch",
      description: "Shortcut for 'deploy --watch'"
    },
    {
      name: ["ack", "acknowledge"],
      description: "Acknowledge a notice so that it does not show up anymore"
    },
    {
      name: "notices",
      description: "Returns a list of relevant notices"
    },
    {
      name: "context",
      description: "Manage cached context values"
    },
    {
      name: ["doc", "docs"],
      description: "Opens the reference documentation in a browser"
    }
  ],
  options: [
    {
      name: "--version",
      description: "The current version"
    },
    {
      name: ["-h", "--help"],
      description: "Show help"
    }
  ]
};

export default completionSpec;
