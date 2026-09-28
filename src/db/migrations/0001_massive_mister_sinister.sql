CREATE TABLE "frequently_bought_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"frequently_bought_product_id" integer,
	"category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "last_viewed_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_withdraw_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shop_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"message" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payment_method" varchar(50),
	"transaction_id" varchar(100),
	"admin_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_followers" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shops" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"logo" text,
	"top_banner" text,
	"sliders" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"address" text,
	"phone" varchar(50),
	"rating" numeric(3, 2) DEFAULT '0.00' NOT NULL,
	"num_of_reviews" integer DEFAULT 0 NOT NULL,
	"verification_status" boolean DEFAULT true NOT NULL,
	"verification_info" jsonb,
	"facebook" text,
	"instagram" text,
	"google" text,
	"twitter" text,
	"youtube" text,
	"meta_title" text,
	"meta_description" text,
	"cash_payment_status" boolean DEFAULT true,
	"bank_payment_status" boolean DEFAULT true,
	"bank_name" varchar(150),
	"bank_acc_name" varchar(150),
	"bank_acc_no" varchar(100),
	"bank_routing_no" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shops_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"type" varchar(50) DEFAULT 'cart_base' NOT NULL,
	"code" varchar(50) NOT NULL,
	"details" jsonb,
	"discount" numeric(10, 2) NOT NULL,
	"discount_type" varchar(20) DEFAULT 'percent' NOT NULL,
	"start_date" bigint NOT NULL,
	"end_date" bigint NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "club_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"order_id" integer,
	"points" integer DEFAULT 0 NOT NULL,
	"converted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category" varchar(150) NOT NULL,
	"thumbnail_img" text NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"condition" varchar(50) DEFAULT 'used' NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_phone" varchar(50) NOT NULL,
	"customer_email" varchar(255),
	"location" varchar(255) DEFAULT 'Dhaka, Bangladesh' NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"status" varchar(50) DEFAULT 'approved' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customer_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ticket_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"reply" text NOT NULL,
	"files" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"user_id" text NOT NULL,
	"subject" varchar(255) NOT NULL,
	"details" text NOT NULL,
	"files" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"viewed" boolean DEFAULT false NOT NULL,
	"client_viewed" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tickets_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_details" text,
	"offline_payment" boolean DEFAULT false NOT NULL,
	"approval" boolean DEFAULT true NOT NULL,
	"added_by" varchar(50) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"short_description" text NOT NULL,
	"description" text NOT NULL,
	"banner" text,
	"status" boolean DEFAULT true NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" text,
	"user_name" varchar(255) DEFAULT 'Customer' NOT NULL,
	"user_avatar" text DEFAULT '/assets/img/avatar-placeholder.png',
	"rating" integer DEFAULT 5 NOT NULL,
	"comment" text NOT NULL,
	"photos" text[],
	"status" boolean DEFAULT true NOT NULL,
	"viewed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text,
	"shop_id" integer,
	"title" varchar(255) DEFAULT 'Inquiry' NOT NULL,
	"last_message_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_id" text NOT NULL,
	"message" text NOT NULL,
	"attachments" text[],
	"viewed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refund_reasons" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(60) DEFAULT 'customer_refund_reason' NOT NULL,
	"reason" text NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refund_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"order_code" varchar(50) NOT NULL,
	"user_id" text,
	"user_name" varchar(255) DEFAULT 'Customer' NOT NULL,
	"shop_id" integer,
	"shop_name" varchar(255) DEFAULT 'Active Fashion Outlet',
	"product_name" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"reason" text NOT NULL,
	"details" text,
	"attachment" text,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"admin_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attributes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"values" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staffs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"role_id" integer,
	"role_name" varchar(150) DEFAULT 'Staff' NOT NULL,
	"avatar" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "staffs_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "newsletter_broadcasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "top_banners" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(500) NOT NULL,
	"link" varchar(500),
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_queries" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"product_name" varchar(255) NOT NULL,
	"product_slug" varchar(255) NOT NULL,
	"user_id" text,
	"user_name" varchar(255) NOT NULL,
	"question" text NOT NULL,
	"reply" text,
	"replied_by" varchar(150),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"subject" varchar(255) DEFAULT 'General Inquiry' NOT NULL,
	"content" text NOT NULL,
	"reply" text,
	"status" varchar(20) DEFAULT 'unread' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "colors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warranties" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(255) NOT NULL,
	"logo" text,
	"duration" varchar(50) DEFAULT '1 Year' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text DEFAULT 'custom_page' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text,
	"meta_title" text,
	"meta_description" text,
	"keywords" text,
	"meta_image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_original_name" text,
	"file_name" text NOT NULL,
	"user_id" text,
	"file_size" integer DEFAULT 0,
	"extension" text DEFAULT 'jpg',
	"type" text DEFAULT 'image',
	"external_link" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_labels" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(255) NOT NULL,
	"background_color" varchar(50) DEFAULT '#e1e1e1' NOT NULL,
	"text_color" varchar(50) DEFAULT '#ffffff' NOT NULL,
	"user_type" varchar(50) DEFAULT 'admin' NOT NULL,
	"added_by" text DEFAULT 'Admin' NOT NULL,
	"seller_access" boolean DEFAULT true NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"product_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "taxes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"tax_status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pickup_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"phone" varchar(50) NOT NULL,
	"manager_name" varchar(255),
	"pickup_status" boolean DEFAULT true NOT NULL,
	"cash_on_pickup_status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"link" text,
	"notification_type" varchar(100) DEFAULT 'General' NOT NULL,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_deletes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"notification_id" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_reads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"notification_id" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "measurement_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "size_charts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category_id" integer NOT NULL,
	"fit_type" varchar(50) DEFAULT 'Regular' NOT NULL,
	"unit" varchar(20) DEFAULT 'in' NOT NULL,
	"measurements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dynamic_popups" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"summary" text,
	"banner_url" text NOT NULL,
	"btn_text" varchar(100),
	"btn_background_color" varchar(50),
	"btn_text_color" varchar(20),
	"link" text,
	"delay_sec" integer DEFAULT 3 NOT NULL,
	"duration_sec" integer DEFAULT 15 NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carrier_range_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"carrier_id" integer,
	"carrier_range_id" integer,
	"zone_id" integer DEFAULT 1 NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carrier_ranges" (
	"id" serial PRIMARY KEY NOT NULL,
	"carrier_id" integer,
	"billing_type" varchar(50) DEFAULT 'weight' NOT NULL,
	"delimiter1" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"delimiter2" numeric(10, 2) DEFAULT '10.00' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carriers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"transit_time" varchar(255) DEFAULT '2-3 Business Days' NOT NULL,
	"logo" text,
	"free_shipping" boolean DEFAULT false NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pickup_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"courier_type" varchar(100) DEFAULT 'internal' NOT NULL,
	"address_nickname" varchar(255) NOT NULL,
	"phone" varchar(50),
	"address" varchar(500),
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	"country" varchar(100) DEFAULT 'Bangladesh' NOT NULL,
	"zone_id" integer DEFAULT 1 NOT NULL,
	"cost" numeric(10, 2) DEFAULT '60.00' NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'shipping' NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sms_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"variables" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sms_templates_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE "pos_sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_code" varchar(50) NOT NULL,
	"cashier_name" varchar(100) DEFAULT 'Admin Cashier' NOT NULL,
	"customer_name" varchar(150) DEFAULT 'Walk-in Customer' NOT NULL,
	"customer_phone" varchar(50) DEFAULT 'N/A',
	"customer_email" varchar(150),
	"seller_id" varchar(50),
	"subtotal" numeric(12, 2) NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"discount" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"payment_method" varchar(50) DEFAULT 'Cash' NOT NULL,
	"paid_amount" numeric(12, 2) NOT NULL,
	"change_amount" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"items_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(30) DEFAULT 'completed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pos_sales_order_code_unique" UNIQUE("order_code")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20) NOT NULL,
	"app_lang_code" varchar(20) DEFAULT 'en',
	"rtl" boolean DEFAULT false NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"lang" varchar(20) NOT NULL,
	"lang_key" varchar(255) NOT NULL,
	"lang_value" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"code" varchar(10) NOT NULL,
	"phone_code" varchar(20),
	"zone_id" integer DEFAULT 0,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "states" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_id" integer NOT NULL,
	"name" varchar(150) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" varchar(100) NOT NULL,
	"email_type" varchar(255) NOT NULL,
	"receiver" varchar(50) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"default_text" text NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_templates_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE "customer_package_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"customer_package_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_details" text,
	"offline_payment" boolean DEFAULT false NOT NULL,
	"approval" boolean DEFAULT true NOT NULL,
	"receipt" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"product_upload" integer DEFAULT 10 NOT NULL,
	"logo" varchar(500),
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_package_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"seller_id" integer NOT NULL,
	"seller_package_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_details" text,
	"offline_payment" boolean DEFAULT false NOT NULL,
	"approval" boolean DEFAULT true NOT NULL,
	"receipt" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"product_upload_limit" integer DEFAULT 100 NOT NULL,
	"duration" integer DEFAULT 30 NOT NULL,
	"logo" varchar(500),
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wholesale_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"min_qty" integer NOT NULL,
	"max_qty" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preorder_orders" (
	"150" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"order_code" varchar(50) NOT NULL,
	"product_id" integer NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"prepayment_paid" numeric(10, 2) NOT NULL,
	"remaining_due" numeric(10, 2) NOT NULL,
	"preorder_status" varchar(50) DEFAULT 'deposit_paid' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "preorder_orders_order_code_unique" UNIQUE("order_code")
);
--> statement-breakpoint
CREATE TABLE "preorder_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"sku" varchar(100),
	"thumbnail" varchar(500) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"prepayment_amount" numeric(10, 2) NOT NULL,
	"release_date" timestamp NOT NULL,
	"preorder_batch_limit" integer DEFAULT 100 NOT NULL,
	"current_preorders" integer DEFAULT 0 NOT NULL,
	"seller_slug" varchar(100) DEFAULT 'inhouse',
	"status" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "preorder_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "auction_bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_name" varchar(150) NOT NULL,
	"user_email" varchar(150) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"is_highest" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auction_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_code" varchar(50) NOT NULL,
	"product_id" integer NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"customer_name" varchar(150) NOT NULL,
	"customer_email" varchar(150) NOT NULL,
	"winning_bid" numeric(10, 2) NOT NULL,
	"payment_status" varchar(50) DEFAULT 'paid' NOT NULL,
	"delivery_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auction_orders_order_code_unique" UNIQUE("order_code")
);
--> statement-breakpoint
CREATE TABLE "auction_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"thumbnail" varchar(500) NOT NULL,
	"description" text,
	"starting_bid" numeric(10, 2) NOT NULL,
	"current_bid" numeric(10, 2) NOT NULL,
	"min_bid_increment" numeric(10, 2) DEFAULT '10.00' NOT NULL,
	"auction_start_date" timestamp NOT NULL,
	"auction_end_date" timestamp NOT NULL,
	"total_bids" integer DEFAULT 0 NOT NULL,
	"seller_slug" varchar(100) DEFAULT 'inhouse' NOT NULL,
	"seller_name" varchar(150) DEFAULT 'In-House Store' NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"winner_user_id" varchar(100),
	"winner_name" varchar(150),
	"winner_bid" numeric(10, 2),
	"is_closed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auction_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "affiliate_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(100) NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "affiliate_configs_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "affiliate_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"affiliate_user_id" integer NOT NULL,
	"referred_user_name" varchar(150) NOT NULL,
	"affiliate_type" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"order_code" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliate_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(100) NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "affiliate_options_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "affiliate_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100),
	"user_name" varchar(150) NOT NULL,
	"user_email" varchar(150) NOT NULL,
	"paypal_email" varchar(150),
	"bank_info" text,
	"balance" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"referral_code" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "affiliate_users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "affiliate_withdraw_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"affiliate_user_id" integer NOT NULL,
	"user_name" varchar(150) NOT NULL,
	"user_email" varchar(150) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_boys" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(150) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"avatar" varchar(500),
	"zone_id" integer DEFAULT 1 NOT NULL,
	"zone_name" varchar(100) DEFAULT 'Default Zone' NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"total_earnings" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"total_collection" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"current_pending_deliveries" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "delivery_boys_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "delivery_cancel_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"delivery_boy_id" integer NOT NULL,
	"delivery_boy_name" varchar(150) NOT NULL,
	"order_code" varchar(50) NOT NULL,
	"reason" text NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"delivery_boy_id" integer NOT NULL,
	"delivery_boy_name" varchar(150) NOT NULL,
	"order_code" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"collection_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_payouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"delivery_boy_id" integer NOT NULL,
	"delivery_boy_name" varchar(150) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) DEFAULT 'Cash' NOT NULL,
	"payment_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_digital" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "digital_file" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "weight" numeric(8, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "frequently_bought_selection_type" varchar(20) DEFAULT 'product' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "added_by" varchar(50) DEFAULT 'admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_method" varchar(50) DEFAULT 'standard';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "carrier_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "courier_tracking_code" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "courier_status" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "manual_payment_data" jsonb;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "notified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "frequently_bought_products" ADD CONSTRAINT "frequently_bought_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frequently_bought_products" ADD CONSTRAINT "frequently_bought_products_frequently_bought_product_id_products_id_fk" FOREIGN KEY ("frequently_bought_product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frequently_bought_products" ADD CONSTRAINT "frequently_bought_products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "last_viewed_products" ADD CONSTRAINT "last_viewed_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_withdraw_requests" ADD CONSTRAINT "seller_withdraw_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_withdraw_requests" ADD CONSTRAINT "seller_withdraw_requests_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_followers" ADD CONSTRAINT "shop_followers_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_followers" ADD CONSTRAINT "shop_followers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shops" ADD CONSTRAINT "shops_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_points" ADD CONSTRAINT "club_points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_points" ADD CONSTRAINT "club_points_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_replies" ADD CONSTRAINT "ticket_replies_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_replies" ADD CONSTRAINT "ticket_replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_role_id_staff_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."staff_roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carrier_range_prices" ADD CONSTRAINT "carrier_range_prices_carrier_id_carriers_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."carriers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carrier_range_prices" ADD CONSTRAINT "carrier_range_prices_carrier_range_id_carrier_ranges_id_fk" FOREIGN KEY ("carrier_range_id") REFERENCES "public"."carrier_ranges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carrier_ranges" ADD CONSTRAINT "carrier_ranges_carrier_id_carriers_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."carriers"("id") ON DELETE cascade ON UPDATE no action;