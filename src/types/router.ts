export type NavCategory = 
  | 'overview'
  | 'connectivity'
  | 'network'
  | 'vpn'
  | 'security'
  | 'protocols'
  | 'diagnostics'
  | 'user-mgmt'
  | 'system';

export type SubPageId =
  // Overview
  | 'overview'
  // Connectivity
  | 'cellular'
  | 'apn'
  | 'wifi'
  | 'lan'
  | 'wan'
  | 'wan-failover'
  // Network
  | 'network-overview'
  | 'network-nat'
  | 'network-firewall'
  | 'network-access-control'
  | 'network-port-forwarding'
  | 'network-dmz'
  | 'network-dos'
  | 'network-vlan'
  | 'network-qos'
  | 'network-link-aggregation'
  // VPN
  | 'vpn-overview'
  | 'vpn-ipsec'
  | 'vpn-openvpn'
  | 'vpn-wireguard'
  | 'vpn-events'
  // Security
  | 'vpn'
  | 'firewall'
  | 'session-settings'
  // Protocols
  | 'mqtt'
  | 'modbus-rtu'
  | 'modbus-tcp'
  | 'tls-certificates'
  | 'ntp-time'
  | 'snmp'
  | 'sms'
  | 'qos'
  | 'dtu'  
  // Diagnostics
  | 'diag-ping'
  | 'icmp-ping'
  | 'diag-traceroute'
  | 'diag-logs'
  | 'diag-cellular'
  | 'diag-services'
  // User Management
  | 'user-mgmt'
  // System & Maintenance
  | 'device-info'
  | 'firmware'
  | 'system-updates'
  | 'config-backup'
  | 'config-restore'
  | 'factory-reset'
  | 'scheduled-reboot';

export type SensorType = '4–20 mA' | '0–10 V' | 'Binary';

export interface SensorChannel {
  id: string; // e.g. "CH01"
  number: number; // 1 to 16
  name: string;
  type: SensorType;
  value: number | string;
  unit: string;
  rawAdc: number;
  status: 'Active' | 'Inactive' | 'Alarm';
  enabled: boolean;
  sampleRate: number; // SPS (1 to 1000)
  description: string;
  minAlarm?: number;
  maxAlarm?: number;
}

export type NetworkTechnology = '5G NR SA' | '4G LTE-A';

export type SubsystemKey = 
  | 'overview'
  | 'wifi'
  | 'apn'
  | 'cellular'
  | 'lan'
  | 'wanFailover'
  | 'diagnostics'
  | 'protocols'
  | 'security'
  | 'firmware'
  | 'factoryReset'
  | 'userMgmt';

export type PermissionLevel = 'read-only' | 'read-write';

export type RolePermissions = Record<SubsystemKey, PermissionLevel>;

export const DEFAULT_OPERATOR_PERMISSIONS: RolePermissions = {
  overview: 'read-write',
  wifi: 'read-write',
  apn: 'read-write',
  cellular: 'read-write',
  lan: 'read-write',
  wanFailover: 'read-only',
  diagnostics: 'read-write',
  protocols: 'read-write',
  security: 'read-only',
  firmware: 'read-only',
  factoryReset: 'read-only',
  userMgmt: 'read-only',
};

export type WanInterfaceType = '5G' | 'LTE' | 'Wi-Fi' | 'Ethernet' | 'Fiber';

export interface WanInterface {
  id: string;
  name: WanInterfaceType;
  priority: number;
  status: 'Active' | 'Standby' | 'Disconnected' | 'Disabled';
  ipAddress: string;
  latencyMs: number;
  packetLoss: number;
}

export interface CellularDiagnostics {
  network: NetworkTechnology;
  band: string;
  arfcn: number;
  rssi: number; // dBm
  rsrp: number; // dBm
  rsrq: number; // dB
  sinr: number; // dB
  pci: number;
  mcc: number;
  mnc: string;
  imei: string;
  simStatus: 'Ready' | 'Missing' | 'Locked';
  modemModel: string;
}

export interface RouterService {
  name: string;
  id: string;
  status: 'Running' | 'Stopped' | 'Restarting';
  uptime: string;
  cpuPercent: number;
  memoryMb: number;
}

export interface FirewallRule {
  id: string;
  destination: string;
  port: number | string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ALL';
  action: 'Allow' | 'Drop';
  description: string;
}

export interface TlsCertificate {
  id: string;
  name: string;
  type: 'Device Certificate' | 'CA Certificate' | 'Client Certificate' | 'Private Key';
  subject: string;
  issuer: string;
  validUntil: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  fingerprint: string;
}

export interface DeviceInfo {
  model: string;
  hardwareVersion: string;
  serialNumber: string;
  macAddress: string;
  imei: string;
  firmwareVersion: string;
  uptime: string;
  systemTime: string;
}

/* -------------------------------------------------------------------------
 * Real-time interface telemetry & System Updates types
 * ---------------------------------------------------------------------- */

// Live connection state for a physical or network interface.
// NOTE: physical interfaces are always represented with a status value
// like these, never as a user-controlled ON/OFF toggle.
export type InterfaceStatusValue =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'error'
  | 'unavailable';

export type NetworkInterfaceName =
  | '5G'
  | 'LTE'
  | 'Ethernet'
  | 'Wi-Fi'
  | 'WAN'
  | 'Fiber'
  | 'SATCOM';

export interface NetworkInterfaceStatus {
  id: string;
  name: NetworkInterfaceName;
  category: 'network';
  status: InterfaceStatusValue;
  details?: string;
  lastUpdated: string;
}

export interface UsbPortInfo {
  id: string;
  name: string;
  category: 'physical';
  portStandard?: 'USB 3.1' | 'USB 2.0';
  status: InterfaceStatusValue;
  deviceName?: string;
  deviceType?: string;
  usbSpeed?: string;
  dataActivity?: 'Idle' | 'Reading' | 'Writing' | 'Active' | 'Unknown';
  lastUpdated: string;
}

// Serial / UART interfaces — RS232 / RS485 / TTL per datasheet.
export interface SerialPortInfo {
  id: string;
  name: string;
  category: 'physical';
  protocol: 'RS232' | 'RS485' | 'TTL';
  status: InterfaceStatusValue;
  baudRate?: number;
  details?: string;
  lastUpdated: string;
}

// Programmable GPIO / Digital I/O lines.
export interface DigitalIoStatus {
  id: string;
  name: string;
  category: 'physical';
  direction: 'Input' | 'Output';
  state: 'High' | 'Low';
  lastUpdated: string;
}

// PoE (Power over Ethernet) ports — IEEE 802.3af/at.
export interface PoePortInfo {
  id: string;
  name: string;
  category: 'physical';
  status: InterfaceStatusValue;
  standard: string;
  poweredDeviceDetected: boolean;
  powerDrawW?: number;
  maxPowerW: number;
  lastUpdated: string;
}

// Battery-backed Real-Time Clock.
export interface RtcStatus {
  batteryOk: boolean;
  currentTime: string;
  driftSeconds: number;
  lastSynced: string;
}

export interface SystemInfo {
  firmwareVersion: string;
  softwareVersion: string;
  buildNumber: string;
  releaseDate: string;
  deviceModel: string;
}

export type UpdateCheckStatus =
  | 'idle'
  | 'checking'
  | 'up-to-date'
  | 'update-available'
  | 'error';

export interface UpdateDetails {
  latestVersion: string;
  releaseDate: string;
  releaseNotes: string[];
  packageSizeMb: number;
  isAvailable: boolean;
}

export interface UpdateCheckResult {
  status: UpdateCheckStatus;
  currentVersion: string;
  update?: UpdateDetails;
  lastChecked: string;
  errorMessage?: string;
}
