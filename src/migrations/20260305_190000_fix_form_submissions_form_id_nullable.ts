import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Payload's form-builder plugin currently tries to null out form_submissions.form_id
// when deleting a form ("set null" semantics). The original migration also created
// form_id as NOT NULL, which makes that delete path fail in CI/e2e.
//
// Make form_id nullable and ensure the FK uses ON DELETE SET NULL.
export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF to_regclass('public.form_submissions') IS NOT NULL THEN
      -- Allow SET NULL behavior
      ALTER TABLE "form_submissions"
        ALTER COLUMN "form_id" DROP NOT NULL;

      -- Ensure FK matches the runtime behavior
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
        ON DELETE SET NULL ON UPDATE NO ACTION;
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

      -- Revert to NOT NULL (will fail if any rows have been orphaned)
      ALTER TABLE "form_submissions"
        ALTER COLUMN "form_id" SET NOT NULL;

      ALTER TABLE "form_submissions"
        ADD CONSTRAINT "form_submissions_form_id_forms_id_fk"
        FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    END IF;
  END $$;
  `)
}
