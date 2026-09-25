import React, { useState } from 'react';
import { Radio, Save, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

interface ApnPageProps {
  hasWritePermission?: boolean;
}

export const ApnPage: React.FC<ApnPageProps> = ({ hasWritePermission = true }) => {
  const [apn, setApn] = useState('internet');
  const [username, setUsername] = useState('industrial_gw');
  const [password, setPassword] = useState('••••••••••••');
  const [authType, setAuthType] = useState('Auto');
  const [ipType, setIpType] = useState('IPv4 / IPv6');
  const [savedToast, setSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWritePermission) return;
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Connectivity</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">APN Configuration</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Radio className="w-5 h-5 text-sky-300" />
          Cellular Access Point Name (APN)
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Configure cellular carrier APN settings for 5G NR and LTE packet data network connections.
        </p>
      </div>

      {!hasWritePermission && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-300 rounded-md text-amber-900 text-xs font-medium">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Read-Only Policy Enforced:</strong> You have view-only access to cellular APN configuration. Contact the Administrator to request Read/Write permissions if carrier profile modifications are required.
          </span>
        </div>
      )}

      {savedToast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>APN Configuration saved successfully. Modem re-attaching to PDN context...</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Primary SIM APN Profile</span>
          {!hasWritePermission && (
            <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold border border-amber-200">
              Read-Only Mode
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                APN Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={apn}
                onChange={(e) => setApn(e.target.value)}
                disabled={!hasWritePermission}
                required
                className={`w-full border rounded px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  hasWritePermission ? 'bg-slate-50 border-slate-300' : 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-75'
                }`}
                placeholder="internet"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Carrier packet data gateway APN (e.g. internet, vzwstatic)
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Authentication Method
              </label>
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
                disabled={!hasWritePermission}
                className={`w-full border rounded px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  hasWritePermission ? 'bg-slate-50 border-slate-300 cursor-pointer' : 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-75'
                }`}
              >
                <option value="Auto">Auto (PAP / CHAP)</option>
                <option value="PAP">PAP Only</option>
                <option value="CHAP">CHAP Only</option>
                <option value="None">None (Open Network)</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Handshake authentication protocol
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!hasWritePermission}
                className={`w-full border rounded px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  hasWritePermission ? 'bg-slate-50 border-slate-300' : 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-75'
                }`}
                placeholder="Leave blank if not required"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!hasWritePermission}
                className={`w-full border rounded px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  hasWritePermission ? 'bg-slate-50 border-slate-300' : 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-75'
                }`}
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                IP Stack Type
              </label>
              <select
                value={ipType}
                onChange={(e) => setIpType(e.target.value)}
                disabled={!hasWritePermission}
                className={`w-full border rounded px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  hasWritePermission ? 'bg-slate-50 border-slate-300 cursor-pointer' : 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-75'
                }`}
              >
                <option value="IPv4 / IPv6">IPv4 / IPv6 (Dual Stack)</option>
                <option value="IPv4">IPv4 Only</option>
                <option value="IPv6">IPv6 Only</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Preferred PDP context addressing stack
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={!hasWritePermission}
              className={`flex items-center gap-1.5 px-4 py-2 rounded font-semibold text-xs shadow-xs transition-colors ${
                hasWritePermission
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{hasWritePermission ? 'Save Configuration' : 'Save Disabled (Read-Only)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
