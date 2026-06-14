import type { Metadata } from "next";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND} handles data, cookies, and advertising.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-5 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: June 2026</p>
      <p>
        {BRAND} runs entirely in your browser. The room dimensions and bed sizes you enter are <strong>not sent to or
        stored on our servers</strong> — all calculations happen on your device.
      </p>
      <h2 className="text-xl font-semibold text-slate-900">Cookies and advertising</h2>
      <p>
        This site may display ads served by Google AdSense and other third-party vendors. These vendors, including
        Google, use cookies to serve ads based on your prior visits to this and other websites. You can opt out of
        personalized advertising via{" "}
        <a className="text-teal-700 underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>{" "}
        or at{" "}
        <a className="text-teal-700 underline" href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">aboutads.info</a>.
      </p>
      <h2 className="text-xl font-semibold text-slate-900">Analytics</h2>
      <p>We may use privacy-respecting, aggregate analytics to understand which pages are popular. This data is not used to personally identify you.</p>
      <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
      <p>Questions about this policy? Reach out via the site you found this tool on.</p>
    </article>
  );
}
