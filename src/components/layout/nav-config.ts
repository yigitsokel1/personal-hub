export type SiteNavItem = {
  href: string;
  label: string;
};

export const siteNavConfig: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/labs", label: "Labs" },
  { href: "/about", label: "About" },
];

export const siteFooterNavConfig: SiteNavItem[] = siteNavConfig.filter(
  (item) => item.href !== "/" && item.href !== "/search"
);
