CREATE TYPE "public"."product_status_enum" AS ENUM('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'ARCHIVED', 'DELETED');
CREATE TYPE "public"."on_boarding_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');
CREATE TYPE "public"."status_enum" AS ENUM('PENDING', 'VERIFIED', 'DENIED');
CREATE TYPE "public"."store_status" AS ENUM('ACTIVE', 'INACTIVE', 'BANNED', 'PENDING', 'SUSPENDED');
CREATE TYPE "public"."document_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "public"."document_type" AS ENUM('ID_CARD', 'PASSPORT', 'DRIVER_LICENSE', 'PROOF_OF_ADDRESS', 'BUSINESS_LICENSE', 'OTHER');
CREATE TABLE "categories" (
        "id" uuid PRIMARY KEY NOT NULL,
        "parent_id" uuid,
        "name" varchar(150) NOT NULL,
        "slug" varchar(180) NOT NULL,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone,
        CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE "conversation_participants" (
        "conversation_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "conversation_participants_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);

CREATE TABLE "conversations" (
        "id" uuid PRIMARY KEY NOT NULL,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone
);

CREATE TABLE "message_products" (
        "id" uuid PRIMARY KEY NOT NULL,
        "message_id" uuid NOT NULL,
        "product_id" uuid NOT NULL
);

CREATE TABLE "messages" (
        "id" uuid PRIMARY KEY NOT NULL,
        "conversation_id" uuid NOT NULL,
        "sender_id" uuid NOT NULL,
        "content" text NOT NULL,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone
);

CREATE TABLE "seller_onboarding_steps" (
        "id" uuid PRIMARY KEY NOT NULL,
        "onboarding_id" uuid NOT NULL,
        "step" varchar(100) NOT NULL,
        "data" jsonb,
        "completed" boolean DEFAULT false,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone
);

CREATE TABLE "permissions" (
        "id" uuid PRIMARY KEY NOT NULL,
        "key" varchar(150) NOT NULL,
        "description" varchar(255),
        CONSTRAINT "permissions_key_unique" UNIQUE("key")
);

CREATE TABLE "product_images" (
        "id" uuid PRIMARY KEY NOT NULL,
        "product_id" uuid NOT NULL,
        "url" text NOT NULL,
        "position" integer DEFAULT 0 NOT NULL,
        "is_primary" boolean DEFAULT false NOT NULL,
        "alt" text,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone
);

CREATE TABLE "product_stock" (
        "id" uuid PRIMARY KEY NOT NULL,
        "product_id" uuid NOT NULL,
        "quantity" integer DEFAULT 0 NOT NULL,
        "reserved" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone,
        CONSTRAINT "product_stock_product_id_unique" UNIQUE("product_id")
);

CREATE TABLE "product_variants" (
        "id" uuid PRIMARY KEY NOT NULL,
        "store_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "sku" varchar(120) NOT NULL,
        "price" numeric(12, 2) NOT NULL,
        "stock" integer DEFAULT 0,
        "attributes" jsonb,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone
);

CREATE TABLE "products" (
        "id" uuid PRIMARY KEY NOT NULL,
        "store_id" uuid NOT NULL,
        "category_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "slug" varchar(255),
        "is_visible" boolean DEFAULT false,
        "description" text,
        "status" "product_status_enum" DEFAULT 'DRAFT',
        "price" integer NOT NULL,
        "discount_price" integer,
        "currency" varchar(3) DEFAULT 'MZN',
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone,
        CONSTRAINT "products_slug_unique" UNIQUE("slug")
);

CREATE TABLE "provinces" (
        "id" uuid PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "slug" text NOT NULL,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        CONSTRAINT "provinces_name_unique" UNIQUE("name"),
        CONSTRAINT "provinces_slug_unique" UNIQUE("slug")
);

CREATE TABLE "role_permissions" (
        "role_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);

CREATE TABLE "roles" (
        "id" uuid PRIMARY KEY NOT NULL,
        "name" varchar(100) NOT NULL,
        "description" varchar(255),
        CONSTRAINT "roles_name_unique" UNIQUE("name")
);

CREATE TABLE "seller_onboarding" (
        "id" uuid PRIMARY KEY NOT NULL,
        "seller_profile_id" uuid NOT NULL,
        "status" "on_boarding_status_enum" DEFAULT 'DRAFT' NOT NULL,
        "current_step" varchar(100),
        "submitted_at" timestamp with time zone,
        "approved_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone,
        CONSTRAINT "seller_onboarding_seller_profile_id_unique" UNIQUE("seller_profile_id")
);

CREATE TABLE "seller_profiles" (
        "id" uuid PRIMARY KEY NOT NULL,
        "user_id" uuid NOT NULL,
        "status" "status_enum" DEFAULT 'PENDING' NOT NULL,
        "verified_at" timestamp with time zone,
        "onboarded_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone,
        CONSTRAINT "seller_profiles_user_id_unique" UNIQUE("user_id")
);

CREATE TABLE "store_followers" (
        "id" uuid PRIMARY KEY NOT NULL,
        "user_id" uuid NOT NULL,
        "store_id" uuid NOT NULL,
        "followed_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "stores" (
        "id" uuid PRIMARY KEY NOT NULL,
        "owner_id" uuid NOT NULL,
        "seller_profile_id" uuid NOT NULL,
        "name" varchar(150) NOT NULL,
        "email" text,
        "state" text NOT NULL,
        "main_store_category_id" uuid,
        "province_id" uuid,
        "slug" varchar(180) NOT NULL,
        "description" text,
        "logo_url" text,
        "banner_url" text,
        "verified_at" timestamp with time zone,
        "status" "store_status" DEFAULT 'PENDING',
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone,
        CONSTRAINT "stores_email_unique" UNIQUE("email"),
        CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);

CREATE TABLE "user_roles" (
        "user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);

CREATE TABLE "users" (
        "id" uuid PRIMARY KEY NOT NULL,
        "firebase_uid" varchar(128) NOT NULL,
        "email" varchar(255),
        "first_name" varchar(100),
        "last_name" varchar(100),
        "avatar_url" varchar(500),
        "phone_number" varchar(30),
        "email_verified" boolean DEFAULT false,
        "phone_verified" boolean DEFAULT false,
        "status" varchar(30) DEFAULT 'ACTIVE',
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone,
        CONSTRAINT "users_firebase_uid_unique" UNIQUE("firebase_uid"),
        CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE "verification_documents" (
        "id" uuid PRIMARY KEY NOT NULL,
        "owner_id" uuid NOT NULL,
        "store_id" uuid,
        "type" "document_type" NOT NULL,
        "status" "document_status" DEFAULT 'PENDING' NOT NULL,
        "file_url" text NOT NULL,
        "back_file_url" text,
        "metadata" text,
        "rejection_reason" text,
        "reviewed_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "deleted_at" timestamp with time zone
);

ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "message_products" ADD CONSTRAINT "message_products_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "message_products" ADD CONSTRAINT "message_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "seller_onboarding_steps" ADD CONSTRAINT "seller_onboarding_steps_onboarding_id_seller_onboarding_id_fk" FOREIGN KEY ("onboarding_id") REFERENCES "public"."seller_onboarding"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "product_stock" ADD CONSTRAINT "product_stock_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "seller_onboarding" ADD CONSTRAINT "seller_onboarding_seller_profile_id_seller_profiles_id_fk" FOREIGN KEY ("seller_profile_id") REFERENCES "public"."seller_profiles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "seller_profiles" ADD CONSTRAINT "seller_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "store_followers" ADD CONSTRAINT "store_followers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "store_followers" ADD CONSTRAINT "store_followers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "stores" ADD CONSTRAINT "stores_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "stores" ADD CONSTRAINT "stores_seller_profile_id_seller_profiles_id_fk" FOREIGN KEY ("seller_profile_id") REFERENCES "public"."seller_profiles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "stores" ADD CONSTRAINT "stores_main_store_category_id_categories_id_fk" FOREIGN KEY ("main_store_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "stores" ADD CONSTRAINT "stores_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "idx_conversation_participants_conversation_id" ON "conversation_participants" USING btree ("conversation_id");
CREATE INDEX "idx_conversation_participants_user_id" ON "conversation_participants" USING btree ("user_id");
CREATE INDEX "idx_message_products_unique" ON "message_products" USING btree ("message_id","product_id");
CREATE UNIQUE INDEX "idx_product_primary_image" ON "product_images" USING btree ("product_id","is_primary") WHERE "product_images"."is_primary" = true;
CREATE UNIQUE INDEX "store_sku_unique" ON "product_variants" USING btree ("store_id","sku");
CREATE UNIQUE INDEX "unique_user_store_follow" ON "store_followers" USING btree ("user_id","store_id");
CREATE INDEX "idx_store_followers_user" ON "store_followers" USING btree ("user_id");
CREATE INDEX "idx_store_followers_store" ON "store_followers" USING btree ("store_id");