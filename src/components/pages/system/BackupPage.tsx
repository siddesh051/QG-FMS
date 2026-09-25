import React, { useState } from 'react';
import { Download, Save, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';

export const BackupPage: React.FC = () => {
  const [encrypt, setEncrypt] = useState(true);
  const [password, setPassword] = useState('FluxBackup#2026');
  const [includeCerts, setIncludeCerts] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setToast(true);

      // Trigger dummy download
      const content = JSON.stringify({
        device: 'FluxGateway 5G',
        serial: 'FG5G-2026-X89104',
        timestamp: new Date().toISOString(),
        encrypted: encrypt,
        includedCerts: includeCerts,
        config: 'AES-256-GCM-PAYLOAD-BLOB',
      }, null, 2);

      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fluxgateway-backup-${new Date().toISOString().slice(0, 10)}.cfg`;
      a.click();

      setTimeout(() => setToast(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">System / Firmware</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Backup Configuration</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Download className="w-5 h-5 text-sky-300" />
          Export System Configuration Archive
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Create an encrypted snapshot of router networking, WAN failover, cellular APN, protocols, and security settings.
        </p>
      </div>

      {toast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configuration archive compiled and downloaded successfully.</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
          Archive Export Parameters
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={encrypt}
                onChange={(e) => setEncrypt(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-800">
                Encrypt Backup with AES-256 (Recommended for production)
              </span>
            </label>

            {encrypt && (
              <div className="pl-6 pt-1 max-w-sm">
                <label className="block text-slate-700 font-semibold mb-1">
                  Encryption Passphrase
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeCerts}
                onChange={(e) => setIncludeCerts(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-800">
                Include TLS / mTLS Certificates and Private Keys in Archive
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Compiling Archive...' : 'Download Backup Archive (.cfg)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
