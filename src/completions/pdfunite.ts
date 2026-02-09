// pdfunite completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';


const completionSpec = {
  name: "pdfunite",
  description: "Combine multiple pdfs",
  options: [
    { name: "-v", description: "Print copyright and version info" },
    { name: ["-h", "--help", "-?"], description: "Print usage information" }
  ],
  args: {
    template: "filepaths",
    isVariadic: true
  }
};

export default completionSpec;
