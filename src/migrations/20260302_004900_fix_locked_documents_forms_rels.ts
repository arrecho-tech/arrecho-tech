import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// When new collections are introduced (like the Form Builder plugin's `forms` and
// `form-submissions` collections), Payload expects matching *_id columns to exist
// on `payload_locked_documents_rels`. Without them, the Admin UI can crash when
// querying locked documents.

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Payload locked documents: add missing relations for Form Builder plugin
  ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "forms_id" integer,
    ADD COLUMN IF NOT EXISTS "form_submissions_id" integer;

  -- FK: payload_locked_documents_rels.forms_id -> forms.id (if table exists)
  DO $$
  BEGIN
    IF to_regclass('public.forms') IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'payload_locked_documents_rels_forms_id_forms_id_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_forms_id_forms_id_fk"
        FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;

  -- FK: payload_locked_documents_rels.form_submissions_id -> form_submissions.id (if table exists)
  DO $$
  BEGIN
    IF to_regclass('public.form_submissions') IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'payload_locked_documents_rels_form_submissions_id_form_submissions_id_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_id_form_submissions_id_fk"
        FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;

  -- Indexes (optional but keeps parity with Payload-generated migrations)
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname = 'payload_locked_documents_rels_forms_id_idx'
    ) THEN
      CREATE INDEX "payload_locked_documents_rels_forms_id_idx"
        ON "payload_locked_documents_rels" USING btree ("forms_id");
    END IF;
  END $$;

  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname = 'payload_locked_documents_rels_form_submissions_id_idx'
    ) THEN
      CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx"
        ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
    END IF;
  END $$;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'payload_locked_documents_rels_forms_id_forms_id_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels"
        DROP CONSTRAINT "payload_locked_documents_rels_forms_id_forms_id_fk";
    END IF;

    IF EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'payload_locked_documents_rels_form_submissions_id_form_submissions_id_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels"
        DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_id_form_submissions_id_fk";
    END IF;
  END $$;

  DROP INDEX IF EXISTS "payload_locked_documents_rels_forms_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_form_submissions_id_idx";

  ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "forms_id",
    DROP COLUMN IF EXISTS "form_submissions_id";
  `)
}
