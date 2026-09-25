import React, { useState } from 'react';
import { GitCommit, Play, RotateCw, CheckCircle2 } from 'lucide-react';

interface HopItem {
  hop: number;
  ip: string;
  host: string;
  rtt1: string;
  rtt2: string;
  rtt3: string;
}

export const TraceroutePage: React.FC = () => {
  const [target, setTarget] = useState('8.8.8.8');
  const [maxHops, setMaxHops] = useState('15');
  const [running, setRunning] = useState(false);
  const [hops, setHops] = useState<HopItem[]>([
    { hop: 1, ip: '10.144.1.1', host: 'gateway.carrier.internal', rtt1: '14.2 ms', rtt2: '13.9 ms', rtt3: '14.1 ms' },
    { hop: 2, ip: '172.18.22.4', host: 'cr01.mumbai.carrier.net', rtt1: '18.5 ms', rtt2: '19.1 ms', rtt3: '18.2 ms' },
    { hop: 3, ip: '182.79.244.1', host: 'core-bb-01.tata.net', rtt1: '21.0 ms', rtt2: '20.8 ms', rtt3: '21.4 ms' },
    { hop: 4, ip: '72.14.215.14', host: 'google-edge.ix.in', rtt1: '23.4 ms', rtt2: '22.9 ms', rtt3: '23.1 ms' },
    { hop: 5, ip: '8.8.8.8', host: 'dns.google', rtt1: '23.8 ms', rtt2: '24.1 ms', rtt3: '23.6 ms' },
  ]);

  const handleRun = () => {
    setRunning(true);
    setHops([]);
    let currentHop = 1;
    const mockHops: HopItem[] = [
      { hop: 1, ip: '10.144.1.1', host: 'gateway.carrier.internal', rtt1: '14.1 ms', rtt2: '13.8 ms', rtt3: '14.0 ms' },
      { hop: 2, ip: '172.18.22.4', host: 'cr01.mumbai.carrier.net', rtt1: '18.2 ms', rtt2: '18.9 ms', rtt3: '18.1 ms' },
      { hop: 3, ip: '182.79.244.1', host: 'core-bb-01.tata.net', rtt1: '20.7 ms', rtt2: '20.6 ms', rtt3: '21.1 ms' },
      { hop: 4, ip: '72.14.215.14', host: 'google-edge.ix.in', rtt1: '23.1 ms', rtt2: '22.7 ms', rtt3: '23.0 ms' },
      { hop: 5, ip: '8.8.8.8', host: 'dns.google', rtt1: '23.5 ms', rtt2: '23.9 ms', rtt3: '23.4 ms' },
    ];

    const interval = setInterval(() => {
      if (currentHop <= mockHops.length) {
        setHops((prev) => [...prev, mockHops[currentHop - 1]]);
        currentHop++;
      } else {
        clearInterval(interval);
        setRunning(false);
      }
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Diagnostics</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Traceroute</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-sky-300" />
          IP Hop Traceroute & Routing Path
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Map routing hops and pinpoint intermediary gateway bottlenecks between the 5G router and target destination.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Host / IP</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Maximum TTL Hops</label>
            <input
              type="number"
              value={maxHops}
              onChange={(e) => setMaxHops(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleRun}
            disabled={running}
            className={`flex items-center gap-1.5 px-4 py-2 rounded text-white font-semibold shadow-xs transition-colors cursor-pointer ${
              running ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {running ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Tracing Hops...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Traceroute</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hops Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
          Routing Hops to {target}
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-4">Hop #</th>
              <th className="py-2.5 px-4">IP Address</th>
              <th className="py-2.5 px-4">Hostname</th>
              <th className="py-2.5 px-4">RTT 1</th>
              <th className="py-2.5 px-4">RTT 2</th>
              <th className="py-2.5 px-4">RTT 3</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {hops.map((h) => (
              <tr key={h.hop} className="hover:bg-slate-50">
                <td className="py-2 px-4 font-bold text-slate-900">#{h.hop}</td>
                <td className="py-2 px-4 text-blue-700 font-semibold">{h.ip}</td>
                <td className="py-2 px-4 text-slate-600 font-sans">{h.host}</td>
                <td className="py-2 px-4 text-slate-700">{h.rtt1}</td>
                <td className="py-2 px-4 text-slate-700">{h.rtt2}</td>
                <td className="py-2 px-4 text-slate-700">{h.rtt3}</td>
              </tr>
            ))}
            {hops.length === 0 && running && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400 font-sans">
                  Probing hop 1...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
