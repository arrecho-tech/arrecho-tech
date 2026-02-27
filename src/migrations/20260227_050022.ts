import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "first_name" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_name" varchar;

  UPDATE "users"
  SET
    "first_name" = COALESCE("first_name", 'Unknown'),
    "last_name" = COALESCE("last_name", 'User');

  ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL;
  ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "last_name";
  `)
}
