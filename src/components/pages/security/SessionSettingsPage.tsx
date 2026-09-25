import React, { useState } from 'react';
import { Lock, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

export const SessionSettingsPage: React.FC = () => {
  const [timeoutMin, setTimeoutMin] = useState('15');
  const [enforceHttps, setEnforceHttps] = useState(true);
  const [maxSessions, setMaxSessions] = useState('2');
  const [lockoutAttempts, setLockoutAttempts] = useState('5');
  const [lockoutDuration, setLockoutDuration] = useState('30');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Security</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Session Settings</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Lock className="w-5 h-5 text-sky-300" />
          HTTP/HTTPS Web Console Security & Sessions
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Configure inactivity auto-logout timers, TLS enforcement, and brute-force mitigation lockouts.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Session and lockout security parameters applied to web server daemon.</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
          Session Lifespan & Security Constraints
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Inactivity Auto-Logout Timeout
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={timeoutMin}
                  onChange={(e) => setTimeoutMin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-slate-500 font-medium shrink-0">minutes</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Session automatically invalidates after idle duration
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Max Concurrent Admin Sessions
              </label>
              <select
                value={maxSessions}
                onChange={(e) => setMaxSessions(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="1">1 (Strict Single Administrator)</option>
                <option value="2">2 Concurrent Sessions</option>
                <option value="5">5 Concurrent Sessions</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Failed Login Attempts Lockout
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={lockoutAttempts}
                  onChange={(e) => setLockoutAttempts(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-slate-500 font-medium shrink-0">attempts</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Account Lockout Duration
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={lockoutDuration}
                  onChange={(e) => setLockoutDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-slate-500 font-medium shrink-0">minutes</span>
              </div>
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enforceHttps}
                  onChange={(e) => setEnforceHttps(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="font-semibold text-slate-800">
                  Enforce HTTPS Redirection with HSTS (Port 80 automatically redirects to TLS 443)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Session Security</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
