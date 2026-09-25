import React, { useState } from 'react';
import { Layers, RotateCw, CheckCircle2, AlertCircle, Play, Square } from 'lucide-react';
import { RouterService } from '../../../types/router';

interface ServicesPageProps {
  services: RouterService[];
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services: initialServices }) => {
  const [services, setServices] = useState<RouterService[]>(initialServices);
  const [restartingId, setRestartingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleRestart = (id: string, name: string) => {
    setRestartingId(id);
    setTimeout(() => {
      setRestartingId(null);
      setToast(`Service "${name}" restarted successfully (PID refreshed).`);
      setTimeout(() => setToast(null), 3000);
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Diagnostics</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">System Services</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-300" />
          Background System Daemons & Subsystems
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Manage and monitor execution state of critical system daemons, telemetry publishers, and network stack services.
        </p>
      </div>

      {toast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Active Industrial Daemons (systemd)</span>
          <span className="text-xs text-slate-500 font-normal">All 7 Services Running</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-4">Service Daemon</th>
              <th className="py-2.5 px-3">PID</th>
              <th className="py-2.5 px-3">State</th>
              <th className="py-2.5 px-3">CPU</th>
              <th className="py-2.5 px-3">Memory</th>
              <th className="py-2.5 px-3">Uptime</th>
              <th className="py-2.5 px-4 text-right">Operation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((s) => {
              const isRestarting = restartingId === s.id;
              return (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    <div>{s.name}</div>
                    <div className="text-[10px] font-sans font-normal text-slate-400">
                      {s.description}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{s.pid}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">{s.cpuPercent}%</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{s.memoryMb} MB</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{s.uptime}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRestart(s.id, s.name)}
                      disabled={isRestarting}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                    >
                      <RotateCw className={`w-3 h-3 ${isRestarting ? 'animate-spin text-blue-600' : ''}`} />
                      <span>{isRestarting ? 'Restarting...' : 'Restart'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
