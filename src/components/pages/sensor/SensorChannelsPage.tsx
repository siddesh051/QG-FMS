import React, { useMemo, useState } from 'react';
import { SensorChannel } from '../../../types/router';
import { CheckCircle2, Gauge, Play, ShieldCheck, WandSparkles, AlertTriangle } from 'lucide-react';

interface SensorChannelsPageProps {
  channels: SensorChannel[];
  onUpdateChannels: (updated: SensorChannel[]) => void;
}

export const SensorChannelsPage: React.FC<SensorChannelsPageProps> = ({
  channels,
  onUpdateChannels,
}) => {
  const [channelList, setChannelList] = useState<SensorChannel[]>(channels);
  const [executing, setExecuting] = useState(false);

  const summary = useMemo(() => {
    const total = channelList.length;
    const healthy = channelList.filter((ch) => ch.status === 'Active').length;
    const alarms = channelList.filter((ch) => ch.status === 'Alarm').length;
    const disabled = channelList.filter((ch) => !ch.enabled).length;
    return { total, healthy, alarms, disabled };
  }, [channelList]);

  const handleRunCommissioning = () => {
    setExecuting(true);
    const updated = channelList.map((ch) => ({
      ...ch,
      status: ch.enabled ? 'Active' : 'Inactive',
    }));
    setChannelList(updated);
    onUpdateChannels(updated);
    setTimeout(() => setExecuting(false), 1200);
  };

  const handleToggleChannel = (id: string) => {
    const updated = channelList.map((ch) =>
      ch.id === id ? { ...ch, enabled: !ch.enabled, status: !ch.enabled ? 'Active' : 'Inactive' } : ch
    );
    setChannelList(updated);
    onUpdateChannels(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
            <span className="text-sky-300 font-semibold">Sensor Test Mode</span>
            <span className="text-sky-400/50">/</span>
            <span className="text-white font-semibold">Commissioning</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <WandSparkles className="w-5 h-5 text-sky-300" />
            Sensor Test Mode & Commissioning
          </h1>
          <p className="text-xs text-sky-100/85 mt-1">
            Verify wiring, signal conditioning, and channel readiness before live operation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunCommissioning}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Play className="w-4 h-4 text-sky-200" />
          {executing ? 'Running checks...' : 'Run commissioning'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="text-[11px] text-slate-500">Total channels</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{summary.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="text-[11px] text-slate-500">Healthy</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{summary.healthy}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="text-[11px] text-slate-500">Alarms</div>
          <div className="mt-2 text-2xl font-bold text-amber-600">{summary.alarms}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="text-[11px] text-slate-500">Disabled</div>
          <div className="mt-2 text-2xl font-bold text-slate-700">{summary.disabled}</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Commissioning checklist</div>
          <p className="text-blue-800 leading-relaxed text-[11px] mt-1">
            Confirm each signal is wired to the correct terminal, the current/voltage range matches the device profile, and the channel passes the configured test pattern before release to service.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="font-bold text-sm text-slate-900">Channel commissioning matrix</div>
          <div className="text-[11px] text-slate-500">SPS range: 1–1000</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">CH</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Range</th>
                <th className="py-2.5 px-3">Sample rate</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {channelList.map((ch) => (
                <tr key={ch.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">{ch.id}</td>
                  <td className="py-2 px-3 font-semibold text-slate-800">{ch.name}</td>
                  <td className="py-2 px-3 text-slate-700">{ch.type}</td>
                  <td className="py-2 px-3 font-mono text-slate-700">
                    {typeof ch.value === 'number' ? `${ch.value} ${ch.unit}` : ch.value}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-700">{ch.sampleRate} SPS</td>
                  <td className="py-2 px-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      ch.status === 'Alarm'
                        ? 'bg-amber-100 text-amber-700'
                        : ch.enabled
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                    }`}>
                      {ch.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      type="button"
                      onClick={() => handleToggleChannel(ch.id)}
                      className="px-2.5 py-1 rounded border border-slate-300 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {ch.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Gauge className="w-4 h-4 text-violet-600" />
          Commissioning notes
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2 font-semibold text-slate-800"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Wired correctly</div>
            <p className="mt-2 leading-relaxed">All channel terminations verified against the engineering diagram.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2 font-semibold text-slate-800"><AlertTriangle className="w-4 h-4 text-amber-600" /> Range validation</div>
            <p className="mt-2 leading-relaxed">Current loop and voltage range checks are within the configured threshold.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2 font-semibold text-slate-800"><ShieldCheck className="w-4 h-4 text-blue-600" /> Ready to service</div>
            <p className="mt-2 leading-relaxed">Device is approved for live monitoring once all channels pass the commissioning test.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
