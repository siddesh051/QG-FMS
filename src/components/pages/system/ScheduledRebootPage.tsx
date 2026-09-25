import React, { useState, useRef, useEffect } from 'react';
import { Power, Clock, Save, CheckCircle2, RotateCw, AlertTriangle, XCircle } from 'lucide-react';

export const ScheduledRebootPage: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [dayOfWeek, setDayOfWeek] = useState('Sunday');
  const [timeOfDay, setTimeOfDay] = useState('03:00');
  const [saved, setSaved] = useState(false);

  const [rebooting, setRebooting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRebootNow = () => {
    setRebooting(true);
    setCountdown(30);
    setCancelNotice(null);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRebooting(false);
          return 30;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleCancelReboot = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRebooting(false);
    setCountdown(30);
    setCancelNotice('Gateway reboot aborted by operator. Device remains active.');
    setTimeout(() => setCancelNotice(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">System / Firmware</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Scheduled Maintenance Reboot</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Power className="w-5 h-5 text-sky-300" />
          Maintenance Reboot & Watchdog Scheduling
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Automate periodic system reboot schedules to clear hardware caches and maintain zero-defect uptime.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Cron maintenance schedule updated in system crontab.</span>
        </div>
      )}

      {cancelNotice && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 border border-amber-300 rounded-md text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{cancelNotice}</span>
        </div>
      )}

      {/* Immediate Reboot Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Manual Gateway Reboot</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Safely flush sensor write buffers to NVMe and cleanly restart Linux kernel.
          </p>
        </div>

        <button
          onClick={handleRebootNow}
          disabled={rebooting}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Power className="w-4 h-4 text-red-400" />
          <span>Reboot Device Now</span>
        </button>
      </div>

      {/* Scheduled Configuration Form */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Automated Reboot Schedule</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-slate-600 font-medium">Schedule Enabled</span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </label>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Reboot Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Weekly">Weekly Scheduled Window</option>
                <option value="Daily">Daily Off-Peak</option>
                <option value="Monthly">Monthly Cycle</option>
              </select>
            </div>

            {frequency === 'Weekly' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Day of the Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Scheduled Execution Time (24h)
              </label>
              <input
                type="time"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Reboot Schedule</span>
            </button>
          </div>
        </form>
      </div>

      {/* Rebooting Countdown Overlay Modal */}
      {rebooting && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 p-6 max-w-sm w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <RotateCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Rebooting FluxGateway...</h3>
              <p className="text-xs text-slate-500">
                Shutting down daemons and initializing hardware boot sequence.
              </p>
            </div>
            <div className="text-2xl font-mono font-bold text-blue-600">
              {countdown}s
            </div>
            <p className="text-[11px] text-slate-400">
              Web console will automatically reconnect once HTTP daemon resumes.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCancelReboot}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Cancel Reboot Sequence</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
