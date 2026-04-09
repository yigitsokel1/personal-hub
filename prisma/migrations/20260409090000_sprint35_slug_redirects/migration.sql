-- CreateTable
CREATE TABLE "content_slug_redirects" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "old_slug" TEXT NOT NULL,
    "new_slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_slug_redirects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "content_slug_redirects_domain_new_slug_idx" ON "content_slug_redirects"("domain", "new_slug");

-- CreateIndex
CREATE UNIQUE INDEX "content_slug_redirects_domain_old_slug_key" ON "content_slug_redirects"("domain", "old_slug");
