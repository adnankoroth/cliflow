// dd completion spec for CLIFlow
// Auto-converted from Fig.io spec: https://github.com/withfig/autocomplete
// License: MIT

import { CompletionSpec, Subcommand, Option, Suggestion } from '../types.js';

const convValues= [
  {
    name: "ascii",
    icon: '📝',
    description:
      "The same as 'unblock' except characters are translated from EBCDIC to ASCII"
  },
  {
    name: "oldascii",
    icon: '📝',
    description:
      "The same as 'unblock' except characters are translated from EBCDIC to ASCII"
  },
  {
    name: "block",
    icon: '📝',
    description:
      "Treats the input as a sequence of newline or EOF-terminated variable length records of independent input and output block boundaries"
  },
  {
    name: "ebcdic",
    icon: '📝',
    description:
      "The same as the 'block' value except that characters are translated from ASCII to EBCDIC after the records are converted"
  },
  {
    name: "ibm",
    icon: '📝',
    description:
      "The same as the 'block' value except that characters are translated from ASCII to EBCDIC after the records are converted"
  },
  {
    name: "oldebcdic",
    icon: '📝',
    description:
      "The same as the 'block' value except that characters are translated from ASCII to EBCDIC after the records are converted"
  },
  {
    name: "oldibm",
    icon: '📝',
    description:
      "The same as the 'block' value except that characters are translated from ASCII to EBCDIC after the records are converted"
  },
  {
    name: "lcase",
    icon: '📝',
    description: "Transform uppercase characters into lowercase characters"
  },
  {
    name: "noerror",
    icon: '📝',
    description: "Do not stop processing on an input error"
  },
  {
    name: "notrunc",
    icon: '📝',
    description:
      "Do not truncate the output file. This will preserve any blocks in the output file not explicitly written by dd"
  },
  {
    name: "osync",
    icon: '📝',
    description: "Pad the final output block to the full output block size"
  },
  {
    name: "sparse",
    icon: '📝',
    description:
      "If one or more output blocks would consist solely of NUL bytes, try to seek the output file by the required space instead of filling them with NULs, resulting in a sparse file"
  },
  {
    name: "swab",
    icon: '📝',
    description: "Swap every pair of input bytes"
  },
  {
    name: "sync",
    icon: '📝',
    description: "Pad every input block to the input buffer size"
  },
  {
    name: "ucase",
    icon: '📝',
    description: "Transform lowercase characters into uppercase characters"
  },
  {
    name: "unblock",
    icon: '📝',
    description:
      "Treats the input as a sequence of fixed length records independent of input and output block boundaries"
  }
];

const completionSpec= {
  name: "dd",
  description: "Convert and copy a file",
    // dd has "operands", which are most closely modeled as options in a Fig spec.
  // Asterisk *feels* a lot better than the default option icon here.
  options: [
    {
      name: "bs",
      icon: '✨',
      description: "Set input and output block size",
      requiresSeparator: true,
      args: {
        name: "size"
      }
    },
    {
      name: "cbs",
      icon: '✨',
      description: "Set the conversion record size",
      requiresSeparator: true,
      args: {
        name: "size"
      }
    },
    {
      name: "count",
      icon: '✨',
      description: "Copy this many input blocks",
      requiresSeparator: true,
      args: {
        name: "number"
      }
    },
    {
      name: "files",
      icon: '✨',
      description: "Copy this many files before terminating",
      requiresSeparator: true,
      args: {
        name: "number"
      }
    },
    {
      name: "ibs",
      icon: '✨',
      description: "Set the input block size",
      requiresSeparator: true,
      args: {
        name: "size",
        default: "512"
      }
    },
    {
      name: "if",
      icon: '✨',
      description: "Read an input file instead of stdin",
      requiresSeparator: true,
      priority: 60,
      args: {
        name: "file",
        template: "filepaths"
      }
    },
    {
      name: "iseek",
      icon: '✨',
      description: "Seek this many blocks on the input file",
      requiresSeparator: true,
      args: {
        name: "blocks"
      }
    },
    {
      name: "obs",
      icon: '✨',
      description: "Set the output block size",
      requiresSeparator: true,
      args: {
        name: "size",
        default: "512"
      }
    },
    {
      name: "of",
      icon: '✨',
      description: "Write to an output file instead of stdout",
      requiresSeparator: true,
      priority: 59,
      args: {
        name: "file",
        template: "filepaths",
        suggestCurrentToken: true
      }
    },
    {
      name: "oseek",
      icon: '✨',
      description: "Seek this many blocks on the output file",
      requiresSeparator: true,
      args: {
        name: "blocks"
      }
    },
    {
      name: "seek",
      icon: '✨',
      description:
        "Seek this many blocks from the beginning of the output before copying",
      requiresSeparator: true,
      args: {
        name: "blocks"
      }
    },
    {
      name: "skip",
      icon: '✨',
      description:
        "Skip this many blocks from the beginning of the input before copying",
      requiresSeparator: true,
      args: {
        name: "blocks"
      }
    },
    {
      name: "conv",
      icon: '✨',
      description: "Convert input data (comma-separated list)",
      requiresSeparator: true,
      args: {
        name: "value"
              }
    }
  ]
};
export default completionSpec;
