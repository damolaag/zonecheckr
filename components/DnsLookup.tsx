"use client";

import { FormEvent, useState } from "react";

type DnsAnswer = {
  name: string;
  type: number;
<<<<<<< HEAD
  TTL: number | null;
=======
  TTL: number;
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
  data: string;
};

type LookupResponse = {
  status: number;
  question?: Array<{ name: string; type: number }>;
  answer?: DnsAnswer[];
  error?: string;
};

<<<<<<< HEAD
const recordTypes = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "CAA"] as const;
=======
const recordTypes = ["A", "AAAA", "CNAME", "MX", "NS", "TXT"] as const;
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270

export function DnsLookup() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState<(typeof recordTypes)[number]>("A");
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const response = await fetch(
        `/api/dns?name=${encodeURIComponent(value)}&type=${encodeURIComponent(recordType)}`,
      );
      const data: LookupResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The DNS lookup failed.");
      }

      setResult(data);
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : "The DNS lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lookup-panel">
      <form className="lookup-form" onSubmit={handleSubmit}>
        <label htmlFor="domain">Domain name</label>
        <div className="lookup-row">
          <input
            id="domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="example.com"
            autoComplete="off"
            inputMode="url"
          />
          <select
            aria-label="DNS record type"
            value={recordType}
            onChange={(event) =>
              setRecordType(event.target.value as (typeof recordTypes)[number])
            }
          >
            {recordTypes.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "Checking…" : "Check DNS"}
          </button>
        </div>
      </form>

      {error ? <p className="error-message">{error}</p> : null}

      {result ? (
        <div className="results" aria-live="polite">
          <div className="results-heading">
            <div>
              <span className="eyebrow">Result</span>
              <h2>{recordType} records</h2>
            </div>
            <span className="result-code">DNS status {result.status}</span>
          </div>

          {result.answer?.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>TTL</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.answer.map((record, index) => (
                    <tr key={`${record.name}-${record.data}-${index}`}>
                      <td>{record.name}</td>
<<<<<<< HEAD
                      <td>{record.TTL == null ? "—" : `${record.TTL}s`}</td>
=======
                      <td>{record.TTL}s</td>
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
                      <td className="record-value">{record.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-result">
              No {recordType} records were returned for this domain.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
