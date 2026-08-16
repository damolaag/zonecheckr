import type { Metadata } from "next";
import { PropagationChecker } from "@/components/PropagationChecker";

export const metadata: Metadata = {
  title: "DNS Propagation Checker — Compare Public DNS Resolvers",
  description: "Compare DNS answers from Google Public DNS, Cloudflare and Quad9 for any domain.",
};

export default function DnsPropagationPage() {
  return (
    <div className="container tool-page">
      <div className="tool-page-heading">
        <span className="eyebrow">DNS tool</span>
        <h1>DNS Propagation Checker</h1>
        <p>Compare the records returned by major public DNS resolvers after a DNS or nameserver change.</p>
      </div>
      <PropagationChecker />
      <div className="ad-placeholder"><span>Advertisement</span></div>
      <article className="article-card">
        <h2>What does “propagation” really mean?</h2>
        <p>DNS changes are cached by recursive resolvers for the duration of each record's TTL. During that period, different resolvers can temporarily return different answers.</p>
        <p>This tool compares major public resolvers. A future version can add true regional probes for country-by-country visibility.</p>
      </article>
    </div>
  );
}
