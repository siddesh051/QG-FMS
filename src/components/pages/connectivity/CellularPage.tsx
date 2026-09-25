import React, { useState } from 'react';
import { CellularDiagnostics, NetworkTechnology } from '../../../types/router';
import { INITIAL_CELLULAR_DIAG } from '../../../data/initialData';
import { Radio, Signal, CheckCircle2, RefreshCw, Cpu, Shield, ArrowUpRight, Sliders } from 'lucide-react';

interface CellularPageProps {
  initialData?: CellularDiagnostics;
  networkTech?: NetworkTechnology;
  onChangeNetworkTech?: (tech: NetworkTechnology) => void;
  onSave?: (data: CellularDiagnostics) => void;
  hasWritePermission?: boolean;
}

export const CellularPage: React.FC<CellularPageProps> = ({ 
  initialData = INITIAL_CELLULAR_DIAG,
  networkTech,
  onChangeNetworkTech,
  hasWritePermission = true
}) => {
  const [diag, setDiag] = useState<CellularDiagnostics>(initialData || INITIAL_CELLULAR_DIAG);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const activeNetwork = networkTech || diag?.network || '5G NR SA';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Small random fluctuation to show live diagnostics
      setDiag((prev) => {
        const base = prev || INITIAL_CELLULAR_DIAG;
        return {
          ...base,
          rssi: -68 + Math.floor(Math.random() * 3 - 1),
          rsrp: -92 + Math.floor(Math.random() * 3 - 1),
          sinr: 18 + Math.floor(Math.random() * 2 - 1),
        };
      });
      setIsRefreshing(false);
    }, 600);
  };

  const handleTechChange = (newTech: NetworkTechnology) => {
    if (!hasWritePermission) return;
    if (onChangeNetworkTech) {
      onChangeNetworkTech(newTech);
    }
    setDiag((prev) => ({
      ...(prev || INITIAL_CELLULAR_DIAG),
      network: newTech,
      band: newTech.includes('5G') ? 'n78' : 'B3/B7',
    }));
    setSavedNotification(`Cellular modem radio mode set to "${newTech}". RF band re-attached.`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
            <span className="text-sky-300 font-semibold">Connectivity</span>
            <span className="text-sky-400/50">/</span>
            <span className="text-white font-semibold">Cellular Status</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-300" />
            Cellular Modem Status
          </h1>
          <p className="text-xs text-sky-100/85 mt-0.5">
            Single-SIM industrial cellular telemetry for the FluxGateway modem, signal quality, and network registration.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto backdrop-blur-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-300' : 'text-sky-200'}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {savedNotification && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Main Status Banners */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Cellular Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base font-bold text-slate-900">Connected</span>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium mt-2 inline-block">
            Data Session Active
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">SIM Card Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-base font-bold text-slate-900">{diag?.simStatus || 'Ready'}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Single SIM slot (one physical SIM supported)</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Network Technology</span>
          <div className="text-base font-bold text-blue-700 mt-1">{activeNetwork}</div>
          <span className="text-[11px] text-slate-500 mt-2 block">Band: <strong className="text-slate-800">{diag?.band || 'n78'}</strong> (3500 MHz)</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Signal Quality (SINR)</span>
          <div className="text-base font-bold text-slate-900 mt-1">{diag?.sinr ?? 18} dB</div>
          <div className="w-full bg-slate-100 h-1.5 rounded mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded" style={{ width: '82%' }} />
          </div>
        </div>
      </div>

      {/* Mode Selection Control */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Radio Mode Preference & Carrier Registration
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select 5G NR Standalone (SA) or LTE Cat 19 fallback radio configuration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['5G NR SA', '4G LTE-A'] as NetworkTechnology[]).map((tech) => (
            <button
              key={tech}
              disabled={!hasWritePermission}
              data-write-action="true"
              onClick={() => handleTechChange(tech)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                !hasWritePermission
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                  : activeNetwork === tech
                  ? 'bg-blue-600 text-white shadow-2xs cursor-pointer'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Radio Parameters Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Modem & Radio Frequency Metrics</span>
          <span className="text-xs font-mono font-normal text-slate-500">IMEI: {diag.imei}</span>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Cellular Modem Model:</span>
            <span className="font-mono font-semibold text-slate-800">{diag.modemModel}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Device IMEI:</span>
            <span className="font-mono font-semibold text-slate-800">{diag.imei}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Network Registration:</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {diag.network}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Operating Frequency Band:</span>
            <span className="font-mono font-semibold text-slate-800">{diag.band} (Sub-6GHz)</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">ARFCN (Channel):</span>
            <span className="font-mono font-semibold text-slate-800">{diag.arfcn}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Physical Cell ID (PCI):</span>
            <span className="font-mono font-semibold text-slate-800">{diag.pci}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Received Signal Strength (RSSI):</span>
            <span className="font-mono font-semibold text-slate-800">{diag.rssi} dBm</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Reference Signal Received Power (RSRP):</span>
            <span className="font-mono font-semibold text-slate-800">{diag.rsrp} dBm</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Reference Signal Received Quality (RSRQ):</span>
            <span className="font-mono font-semibold text-slate-800">{diag.rsrq} dB</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Signal to Interference-plus-Noise Ratio (SINR):</span>
            <span className="font-mono font-semibold text-slate-800">{diag.sinr} dB</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">PLMN (MCC / MNC):</span>
            <span className="font-mono font-semibold text-slate-800">{diag.mcc} / {diag.mnc}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Antenna Diversity / MIMO:</span>
            <span className="font-mono font-semibold text-slate-800">4x4 MIMO DL / 2x2 UL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
