export type SiteSettingsProductSignal = {
  label: string;
  detail: string;
};

export type SiteSettings = {
  brandLabel: string;
  positioningLine: string;
  footerSignature: string;
  heroTitle: string;
  heroSubtitle: string;
  productSignals: SiteSettingsProductSignal[];
  footerIntro: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  updatedAt?: string;
};

export type SiteSettingsInput = {
  brandLabel: string;
  positioningLine: string;
  footerSignature: string;
  heroTitle: string;
  heroSubtitle: string;
  productSignals: SiteSettingsProductSignal[];
  footerIntro: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
};

export type SiteSettingsValidationErrors = Partial<Record<keyof SiteSettingsInput, string>>;
