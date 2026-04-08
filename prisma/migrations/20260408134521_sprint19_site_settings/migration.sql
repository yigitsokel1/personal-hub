-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "hero_title" TEXT NOT NULL,
    "hero_subtitle" TEXT NOT NULL,
    "product_signals" JSONB NOT NULL,
    "about_short" TEXT NOT NULL,
    "footer_intro" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "github_url" TEXT NOT NULL,
    "linkedin_url" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
