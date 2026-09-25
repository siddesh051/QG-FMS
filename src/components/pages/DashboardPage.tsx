import React, { useState, useEffect } from 'react';
import { 
  SensorChannel, 
  NetworkTechnology, 
  WanInterfaceType,
  SubPageId
} from '../../types/router';
import {
  Radio,
  Wifi,
  Activity,
  Server,
  Clock,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Sliders,
  TrendingUp,
  Signal
} from 'lucide-react';

interface DashboardPageProps {
  channels: SensorChannel[];
  onNavigate: (page: SubPageId) => void;
  activeWan: WanInterfaceType;
  onChangeActiveWan: (wan: WanInterfaceType) => void;
  networkTech: NetworkTechnology;
  onChangeNetworkTech: (tech: NetworkTechnology) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  channels,
  onNavigate,
  activeWan,
  onChangeActiveWan,
  networkTech,
  onChangeNetworkTech,
}) => {
  const [liveTelemetry, setLiveTelemetry] = useState<SensorChannel[]>(channels);
  const [isLivePaused, setIsLivePaused] = useState<boolean>(false);
  const [lastUpdateSeconds, setLastUpdateSeconds] = useState<number>(3);
  const [lastDataSentSeconds, setLastDataSentSeconds] = useState<number>(10);
  const [filterType, setFilterType] = useState<string>('all');

  // Sync with prop channels if they change externally
  useEffect(() => {
    setLiveTelemetry(channels);
  }, [channels]);

  // Live simulation ticker for the 16 sensor channels
  useEffect(() => {
    if (isLivePaused) return;

    const interval = setInterval(() => {
      setLiveTelemetry((prev) =>
        prev.map((ch) => {
          if (!ch.enabled) return ch;

          if (ch.type === '4–20 mA') {
            const currentNum = typeof ch.value === 'number' ? ch.value : parseFloat(ch.value as string);
            const delta = (Math.random() - 0.5) * 0.16;
            const newVal = Math.min(19.9, Math.max(4.01, +(currentNum + delta).toFixed(2)));
            // ADC counts scale roughly 4096-32767
            const newAdc = Math.round(4096 + ((newVal - 4) / 16) * 28671);
            return {
              ...ch,
              value: newVal,
              rawAdc: newAdc,
            };
          } else if (ch.type === '0–10 V') {
            const currentNum = typeof ch.value === 'number' ? ch.value : parseFloat(ch.value as string);
            const delta = (Math.random() - 0.5) * 0.12;
            const newVal = Math.min(9.95, Math.max(0.05, +(currentNum + delta).toFixed(2)));
            const newAdc = Math.round((newVal / 10) * 32767);
            return {
              ...ch,
              value: newVal,
              rawAdc: newAdc,
            };
          } else {
            // Binary channels: occasionally toggle (low probability)
            if (Math.random() < 0.08) {
              const toggled = ch.value === 'ON' ? 'OFF' : 'ON';
              return {
                ...ch,
                value: toggled,
                rawAdc: toggled === 'ON' ? 4095 : 0,
              };
            }
            return ch;
          }
        })
      );
      setLastUpdateSeconds(0);
    }, 1500);

    return () => clearInterval(interval);
  }, [isLivePaused]);

  // Uptime and last data sent counter
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdateSeconds((s) => s + 1);
      setLastDataSentSeconds((s) => (s >= 30 ? 1 : s + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const wanOptions: { type: WanInterfaceType; label: string; icon: React.ReactNode }[] = [
    { type: '5G', label: '5G NR', icon: <Radio className="w-3.5 h-3.5" /> },
    { type: 'LTE', label: 'LTE Cat 19', icon: <Signal className="w-3.5 h-3.5" /> },
    { type: 'Wi-Fi', label: 'Wi-Fi 6', icon: <Wifi className="w-3.5 h-3.5" /> },
    { type: 'Ethernet', label: 'Ethernet (1G)', icon: <Server className="w-3.5 h-3.5" /> },
    { type: 'Fiber', label: 'Fiber SFP+', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  const filteredChannels = liveTelemetry.filter((c) => {
    if (filterType === 'all') return true;
    if (filterType === '4-20mA') return c.type === '4–20 mA';
    if (filterType === '0-10V') return c.type === '0–10 V';
    if (filterType === 'binary') return c.type === 'Binary';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Breadcrumb & Page Title */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
            <span className="text-sky-300 font-semibold">FluxGateway</span>
            <span className="text-sky-400/50">/</span>
            <span className="text-white font-semibold">Overview</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Industrial Router Dashboard
          </h1>
          <p className="text-xs text-sky-100/85 mt-0.5">
            Real-time telemetry, network interfaces, sensor buses, and system diagnostics.
          </p>
        </div>

        {/* Live streaming status pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsLivePaused(!isLivePaused)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isLivePaused
                ? 'bg-amber-400/20 text-amber-200 border-amber-300/40 hover:bg-amber-400/30'
                : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30'
            }`}
          >
            {isLivePaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Resume Live Telemetry</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>Live Feed Active ({lastUpdateSeconds}s ago)</span>
                <Pause className="w-3 h-3 text-emerald-300 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Cellular Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Cellular Status</span>
                <h3 className="text-sm font-bold text-slate-900">5G Status</h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Connected
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Network:</span>
              <div className="flex items-center gap-1">
                <select
                  value={networkTech}
                  onChange={(e) => onChangeNetworkTech(e.target.value as NetworkTechnology)}
                  className="bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="5G NR SA">5G NR SA</option>
                  <option value="5G NR NSA">5G NR NSA</option>
                  <option value="LTE Cat 19">LTE Cat 19</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Band:</span>
              <span className="font-mono font-semibold text-slate-800">
                {networkTech === 'LTE Cat 19' ? 'B3 / B7 / B20' : 'n78'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">RSSI:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 rounded bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded" style={{ width: '85%' }} />
                </div>
                <span className="font-mono font-semibold text-slate-800">-68 dBm</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Modem: QUECTEL RM520NGL</span>
            <button
              onClick={() => onNavigate('cellular')}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5 cursor-pointer"
            >
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Active WAN */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">WAN Uplink</span>
                <h3 className="text-sm font-bold text-slate-900">Active Connection</h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>ACTIVE: {activeWan}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Select Uplink Mode / Failover Test:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {wanOptions.map((opt) => {
                const isActive = activeWan === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => onChangeActiveWan(opt.type)}
                    className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-700 font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Failover Engine: <strong className="text-slate-700">Healthy</strong></span>
            <button
              onClick={() => onNavigate('wan-failover')}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5 cursor-pointer"
            >
              Priority Rules <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: System Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Gateway Health</span>
                <h3 className="text-sm font-bold text-slate-900">System Status</h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              x86-64 Industrial SoC
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> System Uptime:
              </span>
              <span className="font-mono font-semibold text-slate-800">
                12 Days 08 Hours 31 Minutes
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <Send className="w-3.5 h-3.5 text-slate-400" /> Last Data Sent:
              </span>
              <span className="font-mono font-semibold text-emerald-700">
                {lastDataSentSeconds} seconds ago
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-slate-400" /> CPU / RAM Load:
              </span>
              <span className="font-mono font-semibold text-slate-800">
                14% CPU | 1.42 GB / 4 GB
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">RTC Status: Battery Sync OK</span>
            <button
              onClick={() => onNavigate('device-info')}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5 cursor-pointer"
            >
              Device Specs <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SENSOR LIVE DATA - 16 CHANNELS SECTION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Header / Action Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                Live Sensor Telemetry
              </h2>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                16 Channels Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dedicated industrial ADC input bus: Channels 1–8 (4–20 mA), Channels 9–12 (0–10 V), Channels 13–16 (Binary inputs).
            </p>
          </div>

          {/* Filter Pills and Action */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-md text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All 16
              </button>
              <button
                onClick={() => setFilterType('4-20mA')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  filterType === '4-20mA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4–20mA (8)
              </button>
              <button
                onClick={() => setFilterType('0-10V')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  filterType === '0-10V' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                0–10V (4)
              </button>
              <button
                onClick={() => setFilterType('binary')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  filterType === 'binary' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Binary (4)
              </button>
            </div>

            <button
              onClick={() => onNavigate('sensor-channels')}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <span>Configure Channels</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* The 16 Channels Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/90 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Telemetry Value</th>
                <th className="py-2.5 px-3">Raw ADC</th>
                <th className="py-2.5 px-3">Sample Rate</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredChannels.map((channel) => {
                const isBinary = channel.type === 'Binary';
                const isON = channel.value === 'ON';

                return (
                  <tr
                    key={channel.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    {/* Channel ID */}
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {channel.id}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {channel.name}
                    </td>

                    {/* Type Badge */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          channel.type === '4–20 mA'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : channel.type === '0–10 V'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {channel.type}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-2.5 px-3 font-mono">
                      {isBinary ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold text-xs ${
                            isON
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isON ? 'bg-emerald-600' : 'bg-slate-400'
                            }`}
                          />
                          {channel.value}
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-1 font-bold text-slate-900 text-sm">
                          <span>{channel.value}</span>
                          <span className="text-xs text-slate-500 font-sans font-normal">
                            {channel.unit}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Raw ADC */}
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                      {channel.rawAdc.toLocaleString()}
                    </td>

                    {/* Sample Rate */}
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {channel.sampleRate} SPS
                    </td>

                    {/* Description */}
                    <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate" title={channel.description}>
                      {channel.description}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>Sampling Engine: <strong>DMA Ring Buffer</strong></span>
            <span>•</span>
            <span>Bus Calibration: <strong>Factory Calibrated (±0.05% FS)</strong></span>
          </div>
          <button
            onClick={() => onNavigate('diag-adc')}
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            Open ADC Raw Diagnostics <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
