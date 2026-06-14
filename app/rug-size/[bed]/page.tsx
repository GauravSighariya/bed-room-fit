import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RugVisualizer from "@/components/RugVisualizer";
import { BEDS, BED_BY_SLUG, formatClearance } from "@/lib/beds";
import { RUG_REC, STANDARD_RUGS, rugFit, rugLabel } from "@/lib/rug";
import { SITE_URL, BRAND } from "@/lib/site";

type Props = { params: Promise<{ bed: string }> };

export function generateStaticParams() {
  return BEDS.map((b) => ({ bed: `${b.slug}-bed` }));
}

export const dynamicParams = false;

function bedFromParam(param: string) {
  return BED_BY_SLUG[param.replace(/-bed$/, "")];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bed: param } = await params;
  const bed = bedFromParam(param);
  if (!bed) return {};
  const rec = RUG_REC[bed.slug];
  const title = `What Size Rug for a ${bed.name} Bed? (Visual Guide)`;
  const description = `The best rug size for a ${bed.name} bed is ${rugLabel(rec.ideal)}. See a to-scale visual of a rug under a ${bed.name} bed (${bed.w}×${bed.l}″) with exact overhang on every side.`;
  return {
    title,
    description,
    alternates: { canonical: `/rug-size/${param}` },
    openGraph: { title, description, url: `${SITE_URL}/rug-size/${param}`, siteName: BRAND, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RugPage({ params }: Props) {
  const { bed: param } = await params;
  const bed = bedFromParam(param);
  if (!bed) notFound();
  const rec = RUG_REC[bed.slug];

  const rows = STANDARD_RUGS.map((r) => ({ r, fit: rugFit(bed, r[0], r[1]) })).filter((x) => x.fit.tier !== "too-small");
  const idealFit = rugFit(bed, rec.ideal[0], rec.ideal[1]);

  const faq = [
    {
      q: `What size rug should go under a ${bed.name} bed?`,
      a: `A ${rugLabel(rec.ideal)} rug is the best all-round choice for a ${bed.name} bed. Centered under the bed it leaves about ${formatClearance(Math.max(0, idealFit.side))} of rug showing on each side. In a smaller room a ${rugLabel(rec.min)} works; ${rec.large ? `in a large room a ${rugLabel(rec.large)} looks great.` : `or use two runners along the sides.`}`,
    },
    {
      q: `How much rug should show around a bed?`,
      a: `Designers recommend at least 18 inches of rug visible on the sides you step onto (some go 12–24″). The rug is usually placed under the lower two-thirds of the bed so it extends past the foot and sides.`,
    },
    {
      q: `What are the dimensions of a ${bed.name} bed?`,
      a: `A ${bed.name} mattress is ${bed.w}″ × ${bed.l}″, which is what the rug needs to frame.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebApplication", name: `Rug size for a ${bed.name} bed`, url: `${SITE_URL}/rug-size/${param}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: `Rug size for ${bed.name} bed`, item: `${SITE_URL}/rug-size/${param}` },
      ] },
      { "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section>
        <nav className="mb-3 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-teal-700">Home</Link> /{" "}
          <span className="text-slate-700">Rug size for {bed.name} bed</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">What Size Rug for a {bed.name} Bed?</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          The best rug size for a {bed.name} bed ({bed.w}×{bed.l}″) is <strong>{rugLabel(rec.ideal)}</strong>. Pick any rug
          size below to see it to scale under the bed, with the exact overhang on each side.
        </p>
      </section>

      <RugVisualizer initialBedSlug={bed.slug} />

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Rug sizes for a {bed.name} bed</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2 font-semibold">Rug size</th>
                <th className="px-4 py-2 font-semibold">Overhang per side</th>
                <th className="px-4 py-2 font-semibold">Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ r, fit }) => (
                <tr key={r.join("x")} className={r[0] === rec.ideal[0] && r[1] === rec.ideal[1] ? "bg-teal-50/60" : ""}>
                  <td className="px-4 py-2 font-medium">{rugLabel(r)}{r[0] === rec.ideal[0] && r[1] === rec.ideal[1] ? " ★" : ""}</td>
                  <td className="px-4 py-2 text-slate-600">{formatClearance(Math.max(0, fit.side))}</td>
                  <td className="px-4 py-2 text-slate-700 capitalize">{fit.tier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-500">★ recommended. Overhang assumes the bed centered on the rug; placing the rug under the lower ⅔ of the bed shifts more of it toward the foot.</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Rug size for other beds</h2>
        <div className="flex flex-wrap gap-2.5">
          {BEDS.filter((b) => b.slug !== bed.slug).map((b) => (
            <Link key={b.slug} href={`/rug-size/${b.slug}-bed`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
              {b.name} →
            </Link>
          ))}
          <Link href="/" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-teal-700 transition hover:border-teal-300">Will a {bed.name} fit my room? →</Link>
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
