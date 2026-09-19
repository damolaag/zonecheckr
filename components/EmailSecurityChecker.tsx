"use client";

import { FormEvent, useState } from "react";

type Result = {
  domain: string;
  mx: Array<{ exchange: string; priority: number }>;
  spf: { found: boolean; record: string | null; multiple: boolean };
  dmarc: {
    found: boolean;
    record: string | null;
    policy: string | null;
    subdomainPolicy: string | null;
    aggregateReports: string | null;
    forensicReports: string | null;
    percentage: string | null;
    alignmentDkim: string | null;
    alignmentSpf: string | null;
  };
  dkim: {
    checked: boolean;
    selector: string | null;
    name: string | null;
    found: boolean;
    record: string | null;
    keyType: string | null;
    publicKeyPresent: boolean;
  };
};

function Status({ ok, warning = false }: { ok: boolean; warning?: boolean }) {
  const className = ok ? "healthy" : warning ? "warning" : "danger";
  return <span className={`health-pill ${className}`}>{ok ? "Found" : warning ? "Check" : "Missing"}</span>;
}

export function EmailSecurityChecker() {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    const value = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    try {
      const params = new URLSearchParams({ domain: value });
      if (selector.trim()) params.set("selector", selector.trim());
      const response = await fetch(`/api/email-security?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Email security check failed.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email security check failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lookup-panel">
      <form className="lookup-form" onSubmit={submit}>
        <label htmlFor="email-domain">Domain name</label>
        <div className="lookup-row email-security-row">
          <input id="email-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
          <input value={selector} onChange={(e) => setSelector(e.target.value)} placeholder="DKIM selector (optional)" aria-label="DKIM selector" />
          <button disabled={loading}>{loading ? "Checking…" : "Check email security"}</button>
        </div>
        <p className="field-help">DKIM requires a selector such as <code>google</code>, <code>selector1</code>, or <code>default</code>. SPF and DMARC do not.</p>
      </form>

      {error ? <p className="error-message">{error}</p> : null}

      {result ? (
        <div className="results email-security-results">
          <div className="results-heading"><div><span className="eyebrow">Email authentication</span><h2>{result.domain}</h2></div></div>
          <div className="security-check-grid">
            <section className="security-check-card">
              <div className="security-check-head"><h3>SPF</h3><Status ok={result.spf.found && !result.spf.multiple} warning={result.spf.multiple} /></div>
              <p>{result.spf.multiple ? "Multiple SPF records were found. A domain should normally publish one SPF policy." : result.spf.found ? "SPF policy found." : "No SPF policy was found."}</p>
              {result.spf.record ? <code className="record-block">{result.spf.record}</code> : null}
            </section>

            <section className="security-check-card">
              <div className="security-check-head"><h3>DMARC</h3><Status ok={result.dmarc.found} /></div>
              <p>{result.dmarc.found ? `Policy: ${result.dmarc.policy || "not specified"}` : "No DMARC policy was found at _dmarc."}</p>
              {result.dmarc.record ? <code className="record-block">{result.dmarc.record}</code> : null}
              {result.dmarc.found ? <dl className="mini-result-list"><div><dt>Policy</dt><dd>{result.dmarc.policy || "—"}</dd></div><div><dt>Subdomain policy</dt><dd>{result.dmarc.subdomainPolicy || "—"}</dd></div><div><dt>Aggregate reports</dt><dd>{result.dmarc.aggregateReports || "—"}</dd></div></dl> : null}
            </section>

            <section className="security-check-card">
              <div className="security-check-head"><h3>DKIM</h3><Status ok={result.dkim.found} warning={!result.dkim.checked} /></div>
              <p>{!result.dkim.checked ? "Enter a selector to check DKIM." : result.dkim.found ? `DKIM record found for selector ${result.dkim.selector}.` : `No DKIM record found for selector ${result.dkim.selector}.`}</p>
              {result.dkim.record ? <code className="record-block">{result.dkim.record}</code> : null}
            </section>

            <section className="security-check-card">
              <div className="security-check-head"><h3>MX</h3><Status ok={result.mx.length > 0} /></div>
              <p>{result.mx.length ? `${result.mx.length} mail exchanger${result.mx.length === 1 ? "" : "s"} found.` : "No MX records were found."}</p>
              {result.mx.length ? <ul className="compact-record-list">{result.mx.map((mx) => <li key={`${mx.priority}-${mx.exchange}`}><strong>{mx.priority}</strong> {mx.exchange}</li>)}</ul> : null}
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}
