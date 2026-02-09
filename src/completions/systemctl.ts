// systemctl - Control the systemd system and service manager
import { CompletionSpec } from '../types.js';

const unitArgs = {
  name: 'unit',
  description: 'Unit name',
  isVariadic: true,
};

const serviceArgs = {
  name: 'service',
  description: 'Service name',
  isVariadic: true,
};

const unitTypeOptions = [
  { name: ['-t', '--type'], description: 'List units of type', args: { name: 'type', suggestions: [{ name: 'service' }, { name: 'socket' }, { name: 'target' }, { name: 'device' }, { name: 'mount' }, { name: 'automount' }, { name: 'swap' }, { name: 'timer' }, { name: 'path' }, { name: 'slice' }, { name: 'scope' }] } },
  { name: '--state', description: 'List units in state', args: { name: 'state', suggestions: [{ name: 'active' }, { name: 'inactive' }, { name: 'running' }, { name: 'dead' }, { name: 'failed' }, { name: 'waiting' }, { name: 'exited' }, { name: 'mounted' }, { name: 'listening' }] } },
];

export const systemctlSpec: CompletionSpec = {
  name: 'systemctl',
  description: 'Control the systemd system and service manager',
  options: [
    { name: ['-h', '--help'], description: 'Show help' },
    { name: '--version', description: 'Show version' },
    { name: ['-t', '--type'], description: 'List units of type', args: { name: 'type', suggestions: [{ name: 'service' }, { name: 'socket' }, { name: 'target' }, { name: 'device' }, { name: 'mount' }, { name: 'automount' }, { name: 'swap' }, { name: 'timer' }, { name: 'path' }, { name: 'slice' }, { name: 'scope' }] } },
    { name: '--state', description: 'List units in state', args: { name: 'state', suggestions: [{ name: 'active' }, { name: 'inactive' }, { name: 'running' }, { name: 'dead' }, { name: 'failed' }, { name: 'waiting' }, { name: 'exited' }, { name: 'mounted' }, { name: 'listening' }] } },
    { name: ['-p', '--property'], description: 'Show property', args: { name: 'property' } },
    { name: '--value', description: 'Show property value only' },
    { name: ['-a', '--all'], description: 'Show all units/properties' },
    { name: ['-r', '--recursive'], description: 'Show units of local containers' },
    { name: '--reverse', description: 'Show reverse dependencies' },
    { name: '--with-dependencies', description: 'Show dependencies recursively' },
    { name: '--after', description: 'Show units ordered after' },
    { name: '--before', description: 'Show units ordered before' },
    { name: ['-l', '--full'], description: 'Don\'t truncate output' },
    { name: '--show-types', description: 'Show socket types' },
    { name: '--job-mode', description: 'Job mode', args: { name: 'mode', suggestions: [{ name: 'fail' }, { name: 'replace' }, { name: 'replace-irreversibly' }, { name: 'isolate' }, { name: 'ignore-dependencies' }, { name: 'ignore-requirements' }, { name: 'flush' }] } },
    { name: '--fail', description: 'Fail if unit exists' },
    { name: ['-i', '--ignore-inhibitors'], description: 'Ignore inhibitors' },
    { name: ['-q', '--quiet'], description: 'Suppress output' },
    { name: '--wait', description: 'Wait until units stopped' },
    { name: '--no-block', description: 'Don\'t wait for operation' },
    { name: '--no-wall', description: 'Don\'t send wall message' },
    { name: '--no-reload', description: 'Don\'t reload daemon' },
    { name: '--no-legend', description: 'Don\'t show legend' },
    { name: '--no-pager', description: 'Disable pager' },
    { name: '--no-ask-password', description: 'Don\'t ask for password' },
    { name: '--system', description: 'Connect to system manager' },
    { name: '--user', description: 'Connect to user manager' },
    { name: ['-H', '--host'], description: 'Execute on remote host', args: { name: 'host' } },
    { name: ['-M', '--machine'], description: 'Execute in container', args: { name: 'machine' } },
    { name: '--kill-who', description: 'Who to kill', args: { name: 'who', suggestions: [{ name: 'main' }, { name: 'control' }, { name: 'all' }] } },
    { name: ['-s', '--signal'], description: 'Signal to send', args: { name: 'signal', suggestions: [{ name: 'SIGHUP' }, { name: 'SIGTERM' }, { name: 'SIGKILL' }, { name: 'SIGINT' }, { name: 'SIGUSR1' }, { name: 'SIGUSR2' }] } },
    { name: ['-f', '--force'], description: 'Force' },
    { name: '--now', description: 'Start/stop unit in addition to enabling/disabling' },
    { name: '--root', description: 'Root directory', args: { name: 'path', template: 'folders' } },
    { name: '--runtime', description: 'Enable only temporarily' },
    { name: '--preset-mode', description: 'Preset mode', args: { name: 'mode', suggestions: [{ name: 'full' }, { name: 'enable-only' }, { name: 'disable-only' }] } },
    { name: ['-n', '--lines'], description: 'Number of lines', args: { name: 'lines' } },
    { name: ['-o', '--output'], description: 'Output format', args: { name: 'format', suggestions: [{ name: 'short' }, { name: 'short-full' }, { name: 'short-iso' }, { name: 'short-iso-precise' }, { name: 'short-precise' }, { name: 'short-monotonic' }, { name: 'short-unix' }, { name: 'verbose' }, { name: 'export' }, { name: 'json' }, { name: 'json-pretty' }, { name: 'json-sse' }, { name: 'json-seq' }, { name: 'cat' }, { name: 'with-unit' }] } },
    { name: '--plain', description: 'Plain output for list-*' },
    { name: '--firmware-setup', description: 'Reboot to firmware setup' },
    { name: '--boot-loader-menu', description: 'Show boot loader menu', args: { name: 'timeout' } },
    { name: '--boot-loader-entry', description: 'Boot to loader entry', args: { name: 'entry' } },
    { name: '--marked', description: 'Show marked' },
    { name: '--global', description: 'Enable/disable unit globally' },
    { name: '--check-inhibitors', description: 'Check inhibitors', args: { name: 'mode', suggestions: [{ name: 'auto' }, { name: 'yes' }, { name: 'no' }] } },
    { name: '--dry-run', description: 'Only print what would happen' },
    { name: '--timestamp', description: 'Timestamp format', args: { name: 'format', suggestions: [{ name: 'pretty' }, { name: 'us' }, { name: 'utc' }, { name: 'us+utc' }] } },
    { name: '--read-only', description: 'Mount read-only' },
    { name: '--mkdir', description: 'Create mount point' },
  ],
  subcommands: [
    // Unit commands
    { name: 'start', description: 'Start units', args: unitArgs },
    { name: 'stop', description: 'Stop units', args: unitArgs },
    { name: 'reload', description: 'Reload units', args: unitArgs },
    { name: 'restart', description: 'Restart units', args: unitArgs },
    { name: 'try-restart', description: 'Restart units if running', args: unitArgs },
    { name: 'reload-or-restart', description: 'Reload or restart units', args: unitArgs },
    { name: 'try-reload-or-restart', description: 'Reload or restart units if running', args: unitArgs },
    { name: 'isolate', description: 'Start unit and stop all others', args: { name: 'unit' } },
    { name: 'kill', description: 'Send signal to processes', args: unitArgs, options: [{ name: '--kill-who', args: { name: 'who', suggestions: [{ name: 'main' }, { name: 'control' }, { name: 'all' }] } }, { name: ['-s', '--signal'], args: { name: 'signal' } }] },
    { name: 'clean', description: 'Clean runtime/state/cache', args: unitArgs, options: [{ name: '--what', args: { name: 'what', suggestions: [{ name: 'configuration' }, { name: 'state' }, { name: 'cache' }, { name: 'logs' }, { name: 'runtime' }, { name: 'fdstore' }, { name: 'all' }] } }] },
    { name: 'freeze', description: 'Freeze execution of units', args: unitArgs },
    { name: 'thaw', description: 'Resume execution of frozen units', args: unitArgs },
    { name: 'set-property', description: 'Set unit properties', args: [{ name: 'unit' }, { name: 'property=value', isVariadic: true }], options: [{ name: '--runtime', description: 'Set temporarily' }] },
    { name: 'bind', description: 'Bind mount a path from the host into a unit', args: [{ name: 'unit' }, { name: 'source', template: 'filepaths' }, { name: 'dest', template: 'filepaths', isOptional: true }], options: [{ name: '--read-only' }, { name: '--mkdir' }] },
    { name: 'mount-image', description: 'Mount disk image into running unit', args: [{ name: 'unit' }, { name: 'image', template: 'filepaths' }, { name: 'path', template: 'filepaths', isOptional: true }], options: [{ name: '--read-only' }, { name: '--mkdir' }] },
    { name: 'service-log-level', description: 'Get/set service log level', args: [{ name: 'service' }, { name: 'level', isOptional: true, suggestions: [{ name: 'emerg' }, { name: 'alert' }, { name: 'crit' }, { name: 'err' }, { name: 'warning' }, { name: 'notice' }, { name: 'info' }, { name: 'debug' }] }] },
    { name: 'service-log-target', description: 'Get/set service log target', args: [{ name: 'service' }, { name: 'target', isOptional: true, suggestions: [{ name: 'console' }, { name: 'kmsg' }, { name: 'journal' }, { name: 'journal-or-kmsg' }, { name: 'auto' }, { name: 'null' }] }] },
    { name: 'reset-failed', description: 'Reset failed state', args: { ...unitArgs, isOptional: true } },

    // Unit file commands
    { name: 'list-unit-files', description: 'List installed unit files', options: unitTypeOptions, args: { name: 'pattern', isOptional: true, isVariadic: true } },
    { name: 'enable', description: 'Enable unit files', options: [{ name: '--now', description: 'Start units' }, { name: '--runtime', description: 'Enable temporarily' }, { name: '--force', description: 'Override symlinks' }, { name: '--global', description: 'Enable globally' }], args: serviceArgs },
    { name: 'disable', description: 'Disable unit files', options: [{ name: '--now', description: 'Stop units' }, { name: '--runtime', description: 'Disable temporarily' }, { name: '--global', description: 'Disable globally' }], args: serviceArgs },
    { name: 'reenable', description: 'Reenable unit files', options: [{ name: '--now', description: 'Start units' }, { name: '--runtime', description: 'Enable temporarily' }], args: serviceArgs },
    { name: 'preset', description: 'Enable/disable by preset', options: [{ name: '--preset-mode', args: { name: 'mode', suggestions: [{ name: 'full' }, { name: 'enable-only' }, { name: 'disable-only' }] } }, { name: '--now', description: 'Start/stop units' }, { name: '--runtime', description: 'Enable temporarily' }], args: serviceArgs },
    { name: 'preset-all', description: 'Enable/disable all by preset', options: [{ name: '--preset-mode', args: { name: 'mode', suggestions: [{ name: 'full' }, { name: 'enable-only' }, { name: 'disable-only' }] } }, { name: '--runtime', description: 'Enable temporarily' }] },
    { name: 'is-enabled', description: 'Check if unit is enabled', args: serviceArgs },
    { name: 'mask', description: 'Mask unit files', options: [{ name: '--now', description: 'Stop units' }, { name: '--runtime', description: 'Mask temporarily' }], args: serviceArgs },
    { name: 'unmask', description: 'Unmask unit files', options: [{ name: '--runtime', description: 'Unmask temporarily' }], args: serviceArgs },
    { name: 'link', description: 'Link unit file', args: { name: 'path', template: 'filepaths', isVariadic: true } },
    { name: 'revert', description: 'Revert to vendor unit file', args: serviceArgs },
    { name: 'add-wants', description: 'Add wants dependency', args: [{ name: 'target' }, { name: 'unit', isVariadic: true }] },
    { name: 'add-requires', description: 'Add requires dependency', args: [{ name: 'target' }, { name: 'unit', isVariadic: true }] },
    { name: 'set-default', description: 'Set default target', args: { name: 'target' } },
    { name: 'get-default', description: 'Get default target' },
    { name: 'edit', description: 'Edit unit file', options: [{ name: '--full', description: 'Edit full file' }, { name: '--force', description: 'Create new unit' }, { name: '--runtime', description: 'Edit runtime config' }, { name: '--stdin', description: 'Read from stdin' }, { name: '--drop-in', description: 'Edit drop-in file', args: { name: 'name' } }], args: serviceArgs },

    // Machine commands
    { name: 'list-machines', description: 'List running containers' },

    // Job commands
    { name: 'list-jobs', description: 'List pending jobs', args: { name: 'pattern', isOptional: true, isVariadic: true } },
    { name: 'cancel', description: 'Cancel pending jobs', args: { name: 'job', isOptional: true, isVariadic: true } },

    // Environment commands
    { name: 'show-environment', description: 'Show manager environment' },
    { name: 'set-environment', description: 'Set environment variable', args: { name: 'variable=value', isVariadic: true } },
    { name: 'unset-environment', description: 'Unset environment variable', args: { name: 'variable', isVariadic: true } },
    { name: 'import-environment', description: 'Import environment', args: { name: 'variable', isOptional: true, isVariadic: true } },

    // Manager state commands
    { name: 'daemon-reload', description: 'Reload systemd manager configuration' },
    { name: 'daemon-reexec', description: 'Reexecute systemd manager' },
    { name: 'log-level', description: 'Get/set logging level', args: { name: 'level', isOptional: true, suggestions: [{ name: 'emerg' }, { name: 'alert' }, { name: 'crit' }, { name: 'err' }, { name: 'warning' }, { name: 'notice' }, { name: 'info' }, { name: 'debug' }] } },
    { name: 'log-target', description: 'Get/set logging target', args: { name: 'target', isOptional: true, suggestions: [{ name: 'console' }, { name: 'journal' }, { name: 'kmsg' }, { name: 'journal-or-kmsg' }, { name: 'null' }] } },
    { name: 'service-watchdogs', description: 'Get/set service watchdog state', args: { name: 'bool', isOptional: true, suggestions: [{ name: 'yes' }, { name: 'no' }] } },

    // System commands
    { name: 'is-system-running', description: 'Check if system is running', options: [{ name: '--wait', description: 'Wait until running' }] },
    { name: 'default', description: 'Enter default mode' },
    { name: 'rescue', description: 'Enter rescue mode' },
    { name: 'emergency', description: 'Enter emergency mode' },
    { name: 'halt', description: 'Shut down and halt', options: [{ name: '--force', description: 'Force halt' }, { name: '--no-wall', description: 'Don\'t send message' }] },
    { name: 'poweroff', description: 'Shut down and power off', options: [{ name: '--force', description: 'Force power off' }, { name: '--no-wall', description: 'Don\'t send message' }] },
    { name: 'reboot', description: 'Shut down and reboot', options: [{ name: '--force', description: 'Force reboot' }, { name: '--no-wall', description: 'Don\'t send message' }, { name: '--firmware-setup', description: 'Reboot to firmware' }], args: { name: 'argument', isOptional: true } },
    { name: 'kexec', description: 'Shut down and kexec', options: [{ name: '--force', description: 'Force kexec' }, { name: '--no-wall', description: 'Don\'t send message' }] },
    { name: 'exit', description: 'Exit user session', options: [{ name: '--force', description: 'Force exit' }], args: { name: 'code', isOptional: true } },
    { name: 'switch-root', description: 'Switch to different root', args: [{ name: 'root', template: 'folders' }, { name: 'init', template: 'filepaths', isOptional: true }] },
    { name: 'suspend', description: 'Suspend system' },
    { name: 'hibernate', description: 'Hibernate system' },
    { name: 'hybrid-sleep', description: 'Hybrid sleep system' },
    { name: 'suspend-then-hibernate', description: 'Suspend then hibernate' },

    // Introspection commands
    { name: 'list-units', description: 'List running units', options: [...unitTypeOptions, { name: ['-a', '--all'], description: 'Show all units' }], args: { name: 'pattern', isOptional: true, isVariadic: true } },
    { name: 'list-sockets', description: 'List socket units', options: [{ name: '--show-types', description: 'Show socket types' }], args: { name: 'pattern', isOptional: true, isVariadic: true } },
    { name: 'list-timers', description: 'List timer units', options: [{ name: ['-a', '--all'], description: 'Show all timers' }], args: { name: 'pattern', isOptional: true, isVariadic: true } },
    { name: 'list-automounts', description: 'List automount units', args: { name: 'pattern', isOptional: true, isVariadic: true } },
    { name: 'list-paths', description: 'List path units', args: { name: 'pattern', isOptional: true, isVariadic: true } },
    { name: 'status', description: 'Show unit status', options: [{ name: ['-l', '--full'], description: 'Full output' }, { name: ['-n', '--lines'], description: 'Number of log lines', args: { name: 'lines' } }, { name: ['-o', '--output'], description: 'Output format', args: { name: 'format', suggestions: [{ name: 'short' }, { name: 'short-full' }, { name: 'short-iso' }, { name: 'verbose' }, { name: 'json' }, { name: 'json-pretty' }, { name: 'cat' }] } }, { name: '--no-pager', description: 'Disable pager' }], args: { ...unitArgs, isOptional: true } },
    { name: 'show', description: 'Show properties', options: [{ name: ['-p', '--property'], description: 'Show property', args: { name: 'property' } }, { name: '--value', description: 'Show value only' }, { name: ['-a', '--all'], description: 'Show all properties' }], args: { ...unitArgs, isOptional: true } },
    { name: 'cat', description: 'Show unit file contents', args: serviceArgs },
    { name: 'list-dependencies', description: 'Show unit dependencies', options: [{ name: '--reverse', description: 'Reverse dependencies' }, { name: '--after', description: 'After dependencies' }, { name: '--before', description: 'Before dependencies' }, { name: ['-a', '--all'], description: 'Show all dependencies' }], args: { name: 'unit', isOptional: true } },
    { name: 'help', description: 'Show unit documentation', args: serviceArgs },
    { name: 'is-active', description: 'Check if unit is active', options: [{ name: ['-q', '--quiet'], description: 'Suppress output' }], args: serviceArgs },
    { name: 'is-failed', description: 'Check if unit is failed', options: [{ name: ['-q', '--quiet'], description: 'Suppress output' }], args: serviceArgs },

    // Other
    { name: 'whoami', description: 'Show identity of calling user' },
  ],
};
