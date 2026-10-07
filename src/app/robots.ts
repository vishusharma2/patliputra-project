import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://patliputraresidences.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/patliputra-login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
