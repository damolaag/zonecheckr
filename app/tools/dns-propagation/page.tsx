import type { Metadata } from "next";
import { PropagationChecker } from "@/components/PropagationChecker";

export const metadata: Metadata = {
  title: "DNS Propagation Checker — Global DNS Map",
  description: "Check DNS propagation from multiple countries and see regional DNS results on a live world map.",
};

export default function DnsPropagationPage() {
  return (
    <div className="container tool-page">
      <div className="tool-page-heading">
        <span className="eyebrow">Global DNS tool</span>
        <h1>DNS Propagation Checker</h1>
        <p>Run live DNS checks from multiple countries and see where your new record is already visible on the map.</p>
      </div>
      <PropagationChecker />
      
      <article className="article-card">
        <h2>What does DNS propagation mean?</h2>
        <p>When a DNS record changes, recursive resolvers can keep the previous value until its cached TTL expires. During that window, users in different networks can receive different DNS answers.</p>
        <p>ZoneCheckr uses distributed probes to sample DNS resolution from different countries. Enter an expected value when you know the new record you are waiting for; otherwise, the map compares each result with the most common answer in the measurement.</p>
      </article>
    </div>
  );
}