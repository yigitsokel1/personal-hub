"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteNavLinkClassName } from "@/lib/ui/link-tokens";
import { bracketWrap } from "@/lib/ui/terminal-tokens";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/labs", label: "Labs" },
  { href: "/about", label: "About" },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex min-w-0 flex-wrap items-center justify-end gap-x-4 gap-y-1.5 sm:gap-x-6 sm:gap-y-2"
      aria-label="Primary"
    >
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={siteNavLinkClassName(active)}
            aria-current={active ? "page" : undefined}
          >
            {bracketWrap(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}
