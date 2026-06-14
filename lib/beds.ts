// US standard mattress sizes (inches) + bed-in-room fit logic.

export interface Bed {
  slug: string; // url slug, e.g. "cal-king"
  name: string; // "Cal King"
  w: number; // mattress width, inches
  l: number; // mattress length, inches
}

export const FRAME_IN = 3; // typical frame allowance around the mattress, each side
export const REC_CLEARANCE = 24; // designer-recommended walkway, inches

export const BEDS: Bed[] = [
  { slug: "twin", name: "Twin", w: 38, l: 75 },
  { slug: "twin-xl", name: "Twin XL", w: 38, l: 80 },
  { slug: "full", name: "Full", w: 54, l: 75 },
  { slug: "queen", name: "Queen", w: 60, l: 80 },
  { slug: "king", name: "King", w: 76, l: 80 },
  { slug: "cal-king", name: "Cal King", w: 72, l: 84 },
];

export const BED_BY_SLUG: Record<string, Bed> = Object.fromEntries(BEDS.map((b) => [b.slug, b]));

// Common bedroom dimensions (feet) people search for.
export const ROOMS: [number, number][] = [
  [8, 8], [8, 10], [8, 12], [9, 9], [9, 10], [9, 11], [9, 12],
  [10, 10], [10, 11], [10, 12], [10, 13], [10, 14],
  [11, 11], [11, 12], [11, 13], [12, 12], [12, 13], [12, 14], [12, 16],
  [13, 13], [14, 14], [14, 16],
];

export type FitTier = "wont-fit" | "very-tight" | "tight" | "good" | "spacious";

export interface FitResult {
  fits: boolean;
  bedW: number; // footprint incl. frame, inches
  bedL: number;
  side: number; // each side clearance, inches (bed centered, headboard on a short wall)
  foot: number; // clearance at foot of bed, inches
  minClear: number;
  tier: FitTier;
  title: string;
  message: string;
}

/** roomWft × roomLft in feet, bed footprint computed with frame allowance. */
export function computeFit(roomWft: number, roomLft: number, bed: Bed): FitResult {
  const roomW = roomWft * 12;
  const roomL = roomLft * 12;
  const bedW = bed.w + FRAME_IN * 2;
  const bedL = bed.l + FRAME_IN * 2;

  const fits = bedW <= roomW && bedL <= roomL;
  const side = (roomW - bedW) / 2;
  const foot = roomL - bedL;
  const minClear = Math.min(side, foot);

  let tier: FitTier, title: string, message: string;
  if (!fits) {
    tier = "wont-fit";
    title = "Won't fit";
    message = `A ${bed.name} bed (about ${bedW}″ × ${bedL}″ with a frame) is too large for a ${roomWft}×${roomLft} ft room. You'd need a smaller bed or a bigger room.`;
  } else if (minClear >= 30) {
    tier = "spacious";
    title = "Fits with room to spare";
    message = `A ${bed.name} bed fits comfortably in a ${roomWft}×${roomLft} room with generous walkways and space for nightstands and other furniture.`;
  } else if (minClear >= REC_CLEARANCE) {
    tier = "good";
    title = "Good fit";
    message = `A ${bed.name} bed fits well in a ${roomWft}×${roomLft} room — you keep the recommended 24″+ of walking clearance.`;
  } else if (minClear >= 18) {
    tier = "tight";
    title = "Fits, but tight";
    message = `A ${bed.name} bed fits in a ${roomWft}×${roomLft} room, but the tightest gap is under the recommended 24″. Movement and nightstands will feel cramped.`;
  } else {
    tier = "very-tight";
    title = "Very tight";
    message = `A ${bed.name} bed technically fits in a ${roomWft}×${roomLft} room, but the tightest clearance is very cramped (under 18″). Most people would size down.`;
  }

  return { fits, bedW, bedL, side, foot, minClear, tier, title, message };
}

export function tierColor(tier: FitTier): string {
  switch (tier) {
    case "good":
    case "spacious":
      return "#16a34a";
    case "tight":
      return "#d97706";
    default:
      return "#dc2626";
  }
}

export function formatClearance(inch: number): string {
  if (inch < 0) return "—";
  if (inch < 12) return `${Math.round(inch)}"`;
  const ft = Math.floor(inch / 12);
  const rem = Math.round(inch % 12);
  return rem ? `${ft}' ${rem}"` : `${ft}'`;
}

// ---- combo slug helpers: "king-bed-10x10-room" ----
export function comboSlug(bedSlug: string, w: number, h: number): string {
  return `${bedSlug}-bed-${w}x${h}-room`;
}

export interface Combo {
  bed: Bed;
  w: number;
  h: number;
}

export function parseCombo(slug: string): Combo | null {
  const m = slug.match(/^(.+)-bed-(\d+)x(\d+)-room$/);
  if (!m) return null;
  const bed = BED_BY_SLUG[m[1]];
  const w = parseInt(m[2], 10);
  const h = parseInt(m[3], 10);
  if (!bed) return null;
  // only allow combos we generate
  if (!ROOMS.some(([rw, rh]) => rw === w && rh === h)) return null;
  return { bed, w, h };
}

export function allCombos(): Combo[] {
  const out: Combo[] = [];
  for (const bed of BEDS) for (const [w, h] of ROOMS) out.push({ bed, w, h });
  return out;
}
