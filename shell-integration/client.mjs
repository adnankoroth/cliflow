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
  // Check if we got a complete JSON response (ends with newline)
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
