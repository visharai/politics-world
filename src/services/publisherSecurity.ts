export const PUBLISHER_BRAND_NAME = 'POLITICS WORLD';
const SESSION_TOKEN_KEY = 'politics_world_owner_session_token';
const LEGACY_AUTH_FLAG_KEY = 'politics_world_publisher_authenticated';
const LEGACY_VAULT_KEY = 'politics_world_vault_meta_v2';
const LEGACY_PIN_KEY = 'politics_world_admin_pin';

export interface PublisherVaultStatus {
  brandName: string;
  initialized: boolean;
  ownerEmailMasked: string;
  securityQuestion?: string;
  lockedRemainingSec: number;
  updatedAtIso?: string;
  sessionValid: boolean;
}

const WEAK_COMMON_PINS = new Set([
  '0000',
  '1111',
  '2222',
  '3333',
  '4444',
  '5555',
  '6666',
  '7777',
  '8888',
  '9999',
  '1234',
  '4321',
  '12345',
  '54321',
  '123456',
  '654321',
  '1947',
  '1950',
  '2024',
  '2025',
  '2026',
  '1212',
  '1122',
  '2580',
  '0852',
]);

export function validateStrongPin(pin: string): {
  valid: boolean;
  reasonHi?: string;
  reasonEn?: string;
} {
  const clean = (pin || '').trim();
  if (!/^\d{4,8}$/.test(clean)) {
    return {
      valid: false,
      reasonHi: 'पिन केवल 4 से 8 अंकों (0–9) का होना चाहिए।',
      reasonEn: 'PIN must be 4 to 8 numeric digits (0–9).',
    };
  }
  if (WEAK_COMMON_PINS.has(clean) || /^(\d)\1+$/.test(clean)) {
    return {
      valid: false,
      reasonHi: 'यह पिन बहुत आसान है (जैसे 1947, 1234 या समान अंक)। कृपया एक मजबूत पिन चुनें।',
      reasonEn: 'PIN is too predictable (e.g. 1947, 1234, or repeated digits). Choose a stronger PIN.',
    };
  }
  let isAsc = true;
  let isDesc = true;
  for (let i = 1; i < clean.length; i++) {
    const prev = Number(clean[i - 1]);
    const curr = Number(clean[i]);
    if (curr !== prev + 1) isAsc = false;
    if (curr !== prev - 1) isDesc = false;
  }
  if (isAsc || isDesc) {
    return {
      valid: false,
      reasonHi: 'क्रमिक अंक (जैसे 3456 या 7654) सुरक्षा कारणों से अमान्य हैं।',
      reasonEn: 'Sequential digits (e.g. 3456 or 7654) are not allowed for security.',
    };
  }
  return { valid: true };
}

export function scrubLegacyVaultStorage(): void {
  try {
    localStorage.removeItem(LEGACY_PIN_KEY);
    localStorage.removeItem(LEGACY_VAULT_KEY);
    sessionStorage.removeItem(LEGACY_AUTH_FLAG_KEY);
  } catch {
    // ignore storage errors
  }
}

export function getOwnerSessionToken(): string {
  try {
    return sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setOwnerSessionToken(token: string): void {
  try {
    scrubLegacyVaultStorage();
    if (token) {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

export function clearOwnerSession(): void {
  try {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    scrubLegacyVaultStorage();
  } catch {
    // ignore
  }
}

export async function fetchPublisherVaultStatus(): Promise<PublisherVaultStatus> {
  scrubLegacyVaultStorage();
  const token = getOwnerSessionToken();
  const res = await fetch('/api/publisher-auth/status', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    throw new Error('Failed to load POLITICS WORLD security status.');
  }
  const data = (await res.json()) as PublisherVaultStatus;
  if (!data.sessionValid && token) {
    clearOwnerSession();
  }
  return data;
}

export async function setupPublisherVault(params: {
  ownerEmail: string;
  securityQuestion: string;
  securityAnswer: string;
  newPin: string;
}): Promise<{
  ok: boolean;
  recoveryKey?: string;
  ownerEmailMasked?: string;
  securityQuestion?: string;
  errorHi?: string;
  errorEn?: string;
}> {
  const res = await fetch('/api/publisher-auth/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) {
    return {
      ok: false,
      errorHi: data.errorHi || 'सुरक्षा वॉल्ट सेटअप विफल रहा।',
      errorEn: data.errorEn || 'Vault initialization failed.',
    };
  }
  if (data.token) {
    setOwnerSessionToken(data.token);
  }
  return {
    ok: true,
    recoveryKey: data.recoveryKey,
    ownerEmailMasked: data.ownerEmailMasked,
    securityQuestion: data.securityQuestion,
  };
}

export async function verifyPublisherPin(pin: string): Promise<{
  ok: boolean;
  notInitialized?: boolean;
  lockedRemainingSec?: number;
  attemptsRemaining?: number;
  ownerEmailMasked?: string;
  securityQuestion?: string;
  errorHi?: string;
  errorEn?: string;
}> {
  const res = await fetch('/api/publisher-auth/verify-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });
  const data = await res.json();
  if (res.ok && data.ok && data.token) {
    setOwnerSessionToken(data.token);
    return {
      ok: true,
      ownerEmailMasked: data.ownerEmailMasked,
      securityQuestion: data.securityQuestion,
    };
  }
  return {
    ok: false,
    notInitialized: Boolean(data.notInitialized),
    lockedRemainingSec: Number(data.lockedRemainingSec || 0),
    attemptsRemaining: typeof data.attemptsRemaining === 'number' ? data.attemptsRemaining : undefined,
    errorHi: data.errorHi,
    errorEn: data.errorEn,
  };
}

export async function changePublisherPin(params: {
  ownerEmail: string;
  securityAnswer: string;
  method: 'current-pin' | 'recovery-key';
  currentPin?: string;
  recoveryKey?: string;
  newPin: string;
}): Promise<{
  ok: boolean;
  recoveryKey?: string;
  lockedRemainingSec?: number;
  errorHi?: string;
  errorEn?: string;
}> {
  const token = getOwnerSessionToken();
  const res = await fetch('/api/publisher-auth/change-pin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (res.ok && data.ok) {
    if (data.token) {
      setOwnerSessionToken(data.token);
    }
    return {
      ok: true,
      recoveryKey: data.recoveryKey,
    };
  }
  return {
    ok: false,
    lockedRemainingSec: Number(data.lockedRemainingSec || 0),
    errorHi: data.errorHi || 'पिन अपडेट विफल रहा।',
    errorEn: data.errorEn || 'Failed to update security PIN.',
  };
}

export async function recoverPublisherPin(params: {
  ownerEmail: string;
  securityAnswer: string;
  recoveryKey: string;
  newPin: string;
}): Promise<{
  ok: boolean;
  recoveryKey?: string;
  lockedRemainingSec?: number;
  errorHi?: string;
  errorEn?: string;
}> {
  const res = await fetch('/api/publisher-auth/recover-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (res.ok && data.ok) {
    if (data.token) {
      setOwnerSessionToken(data.token);
    }
    return {
      ok: true,
      recoveryKey: data.recoveryKey,
    };
  }
  return {
    ok: false,
    lockedRemainingSec: Number(data.lockedRemainingSec || 0),
    errorHi: data.errorHi || 'रिकवरी सत्यापन विफल रहा।',
    errorEn: data.errorEn || 'Owner recovery verification failed.',
  };
}
