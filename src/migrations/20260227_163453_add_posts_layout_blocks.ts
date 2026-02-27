import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_blocks_code_language" AS ENUM('typescript', 'javascript', 'tsx', 'jsx', 'json', 'bash', 'markdown', 'css', 'html', 'text');
  CREATE TABLE "posts_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "posts_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_posts_blocks_code_language" DEFAULT 'typescript' NOT NULL,
  	"code" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "posts_blocks_content" ADD CONSTRAINT "posts_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_media" ADD CONSTRAINT "posts_blocks_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_media" ADD CONSTRAINT "posts_blocks_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_grid_cards" ADD CONSTRAINT "posts_blocks_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_grid" ADD CONSTRAINT "posts_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_code" ADD CONSTRAINT "posts_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_quote" ADD CONSTRAINT "posts_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_blocks_content_order_idx" ON "posts_blocks_content" USING btree ("_order");
  CREATE INDEX "posts_blocks_content_parent_id_idx" ON "posts_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_content_path_idx" ON "posts_blocks_content" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_order_idx" ON "posts_blocks_media" USING btree ("_order");
  CREATE INDEX "posts_blocks_media_parent_id_idx" ON "posts_blocks_media" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_media_path_idx" ON "posts_blocks_media" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_media_idx" ON "posts_blocks_media" USING btree ("media_id");
  CREATE INDEX "posts_blocks_grid_cards_order_idx" ON "posts_blocks_grid_cards" USING btree ("_order");
  CREATE INDEX "posts_blocks_grid_cards_parent_id_idx" ON "posts_blocks_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_grid_order_idx" ON "posts_blocks_grid" USING btree ("_order");
  CREATE INDEX "posts_blocks_grid_parent_id_idx" ON "posts_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_grid_path_idx" ON "posts_blocks_grid" USING btree ("_path");
  CREATE INDEX "posts_blocks_code_order_idx" ON "posts_blocks_code" USING btree ("_order");
  CREATE INDEX "posts_blocks_code_parent_id_idx" ON "posts_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_code_path_idx" ON "posts_blocks_code" USING btree ("_path");
  CREATE INDEX "posts_blocks_quote_order_idx" ON "posts_blocks_quote" USING btree ("_order");
  CREATE INDEX "posts_blocks_quote_parent_id_idx" ON "posts_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_quote_path_idx" ON "posts_blocks_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_blocks_content" CASCADE;
  DROP TABLE "posts_blocks_media" CASCADE;
  DROP TABLE "posts_blocks_grid_cards" CASCADE;
  DROP TABLE "posts_blocks_grid" CASCADE;
  DROP TABLE "posts_blocks_code" CASCADE;
  DROP TABLE "posts_blocks_quote" CASCADE;
  DROP TABLE "posts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  DROP TYPE "public"."enum_posts_blocks_code_language";`)
}
