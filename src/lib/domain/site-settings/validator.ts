import type {
  SiteSettingsInput,
  SiteSettingsProductSignal,
  SiteSettingsValidationErrors,
} from "@/lib/domain/site-settings/types";

const MAX_PRODUCT_SIGNALS = 8;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function cleanSignal(signal: SiteSettingsProductSignal): SiteSettingsProductSignal {
  return {
    label: signal.label.trim(),
    detail: signal.detail.trim(),
  };
}

export function parseProductSignalsText(raw: string): SiteSettingsProductSignal[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [labelPart, ...detailParts] = line.split("|");
      return {
        label: (labelPart ?? "").trim(),
        detail: detailParts.join("|").trim(),
      };
    });
}

export function serializeProductSignalsText(signals: SiteSettingsProductSignal[]): string {
  return signals.map((signal) => `${signal.label} | ${signal.detail}`).join("\n");
}

export function validateSiteSettingsInput(input: SiteSettingsInput): {
  success: boolean;
  value: SiteSettingsInput;
  errors: SiteSettingsValidationErrors;
} {
  const value: SiteSettingsInput = {
    heroTitle: input.heroTitle.trim(),
    heroSubtitle: input.heroSubtitle.trim(),
    productSignals: input.productSignals.map(cleanSignal),
    aboutShort: input.aboutShort.trim(),
    footerIntro: input.footerIntro.trim(),
    contactEmail: input.contactEmail.trim(),
    githubUrl: input.githubUrl.trim(),
    linkedinUrl: input.linkedinUrl.trim(),
  };

  const errors: SiteSettingsValidationErrors = {};

  if (!value.heroTitle) errors.heroTitle = "Hero title is required.";
  if (!value.heroSubtitle) errors.heroSubtitle = "Hero subtitle is required.";
  if (!value.aboutShort) errors.aboutShort = "About short is required.";
  if (!value.footerIntro) errors.footerIntro = "Footer intro is required.";

  if (!value.contactEmail) {
    errors.contactEmail = "Contact email is required.";
  } else if (!isValidEmail(value.contactEmail)) {
    errors.contactEmail = "Contact email must be a valid email.";
  }

  if (!value.githubUrl) {
    errors.githubUrl = "GitHub URL is required.";
  } else if (!isValidUrl(value.githubUrl)) {
    errors.githubUrl = "GitHub URL must be a valid URL.";
  }

  if (!value.linkedinUrl) {
    errors.linkedinUrl = "LinkedIn URL is required.";
  } else if (!isValidUrl(value.linkedinUrl)) {
    errors.linkedinUrl = "LinkedIn URL must be a valid URL.";
  }

  if (value.productSignals.length === 0) {
    errors.productSignals = "At least one product signal is required.";
  } else if (value.productSignals.length > MAX_PRODUCT_SIGNALS) {
    errors.productSignals = `Maximum ${MAX_PRODUCT_SIGNALS} product signals allowed.`;
  } else {
    const invalidSignal = value.productSignals.find((signal) => !signal.label || !signal.detail);
    if (invalidSignal) {
      errors.productSignals = "Each product signal must include label and detail.";
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
    value,
  };
}
