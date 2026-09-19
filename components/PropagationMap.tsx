"use client";

export type PropagationPoint = {
  id: string;
  city: string;
  country: string;
  countryCode?: string;
  continent?: string;
  latitude: number;
  longitude: number;
  resolver?: string;
  answers: string[];
  responseTimeMs?: number | null;
  status: "propagated" | "different" | "failed";
};

type Props = {
  points?: PropagationPoint[];
  expectedValue?: string;
  loading?: boolean;
};

function project(longitude: number, latitude: number) {
  return {
    x: ((longitude + 180) / 360) * 1000,
    y: ((90 - latitude) / 180) * 500,
  };
}

const continents = [
  "M63 132 C95 87 152 68 214 80 C254 87 287 112 303 145 C314 168 308 190 285 205 C252 227 220 235 193 257 C170 276 146 281 125 263 C104 245 103 216 86 198 C66 176 51 158 63 132 Z",
  "M226 267 C254 258 281 275 294 304 C308 337 302 374 285 401 C271 424 257 455 240 471 C226 481 215 459 214 439 C212 411 196 391 193 363 C190 333 198 287 226 267 Z",
  "M446 106 C483 82 537 76 589 88 C625 96 651 113 676 132 C694 146 721 147 744 160 C766 173 783 191 779 210 C776 226 754 232 730 230 C704 229 686 239 669 254 C648 271 629 277 607 269 C586 262 573 244 552 241 C528 238 502 249 481 240 C459 231 446 211 433 191 C416 165 414 126 446 106 Z",
  "M487 244 C521 230 563 241 586 266 C606 289 611 322 603 351 C596 377 581 401 562 424 C545 445 518 464 499 447 C483 432 481 405 471 383 C457 353 449 317 456 286 C461 266 471 251 487 244 Z",
  "M652 126 C703 102 766 99 823 115 C859 125 893 145 910 171 C925 194 916 216 895 230 C871 246 840 246 815 258 C787 272 760 291 729 288 C701 285 684 266 665 246 C643 223 625 201 624 174 C624 151 633 136 652 126 Z",
  "M803 332 C830 316 866 315 894 326 C920 336 941 354 944 376 C946 394 927 409 905 416 C880 424 847 421 824 408 C802 395 786 375 789 354 C791 344 795 337 803 332 Z",
  "M356 83 C369 72 389 68 403 76 C417 84 421 102 411 115 C401 129 382 135 368 126 C352 117 345 95 356 83 Z"
];

export function PropagationMap({ points = [], expectedValue, loading = false }: Props) {
  const totals = points.reduce(
    (acc, point) => {
      acc[point.status] += 1;
      return acc;
    },
    { propagated: 0, different: 0, failed: 0 },
  );

  return (
    <section className="propagation-map-card" aria-label="DNS propagation map">
      <div className="map-toolbar">
        <div>
          <span className="eyebrow">Global view</span>
          <h3>{loading ? "Checking DNS around the world…" : "Propagation by probe location"}</h3>
        </div>
        <div className="map-summary" aria-label="Propagation summary">
          <span><i className="legend-dot propagated" /> {totals.propagated} propagated</span>
          <span><i className="legend-dot different" /> {totals.different} different</span>
          <span><i className="legend-dot failed" /> {totals.failed} no answer</span>
        </div>
      </div>

      <div className="world-map-wrap">
        <svg className="world-map" viewBox="0 0 1000 500" role="img" aria-label="World map showing DNS probe results">
          <rect className="map-ocean" x="0" y="0" width="1000" height="500" rx="20" />
          <g className="map-grid-lines" aria-hidden="true">
            {[125, 250, 375].map((y) => <line key={`h-${y}`} x1="0" y1={y} x2="1000" y2={y} />)}
            {[200, 400, 600, 800].map((x) => <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="500" />)}
          </g>
          <g className="map-land" aria-hidden="true">
            {continents.map((path, index) => <path d={path} key={index} />)}
          </g>

          {points.map((point) => {
            const { x, y } = project(point.longitude, point.latitude);
            const title = `${point.city || point.country}, ${point.country} — ${point.status}${point.answers.length ? ` — ${point.answers.join(", ")}` : ""}`;
            return (
              <g className={`map-marker ${point.status}`} key={point.id} transform={`translate(${x} ${y})`}>
                <circle className="map-marker-pulse" r="13" />
                <circle className="map-marker-dot" r="6" />
                <title>{title}</title>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="map-legend-copy">
        {points.length ? (
          <p>
            {expectedValue
              ? <>Green means the probe returned your expected value <code>{expectedValue}</code>. Amber means it returned a different value.</>
              : <>Without an expected value, green means the probe agrees with the most common answer returned across the measurement.</>}
          </p>
        ) : (
          <p>{loading ? "Live regional probes are running now." : "Run a propagation check to place live regional DNS results on the map."}</p>
        )}
        <p className="muted-copy">Locations are live Globalping probes. DNS propagation is resolver-cache dependent, so nearby users can still see different results.</p>
      </div>
    </section>
  );
}
