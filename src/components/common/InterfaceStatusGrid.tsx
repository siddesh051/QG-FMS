import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Network, Usb, Cable, Zap, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import {
  getInterfaceStatus,
  getUsbStatus,
  getSerialStatus,
  getPoeStatus,
  getDigitalIoStatus,
  getRtcStatus,
} from '../../services/deviceApi';
import {
  InterfaceStatusValue,
  NetworkInterfaceStatus,
  UsbPortInfo,
  SerialPortInfo,
  PoePortInfo,
  DigitalIoStatus,
  RtcStatus,
} from '../../types/router';

// Lightweight polling interval for live telemetry (2-5s recommended).
const POLL_INTERVAL_MS = 3000;

interface InterfaceStatusGridProps {
  className?: string;
}

const STATUS_META: Record<
  InterfaceStatusValue,
  { label: string; dot: string; text: string }
> = {
  connected: { label: 'Connected', dot: 'bg-emerald-500 animate-pulse', text: 'text-emerald-700' },
  disconnected: { label: 'Disconnected', dot: 'bg-slate-400', text: 'text-slate-500' },
  connecting: { label: 'Connecting', dot: 'bg-amber-500 animate-pulse', text: 'text-amber-700' },
  error: { label: 'Error', dot: 'bg-red-500', text: 'text-red-700' },
  unavailable: { label: 'Telemetry unavailable', dot: 'bg-slate-300', text: 'text-slate-400' },
};

const StatusPill: React.FC<{ status: InterfaceStatusValue }> = ({ status }) => {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold text-[11px] ${meta.text}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
      {meta.label}
    </span>
  );
};

export const InterfaceStatusGrid: React.FC<InterfaceStatusGridProps> = ({ className = '' }) => {
  const [interfaces, setInterfaces] = useState<NetworkInterfaceStatus[] | null>(null);
  const [usbPorts, setUsbPorts] = useState<UsbPortInfo[] | null>(null);
  const [serialPorts, setSerialPorts] = useState<SerialPortInfo[] | null>(null);
  const [poePorts, setPoePorts] = useState<PoePortInfo[] | null>(null);
  const [digitalIo, setDigitalIo] = useState<DigitalIoStatus[] | null>(null);
  const [rtc, setRtc] = useState<RtcStatus | null>(null);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchAll = useCallback(async () => {
    try {
      const [ifaceResult, usbResult, serialResult, poeResult, gpioResult, rtcResult] = await Promise.allSettled([
        getInterfaceStatus(),
        getUsbStatus(),
        getSerialStatus(),
        getPoeStatus(),
        getDigitalIoStatus(),
        getRtcStatus(),
      ]);

      if (!isMounted.current) return;

      if (ifaceResult.status === 'fulfilled') setInterfaces(ifaceResult.value);
      if (usbResult.status === 'fulfilled') setUsbPorts(usbResult.value);
      if (serialResult.status === 'fulfilled') setSerialPorts(serialResult.value);
      if (poeResult.status === 'fulfilled') setPoePorts(poeResult.value);
      if (gpioResult.status === 'fulfilled') setDigitalIo(gpioResult.value);
      if (rtcResult.status === 'fulfilled') setRtc(rtcResult.value);

      const allRejected = [ifaceResult, usbResult, serialResult, poeResult, gpioResult, rtcResult].every(
        (r) => r.status === 'rejected'
      );
      setTelemetryError(
        allRejected ? 'Telemetry unavailable — unable to reach device interface service.' : null
      );
    } catch {
      if (isMounted.current) {
        setTelemetryError('Telemetry unavailable — unable to reach device interface service.');
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchAll();
    const id = setInterval(fetchAll, POLL_INTERVAL_MS);
    return () => {
      isMounted.current = false;
      clearInterval(id);
    };
  }, [fetchAll]);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden ${className}`}>
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Interface Status Grid</h3>
        </div>
        <span className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3" />
          Live telemetry &middot; refreshes every {Math.round(POLL_INTERVAL_MS / 1000)}s
        </span>
      </div>

      {telemetryError && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{telemetryError}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100/75 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-4">Interface</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Details</th>
              <th className="py-2.5 px-4 text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Section: Network Interfaces */}
            <tr>
              <td colSpan={4} className="px-4 py-1.5 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Network Interfaces
              </td>
            </tr>
            {interfaces
              ? interfaces.map((iface) => (
                  <tr key={iface.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{iface.name}</td>
                    <td className="py-2.5 px-4">
                      <StatusPill status={iface.status} />
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{iface.details || '—'}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-500">{iface.lastUpdated}</td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-slate-400 text-center">Loading interface telemetry…</td>
                </tr>
              )}

            {/* Section: Physical Interfaces (USB) */}
            <tr>
              <td colSpan={4} className="px-4 py-1.5 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Physical Interfaces
              </td>
            </tr>
            {usbPorts
              ? usbPorts.map((usb) => (
                  <tr key={usb.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-1.5">
                      <Usb className="w-3.5 h-3.5 text-blue-600" />
                      {usb.name}
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusPill status={usb.status} />
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {usb.status === 'connected'
                        ? [usb.deviceName, usb.usbSpeed].filter(Boolean).join(' · ') || '—'
                        : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-500">{usb.lastUpdated}</td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-slate-400 text-center">Loading USB telemetry…</td>
                </tr>
              )}

            {/* Section: Serial / UART Interfaces */}
            <tr>
              <td colSpan={4} className="px-4 py-1.5 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Serial (UART) Interfaces — RS232 / RS485 / TTL
              </td>
            </tr>
            {serialPorts
              ? serialPorts.map((port) => (
                  <tr key={port.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-1.5">
                      <Cable className="w-3.5 h-3.5 text-blue-600" />
                      {port.name} ({port.protocol})
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusPill status={port.status} />
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {port.status === 'connected'
                        ? [port.details, port.baudRate ? `${port.baudRate} baud` : undefined].filter(Boolean).join(' · ') || '—'
                        : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-500">{port.lastUpdated}</td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-slate-400 text-center">Loading serial telemetry…</td>
                </tr>
              )}

            {/* Section: PoE Ports */}
            <tr>
              <td colSpan={4} className="px-4 py-1.5 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                PoE Ports — IEEE 802.3af/at
              </td>
            </tr>
            {poePorts
              ? poePorts.map((port) => (
                  <tr key={port.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-600" />
                      {port.name}
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusPill status={port.status} />
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {port.poweredDeviceDetected
                        ? `${port.powerDrawW ?? '—'} W drawn · ${port.maxPowerW} W max`
                        : `Idle · ${port.maxPowerW} W max`}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-500">{port.lastUpdated}</td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-slate-400 text-center">Loading PoE telemetry…</td>
                </tr>
              )}

            {/* Section: Digital I/O (GPIO) & RTC */}
            <tr>
              <td colSpan={4} className="px-4 py-1.5 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Digital I/O (GPIO) &amp; Real-Time Clock
              </td>
            </tr>
            {digitalIo
              ? digitalIo.map((io) => (
                  <tr key={io.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{io.name}</td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 font-semibold text-[11px] ${io.state === 'High' ? 'text-emerald-700' : 'text-slate-500'}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${io.state === 'High' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {io.state}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{io.direction}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-500">{io.lastUpdated}</td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-slate-400 text-center">Loading GPIO telemetry…</td>
                </tr>
              )}
            {rtc ? (
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Real-Time Clock
                </td>
                <td className="py-2.5 px-4">
                  <span className={`inline-flex items-center gap-1.5 font-semibold text-[11px] ${rtc.batteryOk ? 'text-emerald-700' : 'text-red-700'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${rtc.batteryOk ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {rtc.batteryOk ? 'Battery OK' : 'Battery Low'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-500">Drift {rtc.driftSeconds}s · Synced {rtc.lastSynced}</td>
                <td className="py-2.5 px-4 text-right font-mono text-slate-500">{rtc.currentTime}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterfaceStatusGrid;
