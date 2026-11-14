import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Mail,
  Zap,
  Sliders,
  Sparkles,
  Building2,
  Send,
  Layers,
  FileCheck,
  ArrowRight,
  Copy,
  Check,
  Receipt,
  Calendar,
  Printer,
  Download,
  AlertCircle,
  Clock,
  Briefcase,
  Lock,
  Unlock,
  Key,
  LogOut,
  Eye,
  EyeOff,
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { WalletLedgerDashboard } from './WalletLedgerDashboard';

interface MonetizationHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'revenue' | 'wallet' | 'invoice' | 'ratecard' | 'adsense' | 'calculator' | 'guide';
}

export interface AdSenseConfig {
  publisherId: string;
  headerSlotId: string;
  inArticleSlotId: string;
  adMode: 'sponsor' | 'adsense';
  isAutoAdsEnabled: boolean;
}

export const GST_STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra & Nagar Haveli and Daman & Diu',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh (Old)',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
};

export interface GstinValidationResult {
  isValid: boolean;
  stateCode?: string;
  stateName?: string;
  pan?: string;
  error?: string;
}

export function validateIndianGSTIN(gstin: string): GstinValidationResult {
  const clean = (gstin || '').trim().toUpperCase();
  if (!clean) {
    return { isValid: false, error: 'कृपया विज्ञापनदाता का 15 अंकों का GSTIN दर्ज करें।' };
  }
  if (clean.length !== 15) {
    return {
      isValid: false,
      error: `GSTIN ठीक 15 अक्षरों का होना अनिवार्य है (वर्तमान लंबाई: ${clean.length} अक्षर)।`,
    };
  }
  // Standard format: 2 digits (State code) + 5 letters + 4 digits + 1 letter (PAN) + 1 entity + Z + 1 check digit
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(clean)) {
    return {
      isValid: false,
      error: 'अमान्य GSTIN संरचना! सही प्रारूप: 2 अंक (राज्य कोड) + 10 अंक (पैन) + 1 इकाई + "Z" + 1 चेक डिजिट होना चाहिए (उदा: 07AAAAA0000A1Z5)। जाली नंबर से आगे नहीं बढ़ सकते।',
    };
  }
  const stateCode = clean.substring(0, 2);
  const stateName = GST_STATE_CODES[stateCode];
  if (!stateName) {
    return {
      isValid: false,
      error: `अमान्य राज्य कोड '${stateCode}'! भारत सरकार के GST मास्टर रिकॉर्ड में यह राज्य कोड मौजूद नहीं है। कृपया सही भारतीय GSTIN दर्ज करें।`,
    };
  }
  const pan = clean.substring(2, 12);
  return {
    isValid: true,
    stateCode,
    stateName,
    pan,
  };
}

const DEFAULT_CONFIG: AdSenseConfig = {
  publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
  headerSlotId: '9876543210',
  inArticleSlotId: '1234567890',
  adMode: 'sponsor',
  isAutoAdsEnabled: true,
};

export const MonetizationHubModal: React.FC<MonetizationHubModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'revenue',
}) => {
  const { langCode } = useLanguage();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<
    'revenue' | 'wallet' | 'invoice' | 'ratecard' | 'adsense' | 'calculator' | 'guide'
  >(initialTab);

  // Sync initial tab when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // =========================================================================
  // PUBLISHER ADMIN PASSCODE & CONFIDENTIALITY GATE (PROTECTS REVENUE & WALLET)
  // =========================================================================
  const DEFAULT_ADMIN_PIN = '1947'; // Master PIN (customizable by publisher)
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem('politics_world_admin_pin') || DEFAULT_ADMIN_PIN;
    } catch {
      return DEFAULT_ADMIN_PIN;
    }
  });

  const [isPublisherAuthenticated, setIsPublisherAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('politics_world_publisher_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [enteredPin, setEnteredPin] = useState('');
  const [showPinDigits, setShowPinDigits] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Change PIN modal state
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');
  const [changePinMsg, setChangePinMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Helper: confidential tabs protected from general public
  const isConfidentialTab = (tab: string) => {
    return ['revenue', 'wallet', 'adsense', 'invoice'].includes(tab);
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === adminPin.trim()) {
      setIsPublisherAuthenticated(true);
      try {
        sessionStorage.setItem('politics_world_publisher_authenticated', 'true');
      } catch {
        // ignore
      }
      setPinError(null);
      setEnteredPin('');
    } else {
      setPinError(
        langCode === 'hi'
          ? 'गलत सुरक्षा पिन (Incorrect PIN)! केवल अधिकृत पब्लिशर ही यह डाटा देख सकते हैं।'
          : 'Incorrect Security PIN! Only authorized publisher may access confidential records.'
      );
    }
  };

  const handlePublisherLogout = () => {
    setIsPublisherAuthenticated(false);
    try {
      sessionStorage.removeItem('politics_world_publisher_authenticated');
    } catch {
      // ignore
    }
    setActiveTab('ratecard');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinInput.trim() !== adminPin.trim()) {
      setChangePinMsg({
        text: langCode === 'hi' ? 'वर्तमान पिन गलत है!' : 'Current PIN is incorrect!',
        isError: true,
      });
      return;
    }
    if (newPinInput.length < 4 || newPinInput.length > 8) {
      setChangePinMsg({
        text: langCode === 'hi' ? 'नया पिन 4 से 8 अंकों का होना चाहिए।' : 'New PIN must be 4 to 8 digits.',
        isError: true,
      });
      return;
    }
    if (newPinInput !== confirmNewPinInput) {
      setChangePinMsg({
        text: langCode === 'hi' ? 'नया पिन और पुष्टि पिन आपस में मेल नहीं खा रहे हैं।' : 'New PINs do not match.',
        isError: true,
      });
      return;
    }

    try {
      localStorage.setItem('politics_world_admin_pin', newPinInput.trim());
    } catch {
      // ignore
    }

    setAdminPin(newPinInput.trim());
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmNewPinInput('');
    setChangePinMsg({
      text: langCode === 'hi' ? 'सुरक्षा पिन सफलतापूर्वक बदल दिया गया है!' : 'Security PIN successfully updated!',
      isError: false,
    });
    setTimeout(() => {
      setIsChangePinOpen(false);
      setChangePinMsg(null);
    }, 2000);
  };

  const [config, setConfig] = useState<AdSenseConfig>(() => {
    try {
      const saved = localStorage.getItem('politics_world_adsense_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CONFIG;
  });

  const [monthlyTraffic, setMonthlyTraffic] = useState<number>(50000);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Inquiry form states
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [sponsorSlot, setSponsorSlot] = useState('header-leaderboard');
  const [sponsorMessage, setSponsorMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // =========================================================================
  // TAX INVOICE GENERATOR STATE (DIRECT BRANDING & SPONSORSHIPS)
  // =========================================================================
  const [clientType, setClientType] = useState<'b2b' | 'b2c'>('b2b');
  const [invSlot, setInvSlot] = useState<
    'header' | 'in-article' | 'sponsored-article' | 'multimedia-feature' | 'sponsored-wire' | 'magazine'
  >('header');
  const [invDuration, setInvDuration] = useState<'1-week' | '1-month' | '3-months' | '1-year'>('1-month');
  const [invClientName, setInvClientName] = useState('Global Trade & Strategic Forum Ltd');
  const [invContactPerson, setInvContactPerson] = useState('Rajesh Sharma, Director of Marketing');
  const [invClientEmail, setInvClientEmail] = useState('ads@globaltradeforum.org');
  const [invClientPhone, setInvClientPhone] = useState('+91 98765 43210');
  const [invClientGstin, setInvClientGstin] = useState('07AAAAA0000A1Z5');
  const [invClientState, setInvClientState] = useState('07 - Delhi');
  const [invClientPan, setInvClientPan] = useState('');
  const [invClientAddress, setInvClientAddress] = useState('Level 4, Diplomatic Enclave, Chanakyapuri, New Delhi, India');
  const [invoiceCopied, setInvoiceCopied] = useState(false);
  const [gstinErrorModal, setGstinErrorModal] = useState<string | null>(null);

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

  const handleSaveConfig = () => {
    try {
      localStorage.setItem('politics_world_adsense_settings', JSON.stringify(config));
      window.dispatchEvent(new Event('storage'));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      // error saving
    }
  };

  const handleCopyAdsTxt = () => {
    const pubClean = config.publisherId.replace(/^ca-/, '');
    const line = `google.com, ${pubClean || 'pub-XXXXXXXXXXXXXXXX'}, DIRECT, f08c47fec0942fa0`;
    navigator.clipboard.writeText(line);
    setCopiedAdsTxt(true);
    setTimeout(() => setCopiedAdsTxt(false), 2500);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:vrai74918@gmail.com?subject=${encodeURIComponent(
      `[Ad Booking] Request for ${sponsorSlot} - ${sponsorName}`
    )}&body=${encodeURIComponent(
      `Name / Organization: ${sponsorName}\nEmail: ${sponsorEmail}\nAd Slot Requested: ${sponsorSlot}\n\nMessage:\n${sponsorMessage}\n\nSent from Politics World Monetization Portal.`
    )}`;
    window.location.href = mailtoUrl;
    setInquirySent(true);
  };

  // Calculator Estimates
  const estimatedAdSenseUsd = Math.round((monthlyTraffic / 1000) * 2.4);
  const estimatedAdSenseInr = Math.round(estimatedAdSenseUsd * 87);
  const directSponsorInr = monthlyTraffic >= 100000 ? 55000 : monthlyTraffic >= 30000 ? 25000 : 15000;
  const totalMonthlyEarningsInr = estimatedAdSenseInr + directSponsorInr;

  // =========================================================================
  // DYNAMIC PRICING & TAX INVOICE CALCULATIONS (SAC 998363)
  // =========================================================================
  const getSlotDetails = () => {
    switch (invSlot) {
      case 'header':
        return {
          title: 'Top Header Broadview Billboard (728x90 / 970x250)',
          sac: '998363',
          rates: { '1-week': 7500, '1-month': 25000, '3-months': 63750, '1-year': 225000 },
          category: 'Display Billboard',
        };
      case 'in-article':
        return {
          title: 'In-Article Mid-Roll Placement (300x250 / 728x90)',
          sac: '998363',
          rates: { '1-week': 5500, '1-month': 18000, '3-months': 45900, '1-year': 162000 },
          category: 'Editorial Inline',
        };
      case 'sponsored-article':
        return {
          title: 'Sponsored Editorial Article (Full Text & Lead Photo)',
          sac: '998363',
          rates: { '1-week': 8000, '1-month': 20000, '3-months': 51000, '1-year': 180000 },
          category: 'Sponsored Content (Subject to Publisher Vetting)',
        };
      case 'multimedia-feature':
        return {
          title: 'Multimedia Feature Dossier (Article + Photos + Video Embed + AI Voice)',
          sac: '998363',
          rates: { '1-week': 15000, '1-month': 38000, '3-months': 96900, '1-year': 340000 },
          category: 'Multimedia Dossier (Text + Photo + Video + Voice)',
        };
      case 'sponsored-wire':
        return {
          title: 'Sponsored Wire Press Release & Archival Syndication',
          sac: '998363',
          rates: { '1-week': 8000, '1-month': 28000, '3-months': 72000, '1-year': 240000 },
          category: 'Syndicated Wire',
        };
      case 'magazine':
        return {
          title: 'Notebook Magazine Diplomatic Review Exclusive Full-Page',
          sac: '998363',
          rates: { '1-week': 12000, '1-month': 35000, '3-months': 90000, '1-year': 300000 },
          category: 'Special Edition Print/Digital',
        };
    }
  };

  const slotInfo = getSlotDetails();
  const basePrice = slotInfo.rates[invDuration];
  const gstAmount = Math.round(basePrice * 0.18);
  const cgstAmount = Math.round(gstAmount / 2);
  const sgstAmount = gstAmount - cgstAmount;
  const grandTotal = basePrice + gstAmount;

  // Campaign Dates calculation
  const today = new Date();
  const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const campaignStartDate = new Date(today.getTime() + 86400000); // starts next day
  const durationDays = invDuration === '1-week' ? 7 : invDuration === '1-month' ? 30 : invDuration === '3-months' ? 90 : 365;
  const campaignEndDate = new Date(campaignStartDate.getTime() + durationDays * 86400000);

  const invoiceNumber = `PW/TAX-INV/2026-27/${(basePrice % 899 + 101).toString()}`;

  const handlePrintInvoice = () => {
    window.print();
  };

  const gstinResult = validateIndianGSTIN(invClientGstin);

  const handleSendTaxInvoiceBooking = () => {
    // INTERNAL GSTIN DETECTION & ENFORCEMENT:
    // If B2B is chosen, GSTIN MUST BE VALID & GENUINE. Fake GSTIN blocks proceeding!
    if (clientType === 'b2b') {
      if (!gstinResult.isValid) {
        setGstinErrorModal(
          gstinResult.error ||
            'अमान्य GSTIN नंबर! केवल सही और प्रमाणित सरकारी 15 अंकों का GSTIN ही स्वीकार्य है। यदि आपके पास GSTIN नहीं है, तो कृपया "छोटा कारोबारी / B2C" विकल्प चुनें।'
        );
        return;
      }
    }

    const verifiedGstinLabel =
      clientType === 'b2b'
        ? `${invClientGstin.toUpperCase()} (सत्यापित: ${gstinResult.stateName} [${gstinResult.stateCode}] · PAN: ${gstinResult.pan})`
        : `URP (Unregistered Person / गैर-पंजीकृत छोटा कारोबारी - GST Rule 46) · POS: ${invClientState}${
            invClientPan ? ` · PAN: ${invClientPan.toUpperCase()}` : ''
          }`;

    const placeOfSupplyText = clientType === 'b2b' ? `${gstinResult.stateName} (${gstinResult.stateCode})` : invClientState;

    const subject = `[TAX INVOICE AD BOOKING] ${invoiceNumber} - ${invClientName} (${
      clientType === 'b2b' ? 'B2B Verified Corporate' : 'B2C Chhota Karobari'
    })`;

    const body = `OFFICIAL DIRECT AD BOOKING & TAX INVOICE CONFIRMATION
Invoice Number: ${invoiceNumber}
Date: ${formatDate(today)}
Supply Classification: ${
      clientType === 'b2b'
        ? 'B2B Commercial Supply (GSTIN Registered - ITC Eligible)'
        : 'B2C Supply to Unregistered Person (छोटा कारोबारी - Rule 46 & Section 31)'
    }
SAC Code: ${slotInfo.sac} (Internet Advertising Space)

CLIENT / ADVERTISER DETAILS:
Entity Type: ${
      clientType === 'b2b'
        ? 'B2B Registered Enterprise'
        : 'छोटा कारोबारी / Unregistered Small Business (Turnover < ₹40L/₹20L Threshold)'
    }
Company / Advertiser: ${invClientName}
Contact Person: ${invContactPerson}
Email: ${invClientEmail}
Phone: ${invClientPhone}
Tax ID / GSTIN Status: ${verifiedGstinLabel}
Place of Supply (POS): ${placeOfSupplyText}
Billing Address: ${invClientAddress}

CAMPAIGN CONTRACT TERMS:
Ad Placement Slot: ${slotInfo.title}
Contract Duration: ${invDuration} (${durationDays} Days)
Campaign Start Date: ${formatDate(campaignStartDate)}
Campaign Expiry Date: ${formatDate(campaignEndDate)}

TAX FINANCIAL STATEMENT:
Base Taxable Subtotal: ₹${basePrice.toLocaleString('en-IN')}
GST @ 18% (SAC 998363): ₹${gstAmount.toLocaleString('en-IN')} (CGST 9% ₹${cgstAmount.toLocaleString('en-IN')} + SGST 9% ₹${sgstAmount.toLocaleString('en-IN')})
Grand Total Payable: ₹${grandTotal.toLocaleString('en-IN')}

LEGAL STATUTORY COMPLIANCE & SAFE HARBOR TERMS:
1. 100% Pre-payment mandatory prior to live creative rendering.
2. Delivery is deemed 100% fulfilled upon active public URL placement during contractual dates.
3. Best-efforts technology standard: Client-side Ad-Blockers or local browser cache do not constitute platform breach.
4. Strictly non-refundable once scheduled or published.
5. Sovereign Prerogative: Politics World retains the sole, unappealable prerogative to accept, vet, edit, reject, or decline any article, photo, video embed, or voice recording without obligation.
6. Submitter 100% Liability: Submitter warrants 100% copyright ownership and assumes full civil and criminal liability for defamation or infringement, fully indemnifying the publisher.
7. Small Business Legal Status: B2C invoices issued under CGST Rule 46 are 100% legally tax-deductible under Indian Income Tax Act Section 37 as business advertising expenses.
8. All legal recourse subject to the platform owner's jurisdiction.

Sent from Politics World Publisher Monetization Desk.`;

    const mailtoUrl = `mailto:vrai74918@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setInvoiceCopied(true);
    setTimeout(() => setInvoiceCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in select-none">
      <div
        className="relative w-full max-w-6xl h-[94dvh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-sm border-t-2 sm:border-2 border-slate-300 bg-white text-slate-900 shadow-2xl overflow-hidden font-sans"
      >
        {/* Header Bar - Compact on Mobile, Full Broadsheet on Tablet/Desktop */}
        <div
          className="p-3 sm:p-4 md:p-5 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 shrink-0"
        >
          <div className="flex items-start sm:items-center justify-between gap-2.5 w-full md:w-auto">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xs bg-slate-900 text-white flex items-center justify-center font-bold shadow-md shrink-0 mt-0.5 sm:mt-0">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="font-serif font-black text-sm sm:text-base md:text-lg tracking-wide text-slate-900 leading-tight">
                    {langCode === 'hi'
                      ? 'पब्लिशर कमर्शियल डेस्क एवं मुद्रीकरण केंद्र'
                      : 'Publisher Commercial Desk & Monetization Hub'}
                  </h2>
                  {isPublisherAuthenticated ? (
                    <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-xs text-[9px] sm:text-[10px] font-mono font-bold uppercase bg-emerald-600 text-white shadow-xs">
                      <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {langCode === 'hi' ? 'अनलॉक' : 'UNLOCKED'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-xs text-[9px] sm:text-[10px] font-mono font-bold uppercase bg-amber-500 text-slate-950 shadow-xs">
                      <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {langCode === 'hi' ? 'पब्लिशर लॉक' : 'LOCKED'}
                    </span>
                  )}
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-xs text-[10px] font-mono font-black uppercase tracking-wider bg-slate-900 text-white">
                    100% ELECTRONIC · NO CASH
                  </span>
                  <span className="hidden md:inline-block px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold uppercase border border-slate-300 text-slate-700 bg-slate-100">
                    SAC 998363 COMPLIANT
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 line-clamp-2 sm:line-clamp-none">
                  {langCode === 'hi'
                    ? 'गोपनीय वित्तीय लेजर (Google AdSense, बैंक विथड्रॉल, इनवॉइसिंग) एवं सार्वजनिक विज्ञापन बुकिंग रेट'
                    : 'Confidential Financial Ledger (AdSense, Bank Withdrawals, Tax Invoices) & Public Media Rate Card'}
                </p>
              </div>
            </div>

            {/* Mobile Top-Right Close Button so it never shifts down */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-full text-slate-500 hover:text-black bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end shrink-0">
            {isPublisherAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setChangePinMsg(null);
                    setCurrentPinInput('');
                    setNewPinInput('');
                    setConfirmNewPinInput('');
                    setIsChangePinOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs text-[11px] sm:text-xs font-mono font-bold border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer shadow-2xs"
                  title="सुरक्षा पिन बदलें"
                >
                  <Key className="w-3.5 h-3.5 text-slate-700" />
                  <span>{langCode === 'hi' ? 'पिन बदलें' : 'Change PIN'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePublisherLogout}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs text-[11px] sm:text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer shadow-xs"
                  title="पब्लिशर सेशन लॉक करें"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>{langCode === 'hi' ? 'लॉक करें' : 'Lock Desk'}</span>
                </button>
              </div>
            ) : (
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                🔒 {langCode === 'hi' ? 'वित्तीय विवरण केवल पब्लिशर हेतु' : 'Private Financials Protected'}
              </span>
            )}

            <button
              onClick={onClose}
              className="hidden md:inline-flex p-2 rounded-xs text-slate-500 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer font-mono ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip - Horizontal Touch-Scrollable on Mobile & Tablet */}
        <div
          className="flex items-center border-b border-slate-200 overflow-x-auto no-scrollbar text-[11px] sm:text-xs font-semibold px-2 sm:px-4 shrink-0 bg-slate-50"
        >
          {/* TAB 1: MY REVENUE - PRIVATE */}
          <button
            onClick={() => setActiveTab('revenue')}
            className={`py-2.5 sm:py-3 px-3 sm:px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'revenue'
                ? 'border-sky-600 text-sky-950 font-black bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span className="font-bold flex items-center gap-1.5">
              <span>{langCode === 'hi' ? '१. मेरी कमाई (Revenue)' : '1. My Revenue'}</span>
              <Lock className="w-2.5 h-2.5 text-slate-500" />
            </span>
          </button>

          {/* TAB 2: MY WALLET - PRIVATE */}
          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-2.5 sm:py-3 px-3 sm:px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'wallet'
                ? 'border-emerald-600 text-emerald-950 font-black bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span className="font-bold flex items-center gap-1.5">
              <span>{langCode === 'hi' ? '२. मेरा वॉलेट (Wallet)' : '2. My Wallet'}</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-xs text-[9px] bg-slate-900 text-white font-black uppercase">
                <Lock className="w-2.5 h-2.5 text-amber-300" />
                <span>BANK</span>
              </span>
            </span>
          </button>

          {/* TAB 3: OFFICIAL TAX INVOICE GENERATOR - PRIVATE */}
          <button
            onClick={() => setActiveTab('invoice')}
            className={`py-2.5 sm:py-3 px-3 sm:px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'invoice'
                ? 'border-slate-900 text-slate-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span className="font-bold flex items-center gap-1.5">
              <span>{langCode === 'hi' ? '३. टैक्स इनवॉइस (B2B)' : '3. Tax Invoice Generator'}</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-xs text-[9px] border border-slate-300 text-slate-700 bg-slate-100 font-bold">
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                <span>B2B</span>
              </span>
            </span>
          </button>

          {/* TAB 4: DIRECT SPONSORSHIP RATE CARD - 100% PUBLIC */}
          <button
            onClick={() => setActiveTab('ratecard')}
            className={`py-2.5 sm:py-3 px-3 sm:px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ratecard'
                ? 'border-amber-500 text-slate-950 font-black bg-white shadow-xs'
                : 'border-transparent text-slate-700 hover:text-slate-950'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-600" />
            <span className="font-bold flex items-center gap-1.5">
              <span>{langCode === 'hi' ? '४. विज्ञापन रेट कार्ड' : '4. Ad Rate Card & Booking'}</span>
              <span className="px-1.5 py-0.2 rounded-xs text-[9px] bg-amber-500 text-slate-950 font-black uppercase">
                PUBLIC
              </span>
            </span>
          </button>

          {/* TAB 5: ADSENSE CONFIG - PRIVATE */}
          <button
            onClick={() => setActiveTab('adsense')}
            className={`py-2.5 sm:py-3 px-3 sm:px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'adsense'
                ? 'border-sky-600 text-sky-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-sky-600" />
            <span className="font-bold flex items-center gap-1.5">
              <span>{langCode === 'hi' ? '५. Google AdSense' : '5. Google AdSense'}</span>
              <Lock className="w-2.5 h-2.5 text-slate-500" />
            </span>
          </button>

          {/* TAB 6: REVENUE CALCULATOR - PUBLIC */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-2.5 sm:py-3 px-3 sm:px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'calculator'
                ? 'border-slate-900 text-slate-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold flex items-center gap-1.5">
              <span>{langCode === 'hi' ? '६. कमाई कैलकुलेटर' : '6. Revenue Forecast'}</span>
              <span className="px-1.5 py-0.2 rounded-xs text-[9px] border border-slate-300 text-slate-600 bg-slate-100">
                TOOL
              </span>
            </span>
          </button>

          {/* TAB 7: EARNING GUIDE - PUBLIC */}
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2.5 sm:py-3 px-3 sm:px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'border-slate-900 text-slate-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{langCode === 'hi' ? '७. कमाई गाइड' : '7. Monetization Guide'}</span>
          </button>
        </div>

        {/* Tab Content Area - White Background */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-5 sm:space-y-6 text-sm bg-white text-slate-900">
          {/* CONFIDENTIAL GATE: Protects 'revenue', 'wallet', 'adsense', and 'invoice' from public visitors */}
          {isConfidentialTab(activeTab) && !isPublisherAuthenticated ? (
            <div className="max-w-xl mx-auto my-6 p-6 sm:p-8 rounded-sm border-2 border-slate-300 bg-white shadow-xl text-center font-sans">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 text-amber-300 flex items-center justify-center shadow-md mb-4">
                <Lock className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div className="inline-block px-3 py-1 rounded-xs bg-slate-100 border border-slate-300 text-slate-800 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                PUBLISHER CONFIDENTIALITY GATE · PIN PROTECTED
              </div>

              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 mb-2">
                {langCode === 'hi'
                  ? '🔒 केवल अधिकृत पब्लिशर हेतु आरक्षित'
                  : '🔒 Publisher Confidential Access Only'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
                {langCode === 'hi'
                  ? 'मेरी कमाई (My Revenue), मेरा वॉलेट (Bank Payouts), Google AdSense सेटिंग्स और B2B टैक्स इनवॉइस केवल वेबसाइट के मालिक/पब्लिशर के लिए सुरक्षित हैं। आगे बढ़ने के लिए अपना सुरक्षा पिन दर्ज करें।'
                  : 'My Revenue, My Wallet (Bank Payouts), Google AdSense configuration, and B2B Tax Invoicing are strictly restricted to the publisher. Enter your Master Publisher PIN to unlock.'}
              </p>

              <form onSubmit={handleVerifyPin} className="max-w-sm mx-auto space-y-4">
                <div className="relative">
                  <input
                    type={showPinDigits ? 'text' : 'password'}
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      if (pinError) setPinError(null);
                    }}
                    placeholder={langCode === 'hi' ? 'सुरक्षा पिन दर्ज करें (उदा. 1947)' : 'Enter 4-8 Digit PIN'}
                    maxLength={8}
                    autoFocus
                    className="w-full text-center tracking-[0.35em] font-mono text-xl sm:text-2xl font-black py-3 px-4 rounded-xs border-2 border-slate-300 focus:border-slate-900 focus:outline-hidden bg-slate-50 text-slate-950 placeholder:tracking-normal placeholder:font-sans placeholder:text-xs placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinDigits(!showPinDigits)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                    title={showPinDigits ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showPinDigits ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {pinError && (
                  <div className="p-2.5 rounded-xs bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-left">
                    {pinError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xs bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    {langCode === 'hi' ? 'अनलॉक करें (Unlock)' : 'Unlock Desk'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ratecard')}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xs border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    {langCode === 'hi' ? 'विज्ञापन रेट कार्ड देखें →' : 'View Public Rate Card →'}
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>डिफ़ॉल्ट मास्टर पिन: <strong className="text-slate-900">1947</strong></span>
                  <span className="text-emerald-700 font-semibold">100% Encrypted</span>
                </div>
              </form>
            </div>
          ) : (
            <>
          {/* TAB 1 & TAB 2: MY REVENUE & MY WALLET (E-LEDGER DASHBOARD) */}
          {(activeTab === 'revenue' || activeTab === 'wallet') && (
            <WalletLedgerDashboard
              defaultView={activeTab === 'wallet' ? 'wallet' : 'revenue'}
              onGoToInvoiceTab={() => setActiveTab('invoice')}
              onGoToRateCardTab={() => setActiveTab('ratecard')}
            />
          )}

          {/* TAB 7: HOW YOU EARN GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-[#040919] border border-amber-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-300 text-base">
                    {langCode === 'hi'
                      ? 'Politics World से पैसे कमाने के 4 प्रमुख तरीके'
                      : '4 Core Monetization Streams for Politics World'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {langCode === 'hi'
                      ? 'आप इस पोर्टल से 4 मुख्य तरीकों से कमाई कर सकते हैं — Google AdSense की कमाई और डायरेक्ट स्पॉन्सरशिप की रकम आपके My Revenue और My Wallet लेजर में जुड़ती है और सीधे आपके बैंक खाते में ट्रांसफर होती है:'
                      : 'News portals command exceptionally high repeat traffic. As readers consume syndicated dispatches and listen to podcasts, you monetize through these 4 pillars:'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-[#040919] border-[#182852] hover:border-sky-500/50 transition-all">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs font-mono">
                      01
                    </span>
                    <h4 className="font-serif font-bold text-slate-100 text-sm">
                      {langCode === 'hi' ? 'Google AdSense (स्वचालित विज्ञापन)' : 'Google AdSense Automated Ads'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {langCode === 'hi'
                      ? 'गूगल आपकी साइट पर अपने आप अंतरराष्ट्रीय विज्ञापन दिखाएगा और हर महीने 21-26 तारीख के बीच सीधे आपके बैंक खाते में वायर ट्रांसफर करेगा।'
                      : 'Google automatically renders targeted contextual ads and deposits monthly ad revenues directly into your bank account.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-[#040919] border-[#182852] hover:border-purple-500/50 transition-all">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                      02
                    </span>
                    <h4 className="font-serif font-bold text-slate-100 text-sm">
                      {langCode === 'hi' ? 'डायरेक्ट ब्रांड टाई-अप व स्पॉन्सरशिप्स' : 'Direct Brand Sponsorships'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {langCode === 'hi'
                      ? 'कंपनियों और संस्थाओं से सीधे सप्ताह/महीने/साल का किराया लें। कोई 30% कमीशन नहीं कटेगा, 100% पैसा आपका होगा और आप आधिकारिक टैक्स इनवॉइस जारी करेंगे।'
                      : 'Direct brand retainers for top header and in-article billboards on weekly, monthly, or annual terms with 100% keeper retainers.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-[#040919] border-[#182852] hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                      03
                    </span>
                    <h4 className="font-serif font-bold text-slate-100 text-sm">
                      {langCode === 'hi' ? 'स्पॉन्सर्ड वायर प्रेस रिलीज (PR Dispatches)' : 'Sponsored Wire Dispatches (PR)'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {langCode === 'hi'
                      ? 'कंपनियां अपने कॉर्पोरेट बयान या घोषणाएं आपकी साइट पर पब्लिश कराने के ₹8,000 से ₹25,000 प्रति प्रेस रिलीज देती हैं।'
                      : 'Publish sponsored diplomatic or corporate press releases on the live feed with permanent archive and audio synthesis.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-[#040919] border-[#182852] hover:border-amber-500/50 transition-all">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                      04
                    </span>
                    <h4 className="font-serif font-bold text-slate-100 text-sm">
                      {langCode === 'hi' ? 'पाठक स्वैच्छिक योगदान एवं पत्रिका बिक्री' : 'Reader Contributions & Magazine'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {langCode === 'hi'
                      ? 'नोटबुक पत्रिका विशेषांक की बिक्री (₹1,999 / $25 प्रति कॉपी) और पाठकों से स्वतंत्र पत्रकारिता तकनीकी ढांचे के लिए स्वैच्छिक अनुदान।'
                      : 'Notebook Magazine sales plus voluntary reader patronage for server upkeep without conferring platform ownership claims.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADSENSE CONFIG */}
          {activeTab === 'adsense' && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-[#040919] border border-[#1a2d5e] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                      {langCode === 'hi' ? 'Google AdSense सेटअप व लाइव स्विच' : 'Google AdSense Production Controls'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {langCode === 'hi'
                        ? 'अपनी AdSense पब्लिशर आईडी दर्ज करें और विज्ञापन मोड चुनें:'
                        : 'Enter your AdSense Publisher ID and toggle display modes:'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#08122d] border border-slate-700 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, adMode: 'sponsor' }))}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        config.adMode === 'sponsor'
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Direct Sponsor
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, adMode: 'adsense' }))}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        config.adMode === 'adsense'
                          ? 'bg-sky-400 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Google AdSense
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {langCode === 'hi' ? 'AdSense Publisher ID (ca-pub-XXXXX)' : 'AdSense Publisher ID'}
                    </label>
                    <input
                      type="text"
                      value={config.publisherId}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, publisherId: e.target.value.trim() }))
                      }
                      placeholder="ca-pub-1234567890123456"
                      className="w-full px-3 py-2 rounded bg-[#091533] border border-[#1e346b] text-white font-mono focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {langCode === 'hi' ? 'Top Header Leaderboard Slot ID' : 'Top Header Slot ID'}
                    </label>
                    <input
                      type="text"
                      value={config.headerSlotId}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, headerSlotId: e.target.value.trim() }))
                      }
                      placeholder="9876543210"
                      className="w-full px-3 py-2 rounded bg-[#091533] border border-[#1e346b] text-white font-mono focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                  {savedSuccess ? (
                    <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{langCode === 'hi' ? 'सेटिंग्स सफलतापूर्वक सेव हो गईं!' : 'Settings Saved Successfully!'}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Settings stored persistently in browser storage
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="w-full sm:w-auto px-5 py-2 rounded font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    {langCode === 'hi' ? 'सेटिंग्स सेव करें' : 'Save & Activate'}
                  </button>
                </div>
              </div>

              {/* ads.txt Authorization Box */}
              <div className="p-4 rounded-lg bg-[#040816] border border-[#15244d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-slate-200 text-xs">
                      {langCode === 'hi' ? 'ads.txt सत्यापन (AdSense के लिए अनिवार्य)' : 'ads.txt Authorization (Required by Google)'}
                    </h4>
                  </div>
                  <button
                    onClick={handleCopyAdsTxt}
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-mono cursor-pointer"
                  >
                    {copiedAdsTxt ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy ads.txt line</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {langCode === 'hi'
                    ? 'आपकी वेबसाइट की रूट डायरेक्टरी पर public/ads.txt पहले से मौजूद है:'
                    : 'The public/ads.txt file is pre-configured on Politics World:'}
                </p>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                  google.com, {config.publisherId.replace(/^ca-/, '') || 'pub-XXXXXXXXXXXXXXXX'}, DIRECT, f08c47fec0942fa0
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVENUE CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-[#040919] border border-[#1a2d5e] space-y-4">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">
                    {langCode === 'hi' ? 'मासिक कमाई कैलकुलेटर (Estimated Monthly Income)' : 'Monthly Revenue & Traffic Forecast'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {langCode === 'hi'
                      ? 'स्लाइडर को आगे-पीछे करके देखें कि विज़िटर्स बढ़ने पर आपकी हर महीने कितनी कमाई हो सकती है:'
                      : 'Slide the traffic bar to project your monthly earnings based on geopolitical news RPMs:'}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      {langCode === 'hi' ? 'मासिक पेजव्यू (Monthly Pageviews):' : 'Monthly Pageviews:'}
                    </span>
                    <span className="text-amber-400 font-bold text-sm">
                      {monthlyTraffic.toLocaleString()} {langCode === 'hi' ? 'पाठक / पेजव्यू' : 'views/month'}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={monthlyTraffic}
                    onChange={(e) => setMonthlyTraffic(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>10,000</span>
                    <span>100,000</span>
                    <span>250,000</span>
                    <span>500,000</span>
                    <span>1,000,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-lg bg-[#08122d] border border-sky-500/30">
                    <span className="text-[11px] font-mono text-sky-400 uppercase tracking-wider block">
                      Google AdSense (RPM $2.40)
                    </span>
                    <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                      ${estimatedAdSenseUsd} <span className="text-xs text-slate-400">/mo</span>
                    </div>
                    <div className="text-xs text-sky-300 font-mono mt-0.5">
                      ≈ ₹{estimatedAdSenseInr.toLocaleString()} INR
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#08122d] border border-amber-500/30">
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                      {langCode === 'hi' ? 'डायरेक्ट स्पॉन्सरशिप' : 'Direct Sponsor Retainers'}
                    </span>
                    <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                      ₹{directSponsorInr.toLocaleString()} <span className="text-xs text-slate-400">/mo</span>
                    </div>
                    <div className="text-xs text-amber-300 font-mono mt-0.5">
                      Fixed 100% Retainer
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-gradient-to-br from-emerald-950/60 to-emerald-900/30 border border-emerald-500/40">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                      {langCode === 'hi' ? 'कुल मासिक कमाई' : 'Total Monthly Earnings'}
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300 mt-1">
                      ₹{totalMonthlyEarningsInr.toLocaleString()}
                    </div>
                    <div className="text-xs text-emerald-400/80 font-mono mt-0.5">
                      ≈ ${(estimatedAdSenseUsd + Math.round(directSponsorInr / 87)).toLocaleString()} USD / Month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIRECT SPONSORSHIP RATE CARD */}
          {activeTab === 'ratecard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">
                    {langCode === 'hi' ? 'आधिकारिक विज्ञापन रेट कार्ड (Official Rate Card)' : 'Direct Advertising Rate Card 2026'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {langCode === 'hi'
                      ? 'विज्ञापनदाताओं और ब्रांड्स के लिए निश्चित दरें। आप सप्ताह, माह या वर्ष के अनुबंध कर सकते हैं:'
                      : 'Fixed institutional advertising retainers on weekly, monthly, or annual contractual terms:'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('invoice')}
                  className="px-3.5 py-1.5 rounded bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md self-start sm:self-auto"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>{langCode === 'hi' ? 'टैक्स इनवॉइस जनरेटर पर जाएं →' : 'Generate Tax Invoice →'}</span>
                </button>
              </div>

              {/* Rate Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Header Billboard */}
                <div className="p-3.5 rounded-lg bg-[#040919] border border-amber-500/40 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      PREMIUM BILLBOARD
                    </span>
                    <h4 className="font-serif font-bold text-slate-100 text-sm mt-2">
                      Top Header Broadview Banner
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      728x90 / 970x250 broadsheet placement visible immediately to every reader on every device.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-base font-bold font-mono text-amber-400">
                      ₹25,000 <span className="text-xs text-slate-400">/month ($300)</span>
                    </div>
                    <button
                      onClick={() => {
                        setInvSlot('header');
                        setActiveTab('invoice');
                      }}
                      className="w-full py-1.5 rounded bg-[#102354] hover:bg-[#1a3888] text-amber-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Create Tax Invoice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 2. In-Article Mid-Roll */}
                <div className="p-3.5 rounded-lg bg-[#040919] border border-sky-500/40 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-sky-400/10 text-sky-400 border border-sky-400/20">
                      HIGH ENGAGEMENT
                    </span>
                    <h4 className="font-serif font-bold text-slate-100 text-sm mt-2">
                      In-Article Mid-Roll Placement
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Positioned directly inside complete news dispatches right after essential takeaways.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-base font-bold font-mono text-sky-400">
                      ₹18,000 <span className="text-xs text-slate-400">/month ($220)</span>
                    </div>
                    <button
                      onClick={() => {
                        setInvSlot('in-article');
                        setActiveTab('invoice');
                      }}
                      className="w-full py-1.5 rounded bg-[#102354] hover:bg-[#1a3888] text-sky-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Create Tax Invoice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 3. Sponsored Article (Text & Lead Photo) */}
                <div className="p-3.5 rounded-lg bg-gradient-to-br from-[#0c142e] to-[#040919] border-2 border-emerald-500/50 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                        SPONSORED ARTICLE
                      </span>
                      <span className="text-[9px] font-mono text-amber-300 font-bold">Vetting Required</span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-100 text-sm mt-2">
                      प्रायोजित आलेख (Full Text & Lead Photo)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      पूरा आर्टिकल, हेडिंग, लेखक विवरण व एचडी फोटो सहित पब्लिश। स्थाई आर्काइव व सर्च इंडेक्सिंग।
                    </p>
                    <div className="text-[10px] text-amber-400/90 font-mono mt-1.5 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
                      ★ अंतिम निर्णय प्रकाशक के संप्रभु अधिकार में
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-base font-bold font-mono text-emerald-400">
                      ₹8,000 <span className="text-xs text-slate-400">/article ($100)</span>
                    </div>
                    <button
                      onClick={() => {
                        setInvSlot('sponsored-article');
                        setActiveTab('invoice');
                      }}
                      className="w-full py-1.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Create Tax Invoice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 4. Full Multimedia Feature (Article + Photos + Video + AI Voice) */}
                <div className="p-3.5 rounded-lg bg-gradient-to-br from-[#1a1333] to-[#080d24] border-2 border-purple-500/60 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-purple-400/20 text-purple-300 border border-purple-400/40">
                        MULTIMEDIA DOSSIER
                      </span>
                      <span className="text-[9px] font-mono text-purple-300 font-bold">Text + Media</span>
                    </div>
                    <h4 className="font-serif font-bold text-purple-200 text-sm mt-2">
                      मल्टीमीडिया फीचर (Article + Photo + Video + Voice)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      पूर्ण आलेख + फोटो गैलरी + यूट्यूब/कस्टम वीडियो एम्बेड + AI वॉइस नैरेशन (ऑडियो पॉडकास्ट)।
                    </p>
                    <div className="text-[10px] text-purple-300 font-mono mt-1.5 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
                      ★ 100% प्रेषक कॉपीराइट व कानूनी जवाबदेही
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-base font-bold font-mono text-purple-300">
                      ₹15,000 <span className="text-xs text-slate-400">/feature ($180)</span>
                    </div>
                    <button
                      onClick={() => {
                        setInvSlot('multimedia-feature');
                        setActiveTab('invoice');
                      }}
                      className="w-full py-1.5 rounded bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Create Tax Invoice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 5. Sponsored Wire Press Release */}
                <div className="p-3.5 rounded-lg bg-[#040919] border border-cyan-500/40 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                      NATIVE EDITORIAL
                    </span>
                    <h4 className="font-serif font-bold text-slate-100 text-sm mt-2">
                      Sponsored Wire Press Release
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Corporate press release distributed via live syndicate feed with permanent archive.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-base font-bold font-mono text-cyan-400">
                      ₹8,000 <span className="text-xs text-slate-400">/dispatch ($100)</span>
                    </div>
                    <button
                      onClick={() => {
                        setInvSlot('sponsored-wire');
                        setActiveTab('invoice');
                      }}
                      className="w-full py-1.5 rounded bg-[#102354] hover:bg-[#1a3888] text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Create Tax Invoice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 6. Notebook Magazine Dossier */}
                <div className="p-3.5 rounded-lg bg-[#040919] border border-rose-500/40 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-rose-400/10 text-rose-400 border border-rose-400/20">
                      DIPLOMATIC PRINT/DIGITAL
                    </span>
                    <h4 className="font-serif font-bold text-slate-100 text-sm mt-2">
                      Notebook Magazine Exclusive Dossier
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Special full-page diplomatic editorial spotlight in our periodic Notebook Magazine.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-base font-bold font-mono text-rose-400">
                      ₹12,000 <span className="text-xs text-slate-400">/page ($150)</span>
                    </div>
                    <button
                      onClick={() => {
                        setInvSlot('magazine');
                        setActiveTab('invoice');
                      }}
                      className="w-full py-1.5 rounded bg-[#102354] hover:bg-[#1a3888] text-rose-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Create Tax Invoice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sovereign Editorial Prerogative & Submitter Legal Liability Shield Callout */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-amber-950/40 via-[#0c142c] to-[#040816] border-2 border-amber-500/50 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-wider text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {langCode === 'hi'
                      ? 'संपादकीय संप्रभुता एवं अस्वीकृति का अधिकार (Publisher Prerogative - आर्टिकल करना है या नहीं करना है)'
                      : 'Publisher Sovereign Prerogative & Submitter Liability Covenant'}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {langCode === 'hi'
                    ? 'Politics World की विधिक नीति के तहत, किसी भी व्यक्ति, संगठन या पीआर एजेंसी द्वारा आलेख (Article), फोटो, वीडियो या वॉइस (Audio) भेजने अथवा भुगतान की पेशकश करने मात्र से उसे पब्लिश करने की कोई बाध्यता नहीं है। आर्टिकल करना है या नहीं करना है इसका १००% अंतिम व संप्रभु निर्णय केवल मंच संचालक का होगा। प्रस्तुत सामग्री के समस्त कॉपीराइट, बौद्धिक संपदा तथा मानहानि (Defamation) की १००% कानूनी जिम्मेदारी प्रस्तुतकर्ता की होगी और मंच संचालक को पूर्ण कानूनी क्षतिपूर्ति (Indemnity) प्राप्त है।'
                    : 'Remittance of advertising fees or submission of articles creates ZERO legal obligation to publish. Politics World retains the sole, unappealable prerogative to accept, vet, edit, reject, or decline any article, photograph, video embed, or voice recording. The submitter warrants 100% intellectual property ownership and assumes exclusive civil and criminal liability for defamation or infringement, fully indemnifying the publisher.'}
                </p>
              </div>

              {/* Inquiry Form */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#08122d] border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <h4 className="font-bold text-purple-300 text-sm">
                    {langCode === 'hi'
                      ? 'त्वरित विज्ञापन व आलेख प्रस्तुति पूछताछ (Quick Inquiry)'
                      : 'Quick Advertiser & Article Submission Inquiry'}
                  </h4>
                </div>
                {inquirySent ? (
                  <div className="p-4 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {langCode === 'hi'
                        ? 'विज्ञापन अनुरोध ईमेल खुल गया है।'
                        : 'Booking email opened in client.'}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          {langCode === 'hi' ? 'आपका नाम / कंपनी:' : 'Your Name / Company:'}
                        </label>
                        <input
                          type="text"
                          required
                          value={sponsorName}
                          onChange={(e) => setSponsorName(e.target.value)}
                          placeholder="Your Name / Company"
                          className="w-full px-3 py-2 rounded bg-[#050a1a] border border-[#1d3263] text-white focus:outline-hidden focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          {langCode === 'hi' ? 'आधिकारिक ईमेल:' : 'Official Email:'}
                        </label>
                        <input
                          type="email"
                          required
                          value={sponsorEmail}
                          onChange={(e) => setSponsorEmail(e.target.value)}
                          placeholder="Official Email (contact@brand.com)"
                          className="w-full px-3 py-2 rounded bg-[#050a1a] border border-[#1d3263] text-white focus:outline-hidden focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          {langCode === 'hi' ? 'स्थान या आलेख प्रकार चुनें:' : 'Placement / Article Format:'}
                        </label>
                        <select
                          value={sponsorSlot}
                          onChange={(e) => setSponsorSlot(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-[#050a1a] border border-[#1d3263] text-white focus:outline-hidden focus:border-purple-400 cursor-pointer"
                        >
                          <option value="header-leaderboard">Top Header Billboard (728x90)</option>
                          <option value="in-article">In-Article Mid-Roll Banner (300x250)</option>
                          <option value="sponsored-article">प्रायोजित आलेख (Full Text & Lead Photo) - Vetting Required</option>
                          <option value="multimedia-feature">मल्टीमीडिया फीचर (Text + Photo + Video + AI Voice)</option>
                          <option value="sponsored-wire">Sponsored Wire Press Release</option>
                          <option value="magazine">Notebook Magazine Strategic Dossier</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          {langCode === 'hi' ? 'संक्षिप्त विवरण / मीडिया लिंक:' : 'Brief Description / Media Link:'}
                        </label>
                        <input
                          type="text"
                          value={sponsorMessage}
                          onChange={(e) => setSponsorMessage(e.target.value)}
                          placeholder="Article title, photo/video link, duration..."
                          className="w-full px-3 py-2 rounded bg-[#050a1a] border border-[#1d3263] text-white focus:outline-hidden focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">Desk: vrai74918@gmail.com</span>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Booking Inquiry</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: B2B DIRECT AD TAX INVOICE & CAMPAIGN AGREEMENT        */}
          {/* ============================================================ */}
          {activeTab === 'invoice' && (
            <div className="space-y-6">
              {/* Top Banner with Statutory Shield */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-rose-950/40 via-[#0d1633] to-[#0a142e] border-2 border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-rose-400 shrink-0" />
                    <h3 className="font-serif font-black text-rose-300 text-base">
                      {langCode === 'hi'
                        ? 'आधिकारिक B2B टैक्स इनवॉइस एवं डिलीवरी सुरक्षा जनरेटर'
                        : 'Official B2B Tax Invoice & Campaign Delivery Shield'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {langCode === 'hi'
                      ? 'GST SAC 998363 के तहत सीधे विज्ञापनदाताओं के लिए कानूनी टैक्स इनवॉइस। इसमें समय-सीमा (सप्ताह/माह/वर्ष), 100% गैर-वापसी योग्य डिलीवरी मानक और झूठे दावों से पूर्ण सुरक्षा मुद्रित है।'
                      : 'Statutory B2B Tax Invoicing for direct brand bookings. Governed under 100% pre-paid insertion orders, live URL delivery proofs, and strict non-refundable terms.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintInvoice}
                    className="px-3.5 py-2 rounded bg-[#102354] hover:bg-[#1a3888] text-white font-mono text-xs font-bold border border-sky-400/40 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    title="प्रिंट या PDF में सेव करें"
                  >
                    <Printer className="w-4 h-4 text-sky-400" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Invoicing Interactive Configuration Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left 1 Column: Ad Slot, Duration & Client Config - Clean White Background */}
                <div className="space-y-4 bg-white p-4 sm:p-5 rounded-lg border border-slate-300 text-xs shadow-sm">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-600" />
                      <span>{langCode === 'hi' ? '१. ग्राहक श्रेणी एवं अभियान विवरण' : '1. Client Category & Specs'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-normal text-slate-500">SAC 998363</span>
                  </h4>

                  {/* Client Category Selector: B2B vs Chhota Karobari (B2C) */}
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5 flex items-center justify-between">
                      <span>{langCode === 'hi' ? 'ग्राहक श्रेणी (Client Tax Type):' : 'Client Tax Entity:'}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        CGST Rule 46
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setClientType('b2b')}
                        className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                          clientType === 'b2b'
                            ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-xs ring-1 ring-blue-500'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5 text-xs text-blue-900">
                          <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>B2B कॉर्पोरेट</span>
                        </div>
                        <div className="text-[10px] text-blue-700 mt-0.5 font-medium">
                          GSTIN अनिवार्य (ITC क्लेम)
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setClientType('b2c')}
                        className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                          clientType === 'b2c'
                            ? 'bg-amber-50 border-amber-600 text-amber-950 shadow-xs ring-1 ring-amber-500'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5 text-xs text-amber-900">
                          <Briefcase className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>छोटा कारोबारी</span>
                        </div>
                        <div className="text-[10px] text-amber-700 mt-0.5 font-medium">
                          बिना GSTIN (URP - 100% वैध)
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Slot Choice */}
                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">
                      {langCode === 'hi' ? 'विज्ञापन स्थान (Ad Placement Slot):' : 'Placement Slot:'}
                    </label>
                    <select
                      value={invSlot}
                      onChange={(e) => setInvSlot(e.target.value as any)}
                      className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 focus:outline-hidden focus:border-amber-500 cursor-pointer text-xs"
                    >
                      <option value="header">Top Header Broadview Banner (728x90)</option>
                      <option value="in-article">In-Article Mid-Roll Banner (300x250)</option>
                      <option value="sponsored-article">प्रायोजित आलेख (Full Text & Lead Photo) - SAC 998363</option>
                      <option value="multimedia-feature">मल्टीमीडिया फीचर (Article + Photo + Video + AI Voice) - SAC 998363</option>
                      <option value="sponsored-wire">Sponsored Wire Press Release</option>
                      <option value="magazine">Notebook Magazine Strategic Dossier</option>
                    </select>
                  </div>

                  {/* Duration Choice */}
                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">
                      {langCode === 'hi' ? 'अभियान की सटीक अवधि (Contract Duration):' : 'Contract Duration:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setInvDuration('1-week')}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${
                          invDuration === '1-week'
                            ? 'bg-amber-100/70 border-amber-500 text-amber-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <div className="font-bold">१ सप्ताह (7 Days)</div>
                        <div className="text-[10px] text-slate-500">Fast-Track Test</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInvDuration('1-month')}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${
                          invDuration === '1-month'
                            ? 'bg-amber-100/70 border-amber-500 text-amber-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <div className="font-bold">१ माह (30 Days)</div>
                        <div className="text-[10px] text-slate-500">Monthly Retainer</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInvDuration('3-months')}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${
                          invDuration === '3-months'
                            ? 'bg-amber-100/70 border-amber-500 text-amber-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <div className="font-bold">३ माह (Quarterly)</div>
                        <div className="text-[10px] text-emerald-700 font-semibold">15% Discount</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInvDuration('1-year')}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${
                          invDuration === '1-year'
                            ? 'bg-amber-100/70 border-amber-500 text-amber-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <div className="font-bold">१ वर्ष (365 Days)</div>
                        <div className="text-[10px] text-amber-800 font-semibold">25% Max Savings</div>
                      </button>
                    </div>
                  </div>

                  {/* Client Details Inputs */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {langCode === 'hi' ? 'कंपनी / प्रतिष्ठान / व्यापारी का नाम:' : 'Company / Merchant Name:'}
                      </label>
                      <input
                        type="text"
                        value={invClientName}
                        onChange={(e) => setInvClientName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 text-slate-900 focus:outline-hidden focus:border-amber-500"
                        placeholder="उदा: गुप्ता ट्रेडिंग कंपनी / Sharma Textiles"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {langCode === 'hi' ? 'अधिकृत संपर्क व्यक्ति:' : 'Contact Person:'}
                      </label>
                      <input
                        type="text"
                        value={invContactPerson}
                        onChange={(e) => setInvContactPerson(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 text-slate-900 focus:outline-hidden focus:border-amber-500"
                        placeholder="उदा: रमेश गुप्ता (प्रोपराइटर)"
                      />
                    </div>

                    {/* B2B GSTIN FIELD WITH REAL-TIME INTERNAL DETECTION */}
                    {clientType === 'b2b' ? (
                      <div className="space-y-1.5">
                        <label className="block text-slate-800 font-semibold mb-1 flex items-center justify-between">
                          <span>{langCode === 'hi' ? '15 अंकों का GSTIN नंबर (अनिवार्य):' : '15-Digit GSTIN (Required):'}</span>
                          <span className="text-[10px] font-mono text-slate-500">Auto-Detect</span>
                        </label>
                        <input
                          type="text"
                          value={invClientGstin}
                          onChange={(e) => setInvClientGstin(e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, ''))}
                          maxLength={15}
                          placeholder="07AAAAA0000A1Z5"
                          className={`w-full px-2.5 py-1.5 rounded border text-slate-900 font-mono tracking-wider text-xs focus:outline-hidden ${
                            gstinResult.isValid
                              ? 'bg-emerald-50 border-emerald-500 focus:border-emerald-600 text-emerald-950 font-bold'
                              : 'bg-rose-50 border-rose-400 focus:border-rose-600 text-rose-950'
                          }`}
                        />

                        {/* Real-time GSTIN validation feedback badge */}
                        {gstinResult.isValid ? (
                          <div className="p-2 rounded bg-emerald-50 border border-emerald-300 text-emerald-950 text-[11px] space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>मान्य सरकारी GSTIN (Government Format Match)</span>
                            </div>
                            <div className="text-[10px] text-emerald-700 flex flex-wrap gap-x-2 font-mono">
                              <span>राज्य: <strong>{gstinResult.stateName} ({gstinResult.stateCode})</strong></span>
                              <span>•</span>
                              <span>PAN: <strong>{gstinResult.pan}</strong></span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2 rounded bg-rose-50 border border-rose-300 text-rose-950 text-[11px] space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-rose-800">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>अमान्य / जाली GSTIN (Validation Failed)</span>
                            </div>
                            <p className="text-[10px] text-rose-700 leading-tight">
                              {gstinResult.error}
                            </p>
                            <button
                              type="button"
                              onClick={() => setClientType('b2c')}
                              className="text-[10px] text-blue-700 hover:text-blue-900 underline font-semibold cursor-pointer block pt-0.5"
                            >
                              GSTIN नहीं है? 'छोटा कारोबारी' मोड चुनें (बिना GSTIN 100% वैध)
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* CHHOTA KAROBARI (B2C) FIELDS: NO GSTIN NEEDED, 100% LEGAL UNDER RULE 46 */
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-slate-800 font-semibold mb-1 flex items-center justify-between">
                            <span>{langCode === 'hi' ? 'सप्लाई का राज्य (Place of Supply):' : 'Place of Supply (State):'}</span>
                            <span className="text-[10px] font-mono text-emerald-700 font-bold">Rule 46</span>
                          </label>
                          <select
                            value={invClientState}
                            onChange={(e) => setInvClientState(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 text-slate-900 font-medium cursor-pointer text-xs focus:outline-hidden focus:border-amber-500"
                          >
                            {Object.entries(GST_STATE_CODES).map(([code, name]) => (
                              <option key={code} value={`${code} - ${name}`}>
                                {code} - {name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-800 font-semibold mb-1 flex items-center justify-between">
                            <span>{langCode === 'hi' ? 'पैन नंबर (वैकल्पिक / Optional PAN):' : 'PAN (Optional):'}</span>
                            <span className="text-[10px] text-slate-500">आयकर छूट Sec 37 हेतु</span>
                          </label>
                          <input
                            type="text"
                            value={invClientPan}
                            onChange={(e) => setInvClientPan(e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, ''))}
                            maxLength={10}
                            placeholder="उदा: ABCDE1234F"
                            className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:outline-hidden focus:border-amber-500 uppercase"
                          />
                        </div>

                        {/* Statutory explanation card for Chhota Karobari */}
                        <div className="p-2.5 rounded bg-amber-50 border border-amber-300 text-[11px] text-amber-950 space-y-1 leading-relaxed">
                          <div className="font-bold flex items-center gap-1.5 text-amber-900">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>छोटा कारोबारी कानूनी नियम (GST Rule 46):</span>
                          </div>
                          <p className="text-[10px] text-amber-900 leading-tight">
                            ₹40L/₹20L सीमा से कम टर्नओवर वाले छोटे व्यापारियों को <strong>GSTIN की आवश्यकता नहीं</strong> है। इनवॉइस पर GSTIN स्वतः <strong>'URP (Unregistered Person)'</strong> दर्ज होगा।
                          </p>
                          <p className="text-[10px] text-amber-900 leading-tight">
                            पॉलिटिक्स वर्ल्ड 18% GST सरकार को भरेगा। आप इस इनवॉइस को अपने आयकर (ITR) में <strong>धारा 37 के तहत 100% कानूनी विज्ञापन खर्च</strong> दिखा सकते हैं।
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {langCode === 'hi' ? 'बिलिंग ईमेल:' : 'Billing Email:'}
                      </label>
                      <input
                        type="email"
                        value={invClientEmail}
                        onChange={(e) => setInvClientEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 text-slate-900 focus:outline-hidden focus:border-amber-500"
                        placeholder="billing@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {langCode === 'hi' ? 'संपर्क फोन नंबर:' : 'Contact Phone:'}
                      </label>
                      <input
                        type="tel"
                        value={invClientPhone}
                        onChange={(e) => setInvClientPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 text-slate-900 focus:outline-hidden focus:border-amber-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Right 2 Columns: Printable Official B2B / B2C Tax Invoice Card */}
                <div className="lg:col-span-2 bg-[#ffffff] text-slate-900 p-3.5 sm:p-6 md:p-7 rounded-lg shadow-2xl border-2 border-slate-300 font-sans text-xs space-y-5 print:p-0 print:border-none print:shadow-none">
                  {/* Invoice Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-white font-mono text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        <Receipt className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {clientType === 'b2b'
                            ? 'TAX INVOICE · B2B COMMERCIAL SUPPLY (ITC ELIGIBLE)'
                            : 'OFFICIAL TAX INVOICE · B2C UNREGISTERED SUPPLY (RULE 46 & SEC 31)'}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-2xl font-serif font-black tracking-tight text-slate-950">
                        POLITICS WORLD MEDIA NETWORK
                      </h2>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Global Geopolitical & Diplomatic Wire Intelligence
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Digital Service SAC Code: <strong className="text-slate-900">998363</strong> (Internet Advertising & Space)
                      </p>
                    </div>

                    <div className="p-3 bg-slate-100 rounded border border-slate-300 text-left sm:text-right font-mono space-y-1 shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase">Invoice No:</span>{' '}
                        <strong className="text-slate-950 text-xs">{invoiceNumber}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase">Date of Issue:</span>{' '}
                        <span className="text-slate-800 font-semibold">{formatDate(today)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase">Supply Type:</span>{' '}
                        <span className="text-slate-900 font-bold">{clientType === 'b2b' ? 'B2B Standard' : 'B2C (URP)'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase">Terms:</span>{' '}
                        <span className="text-rose-700 font-bold">100% Pre-Paid</span>
                      </div>
                    </div>
                  </div>

                  {/* Billed To / Client Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded border border-slate-200">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                        BILLED TO ({clientType === 'b2b' ? 'B2B COMMERCIAL ADVERTISER' : 'छोटा कारोबारी / UNREGISTERED PERSON'}):
                      </span>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{invClientName || 'Advertiser Entity'}</div>
                      <div className="text-slate-600 text-[11px]">{invContactPerson}</div>
                      <div className="text-slate-600 text-[11px]">{invClientAddress}</div>

                      {/* Dynamic GSTIN / URP display */}
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200 space-y-0.5">
                        {clientType === 'b2b' ? (
                          <div>
                            <span className="text-slate-500 font-mono text-[10px] uppercase">Client GSTIN: </span>
                            <strong className="font-mono text-slate-900">{invClientGstin}</strong>{' '}
                            {gstinResult.isValid ? (
                              <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold">
                                Verified · {gstinResult.stateName}
                              </span>
                            ) : (
                              <span className="inline-block px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-mono text-[9px] font-bold">
                                Invalid / Pending
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div>
                              <span className="text-slate-500 font-mono text-[10px] uppercase">GSTIN Status: </span>
                              <strong className="font-mono text-slate-900">URP (Unregistered Person / छोटा कारोबारी)</strong>{' '}
                              <span className="inline-block px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono text-[9px] font-bold">
                                GST Rule 46 Exemption
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-600 font-mono">
                              <span>Place of Supply (POS): <strong>{invClientState}</strong></span>
                              {invClientPan && <span> · PAN: <strong>{invClientPan}</strong></span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sm:text-right font-mono text-[11px] space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        CAMPAIGN VALIDITY WINDOW:
                      </span>
                      <div>
                        Starts: <strong className="text-slate-900">{formatDate(campaignStartDate)}</strong>
                      </div>
                      <div>
                        Expires: <strong className="text-slate-900">{formatDate(campaignEndDate)}</strong> (23:59 IST)
                      </div>
                      <div className="text-emerald-700 font-bold">
                        Duration: {durationDays} Days ({invDuration.toUpperCase()})
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Legal Expense Claim: <strong className="text-slate-800">IT Act Sec 37 (100% Deductible)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Line Item Table */}
                  <div className="border border-slate-300 rounded overflow-x-auto">
                    <table className="w-full min-w-[440px] text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase">
                          <th className="p-2.5">Description of Digital Service</th>
                          <th className="p-2.5 text-center">SAC</th>
                          <th className="p-2.5 text-center">Duration</th>
                          <th className="p-2.5 text-right">Taxable Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        <tr>
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{slotInfo.title}</div>
                            <div className="text-[11px] text-slate-500">
                              Fixed-term digital ad slot deployment on Politics World public live URL
                            </div>
                            {clientType === 'b2c' && (
                              <div className="text-[10px] text-amber-700 mt-0.5">
                                • Issued to Unregistered Small Business under CGST Rule 46 (Forward Charge GST by Publisher)
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-center font-mono">{slotInfo.sac}</td>
                          <td className="p-3 text-center font-mono">{durationDays} Days</td>
                          <td className="p-3 text-right font-mono font-semibold">
                            ₹{basePrice.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Tax Totals Calculation */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="max-w-xs text-[10px] text-slate-500 space-y-1">
                      <div>Amount in Words:</div>
                      <div className="italic font-serif text-slate-800 font-medium">
                        Indian Rupees {grandTotal.toLocaleString('en-IN')} Only
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono pt-1">
                        Certified electronic invoice. Zero cash acceptance. 100% digital trace.
                      </div>
                    </div>

                    <div className="w-full sm:w-64 space-y-1.5 font-mono text-xs text-right bg-slate-50 p-3 rounded border border-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Taxable Subtotal:</span>
                        <span className="font-semibold text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">CGST (9%):</span>
                        <span className="text-slate-900">₹{cgstAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">SGST (9%):</span>
                        <span className="text-slate-900">₹{sgstAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-slate-300 text-sm font-bold text-slate-950">
                        <span>Total Payable:</span>
                        <span className="text-emerald-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Statutory Safe Harbor Terms (Printed Legally on Every Invoice) */}
                  <div className="p-3 bg-amber-50 rounded border border-amber-300 text-[10px] text-slate-800 space-y-1 leading-relaxed">
                    <div className="font-bold text-amber-950 uppercase font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>BINDING INSERTION ORDER (IO) & CONCLUSIVE DELIVERY STANDARDS:</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-700 pl-1">
                      <li>
                        <strong>Conclusive Delivery:</strong> Deployment of ad creative, sponsored article, or multimedia dossier on Politics World live URL during the contractual validity window constitutes 100% full delivery of service.
                      </li>
                      <li>
                        <strong>Best-Efforts Technology Clause:</strong> End-user Ad-Blockers, client-side cache, or ISP routing latency do not constitute platform default.
                      </li>
                      <li>
                        <strong>Strict Non-Refundable Agreement:</strong> All retainers are 100% pre-paid and non-refundable once scheduled.
                      </li>
                      <li>
                        <strong>Publisher Sovereign Prerogative:</strong> Acceptance of booking or remittance creates ZERO obligation to publish. Politics World retains the sole, unappealable prerogative to accept, vet, edit, reject, or decline any submitted article, photo, video embed, or voice recording.
                      </li>
                      <li>
                        <strong>Submitter 100% Legal & Defamation Liability:</strong> Submitter warrants 100% intellectual property ownership and assumes exclusive civil and criminal liability for defamation, copyright infringement, or statutory violation, fully indemnifying the publisher against all legal claims.
                      </li>
                      <li>
                        <strong>छोटा कारोबारी कानूनी वैधता (Rule 46 & Section 37):</strong> बिना GSTIN वाले छोटे व्यापारियों को जारी B2C टैक्स इनवॉइस आयकर कानून (Income Tax Act) की धारा 37 के अंतर्गत 100% कानूनी एवं कर-कटौती योग्य (Tax Deductible Business Expense) है।
                      </li>
                      <li>
                        <strong>Editorial Integrity:</strong> Commercial sponsorship conveys zero editorial influence or news favoritism over syndicated wires.
                      </li>
                    </ol>
                  </div>

                  {/* Action Bar inside Invoice Tab */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-300 print:hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handlePrintInvoice}
                        className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Printer className="w-4 h-4 shrink-0" />
                        <span>Print / Save PDF</span>
                      </button>

                      <button
                        onClick={handleSendTaxInvoiceBooking}
                        className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95 ${
                          clientType === 'b2b' && !gstinResult.isValid
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-emerald-600 hover:bg-emerald-500'
                        }`}
                      >
                        {invoiceCopied ? (
                          <>
                            <Check className="w-4 h-4 shrink-0" />
                            <span>Booking Dispatched!</span>
                          </>
                        ) : clientType === 'b2b' && !gstinResult.isValid ? (
                          <>
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>GSTIN अमान्य है (सुधारें)</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 shrink-0" />
                            <span>Confirm & Book</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 text-center sm:text-right">
                      Publisher Desk: <strong>vrai74918@gmail.com</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* GSTIN ERROR POPUP MODAL (BLOCKS PROCEEDING WITH FAKE GSTIN) */}
              {gstinErrorModal && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                  <div className="bg-white rounded-lg border-2 border-rose-500 shadow-2xl max-w-md w-full p-5 space-y-4 text-slate-900">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-rose-950 text-sm">
                          अमान्य या जाली GSTIN से आगे नहीं बढ़ सकते!
                        </h4>
                        <p className="text-xs text-rose-800 leading-relaxed">
                          {gstinErrorModal}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-amber-800">
                        <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                        <span>क्या आप छोटे व्यापारी हैं (बिना GSTIN)?</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-tight">
                        यदि आपके पास GSTIN नहीं है, तो जाली नंबर डालने की आवश्यकता नहीं है। सरकार के GST Rule 46 के तहत आप <strong>'छोटा कारोबारी'</strong> विकल्प चुनकर 100% कानूनी B2C टैक्स इनवॉइस प्राप्त कर सकते हैं।
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setClientType('b2c');
                          setGstinErrorModal(null);
                        }}
                        className="px-3.5 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
                      >
                        छोटा कारोबारी (बिना GSTIN) चुनें
                      </button>
                      <button
                        type="button"
                        onClick={() => setGstinErrorModal(null)}
                        className="px-3.5 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
                      >
                        GSTIN ठीक करें
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>

        {/* Modal Footer - Clean Slate */}
        <div className="p-2.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-600 font-mono text-center sm:text-left">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
            <span>SAC 998363 · 100% Pre-Paid Orders · Certified NO CASH</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 sm:py-1.5 rounded-xs bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs cursor-pointer transition-colors shadow-sm"
          >
            {langCode === 'hi' ? 'बंद करें (Close)' : 'Close'}
          </button>
        </div>
      </div>

      {/* CHANGE PIN MODAL (FOR THE PUBLISHER TO PERSONALIZE THEIR MASTER CODE) */}
      {isChangePinOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-sm border-2 border-slate-300 shadow-2xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-6 text-slate-900 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-slate-900" />
                <h4 className="font-serif font-black text-base text-slate-900">
                  {langCode === 'hi' ? 'पब्लिशर मास्टर पिन बदलें' : 'Change Master Publisher PIN'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePinOpen(false)}
                className="p-1 text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {langCode === 'hi'
                ? 'नया सुरक्षा पिन सेट करें ताकि केवल आप ही Revenue, Wallet और AdSense सेटिंग्स खोल सकें। डिफ़ॉल्ट पिन 1947 था।'
                : 'Set your new personal PIN to safeguard your Revenue, Wallet & AdSense ledgers. Default PIN was 1947.'}
            </p>

            <form onSubmit={handleChangePin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {langCode === 'hi' ? 'वर्तमान पिन (Current PIN)' : 'Current PIN'}
                </label>
                <input
                  type="password"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="****"
                  maxLength={8}
                  className="w-full px-3 py-2 text-center font-mono font-bold tracking-widest border border-slate-300 rounded-xs bg-slate-50 focus:border-slate-900 focus:outline-hidden text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {langCode === 'hi' ? 'नया पिन (4-8 अंक)' : 'New PIN (4-8 digits)'}
                </label>
                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="****"
                  maxLength={8}
                  className="w-full px-3 py-2 text-center font-mono font-bold tracking-widest border border-slate-300 rounded-xs bg-slate-50 focus:border-slate-900 focus:outline-hidden text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {langCode === 'hi' ? 'नए पिन की पुनः पुष्टि करें' : 'Confirm New PIN'}
                </label>
                <input
                  type="password"
                  value={confirmNewPinInput}
                  onChange={(e) => setConfirmNewPinInput(e.target.value)}
                  placeholder="****"
                  maxLength={8}
                  className="w-full px-3 py-2 text-center font-mono font-bold tracking-widest border border-slate-300 rounded-xs bg-slate-50 focus:border-slate-900 focus:outline-hidden text-sm"
                  required
                />
              </div>

              {changePinMsg && (
                <div
                  className={`p-2.5 rounded-xs text-xs font-medium ${
                    changePinMsg.isError
                      ? 'bg-rose-50 border border-rose-200 text-rose-700'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  {changePinMsg.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsChangePinOpen(false)}
                  className="px-3.5 py-1.5 rounded-xs border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  {langCode === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xs bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
                >
                  {langCode === 'hi' ? 'नया पिन सहेजें' : 'Save New PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
