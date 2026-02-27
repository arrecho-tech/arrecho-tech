import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Posts: add publish status gating
  DO $$ BEGIN
    CREATE TYPE "public"."enum_posts_status" AS ENUM ('draft', 'published');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "status" "enum_posts_status" DEFAULT 'draft' NOT NULL;
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "published_at" timestamp(3) with time zone;

  -- Projects
  DO $$ BEGIN
    CREATE TYPE "public"."enum_projects_status" AS ENUM ('draft', 'published');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_projects_blocks_code_language" AS ENUM ('typescript','javascript','tsx','jsx','json','bash','markdown','css','html','text');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "projects" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "excerpt" varchar,
    "featured_image_id" integer,
    "status" "enum_projects_status" DEFAULT 'draft' NOT NULL,
    "published_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "projects_tech_stack" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "projects_blocks_content" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "content" jsonb NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "projects_blocks_media" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer NOT NULL,
    "caption" varchar,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "projects_blocks_grid" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "projects_blocks_grid_cards" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar,
    "link" varchar
  );

  CREATE TABLE IF NOT EXISTS "projects_blocks_code" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "language" "enum_projects_blocks_code_language" DEFAULT 'typescript' NOT NULL,
    "code" varchar NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "projects_blocks_quote" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "quote" varchar NOT NULL,
    "attribution" varchar,
    "block_name" varchar
  );

  -- Constraints / indexes
  ALTER TABLE "projects" ADD CONSTRAINT IF NOT EXISTS "projects_featured_image_id_media_id_fk"
    FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "projects_tech_stack" ADD CONSTRAINT IF NOT EXISTS "projects_tech_stack_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "projects_blocks_content" ADD CONSTRAINT IF NOT EXISTS "projects_blocks_content_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "projects_blocks_media" ADD CONSTRAINT IF NOT EXISTS "projects_blocks_media_media_id_media_id_fk"
    FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "projects_blocks_media" ADD CONSTRAINT IF NOT EXISTS "projects_blocks_media_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "projects_blocks_grid" ADD CONSTRAINT IF NOT EXISTS "projects_blocks_grid_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "projects_blocks_grid_cards" ADD CONSTRAINT IF NOT EXISTS "projects_blocks_grid_cards_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "projects_blocks_code" ADD CONSTRAINT IF NOT EXISTS "projects_blocks_code_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "projects_blocks_quote" ADD CONSTRAINT IF NOT EXISTS "projects_blocks_quote_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;

  CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "projects_featured_image_idx" ON "projects" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "projects_created_at_idx" ON "projects" USING btree ("created_at");

  CREATE INDEX IF NOT EXISTS "projects_tech_stack_order_idx" ON "projects_tech_stack" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_tech_stack_parent_id_idx" ON "projects_tech_stack" USING btree ("_parent_id");

  CREATE INDEX IF NOT EXISTS "projects_blocks_content_order_idx" ON "projects_blocks_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_content_parent_id_idx" ON "projects_blocks_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_content_path_idx" ON "projects_blocks_content" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "projects_blocks_media_order_idx" ON "projects_blocks_media" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_media_parent_id_idx" ON "projects_blocks_media" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_media_path_idx" ON "projects_blocks_media" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_media_media_idx" ON "projects_blocks_media" USING btree ("media_id");

  CREATE INDEX IF NOT EXISTS "projects_blocks_grid_order_idx" ON "projects_blocks_grid" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_grid_parent_id_idx" ON "projects_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_grid_path_idx" ON "projects_blocks_grid" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "projects_blocks_grid_cards_order_idx" ON "projects_blocks_grid_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_grid_cards_parent_id_idx" ON "projects_blocks_grid_cards" USING btree ("_parent_id");

  CREATE INDEX IF NOT EXISTS "projects_blocks_code_order_idx" ON "projects_blocks_code" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_code_parent_id_idx" ON "projects_blocks_code" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_code_path_idx" ON "projects_blocks_code" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "projects_blocks_quote_order_idx" ON "projects_blocks_quote" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_quote_parent_id_idx" ON "projects_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_quote_path_idx" ON "projects_blocks_quote" USING btree ("_path");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  -- Projects
  DROP TABLE IF EXISTS "projects_blocks_quote";
  DROP TABLE IF EXISTS "projects_blocks_code";
  DROP TABLE IF EXISTS "projects_blocks_grid_cards";
  DROP TABLE IF EXISTS "projects_blocks_grid";
  DROP TABLE IF EXISTS "projects_blocks_media";
  DROP TABLE IF EXISTS "projects_blocks_content";
  DROP TABLE IF EXISTS "projects_tech_stack";
  DROP TABLE IF EXISTS "projects";

  DROP TYPE IF EXISTS "public"."enum_projects_blocks_code_language";
  DROP TYPE IF EXISTS "public"."enum_projects_status";

  -- Posts columns
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "status";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "published_at";
  DROP TYPE IF EXISTS "public"."enum_posts_status";
  `)
}
