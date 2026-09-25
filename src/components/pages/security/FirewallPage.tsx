import React, { useState } from 'react';
import { Shield, Save, Plus, Trash2, CheckCircle2, Lock } from 'lucide-react';

interface ForwardRule {
  id: string;
  name: string;
  proto: 'TCP' | 'UDP' | 'TCP/UDP';
  externalPort: string;
  internalIp: string;
  internalPort: string;
  enabled: boolean;
}

export interface FirewallPageProps {
  hasWritePermission?: boolean;
}

export const FirewallPage: React.FC<FirewallPageProps> = ({ hasWritePermission = true }) => {
  const [synFlood, setSynFlood] = useState(true);
  const [wanPing, setWanPing] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const [rules, setRules] = useState<ForwardRule[]>([
    {
      id: 'rule-1',
      name: 'Modbus TCP Direct',
      proto: 'TCP',
      externalPort: '502',
      internalIp: '192.168.1.1',
      internalPort: '502',
      enabled: true,
    },
    {
      id: 'rule-2',
      name: 'HMI Web Console',
      proto: 'TCP',
      externalPort: '8443',
      internalIp: '192.168.1.104',
      internalPort: '443',
      enabled: true,
    },
  ]);

  const [newRuleName, setNewRuleName] = useState('');
  const [newProto, setNewProto] = useState<'TCP' | 'UDP' | 'TCP/UDP'>('TCP');
  const [newExtPort, setNewExtPort] = useState('');
  const [newInternalIp, setNewInternalIp] = useState('192.168.1.');
  const [newInternalPort, setNewInternalPort] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWritePermission) return;
    const newRule: ForwardRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      proto: newProto,
      externalPort: newExtPort,
      internalIp: newInternalIp,
      internalPort: newInternalPort,
      enabled: true,
    };
    setRules([...rules, newRule]);
    setShowAddModal(false);
    setNewRuleName('');
    setNewExtPort('');
    setNewInternalPort('');
  };

  const handleDeleteRule = (id: string) => {
    if (!hasWritePermission) return;
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleSave = () => {
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
          <span className="text-white font-semibold">Firewall & Port Forwarding</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Shield className="w-5 h-5 text-sky-300" />
          Stateful Packet Inspection (SPI) Firewall
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Industrial Linux nftables firewall engine with zone defense, DDoS mitigation, and NAT port mapping.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Firewall rules compiled and applied to kernel netfilter tables.</span>
        </div>
      )}

      {/* Global Security Policies */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 text-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
          Global Zone Policies & Hardening
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 font-medium block">WAN &rarr; Router (INPUT)</span>
            <span className="font-bold text-red-600 font-mono text-sm">DROP (Default Deny)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 font-medium block">LAN &rarr; WAN (FORWARD)</span>
            <span className="font-bold text-emerald-600 font-mono text-sm">ACCEPT (Stateful NAT)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 font-medium block">Router &rarr; WAN (OUTPUT)</span>
            <span className="font-bold text-emerald-600 font-mono text-sm">ACCEPT</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={synFlood}
              onChange={(e) => setSynFlood(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="font-semibold text-slate-800">
              Enable SYN Flood DDoS Protection (Rate-limit initial TCP connections)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={stealthMode}
              onChange={(e) => setStealthMode(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="font-semibold text-slate-800">
              Stealth Mode (Silently drop unauthorized probes without sending TCP RST)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wanPing}
              onChange={(e) => setWanPing(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="font-semibold text-slate-800">
              Respond to ICMP Echo Pings on Public WAN (Not recommended for high security)
            </span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={!hasWritePermission}
            data-write-action="true"
            className={`flex items-center gap-1.5 px-4 py-2 rounded font-semibold text-xs shadow-xs transition-colors ${
              hasWritePermission
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{hasWritePermission ? 'Apply Firewall Policies' : 'Apply Disabled (Read-Only)'}</span>
          </button>
        </div>
      </div>

      {/* Port Forwarding Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Port Forwarding Rules (DNAT)</span>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={!hasWritePermission}
            data-write-action="true"
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold shadow-2xs ${
              hasWritePermission
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Port Rule</span>
          </button>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-4">Rule Name</th>
              <th className="py-2.5 px-4">Protocol</th>
              <th className="py-2.5 px-4">External Port</th>
              <th className="py-2.5 px-4">Internal IP Destination</th>
              <th className="py-2.5 px-4">Internal Port</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rules.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="py-2 px-4 font-semibold text-slate-800">{r.name}</td>
                <td className="py-2 px-4 font-mono text-slate-600">{r.proto}</td>
                <td className="py-2 px-4 font-mono font-semibold text-blue-700">{r.externalPort}</td>
                <td className="py-2 px-4 font-mono text-slate-700">{r.internalIp}</td>
                <td className="py-2 px-4 font-mono font-semibold text-slate-900">{r.internalPort}</td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleDeleteRule(r.id)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to add rule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
              Create Port Forwarding Rule
            </div>
            <form onSubmit={handleAddRule} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. SCADA Web Interface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Protocol</label>
                  <select
                    value={newProto}
                    onChange={(e) => setNewProto(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="TCP/UDP">Both TCP/UDP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">External Port</label>
                  <input
                    type="text"
                    required
                    value={newExtPort}
                    onChange={(e) => setNewExtPort(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                    placeholder="8080"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Internal Target IP</label>
                  <input
                    type="text"
                    required
                    value={newInternalIp}
                    onChange={(e) => setNewInternalIp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Internal Port</label>
                  <input
                    type="text"
                    required
                    value={newInternalPort}
                    onChange={(e) => setNewInternalPort(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
