-- AlterTable
ALTER TABLE "site_settings"
ADD COLUMN IF NOT EXISTS "brand_label" TEXT NOT NULL DEFAULT 'OYS — Personal Hub',
ADD COLUMN IF NOT EXISTS "positioning_line" TEXT NOT NULL DEFAULT 'Product engineer',
ADD COLUMN IF NOT EXISTS "footer_signature" TEXT NOT NULL DEFAULT 'product_engineering.for_real_systems()';

-- CreateTable
CREATE TABLE IF NOT EXISTS "about_page_content" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "title" TEXT NOT NULL,
  "intro" TEXT NOT NULL,
  "sections" JSONB NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "about_page_content_pkey" PRIMARY KEY ("id")
);
