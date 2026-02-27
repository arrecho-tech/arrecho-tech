import * as migration_20260226_203035_initial from './20260226_203035_initial'
import * as migration_20260227_050022 from './20260227_050022'
import * as migration_20260227_163453_add_posts_layout_blocks from './20260227_163453_add_posts_layout_blocks'
import * as migration_20260227_164041_add_site_settings_background from './20260227_164041_add_site_settings_background'
import * as migration_20260227_183200_add_projects_and_publish_status from './20260227_183200_add_projects_and_publish_status'

export const migrations = [
  {
    up: migration_20260226_203035_initial.up,
    down: migration_20260226_203035_initial.down,
    name: '20260226_203035_initial',
  },
  {
    up: migration_20260227_050022.up,
    down: migration_20260227_050022.down,
    name: '20260227_050022',
  },
  {
    up: migration_20260227_163453_add_posts_layout_blocks.up,
    down: migration_20260227_163453_add_posts_layout_blocks.down,
    name: '20260227_163453_add_posts_layout_blocks',
  },
  {
    up: migration_20260227_164041_add_site_settings_background.up,
    down: migration_20260227_164041_add_site_settings_background.down,
    name: '20260227_164041_add_site_settings_background',
  },
  {
    up: migration_20260227_183200_add_projects_and_publish_status.up,
    down: migration_20260227_183200_add_projects_and_publish_status.down,
    name: '20260227_183200_add_projects_and_publish_status',
  },
]
