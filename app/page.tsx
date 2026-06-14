import Link from "next/link";
import RoomVisualizer from "@/components/RoomVisualizer";
import { BEDS, ROOMS, comboSlug, computeFit } from "@/lib/beds";
import { SITE_URL, BRAND } from "@/lib/site";

const POPULAR: [string, number, number][] = [
  ["king", 10, 10], ["queen", 10, 10], ["king", 12, 12], ["queen", 11, 11],
  ["full", 10, 10], ["king", 10, 12], ["queen", 9, 10], ["king", 11, 12],
  ["cal-king", 12, 12], ["full", 9, 9], ["twin", 8, 8], ["queen", 12, 14],
];

const FAQ = [
  {
    q: "What size room do I need for a king bed?",
    a: "A standard king mattress is 76″ × 80″. With a frame and the recommended 24″+ of walking clearance, a king is comfortable in a room of about 12×12 ft or larger. It will fit in a 10×10 room but feels cramped, with little space for nightstands or movement.",
  },
  {
    q: "Will a queen bed fit in a 10x10 room?",
    a: "Yes. A queen (60″ × 80″) fits in a 10×10 room and is the most popular choice for that size, though it takes up a good portion of the floor. You'll have comfortable clearance on the sides but limited room for large extra furniture.",
  },
  {
    q: "How much space do you need to walk around a bed?",
    a: "Interior designers recommend at least 24 inches (2 feet) of clearance on the sides you use to get in and out, and ideally around the foot of the bed too. Under 18 inches feels cramped. This tool flags when your clearance drops below those thresholds.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: BRAND, url: SITE_URL },
      {
        "@type": "WebApplication",
        name: "Bed in Room Size Visualizer",
        url: SITE_URL,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Will the bed fit in your room?</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Enter your bedroom size, pick a US mattress size, and instantly see a to-scale layout with walking-clearance
          warnings. No sign-up.
        </p>
      </section>

      <RoomVisualizer initialBedSlug="queen" initialW={10} initialH={10} />

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Popular questions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR.map(([b, w, h]) => {
            const bed = BEDS.find((x) => x.slug === b)!;
            const fit = computeFit(w, h, bed);
            return (
              <Link
                key={`${b}-${w}-${h}`}
                href={`/${comboSlug(b, w, h)}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-teal-300"
              >
                <span className="font-medium text-slate-800">Will a {bed.name} fit in a {w}×{h} room?</span>
                <span className="mt-0.5 block text-sm text-teal-700">{fit.title} →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Browse by bed size</h2>
        <div className="flex flex-wrap gap-2.5">
          {BEDS.map((b) => (
            <Link
              key={b.slug}
              href={`/${comboSlug(b.slug, 10, 10)}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
            >
              {b.name} bed ({b.w}×{b.l}″) →
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">How to read the layout</h2>
        <p className="mt-2 text-slate-600">
          The tool places the bed against the headboard wall (the teal edge) and centers it. It then measures the walking
          clearance on each side and at the foot of the bed. We include a typical bed-frame allowance and use the common
          designer guideline of <strong>24 inches</strong> minimum walkway. {ROOMS.length}+ room sizes and all six US
          mattress sizes are covered — change any input to see your exact situation.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
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
