ALTER TABLE "products" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "discount_price" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "currency" varchar(3) DEFAULT 'MZN';