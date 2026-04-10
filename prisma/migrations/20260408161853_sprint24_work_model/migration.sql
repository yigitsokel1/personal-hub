-- DropIndex
DROP INDEX IF EXISTS "projects_published_published_at_idx";

-- DropIndex
DROP INDEX IF EXISTS "writing_published_published_at_idx";

-- AlterTable
ALTER TABLE "writing" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "work" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "client" TEXT NOT NULL,
    "engagement_type" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "timeline" TEXT,
    "confidentiality_level" TEXT,
    "scope" TEXT[],
    "responsibilities" TEXT[],
    "constraints" TEXT[],
    "impact" TEXT[],

    CONSTRAINT "work_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "work_slug_key" ON "work"("slug");
