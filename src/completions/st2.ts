// st2 completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';


const helpOption = {
  name: ["-h", "--help"],
  description: "Show this help and exit"
};

const tokenOption = {
  name: ["-t", "--token"],
  description:
    "Access token for user authentication. Get ST2_AUTH_TOKEN from the environment variables by default",
  args: {
    name: "TOKEN"
  }
};

const apiKeyOption = {
  name: "--api-key",
  description:
    "Api Key for user authentication. Get ST2_API_KEY from the environment variables by default",
  args: {
    name: "API_KEY"
  }
};

const jsonOption = {
  name: ["-j", "--json"],
  description: "Print output in JSON format"
};

const yamlOption = {
  name: ["-y", "--yaml"],
  description: "Print output in YAML format"
};

const attrOption = {
  name: "--attr",
  description:
    "List of attributes to include in the output. 'all' or unspecified will return all attributes",
  args: {
    name: "ATTR",
    isVariadic: true
  }
};

const detailOption = {
  name: ["-d", "--detail"],
  description: "Display full detail of the execution in table format"
};

const keyOption = {
  name: ["-k", "--key"],
  description:
    "If result is type of JSON, then print specific key-value pair; dot notation for nested JSON is supported",
  args: {
    name: "KEY"
  }
};

const delayOption = {
  name: "--delay",
  description:
    "How long (in milliseconds) to delay the execution before scheduling",
  args: {
    name: "DELAY"
  }
};

const tailOption = {
  name: "--tail",
  description: "Automatically start tailing new execution"
};

const autoDictOption = {
  name: "--auto-dict",
  description:
    "Automatically convert list items to dictionaries when colons are detected. (NOTE - this parameter and its functionality will be deprecated in the next release in favor of a more robust conversion method)"
};

const traceTagOption = {
  name: ["--trace-tag", "--trace_tag"],
  description: "A trace tag string to track execution later",
  args: {
    name: "TRACE_TAG"
  }
};

const traceIdOption = {
  name: "--trace-id",
  description: "Existing trace id for this execution",
  args: {
    name: "TRACE_ID"
  }
};

const asyncOption = {
  name: ["-a", "--async"],
  description: "Do not wait for action to finish"
};

const inheritEnvOption = {
  name: ["-e", "--inherit-env"],
  description:
    "Pass all the environment variables which are accessible to the CLI as 'env' parameter to the action. Note: Only works with python, local and remote runners"
};

const userOption = {
  name: ["-u", "--user"],
  description: "User under which to run the action (admins only)",
  args: {
    name: "USER"
      }
};

const widthOption = {
  name: ["-w", "--width"],
  description: "Set the width of the columns in output",
  args: {
    name: "WIDTH",
    isVariadic: true
  }
};

const packOption = {
  name: ["-p", "--pack"],
  description: "Only return resources belonging to the provided pack",
  args: {
    name: "PACK"
  }
};

const resourceRefOption = {
  name: ["-r", "--resource-ref"],
  description: "Return policies for the resource ref",
  args: {
    name: "RESOURCE_REF"
  }
};

const policyTypeOption = {
  name: ["-pt", "--policy-type"],
  description: "Return policies of the policy type",
  args: {
    name: "POLICY_TYPE"
  }
};

const passwordOption = {
  name: "-p",
  description: "Password",
  args: {
    name: "PASSWORD"
  }
};

const ttlOption = {
  name: ["-l", "--ttl"],
  description:
    "The life span of the token in seconds. Max TTL configured by the admin supersedes this",
  args: {
    name: "TTL"
  }
};

const onlyTokenOption = {
  name: ["-t", "--only-token"],
  description: "On successful authentication, print only token to the console"
};

const writePasswordOption = {
  name: ["-w", "--write-password"],
  description:
    "Write the password in plain text to the config file (default is to omit it)"
};

const lastOption = {
  name: ["-n", "--last"],
  description: "List N most recent; use -n -1 to fetch the full result set",
  args: {
    name: "LAST",
    suggestions: ["10", "5", "1", "-1"]
  }
};

const sortOrderOption = {
  name: ["-s", "--sort"],
  description:
    "Sort action executions by start timestamp, asc|ascending (earliest first) or desc|descending (latest first)",
  args: {
    name: "SORT_ORDER",
    suggestions: ["desc", "descending", "asc", "ascending"]
  }
};

const timeStampGtOption = {
  name: ["-tg", "timestamp-gt"],
  description:
    "Only return executions with timestamp greater than the one provided. Use time in the format '2000-01-01T12:00:00.000Z'",
  args: {
    name: "TIMESTAMP_GT"
  }
};

const timeStampLtOption = {
  name: ["-tl", "timestamp-lt"],
  description:
    "Only return executions with timestamp lower than the one provided. Use time in the format '2000-01-01T12:00:00.000Z'",
  args: {
    name: "TIMESTAMP_LT"
  }
};

const showAllOption = {
  name: ["-l", "--showall"],
  description: "Show all attributes"
};

const actionOption = {
  name: "--action",
  description: "Action reference to filter the list",
  args: {
    name: "ACTION"
  }
};

const fileOption = {
  name: "--file",
  description: "Local file path to the workflow definition",
  args: {
    name: "FILE",
    template: "filepaths"
  }
};

const statusOption = {
  name: "--status",
  description:
    "Only return executions with the provided status. Possible values are 'succeeded', 'running', 'scheduled', 'paused', 'failed', 'canceling' or 'canceled'",
  args: {
    name: "STATUS",
    suggestions: [
      "succeeded",
      "running",
      "scheduled",
      "paused",
      "failed",
      "canceling",
      "canceled"
    ]
  }
};

const triggerInstanceOption = {
  name: "--trigger_instance",
  description: "Trigger instance id to filter the list",
  args: {
    name: "TRIGGER_INSTANCE"
  }
};

const showSecretsOption = {
  name: "--show-secrets",
  description: "Full list of attributes"
};

const metadataOpion = {
  name: ["-m", "--metadata"],
  description: "Optional metadata to associate with the API Keys",
  args: {
    name: "METADATA"
  }
};

const onlyKeyOption = {
  name: ["-k", "--only-key"],
  description: "Only print API Key to the console on creation"
};

const excludeResultOption = {
  name: ["-x", "--exclude-result"],
  description: "Don't retrieve and display the result field"
};

const tasksOption = {
  name: "--tasks",
  description: "Name of the workflow tasks to re-run",
  args: {
    name: "TASKS",
    isVariadic: true
  }
};

const noResetOption = {
  name: "--no-reset",
  description:
    "Name of the with-items tasks to not reset. This only applies to Orquesta workflows. By default, all iterations for with- items tasks is rerun. If no reset, only failed iterations are rerun",
  args: {
    name: "NO_RESET"
  }
};

const typeOption = {
  name: "--type",
  description: "Type of output to tail for. If not provided, defaults to all",
  args: {
    name: "OUTPUT_TYPE"
  }
};

const typesOption = {
  name: "--types",
  description: "Types of content to register",
  args: {
    name: "TYPES",
    isVariadic: true
  }
};

const includeMetadataOption = {
  name: "--include-metadata",
  description: "Include metadata (timestamp, output type) with the output"
};

const responseOption = {
  name: ["-r", "--response"],
  description:
    "Entire response payload as JSON string (bypass interactive mode)",
  args: {
    name: "RESPONSE"
  }
};

const prefixOption = {
  name: "--prefix",
  description:
    "Only return values with names starting with the provided prefix",
  args: {
    name: "PREFIX"
  }
};

const decryptOption = {
  name: ["-d", "--decrypt"],
  description: "Decrypt secrets and displays plain text"
};

const encryptOption = {
  name: ["-e", "--enrypt"],
  description: "Encrypt values before saving"
};

const encryptedOption = {
  name: "--enrypted",
  description:
    "Value provided is already encrypted with the instance crypto key and should be stored as-is"
};

const convertOption = {
  name: ["-c", "--convert"],
  description:
    "Convert non-string types (hash, array, boolean, int, float) to a JSON string before loading it into the datastore"
};

const scopeOption = {
  name: ["-s", "--scope"],
  description: "Scope item is under. Example: 'user'"
};

const forceOption = {
  name: "force",
  description: "Force"
};

const skipDependenciesOption = {
  name: "--skip-dependencies",
  description: "Skip dependencies"
};

const resourceTypeOption = {
  name: ["-r", "--resource-type"],
  description: "Return policy types for the resource type",
  args: {
    name: "RESOURCE_TYPE"
  }
};

const ifttOption = {
  name: "--iftt",
  description: "Show trigger and action in display list"
};

const enabledOption = {
  name: "--enabled",
  description: "Show enabled"
};

const disabledOption = {
  name: "--disabled",
  description: "Show disabled"
};

const triggerOption = {
  name: ["-g", "--trigger"],
  description: "Trigger type reference to filter the list",
  args: {
    name: "TRIGGER"
  }
};

const timerTypeOption = {
  name: ["-ty", "--timer-type"],
  description:
    "List timers type, example: 'core.st2.IntervalTimer', 'core.st2.DateTimer', 'core.st2.CronTimer'",
  args: {
    name: "TIMER_TYPE",
    suggestions: [
      "core.st2.IntervalTimer",
      "core.st2.DateTimer",
      "core.st2.CronTimer"
    ]
  }
};

const executionOption = {
  name: ["-e", "--execution"],
  description: "Execution to filter the list",
  args: {
    name: "EXECUTION"
  }
};

const ruleOption = {
  name: ["-r", "--rule"],
  description: "Rule to filter the list",
  args: {
    name: "RULE"
  }
};

const showExecutionsOption = {
  name: "--show-executions",
  description: "Only show executions"
};

const showRulesOption = {
  name: "--show-rules",
  description: "Only show rules"
};

const showTriggerInstancesOption = {
  name: "--show-trigger-instances",
  description: "Only show trigger instances"
};

const hideNoopTriggersOption = {
  name: ["-n", "--hide-noop-triggers"],
  description: "Hide noop trigger instances"
};

const groupIdOption = {
  name: "--group-id",
  description: "Group ID",
  args: {
    name: "GROUP_ID"
  }
};

const systemOption = {
  name: ["-s", "--system"],
  description: "Only display system roles"
};

const roleOption = {
  name: ["-r", "--role"],
  description: "Role to filter on",
  args: {
    name: "ROLE"
  }
};

const sourceOption = {
  name: ["-s", "--source"],
  description: "Source to filter on",
  args: {
    name: "SOURCE"
  }
};

const remoteOption = {
  name: "--remote",
  description: "Only display remote role assignments"
};

const refOrIdArg = {
  name: "ref-or-id",
  description: "Reference or ID"
};

const refOrIdArgVariadic = {
  name: "ref-or-id",
  description: "Reference or ID",
  isVariadic: true
};

const nameOrIdArg = {
  name: "name-or-id",
  description: "Name or ID"
};

const nameOrIdArgVariadic = {
  name: "name-or-id",
  description: "Name or ID",
  isVariadic: true
};

const keyOrIdArg = {
  name: "key-or-id",
  description: "Key or ID"
};

const idArg = {
  name: "id",
  description: "ID"
};

const idArgVariadic = {
  name: "id",
  description: "ID",
  isVariadic: true
};

const parametersArg = {
  name: "parameters",
  description:
    "List of keyword args, positional args, and optional args for the action",
  isVariadic: true
};

const fileArg = {
  name: "file",
  description: "JSON/YAML file",
  template: "filepaths"
};

const commandArg = {
  name: "comamnd",
  description: "Command text"
};

const usernameArg = {
  name: "username",
  description: "Name of the user"
};

const nameArg = {
  name: "name",
  description: "Name"
};

const nameArgVariadic = {
  name: "name",
  description: "Name",
  isVariadic: true
};

const valueArg = {
  name: "value",
  description: "Value"
};

const valueArgOptional = {
  name: "value",
  description: "Value",
  isOptional: true
};

const prefixArg = {
  name: "prefix",
  description: "Prefix"
};

const refArg = {
  name: "ref",
  description: "Reference"
};

const refArgVariadic = {
  name: "ref",
  description: "Reference",
  isVariadic: true
};

const packArg = {
  name: "pack",
  description: "Pack"
};

const packArgVariadic = {
  name: "pack",
  description: "Pack",
  isVariadic: true
};

const queryArg = {
  name: "query",
  description: "Query"
};

const urlArg = {
  name: "url",
  description: "URL"
};

const urlArgVariadic = {
  name: "url",
  description: "URL",
  isVariadic: true
};

const runSubcommand = {
  name: "run",
  description: "Invoke an action manually",
    options: [
    tokenOption,
    apiKeyOption,
    jsonOption,
    yamlOption,
    helpOption,
    attrOption,
    detailOption,
    keyOption,
    delayOption,
    tailOption,
    autoDictOption,
    traceTagOption,
    traceIdOption,
    asyncOption,
    inheritEnvOption,
    userOption
  ],
  args: [refOrIdArg, parametersArg]
};

const actionSubcommand = {
  name: "action",
  description: "An activity that happens as a response to the external event",
  subcommands: [
    {
      name: "list",
      description: "Get the list of actions",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        packOption
      ]
    },
    {
      name: "get",
      description: "Get individual action",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: refOrIdArgVariadic
    },
    {
      name: "create",
      description: "Create a new action",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: fileArg
    },
    {
      name: "update",
      description: "Update an existing action",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: [refOrIdArg, fileArg]
    },
    {
      name: "delete",
      description: "Delete an existing action",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        {
          name: ["-r", "--remove-files"],
          description: "Remove action files from disk"
        }
      ],
      args: refOrIdArg
    },
    {
      name: "enable",
      description: "Enable an existing action",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: refOrIdArg
    },
    {
      name: "disable",
      description: "Disable an existing action",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: refOrIdArg
    },
    {
      name: "execute",
      description: "Invoke an action manually",
            options: [
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        keyOption,
        delayOption,
        tailOption,
        autoDictOption,
        traceTagOption,
        traceIdOption,
        asyncOption,
        inheritEnvOption,
        userOption
      ],
      args: [refOrIdArg, parametersArg]
    }
  ]
};

const actionAliasSubcommand = {
  name: "action-alias",
  description: "Action aliases",
  subcommands: [
    {
      name: "list",
      description: "Get the list of action aliases",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        packOption
      ]
    },
    {
      name: "get",
      description: "Get the individual action aliases",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: refOrIdArgVariadic
    },
    {
      name: "create",
      description: "Create a new action alias",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: fileArg
    },
    {
      name: "update",
      description: "Update an existing action alias",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: [nameOrIdArg, fileArg]
    },
    {
      name: "delete",
      description: "Delete an existing action alias",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: nameOrIdArg
    },
    {
      name: "match",
      description: "Get the action alias that match the command text",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption
      ],
      args: commandArg
    },
    {
      name: "execute",
      description:
        "Execute the command text by finding a matching action alias",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        userOption
      ],
      args: commandArg
    }
  ]
};

const authSubcommand = {
  name: "auth",
  description: "Authenticate user and acquire access token",
    options: [
    helpOption,
    jsonOption,
    yamlOption,
    passwordOption,
    ttlOption,
    onlyTokenOption
  ],
  args: usernameArg
};

const loginSubcommand = {
  name: "login",
  description:
    "Authenticate user, acquire access token, and update CLI config directory",
    options: [
    helpOption,
    jsonOption,
    yamlOption,
    passwordOption,
    ttlOption,
    writePasswordOption
  ],
  args: usernameArg
};

const whoamiSubcommand = {
  name: "whoami",
  description: "Display the currently authenticated user",
    options: [helpOption, jsonOption, yamlOption]
};

const apiKeySubcommand = {
  name: "apikey",
  description: "API Keys",
    subcommands: [
    {
      name: "list",
      description: "Get the list of api keys",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        userOption,
        detailOption,
        showSecretsOption
      ]
    },
    {
      name: "get",
      description: "Get individual api key",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: keyOrIdArg
    },
    {
      name: "create",
      description: "Create a new api key",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        userOption,
        metadataOpion,
        onlyKeyOption
      ]
    },
    {
      name: "delete",
      description: "Delete an existing api key",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: keyOrIdArg
    },
    {
      name: "enable",
      description: "Enable an existing api key",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: keyOrIdArg
    },
    {
      name: "disable",
      description: "Disable an existing api key",
            options: [helpOption, tokenOption, keyOption, jsonOption, yamlOption],
      args: keyOrIdArg
    },
    {
      name: "load",
      description: "Load api key from a file",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: fileArg
    }
  ]
};

const executionSubcommand = {
  name: "execution",
  description: "An invocation of an action",
    subcommands: [
    {
      name: "list",
      description: "Get the list of the 50 most recent action executions",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        lastOption,
        sortOrderOption,
        timeStampGtOption,
        timeStampLtOption,
        showAllOption,
        attrOption,
        widthOption,
        actionOption,
        statusOption,
        userOption,
        triggerInstanceOption
      ]
    },
    {
      name: "get",
      description: "Get individual action execution",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        excludeResultOption,
        attrOption,
        detailOption,
        keyOption,
        delayOption,
        tailOption,
        autoDictOption
      ],
      args: idArgVariadic
    },
    {
      name: "re-run",
      description: "Re-run a particular action",
            options: [
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        tasksOption,
        noResetOption,
        asyncOption,
        inheritEnvOption,
        helpOption,
        attrOption,
        detailOption,
        keyOption,
        delayOption,
        tailOption,
        autoDictOption
      ],
      args: [idArg, parametersArg]
    },
    {
      name: "cancel",
      description: "Cancel action executions",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: idArgVariadic
    },
    {
      name: "pause",
      description: "Pause action executions (workflow executions only)",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        detailOption,
        keyOption,
        delayOption,
        tailOption,
        autoDictOption
      ],
      args: idArgVariadic
    },
    {
      name: "resume",
      description: "Resume action executions (workflow executions only)",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        detailOption,
        keyOption,
        delayOption,
        tailOption,
        autoDictOption
      ],
      args: idArgVariadic
    },
    {
      name: "tail",
      description: "Tail output of a particular execution",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        typeOption,
        includeMetadataOption
      ],
      args: idArg
    }
  ]
};

const inquirySubcommand = {
  name: "inquiry",
  description:
    "Inquiries provide an opportunity to ask a question and wait for a response in a workflow",
  subcommands: [
    {
      name: "list",
      description: "Get the list of the 50 most recent inquiries",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        lastOption,
        attrOption,
        widthOption
      ]
    },
    {
      name: "get",
      description: "Get individual inquiry",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: idArgVariadic
    },
    {
      name: "respond",
      description: "Respond to an inquiry",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        responseOption
      ],
      args: idArg
    }
  ]
};

const keySubcommand = {
  name: "key",
  description:
    "Key value pair is used to store commonly used configuration for reuse in sensors, actions, and rules",
  subcommands: [
    {
      name: "list",
      description: "Get the list of the 50 most recent key value pairs",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        prefixOption,
        decryptOption,
        scopeOption,
        userOption,
        lastOption
      ]
    },
    {
      name: "get",
      description: "Get individual key value pair",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        decryptOption,
        scopeOption
      ],
      args: nameArgVariadic
    },
    {
      name: "delete",
      description: "Delete an existing key value pair",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        scopeOption,
        userOption
      ],
      args: nameArg
    },
    {
      name: "set",
      description: "Set an existing key value pair",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        encryptOption,
        encryptedOption,
        ttlOption,
        scopeOption,
        userOption
      ],
      args: [nameArg, valueArgOptional]
    },
    {
      name: "load",
      description: "Load a list of key value pairs from file",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        convertOption
      ],
      args: fileArg
    },
    {
      name: "delete_by_prefix",
      description: "Delete KeyValue pairs which match the provided prefix",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        prefixOption
      ],
      args: prefixArg
    }
  ]
};

const packSubcommand = {
  name: "pack",
  description:
    "A group of related integration resources: actions, rules, and sensors",
  subcommands: [
    {
      name: "list",
      description: "Get the list of packs",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption
      ]
    },
    {
      name: "get",
      description: "Get information about an installed pack",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: refArgVariadic
    },
    {
      name: "show",
      description: "Get information about an available pack from the index",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: packArg
    },
    {
      name: "search",
      description:
        "Search the index for a pack with any attribute matching the query",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption
      ],
      args: queryArg
    },
    {
      name: "install",
      description: "Install new packs",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        widthOption,
        attrOption,
        detailOption,
        forceOption,
        skipDependenciesOption
      ],
      args: packArgVariadic
    },
    {
      name: "remove",
      description: "Remove packs",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        widthOption,
        attrOption,
        detailOption
      ],
      args: packArgVariadic
    },
    {
      name: "register",
      description: "Register pack(s): sync all file changes with DB",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        typesOption
      ],
      args: packArgVariadic
    },
    {
      name: "config",
      description: "Configure a pack based on config schema",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: nameArg
    }
  ]
};

const policySubcommand = {
  name: "policy",
  description: "Policy that is enforced on a resource",
  subcommands: [
    {
      name: "list",
      description: "Get the list of policies",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        packOption,
        resourceRefOption,
        policyTypeOption
      ]
    },
    {
      name: "get",
      description: "Get individual policy",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: refOrIdArgVariadic
    },
    {
      name: "create",
      description: "Create a new policy",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: fileArg
    },
    {
      name: "update",
      description: "Updating an existing policy",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: [refOrIdArg, fileArg]
    },
    {
      name: "delete",
      description: "Delete an existing policy",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: refOrIdArg
    }
  ]
};

const policyTypeSubcommand = {
  name: "policy-type",
  description: "Type of policy that can be applied to the resources",
  subcommands: [
    {
      name: "list",
      description: "Get the list of policy types",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        resourceTypeOption
      ]
    },
    {
      name: "get",
      description: "Get individual policy type",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: refOrIdArg
    }
  ]
};

const ruleSubcommand = {
  name: "rule",
  description:
    "A specification to invoke an 'action' on a 'trigger' selectively based on some criteria'",
  subcommands: [
    {
      name: "list",
      description: "Get the list of the 50 most recent rules",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        lastOption,
        ifttOption,
        packOption,
        enabledOption,
        disabledOption,
        actionOption,
        triggerOption
      ]
    },
    {
      name: "get",
      description: "Get individual rule",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: refOrIdArg
    },
    {
      name: "create",
      description: "Create a new rule",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: fileArg
    },
    {
      name: "update",
      description: "Update an existing rule",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: [refOrIdArg, fileArg]
    },
    {
      name: "delete",
      description: "Delete an existing rule",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: refOrIdArg
    },
    {
      name: "enable",
      description: "Enable an existing rule",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: refOrIdArg
    },
    {
      name: "disable",
      description: "Disable an existing rule",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        apiKeyOption
      ],
      args: refOrIdArg
    }
  ]
};

const webhookSubcommand = {
  name: "webhook",
  description: "Webhooks",
  subcommands: [
    {
      name: "list",
      description: "Get the list of webhooks",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        packOption
      ]
    },
    {
      name: "get",
      description: "Get individual webhooks",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: urlArgVariadic
    }
  ]
};

const timerSubcommand = {
  name: "timer",
  description: "Timers",
  subcommands: [
    {
      name: "list",
      description: "Get the list of timers",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        timerTypeOption
      ]
    },
    {
      name: "get",
      description: "Get individual timer",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: nameOrIdArgVariadic
    }
  ]
};

const runnerSubcommand = {
  name: "runner",
  description: "Runner is a type of handler for a specific class of actions",
  subcommands: [
    {
      name: "list",
      description: "List of commands for managing runners",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption
      ]
    },
    {
      name: "get",
      description: "Get individual runner",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: nameOrIdArgVariadic
    },
    {
      name: "enable",
      description: "Enable an existing runner",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: nameOrIdArg
    },
    {
      name: "disable",
      description: "Disable an existing runner",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: nameOrIdArg
    }
  ]
};

const sensorSubcommand = {
  name: "sensor",
  description:
    "An adapter which allows you to integrate StackStorm with external system",
  subcommands: [
    {
      name: "list",
      description: "Get the list of sensortypes",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        packOption
      ]
    },
    {
      name: "get",
      description: "Get individual sensor",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: refOrIdArgVariadic
    },
    {
      name: "enable",
      description: "Enable an existing sensor",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: refOrIdArg
    },
    {
      name: "disable",
      description: "Disalbe an existing sensor",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: refOrIdArg
    }
  ]
};

const traceSubcommand = {
  name: "trace",
  description:
    "A group of executions, rules and triggerinstances that are related",
  subcommands: [
    {
      name: "list",
      description: "Get the list of the 50 most recent traces",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        lastOption,
        sortOrderOption,
        traceTagOption,
        executionOption,
        ruleOption,
        triggerInstanceOption,
        attrOption,
        widthOption
      ]
    },
    {
      name: "get",
      description: "Get individual trace",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        executionOption,
        ruleOption,
        triggerInstanceOption,
        showExecutionsOption,
        showRulesOption,
        hideNoopTriggersOption
      ],
      args: idArgVariadic
    }
  ]
};

const triggerSubcommand = {
  name: "trigger",
  description:
    "An external event that is mapped to a st2 input. It is the st2 invocation point",
  subcommands: [
    {
      name: "list",
      description: "Get the list of triggers",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption,
        widthOption,
        packOption
      ]
    },
    {
      name: "get",
      description: "Get individual trigger",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: refOrIdArgVariadic
    },
    {
      name: "create",
      description: "Create a new trigger",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: fileArg
    },
    {
      name: "update",
      description: "Updating an existing trigger",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: [refOrIdArg, fileArg]
    },
    {
      name: "delete",
      description: "Delete an existing trigger",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: refOrIdArg
    },
    {
      name: "getspecs",
      description: "Return Trigger Specifications of a Trigger",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: refArg
    }
  ]
};

const triggerInstanceSubcommand = {
  name: "trigger-instance",
  description: "Actual instances of triggers received by st2",
  subcommands: [
    {
      name: "list",
      description: "Get the list of the 50 most recent triggerinstances",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        lastOption,
        timeStampGtOption,
        timeStampLtOption,
        attrOption,
        widthOption,
        triggerOption,
        statusOption
      ]
    },
    {
      name: "get",
      description: "Get individual trigger instance",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: idArgVariadic
    },
    {
      name: "re-emit",
      description: "Re-emit a particular trigger instance",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: idArgVariadic
    }
  ]
};

const ruleEnforcementSubcommand = {
  name: "rule-enforcement",
  description: "Models that represent enforcement of rules",
  subcommands: [
    {
      name: "list",
      description: "Get the list of the 50 most recent rule enforcements",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        timeStampGtOption,
        timeStampLtOption,
        attrOption,
        widthOption,
        triggerInstanceOption,
        executionOption,
        ruleOption
      ]
    },
    {
      name: "get",
      description: "Get individual rule enforcement",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: idArgVariadic
    },
    {
      name: "create",
      description: "Create a new rule enforcement",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: fileArg
    },
    {
      name: "update",
      description: "Update an existing rule enforcement",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: [nameOrIdArg, fileArg]
    },
    {
      name: "delete",
      description: "Delete an existing rule enforcement",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption],
      args: nameOrIdArg
    }
  ]
};

const workflowSubcommand = {
  name: "workflow",
  description:
    "An adapter which allows you to integrate StackStorm with external system",
  subcommands: [
    {
      name: "inspect",
      description:
        "Inspect workflow definition and return the list of errors if any",
            options: [helpOption, fileOption, actionOption]
    }
  ]
};

const serviceeRegistrySubcommand = {
  name: "service-registry",
  description: "Service registry group and membership related commands",
  subcommands: [
    {
      name: "group",
      description: "Manage service registry groups",
      subcommands: [
        {
          name: "list",
          description: "Get list of groups",
                    options: [
            helpOption,
            tokenOption,
            apiKeyOption,
            jsonOption,
            yamlOption,
            attrOption,
            widthOption
          ]
        }
      ]
    },
    {
      name: "member",
      description: "Manage service registry members",
      subcommands: [
        {
          name: "list",
          description: "Get list of group members",
                    options: [
            helpOption,
            tokenOption,
            apiKeyOption,
            jsonOption,
            yamlOption,
            attrOption,
            widthOption,
            groupIdOption
          ]
        }
      ]
    }
  ]
};

const roleSubcommand = {
  name: "role",
  description: "RBAC roles",
  subcommands: [
    {
      name: "list",
      description: "Get the list of the roles",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        systemOption,
        attrOption,
        widthOption
      ]
    },
    {
      name: "get",
      description: "Get individual role",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        attrOption
      ],
      args: idArgVariadic
    }
  ]
};

const roleAssignmentSubcommand = {
  name: "role-assignment",
  description: "RBAC role assignments",
  subcommands: [
    {
      name: "list",
      description: "Get the list of role assignments",
            options: [helpOption, tokenOption, apiKeyOption, jsonOption, yamlOption]
    },
    {
      name: "get",
      description: "Get individual assignment",
            options: [
        helpOption,
        tokenOption,
        apiKeyOption,
        jsonOption,
        yamlOption,
        roleOption,
        userOption,
        sourceOption,
        remoteOption,
        attrOption,
        widthOption
      ]
    }
  ]
};

const completionSpec = {
  name: "st2",
  description: "CLI for StackStorm event-driven automation platform",
  subcommands: [
    runSubcommand,
    actionSubcommand,
    actionAliasSubcommand,
    authSubcommand,
    loginSubcommand,
    whoamiSubcommand,
    apiKeySubcommand,
    executionSubcommand,
    inquirySubcommand,
    keySubcommand,
    packSubcommand,
    policySubcommand,
    policyTypeSubcommand,
    ruleSubcommand,
    webhookSubcommand,
    timerSubcommand,
    runnerSubcommand,
    sensorSubcommand,
    traceSubcommand,
    triggerSubcommand,
    triggerInstanceSubcommand,
    ruleEnforcementSubcommand,
    workflowSubcommand,
    serviceeRegistrySubcommand,
    roleSubcommand,
    roleAssignmentSubcommand
  ],
  options: [
    {
      name: ["--help", "-h"],
      description: "Show this help message and exit",
      priority: 60
    },
    {
      name: "--version",
      description: "Show program's version number and exit"
    },
    {
      name: "--url",
      description:
        "Base URL for the API servers. Assumes all servers use the same base URL and default ports are used. Get ST2_BASE_URL from the environment variables by default",
      args: {
        name: "BASE_URL"
      }
    },
    {
      name: "--auth-url",
      description:
        "URL for the authentication service. Get ST2_AUTH_URL from the environment variables by default",
      args: {
        name: "AUTH_URL"
      }
    },
    {
      name: "--api-url",
      description:
        "URL for the API server. Get ST2_API_URL from the environment variables by default",
      args: {
        name: "API_URL"
      }
    },
    {
      name: "--stream-url",
      description:
        "URL for the stream endpoint. Get ST2_STREAM_URLfrom the environment variables by default",
      args: {
        name: "ST2_STREAM_URL"
      }
    },
    {
      name: "--api-version",
      description:
        "API version to use. Get ST2_API_VERSION from the environment variables by default",
      args: {
        name: "API_VERSION"
      }
    },
    {
      name: "--cacert",
      description:
        "Path to the CA cert bundle for the SSL endpoints. Get ST2_CACERT from the environment variables by default. If this is not provided, then SSL cert will not be verified",
      args: {
        name: "CACERT"
      }
    },
    {
      name: "--config-file",
      description: "Path to the CLI config file",
      args: {
        name: "CONFIG_FILE"
      }
    },
    {
      name: "--print-config",
      description: "Parse the config file and print the values"
    },
    {
      name: "--skip-config",
      description: "Don't parse and use the CLI config file"
    },
    {
      name: "--debug",
      description: "Enable debug mode"
    }
  ]
};
export default completionSpec;
