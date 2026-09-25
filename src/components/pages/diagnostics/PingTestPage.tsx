import React, { useState } from 'react';
import { Activity, Play, CheckCircle2, RotateCw } from 'lucide-react';

export const PingTestPage: React.FC = () => {
  const [target, setTarget] = useState('1.1.1.1');
  const [count, setCount] = useState('5');
  const [size, setSize] = useState('64');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<string[]>([
    'Ready. Press "Execute Ping Test" to begin ICMP probe.',
  ]);

  const handleRun = () => {
    setRunning(true);
    setResults([`PING ${target} (${target}): ${size} data bytes`]);
    let current = 1;
    const total = parseInt(count) || 5;

    const timer = setInterval(() => {
      const ms = (19 + Math.random() * 6).toFixed(2);
      setResults((prev) => [
        ...prev,
        `${size} bytes from ${target}: icmp_seq=${current++} ttl=57 time=${ms} ms`,
      ]);

      if (current > total) {
        clearInterval(timer);
        setRunning(false);
        setResults((prev) => [
          ...prev,
          `--- ${target} ping statistics ---`,
          `${total} packets transmitted, ${total} packets received, 0.0% packet loss`,
          `round-trip min/avg/max/stddev = 19.12/21.45/24.89/1.82 ms`,
        ]);
      }
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Diagnostics</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Ping Utility</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-300" />
          Network Ping Diagnostic Test
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Send ICMP ECHO_REQUEST packets to measure link availability, latency jitter, and packet drop.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Destination Target</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Packet Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Payload Size (Bytes)</label>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
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
                <span>Transmitting Probes...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Execute Ping Test</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-emerald-400 shadow-md border border-slate-800 min-h-[160px]">
        <div className="text-slate-400 text-[11px] pb-2 border-b border-slate-800 mb-2">
          Diagnostic ICMP Stream Terminal
        </div>
        {results.map((line, i) => (
          <div key={i} className="leading-relaxed whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
