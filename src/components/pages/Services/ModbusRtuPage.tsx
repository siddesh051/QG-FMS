import React, { useState } from 'react';
import { Network, Save, CheckCircle2, Cpu } from 'lucide-react';

export const ModbusRtuPage: React.FC = () => {
  const [serialPort, setSerialPort] = useState('/dev/ttyS0 (RS-485)');
  const [baudRate, setBaudRate] = useState('115200');
  const [dataBits, setDataBits] = useState('8');
  const [parity, setParity] = useState('None');
  const [stopBits, setStopBits] = useState('1');
  const [slaveId, setSlaveId] = useState('1');
  const [timeout, setTimeoutVal] = useState('1000');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
          <span className="text-white font-semibold">Modbus RTU</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Network className="w-5 h-5 text-sky-300" />
          Modbus RTU Serial Configuration
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Configure physical RS-485 / RS-232 serial communication bus for industrial field instruments.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Modbus RTU serial parameters saved. UART driver re-initialized.</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
          Serial Line Parameters
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Hardware Serial Port <span className="text-red-500">*</span>
              </label>
              <select
                value={serialPort}
                onChange={(e) => setSerialPort(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="/dev/ttyS0 (RS-485)">/dev/ttyS0 (Isolated RS-485 Half-Duplex)</option>
                <option value="/dev/ttyS1 (RS-232)">/dev/ttyS1 (RS-232 Full Duplex)</option>
                <option value="/dev/ttyUSB0 (USB-Serial)">/dev/ttyUSB0 (External USB Serial)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Baud Rate (bps) <span className="text-red-500">*</span>
              </label>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="9600">9600 bps</option>
                <option value="19200">19200 bps</option>
                <option value="38400">38400 bps</option>
                <option value="57600">57600 bps</option>
                <option value="115200">115200 bps</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Data Bits</label>
              <select
                value={dataBits}
                onChange={(e) => setDataBits(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="8">8 Bits</option>
                <option value="7">7 Bits</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Parity</label>
              <select
                value={parity}
                onChange={(e) => setParity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="None">None (No Parity)</option>
                <option value="Even">Even Parity</option>
                <option value="Odd">Odd Parity</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Stop Bits</label>
              <select
                value={stopBits}
                onChange={(e) => setStopBits(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="1">1 Stop Bit</option>
                <option value="2">2 Stop Bits</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Modbus Slave ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="247"
                value={slaveId}
                onChange={(e) => setSlaveId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Range: 1 to 247</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Modbus RTU Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
