UPDATE "finished_product" SET "unit" = '-' WHERE "unit" IS NULL;--> statement-breakpoint
UPDATE "material_sku" SET "unit" = '-' WHERE "unit" IS NULL;--> statement-breakpoint
ALTER TABLE "finished_product" ALTER COLUMN "unit" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "material_sku" ALTER COLUMN "unit" SET NOT NULL;