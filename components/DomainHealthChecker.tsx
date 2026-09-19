"use client";

import { FormEvent, useState } from "react";

type Status = "pass" | "warning" | "info" | "fail";
type Check = { key: string; label: string; category: string; status: Status; summary: string; detail?: string | null };
type Result = { domain: string; selector: string | null; counts: Record<Status, number>; checks: Check[] };

const statusLabel: Record<Status, string> = { pass: "Pass", warning: "Warning", info: "Info", fail: "Fail" };

export function DomainHealthChecker() {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    const value = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    try {
      const params = new URLSearchParams({ domain: value });
      if (selector.trim()) params.set("selector", selector.trim());
      const response = await fetch(`/api/domain-health?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Domain health check failed.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Domain health check failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lookup-panel domain-health-panel">
      <form className="lookup-form" onSubmit={submit}>
        <label htmlFor="health-domain">Domain name</label>
        <div className="lookup-row email-security-row">
          <input id="health-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
          <input value={selector} onChange={(e) => setSelector(e.target.value)} placeholder="DKIM selector (optional)" aria-label="DKIM selector" />
          <button disabled={loading}>{loading ? "Running checks…" : "Check domain health"}</button>
        </div>
        <p className="field-help">The DKIM selector is optional. Without it, ZoneCheckr reports DKIM as not checked rather than incorrectly calling it missing.</p>
      </form>

      {error ? <p className="error-message">{error}</p> : null}

      {result ? (
        <div className="results">
          <div className="results-heading domain-health-heading">
            <div><span className="eyebrow">Domain health</span><h2>{result.domain}</h2></div>
            <div className="health-summary-pills">
              <span className="health-summary pass">{result.counts.pass} passed</span>
              <span className="health-summary warning">{result.counts.warning} warnings</span>
              <span className="health-summary fail">{result.counts.fail} failed</span>
              <span className="health-summary info">{result.counts.info} info</span>
            </div>
          </div>

          <p className="tool-note">These are factual configuration checks, not a synthetic score. Missing optional records are shown as information rather than failures.</p>

          <div className="domain-health-grid">
            {result.checks.map((check) => (
              <section className={`domain-health-card ${check.status}`} key={check.key}>
                <div className="domain-health-card-head">
                  <div><span className="eyebrow">{check.category}</span><h3>{check.label}</h3></div>
                  <span className={`check-status ${check.status}`}>{statusLabel[check.status]}</span>
                </div>
                <p>{check.summary}</p>
                {check.detail ? <code className="record-block">{check.detail}</code> : null}
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
