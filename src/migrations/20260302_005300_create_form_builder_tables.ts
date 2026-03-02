import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Minimal schema for @payloadcms/plugin-form-builder.
// This repo uses explicit SQL migrations, so adding the plugin requires
// creating the underlying tables.
//
// NOTE: Postgres does NOT support `ADD CONSTRAINT IF NOT EXISTS`, so we guard
// constraint creation using DO blocks (same style as other migrations here).

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- ===============
  -- forms collection
  -- ===============
  CREATE TABLE IF NOT EXISTS "forms" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,

    "submit_button_label" varchar,

    "confirmation_type" varchar DEFAULT 'message' NOT NULL,
    "confirmation_message" jsonb,

    "redirect_type" varchar,
    "redirect_url" varchar,

    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE INDEX IF NOT EXISTS "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "forms_created_at_idx" ON "forms" USING btree ("created_at");

  -- emails array
  CREATE TABLE IF NOT EXISTS "forms_emails" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "email_to" varchar,
    "cc" varchar,
    "bcc" varchar,
    "reply_to" varchar,
    "email_from" varchar,

    "subject" varchar,
    "message" jsonb
  );

  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'forms_emails_parent_id_fk'
    ) THEN
      ALTER TABLE "forms_emails"
        ADD CONSTRAINT "forms_emails_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id")
        ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;

  CREATE INDEX IF NOT EXISTS "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");

  -- blocks: fields
  -- Payload stores blocks in per-block tables under <collection>_blocks_<blockSlug>
  -- Default enabled blocks: checkbox, country, email, message, number, select, state, text, textarea

  CREATE TABLE IF NOT EXISTS "forms_blocks_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "name" varchar NOT NULL,
    "label" varchar,
    "default_value" varchar,
    "width" numeric,
    "required" boolean,

    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_textarea" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "name" varchar NOT NULL,
    "label" varchar,
    "default_value" varchar,
    "width" numeric,
    "required" boolean,

    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_number" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "name" varchar NOT NULL,
    "label" varchar,
    "default_value" numeric,
    "width" numeric,
    "required" boolean,

    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_email" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "name" varchar NOT NULL,
    "label" varchar,
    "width" numeric,
    "required" boolean,

    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_state" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "name" varchar NOT NULL,
    "label" varchar,
    "width" numeric,
    "required" boolean,

    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_country" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "name" varchar NOT NULL,
    "label" varchar,
    "width" numeric,
    "required" boolean,

    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "name" varchar NOT NULL,
    "label" varchar,
    "width" numeric,
    "required" boolean,
    "default_value" boolean,

    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_message" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "message" jsonb,

    "block_name" varchar
  );

  -- radio/select include nested options arrays
  CREATE TABLE IF NOT EXISTS "forms_blocks_radio" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "name" varchar NOT NULL,
    "label" varchar,
    "default_value" varchar,
    "width" numeric,
    "required" boolean,

    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_radio_options" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "label" varchar NOT NULL,
    "value" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_select" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "name" varchar NOT NULL,
    "label" varchar,
    "default_value" varchar,
    "placeholder" varchar,
    "width" numeric,
    "required" boolean,

    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_select_options" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,

    "label" varchar NOT NULL,
    "value" varchar NOT NULL
  );

  -- FKs for blocks -> forms
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_text_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_textarea_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_number_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_email_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_state_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_country_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_checkbox_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_message_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_radio_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_radio" ADD CONSTRAINT "forms_blocks_radio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_select_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;

    -- FKs for options -> parent block row (varchar id)
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_radio_options_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_radio_options" ADD CONSTRAINT "forms_blocks_radio_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_select_options_parent_id_fk') THEN
      ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;

  -- Indexes for blocks
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_order_idx" ON "forms_blocks_radio" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_parent_id_idx" ON "forms_blocks_radio" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_path_idx" ON "forms_blocks_radio" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_options_order_idx" ON "forms_blocks_radio_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_options_parent_id_idx" ON "forms_blocks_radio_options" USING btree ("_parent_id");

  CREATE INDEX IF NOT EXISTS "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");

  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");

  -- ========================
  -- form-submissions collection
  -- ========================
  CREATE TABLE IF NOT EXISTS "form_submissions" (
    "id" serial PRIMARY KEY NOT NULL,
    "form_id" integer NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'form_submissions_form_id_forms_id_fk'
    ) THEN
      ALTER TABLE "form_submissions"
        ADD CONSTRAINT "form_submissions_form_id_forms_id_fk"
        FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;

  CREATE INDEX IF NOT EXISTS "form_submissions_form_id_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");

  CREATE TABLE IF NOT EXISTS "form_submissions_submission_data" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "field" varchar NOT NULL,
    "value" varchar NOT NULL
  );

  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'form_submissions_submission_data_parent_id_fk'
    ) THEN
      ALTER TABLE "form_submissions_submission_data"
        ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id")
        ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;

  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  -- form submissions
  DROP TABLE IF EXISTS "form_submissions_submission_data" CASCADE;
  DROP TABLE IF EXISTS "form_submissions" CASCADE;

  -- forms blocks + arrays
  DROP TABLE IF EXISTS "forms_blocks_select_options" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_select" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_radio_options" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_radio" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_message" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_checkbox" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_country" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_state" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_email" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_number" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_textarea" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_text" CASCADE;
  DROP TABLE IF EXISTS "forms_emails" CASCADE;

  DROP TABLE IF EXISTS "forms" CASCADE;
  `)
}
