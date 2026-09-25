import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, CheckCircle2, Lock, Unlock } from 'lucide-react';

interface FactoryResetPageProps {
  userRole?: string;
  hasWritePermission?: boolean;
}

export const FactoryResetPage: React.FC<FactoryResetPageProps> = ({ 
  userRole = 'Administrator',
  hasWritePermission,
}) => {
  const isAuthorized = hasWritePermission !== undefined ? hasWritePermission : userRole === 'Administrator';
  const [confirmed, setConfirmed] = useState(false);
  const [preserveIp, setPreserveIp] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = () => {
    if (!isAuthorized) return;
    setResetting(true);
    setTimeout(() => {
      setResetting(false);
      setDone(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">System / Firmware</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Factory Reset</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-rose-300" />
          Factory Default Recovery & Configuration Wipe
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Erase non-volatile storage and restore the router to pristine factory manufacturing calibration.
        </p>
      </div>

      {done && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Device wiped and reset to factory defaults. Gateway restarting into initial setup wizard...</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-red-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-red-50/70 border-b border-red-100 flex items-center justify-between gap-2 text-red-800 font-bold text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Warning: Irreversible System Erasure</span>
          </div>
          {isAuthorized && userRole !== 'Administrator' && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <Unlock className="w-3 h-3" />
              Write Access Delegated by Admin
            </span>
          )}
        </div>

        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Executing a factory reset restores all networking interfaces, APN credentials, user accounts, firewall rules, and 16-channel sensor calibration maps to factory default states.
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 space-y-1">
            <div className="font-bold text-slate-900">Default Recovery Parameters:</div>
            <div>• Default LAN IP: <strong>192.168.1.1 / 255.255.255.0</strong></div>
            <div>• Default Username: <strong>admin</strong></div>
            <div>• Default Password: <strong>admin123</strong></div>
            <div>• Default Mode: <strong>Cellular 5G NR Standalone (SA)</strong></div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preserveIp}
                onChange={(e) => setPreserveIp(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-800">
                Preserve Management IP (192.168.1.1) to avoid losing connectivity
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="rounded border-red-300 text-red-600 focus:ring-red-500 h-4 w-4"
              />
              <span className="font-bold text-red-700">
                I understand that all custom configuration, user accounts, and local sensor logs will be permanently erased.
              </span>
            </label>
          </div>

          {!isAuthorized && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
              <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">RBAC Policy Restriction:</span>
                <p className="mt-0.5 text-amber-700">
                  You are logged in as <strong>{userRole}</strong>. Factory reset and partition erasure are currently in <strong>Read-Only</strong> mode. The Administrator can grant Read/Write permission for this setting from the User Management RBAC Matrix.
                </p>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleReset}
              disabled={!isAuthorized || !confirmed || resetting}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {!isAuthorized ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Read-Only Policy Restricted</span>
                </>
              ) : (
                <>
                  <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                  <span>{resetting ? 'Formatting Partition...' : 'Perform Factory Reset'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
