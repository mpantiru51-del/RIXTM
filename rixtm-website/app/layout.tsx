import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RIXTM — Invest. Earn. Grow.",
  description: "RIXTM — un ecosistem blockchain sigur, transparent și construit pentru viitor.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ro"><body>{children}</body></html>;
}
