import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RoomVisualizer from "@/components/RoomVisualizer";
import {
  BEDS, ROOMS, allCombos, parseCombo, comboSlug, computeFit, formatClearance,
} from "@/lib/beds";
import { SITE_URL, BRAND } from "@/lib/site";

type Props = { params: Promise<{ combo: string }> };

export function generateStaticParams() {
  return allCombos().map((c) => ({ combo: comboSlug(c.bed.slug, c.w, c.h) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { combo } = await params;
  const c = parseCombo(combo);
  if (!c) return {};
  const title = `Will a ${c.bed.name} Bed Fit in a ${c.w}×${c.h} Room?`;
  const fit = computeFit(c.w, c.h, c.bed);
  const description = `${fit.title}: see a to-scale layout of a ${c.bed.name} bed in a ${c.w}×${c.h} ft room, with exact walking-clearance measurements and the recommended room size.`;
  const url = `${SITE_URL}/${combo}`;
  return {
    title,
    description,
    alternates: { canonical: `/${combo}` },
    openGraph: { title, description, url, siteName: BRAND, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ComboPage({ params }: Props) {
  const { combo } = await params;
  const c = parseCombo(combo);
  if (!c) notFound();

  const { bed, w, h } = c;
  const fit = computeFit(w, h, bed);

  // How every bed fits in THIS room
  const bedsInRoom = BEDS.map((b) => ({ b, fit: computeFit(w, h, b) }));
  // Same bed in nearby rooms
  const otherRooms = ROOMS.filter(([rw, rh]) => !(rw === w && rh === h)).slice(0, 10);

  const faq = [
    {
      q: `Will a ${bed.name} bed fit in a ${w}×${h} room?`,
      a: fit.message,
    },
    {
      q: `What are the dimensions of a ${bed.name} bed?`,
      a: `A ${bed.name} mattress is ${bed.w}″ × ${bed.l}″ (about ${(bed.w / 12).toFixed(1)}′ × ${(bed.l / 12).toFixed(1)}′). With a typical frame it occupies roughly ${fit.bedW}″ × ${fit.bedL}″ of floor space.`,
    },
    {
      q: `How much walking space is left?`,
      a: fit.fits
        ? `In a ${w}×${h} room a centered ${bed.name} bed leaves about ${formatClearance(fit.side)} on each side and ${formatClearance(fit.foot)} at the foot of the bed.`
        : `A ${bed.name} bed does not fit in a ${w}×${h} room once a frame is included, so there is no usable walking clearance.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${bed.name} bed in a ${w}×${h} room`,
        url: `${SITE_URL}/${combo}`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: `${bed.name} in ${w}×${h} room`, item: `${SITE_URL}/${combo}` },
        ],
      },
      { "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section>
        <nav className="mb-3 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-teal-700">Home</Link> /{" "}
          <span className="text-slate-700">{bed.name} in {w}×{h} room</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Will a {bed.name} Bed Fit in a {w}×{h} Room?
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">{fit.message}</p>
      </section>

      <RoomVisualizer initialBedSlug={bed.slug} initialW={w} initialH={h} />

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">How every bed size fits in a {w}×{h} room</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2 font-semibold">Bed</th>
                <th className="px-4 py-2 font-semibold">Mattress</th>
                <th className="px-4 py-2 font-semibold">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bedsInRoom.map(({ b, fit: f }) => (
                <tr key={b.slug} className={b.slug === bed.slug ? "bg-teal-50/60" : ""}>
                  <td className="px-4 py-2 font-medium">
                    <Link href={`/${comboSlug(b.slug, w, h)}`} className="text-teal-700 hover:underline">{b.name}</Link>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{b.w}×{b.l}″</td>
                  <td className="px-4 py-2 text-slate-700">{f.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Will a {bed.name} fit in other room sizes?</h2>
        <div className="flex flex-wrap gap-2.5">
          {otherRooms.map(([rw, rh]) => (
            <Link
              key={`${rw}x${rh}`}
              href={`/${comboSlug(bed.slug, rw, rh)}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
            >
              {rw}×{rh} room →
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="space-y-4">
          {faq.map((f) => (
            <div key={f.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">{f.q}</h3>
              <p className="mt-1 text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
