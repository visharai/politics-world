import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, whenFirestoreReachable } from '../firebase';
import {
  AdBooking,
  AdSlotKey,
  AD_SLOTS_CATALOG,
  formatInr,
  LiveAdSlot,
} from '../data/adSlotsConfig';
import { getOwnerSessionToken } from '../services/publisherSecurity';

interface AdSlotContextValue {
  slots: Record<AdSlotKey, LiveAdSlot | null>;
  isLoading: boolean;
  formatPrice: (inrAmount: number) => string;
  getActiveSlot: (slotKey: AdSlotKey) => LiveAdSlot | null;
  deployVerifiedCampaign: (liveSlot: LiveAdSlot, booking: AdBooking) => Promise<void>;
  clearSlotAsOwner: (slotKey: AdSlotKey) => Promise<{ ok: boolean; error?: string }>;
  refreshSlots: () => Promise<void>;
}

const EMPTY_SLOTS: Record<AdSlotKey, LiveAdSlot | null> = {
  header: null,
  'in-article': null,
  'sponsored-article': null,
  'multimedia-feature': null,
  'sponsored-wire': null,
  magazine: null,
};

export const INDIA_LEDGER_STORAGE_KEY = 'politics_world_wallet_ledger_in_v3';

const AdSlotContext = createContext<AdSlotContextValue | undefined>(undefined);

export const AdSlotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firestoreSlots, setFirestoreSlots] = useState<Record<AdSlotKey, LiveAdSlot | null>>(EMPTY_SLOTS);
  const [serverSlots, setServerSlots] = useState<Record<AdSlotKey, LiveAdSlot | null>>(EMPTY_SLOTS);
  const [isLoading, setIsLoading] = useState(true);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const formatPrice = useCallback((inrAmount: number) => formatInr(inrAmount), []);

  // Tick every 15 seconds to enforce instant automatic expiration & fallback to placeholder
  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const refreshSlots = useCallback(async () => {
    try {
      const res = await fetch('/api/ads/slots');
      if (res.ok) {
        const data = await res.json();
        if (data?.slots) {
          setServerSlots({ ...EMPTY_SLOTS, ...data.slots });
        }
      }
    } catch {
      // keep existing state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSlots();
  }, [refreshSlots]);

  // Real-time Firestore listener on /live_ad_slots (gated on backend reachability)
  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    void whenFirestoreReachable().then((reachable) => {
      if (!isMounted || !reachable) {
        setIsLoading(false);
        return;
      }

      const slotsColRef = collection(db, 'live_ad_slots');
      unsubscribe = onSnapshot(
        slotsColRef,
        (snapshot) => {
          const next: Record<AdSlotKey, LiveAdSlot | null> = { ...EMPTY_SLOTS };
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as LiveAdSlot;
            const key = (data?.slotKey || docSnap.id) as AdSlotKey;
            if (key in next) {
              next[key] = data;
            }
          });
          setFirestoreSlots(next);
          setIsLoading(false);
        },
        (error) => {
          console.warn('Firestore live_ad_slots subscription note:', error?.message || error);
          setIsLoading(false);
        }
      );
    });

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const getActiveSlot = useCallback(
    (slotKey: AdSlotKey): LiveAdSlot | null => {
      const fsItem = firestoreSlots[slotKey];
      const srvItem = serverSlots[slotKey];
      const candidates = [srvItem, fsItem].filter(
        (item): item is LiveAdSlot =>
          Boolean(item && item.status === 'active' && item.expiresAtMs > nowMs && item.bannerUrl && item.targetUrl)
      );
      if (candidates.length === 0) return null;
      candidates.sort((a, b) => new Date(b.activatedAtIso).getTime() - new Date(a.activatedAtIso).getTime());
      return candidates[0];
    },
    [firestoreSlots, serverSlots, nowMs]
  );

  const slots = React.useMemo(() => {
    const resolved: Record<AdSlotKey, LiveAdSlot | null> = { ...EMPTY_SLOTS };
    for (const key of Object.keys(AD_SLOTS_CATALOG) as AdSlotKey[]) {
      resolved[key] = getActiveSlot(key);
    }
    return resolved;
  }, [getActiveSlot]);

  const deployVerifiedCampaign = useCallback(async (liveSlot: LiveAdSlot, booking: AdBooking) => {
    // 1. Immediate optimistic UI deployment across all site slots
    setServerSlots((prev) => ({
      ...prev,
      [liveSlot.slotKey]: liveSlot,
    }));

    // 2. Append verified INR payment to India Domestic Publisher Treasury Ledger
    try {
      const ledgerRaw = localStorage.getItem(INDIA_LEDGER_STORAGE_KEY);
      const existing = ledgerRaw ? (JSON.parse(ledgerRaw) as any[]) : [];
      const txnType =
        booking.slotKey === 'sponsored-article'
          ? 'sponsored-article'
          : booking.slotKey === 'multimedia-feature'
            ? 'multimedia-feature'
            : 'direct-sponsor';

      const newTxn = {
        id: booking.bookingId,
        type: txnType,
        title: `${AD_SLOTS_CATALOG[booking.slotKey].titleEn} (${booking.durationDays} Days Live)`,
        payerOrPayee: booking.brandName,
        dateTime:
          new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata',
          }) + ' IST',
        dateIso: new Date().toISOString().slice(0, 10),
        category: 'SAC 998363 - National Digital Ad Booking (India)',
        paymentMode: booking.paymentMethod.includes('RTGS')
          ? 'RTGS Bank Settlement'
          : booking.paymentMethod.includes('NEFT')
            ? 'NEFT Electronic Transfer'
            : booking.paymentMethod.includes('IMPS')
              ? 'IMPS Instant Electronic'
              : 'Commercial UPI Business',
        deviceReference: `VERIFIED-UTR: ${booking.paymentReference} (INR)`,
        grossAmount: Math.round(booking.baseAmount),
        taxAmount: Math.round(booking.gstAmount),
        netAmount: Math.round(booking.grandTotal),
        status: 'success',
        invoiceNumber: booking.invoiceNumber,
        notes: `Self-serve national checkout (${formatInr(booking.grandTotal)} incl. 18% GST) deployed live to [${booking.slotKey}] -> ${booking.targetUrl}`,
      };
      if (!existing.some((t) => t.id === newTxn.id)) {
        localStorage.setItem(INDIA_LEDGER_STORAGE_KEY, JSON.stringify([newTxn, ...existing]));
        window.dispatchEvent(new CustomEvent('pw-ledger-updated'));
      }
    } catch {
      // ignore storage quota
    }

    // 3. Persist both public display slot & isolated booking record to Firestore
    const liveSlotPath = `live_ad_slots/${liveSlot.slotKey}`;
    try {
      await setDoc(doc(db, 'live_ad_slots', liveSlot.slotKey), {
        slotKey: liveSlot.slotKey,
        brandName: liveSlot.brandName,
        headline: liveSlot.headline || '',
        bannerUrl: liveSlot.bannerUrl,
        targetUrl: liveSlot.targetUrl,
        durationKey: liveSlot.durationKey,
        durationDays: liveSlot.durationDays,
        bookingId: liveSlot.bookingId,
        paymentStatus: 'verified',
        status: 'active',
        activatedAtIso: liveSlot.activatedAtIso,
        expiresAtIso: liveSlot.expiresAtIso,
        expiresAtMs: liveSlot.expiresAtMs,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, liveSlotPath);
      } catch {
        // Logged via structured handleFirestoreError
      }
    }

    const bookingPath = `ad_bookings/${booking.bookingId}`;
    try {
      await setDoc(doc(db, 'ad_bookings', booking.bookingId), {
        bookingId: booking.bookingId,
        slotKey: booking.slotKey,
        durationKey: booking.durationKey,
        durationDays: booking.durationDays,
        brandName: booking.brandName,
        contactPerson: booking.contactPerson || booking.brandName,
        advertiserEmail: booking.advertiserEmail,
        advertiserPhone: booking.advertiserPhone || '',
        clientType: booking.clientType === 'b2c' ? 'b2c' : 'b2b',
        currency: 'INR',
        gstin: booking.clientType === 'b2b' ? booking.gstin || '' : 'URP-B2C',
        bannerUrl: booking.bannerUrl,
        targetUrl: booking.targetUrl,
        headline: booking.headline || '',
        baseAmount: Math.round(booking.baseAmount),
        gstAmount: Math.round(booking.gstAmount),
        grandTotal: Math.round(booking.grandTotal),
        paymentMethod: booking.paymentMethod,
        paymentReference: booking.paymentReference,
        paymentStatus: 'verified',
        invoiceNumber: booking.invoiceNumber,
        activatedAtIso: booking.activatedAtIso,
        expiresAtIso: booking.expiresAtIso,
        expiresAtMs: booking.expiresAtMs,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, bookingPath);
      } catch {
        // Logged via handleFirestoreError
      }
    }
  }, []);

  const clearSlotAsOwner = useCallback(async (slotKey: AdSlotKey): Promise<{ ok: boolean; error?: string }> => {
    const token = getOwnerSessionToken();
    try {
      const res = await fetch(`/api/ads/slots/${slotKey}/clear`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.errorEn || data.errorHi || 'Failed to clear slot' };
      }

      setServerSlots((prev) => ({ ...prev, [slotKey]: null }));
      const fsSlot = firestoreSlots[slotKey];
      if (fsSlot) {
        try {
          await updateDoc(doc(db, 'live_ad_slots', slotKey), {
            status: 'expired',
            expiresAtMs: Date.now() - 1000,
            expiresAtIso: new Date(Date.now() - 1000).toISOString(),
            updatedAt: serverTimestamp(),
          });
        } catch {
          setFirestoreSlots((prev) => ({ ...prev, [slotKey]: null }));
        }
      }
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Network error clearing slot' };
    }
  }, [firestoreSlots]);

  return (
    <AdSlotContext.Provider
      value={{
        slots,
        isLoading,
        formatPrice,
        getActiveSlot,
        deployVerifiedCampaign,
        clearSlotAsOwner,
        refreshSlots,
      }}
    >
      {children}
    </AdSlotContext.Provider>
  );
};

export function useAdSlots(): AdSlotContextValue {
  const ctx = useContext(AdSlotContext);
  if (!ctx) {
    throw new Error('useAdSlots must be used within AdSlotProvider');
  }
  return ctx;
}
