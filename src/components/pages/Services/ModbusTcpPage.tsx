import React, { useState } from 'react';
import { Network, Save, CheckCircle2 } from 'lucide-react';

export const ModbusTcpPage: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('0.0.0.0 (All Interfaces)');
  const [port, setPort] = useState('502');
  const [unitId, setUnitId] = useState('1');
  const [timeout, setTimeoutVal] = useState('1000');
  const [maxConnections, setMaxConnections] = useState('8');
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
          <span className="text-sky-300 font-semibold">Protocols</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Modbus TCP</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Network className="w-5 h-5 text-sky-300" />
          Modbus TCP/IP Server Gateway
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Embedded Modbus TCP slave service exposing the 16 sensor channels on Holding Registers 40001–40016.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Modbus TCP server listener updated and listening on port {port}.</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
          Modbus TCP Server Parameters
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Listen IP Address
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                0.0.0.0 binds to LAN, Wi-Fi, and VPN tunnels
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                TCP Port <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Standard IANA port: 502</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Unit ID (Slave Address) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="255"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Response Timeout (ms) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={timeout}
                onChange={(e) => setTimeoutVal(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Max Concurrent Client Sockets
              </label>
              <input
                type="number"
                value={maxConnections}
                onChange={(e) => setMaxConnections(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Modbus TCP Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Register Mapping Table Preview */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
          Sensor Channel to Modbus Register Mapping
        </div>
        <div className="p-4 text-xs text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-800 block mb-1">40001 – 40008 (Holding Registers)</strong>
              <span className="text-slate-500">Channels CH01–CH08 (4–20 mA converted to 16-bit unsigned / IEEE 754 float)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-800 block mb-1">40009 – 40012 (Holding Registers)</strong>
              <span className="text-slate-500">Channels CH09–CH12 (0–10 V voltage telemetry in millivolts)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 md:col-span-2">
              <strong className="text-slate-800 block mb-1">10001 – 10004 (Discrete Inputs)</strong>
              <span className="text-slate-500">Channels CH13–CH16 (Digital Binary Input states: 0=OFF, 1=ON)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
