import React, { useState } from 'react';
import { 
  Globe, 
  Save, 
  CheckCircle2, 
  Server, 
  Activity, 
  ShieldCheck, 
  ArrowDownUp, 
  Network 
} from 'lucide-react';
import { PortStatusRow } from '../../common/PortStatusRow';

export interface WanPageProps {
  hasWritePermission?: boolean;
}

export const WanPage: React.FC<WanPageProps> = ({ hasWritePermission = true }) => {
  const [proto, setProto] = useState<'dhcp' | 'static' | 'pppoe'>('dhcp');
  const [ip, setIp] = useState('198.51.100.45');
  const [netmask, setNetmask] = useState('255.255.255.0');
  const [gateway, setGateway] = useState('198.51.100.1');
  const [dns1, setDns1] = useState('1.1.1.1');
  const [dns2, setDns2] = useState('8.8.8.8');
  const [mtu, setMtu] = useState('1500');
  const [nat, setNat] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWritePermission) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Breadcrumb & Header */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Connectivity</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Physical WAN Port</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-300" />
          WAN Connectivity Status
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Active WAN uplink status for the FluxGateway. Cellular is treated as a valid WAN interface option and not as a separate WAN device.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>WAN Interface parameters saved and applied to physical port eth0.</span>
        </div>
      )}

      {/* Physical RJ45 Port Graphic (1 WAN Port Symbol) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Physical WAN Port Status</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hardware PHY link state with active patch cable and negotiation status
          </p>
        </div>
        <PortStatusRow mode="wan" interactive={true} />
      </div>

      {/* Physical Port Status + Connection Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Physical Port Status Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Physical Port eth0</h3>
                  <p className="text-[11px] text-slate-500">10/100/1000Base-T RJ45</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Link Up
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-sans text-slate-500">Negotiated Speed:</span>
                <span className="font-bold text-slate-900">1000 Mbps</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-sans text-slate-500">Duplex Mode:</span>
                <span className="font-bold text-slate-900">Full Duplex</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-sans text-slate-500">MAC Address:</span>
                <span className="text-slate-800 font-semibold">D4:6A:91:88:E2:00</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-sans text-slate-500">Cable Sensing:</span>
                <span className="text-slate-800 font-semibold">Cat6 STP (Auto-MDIX)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Rx: 1.42 GB</span>
            <span>Tx: 840.2 MB</span>
          </div>
        </div>

        {/* Live Connection Summary Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">WAN Connection Summary</h3>
                <p className="text-[11px] text-slate-500">Current active IPv4 routing state and addressing</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Protocol: {proto.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-sans text-[11px] block">Assigned WAN IP</span>
              <span className="font-bold text-slate-900 text-sm">{ip}</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Netmask: {netmask}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-sans text-[11px] block">Default Gateway</span>
              <span className="font-bold text-slate-900 text-sm">{gateway}</span>
              <span className="text-[10px] text-emerald-700 font-sans block mt-0.5 font-medium">Reachable (Ping &lt; 1ms)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-sans text-[11px] block">DNS Nameservers</span>
              <span className="font-bold text-slate-900 text-sm">{dns1}</span>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Backup: {dns2}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-sans text-[11px] block">MTU Size</span>
              <span className="font-bold text-slate-900 text-sm">{mtu} Bytes</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Standard Ethernet Frame</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-sans text-[11px] block">NAT Masquerade</span>
              <span className="font-bold text-emerald-700 text-sm">Enabled</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Firewall Zone: wan</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-sans text-[11px] block">Failover Role</span>
              <span className="font-bold text-slate-800 text-sm">Priority 3 (Fallback)</span>
              <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Standby auto-takeover</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>WAN Interface Protocol & Addressing Configuration</span>
          <span className="text-xs text-slate-500 font-normal">Physical Port Parameters</span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Connection Protocol
              </label>
              <select
                value={proto}
                onChange={(e) => setProto(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="dhcp">DHCP Client (Automatic IP from ISP/Uplink)</option>
                <option value="static">Static IP (Fixed Industrial Subnet)</option>
                <option value="pppoe">PPPoE (Point-to-Point Protocol)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Maximum Transmission Unit (MTU)
              </label>
              <input
                type="number"
                value={mtu}
                onChange={(e) => setMtu(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {proto === 'static' && (
              <>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Static IPv4 Address
                  </label>
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Subnet Mask
                  </label>
                  <input
                    type="text"
                    value={netmask}
                    onChange={(e) => setNetmask(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Default Gateway IP
                  </label>
                  <input
                    type="text"
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Primary DNS Server
              </label>
              <input
                type="text"
                value={dns1}
                onChange={(e) => setDns1(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Secondary DNS Server
              </label>
              <input
                type="text"
                value={dns2}
                onChange={(e) => setDns2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center pt-4">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={nat}
                  onChange={(e) => setNat(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-800 text-xs">
                    Enable Masquerading / Network Address Translation (NAT)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Translate private LAN client IPs when communicating with external WAN networks
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
            <button
              type="submit"
              disabled={!hasWritePermission}
              data-write-action="true"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs shadow-xs transition-colors ${
                hasWritePermission
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{hasWritePermission ? 'Save WAN Configuration' : 'Save Disabled (Read-Only)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
