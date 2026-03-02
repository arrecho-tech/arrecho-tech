import * as migration_20260226_203035_initial from './20260226_203035_initial'
import * as migration_20260227_050022 from './20260227_050022'
import * as migration_20260227_163453_add_posts_layout_blocks from './20260227_163453_add_posts_layout_blocks'
import * as migration_20260227_164041_add_site_settings_background from './20260227_164041_add_site_settings_background'
import * as migration_20260227_183200_add_projects_and_publish_status from './20260227_183200_add_projects_and_publish_status'
import * as migration_20260227_214500_fix_locked_documents_projects_rel from './20260227_214500_fix_locked_documents_projects_rel'
import * as migration_20260302_004900_fix_locked_documents_forms_rels from './20260302_004900_fix_locked_documents_forms_rels'
import * as migration_20260302_005300_create_form_builder_tables from './20260302_005300_create_form_builder_tables'
import * as migration_20260302_011000_add_forms_webhook_category from './20260302_011000_add_forms_webhook_category'

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
  {
    up: migration_20260227_214500_fix_locked_documents_projects_rel.up,
    down: migration_20260227_214500_fix_locked_documents_projects_rel.down,
    name: '20260227_214500_fix_locked_documents_projects_rel',
  },
  {
    up: migration_20260302_004900_fix_locked_documents_forms_rels.up,
    down: migration_20260302_004900_fix_locked_documents_forms_rels.down,
    name: '20260302_004900_fix_locked_documents_forms_rels',
  },
  {
    up: migration_20260302_005300_create_form_builder_tables.up,
    down: migration_20260302_005300_create_form_builder_tables.down,
    name: '20260302_005300_create_form_builder_tables',
  },
  {
    up: migration_20260302_011000_add_forms_webhook_category.up,
    down: migration_20260302_011000_add_forms_webhook_category.down,
    name: '20260302_011000_add_forms_webhook_category',
  },
]
