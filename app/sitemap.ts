import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { BEDS, allCombos, comboSlug } from "@/lib/beds";

export default function sitemap(): MetadataRoute.Sitemap {
  const combos = allCombos().map((c) => ({
    url: `${SITE_URL}/${comboSlug(c.bed.slug, c.w, c.h)}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const rugs = BEDS.map((b) => ({
    url: `${SITE_URL}/rug-size/${b.slug}-bed`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...rugs,
    ...combos,
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
