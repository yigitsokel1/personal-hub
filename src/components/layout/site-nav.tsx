"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
      className="flex min-w-0 flex-wrap items-center justify-end gap-x-6 gap-y-2"
      aria-label="Primary"
    >
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm tracking-tight transition-colors ${
              active
                ? "font-medium text-foreground"
                : "text-foreground/65 hover:text-foreground"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
