import React, { useState } from 'react';
import { Activity, Play, Square, CheckCircle2, RotateCw } from 'lucide-react';

export const IcmpPingPage: React.FC = () => {
  const [host, setHost] = useState('8.8.8.8');
  const [iface, setIface] = useState('5G');
  const [interval, setIntervalVal] = useState('1');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'PING 8.8.8.8 (8.8.8.8) via wwan0 (5G NR): 56 data bytes',
    '64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=24.2 ms',
    '64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=23.8 ms',
    '64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=25.1 ms',
    '64 bytes from 8.8.8.8: icmp_seq=4 ttl=118 time=24.0 ms',
  ]);

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
      setLogs([`PING ${host} (${host}) via ${iface}: 56 data bytes`]);
      let seq = 1;
      const t = setInterval(() => {
        const latency = (22 + Math.random() * 5).toFixed(1);
        setLogs((prev) => [
          ...prev,
          `64 bytes from ${host}: icmp_seq=${seq++} ttl=118 time=${latency} ms`,
        ]);
        if (seq > 6) {
          clearInterval(t);
          setIsRunning(false);
          setLogs((prev) => [
            ...prev,
            `--- ${host} ping statistics ---`,
            `6 packets transmitted, 6 received, 0% packet loss, time 5002ms`,
            `rtt min/avg/max = 22.1/24.3/26.9 ms`,
          ]);
        }
      }, 800);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Diagnostics</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">ICMP Watchdog</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-300" />
          ICMP Watchdog Probe
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Test end-to-end IP network connectivity and round-trip latency across cellular, Ethernet, and Wi-Fi WAN links.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 text-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Host / IP</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Outbound Interface</label>
            <select
              value={iface}
              onChange={(e) => setIface(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="5G">5G NR (wwan0)</option>
              <option value="Ethernet">Ethernet WAN (eth0)</option>
              <option value="Wi-Fi">Wi-Fi Station (wlan0)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Interval (seconds)</label>
            <input
              type="number"
              value={interval}
              onChange={(e) => setIntervalVal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => setLogs([])}
            className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
          >
            Clear Terminal
          </button>
          <button
            onClick={handleToggle}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-4 py-2 rounded text-white font-semibold shadow-xs transition-colors cursor-pointer ${
              isRunning ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Pinging...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start ICMP Ping</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-emerald-400 shadow-md overflow-x-auto min-h-[160px] border border-slate-800">
        <div className="text-slate-400 text-[11px] pb-2 border-b border-slate-800 mb-2 flex items-center justify-between">
          <span>ICMP Terminal Output (RAW SOCKET)</span>
          <span>Buffer: {logs.length} entries</span>
        </div>
        {logs.map((line, i) => (
          <div key={i} className="leading-relaxed whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
