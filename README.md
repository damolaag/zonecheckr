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
