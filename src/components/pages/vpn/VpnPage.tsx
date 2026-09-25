import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Database,
  Globe,
  KeyRound,
  Lock,
  Network,
  Pencil,
  Plus,
  RefreshCw,
  Shield,
  ShieldAlert,
  Trash2,
  Wifi,
} from 'lucide-react';

type VpnTab = 'overview' | 'ipsec' | 'openvpn' | 'wireguard' | 'events';

interface VpnPageProps {
  activeTab?: VpnTab;
  hasWritePermission?: boolean;
}

function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().includes('connected') || status.toLowerCase().includes('healthy') || status.toLowerCase().includes('enabled')
    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    : status.toLowerCase().includes('warning') || status.toLowerCase().includes('degraded')
      ? 'bg-amber-100 text-amber-800 border border-amber-200'
      : status.toLowerCase().includes('error') || status.toLowerCase().includes('failed')
        ? 'bg-red-100 text-red-800 border border-red-200'
        : 'bg-slate-200 text-slate-700 border border-slate-300';

  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${tone}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-90" />{status}</span>;
}

function MetricCard({ label, value, hint, tone = 'neutral' }: { label: string; value: string; hint?: string; tone?: 'neutral' | 'good' | 'warning' | 'critical' }) {
  const toneMap = {
    neutral: 'bg-slate-50 border-slate-200 text-slate-700',
    good: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`rounded-xl border p-3 ${toneMap[tone]}`}>
      <div className="text-[10px] uppercase tracking-[0.12em] font-semibold opacity-75">{label}</div>
      <div className="mt-2 text-lg font-bold">{value}</div>
      {hint && <div className="mt-1 text-[11px] opacity-75">{hint}</div>}
    </div>
  );
}

function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export const DeviceVpnPage: React.FC<VpnPageProps> = ({ activeTab = 'overview', hasWritePermission = true }) => {
  const [vpnEnabled, setVpnEnabled] = useState(true);
  const [ipsecEnabled, setIpsecEnabled] = useState(true);
  const [openvpnEnabled, setOpenvpnEnabled] = useState(false);
  const [wireguardEnabled, setWireguardEnabled] = useState(true);

  const [ipsecTunnels] = useState([
    { name: 'HQ-Branch-01', local: '172.16.0.5', remote: '203.0.113.21', status: 'Connected', uptime: '15d 04h', traffic: '114 MB / 86 MB' },
  ]);

  const [vpnEvents] = useState([
    { type: 'Tunnel connected', tunnel: 'HQ-Branch-01', severity: 'Info', time: '2026-09-25 12:30:19' },
    { type: 'Authentication failure', tunnel: 'Remote-Edge', severity: 'Error', time: '2026-09-25 12:10:03' },
    { type: 'Configuration changed', tunnel: 'WG-Field-17', severity: 'Warning', time: '2026-09-25 11:53:12' },
  ]);

  const [wireguardPeers] = useState([
    { name: 'Field-01', pk: 'P6j+R0...', endpoint: '203.0.113.20:51820', ips: '10.8.0.2/32', handshake: '31s ago', rx: '42 MB', tx: '29 MB', status: 'Connected' },
    { name: 'Field-02', pk: 'T3m+J8...', endpoint: '203.0.113.21:51820', ips: '10.8.0.3/32', handshake: '3m ago', rx: '19 MB', tx: '17 MB', status: 'Connected' },
  ]);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="VPN Service" value={vpnEnabled ? 'Enabled' : 'Disabled'} hint="Device-local service" tone={vpnEnabled ? 'good' : 'neutral'} />
        <MetricCard label="Configured Tunnels" value="5" hint="IPsec + WireGuard + OpenVPN" />
        <MetricCard label="Active Tunnels" value="3" hint="Currently connected" />
        <MetricCard label="Connected Peers" value="12" hint="Connected devices" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Activity className="w-4 h-4 text-blue-600" /> Traffic Statistics</div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard label="RX" value="148 MB" hint="Tunnel data" />
            <MetricCard label="TX" value="132 MB" hint="Tunnel data" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Shield className="w-4 h-4 text-blue-600" /> Recent VPN Events</div>
          <ul className="mt-4 space-y-2 text-xs text-slate-600">
            {vpnEvents.map((event, index) => (
              <li key={index} className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-600 mt-0.5" />{event.type} • {event.tunnel} • {event.severity}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Tunnel Control</h3>
            <p className="text-[11px] text-slate-500">Connect or disconnect available VPN tunnels as needed.</p>
          </div>
          <button onClick={() => setVpnEnabled((v) => !v)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${vpnEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{vpnEnabled ? 'Enabled' : 'Disabled'}</button>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {['IPsec', 'OpenVPN', 'WireGuard'].map((name) => (
            <div key={name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between items-center mb-2"><span className="font-semibold text-slate-800">{name}</span><StatusBadge status={name === 'WireGuard' ? 'Connected' : 'Standby'} /></div>
              <div className="flex gap-2">
                <button className="rounded bg-slate-900 text-white px-2 py-1.5">Connect</button>
                <button className="rounded border border-slate-300 bg-white px-2 py-1.5">Disconnect</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIpsec = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5" />
        IPsec controls shown here are UI placeholders for the FluxGateway device-local implementation. The current project does not include a live backend or database connection for actual tunnel enforcement.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="IPsec Service" value={ipsecEnabled ? 'Enabled' : 'Disabled'} tone={ipsecEnabled ? 'good' : 'neutral'} />
        <MetricCard label="Configured Tunnels" value="2" />
        <MetricCard label="Active Tunnels" value="1" />
        <MetricCard label="Last Error" value="None" tone="good" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="IPsec Tunnels" subtitle="Managed tunnel endpoints and current state." right={<button onClick={() => setIpsecEnabled((v) => !v)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${ipsecEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{ipsecEnabled ? 'Enabled' : 'Disabled'}</button>} />
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">Tunnel Name</th><th>Local Endpoint</th><th>Remote Endpoint</th><th>Status</th><th>Uptime</th><th>Traffic</th><th className="text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {ipsecTunnels.map((tunnel) => (
                <tr key={tunnel.name}><td className="px-3 py-2 font-semibold text-slate-800">{tunnel.name}</td><td>{tunnel.local}</td><td>{tunnel.remote}</td><td><StatusBadge status={tunnel.status} /></td><td>{tunnel.uptime}</td><td>{tunnel.traffic}</td><td className="text-right"><div className="flex justify-end gap-1"><button className="p-1 rounded hover:bg-slate-100"><RefreshCw className="w-3.5 h-3.5" /></button><button className="p-1 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOpenvpn = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="OpenVPN Service" value={openvpnEnabled ? 'Enabled' : 'Disabled'} tone={openvpnEnabled ? 'good' : 'neutral'} />
        <MetricCard label="Instance" value="gateway-branch" />
        <MetricCard label="Connection Status" value="Connected" tone="good" />
        <MetricCard label="Port" value="1194" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <SectionHeader title="OpenVPN Configuration" subtitle="TLS-based tunnel configuration and status." right={<button onClick={() => setOpenvpnEnabled((v) => !v)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${openvpnEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{openvpnEnabled ? 'Enabled' : 'Disabled'}</button>} />
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Instance</label>
            <input value="gateway-branch" className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2" readOnly />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Remote / Server Address</label>
            <input value="vpn.company-scada.net" className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2" readOnly />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Port</label>
            <input value="1194" className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2" readOnly />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Authentication</label>
            <input value="TLS + client cert" className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2" readOnly />
          </div>
        </div>
      </div>
    </div>
  );

  const renderWireguard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Interface Status" value={wireguardEnabled ? 'Enabled' : 'Disabled'} tone={wireguardEnabled ? 'good' : 'neutral'} />
        <MetricCard label="Interface" value="wg0" />
        <MetricCard label="Address" value="10.8.0.1/24" />
        <MetricCard label="Listen Port" value="51820" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="WireGuard Peers" subtitle="Peer addresses, key material, and reachability status." right={<button onClick={() => setWireguardEnabled((v) => !v)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${wireguardEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{wireguardEnabled ? 'Enabled' : 'Disabled'}</button>} />
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">Peer Name</th><th>Public Key</th><th>Endpoint</th><th>Allowed IPs</th><th>Latest Handshake</th><th>RX</th><th>TX</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {wireguardPeers.map((peer) => (
                <tr key={peer.name}><td className="px-3 py-2 font-semibold text-slate-800">{peer.name}</td><td className="font-mono">{peer.pk}</td><td>{peer.endpoint}</td><td>{peer.ips}</td><td>{peer.handshake}</td><td>{peer.rx}</td><td>{peer.tx}</td><td><StatusBadge status={peer.status} /></td><td className="text-right"><div className="flex justify-end gap-1"><button className="p-1 rounded hover:bg-slate-100"><Pencil className="w-3.5 h-3.5" /></button><button className="p-1 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold mb-4">
          {['VPN type', 'Tunnel / Peer', 'Severity', 'Date / Time'].map((field) => (
            <button key={field} className="rounded border border-slate-300 bg-slate-100 px-2 py-1 text-slate-700">{field}</button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">Event</th><th>Tunnel / Peer</th><th>Severity</th><th>Date / Time</th><th className="text-right">Details</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {vpnEvents.map((event, index) => (
                <tr key={index}><td className="px-3 py-2 font-semibold text-slate-800">{event.type}</td><td>{event.tunnel}</td><td><StatusBadge status={event.severity === 'Error' ? 'Error' : event.severity === 'Warning' ? 'Warning' : 'Info'} /></td><td>{event.time}</td><td className="text-right"><button className="rounded bg-slate-900 text-white px-2 py-1">View</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderByTab: Record<VpnTab, React.ReactNode> = {
    overview: renderOverview(),
    ipsec: renderIpsec(),
    openvpn: renderOpenvpn(),
    wireguard: renderWireguard(),
    events: renderEvents(),
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1"><span className="text-sky-300 font-semibold">VPN</span><span className="text-sky-400/50">/</span><span className="text-white font-semibold">Secure Connectivity</span></div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2"><Shield className="w-5 h-5 text-sky-300" />FluxGateway VPN Management</h1>
        <p className="text-xs text-sky-100/85 mt-1">Device-local monitoring and configuration for IPsec, OpenVPN, and WireGuard tunnels.</p>
      </div>

      {renderByTab[activeTab]}
    </div>
  );
};
