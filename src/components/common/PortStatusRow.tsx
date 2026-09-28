import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { getPhysicalEthernetPortStatus, type PhysicalEthernetPortStatus } from '../../services/deviceApi';

interface PortStatusRowProps {
  mode?: 'all' | 'lan' | 'wan';
  className?: string;
}

export const PortStatusRow: React.FC<PortStatusRowProps> = ({
  mode = 'all',
  className = '',
}) => {
  const [ports, setPorts] = useState<PhysicalEthernetPortStatus[] | null>(null);
  const [telemetryUnavailable, setTelemetryUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    const refreshPortStatus = async () => {
      try {
        const status = await getPhysicalEthernetPortStatus();
        if (active) {
          setPorts(status);
          setTelemetryUnavailable(false);
        }
      } catch {
        if (active) {
          setPorts(null);
          setTelemetryUnavailable(true);
        }
      }
    };

    refreshPortStatus();
    const intervalId = window.setInterval(refreshPortStatus, 3000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const portNames: PhysicalEthernetPortStatus[] = [
    { id: 'lan1', name: 'LAN1', type: 'LAN', status: 'unavailable' },
    { id: 'lan2', name: 'LAN2', type: 'LAN', status: 'unavailable' },
    { id: 'lan3', name: 'LAN3', type: 'LAN', status: 'unavailable' },
    { id: 'lan4', name: 'LAN4', type: 'LAN', status: 'unavailable' },
    { id: 'wan', name: 'WAN', type: 'WAN', status: 'unavailable' },
  ];
  const portStates = new Map((ports ?? []).map((port) => [port.id, port]));
  const displayPorts = portNames.map((port) => portStates.get(port.id) ?? port);

  const lanPorts = displayPorts.filter((p) => p.type === 'LAN');
  const wanPort = displayPorts.find((p) => p.type === 'WAN')!;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Ports Bezel Container matching physical panel */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 bg-gradient-to-b from-slate-100 to-slate-200/90 rounded-xl border border-slate-300 shadow-inner">
        {/* LAN Ports Group */}
        {(mode === 'all' || mode === 'lan') && (
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {lanPorts.map((port) => (
              <PortItem key={port.id} port={port} />
            ))}
          </div>
        )}

        {/* Separator between LAN cluster and WAN port (only if both are shown) */}
        {mode === 'all' && (
          <div className="h-10 w-px bg-slate-300 mx-1 sm:mx-2" />
        )}

        {/* WAN Port */}
        {(mode === 'all' || mode === 'wan') && wanPort && (
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <PortItem port={wanPort} />
          </div>
        )}

        {/* Status Legend / Tip */}
        <div className="hidden md:flex ml-auto items-center gap-3 text-[11px] text-slate-600 pl-3 border-l border-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Plugged In</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-slate-500">Unplugged</span>
          </div>
          {telemetryUnavailable && <span className="text-[10px] text-amber-700">Live port status unavailable</span>}
        </div>
      </div>
    </div>
  );
};

interface PortItemProps {
  port: PhysicalEthernetPortStatus;
}

const PortItem: React.FC<PortItemProps> = ({ port }) => {
  const isConnected = port.status === 'connected';
  const statusLabel = isConnected
    ? `Plugged In${port.speed ? ` (${port.speed})` : ''}`
    : port.status === 'disconnected'
      ? 'Unplugged'
      : port.status === 'connecting'
        ? 'Connecting'
        : port.status === 'error'
          ? 'Link Error'
          : 'Unavailable';

  return (
    <div className="flex flex-col items-center">
      {/* Square RJ45 Port Socket Housing */}
      <div
        title={`${port.name}: ${statusLabel}`}
        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center select-none group border ${
          isConnected
            ? 'bg-slate-50 border-slate-300 shadow-xs'
            : 'bg-slate-100 border-slate-300/80 shadow-inner opacity-80'
        }`}
      >
        {/* Physical RJ45 Jack Visual representation */}
        {isConnected ? (
          /* CONNECTED: RJ45 Plug inserted with Blue Cable (matching attached image) */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
            {/* RJ45 Modular Connector Plug (White/Clear boot with latch) */}
            <svg
              viewBox="0 0 48 48"
              className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Port Cavity Rim */}
              <rect x="6" y="6" width="36" height="36" rx="3" fill="#1e293b" />
              
              {/* White/Clear Modular Plug Body */}
              <path
                d="M14 10H34V28C34 30.2 32.2 32 30 32H18C15.8 32 14 30.2 14 28V10Z"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              
              {/* Plug Locking Tab / Clip */}
              <path
                d="M20 8H28V14H20V8Z"
                fill="#e2e8f0"
                stroke="#94a3b8"
                strokeWidth="1"
              />
              
              {/* Blue Cat6 Patch Cable exiting port downward/angled */}
              <path
                d="M21 32C21 32 19 38 12 46"
                stroke="#2563eb"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M27 32C27 32 25 38 18 46"
                stroke="#1d4ed8"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Cable Highlight */}
              <path
                d="M23 32C23 32 21 37 15 45"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Creative "Plugged In" Tick Mark Badge */}
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs border border-white">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>

            {/* Green LINK LED Indicator */}
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-300" />
          </div>
        ) : (
          /* UNCONNECTED: Empty RJ45 Socket Opening (matching attached image socket) */
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              viewBox="0 0 48 48"
              className="w-10 h-10 sm:w-11 sm:h-11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Port Cavity Rim */}
              <rect x="7" y="7" width="34" height="34" rx="3" fill="#2d3748" stroke="#1a202c" strokeWidth="1" />
              
              {/* Inner Cavity Depth */}
              <path
                d="M12 12H36V30H30V34H18V30H12V12Z"
                fill="#171923"
              />
              
              {/* 8 Gold Contact Pins inside top of socket */}
              <line x1="15" y1="13" x2="15" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="17.5" y1="13" x2="17.5" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="20" y1="13" x2="20" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22.5" y1="13" x2="22.5" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="25" y1="13" x2="25" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="27.5" y1="13" x2="27.5" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="30" y1="13" x2="30" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="32.5" y1="13" x2="32.5" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            {/* Amber/Dim Off LED */}
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-400" />
          </div>
        )}
      </div>

      {/* Port Label underneath in blue font matching user screenshot */}
      <span className="mt-1 font-bold text-xs text-[#0284c7] tracking-tight">
        {port.name}
      </span>

      {/* Speed / Status subtext */}
      <span className="text-[10px] font-mono text-slate-500 font-medium">
        {isConnected ? (port.speed?.replace(' Mbps', 'M') || 'Plugged In') : statusLabel}
      </span>
    </div>
  );
};
