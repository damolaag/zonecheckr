export type ToolStatus = "live" | "soon";
export type ToolDefinition = {
  title: string;
  slug: string;
  description: string;
  category: "DNS" | "Web" | "Network" | "Email" | "Domain";
  status: ToolStatus;
};
export const tools: ToolDefinition[] = [
  { title: "DNS Lookup", slug: "dns-lookup", description: "Check A, AAAA, MX, NS, CNAME and TXT records for any domain.", category: "DNS", status: "live" },
  { title: "DNS Propagation Checker", slug: "dns-propagation", description: "Compare DNS answers from Google, Cloudflare and Quad9 public resolvers.", category: "DNS", status: "live" },
  { title: "SSL Checker", slug: "ssl-checker", description: "Inspect a website certificate, expiry date, issuer and common SSL problems.", category: "Web", status: "live" },
  { title: "MX Lookup", slug: "mx-lookup", description: "Find the mail servers responsible for receiving email for a domain.", category: "Email", status: "live" },
  { title: "HTTP Status Checker", slug: "http-status", description: "Check response codes, redirects, final URLs and response times.", category: "Web", status: "live" },
  { title: "Domain Lookup", slug: "domain-lookup", description: "Inspect public registration data, registrar, status and important domain dates using RDAP.", category: "Domain", status: "live" },
  { title: "What's My IP?", slug: "what-is-my-ip", description: "See the public IP address your browser is using to reach this site.", category: "Network", status: "live" },
];
export function getToolHref(slug: string) { return `/tools/${slug}`; }
