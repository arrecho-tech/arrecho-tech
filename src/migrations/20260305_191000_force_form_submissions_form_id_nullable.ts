import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// CI still reports form_submissions.form_id as NOT NULL in some environments.
// Force the column nullable using schema-qualified identifiers, and fail loudly
// if it remains NOT NULL after the operation.
export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  DECLARE
    is_not_null boolean;
  BEGIN
    IF to_regclass('public.form_submissions') IS NULL THEN
      RETURN;
    END IF;

    SELECT a.attnotnull INTO is_not_null
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'form_submissions'
      AND a.attname = 'form_id'
      AND a.attnum > 0
      AND NOT a.attisdropped;

    IF is_not_null THEN
      ALTER TABLE "public"."form_submissions"
        ALTER COLUMN "form_id" DROP NOT NULL;
    END IF;

    -- Verify
    SELECT a.attnotnull INTO is_not_null
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'form_submissions'
      AND a.attname = 'form_id'
      AND a.attnum > 0
      AND NOT a.attisdropped;

    IF is_not_null THEN
      RAISE EXCEPTION 'form_submissions.form_id is still NOT NULL after migration';
    END IF;
  END $$;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF to_regclass('public.form_submissions') IS NULL THEN
      RETURN;
    END IF;

    ALTER TABLE "public"."form_submissions"
      ALTER COLUMN "form_id" SET NOT NULL;
  END $$;
  `)
}
