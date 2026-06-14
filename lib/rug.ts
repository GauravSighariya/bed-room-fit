import type { Bed } from "./beds";

// Common US area-rug sizes (feet).
export const STANDARD_RUGS: [number, number][] = [
  [4, 6], [5, 8], [6, 9], [8, 10], [9, 12], [10, 14], [12, 15],
];

export interface RugRec {
  ideal: [number, number];
  min: [number, number];
  large?: [number, number];
}

// Per-bed recommendations (match standard interior-design guidance).
export const RUG_REC: Record<string, RugRec> = {
  "twin": { ideal: [5, 8], min: [4, 6] },
  "twin-xl": { ideal: [5, 8], min: [4, 6] },
  "full": { ideal: [8, 10], min: [6, 9] },
  "queen": { ideal: [8, 10], min: [6, 9], large: [9, 12] },
  "king": { ideal: [9, 12], min: [8, 10], large: [10, 14] },
  "cal-king": { ideal: [9, 12], min: [8, 10], large: [10, 14] },
};

export type RugTier = "too-small" | "tight" | "good" | "ideal";

export interface RugFit {
  side: number; // overhang each side, inches (bed centered on rug)
  end: number; // overhang at head/foot, inches
  minOver: number;
  tier: RugTier;
  rugWin: number;
  rugLin: number;
}

export function rugFit(bed: Bed, rugWft: number, rugLft: number): RugFit {
  const rugWin = rugWft * 12;
  const rugLin = rugLft * 12;
  const side = (rugWin - bed.w) / 2;
  const end = (rugLin - bed.l) / 2;
  const minOver = Math.min(side, end);

  let tier: RugTier;
  if (rugWin < bed.w || rugLin < bed.l) tier = "too-small";
  else if (minOver >= 18) tier = "ideal";
  else if (minOver >= 12) tier = "good";
  else tier = "tight";

  return { side, end, minOver, tier, rugWin, rugLin };
}

export function rugTierColor(tier: RugTier): string {
  switch (tier) {
    case "ideal":
    case "good":
      return "#16a34a";
    case "tight":
      return "#d97706";
    default:
      return "#dc2626";
  }
}

export const rugLabel = ([w, l]: [number, number]) => `${w}′ × ${l}′`;
