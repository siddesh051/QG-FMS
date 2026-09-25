import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpDown,
  Cable,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Gauge,
  Globe,
  Lock,
  Network,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Shield,
  ShieldAlert,
  Signal,
  Trash2,
  Wifi,
  Zap,
} from 'lucide-react';

type NetworkTab =
  | 'overview'
  | 'nat'
  | 'firewall'
  | 'access-control'
  | 'port-forwarding'
  | 'dmz'
  | 'dos'
  | 'vlan'
  | 'qos'
  | 'link-aggregation';

interface NetworkPageProps {
  activeTab?: NetworkTab;
  hasWritePermission?: boolean;
}

const statusClasses: Record<string, string> = {
  healthy: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200',
  error: 'bg-red-100 text-red-800 border border-red-200',
  disabled: 'bg-slate-200 text-slate-700 border border-slate-300',
};

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone =
    normalized.includes('connected') || normalized.includes('enabled') || normalized.includes('healthy')
      ? 'healthy'
      : normalized.includes('warning') || normalized.includes('degraded')
        ? 'warning'
        : normalized.includes('error') || normalized.includes('failed')
          ? 'error'
          : 'disabled';

  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClasses[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-90" />{status}</span>;
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

export const NetworkPage: React.FC<NetworkPageProps> = ({ activeTab = 'overview', hasWritePermission = true }) => {
  const [natEnabled, setNatEnabled] = useState(true);
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [dmzEnabled, setDmzEnabled] = useState(false);
  const [dosEnabled, setDosEnabled] = useState(true);
  const [qosEnabled, setQosEnabled] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  const [natRules] = useState([
    { id: 'NAT-01', wan: 'WAN1', lan: 'LAN', protocol: 'TCP/UDP', status: 'Active' },
    { id: 'NAT-02', wan: 'WAN1', lan: 'DMZ', protocol: 'TCP', status: 'Active' },
  ]);

  const [firewallRules] = useState([
    { id: 'FW-101', source: '10.0.0.0/8', destination: '0.0.0.0/0', protocol: 'TCP', sourcePort: 'Any', destinationPort: '443', interface: 'wan1', direction: 'Inbound', action: 'Allow', status: 'Enabled' },
    { id: 'FW-102', source: '172.16.0.0/16', destination: '10.10.10.5', protocol: 'UDP', sourcePort: 'Any', destinationPort: '502', interface: 'lan', direction: 'Inbound', action: 'Allow', status: 'Enabled' },
    { id: 'FW-103', source: '0.0.0.0/0', destination: '192.168.1.10', protocol: 'TCP', sourcePort: 'Any', destinationPort: '22', interface: 'wan1', direction: 'Inbound', action: 'Deny', status: 'Enabled' },
  ]);

  const [accessRules] = useState([
    { id: 'AC-01', source: '192.168.10.0/24', destination: '10.0.0.0/8', protocol: 'Any', action: 'Allow', status: 'Active' },
    { id: 'AC-02', source: '10.10.50.0/24', destination: 'VPN', protocol: 'UDP/500', action: 'Allow', status: 'Active' },
  ]);

  const [forwardRules] = useState([
    { id: 'PF-01', port: '443', internalIp: '192.168.1.45', internalPort: '443', protocol: 'TCP', status: 'Enabled' },
    { id: 'PF-02', port: '502', internalIp: '192.168.1.12', internalPort: '502', protocol: 'TCP', status: 'Enabled' },
  ]);

  const [vlanRows] = useState([
    { id: '10', interface: 'eth1.10', ip: '192.168.10.1/24', status: 'Up' },
    { id: '20', interface: 'eth1.20', ip: '192.168.20.1/24', status: 'Up' },
  ]);

  const [qosRules] = useState([
    { id: 'QOS-01', className: 'SCADA', priority: 'High', interface: 'wan1', protocol: 'TCP', rate: '50 Mbps', status: 'Enabled' },
    { id: 'QOS-02', className: 'Telemetry', priority: 'Normal', interface: 'lan', protocol: 'UDP', rate: '20 Mbps', status: 'Enabled' },
  ]);

  const [aggregationRows] = useState([
    { id: 'lag0', logical: 'bond0', members: 'eth0, eth1', status: 'Active', rx: '214 MB', tx: '187 MB' },
  ]);

  const summary = useMemo(() => ({
    overall: 'Healthy',
    internet: 'Connected',
    wan: 'WAN1 (Ethernet)',
    ethernet: 'Up',
    wifi: 'Connected',
    cellular: 'Standby',
    ip: '172.16.20.88',
    gateway: '172.16.20.1',
    dns: '8.8.8.8 / 1.1.1.1',
    rx: '1.84 GB',
    tx: '1.21 GB',
    recent: ['WAN link recovered after brief packet loss', 'Firewall rule update applied', 'QoS class adjusted for SCADA traffic'],
  }), []);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Overall Network Status" value={summary.overall} hint="Gateway health" tone="good" />
        <MetricCard label="Internet Connectivity" value={summary.internet} hint={summary.wan} tone="good" />
        <MetricCard label="Ethernet" value={summary.ethernet} hint="Link status" tone="good" />
        <MetricCard label="Wi‑Fi" value={summary.wifi} hint="Access Point online" tone="good" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Cellular" value={summary.cellular} hint="Failover ready" tone="warning" />
        <MetricCard label="IP Address" value={summary.ip} hint="Primary LAN" />
        <MetricCard label="Gateway" value={summary.gateway} hint="Default route" />
        <MetricCard label="DNS" value={summary.dns} hint="Primary / secondary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Activity className="w-4 h-4 text-blue-600" /> Traffic</div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard label="RX Traffic" value={summary.rx} hint="Last 24h" />
            <MetricCard label="TX Traffic" value={summary.tx} hint="Last 24h" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Signal className="w-4 h-4 text-blue-600" /> Recent Network Events</div>
          <ul className="mt-4 space-y-2 text-xs text-slate-600">
            {summary.recent.map((event, index) => (
              <li key={index} className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-sky-600 mt-0.5" />{event}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <SectionHeader title="Device Interface Controls" subtitle="Enable, disable or reconnect supported interfaces." right={<StatusBadge status="Connected" />} />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
          {[
            { name: 'Ethernet', state: 'Connected' },
            { name: 'Wi‑Fi', state: 'Connected' },
            { name: 'Cellular', state: 'Standby' },
            { name: 'WAN1', state: 'Connected' },
          ].map((iface) => (
            <div key={iface.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800">{iface.name}</span>
                <StatusBadge status={iface.state} />
              </div>
              <div className="mt-3 flex gap-2">
                <button className="rounded bg-slate-900 text-white px-2 py-1.5 font-semibold">Enable</button>
                <button className="rounded border border-slate-300 bg-white px-2 py-1.5 font-semibold">Connect</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNat = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="NAT Status" value={natEnabled ? 'Enabled' : 'Disabled'} hint="Stateful translation" tone={natEnabled ? 'good' : 'neutral'} />
        <MetricCard label="WAN Interface" value="WAN1" hint="Primary uplink" />
        <MetricCard label="LAN Interface" value="br-lan" hint="Internal subnet" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="NAT Configuration" subtitle="Configure network address translation for the active gateway interfaces." right={<button onClick={() => setNatEnabled((v) => !v)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${natEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{natEnabled ? 'Enabled' : 'Disabled'}</button>} />
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">WAN Interface</label>
            <select className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2"><option>WAN1</option><option>WAN2</option></select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">LAN Interface</label>
            <select className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2"><option>br-lan</option><option>lan1</option></select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">NAT Mode</label>
            <select className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2"><option>MASQUERADE</option><option>Static NAT</option></select>
          </div>
        </div>
        <div className="flex justify-end px-4 pb-4">
          <button className="rounded bg-blue-600 text-white px-4 py-2 text-xs font-bold">Apply Changes</button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="NAT Statistics" subtitle="Current translation activity" />
        <div className="p-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">Rule ID</th><th>WAN</th><th>LAN</th><th>Protocol</th><th>Status</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {natRules.map((r) => (
                <tr key={r.id}><td className="px-3 py-2 font-semibold text-slate-800">{r.id}</td><td>{r.wan}</td><td>{r.lan}</td><td>{r.protocol}</td><td><StatusBadge status={r.status} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFirewall = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Firewall Status" value={firewallEnabled ? 'Enabled' : 'Disabled'} hint="Stateful inspection" tone={firewallEnabled ? 'good' : 'neutral'} />
        <MetricCard label="Active Rules" value="12" hint="Compiled in kernel" />
        <MetricCard label="Allowed Traffic" value="3,420" hint="Packets accepted" />
        <MetricCard label="Blocked Traffic" value="120" hint="Packets denied" tone="warning" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="Firewall Rules" subtitle="Manage stateful rules for permitted and denied traffic." right={<button onClick={() => setFirewallEnabled((v) => !v)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${firewallEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{firewallEnabled ? 'Enabled' : 'Disabled'}</button>} />
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">Rule ID</th><th>Source</th><th>Destination</th><th>Protocol</th><th>Source Port</th><th>Destination Port</th><th>Interface</th><th>Direction</th><th>Action</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {firewallRules.map((rule) => (
                <tr key={rule.id}><td className="px-3 py-2 font-semibold text-slate-800">{rule.id}</td><td>{rule.source}</td><td>{rule.destination}</td><td>{rule.protocol}</td><td>{rule.sourcePort}</td><td>{rule.destinationPort}</td><td>{rule.interface}</td><td>{rule.direction}</td><td>{rule.action}</td><td><StatusBadge status={rule.status} /></td><td className="text-right"><div className="flex justify-end gap-1"><button className="p-1 rounded hover:bg-slate-100"><Pencil className="w-3.5 h-3.5" /></button><button className="p-1 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center px-4 py-3 border-t border-slate-200 bg-slate-50">
          <div className="text-[11px] text-slate-500">Queue matched rules from the active device firewall policy.</div>
          <button className="rounded bg-blue-600 text-white px-3 py-1.5 text-xs font-bold">Add Rule</button>
        </div>
      </div>
    </div>
  );

  const renderAccessControl = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Access Status" value="Active" hint="Policy enforcement" tone="good" />
        <MetricCard label="Active Rules" value="8" hint="Configured entries" />
        <MetricCard label="Allowed" value="5" hint="Trusted devices/networks" />
        <MetricCard label="Blocked" value="3" hint="Denied entries" tone="warning" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="Access Control Rules" subtitle="Flexible policy model for firewall-style allow/deny access decisions." right={<button className="rounded bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-bold">Add Rule</button>} />
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">Rule ID</th><th>Source / Device</th><th>Destination</th><th>Protocol</th><th>Action</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {accessRules.map((rule) => (
                <tr key={rule.id}><td className="px-3 py-2 font-semibold text-slate-800">{rule.id}</td><td>{rule.source}</td><td>{rule.destination}</td><td>{rule.protocol}</td><td>{rule.action}</td><td><StatusBadge status={rule.status} /></td><td className="text-right"><div className="flex justify-end gap-1"><button className="p-1 rounded hover:bg-slate-100"><Pencil className="w-3.5 h-3.5" /></button><button className="p-1 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPortForwarding = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 mt-0.5" />
        Port forwarding exposes internal services to the WAN. Review destination IPs and access restrictions before enabling any rule.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Port Forwarding Status" value="Enabled" tone="good" />
        <MetricCard label="Active Rules" value="2" />
        <MetricCard label="Exposed Services" value="2" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="Forwarding Rules" subtitle="WAN to internal service mappings." right={<button className="rounded bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-bold">Add Rule</button>} />
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">Rule ID</th><th>External Port</th><th>Internal IP</th><th>Internal Port</th><th>Protocol</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {forwardRules.map((rule) => (
                <tr key={rule.id}><td className="px-3 py-2 font-semibold text-slate-800">{rule.id}</td><td>{rule.port}</td><td>{rule.internalIp}</td><td>{rule.internalPort}</td><td>{rule.protocol}</td><td><StatusBadge status={rule.status} /></td><td className="text-right"><div className="flex justify-end gap-1"><button className="p-1 rounded hover:bg-slate-100"><Pencil className="w-3.5 h-3.5" /></button><button className="p-1 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDmz = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="DMZ Status" value={dmzEnabled ? 'Enabled' : 'Disabled'} hint="Exposed host" tone={dmzEnabled ? 'warning' : 'neutral'} />
        <MetricCard label="Configured Host" value="192.168.1.25" />
        <MetricCard label="Interface" value="LAN" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">DMZ Configuration</h3>
            <p className="text-[11px] text-slate-500">Forward all unsolicited traffic to a single internal host.</p>
          </div>
          <button onClick={() => setDmzEnabled((v) => !v)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${dmzEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{dmzEnabled ? 'Enabled' : 'Disabled'}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">DMZ Host</label>
            <input value="192.168.1.25" className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2" />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Interface</label>
            <select className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2"><option>LAN</option><option>WAN</option></select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={() => setShowWarning(true)} className="rounded bg-blue-600 text-white px-4 py-2 text-xs font-bold">Apply</button>
        </div>
      </div>

      {showWarning && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
          <div className="font-bold mb-1">Warning: Enabling DMZ may expose the selected internal host to unsolicited incoming traffic.</div>
          <div className="flex justify-end gap-2 mt-3"><button onClick={() => setShowWarning(false)} className="rounded border border-red-200 bg-white px-3 py-1.5 font-semibold">Cancel</button><button onClick={() => { setDmzEnabled(true); setShowWarning(false); }} className="rounded bg-red-600 text-white px-3 py-1.5 font-semibold">Confirm</button></div>
        </div>
      )}
    </div>
  );

  const renderDos = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="DoS Protection" value={dosEnabled ? 'Enabled' : 'Disabled'} hint="Automatic mitigation" tone={dosEnabled ? 'good' : 'neutral'} />
        <MetricCard label="Detected Events" value="12" />
        <MetricCard label="Blocked Traffic" value="1.4M" />
        <MetricCard label="Last Event" value="2m ago" tone="warning" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Protection Controls</h3>
            <p className="text-[11px] text-slate-500">Toggle the device-level mitigation policy without assuming unsupported parameters.</p>
          </div>
          <button onClick={() => setDosEnabled((v) => !v)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${dosEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{dosEnabled ? 'Enabled' : 'Disabled'}</button>
        </div>
        <div className="flex gap-2">
          <button className="rounded bg-slate-900 text-white px-3 py-2 text-xs font-bold">Clear Statistics</button>
          <button className="rounded border border-slate-300 bg-white px-3 py-2 text-xs font-bold">Reset Event Log</button>
        </div>
      </div>
    </div>
  );

  const renderVlan = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="VLAN Status" value="Configured" tone="good" />
        <MetricCard label="VLAN IDs" value="2" />
        <MetricCard label="Parent Interface" value="eth1" />
        <MetricCard label="Operational" value="Up" tone="good" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="VLAN Table" subtitle="Logical segment management for gateway traffic." right={<button className="rounded bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-bold">Create VLAN</button>} />
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">VLAN ID</th><th>Interface</th><th>IP Address</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {vlanRows.map((vlan) => (
                <tr key={vlan.id}><td className="px-3 py-2 font-semibold text-slate-800">{vlan.id}</td><td>{vlan.interface}</td><td>{vlan.ip}</td><td><StatusBadge status={vlan.status} /></td><td className="text-right"><div className="flex justify-end gap-1"><button className="p-1 rounded hover:bg-slate-100"><Pencil className="w-3.5 h-3.5" /></button><button className="p-1 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQos = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5" />
        QoS rules shown here are informational only in this frontend build. Real rule creation, modification, and enforcement require the FluxGateway backend and device adapter.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="QoS Status" value={qosEnabled ? 'Enabled' : 'Disabled'} tone={qosEnabled ? 'good' : 'neutral'} />
        <MetricCard label="Traffic Classes" value="4" />
        <MetricCard label="Interfaces" value="2" />
        <MetricCard label="Bandwidth" value="120 Mbps" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="QoS Rules" subtitle="Traffic prioritization by class, interface and protocol." right={<button onClick={() => setQosEnabled((v) => !v)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${qosEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{qosEnabled ? 'Enabled' : 'Disabled'}</button>} />
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">Rule ID</th><th>Class</th><th>Priority</th><th>Interface</th><th>Protocol</th><th>Bandwidth</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {qosRules.map((rule) => (
                <tr key={rule.id}><td className="px-3 py-2 font-semibold text-slate-800">{rule.id}</td><td>{rule.className}</td><td>{rule.priority}</td><td>{rule.interface}</td><td>{rule.protocol}</td><td>{rule.rate}</td><td><StatusBadge status={rule.status} /></td><td className="text-right"><div className="flex justify-end gap-1"><button className="p-1 rounded hover:bg-slate-100"><Pencil className="w-3.5 h-3.5" /></button><button className="p-1 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLinkAggregation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Link Aggregation" value="Active" tone="good" />
        <MetricCard label="Logical Interface" value="bond0" />
        <MetricCard label="Member Interfaces" value="2" />
        <MetricCard label="Mode" value="Adaptive" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <SectionHeader title="Aggregated Links" subtitle="Logical bundle of multiple physical Ethernet interfaces." right={<button className="rounded bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-bold">Create Aggregation</button>} />
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2">Logical Interface</th><th>Members</th><th>Status</th><th>RX</th><th>TX</th><th className="text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {aggregationRows.map((row) => (
                <tr key={row.id}><td className="px-3 py-2 font-semibold text-slate-800">{row.logical}</td><td>{row.members}</td><td><StatusBadge status={row.status} /></td><td>{row.rx}</td><td>{row.tx}</td><td className="text-right"><div className="flex justify-end gap-1"><button className="p-1 rounded hover:bg-slate-100"><Pencil className="w-3.5 h-3.5" /></button><button className="p-1 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderByTab: Record<NetworkTab, React.ReactNode> = {
    overview: renderOverview(),
    nat: renderNat(),
    firewall: renderFirewall(),
    'access-control': renderAccessControl(),
    'port-forwarding': renderPortForwarding(),
    dmz: renderDmz(),
    dos: renderDos(),
    vlan: renderVlan(),
    qos: renderQos(),
    'link-aggregation': renderLinkAggregation(),
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1"><span className="text-sky-300 font-semibold">Network</span><span className="text-sky-400/50">/</span><span className="text-white font-semibold">Gateway Management</span></div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2"><Network className="w-5 h-5 text-sky-300" />FluxGateway Network EMS</h1>
        <p className="text-xs text-sky-100/85 mt-1">Device-local network status, policy control, and traffic management for the active FluxGateway instance.</p>
      </div>

      {renderByTab[activeTab]}
    </div>
  );
};
