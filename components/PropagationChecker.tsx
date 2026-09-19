"use client";

import { FormEvent, useState } from "react";
import { PropagationMap, type PropagationPoint } from "@/components/PropagationMap";

type PropagationResponse = {
  name: string;
  type: string;
  expected: string | null;
  consistent: boolean;
  consensusAnswers: string[];
  provider: string;
  results: PropagationPoint[];
  error?: string;
};

const recordTypes = ["A", "AAAA", "CNAME", "MX", "NS", "TXT"] as const;

export function PropagationChecker() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState<(typeof recordTypes)[number]>("A");
  const [expectedValue, setExpectedValue] = useState("");
  const [result, setResult] = useState<PropagationResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    const value = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    if (!value || !value.includes(".")) {
      setError("Enter a valid domain such as example.com.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({ name: value, type: recordType });
      if (expectedValue.trim()) params.set("expected", expectedValue.trim());
      const response = await fetch(`/api/dns-propagation?${params.toString()}`, { cache: "no-store" });
      const data: PropagationResponse = await response.json();
      if (!response.ok) throw new Error(data.error || "The propagation check failed.");
      setResult(data);
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : "The propagation check failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lookup-panel propagation-panel">
      <form className="lookup-form" onSubmit={handleSubmit}>
        <label htmlFor="propagation-domain">Domain name</label>
        <div className="lookup-row propagation-search-row">
          <input
            id="propagation-domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="example.com"
            autoComplete="off"
          />
          <select value={recordType} onChange={(event) => setRecordType(event.target.value as (typeof recordTypes)[number])}>
            {recordTypes.map((type) => <option value={type} key={type}>{type}</option>)}
          </select>
          <button type="submit" disabled={loading}>{loading ? "Checking worldwide…" : "Check propagation"}</button>
        </div>

        <div className="expected-value-field">
          <label htmlFor="expected-value">Expected value <span>optional</span></label>
          <input
            id="expected-value"
            value={expectedValue}
            onChange={(event) => setExpectedValue(event.target.value)}
            placeholder={recordType === "A" ? "e.g. 216.198.79.1" : "Enter the new record value you expect"}
            autoComplete="off"
          />
          <p className="field-help">Add the new value after a DNS change so the map can show exactly where that value is visible. Leave blank to compare each region with the global consensus.</p>
        </div>
      </form>

      {error ? <p className="error-message">{error}</p> : null}

      {!result ? <PropagationMap points={[]} loading={loading} expectedValue={expectedValue.trim() || undefined} /> : null}

      {result ? (
        <div className="results" aria-live="polite">
          <div className="results-heading">
            <div>
              <span className="eyebrow">Worldwide propagation</span>
              <h2>{result.consistent ? "Propagation looks consistent" : "DNS answers still differ"}</h2>
            </div>
            <span className={`health-pill ${result.consistent ? "healthy" : "warning"}`}>
              {result.consistent ? "Consistent" : "Mixed results"}
            </span>
          </div>

          <PropagationMap points={result.results} expectedValue={result.expected || undefined} />

          <div className="regional-results-heading">
            <h3>Regional probe results</h3>
            {!result.expected && result.consensusAnswers.length ? (
              <p>Most common answer: <code>{result.consensusAnswers.join(", ")}</code></p>
            ) : null}
          </div>

          <div className="resolver-grid regional-grid">
            {result.results.map((item) => (
              <div className="resolver-card" key={item.id}>
                <div className="resolver-card-head">
                  <div>
                    <strong>{item.city}</strong>
                    <span className="resolver-country">{item.country}</span>
                  </div>
                  <span className={`region-status ${item.status}`}>{item.status === "propagated" ? "✓" : item.status === "different" ? "~" : "×"}</span>
                </div>
                <p className="resolver-meta">{item.resolver || "Local resolver"}{item.responseTimeMs ? ` · ${Math.round(item.responseTimeMs)} ms` : ""}</p>
                {item.answers.length ? (
                  <ul className="answer-list">
                    {item.answers.map((answer, index) => <li key={`${item.id}-${index}`}>{answer}</li>)}
                  </ul>
                ) : <p className="muted-copy">No DNS answer returned.</p>}
              </div>
            ))}
          </div>

          <p className="tool-note">Checks run from live Globalping probes in multiple countries. Results show what the resolver used by each probe sees at that moment, not a guarantee for every ISP or user in the region.</p>
        </div>
      ) : null}
    </div>
  );
}
