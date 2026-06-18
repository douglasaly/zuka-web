CREATE TYPE "public"."on_boarding_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');--> statement-breakpoint
ALTER TABLE "seller_onboarding_steps" DROP CONSTRAINT "seller_onboarding_steps_onboarding_id_seller_onboarding_id_fk";
--> statement-breakpoint
ALTER TABLE "seller_onboarding" ALTER COLUMN "status" SET DEFAULT 'DRAFT'::"public"."on_boarding_status_enum";--> statement-breakpoint
ALTER TABLE "seller_onboarding" ALTER COLUMN "status" SET DATA TYPE "public"."on_boarding_status_enum" USING "status"::"public"."on_boarding_status_enum";--> statement-breakpoint
ALTER TABLE "seller_onboarding" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "province_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "seller_onboarding_steps" ADD CONSTRAINT "seller_onboarding_steps_onboarding_id_seller_onboarding_id_fk" FOREIGN KEY ("onboarding_id") REFERENCES "public"."seller_onboarding"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_conversation_participants_user_id" ON "conversation_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_message_products_unique" ON "message_products" USING btree ("message_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_product_primary_image" ON "product_images" USING btree ("product_id","is_primary") WHERE "product_images"."is_primary" = true;