import React from 'react';
import { Cpu, Activity, Gauge, Zap, Thermometer, Database } from 'lucide-react';
import { SensorChannel } from '../../../types/router';

interface SensorAdcPageProps {
  channels: SensorChannel[];
}

export const SensorAdcPage: React.FC<SensorAdcPageProps> = ({ channels }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Diagnostics</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Sensor ADC Diagnostics</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-300" />
          Raw 16-Bit ADC Register Dump & DMA Telemetry
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Direct hardware register views showing raw 16-bit counts (0–65535) and millivolt conversions across all 16 channels.
        </p>
      </div>

      {/* Hardware Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">ADC Die Temperature</span>
          <div className="flex items-center gap-2 mt-1">
            <Thermometer className="w-4 h-4 text-emerald-600" />
            <span className="text-lg font-bold text-slate-900">41.2 °C</span>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
            Nominal Thermal Range
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Sampling Clock Jitter</span>
          <div className="text-lg font-bold text-slate-900 mt-1">&lt; 1.2 ns</div>
          <span className="text-[11px] text-slate-400 mt-1 block">TCXO Master Oscillator</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">DMA Buffer Fill</span>
          <div className="text-lg font-bold text-slate-900 mt-1">24.5%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded" style={{ width: '24.5%' }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">DMA Overruns / Drops</span>
          <div className="text-lg font-bold text-emerald-600 mt-1">0 Overruns</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Zero-copy kernel bus</span>
        </div>
      </div>

      {/* All 16 Channels Raw ADC Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>All 16 Channels Hardware Register State</span>
          <span className="text-xs text-slate-500 font-normal">
            Resolution: 16-Bit SAR ADC (0–65535 LSB)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 font-sans">
                <th className="py-2.5 px-4">Channel</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Raw 16-Bit Count (LSB)</th>
                <th className="py-2.5 px-4">Hex Code</th>
                <th className="py-2.5 px-4">Calibrated Reading</th>
                <th className="py-2.5 px-4">Sample Rate</th>
                <th className="py-2.5 px-4">Decimation Filter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {channels.map((ch) => {
                const hex = (ch.rawAdc || 0).toString(16).toUpperCase().padStart(4, '0');
                return (
                  <tr key={ch.id} className="hover:bg-slate-50">
                    <td className="py-2 px-4 font-bold text-slate-900">{ch.id}</td>
                    <td className="py-2 px-4 font-sans text-slate-600">{ch.type}</td>
                    <td className="py-2 px-4 font-bold text-blue-700">{ch.rawAdc ?? 32768}</td>
                    <td className="py-2 px-4 text-slate-500">0x{hex}</td>
                    <td className="py-2 px-4 text-slate-900 font-semibold">
                      {ch.value} {ch.unit}
                    </td>
                    <td className="py-2 px-4 text-slate-600">{ch.sampleRate} SPS</td>
                    <td className="py-2 px-4 font-sans text-emerald-700">Sinc4 Filtered</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
