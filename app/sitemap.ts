import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

const guides = [
  "/guides",
  "/guides/dns-records-explained",
  "/guides/how-long-does-dns-propagation-take",
  "/guides/fix-dns-probe-finished-nxdomain",
  "/guides/spf-vs-dkim-vs-dmarc",
  "/guides/how-to-check-dmarc-record",
  "/guides/changed-nameservers-website-not-working",
];
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/tools", "/services", "/about", "/contact", "/privacy", "/terms", ...tools.filter((tool) => tool.status === "live").map((tool) => `/tools/${tool.slug}`), ...guides];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : route.startsWith("/guides") ? "monthly" : "monthly",
    priority: route === "" ? 1 : route === "/tools" || route === "/services" || route === "/guides" ? 0.9 : 0.8,
  }));
}
