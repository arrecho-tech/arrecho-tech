import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Fix invalid FK behavior: form_submissions.form_id is NOT NULL but the FK was created
// with ON DELETE SET NULL, causing deletes of forms to fail.
//
// We want deleting a form to also delete its submissions.
export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF to_regclass('public.form_submissions') IS NOT NULL THEN
      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'form_submissions_form_id_forms_id_fk'
      ) THEN
        ALTER TABLE "form_submissions"
          DROP CONSTRAINT "form_submissions_form_id_forms_id_fk";
      END IF;

      ALTER TABLE "form_submissions"
        ADD CONSTRAINT "form_submissions_form_id_forms_id_fk"
        FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    END IF;
  END $$;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF to_regclass('public.form_submissions') IS NOT NULL THEN
      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'form_submissions_form_id_forms_id_fk'
      ) THEN
        ALTER TABLE "form_submissions"
          DROP CONSTRAINT "form_submissions_form_id_forms_id_fk";
      END IF;

      -- Restore prior behavior (though it's incompatible with NOT NULL form_id)
      ALTER TABLE "form_submissions"
        ADD CONSTRAINT "form_submissions_form_id_forms_id_fk"
        FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION;
    END IF;
  END $$;
  `)
}
