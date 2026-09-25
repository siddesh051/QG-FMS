import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { 
  NavCategory, 
  SubPageId, 
  WanInterfaceType, 
  NetworkTechnology,
  DEFAULT_OPERATOR_PERMISSIONS,
  RolePermissions,
  SubsystemKey,
  PermissionLevel
} from './types/router';
import { 
  INITIAL_WAN_INTERFACES, 
  INITIAL_CELLULAR_DIAG, 
  INITIAL_SERVICES,
  INITIAL_DEVICE_INFO,
  INITIAL_CHANNELS
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';

// System / Maintenance
import { OverviewPage } from './components/pages/system/OverviewPage';
import { DeviceInfoPage } from './components/pages/system/DeviceInfoPage';
import { FirmwarePage } from './components/pages/system/FirmwarePage';
import { SystemUpdatesPage } from './components/pages/system/SystemUpdatesPage';
import { BackupPage } from './components/pages/system/BackupPage';
import { RestorePage } from './components/pages/system/RestorePage';
import { FactoryResetPage } from './components/pages/system/FactoryResetPage';
import { ScheduledRebootPage } from './components/pages/system/ScheduledRebootPage';

// Connectivity
import { CellularPage } from './components/pages/connectivity/CellularPage';
import { ApnPage } from './components/pages/connectivity/ApnPage';
import { WifiPage } from './components/pages/connectivity/WifiPage';
import { LanPage } from './components/pages/connectivity/LanPage';
import { WanPage } from './components/pages/connectivity/WanPage';
import { WanFailoverPage } from './components/pages/connectivity/WanFailoverPage';

// Protocols
// Protocols
import { MqttPage } from './components/pages/Services/MqttPage';
import { ModbusRtuPage } from './components/pages/Services/ModbusRtuPage';
import { ModbusTcpPage } from './components/pages/Services/ModbusTcpPage';
import { TlsCertificatesPage } from './components/pages/Services/TlsCertificatesPage';
import { SnmpPage } from './components/pages/Services/SnmpPage';
import { SmsPage } from './components/pages/Services/SmsPage';
import { QosPage } from './components/pages/Services/QosPage';
import { DTUPage } from './components/pages/Services/DTUPage';
// Security & Settings
import { UserManagementPage, UserAccount, INITIAL_USERS } from './components/pages/security/UserManagementPage';
import { SessionSettingsPage } from './components/pages/security/SessionSettingsPage';
import { VpnPage } from './components/pages/security/VpnPage';
import { FirewallPage } from './components/pages/security/FirewallPage';
import { NetworkPage } from './components/pages/network/NetworkPage';
import { DeviceVpnPage } from './components/pages/vpn/VpnPage';
import { SensorOverviewPage } from './components/pages/sensor/SensorOverviewPage';
import { SensorChannelsPage } from './components/pages/sensor/SensorChannelsPage';
import { SensorSamplingPage } from './components/pages/sensor/SensorSamplingPage';

// Diagnostics
import { PingTestPage } from './components/pages/diagnostics/PingTestPage';
import { IcmpPingPage } from './components/pages/connectivity/IcmpPingPage';
import { TraceroutePage } from './components/pages/diagnostics/TraceroutePage';
import { SystemLogsPage } from './components/pages/diagnostics/SystemLogsPage';
import { CellularDiagnosticsPage } from './components/pages/diagnostics/CellularDiagnosticsPage';
import { ServicesPage } from './components/pages/diagnostics/ServicesPage';

export default function App() {
  // Admin Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('fluxgateway_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  // Sync users to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('fluxgateway_users', JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  // Role-Based Access Control: Operator Permissions State & Persistence
  const [operatorPermissions, setOperatorPermissions] = useState<RolePermissions>(() => {
    try {
      const saved = localStorage.getItem('fluxgateway_operator_permissions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_OPERATOR_PERMISSIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('fluxgateway_operator_permissions', JSON.stringify(operatorPermissions));
    } catch {
      // ignore
    }
  }, [operatorPermissions]);

  const handleUpdateOperatorPermission = (subsystem: SubsystemKey, level: PermissionLevel) => {
    setOperatorPermissions((prev) => ({
      ...prev,
      [subsystem]: level,
    }));
  };

  const handleSetAllOperatorPermissions = (level: PermissionLevel) => {
    const updated: RolePermissions = {
      overview: level,
      wifi: level,
      apn: level,
      cellular: level,
      lan: level,
      wanFailover: level,
      diagnostics: level,
      protocols: level,
      security: level,
      firmware: level,
      factoryReset: level,
      userMgmt: 'read-only',
    };
    setOperatorPermissions(updated);
  };

  // Active navigation & network state
  const [currentPage, setCurrentPage] = useState<SubPageId>('overview');
  const [sensorChannels, setSensorChannels] = useState(INITIAL_CHANNELS);
  const [activeWan, setActiveWan] = useState<WanInterfaceType>('5G');
  const [networkTech, setNetworkTech] = useState<NetworkTechnology>('5G NR SA');

  // Dynamic live uptime clock (counts up while powered on, resets to 0 upon power on/reboot)
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(0);

  useEffect(() => {
    // Clock starts counting when device is turned on / app loads
    const interval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (totalSecs: number): string => {
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (days > 0) {
      return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  };

  // Default expansion state for categories
  const [expandedCategories, setExpandedCategories] = useState<Record<NavCategory, boolean>>({
    overview: false,
    connectivity: true,
    sensors: false,
    network: false,
    vpn: true,
    security: false,
    protocols: false,
    diagnostics: false,
    'user-mgmt': false,
    system: false,
  });

  const handleToggleCategory = (category: NavCategory) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSelectPage = (pageId: SubPageId) => {
    // Restrict User & Password Management from non-administrators
    if (pageId === 'user-mgmt' && currentUser?.role !== 'Administrator') {
      setCurrentPage('overview');
      return;
    }
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentPage('overview');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Map each page route to its governing subsystem
  const getSubsystemForPage = (page: SubPageId): SubsystemKey => {
    switch (page) {
      case 'overview':
      case 'device-info':
      case 'scheduled-reboot':
        return 'overview';
      case 'cellular':
        return 'cellular';
      case 'apn':
        return 'apn';
      case 'wifi':
        return 'wifi';
      case 'lan':
        return 'lan';
      case 'wan':
      case 'wan-failover':
        return 'wanFailover';
      case 'sensor-config':
      case 'sensor-overview':
      case 'sensor-channels':
      case 'sensor-sampling':
      case 'sensor-test':
      case 'sensor-health':
        return 'overview';
      case 'network-overview':
      case 'network-nat':
      case 'network-firewall':
      case 'network-access-control':
      case 'network-port-forwarding':
      case 'network-dmz':
      case 'network-dos':
      case 'network-vlan':
      case 'network-qos':
      case 'network-link-aggregation':
      case 'vpn-overview':
      case 'vpn-ipsec':
      case 'vpn-openvpn':
      case 'vpn-wireguard':
      case 'vpn-events':
      case 'vpn':
      case 'firewall':
      case 'session-settings':
      case 'config-backup':
      case 'config-restore':
        return 'security';
      case 'mqtt':
      case 'modbus-rtu':
      case 'modbus-tcp':
      case 'tls-certificates':
      case 'ntp-time':
      case 'snmp':
      case 'sms':
      case 'qos':
      case 'dtu':
        return 'protocols';      
      case 'diag-ping':
      case 'icmp-ping':
      case 'diag-traceroute':
      case 'diag-logs':
      case 'diag-cellular':
      case 'diag-services':
        return 'diagnostics';
      case 'firmware':
      case 'system-updates':
        return 'firmware';
      case 'factory-reset':
        return 'factoryReset';
      case 'user-mgmt':
        return 'userMgmt';
      default:
        return 'overview';
    }
  };

  const currentSubsystem = getSubsystemForPage(currentPage);

  // Compute write permission strictly based on authenticated role
  const hasWritePermission = ((): boolean => {
    if (!currentUser) return false;
    // Administrator has complete write access across all subsystems
    if (currentUser.role === 'Administrator') return true;
    // Read-Only Auditor is strictly read-only everywhere
    if (currentUser.role === 'Read-Only Auditor') return false;
    // Operator: user-mgmt is completely blocked; other subsystems follow RBAC matrix
    if (currentSubsystem === 'userMgmt') return false;
    return operatorPermissions[currentSubsystem] === 'read-write';
  })();

  // If not authenticated, require admin login before entering the EMS portal
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} users={users} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      // 1. Overview
      case 'overview':
        return (
          <OverviewPage
            onNavigate={handleSelectPage}
            activeWan={activeWan}
            onChangeActiveWan={setActiveWan}
            networkTech={networkTech}
            onChangeNetworkTech={setNetworkTech}
            currentUser={currentUser}
            uptime={formatUptime(uptimeSeconds)}
          />
        );

      // 2. Connectivity
      case 'cellular':
        return (
          <CellularPage
            initialData={INITIAL_CELLULAR_DIAG}
            networkTech={networkTech}
            onChangeNetworkTech={setNetworkTech}
            hasWritePermission={hasWritePermission}
          />
        );
      case 'apn':
        return <ApnPage hasWritePermission={hasWritePermission} />;
      case 'wifi':
        return <WifiPage hasWritePermission={hasWritePermission} />;
      case 'lan':
        return <LanPage hasWritePermission={hasWritePermission} />;
      case 'wan':
        return <WanPage hasWritePermission={hasWritePermission} />;
      case 'wan-failover':
        return (
          <WanFailoverPage
            interfaces={INITIAL_WAN_INTERFACES}
            hasWritePermission={hasWritePermission}
          />
        );

      // 3. Sensors
      case 'sensor-config':
      case 'sensor-overview':
      case 'sensor-channels':
        return <SensorOverviewPage channels={sensorChannels} onUpdateChannels={setSensorChannels} />;
      case 'sensor-test':
        return <SensorChannelsPage channels={sensorChannels} onUpdateChannels={setSensorChannels} />;
      case 'sensor-health':
      case 'sensor-sampling':
        return <SensorSamplingPage />;

      // 4. Network and VPN
      case 'network-overview':
      case 'network-nat':
      case 'network-firewall':
      case 'network-access-control':
      case 'network-port-forwarding':
      case 'network-dmz':
      case 'network-dos':
      case 'network-vlan':
      case 'network-qos':
      case 'network-link-aggregation':
        return <NetworkPage activeTab={currentPage.replace('network-', '') as any} hasWritePermission={hasWritePermission} />;
      case 'vpn-overview':
      case 'vpn-ipsec':
      case 'vpn-openvpn':
      case 'vpn-wireguard':
      case 'vpn-events':
        return <DeviceVpnPage activeTab={currentPage.replace('vpn-', '') as any} hasWritePermission={hasWritePermission} />;
      case 'vpn':
        return <VpnPage hasWritePermission={hasWritePermission} />;
      case 'firewall':
        return <FirewallPage hasWritePermission={hasWritePermission} />;
      case 'session-settings':
        return <SessionSettingsPage />;

      // 4. Protocols
      case 'mqtt':
        return <MqttPage />;
      case 'modbus-rtu':
        return <ModbusRtuPage />;
      case 'modbus-tcp':
        return <ModbusTcpPage />;
      case 'tls-certificates':
        return <TlsCertificatesPage />;
      case 'snmp':
        return <SnmpPage />;
      case 'sms':
        return <SmsPage />;
      case 'qos':
        return <QosPage />;
      case 'dtu':
        return <DTUPage />;
      // 5. Diagnostics
      case 'diag-ping':
        return <PingTestPage />;
      case 'icmp-ping':
        return <IcmpPingPage />;
      case 'diag-traceroute':
        return <TraceroutePage />;
      case 'diag-logs':
        return <SystemLogsPage />;
      case 'diag-cellular':
        return (
          <CellularDiagnosticsPage
            diagnostics={INITIAL_CELLULAR_DIAG}
          />
        );
      case 'diag-services':
        return <ServicesPage services={INITIAL_SERVICES} />;

      // 6. System & Maintenance
      case 'device-info':
        return <DeviceInfoPage deviceInfo={INITIAL_DEVICE_INFO} />;
      case 'user-mgmt':
        if (currentUser.role !== 'Administrator') {
          return (
            <div className="bg-white rounded-xl border border-red-200 p-8 shadow-xs text-center max-w-xl mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">Access Denied: Administrator Only</h2>
              <p className="text-xs text-slate-600 mb-2">
                User & Password Management is restricted to Administrators only.
              </p>
              <p className="text-xs text-slate-500">
                Your account is currently signed in as <strong>{currentUser.username}</strong> ({currentUser.role}).
              </p>
            </div>
          );
        }
        return (
          <UserManagementPage
            users={users}
            onUpdateUsers={setUsers}
            currentUser={currentUser}
            operatorPermissions={operatorPermissions}
            onUpdateOperatorPermission={handleUpdateOperatorPermission}
            onSetAllOperatorPermissions={handleSetAllOperatorPermissions}
          />
        );
      case 'firmware':
        return <FirmwarePage userRole={currentUser.role} hasWritePermission={hasWritePermission} />;
      case 'system-updates':
        return <SystemUpdatesPage hasWritePermission={hasWritePermission} />;
      case 'config-backup':
        return <BackupPage />;
      case 'config-restore':
        return <RestorePage />;
      case 'factory-reset':
        return <FactoryResetPage userRole={currentUser.role} hasWritePermission={hasWritePermission} />;
      case 'scheduled-reboot':
        return <ScheduledRebootPage />;

      default:
        return (
          <OverviewPage
            onNavigate={handleSelectPage}
            activeWan={activeWan}
            onChangeActiveWan={setActiveWan}
            networkTech={networkTech}
            onChangeNetworkTech={setNetworkTech}
            currentUser={currentUser}
            uptime={formatUptime(uptimeSeconds)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 font-sans antialiased">
      <div className="mx-auto flex h-screen w-full max-w-[1800px] flex-col overflow-hidden border-x border-slate-200/80 bg-slate-100 shadow-[0_0_0_1px_rgba(15,23,42,0.02)]">
        {/* Persistent EMS Header */}
        <Header
          activeWan={activeWan}
          uptime={formatUptime(uptimeSeconds)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main App Layout: Left Sidebar + Right Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Collapsible Left Navigation Bar */}
          <Sidebar
            currentPage={currentPage}
            onSelectPage={handleSelectPage}
            expandedCategories={expandedCategories}
            onToggleCategory={handleToggleCategory}
            userRole={currentUser.role}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1500px] pb-12">
              {!hasWritePermission && (
                <div className="mb-5 flex items-center justify-between p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-2">
                        <span>Read-Only Policy Enforced</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-200 text-amber-950 font-mono">
                          {currentUser.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 mt-0.5">
                        Modifications are restricted for your role. Configuration changes and parameter submissions are locked in read-only mode.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2.5 py-1 rounded-md border border-amber-300 shrink-0 hidden sm:inline-block">
                    View Only
                  </span>
                </div>
              )}

              <div className={!hasWritePermission ? 'read-only-scope' : ''}>
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
