import React, { useState } from 'react';
import { Cpu, Save, CheckCircle2, Sliders, Zap } from 'lucide-react';

export const SensorSamplingPage: React.FC = () => {
  const [adcClock, setAdcClock] = useState('48 MHz');
  const [bufferSize, setBufferSize] = useState('2048 samples');
  const [dmaMode, setDmaMode] = useState('Circular Ring Buffer (Zero Copy)');
  const [filterType, setFilterType] = useState('Digital Sinc4 + 50/60Hz Rejection');
  const [burstTrigger, setBurstTrigger] = useState('Continuous');
  const [globalLoggingRate, setGlobalLoggingRate] = useState('100');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Sensor Config</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Sampling Configuration</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-300" />
          ADC Subsystem & Sampling Pipeline
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Low-level analog converter clocking, DMA circular memory buffers, and digital decimation filters.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>ADC hardware parameters updated. Decimation filter synced across all 16 channels.</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
          Global Hardware ADC Settings
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Internal Master ADC Clock
              </label>
              <select
                value={adcClock}
                onChange={(e) => setAdcClock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="48 MHz">48 MHz (Standard Ultra-Low Noise)</option>
                <option value="24 MHz">24 MHz (Low Power Mode)</option>
                <option value="96 MHz">96 MHz (High Speed Turbo)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                DMA Buffer Size (Per Channel)
              </label>
              <select
                value={bufferSize}
                onChange={(e) => setBufferSize(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="1024 samples">1024 Samples (Low Latency)</option>
                <option value="2048 samples">2048 Samples (Balanced)</option>
                <option value="4096 samples">4096 Samples (High Throughput)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                DMA Transfer Architecture
              </label>
              <select
                value={dmaMode}
                onChange={(e) => setDmaMode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Circular Ring Buffer (Zero Copy)">
                  Circular Ring Buffer (Zero Copy Linux Kernel DMA)
                </option>
                <option value="Ping-Pong Double Buffering">
                  Ping-Pong Double Buffering
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Decimation Filter Profile
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Digital Sinc4 + 50/60Hz Rejection">
                  Digital Sinc4 + 50/60Hz Powerline Hum Rejection
                </option>
                <option value="Fast Step Sinc3">Fast Step Sinc3 (Transient Response)</option>
                <option value="Raw Unfiltered Wideband">Raw Unfiltered Wideband</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Sampling Trigger Mode
              </label>
              <select
                value={burstTrigger}
                onChange={(e) => setBurstTrigger(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Continuous">Continuous Real-time Streaming</option>
                <option value="Threshold Alarm Triggered">
                  Threshold Alarm Triggered (Burst Buffer)
                </option>
                <option value="Hardware External Sync">
                  Hardware External Sync Pulse (DI-13)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Default Ingestion Sample Rate (SPS)
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={globalLoggingRate}
                onChange={(e) => setGlobalLoggingRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Up to 1,000 samples/sec per channel
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Sampling Parameters</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
