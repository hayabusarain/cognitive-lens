import { MetadataRoute } from "next";
import { TYPE_INFO } from "@/lib/type-info";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cognitive-lens.com";

  const languages = ["ja", "en"];
  const mbtiTypes = Object.keys(TYPE_INFO);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. 各言語の静的ページ
  const staticRoutes = [
    "",
    "/about",
    "/privacy",
    "/disclaimer",
    "/downloads",
    "/test",
    "/translate",
    "/target-diagnosis",
  ];

  languages.forEach((lang) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: route === "" ? "daily" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    });

    // 2. 記事ページ (16タイプそれぞれ)
    mbtiTypes.forEach((type) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/article/${type}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    });
  });

  return sitemapEntries;
}
