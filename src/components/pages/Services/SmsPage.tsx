import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { ServiceBanner, Panel, PanelHeaderCheckbox, BottomActionBar, SavedToast } from './ServiceUI';

export const SmsPage: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [format, setFormat] = useState<'short' | 'detailed'>('short');
  const [numbers, setNumbers] = useState(['+91 90000 00000', '+91 98765 43210']);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSendTest = () => {
    setTestStatus('sending');
    setTimeout(() => setTestStatus('sent'), 1200);
    setTimeout(() => setTestStatus('idle'), 3500);
  };

  return (
    <div>
      <ServiceBanner
        breadcrumb="Protocols / SMS Command & Alerting"
        icon={<MessageSquare className="w-5 h-5" />}
        title="SMS Gateway & Out-of-Band Control"
        description="Cellular SMS channel for critical alerts and basic remote commands when data connectivity is down."
      />

      <Panel>
        <PanelHeaderCheckbox title="Authorized Numbers" label="SMS Enable" checked={enabled} onChange={setEnabled} />
        <div className="flex flex-wrap gap-2">
          {numbers.map((n) => (
            <span
              key={n}
              className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-full px-4 py-2 text-sm font-mono"
            >
              {n}
              <X size={13} className="text-slate-400 cursor-pointer" onClick={() => setNumbers(numbers.filter((x) => x !== n))} />
            </span>
          ))}
          <button className="flex items-center gap-1.5 border border-dashed border-slate-300 rounded-full px-4 py-2 text-sm text-slate-500 cursor-pointer">
            + Add number
          </button>
        </div>
      </Panel>

      <Panel>
        <div className="text-sm font-bold text-slate-900 mb-4">Command Keywords</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="pb-2 font-semibold">Keyword</th>
              <th className="pb-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {[
              ['STATUS', 'Reply with gateway health summary'],
              ['REBOOT', 'Restart the gateway'],
              ['RECONNECT', 'Reset the cellular interface'],
            ].map(([kw, action]) => (
              <tr key={kw} className="border-t border-slate-100">
                <td className="py-2.5 font-mono">{kw}</td>
                <td className="py-2.5">{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel>
        <div className="text-sm font-bold text-slate-900 mb-4">Alert Triggers & Format</div>
        <div className="text-sm font-semibold text-slate-700 mb-2">Send SMS for</div>
        <div className="flex gap-6 mb-5">
          {[
            { label: 'Critical alarms', checked: true },
            { label: 'Warnings', checked: false },
            { label: 'Link down', checked: true },
          ].map((t) => (
            <label key={t.label} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked={t.checked} className="w-4 h-4 rounded border-slate-300 text-[#1e3a8a]" />
              {t.label}
            </label>
          ))}
        </div>
        <div className="text-sm font-semibold text-slate-700 mb-2">Message format</div>
        <div className="flex gap-2">
          {(['short', 'detailed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize cursor-pointer ${
                format === f ? 'bg-[#1e3a8a] text-white' : 'border border-slate-300 text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </Panel>

      <BottomActionBar
        secondaryLabel={testStatus === 'sending' ? 'Sending…' : testStatus === 'sent' ? 'Test SMS sent ✓' : 'Send test SMS'}
        primaryLabel="Save configuration"
        onSecondary={handleSendTest}
        onPrimary={handleSave}
      />
      <SavedToast show={saved} />
    </div>
  );
};