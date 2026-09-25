import React, { useState } from 'react';
import { 
  HardDrive, 
  Upload, 
  CheckCircle2, 
  RotateCw, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Server, 
  FileCheck, 
  ArrowRight, 
  DownloadCloud,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';

interface FirmwareRelease {
  version: string;
  releaseDate: string;
  type: 'Security Hotfix' | 'Current Stable' | 'Golden LTS';
  status: 'available' | 'installed' | 'fallback';
  size: string;
  sha256: string;
  cveAdvisories: string[];
  highlights: string[];
}

const EMS_CATALOG: FirmwareRelease[] = [
  {
    version: 'v2.4.2-sec-hotfix',
    releaseDate: 'September 15, 2026',
    type: 'Security Hotfix',
    status: 'available',
    size: '142 MB',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    cveAdvisories: ['CVE-2026-3891 (OpenSSL buffer hardening)', 'CVE-2026-1104 (IPsec IKEv2 packet fix)'],
    highlights: [
      'Quectel RM520N 5G modem sub-6GHz carrier aggregation latency optimization',
      'Kernel real-time patch 6.1.52-rt14 with deterministic Modbus jitter reduction',
      'Stateful firewall rate-limiting against automated WAN brute-force probes',
    ],
  },
  {
    version: 'v2.4.1-stable',
    releaseDate: 'September 01, 2026',
    type: 'Current Stable',
    status: 'installed',
    size: '138 MB',
    sha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    cveAdvisories: [],
    highlights: ['Initial enterprise production baseline with dual-bank failsafe'],
  },
  {
    version: 'v2.4.0-lts',
    releaseDate: 'August 10, 2026',
    type: 'Golden LTS',
    status: 'fallback',
    size: '134 MB',
    sha256: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    cveAdvisories: [],
    highlights: ['Factory recovery baseline stored permanently on Flash Bank B'],
  },
];

const UPGRADE_HISTORY = [
  {
    date: '2026-09-01 03:14:22 UTC',
    operator: 'admin (EMS Cloud)',
    fromVersion: 'v2.4.0',
    toVersion: 'v2.4.1',
    partition: 'Bank A',
    status: 'Successful (Verified)',
  },
  {
    date: '2026-08-15 11:20:05 UTC',
    operator: 'factory_provisioner',
    fromVersion: 'v2.3.9',
    toVersion: 'v2.4.0',
    partition: 'Bank B',
    status: 'Factory Golden Provision',
  },
];

interface FirmwarePageProps {
  userRole?: string;
  hasWritePermission?: boolean;
}

export const FirmwarePage: React.FC<FirmwarePageProps> = ({ 
  userRole = 'Administrator',
  hasWritePermission,
}) => {
  const isAuthorized = hasWritePermission !== undefined ? hasWritePermission : userRole === 'Administrator';
  const isAdmin = isAuthorized;
  const [activeBank, setActiveBank] = useState<'A' | 'B'>('A');
  const [checkingOta, setCheckingOta] = useState(false);
  const [otaStatus, setOtaStatus] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedRelease, setSelectedRelease] = useState<FirmwareRelease | null>(EMS_CATALOG[0]);
  const [showHistory, setShowHistory] = useState(false);

  const handleCheckOta = () => {
    setCheckingOta(true);
    setOtaStatus(null);
    setTimeout(() => {
      setCheckingOta(false);
      setOtaStatus('EMS Repository Synchronized: 1 verified security hotfix update available for FluxGateway fleet.');
    }, 1000);
  };

  const handleStageRelease = (rel: FirmwareRelease) => {
    setIsUpgrading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsUpgrading(false);
          setOtaStatus(`Firmware ${rel.version} successfully staged to Partition Bank B. SHA-256 and TPM RSA signature verified.`);
          return 100;
        }
        return p + 15;
      });
    }, 350);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Breadcrumb & Page Title */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">System</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Firmware Management</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-sky-300" />
              EMS Dual-Bank Firmware Lifecycle Portal
            </h1>
            <p className="text-xs text-sky-100/85 mt-1">
              Failsafe dual-partition operating system upgrades with cryptographic hardware verification, rollback policies, and remote EMS repository staging.
            </p>
          </div>

          <button
            onClick={handleCheckOta}
            disabled={checkingOta}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 self-start sm:self-auto backdrop-blur-xs"
          >
            <RotateCw className={`w-3.5 h-3.5 text-sky-200 ${checkingOta ? 'animate-spin' : ''}`} />
            <span>{checkingOta ? 'Connecting to QuadGen EMS...' : 'Check EMS Repository'}</span>
          </button>
        </div>
      </div>

      {otaStatus && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{otaStatus}</span>
        </div>
      )}

      {!isAdmin && (
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-xs">
          <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">RBAC Operational Policy:</span>
            <p className="mt-0.5 text-amber-700">
              Logged in as <strong>{userRole}</strong>. Operating system firmware management is currently in <strong>Read-Only</strong> mode. The Administrator can grant Read/Write permission for this setting from the User Management RBAC Matrix.
            </p>
          </div>
        </div>
      )}

      {/* Dual Bank Architecture Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            Hardware Flash Partition Bank Status (A/B)
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-500" />
            Bootloader Flags EMS-Protected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bank A */}
          <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50/20 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Partition Bank A</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                CURRENT ACTIVE BOOT
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-slate-600">
              <div>Firmware: <strong className="text-slate-900 font-mono">v2.4.1-stable</strong></div>
              <div>Kernel: <span className="font-mono text-slate-700">6.1.48-rt12 (Real-Time)</span></div>
              <div>Rootfs Size: <span className="font-mono text-slate-700">1.8 GB / 4.0 GB SATA NAND</span></div>
              <div>Integrity: <span className="text-emerald-700 font-semibold">SHA-256 Measured & Verified</span></div>
              <div>State: <span className="text-blue-700 font-semibold">Healthy (Boot Counter: 1/3)</span></div>
            </div>
          </div>

          {/* Bank B */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">Partition Bank B</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                STANDBY RECOVERY
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-slate-600">
              <div>Firmware: <strong className="text-slate-800 font-mono">v2.4.0-lts (Golden Image)</strong></div>
              <div>Kernel: <span className="font-mono text-slate-700">6.1.35-rt8</span></div>
              <div>Rootfs Size: <span className="font-mono text-slate-700">1.7 GB / 4.0 GB SATA NAND</span></div>
              <div>Integrity: <span className="text-slate-600 font-semibold">Factory Certified Baseline</span></div>
              <div>Protection: <span className="text-slate-500 font-medium">Automatic Fallback on Boot Crash</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Central EMS Remote Repository Catalog */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-4 h-4 text-blue-600" />
            <span>Central QuadGen EMS Firmware Catalog</span>
          </div>
          <span className="text-xs text-slate-500 font-normal">
            Channel: <strong className="text-slate-800">Enterprise Certified</strong>
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {EMS_CATALOG.map((rel) => (
            <div key={rel.version} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{rel.version}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rel.type === 'Security Hotfix'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : rel.type === 'Current Stable'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {rel.type}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">• {rel.releaseDate}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-mono">
                    <span>Size: {rel.size}</span>
                    <span>•</span>
                    <span className="truncate max-w-xs">SHA-256: {rel.sha256.substring(0, 16)}...</span>
                  </div>

                  {rel.cveAdvisories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rel.cveAdvisories.map((cve) => (
                        <span key={cve} className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-medium text-[10px] border border-red-200">
                          {cve}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  {rel.status === 'available' ? (
                    <button
                      onClick={() => handleStageRelease(rel)}
                      disabled={!isAdmin || isUpgrading}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {!isAdmin ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Admin Clearance Required</span>
                        </>
                      ) : (
                        <>
                          <DownloadCloud className="w-3.5 h-3.5" />
                          <span>Stage to Bank B</span>
                        </>
                      )}
                    </button>
                  ) : rel.status === 'installed' ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-semibold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Running on Bank A
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded font-medium text-xs">
                      Golden Recovery Image
                    </span>
                  )}
                </div>
              </div>

              {/* Release Highlights */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-slate-600 text-[11px] space-y-0.5">
                {rel.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-600" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {isUpgrading && (
          <div className="p-4 bg-blue-50 border-t border-blue-200 space-y-2">
            <div className="flex justify-between text-xs text-blue-900 font-bold">
              <span>Downloading & Flashing Bank B Partition...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-700">
              Cryptographic SHA-256 and RSA-4096 signature verification running in real-time. Do not disconnect power.
            </p>
          </div>
        )}
      </div>

      {/* Pre-flash Verification & Failsafe Rollback Policy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Checklist */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Pre-Flash Cryptographic Verifications
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50">
              <span className="text-slate-700 font-medium">Architecture Compatibility</span>
              <span className="text-emerald-700 font-bold">x86-64 (SBC-370V) OK</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50">
              <span className="text-slate-700 font-medium">TPM 2.0 Hardware Certificate</span>
              <span className="text-emerald-700 font-bold">QuadGen Root CA Valid</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50">
              <span className="text-slate-700 font-medium">SATA NAND Storage Margin</span>
              <span className="text-emerald-700 font-bold">2.2 GB Free (Sufficient)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50">
              <span className="text-slate-700 font-medium">Main DC Power Rail</span>
              <span className="text-emerald-700 font-bold">24.2 V Stable</span>
            </div>
          </div>
        </div>

        {/* Failsafe Rollback Policy */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            EMS Automated Rollback Watchdog
          </h3>

          <p className="text-slate-500 leading-relaxed">
            FluxGateway features an automated hardware watchdog. When a newly flashed partition boots, it has a <strong>180-second window</strong> to successfully register with the EMS server and establish network health.
          </p>

          <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-md space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Zero-Brick Guarantee</span>
            </div>
            <p className="text-[11px] text-amber-800">
              If the boot watchdog fails or kernel panics, the bootloader automatically reverts to Partition Bank A golden image with zero user intervention required.
            </p>
          </div>
        </div>
      </div>

      {/* Manual File Upload for Air-Gapped Plants */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 text-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Upload className="w-4 h-4 text-blue-600" />
          Air-Gapped Manual Firmware Image Upload
        </h3>

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <div className="font-semibold text-slate-800">
            Drag & Drop FluxGateway firmware archive (.bin, .pkg, .tar.gz)
          </div>
          <span className="text-slate-500 text-[11px] block mt-1">
            Archive must contain a valid cryptographic signature signed by QuadGen Wireless CA
          </span>
          <button
            onClick={() => handleStageRelease(EMS_CATALOG[0])}
            disabled={isUpgrading}
            className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs border border-slate-300 cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Select Local File & Verify Integrity</span>
          </button>
        </div>
      </div>

      {/* Audit History Log Toggle */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Firmware Upgrade Audit Trail ({UPGRADE_HISTORY.length} Events)</span>
          </div>
          {showHistory ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {showHistory && (
          <div className="p-4 overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2 px-3">Timestamp (UTC)</th>
                  <th className="py-2 px-3">Operator</th>
                  <th className="py-2 px-3">Transition</th>
                  <th className="py-2 px-3">Target Bank</th>
                  <th className="py-2 px-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {UPGRADE_HISTORY.map((hist, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-700">{hist.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{hist.operator}</td>
                    <td className="py-2.5 px-3 text-blue-700">{hist.fromVersion} → {hist.toVersion}</td>
                    <td className="py-2.5 px-3 text-slate-600">{hist.partition}</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">{hist.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Default Protection Lock Badge */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-xs text-slate-600 flex items-start gap-3">
        <Lock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-slate-800">EMS Default Policy Protection:</span>
          <p className="text-slate-500 mt-0.5">
            The bootloader partition table and Golden Fallback Image on Bank B cannot be overwritten or deleted by user accounts. Only QuadGen factory signed packages matching the hardware model identifier (<code className="font-mono text-slate-700">FluxGateway-TR-2005</code>) are accepted by the bootloader.
          </p>
        </div>
      </div>
    </div>
  );
};
