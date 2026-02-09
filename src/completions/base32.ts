// base32 completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const completionSpec= {
  name: "base32",
  description: "Base32 encode/decode data and print to standard output",
    options: [
    {
      name: ["--help", "-h"],
      description: "Display this help and exit"
    },
    {
      name: ["--decode", "-d"],
      description: "Decode data"
    },
    {
      name: ["--ignore-garbage", "-i"],
      description: "When decoding, ignore non-alphabet characters"
    },
    {
      name: ["--wrap", "-w"],
      description:
        "Wrap encoded lines after COLS character (default 76).  Use 0 to disable line wrapping",
      args: {
        name: "COLS",
        suggestions: [{ name: "76" }, { name: "78" }, { name: "80" }, { name: "100" }, { name: "120" }, { name: "160" }, { name: "0" }],
        default: "76"
      }
    },
    {
      name: "--version",
      description: "Output version information and exit"
    }
  ],
  args: {
    name: "FILE",
    description: "File to base32 encode/decode",
    template: "filepaths"
  }
};
export default completionSpec;
