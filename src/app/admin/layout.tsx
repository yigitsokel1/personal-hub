import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <style>{`
        [data-public-shell-header],
        [data-public-shell-footer] {
          display: none;
        }
      `}</style>
      {children}
    </>
  );
}
