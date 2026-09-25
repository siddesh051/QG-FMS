import React, { useState } from 'react';
import { FileText, Download, Filter, Search, RefreshCw, Trash2 } from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  facility: 'kernel' | 'cellular' | 'sensor-adc' | 'mqtt' | 'auth';
  message: string;
}

export const SystemLogsPage: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [facilityFilter, setFacilityFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '10:42:30.104', level: 'INFO', facility: 'sensor-adc', message: 'DMA double buffer swap completed: 16384 samples transferred in 1.2ms without overrun.' },
    { id: '2', time: '10:42:28.912', level: 'INFO', facility: 'mqtt', message: 'Published 16-channel telemetry frame to topic "fluxgateway/sensors" (payload: 1048 bytes, QoS: 1).' },
    { id: '3', time: '10:42:25.402', level: 'INFO', facility: 'cellular', message: 'Modem RSRP: -92 dBm, SINR: 18 dB. Carrier aggregation n78 primary component carrier active.' },
    { id: '4', time: '10:42:15.820', level: 'WARN', facility: 'sensor-adc', message: 'CH04 Hydraulic Return Current Loop fluctuating: 12.8 mA approaching user high alarm setpoint (13.5 mA).' },
    { id: '5', time: '10:41:50.118', level: 'INFO', facility: 'auth', message: 'Admin user session refreshed from 192.168.1.104 (TLS session key renegotiated).' },
    { id: '6', time: '10:40:12.305', level: 'INFO', facility: 'kernel', message: 'WireGuard tunnel wg0: handshake with 198.51.100.1:51820 succeeded.' },
    { id: '7', time: '10:38:00.001', level: 'INFO', facility: 'mqtt', message: 'MQTT broker keepalive PINGREQ sent, PINGRESP received in 18ms.' },
    { id: '8', time: '10:35:14.219', level: 'ERROR', facility: 'cellular', message: 'Transient carrier block error detected on subcarrier 412; autonomous MAC retransmission recovered.' },
    { id: '9', time: '10:30:00.102', level: 'INFO', facility: 'kernel', message: 'System watchdog heartbeat ack. Free memory: 7.2 GB / 8.0 GB.' },
  ]);

  const filteredLogs = logs.filter((log) => {
    if (levelFilter !== 'ALL' && log.level !== levelFilter) return false;
    if (facilityFilter !== 'ALL' && log.facility !== facilityFilter) return false;
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    const text = logs.map((l) => `[${l.time}] [${l.level}] [${l.facility}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluxgateway-syslog-${Date.now()}.log`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
            <span className="text-sky-300 font-semibold">Diagnostics</span>
            <span className="text-sky-400/50">/</span>
            <span className="text-white font-semibold">System Logs</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-300" />
            System Events & Kernel Diagnostic Journal
          </h1>
          <p className="text-xs text-sky-100/85 mt-0.5">
            Real-time event logging, facility filters, and kernel diagnostics.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto backdrop-blur-xs"
        >
          <Download className="w-3.5 h-3.5 text-sky-200" />
          <span>Export Syslog (.log)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Log Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium cursor-pointer"
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">INFO Only</option>
              <option value="WARN">WARN Only</option>
              <option value="ERROR">ERROR Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Facility:</span>
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium cursor-pointer"
            >
              <option value="ALL">All Subsystems</option>
              <option value="sensor-adc">sensor-adc</option>
              <option value="cellular">cellular (wwan)</option>
              <option value="mqtt">mqtt telemetry</option>
              <option value="kernel">kernel / os</option>
              <option value="auth">auth / sessions</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search journal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 w-48 sm:w-64"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-4">Timestamp</th>
              <th className="py-2.5 px-3">Level</th>
              <th className="py-2.5 px-3">Facility</th>
              <th className="py-2.5 px-4">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filteredLogs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="py-2 px-4 text-slate-500 whitespace-nowrap">{l.time}</td>
                <td className="py-2 px-3">
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      l.level === 'INFO'
                        ? 'bg-blue-50 text-blue-700'
                        : l.level === 'WARN'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {l.level}
                  </span>
                </td>
                <td className="py-2 px-3 font-semibold text-slate-700">{l.facility}</td>
                <td className="py-2 px-4 text-slate-800 font-sans text-xs">{l.message}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400 font-sans">
                  No log entries matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
