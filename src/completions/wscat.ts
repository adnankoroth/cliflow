// wscat completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "wscat",
  description: "Communicate over websocket",
  options: [
    {
      name: ["-c", "--connect"],
      args: {
        name: "url",
        template: "history"
      },
      description: "Connect to a WebSocket server"
    },
    { name: ["-V", "--version"], description: "Output the version number" },
    {
      name: "--auth",
      description: "Add basic HTTP authentication header (--connect only)",
      args: { name: "username:password" },
      dependsOn: ["-c", "--connect"]
    },
    {
      name: "--ca",
      args: {
        name: "ca"
      },
      description: "Specify a Certificate Authority (--connect only)",
      dependsOn: ["-c", "--connect"]
    },
    {
      name: "--cert",
      args: {
        name: "cert"
      },
      description: "Specify a Client SSL Certificate (--connect only)",
      dependsOn: ["-c", "--connect"]
    },
    {
      name: "--host",
      args: {
        name: "host"
      },
      description: "Optional host"
    },
    {
      name: "--key",
      args: {
        name: "key"
      },
      description: "Specify a Client SSL Certificate's key (--connect only)",
      dependsOn: ["-c", "--connect"]
    },
    {
      name: "--max-redirects",
      args: {
        name: "num"
      },
      description:
        "Maximum number of redirects allowed (--connect only) (default: 10)",
      dependsOn: ["-c", "--connect"]
    },
    { name: "--no-color", description: "Run without color" },
    {
      name: "--passphrase",
      args: {
        name: "passphrase"
      },
      description:
        "Specify a Client SSL Certificate Key's passphrase (--connect only). If you don't provide a value, it will be prompted for",
      dependsOn: ["-c", "--connect"]
    },
    {
      name: "--proxy",
      args: {
        name: "[protocol://]host[:port]"
      },
      description: "Connect via a proxy. Proxy must support CONNECT method"
    },
    {
      name: "--slash",
      description:
        "Enable slash commands for control frames (/ping, /pong, /close [code [, reason]])"
    },

    {
      name: ["-H", "--header"],
      args: {
        name: "header:value"
      },
      description:
        "Set an HTTP header. Repeat to set multiple (--connect only) (default: [])",
      dependsOn: ["-c", "--connect"]
    },
    {
      name: ["-L", "--location"],
      description: "Follow redirects (--connect only)",
      dependsOn: ["-c", "--connect"]
    },
    {
      name: ["-l", "--listen"],
      args: {
        name: "port"
      },
      description: "Listen on port"
    },
    {
      name: ["-n", "--no-check"],
      description: "Do not check for unauthorized certificates"
    },
    {
      name: ["-o", "--origin"],
      args: {
        name: "origin"
      },
      description: "Optional origin"
    },
    {
      name: ["-p", "--protocol"],
      args: {
        name: "protocol"
      },
      description: "Optional protocol version"
    },
    {
      name: ["-P", "--show-ping-pong"],
      description: "Print a notification when a ping or pong is received"
    },
    {
      name: ["-s", "--subprotocol"],
      args: {
        name: "protocol",
        suggestions: [{ name: "MBWS.huawei.com" }, { name: "MBLWS.huawei.com" }, { name: "soap" }, { name: "wamp" }, { name: "v10.stomp" }, { name: "v11.stomp" }, { name: "v12.stomp" }, { name: "ocpp1.2" }, { name: "ocpp1.5" }, { name: "ocpp1.6" }, { name: "ocpp2.0" }, { name: "ocpp2.0.1" }, { name: "rfb" }, { name: "sip" }, { name: "notificationchannel-netapi-rest.openmobilealliance.org" }, { name: "wpcp" }, { name: "amqp	" }, { name: "mqtt" }, { name: "jsflow" }, { name: "rwpcp" }, { name: "xmpp" }, { name: "ship" }, { name: "mielecloudconnect" }, { name: "v10.pcp.sap.com" }, { name: "msrp" }, { name: "v1.saltyrtc.org" }, { name: "TLCP-2.0.0.lightstreamer.com" }, { name: "bfcp" }, { name: "sldp.softvelum.com" }, { name: "opcua+uacp" }, { name: "opcua+uajson" }, { name: "v1.swindon-lattice+json" }, { name: "v1.usp" }, { name: "mles-websocket" }, { name: "coap" }, { name: "TLCP-2.1.0.lightstreamer.com" }, { name: "sqlnet.oracle.com" }, { name: "oneM2M.R2.0.json" }, { name: "oneM2M.R2.0.xml" }, { name: "oneM2M.R2.0.cbor" }, { name: "transit" }, { name: "2016.serverpush.dash.mpeg.org" }, { name: "2018.mmt.mpeg.org" }, { name: "clue" }, { name: "webrtc.softvelum.com" }, { name: "cobra.v2.json" }, { name: "drp" }, { name: "hub.bsc.bacnet.org" }, { name: "dc.bsc.bacnet.org" }, { name: "jmap" }, { name: "t140" }, { name: "done" }, { name: "TLCP-2.2.0.lightstreamer.com" }, { name: "collection-update" }, { name: "TLCP-2.3.0.lightstreamer.com" }, { name: "text.ircv3.net" }, { name: "binary.ircv3.net" }, { name: "v3.penguin-stats.live+proto" }]
      },
      description: "Optional subprotocol (default: [])"
    },
    {
      name: ["-w", "--wait"],
      args: {
        name: "seconds"
      },
      description: "Wait given seconds after executing command"
    },
    {
      name: ["-x", "--execute"],
      args: {
        name: "command"
      },
      description: "Execute command after connecting"
    },
    { name: ["-h", "--help"], description: "Display help for command" }
  ]
};

export default completionSpec;
