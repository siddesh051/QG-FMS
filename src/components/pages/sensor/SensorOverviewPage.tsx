import React from 'react';
import { SensorChannel, SubPageId } from '../../../types/router';
import { Sliders, Cpu, Activity, AlertCircle, ArrowRight, Gauge, CheckCircle2 } from 'lucide-react';

interface SensorOverviewPageProps {
  channels: SensorChannel[];
  onNavigate: (page: SubPageId) => void;
}

export const SensorOverviewPage: React.FC<SensorOverviewPageProps> = ({
  channels,
  onNavigate,
}) => {
  const current420mA = channels.filter((c) => c.type === '4–20 mA');
  const voltage010V = channels.filter((c) => c.type === '0–10 V');
  const binaryInputs = channels.filter((c) => c.type === 'Binary');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
            <span className="text-sky-300 font-semibold">Sensor Config</span>
            <span className="text-sky-400/50">/</span>
            <span className="text-white font-semibold">Channel Overview</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-300" />
            16-Channel Sensor Bus Architecture
          </h1>
          <p className="text-xs text-sky-100/85 mt-1">
            High-speed analog-to-digital converter interface with 16 dedicated hardware acquisition channels.
          </p>
        </div>

        <button
          onClick={() => onNavigate('sensor-channels')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto backdrop-blur-xs"
        >
          <span>Edit All Channels</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-200" />
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Group 1 (CH01–CH08)</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              8 Channels
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1">4–20 mA Current Loops</div>
          <p className="text-xs text-slate-500 mt-1">
            Industrial two-wire transmitter standard with fault-detection below 3.6 mA.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Group 2 (CH09–CH12)</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              4 Channels
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1">0–10 V Voltage Inputs</div>
          <p className="text-xs text-slate-500 mt-1">
            High-impedance differential voltage inputs with 16-bit sigma-delta resolution.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Group 3 (CH13–CH16)</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              4 Channels
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1">Opto-Isolated Binary Inputs</div>
          <p className="text-xs text-slate-500 mt-1">
            Dry contact / 24V PNP digital inputs with hardware debouncing up to 1,000 SPS.
          </p>
        </div>
      </div>

      {/* Group 1: 4-20 mA Grid */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between font-bold text-sm text-slate-900">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-sky-600" />
            <span>4–20 mA Current Loop Channels (8 Channels)</span>
          </div>
          <span className="text-xs font-normal text-slate-600">Sample Rate: up to 1,000 SPS</span>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {current420mA.map((ch) => (
            <div
              key={ch.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded-md hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-blue-700">{ch.id}</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                </span>
              </div>
              <div className="font-semibold text-slate-800 text-xs truncate" title={ch.name}>
                {ch.name}
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-base font-bold text-slate-900">
                  {ch.value} {ch.unit}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {ch.sampleRate} SPS
                </span>
              </div>
              {/* Visual meter bar (4-20mA scale) */}
              <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, (((Number(ch.value) - 4) / 16) * 100))
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group 2 & 3 Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 0–10 V Channels */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 bg-indigo-50/70 border-b border-indigo-100 font-bold text-sm text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>0–10 V Voltage Inputs (4 Channels)</span>
            </div>
            <span className="text-xs font-normal text-slate-500">CH09–CH12</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voltage010V.map((ch) => (
              <div
                key={ch.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-md hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-indigo-700">{ch.id}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">● Active</span>
                </div>
                <div className="font-semibold text-slate-800 text-xs truncate">{ch.name}</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-mono text-base font-bold text-slate-900">
                    {ch.value} {ch.unit}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{ch.sampleRate} SPS</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${(Number(ch.value) / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Binary Channels */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 bg-emerald-50/70 border-b border-emerald-100 font-bold text-sm text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Binary / Digital Inputs (4 Channels)</span>
            </div>
            <span className="text-xs font-normal text-slate-500">CH13–CH16</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {binaryInputs.map((ch) => {
              const isON = ch.value === 'ON';
              return (
                <div
                  key={ch.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-md hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-emerald-800">{ch.id}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">● Active</span>
                  </div>
                  <div className="font-semibold text-slate-800 text-xs truncate">{ch.name}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold text-xs font-mono ${
                        isON
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-600 border border-slate-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isON ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                      {ch.value}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{ch.sampleRate} SPS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
