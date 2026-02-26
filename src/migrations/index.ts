import * as migration_20260226_203035_initial from './20260226_203035_initial';

export const migrations = [
  {
    up: migration_20260226_203035_initial.up,
    down: migration_20260226_203035_initial.down,
    name: '20260226_203035_initial'
  },
];
