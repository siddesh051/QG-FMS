import React, { useState } from 'react';
import { Radio, Terminal, Play, RotateCw, CheckCircle2 } from 'lucide-react';
import { CellularDiagnostics } from '../../../types/router';
import { INITIAL_CELLULAR_DIAG } from '../../../data/initialData';

interface CellularDiagnosticsPageProps {
  diagnostics?: CellularDiagnostics;
}

export const CellularDiagnosticsPage: React.FC<CellularDiagnosticsPageProps> = ({
  diagnostics = INITIAL_CELLULAR_DIAG,
}) => {
  const [customAt, setCustomAt] = useState('AT+QENG="servingcell"');
  const [running, setRunning] = useState(false);
  const [atTerminal, setAtTerminal] = useState<string[]>([
    'AT-Command Interface: /dev/ttyUSB2 (115200 8N1)',
    'Type AT commands below or select preset diagnostics.',
    '-------------------------------------------------------',
    '> AT+CSQ',
    '+CSQ: 26,99',
    'OK',
    '> AT+CPIN?',
    '+CPIN: READY',
    'OK',
    '> AT+QENG="servingcell"',
    '+QENG: "servingcell","NOCONN","NR5G-SA","TDD",404,45,1A4B02,184,520000,78,3,-92,-11,18,0,-',
    'OK',
  ]);

  const sendAtCommand = (cmd: string) => {
    setRunning(true);
    setAtTerminal((prev) => [...prev, `> ${cmd}`]);

    setTimeout(() => {
      let resp = 'OK';
      const upper = cmd.trim().toUpperCase();

      if (upper === 'AT') {
        resp = 'OK';
      } else if (upper === 'ATI') {
        resp = 'Quectel\nRM520N-GL\nRevision: RM520NGLAAR01A06M4G\nOK';
      } else if (upper.includes('CSQ')) {
        resp = '+CSQ: 26,99\nOK';
      } else if (upper.includes('CPIN')) {
        resp = '+CPIN: READY\nOK';
      } else if (upper.includes('CGATT')) {
        resp = '+CGATT: 1\nOK';
      } else if (upper.includes('QENG')) {
        resp = '+QENG: "servingcell","NOCONN","NR5G-SA","TDD",404,45,1A4B02,184,520000,78,3,-92,-11,18,0,-\nOK';
      } else {
        resp = `COMMAND EXECUTED\n[Response from modem /dev/ttyUSB2]\nOK`;
      }

      setAtTerminal((prev) => [...prev, resp]);
      setRunning(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">Diagnostics</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Modem Telemetry & AT Console</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Radio className="w-5 h-5 text-sky-300" />
          5G NR Modem Telemetry & Direct AT Terminal
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Low-level Hayes AT command interface and 3GPP Layer 1/2 diagnostic metrics for Quectel RM520N-GL modem.
        </p>
      </div>

      {/* Preset Command Quick Buttons */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-2 text-xs">
        <span className="text-slate-500 font-semibold">Quick Diagnostic Commands:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => sendAtCommand('ATI')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono border border-slate-300 cursor-pointer"
          >
            ATI (Firmware Info)
          </button>
          <button
            onClick={() => sendAtCommand('AT+CSQ')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono border border-slate-300 cursor-pointer"
          >
            AT+CSQ (Signal Quality)
          </button>
          <button
            onClick={() => sendAtCommand('AT+CPIN?')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono border border-slate-300 cursor-pointer"
          >
            AT+CPIN? (SIM State)
          </button>
          <button
            onClick={() => sendAtCommand('AT+CGATT?')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono border border-slate-300 cursor-pointer"
          >
            AT+CGATT? (GPRS/5G Attach)
          </button>
          <button
            onClick={() => sendAtCommand('AT+QENG="servingcell"')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono border border-slate-300 cursor-pointer"
          >
            AT+QENG="servingcell" (Cell Details)
          </button>
        </div>
      </div>

      {/* AT Terminal */}
      <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-emerald-400 shadow-md border border-slate-800">
        <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>MODEM RAW AT SERIAL CONSOLE</span>
          </div>
          <button
            onClick={() => setAtTerminal(['Terminal cleared.'])}
            className="hover:text-white cursor-pointer"
          >
            Clear
          </button>
        </div>

        <div className="h-64 overflow-y-auto space-y-1 pr-2">
          {atTerminal.map((line, i) => (
            <div key={i} className="leading-relaxed whitespace-pre-wrap">
              {line}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customAt) {
              sendAtCommand(customAt);
              setCustomAt('');
            }
          }}
          className="mt-3 pt-3 border-t border-slate-800 flex gap-2"
        >
          <input
            type="text"
            value={customAt}
            onChange={(e) => setCustomAt(e.target.value)}
            placeholder="Type AT command (e.g. AT+CSQ)..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
          />
          <button
            type="submit"
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs cursor-pointer"
          >
            {running ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
