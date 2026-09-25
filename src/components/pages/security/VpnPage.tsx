import React, { useState } from 'react';
import { Shield, Save, CheckCircle2, Lock, Key, ArrowDownUp, RefreshCw } from 'lucide-react';

export interface VpnPageProps {
  hasWritePermission?: boolean;
}

export const VpnPage: React.FC<VpnPageProps> = ({ hasWritePermission = true }) => {
  const [vpnType, setVpnType] = useState<'WireGuard' | 'OpenVPN' | 'IPsec'>('WireGuard');
  const [enabled, setEnabled] = useState(true);
  const [serverEndpoint, setServerEndpoint] = useState('vpn.company-scada.net:51820');
  const [clientIp, setClientIp] = useState('10.8.0.25/24');
  const [publicKey, setPublicKey] = useState('0n9bF+x7U4H587pQxL1c6Vn+K7eH9f1yP4r92bV7g=');
  const [privateKey, setPrivateKey] = useState('••••••••••••••••••••••••••••••••••••••••••••••••');
  const [allowedIps, setAllowedIps] = useState('10.8.0.0/16, 172.16.0.0/12');
  const [keepalive, setKeepalive] = useState('25');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWritePermission) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Security</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Virtual Private Network (VPN)</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Shield className="w-5 h-5 text-sky-300" />
          Encrypted VPN Tunnel Client
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          High-performance cryptographic overlay network connecting industrial field assets to corporate SCADA backbones.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>VPN Tunnel configuration saved. wg0 cryptographic interface synchronized.</span>
        </div>
      )}

      {/* Protocol Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setVpnType('WireGuard')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            vpnType === 'WireGuard'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          WireGuard (Kernel Accel)
        </button>
        <button
          onClick={() => setVpnType('OpenVPN')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            vpnType === 'OpenVPN'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          OpenVPN (TLS/SSL)
        </button>
        <button
          onClick={() => setVpnType('IPsec')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            vpnType === 'IPsec'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          IPsec / IKEv2
        </button>
      </div>

      {/* Active Tunnel Status Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">{vpnType} wg0 Tunnel</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ● Connected
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Assigned IP: {clientIp} • Endpoint: {serverEndpoint}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px]">HANDSHAKE</span>
            <span className="font-semibold text-slate-800">12s ago</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">RX / TX DATA</span>
            <span className="font-semibold text-slate-800">14.2 MB / 8.4 MB</span>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>{vpnType} Parameters</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-slate-600 font-medium">Enable Tunnel</span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </label>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Remote Server Endpoint & Port <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={serverEndpoint}
                onChange={(e) => setServerEndpoint(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tunnel Client IP (CIDR) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientIp}
                onChange={(e) => setClientIp(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Peer Public Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Private Key
              </label>
              <input
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Allowed IPs / Routes
              </label>
              <input
                type="text"
                value={allowedIps}
                onChange={(e) => setAllowedIps(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Persistent Keepalive (seconds)
              </label>
              <input
                type="number"
                value={keepalive}
                onChange={(e) => setKeepalive(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={!hasWritePermission}
              data-write-action="true"
              className={`flex items-center gap-1.5 px-4 py-2 rounded font-semibold text-xs shadow-xs transition-colors ${
                hasWritePermission
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{hasWritePermission ? 'Save & Reconnect Tunnel' : 'Save Disabled (Read-Only)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
