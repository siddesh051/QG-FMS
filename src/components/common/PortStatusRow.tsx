import React, { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';

export interface PortState {
  id: string;
  name: string;
  type: 'LAN' | 'WAN';
  status: 'connected' | 'disconnected';
  speed: string;
  ip?: string;
  cableType?: string;
}

interface PortStatusRowProps {
  mode?: 'all' | 'lan' | 'wan';
  interactive?: boolean;
  onPortClick?: (port: PortState) => void;
  showLabels?: boolean;
  className?: string;
}

export const PortStatusRow: React.FC<PortStatusRowProps> = ({
  mode = 'all',
  interactive = true,
  onPortClick,
  showLabels = true,
  className = '',
}) => {
  // Default ports: LAN1-LAN4 + WAN
  const [ports, setPorts] = useState<PortState[]>([
    { id: 'lan1', name: 'LAN1', type: 'LAN', status: 'connected', speed: '1000 Mbps', ip: '192.168.1.101', cableType: 'Cat6 STP' },
    { id: 'lan2', name: 'LAN2', type: 'LAN', status: 'connected', speed: '1000 Mbps', ip: '192.168.1.102', cableType: 'Cat6 STP' },
    { id: 'lan3', name: 'LAN3', type: 'LAN', status: 'disconnected', speed: 'No Link', cableType: 'Unplugged' },
    { id: 'lan4', name: 'LAN4', type: 'LAN', status: 'connected', speed: '100 Mbps', ip: '192.168.1.104', cableType: 'Cat5e UTP' },
    { id: 'wan', name: 'WAN', type: 'WAN', status: 'connected', speed: '1000 Mbps', ip: '198.51.100.45', cableType: 'Cat6 STP' },
  ]);

  const togglePort = (id: string) => {
    if (!interactive) return;
    setPorts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'connected' ? 'disconnected' : 'connected';
          return {
            ...p,
            status: nextStatus,
            speed: nextStatus === 'connected' ? (p.id === 'lan4' ? '100 Mbps' : '1000 Mbps') : 'No Link',
          };
        }
        return p;
      })
    );
  };

  const lanPorts = ports.filter((p) => p.type === 'LAN');
  const wanPort = ports.find((p) => p.type === 'WAN')!;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Ports Bezel Container matching physical panel */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 bg-gradient-to-b from-slate-100 to-slate-200/90 rounded-xl border border-slate-300 shadow-inner">
        {/* LAN Ports Group */}
        {(mode === 'all' || mode === 'lan') && (
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {lanPorts.map((port) => (
              <PortItem 
                key={port.id} 
                port={port} 
                interactive={interactive} 
                onClick={() => {
                  togglePort(port.id);
                  onPortClick?.(port);
                }} 
              />
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
            <PortItem 
              port={wanPort} 
              interactive={interactive} 
              onClick={() => {
                togglePort(wanPort.id);
                onPortClick?.(wanPort);
              }} 
            />
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
          {interactive && (
            <span className="text-[10px] text-slate-400 font-sans italic">
              (Click port to toggle)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface PortItemProps {
  port: PortState;
  interactive: boolean;
  onClick: () => void;
}

const PortItem: React.FC<PortItemProps> = ({ port, interactive, onClick }) => {
  const isConnected = port.status === 'connected';

  return (
    <div className="flex flex-col items-center">
      {/* Square RJ45 Port Socket Housing */}
      <button
        type="button"
        onClick={onClick}
        title={`${port.name}: ${isConnected ? `Plugged In (${port.speed})` : 'Unplugged'}${interactive ? ' - Click to toggle' : ''}`}
        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center transition-all cursor-pointer select-none group border ${
          isConnected
            ? 'bg-slate-50 border-slate-300 shadow-xs hover:border-blue-400'
            : 'bg-slate-100 border-slate-300/80 shadow-inner opacity-80 hover:opacity-100 hover:border-slate-400'
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
      </button>

      {/* Port Label underneath in blue font matching user screenshot */}
      <span className="mt-1 font-bold text-xs text-[#0284c7] tracking-tight">
        {port.name}
      </span>

      {/* Speed / Status subtext */}
      <span className="text-[10px] font-mono text-slate-500 font-medium">
        {isConnected ? port.speed.replace(' Mbps', 'M') : 'Down'}
      </span>
    </div>
  );
};
