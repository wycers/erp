CREATE TYPE "public"."document_status" AS ENUM('DRAFT', 'POSTED');--> statement-breakpoint
CREATE TYPE "public"."inventory_direction" AS ENUM('IN', 'OUT');--> statement-breakpoint
CREATE TYPE "public"."inventory_item_kind" AS ENUM('MATERIAL', 'PRODUCT');--> statement-breakpoint
CREATE TYPE "public"."inventory_source_type" AS ENUM('PURCHASE', 'PRODUCTION_CONSUME', 'PRODUCTION_OUTPUT', 'SALES');--> statement-breakpoint
CREATE TABLE "finished_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"inventory_item_id" integer NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"note" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_balance" (
	"id" serial PRIMARY KEY NOT NULL,
	"inventory_item_id" integer NOT NULL,
	"quantity" numeric(18, 2) DEFAULT '0' NOT NULL,
	"average_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "inventory_item_kind" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_movement" (
	"id" serial PRIMARY KEY NOT NULL,
	"inventory_item_id" integer NOT NULL,
	"direction" "inventory_direction" NOT NULL,
	"source_type" "inventory_source_type" NOT NULL,
	"source_id" integer NOT NULL,
	"source_line_id" integer,
	"quantity" numeric(18, 2) NOT NULL,
	"unit_cost" numeric(18, 2) NOT NULL,
	"total_cost" numeric(18, 2) NOT NULL,
	"balance_quantity" numeric(18, 2) NOT NULL,
	"balance_average_cost" numeric(18, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "material_sku" (
	"id" serial PRIMARY KEY NOT NULL,
	"inventory_item_id" integer NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"note" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_bom" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_bom_line" (
	"id" serial PRIMARY KEY NOT NULL,
	"bom_id" integer NOT NULL,
	"line_no" integer NOT NULL,
	"material_sku_id" integer NOT NULL,
	"quantity_per_unit" numeric(18, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"product_id" integer NOT NULL,
	"output_quantity" numeric(18, 2) NOT NULL,
	"status" "document_status" DEFAULT 'DRAFT' NOT NULL,
	"total_consumed_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"unit_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"posted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_order_component" (
	"id" serial PRIMARY KEY NOT NULL,
	"production_order_id" integer NOT NULL,
	"line_no" integer NOT NULL,
	"material_sku_id" integer NOT NULL,
	"required_quantity" numeric(18, 2) NOT NULL,
	"unit_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"freight_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" "document_status" DEFAULT 'DRAFT' NOT NULL,
	"posted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order_line" (
	"id" serial PRIMARY KEY NOT NULL,
	"purchase_order_id" integer NOT NULL,
	"line_no" integer NOT NULL,
	"material_sku_id" integer NOT NULL,
	"quantity" numeric(18, 2) NOT NULL,
	"line_amount" numeric(18, 2) NOT NULL,
	"unit_price" numeric(18, 2) DEFAULT '0' NOT NULL,
	"allocated_freight" numeric(18, 2) DEFAULT '0' NOT NULL,
	"landed_unit_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_shipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"shipment_number" text NOT NULL,
	"status" "document_status" DEFAULT 'DRAFT' NOT NULL,
	"posted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_shipment_line" (
	"id" serial PRIMARY KEY NOT NULL,
	"sales_shipment_id" integer NOT NULL,
	"line_no" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" numeric(18, 2) NOT NULL,
	"selling_unit_price" numeric(18, 2) NOT NULL,
	"revenue" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cogs_unit_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cogs_total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gross_profit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gross_margin" numeric(10, 4) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "finished_product" ADD CONSTRAINT "finished_product_inventory_item_id_inventory_item_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_balance" ADD CONSTRAINT "inventory_balance_inventory_item_id_inventory_item_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_inventory_item_id_inventory_item_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_sku" ADD CONSTRAINT "material_sku_inventory_item_id_inventory_item_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_bom" ADD CONSTRAINT "product_bom_product_id_finished_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."finished_product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_bom_line" ADD CONSTRAINT "product_bom_line_bom_id_product_bom_id_fk" FOREIGN KEY ("bom_id") REFERENCES "public"."product_bom"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_bom_line" ADD CONSTRAINT "product_bom_line_material_sku_id_material_sku_id_fk" FOREIGN KEY ("material_sku_id") REFERENCES "public"."material_sku"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_order" ADD CONSTRAINT "production_order_product_id_finished_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."finished_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_order_component" ADD CONSTRAINT "production_order_component_production_order_id_production_order_id_fk" FOREIGN KEY ("production_order_id") REFERENCES "public"."production_order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_order_component" ADD CONSTRAINT "production_order_component_material_sku_id_material_sku_id_fk" FOREIGN KEY ("material_sku_id") REFERENCES "public"."material_sku"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_line" ADD CONSTRAINT "purchase_order_line_purchase_order_id_purchase_order_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_line" ADD CONSTRAINT "purchase_order_line_material_sku_id_material_sku_id_fk" FOREIGN KEY ("material_sku_id") REFERENCES "public"."material_sku"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_shipment_line" ADD CONSTRAINT "sales_shipment_line_sales_shipment_id_sales_shipment_id_fk" FOREIGN KEY ("sales_shipment_id") REFERENCES "public"."sales_shipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_shipment_line" ADD CONSTRAINT "sales_shipment_line_product_id_finished_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."finished_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "finished_product_inventory_item_id_unique" ON "finished_product" USING btree ("inventory_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "finished_product_code_unique" ON "finished_product" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_balance_inventory_item_unique" ON "inventory_balance" USING btree ("inventory_item_id");--> statement-breakpoint
CREATE INDEX "inventory_movement_inventory_item_created_at_idx" ON "inventory_movement" USING btree ("inventory_item_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "material_sku_inventory_item_id_unique" ON "material_sku" USING btree ("inventory_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "material_sku_code_unique" ON "material_sku" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "product_bom_product_id_unique" ON "product_bom" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_bom_line_bom_line_no_unique" ON "product_bom_line" USING btree ("bom_id","line_no");--> statement-breakpoint
CREATE UNIQUE INDEX "product_bom_line_bom_material_unique" ON "product_bom_line" USING btree ("bom_id","material_sku_id");--> statement-breakpoint
CREATE UNIQUE INDEX "production_order_order_number_unique" ON "production_order" USING btree ("order_number");--> statement-breakpoint
CREATE UNIQUE INDEX "production_order_component_order_line_no_unique" ON "production_order_component" USING btree ("production_order_id","line_no");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_order_order_number_unique" ON "purchase_order" USING btree ("order_number");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_order_line_order_line_no_unique" ON "purchase_order_line" USING btree ("purchase_order_id","line_no");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_shipment_shipment_number_unique" ON "sales_shipment" USING btree ("shipment_number");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_shipment_line_shipment_line_no_unique" ON "sales_shipment_line" USING btree ("sales_shipment_id","line_no");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");