import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RIXTM — Invest. Earn. Grow.",
  description:
    "RIXTM — decentralized, secure and built for the future.",
  icons: { icon: "/rixtm-exact.jpeg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
