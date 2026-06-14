import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_URL, BRAND, TAGLINE } from "@/lib/site";

const DEFAULT_TITLE = "Will It Fit? Bed in Room Size Visualizer — Does Your Bed Fit?";
const DEFAULT_DESC =
  "Free visual tool: enter your bedroom size and pick a mattress (twin, full, queen, king, Cal king) to instantly see if it fits — with to-scale layout and walking-clearance warnings.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s | Will It Fit?" },
  description: DEFAULT_DESC,
  applicationName: BRAND,
  openGraph: { type: "website", siteName: BRAND, title: DEFAULT_TITLE, description: DEFAULT_DESC, url: SITE_URL },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESC },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0d9488" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">🛏️</span>
              {BRAND}
            </Link>
            <nav className="text-sm text-slate-500">{TAGLINE}</nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl space-y-2 px-4 py-6">
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <Link href="/" className="hover:text-teal-700">Home</Link>
              <Link href="/about" className="hover:text-teal-700">About</Link>
              <Link href="/privacy" className="hover:text-teal-700">Privacy</Link>
            </nav>
            <p className="text-xs text-slate-500">
              For planning only. Real fit also depends on doors, closets, windows, and outlets. Mattress dimensions are
              standard US sizes; bed footprints include a typical frame allowance.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
