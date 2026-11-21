import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  doc,
  getDocFromServer,
  type Firestore,
  type FirestoreSettings,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function createFirestoreClient(): Firestore {
  const databaseId = firebaseConfig.firestoreDatabaseId;
  if (typeof window !== 'undefined') {
    try {
      // Force classic XHR long-polling (disable Fetch ReadableStream) so proxies,
      // mobile carriers, and sandboxed preview iframes never buffer for 10s.
      const browserSettings = {
        experimentalForceLongPolling: true,
        experimentalLongPollingOptions: { timeoutSeconds: 10 },
        useFetchStreams: false,
      } as FirestoreSettings;
      return initializeFirestore(app, browserSettings, databaseId);
    } catch {
      return getFirestore(app, databaseId);
    }
  }
  return getFirestore(app, databaseId);
}

export const db = createFirestoreClient();
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ProbeResult {
  reachable: boolean;
  configError: boolean;
}

let reachabilityPromise: Promise<ProbeResult> | null = null;

async function probeFirestoreBackend(): Promise<ProbeResult> {
  if (typeof window === 'undefined') {
    return { reachable: true, configError: false };
  }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { reachable: false, configError: false };
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? window.setTimeout(() => controller.abort(), 4000) : null;

  try {
    const { projectId, firestoreDatabaseId, apiKey } = firebaseConfig;
    const dbName = `projects/${projectId}/databases/${firestoreDatabaseId}`;
    const url = `https://firestore.googleapis.com/v1/${dbName}/documents:batchGet?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documents: [`${dbName}/documents/live_ad_slots/header`],
      }),
      signal: controller?.signal,
    });

    if (res.status === 400 || res.status === 403 || res.status === 404) {
      return { reachable: false, configError: true };
    }
    return { reachable: res.ok, configError: false };
  } catch {
    return { reachable: false, configError: false };
  } finally {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
}

export async function whenFirestoreReachable(): Promise<boolean> {
  if (!reachabilityPromise) {
    reachabilityPromise = probeFirestoreBackend();
  }
  const result = await reachabilityPromise;
  return result.reachable;
}

async function testConnection(attempt = 0): Promise<void> {
  if (!reachabilityPromise) {
    reachabilityPromise = probeFirestoreBackend();
  }
  const probe = await reachabilityPromise;

  if (probe.configError) {
    console.error('Please check your Firebase configuration.');
    return;
  }

  if (!probe.reachable) {
    return;
  }

  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      if (attempt < 1) {
        setTimeout(() => {
          void testConnection(attempt + 1);
        }, 2000);
        return;
      }
      // Re-verify if backend config itself failed vs transient WebChannel drop
      const recheck = await probeFirestoreBackend();
      if (recheck.configError) {
        console.error('Please check your Firebase configuration.');
      }
    }
  }
}

if (typeof window !== 'undefined') {
  void testConnection();
  window.addEventListener(
    'online',
    () => {
      reachabilityPromise = null;
      void testConnection();
    },
    { once: true }
  );
}
