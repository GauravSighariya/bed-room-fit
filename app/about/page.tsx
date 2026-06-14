import type { Metadata } from "next";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `How ${BRAND} estimates whether a bed fits your room.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-5 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">About {BRAND}</h1>
      <p>
        {BRAND} is a free visual tool that shows whether a given mattress size fits in a bedroom of a given size — to
        scale, with the walking clearance you&apos;d actually have around the bed. We built it because most answers to
        &quot;will a king fit in a 10×10 room?&quot; are buried in text articles; a quick visual is far clearer.
      </p>
      <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
      <p>
        We use standard US mattress dimensions and add a typical bed-frame allowance (about 3 inches around the
        mattress). The bed is placed against the headboard wall and centered, and we measure the clearance on each side
        and at the foot. We flag fit against the common interior-design guideline of at least 24 inches of walkway on the
        sides you use to get in and out.
      </p>
      <h2 className="text-xl font-semibold text-slate-900">Limitations</h2>
      <p>
        These are planning estimates. Real-world fit also depends on door and closet swings, windows, radiators, and
        outlets, and on your specific bed frame, which this tool doesn&apos;t model. Always measure your actual room and
        furniture before buying.
      </p>
    </article>
  );
}
