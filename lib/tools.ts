export type ToolStatus = "live" | "soon";
export type ToolDefinition = {
  title: string;
  slug: string;
  description: string;
  category: "DNS" | "Web" | "Network" | "Email" | "Domain";
  status: ToolStatus;
};
export const tools: ToolDefinition[] = [
  { title: "DNS Lookup", slug: "dns-lookup", description: "Check A, AAAA, CNAME, MX, NS, TXT, SOA and CAA records for any domain.", category: "DNS", status: "live" },
  { title: "DNS Propagation Checker", slug: "dns-propagation", description: "Check DNS propagation from live probes in multiple countries and view results on a world map.", category: "DNS", status: "live" },
  { title: "SSL Checker", slug: "ssl-checker", description: "Inspect a website certificate, expiry date, issuer and common SSL problems.", category: "Web", status: "live" },
  { title: "MX Lookup", slug: "mx-lookup", description: "Find the mail servers responsible for receiving email for a domain.", category: "Email", status: "live" },
  { title: "Email Security Checker", slug: "email-security", description: "Check SPF, DMARC, DKIM and MX settings used to authenticate domain email.", category: "Email", status: "live" },
  { title: "Domain Health Checker", slug: "domain-health", description: "Run DNS, email, SSL and HTTPS health checks from one dashboard.", category: "Domain", status: "live" },
  { title: "HTTP Status Checker", slug: "http-status", description: "Check response codes, redirects, final URLs and response times.", category: "Web", status: "live" },
  { title: "Domain Lookup", slug: "domain-lookup", description: "Inspect public registration data, registrar, status and important domain dates using RDAP.", category: "Domain", status: "live" },
  { title: "What's My IP?", slug: "what-is-my-ip", description: "See the public IP address your browser is using to reach this site.", category: "Network", status: "live" },
];
export function getToolHref(slug: string) { return `/tools/${slug}`; }
