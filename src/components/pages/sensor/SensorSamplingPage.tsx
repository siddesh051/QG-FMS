import React, { useState } from 'react';
import { Activity, CheckCircle2, Cpu, HeartPulse, Radio, ShieldCheck, Wifi } from 'lucide-react';

const tabs = ['status', 'signals', 'system', 'connectivity'] as const;
type HealthTab = (typeof tabs)[number];

export const SensorSamplingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HealthTab>('status');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['Analog inputs', '12 healthy / 4 active', 'Signal conditioning stable'],
              ['Digital inputs', '4 online', 'Thresholds within tolerance'],
              ['Alert state', 'No critical alarms', 'Monitoring steady'],
            ].map(([title, value, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-slate-800 mb-2">{title}</div>
                <div className="text-sm font-bold text-slate-900">{value}</div>
                <div className="mt-2 text-[11px] text-slate-600">{detail}</div>
              </div>
            ))}
          </div>
        );
      case 'signals':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['CH01 Pressure', 'Healthy', '14.82 mA', 'Within range'],
                ['CH09 Voltage', 'Healthy', '6.42 V', 'Stable'],
                ['CH13 Digital', 'Healthy', 'ON', 'Interlock OK'],
                ['CH16 Digital', 'Healthy', 'OFF', 'Idle state'],
              ].map(([name, state, reading, note]) => (
                <div key={name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-slate-800">{name}</div>
                    <span className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold">{state}</span>
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-900">{reading}</div>
                  <div className="mt-1 text-[11px] text-slate-600">{note}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['ADC', 'Healthy', '16-bit conversion stable'],
              ['CPU load', '42%', 'Nominal operating load'],
              ['Memory', '8.2 GB used', 'Available margin remains'],
              ['Storage', '31%', 'No capacity issue'],
            ].map(([title, state, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-slate-800 mb-2">{title}</div>
                <div className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 font-semibold text-[10px]">{state}</div>
                <div className="mt-2 text-xs text-slate-700">{detail}</div>
              </div>
            ))}
          </div>
        );
      case 'connectivity':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Cellular modem', 'Connected', 'Network registered to LTE'],
              ['Ethernet', 'Connected', 'Link up at 1 Gbps'],
              ['Wi-Fi', 'Standby', 'Available interface ready'],
              ['Time sync', 'Synchronized', 'GNSS / RTC valid'],
            ].map(([title, state, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-slate-800 mb-2">{title}</div>
                <div className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 font-semibold text-[10px]">{state}</div>
                <div className="mt-2 text-xs text-slate-700">{detail}</div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Health & Status</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-sky-300" />
          Health & Status
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Read-only operational view of the sensor acquisition system, device health, and connectivity state.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200 bg-slate-50">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-3 text-[11px] font-semibold ${
                activeTab === tab ? 'bg-white text-[#1e3a8a] border-b-2 border-[#1e3a8a]' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'status' ? 'Overall Status' : tab === 'signals' ? 'Signal Health' : tab === 'system' ? 'System Health' : 'Connectivity'}
            </button>
          ))}
        </div>
        <div className="p-4">{renderTabContent()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ['Sensor bus', 'Online', Activity],
          ['Signal integrity', 'Nominal', CheckCircle2],
          ['Gateway compute', 'Healthy', Cpu],
          ['Network link', 'Stable', Wifi],
        ].map(([label, state, Icon]) => (
          <div key={label} className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-500">{label}</div>
              <Icon className="w-4 h-4 text-sky-600" />
            </div>
            <div className="mt-2 text-lg font-bold text-slate-900">{state}</div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Current system status</div>
          <p className="text-emerald-800 leading-relaxed text-[11px] mt-1">
            All sensor channels are reporting within a normal operating envelope and the gateway is in a healthy service state.
          </p>
        </div>
      </div>
    </div>
  );
};
