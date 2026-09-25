import React from 'react';
import { 
  Server, 
  Activity, 
  Network, 
  Usb, 
  HardDrive, 
  Cpu, 
  Radio, 
  Shield,
  Cable,
  ToggleLeft,
  Zap,
  Clock,
  Satellite,
} from 'lucide-react';
import { DeviceInfo } from '../../../types/router';
import { PortStatusRow } from '../../common/PortStatusRow';
import { UsbPortStatusCard } from '../../common/UsbPortStatusCard';

interface DeviceInfoPageProps {
  deviceInfo: DeviceInfo;
}

export const DeviceInfoPage: React.FC<DeviceInfoPageProps> = ({ deviceInfo }) => {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Title & Breadcrumbs */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">System & Maintenance</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Device Information</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Server className="w-5 h-5 text-sky-300" />
          Device Information & Live System Status
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Hardware telemetry, host status, kernel metrics, and physical interface link state.
        </p>
      </div>

      {/* System Status Section (Card 1) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">System Status</h2>
              <p className="text-xs text-slate-500">Live operational state and kernel metrics</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Healthy
          </span>
        </div>

        {/* System Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 font-medium block">Hostname</span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
              FluxGateway-TR2005-01
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 font-medium block">Serial Number (S/N)</span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
              {deviceInfo.serialNumber}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 font-medium block">Firmware Version</span>
            <span className="font-mono font-bold text-blue-700 text-sm mt-0.5 block">
              {deviceInfo.firmwareVersion}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 font-medium block">Kernel Version</span>
            <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block truncate" title="Linux 6.1.48-rt12 (x86_64 PREEMPT_RT)">
              6.1.48-rt12 (x86_64 RT)
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 font-medium block">System Time</span>
            <span className="font-mono font-semibold text-slate-800 text-xs mt-0.5 block">
              {deviceInfo.systemTime}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 font-medium block">System Uptime</span>
            <span className="font-mono font-semibold text-emerald-700 text-xs mt-0.5 block">
              {deviceInfo.uptime}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 sm:col-span-2">
            <span className="text-slate-500 font-medium block">System Load Average</span>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="font-mono font-bold text-slate-900 text-xs">
                0.18, 0.22, 0.19
              </span>
              <span className="text-[11px] text-slate-500">
                (1m, 5m, 15m • 4 Cores Available)
              </span>
            </div>
          </div>
        </div>

        {/* Physical Interface Port Status Row (LAN1–LAN4 + WAN) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-600" />
                Physical RJ45 Port Status (LAN1–LAN4 + WAN)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Real-time plugged-in link state with cable insertion indicators and activity LEDs
              </p>
            </div>
          </div>

          {/* Creative Port Status Graphic */}
          <PortStatusRow interactive={true} />
        </div>

        {/* Real-Time USB Port Status (USB 1 / USB 2) */}
        <div className="pt-4 border-t border-slate-100">
          <UsbPortStatusCard />
        </div>
      </div>

      {/* Simplified Basic Hardware Specifications Card (Card 2) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-700" />
            <span>Hardware Specifications</span>
          </div>
          <span className="text-xs text-slate-500 font-normal">Basic System Profile</span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-slate-500 font-medium block">Model Designation</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{deviceInfo.model}</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Hardware Revision {deviceInfo.hardwareVersion}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-slate-500 font-medium block">Compute Architecture</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">x86-64 Industrial SoC</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Fanless Solid-State Cooling</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              <span>Local Storage</span>
            </div>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">M.2 NVMe SSD, 16–256 GB</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">+ eMMC / SPI NAND · Optional RAID</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Usb className="w-3.5 h-3.5 text-blue-600" />
              <span>USB Interfaces</span>
            </div>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">3x USB 3.1 Type-A</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">2x USB 2.0 Type-A</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Cable className="w-3.5 h-3.5 text-blue-600" />
              <span>Serial Interfaces</span>
            </div>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">3x UART Ports</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">RS232 / RS485 / TTL</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <ToggleLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Digital I/O</span>
            </div>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">Programmable GPIO</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Digital I/O lines</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>PoE Ports</span>
            </div>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">2x PoE, 802.3af/at</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Up to 30 W/port · 60 W total budget</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Clock</span>
            </div>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">Battery-Backed RTC</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Retains time on power loss</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Radio className="w-3.5 h-3.5 text-blue-600" />
              <span>Cellular Modem</span>
            </div>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">5G NR Sub-6 (SA/NSA)</span>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">4G LTE Cat 20 · IMEI: {deviceInfo.imei}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Satellite className="w-3.5 h-3.5 text-blue-600" />
              <span>Fiber / SATCOM</span>
            </div>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">SFP / SFP+ Fiber WAN</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">SATCOM L-Band / Ku-Band</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Network className="w-3.5 h-3.5 text-blue-600" />
              <span>Primary MAC (eth0)</span>
            </div>
            <span className="font-bold text-slate-900 font-mono text-sm mt-0.5 block">{deviceInfo.macAddress}</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Gigabit / Multi-Gigabit Ethernet</span>
          </div>
        </div>
      </div>
    </div>
  );
};
