import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Usb, AlertTriangle } from 'lucide-react';
import { getUsbStatus } from '../../services/deviceApi';
import { InterfaceStatusValue, UsbPortInfo } from '../../types/router';

const POLL_INTERVAL_MS = 3000;

const STATUS_META: Record<InterfaceStatusValue, { label: string; dot: string; badge: string }> = {
  connected: { label: 'Connected', dot: 'bg-emerald-500 animate-pulse', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  disconnected: { label: 'Disconnected', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  connecting: { label: 'Connecting', dot: 'bg-amber-500 animate-pulse', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  error: { label: 'Error', dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200' },
  unavailable: { label: 'Telemetry unavailable', dot: 'bg-slate-300', badge: 'bg-slate-50 text-slate-400 border-slate-200' },
};

interface UsbPortStatusCardProps {
  className?: string;
}

export const UsbPortStatusCard: React.FC<UsbPortStatusCardProps> = ({ className = '' }) => {
  const [ports, setPorts] = useState<UsbPortInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchUsb = useCallback(async () => {
    try {
      const data = await getUsbStatus();
      if (isMounted.current) {
        setPorts(data);
        setError(null);
      }
    } catch {
      if (isMounted.current) {
        setError('Telemetry unavailable');
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchUsb();
    const id = setInterval(fetchUsb, POLL_INTERVAL_MS);
    return () => {
      isMounted.current = false;
      clearInterval(id);
    };
  }, [fetchUsb]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Usb className="w-4 h-4 text-blue-600" />
            USB Port Status (3x USB 3.1 + 2x USB 2.0)
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Live connection telemetry — physical ports, not user-controlled switches
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2.5 mb-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(ports || [{ id: 'usb1' }, { id: 'usb2' }, { id: 'usb3' }, { id: 'usb4' }, { id: 'usb5' }] as Partial<UsbPortInfo>[]).map((port, idx) => {
          const status = (port.status as InterfaceStatusValue) || 'unavailable';
          const meta = STATUS_META[status];
          const isConnected = status === 'connected';

          return (
            <div
              key={port.id || idx}
              className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{port.name || `USB Port ${idx + 1}`}</span>
                  {port.portStandard && (
                    <span className="text-[10px] font-semibold text-slate-400">{port.portStandard}</span>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${meta.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </div>

              {ports ? (
                isConnected ? (
                  <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-200/70">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Device</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[60%] text-right">{port.deviceName || 'Unknown device'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="text-slate-700 text-right">{port.deviceType || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speed</span>
                      <span className="font-mono text-slate-700">{port.usbSpeed || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Activity</span>
                      <span className="text-slate-700">{port.dataActivity || 'Unknown'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/70">No device connected</p>
                )
              ) : (
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/70">Loading…</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UsbPortStatusCard;
