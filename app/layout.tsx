import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NATA-REVA — Architecture Entrance Prep",
  description: "Premium NATA preparation platform with AI-powered tutoring",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
