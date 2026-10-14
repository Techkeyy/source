import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Source | Find work that fits",
  description: "Turn your public work into grounded client opportunity discovery.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
