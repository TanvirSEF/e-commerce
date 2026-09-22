CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'customer' NOT NULL,
	"phone" text,
	"balance" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"logo" text,
	"top" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"icon" text,
	"banner" text,
	"featured" boolean DEFAULT false NOT NULL,
	"order_level" integer DEFAULT 0 NOT NULL,
	"parent_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"sku" varchar(100),
	"category_id" integer,
	"brand_id" integer,
	"photos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"thumbnail_img" text NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"purchase_price" numeric(12, 2),
	"discount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"discount_type" varchar(20) DEFAULT 'percent' NOT NULL,
	"current_stock" integer DEFAULT 0 NOT NULL,
	"unit" varchar(50) DEFAULT 'pc' NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0.00' NOT NULL,
	"num_of_reviews" integer DEFAULT 0 NOT NULL,
	"num_of_sale" integer DEFAULT 0 NOT NULL,
	"description" text,
	"colors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"choice_options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"variations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"todays_deal" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "customer_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"address" text NOT NULL,
	"country" varchar(100) DEFAULT 'Bangladesh' NOT NULL,
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"phone" varchar(50),
	"set_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer,
	"variation" varchar(100),
	"price" numeric(12, 2) NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"shipping_cost" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"code" varchar(50) NOT NULL,
	"tracking_code" varchar(50) NOT NULL,
	"shipping_address" jsonb,
	"payment_type" varchar(50) DEFAULT 'cash_on_delivery' NOT NULL,
	"payment_status" varchar(50) DEFAULT 'unpaid' NOT NULL,
	"delivery_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"grand_total" numeric(12, 2) NOT NULL,
	"coupon_discount" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"shipping_cost" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"viewed" boolean DEFAULT false NOT NULL,
	"delivery_viewed" boolean DEFAULT false NOT NULL,
	"payment_status_viewed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_code_unique" UNIQUE("code"),
	CONSTRAINT "orders_tracking_code_unique" UNIQUE("tracking_code")
);
--> statement-breakpoint
CREATE TABLE "business_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(100) NOT NULL,
	"value" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_settings_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "flash_deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"start_date" bigint NOT NULL,
	"end_date" bigint NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT true NOT NULL,
	"banner" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "flash_deals_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;