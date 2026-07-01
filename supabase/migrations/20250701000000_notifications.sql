CREATE TABLE "notifications" (
    "id" uuid PRIMARY KEY NOT NULL,
    "user_id" uuid NOT NULL,
    "title" varchar(255) NOT NULL,
    "body" text NOT NULL,
    "type" varchar(50) DEFAULT 'system',
    "link" text,
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    "deleted_at" timestamp with time zone
);

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "idx_notifications_user_id" ON "notifications" USING btree ("user_id");
CREATE INDEX "idx_notifications_user_unread" ON "notifications" USING btree ("user_id", "read_at") WHERE "notifications"."deleted_at" IS NULL;
