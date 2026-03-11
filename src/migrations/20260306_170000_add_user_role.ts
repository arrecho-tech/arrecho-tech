import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" varchar;

  UPDATE "users"
    SET "role" = COALESCE("role", 'admin');

  ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;

  CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" USING btree ("role");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "users_role_idx";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
  `)
}
