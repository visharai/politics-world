import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Send,
  Layers,
  ArrowRight,
  FileText,
  Printer,
  AlertCircle,
  Briefcase,
  Lock,
  Key,
  Eye,
  EyeOff,
  Globe,
  Landmark,
  BookOpen,
  Copy,
  Check,
  Sun,
  Moon,
  Download,
  BarChart3,
  Mail,
  MapPin,
  RefreshCw,
  Clock,
} from 'lucide-react';
import {
  downloadCommercialInvoicePdf,
  printCommercialInvoiceDocument,
  downloadCampaignDeliveryReportPdf,
  printCampaignDeliveryReportDocument,
} from '../utils/pdfExport';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { WalletLedgerDashboard } from './WalletLedgerDashboard';
import { AdSlotCheckoutModal } from './AdSlotCheckoutModal';
import { useAdSlots } from '../context/AdSlotContext';
import {
  AdSlotKey,
  AD_SLOTS_CATALOG,
  ClientTaxType,
  DurationKey,
  DURATION_LABELS,
  formatInr,
  INDIA_PLACEMENT_RULES,
} from '../data/adSlotsConfig';
import {
  PUBLISHER_BRAND_NAME,
  PublisherVaultStatus,
  changePublisherPin,
  clearOwnerSession,
  fetchPublisherVaultStatus,
  getOwnerSessionToken,
  recoverPublisherPin,
  setupPublisherVault,
  validateStrongPin,
  verifyPublisherPin,
} from '../services/publisherSecurity';
import {
  GST_STATE_CODES,
  type GstinValidationResult,
  resolveIndiaGstSupply,
  validateIndianGSTIN,
} from '../utils/gstValidator';

export { GST_STATE_CODES, type GstinValidationResult, validateIndianGSTIN };

interface CampaignReportRecord {
  reportId: string;
  bookingId: string;
  invoiceNumber: string;
  paymentReference: string;
  slotKey: string;
  slotTitle: string;
  brandName: string;
  campaignTitle: string;
  targetUrl: string;
  startDateIso: string;
  endDateIso: string;
  durationDays: number;
  status: 'Active' | 'Completed';
  totalImpressions: number;
  uniqueSessions: number;
  totalClicks: number;
  ctrPct: string;
  indiaStatesReachedCount: number;
  states: Record<string, number>;
  devices: Record<string, number>;
  languages: Record<string, number>;
  generatedAtIso: string | null;
  triggerReason: string | null;
  advertiserEmailDisplay: string;
  emailDelivery: {
    status: 'sent' | 'webhook-dispatched' | 'pending-config' | 'failed';
    recipientMasked: string;
    attemptedAtIso: string;
    provider: string;
    messageId?: string;
    note?: string;
  } | null;
}

interface MonetizationHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'revenue' | 'wallet' | 'invoice' | 'ratecard' | 'calculator' | 'guide' | 'reports';
  checkoutSlotRequest?: AdSlotKey | null;
  onConsumeCheckoutRequest?: () => void;
  onNavigateToSlot?: (domTargetId: string) => void;
  onOpenLegalArticle7?: () => void;
}

export const MonetizationHubModal: React.FC<MonetizationHubModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'revenue',
  checkoutSlotRequest = null,
  onConsumeCheckoutRequest,
  onNavigateToSlot,
  onOpenLegalArticle7,
}) => {
  const { langCode } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { getActiveSlot, clearSlotAsOwner, formatPrice } = useAdSlots();
  const isHi = langCode === 'hi';

  const [activeTab, setActiveTab] = useState<
    'revenue' | 'wallet' | 'invoice' | 'ratecard' | 'calculator' | 'guide' | 'reports'
  >(initialTab);
  const [checkoutModalSlot, setCheckoutModalSlot] = useState<AdSlotKey | null>(null);
  const [checkoutModalDuration, setCheckoutModalDuration] = useState<DurationKey>('1-month');
  const [rateCardDurations, setRateCardDurations] = useState<Record<AdSlotKey, DurationKey>>({
    header: '1-month',
    'in-article': '1-month',
    'sponsored-article': '1-month',
    'multimedia-feature': '1-month',
    'sponsored-wire': '1-month',
    magazine: '1-month',
  });
  const [clearingSlotKey, setClearingSlotKey] = useState<AdSlotKey | null>(null);
  const [telemetrySummary, setTelemetrySummary] = useState<{
    ga4Configured: boolean;
    slotSummaries: Record<string, any>;
    audiencePulse: {
      totalResponses: number;
      ageBrackets: Record<string, number>;
      states: Record<string, number>;
      updatedAtIso?: string;
    };
  } | null>(null);

  const [reportsPayload, setReportsPayload] = useState<{
    campaigns: CampaignReportRecord[];
    emailAutomation: { configured: boolean; mode?: string; provider?: string };
    ga4Configured: boolean;
    audiencePulse: {
      totalResponses: number;
      ageBrackets: Record<string, number>;
      states: Record<string, number>;
      updatedAtIso?: string;
    };
  } | null>(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportFilter, setReportFilter] = useState<'all' | 'Completed' | 'Active'>('all');
  const [copiedReportId, setCopiedReportId] = useState<string | null>(null);
  const [completingBookingId, setCompletingBookingId] = useState<string | null>(null);
  const [resendingBookingId, setResendingBookingId] = useState<string | null>(null);
  const [reportActionMsg, setReportActionMsg] = useState<{
    bookingId: string;
    text: string;
    isError?: boolean;
  } | null>(null);

  const fetchTelemetrySummary = async () => {
    try {
      const res = await fetch('/api/ads/telemetry/summary', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.ok) {
          setTelemetrySummary({
            ga4Configured: Boolean(data.ga4Configured),
            slotSummaries: data.slotSummaries || {},
            audiencePulse: data.audiencePulse || { totalResponses: 0, ageBrackets: {}, states: {} },
          });
        }
      }
    } catch {
      // keep existing telemetry state
    }
  };

  const fetchCampaignReports = async () => {
    setReportsLoading(true);
    try {
      const token = getOwnerSessionToken();
      const res = await fetch('/api/ads/reports', {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.ok) {
          setReportsPayload({
            campaigns: Array.isArray(data.campaigns) ? data.campaigns : [],
            emailAutomation: data.emailAutomation || { configured: false, provider: 'none' },
            ga4Configured: Boolean(data.ga4Configured),
            audiencePulse: data.audiencePulse || { totalResponses: 0, ageBrackets: {}, states: {} },
          });
        }
      }
    } catch {
      // ignore transient network failure
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // =========================================================================
  // POLITICS WORLD SERVER-SIDE MULTI-FACTOR VAULT (NO EXTERNAL AUTH POPUPS)
  // =========================================================================
  const [vaultStatus, setVaultStatus] = useState<PublisherVaultStatus | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isPublisherAuthenticated, setIsPublisherAuthenticated] = useState<boolean>(() =>
    Boolean(getOwnerSessionToken())
  );

  // Standard Unlock State
  const [enteredPin, setEnteredPin] = useState('');
  const [showPinDigits, setShowPinDigits] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // First-time Owner Vault Setup State
  const [setupOwnerEmail, setSetupOwnerEmail] = useState('');
  const [setupSecurityQuestion, setSetupSecurityQuestion] = useState('');
  const [setupSecurityAnswer, setSetupSecurityAnswer] = useState('');
  const [setupPinInput, setSetupPinInput] = useState('');
  const [setupConfirmPinInput, setSetupConfirmPinInput] = useState('');
  const [setupPinError, setSetupPinError] = useState<string | null>(null);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [generatedRecoveryKey, setGeneratedRecoveryKey] = useState<string | null>(null);
  const [copiedRecoveryKey, setCopiedRecoveryKey] = useState(false);

  // In-App Forgot PIN / Owner Recovery State (replaces external popup completely)
  const [isRecoverMode, setIsRecoverMode] = useState(false);
  const [recoverOwnerEmail, setRecoverOwnerEmail] = useState('');
  const [recoverSecurityAnswer, setRecoverSecurityAnswer] = useState('');
  const [recoverKeyInput, setRecoverKeyInput] = useState('');
  const [recoverNewPin, setRecoverNewPin] = useState('');
  const [recoverConfirmPin, setRecoverConfirmPin] = useState('');
  const [recoverError, setRecoverError] = useState<string | null>(null);

  // Hardened Change PIN Modal State
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [changeAuthMethod, setChangeAuthMethod] = useState<'current-pin' | 'recovery-key'>('current-pin');
  const [changeOwnerEmail, setChangeOwnerEmail] = useState('');
  const [changeSecurityAnswer, setChangeSecurityAnswer] = useState('');
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [recoveryKeyInput, setRecoveryKeyInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');
  const [changePinMsg, setChangePinMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [rotatedRecoveryKey, setRotatedRecoveryKey] = useState<string | null>(null);

  const refreshVaultStatus = async () => {
    try {
      const status = await fetchPublisherVaultStatus();
      setVaultStatus(status);
      setLockoutSeconds(status.lockedRemainingSec || 0);
      setIsPublisherAuthenticated(Boolean(status.sessionValid));
    } catch {
      setIsPublisherAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      void refreshVaultStatus();
      void fetchTelemetrySummary();
      void fetchCampaignReports();
    }
  }, [isOpen, isPublisherAuthenticated]);

  useEffect(() => {
    if (isOpen && activeTab === 'reports') {
      void fetchCampaignReports();
      void fetchTelemetrySummary();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (isOpen && checkoutSlotRequest) {
      setActiveTab('ratecard');
      setCheckoutModalDuration(rateCardDurations[checkoutSlotRequest] || '1-month');
      setCheckoutModalSlot(checkoutSlotRequest);
      onConsumeCheckoutRequest?.();
    }
  }, [isOpen, checkoutSlotRequest, onConsumeCheckoutRequest, rateCardDurations]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setLockoutSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lockoutSeconds]);

  const isConfidentialTab = (tab: string) => {
    return ['revenue', 'wallet', 'invoice', 'calculator'].includes(tab);
  };

  const handleInitialOwnerSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupPinError(null);

    if (!setupOwnerEmail.trim()) {
      setSetupPinError(
        isHi ? 'कृपया पंजीकृत स्वामी ईमेल दर्ज करें।' : 'Please enter your registered owner email.'
      );
      return;
    }
    if (setupSecurityQuestion.trim().length < 5 || setupSecurityAnswer.trim().length < 3) {
      setSetupPinError(
        isHi
          ? 'कृपया अपना निजी सुरक्षा प्रश्न (कम से कम 5 अक्षर) और गुप्त उत्तर (कम से कम 3 अक्षर) दर्ज करें।'
          : 'Enter a personal security question (min 5 chars) and secret answer (min 3 chars).'
      );
      return;
    }
    const policy = validateStrongPin(setupPinInput);
    if (!policy.valid) {
      setSetupPinError(isHi ? policy.reasonHi || '' : policy.reasonEn || '');
      return;
    }
    if (setupPinInput.trim() !== setupConfirmPinInput.trim()) {
      setSetupPinError(isHi ? 'दोनों पिन आपस में मेल नहीं खा रहे।' : 'PINs do not match.');
      return;
    }

    setIsSavingSecurity(true);
    try {
      const res = await setupPublisherVault({
        ownerEmail: setupOwnerEmail.trim(),
        securityQuestion: setupSecurityQuestion.trim(),
        securityAnswer: setupSecurityAnswer.trim(),
        newPin: setupPinInput.trim(),
      });
      if (!res.ok) {
        setSetupPinError(isHi ? res.errorHi || 'सेटअप विफल रहा।' : res.errorEn || 'Setup failed.');
        return;
      }
      setGeneratedRecoveryKey(res.recoveryKey || null);
      setSetupOwnerEmail('');
      setSetupSecurityQuestion('');
      setSetupSecurityAnswer('');
      setSetupPinInput('');
      setSetupConfirmPinInput('');
      await refreshVaultStatus();
    } catch {
      setSetupPinError(isHi ? 'सर्वर से कनेक्ट करने में त्रुटि हुई।' : 'Failed to connect to server.');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handleConfirmRecoverySaved = () => {
    setGeneratedRecoveryKey(null);
    setIsRecoverMode(false);
    setIsPublisherAuthenticated(true);
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    if (lockoutSeconds > 0) return;

    try {
      const res = await verifyPublisherPin(enteredPin);
      if (res.ok) {
        setIsPublisherAuthenticated(true);
        setEnteredPin('');
        await refreshVaultStatus();
        return;
      }

      if (res.notInitialized) {
        await refreshVaultStatus();
        return;
      }

      if (res.lockedRemainingSec && res.lockedRemainingSec > 0) {
        setLockoutSeconds(res.lockedRemainingSec);
        setPinError(
          isHi
            ? 'लगातार गलत प्रयासों के कारण POLITICS WORLD वॉलेट 5 मिनट के लिए लॉक हो गया है।'
            : 'Too many failed attempts. POLITICS WORLD vault locked for 5 minutes.'
        );
        return;
      }

      setPinError(
        isHi
          ? `गलत सुरक्षा पिन। शेष प्रयास: ${res.attemptsRemaining ?? 0}`
          : `Incorrect PIN. Attempts remaining: ${res.attemptsRemaining ?? 0}`
      );
    } catch {
      setPinError(isHi ? 'पिन सत्यापन में नेटवर्क त्रुटि।' : 'Network error verifying PIN.');
    }
  };

  const handleRecoverPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError(null);

    const policy = validateStrongPin(recoverNewPin);
    if (!policy.valid) {
      setRecoverError(isHi ? policy.reasonHi || '' : policy.reasonEn || '');
      return;
    }
    if (recoverNewPin.trim() !== recoverConfirmPin.trim()) {
      setRecoverError(isHi ? 'नए पिन आपस में मेल नहीं खा रहे।' : 'New PINs do not match.');
      return;
    }

    setIsSavingSecurity(true);
    try {
      const res = await recoverPublisherPin({
        ownerEmail: recoverOwnerEmail.trim(),
        securityAnswer: recoverSecurityAnswer.trim(),
        recoveryKey: recoverKeyInput.trim(),
        newPin: recoverNewPin.trim(),
      });
      if (!res.ok) {
        if (res.lockedRemainingSec && res.lockedRemainingSec > 0) {
          setLockoutSeconds(res.lockedRemainingSec);
        }
        setRecoverError(isHi ? res.errorHi || 'रिकवरी विफल।' : res.errorEn || 'Recovery failed.');
        return;
      }
      setGeneratedRecoveryKey(res.recoveryKey || null);
      setRecoverOwnerEmail('');
      setRecoverSecurityAnswer('');
      setRecoverKeyInput('');
      setRecoverNewPin('');
      setRecoverConfirmPin('');
      await refreshVaultStatus();
    } catch {
      setRecoverError(isHi ? 'सर्वर त्रुटि।' : 'Server error.');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handlePublisherLogout = () => {
    clearOwnerSession();
    setIsPublisherAuthenticated(false);
    setActiveTab('ratecard');
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinMsg(null);

    if (!changeOwnerEmail.trim()) {
      setChangePinMsg({
        text: isHi
          ? 'पिन बदलने के लिए पंजीकृत POLITICS WORLD स्वामी ईमेल दर्ज करें।'
          : 'Enter your registered POLITICS WORLD owner email.',
        isError: true,
      });
      return;
    }

    if (!changeSecurityAnswer.trim()) {
      setChangePinMsg({
        text: isHi
          ? 'कृपया अपने निजी सुरक्षा प्रश्न का उत्तर दर्ज करें।'
          : 'Enter your private security question answer.',
        isError: true,
      });
      return;
    }

    const policy = validateStrongPin(newPinInput);
    if (!policy.valid) {
      setChangePinMsg({
        text: isHi ? policy.reasonHi || '' : policy.reasonEn || '',
        isError: true,
      });
      return;
    }

    if (newPinInput.trim() !== confirmNewPinInput.trim()) {
      setChangePinMsg({
        text: isHi ? 'नए पिन आपस में मेल नहीं खाते।' : 'New PINs do not match.',
        isError: true,
      });
      return;
    }

    setIsSavingSecurity(true);
    try {
      const res = await changePublisherPin({
        ownerEmail: changeOwnerEmail.trim(),
        securityAnswer: changeSecurityAnswer.trim(),
        method: changeAuthMethod,
        currentPin: changeAuthMethod === 'current-pin' ? currentPinInput.trim() : undefined,
        recoveryKey: changeAuthMethod === 'recovery-key' ? recoveryKeyInput.trim() : undefined,
        newPin: newPinInput.trim(),
      });
      if (!res.ok) {
        if (res.lockedRemainingSec && res.lockedRemainingSec > 0) {
          setLockoutSeconds(res.lockedRemainingSec);
        }
        setChangePinMsg({
          text: isHi ? res.errorHi || 'पिन अपडेट विफल रहा।' : res.errorEn || 'Failed to update PIN.',
          isError: true,
        });
        return;
      }

      setRotatedRecoveryKey(res.recoveryKey || null);
      setChangeOwnerEmail('');
      setChangeSecurityAnswer('');
      setCurrentPinInput('');
      setRecoveryKeyInput('');
      setNewPinInput('');
      setConfirmNewPinInput('');
      setChangePinMsg({
        text: isHi
          ? 'POLITICS WORLD सुरक्षा पिन एन्क्रिप्टेड रूप से अपडेट हो गया है।'
          : 'POLITICS WORLD security PIN updated & encrypted.',
        isError: false,
      });
      await refreshVaultStatus();
    } catch {
      setChangePinMsg({
        text: isHi ? 'सर्वर से संपर्क करने में त्रुटि।' : 'Network error updating PIN.',
        isError: true,
      });
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const [monthlyTraffic, setMonthlyTraffic] = useState<number>(50000);

  // Inquiry form state
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [sponsorSlot, setSponsorSlot] = useState('header-leaderboard');
  const [sponsorMessage, setSponsorMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Tax Invoice state (Defaulted to 1-Month Politics World Demo Preview)
  const [clientType, setClientType] = useState<ClientTaxType>('b2b');
  const [invSlot, setInvSlot] = useState<
    'header' | 'in-article' | 'sponsored-article' | 'multimedia-feature' | 'sponsored-wire' | 'magazine'
  >('header');
  const [invDuration, setInvDuration] = useState<DurationKey>('1-month');
  const [invClientName, setInvClientName] = useState('Politics World India Media Desk');
  const [invContactPerson, setInvContactPerson] = useState('Politics World Editorial Desk');
  const [invClientEmail, setInvClientEmail] = useState('vrai74918@gmail.com');
  const [invClientPhone, setInvClientPhone] = useState('+91 98110 45210');
  const [invClientGstin, setInvClientGstin] = useState('07AAACP9921D1Z8');
  const [invClientState, setInvClientState] = useState('07 - Delhi');
  const [invClientPan, setInvClientPan] = useState('');
  const [invClientAddress, setInvClientAddress] = useState('Connaught Place, New Delhi 110001');
  const [invoiceCopied, setInvoiceCopied] = useState(false);
  const [invoicePdfSaved, setInvoicePdfSaved] = useState(false);
  const [gstinErrorModal, setGstinErrorModal] = useState<string | null>(null);

  const loadPoliticsWorldDemoInvoice = () => {
    setClientType('b2b');
    setInvSlot('header');
    setInvClientName('Politics World India Media Desk');
    setInvContactPerson('Politics World Editorial Desk');
    setInvClientEmail('vrai74918@gmail.com');
    setInvClientPhone('+91 98110 45210');
    setInvClientGstin('07AAACP9921D1Z8');
    setInvClientState('07 - Delhi');
    setInvClientPan('');
    setInvClientAddress('Connaught Place, New Delhi 110001');
    setGstinErrorModal(null);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:vrai74918@gmail.com?subject=${encodeURIComponent(
      `[India Ad Booking] Request for ${sponsorSlot} - ${sponsorName}`
    )}&body=${encodeURIComponent(
      `Organization / Name: ${sponsorName}\nEmail: ${sponsorEmail}\nSlot: ${sponsorSlot}\nCurrency: INR (₹)\n\nNotes:\n${sponsorMessage}`
    )}`;
    window.location.href = mailtoUrl;
    setInquirySent(true);
  };

  // India Domestic Forecast metrics in INR (₹)
  const directSponsorInr = monthlyTraffic >= 100000 ? 320000 : monthlyTraffic >= 30000 ? 150000 : 75000;
  const sponsoredContentInr = Math.round((monthlyTraffic / 1000) * 1200);
  const totalMonthlyEarningsInr = directSponsorInr + sponsoredContentInr;

  // Authoritative India Domestic Slot Pricing via AD_SLOTS_CATALOG (INR ₹ + 18% GST)
  const activeSlotCatalog = AD_SLOTS_CATALOG[invSlot];
  const slotInfo = {
    title: activeSlotCatalog.titleEn,
    sac: activeSlotCatalog.sac,
    category: activeSlotCatalog.placementEn,
  };
  const basePrice = activeSlotCatalog.rates[invDuration];
  const gstAmount = Math.round(basePrice * 0.18);
  const gstSupply = resolveIndiaGstSupply({
    clientType,
    gstin: invClientGstin,
    b2cStateLabel: invClientState,
    gstAmount,
  });
  const cgstAmount = gstSupply.cgstAmount;
  const sgstAmount = gstSupply.sgstAmount;
  const igstAmount = gstSupply.igstAmount;
  const grandTotal = basePrice + gstAmount;

  const today = new Date();
  const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const campaignStartDate = new Date(today.getTime() + 86400000);
  const durationDays =
    invDuration === '1-week' ? 7 : invDuration === '1-month' ? 30 : invDuration === '3-months' ? 90 : 365;
  const campaignEndDate = new Date(campaignStartDate.getTime() + durationDays * 86400000);
  const invoiceNumber = `PW/TAX-INV/2026-27/${((basePrice % 899) + 101).toString()}`;

  const gstinResult = validateIndianGSTIN(invClientGstin);

  const handleSendTaxInvoiceBooking = () => {
    if (clientType === 'b2b' && !gstinResult.isValid) {
      setGstinErrorModal(
        gstinResult.error ||
          'अमान्य GSTIN नंबर! यदि आपके पास GSTIN नहीं है, तो India B2C चुनें।'
      );
      return;
    }

    const verifiedTaxLabel =
      clientType === 'b2b'
        ? `${invClientGstin.toUpperCase()} (${gstinResult.stateName} [${gstinResult.stateCode}] · PAN: ${gstinResult.pan})`
        : `URP (Rule 46 Small Business) · POS: ${gstSupply.placeOfSupply}${
            invClientPan ? ` · PAN: ${invClientPan.toUpperCase()}` : ''
          }`;

    const taxSummaryLine = gstSupply.isInterState
      ? `IGST (18%): ${formatInr(igstAmount)}`
      : `CGST (9%) + SGST (9%): ${formatInr(cgstAmount)} + ${formatInr(sgstAmount)}`;

    const subject = `[INDIA GST TAX INVOICE BOOKING] ${invoiceNumber} - ${invClientName}`;
    const body = `INDIA NATIONAL AD BOOKING CONFIRMATION (INR)
Invoice: ${invoiceNumber} | Date: ${formatDate(today)} | Currency: INR | SAC: ${slotInfo.sac}
Client: ${invClientName} (${invContactPerson})
Email: ${invClientEmail} | Phone: ${invClientPhone}
Tax Classification: ${verifiedTaxLabel}
Place of Supply: ${gstSupply.placeOfSupply} | Reverse Charge: No
Address: ${invClientAddress}

Slot: ${slotInfo.title} (${invDuration} / ${durationDays} Days)
Window: ${formatDate(campaignStartDate)} to ${formatDate(campaignEndDate)}

Taxable Value (INR): ${formatInr(basePrice)}
${taxSummaryLine}
Grand Total (INR): ${formatInr(grandTotal)}

Terms: 100% digital pre-payment via Corporate UPI/NEFT/RTGS (Sec 269ST); ASCI & IT Rules 2021 compliant.`;

    window.location.href = `mailto:vrai74918@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setInvoiceCopied(true);
    setTimeout(() => setInvoiceCopied(false), 3000);
  };

  const tabs: Array<{
    id: 'revenue' | 'wallet' | 'invoice' | 'ratecard' | 'calculator' | 'guide' | 'reports';
    num: string;
    label: string;
    hiLabel: string;
    icon: React.ReactNode;
    isPrivate: boolean;
  }> = [
    {
      id: 'revenue',
      num: '1',
      label: 'Revenue',
      hiLabel: 'रेवेन्यू',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      isPrivate: true,
    },
    {
      id: 'wallet',
      num: '2',
      label: 'Treasury',
      hiLabel: 'ट्रेज़री व बैंक',
      icon: <Landmark className="w-3.5 h-3.5" />,
      isPrivate: true,
    },
    {
      id: 'invoice',
      num: '3',
      label: 'Invoices',
      hiLabel: 'कमर्शियल इनवॉइस',
      icon: <FileText className="w-3.5 h-3.5" />,
      isPrivate: true,
    },
    {
      id: 'calculator',
      num: '4',
      label: 'Forecast',
      hiLabel: 'आय अनुमान',
      icon: <Zap className="w-3.5 h-3.5" />,
      isPrivate: true,
    },
    {
      id: 'ratecard',
      num: '5',
      label: 'India Ad Rates',
      hiLabel: 'राष्ट्रीय विज्ञापन दरें',
      icon: <Layers className="w-3.5 h-3.5" />,
      isPrivate: false,
    },
    {
      id: 'guide',
      num: '6',
      label: 'Playbook',
      hiLabel: 'रणनीति गाइड',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      isPrivate: false,
    },
    {
      id: 'reports',
      num: '7',
      label: 'Reach & Reports',
      hiLabel: 'रीच व रिपोर्ट्स',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
      isPrivate: false,
    },
  ];

  const rateCards: Array<{
    slotKey: 'header' | 'in-article' | 'sponsored-article' | 'multimedia-feature' | 'sponsored-wire' | 'magazine';
    category: string;
    title: string;
    spec: string;
    monthlyPrice: string;
    unitLabel: string;
    weeklyPrice: string;
    highlight?: boolean;
  }> = [
    {
      slotKey: 'header',
      category: isHi ? 'नेशनल बिलबोर्ड' : 'National Masthead',
      title: isHi ? 'नेशनल हेडर लीडरबोर्ड बिलबोर्ड' : 'National Header Leaderboard Billboard',
      spec: isHi
        ? '728×90 और 970×250 · अखिल भारतीय संस्करण के शीर्ष पर पूर्ण राष्ट्रीय उपस्थिति'
        : '728×90 & 970×250 · Commanding above-the-fold national broadsheet visibility across India',
      monthlyPrice: formatPrice(AD_SLOTS_CATALOG.header.rates['1-month']),
      unitLabel: isHi ? '/ माह' : '/ month',
      weeklyPrice: `${formatPrice(AD_SLOTS_CATALOG.header.rates['1-week'])} ${isHi ? '/ सप्ताह' : '/ week'}`,
      highlight: true,
    },
    {
      slotKey: 'in-article',
      category: isHi ? 'राष्ट्रीय समाचार यूनिट' : 'National Inline',
      title: isHi ? 'इन-आर्टिकल नेशनल एडिटोरियल यूनिट' : 'In-Article National Editorial Unit',
      spec: isHi
        ? 'प्रत्येक प्रमुख भारतीय नीति, संसद और अर्थव्यवस्था रिपोर्ट के भीतर'
        : 'Embedded inside high-engagement India parliamentary & policy dispatches',
      monthlyPrice: formatPrice(AD_SLOTS_CATALOG['in-article'].rates['1-month']),
      unitLabel: isHi ? '/ माह' : '/ month',
      weeklyPrice: `${formatPrice(AD_SLOTS_CATALOG['in-article'].rates['1-week'])} ${isHi ? '/ सप्ताह' : '/ week'}`,
    },
    {
      slotKey: 'sponsored-article',
      category: isHi ? 'प्रायोजित राष्ट्रीय फ़ीचर' : 'Sponsored National Feature',
      title: isHi ? 'स्पॉन्सर्ड नेशनल एडिटोरियल स्टोरी' : 'Sponsored National Editorial Story',
      spec: isHi
        ? 'विस्तृत भारतीय कॉर्पोरेट आलेख, मुख्य फ़ोटो और स्थायी राष्ट्रीय आर्काइव लिंक'
        : 'Long-form institutional brief with lead photography & permanent India archive',
      monthlyPrice: formatPrice(AD_SLOTS_CATALOG['sponsored-article'].rates['1-week']),
      unitLabel: isHi ? '/ सप्ताह' : '/ week',
      weeklyPrice: `${formatPrice(AD_SLOTS_CATALOG['sponsored-article'].rates['1-month'])} ${isHi ? '/ माह' : '/ month'}`,
    },
    {
      slotKey: 'multimedia-feature',
      category: isHi ? 'रिच मीडिया स्पॉटलाइट' : 'Multimedia Spotlight',
      title: isHi ? 'मल्टीमीडिया वीडियो व वॉइस डॉज़ियर' : 'Multimedia Feature & AI Voice',
      spec: isHi
        ? 'फ़ीचर आलेख, फ़ोटो गैलरी, वीडियो एम्बेड और हिंदी/अंग्रेज़ी वॉइस नैरेशन'
        : 'Executive feature with gallery, video briefing & bilingual voice narration',
      monthlyPrice: formatPrice(AD_SLOTS_CATALOG['multimedia-feature'].rates['1-week']),
      unitLabel: isHi ? '/ सप्ताह' : '/ week',
      weeklyPrice: `${formatPrice(AD_SLOTS_CATALOG['multimedia-feature'].rates['1-month'])} ${isHi ? '/ माह' : '/ month'}`,
    },
    {
      slotKey: 'sponsored-wire',
      category: isHi ? 'राष्ट्रीय प्रेस वायर' : 'National Press Wire',
      title: isHi ? 'आधिकारिक राष्ट्रीय प्रेस वायर' : 'National Press Release Wire',
      spec: isHi
        ? 'होमपेज राष्ट्रीय वायर पर प्राथमिकता प्रकाशन व स्थायी भारतीय कॉर्पोरेट आर्काइव'
        : 'Priority front-page India wire syndication with permanent corporate archive',
      monthlyPrice: formatPrice(AD_SLOTS_CATALOG['sponsored-wire'].rates['1-week']),
      unitLabel: isHi ? '/ सप्ताह' : '/ week',
      weeklyPrice: `${formatPrice(AD_SLOTS_CATALOG['sponsored-wire'].rates['1-month'])} ${isHi ? '/ माह' : '/ month'}`,
    },
    {
      slotKey: 'magazine',
      category: isHi ? 'नोटबुक राष्ट्रीय संस्करण' : 'India Edition Showcase',
      title: isHi ? 'नोटबुक मैगज़ीन मास्टहेड बॉक्स' : 'Notebook Magazine Masthead Box',
      spec: isHi
        ? 'भारतीय नीति निर्माताओं व पाठकों के लिए विशेष मास्टहेड स्पॉटलाइट'
        : 'Exclusive masthead showcase curated for Indian policy leaders & readers',
      monthlyPrice: formatPrice(AD_SLOTS_CATALOG.magazine.rates['1-month']),
      unitLabel: isHi ? '/ माह' : '/ month',
      weeklyPrice: `${formatPrice(AD_SLOTS_CATALOG.magazine.rates['1-week'])} ${isHi ? '/ सप्ताह' : '/ week'}`,
    },
  ];

  const openSelfServeCheckout = (
    slotKey: AdSlotKey,
    duration: DurationKey = '1-month'
  ) => {
    setCheckoutModalDuration(duration);
    setCheckoutModalSlot(slotKey);
  };

  const handleClearLiveSlot = async (slotKey: AdSlotKey) => {
    setClearingSlotKey(slotKey);
    await clearSlotAsOwner(slotKey);
    setClearingSlotKey(null);
  };

  const formatIstWindow = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      }) + ' IST';
    } catch {
      return isoStr;
    }
  };

  const buildReportPlainText = (c: CampaignReportRecord) => {
    const statesList = Object.entries(c.states || {}).sort((a, b) => b[1] - a[1]);
    const statesText =
      statesList.length > 0
        ? statesList.map(([st, cnt]) => `  - ${st}: ${cnt.toLocaleString('en-IN')}`).join('\n')
        : '  - Pan-India / Unspecified Region: 0';
    return [
      'POLITICS WORLD INDIA MEDIA DESK · CAMPAIGN COMPLETION & REACH REPORT',
      `Status: ${c.status} | Booking ID: ${c.bookingId} | Invoice: ${c.invoiceNumber}`,
      `Advertiser: ${c.brandName}`,
      `Campaign Title: ${c.campaignTitle}`,
      `Slot: ${c.slotTitle} (${c.durationDays} Days)`,
      `Run Dates (IST): ${formatIstWindow(c.startDateIso)} -> ${formatIstWindow(c.endDateIso)}`,
      `Total Impressions Across India: ${c.totalImpressions.toLocaleString('en-IN')}`,
      `Unique Sessions: ${c.uniqueSessions.toLocaleString('en-IN')} | Clicks: ${c.totalClicks.toLocaleString('en-IN')} (CTR: ${c.ctrPct}%)`,
      `Indian States Reached: ${c.indiaStatesReachedCount}`,
      'State-Wise Breakdown Across India:',
      statesText,
      `Email Dispatch Status: ${c.emailDelivery?.status || 'pending-config'} (${c.advertiserEmailDisplay})`,
    ].join('\n');
  };

  const handleCopyReportSummary = async (c: CampaignReportRecord) => {
    try {
      await navigator.clipboard.writeText(buildReportPlainText(c));
      setCopiedReportId(c.bookingId);
      setTimeout(() => setCopiedReportId((prev) => (prev === c.bookingId ? null : prev)), 2500);
    } catch {
      setReportActionMsg({
        bookingId: c.bookingId,
        text: isHi ? 'क्लिपबोर्ड कॉपी विफल रही।' : 'Clipboard copy unavailable.',
        isError: true,
      });
    }
  };

  const handleCompleteCampaignNow = async (bookingId: string) => {
    const token = getOwnerSessionToken();
    if (!token) return;
    setCompletingBookingId(bookingId);
    setReportActionMsg(null);
    try {
      const res = await fetch(`/api/ads/campaigns/${encodeURIComponent(bookingId)}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        const dStatus = data?.emailDelivery?.status || 'pending-config';
        setReportActionMsg({
          bookingId,
          text:
            dStatus === 'sent' || dStatus === 'webhook-dispatched'
              ? isHi
                ? 'अभियान पूर्ण घोषित हुआ और विज्ञापनदाता को ईमेल रिपोर्ट भेज दी गई।'
                : 'Campaign marked Completed and report email dispatched to advertiser.'
              : isHi
                ? 'रिपोर्ट जनरेट हो गई। ऑटो-ईमेल हेतु सर्वर पर RESEND_API_KEY या Webhook Env सेट करें।'
                : 'Completion report generated. Set RESEND_API_KEY or webhook env on server to dispatch email.',
        });
        await Promise.all([fetchCampaignReports(), fetchTelemetrySummary()]);
      } else {
        setReportActionMsg({
          bookingId,
          text: (isHi ? data?.errorHi : data?.errorEn) || 'Failed to complete campaign.',
          isError: true,
        });
      }
    } catch {
      setReportActionMsg({
        bookingId,
        text: isHi ? 'सर्वर से संपर्क करने में त्रुटि।' : 'Network error completing campaign.',
        isError: true,
      });
    } finally {
      setCompletingBookingId(null);
    }
  };

  const handleResendReportEmail = async (bookingId: string) => {
    const token = getOwnerSessionToken();
    if (!token) return;
    setResendingBookingId(bookingId);
    setReportActionMsg(null);
    try {
      const res = await fetch(`/api/ads/reports/${encodeURIComponent(bookingId)}/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        const dStatus = data?.emailDelivery?.status || 'pending-config';
        setReportActionMsg({
          bookingId,
          text:
            dStatus === 'sent' || dStatus === 'webhook-dispatched'
              ? isHi
                ? 'विज्ञापनदाता ईमेल पर समापन रिपोर्ट सफलतापूर्वक भेजी गई।'
                : 'Completion report email dispatched successfully.'
              : data?.emailDelivery?.note ||
                (isHi ? 'सर्वर ईमेल कुंजी (RESEND_API_KEY/Webhook) प्रतीक्षारत है।' : 'Awaiting server email API key/webhook configuration.'),
          isError: dStatus === 'failed',
        });
        await fetchCampaignReports();
      } else {
        setReportActionMsg({
          bookingId,
          text: (isHi ? data?.errorHi : data?.errorEn) || 'Email dispatch failed.',
          isError: true,
        });
      }
    } catch {
      setReportActionMsg({
        bookingId,
        text: isHi ? 'नेटवर्क त्रुटि।' : 'Network error sending email.',
        isError: true,
      });
    } finally {
      setResendingBookingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-6xl h-[94dvh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#091122] text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden font-sans">
        {/* Clean Enterprise Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1529] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-950 dark:bg-amber-400/15 dark:border dark:border-amber-400/30 text-white dark:text-amber-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base tracking-tight text-slate-950 dark:text-white truncate">
                {isHi ? 'POLITICS WORLD · भारत पब्लिशर एवं विज्ञापन डेस्क' : 'POLITICS WORLD · India Publisher Desk'}
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isPublisherAuthenticated
                  ? isHi
                    ? 'सत्यापित भारतीय पब्लिशर सत्र · मुद्रा: INR (₹) · SAC 998363'
                    : 'Verified Owner Session · India Domestic Currency: INR (₹) · SAC 998363'
                  : isHi
                    ? 'राष्ट्रीय भारतीय मीडिया पोर्टफोलियो · INR (₹) · 18% GST लागू'
                    : 'India National Advertising Portfolio · INR (₹) · SAC 998363'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-bold">
              INR ₹ · 18% GST
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? (isHi ? 'डे लाइट थीम चुनें' : 'Switch to Day Light Theme') : isHi ? 'नाइट डार्क थीम चुनें' : 'Switch to Night Dark Theme'}
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d172c] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{isHi ? 'डे लाइट' : 'Day Theme'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">{isHi ? 'नाइट थीम' : 'Night Theme'}</span>
                </>
              )}
            </button>

            {isPublisherAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setChangePinMsg(null);
                    setChangeOwnerEmail('');
                    setChangeSecurityAnswer('');
                    setCurrentPinInput('');
                    setRecoveryKeyInput('');
                    setNewPinInput('');
                    setConfirmNewPinInput('');
                    setRotatedRecoveryKey(null);
                    setIsChangePinOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d172c] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">{isHi ? 'पिन सुरक्षा' : 'Security PIN'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePublisherLogout}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  <span>{isHi ? 'लॉक करें' : 'Lock Desk'}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Clean 6-Tab Navigation Bar */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar px-3 sm:px-6 bg-white dark:bg-[#0b1529] shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 border-b-2 inline-flex items-center gap-1.5 text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-slate-950 dark:border-amber-400 text-slate-950 dark:text-white font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
              >
                <span className={isActive ? 'text-slate-950 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}>
                  {tab.icon}
                </span>
                <span>
                  {tab.num}. {isHi ? tab.hiLabel : tab.label}
                </span>
                {tab.isPrivate && !isPublisherAuthenticated && (
                  <Lock className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Unified Enterprise Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-[#060c1a]">
          {/* POLITICS WORLD ZERO-TRUST OWNER GATE FOR PRIVATE SECTIONS (1, 2, 3, 4) */}
          {!isPublisherAuthenticated && isConfidentialTab(activeTab) ? (
            <div className="min-h-[380px] flex items-center justify-center py-6">
              <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-2xl space-y-5">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-emerald-500/15 dark:border dark:border-emerald-500/30 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-slate-500 dark:text-slate-400">
                        {PUBLISHER_BRAND_NAME} · OWNER VAULT
                      </div>
                      <h3 className="text-base font-bold text-slate-950 dark:text-white">
                        {isHi ? 'POLITICS WORLD पब्लिशर सत्यापन' : 'POLITICS WORLD Owner Vault'}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
                  {isHi
                    ? `केवल अधिकृत स्वामी (${vaultStatus?.ownerEmailMasked || 'v••••8@gmail.com'}) हेतु 100% ऑन-साइट एन्क्रिप्टेड सुरक्षा`
                    : `On-site encrypted access restricted to registered owner (${vaultStatus?.ownerEmailMasked || 'v••••8@gmail.com'})`}
                </p>

                {authLoading ? (
                  <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    {isHi ? 'POLITICS WORLD सुरक्षा स्थिति जाँची जा रही है...' : 'Checking POLITICS WORLD vault status...'}
                  </div>
                ) : generatedRecoveryKey ? (
                  /* One-Time Master Recovery Key Display */
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                      <div className="font-bold">
                        {isHi ? 'आपकी मास्टर रिकवरी कुंजी (सुरक्षित रखें)' : 'Save Your Master Recovery Key'}
                      </div>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300/90">
                        {isHi
                          ? 'यह कुंजी केवल एक बार दिखाई जा रही है। पिन भूलने पर POLITICS WORLD वॉल्ट में यही काम आएगी।'
                          : 'Shown once only. Use this key directly inside POLITICS WORLD to reset a forgotten PIN.'}
                      </p>
                      <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-[#081020] border border-amber-300 dark:border-amber-700/70 font-mono text-sm font-bold text-slate-950 dark:text-amber-300">
                        <span>{generatedRecoveryKey}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedRecoveryKey);
                            setCopiedRecoveryKey(true);
                            setTimeout(() => setCopiedRecoveryKey(false), 2000);
                          }}
                          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                          aria-label="Copy Recovery Key"
                        >
                          {copiedRecoveryKey ? (
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmRecoverySaved}
                      className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                    >
                      {isHi ? 'मैंने कुंजी सुरक्षित कर ली है · POLITICS WORLD खोलें' : 'I Saved My Key · Enter POLITICS WORLD Desk'}
                    </button>
                  </div>
                ) : !vaultStatus?.initialized ? (
                  /* First-Time Setup directly inside POLITICS WORLD (Zero External Popups) */
                  <form onSubmit={handleInitialOwnerSetup} className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {isHi
                        ? 'पहली बार पिन सेट करने के लिए अपने पंजीकृत ईमेल, निजी सुरक्षा प्रश्न और एक मजबूत पिन की पुष्टि करें। कोई भी बाहरी व्यक्ति इसे सेट नहीं कर सकता।'
                        : 'Initialize your POLITICS WORLD vault with your registered owner email, private security question, and a strong PIN.'}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isHi ? 'पंजीकृत स्वामी ईमेल (POLITICS WORLD)' : 'Registered Owner Email'}
                      </label>
                      <input
                        type="email"
                        value={setupOwnerEmail}
                        onChange={(e) => setSetupOwnerEmail(e.target.value)}
                        placeholder={vaultStatus?.ownerEmailMasked || 'v••••8@gmail.com'}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isHi ? 'अपना निजी सुरक्षा प्रश्न चुनें/लिखें' : 'Personal Security Question'}
                      </label>
                      <input
                        type="text"
                        value={setupSecurityQuestion}
                        onChange={(e) => setSetupSecurityQuestion(e.target.value)}
                        placeholder={isHi ? 'जैसे: मेरे पहले स्कूल या शहर का नाम?' : 'e.g. Name of my first city or school?'}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isHi ? 'गुप्त उत्तर (केवल आपको याद रहे)' : 'Secret Security Answer'}
                      </label>
                      <input
                        type="password"
                        value={setupSecurityAnswer}
                        onChange={(e) => setSetupSecurityAnswer(e.target.value)}
                        placeholder={isHi ? 'गुप्त उत्तर दर्ज करें' : 'Enter secret answer'}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="password"
                        value={setupPinInput}
                        onChange={(e) => setSetupPinInput(e.target.value)}
                        placeholder={isHi ? 'मजबूत पिन (4-8 अंक)' : 'Strong PIN (4-8)'}
                        maxLength={8}
                        inputMode="numeric"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-center tracking-[0.2em] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                      />
                      <input
                        type="password"
                        value={setupConfirmPinInput}
                        onChange={(e) => setSetupConfirmPinInput(e.target.value)}
                        placeholder={isHi ? 'पिन की पुष्टि करें' : 'Confirm PIN'}
                        maxLength={8}
                        inputMode="numeric"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-center tracking-[0.2em] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                      />
                    </div>

                    {setupPinError && (
                      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{setupPinError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSavingSecurity}
                      className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white disabled:opacity-60 text-white dark:text-slate-950 font-semibold cursor-pointer"
                    >
                      {isSavingSecurity
                        ? isHi
                          ? 'POLITICS WORLD वॉल्ट सेट हो रहा है...'
                          : 'Initializing POLITICS WORLD Vault...'
                        : isHi
                          ? 'POLITICS WORLD पिन सुरक्षित करें'
                          : 'Save POLITICS WORLD Vault PIN'}
                    </button>
                  </form>
                ) : isRecoverMode ? (
                  /* In-Modal Multi-Factor Owner Recovery (Zero External Domains) */
                  <form onSubmit={handleRecoverPinSubmit} className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
                      <div className="font-bold mb-0.5">
                        {isHi ? 'POLITICS WORLD स्वामी पिन रिकवरी' : 'POLITICS WORLD Owner Recovery'}
                      </div>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300/90">
                        {isHi
                          ? 'पंजीकृत ईमेल, सुरक्षा प्रश्न का उत्तर और मास्टर रिकवरी कुंजी से नया पिन सेट करें।'
                          : 'Reset your PIN using registered email, secret answer, and Master Recovery Key.'}
                      </p>
                    </div>

                    <input
                      type="email"
                      value={recoverOwnerEmail}
                      onChange={(e) => setRecoverOwnerEmail(e.target.value)}
                      placeholder={isHi ? `स्वामी ईमेल (${vaultStatus.ownerEmailMasked})` : `Owner Email (${vaultStatus.ownerEmailMasked})`}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                    />

                    <div>
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        {vaultStatus.securityQuestion || (isHi ? 'निजी सुरक्षा प्रश्न' : 'Security Question')}
                      </div>
                      <input
                        type="password"
                        value={recoverSecurityAnswer}
                        onChange={(e) => setRecoverSecurityAnswer(e.target.value)}
                        placeholder={isHi ? 'गुप्त उत्तर दर्ज करें' : 'Secret security answer'}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                      />
                    </div>

                    <input
                      type="text"
                      value={recoverKeyInput}
                      onChange={(e) => setRecoverKeyInput(e.target.value.toUpperCase())}
                      placeholder="PW-XXXX-XXXX-XXXX"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono uppercase text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="password"
                        value={recoverNewPin}
                        onChange={(e) => setRecoverNewPin(e.target.value)}
                        placeholder={isHi ? 'नया मजबूत पिन' : 'New Strong PIN'}
                        maxLength={8}
                        inputMode="numeric"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-center tracking-[0.2em] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                      />
                      <input
                        type="password"
                        value={recoverConfirmPin}
                        onChange={(e) => setRecoverConfirmPin(e.target.value)}
                        placeholder={isHi ? 'पिन दोहराएँ' : 'Confirm PIN'}
                        maxLength={8}
                        inputMode="numeric"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-center tracking-[0.2em] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                      />
                    </div>

                    {recoverError && (
                      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{recoverError}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRecoverMode(false);
                          setRecoverError(null);
                        }}
                        className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                      >
                        {isHi ? '← पिन पर वापस जाएं' : '← Back to PIN'}
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingSecurity || lockoutSeconds > 0}
                        className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white disabled:opacity-60 text-white dark:text-slate-950 font-semibold cursor-pointer"
                      >
                        {isSavingSecurity
                          ? isHi
                            ? 'सत्यापित हो रहा है...'
                            : 'Verifying...'
                          : isHi
                            ? 'पिन रीसेट करें'
                            : 'Reset PIN'}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Standard Vault Unlock Flow (Server-Side scrypt Verification + Lockout) */
                  <div className="space-y-4">
                    <form onSubmit={handleVerifyPin} className="space-y-3.5">
                      <div className="relative">
                        <input
                          type={showPinDigits ? 'text' : 'password'}
                          value={enteredPin}
                          onChange={(e) => {
                            setEnteredPin(e.target.value);
                            if (pinError) setPinError(null);
                          }}
                          disabled={lockoutSeconds > 0}
                          placeholder="••••••"
                          autoFocus
                          maxLength={8}
                          inputMode="numeric"
                          className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono text-lg tracking-[0.35em] text-center focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPinDigits(!showPinDigits)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                          aria-label={showPinDigits ? 'Hide PIN' : 'Show PIN'}
                        >
                          {showPinDigits ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {lockoutSeconds > 0 && (
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-mono text-center">
                          {isHi
                            ? `सुरक्षा लॉक सक्रिय: ${Math.floor(lockoutSeconds / 60)}m ${lockoutSeconds % 60}s शेष`
                            : `Vault temporarily locked: ${Math.floor(lockoutSeconds / 60)}m ${lockoutSeconds % 60}s`}
                        </div>
                      )}

                      {pinError && (
                        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{pinError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={lockoutSeconds > 0}
                        className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white disabled:opacity-50 text-white dark:text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {isHi ? 'POLITICS WORLD डेस्क खोलें' : 'Unlock POLITICS WORLD Desk'}
                      </button>
                    </form>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setRecoverError(null);
                          setIsRecoverMode(true);
                        }}
                        className="font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 cursor-pointer"
                      >
                        {isHi ? 'पिन भूल गए? स्वामी रिकवरी →' : 'Forgot PIN? Owner Recovery'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('ratecard')}
                        className="font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                      >
                        {isHi ? 'एड रेट्स देखें →' : 'View Public Ad Rates →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* SECTIONS 1 & 2: REVENUE & WALLET */}
              {(activeTab === 'revenue' || activeTab === 'wallet') && (
                <WalletLedgerDashboard
                  defaultView={activeTab}
                  onGoToInvoiceTab={() => setActiveTab('invoice')}
                  onGoToRateCardTab={() => setActiveTab('ratecard')}
                />
              )}

              {/* SECTION 3: TAX INVOICE GENERATOR */}
              {activeTab === 'invoice' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left: Invoice Builder (4 cols) */}
                  <div className="lg:col-span-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4 h-fit">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                        {isHi ? 'इनवॉइस विवरण' : 'Invoice Details'}
                      </h3>
                      <button
                        type="button"
                        onClick={loadPoliticsWorldDemoInvoice}
                        className="text-[11px] font-semibold text-sky-700 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        {isHi ? '⚡ डेमो विवरण भरें' : '⚡ Load Demo Details'}
                      </button>
                    </div>

                    {/* India B2B GSTIN vs India B2C Rule 46 Switch */}
                    <div className="grid grid-cols-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setClientType('b2b')}
                        className={`py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                          clientType === 'b2b'
                            ? 'bg-white dark:bg-[#0d172c] text-slate-950 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        India B2B (GSTIN)
                      </button>
                      <button
                        type="button"
                        onClick={() => setClientType('b2c')}
                        className={`py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                          clientType === 'b2c'
                            ? 'bg-white dark:bg-[#0d172c] text-slate-950 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        India B2C (Rule 46)
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {isHi ? 'विज्ञापन स्लॉट' : 'Ad Slot'}
                        </label>
                        <select
                          value={invSlot}
                          onChange={(e) => setInvSlot(e.target.value as typeof invSlot)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                        >
                          <option value="header">National Header Billboard ({formatInr(AD_SLOTS_CATALOG.header.rates['1-month'])}/mo)</option>
                          <option value="in-article">In-Article Placement ({formatInr(AD_SLOTS_CATALOG['in-article'].rates['1-month'])}/mo)</option>
                          <option value="sponsored-article">Sponsored Story ({formatInr(AD_SLOTS_CATALOG['sponsored-article'].rates['1-week'])}/wk)</option>
                          <option value="multimedia-feature">Multimedia Dossier ({formatInr(AD_SLOTS_CATALOG['multimedia-feature'].rates['1-week'])}/wk)</option>
                          <option value="sponsored-wire">National Wire PR ({formatInr(AD_SLOTS_CATALOG['sponsored-wire'].rates['1-week'])}/wk)</option>
                          <option value="magazine">Notebook Magazine ({formatInr(AD_SLOTS_CATALOG.magazine.rates['1-month'])}/mo)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {isHi ? 'अवधि' : 'Duration'}
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(
                            [
                              { id: '1-week', label: '1W' },
                              { id: '1-month', label: '1M' },
                              { id: '3-months', label: '3M' },
                              { id: '1-year', label: '1Y' },
                            ] as const
                          ).map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => setInvDuration(d.id)}
                              className={`py-2 rounded-lg font-mono font-semibold border transition-colors cursor-pointer ${
                                invDuration === d.id
                                  ? 'bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 border-slate-950 dark:border-slate-100'
                                  : 'bg-white dark:bg-[#081020] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {isHi ? 'कंपनी / विज्ञापनदाता' : 'Advertiser Name'}
                        </label>
                        <input
                          type="text"
                          value={invClientName}
                          onChange={(e) => setInvClientName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                        />
                      </div>

                      {clientType === 'b2b' ? (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-medium text-slate-600 dark:text-slate-400">GSTIN (15-Digit)</label>
                            {gstinResult.isValid ? (
                              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                                ✓ {gstinResult.stateName}
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">Invalid GSTIN</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={invClientGstin}
                            onChange={(e) => setInvClientGstin(e.target.value.toUpperCase())}
                            maxLength={15}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-[#081020] font-mono uppercase text-slate-900 dark:text-slate-100 focus:outline-none ${
                              gstinResult.isValid
                                ? 'border-emerald-300 dark:border-emerald-700/70 focus:border-emerald-500'
                                : 'border-rose-300 dark:border-rose-700/70 focus:border-rose-500'
                            }`}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                              {isHi ? 'राज्य (POS)' : 'State (POS)'}
                            </label>
                            <select
                              value={invClientState}
                              onChange={(e) => setInvClientState(e.target.value)}
                              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none"
                            >
                              {Object.entries(GST_STATE_CODES).map(([code, name]) => (
                                <option key={code} value={`${code} - ${name}`}>
                                  {code} - {name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                              {isHi ? 'PAN (वैकल्पिक)' : 'PAN (Optional)'}
                            </label>
                            <input
                              type="text"
                              value={invClientPan}
                              onChange={(e) => setInvClientPan(e.target.value.toUpperCase())}
                              maxLength={10}
                              placeholder="ABCDE1234F"
                              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono uppercase text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                            {isHi ? 'संपर्क व्यक्ति' : 'Contact'}
                          </label>
                          <input
                            type="text"
                            value={invContactPerson}
                            onChange={(e) => setInvContactPerson(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                            {isHi ? 'फ़ोन' : 'Phone'}
                          </label>
                          <input
                            type="text"
                            value={invClientPhone}
                            onChange={(e) => setInvClientPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={invClientEmail}
                          onChange={(e) => setInvClientEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {isHi ? 'पता' : 'Billing Address'}
                        </label>
                        <input
                          type="text"
                          value={invClientAddress}
                          onChange={(e) => setInvClientAddress(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Clean Tax Invoice Sheet (8 cols) */}
                  <div className="lg:col-span-8 rounded-xl bg-white dark:bg-[#0d172c] print:bg-white print:text-slate-950 border border-slate-200 dark:border-slate-800 print:border-slate-300 p-5 sm:p-7 flex flex-col justify-between gap-6">
                    <div className="space-y-6">
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <div className="text-base font-serif font-black tracking-[0.12em] uppercase text-slate-950 dark:text-white print:text-slate-950 leading-none">
                            POLITICS WORLD MEDIA
                          </div>
                          <img
                            src="/images/politics_world_logo.png"
                            alt="Politics World Official Logo"
                            className="w-36 sm:w-44 h-auto object-contain block mt-0.5 mb-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
                          />
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            GSTIN: <span className="font-mono text-slate-700 dark:text-slate-200">07AAACP9921D1Z8</span> (07-Delhi) · SAC:{' '}
                            <span className="font-mono text-slate-700 dark:text-slate-200">{slotInfo.sac}</span> · RCM: No
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            TAX INVOICE (CGST RULE 46)
                          </div>
                          <div className="text-sm font-mono font-bold text-slate-950 dark:text-white print:text-slate-950 mt-0.5">
                            {invoiceNumber}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{formatDate(today)}</div>
                        </div>
                      </div>

                      {/* Billed To & Schedule */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#111d36] border border-slate-200/80 dark:border-slate-800">
                          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
                            Billed To ({clientType === 'b2b' ? 'India B2B GSTIN' : 'India Rule 46 B2C'})
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{invClientName}</div>
                          <div className="text-slate-600 dark:text-slate-300 mt-0.5">{invContactPerson}</div>
                          <div className="text-slate-500 dark:text-slate-400 mt-0.5">{invClientAddress}</div>
                          <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 mt-1.5">
                            {clientType === 'b2b'
                              ? `GSTIN: ${invClientGstin}`
                              : `URP-B2C${invClientPan ? ` · PAN: ${invClientPan}` : ''}`}
                          </div>
                          <div className="font-mono text-[11px] text-sky-700 dark:text-amber-300 mt-0.5">
                            POS: {gstSupply.placeOfSupply} ({gstSupply.isInterState ? 'Inter-State' : 'Intra-State'})
                          </div>
                        </div>

                        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#111d36] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
                              Campaign Schedule
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {formatDate(campaignStartDate)} → {formatDate(campaignEndDate)}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                              Duration: {durationDays} Days · Reverse Charge: No
                            </div>
                          </div>
                          <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-2">
                            100% Electronic INR Pre-Payment (UPI / NEFT / RTGS · Sec 269ST)
                          </div>
                        </div>
                      </div>

                      {/* Line Item Table */}
                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-[#111d36] border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              <th className="py-2.5 px-4">Service Description</th>
                              <th className="py-2.5 px-3 font-mono">SAC</th>
                              <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-slate-900 dark:text-white">{slotInfo.title}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{slotInfo.category}</div>
                              </td>
                              <td className="py-4 px-3 font-mono text-slate-600 dark:text-slate-300">{slotInfo.sac}</td>
                              <td className="py-4 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                                {formatInr(basePrice)}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#111d36]/80 px-4 py-3 space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-600 dark:text-slate-300">
                            <span>Taxable Value (INR)</span>
                            <span className="font-mono tabular-nums">{formatInr(basePrice)}</span>
                          </div>
                          <div className="flex justify-between text-slate-600 dark:text-slate-300">
                            <span>{gstSupply.taxLabel}</span>
                            <span className="font-mono tabular-nums">
                              {gstSupply.isInterState
                                ? formatInr(igstAmount)
                                : `${formatInr(cgstAmount)} + ${formatInr(sgstAmount)}`}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-950 dark:text-white">
                            <span>Grand Total (INR)</span>
                            <span className="font-mono tabular-nums text-base">
                              {formatInr(grandTotal)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Concise Statutory Terms */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <div>• 100% digital INR advance via UPI/NEFT/RTGS (Sec 269ST).</div>
                        <div>• ASCI & IT (Digital Media Ethics Code) Rules 2021 compliant.</div>
                        <div>• CGST Rule 46 Compliant · Reverse Charge Payable: No.</div>
                        <div>• {gstSupply.taxLabel} · SAC 998363 · New Delhi Jurisdiction.</div>
                      </div>
                    </div>

                    {/* Invoice Actions */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {invoicePdfSaved
                          ? isHi
                            ? '✓ PDF इनवॉइस डाउनलोड हो गया'
                            : '✓ Official India GST PDF invoice downloaded'
                          : invoiceCopied
                            ? isHi
                              ? '✓ बुकिंग मेल क्लाइंट खुल गया'
                              : '✓ Booking draft opened'
                            : isHi
                              ? 'PDF डाउनलोड करें, प्रिंट करें या सीधे बुकिंग भेजें'
                              : 'Download PDF, print A4 sheet, or confirm via email'}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            downloadCommercialInvoicePdf({
                              invoiceNumber,
                              issueDate: formatDate(today),
                              clientType,
                              currency: 'INR',
                              slotTitle: slotInfo.title,
                              slotCategory: slotInfo.category,
                              sac: slotInfo.sac,
                              durationDays,
                              scheduleText: `${formatDate(campaignStartDate)} -> ${formatDate(campaignEndDate)}`,
                              clientName: invClientName,
                              contactPerson: invContactPerson,
                              clientAddress: invClientAddress,
                              taxRegistration:
                                clientType === 'b2b'
                                  ? `GSTIN: ${invClientGstin}`
                                  : `URP-B2C${invClientPan ? ` · PAN: ${invClientPan}` : ''}`,
                              placeOfSupply: gstSupply.placeOfSupply,
                              reverseCharge: gstSupply.reverseCharge,
                              subtotalFormatted: formatInr(basePrice),
                              taxLabel: gstSupply.taxLabel,
                              taxFormatted: gstSupply.isInterState
                                ? formatInr(igstAmount)
                                : `${formatInr(cgstAmount)} + ${formatInr(sgstAmount)}`,
                              grandTotalFormatted: formatInr(grandTotal),
                              paymentMethod: '100% Electronic INR Pre-Payment',
                            });
                            setInvoicePdfSaved(true);
                            setTimeout(() => setInvoicePdfSaved(false), 3000);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{isHi ? 'PDF डाउनलोड' : 'Download PDF'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            printCommercialInvoiceDocument({
                              invoiceNumber,
                              issueDate: formatDate(today),
                              clientType,
                              currency: 'INR',
                              slotTitle: slotInfo.title,
                              slotCategory: slotInfo.category,
                              sac: slotInfo.sac,
                              durationDays,
                              scheduleText: `${formatDate(campaignStartDate)} → ${formatDate(campaignEndDate)}`,
                              clientName: invClientName,
                              contactPerson: invContactPerson,
                              clientAddress: invClientAddress,
                              taxRegistration:
                                clientType === 'b2b'
                                  ? `GSTIN: ${invClientGstin}`
                                  : `URP-B2C${invClientPan ? ` · PAN: ${invClientPan}` : ''}`,
                              placeOfSupply: gstSupply.placeOfSupply,
                              reverseCharge: gstSupply.reverseCharge,
                              subtotalFormatted: formatInr(basePrice),
                              taxLabel: gstSupply.taxLabel,
                              taxFormatted: gstSupply.isInterState
                                ? formatInr(igstAmount)
                                : `${formatInr(cgstAmount)} + ${formatInr(sgstAmount)}`,
                              grandTotalFormatted: formatInr(grandTotal),
                              paymentMethod: '100% Electronic INR Pre-Payment (UPI / NEFT / RTGS)',
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{isHi ? 'प्रिंट' : 'Print'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSendTaxInvoiceBooking}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isHi ? 'कन्फर्म व बुक करें' : 'Confirm & Book'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: INDIA DOMESTIC AD RATES & NATIONAL PLACEMENT RULES */}
              {activeTab === 'ratecard' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
                        {isHi ? 'राष्ट्रीय भारतीय मीडिया एवं स्पॉन्सरशिप दरें (INR)' : 'India National Media & Sponsorship Portfolio'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isHi
                          ? 'अखिल भारतीय घरेलू दरें (INR ₹) · Business UPI / NEFT / RTGS एवं स्वचालित लाइव डिप्लॉयमेंट'
                          : 'India domestic rate card (INR ₹) · Corporate UPI, NEFT / RTGS & instant national placement'}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      INR ₹ · 18% GST (SAC 998363)
                    </span>
                  </div>

                  {/* National-Level Placement Rules Banner */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0d172c] border border-emerald-200 dark:border-emerald-800/50 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-950 dark:text-white">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                          {isHi
                            ? 'राष्ट्रीय स्तर प्लेसमेंट एवं अनुपालन नियम (भारत क्षेत्राधिकार)'
                            : 'National-Level Placement & Compliance Rules (India Jurisdiction)'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {isHi ? INDIA_PLACEMENT_RULES.jurisdictionHi : INDIA_PLACEMENT_RULES.jurisdictionEn}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {(isHi ? INDIA_PLACEMENT_RULES.complianceRulesHi : INDIA_PLACEMENT_RULES.complianceRulesEn).map((rule) => (
                        <div key={rule} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6 Rate Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rateCards.map((card) => {
                      const liveCampaign = getActiveSlot(card.slotKey);
                      const selectedTenure = rateCardDurations[card.slotKey] || '1-month';
                      const selectedRateInr = AD_SLOTS_CATALOG[card.slotKey].rates[selectedTenure];
                      const tenureUnitLabel =
                        selectedTenure === '1-week'
                          ? isHi
                            ? '/ सप्ताह'
                            : '/ 1 week'
                          : selectedTenure === '1-month'
                            ? isHi
                              ? '/ माह'
                              : '/ 1 month'
                            : selectedTenure === '3-months'
                              ? isHi
                                ? '/ 3 माह'
                                : '/ 3 months'
                              : isHi
                                ? '/ 1 वर्ष'
                                : '/ 1 year';

                      return (
                        <div
                          key={card.slotKey}
                          className={`p-5 rounded-xl bg-white dark:bg-[#0d172c] border flex flex-col justify-between gap-4 transition-shadow hover:shadow-sm ${
                            card.highlight
                              ? 'border-slate-900 dark:border-amber-400/60 ring-1 ring-slate-900/5 dark:ring-amber-400/15'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              <span>{card.category}</span>
                              {liveCampaign ? (
                                <span className="text-amber-700 dark:text-amber-400 font-mono text-[10px]">
                                  {isHi ? 'लाइव सक्रिय' : 'Live Active'}
                                </span>
                              ) : (
                                <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[10px]">
                                  {isHi ? 'तुरंत उपलब्ध' : 'Open Slot'}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-950 dark:text-white mt-2">{card.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{card.spec}</p>

                            {liveCampaign && (() => {
                              const slotTel = telemetrySummary?.slotSummaries?.[card.slotKey];
                              const impCount = Number(slotTel?.impressions || 0);
                              const clkCount = Number(slotTel?.clicks || 0);
                              const ctrText = slotTel?.ctrPct || '0.00';
                              return (
                                <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                      {liveCampaign.brandName}
                                    </span>
                                    <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">
                                      {new Date(liveCampaign.expiresAtMs).toLocaleDateString('en-IN')}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300 tabular-nums">
                                    <span>
                                      {impCount.toLocaleString('en-IN')} {isHi ? 'व्यूज़' : 'Impr.'} · {clkCount.toLocaleString('en-IN')} {isHi ? 'क्लिक' : 'Clicks'} ({ctrText}%)
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const pulse = telemetrySummary?.audiencePulse || {
                                          totalResponses: 0,
                                          ageBrackets: {},
                                          states: {},
                                        };
                                        downloadCampaignDeliveryReportPdf({
                                          bookingId: liveCampaign.bookingId,
                                          invoiceNumber: slotTel?.invoiceNumber || 'VERIFIED-SLIP',
                                          brandName: liveCampaign.brandName,
                                          slotTitle: card.title,
                                          slotKey: card.slotKey,
                                          targetUrl: liveCampaign.targetUrl,
                                          publicPortalUrl: typeof window !== 'undefined' ? window.location.origin : 'https://politicsworld.news',
                                          activatedAtIst: new Date(liveCampaign.activatedAtIso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
                                          expiresAtIst: new Date(liveCampaign.expiresAtIso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
                                          durationDays: liveCampaign.durationDays,
                                          impressions: impCount,
                                          clicks: clkCount,
                                          ctrPct: ctrText,
                                          states: slotTel?.states || {},
                                          devices: slotTel?.devices || { Mobile: 0, Desktop: 0, Tablet: 0 },
                                          languages: slotTel?.languages || {},
                                          audiencePulse: pulse,
                                          ga4Configured: Boolean(telemetrySummary?.ga4Configured),
                                        });
                                      }}
                                      className="inline-flex items-center gap-1 font-sans font-semibold text-sky-700 dark:text-amber-300 hover:underline cursor-pointer shrink-0"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>{isHi ? 'प्रूफ PDF' : 'Proof PDF'}</span>
                                    </button>
                                  </div>
                                  {isPublisherAuthenticated && (
                                    <button
                                      type="button"
                                      disabled={clearingSlotKey === card.slotKey}
                                      onClick={() => void handleClearLiveSlot(card.slotKey)}
                                      className="text-[10px] font-semibold text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
                                    >
                                      {clearingSlotKey === card.slotKey
                                        ? isHi
                                          ? 'खाली हो रहा है...'
                                          : 'Clearing...'
                                        : isHi
                                          ? 'स्लॉट खाली करें (Reset to Placeholder)'
                                          : 'Clear Slot (Revert to Placeholder)'}
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                          </div>

                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            {/* Interactive Campaign Tenure Switcher */}
                            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#081020] text-[10px]">
                              {(
                                [
                                  { id: '1-week', label: isHi ? '1 सप्ताह' : '1W' },
                                  { id: '1-month', label: isHi ? '1 माह' : '1M' },
                                  { id: '3-months', label: isHi ? '3 माह' : '3M' },
                                  { id: '1-year', label: isHi ? '1 वर्ष' : '1Y' },
                                ] as const
                              ).map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() =>
                                    setRateCardDurations((prev) => ({ ...prev, [card.slotKey]: opt.id }))
                                  }
                                  className={`py-1 rounded-md font-mono font-bold transition-colors cursor-pointer ${
                                    selectedTenure === opt.id
                                      ? 'bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950'
                                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-baseline justify-between gap-2">
                              <div>
                                <span className="text-xl font-bold font-mono tabular-nums text-slate-950 dark:text-white">
                                  {formatPrice(selectedRateInr)}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{tenureUnitLabel}</span>
                              </div>
                              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                {selectedTenure === '1-week'
                                  ? `${formatPrice(AD_SLOTS_CATALOG[card.slotKey].rates['1-month'])} ${isHi ? '/ माह' : '/ 1M'}`
                                  : `${formatPrice(AD_SLOTS_CATALOG[card.slotKey].rates['1-week'])} ${isHi ? '/ सप्ताह' : '/ 1W'}`}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => openSelfServeCheckout(card.slotKey, selectedTenure)}
                              className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span>
                                {isHi
                                  ? `स्लॉट बुक करें (${DURATION_LABELS[selectedTenure].days} दिन)`
                                  : `Reserve Slot (${DURATION_LABELS[selectedTenure].en})`}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Editorial Terms Strip */}
                  <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {isHi ? 'संपादकीय मानक' : 'Editorial Standards'}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                          {isHi
                            ? 'प्रत्येक सामग्री प्रकाशन से पूर्व पब्लिशर की संपादकीय समीक्षा के अधीन है।'
                            : 'All commercial submissions undergo final publisher editorial vetting.'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Briefcase className="w-4 h-4 text-slate-700 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {isHi ? 'डिजिटल प्री-पेमेंट' : 'Electronic Settlement'}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                          {isHi
                            ? 'केवल NEFT, RTGS या बिज़नेस UPI द्वारा 100% अग्रिम भुगतान मान्य है (Not Refundable)।'
                            : '100% advance settlement via NEFT, RTGS, or Corporate UPI only. Strictly Not Refundable.'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-slate-700 dark:text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {isHi ? 'कॉपीराइट व दायित्व' : 'Copyright Compliance'}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                          {isHi
                            ? 'विज्ञापन सामग्री के कॉपीराइट और कानूनी दायित्व की पूर्ण जिम्मेदारी विज्ञापनदाता की होगी।'
                            : 'Advertisers retain full intellectual property & legal responsibility.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Direct Inquiry Form */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                          {isHi ? 'प्रीमियम अभियान पूछताछ' : 'Direct Campaign Concierge'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {isHi
                            ? 'कस्टम कैंपेन और दीर्घकालिक साझेदारी के लिए सीधे संपादकीय डेस्क से जुड़ें'
                            : 'Partner directly with our editorial desk for bespoke campaigns and retainers'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSponsorName('Politics World India Media Desk');
                          setSponsorEmail('vrai74918@gmail.com');
                          setSponsorSlot('header-leaderboard');
                          setSponsorMessage(
                            '[DEMO TEST] Requesting 1-Month All-India showcase package across Politics World Header, Editorial & Wire placements.'
                          );
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-950 text-[11px] font-bold cursor-pointer"
                      >
                        <Zap className="w-3 h-3" />
                        <span>{isHi ? '⚡ डेमो फॉर्म भरें' : '⚡ Auto-Fill Demo'}</span>
                      </button>
                    </div>

                    <form onSubmit={handleSendInquiry} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <input
                        type="text"
                        required
                        value={sponsorName}
                        onChange={(e) => setSponsorName(e.target.value)}
                        placeholder={isHi ? 'संगठन या आपका नाम' : 'Organization or Name'}
                        className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                      />
                      <input
                        type="email"
                        required
                        value={sponsorEmail}
                        onChange={(e) => setSponsorEmail(e.target.value)}
                        placeholder={isHi ? 'ईमेल पता' : 'Work Email'}
                        className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                      />
                      <select
                        value={sponsorSlot}
                        onChange={(e) => setSponsorSlot(e.target.value)}
                        className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 sm:col-span-2"
                      >
                        <option value="header-leaderboard">National Header Leaderboard Billboard ({formatPrice(AD_SLOTS_CATALOG.header.rates['1-month'])}/mo)</option>
                        <option value="in-article-banner">In-Article National Editorial Unit ({formatPrice(AD_SLOTS_CATALOG['in-article'].rates['1-month'])}/mo)</option>
                        <option value="sponsored-article">Sponsored National Editorial Story ({formatPrice(AD_SLOTS_CATALOG['sponsored-article'].rates['1-week'])}/wk)</option>
                        <option value="multimedia-feature">Multimedia Feature & AI Voice Dossier ({formatPrice(AD_SLOTS_CATALOG['multimedia-feature'].rates['1-week'])}/wk)</option>
                        <option value="sponsored-wire">National Press Release Wire ({formatPrice(AD_SLOTS_CATALOG['sponsored-wire'].rates['1-week'])}/wk)</option>
                        <option value="magazine-box">Notebook Magazine Masthead Box ({formatPrice(AD_SLOTS_CATALOG.magazine.rates['1-month'])}/mo)</option>
                        <option value="custom-retainer">Custom National Enterprise Retainer (INR)</option>
                      </select>
                      <textarea
                        rows={2}
                        value={sponsorMessage}
                        onChange={(e) => setSponsorMessage(e.target.value)}
                        placeholder={isHi ? 'अभियान की तारीख और विवरण...' : 'Campaign dates and brief...'}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 sm:col-span-2"
                      />
                      <div className="sm:col-span-2 flex items-center justify-between gap-3 pt-1">
                        {inquirySent ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isHi ? 'अनुरोध ईमेल ड्राफ्ट तैयार है।' : 'Email inquiry draft opened.'}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">vrai74918@gmail.com</span>
                        )}
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 font-semibold cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isHi ? 'प्रस्ताव भेजें' : 'Send Brief'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Shifted Proof & Reach Report Callout linking directly to Tab 7 (next to 6. Playbook) */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0d172c] border border-amber-300/70 dark:border-amber-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                          {isHi
                            ? 'भारत-व्यापी रीच, राज्य-वार रिपोर्ट व ऑटो-ईमेल अब "7. रीच व रिपोर्ट्स" टैब में शिफ्ट हैं'
                            : 'Campaign Completion Reports & All-India State Reach moved to "7. Reach & Reports"'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {isHi
                            ? '6. रणनीति गाइड के बगल में नए टैब 7 में लाइव इम्प्रेशन, राज्य-वार रीच, PDF/प्रिंट सर्टिफिकेट और ऑटोमैटिक ईमेल डिलीवरी देखें।'
                            : 'Open Tab 7 next to Playbook for live impressions, unique sessions, state-wise India breakdown, Copy/Print/PDF, and email dispatch.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reports')}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                    >
                      <span>{isHi ? '7. रीच व रिपोर्ट्स खोलें' : 'Open 7. Reach & Reports'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Conclusive Proof of Delivery & Full Safe Harbor Against Non-Delivery Allegations */}
                  <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0d172c] border border-emerald-200 dark:border-emerald-500/35 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                          {isHi
                            ? 'डिलीवरी सत्यापन मानक एवं "विज्ञापन न दिखाने" के झूठे दावों से पूर्ण सुरक्षा'
                            : 'Conclusive Proof of Delivery & Full Safe Harbor Against Non-Delivery Allegations'}
                        </span>
                      </h4>
                      <span className="text-[11px] font-mono text-rose-700 dark:text-amber-300 font-bold">
                        SAC 998363 · NOT REFUNDABLE · SAFE HARBOR
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                      {isHi
                        ? 'विज्ञापनदाता और मंच के बीच यह विधिक रूप से बाध्यकारी शर्त है कि विज्ञापन शुल्क प्राप्त होने के पश्चात सेवा की डिलीवरी को निम्नलिखित विधिक मानकों के अनुसार अंतिम एवं पूर्ण माना जाएगा:'
                        : 'The advertiser stipulates and agrees to the following conclusive legal delivery standards governing all direct bookings:'}
                    </p>

                    <ul className="list-disc list-inside space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                      <li>
                        <strong className="text-slate-950 dark:text-white">
                          {isHi ? 'लाइव URL प्रसारण ही सेवा की पूर्ण डिलीवरी है:' : 'Public Live URL Placement Constitutes Full Delivery:'}
                        </strong>{' '}
                        {isHi
                          ? 'तय विज्ञापन स्लॉट (जैसे हेडर, इन-आर्टिकल, प्रायोजित आलेख या स्पॉन्सर्ड वायर) में विज्ञापन क्रिएटिव को मंच के सार्वजनिक डोमेन URL पर सक्रिय (Live) कर दिया जाना ही सेवा के 100% विधिक संपादन का अंतिम और अकाट्य प्रमाण है।'
                          : 'The deployment of the approved ad creative or sponsored article within the designated digital placement on Politics World’s public web URL constitutes 100% conclusive and irrebuttable proof of delivery.'}
                      </li>
                      <li>
                        <strong className="text-slate-950 dark:text-white">
                          {isHi ? 'इंटरनेट एवं Ad-Blocker की सर्वोत्तम प्रयास (Best-Efforts) छूट:' : 'Best-Efforts Technology & Client-Side Ad-Blocker Safe Harbor:'}
                        </strong>{' '}
                        {isHi
                          ? 'डिजिटल प्रसारण इंटरनेट सेवा प्रदाताओं (ISPs), वैश्विक राउटिंग, और व्यक्तिगत पाठक के ब्राउज़र सेटिंग्स पर निर्भर करता है। यदि किसी पाठक के निजी फोन/कंप्यूटर में Ad-Blocker, प्राइवेट डीएनएस या कैशे के कारण विज्ञापन नहीं दिखता, तो यह मंच का दोष या अनुबंध उल्लंघन कभी नहीं माना जाएगा। सर्वर लॉग्स अथवा लाइव स्क्रीनशॉट ही डिलीवरी का अंतिम विधिक साक्ष्य होंगे।'
                          : 'Internet delivery relies on third-party CDNs, ISP routing, and local browser environments. If an end-user utilizes client-side Ad-Blockers, private DNS, or local cache configurations that prevent an ad from rendering, such events shall NEVER constitute a breach of contract or platform default. Server access logs and live URL timestamps serve as definitive legal proof of fulfillment.'}
                      </li>
                      <li>
                        <strong className="text-slate-950 dark:text-white">
                          {isHi
                            ? 'पूर्णतः गैर-वापसी योग्य समझौता (Strictly Not Refundable / No-Refund Covenant):'
                            : 'Strict Not Refundable Agreement (Zero Refund Policy):'}
                        </strong>{' '}
                        {isHi
                          ? 'एक बार जब विज्ञापन अभियान या प्रायोजित आलेख लाइव या तकनीकी रूप से शेड्यूल हो जाता है, तो भुगतान की गई कोई भी राशि किसी भी परिस्थिति में Not Refundable (गैर-वापसी योग्य) रहेगी और न ही कोई चार्ज-बैक या बैंक विवाद मान्य होगा।'
                          : 'All sponsorship, advertising, native press release, and sponsored article retainers are strictly Not Refundable once scheduled or published. No refunds, chargebacks, or reimbursement demands shall be accepted or legally actionable under any circumstances.'}
                      </li>
                      <li>
                        <strong className="text-slate-950 dark:text-white">
                          {isHi ? 'अनुचित सामग्री को हटाने का अधिकार:' : 'Right to Takedown Prohibited Ad Copy:'}
                        </strong>{' '}
                        {isHi
                          ? 'यदि किसी विज्ञापनदाता द्वारा प्रदान की गई सामग्री में जुआ/सट्टेबाजी, अश्लीलता, वित्तीय धोखाधड़ी, मानहानि या कानून का उल्लंघन पाया जाता है, तो संचालक के पास बिना किसी वापसी के उसे तत्काल हटाने का संप्रभु अधिकार है।'
                          : 'Politics World reserves the unilateral right to suspend or remove any advertisement that promotes illegal gambling, fraud, defamation, obscenity, or regulatory violations without refund, resulting in forfeiture of ad retainers.'}
                      </li>
                      <li>
                        <strong className="text-slate-950 dark:text-white">
                          {isHi ? 'संपादकीय स्वतंत्रता एवं पाठक सदस्यता:' : 'Editorial Independence & Voluntary Reader Contributions:'}
                        </strong>{' '}
                        {isHi
                          ? 'डायरेक्ट विज्ञापन कभी भी समाचारों की निष्पक्षता को प्रभावित नहीं कर सकता। पाठकों द्वारा किया गया स्वैच्छिक योगदान केवल स्वतंत्र तकनीकी बुनियादी ढांचे के लिए स्वेच्छा से दिया गया अनुदान है, जिससे पाठक को मंच के स्वामित्व या इक्विटी का कोई अधिकार नहीं मिलता।'
                          : 'Advertising never buys editorial bias or news favoritism. Reader memberships and voluntary contributions are non-commercial gratuities for technology upkeep, conferring no equity, governance, or contractual claims against the platform.'}
                      </li>
                    </ul>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isHi
                          ? 'अधिक जानकारी (प्रत्यक्ष स्पॉन्सरशिप, प्रायोजित आलेख व टैक्स इनवॉइसिंग नियम) के लिए विधिक राजपत्र के अनुच्छेद 7 (Article 7) पर जाएं।'
                          : 'For full terms on Direct Sponsorships, Sponsored Stories & Tax Invoicing (Article 7), read Article 7 in our Legal & Standards Gazette.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => onOpenLegalArticle7?.()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-amber-500/50 bg-amber-50 dark:bg-amber-400/10 hover:bg-amber-100 dark:hover:bg-amber-400/20 text-amber-800 dark:text-amber-300 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                      >
                        <span>{isHi ? 'अधिक पढ़ें · अनुच्छेद 7 पर जाएं' : 'More Read · Go to Article 7'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: REVENUE FORECAST CALCULATOR (OWNER VAULT) */}
              {activeTab === 'calculator' && (
                <div className="rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
                        {isHi ? 'मासिक आय प्रक्षेपण (INR Revenue Forecast)' : 'India Domestic Revenue Forecast (INR)'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isHi
                          ? 'मासिक भारतीय पाठक संख्या के आधार पर डायरेक्ट स्पॉन्सरशिप और संपादकीय आय का अनुमान देखें'
                          : 'Project monthly Indian commercial sponsorship & sponsored editorial potential in INR'}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                        {isHi ? 'मासिक पाठक व्यूज़' : 'Monthly Pageviews'}
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-slate-950 dark:text-white">
                        {monthlyTraffic.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="range"
                      min={10000}
                      max={1000000}
                      step={10000}
                      value={monthlyTraffic}
                      onChange={(e) => setMonthlyTraffic(Number(e.target.value))}
                      className="w-full accent-slate-950 dark:accent-amber-400 cursor-pointer"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {[25000, 50000, 100000, 250000, 500000, 1000000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setMonthlyTraffic(val)}
                          className={`px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                            monthlyTraffic === val
                              ? 'bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 border-slate-950 dark:border-slate-100'
                              : 'bg-slate-50 dark:bg-[#111d36] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          {val >= 1000000 ? '1M' : `${val / 1000}K`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {isHi ? 'डायरेक्ट राष्ट्रीय स्पॉन्सरशिप' : 'Direct National Retainers'}
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1.5">
                        {formatInr(directSponsorInr)}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {isHi ? 'मास्टहेड बिलबोर्ड एवं इन-आर्टिकल स्लॉट' : 'Masthead billboard & inline placements'}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {isHi ? 'प्रायोजित प्रेस एवं मल्टीमीडिया' : 'Sponsored Press & Media'}
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1.5">
                        {formatInr(sponsoredContentInr)}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {isHi ? 'आलेख, प्रेस वायर एवं वीडियो फ़ीचर' : 'Editorial stories, press wire & video'}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 dark:bg-[#111d36] dark:border dark:border-amber-400/40 text-white">
                      <div className="text-xs font-medium text-slate-300 dark:text-amber-300">
                        {isHi ? 'कुल संभावित मासिक आय (INR)' : 'Total Monthly Projection (INR)'}
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums mt-1.5">
                        {formatInr(totalMonthlyEarningsInr)}
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-1">
                        {isHi
                          ? 'सीधे भारतीय बैंक खाते में सेटलमेंट (NEFT/RTGS)'
                          : 'Direct Indian bank treasury settlement via NEFT/RTGS'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6: MONETIZATION PLAYBOOK GUIDE */}
              {activeTab === 'guide' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
                      {isHi ? 'पब्लिशर आय रणनीति (Executive Playbook)' : 'Executive Monetization Playbook'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isHi
                        ? 'डायरेक्ट स्पॉन्सरशिप और संपादकीय आय के प्रमुख स्तंभ (Google भुगतान सीधे बैंक खाते में जाता है)'
                        : 'Core commercial revenue pillars managed inside your desk (Google remittances settle directly to bank)'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">01</span>
                        <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                          {isHi ? '100% डायरेक्ट मार्जिन' : '100% Margin'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                        {isHi ? 'डायरेक्ट ब्रांड स्पॉन्सरशिप' : 'Direct Brand Sponsorships'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isHi
                          ? 'निश्चित अवधि के हेडर बिलबोर्ड और इन-आर्टिकल बैनर सीधे ब्रांड्स को दें और सेक्शन 3 से तुरंत GST इनवॉइस जारी करें।'
                          : 'Offer signature header billboards and inline units directly to enterprise clients with instant SAC 998363 GST invoicing.'}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">02</span>
                        <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-400">
                          {isHi ? 'एडिटोरियल वायर' : 'Editorial Wire'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                        {isHi ? 'प्रायोजित आलेख एवं प्रेस वायर' : 'Sponsored Stories & Press Wire'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isHi
                          ? 'पूर्ण संपादकीय जांच और कॉपीराइट सुरक्षा के साथ संस्थागत विचारों व आधिकारिक प्रेस विज्ञप्तियों का प्रकाशन करें।'
                          : 'Publish vetted executive thought leadership and official press releases backed by complete submitter indemnity.'}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">03</span>
                        <span className="text-[11px] font-medium text-sky-700 dark:text-sky-400">
                          {isHi ? 'रिच मीडिया' : 'Rich Media'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                        {isHi ? 'मल्टीमीडिया एवं वॉइस डॉज़ियर' : 'Multimedia & AI Voice Features'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isHi
                          ? 'विस्तृत फ़ीचर स्टोरी के साथ हाई-रेज़ फ़ोटो गैलरी, वीडियो एम्बेड और स्टूडियो वॉइस नैरेशन प्रदान करें।'
                          : 'Deliver high-impact features combining photo galleries, embedded video briefings, and automated voice narration.'}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">04</span>
                        <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                          {isHi ? 'बैंक सेटलमेंट' : 'Treasury Payouts'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                        {isHi ? 'नोटबुक मैगज़ीन एवं बैंक निकासी' : 'Notebook Magazine & Bank Payouts'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isHi
                          ? 'विशेष राजनयिक संस्करण में प्रीमियम प्लेसमेंट दें और प्राप्त फंड को NEFT/RTGS के माध्यम से सीधे बैंक खाते में ट्रांसफर करें।'
                          : 'Curate full-page diplomatic review placements and disburse cleared funds straight to your linked bank via NEFT or RTGS.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 7: CAMPAIGN COMPLETION REPORTS, INDIA STATE REACH & AUTO EMAIL DISPATCH */}
              {activeTab === 'reports' && (() => {
                const allCampaigns = reportsPayload?.campaigns || [];
                const filteredCampaigns = allCampaigns.filter((c) =>
                  reportFilter === 'all' ? true : c.status === reportFilter
                );
                const totalImpr = allCampaigns.reduce((acc, c) => acc + Number(c.totalImpressions || 0), 0);
                const totalSess = allCampaigns.reduce((acc, c) => acc + Number(c.uniqueSessions || 0), 0);
                const completedCount = allCampaigns.filter((c) => c.status === 'Completed').length;
                const emailAuto = reportsPayload?.emailAutomation;
                const pulseData = reportsPayload?.audiencePulse || telemetrySummary?.audiencePulse;

                return (
                  <div className="space-y-6">
                    {/* Header & Email Automation Status Banner */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
                          {isHi
                            ? '7. अभियान समापन रिपोर्ट्स, अखिल भारतीय राज्य रीच व ऑटो ईमेल डिलीवरी'
                            : '7. Campaign Completion & All-India State Reach Reports'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {isHi
                            ? 'प्रत्येक विज्ञापन स्लॉट के लाइव इम्प्रेशन, यूनिक सेशन, भारतीय राज्य-वार रीच और समापन पर स्वचालित ईमेल रिपोर्ट।'
                            : 'Automatic end-of-campaign completion reports with Indian state-wise reach breakdown and automated advertiser email dispatch.'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-semibold ${
                            emailAuto?.configured
                              ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/35 text-emerald-800 dark:text-emerald-300'
                              : 'border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {emailAuto?.configured
                              ? isHi
                                ? `ऑटो-ईमेल सक्रिय (${emailAuto.mode === 'resend' ? 'Resend API' : emailAuto.mode === 'webhook' ? 'Webhook Relay' : emailAuto.provider || 'Active'})`
                                : `Auto-Email Ready (${emailAuto.mode === 'resend' ? 'Resend API' : emailAuto.mode === 'webhook' ? 'Webhook Relay' : emailAuto.provider || 'Active'})`
                              : isHi
                                ? 'ऑटो-ईमेल हुक तैयार (Env कुंजी प्रतीक्षारत)'
                                : 'Email Relay Hook Ready (Env Secret Pending)'}
                          </span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            void fetchCampaignReports();
                            void fetchTelemetrySummary();
                          }}
                          disabled={reportsLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d172c] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${reportsLoading ? 'animate-spin' : ''}`} />
                          <span>{isHi ? 'रीफ्रेश' : 'Refresh'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Aggregate KPI Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {isHi ? 'ट्रैक किए गए अभियान' : 'Tracked Campaigns'}
                        </div>
                        <div className="text-2xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
                          {allCampaigns.length}
                        </div>
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
                          {completedCount} {isHi ? 'पूर्ण' : 'Completed'} · {allCampaigns.length - completedCount}{' '}
                          {isHi ? 'सक्रिय' : 'Active'}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {isHi ? 'कुल इम्प्रेशन (भारत)' : 'Total Impressions'}
                        </div>
                        <div className="text-2xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
                          {totalImpr.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isHi ? 'स्पैम-मुक्त रेंडर लॉग्स' : 'Deduplicated render telemetry'}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {isHi ? 'यूनिक सेशन' : 'Unique Sessions'}
                        </div>
                        <div className="text-2xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
                          {totalSess.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isHi ? 'प्रति अभियान ब्राउज़र सत्र' : 'Distinct browser view sessions'}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {isHi ? 'ईमेल ऑटोमेशन' : 'Auto Email Status'}
                        </div>
                        <div className="text-sm font-bold text-slate-950 dark:text-amber-300 mt-2">
                          {emailAuto?.configured
                            ? isHi
                              ? 'समापन पर ऑटो-डिस्पैच सक्रिय'
                              : 'Live Auto-Dispatch Active'
                            : isHi
                              ? 'रिपोर्ट तैयार · सर्वर Env प्रतीक्षारत'
                              : 'Relay Ready · Server Key Pending'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {isHi ? 'सर्वर-साइड कॉन्फ़िगरेशन (गोपनीय)' : 'Server-side RESEND_API_KEY / Webhook'}
                        </div>
                      </div>
                    </div>

                    {/* Filter Switcher */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex p-1 rounded-lg bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 text-xs">
                        {(['all', 'Completed', 'Active'] as const).map((filterKey) => (
                          <button
                            key={filterKey}
                            type="button"
                            onClick={() => setReportFilter(filterKey)}
                            className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
                              reportFilter === filterKey
                                ? 'bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                            }`}
                          >
                            {filterKey === 'all'
                              ? isHi
                                ? `सभी (${allCampaigns.length})`
                                : `All (${allCampaigns.length})`
                              : filterKey === 'Completed'
                                ? isHi
                                  ? `पूर्ण रिपोर्ट (${completedCount})`
                                  : `Completed (${completedCount})`
                                : isHi
                                  ? `सक्रिय (${allCampaigns.length - completedCount})`
                                  : `Active (${allCampaigns.length - completedCount})`}
                          </button>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isPublisherAuthenticated
                          ? isHi
                            ? 'पब्लिशर स्वामी सत्र सक्रिय · आप अभियान समाप्त कर तुरंत ईमेल भेज सकते हैं'
                            : 'Owner Desk Unlocked · Complete active campaigns or resend report emails below'
                          : isHi
                            ? 'गोपनीय ईमेल सुरक्षित रूप से मास्क किए गए हैं'
                            : 'Advertiser email addresses remain privacy-masked unless Owner Desk is unlocked'}
                      </div>
                    </div>

                    {/* Campaign Completion & Reach Report Cards */}
                    {filteredCampaigns.length === 0 ? (
                      <div className="p-8 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 text-center space-y-2">
                        <BarChart3 className="w-7 h-7 text-amber-400 mx-auto" />
                        <div className="text-sm font-bold text-slate-950 dark:text-white">
                          {isHi ? 'इस फ़िल्टर में कोई अभियान रिपोर्ट नहीं है' : 'No campaign reports match this filter yet'}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {isHi
                            ? 'नया विज्ञापन स्लॉट बुक होने या वर्तमान स्लॉट के लाइव व्यू आने पर यहाँ स्वचालित रिपोर्ट दिखेगी।'
                            : 'New self-serve bookings and live ad impressions automatically populate structured reach reports here.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredCampaigns.map((c) => {
                          const stateEntries = Object.entries(c.states || {}).sort((a, b) => b[1] - a[1]);
                          const pdfPayload = {
                            bookingId: c.bookingId,
                            invoiceNumber: c.invoiceNumber,
                            brandName: c.brandName,
                            campaignTitle: c.campaignTitle,
                            slotTitle: c.slotTitle,
                            slotKey: c.slotKey,
                            targetUrl: c.targetUrl,
                            publicPortalUrl:
                              typeof window !== 'undefined' ? window.location.origin : 'https://politicsworld.news',
                            activatedAtIst: formatIstWindow(c.startDateIso),
                            expiresAtIst: formatIstWindow(c.endDateIso),
                            durationDays: c.durationDays,
                            status: c.status,
                            impressions: c.totalImpressions,
                            uniqueSessions: c.uniqueSessions,
                            clicks: c.totalClicks,
                            ctrPct: c.ctrPct,
                            indiaStatesReachedCount: c.indiaStatesReachedCount,
                            states: c.states || {},
                            devices: c.devices || { Mobile: 0, Desktop: 0, Tablet: 0 },
                            languages: c.languages || {},
                            audiencePulse: pulseData || { totalResponses: 0, ageBrackets: {}, states: {} },
                            ga4Configured: Boolean(reportsPayload?.ga4Configured || telemetrySummary?.ga4Configured),
                          };
                          const deliveryStatus = c.emailDelivery?.status || 'pending-config';

                          return (
                            <div
                              key={c.bookingId}
                              className="p-5 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-amber-500/25 space-y-4 shadow-xs"
                            >
                              {/* Top Header Row */}
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="space-y-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                                        c.status === 'Completed'
                                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60'
                                          : 'bg-amber-100 dark:bg-amber-400/15 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-400/40'
                                      }`}
                                    >
                                      {c.status === 'Completed' ? (
                                        <CheckCircle2 className="w-3 h-3" />
                                      ) : (
                                        <Clock className="w-3 h-3" />
                                      )}
                                      <span>{c.status}</span>
                                    </span>
                                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                      {c.bookingId}
                                    </span>
                                    <span aria-hidden="true" className="text-slate-400">·</span>
                                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                                      {c.invoiceNumber}
                                    </span>
                                  </div>
                                  <h4 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                                    {c.brandName} — {c.campaignTitle}
                                  </h4>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <span>{c.slotTitle} ({c.durationDays}d)</span>
                                    <span className="font-mono">
                                      {formatIstWindow(c.startDateIso)} → {formatIstWindow(c.endDateIso)}
                                    </span>
                                  </div>
                                </div>

                                {/* One-Click Export / Copy / Print Controls */}
                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => void handleCopyReportSummary(c)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                                  >
                                    {copiedReportId === c.bookingId ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                    <span>
                                      {copiedReportId === c.bookingId
                                        ? isHi
                                          ? 'कॉपी हुआ'
                                          : 'Copied'
                                        : isHi
                                          ? 'कॉपी सारांश'
                                          : 'Copy Summary'}
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => printCampaignDeliveryReportDocument(pdfPayload)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>{isHi ? 'प्रिंट' : 'Print'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => downloadCampaignDeliveryReportPdf(pdfPayload)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-950 text-xs font-bold cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>{isHi ? 'PDF रिपोर्ट' : 'Download PDF'}</span>
                                  </button>
                                </div>
                              </div>

                              {/* 4 Metrics Strip */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#081020] border border-slate-200/80 dark:border-slate-800">
                                  <div className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                                    {isHi ? 'कुल इम्प्रेशन' : 'Impressions'}
                                  </div>
                                  <div className="text-base font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                                    {c.totalImpressions.toLocaleString('en-IN')}
                                  </div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#081020] border border-slate-200/80 dark:border-slate-800">
                                  <div className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                                    {isHi ? 'यूनिक सेशन' : 'Unique Sessions'}
                                  </div>
                                  <div className="text-base font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                                    {c.uniqueSessions.toLocaleString('en-IN')}
                                  </div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#081020] border border-slate-200/80 dark:border-slate-800">
                                  <div className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                                    {isHi ? 'पहुँचे भारतीय राज्य' : 'States Reached'}
                                  </div>
                                  <div className="text-base font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">
                                    {c.indiaStatesReachedCount}
                                  </div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#081020] border border-slate-200/80 dark:border-slate-800">
                                  <div className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                                    {isHi ? 'क्लिक व CTR' : 'Clicks & CTR'}
                                  </div>
                                  <div className="text-base font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                                    {c.totalClicks.toLocaleString('en-IN')} ({c.ctrPct}%)
                                  </div>
                                </div>
                              </div>

                              {/* State-Wise Breakdown Across India */}
                              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#081020] border border-slate-200/80 dark:border-slate-800 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                                    <span>
                                      {isHi
                                        ? 'भारत के राज्यों के अनुसार व्यू विवरण (State-Wise Breakdown)'
                                        : 'State-Wise View Breakdown Across India'}
                                    </span>
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                    Mobile: {c.devices?.Mobile || 0} · Desktop: {c.devices?.Desktop || 0}
                                  </span>
                                </div>

                                {stateEntries.length > 0 ? (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                                    {stateEntries.map(([stName, cnt]) => (
                                      <div
                                        key={stName}
                                        className="px-2.5 py-1.5 rounded-md bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                                      >
                                        <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
                                          {stName}
                                        </span>
                                        <span className="font-mono font-bold text-slate-950 dark:text-amber-300 tabular-nums shrink-0">
                                          {Number(cnt).toLocaleString('en-IN')}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {isHi
                                      ? 'Pan-India / Unspecified Region — लाइव विज्ञापन रेंडर होते ही यहाँ राज्यों का विवरण दर्ज होगा।'
                                      : 'Pan-India / Unspecified Region — State counts populate automatically as impressions are rendered.'}
                                  </div>
                                )}
                              </div>

                              {/* Automated Email Delivery Footer + Owner Completion Controls */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                                <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-300">
                                  <Mail className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                                  <span className="font-semibold">
                                    {isHi ? 'ईमेल डिलीवरी:' : 'Email Dispatch:'}
                                  </span>
                                  <span
                                    className={`font-mono text-[11px] font-bold ${
                                      deliveryStatus === 'sent' || deliveryStatus === 'webhook-dispatched'
                                        ? 'text-emerald-700 dark:text-emerald-400'
                                        : deliveryStatus === 'failed'
                                          ? 'text-rose-700 dark:text-rose-400'
                                          : 'text-amber-700 dark:text-amber-300'
                                    }`}
                                  >
                                    {deliveryStatus === 'sent'
                                      ? isHi
                                        ? 'भेजा गया (Sent)'
                                        : 'Sent'
                                      : deliveryStatus === 'webhook-dispatched'
                                        ? isHi
                                          ? 'वेबहुक द्वारा भेजा गया'
                                          : 'Webhook Dispatched'
                                        : deliveryStatus === 'failed'
                                          ? isHi
                                            ? 'विफल — पुनः प्रयास करें'
                                            : 'Failed'
                                          : isHi
                                            ? 'सर्वर कुंजी प्रतीक्षारत (Fallback Ready)'
                                            : 'Pending Env Config (Relay Hook Ready)'}
                                  </span>
                                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                    → {c.advertiserEmailDisplay}
                                  </span>
                                </div>

                                {isPublisherAuthenticated && (
                                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                                    {c.status === 'Active' ? (
                                      <button
                                        type="button"
                                        disabled={completingBookingId === c.bookingId}
                                        onClick={() => void handleCompleteCampaignNow(c.bookingId)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold cursor-pointer disabled:opacity-60"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>
                                          {completingBookingId === c.bookingId
                                            ? isHi
                                              ? 'पूर्ण हो रहा है...'
                                              : 'Completing...'
                                            : isHi
                                              ? 'पूर्ण करें व ईमेल भेजें'
                                              : 'Complete & Send Email'}
                                        </span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        disabled={resendingBookingId === c.bookingId}
                                        onClick={() => void handleResendReportEmail(c.bookingId)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-400/50 bg-amber-50 dark:bg-amber-400/10 hover:bg-amber-100 dark:hover:bg-amber-400/20 text-amber-800 dark:text-amber-300 text-xs font-semibold cursor-pointer disabled:opacity-60"
                                      >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>
                                          {resendingBookingId === c.bookingId
                                            ? isHi
                                              ? 'भेज रहे हैं...'
                                              : 'Sending...'
                                            : isHi
                                              ? 'ईमेल पुनः भेजें'
                                              : 'Resend Report Email'}
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>

                              {reportActionMsg?.bookingId === c.bookingId && (
                                <div
                                  className={`p-2.5 rounded-lg text-xs border ${
                                    reportActionMsg.isError
                                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300'
                                      : 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'
                                  }`}
                                >
                                  {reportActionMsg.text}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Shifted Advertiser Transparency: All-India State Reach & Age Reporting Standard */}
                    <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-sky-600 dark:text-amber-400 shrink-0" />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                            {isHi
                              ? 'स्क्रीनशॉट के अलावा ग्राहक (Advertiser) को भारत-व्यापी राज्य व आयु रिपोर्ट कैसे दी जाएगी?'
                              : 'Advertiser Proof Beyond Screenshots: All-India State Reach & Age Reporting'}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => void fetchTelemetrySummary()}
                          className="text-[11px] font-semibold text-sky-700 dark:text-amber-300 hover:underline cursor-pointer"
                        >
                          {isHi ? 'लाइव डेटा रीफ्रेश करें' : 'Refresh Live Stats'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-950 dark:text-white">
                            {isHi ? '1. लाइव इम्प्रेशन, क्लिक व डिवाइस लॉग्स' : '1. Live Impressions, Clicks & Devices'}
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {isHi
                              ? 'हर स्लॉट पर वास्तविक व्यूज़ (Impressions), यूनिक सेशन, क्लिक और Mobile vs Desktop डेटा सीधे सर्वर पर रिकॉर्ड होता है — ऊपर हर अभियान कार्ड से कॉपी, प्रिंट व PDF सर्टिफिकेट तुरंत डाउनलोड कर सकते हैं।'
                              : 'Each live slot automatically records server-verified views, unique sessions, clicks, and Mobile vs Desktop split without rapid re-render duplicates.'}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="font-semibold text-slate-950 dark:text-white">
                            {isHi ? '2. भारत के किन राज्यों (States) में विज्ञापन दिखा?' : '2. Indian State-Wise Geographic Reach'}
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {isHi
                              ? 'क्लाउड सर्वर के Geo-Headers (राज्य कोड), IST टाइमज़ोन और स्वैच्छिक Reader राज्य से रीच गिनी जाती है। लोकेशन अनुपलब्ध होने पर स्वच्छ "Pan-India / Unspecified Region" फ़ॉलबैक रहता है (बिना किसी ब्राउज़र परमिशन पॉपअप के)।'
                              : 'State breakdown uses privacy-safe Geo-Headers and opt-in Reader state signals, cleanly falling back to "Pan-India / Unspecified Region" with zero intrusive browser popups.'}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="font-semibold text-slate-950 dark:text-white">
                            {isHi ? '3. किस उम्र (Age Group) के लोग देख रहे हैं?' : '3. Audience Age Bracket Verification'}
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {isHi
                              ? 'कोई भी ब्राउज़र बिना लॉगिन के निजी उम्र नहीं भेजता। इसलिए असली उम्र रिपोर्ट केवल दो वैध तरीकों से मिलती है: (क) वेबसाइट फ़ूटर में स्वैच्छिक Reader Pulse सर्वे, और (ख) Google Analytics 4 (GA4 + Google Signals) कनेक्ट करके।'
                              : 'Browsers never expose visitor age without sign-in. Legitimate age breakdown comes from (a) the voluntary All-India Reader Pulse check-in in the site footer and (b) linked Google Analytics 4 (Google Signals) audience reports.'}
                          </p>
                        </div>
                      </div>

                      {/* Live Recorded First-Party Audience Pulse Readout */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {isHi ? 'रिकॉर्डेड Reader Pulse (असली डेटा):' : 'Recorded Reader Pulse (Live Data):'}
                          </span>{' '}
                          {pulseData && pulseData.totalResponses > 0 ? (
                            <span>
                              {pulseData.totalResponses} {isHi ? 'प्रतिक्रियाएं' : 'responses'} ·{' '}
                              {Object.entries(pulseData.ageBrackets)
                                .filter(([, count]) => count > 0)
                                .map(([br, count]) => `${br}y: ${count}`)
                                .join(' / ')}
                              {Object.keys(pulseData.states || {}).length > 0 &&
                                ` · ${Object.keys(pulseData.states).length} ${isHi ? 'राज्य' : 'States'}`}
                            </span>
                          ) : (
                            <span>
                              {isHi
                                ? 'अभी तक 0 स्वैच्छिक आयु प्रतिक्रिया (नीचे वेबसाइट फ़ूटर से पाठक बिना लॉगिन राज्य व उम्र जोड़ सकते हैं)'
                                : '0 opt-in responses yet (readers can submit anonymously in the footer; no fake numbers shown)'}
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 shrink-0">
                          GA4: {reportsPayload?.ga4Configured || telemetrySummary?.ga4Configured ? 'Connected' : 'Ready to Link'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* Hardened Multi-Factor Change PIN Modal (On-Site POLITICS WORLD Verification) */}
      {isChangePinOpen && (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-950 dark:bg-emerald-500/15 dark:border dark:border-emerald-500/30 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-500 dark:text-slate-400">
                    {PUBLISHER_BRAND_NAME} SECURITY
                  </div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                    {isHi ? 'सुरक्षा पिन बदलें (Multi-Factor)' : 'Security PIN Rotation'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangePinOpen(false);
                  setRotatedRecoveryKey(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {rotatedRecoveryKey ? (
              /* Success state with rotated Recovery Key */
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {isHi
                        ? 'POLITICS WORLD पिन सुरक्षित रूप से बदल दिया गया'
                        : 'POLITICS WORLD PIN Updated'}
                    </span>
                  </div>
                  <p className="text-emerald-800 dark:text-emerald-300/90 text-[11px]">
                    {isHi
                      ? 'नई रिकवरी कुंजी सुरक्षित रखें (पुरानी कुंजी अब निष्क्रिय है):'
                      : 'Save your newly rotated Recovery Key (previous key is invalidated):'}
                  </p>
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-[#081020] border border-emerald-300 dark:border-emerald-700/70 font-mono text-sm font-bold text-slate-950 dark:text-emerald-300">
                    <span>{rotatedRecoveryKey}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(rotatedRecoveryKey);
                        setCopiedRecoveryKey(true);
                        setTimeout(() => setCopiedRecoveryKey(false), 2000);
                      }}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      {copiedRecoveryKey ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setRotatedRecoveryKey(null);
                      setIsChangePinOpen(false);
                      setChangePinMsg(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 font-semibold cursor-pointer"
                  >
                    {isHi ? 'पूर्ण' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              /* 3-Factor On-Site Verification Form: Owner Email + Security Answer + Current PIN/Recovery Key */
              <form onSubmit={handleChangePin} className="space-y-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isHi
                    ? 'कोई भी बाहरी व्यक्ति पिन न बदल सके, इसके लिए पंजीकृत स्वामी ईमेल, निजी सुरक्षा उत्तर और वर्तमान पिन तीनों की जांच अनिवार्य है।'
                    : 'To protect against unauthorized changes, registered email, private security answer, and current PIN or Recovery Key are all verified server-side.'}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? `पंजीकृत स्वामी ईमेल (${vaultStatus?.ownerEmailMasked || 'v••••8@gmail.com'})` : `Registered Owner Email (${vaultStatus?.ownerEmailMasked || 'v••••8@gmail.com'})`}
                  </label>
                  <input
                    type="email"
                    value={changeOwnerEmail}
                    onChange={(e) => setChangeOwnerEmail(e.target.value)}
                    placeholder={isHi ? 'स्वामी ईमेल दर्ज करें' : 'Enter registered owner email'}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {vaultStatus?.securityQuestion || (isHi ? 'निजी सुरक्षा प्रश्न का उत्तर' : 'Security Question Answer')}
                  </label>
                  <input
                    type="password"
                    value={changeSecurityAnswer}
                    onChange={(e) => setChangeSecurityAnswer(e.target.value)}
                    placeholder={isHi ? 'गुप्त सुरक्षा उत्तर दर्ज करें' : 'Enter secret security answer'}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                  />
                </div>

                {/* Auth factor switch: Current PIN vs Recovery Key */}
                <div className="grid grid-cols-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setChangeAuthMethod('current-pin')}
                    className={`py-1.5 rounded-md font-semibold cursor-pointer transition-all ${
                      changeAuthMethod === 'current-pin'
                        ? 'bg-white dark:bg-[#0d172c] text-slate-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {isHi ? 'वर्तमान पिन से' : 'Current PIN'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChangeAuthMethod('recovery-key')}
                    className={`py-1.5 rounded-md font-semibold cursor-pointer transition-all ${
                      changeAuthMethod === 'recovery-key'
                        ? 'bg-white dark:bg-[#0d172c] text-slate-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {isHi ? 'रिकवरी कुंजी से' : 'Recovery Key'}
                  </button>
                </div>

                {changeAuthMethod === 'current-pin' ? (
                  <input
                    type="password"
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    placeholder={isHi ? 'वर्तमान पिन दर्ज करें' : 'Current PIN'}
                    maxLength={8}
                    inputMode="numeric"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                  />
                ) : (
                  <input
                    type="text"
                    value={recoveryKeyInput}
                    onChange={(e) => setRecoveryKeyInput(e.target.value.toUpperCase())}
                    placeholder="PW-XXXX-XXXX-XXXX"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono uppercase text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                  />
                )}

                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder={isHi ? 'नया मजबूत पिन (4-8 अंक)' : 'New Strong PIN (4-8 digits)'}
                  maxLength={8}
                  inputMode="numeric"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                />
                <input
                  type="password"
                  value={confirmNewPinInput}
                  onChange={(e) => setConfirmNewPinInput(e.target.value)}
                  placeholder={isHi ? 'नए पिन की पुष्टि करें' : 'Confirm New PIN'}
                  maxLength={8}
                  inputMode="numeric"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-950 dark:focus:border-amber-400/70"
                />

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isHi
                    ? 'नोट: 1947, 1234, 0000 या लगातार अंक अमान्य हैं। पिन सर्वर पर scrypt से एन्क्रिप्ट होता है।'
                    : 'Weak/sequential PINs (e.g. 1947, 1234, 0000) are blocked. Encrypted server-side via scrypt.'}
                </p>

                {changePinMsg && (
                  <div
                    className={`p-2.5 rounded-lg border ${
                      changePinMsg.isError
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300'
                        : 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {changePinMsg.text}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsChangePinOpen(false)}
                    className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                  >
                    {isHi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingSecurity || lockoutSeconds > 0}
                    className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white disabled:opacity-60 text-white dark:text-slate-950 font-semibold cursor-pointer"
                  >
                    {isSavingSecurity
                      ? isHi
                        ? 'सेव हो रहा है...'
                        : 'Saving...'
                      : isHi
                        ? 'पिन सुरक्षित करें'
                        : 'Save Strong PIN'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Invalid GSTIN Error Modal */}
      {gstinErrorModal && (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold">{isHi ? 'अमान्य GSTIN नंबर' : 'Invalid GSTIN'}</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{gstinErrorModal}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setClientType('b2c');
                  setGstinErrorModal(null);
                }}
                className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isHi ? 'B2C चुनें' : 'Switch to B2C'}
              </button>
              <button
                type="button"
                onClick={() => setGstinErrorModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
              >
                {isHi ? 'सुधारें' : 'Fix GSTIN'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Automated Self-Serve Ad Checkout Modal */}
      <AdSlotCheckoutModal
        isOpen={Boolean(checkoutModalSlot)}
        initialSlotKey={checkoutModalSlot || 'header'}
        initialDurationKey={checkoutModalDuration}
        onClose={() => setCheckoutModalSlot(null)}
        onDeployedAndNavigate={(domTargetId) => {
          setCheckoutModalSlot(null);
          onClose();
          onNavigateToSlot?.(domTargetId);
        }}
      />
    </div>
  );
};
