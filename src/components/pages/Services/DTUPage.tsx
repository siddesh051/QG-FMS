import React, { useState } from 'react';
import { Cpu, Info } from 'lucide-react';
import {
  ServiceBanner,
  Panel,
  PanelHeaderCheckbox,
  RequiredField,
  bigInputClass,
  bigSelectClass,
  BottomActionBar,
  SavedToast,
} from './ServiceUI';

export const DTUPage: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [bridgeMode, setBridgeMode] = useState<'server' | 'client' | 'udp'>('server');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <ServiceBanner
        breadcrumb="Protocols / Serial Bridge"
        icon={<Cpu className="w-5 h-5" />}
        title="DTU & Legacy Serial Bridge"
        description="Raw serial-to-TCP/UDP tunnel for legacy RS-485/RS-232 field devices that don't speak Modbus."
      />

      <Panel>
        <PanelHeaderCheckbox title="Serial Port" label="DTU Enable" checked={enabled} onChange={setEnabled} />
        <div className="grid grid-cols-4 gap-5">
          <RequiredField label="Port" required>
            <select className={bigSelectClass}>
              <option>RS-485</option>
              <option>RS-232</option>
            </select>
          </RequiredField>
          <RequiredField label="Baud rate" required>
            <input className={bigInputClass} defaultValue="19200" />
          </RequiredField>
          <RequiredField label="Data / Parity" required>
            <input className={bigInputClass} defaultValue="8 / None" />
          </RequiredField>
          <RequiredField label="Stop bits" required>
            <input className={bigInputClass} defaultValue="1" />
          </RequiredField>
        </div>
      </Panel>

      <Panel>
        <div className="text-sm font-bold text-slate-900 mb-4">Bridge Mode</div>
        <div className="flex gap-2 mb-5">
          {(['server', 'client', 'udp'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setBridgeMode(m)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
                bridgeMode === m ? 'bg-[#1e3a8a] text-white' : 'border border-slate-300 text-slate-600'
              }`}
            >
              {m === 'server' ? 'TCP server' : m === 'client' ? 'TCP client' : 'UDP'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5">
          {bridgeMode === 'server' ? (
            <RequiredField label="Listen port" required>
              <input className={bigInputClass} defaultValue="8000" />
            </RequiredField>
          ) : (
            <RequiredField label="Remote IP : port" required>
              <input className={bigInputClass} placeholder="10.20.4.10:9000" />
            </RequiredField>
          )}
          <RequiredField label="Inter-frame timeout (ms)" required>
            <input className={bigInputClass} defaultValue="50" />
          </RequiredField>
        </div>
      </Panel>

      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 mb-6 text-sm text-amber-800">
        <Info size={16} className="mt-0.5 shrink-0" />
        This port is shared with Modbus RTU — only one service can use RS-485 at a time.
      </div>

      <BottomActionBar primaryLabel="Save configuration" onPrimary={handleSave} />
      <SavedToast show={saved} />
    </div>
  );
};