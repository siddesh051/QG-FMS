import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Settings2, 
  ChevronDown, 
  ChevronRight
} from 'lucide-react';
import { SubPageId, NavCategory } from '../types/router';

interface SidebarProps {
  currentPage: SubPageId;
  onSelectPage: (page: SubPageId) => void;
  expandedCategories: Record<NavCategory, boolean>;
  onToggleCategory: (category: NavCategory) => void;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  expandedCategories,
  onToggleCategory,
  userRole = 'Administrator',
}) => {
  const isCategoryActive = (category: NavCategory) => {
    switch (category) {
      case 'overview':
        return currentPage === 'overview';
      case 'connectivity':
        return ['cellular', 'apn', 'wifi', 'lan', 'wan', 'wan-failover'].includes(currentPage);
      case 'network':
        return ['network-overview', 'network-nat', 'network-firewall', 'network-access-control', 'network-port-forwarding', 'network-dmz', 'network-dos', 'network-vlan', 'network-qos', 'network-link-aggregation'].includes(currentPage);
      case 'vpn':
        return ['vpn-overview', 'vpn-ipsec', 'vpn-openvpn', 'vpn-wireguard', 'vpn-events'].includes(currentPage);
      case 'security':
        return ['vpn', 'firewall', 'session-settings'].includes(currentPage);
      case 'protocols':
        return ['mqtt', 'modbus-rtu', 'modbus-tcp', 'tls-certificates', 'snmp', 'sms', 'qos', 'dtu'].includes(currentPage);
      case 'diagnostics':
        return ['diag-ping', 'icmp-ping', 'diag-traceroute', 'diag-logs', 'diag-cellular', 'diag-services'].includes(currentPage);
      case 'system':
        return ['device-info', 'user-mgmt', 'firmware', 'system-updates', 'config-backup', 'config-restore', 'factory-reset', 'scheduled-reboot'].includes(currentPage);
      default:
        return false;
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none text-slate-700">
      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
        {/* 1. Overview */}
        <button
          type="button"
          onClick={() => onSelectPage('overview')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            currentPage === 'overview'
              ? 'bg-blue-50 text-[#1e3a8a] font-semibold border-l-2 border-[#1e3a8a]'
              : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentPage === 'overview' ? 'text-[#1e3a8a]' : 'text-slate-400'}`} />
          <span>Overview</span>
        </button>

        {/* 2. Connectivity */}
        <div>
          <button
            type="button"
            onClick={() => onToggleCategory('connectivity')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isCategoryActive('connectivity') && !expandedCategories.connectivity
                ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <Radio className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Connectivity</span>
            </div>
            {expandedCategories.connectivity ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {expandedCategories.connectivity && (
            <div className="ml-5 pl-2.5 my-1 border-l border-slate-200 space-y-0.5">
              {[
                { id: 'cellular', label: 'Cellular' },
                { id: 'apn', label: 'APN Configuration' },
                { id: 'wifi', label: 'Wi-Fi Connection' },
                { id: 'lan', label: 'LAN Interface' },
                { id: 'wan', label: 'WAN' },
                { id: 'wan-failover', label: 'WAN Failover' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPage(item.id as SubPageId)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11.5px] transition-colors cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Network */}
        <div>
          <button
            type="button"
            onClick={() => onToggleCategory('network')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isCategoryActive('network') && !expandedCategories.network
                ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <Radio className="w-4 h-4 shrink-0 text-slate-400" />
              <span>NETWORK</span>
            </div>
            {expandedCategories.network ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {expandedCategories.network && (
            <div className="ml-5 pl-2.5 my-1 border-l border-slate-200 space-y-0.5">
              {[
                { id: 'network-overview', label: 'Overview' },
                { id: 'network-nat', label: 'NAT' },
                { id: 'network-firewall', label: 'Firewall' },
                { id: 'network-access-control', label: 'Access Control' },
                { id: 'network-port-forwarding', label: 'Port Forwarding' },
                { id: 'network-dmz', label: 'DMZ' },
                { id: 'network-dos', label: 'DoS Protection' },
                { id: 'network-vlan', label: 'VLAN' },
                { id: 'network-qos', label: 'QoS' },
                { id: 'network-link-aggregation', label: 'Link Aggregation' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPage(item.id as SubPageId)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11.5px] transition-colors cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. VPN */}
        <div>
          <button
            type="button"
            onClick={() => onToggleCategory('vpn')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isCategoryActive('vpn') && !expandedCategories.vpn
                ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 shrink-0 text-slate-400" />
              <span>VPN</span>
            </div>
            {expandedCategories.vpn ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {expandedCategories.vpn && (
            <div className="ml-5 pl-2.5 my-1 border-l border-slate-200 space-y-0.5">
              {[
                { id: 'vpn-overview', label: 'Overview' },
                { id: 'vpn-ipsec', label: 'IPsec' },
                { id: 'vpn-openvpn', label: 'OpenVPN' },
                { id: 'vpn-wireguard', label: 'WireGuard' },
                { id: 'vpn-events', label: 'VPN Events' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPage(item.id as SubPageId)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11.5px] transition-colors cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Services (formerly Protocols) */}
        <div>
          <button
            type="button"
            onClick={() => onToggleCategory('protocols')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isCategoryActive('protocols') && !expandedCategories.protocols
                ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Services</span>
            </div>
            {expandedCategories.protocols ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {expandedCategories.protocols && (
            <div className="ml-5 pl-2.5 my-1 border-l border-slate-200 space-y-0.5">
              {[
                { id: 'modbus-tcp', label: 'Modbus TCP' },
                { id: 'modbus-rtu', label: 'Modbus RTU' },
                { id: 'mqtt', label: 'MQTT Client' },
                { id: 'snmp', label: 'SNMP' },
                { id: 'sms', label: 'SMS' },
                { id: 'qos', label: 'QoS' },
                { id: 'dtu', label: 'DTU / Serial Bridge' },
                { id: 'tls-certificates', label: 'TLS Certificates' },
              ].map((item) => (                
              <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPage(item.id as SubPageId)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11.5px] transition-colors cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. Diagnostics */}
        <div>
          <button
            type="button"
            onClick={() => onToggleCategory('diagnostics')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isCategoryActive('diagnostics') && !expandedCategories.diagnostics
                ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Diagnostics</span>
            </div>
            {expandedCategories.diagnostics ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {expandedCategories.diagnostics && (
            <div className="ml-5 pl-2.5 my-1 border-l border-slate-200 space-y-0.5">
              {[
                { id: 'diag-ping', label: 'Ping Diagnostic' },
                { id: 'icmp-ping', label: 'ICMP Continuous' },
                { id: 'diag-traceroute', label: 'Traceroute' },
                { id: 'diag-logs', label: 'System Logs' },
                { id: 'diag-cellular', label: 'Modem Telemetry' },
                { id: 'diag-services', label: 'Services Monitor' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPage(item.id as SubPageId)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11.5px] transition-colors cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 6. System & Maintenance */}
        <div>
          <button
            type="button"
            onClick={() => onToggleCategory('system')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isCategoryActive('system') && !expandedCategories.system
                ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings2 className="w-4 h-4 shrink-0 text-slate-400" />
              <span>System & Maintenance</span>
            </div>
            {expandedCategories.system ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {expandedCategories.system && (
            <div className="ml-5 pl-2.5 my-1 border-l border-slate-200 space-y-0.5">
              {[
                { id: 'device-info', label: 'Device Information' },
                ...(userRole === 'Administrator' ? [{ id: 'user-mgmt', label: 'User & Password Management' }] : []),
                { id: 'firmware', label: 'Firmware Upgrade' },
                { id: 'system-updates', label: 'System Updates' },
                { id: 'config-backup', label: 'Backup Configuration' },
                { id: 'config-restore', label: 'Restore Configuration' },
                { id: 'factory-reset', label: 'Factory Reset' },
                { id: 'scheduled-reboot', label: 'Scheduled Reboot' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPage(item.id as SubPageId)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11.5px] transition-colors cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Status Info */}
      <div className="p-3 border-t border-slate-200 text-[11px] text-slate-500 bg-slate-50">
        <div className="flex items-center justify-between">
          <span>Firmware</span>
          <span className="font-mono text-slate-700">v2.4.1-rc3</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>Cellular</span>
          <span className="text-emerald-600 font-medium">Online (5G SA)</span>
        </div>
      </div>
    </aside>
  );
};
