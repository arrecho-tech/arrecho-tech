import * as migration_20260226_203035_initial from './20260226_203035_initial';
import * as migration_20260227_050022 from './20260227_050022';

export const migrations = [
  {
    up: migration_20260226_203035_initial.up,
    down: migration_20260226_203035_initial.down,
    name: '20260226_203035_initial',
  },
  {
    up: migration_20260227_050022.up,
    down: migration_20260227_050022.down,
    name: '20260227_050022'
  },
];
