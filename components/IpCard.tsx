export function IpCard({ ip }: { ip: string }) {
  return (
    <div className="ip-card">
      <span className="eyebrow">Your public IP</span>
      <strong>{ip}</strong>
      <p>This is the address your request used to reach this website. VPNs and proxies can change what appears here.</p>
    </div>
  );
}
