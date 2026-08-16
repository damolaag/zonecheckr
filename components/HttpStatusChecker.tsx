"use client";

import { FormEvent, useState } from "react";

type HttpResult = {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  statusText: string;
  redirected: boolean;
  responseTimeMs: number;
  contentType: string | null;
  server: string | null;
  error?: string;
};

export function HttpStatusChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<HttpResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!url.trim()) {
      setError("Enter a website such as example.com.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/http-status?url=${encodeURIComponent(url.trim())}`);
      const data: HttpResult = await response.json();
      if (!response.ok) throw new Error(data.error || "The HTTP check failed.");
      setResult(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The HTTP check failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lookup-panel">
      <form className="lookup-form" onSubmit={handleSubmit}>
        <label htmlFor="website-url">Website URL</label>
        <div className="lookup-row two-column-row">
          <input id="website-url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" autoComplete="off" />
          <button type="submit" disabled={loading}>{loading ? "Checking…" : "Check status"}</button>
        </div>
      </form>

      {error ? <p className="error-message">{error}</p> : null}

      {result ? (
        <div className="results" aria-live="polite">
          <div className="results-heading">
            <div>
              <span className="eyebrow">HTTP result</span>
              <h2>{result.status} {result.statusText}</h2>
            </div>
            <span className={`health-pill ${result.status >= 200 && result.status < 400 ? "healthy" : "warning"}`}>
              {result.responseTimeMs} ms
            </span>
          </div>
          <dl className="result-list">
            <div><dt>Requested URL</dt><dd>{result.requestedUrl}</dd></div>
            <div><dt>Final URL</dt><dd>{result.finalUrl}</dd></div>
            <div><dt>Redirected</dt><dd>{result.redirected ? "Yes" : "No"}</dd></div>
            <div><dt>Content type</dt><dd>{result.contentType || "Not provided"}</dd></div>
            <div><dt>Server</dt><dd>{result.server || "Not disclosed"}</dd></div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
