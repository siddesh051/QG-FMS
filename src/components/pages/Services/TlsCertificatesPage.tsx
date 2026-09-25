import React, { useRef, useState } from 'react';
import { FileKey, Upload } from 'lucide-react';
import { ServiceBanner, Panel } from './ServiceUI';

type Cert = {
  name: string;
  type: string;
  usedBy: string | null;
  validUntil: string;
};

const initialCerts: Cert[] = [
  { name: 'mqtt-broker-client-cert', type: 'Client cert + key', usedBy: 'MQTT client', validUntil: '2027-06-01' },
  { name: 'site-ca-root', type: 'CA certificate', usedBy: 'MQTT client', validUntil: '2029-01-15' },
  { name: 'modbus-tls-client', type: 'Client cert + key', usedBy: null, validUntil: '2026-11-20' },
];

export const TlsCertificatesPage: React.FC = () => {
  const [certs, setCerts] = useState<Cert[]>(initialCerts);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCerts((prev) => [
      { name: file.name.replace(/\.[^/.]+$/, ''), type: 'Client cert + key', usedBy: null, validUntil: 'Pending validation' },
      ...prev,
    ]);
    e.target.value = '';
  };

  return (
    <div>
      <ServiceBanner
        breadcrumb="Protocols / Integration Security"
        icon={<FileKey className="w-5 h-5" />}
        title="TLS Certificate Store"
        description="Client and CA certificates used to authenticate this gateway to outbound MQTT and Modbus-over-TLS connections. Separate from the portal's own HTTPS certificate under Security."
      />

      <Panel>
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm font-bold text-slate-900">Stored Certificates</div>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <Upload size={15} /> Upload certificate
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pem,.crt,.key,.cer"
            className="hidden"
            onChange={handleFileSelected}
          />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-3 font-semibold rounded-l-lg">Name</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Used by</th>
              <th className="px-4 py-3 font-semibold">Valid until</th>
              <th className="px-4 py-3 font-semibold rounded-r-lg"></th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c) => (
              <tr key={c.name} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                <td className="px-4 py-3 text-slate-500">{c.type}</td>
                <td className="px-4 py-3">
                  {c.usedBy ? (
                    <span className="bg-blue-50 text-[#1e3a8a] text-xs font-semibold px-2.5 py-1 rounded-full">{c.usedBy}</span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-full">Unused</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-slate-700">{c.validUntil}</td>
                <td
                  className="px-4 py-3 text-[#1e3a8a] font-semibold cursor-pointer"
                  onClick={() => setCerts((prev) => prev.filter((x) => x.name !== c.name))}
                >
                  Remove
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
};