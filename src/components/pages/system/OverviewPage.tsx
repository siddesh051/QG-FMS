import React from 'react';
import { 
  NetworkTechnology, 
  WanInterfaceType,
  SubPageId
} from '../../../types/router';
import {
  Radio,
  Globe,
  Server,
  ChevronRight,
  Cpu,
  HardDrive,
  Thermometer,
  Activity,
  Network
} from 'lucide-react';
import { UserAccount } from '../security/UserManagementPage';
import { PortStatusRow } from '../../common/PortStatusRow';
import { InterfaceStatusGrid } from '../../common/InterfaceStatusGrid';

interface OverviewPageProps {
  onNavigate: (page: SubPageId) => void;
  activeWan: WanInterfaceType;
  onChangeActiveWan: (wan: WanInterfaceType) => void;
  networkTech: NetworkTechnology;
  onChangeNetworkTech: (tech: NetworkTechnology) => void;
  currentUser?: UserAccount | null;
  uptime?: string;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  activeWan,
  networkTech,
  uptime = '14d 06h 23m 15s',
}) => {
  // Telemetry metrics
  const cpuUsagePercent = 18;
  const ramUsedGb = 1.42;
  const ramTotalGb = 4.0;
  const ramPercent = Math.round((ramUsedGb / ramTotalGb) * 100);
  
  const flashUsedGb = 8.4;
  const flashTotalGb = 32.0;
  const flashPercent = Math.round((flashUsedGb / flashTotalGb) * 100);

  const deviceTempC = 41.5;
  const deviceTempF = ((deviceTempC * 9) / 5 + 32).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Title & Breadcrumb */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
            <span className="text-sky-300 font-semibold">FluxGateway</span>
            <span className="text-sky-400/50">/</span>
            <span className="text-white font-semibold">Overview</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            System Overview & Hardware Metrics
          </h1>
          <p className="text-xs text-sky-100/85 mt-1 leading-relaxed">
            Real-time operational status, system resource utilization, device temperature, and network routes.
          </p>
        </div>

        {/* Device Name Banner */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/15 backdrop-blur-xs self-start sm:self-center">
          <div className="w-7 h-7 rounded bg-white/15 flex items-center justify-center text-white">
            <Server className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] text-sky-200 uppercase tracking-wider font-semibold leading-none">
              Device Name
            </div>
            <div className="text-xs font-bold text-white font-mono mt-0.5">
              FluxGateway-TR-2005
            </div>
          </div>
        </div>
      </div>

      {/* System Telemetry Metrics: CPU Percentage, Storage (RAM & Flash), Device Temp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: CPU Percentage */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Processor</span>
                <h3 className="text-xs font-bold text-slate-800">CPU Usage</h3>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Optimal
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl font-bold text-slate-900 font-mono">{cpuUsagePercent}%</span>
              <span className="text-[11px] text-slate-500 font-mono">Load: 0.18 / 0.22</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${cpuUsagePercent}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>x86-64 SoC</span>
            <span className="font-mono">4 Cores Active</span>
          </div>
        </div>

        {/* Metric 2: Storage (RAM) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Memory</span>
                <h3 className="text-xs font-bold text-slate-800">Storage (RAM)</h3>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {ramPercent}%
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-lg font-bold text-slate-900 font-mono">{ramUsedGb.toFixed(2)} GB</span>
              <span className="text-[11px] text-slate-500 font-mono">of {ramTotalGb.toFixed(1)} GB</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${ramPercent}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>DDR4 ECC</span>
            <span className="font-mono">{(ramTotalGb - ramUsedGb).toFixed(2)} GB Free</span>
          </div>
        </div>

        {/* Metric 3: Flash Disk Storage */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Disk</span>
                <h3 className="text-xs font-bold text-slate-800">Flash Storage</h3>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {flashPercent}%
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-lg font-bold text-slate-900 font-mono">{flashUsedGb.toFixed(1)} GB</span>
              <span className="text-[11px] text-slate-500 font-mono">of {flashTotalGb.toFixed(0)} GB</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${flashPercent}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>RootFS (Overlay)</span>
            <span className="font-mono">{(flashTotalGb - flashUsedGb).toFixed(1)} GB Free</span>
          </div>
        </div>

        {/* Metric 4: Device Temperature */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Thermal</span>
                <h3 className="text-xs font-bold text-slate-800">Device Temp</h3>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Normal
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl font-bold text-slate-900 font-mono">{deviceTempC}°C</span>
              <span className="text-[11px] text-slate-500 font-mono">({deviceTempF}°F)</span>
            </div>
            {/* Thermal range bar (nominal 0-75C) */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(deviceTempC / 75) * 100}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Fanless Passive Cooling</span>
            <span>Max Threshold: 75°C</span>
          </div>
        </div>
      </div>

      {/* Physical RJ45 Port Status Section (Matching Attached Image) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Physical RJ45 Interface Ports Status (LAN1–LAN4 + WAN)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Link negotiation and cable connection indicator
          </span>
        </div>

        {/* Render Creative Port Status Component with Cable Plugs and Tick Marks */}
        <PortStatusRow interactive={true} />
      </div>

      {/* Connectivity Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: System */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#1e3a8a] border border-slate-200 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">System</span>
                <h3 className="text-sm font-bold text-slate-900">FluxGateway</h3>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Operational
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Device Name</span>
              <span className="font-mono font-semibold text-slate-900">FluxGateway-TR-2005</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">System Uptime</span>
              <span className="font-mono font-semibold text-slate-800">{uptime}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Firmware Build</span>
              <span className="font-semibold text-slate-700">v2.4.1 (Bank A)</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={() => onNavigate('device-info')}
              className="text-[#0284c7] hover:text-[#0369a1] font-semibold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              Device Information <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: WAN Gateway Route */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Default Route</span>
                <h3 className="text-sm font-bold text-slate-900">WAN Gateway</h3>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Connected
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Active Uplink</span>
              <span className="font-bold text-[#1e3a8a]">{activeWan}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Gateway IP</span>
              <span className="font-mono font-semibold text-slate-800">100.84.19.1</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Failover Chain</span>
              <span className="font-medium text-slate-700">5G → Wi-Fi → Ethernet</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={() => onNavigate('wan-failover')}
              className="text-[#0284c7] hover:text-[#0369a1] font-semibold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              Failover Rules <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Cellular Connection */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Cellular Link</span>
                <h3 className="text-sm font-bold text-slate-900">5G Connection</h3>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Mode</span>
              <span className="font-semibold text-[#1e3a8a]">{networkTech}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Band</span>
              <span className="font-mono font-semibold text-slate-800">n78 (3500 MHz)</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Signal (RSSI)</span>
              <span className="font-mono font-bold text-emerald-700">-68 dBm</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={() => onNavigate('cellular')}
              className="text-[#0284c7] hover:text-[#0369a1] font-semibold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              Cellular Settings <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Network Interfaces Summary Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0284c7]" />
            <span>Active Network Interfaces</span>
          </div>
          <span className="text-xs font-normal text-slate-500">
            Routing & Uplinks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4">Interface</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">IP Address</th>
                <th className="py-2.5 px-4">Gateway Route</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-mono font-bold text-[#1e3a8a] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  wwan0
                </td>
                <td className="py-2.5 px-4 text-slate-700">5G Cellular (wwan0)</td>
                <td className="py-2.5 px-4 font-mono text-slate-800">100.84.19.42 / 29</td>
                <td className="py-2.5 px-4 font-mono text-slate-600">100.84.19.1 (Default)</td>
                <td className="py-2.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                    Primary Uplink
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-mono font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  eth0
                </td>
                <td className="py-2.5 px-4 text-slate-700">Gigabit Ethernet</td>
                <td className="py-2.5 px-4 font-mono text-slate-800">192.168.10.150 / 24</td>
                <td className="py-2.5 px-4 font-mono text-slate-600">192.168.10.1</td>
                <td className="py-2.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                    Standby Link
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-mono font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  wlan0
                </td>
                <td className="py-2.5 px-4 text-slate-700">Wi-Fi Client</td>
                <td className="py-2.5 px-4 font-mono text-slate-800">172.16.20.88 / 24</td>
                <td className="py-2.5 px-4 font-mono text-slate-600">172.16.20.1</td>
                <td className="py-2.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                    Connected
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Interface & USB Telemetry Grid (Network + Physical) */}
      <InterfaceStatusGrid />
    </div>
  );
};
