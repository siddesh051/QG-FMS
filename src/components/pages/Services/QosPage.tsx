import React, { useState } from 'react';
import { Gauge, GripVertical } from 'lucide-react';
import {
  ServiceBanner,
  Panel,
  PanelHeaderCheckbox,
  RequiredField,
  bigInputClass,
  BottomActionBar,
  SavedToast,
} from './ServiceUI';

const defaultOrder = [
  'Alerts and MQTT publish',
  'Portal and API access',
  'Firmware and backup transfers',
  'Everything else',
];

export const QosPage: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [scope, setScope] = useState<'all' | 'cellular'>('cellular');
  const [order, setOrder] = useState(defaultOrder);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...order];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setOrder(next);
    setDragIndex(null);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <ServiceBanner
        breadcrumb="Protocols / Traffic Prioritization"
        icon={<Gauge className="w-5 h-5" />}
        title="QoS & Bandwidth Management"
        description="Prioritizes alert and configuration traffic over bulk transfers on constrained cellular bandwidth."
      />

      <Panel>
        <PanelHeaderCheckbox title="Scope" label="QoS Enable" checked={enabled} onChange={setEnabled} />
        <div className="flex gap-2">
          {(['all', 'cellular'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
                scope === s ? 'bg-[#1e3a8a] text-white' : 'border border-slate-300 text-slate-600'
              }`}
            >
              {s === 'all' ? 'All interfaces' : 'Cellular only'}
            </button>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="text-sm font-bold text-slate-900 mb-4">Priority order (highest first) — drag to reorder</div>
        <div className="space-y-2">
          {order.map((label, i) => (
            <div
              key={label}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-3 bg-white cursor-move"
            >
              <GripVertical size={16} className="text-slate-300" />
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i === 0 ? 'bg-blue-50 text-[#1e3a8a]' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-slate-900">{label}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="text-sm font-bold text-slate-900 mb-4">Bandwidth Limits</div>
        <div className="grid grid-cols-2 gap-5">
          <RequiredField label="Bandwidth cap (kbps)">
            <input className={bigInputClass} defaultValue="2000" />
          </RequiredField>
          <RequiredField label="Guaranteed minimum, top priority (kbps)">
            <input className={bigInputClass} defaultValue="128" />
          </RequiredField>
        </div>
      </Panel>

      <BottomActionBar primaryLabel="Save configuration" onPrimary={handleSave} />
      <SavedToast show={saved} />
    </div>
  );
};