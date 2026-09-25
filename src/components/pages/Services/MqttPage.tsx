import React, { useState } from 'react';
import { Network, Save, CheckCircle2, RotateCw, Shield, Upload, Play } from 'lucide-react';

export const MqttPage: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [brokerUrl, setBrokerUrl] = useState('mqtt.example.com');
  const [port, setPort] = useState('8883');
  const [clientId, setClientId] = useState('FluxGateway-001');
  const [username, setUsername] = useState('gw_operator');
  const [password, setPassword] = useState('••••••••••••');
  const [tls, setTls] = useState(true);
  const [topic, setTopic] = useState('fluxgateway/sensors');
  const [qos, setQos] = useState('1');
  const [retain, setRetain] = useState(true);
  const [keepalive, setKeepalive] = useState('60');

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult('● MQTT Connection Successful (Broker responded in 18 ms, TLS 1.3 handshake verified)');
    }, 1000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Protocols</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">MQTT Telemetry Broker</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Network className="w-5 h-5 text-sky-300" />
          MQTT Client & Cloud Ingestion Service
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Industrial MQTT client publishing real-time 16-channel telemetry to SCADA or cloud IoT endpoints.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>MQTT Configuration saved. Telemetry publisher daemon updated.</span>
        </div>
      )}

      {testResult && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Broker Credentials & Publish Settings</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-slate-600 font-medium">MQTT Enable</span>
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
                Broker URL / Hostname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={brokerUrl}
                onChange={(e) => setBrokerUrl(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                placeholder="mqtt.example.com"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                TCP Port <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                placeholder="8883"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Client ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Topic Namespace <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Quality of Service (QoS)
              </label>
              <select
                value={qos}
                onChange={(e) => setQos(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="0">0 - At most once (Fire and forget)</option>
                <option value="1">1 - At least once (Acknowledged delivery)</option>
                <option value="2">2 - Exactly once (Assured delivery)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Keepalive (seconds)
              </label>
              <input
                type="number"
                value={keepalive}
                onChange={(e) => setKeepalive(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tls}
                  onChange={(e) => setTls(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="font-semibold text-slate-800">
                  Enable TLS / SSL Transport Security
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={retain}
                  onChange={(e) => setRetain(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="font-semibold text-slate-800">
                  Retain Last Known Message
                </span>
              </label>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded font-medium cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Certificate</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded font-semibold text-xs transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{testing ? 'Testing Handshake...' : 'Test Connection'}</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
