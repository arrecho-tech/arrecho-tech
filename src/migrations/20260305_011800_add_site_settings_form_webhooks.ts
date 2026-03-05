import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- SiteSettings: formWebhooks array table
  CREATE TABLE IF NOT EXISTS "site_settings_form_webhooks" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "enabled" boolean DEFAULT true,
    "category" varchar NOT NULL,
    "url" varchar NOT NULL,
    "secret" varchar
  );

  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'site_settings_form_webhooks_parent_id_fk'
    ) THEN
      ALTER TABLE "site_settings_form_webhooks"
        ADD CONSTRAINT "site_settings_form_webhooks_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;

  CREATE INDEX IF NOT EXISTS "site_settings_form_webhooks_order_idx"
    ON "site_settings_form_webhooks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_form_webhooks_parent_id_idx"
    ON "site_settings_form_webhooks" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "site_settings_form_webhooks" CASCADE;
  `)
}
