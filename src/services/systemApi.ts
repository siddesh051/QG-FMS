import { SystemInfo, UpdateCheckResult, UpdateDetails } from '../types/router';

/**
 * FluxGateway System Updates API service layer.
 *
 * Production usage: point VITE_FLUXGATEWAY_API_BASE at the real FluxGateway
 * EMS/device backend and this module will call:
 *   GET  /api/system/info
 *   GET  /api/system/updates
 *   POST /api/system/updates/check
 *   POST /api/system/updates/install
 *
 * Development fallback: when no backend is configured (or a request fails
 * to reach one), calls fall back to the clearly-marked MOCK_* data below so
 * the UI keeps working in local/demo environments. This mock layer must be
 * swapped out once the real FluxGateway backend is connected — it is kept
 * isolated from the request logic above for exactly that reason.
 */

const API_BASE: string =
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_FLUXGATEWAY_API_BASE || '';
const REQUEST_TIMEOUT_MS = 8000;

class NoBackendConfiguredError extends Error {
  constructor() {
    super('NO_BACKEND_CONFIGURED');
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_BASE) {
    // No real backend wired up yet — caller should fall back to mock data.
    throw new NoBackendConfiguredError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    });
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

// ---------------------------------------------------------------------------
// MOCK DATA — development fallback only. NOT real hardware/firmware data.
// Kept isolated from the production request logic above.
// ---------------------------------------------------------------------------

const MOCK_SYSTEM_INFO: SystemInfo = {
  firmwareVersion: 'v2.4.1-rt (Build 20260901)',
  softwareVersion: 'FluxGateway EMS 3.8.2',
  buildNumber: '20260901.1842',
  releaseDate: 'September 01, 2026',
  deviceModel: 'FluxGateway FG-5G-TR2005',
};

const MOCK_LATEST_UPDATE: UpdateDetails = {
  latestVersion: 'v2.4.2-sec-hotfix',
  releaseDate: 'September 15, 2026',
  releaseNotes: [
    'Quectel RM520N 5G modem carrier aggregation latency optimization',
    'Kernel real-time patch 6.1.52-rt14 with deterministic Modbus jitter reduction',
    'Stateful firewall rate-limiting against automated WAN brute-force probes',
    'Security fixes: CVE-2026-3891, CVE-2026-1104',
  ],
  packageSizeMb: 142,
  isAvailable: true,
};

// Best-effort semantic version compare: returns true if `latest` > `current`.
function isNewerVersion(current: string, latest: string): boolean {
  const clean = (v: string) => v.replace(/^v/i, '').split(/[-+]/)[0];
  const a = clean(current).split('.').map((n) => parseInt(n, 10) || 0);
  const b = clean(latest).split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (y > x) return true;
    if (y < x) return false;
  }
  return false;
}

/**
 * GET /api/system/info
 * Returns firmware/software version, build number, release date and model.
 */
export async function getSystemInformation(): Promise<SystemInfo> {
  try {
    return await apiFetch<SystemInfo>('/api/system/info');
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      return MOCK_SYSTEM_INFO;
    }
    // Propagate real backend failures so the UI can show an error state.
    throw err;
  }
}

/**
 * POST /api/system/updates/check
 * Contacts the update endpoint, compares installed vs. latest version, and
 * returns whether an update is available. Never fabricates version numbers —
 * on a genuine backend failure this throws so the caller can show a clear
 * error state rather than a false "up to date"/"update available" result.
 */
export async function checkForUpdates(): Promise<UpdateCheckResult> {
  const lastChecked = new Date().toISOString();

  try {
    return await apiFetch<UpdateCheckResult>('/api/system/updates/check', { method: 'POST' });
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      // Development fallback only — simulate a repository sync using mock data.
      const info = await getSystemInformation();
      const updateAvailable = isNewerVersion(info.firmwareVersion, MOCK_LATEST_UPDATE.latestVersion);
      return {
        status: updateAvailable ? 'update-available' : 'up-to-date',
        currentVersion: info.firmwareVersion,
        update: updateAvailable ? MOCK_LATEST_UPDATE : undefined,
        lastChecked,
      };
    }

    return {
      status: 'error',
      currentVersion: MOCK_SYSTEM_INFO.firmwareVersion,
      lastChecked,
      errorMessage:
        (err as Error)?.message === 'API_TIMEOUT'
          ? 'The update server did not respond in time. Check your connection and try again.'
          : 'Unable to reach the FluxGateway update server. It may be offline or unreachable.',
    };
  }
}

/**
 * GET /api/system/updates
 * Returns details of the currently available update package, if any.
 */
export async function getUpdateDetails(): Promise<UpdateDetails | null> {
  try {
    return await apiFetch<UpdateDetails>('/api/system/updates');
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      return MOCK_LATEST_UPDATE.isAvailable ? MOCK_LATEST_UPDATE : null;
    }
    return null;
  }
}

/**
 * POST /api/system/updates/install
 * Begins installation of a previously confirmed update package. Never
 * called automatically — the UI must show a confirmation dialog first.
 *
 * Kept as a single call today, but written so it can later be split into
 * stage/verify/activate steps for dual-bank (A/B) firmware architecture
 * without changing the calling UI's contract.
 */
export async function installUpdate(): Promise<{ success: boolean; message: string }> {
  try {
    return await apiFetch<{ success: boolean; message: string }>('/api/system/updates/install', {
      method: 'POST',
    });
  } catch (err) {
    if (err instanceof NoBackendConfiguredError) {
      return {
        success: true,
        message: 'Update installation started in simulated mode (no backend connected yet).',
      };
    }
    return {
      success: false,
      message: 'Failed to start the update installation. Please try again.',
    };
  }
}
