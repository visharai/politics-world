import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Globe,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Landmark,
  Smartphone,
  ArrowRight,
  ExternalLink,
  Calendar,
  Sparkles,
  Download,
  Printer,
} from 'lucide-react';
import {
  downloadCommercialInvoicePdf,
  printCommercialInvoiceDocument,
} from '../utils/pdfExport';
import {
  AdBooking,
  AdSlotKey,
  AD_SLOTS_CATALOG,
  ClientTaxType,
  DurationKey,
  DURATION_LABELS,
  formatInr,
  INDIA_PLACEMENT_RULES,
  LiveAdSlot,
} from '../data/adSlotsConfig';
import { useAdSlots } from '../context/AdSlotContext';
import { useLanguage } from '../context/LanguageContext';
import { getOwnerSessionToken } from '../services/publisherSecurity';
import {
  GST_STATE_CODES,
  resolveIndiaGstSupply,
  validateIndianGSTIN,
} from '../utils/gstValidator';

interface AdSlotCheckoutModalProps {
  isOpen: boolean;
  initialSlotKey: AdSlotKey;
  initialDurationKey?: DurationKey;
  onClose: () => void;
  onDeployedAndNavigate?: (domTargetId: string, slotKey: AdSlotKey) => void;
}

export const AdSlotCheckoutModal: React.FC<AdSlotCheckoutModalProps> = ({
  isOpen,
  initialSlotKey,
  initialDurationKey = '1-month',
  onClose,
  onDeployedAndNavigate,
}) => {
  const { langCode } = useLanguage();
  const isHi = langCode === 'hi';
  const { getActiveSlot, deployVerifiedCampaign } = useAdSlots();

  const [slotKey, setSlotKey] = useState<AdSlotKey>(initialSlotKey);
  const [durationKey, setDurationKey] = useState<DurationKey>(initialDurationKey);

  // India Domestic Billing / Advertiser info
  const [clientType, setClientType] = useState<ClientTaxType>('b2b');
  const [brandName, setBrandName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [advertiserEmail, setAdvertiserEmail] = useState('');
  const [advertiserPhone, setAdvertiserPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [b2cState, setB2cState] = useState('07 - Delhi');
  const [billingAddress, setBillingAddress] = useState('');

  // Custom Banner & Target URL
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerFileName, setBannerFileName] = useState('');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState('https://');
  const [headline, setHeadline] = useState('');

  // India Section 269ST Digital INR Payment Verification
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank' | 'card'>('upi');
  const [paymentReference, setPaymentReference] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isAutoFillingDemo, setIsAutoFillingDemo] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Success Receipt
  const [confirmedResult, setConfirmedResult] = useState<{
    liveSlot: LiveAdSlot;
    booking: AdBooking;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSlotKey(initialSlotKey);
      setDurationKey(initialDurationKey || '1-month');
      setCheckoutError(null);
      setUploadError(null);
      setConfirmedResult(null);
    }
  }, [isOpen, initialSlotKey, initialDurationKey]);

  if (!isOpen) return null;

  const slotMeta = AD_SLOTS_CATALOG[slotKey];
  const currentlyActive = getActiveSlot(slotKey);
  const durationMeta = DURATION_LABELS[durationKey];
  const baseAmount = slotMeta.rates[durationKey];
  const gstAmount = Math.round(baseAmount * 0.18);
  const gstSupply = resolveIndiaGstSupply({
    clientType,
    gstin,
    b2cStateLabel: b2cState,
    gstAmount,
  });
  const cgstAmount = gstSupply.cgstAmount;
  const sgstAmount = gstSupply.sgstAmount;
  const igstAmount = gstSupply.igstAmount;
  const grandTotal = baseAmount + gstAmount;

  const handleBannerFileChange = async (file: File | null) => {
    if (!file) return;
    setUploadError(null);

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setUploadError(
        isHi
          ? 'कृपया केवल PNG, JPG, WEBP या GIF बैनर इमेज चुनें।'
          : 'Please choose a valid PNG, JPG, WEBP, or GIF poster image.'
      );
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError(
        isHi
          ? 'बैनर इमेज 4 MB से कम होनी चाहिए।'
          : 'Banner image file must be under 4 MB.'
      );
      return;
    }

    setIsUploadingBanner(true);
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/ads/upload-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotKey,
          fileName: file.name,
          mimeType: file.type,
          dataBase64,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.bannerUrl) {
        setUploadError(
          isHi ? data.errorHi || 'बैनर अपलोड विफल रहा।' : data.errorEn || 'Banner upload failed.'
        );
        return;
      }

      setBannerUrl(data.bannerUrl);
      setBannerFileName(file.name);
    } catch (err: any) {
      setUploadError(err?.message || (isHi ? 'अपलोड नेटवर्क त्रुटि।' : 'Network error uploading banner.'));
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const generateInstantGatewayReference = () => {
    const prefix = paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'bank' ? 'UTR' : 'NB';
    const rand = Math.floor(100000000 + Math.random() * 900000000);
    setPaymentReference(`${prefix}-${rand}`);
    setCheckoutError(null);
  };

  const handleAutoFillPoliticsWorldDemo = async () => {
    setCheckoutError(null);
    setUploadError(null);
    setIsAutoFillingDemo(true);

    try {
      // Pick current slot if free or already a [DEMO TEST] slot; otherwise pick first open slot
      const activeInSlot = getActiveSlot(slotKey);
      const isDemoActive = Boolean(activeInSlot?.headline?.includes('[DEMO TEST]'));
      let targetSlot = slotKey;
      if (activeInSlot && !isDemoActive && !getOwnerSessionToken()) {
        const firstOpen = (Object.keys(AD_SLOTS_CATALOG) as AdSlotKey[]).find((k) => !getActiveSlot(k));
        if (firstOpen) {
          targetSlot = firstOpen;
          setSlotKey(firstOpen);
        }
      }

      const posterPath =
        targetSlot === 'header'
          ? '/images/politics_world_promo_banner.jpg'
          : targetSlot === 'magazine'
            ? '/images/politics_world_magazine_card.jpg'
            : '/images/politics_world_editorial_banner.jpg';
      const posterFileName =
        targetSlot === 'header'
          ? 'politics_world_promo_banner.jpg'
          : targetSlot === 'magazine'
            ? 'politics_world_magazine_card.jpg'
            : 'politics_world_editorial_banner.jpg';

      const durationCodeMap: Record<DurationKey, string> = {
        '1-week': '1WK',
        '1-month': '1MO',
        '3-months': '3MO',
        '1-year': '1YR',
      };
      setClientType('b2b');
      setBrandName('Politics World India Media Desk');
      setContactPerson('Politics World Editorial Desk');
      setAdvertiserEmail('vrai74918@gmail.com');
      setAdvertiserPhone('+91 98110 45210');
      setGstin('07AAACP9921D1Z8');
      setB2cState('07 - Delhi');
      setBillingAddress('Connaught Place, New Delhi - 110001');
      const liveSiteOrigin =
        typeof window !== 'undefined' && window.location?.origin
          ? window.location.origin
          : 'https://ais-dev-5ybfu37d43e2ycuf3t3ush-370038772633.asia-east1.run.app';
      setTargetUrl(`${liveSiteOrigin}/`);
      setHeadline('Politics World India — Official Broadsheet & Global Policy Wire [DEMO TEST]');
      setPaymentMethod('upi');
      setPaymentReference(`DEMO-PW${durationCodeMap[durationKey]}-${Date.now().toString().slice(-6)}`);

      // Fetch and upload the matched Politics World promo poster creative
      const imgRes = await fetch(posterPath);
      if (imgRes.ok) {
        const blob = await imgRes.blob();
        const dataBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(new Error('Failed to encode promo banner'));
          reader.readAsDataURL(blob);
        });

        const uploadRes = await fetch('/api/ads/upload-banner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotKey: targetSlot,
            fileName: posterFileName,
            mimeType: 'image/jpeg',
            dataBase64,
          }),
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.ok && uploadData.bannerUrl) {
          setBannerUrl(uploadData.bannerUrl);
          setBannerFileName(posterFileName);
        } else {
          setBannerUrl(posterPath);
          setBannerFileName(posterFileName);
        }
      }
    } catch {
      setBannerUrl('/images/politics_world_editorial_banner.jpg');
      setBannerFileName('politics_world_editorial_banner.jpg');
    } finally {
      setIsAutoFillingDemo(false);
    }
  };

  const handleVerifyPaymentAndDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (brandName.trim().length < 2) {
      setCheckoutError(isHi ? 'कृपया भारतीय कंपनी या ब्रांड का नाम दर्ज करें।' : 'Please enter your Indian Brand or Organization Name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(advertiserEmail.trim())) {
      setCheckoutError(isHi ? 'कृपया मान्य कार्य ईमेल दर्ज करें।' : 'Please enter a valid work email address.');
      return;
    }
    if (clientType === 'b2b') {
      if (!gstin.trim()) {
        setCheckoutError(
          isHi
            ? 'India B2B बुकिंग के लिए 15-अंकीय GSTIN दर्ज करें (या B2C चुनें)।'
            : 'Please enter a valid 15-character Indian GSTIN for B2B billing (or switch to India B2C).'
        );
        return;
      }
      const check = validateIndianGSTIN(gstin.trim());
      if (!check.isValid) {
        setCheckoutError(check.error || (isHi ? 'अमान्य GSTIN नंबर।' : 'Invalid Indian GSTIN format.'));
        return;
      }
    }
    if (!bannerUrl.trim()) {
      setCheckoutError(
        isHi
          ? 'कृपया पहले अपना कस्टम बैनर पोस्टर इमेज अपलोड करें।'
          : 'Please upload your custom banner poster image first.'
      );
      return;
    }
    if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(targetUrl.trim())) {
      setCheckoutError(
        isHi
          ? 'कृपया https:// से शुरू होने वाला मान्य डेस्टिनेशन वेबसाइट URL दर्ज करें।'
          : 'Please enter a valid destination website URL starting with https:// or http://'
      );
      return;
    }
    if (paymentReference.trim().length < 6) {
      setCheckoutError(
        isHi
          ? 'भुगतान सत्यापन के लिए मान्य UPI / UTR / NetBanking संदर्भ दर्ज करें (कम से कम 6 अक्षर)।'
          : 'Enter a valid UPI / NEFT UTR / NetBanking reference (at least 6 characters).'
      );
      return;
    }

    setIsProcessingPayment(true);
    try {
      const ownerToken = getOwnerSessionToken();
      const paymentMethodLabel =
        paymentMethod === 'upi'
          ? 'Corporate UPI / BharatQR (INR)'
          : paymentMethod === 'bank'
            ? 'NEFT / RTGS Electronic Settlement'
            : 'Indian RuPay / NetBanking';

      const res = await fetch('/api/ads/checkout/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(ownerToken ? { Authorization: `Bearer ${ownerToken}` } : {}),
        },
        body: JSON.stringify({
          slotKey,
          durationKey,
          currency: 'INR',
          brandName: brandName.trim(),
          contactPerson: contactPerson.trim() || brandName.trim(),
          advertiserEmail: advertiserEmail.trim(),
          advertiserPhone: advertiserPhone.trim(),
          clientType,
          gstin: clientType === 'b2b' ? gstin.trim().toUpperCase() : 'URP-B2C',
          billingAddress: billingAddress.trim(),
          headline: headline.trim(),
          bannerUrl: bannerUrl.trim(),
          targetUrl: targetUrl.trim(),
          paymentMethod: paymentMethodLabel,
          paymentReference: paymentReference.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok || !data.liveSlot || !data.booking) {
        setCheckoutError(
          isHi
            ? data.errorHi || 'भुगतान सत्यापन विफल रहा।'
            : data.errorEn || 'Payment verification failed.'
        );
        return;
      }

      await deployVerifiedCampaign(data.liveSlot as LiveAdSlot, data.booking as AdBooking);
      setConfirmedResult({
        liveSlot: data.liveSlot as LiveAdSlot,
        booking: data.booking as AdBooking,
      });
    } catch (err: any) {
      setCheckoutError(err?.message || (isHi ? 'चेकआउट सर्वर त्रुटि।' : 'Checkout verification error.'));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-5 bg-slate-950/75 dark:bg-black/85 backdrop-blur-xs font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="India National Self-Serve Ad Checkout"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[94dvh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#091122] text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1529] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
              {isHi
                ? 'भारत राष्ट्रीय सेल्फ-सर्व विज्ञापन चेकआउट (INR ₹ · 18% GST)'
                : 'India National Self-Serve Ad Checkout · INR (₹) · SAC 998363'}
            </div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white truncate">
              {isHi ? slotMeta.titleHi : slotMeta.titleEn}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-bold">
              INR ₹ · 18% GST
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50 dark:bg-[#060c1a]">
          {confirmedResult ? (
            /* DEPLOYED CONFIRMATION & RECEIPT SCREEN */
            <div className="max-w-2xl mx-auto rounded-2xl bg-white dark:bg-[#0d172c] border border-emerald-200 dark:border-emerald-800/60 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {isHi ? 'भुगतान सत्यापित · लाइव डिप्लॉयमेंट पूर्ण' : 'Payment Verified · Live Placement Deployed'}
                  </div>
                  <h4 className="text-lg font-bold text-slate-950 dark:text-white mt-0.5">
                    {isHi
                      ? 'आपका कस्टम बैनर अब राष्ट्रीय वेबसाइट पर लाइव है!'
                      : 'Your Custom Banner & Destination Link Are Now Live Across India'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isHi
                      ? `GST इनवॉइस ${confirmedResult.booking.invoiceNumber} जारी किया गया और बैनर सीधे ${slotMeta.titleHi} स्लॉट में डिप्लॉय हो गया है।`
                      : `India GST Tax Invoice ${confirmedResult.booking.invoiceNumber} issued. Deployed directly into ${slotMeta.titleEn}.`}
                  </p>
                </div>
              </div>

              {/* Live Banner Creative Preview */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-900">
                <img
                  src={confirmedResult.liveSlot.bannerUrl}
                  alt={confirmedResult.liveSlot.brandName}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-52 object-cover"
                />
                <div className="px-4 py-2.5 bg-white dark:bg-[#081020] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {confirmedResult.liveSlot.brandName}
                  </span>
                  <a
                    href={confirmedResult.liveSlot.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sky-700 dark:text-amber-400 font-mono truncate max-w-[260px]"
                  >
                    <span className="truncate">{confirmedResult.liveSlot.targetUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Settlement Audit Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{isHi ? 'कुल भुगतान' : 'Settled Total'}</div>
                  <div className="font-mono tabular-nums font-bold text-slate-950 dark:text-white mt-0.5">
                    {formatInr(confirmedResult.booking.grandTotal)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{isHi ? 'संदर्भ' : 'Verified Ref'}</div>
                  <div className="font-mono font-bold text-slate-950 dark:text-white mt-0.5 truncate">
                    {confirmedResult.booking.paymentReference}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{isHi ? 'अवधि' : 'Tenure'}</div>
                  <div className="font-mono font-bold text-slate-950 dark:text-white mt-0.5">
                    {confirmedResult.liveSlot.durationDays} {isHi ? 'दिन' : 'Days'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{isHi ? 'समाप्ति' : 'Expires On'}</div>
                  <div className="font-mono font-bold text-slate-950 dark:text-white mt-0.5">
                    {new Date(confirmedResult.liveSlot.expiresAtMs).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const b = confirmedResult.booking;
                      const ls = confirmedResult.liveSlot;
                      const receiptSupply = resolveIndiaGstSupply({
                        clientType: b.clientType,
                        gstin: b.gstin,
                        b2cStateLabel: b2cState,
                        gstAmount: b.gstAmount,
                      });
                      downloadCommercialInvoicePdf({
                        invoiceNumber: b.invoiceNumber,
                        issueDate: new Date(b.createdAtIso).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }),
                        clientType: b.clientType,
                        currency: 'INR',
                        slotTitle: slotMeta.titleEn,
                        slotCategory: slotMeta.placementEn,
                        sac: slotMeta.sac,
                        durationDays: ls.durationDays,
                        scheduleText: `${new Date(ls.activatedAtIso).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })} -> ${new Date(ls.expiresAtMs).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}`,
                        clientName: b.brandName,
                        contactPerson: b.contactPerson || b.advertiserEmail,
                        clientAddress: b.billingAddress || 'New Delhi, India',
                        taxRegistration: b.clientType === 'b2b' ? `GSTIN: ${b.gstin || 'N/A'}` : 'URP-B2C (Rule 46)',
                        placeOfSupply: receiptSupply.placeOfSupply,
                        reverseCharge: receiptSupply.reverseCharge,
                        subtotalFormatted: formatInr(b.baseAmount),
                        taxLabel: `${receiptSupply.taxLabel} · SAC ${slotMeta.sac}`,
                        taxFormatted: receiptSupply.isInterState
                          ? formatInr(receiptSupply.igstAmount)
                          : `${formatInr(receiptSupply.cgstAmount)} + ${formatInr(receiptSupply.sgstAmount)}`,
                        grandTotalFormatted: formatInr(b.grandTotal),
                        paymentMethod: b.paymentMethod,
                        paymentReference: b.paymentReference,
                        targetUrl: ls.targetUrl,
                      });
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{isHi ? 'PDF इनवॉइस डाउनलोड' : 'Download PDF Invoice'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const b = confirmedResult.booking;
                      const ls = confirmedResult.liveSlot;
                      const receiptSupply = resolveIndiaGstSupply({
                        clientType: b.clientType,
                        gstin: b.gstin,
                        b2cStateLabel: b2cState,
                        gstAmount: b.gstAmount,
                      });
                      printCommercialInvoiceDocument({
                        invoiceNumber: b.invoiceNumber,
                        issueDate: new Date(b.createdAtIso).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }),
                        clientType: b.clientType,
                        currency: 'INR',
                        slotTitle: slotMeta.titleEn,
                        slotCategory: slotMeta.placementEn,
                        sac: slotMeta.sac,
                        durationDays: ls.durationDays,
                        scheduleText: `${new Date(ls.activatedAtIso).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })} → ${new Date(ls.expiresAtMs).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}`,
                        clientName: b.brandName,
                        contactPerson: b.contactPerson || b.advertiserEmail,
                        clientAddress: b.billingAddress || 'New Delhi, India',
                        taxRegistration: b.clientType === 'b2b' ? `GSTIN: ${b.gstin || 'N/A'}` : 'URP-B2C (Rule 46)',
                        placeOfSupply: receiptSupply.placeOfSupply,
                        reverseCharge: receiptSupply.reverseCharge,
                        subtotalFormatted: formatInr(b.baseAmount),
                        taxLabel: `${receiptSupply.taxLabel} · SAC ${slotMeta.sac}`,
                        taxFormatted: receiptSupply.isInterState
                          ? formatInr(receiptSupply.igstAmount)
                          : `${formatInr(receiptSupply.cgstAmount)} + ${formatInr(receiptSupply.sgstAmount)}`,
                        grandTotalFormatted: formatInr(b.grandTotal),
                        paymentMethod: b.paymentMethod,
                        paymentReference: b.paymentReference,
                        targetUrl: ls.targetUrl,
                      });
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isHi ? 'प्रिंट रसीद' : 'Print Receipt'}</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {isHi ? 'पब्लिशर डेस्क पर लौटें' : 'Back to Publisher Desk'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeployedAndNavigate?.(slotMeta.domTargetId, slotKey);
                      onClose();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-950 text-xs font-bold cursor-pointer"
                  >
                    <span>{isHi ? 'लाइव स्लॉट अभी देखें' : 'View Live Ad on Site'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handleVerifyPaymentAndDeploy} className="space-y-4">
              {/* 1-Click Test / Demo Auto-Fill Strip */}
              <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-[#0d1c3a] border border-sky-200 dark:border-amber-500/35 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-slate-950 dark:text-amber-300">
                    {isHi
                      ? 'डेमो परीक्षण मोड (असली पेमेंट अभी बंद है)'
                      : 'Demo Test Mode (Live Payment Gateway Paused)'}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {isHi
                      ? `एक क्लिक में Politics World पोस्टर, वेबसाइट लिंक, GSTIN, ${durationMeta.hi} प्लान और डेमो UPI UTR अपने आप भरें।`
                      : `Auto-fill Politics World custom poster, destination URL, Delhi GSTIN, ${durationMeta.en} plan & demo UTR in one click.`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-white dark:bg-[#081020] border border-slate-200 dark:border-slate-700 text-[11px]">
                    {(
                      [
                        { id: '1-week', label: isHi ? '1 सप्ताह' : '1 Week' },
                        { id: '1-month', label: isHi ? '1 माह' : '1 Month' },
                        { id: '3-months', label: isHi ? '3 माह' : '3 Months' },
                        { id: '1-year', label: isHi ? '1 वर्ष' : '1 Year' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDurationKey(opt.id)}
                        className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          durationKey === opt.id
                            ? 'bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={isAutoFillingDemo}
                    onClick={() => void handleAutoFillPoliticsWorldDemo()}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-950 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAutoFillingDemo ? 'animate-spin' : ''}`} />
                    <span>
                      {isAutoFillingDemo
                        ? isHi
                          ? 'फॉर्म भर रहा है...'
                          : 'Filling Demo...'
                        : isHi
                          ? `⚡ डेमो फॉर्म ऑटो-फिल (${durationMeta.hi})`
                          : `⚡ Auto-Fill Demo (${durationMeta.en})`}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column (7 cols): Creative Upload, Target URL & Advertiser Details */}
              <div className="lg:col-span-7 space-y-5">
                {currentlyActive && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-bold">
                        {isHi ? 'यह स्लॉट वर्तमान में सक्रिय है' : 'Active Campaign Detected'}
                      </div>
                      <p className="mt-0.5 text-amber-800 dark:text-amber-300/90">
                        {isHi
                          ? `वर्तमान विज्ञापनदाता: ${currentlyActive.brandName} (समाप्ति: ${new Date(currentlyActive.expiresAtMs).toLocaleDateString('en-IN')})। पब्लिशर स्वामी सत्र होने पर आप इसे बदल सकते हैं या दूसरा रिक्त स्लॉट चुन सकते हैं।`
                          : `Currently booked by ${currentlyActive.brandName} until ${new Date(currentlyActive.expiresAtMs).toLocaleDateString('en-IN')}. Select another open slot or unlock Publisher Desk to replace.`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Section A: Custom Banner Poster Upload & Target URL */}
                <div className="rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                      {isHi ? '1. कस्टम बैनर पोस्टर और वेबसाइट लिंक' : '1. Custom Banner Poster & Destination URL'}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {slotMeta.recommendedSize}
                    </span>
                  </div>

                  {/* Distinct Banner Poster Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isHi ? 'अपना बैनर पोस्टर इमेज अपलोड करें (PNG / JPG / WEBP)' : 'Upload Custom Banner Poster Image *'}
                    </label>

                    <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#081020] hover:border-slate-400 dark:hover:border-amber-400/60 p-4 text-center cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={(e) => void handleBannerFileChange(e.target.files?.[0] || null)}
                        className="sr-only"
                      />
                      {bannerUrl ? (
                        <div className="w-full space-y-2">
                          <img
                            src={bannerUrl}
                            alt="Uploaded Banner Preview"
                            referrerPolicy="no-referrer"
                            className="w-full max-h-40 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                          />
                          <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-medium px-1">
                            <span className="flex items-center gap-1 truncate">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{bannerFileName || bannerUrl}</span>
                            </span>
                            <span className="underline text-slate-600 dark:text-slate-300 shrink-0 ml-2">
                              {isHi ? 'बैनर बदलें' : 'Replace Image'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2 space-y-1.5">
                          <div className="w-10 h-10 mx-auto rounded-xl bg-slate-950/5 dark:bg-amber-400/10 text-slate-700 dark:text-amber-400 flex items-center justify-center">
                            {isUploadingBanner ? (
                              <Sparkles className="w-5 h-5 animate-spin" />
                            ) : (
                              <Upload className="w-5 h-5" />
                            )}
                          </div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {isUploadingBanner
                              ? isHi
                                ? 'बैनर अपलोड हो रहा है...'
                                : 'Uploading banner poster...'
                              : isHi
                                ? 'कस्टम बैनर पोस्टर चुनने के लिए क्लिक करें'
                                : 'Click to upload custom banner poster'}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {slotMeta.aspectHint} · Max 4 MB (PNG, JPG, WEBP)
                          </div>
                        </div>
                      )}
                    </label>

                    {uploadError && (
                      <div className="text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>

                  {/* Distinct Target Destination Website URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isHi ? 'टारगेट डेस्टिनेशन वेबसाइट URL (क्लिक लिंक) *' : 'Target Destination Website URL *'}
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        required
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://www.yourindianbrand.in/campaign"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isHi
                        ? 'जब भारतीय पाठक आपके लाइव पोस्टर बैनर पर क्लिक करेगा, तो वह सीधे इसी वेबसाइट URL पर जाएगा।'
                        : 'National readers across India clicking your deployed banner navigate directly to this destination URL.'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isHi ? 'बैनर शीर्षक / कैप्शन (वैकल्पिक)' : 'Banner Headline / Caption (Optional)'}
                    </label>
                    <input
                      type="text"
                      maxLength={140}
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder={
                        isHi
                          ? 'जैसे: भारत इन्फ्रास्ट्रक्चर समिट 2026 — अभी पंजीकरण करें'
                          : 'e.g. India Infrastructure Summit 2026 — Register Now'
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Section B: India Domestic GST Billing Details */}
                <div className="rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                      {isHi ? '2. भारतीय विज्ञापनदाता एवं GST बिलिंग विवरण' : '2. India Advertiser & GST Billing'}
                    </h4>
                    <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setClientType('b2b')}
                        className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                          clientType === 'b2b'
                            ? 'bg-white dark:bg-[#0d172c] text-slate-950 dark:text-white shadow-xs'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        India B2B (GSTIN)
                      </button>
                      <button
                        type="button"
                        onClick={() => setClientType('b2c')}
                        className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                          clientType === 'b2c'
                            ? 'bg-white dark:bg-[#0d172c] text-slate-950 dark:text-white shadow-xs'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        India B2C (Rule 46)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isHi ? 'कंपनी / ब्रांड नाम *' : 'Brand / Organization Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="Bharat Policy Advisory Pvt Ltd"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isHi ? 'कार्य ईमेल *' : 'Work Email (For GST Invoice) *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={advertiserEmail}
                        onChange={(e) => setAdvertiserEmail(e.target.value)}
                        placeholder="media@bharatadvisory.in"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isHi ? 'संपर्क व्यक्ति' : 'Authorized Contact'}
                      </label>
                      <input
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder={isHi ? 'प्रबंधक का नाम' : 'Arjun Mehta, Head of Communications'}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isHi ? 'भारतीय मोबाइल / फ़ोन (+91)' : 'Phone (India +91)'}
                      </label>
                      <input
                        type="tel"
                        value={advertiserPhone}
                        onChange={(e) => setAdvertiserPhone(e.target.value)}
                        placeholder="+91 98110 45210"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {clientType === 'b2b' ? (
                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {isHi ? 'कंपनी GSTIN (15-अंकीय अनिवार्य) *' : 'Company GSTIN (15-char Required) *'}
                        </label>
                        <input
                          type="text"
                          maxLength={15}
                          required
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase())}
                          placeholder="07AAACM1234D1Z5"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono uppercase text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {isHi ? 'आपूर्ति का राज्य (Place of Supply - Rule 46)' : 'Place of Supply State (Rule 46) *'}
                        </label>
                        <select
                          value={b2cState}
                          onChange={(e) => setB2cState(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                        >
                          {Object.entries(GST_STATE_CODES).map(([code, name]) => (
                            <option key={code} value={`${code} - ${name}`}>
                              {code} - {name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isHi ? 'बिलिंग पता व पिन कोड (भारत)' : 'Billing City, State & PIN (India)'}
                      </label>
                      <input
                        type="text"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        placeholder="Connaught Place, New Delhi - 110001"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): India Domestic INR Pricing & Sec 269ST Payment Verification */}
              <div className="lg:col-span-5 space-y-5">
                <div className="rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                      {isHi ? '3. राष्ट्रीय स्लॉट, अवधि व INR भुगतान' : '3. Slot, Tenure & India INR Settlement'}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      INR ₹ · SAC 998363
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isHi ? 'विज्ञापन स्लॉट चुनें' : 'National Placement Slot'}
                      </label>
                      <select
                        value={slotKey}
                        onChange={(e) => setSlotKey(e.target.value as AdSlotKey)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none"
                      >
                        {(Object.keys(AD_SLOTS_CATALOG) as AdSlotKey[]).map((key) => {
                          const item = AD_SLOTS_CATALOG[key];
                          const busy = Boolean(getActiveSlot(key));
                          return (
                            <option key={key} value={key}>
                              {isHi ? item.titleHi : item.titleEn}{' '}
                              {busy ? (isHi ? '(सक्रिय)' : '(Occupied)') : isHi ? '(रिक्त)' : '(Open)'}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isHi ? 'अभियान अवधि (राष्ट्रीय भारतीय दर)' : 'Campaign Tenure (India Domestic Rate)'}
                      </label>
                      <select
                        value={durationKey}
                        onChange={(e) => setDurationKey(e.target.value as DurationKey)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none"
                      >
                        {(Object.keys(DURATION_LABELS) as DurationKey[]).map((dk) => (
                          <option key={dk} value={dk}>
                            {isHi ? DURATION_LABELS[dk].hi : DURATION_LABELS[dk].en} —{' '}
                            {formatInr(slotMeta.rates[dk])}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Authoritative India Domestic Pricing Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>
                        {isHi ? 'राष्ट्रीय स्लॉट शुल्क' : 'India Domestic Base Rate'} ({durationMeta.days}d)
                      </span>
                      <span className="font-mono tabular-nums text-slate-900 dark:text-slate-200">
                        {formatInr(baseAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>{gstSupply.taxLabel} · SAC {slotMeta.sac}</span>
                      <span className="font-mono tabular-nums text-slate-900 dark:text-slate-200">
                        {gstSupply.isInterState
                          ? formatInr(igstAmount)
                          : `${formatInr(cgstAmount)} + ${formatInr(sgstAmount)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>POS: {gstSupply.placeOfSupply}</span>
                      <span>Reverse Charge: No</span>
                    </div>
                    <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-bold text-slate-950 dark:text-white">
                      <span>{isHi ? 'कुल देय राशि (INR)' : 'Total Payable (INR)'}</span>
                      <span className="text-lg font-mono tabular-nums text-emerald-700 dark:text-amber-400">
                        {formatInr(grandTotal)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                      {isHi ? INDIA_PLACEMENT_RULES.settlementRailsHi : INDIA_PLACEMENT_RULES.settlementRailsEn}
                    </div>
                  </div>

                  {/* India Digital INR Payment Rail Tabs */}
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          paymentMethod === 'upi'
                            ? 'border-slate-950 dark:border-amber-400 bg-slate-950/5 dark:bg-amber-400/10 text-slate-950 dark:text-white font-semibold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Business UPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          paymentMethod === 'bank'
                            ? 'border-slate-950 dark:border-amber-400 bg-slate-950/5 dark:bg-amber-400/10 text-slate-950 dark:text-white font-semibold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Landmark className="w-3.5 h-3.5" />
                        <span>NEFT / RTGS</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          paymentMethod === 'card'
                            ? 'border-slate-950 dark:border-amber-400 bg-slate-950/5 dark:bg-amber-400/10 text-slate-950 dark:text-white font-semibold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>RuPay / NetBank</span>
                      </button>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#081020] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      {paymentMethod === 'upi' && (
                        <>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            Corporate UPI VPA: <span className="font-mono">politicsworld@hdfcbank</span>
                          </div>
                          <div>
                            {isHi
                              ? 'BHIM / GPay / PhonePe / Paytm बिज़नेस QR से INR भुगतान कर 12-अंकीय UPI Ref दर्ज करें।'
                              : 'Pay via Business UPI / BharatQR and enter your 12-digit UPI reference below.'}
                          </div>
                        </>
                      )}
                      {paymentMethod === 'bank' && (
                        <>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            HDFC Bank · IFSC: <span className="font-mono">HDFC0000003</span> (New Delhi)
                          </div>
                          <div>
                            {isHi
                              ? 'NEFT या RTGS के माध्यम से अग्रिम INR भुगतान कर बैंक UTR नंबर दर्ज करें।'
                              : 'Complete electronic NEFT or RTGS transfer and enter your verified UTR number.'}
                          </div>
                        </>
                      )}
                      {paymentMethod === 'card' && (
                        <>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            Indian RuPay Debit/Credit · SBI / HDFC / ICICI NetBanking
                          </div>
                          <div>
                            {isHi
                              ? 'भारतीय नेटबैंकिंग या RuPay कार्ड भुगतान का ट्रांज़ैक्शन संदर्भ दर्ज करें।'
                              : 'Enter your Indian NetBanking or RuPay card settlement reference below.'}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          {isHi ? 'UPI / UTR / NetBanking संदर्भ *' : 'UPI / UTR / NetBanking Ref *'}
                        </label>
                        <button
                          type="button"
                          onClick={generateInstantGatewayReference}
                          className="text-[11px] font-semibold text-sky-700 dark:text-amber-400 hover:underline cursor-pointer"
                        >
                          {isHi ? '⚡ सैंपल UPI/UTR Ref भरें' : '⚡ Fill Verified INR Ref'}
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder={isHi ? 'उदा. UPI-402918472' : 'e.g. UPI-402918472 or UTR-82910411'}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{checkoutError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessingPayment || isUploadingBanner}
                    className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 disabled:opacity-50 text-white dark:text-slate-950 text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {isProcessingPayment
                        ? isHi
                          ? 'भुगतान सत्यापित व लाइव हो रहा है...'
                          : 'Verifying INR Settlement & Deploying Live...'
                        : isHi
                          ? `${formatInr(grandTotal)} सत्यापित करें और बैनर लाइव करें`
                          : `Verify ${formatInr(grandTotal)} & Deploy Banner Live`}
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>
                      {isHi
                        ? `स्वचालित समाप्ति: ${durationMeta.days} दिन · भुगतान पूर्णतः Not Refundable है`
                        : `Auto-expires after ${durationMeta.days} days · Strictly Not Refundable · ASCI & Sec 269ST Compliant`}
                    </span>
                  </div>
                </div>
              </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
