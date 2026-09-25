import React, { useState } from 'react';
import { 
  Wifi, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  Signal, 
  Lock, 
  ShieldCheck, 
  ArrowUpRight,
  Radio,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface ScannedNetwork {
  ssid: string;
  bssid: string;
  signalDbm: number;
  quality: number; // percentage
  band: '5 GHz' | '2.4 GHz' | '6 GHz';
  security: 'WPA3-SAE' | 'WPA2-PSK' | 'WPA2-Enterprise' | 'Open';
  connected?: boolean;
}

const INITIAL_NETWORKS: ScannedNetwork[] = [
  {
    ssid: 'QuadGen_Plant_Net',
    bssid: '00:1A:2B:6C:8D:9E',
    signalDbm: -58,
    quality: 88,
    band: '5 GHz',
    security: 'WPA3-SAE',
    connected: true,
  },
  {
    ssid: 'Industrial_SCADA_Uplink',
    bssid: '00:1A:2B:44:11:02',
    signalDbm: -67,
    quality: 74,
    band: '5 GHz',
    security: 'WPA2-Enterprise',
  },
  {
    ssid: 'Field_Operations_5G_Hotspot',
    bssid: 'F4:8E:38:12:9A:88',
    signalDbm: -72,
    quality: 65,
    band: '2.4 GHz',
    security: 'WPA2-PSK',
  },
  {
    ssid: 'Warehouse_Automation_Mesh',
    bssid: '8C:11:CB:90:55:1A',
    signalDbm: -79,
    quality: 52,
    band: '5 GHz',
    security: 'WPA3-SAE',
  },
];

interface WifiPageProps {
  hasWritePermission?: boolean;
}

export const WifiPage: React.FC<WifiPageProps> = ({ hasWritePermission = true }) => {
  const [ssid, setSsid] = useState('QuadGen_Plant_Net');
  const [password, setPassword] = useState('••••••••••••');
  const [security, setSecurity] = useState<'WPA3-SAE' | 'WPA2-PSK' | 'WPA2-Enterprise' | 'Open'>('WPA3-SAE');
  const [ipMode, setIpMode] = useState<'dhcp' | 'static'>('dhcp');
  const [autoReconnect, setAutoReconnect] = useState(true);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scannedNetworks, setScannedNetworks] = useState<ScannedNetwork[]>(INITIAL_NETWORKS);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedNetworks((prev) =>
        prev.map((net) => ({
          ...net,
          signalDbm: net.signalDbm + (Math.floor(Math.random() * 5) - 2),
        }))
      );
      setSavedNotification('Wi-Fi scan completed: 4 accessible networks found in range.');
      setTimeout(() => setSavedNotification(null), 3000);
    }, 1200);
  };

  const handleSelectNetwork = (net: ScannedNetwork) => {
    if (!hasWritePermission) return;
    setSsid(net.ssid);
    setSecurity(net.security);
    setPassword('');
    setSavedNotification(`Selected network "${net.ssid}". Enter authentication credentials to connect.`);
    setTimeout(() => setSavedNotification(null), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWritePermission) return;
    setSavedNotification(`Wi-Fi client connected directly to "${ssid}". wlan0 IP leased via DHCP.`);
    setTimeout(() => setSavedNotification(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Breadcrumb & Page Title */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Connectivity</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Wi-Fi Connection</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Wifi className="w-5 h-5 text-sky-300" />
              Wi-Fi Connection
            </h1>
            <p className="text-xs text-sky-100/85 mt-1">
              Connect FluxGateway to an external wireless network for primary or backup WAN uplink (Station mode on <code className="font-mono text-white bg-white/15 px-1 py-0.5 rounded">wlan0</code>).
            </p>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 self-start sm:self-auto backdrop-blur-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-200 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning RF Channels...' : 'Scan Nearby Networks'}</span>
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Active Wi-Fi Connection Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-900">Current Wi-Fi Uplink Status</h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Connected (Station Mode)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Connected Network (SSID)</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">
              QuadGen_Plant_Net
            </span>
            <span className="text-[10px] text-slate-400 font-mono">BSSID: 00:1A:2B:6C:8D:9E</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block text-[11px]">RF Signal & Band</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Signal className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-900 text-sm">-58 dBm (88%)</span>
            </div>
            <span className="text-[10px] text-slate-500">Channel 36 (5 GHz, 80 MHz)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Assigned IP & Subnet</span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
              172.16.20.88
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Mask: 255.255.255.0</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Default Gateway Route</span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
              172.16.20.1
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">Priority 3 Fallback</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Available Networks on Left, Connection Configuration on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Nearby Wi-Fi Scanner Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>Discovered Wireless Networks</span>
            </div>
            <span className="text-xs text-slate-500 font-normal">
              {scannedNetworks.length} Available
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {scannedNetworks.map((net) => (
              <div
                key={net.bssid}
                className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 truncate">{net.ssid}</span>
                    {net.connected && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <span>{net.band}</span>
                    <span>•</span>
                    <span>{net.security}</span>
                    <span>•</span>
                    <span className="text-slate-700 font-semibold">{net.signalDbm} dBm</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-12 h-1.5 rounded bg-slate-200 overflow-hidden hidden sm:block">
                    <div
                      className={`h-full rounded ${
                        net.quality > 70 ? 'bg-emerald-500' : net.quality > 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${net.quality}%` }}
                    />
                  </div>

                  <button
                    onClick={() => handleSelectNetwork(net)}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Connection Settings Form */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Wi-Fi Connection Parameters</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Interface: wlan0</span>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Target Network Name (SSID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                required
                placeholder="e.g. Factory_WLAN_Enterprise"
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Security Protocol
                </label>
                <select
                  value={security}
                  onChange={(e) => setSecurity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="WPA3-SAE">WPA3-Personal (SAE)</option>
                  <option value="WPA2-PSK">WPA2-Personal (AES/CCMP)</option>
                  <option value="WPA2-Enterprise">WPA2-Enterprise (802.1X EAP)</option>
                  <option value="Open">None (Unsecured Open)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Network Passphrase / PSK
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Security key"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* IP Configuration Mode */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-slate-700 font-semibold mb-2">
                IP Address Assignment
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIpMode('dhcp')}
                  className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                    ipMode === 'dhcp'
                      ? 'border-blue-600 bg-blue-50/40 text-blue-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block text-xs">DHCP (Automatic)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Obtain IP, Gateway & DNS from AP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIpMode('static')}
                  className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                    ipMode === 'static'
                      ? 'border-blue-600 bg-blue-50/40 text-blue-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block text-xs">Static IP</span>
                  <span className="text-[10px] text-slate-500 font-normal">Manual fixed industrial IP config</span>
                </button>
              </div>
            </div>

            {/* Auto Reconnect Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="autoReconnect"
                checked={autoReconnect}
                onChange={(e) => setAutoReconnect(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="autoReconnect" className="text-slate-700 font-medium cursor-pointer">
                Automatically reconnect to this network after gateway boot or signal loss
              </label>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Direct connection only — AP broadcast disabled.
              </span>
              <button
                type="submit"
                disabled={!hasWritePermission}
                data-write-action="true"
                className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold shadow-2xs transition-colors ${
                  hasWritePermission
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{hasWritePermission ? 'Apply & Connect' : 'Apply Disabled (Read-Only)'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* EMS Policy Protection Notice */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-xs text-slate-600 flex items-start gap-3">
        <Lock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-slate-800">EMS Default Policy Protection:</span>
          <p className="text-slate-500 mt-0.5">
            The factory wireless regulatory domain (FCC / ETSI country code) and physical interface MAC address (<code className="font-mono text-slate-700">00:80:E1:92:44:0B</code>) are hardware-locked. Operators can configure uplink connection credentials, but cannot bypass regional radio frequency limits.
          </p>
        </div>
      </div>
    </div>
  );
};
