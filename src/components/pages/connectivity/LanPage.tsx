import React, { useState } from 'react';
import { 
  Server, 
  Save, 
  CheckCircle2, 
  Network, 
  Activity, 
  Laptop, 
  Cpu, 
  ShieldAlert, 
  ArrowDownUp 
} from 'lucide-react';
import { PortStatusRow } from '../../common/PortStatusRow';

interface LanPortStatus {
  id: string;
  name: string;
  label: string;
  state: 'Up' | 'Down';
  speed: string;
  duplex: string;
  connectedDevice: string;
  rxBytes: string;
  txBytes: string;
}

export interface LanPageProps {
  hasWritePermission?: boolean;
}

export const LanPage: React.FC<LanPageProps> = ({ hasWritePermission = true }) => {
  const [ipAddress, setIpAddress] = useState('192.168.1.1');
  const [subnetMask, setSubnetMask] = useState('255.255.255.0');
  const [dhcpServer, setDhcpServer] = useState(true);
  const [dhcpStart, setDhcpStart] = useState('192.168.1.100');
  const [dhcpEnd, setDhcpEnd] = useState('192.168.1.200');
  const [leaseTime, setLeaseTime] = useState('86400'); // 24h
  const [ethernetSpeed, setEthernetSpeed] = useState('1 Gbps / Multi-Gig');
  const [saved, setSaved] = useState(false);

  // Live LAN Port Status Cards (LAN1–LAN4)
  const ports: LanPortStatus[] = [
    {
      id: 'lan1',
      name: 'LAN 1',
      label: 'eth1 (Industrial RJ45)',
      state: 'Up',
      speed: '1000 Mbps',
      duplex: 'Full Duplex',
      connectedDevice: 'Siemens S7-1500 PLC (192.168.1.101)',
      rxBytes: '412.8 MB',
      txBytes: '891.4 MB',
    },
    {
      id: 'lan2',
      name: 'LAN 2',
      label: 'eth2 (Industrial RJ45)',
      state: 'Up',
      speed: '1000 Mbps',
      duplex: 'Full Duplex',
      connectedDevice: 'Operator HMI Panel (192.168.1.102)',
      rxBytes: '185.3 MB',
      txBytes: '240.1 MB',
    },
    {
      id: 'lan3',
      name: 'LAN 3',
      label: 'eth3 (Industrial RJ45)',
      state: 'Down',
      speed: 'No Link',
      duplex: 'Auto-Sense',
      connectedDevice: 'Cable Unplugged',
      rxBytes: '0 B',
      txBytes: '0 B',
    },
    {
      id: 'lan4',
      name: 'LAN 4',
      label: 'eth4 (Industrial RJ45)',
      state: 'Up',
      speed: '100 Mbps',
      duplex: 'Full Duplex',
      connectedDevice: 'Modbus TCP Gateway (192.168.1.104)',
      rxBytes: '68.2 MB',
      txBytes: '72.9 MB',
    },
  ];

  const activePortCount = ports.filter((p) => p.state === 'Up').length;
  const dhcpClientCount = 3; // Connected active DHCP leases

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWritePermission) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Title & Breadcrumbs */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Connectivity</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Local Area Network (LAN)</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Server className="w-5 h-5 text-sky-300" />
          LAN & DHCP Server Configuration
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Monitor physical RJ45 LAN port status (LAN1–LAN4), subnet routing, and embedded dnsmasq DHCP allocations.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>LAN parameters applied successfully. Network bridge br-lan reloaded.</span>
        </div>
      )}

      {/* LAN Live Status Section: Summary + Port Status Cards (LAN1–LAN4) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-600" />
              Physical Switch Port Status (LAN1–LAN4) & DHCP State
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time hardware PHY negotiation, link status, and connected clients
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {activePortCount} / 4 Ports Linked
            </span>
            <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5" />
              {dhcpClientCount} DHCP Clients Leased
            </span>
          </div>
        </div>

        {/* Visual RJ45 Ports Status (LAN1–LAN4 only) */}
        <PortStatusRow mode="lan" interactive={true} />

        {/* 4 Port Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ports.map((port) => {
            const isUp = port.state === 'Up';
            return (
              <div
                key={port.id}
                className={`rounded-xl border p-4 transition-all ${
                  isUp
                    ? 'border-slate-200 bg-white shadow-2xs'
                    : 'border-slate-200 bg-slate-50/70 text-slate-400'
                }`}
              >
                {/* Port Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {port.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {port.id}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isUp
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isUp ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    {isUp ? 'Linked' : 'Down'}
                  </span>
                </div>

                {/* Port Details */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Speed:</span>
                    <span className={`font-semibold ${isUp ? 'text-slate-800' : 'text-slate-400'}`}>
                      {port.speed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Duplex:</span>
                    <span className={`font-semibold ${isUp ? 'text-slate-800' : 'text-slate-400'}`}>
                      {port.duplex}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <div className="text-[11px] font-sans text-slate-500 mb-0.5">Attached Device:</div>
                    <div className={`text-xs font-sans truncate font-medium ${isUp ? 'text-slate-800' : 'text-slate-400 italic'}`} title={port.connectedDevice}>
                      {port.connectedDevice}
                    </div>
                  </div>
                </div>

                {/* Mini Traffic Bar */}
                {isUp && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Rx: {port.rxBytes}</span>
                    <span>Tx: {port.txBytes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* LAN Configuration Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>IPv4 Interface Settings (br-lan)</span>
          <span className="text-xs text-slate-500 font-normal">Internal Subnet Management</span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                LAN IP Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Primary gateway IP for local subnet
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Subnet Mask <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subnetMask}
                onChange={(e) => setSubnetMask(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard CIDR /24 network mask
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Switch Negotiation Mode
              </label>
              <select
                value={ethernetSpeed}
                onChange={(e) => setEthernetSpeed(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="1 Gbps / Multi-Gig">Auto-negotiate (10/100/1000 Mbps)</option>
                <option value="1000 Mbps Full Duplex">1000 Mbps Full Duplex (Forced)</option>
                <option value="100 Mbps Full Duplex">100 Mbps Full Duplex (Legacy)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Internal switch chip PHY rate
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dhcpServer}
                onChange={(e) => setDhcpServer(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-800 text-xs">
                  Enable Embedded DHCP Server (dnsmasq)
                </span>
                <p className="text-[11px] text-slate-500">
                  Automatically distribute dynamic IP addresses to attached industrial devices
                </p>
              </div>
            </label>
          </div>

          {dhcpServer && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-blue-600" />
                DHCP IP Pool Range & Lease Duration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    DHCP Start Address
                  </label>
                  <input
                    type="text"
                    value={dhcpStart}
                    onChange={(e) => setDhcpStart(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    DHCP End Address
                  </label>
                  <input
                    type="text"
                    value={dhcpEnd}
                    onChange={(e) => setDhcpEnd(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Lease Time (seconds)
                  </label>
                  <input
                    type="number"
                    value={leaseTime}
                    onChange={(e) => setLeaseTime(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    86400 seconds = 24 hours
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={!hasWritePermission}
              data-write-action="true"
              onClick={() => {
                if (!hasWritePermission) return;
                setIpAddress('192.168.1.1');
                setSubnetMask('255.255.255.0');
                setDhcpStart('192.168.1.100');
                setDhcpEnd('192.168.1.200');
              }}
              className={`px-3.5 py-2 border rounded-lg text-xs font-semibold transition-colors ${
                hasWritePermission
                  ? 'text-slate-600 hover:text-slate-900 border-slate-300 hover:bg-slate-50 cursor-pointer'
                  : 'text-slate-400 border-slate-200 bg-slate-50 cursor-not-allowed'
              }`}
            >
              Reset to Defaults
            </button>
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
              <span>{hasWritePermission ? 'Save and Apply' : 'Save Disabled (Read-Only)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
