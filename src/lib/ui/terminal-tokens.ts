/**
 * Terminal/monospace design tokens for the developer-aesthetic visual language.
 * Pure constants and helpers — no side effects, no dependencies.
 */

export const TREE_PREFIX = "\u251C\u2500";
export const ARROW = "\u2192";

export const sectionLabelClassName =
  "font-mono text-xs uppercase tracking-[0.15em] text-black/50";

export const terminalButtonClassName = [
  "inline-flex items-center gap-2 bg-foreground text-white",
  "px-5 py-2.5 font-mono text-sm tracking-wide",
  "transition-[background-color,transform,box-shadow] duration-200 ease-out",
  "hover:bg-black/85 hover:shadow-[0_1px_0_0_rgba(0,0,0,0.08)] active:scale-[0.98]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground/25",
].join(" ");

export const terminalButtonOutlineClassName = [
  "inline-flex items-center gap-2 border border-foreground text-foreground",
  "px-5 py-2.5 font-mono text-sm tracking-wide",
  "transition-[background-color,color,transform,box-shadow] duration-200 ease-out",
  "hover:bg-foreground hover:text-white active:scale-[0.98]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground/25",
].join(" ");

export function cardIndex(n: number): string {
  return `[${String(n).padStart(2, "0")}]`;
}

export function bracketWrap(label: string): string {
  return `[${label.toLowerCase()}]`;
}
