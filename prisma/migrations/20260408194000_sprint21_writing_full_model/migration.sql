-- Expand writing model
ALTER TABLE "writing"
ADD COLUMN "category" TEXT,
ADD COLUMN "series" TEXT,
ADD COLUMN "reading_time" INTEGER,
ADD COLUMN "published_at" TIMESTAMP(3),
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill published_at for already published records
UPDATE "writing"
SET "published_at" = "created_at"
WHERE "published" = true
  AND "published_at" IS NULL;

-- CreateIndex
CREATE INDEX "writing_published_published_at_idx"
ON "writing"("published", "published_at" DESC);
