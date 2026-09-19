import type { Metadata } from "next";
import { PropagationChecker } from "@/components/PropagationChecker";

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "DNS Propagation Checker — Global DNS Map",
  description: "Check DNS propagation from multiple countries and see regional DNS results on a live world map.",
=======
  title: "DNS Propagation Checker — Compare Public DNS Resolvers",
  description: "Compare DNS answers from Google Public DNS, Cloudflare and Quad9 for any domain.",
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
};

export default function DnsPropagationPage() {
  return (
    <div className="container tool-page">
      <div className="tool-page-heading">
<<<<<<< HEAD
        <span className="eyebrow">Global DNS tool</span>
        <h1>DNS Propagation Checker</h1>
        <p>Run live DNS checks from multiple countries and see where your new record is already visible on the map.</p>
=======
        <span className="eyebrow">DNS tool</span>
        <h1>DNS Propagation Checker</h1>
        <p>Compare the records returned by major public DNS resolvers after a DNS or nameserver change.</p>
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
      </div>
      <PropagationChecker />
      <div className="ad-placeholder"><span>Advertisement</span></div>
      <article className="article-card">
<<<<<<< HEAD
        <h2>What does DNS propagation mean?</h2>
        <p>When a DNS record changes, recursive resolvers can keep the previous value until its cached TTL expires. During that window, users in different networks can receive different DNS answers.</p>
        <p>ZoneCheckr uses distributed probes to sample DNS resolution from different countries. Enter an expected value when you know the new record you are waiting for; otherwise, the map compares each result with the most common answer in the measurement.</p>
=======
        <h2>What does “propagation” really mean?</h2>
        <p>DNS changes are cached by recursive resolvers for the duration of each record's TTL. During that period, different resolvers can temporarily return different answers.</p>
        <p>This tool compares major public resolvers. A future version can add true regional probes for country-by-country visibility.</p>
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
      </article>
    </div>
  );
}
