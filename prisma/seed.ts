import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultSiteSettings = {
  brandLabel: "OYS — Personal Hub",
  positioningLine: "Product engineer",
  footerSignature: "product_engineering.for_real_systems()",
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
  footerIntro:
    "Personal hub for building and documenting real systems across projects, work, writing, and labs.",
  contactEmail: "oyigitsokell@gmail.com",
  githubUrl: "https://github.com/yigitsokel1",
  linkedinUrl: "https://www.linkedin.com/in/osman-yigit-sokel/",
};

const defaultAboutPage = {
  title: "About",
  intro:
    "I am a product engineer who builds systems, not demos. I own problems end to end: framing, tradeoffs, architecture, shipping, validation, and iteration.",
  sections: [
    {
      heading: "How I work",
      body: "I combine AI-assisted workflows with disciplined backend and product execution: small vertical slices, explicit failure modes, and systems teams can operate.",
    },
    {
      heading: "What you will find here",
      body: "Projects are productized systems with architecture and outcomes. Work covers real engagements and decisions. Writing captures technical judgment. Labs document experiments.",
    },
  ],
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
      brandLabel: defaultSiteSettings.brandLabel,
      positioningLine: defaultSiteSettings.positioningLine,
      footerSignature: defaultSiteSettings.footerSignature,
      heroTitle: defaultSiteSettings.heroTitle,
      heroSubtitle: defaultSiteSettings.heroSubtitle,
      productSignals: defaultSiteSettings.productSignals,
      footerIntro: defaultSiteSettings.footerIntro,
      contactEmail: defaultSiteSettings.contactEmail,
      githubUrl: defaultSiteSettings.githubUrl,
      linkedinUrl: defaultSiteSettings.linkedinUrl,
    },
  });

  await prisma.aboutPageContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      title: defaultAboutPage.title,
      intro: defaultAboutPage.intro,
      sections: defaultAboutPage.sections,
    },
    update: {},
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
