import React, { useState } from 'react';
import { WanInterface } from '../../../types/router';
import { 
  ArrowUpDown, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  Radio, 
  Server, 
  Wifi, 
  Info,
  ArrowRight,
  Activity,
  AlertCircle
} from 'lucide-react';

interface WanFailoverPageProps {
  interfaces: WanInterface[];
  onUpdateInterfaces?: (updated: WanInterface[]) => void;
  hasWritePermission?: boolean;
}

export const WanFailoverPage: React.FC<WanFailoverPageProps> = ({ 
  interfaces,
  hasWritePermission = true 
}) => {
  // Fixed priority chain: 5G (P1) -> Wi-Fi (P2) -> Ethernet (P3)
  const getInterfaceData = (name: '5G' | 'Wi-Fi' | 'Ethernet', defaultPriority: number, defaultIp: string, defaultLat: number) => {
    const found = interfaces.find((i) => i.name === name);
    return {
      priority: defaultPriority,
      name,
      status: found ? found.status : (defaultPriority === 1 ? 'Active' as const : 'Standby' as const),
      ipAddress: found?.ipAddress || defaultIp,
      latencyMs: found?.latencyMs ?? defaultLat,
      packetLoss: found?.packetLoss ?? 0,
    };
  };

  const chain = [
    {
      ...getInterfaceData('5G', 1, '100.74.192.44', 24),
      role: 'Primary WAN',
      desc: 'Default primary cellular broadband route. Actively handles default gateway routing.',
      failoverDesc: 'Hardware watchdog continuously monitors link health and radio quality.'
    },
    {
      ...getInterfaceData('Wi-Fi', 2, '172.20.4.88', 38),
      role: 'Secondary Backup',
      desc: 'Secondary wireless uplink via high-speed 802.11ax client interface.',
      failoverDesc: 'Takes over automatically if 5G fails'
    },
    {
      ...getInterfaceData('Ethernet', 3, '192.168.10.150', 12),
      role: 'Tertiary Fallback',
      desc: 'Dedicated Gigabit wireline Ethernet interface.',
      failoverDesc: 'Takes over automatically if both 5G and Wi-Fi fail'
    }
  ];

  const [failoverEnabled, setFailoverEnabled] = useState(true);
  const [healthCheckEnabled, setHealthCheckEnabled] = useState(true);
  const [checkMethod, setCheckMethod] = useState<'ICMP Ping' | 'HTTP GET' | 'DNS Query'>('ICMP Ping');
  const [targetHost, setTargetHost] = useState('8.8.8.8');
  const [checkInterval, setCheckInterval] = useState('10');
  const [failureThreshold, setFailureThreshold] = useState('3');
  const [recoveryThreshold, setRecoveryThreshold] = useState('2');
  const [triggerMode, setTriggerMode] = useState<'Immediate on Fail Count' | 'Latency Degraded > 300ms' | 'Packet Loss > 20%'>('Immediate on Fail Count');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!hasWritePermission) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case '5G':
        return <Radio className="w-5 h-5 text-blue-600" />;
      case 'Wi-Fi':
        return <Wifi className="w-5 h-5 text-indigo-600" />;
      case 'Ethernet':
        return <Server className="w-5 h-5 text-slate-700" />;
      default:
        return <Activity className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Breadcrumb & Page Title */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Connectivity</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">WAN Failover & Priority</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-sky-300" />
          Multi-WAN Redundancy & Priority Routing
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Autonomous hardware failover chain across 5G Cellular, Wi-Fi, and Wireline Ethernet uplinks.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>WAN failover thresholds and watchdog policies successfully saved to non-volatile flash.</span>
        </div>
      )}

      {/* Prominent Info Banner */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3.5 text-slate-800 shadow-2xs">
        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <h2 className="font-bold text-blue-900 text-sm">Strict Autonomous Failover Hierarchy</h2>
          <p className="text-blue-950 font-medium leading-relaxed">
            Failover priority is fixed (<span className="font-bold text-blue-800">5G → Wi-Fi → Ethernet</span>) and managed by the hardware watchdog. Manual reordering is disabled to comply with system specification.
          </p>
        </div>
      </div>

      {/* Global Engine Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Automatic Failover Engine</h3>
            <p className="text-[11px] text-slate-500">
              Autonomous route deflection upon watchdog probe failure
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={failoverEnabled}
              onChange={(e) => setFailoverEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Continuous Link Health Check</h3>
            <p className="text-[11px] text-slate-500">
              Proactive probe against public target IP (DNS / ICMP)
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={healthCheckEnabled}
              onChange={(e) => setHealthCheckEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Fixed Failover Chain: Connected Cards / Steps */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Autonomous Failover Chain (Fixed Sequence)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sequence executed strictly in cascading order by kernel route tables
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Watchdog Synchronized
          </span>
        </div>

        {/* Responsive Connected Chain */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative">
          {chain.map((item, idx) => {
            const isPrimary = item.priority === 1;
            const isActive = item.status === 'Active';

            return (
              <div key={item.name} className="relative flex flex-col">
                <div
                  className={`flex-1 rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-blue-300 bg-blue-50/40 shadow-xs ring-1 ring-blue-400/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Card Header: Priority & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          isPrimary
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Priority {item.priority}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      {item.status}
                    </span>
                  </div>

                  {/* Interface Icon & Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {getIcon(item.name)}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                        {item.name}
                        {isPrimary && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            Primary
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">{item.role}</p>
                    </div>
                  </div>

                  {/* Failover note */}
                  <p className="text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 mb-3 leading-relaxed">
                    <strong className="text-slate-800 font-semibold">Policy: </strong>
                    {item.failoverDesc}
                  </p>

                  {/* Telemetry Metrics */}
                  <div className="mt-auto space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500 font-sans">IP Address:</span>
                      <span className="font-semibold text-slate-800">{item.ipAddress}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500 font-sans">Latency:</span>
                      <span className="font-semibold text-slate-800">{item.latencyMs} ms</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500 font-sans">Packet Loss:</span>
                      <span className="font-semibold text-emerald-700">{item.packetLoss}%</span>
                    </div>
                  </div>
                </div>

                {/* Step arrow for large screens */}
                {idx < chain.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 shadow-xs items-center justify-center text-slate-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Threshold and Watchdog Configuration Inputs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5 text-xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900">
            Health Check & Failover Thresholds
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure ping watchdog probes, recovery counts, and trigger conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Ping Target */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Ping Target Host</label>
            <input
              type="text"
              value={targetHost}
              onChange={(e) => setTargetHost(e.target.value)}
              placeholder="8.8.8.8"
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Public DNS or Gateway IP</span>
          </div>

          {/* Check Interval */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Probe Interval</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={checkInterval}
                onChange={(e) => setCheckInterval(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-slate-500 font-medium text-xs">sec</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Heartbeat frequency</span>
          </div>

          {/* Fail Count */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Fail Count Threshold</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={failureThreshold}
                onChange={(e) => setFailureThreshold(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-slate-500 font-medium text-xs">fails</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Consecutive loss before switch</span>
          </div>

          {/* Recovery Count */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Recovery Count</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={recoveryThreshold}
                onChange={(e) => setRecoveryThreshold(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-slate-500 font-medium text-xs">pings</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Consecutive successes to restore</span>
          </div>

          {/* Failover Trigger Mode */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Failover Trigger Mode</label>
            <select
              value={triggerMode}
              onChange={(e) => setTriggerMode(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-slate-800 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Immediate on Fail Count">Immediate on Fail Count</option>
              <option value="Latency Degraded > 300ms">Latency Degraded &gt; 300ms</option>
              <option value="Packet Loss > 20%">Packet Loss &gt; 20%</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">Criteria for next tier switch</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Check Protocol:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-800 border border-slate-200">
              {checkMethod}
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={!hasWritePermission}
            data-write-action="true"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs shadow-xs transition-colors self-stretch sm:self-auto justify-center ${
              hasWritePermission
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{hasWritePermission ? 'Save Failover Thresholds' : 'Save Disabled (Read-Only)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
