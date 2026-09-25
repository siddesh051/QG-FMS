import React, { useState } from 'react';
import { SensorChannel, SensorType } from '../../../types/router';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  Edit3, 
  AlertCircle, 
  Info,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface SensorChannelsPageProps {
  channels: SensorChannel[];
  onUpdateChannels: (updated: SensorChannel[]) => void;
}

export const SensorChannelsPage: React.FC<SensorChannelsPageProps> = ({
  channels,
  onUpdateChannels,
}) => {
  const [channelList, setChannelList] = useState<SensorChannel[]>(channels);
  const [editingChannel, setEditingChannel] = useState<SensorChannel | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  const handleToggleEnable = (id: string) => {
    const updated = channelList.map((ch) =>
      ch.id === id ? { ...ch, enabled: !ch.enabled } : ch
    );
    setChannelList(updated);
    onUpdateChannels(updated);
  };

  const handleTypeChange = (id: string, newType: SensorType) => {
    const updated = channelList.map((ch) => {
      if (ch.id === id) {
        let unit = ch.unit;
        let val = ch.value;
        if (newType === '4–20 mA') {
          unit = 'mA';
          val = 12.0;
        } else if (newType === '0–10 V') {
          unit = 'V';
          val = 5.0;
        } else {
          unit = 'State';
          val = 'OFF';
        }
        return {
          ...ch,
          type: newType,
          unit,
          value: val,
        };
      }
      return ch;
    });
    setChannelList(updated);
    onUpdateChannels(updated);
  };

  const handleSampleRateChange = (id: string, rate: number) => {
    // Bound to 1-1000 SPS
    const bounded = Math.min(1000, Math.max(1, rate));
    const updated = channelList.map((ch) =>
      ch.id === id ? { ...ch, sampleRate: bounded } : ch
    );
    setChannelList(updated);
    onUpdateChannels(updated);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChannel) return;
    const updated = channelList.map((ch) =>
      ch.id === editingChannel.id ? editingChannel : ch
    );
    setChannelList(updated);
    onUpdateChannels(updated);
    setEditingChannel(null);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleSaveAll = () => {
    onUpdateChannels(channelList);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
            <span className="text-sky-300 font-semibold">Sensor Config</span>
            <span className="text-sky-400/50">/</span>
            <span className="text-white font-semibold">Channel Configuration</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-300" />
            16-Channel Hardware Calibration & Parameters
          </h1>
          <p className="text-xs text-sky-100/85 mt-0.5">
            Configure channel operational modes, voltage/current scaling, and individual sampling frequencies.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto backdrop-blur-xs"
        >
          <Save className="w-4 h-4 text-sky-200" />
          <span>Save Channel Map</span>
        </button>
      </div>

      {/* Prominent Spec Banner for Sample Rate Requirement */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">
            Hardware Acquisition Constraint: Maximum sample rate: 1,000 samples/sec/channel
          </div>
          <p className="text-blue-800 leading-relaxed text-[11px]">
            The FluxGateway DMA pipeline allows independent sample rate scaling from 1 to 1000 SPS per channel across all 16 physical terminals simultaneously (8 × 4–20 mA, 4 × 0–10 V, 4 × Binary).
          </p>
        </div>
      </div>

      {savedToast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Channel calibration & sample rates updated in EEPROM.</span>
        </div>
      )}

      {/* Full 16-Channel Interactive Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>All 16 Channel Profiles</span>
          <span className="text-xs text-slate-500 font-normal">
            CH01–CH08 (4–20mA) | CH09–CH12 (0–10V) | CH13–CH16 (Binary)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Active</th>
                <th className="py-2.5 px-3">CH</th>
                <th className="py-2.5 px-3">Channel Name</th>
                <th className="py-2.5 px-3">Sensor Type</th>
                <th className="py-2.5 px-3">Sample Rate (1-1000 SPS)</th>
                <th className="py-2.5 px-3">Current Value</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {channelList.map((ch) => (
                <tr
                  key={ch.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    !ch.enabled ? 'opacity-50 bg-slate-50/50' : ''
                  }`}
                >
                  {/* Enable Toggle */}
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={ch.enabled}
                      onChange={() => handleToggleEnable(ch.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                  </td>

                  {/* Channel Number */}
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {ch.id}
                    </span>
                  </td>

                  {/* Channel Name */}
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    {ch.name}
                  </td>

                  {/* Sensor Type Dropdown */}
                  <td className="py-2 px-3">
                    <select
                      value={ch.type}
                      onChange={(e) => handleTypeChange(ch.id, e.target.value as SensorType)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-800 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="4–20 mA">4–20 mA</option>
                      <option value="0–10 V">0–10 V</option>
                      <option value="Binary">Binary</option>
                    </select>
                  </td>

                  {/* Sample Rate Input */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={ch.sampleRate}
                        onChange={(e) => handleSampleRateChange(ch.id, parseInt(e.target.value) || 1)}
                        className="w-20 bg-white border border-slate-300 rounded px-2 py-1 font-mono text-slate-800 focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                      <span className="text-[10px] text-slate-400 font-medium">SPS</span>
                    </div>
                  </td>

                  {/* Current Value */}
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">
                    {ch.value}
                  </td>

                  {/* Unit */}
                  <td className="py-2 px-3 font-mono text-slate-500">
                    {ch.unit}
                  </td>

                  {/* Description */}
                  <td className="py-2 px-3 text-slate-500 max-w-xs truncate" title={ch.description}>
                    {ch.description}
                  </td>

                  {/* Action Button */}
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => setEditingChannel({ ...ch })}
                      className="p-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                      title="Edit Channel Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Channel Modal Drawer */}
      {editingChannel && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-sm text-slate-900">
                  Edit Channel {editingChannel.id}
                </span>
              </div>
              <button
                onClick={() => setEditingChannel(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Channel Identifier
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingChannel.id}
                    className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Channel Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingChannel.name}
                    onChange={(e) =>
                      setEditingChannel({ ...editingChannel, name: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Sensor Type
                  </label>
                  <select
                    value={editingChannel.type}
                    onChange={(e) =>
                      setEditingChannel({
                        ...editingChannel,
                        type: e.target.value as SensorType,
                        unit:
                          e.target.value === '4–20 mA'
                            ? 'mA'
                            : e.target.value === '0–10 V'
                            ? 'V'
                            : 'State',
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="4–20 mA">4–20 mA</option>
                    <option value="0–10 V">0–10 V</option>
                    <option value="Binary">Binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Sample Rate (1-1000 SPS)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={editingChannel.sampleRate}
                    onChange={(e) =>
                      setEditingChannel({
                        ...editingChannel,
                        sampleRate: Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)),
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Measurement Unit
                  </label>
                  <input
                    type="text"
                    value={editingChannel.unit}
                    onChange={(e) =>
                      setEditingChannel({ ...editingChannel, unit: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingChannel.enabled}
                      onChange={(e) =>
                        setEditingChannel({ ...editingChannel, enabled: e.target.checked })
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="font-semibold text-slate-800">
                      Channel Acquisition Enabled
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Description / Process Tag
                </label>
                <textarea
                  rows={2}
                  value={editingChannel.description}
                  onChange={(e) =>
                    setEditingChannel({ ...editingChannel, description: e.target.value })
                  }
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingChannel(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Update Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
