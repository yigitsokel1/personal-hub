export type SiteSettingsProductSignal = {
  label: string;
  detail: string;
};

export type SiteSettings = {
  heroTitle: string;
  heroSubtitle: string;
  productSignals: SiteSettingsProductSignal[];
  aboutShort: string;
  footerIntro: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  updatedAt?: string;
};

export type SiteSettingsInput = {
  heroTitle: string;
  heroSubtitle: string;
  productSignals: SiteSettingsProductSignal[];
  aboutShort: string;
  footerIntro: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
};

export type SiteSettingsValidationErrors = Partial<Record<keyof SiteSettingsInput, string>>;
