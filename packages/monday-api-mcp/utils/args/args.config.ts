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
    name: 'disableMutations',
    flags: ['--disable-mutations', '-dm'],
    description: 'Disable mutations',
    required: false,
    defaultValue: false,
  },
];
