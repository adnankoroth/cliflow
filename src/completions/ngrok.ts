// ngrok completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const authTokenOption = {
  description: "Ngrok.com authtoken identifying a user",
  name: ["--authtoken", "-authtoken"],
  args: {
    name: "authtoken"
  }
};

const regionOption = {
  description: "Ngrok server region [us, eu, au, ap, sa, jp, in] (default: us)",
  name: ["--region", "-region"],
  args: {
    suggestions: ["us", "eu", "au", "ap", "sa", "jp", "in"]
  }
};
const configOptions = {
  description: "Path to config files; they are merged if multiple",
  name: ["--config", "-config"],
  args: {
    name: "config file",
    template: "filepaths"
  }
};

const subdomainOption = {
  description: "Host tunnel on a custom subdomain",
  name: ["--subdomain", "-subdomain"],
  args: {
    name: "subdomain"
  }
};

const hostOption = {
  description: "Host tunnel on custom hostname (requires DNS CNAME)",
  name: ["--hostname", "-hostname"],
  args: {
    name: "hostname"
  }
};

const completionSpec = {
  name: "ngrok",
  description: "Tunnel local ports to public URLs and inspect traffic",
  subcommands: [
    {
      name: "help",
      description: "Shows a list of commands or help for one command",
      args: {
        name: "command",
        suggestions: [
          {
            name: "authtoken",
            description: "Save authtoken to configuration file"
          },
          {
            name: "credits",
            description: "Prints author and licensing information"
          },
          {
            name: "http",
            description: "Start an HTTP tunnel"
          },
          {
            name: "start",
            description: "Start tunnels by name from the configuration file"
          },
          {
            name: "tcp",
            description: "Start a TCP tunnel"
          },
          {
            name: "tls",
            description: "Start a TLS tunnel"
          },
          {
            name: "update",
            description: "Update ngrok to the latest version"
          },
          {
            name: "version",
            description: "Print the version string"
          },
          {
            name: "help",
            description: "Shows a list of commands or help for one command"
          }
        ]
      }
    },
    {
      name: "http",
      description: "Start an HTTP tunnel",
      args: {
        name: "host",
        suggestions: [
          {
            name: "8080",
            description: "Port"
          }
        ]
      },
      options: [
                configOptions,
        regionOption,
        authTokenOption,
        hostOption,
        subdomainOption,
        {
          description: "Enforce basic auth on tunnel endpoint, 'user:password'",
          name: ["--auth", "-auth"],
          args: {
            name: "user:password"
          }
        },
        {
          description: "Listen for http, https or both: true/false/both",
          name: ["--bind-tls", "-bind-tls"],
          args: {
            name: "true/false/both",
            suggestions: ["true", "false", "both"]
          }
        },
        {
          description:
            "Set Host header; if 'rewrite' use local address hostname",
          name: ["--host-header", "-host-header"],
          args: {
            suggestions: ["rewrite"]
          }
        },
        {
          description: "Enable/disable http introspection",
          name: ["--introspection", "-introspection"],
          args: {
            suggestions: ["true", "false"]
          }
        }
      ]
    },
    {
      name: "authtoken",
      args: {
        name: "authtoken"
      },
      description: "Save authtoken to configuration file",
      options: [ configOptions]
    },
    {
      name: "credits",
      description: "Prints author and licensing information"
    },
    {
      name: "start",
      description: "Start tunnels by name from the configuration file",
      args: {
        name: "tunnels",
        isVariadic: true,
        suggestions: ["dev", "web", "blog"]
      },
      options: [
                configOptions,
        regionOption,
        authTokenOption,
        {
          name: ["--all", "-all"],
          description: "Start all tunnels in the configuration file"
                  },
        {
          name: ["--none", "-none"],
          description: "Start running no tunnels"
                  }
      ]
    },
    {
      name: "tcp",
      description: "Start a TCP tunnel",
      args: {
        name: "port",
        suggestions: ["22"]
      },
      options: [
                configOptions,
        authTokenOption,
        regionOption,
        {
          name: ["--remote-addr", "-remote-addr"],
          description: "Bind remote address (requires you reserve an address)",
          args: {
            name: "remote address"
          }
        }
      ]
    },
    {
      name: "tls",
      description: "Start a TLS tunnel",
      args: {
        name: "port"
      },
      options: [
                configOptions,
        authTokenOption,
        regionOption,
        hostOption,
        subdomainOption,
        {
          name: ["--client-cas", "-client-cas"],
          args: {
            name: "certificate",
            template: "filepaths"
          }
        },
        {
          name: ["--crt", "-crt"],
          args: {
            name: "certificate",
            template: "filepaths"
          }
        },
        {
          name: ["--key", "-key"],
          args: {
            name: "certificate",
            template: "filepaths"
          }
        }
      ]
    },
    {
      name: "update",
      description: "Update ngrok to the latest version",
      options: [
                {
          name: ["--channel", "-channel"],
          description: "Update channel (stable, beta)",
          args: {
            name: "channel",
            suggestions: ["stable", "beta"]
          }
        }
      ]
    },
    {
      name: "version",
      description: "Print the version string"
    }
  ]
};
export default completionSpec;
