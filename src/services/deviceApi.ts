import {
  NetworkInterfaceStatus,
  UsbPortInfo,
  SerialPortInfo,
  DigitalIoStatus,
  PoePortInfo,
  RtcStatus,
} from '../types/router';

/**
 * FluxGateway Device Telemetry API service layer.
 *
 * Production usage: point VITE_FLUXGATEWAY_API_BASE at the real FluxGateway
 * device/EMS backend and this module will call:
 *   GET /api/interfaces/status
 *   GET /api/interfaces/usb
 *
 * Development fallback: when no backend is configured (or a request fails),
 * calls fall back to clearly-marked simulated telemetry below so the UI
 * stays usable during local development/demos. This mock layer is isolated
 * from the production request logic and should be removed once the real
 * FluxGateway backend is connected.
 */

const API_BASE: string =
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_FLUXGATEWAY_API_BASE || '';
const REQUEST_TIMEOUT_MS = 6000;

class NoBackendConfiguredError extends Error {
  constructor() {
    super('NO_BACKEND_CONFIGURED');
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  if (!API_BASE) {
    throw new NoBackendConfiguredError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`API_ERROR_${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error('API_TIMEOUT');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

function nowTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

// ---------------------------------------------------------------------------
// MOCK DATA — development fallback only. Simulated telemetry, not real
// hardware state. Isolated from the production request logic above.
// ---------------------------------------------------------------------------

// Keeps USB2's simulated connection state mostly stable between polls
// instead of flickering every tick, to look like plausible live telemetry.
let mockUsb2Connected = true;

function buildMockInterfaceStatus(): NetworkInterfaceStatus[] {
  const t = nowTime();
  return [
    { id: 'iface-5g', name: '5G', category: 'network', status: 'connected', details: 'n78 (3500 MHz), -68 dBm', lastUpdated: t },
    { id: 'iface-lte', name: 'LTE', category: 'network', status: 'disconnected', details: 'Standby (failover only)', lastUpdated: t },
    { id: 'iface-ethernet', name: 'Ethernet', category: 'network', status: 'connected', details: '1000 Mbps Full-Duplex', lastUpdated: t },
    { id: 'iface-wifi', name: 'Wi-Fi', category: 'network', status: 'connected', details: 'Wi-Fi 6, 172.16.20.88', lastUpdated: t },
    { id: 'iface-wan', name: 'WAN', category: 'network', status: 'connected', details: 'Active default route', lastUpdated: t },
    { id: 'iface-fiber', name: 'Fiber', category: 'network', status: 'disconnected', details: 'SFP+ module not present', lastUpdated: t },
    { id: 'iface-satcom', name: 'SATCOM', category: 'network', status: 'disconnected', details: 'No satellite modem detected', lastUpdated: t },
  ];
}

function buildMockUsbStatus(): UsbPortInfo[] {
  const t = nowTime();
  // Small chance per poll of a simulated hot-plug/unplug event on USB2.
  if (Math.random() < 0.08) {
    mockUsb2Connected = !mockUsb2Connected;
  }

  // Per datasheet: 3 x USB 3.1 + 2 x USB 2.0.
  return [
    {
      id: 'usb1',
      name: 'USB Port 1',
      category: 'physical',
      portStandard: 'USB 3.1',
      status: 'connected',
      deviceName: 'SanDisk Ultra USB 3.1',
      deviceType: 'Mass Storage Device',
      usbSpeed: 'USB 3.1 Gen 1 (5 Gbps)',
      dataActivity: 'Idle',
      lastUpdated: t,
    },
    {
      id: 'usb2',
      name: 'USB Port 2',
      category: 'physical',
      portStandard: 'USB 3.1',
      status: mockUsb2Connected ? 'connected' : 'disconnected',
      deviceName: mockUsb2Connected ? 'FTDI USB-Serial Adapter' : undefined,
      deviceType: mockUsb2Connected ? 'Serial / COM Bridge' : undefined,
      usbSpeed: mockUsb2Connected ? 'USB 3.1 Gen 1 (5 Gbps)' : undefined,
      dataActivity: mockUsb2Connected ? 'Active' : undefined,
      lastUpdated: t,
    },
    {
      id: 'usb3',
      name: 'USB Port 3',
      category: 'physical',
      portStandard: 'USB 3.1',
      status: 'disconnected',
      lastUpdated: t,
    },
    {
      id: 'usb4',
      name: 'USB Port 4',
      category: 'physical',
      portStandard: 'USB 2.0',
      status: 'connected',
      deviceName: 'Generic USB Keyboard',
      deviceType: 'HID Device',
      usbSpeed: 'USB 2.0 (480 Mbps)',
      dataActivity: 'Idle',
      lastUpdated: t,
    },
    {
      id: 'usb5',
      name: 'USB Port 5',
      category: 'physical',
      portStandard: 'USB 2.0',
      status: 'disconnected',
      lastUpdated: t,
    },
  ];
}

function buildMockSerialStatus(): SerialPortInfo[] {
  const t = nowTime();
  // Per datasheet: 3 x UART ports — RS232 / RS485 / TTL.
  return [
    {
      id: 'uart1',
      name: 'UART 1',
      category: 'physical',
      protocol: 'RS232',
      status: 'connected',
      baudRate: 115200,
      details: 'Console / Modbus RTU master',
      lastUpdated: t,
    },
    {
      id: 'uart2',
      name: 'UART 2',
      category: 'physical',
      protocol: 'RS485',
      status: 'connected',
      baudRate: 9600,
      details: 'Field bus — Modbus RTU slave devices',
      lastUpdated: t,
    },
    {
      id: 'uart3',
      name: 'UART 3',
      category: 'physical',
      protocol: 'TTL',
      status: 'disconnected',
      lastUpdated: t,
    },
  ];
}

function buildMockDigitalIoStatus(): DigitalIoStatus[] {
  const t = nowTime();
  return [
    { id: 'gpio1', name: 'GPIO 1', category: 'physical', direction: 'Input', state: 'High', lastUpdated: t },
    { id: 'gpio2', name: 'GPIO 2', category: 'physical', direction: 'Input', state: 'Low', lastUpdated: t },
    { id: 'gpio3', name: 'GPIO 3', category: 'physical', direction: 'Output', state: 'High', lastUpdated: t },
    { id: 'gpio4', name: 'GPIO 4', category: 'physical', direction: 'Output', state: 'Low', lastUpdated: t },
  ];
}

function buildMockPoeStatus(): PoePortInfo[] {
  const t = nowTime();
  // Per datasheet: 2 x PoE ports, IEEE 802.3af/at, up to 30W/port, 60W total.
  return [
    {
      id: 'poe1',
      name: 'PoE Port 1',
      category: 'physical',
      status: 'connected',
      standard: 'IEEE 802.3at',
      poweredDeviceDetected: true,
      powerDrawW: 12.4,
      maxPowerW: 30,
      lastUpdated: t,
    },
    {
      id: 'poe2',
      name: 'PoE Port 2',
      category: 'physical',
      status: 'disconnected',
      standard: 'IEEE 802.3af/at',
      poweredDeviceDetected: false,
      maxPowerW: 30,
      lastUpdated: t,
    },
  ];
}

function buildMockRtcStatus(): RtcStatus {
  const t = nowTime();
  return {
    batteryOk: true,
    currentTime: t,
    driftSeconds: 0.2,
    lastSynced: t,
  };
}

/**
 * GET /api/interfaces/status
 * Live status for 5G, LTE, Ethernet, Wi-Fi, WAN, Fiber and SATCOM.
 * On failure, callers should render "Telemetry unavailable" rather than
 * guessing a Connected/Disconnected state.
 */
export async function getInterfaceStatus(): Promise<NetworkInterfaceStatus[]> {
  try {
    return await apiFetch<NetworkInterfaceStatus[]>('/api/interfaces/status');
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      return buildMockInterfaceStatus();
    }
    throw err;
  }
}

/**
 * GET /api/interfaces/usb
 * Live status for USB Port 1 and USB Port 2. These are physical interfaces
 * and must always be represented as read-only status, never as toggles.
 */
export async function getUsbStatus(): Promise<UsbPortInfo[]> {
  try {
    return await apiFetch<UsbPortInfo[]>('/api/interfaces/usb');
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      return buildMockUsbStatus();
    }
    throw err;
  }
}

/**
 * GET /api/interfaces/serial
 * Live status for the 3 UART ports (RS232 / RS485 / TTL).
 */
export async function getSerialStatus(): Promise<SerialPortInfo[]> {
  try {
    return await apiFetch<SerialPortInfo[]>('/api/interfaces/serial');
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      return buildMockSerialStatus();
    }
    throw err;
  }
}

/**
 * GET /api/interfaces/gpio
 * Live state for the programmable GPIO / Digital I/O lines.
 */
export async function getDigitalIoStatus(): Promise<DigitalIoStatus[]> {
  try {
    return await apiFetch<DigitalIoStatus[]>('/api/interfaces/gpio');
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      return buildMockDigitalIoStatus();
    }
    throw err;
  }
}

/**
 * GET /api/interfaces/poe
 * Live status for the 2 PoE ports (IEEE 802.3af/at).
 */
export async function getPoeStatus(): Promise<PoePortInfo[]> {
  try {
    return await apiFetch<PoePortInfo[]>('/api/interfaces/poe');
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      return buildMockPoeStatus();
    }
    throw err;
  }
}

/**
 * GET /api/system/rtc
 * Battery-backed Real-Time Clock status.
 */
export async function getRtcStatus(): Promise<RtcStatus> {
  try {
    return await apiFetch<RtcStatus>('/api/system/rtc');
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      return buildMockRtcStatus();
    }
    throw err;
  }
}
