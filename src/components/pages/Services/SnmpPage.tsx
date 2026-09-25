import React, { useState } from 'react';
import { Activity } from 'lucide-react';
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

export const SnmpPage: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [version, setVersion] = useState<'v2c' | 'v3'>('v3');
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok'>('idle');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTest = () => {
    setTestStatus('testing');
    setTimeout(() => setTestStatus('ok'), 1200);
    setTimeout(() => setTestStatus('idle'), 3500);
  };

  return (
    <div>
      <ServiceBanner
        breadcrumb="Protocols / SNMP Monitoring Agent"
        icon={<Activity className="w-5 h-5" />}
        title="SNMP Agent & Network Monitoring"
        description="Read-only SNMP agent exposing gateway health to your site's monitoring system, with trap-based alerting on link and sensor events."
      />

      <Panel>
        <PanelHeaderCheckbox title="Agent Credentials" label="SNMP Enable" checked={enabled} onChange={setEnabled} />

        <div className="mb-5">
          <div className="text-sm font-semibold text-slate-700 mb-2">Version</div>
          <div className="flex gap-2">
            {(['v2c', 'v3'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
                  version === v ? 'bg-[#1e3a8a] text-white' : 'border border-slate-300 text-slate-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {version === 'v2c' ? (
          <RequiredField label="Read community string" required>
            <input type="password" className={bigInputClass} placeholder="community string" />
          </RequiredField>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            <RequiredField label="Username" required>
              <input className={bigInputClass} defaultValue="fluxgw-monitor" />
            </RequiredField>
            <RequiredField label="Auth protocol" required>
              <select className={bigSelectClass} defaultValue="SHA">
                <option>MD5</option>
                <option>SHA</option>
              </select>
            </RequiredField>
            <RequiredField label="Auth password" required>
              <input type="password" className={bigInputClass} placeholder="••••••••" />
            </RequiredField>
            <RequiredField label="Privacy protocol" required>
              <select className={bigSelectClass} defaultValue="AES">
                <option>DES</option>
                <option>AES</option>
              </select>
            </RequiredField>
            <RequiredField label="Privacy password" required>
              <input type="password" className={bigInputClass} placeholder="••••••••" />
            </RequiredField>
          </div>
        )}
      </Panel>

      <Panel>
        <div className="text-sm font-bold text-slate-900 mb-4">Traps & Polling</div>
        <div className="grid grid-cols-2 gap-5 mb-5">
          <RequiredField label="Listen port" required>
            <input className={bigInputClass} defaultValue="161" />
          </RequiredField>
          <RequiredField label="Trap destination IP : port" required>
            <input className={bigInputClass} defaultValue="10.20.4.5:162" />
          </RequiredField>
        </div>
        <div className="text-sm font-semibold text-slate-700 mb-2">Send traps for</div>
        <div className="flex gap-6">
          {[
            { label: 'Link down', checked: true },
            { label: 'Sensor alarm', checked: true },
            { label: 'System reboot', checked: false },
          ].map((t) => (
            <label key={t.label} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked={t.checked} className="w-4 h-4 rounded border-slate-300 text-[#1e3a8a]" />
              {t.label}
            </label>
          ))}
        </div>
      </Panel>

      <BottomActionBar
        secondaryLabel={
          testStatus === 'testing' ? 'Testing…' : testStatus === 'ok' ? 'Agent reachable ✓' : 'Test connection'
        }
        primaryLabel="Save configuration"
        onSecondary={handleTest}
        onPrimary={handleSave}
      />
      <SavedToast show={saved} />
    </div>
  );
};