// Set NEXT_PUBLIC_SITE_URL in Vercel to your real domain after deploy.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://bed-room-fit.vercel.app";

export const BRAND = "Will It Fit?";
export const TAGLINE = "Bed in Room Size Visualizer";
