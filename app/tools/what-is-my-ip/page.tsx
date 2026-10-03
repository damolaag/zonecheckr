import type { Metadata } from "next";
import { headers } from "next/headers";
import { IpCard } from "@/components/IpCard";

import { AdSlot } from "@/components/AdSlot";
export const metadata: Metadata = {
  title: "What's My IP? — Find Your Public IP Address",
  description: "See the public IP address used by your browser to connect to this website.",
};

export default async function WhatIsMyIpPage() {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || requestHeaders.get("x-real-ip") || "Unavailable in local development";

  return (
    <div className="container tool-page">
      <div className="tool-page-heading">
        <span className="eyebrow">Network tool</span>
        <h1>What&apos;s My IP?</h1>
        <p>Quickly see the public IP address your browser is presenting to this website.</p>
      </div>
      <IpCard ip={ip} /><AdSlot slotId="tool-mid-content" className="tool-inline-ad" />
      
      <article className="article-card">
        <h2>Why can your IP address change?</h2>
        <p>Your ISP can assign a dynamic address, and VPNs, corporate gateways, mobile networks and proxies can make websites see a different public IP than the address used inside your home or office network.</p>
      </article>
    </div>
  );
}