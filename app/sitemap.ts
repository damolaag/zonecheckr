import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/tools",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
<<<<<<< HEAD
    ...tools.filter((tool) => tool.status === "live").map((tool) => `/tools/${tool.slug}`),
=======
    ...tools
      .filter((tool) => tool.status === "live")
      .map((tool) => `/tools/${tool.slug}`),
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
    "/guides/dns-records-explained",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
<<<<<<< HEAD
    priority: route === "" ? 1 : route === "/tools" ? 0.9 : 0.8,
  }));
}
=======
    priority:
      route === ""
        ? 1
        : route === "/tools"
          ? 0.9
          : route === "/contact"
            ? 0.7
            : 0.8,
  }));
}
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
