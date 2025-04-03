import { ArgConfig } from './args.types.js';

export const ARG_CONFIGS: ArgConfig[] = [
  {
    name: 'token',
    flags: ['--token', '-t'],
    description: 'Monday API token',
    required: true,
  },
  {
    name: 'version',
    flags: ['--version', '-v'],
    description: 'Monday API version',
    required: false,
    defaultValue: 'current',
  },
  {
    name: 'readOnlyMode',
    flags: ['--read-only', '-ro'],
    description: 'Enable read-only mode',
    required: false,
    defaultValue: false,
  },
  {
    name: 'disableAllApiMode',
    flags: ['--disable-all-api-mode', '-da'],
    description: 'Disable all API mode (Mode that includes the whole API schema)',
    required: false,
    defaultValue: false,
  },
];
