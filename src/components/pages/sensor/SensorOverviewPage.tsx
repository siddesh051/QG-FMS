import React, { useEffect, useState } from 'react';
import { SensorChannel } from '../../../types/router';
import { Sliders, Save, CheckCircle2, Edit3, RotateCcw, Info, Gauge } from 'lucide-react';

interface SensorOverviewPageProps {
  channels: SensorChannel[];
  onUpdateChannels?: (updated: SensorChannel[]) => void;
}

export const SensorOverviewPage: React.FC<SensorOverviewPageProps> = ({
  channels,
  onUpdateChannels,
}) => {
  const [channelList, setChannelList] = useState<SensorChannel[]>(channels);
  const [selectedChannel, setSelectedChannel] = useState<SensorChannel | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    setChannelList(channels);
  }, [channels]);

  const handleUpdateField = <K extends keyof SensorChannel>(field: K, value: SensorChannel[K]) => {
    if (!selectedChannel) return;
    setSelectedChannel({ ...selectedChannel, [field]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel) return;

    const updated = channelList.map((ch) => (ch.id === selectedChannel.id ? selectedChannel : ch));
    setChannelList(updated);
    onUpdateChannels?.(updated);
    setStatusMessage('Configuration saved successfully.');
    setSelectedChannel(null);
  };

  const handleReset = () => {
    setChannelList(channels);
    onUpdateChannels?.(channels);
    setStatusMessage('Configuration reset to the current saved configuration.');
    setSelectedChannel(null);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
              <span className="text-sky-300 font-semibold">Sensor Configuration</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-sky-300" />
              Sensor Configuration
            </h1>
            <p className="text-xs text-sky-100/85 mt-1">
              Configure and manage the 16 physical sensor input channels.
            </p>
          </div>
          <div className="text-xs text-sky-100/90 bg-white/8 px-3 py-2 rounded-lg border border-white/10">
            <div className="font-semibold text-white">FluxGateway-TR-2005</div>
            <div className="mt-1">Device ID: FG-TR-2005-16A</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] text-sky-50/90">
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-sky-200">Gateway name</div>
            <div className="mt-1 font-semibold text-white">FluxGateway-01</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-sky-200">Device ID</div>
            <div className="mt-1 font-semibold text-white">FG-TR-2005-16A</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-sky-200">Configuration status</div>
            <div className="mt-1 font-semibold text-emerald-300">Configured</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-sky-200">Last update</div>
            <div className="mt-1 font-semibold text-white">2026-09-25 09:32 UTC</div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="font-bold text-sm text-slate-900">Channel Overview</div>
          <div className="text-[11px] text-slate-500">Gateway user: field.engineer</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Enabled</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {channelList.map((ch) => (
                <tr key={ch.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">{ch.id}</td>
                  <td className="py-2 px-3 text-slate-700">{ch.type}</td>
                  <td className="py-2 px-3 font-semibold text-slate-800">{ch.name}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${ch.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {ch.enabled ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="inline-flex rounded-full bg-sky-100 text-sky-700 px-2 py-0.5 text-[10px] font-semibold">
                      Configured
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedChannel({ ...ch })}
                      className="inline-flex items-center gap-1 border border-slate-300 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-300 w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Gauge className="w-4 h-4 text-sky-600" />
                Configure {selectedChannel.id}
              </div>
              <button type="button" onClick={() => setSelectedChannel(null)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Channel number</label>
                  <input value={selectedChannel.id} readOnly className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-slate-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Channel type</label>
                  <input value={selectedChannel.type} readOnly className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-slate-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Channel name</label>
                  <input value={selectedChannel.name} onChange={(e) => handleUpdateField('name', e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Description</label>
                  <input value={selectedChannel.description} onChange={(e) => handleUpdateField('description', e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" />
                </div>
                <div className="md:col-span-2">
                  <label className="inline-flex items-center gap-2 text-slate-700 font-semibold">
                    <input type="checkbox" checked={selectedChannel.enabled} onChange={(e) => handleUpdateField('enabled', e.target.checked)} className="h-4 w-4 text-blue-600" />
                    Enable / Disable
                  </label>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <div className="font-semibold text-slate-800 mb-2">Signal Processing</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Sample rate</label>
                    <input type="number" min="1" max="1000" value={selectedChannel.sampleRate} onChange={(e) => handleUpdateField('sampleRate', Number(e.target.value) || 1)} className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Filter type</label>
                    <select value="Average" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800">
                      <option>None</option>
                      <option>Average</option>
                      <option>Low-pass</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <div className="font-semibold text-slate-800 mb-2">Engineering Conversion</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Input range</label>
                    <input value={selectedChannel.type === '4–20 mA' ? '4–20 mA' : selectedChannel.type === '0–10 V' ? '0–10 V' : 'Binary'} readOnly className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Engineering unit</label>
                    <input value={selectedChannel.unit} onChange={(e) => handleUpdateField('unit', e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <div className="font-semibold text-slate-800 mb-2">Alarm thresholds</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Low threshold</label>
                    <input type="number" value={selectedChannel.minAlarm ?? 0} onChange={(e) => handleUpdateField('minAlarm', Number(e.target.value))} className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">High threshold</label>
                    <input type="number" value={selectedChannel.maxAlarm ?? 0} onChange={(e) => handleUpdateField('maxAlarm', Number(e.target.value))} className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedChannel(null)} className="border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
                <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Current Saved Configuration
                </button>
                <button type="submit" className="inline-flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#16306c] text-white rounded-lg px-3 py-2 text-xs font-semibold">
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Configuration save flow</div>
          <p className="text-blue-800 leading-relaxed text-[11px] mt-1">
            React → FastAPI REST API → Configuration service → Persistent configuration store → HAL/device service → Hardware/firmware where applicable.
          </p>
        </div>
      </div>
    </div>
  );
};
