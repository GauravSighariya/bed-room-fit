import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { allCombos, comboSlug } from "@/lib/beds";

export default function sitemap(): MetadataRoute.Sitemap {
  const combos = allCombos().map((c) => ({
    url: `${SITE_URL}/${comboSlug(c.bed.slug, c.w, c.h)}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...combos,
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
