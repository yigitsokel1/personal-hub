import Link from "next/link";
import { siteFooterNavConfig } from "@/components/layout/nav-config";
import { getSiteSettings } from "@/lib/content-source/get-site-settings";
import { linkFocusVisibleClassName } from "@/lib/ui/link-tokens";
import { TREE_PREFIX, ARROW } from "@/lib/ui/terminal-tokens";

const sectionHeadingClassName =
  "font-mono text-xs uppercase tracking-[0.15em] text-black/40";

export async function SiteFooter() {
  const { value: settings } = await getSiteSettings();
  const footerConnect = [
    { href: `mailto:${settings.contactEmail}`, label: settings.contactEmail },
    { href: settings.githubUrl, label: settings.githubUrl.replace(/^https?:\/\//, "") },
    { href: settings.linkedinUrl, label: settings.linkedinUrl.replace(/^https?:\/\//, "") },
  ] as const;

  return (
    <footer className="border-t border-black/8 text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          <div>
            <h3 className={sectionHeadingClassName}>
              {TREE_PREFIX} INFO
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-black/55">
              {settings.footerIntro}
            </p>
          </div>

          <div>
            <h3 className={sectionHeadingClassName}>
              {TREE_PREFIX} NAVIGATE
            </h3>
            <ul className="mt-3 space-y-1.5">
              {siteFooterNavConfig.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`font-mono text-sm text-black/55 transition-colors duration-200 hover:text-foreground ${linkFocusVisibleClassName}`}
                  >
                    {ARROW} {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={sectionHeadingClassName}>
              {TREE_PREFIX} CONNECT
            </h3>
            <ul className="mt-3 space-y-1.5">
              {footerConnect.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`font-mono text-sm text-black/55 transition-colors duration-200 hover:text-foreground ${linkFocusVisibleClassName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 bg-terminal-bg text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <span className="font-mono text-xs text-white/50">
            {settings.footerSignature}
          </span>
          <span className="font-mono text-xs text-white/50">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
