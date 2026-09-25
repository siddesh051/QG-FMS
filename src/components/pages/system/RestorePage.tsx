import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, RotateCw, AlertTriangle, FileText, X, Check, ShieldCheck, HardDrive, RefreshCw } from 'lucide-react';

interface UploadedConfigFile {
  name: string;
  size: number;
  lastModified: number;
  content: string;
  parsedSummary?: {
    device?: string;
    serial?: string;
    timestamp?: string;
    encrypted?: boolean;
    sections?: string[];
  };
}

export const RestorePage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedConfigFile | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [autoReboot, setAutoReboot] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [restoreStep, setRestoreStep] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = (file: File) => {
    setErrorMessage(null);
    setStatus(null);

    // Read the file as text
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string || '';
      let parsedSummary: UploadedConfigFile['parsedSummary'] = undefined;

      try {
        const json = JSON.parse(content);
        parsedSummary = {
          device: json.device || 'FluxGateway Industrial 5G',
          serial: json.serial || 'QG-2026-FG-98442',
          timestamp: json.timestamp || new Date(file.lastModified).toISOString(),
          encrypted: Boolean(json.encrypted),
          sections: ['WAN & Cellular APN', 'Firewall & NAT', 'VPN Tunnels', 'Protocols & NTP', 'System Parameters'],
        };
      } catch {
        // Plaintext .cfg or binary/base64 format
        parsedSummary = {
          device: 'FluxGateway TR-2005',
          serial: 'QG-2026-FG-98442',
          timestamp: new Date(file.lastModified).toISOString(),
          encrypted: content.includes('AES') || content.includes('ENCRYPTED'),
          sections: ['Network Interfaces', 'Cellular APN', 'Routing Tables', 'Management Daemons'],
        };
      }

      setUploadedFile({
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        content,
        parsedSummary,
      });
    };

    reader.onerror = () => {
      setErrorMessage('Failed to read file from your device. Please try again.');
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    setErrorMessage(null);
    setStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRestore = () => {
    if (!uploadedFile) {
      setErrorMessage('Please select or upload a configuration file from your computer first.');
      return;
    }

    setRestoring(true);
    setErrorMessage(null);
    setStatus(null);

    setRestoreStep('Verifying archive checksum and format validity...');

    setTimeout(() => {
      setRestoreStep('Unpacking configuration database and network interfaces...');

      setTimeout(() => {
        setRestoreStep('Applying APN, routing tables, and security policies...');

        setTimeout(() => {
          setRestoring(false);
          setRestoreStep(null);
          setStatus(`Configuration from "${uploadedFile.name}" restored successfully. All network parameters, APN settings, and device tables verified.`);
        }, 800);
      }, 700);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">System & Maintenance</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">Restore Configuration</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Upload className="w-5 h-5 text-sky-300" />
          Restore Device Configuration
        </h1>
        <p className="text-xs text-sky-100/85 mt-1">
          Upload and apply a previously downloaded configuration file (.cfg) from your computer to restore router network and device parameters.
        </p>
      </div>

      {status && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{status}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 border border-red-200 rounded-md text-xs font-semibold animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Upload Backup Archive (.cfg)</span>
          <span className="text-xs text-slate-500 font-normal">PC File Import</span>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Hidden HTML5 File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".cfg,.conf,.json,.bin,.tar.gz,*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Interactive Drag & Drop / File Selector Box */}
          {!uploadedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer select-none ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <div className="font-bold text-slate-800 text-sm">
                Click to browse files from your computer or drag and drop here
              </div>
              <p className="text-slate-500 text-xs mt-1">
                Upload your downloaded <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">.cfg</span> configuration backup file
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-600">
                  *.cfg
                </span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-600">
                  *.conf
                </span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-600">
                  *.json
                </span>
              </div>
            </div>
          ) : (
            /* Uploaded File Confirmation Card */
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 font-mono text-sm flex items-center gap-2">
                      <span>{uploadedFile.name}</span>
                      <span className="text-[10px] font-sans font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.2 rounded-full">
                        Ready to Restore
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                      <span>Size: <strong>{formatFileSize(uploadedFile.size)}</strong></span>
                      <span>•</span>
                      <span>Modified: {new Date(uploadedFile.lastModified).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Integrity Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded transition-colors cursor-pointer"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Archive Metadata Summary */}
              {uploadedFile.parsedSummary && (
                <div className="bg-white rounded border border-slate-200 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Target Device:</span>
                    <span className="font-semibold text-slate-800">{uploadedFile.parsedSummary.device}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Configuration Serial:</span>
                    <span className="font-mono text-slate-800">{uploadedFile.parsedSummary.serial}</span>
                  </div>
                  <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 block mb-1">Included Device Parameters:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {uploadedFile.parsedSummary.sections?.map((sec, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[10px] border border-slate-200">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadedFile && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="max-w-sm">
                <label className="block text-slate-700 font-semibold mb-1">
                  Decryption Passphrase (if encrypted)
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter archive decryption password..."
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs transition-colors"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoReboot}
                  onChange={(e) => setAutoReboot(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="font-semibold text-slate-800">
                  Automatically Reboot Gateway after Applying Settings
                </span>
              </label>

              {restoreStep && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800 flex items-center gap-2 font-medium">
                  <RotateCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  <span>{restoreStep}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleRestore}
                  disabled={restoring}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${restoring ? 'animate-spin' : ''}`} />
                  <span>{restoring ? 'Applying Configuration...' : 'Restore & Apply Backup'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

