import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Domain & DNS Troubleshooting Guides", description: "Practical guides for DNS, domains, email authentication, SSL and website connection problems." };
const guides=[
 ["How Long Does DNS Propagation Take?","Why DNS changes take time, what affects propagation and how to check whether your new record is visible.","/guides/how-long-does-dns-propagation-take","DNS"],
 ["DNS_PROBE_FINISHED_NXDOMAIN: What It Means and How to Fix It","Troubleshoot missing DNS records, nameserver mistakes, local cache problems and recent DNS changes.","/guides/fix-dns-probe-finished-nxdomain","DNS"],
 ["SPF vs DKIM vs DMARC: What's the Difference?","Understand the three core email-authentication mechanisms and how they work together.","/guides/spf-vs-dkim-vs-dmarc","Email"],
 ["How to Check a DMARC Record and Fix Common Problems","Find your DMARC policy, understand its tags and troubleshoot common configuration mistakes.","/guides/how-to-check-dmarc-record","Email"],
 ["Changed Nameservers but Website Still Not Working?","A practical checklist for propagation, authoritative DNS, web records, hosting and HTTPS.","/guides/changed-nameservers-website-not-working","Domains"],
 ["DNS Records Explained","A plain-English reference for A, AAAA, CNAME, MX, TXT and NS records.","/guides/dns-records-explained","DNS"],
];
export default function Guides(){return <div className="container guide-page"><header className="guide-header"><span className="eyebrow">ZoneCheckr Guides</span><h1>Understand the problem. Then fix it.</h1><p>Practical domain troubleshooting guides connected directly to the tools you can use to verify each issue.</p></header><div className="guide-grid">{guides.map(([title,description,href,category])=><Link href={href} className="guide-list-card" key={href}><span className="eyebrow">{category}</span><h2>{title}</h2><p>{description}</p><span className="text-link">Read guide →</span></Link>)}</div></div>}
