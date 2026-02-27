import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Payload locked documents: add missing projects relation column
  ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "projects_id" integer;

  -- FK: payload_locked_documents_rels.projects_id -> projects.id
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'payload_locked_documents_rels_projects_id_projects_id_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_projects_id_projects_id_fk"
        FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;

  -- Index (optional but keeps parity with Payload-generated migrations)
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname = 'payload_locked_documents_rels_projects_id_idx'
    ) THEN
      CREATE INDEX "payload_locked_documents_rels_projects_id_idx"
        ON "payload_locked_documents_rels" USING btree ("projects_id");
    END IF;
  END $$;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'payload_locked_documents_rels_projects_id_projects_id_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels"
        DROP CONSTRAINT "payload_locked_documents_rels_projects_id_projects_id_fk";
    END IF;
  END $$;

  DROP INDEX IF EXISTS "payload_locked_documents_rels_projects_id_idx";

  ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "projects_id";
  `)
}
