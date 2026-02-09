// create-react-native-app completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const ICONS = {
  help: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
  version:
    "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/info.png",
  true: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
  false:
    "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
  skip: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
  path: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/path.png",
  string:
    "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
  template:
    "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/export.png",
  npm: "fig://icon?type=npm"
};

const boolArg= {
  name: "boolean",
  isOptional: true,
  suggestions: [
    {
      name: "true",
      icon: ICONS.true
    },
    {
      name: "false",
      icon: ICONS.false
    }
  ]
};

const completionSpec= {
  name: "create-react-native-app",
  description: "Creates a new React Native project",
  args: {
    template: "folders",
    name: "name"
  },
  options: [
    // template
    {
      name: "--template",
      description:
        "The name of a template from expo/examples or URL to a GitHub repo that contains an example",
      args: {
        name: "template"
      },
      icon: ICONS.template,
      priority: 76
    },
    {
      name: "--template-path",
      description: "The path inside of a GitHub repo where the example lives",
      args: {
        name: "name"
      },
      icon: ICONS.path,
      priority: 76
    },
    // bool
    {
      name: "--yes",
      description: "Use the default options for creating a project",
      args: boolArg,
      icon: ICONS.skip,
      priority: 76
    },
    {
      name: "--no-install",
      description: "Skip installing npm packages or CocoaPods",
      args: boolArg,
      icon: ICONS.skip,
      priority: 76
    },
    {
      name: "--use-npm",
      description:
        "Use npm to install dependencies. (default when Yarn is not installed)",
      args: boolArg,
      icon: ICONS.npm,
      priority: 76
    },

    // Info
    {
      name: ["-h", "--help"],
      description: "Output usage information",
      icon: ICONS.help,
      priority: 1
    },
    {
      name: ["-V", "--version"],
      description: "Output the version number",
      icon: ICONS.version,
      priority: 1
    }
  ]
};

export default completionSpec;
