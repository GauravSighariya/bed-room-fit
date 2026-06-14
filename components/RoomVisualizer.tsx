"use client";

import { useMemo, useState } from "react";
import { BEDS, BED_BY_SLUG, computeFit, tierColor, formatClearance } from "@/lib/beds";

type Unit = "ft" | "m";
const FT_PER_M = 3.28084;

export default function RoomVisualizer({
  initialBedSlug = "queen",
  initialW = 10,
  initialH = 10,
}: {
  initialBedSlug?: string;
  initialW?: number;
  initialH?: number;
}) {
  const [unit, setUnit] = useState<Unit>("ft");
  const [roomW, setRoomW] = useState<number>(initialW);
  const [roomL, setRoomL] = useState<number>(initialH);
  const [bedSlug, setBedSlug] = useState<string>(initialBedSlug);

  const bed = BED_BY_SLUG[bedSlug] ?? BEDS[3];

  const { fit, roomWft, roomLft } = useMemo(() => {
    const wft = unit === "m" ? (roomW || 0) * FT_PER_M : roomW || 0;
    const lft = unit === "m" ? (roomL || 0) * FT_PER_M : roomL || 0;
    return { fit: computeFit(wft, lft, bed), roomWft: wft, roomLft: lft };
  }, [unit, roomW, roomL, bed]);

  const color = tierColor(fit.tier);

  function switchUnit(u: Unit) {
    if (u === unit) return;
    const f = u === "m" ? 1 / FT_PER_M : FT_PER_M;
    setRoomW(+(roomW * f).toFixed(2));
    setRoomL(+(roomL * f).toFixed(2));
    setUnit(u);
  }

  // ---- SVG geometry ----
  const W = 500, H = 380, PAD = 38;
  const roomWin = roomWft * 12, roomLin = roomLft * 12;
  const scale = roomWin > 0 && roomLin > 0 ? Math.min((W - PAD * 2) / roomWin, (H - PAD * 2) / roomLin) : 0;
  const rw = roomWin * scale, rh = roomLin * scale;
  const ox = (W - rw) / 2, oy = (H - rh) / 2;
  const dbw = Math.min(fit.bedW, roomWin) * scale;
  const dbl = Math.min(fit.bedL, roomLin) * scale;
  const bx = ox + (rw - dbw) / 2, by = oy;

  return (
    <div className="grid items-start gap-5 md:grid-cols-[320px_1fr]">
      {/* Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className="mb-1 block text-sm font-semibold text-slate-500">Units</span>
        <div className="mb-4 flex gap-1.5">
          {(["ft", "m"] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => switchUnit(u)}
              className={`flex-1 rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                unit === u ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {u === "ft" ? "Feet" : "Meters"}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-sm font-semibold text-slate-500">Room width ({unit})</label>
        <input
          type="number" min={2} step={unit === "m" ? 0.1 : 0.5} value={roomW}
          onChange={(e) => setRoomW(parseFloat(e.target.value))}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
        />

        <label className="mb-1 block text-sm font-semibold text-slate-500">Room length ({unit})</label>
        <input
          type="number" min={2} step={unit === "m" ? 0.1 : 0.5} value={roomL}
          onChange={(e) => setRoomL(parseFloat(e.target.value))}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
        />

        <span className="mb-1 block text-sm font-semibold text-slate-500">Bed size</span>
        <div className="grid grid-cols-3 gap-2">
          {BEDS.map((b) => (
            <button
              key={b.slug}
              onClick={() => setBedSlug(b.slug)}
              className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                bedSlug === b.slug ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {b.name}
              <span className="mt-0.5 block text-[10px] font-normal text-slate-400">{b.w}×{b.l}&quot;</span>
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[500px]" role="img" aria-label="Top-down room layout">
            {scale > 0 && (
              <>
                <rect x={ox} y={oy} width={rw} height={rh} rx={6} fill="#eef2f5" stroke="#94a3b8" strokeWidth={2} />
                <rect x={ox} y={oy} width={rw} height={6} fill="#14b8a6" />
                <rect x={bx} y={by} width={dbw} height={dbl} rx={7} fill={fit.fits ? "#0d9488" : "#dc2626"} opacity={fit.fits ? 0.9 : 0.6} />
                <rect x={bx + 6} y={by + 6} width={Math.max(0, dbw - 12)} height={Math.min(16, dbl * 0.18)} rx={4} fill="#ffffff" opacity={0.35} />
                <text x={bx + dbw / 2} y={by + dbl / 2} fill="#fff" fontSize={13} fontWeight={700} textAnchor="middle" dominantBaseline="middle">{bed.name}</text>
                <text x={ox + rw / 2} y={oy - 12} fill="#475569" fontSize={12} textAnchor="middle">{roomW} {unit} wide</text>
                <text x={ox - 12} y={oy + rh / 2} fill="#475569" fontSize={12} textAnchor="middle" transform={`rotate(-90 ${ox - 12} ${oy + rh / 2})`}>{roomL} {unit} long</text>
              </>
            )}
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm bg-slate-300" /> Room</span>
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm bg-teal-600" /> Bed</span>
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm bg-teal-400" /> Headboard wall</span>
        </div>

        <div className="mt-4 rounded-2xl p-4 text-white" style={{ background: color }}>
          <h2 className="text-xl font-bold">{fit.title}</h2>
          <p className="mt-0.5 text-sm opacity-95">{fit.message}</p>
        </div>

        {fit.fits && (
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {[
              { n: formatClearance(fit.side), l: "Left side" },
              { n: formatClearance(fit.side), l: "Right side" },
              { n: formatClearance(fit.foot), l: "Foot of bed" },
            ].map((c, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
                <div className="text-lg font-bold text-slate-900">{c.n}</div>
                <div className="text-[11px] uppercase tracking-wide text-slate-400">{c.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
