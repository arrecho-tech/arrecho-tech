import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_settings"
    ADD COLUMN IF NOT EXISTS "default_form_webhook_category" varchar;

  CREATE INDEX IF NOT EXISTS "site_settings_default_form_webhook_category_idx"
    ON "site_settings" USING btree ("default_form_webhook_category");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "site_settings_default_form_webhook_category_idx";

  ALTER TABLE "site_settings"
    DROP COLUMN IF EXISTS "default_form_webhook_category";
  `)
}
