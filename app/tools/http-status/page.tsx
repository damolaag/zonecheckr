import type { Metadata } from "next";
import { HttpStatusChecker } from "@/components/HttpStatusChecker";

export const metadata: Metadata = {
  title: "HTTP Status Checker — Test Status Codes & Redirects",
  description: "Check a website's HTTP status code, redirect destination, response time and basic response headers.",
};

export default function HttpStatusPage() {
  return (
    <div className="container tool-page">
      <div className="tool-page-heading">
        <span className="eyebrow">Website tool</span>
        <h1>HTTP Status Checker</h1>
        <p>See whether a page returns 200, redirects somewhere else, or is failing with a 4xx or 5xx response.</p>
      </div>
      <HttpStatusChecker />
      
      <article className="article-card">
        <h2>Common HTTP status codes</h2>
        <p><strong>200</strong> means the request succeeded. <strong>301/308</strong> usually mean a permanent redirect, while <strong>302/307</strong> are temporary redirects. <strong>404</strong> means the page was not found and <strong>5xx</strong> codes point to a server-side failure.</p>
      </article>
    </div>
  );
}