import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { getToolHref, tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free DNS, Domain & Website Tools",
  description: "Browse free DNS, domain, HTTP and network diagnostic tools.",
};

export default function ToolsPage() {
  return (
    <div className="container tool-page">
      <div className="tool-page-heading compact-heading">
        <span className="eyebrow">Toolbox</span>
        <h1>Free domain & network tools</h1>
        <p>Quick diagnostics for DNS, websites, email configuration and internet connections.</p>
      </div>

      <div className="tool-grid">
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            title={tool.title}
            description={tool.description}
            href={tool.status === "live" ? getToolHref(tool.slug) : undefined}
            status={tool.status}
          />
        ))}
      </div>
    </div>
  );
}
