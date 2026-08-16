"use client";

import { FormEvent, useState } from "react";

type ResolverResult = {
  resolver: string;
  status: number | null;
  answers: string[];
  error?: string;
};

type PropagationResponse = {
  name: string;
  type: string;
  consistent: boolean;
  results: ResolverResult[];
  error?: string;
};

const recordTypes = ["A", "AAAA", "CNAME", "MX", "NS", "TXT"] as const;

export function PropagationChecker() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState<(typeof recordTypes)[number]>("A");
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
      const response = await fetch(`/api/dns-propagation?name=${encodeURIComponent(value)}&type=${recordType}`);
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
    <div className="lookup-panel">
      <form className="lookup-form" onSubmit={handleSubmit}>
        <label htmlFor="propagation-domain">Domain name</label>
        <div className="lookup-row">
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
          <button type="submit" disabled={loading}>{loading ? "Comparing…" : "Check resolvers"}</button>
        </div>
      </form>

      {error ? <p className="error-message">{error}</p> : null}

      {result ? (
        <div className="results" aria-live="polite">
          <div className="results-heading">
            <div>
              <span className="eyebrow">Resolver comparison</span>
              <h2>{result.consistent ? "Answers match" : "Answers differ"}</h2>
            </div>
            <span className={`health-pill ${result.consistent ? "healthy" : "warning"}`}>
              {result.consistent ? "Consistent" : "Check in progress"}
            </span>
          </div>

          <div className="resolver-grid">
            {result.results.map((item) => (
              <div className="resolver-card" key={item.resolver}>
                <div className="resolver-card-head">
                  <strong>{item.resolver}</strong>
                  <span>DNS {item.status ?? "—"}</span>
                </div>
                {item.error ? <p className="error-message compact-error">{item.error}</p> : null}
                {item.answers.length ? (
                  <ul className="answer-list">
                    {item.answers.map((answer, index) => <li key={`${item.resolver}-${index}`}>{answer}</li>)}
                  </ul>
                ) : !item.error ? <p className="muted-copy">No records returned.</p> : null}
              </div>
            ))}
          </div>
          <p className="tool-note">This compares major public recursive resolvers. It is not a country-by-country probe network.</p>
        </div>
      ) : null}
    </div>
  );
}
