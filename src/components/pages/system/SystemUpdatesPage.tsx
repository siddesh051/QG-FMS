import React, { useEffect, useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  DownloadCloud,
  Server,
  Clock,
  FileText,
  Package,
  Lock,
  X,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { getSystemInformation, checkForUpdates, installUpdate } from '../../../services/systemApi';
import { SystemInfo, UpdateCheckResult } from '../../../types/router';

interface SystemUpdatesPageProps {
  hasWritePermission?: boolean;
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return iso;
  }
}

export const SystemUpdatesPage: React.FC<SystemUpdatesPageProps> = ({ hasWritePermission = true }) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const [checkResult, setCheckResult] = useState<UpdateCheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installResult, setInstallResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingInfo(true);
      setInfoError(null);
      try {
        const info = await getSystemInformation();
        if (!cancelled) setSystemInfo(info);
      } catch {
        if (!cancelled) setInfoError('Unable to load system information. Device may be unreachable.');
      } finally {
        if (!cancelled) setLoadingInfo(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCheckForUpdates = async () => {
    setChecking(true);
    setInstallResult(null);
    try {
      const result = await checkForUpdates();
      setCheckResult(result);
    } catch {
      setCheckResult({
        status: 'error',
        currentVersion: systemInfo?.firmwareVersion || 'Unknown',
        lastChecked: new Date().toISOString(),
        errorMessage: 'Unexpected error while checking for updates. Please try again.',
      });
    } finally {
      setChecking(false);
    }
  };

  const handleConfirmInstall = async () => {
    setShowConfirm(false);
    setInstalling(true);
    try {
      const result = await installUpdate();
      setInstallResult(result);
    } catch {
      setInstallResult({ success: false, message: 'Update installation failed to start. Please try again.' });
    } finally {
      setInstalling(false);
    }
  };

  const hasUpdate = checkResult?.status === 'update-available' && checkResult.update;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Title & Breadcrumb */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">System & Maintenance</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">System Updates</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-sky-300" />
              System Updates
            </h1>
            <p className="text-xs text-sky-100/85 mt-1">
              Check installed firmware/software versions and fetch update availability from the FluxGateway update server.
            </p>
          </div>

          <button
            onClick={handleCheckForUpdates}
            disabled={checking || loadingInfo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 self-start sm:self-auto backdrop-blur-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-200 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking for updates...' : 'Check for Updates'}</span>
          </button>
        </div>
      </div>

      {!hasWritePermission && (
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-xs">
          <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Read-Only Policy Enforced:</span>
            <p className="mt-0.5 text-amber-700">
              Your role can view update status, but installing updates requires Read/Write permission for System Updates.
            </p>
          </div>
        </div>
      )}

      {/* Current System Information */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900">Current System Information</h2>
            <p className="text-xs text-slate-500">Installed firmware, software build and device model</p>
          </div>
        </div>

        {infoError ? (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{infoError}</span>
          </div>
        ) : loadingInfo ? (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading system information...
          </div>
        ) : systemInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Current Firmware Version</span>
              <span className="font-mono font-bold text-blue-700 text-sm mt-0.5 block">{systemInfo.firmwareVersion}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Current Software Version</span>
              <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{systemInfo.softwareVersion}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Build Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{systemInfo.buildNumber}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Release Date</span>
              <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{systemInfo.releaseDate}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Device Model</span>
              <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{systemInfo.deviceModel}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Update Status</span>
              <span className="font-semibold text-sm mt-0.5 block">
                {!checkResult && <span className="text-slate-500">Not checked yet</span>}
                {checkResult?.status === 'up-to-date' && <span className="text-emerald-700">Up to date</span>}
                {checkResult?.status === 'update-available' && <span className="text-blue-700">Update available</span>}
                {checkResult?.status === 'error' && <span className="text-red-700">Check failed</span>}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 sm:col-span-2">
              <span className="text-slate-500 font-medium block">Last Update Check</span>
              <span className="font-mono font-semibold text-slate-800 text-xs mt-0.5 block">
                {checkResult ? formatTimestamp(checkResult.lastChecked) : 'Never checked'}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Check result: up to date / error */}
      {checkResult?.status === 'up-to-date' && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <div>
            <div className="font-bold text-sm">Your system is up to date</div>
            <p className="text-xs text-emerald-700 mt-0.5">
              No newer firmware/software release was found on the update server as of {formatTimestamp(checkResult.lastChecked)}.
            </p>
          </div>
        </div>
      )}

      {checkResult?.status === 'error' && (
        <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
          <div>
            <div className="font-bold text-sm">Unable to check for updates</div>
            <p className="text-xs text-red-700 mt-0.5">
              {checkResult.errorMessage || 'The update server could not be reached.'}
            </p>
          </div>
        </div>
      )}

      {/* Update Available UI */}
      {hasUpdate && checkResult.update && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 bg-blue-50 border-b border-blue-200 font-bold text-sm text-blue-900 flex items-center gap-2">
            <DownloadCloud className="w-4 h-4 text-blue-700" />
            Update Available
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 font-medium block">Current Version</span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{checkResult.currentVersion}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-blue-600 font-medium block">New Version</span>
                <span className="font-mono font-bold text-blue-800 text-sm mt-0.5 block">{checkResult.update.latestVersion}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 font-medium block flex items-center gap-1"><Clock className="w-3 h-3" /> Release Date</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{checkResult.update.releaseDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 font-medium block flex items-center gap-1"><Package className="w-3 h-3" /> Package Size</span>
                <span className="font-mono font-semibold text-slate-800 text-sm mt-0.5 block">{checkResult.update.packageSizeMb} MB</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-600 font-semibold text-xs flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Release Notes / Changelog
              </span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {checkResult.update.releaseNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {installResult && (
              <div
                className={`flex items-center gap-2 p-3 rounded-md text-xs border ${
                  installResult.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                {installResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{installResult.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Updates are never installed automatically. Confirm below to proceed.
              </span>
              {hasWritePermission ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={installing}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {installing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Starting Installation...</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>Install Update</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Read-only — install requires write access
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && hasUpdate && checkResult.update && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">Confirm Update Installation</h3>
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs text-slate-600">
              <p>
                You are about to install <strong className="text-slate-900 font-mono">{checkResult.update.latestVersion}</strong>, replacing
                <strong className="text-slate-900 font-mono"> {checkResult.currentVersion}</strong>.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                The device may <strong>reboot</strong> during installation and <strong>temporarily lose network connectivity</strong>. Do not
                power off the device while the update is in progress.
              </div>
            </div>
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmInstall}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
              >
                Confirm & Install
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modularity note for future dual-bank support */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-xs text-slate-500">
        This update flow is built on a modular service layer (<code className="font-mono text-slate-700">services/systemApi.ts</code>) so it
        can later be extended to support dual-bank (A/B) firmware partitions without changing this page.
      </div>
    </div>
  );
};

export default SystemUpdatesPage;
