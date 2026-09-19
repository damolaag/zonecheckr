# ZoneCheckr

ZoneCheckr is a lightweight DNS, domain, SSL, email and website diagnostics site built with Next.js and TypeScript.

## Live tools
- DNS Lookup
- DNS Propagation Checker (public resolver comparison)
- SSL Checker
- MX Lookup
- HTTP Status Checker
- Domain Lookup (RDAP)
- What's My IP?

## Local development
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Production
Set `NEXT_PUBLIC_SITE_URL=https://zonecheckr.com` and deploy to Vercel. Add `zonecheckr.com` and `www.zonecheckr.com` in the Vercel project Domains settings, then follow Vercel's displayed DNS records in Namecheap.

## Notes
- Ad boxes are placeholders. Do not insert AdSense code until the site has enough original content and the AdSense account/site is approved.
- The SSL endpoint blocks private/local targets to reduce SSRF risk.
- The propagation checker compares major public resolvers; it is not a geographic probe network.
<<<<<<< HEAD

## ZoneCheckr v3 additions

- Dark/light theme toggle with local preference persistence.
- Global DNS propagation map using live Globalping DNS probes.
- Optional expected DNS value so the map can show where a new record is visible.
- Regional DNS result cards with resolver, answer and latency.
- Contact page and support@zonecheckr.com links.

### Global DNS propagation

The propagation endpoint uses Globalping's public measurement API. It can work without authentication at low volume. For higher free limits, create a Globalping account/token and add it to Vercel as `GLOBALPING_TOKEN`.

## v4 reliability update

This build includes:
- working light/dark theme switching with saved preference and system-theme fallback;
- DNS lookup fallback across Cloudflare DNS and Google Public DNS;
- global DNS propagation checks through Globalping with a regional world map;
- more defensive handling of current Globalping probe response shapes.

After downloading a fresh copy, run:

```bash
npm install
npm run dev
```

Then test:
- `http://localhost:3000/tools/dns-lookup`
- `http://localhost:3000/tools/dns-propagation`
- the Light/Dark switch in the header.
=======
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
