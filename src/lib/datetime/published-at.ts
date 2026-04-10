const TR_TIMEZONE = "Europe/Istanbul";
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateOnly(value: string): boolean {
  if (!DATE_ONLY_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime());
}

export function toDateOnlyInTurkey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TR_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

export function parseDateOnlyToUtc(dateOnly: string): Date {
  const [year, month, day] = dateOnly.split("-").map((part) => Number(part));
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

export function normalizeDateOnlyInput(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  return isValidDateOnly(normalized) ? normalized : undefined;
}

export function todayDateOnlyInTurkey(): string {
  return toDateOnlyInTurkey(new Date());
}
