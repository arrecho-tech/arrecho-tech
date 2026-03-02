import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "forms"
    ADD COLUMN IF NOT EXISTS "webhook_category" varchar;

  CREATE INDEX IF NOT EXISTS "forms_webhook_category_idx" ON "forms" USING btree ("webhook_category");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "forms_webhook_category_idx";

  ALTER TABLE "forms"
    DROP COLUMN IF EXISTS "webhook_category";
  `)
}
