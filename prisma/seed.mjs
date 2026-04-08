import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultSiteSettings = {
  heroTitle: "AI + Backend Engineer",
  heroSubtitle:
    "I design production systems that combine product thinking, backend rigor, and AI-native workflows.",
  productSignals: [
    {
      label: "content_first_system",
      detail:
        "Content is structured and typed across all domains with explicit schema contracts.",
    },
    {
      label: "code_first_delivery",
      detail: "Content is managed through an admin panel with domain-driven publishing workflows.",
    },
    {
      label: "engineering_judgment",
      detail:
        "Case studies capture scope, trade-offs, and delivery constraints as first-class metadata.",
    },
    {
      label: "continuous_builder",
      detail:
        "Consistency is enforced by validators with no implicit content parsing in runtime.",
    },
  ],
  aboutShort:
    "Product engineer building real systems with AI and backend engineering, documented as reusable case studies.",
  footerIntro:
    "Personal hub for building and documenting real systems across projects, work, writing, and labs.",
  contactEmail: "oyigitsokell@gmail.com",
  githubUrl: "https://github.com/yigitsokel1",
  linkedinUrl: "https://www.linkedin.com/in/osman-yigit-sokel/",
};

async function main() {
  const existing = await prisma.siteSettings.findUnique({
    where: { id: 1 },
  });

  if (existing) {
    console.log("site_settings already exists (id=1). Skipping seed.");
    return;
  }

  await prisma.siteSettings.create({
    data: {
      id: 1,
      heroTitle: defaultSiteSettings.heroTitle,
      heroSubtitle: defaultSiteSettings.heroSubtitle,
      productSignals: defaultSiteSettings.productSignals,
      aboutShort: defaultSiteSettings.aboutShort,
      footerIntro: defaultSiteSettings.footerIntro,
      contactEmail: defaultSiteSettings.contactEmail,
      githubUrl: defaultSiteSettings.githubUrl,
      linkedinUrl: defaultSiteSettings.linkedinUrl,
    },
  });

  console.log("site_settings seeded with default values.");
}

main()
  .catch((error) => {
    console.error("Failed to seed site_settings:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
