import Link from "next/link";

type ToolCardProps = {
  title: string;
  description: string;
  href?: string;
  status?: "live" | "soon";
};

export function ToolCard({
  title,
  description,
  href,
  status = "soon",
}: ToolCardProps) {
  const content = (
    <article className={`tool-card ${status === "live" ? "tool-card-live" : ""}`}>
      <div className="tool-card-topline">
        <span className="tool-icon">↗</span>
        <span className={`status-pill ${status}`}>{status === "live" ? "Live" : "Soon"}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="tool-cta">{status === "live" ? "Open tool →" : "Coming soon"}</span>
    </article>
  );

  if (href && status === "live") {
    return (
      <Link href={href} className="tool-card-link">
        {content}
      </Link>
    );
  }

  return content;
}
