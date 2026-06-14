"use client";

import { useMemo, useState } from "react";
import { BEDS, BED_BY_SLUG, formatClearance } from "@/lib/beds";
import { STANDARD_RUGS, RUG_REC, rugFit, rugTierColor, rugLabel } from "@/lib/rug";

export default function RugVisualizer({ initialBedSlug = "queen" }: { initialBedSlug?: string }) {
  const [bedSlug, setBedSlug] = useState(initialBedSlug);
  const bed = BED_BY_SLUG[bedSlug] ?? BEDS[3];
  const rec = RUG_REC[bed.slug] ?? RUG_REC["queen"];

  // default selected rug = the ideal recommendation
  const idealIdx = STANDARD_RUGS.findIndex(([w, l]) => w === rec.ideal[0] && l === rec.ideal[1]);
  const [rugIdx, setRugIdx] = useState(idealIdx >= 0 ? idealIdx : 3);
  const rug = STANDARD_RUGS[rugIdx];

  const fit = useMemo(() => rugFit(bed, rug[0], rug[1]), [bed, rug]);
  const color = rugTierColor(fit.tier);

  const tierText =
    fit.tier === "ideal" ? "Ideal coverage"
    : fit.tier === "good" ? "Good coverage"
    : fit.tier === "tight" ? "Tight — a bit small"
    : "Too small to go under the bed";

  // ---- SVG: bed centered on rug ----
  const W = 500, H = 360, PAD = 36;
  const boundW = Math.max(fit.rugWin, bed.w), boundL = Math.max(fit.rugLin, bed.l);
  const scale = Math.min((W - PAD * 2) / boundW, (H - PAD * 2) / boundL);
  const cx = W / 2, cy = H / 2;
  const rw = fit.rugWin * scale, rh = fit.rugLin * scale;
  const bw = bed.w * scale, bl = bed.l * scale;

  return (
    <div className="grid items-start gap-5 md:grid-cols-[320px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className="mb-1 block text-sm font-semibold text-slate-500">Bed size</span>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {BEDS.map((b) => (
            <button
              key={b.slug}
              onClick={() => { setBedSlug(b.slug); const r = RUG_REC[b.slug]; const i = STANDARD_RUGS.findIndex(([w, l]) => w === r.ideal[0] && l === r.ideal[1]); setRugIdx(i >= 0 ? i : 3); }}
              className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                bedSlug === b.slug ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        <span className="mb-1 block text-sm font-semibold text-slate-500">Rug size</span>
        <div className="grid grid-cols-2 gap-2">
          {STANDARD_RUGS.map((r, i) => (
            <button
              key={i}
              onClick={() => setRugIdx(i)}
              className={`rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                rugIdx === i ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {rugLabel(r)}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
          Recommended for a {bed.name}: <strong>{rugLabel(rec.ideal)}</strong>
          {rec.large ? <> (or {rugLabel(rec.large)} in a large room)</> : null}
        </div>
      </div>

      <div>
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[500px]" role="img" aria-label="Rug under bed, to scale">
            <rect x={cx - rw / 2} y={cy - rh / 2} width={rw} height={rh} rx={8} fill="#e7d8c3" stroke="#c8b79c" strokeWidth={2} />
            <rect x={cx - bw / 2} y={cy - bl / 2} width={bw} height={bl} rx={6} fill="#0d9488" opacity={0.92} />
            <rect x={cx - bw / 2 + 5} y={cy - bl / 2 + 5} width={Math.max(0, bw - 10)} height={Math.min(15, bl * 0.16)} rx={3} fill="#fff" opacity={0.35} />
            <text x={cx} y={cy} fill="#fff" fontSize={13} fontWeight={700} textAnchor="middle" dominantBaseline="middle">{bed.name}</text>
            <text x={cx} y={cy - rh / 2 - 10} fill="#475569" fontSize={12} textAnchor="middle">{rugLabel(rug)} rug</text>
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm" style={{ background: "#e7d8c3" }} /> Rug</span>
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm bg-teal-600" /> Bed</span>
        </div>

        <div className="mt-4 rounded-2xl p-4 text-white" style={{ background: color }}>
          <h2 className="text-xl font-bold">{tierText}</h2>
          <p className="mt-0.5 text-sm opacity-95">
            A {rugLabel(rug)} rug under a {bed.name} bed leaves about {formatClearance(Math.max(0, fit.side))} on each side and {formatClearance(Math.max(0, fit.end))} at the head/foot. Designers aim for 18″+ of rug showing on the sides you step onto.
          </p>
        </div>
      </div>
    </div>
  );
}
