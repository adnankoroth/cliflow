// dig completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "dig",
  description: "Domain Information Groper",
  subcommands: [
    {
      name: "A",
      description: "Query Domain A Record",
      options: [
        {
          name: ["+short", ""],
          insertValue: "+short {cursor}",
          description: "Only print meaningful results"
                  }
      ]
    },
    {
      name: "MX",
      description: "Query Domain MX Record",
      options: [
        {
          name: ["+short", ""],
          insertValue: "+short {cursor}",
          description: "Only print meaningful results"
                  }
      ]
    },
    {
      name: "CNAME",
      description: "Query Domain CNAME Record",
      options: [
        {
          name: ["+short", ""],
          insertValue: "+short {cursor}",
          description: "Only print meaningful results"
                  }
      ]
    },
    {
      name: "TXT",
      description: "Query Domain TXT Record",
      options: [
        {
          name: ["+short", ""],
          insertValue: "+short {cursor}",
          description: "Only print meaningful results"
                  }
      ]
    },
    {
      name: "NS",
      description: "Query MX Record",
      options: [
        {
          name: ["+short", ""],
          insertValue: "+short {cursor}",
          description: "Only print meaningful results"
                  }
      ]
    },
    {
      name: "SOA",
      description: "Query SOA Record",
      options: [
        {
          name: ["+short", ""],
          insertValue: "+short {cursor}",
          description: "Only print meaningful results"
                  }
      ]
    },
    {
      name: "TTL",
      description: "Query TTL Record",
      options: [
        {
          name: ["+short", ""],
          insertValue: "+short {cursor}",
          description: "Only print meaningful results"
                  }
      ]
    },
    {
      name: "ANY +noall +answer",
      description: "Query ALL DNS Records"
    },
    {
      name: "+nocomments +noquestion +noauthority +noadditional +nostats",
      description: "Query only answer section"
    }
  ]
};

export default completionSpec;
