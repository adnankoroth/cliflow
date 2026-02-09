// ssh-keygen - SSH key generation, management and conversion
import { CompletionSpec } from '../types.js';

export const sshKeygenSpec: CompletionSpec = {
  name: 'ssh-keygen',
  description: 'SSH key generation, management and conversion',
  options: [
    // Key generation
    { name: '-t', description: 'Key type', args: { name: 'type', suggestions: [{ name: 'rsa', description: 'RSA key' }, { name: 'dsa', description: 'DSA key (deprecated)' }, { name: 'ecdsa', description: 'ECDSA key' }, { name: 'ecdsa-sk', description: 'ECDSA with security key' }, { name: 'ed25519', description: 'Ed25519 key (recommended)' }, { name: 'ed25519-sk', description: 'Ed25519 with security key' }] } },
    { name: '-b', description: 'Key bits', args: { name: 'bits', suggestions: [{ name: '2048' }, { name: '3072' }, { name: '4096' }, { name: '256', description: 'For ECDSA' }, { name: '384', description: 'For ECDSA' }, { name: '521', description: 'For ECDSA' }] } },
    { name: '-a', description: 'KDF rounds', args: { name: 'rounds' } },
    { name: '-C', description: 'Comment', args: { name: 'comment' } },
    { name: '-f', description: 'Key file', args: { name: 'file', template: 'filepaths' } },
    { name: '-N', description: 'New passphrase', args: { name: 'passphrase' } },
    { name: '-P', description: 'Old passphrase', args: { name: 'passphrase' } },
    { name: '-q', description: 'Quiet mode' },
    { name: '-v', description: 'Verbose mode', isRepeatable: true },

    // Key management
    { name: '-p', description: 'Change passphrase' },
    { name: '-l', description: 'Show fingerprint' },
    { name: '-B', description: 'Show bubble babble digest' },
    { name: '-E', description: 'Fingerprint hash algorithm', args: { name: 'algorithm', suggestions: [{ name: 'sha256', description: 'SHA-256 (default)' }, { name: 'md5', description: 'MD5 (legacy)' }] } },
    { name: '-c', description: 'Change comment' },
    { name: '-e', description: 'Export to other format' },
    { name: '-i', description: 'Import from other format' },
    { name: '-m', description: 'Key format', args: { name: 'format', suggestions: [{ name: 'RFC4716', description: 'RFC 4716 format' }, { name: 'PKCS8', description: 'PKCS#8 format' }, { name: 'PEM', description: 'PEM format' }] } },
    { name: '-y', description: 'Read private key and output public key' },

    // Certificate authority
    { name: '-s', description: 'Sign key with CA', args: { name: 'ca_key', template: 'filepaths' } },
    { name: '-I', description: 'Key identity', args: { name: 'identity' } },
    { name: '-h', description: 'Create host certificate' },
    { name: '-U', description: 'Use ssh-agent CA key' },
    { name: '-n', description: 'Principals', args: { name: 'principals' } },
    { name: '-O', description: 'Certificate option', args: { name: 'option', suggestions: [{ name: 'clear', description: 'Clear all permissions' }, { name: 'critical:', description: 'Critical extension' }, { name: 'extension:', description: 'Extension' }, { name: 'force-command=', description: 'Force command' }, { name: 'no-agent-forwarding', description: 'Disable agent forwarding' }, { name: 'no-port-forwarding', description: 'Disable port forwarding' }, { name: 'no-pty', description: 'Disable PTY' }, { name: 'no-user-rc', description: 'Disable user rc' }, { name: 'no-x11-forwarding', description: 'Disable X11 forwarding' }, { name: 'permit-agent-forwarding', description: 'Allow agent forwarding' }, { name: 'permit-port-forwarding', description: 'Allow port forwarding' }, { name: 'permit-pty', description: 'Allow PTY' }, { name: 'permit-user-rc', description: 'Allow user rc' }, { name: 'permit-x11-forwarding', description: 'Allow X11 forwarding' }, { name: 'source-address=', description: 'Source address restriction' }, { name: 'verify-required', description: 'Require verification' }] }, isRepeatable: true },
    { name: '-V', description: 'Validity interval', args: { name: 'interval' } },
    { name: '-z', description: 'Serial number', args: { name: 'serial' } },
    { name: '-L', description: 'Show certificate info' },

    // Known hosts
    { name: '-F', description: 'Find host in known_hosts', args: { name: 'hostname' } },
    { name: '-H', description: 'Hash known hosts file' },
    { name: '-R', description: 'Remove host from known_hosts', args: { name: 'hostname' } },

    // Revocation
    { name: '-k', description: 'Generate KRL' },
    { name: '-Q', description: 'Query KRL' },
    { name: '-u', description: 'Update KRL' },

    // FIDO/Security keys
    { name: '-w', description: 'FIDO provider library', args: { name: 'library', template: 'filepaths' } },
    { name: '-K', description: 'Download resident keys from security key' },

    // Signing
    { name: '-Y', description: 'Signature operation', args: { name: 'operation', suggestions: [{ name: 'sign', description: 'Sign file' }, { name: 'verify', description: 'Verify signature' }, { name: 'check-novalidate', description: 'Check without validation' }, { name: 'find-principals', description: 'Find principals' }, { name: 'match-principals', description: 'Match principals' }] } },

    // Other options
    { name: '-A', description: 'Generate all host keys' },
    { name: '-D', description: 'Use PKCS#11 library', args: { name: 'library', template: 'filepaths' } },
    { name: '-g', description: 'Use generic DNS format' },
    { name: '-M', description: 'Moduli operation', args: { name: 'operation', suggestions: [{ name: 'generate', description: 'Generate moduli candidates' }, { name: 'screen', description: 'Screen moduli candidates' }] } },
    { name: '-o', description: 'Use new format (default)' },
    { name: '-r', description: 'Print DNS resource record', args: { name: 'hostname' } },
    { name: '-W', description: 'Generator for moduli', args: { name: 'generator' } },
    { name: '-G', description: 'Generate moduli candidates', args: { name: 'output', template: 'filepaths' } },
    { name: '-T', description: 'Screen moduli candidates', args: { name: 'output', template: 'filepaths' } },
    { name: '-S', description: 'Start point for moduli screening', args: { name: 'start' } },
    { name: '-J', description: 'Lines to skip in moduli file', args: { name: 'lines' } },
    { name: '-j', description: 'Lines to screen in moduli file', args: { name: 'lines' } },
    { name: '-K', description: 'Generate checkpoint file', args: { name: 'checkpoint', template: 'filepaths' } },

    // Output
    { name: '-Z', description: 'Cipher for private key encryption', args: { name: 'cipher', suggestions: [{ name: 'aes256-ctr' }, { name: 'aes256-gcm@openssh.com' }, { name: 'chacha20-poly1305@openssh.com' }, { name: 'aes128-ctr' }, { name: 'aes192-ctr' }, { name: '3des-cbc' }] } },
  ],
  args: { name: 'file', description: 'Key file', template: 'filepaths', isOptional: true },
};
