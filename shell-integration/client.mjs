#!/usr/bin/env node
// CLIFlow completion client - used by shell integration
import { connect } from 'net';
import { homedir } from 'os';
import { join } from 'path';

const SOCKET_PATH = join(homedir(), '.cliflow', 'cliflow.sock');
const request = process.argv[2];

if (!request) {
  process.exit(1);
}

const client = connect(SOCKET_PATH);
let buffer = '';

client.on('connect', () => {
  client.write(request + '\n');
});

client.on('data', (data) => {
  buffer += data.toString();
  // For TSV responses, read the header "OK\t<count>" and wait until
  // all <count> suggestion rows have arrived, then close.
  if (buffer.startsWith('OK\t') || buffer.startsWith('ERR\t')) {
    const lines = buffer.split('\n').filter(l => l.length > 0);
    if (lines.length >= 1) {
      const count = parseInt(lines[0].split('\t')[1], 10) || 0;
      // Header + count data rows received
      if (lines.length >= count + 1) {
        process.stdout.write(buffer);
        client.end();
      }
    }
  } else {
    // JSON response: single line, close immediately
    if (buffer.includes('\n')) {
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          console.log(line);
          client.end();
          return;
        }
      }
    }
  }
});

client.on('error', () => {
  process.exit(1);
});

client.on('close', () => {
  process.exit(0);
});

// Timeout after 3 seconds
setTimeout(() => {
  process.exit(1);
}, 3000);
