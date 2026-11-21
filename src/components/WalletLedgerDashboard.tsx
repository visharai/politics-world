import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  AlertCircle,
  Send,
  TrendingUp,
  ArrowUpRight,
  Landmark,
  Edit3,
  X,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdSlots, INDIA_LEDGER_STORAGE_KEY } from '../context/AdSlotContext';
import { AD_SLOTS_CATALOG, AdBooking, formatInr } from '../data/adSlotsConfig';
import { getOwnerSessionToken } from '../services/publisherSecurity';
import {
  downloadTaxCompliancePdf,
  downloadTransactionSlipPdf,
  printTaxComplianceDocument,
  printTransactionSlipDocument,
} from '../utils/pdfExport';

export interface LinkedBankAccount {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  holderName: string;
  accountType: 'Current Account' | 'Savings Account';
  upiId?: string;
  isVerified: boolean;
  linkedDate?: string;
}

export const POPULAR_INDIAN_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank Ltd',
  'ICICI Bank Ltd',
  'Punjab National Bank (PNB)',
  'Bank of Baroda (BoB)',
  'Axis Bank Ltd',
  'Kotak Mahindra Bank',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'Yes Bank Ltd',
  'Other Indian Bank',
];

const INDIA_BANK_STORAGE_KEY = 'politics_world_bank_account_in_v3';

export interface WalletTransaction {
  id: string;
  type: 'direct-sponsor' | 'sponsored-article' | 'multimedia-feature' | 'withdrawal';
  title: string;
  payerOrPayee: string;
  dateTime: string;
  dateIso: string;
  category: string;
  paymentMode:
    | 'NEFT Electronic Transfer'
    | 'RTGS Bank Settlement'
    | 'IMPS Instant Electronic'
    | 'Commercial UPI Business';
  deviceReference: string;
  grossAmount: number;
  taxAmount: number;
  netAmount: number;
  status: 'success' | 'pending' | 'failed';
  invoiceNumber?: string;
  notes?: string;
}

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'TXN-DIR-2026-4412',
    type: 'direct-sponsor',
    title: 'National Header Billboard (30 Days Live Placement)',
    payerOrPayee: 'Bharat Infrastructure & Policy Conclave Pvt Ltd (New Delhi)',
    dateTime: '01 Nov 2026, 16:20 IST',
    dateIso: '2026-11-01',
    category: 'SAC 998363 - National Advertising Space (India)',
    paymentMode: 'RTGS Bank Settlement',
    deviceReference: 'UTR: HDFCR520261101441289',
    grossAmount: 25000,
    taxAmount: 4500,
    netAmount: 29500,
    status: 'success',
    invoiceNumber: 'PW/TAX-INV/2026-27/101',
    notes: 'National B2B GSTIN booking (18% GST: 9% CGST + 9% SGST). Settled 100% digitally via RTGS.',
  },
  {
    id: 'TXN-ART-2026-3105',
    type: 'sponsored-article',
    title: 'Sponsored National Editorial Story (7 Days Spotlight)',
    payerOrPayee: 'NITI Dialogue Forum India (Mumbai)',
    dateTime: '04 Nov 2026, 09:15 IST',
    dateIso: '2026-11-04',
    category: 'SAC 998363 - Sponsored National Editorial',
    paymentMode: 'Commercial UPI Business',
    deviceReference: 'UPI-REF: 630891028301',
    grossAmount: 8000,
    taxAmount: 1440,
    netAmount: 9440,
    status: 'success',
    invoiceNumber: 'PW/TAX-INV/2026-27/102',
    notes: 'ASCI & IT Rules 2021 verified. Client assumes Indian copyright & statutory disclosure responsibility.',
  },
  {
    id: 'WDR-BNK-2026-0914',
    type: 'withdrawal',
    title: 'Treasury Disbursal to Linked Indian Settlement Bank',
    payerOrPayee: 'HDFC Bank Ltd (A/C •••• 2749) - Politics World India Desk',
    dateTime: '05 Nov 2026, 12:10 IST',
    dateIso: '2026-11-05',
    category: 'Domestic Bank Settlement (RTGS/NEFT)',
    paymentMode: 'NEFT Electronic Transfer',
    deviceReference: 'UTR: DISBURSAL-NEFT/PW9021841',
    grossAmount: 15000,
    taxAmount: 150,
    netAmount: -15000,
    status: 'success',
    invoiceNumber: 'PW/WDR-ADV/2026-27/001',
    notes: 'Settled digitally in INR to linked Indian business bank account (Sec 269ST compliant).',
  },
  {
    id: 'TXN-MMF-2026-7281',
    type: 'multimedia-feature',
    title: 'Multimedia Feature & AI Voice Dossier (7 Days)',
    payerOrPayee: 'Deccan Semiconductor Council (Bengaluru)',
    dateTime: '07 Nov 2026, 18:40 IST',
    dateIso: '2026-11-07',
    category: 'SAC 998363 - Multimedia Dossier Distribution',
    paymentMode: 'NEFT Electronic Transfer',
    deviceReference: 'UTR: ICICN261107981240',
    grossAmount: 15000,
    taxAmount: 2700,
    netAmount: 17700,
    status: 'success',
    invoiceNumber: 'PW/TAX-INV/2026-27/103',
    notes: 'Full multimedia broadcast + Hindi/English studio audio edition. INR GST invoice settled.',
  },
  {
    id: 'TXN-DIR-2026-5590',
    type: 'direct-sponsor',
    title: 'National Press Release Wire & Archival Syndication',
    payerOrPayee: 'Meridian Sovereign Research Pvt Ltd (New Delhi)',
    dateTime: '09 Nov 2026, 10:30 IST',
    dateIso: '2026-11-09',
    category: 'SAC 998363 - National Wire Syndication',
    paymentMode: 'RTGS Bank Settlement',
    deviceReference: 'UTR: HDFCR520261109102941',
    grossAmount: 8000,
    taxAmount: 1440,
    netAmount: 9440,
    status: 'pending',
    invoiceNumber: 'PW/TAX-INV/2026-27/104',
    notes: 'India B2B GSTIN invoice (18% GST SAC 998363). Bank clearing confirmation awaited.',
  },
];

interface WalletLedgerDashboardProps {
  defaultView?: 'revenue' | 'wallet' | 'all';
  onGoToInvoiceTab?: () => void;
  onGoToRateCardTab?: () => void;
}

export const WalletLedgerDashboard: React.FC<WalletLedgerDashboardProps> = ({
  defaultView = 'revenue',
  onGoToInvoiceTab,
  onGoToRateCardTab,
}) => {
  const { langCode } = useLanguage();
  const isHi = langCode === 'hi';
  const { formatPrice } = useAdSlots();

  const [mainView, setMainView] = useState<'revenue' | 'wallet' | 'all'>(defaultView);

  useEffect(() => {
    if (defaultView) {
      setMainView(defaultView);
    }
  }, [defaultView]);

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(INDIA_LEDGER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Array<Omit<WalletTransaction, 'type'> & { type: string }>;
        return parsed.filter((t) => t.type !== 'adsense') as WalletTransaction[];
      }
    } catch {
      // fallback
    }
    return DEFAULT_TRANSACTIONS;
  });

  const saveTransactions = (newTxns: WalletTransaction[]) => {
    setTransactions(newTxns);
    try {
      localStorage.setItem(INDIA_LEDGER_STORAGE_KEY, JSON.stringify(newTxns));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const syncLedger = () => {
      try {
        const saved = localStorage.getItem(INDIA_LEDGER_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Array<Omit<WalletTransaction, 'type'> & { type: string }>;
          setTransactions(parsed.filter((t) => t.type !== 'adsense') as WalletTransaction[]);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('pw-ledger-updated', syncLedger);
    return () => window.removeEventListener('pw-ledger-updated', syncLedger);
  }, []);

  useEffect(() => {
    const ownerToken = getOwnerSessionToken();
    if (!ownerToken) return;

    let cancelled = false;
    const syncServerBookings = async () => {
      try {
        const res = await fetch('/api/ads/bookings', {
          headers: { Authorization: `Bearer ${ownerToken}` },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const serverBookings = Array.isArray(data?.bookings) ? (data.bookings as AdBooking[]) : [];
        if (serverBookings.length === 0) return;

        setTransactions((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const additions: WalletTransaction[] = [];

          for (const b of serverBookings) {
            if (!b?.bookingId || existingIds.has(b.bookingId)) continue;
            const slotMeta = AD_SLOTS_CATALOG[b.slotKey];
            const txnType: WalletTransaction['type'] =
              b.slotKey === 'sponsored-article'
                ? 'sponsored-article'
                : b.slotKey === 'multimedia-feature'
                  ? 'multimedia-feature'
                  : 'direct-sponsor';
            const paymentMode: WalletTransaction['paymentMode'] = b.paymentMethod?.includes('RTGS')
              ? 'RTGS Bank Settlement'
              : b.paymentMethod?.includes('NEFT')
                ? 'NEFT Electronic Transfer'
                : b.paymentMethod?.includes('IMPS')
                  ? 'IMPS Instant Electronic'
                  : 'Commercial UPI Business';
            const createdDate = b.createdAtIso ? new Date(b.createdAtIso) : new Date();
            additions.push({
              id: b.bookingId,
              type: txnType,
              title: `${slotMeta?.titleEn || b.slotKey} (${b.durationDays} Days Live)`,
              payerOrPayee: b.brandName,
              dateTime:
                createdDate.toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'Asia/Kolkata',
                }) + ' IST',
              dateIso: createdDate.toISOString().slice(0, 10),
              category: 'SAC 998363 - National Digital Ad Booking (India)',
              paymentMode,
              deviceReference: `VERIFIED-UTR: ${b.paymentReference} (INR)`,
              grossAmount: Math.round(b.baseAmount),
              taxAmount: Math.round(b.gstAmount),
              netAmount: Math.round(b.grandTotal),
              status: 'success',
              invoiceNumber: b.invoiceNumber,
              notes: `National booking (${formatInr(b.grandTotal)} incl. 18% GST) deployed live to [${b.slotKey}] -> ${b.targetUrl}`,
            });
          }

          if (additions.length === 0) return prev;
          const merged = [...additions, ...prev];
          try {
            localStorage.setItem(INDIA_LEDGER_STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // ignore
          }
          return merged;
        });
      } catch {
        // ignore network issues
      }
    };

    void syncServerBookings();
    return () => {
      cancelled = true;
    };
  }, []);

  const [searchTxnQuery, setSearchTxnQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'direct-sponsor' | 'sponsored-article' | 'multimedia-feature' | 'withdrawal'
  >('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const [bankAccount, setBankAccount] = useState<LinkedBankAccount>(() => {
    try {
      const saved = localStorage.getItem(INDIA_BANK_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200049182749',
      ifscCode: 'HDFC0000003',
      holderName: 'Politics World India Media Desk',
      accountType: 'Current Account',
      upiId: 'politicsworld@hdfcbank',
      isVerified: true,
      linkedDate: '10 Nov 2026',
    };
  });

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [formBankName, setFormBankName] = useState(bankAccount.bankName);
  const [formOtherBankName, setFormOtherBankName] = useState('');
  const [formHolder, setFormHolder] = useState(bankAccount.holderName);
  const [formAccNo, setFormAccNo] = useState(bankAccount.accountNumber);
  const [formConfirmAccNo, setFormConfirmAccNo] = useState(bankAccount.accountNumber);
  const [formIfsc, setFormIfsc] = useState(bankAccount.ifscCode);
  const [formType, setFormType] = useState<'Current Account' | 'Savings Account'>(
    bankAccount.accountType
  );
  const [formUpi, setFormUpi] = useState(bankAccount.upiId || '');
  const [bankFormError, setBankFormError] = useState<string | null>(null);
  const [bankSuccessBanner, setBankSuccessBanner] = useState<string | null>(null);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(10000);
  const [withdrawBankName, setWithdrawBankName] = useState(bankAccount.bankName);
  const [withdrawAccountNo, setWithdrawAccountNo] = useState(
    bankAccount.accountNumber.length > 4
      ? `•••• •••• ${bankAccount.accountNumber.slice(-4)}`
      : bankAccount.accountNumber
  );
  const [withdrawIfsc, setWithdrawIfsc] = useState(bankAccount.ifscCode);
  const [withdrawHolderName, setWithdrawHolderName] = useState(bankAccount.holderName);
  const [withdrawMode, setWithdrawMode] = useState<
    'RTGS Bank Settlement' | 'NEFT Electronic Transfer' | 'IMPS Instant Electronic'
  >('RTGS Bank Settlement');
  const [withdrawTdsDeduction, setWithdrawTdsDeduction] = useState(false);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState<string | null>(null);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  const handleOpenBankModal = () => {
    const isStandard = POPULAR_INDIAN_BANKS.includes(bankAccount.bankName);
    setFormBankName(isStandard ? bankAccount.bankName : 'Other Indian Bank');
    setFormOtherBankName(isStandard ? '' : bankAccount.bankName);
    setFormHolder(bankAccount.holderName);
    setFormAccNo(bankAccount.accountNumber);
    setFormConfirmAccNo(bankAccount.accountNumber);
    setFormIfsc(bankAccount.ifscCode);
    setFormType(bankAccount.accountType);
    setFormUpi(bankAccount.upiId || '');
    setBankFormError(null);
    setIsBankModalOpen(true);
  };

  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setBankFormError(null);

    const cleanHolder = formHolder.trim();
    const cleanBank = (formBankName === 'Other Indian Bank' ? formOtherBankName : formBankName).trim();
    const cleanAccNo = formAccNo.replace(/\s+/g, '');
    const cleanConfirm = formConfirmAccNo.replace(/\s+/g, '');
    const cleanIfsc = formIfsc.trim().toUpperCase();

    if (!cleanHolder) {
      setBankFormError(isHi ? 'खाताधारक / कंपनी का नाम दर्ज करें।' : 'Enter account holder or Indian entity name.');
      return;
    }
    if (!cleanBank) {
      setBankFormError(isHi ? 'भारतीय बैंक का नाम चुनें या दर्ज करें।' : 'Select or enter an Indian bank name.');
      return;
    }
    if (!/^\d{9,18}$/.test(cleanAccNo)) {
      setBankFormError(
        isHi
          ? 'भारतीय बैंक खाता संख्या 9 से 18 अंकों (केवल संख्या) की होनी चाहिए।'
          : 'Indian bank account number must be 9 to 18 numeric digits.'
      );
      return;
    }
    if (cleanAccNo !== cleanConfirm) {
      setBankFormError(isHi ? 'खाता संख्या आपस में मेल नहीं खा रही है।' : 'Account numbers do not match.');
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      setBankFormError(
        isHi
          ? 'अमान्य 11-अंकीय भारतीय IFSC कोड (उदा. SBIN0000691 या HDFC0000003) दर्ज करें।'
          : 'Invalid 11-character Indian IFSC code (e.g. SBIN0000691 or HDFC0000003).'
      );
      return;
    }

    const updatedAccount: LinkedBankAccount = {
      bankName: cleanBank,
      accountNumber: cleanAccNo,
      ifscCode: cleanIfsc,
      holderName: cleanHolder,
      accountType: formType,
      upiId: formUpi.trim(),
      isVerified: true,
      linkedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    try {
      localStorage.setItem(INDIA_BANK_STORAGE_KEY, JSON.stringify(updatedAccount));
    } catch {
      // ignore
    }

    setBankAccount(updatedAccount);
    setWithdrawBankName(updatedAccount.bankName);
    setWithdrawAccountNo(
      updatedAccount.accountNumber.length > 4
        ? `•••• •••• ${updatedAccount.accountNumber.slice(-4)}`
        : updatedAccount.accountNumber
    );
    setWithdrawIfsc(updatedAccount.ifscCode);
    setWithdrawHolderName(updatedAccount.holderName);
    setIsBankModalOpen(false);
    setBankSuccessBanner(
      isHi
        ? `${cleanBank} (•••• ${cleanAccNo.slice(-4)} · ${cleanIfsc}) सफलतापूर्वक लिंक हो गया।`
        : `${cleanBank} (•••• ${cleanAccNo.slice(-4)} · ${cleanIfsc}) linked and verified.`
    );
    setTimeout(() => setBankSuccessBanner(null), 5000);
  };

  const [viewingTransaction, setViewingTransaction] = useState<WalletTransaction | null>(null);
  const [copiedTxnId, setCopiedTxnId] = useState<string | null>(null);
  const [isTaxReportModalOpen, setIsTaxReportModalOpen] = useState(false);
  const [taxReportCopied, setTaxReportCopied] = useState(false);
  const [csvExported, setCsvExported] = useState(false);

  const revenueTransactions = useMemo(
    () => transactions.filter((t) => t.type !== 'withdrawal'),
    [transactions]
  );

  const walletTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'withdrawal'),
    [transactions]
  );

  const totalPendingRevenue = useMemo(
    () =>
      revenueTransactions
        .filter((t) => t.status === 'pending')
        .reduce((sum, t) => sum + t.netAmount, 0),
    [revenueTransactions]
  );

  const totalIncomeDirect = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'direct-sponsor' && t.status === 'success')
        .reduce((sum, t) => sum + t.netAmount, 0),
    [transactions]
  );

  const totalIncomeArticles = useMemo(
    () =>
      transactions
        .filter(
          (t) =>
            (t.type === 'sponsored-article' || t.type === 'multimedia-feature') &&
            t.status === 'success'
        )
        .reduce((sum, t) => sum + t.netAmount, 0),
    [transactions]
  );

  const totalGrossRevenue = useMemo(
    () => revenueTransactions.reduce((sum, t) => sum + t.grossAmount, 0),
    [revenueTransactions]
  );

  const totalNetRevenueReceived = useMemo(
    () =>
      revenueTransactions
        .filter((t) => t.status === 'success')
        .reduce((sum, t) => sum + t.netAmount, 0),
    [revenueTransactions]
  );

  const totalGstReserve = useMemo(
    () =>
      revenueTransactions
        .filter((t) => t.status === 'success')
        .reduce((sum, t) => sum + t.taxAmount, 0),
    [revenueTransactions]
  );

  const totalWithdrawn = useMemo(
    () =>
      walletTransactions
        .filter((t) => t.status === 'success')
        .reduce((sum, t) => sum + Math.abs(t.netAmount), 0),
    [walletTransactions]
  );

  const totalTdsReserve = useMemo(
    () => walletTransactions.reduce((sum, t) => sum + t.taxAmount, 0),
    [walletTransactions]
  );

  const totalTaxAndGstPool = totalGstReserve + totalTdsReserve;
  const availableBalance = Math.max(0, totalNetRevenueReceived - totalWithdrawn);

  const getStreamMeta = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'direct-sponsor':
        return {
          name: 'Direct Sponsor',
          textColor: 'text-amber-700 dark:text-amber-400',
          amountColor: 'text-emerald-700 dark:text-emerald-400',
        };
      case 'sponsored-article':
      case 'multimedia-feature':
        return {
          name: 'Sponsored Press',
          textColor: 'text-indigo-700 dark:text-indigo-400',
          amountColor: 'text-emerald-700 dark:text-emerald-400',
        };
      case 'withdrawal':
      default:
        return {
          name: 'Bank Payout',
          textColor: 'text-slate-700 dark:text-slate-300',
          amountColor: 'text-slate-900 dark:text-slate-100',
        };
    }
  };

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawErrorMsg(null);
    if (withdrawAmount <= 0) {
      setWithdrawErrorMsg(isHi ? 'वैध INR राशि दर्ज करें।' : 'Enter a valid INR amount.');
      return;
    }
    if (withdrawAmount > availableBalance) {
      setWithdrawErrorMsg(
        isHi
          ? `उपलब्ध बैलेंस केवल ${formatPrice(availableBalance)} है।`
          : `Insufficient treasury balance. Available: ${formatPrice(availableBalance)}.`
      );
      return;
    }

    const calculatedTds = withdrawTdsDeduction ? Math.round(withdrawAmount * 0.01) : 0;
    const now = new Date();
    const dateIso = now.toISOString().split('T')[0];
    const timeFormatted = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });
    const dateFormatted = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newTxnId = `WDR-BNK-2026-${randomSeq}`;
    const newInvoiceNo = `PW/WDR-ADV/2026-27/${randomSeq.toString().slice(0, 3)}`;
    const newDeviceRef = `UTR: DISBURSAL-${withdrawMode.split(' ')[0].toUpperCase()}/PW${Date.now()
      .toString()
      .slice(-7)}`;

    const newWithdrawalRecord: WalletTransaction = {
      id: newTxnId,
      type: 'withdrawal',
      title: 'Treasury Disbursal to Linked Indian Settlement Bank',
      payerOrPayee: `${withdrawBankName} (${withdrawAccountNo}) - ${withdrawHolderName}`,
      dateTime: `${dateFormatted}, ${timeFormatted} IST`,
      dateIso,
      category: `Domestic Bank Settlement (${withdrawMode.split(' ')[0]})`,
      paymentMode: withdrawMode,
      deviceReference: newDeviceRef,
      grossAmount: withdrawAmount,
      taxAmount: calculatedTds,
      netAmount: -withdrawAmount,
      status: 'success',
      invoiceNumber: newInvoiceNo,
      notes: `Electronic INR treasury settlement (Sec 269ST). ${formatInr(calculatedTds)} allocated to TDS Sec 194J reserve.`,
    };

    saveTransactions([newWithdrawalRecord, ...transactions]);

    setWithdrawSuccessMsg(
      isHi
        ? `${formatPrice(withdrawAmount)} ट्रांसफर सफल (Ref: ${newTxnId})`
        : `INR settlement of ${formatPrice(withdrawAmount)} initiated (Ref: ${newTxnId})`
    );

    setTimeout(() => {
      setWithdrawSuccessMsg(null);
      setIsWithdrawModalOpen(false);
    }, 2200);
  };

  const filteredTransactions = useMemo(() => {
    const pool =
      mainView === 'revenue'
        ? revenueTransactions
        : mainView === 'wallet'
          ? walletTransactions
          : transactions;

    return pool.filter((txn) => {
      if (searchTxnQuery.trim()) {
        const q = searchTxnQuery.toLowerCase();
        const match =
          txn.id.toLowerCase().includes(q) ||
          txn.payerOrPayee.toLowerCase().includes(q) ||
          txn.title.toLowerCase().includes(q) ||
          txn.deviceReference.toLowerCase().includes(q) ||
          (txn.invoiceNumber || '').toLowerCase().includes(q);
        if (!match) return false;
      }

      if (typeFilter !== 'all' && txn.type !== typeFilter) return false;
      if (statusFilter !== 'all' && txn.status !== statusFilter) return false;

      if (dateFilter === 'today') {
        const todayIso = new Date().toISOString().split('T')[0];
        if (txn.dateIso !== todayIso) return false;
      } else if (dateFilter === '7days') {
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        if (txn.dateIso < sevenDaysAgo) return false;
      } else if (dateFilter === '30days') {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        if (txn.dateIso < thirtyDaysAgo) return false;
      } else if (dateFilter === 'custom') {
        if (customStartDate && txn.dateIso < customStartDate) return false;
        if (customEndDate && txn.dateIso > customEndDate) return false;
      }

      return true;
    });
  }, [
    transactions,
    revenueTransactions,
    walletTransactions,
    mainView,
    searchTxnQuery,
    typeFilter,
    statusFilter,
    dateFilter,
    customStartDate,
    customEndDate,
  ]);

  const handleCopyTxnId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTxnId(id);
    setTimeout(() => setCopiedTxnId(null), 2000);
  };

  const handleResetFilters = () => {
    setSearchTxnQuery('');
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  const handleDownloadTaxCsv = () => {
    const headers = [
      'Transaction ID',
      'Invoice / Advice No',
      'Payer / Payee Entity',
      'Date & Time (IST)',
      'Classification Category (SAC Code)',
      'Payment Mode (100% Electronic INR)',
      'UTR / UPI Reference',
      'Gross Inflow (INR)',
      'India GST Output (INR)',
      'TDS Compliance Reserve (INR)',
      'Net Amount (INR)',
      'Audit Status',
    ];

    const rows = filteredTransactions.map((t) => [
      t.id,
      t.invoiceNumber || 'E-SLIP',
      `"${t.payerOrPayee.replace(/"/g, '""')}"`,
      `"${t.dateTime}"`,
      `"${t.category}"`,
      `"${t.paymentMode}"`,
      `"${t.deviceReference}"`,
      Math.round(t.grossAmount),
      t.type === 'withdrawal' ? 0 : Math.round(t.taxAmount),
      t.type === 'withdrawal' ? Math.round(t.taxAmount) : 0,
      Math.round(t.netAmount),
      t.status,
    ]);

    const csvString = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'PoliticsWorld_India_Treasury_INR_2026-27.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setCsvExported(true);
    setTimeout(() => setCsvExported(false), 2500);
  };

  const handleCopyTaxSummary = () => {
    const summaryText = `POLITICS WORLD INDIA MEDIA DESK - TREASURY & GST COMPLIANCE SUMMARY (INR)
SAC Code: 998363 (National Digital Advertising & Sponsored Editorial)
Financial Year: 2026-27 | GSTIN: 07AAACP9921D1Z8
Total Gross Inflow: ${formatPrice(totalGrossRevenue)}
Total India GST Output Pool (18%): ${formatPrice(totalGstReserve)}
Total TDS Reserve (Sec 194J): ${formatPrice(totalTdsReserve)}
Total Compliance Tax Pool: ${formatPrice(totalTaxAndGstPool)}
Electronic Bank Settlements (RTGS/NEFT): ${formatPrice(totalWithdrawn)}
Net Available Treasury Balance: ${formatPrice(availableBalance)}
Certified 100% Digital INR Audit Trail (Section 269ST Compliant).`;

    navigator.clipboard.writeText(summaryText);
    setTaxReportCopied(true);
    setTimeout(() => setTaxReportCopied(false), 2500);
  };

  const maskedBankAcc =
    bankAccount.accountNumber.length > 4
      ? `•••• ${bankAccount.accountNumber.slice(-4)}`
      : bankAccount.accountNumber;

  const hasActiveFilters =
    searchTxnQuery.trim() !== '' ||
    dateFilter !== 'all' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all';

  return (
    <div className="space-y-5 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800/80 self-start">
          <button
            type="button"
            onClick={() => {
              setMainView('revenue');
              setTypeFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              mainView === 'revenue'
                ? 'bg-white dark:bg-[#0d172c] text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isHi ? 'रेवेन्यू' : 'Revenue'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMainView('wallet');
              setTypeFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              mainView === 'wallet'
                ? 'bg-white dark:bg-[#0d172c] text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isHi ? 'ट्रेज़री व भारतीय बैंक' : 'India Treasury'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMainView('all');
              setTypeFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              mainView === 'all'
                ? 'bg-white dark:bg-[#0d172c] text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isHi ? 'पूर्ण लेज़र' : 'Full Ledger'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenBankModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{isHi ? 'सेटलमेंट बैंक' : 'Settlement Bank'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTaxReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{isHi ? 'GST स्टेटमेंट' : 'GST Statement'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadTaxCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            {csvExported ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>{csvExported ? (isHi ? 'CSV डाउनलोड हुआ' : 'CSV Exported') : isHi ? 'CSV एक्सपोर्ट' : 'Export CSV'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setWithdrawErrorMsg(null);
              setWithdrawSuccessMsg(null);
              setWithdrawAmount(Math.min(10000, availableBalance || 10000));
              setIsWithdrawModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{isHi ? 'बैंक में ट्रांसफर' : 'Disburse INR'}</span>
          </button>
        </div>
      </div>

      {bankSuccessBanner && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{bankSuccessBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setBankSuccessBanner(null)}
            className="p-1 text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dual Primary Cards: Total Revenue & Global Treasury */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            setMainView('revenue');
            setTypeFilter('all');
          }}
          className={`p-5 rounded-xl text-left transition-all cursor-pointer border bg-white dark:bg-[#0d172c] ${
            mainView === 'revenue'
              ? 'border-slate-900 dark:border-amber-400/60 ring-1 ring-slate-900/10 dark:ring-amber-400/15 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{isHi ? 'कुल संपादकीय कमाई' : 'Total Editorial Revenue'}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {revenueTransactions.length} {isHi ? 'एंट्री' : 'credits'} · INR ₹
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white font-mono tabular-nums">
            {formatPrice(totalNetRevenueReceived)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            {isHi ? 'राष्ट्रीय ब्रांड स्पॉन्सरशिप व प्रायोजित संपादकीय (INR)' : 'Direct national sponsorships & sponsored editorial (INR)'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setMainView('wallet');
            setTypeFilter('all');
          }}
          className={`p-5 rounded-xl text-left transition-all cursor-pointer border bg-white dark:bg-[#0d172c] ${
            mainView === 'wallet'
              ? 'border-slate-900 dark:border-amber-400/60 ring-1 ring-slate-900/10 dark:ring-amber-400/15 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isHi ? 'उपलब्ध नेट ट्रेज़री (INR)' : 'Net Available Treasury (INR)'}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
              {bankAccount.bankName.split(' ')[0]} · {maskedBankAcc}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            {formatPrice(availableBalance)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            {isHi
              ? `${formatPrice(totalWithdrawn)} भारतीय बैंक में सेटल हो चुके`
              : `${formatPrice(totalWithdrawn)} settled to linked Indian bank`}
          </p>
        </button>
      </div>

      {/* 4-Column Metric Breakdown */}
      {mainView === 'wallet' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isHi ? 'निकासी योग्य शेष राशि' : 'Ready for Disbursal'}
            </div>
            <div className="text-lg font-bold text-slate-950 dark:text-white font-mono tabular-nums mt-1">
              {formatPrice(availableBalance)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isHi ? 'कुल बैंक सेटलमेंट' : 'Total Disbursed'}
            </div>
            <div className="text-lg font-bold text-slate-950 dark:text-white font-mono tabular-nums mt-1">
              {formatPrice(totalWithdrawn)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isHi ? 'TDS रिज़र्व (Sec 194J)' : 'TDS Compliance Reserve'}
            </div>
            <div className="text-lg font-bold text-slate-950 dark:text-white font-mono tabular-nums mt-1">
              {formatPrice(totalTdsReserve)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {isHi ? 'लिंक्ड भारतीय बैंक' : 'Linked Indian Bank'}
              </div>
              <div className="text-sm font-semibold text-slate-950 dark:text-white truncate mt-1">
                {bankAccount.bankName}
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                {bankAccount.ifscCode}
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenBankModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Edit Bank Account"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isHi ? 'डायरेक्ट स्पॉन्सरशिप' : 'Direct Sponsorships'}
            </div>
            <div className="text-lg font-bold text-slate-950 dark:text-white font-mono tabular-nums mt-1">
              {formatPrice(totalIncomeDirect)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isHi ? 'प्रायोजित प्रेस एवं मीडिया' : 'Sponsored Press'}
            </div>
            <div className="text-lg font-bold text-slate-950 dark:text-white font-mono tabular-nums mt-1">
              {formatPrice(totalIncomeArticles)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isHi ? 'प्रक्रियाधीन क्लियरिंग' : 'Pending Settlement'}
            </div>
            <div className="text-lg font-bold text-slate-950 dark:text-white font-mono tabular-nums mt-1">
              {formatPrice(totalPendingRevenue)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isHi ? 'भारत GST रिज़र्व (18%)' : 'India GST Pool (18%)'}
            </div>
            <div className="text-lg font-bold text-slate-950 dark:text-white font-mono tabular-nums mt-1">
              {formatPrice(totalGstReserve)}
            </div>
          </div>
        </div>
      )}

      {/* Quick Cross-Navigation Strip for Revenue */}
      {mainView === 'revenue' && (onGoToInvoiceTab || onGoToRateCardTab) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {isHi ? 'नया भारत GST टैक्स इनवॉइस जारी करें या राष्ट्रीय मीडिया दरें देखें' : 'Issue an India GST tax invoice or browse national INR media rates'}
          </span>
          <div className="flex items-center gap-3">
            {onGoToRateCardTab && (
              <button
                type="button"
                onClick={onGoToRateCardTab}
                className="font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
              >
                {isHi ? 'राष्ट्रीय विज्ञापन दरें' : 'India Ad Rates'}
              </button>
            )}
            {onGoToInvoiceTab && (
              <button
                type="button"
                onClick={onGoToInvoiceTab}
                className="font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 cursor-pointer"
              >
                {isHi ? '+ नया GST इनवॉइस' : '+ New GST Invoice'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter Bar & Ledger Table */}
      <div className="rounded-xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 bg-slate-50/50 dark:bg-[#111d36]/60">
          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTxnQuery}
              onChange={(e) => setSearchTxnQuery(e.target.value)}
              placeholder={isHi ? 'UTR, ID या क्लाइंट खोजें...' : 'Search by ID, UTR, or payer...'}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
              className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 cursor-pointer"
            >
              <option value="all">{isHi ? 'सभी तारीखें' : 'All Dates'}</option>
              <option value="today">{isHi ? 'आज' : 'Today'}</option>
              <option value="7days">{isHi ? 'पिछले 7 दिन' : 'Last 7 Days'}</option>
              <option value="30days">{isHi ? 'पिछले 30 दिन' : 'Last 30 Days'}</option>
              <option value="custom">{isHi ? 'कस्टम तारीख' : 'Custom Range'}</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
              className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 cursor-pointer"
            >
              <option value="all">{isHi ? 'सभी स्रोत' : 'All Streams'}</option>
              <option value="direct-sponsor">Direct Sponsor</option>
              <option value="sponsored-article">Sponsored Article</option>
              <option value="multimedia-feature">Multimedia Dossier</option>
              <option value="withdrawal">Bank Payout</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 cursor-pointer"
            >
              <option value="all">{isHi ? 'सभी स्टेटस' : 'All Status'}</option>
              <option value="success">{isHi ? 'सफल' : 'Settled'}</option>
              <option value="pending">{isHi ? 'लंबित' : 'Pending'}</option>
              <option value="failed">{isHi ? 'विफल' : 'Failed'}</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isHi ? 'रीसेट' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>

        {dateFilter === 'custom' && (
          <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111d36] flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span>{isHi ? 'से:' : 'From:'}</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 text-xs font-mono"
              />
            </label>
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span>{isHi ? 'तक:' : 'To:'}</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 text-xs font-mono"
              />
            </label>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#111d36]/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">{isHi ? 'विवरण' : 'Transaction'}</th>
                <th className="py-3 px-4">{isHi ? 'रेफरेंस और तारीख' : 'Reference & Date'}</th>
                <th className="py-3 px-4">{isHi ? 'स्रोत' : 'Stream'}</th>
                <th className="py-3 px-4 text-right">{isHi ? 'राशि' : 'Amount'}</th>
                <th className="py-3 px-4">{isHi ? 'स्टेटस' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{isHi ? 'रसीद' : 'Receipt'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-slate-400">
                    {isHi ? 'कोई ट्रांज़ैक्शन नहीं मिला।' : 'No matching transactions found.'}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const meta = getStreamMeta(txn.type);
                  const isNegative = txn.netAmount < 0;
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 max-w-[260px]">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{txn.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{txn.payerOrPayee}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-[11px] text-slate-800 dark:text-slate-200">{txn.id}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{txn.dateTime}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className={`font-medium ${meta.textColor}`}>
                          {meta.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{txn.paymentMode.split(' ')[0]}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className={`font-mono font-bold tabular-nums text-sm ${
                            isNegative ? 'text-slate-900 dark:text-slate-100' : 'text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {isNegative ? '-' : '+'}
                          {formatPrice(Math.abs(txn.netAmount))}
                        </div>
                        {txn.taxAmount > 0 && (
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                            {txn.type === 'withdrawal' ? 'TDS Reserve' : 'GST'}: {formatPrice(txn.taxAmount)}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {txn.status === 'success' && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isHi ? 'सफल' : 'Settled'}</span>
                          </span>
                        )}
                        {txn.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{isHi ? 'प्रक्रिया में' : 'Pending'}</span>
                          </span>
                        )}
                        {txn.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{isHi ? 'विफल' : 'Failed'}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setViewingTransaction(txn)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#081020] text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white font-medium transition-colors cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{isHi ? 'स्लिप' : 'Slip'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              {isHi ? 'कोई ट्रांज़ैक्शन नहीं मिला।' : 'No matching transactions found.'}
            </div>
          ) : (
            filteredTransactions.map((txn) => {
              const meta = getStreamMeta(txn.type);
              const isNegative = txn.netAmount < 0;
              return (
                <div key={txn.id} className="p-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">{txn.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{txn.payerOrPayee}</div>
                    </div>
                    <div
                      className={`font-mono font-bold tabular-nums text-sm shrink-0 ${
                        isNegative ? 'text-slate-900 dark:text-slate-100' : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {isNegative ? '-' : '+'}
                      {formatPrice(Math.abs(txn.netAmount))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`truncate font-medium ${meta.textColor}`}>{meta.name}</span>
                      <span>·</span>
                      <span className="font-mono shrink-0">{txn.dateIso}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingTransaction(txn)}
                      className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-700 dark:text-slate-200 font-medium shrink-0 cursor-pointer"
                    >
                      {isHi ? 'स्लिप' : 'Slip'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ====================================================================
          SUB-MODAL 1: WITHDRAW FUNDS TO LINKED BANK
      ==================================================================== */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[100001] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Landmark className="w-4 h-4 text-slate-900 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  {isHi ? 'बैंक खाते में निकासी (Withdraw)' : 'Withdraw to Bank Account'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="p-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {isHi ? 'उपलब्ध ट्रेज़री बैलेंस' : 'Available Treasury Balance'}
                  </div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {formatPrice(availableBalance)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">{withdrawBankName}</div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{withdrawAccountNo} · {withdrawIfsc}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isHi ? 'राशि (INR ₹)' : 'Amount (INR ₹)'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWithdrawAmount(Math.min(amt, availableBalance))}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-200 cursor-pointer"
                      >
                        {formatPrice(amt)}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(availableBalance)}
                      className="px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-[11px] font-mono cursor-pointer"
                    >
                      Max
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  min={1}
                  max={availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono font-bold text-base text-slate-950 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-amber-400/70 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isHi ? 'भारतीय ट्रांसफर माध्यम (Sec 269ST)' : 'Indian Bank Rail (Sec 269ST)'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'RTGS Bank Settlement', label: 'RTGS' },
                      { id: 'NEFT Electronic Transfer', label: 'NEFT' },
                      { id: 'IMPS Instant Electronic', label: 'IMPS' },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setWithdrawMode(mode.id)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        withdrawMode === mode.id
                          ? 'bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 border-slate-950 dark:border-slate-100'
                          : 'bg-white dark:bg-[#081020] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={withdrawTdsDeduction}
                    onChange={(e) => setWithdrawTdsDeduction(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-slate-950 dark:accent-amber-400"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {isHi ? '1% TDS (Sec 194J) रिज़र्व काटें' : 'Allocate 1% TDS Reserve (Sec 194J)'}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                  -{formatPrice(withdrawTdsDeduction ? Math.round(withdrawAmount * 0.01) : 0)}
                </span>
              </label>

              {withdrawErrorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{withdrawErrorMsg}</span>
                </div>
              )}

              {withdrawSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{withdrawSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isHi ? 'निकासी कन्फर्म करें' : 'Confirm Withdrawal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-MODAL 2: INDIAN BANK ACCOUNT SETUP (IFSC VERIFIED)
      ==================================================================== */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-[100001] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-slate-900 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  {isHi ? 'भारतीय बैंक खाता सेटअप' : 'Linked Indian Bank Account'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBankAccount} className="p-5 space-y-3.5 overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'खाताधारक का नाम' : 'Account Holder Name'}
                </label>
                <input
                  type="text"
                  value={formHolder}
                  onChange={(e) => setFormHolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-amber-400/70"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'भारतीय बैंक चुनें' : 'Indian Bank'}
                  </label>
                  <select
                    value={formBankName}
                    onChange={(e) => setFormBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-white dark:bg-[#081020] focus:outline-none focus:border-slate-900 dark:focus:border-amber-400/70"
                  >
                    {POPULAR_INDIAN_BANKS.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'खाते का प्रकार' : 'Account Type'}
                  </label>
                  <select
                    value={formType}
                    onChange={(e) =>
                      setFormType(e.target.value as 'Current Account' | 'Savings Account')
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-white dark:bg-[#081020] focus:outline-none focus:border-slate-900 dark:focus:border-amber-400/70"
                  >
                    <option value="Current Account">Current Account</option>
                    <option value="Savings Account">Savings Account</option>
                  </select>
                </div>
              </div>

              {formBankName === 'Other Indian Bank' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'अन्य भारतीय बैंक का नाम' : 'Custom Indian Bank Name'}
                  </label>
                  <input
                    type="text"
                    value={formOtherBankName}
                    onChange={(e) => setFormOtherBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-amber-400/70"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'खाता संख्या (9-18 अंक)' : 'Bank Account Number (9-18 digits)'}
                  </label>
                  <input
                    type="text"
                    value={formAccNo}
                    onChange={(e) => setFormAccNo(e.target.value.replace(/\D/g, ''))}
                    maxLength={18}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-amber-400/70"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'खाता संख्या पुष्टि' : 'Confirm Account Number'}
                  </label>
                  <input
                    type="text"
                    value={formConfirmAccNo}
                    onChange={(e) => setFormConfirmAccNo(e.target.value.replace(/\D/g, ''))}
                    maxLength={18}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-amber-400/70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Indian IFSC Code (11-Char)
                  </label>
                  <input
                    type="text"
                    value={formIfsc}
                    onChange={(e) => setFormIfsc(e.target.value.toUpperCase())}
                    maxLength={11}
                    placeholder="HDFC0000003 / SBIN0000691"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono uppercase text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-amber-400/70"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'बिज़नेस UPI ID (वैकल्पिक)' : 'Business UPI ID (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={formUpi}
                    onChange={(e) => setFormUpi(e.target.value)}
                    placeholder="politicsworld@hdfcbank"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081020] font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-amber-400/70"
                  />
                </div>
              </div>

              {bankFormError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bankFormError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isHi ? 'बैंक सेव करें' : 'Save Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-MODAL 3: TRANSACTION ADVICE SLIP / RECEIPT
      ==================================================================== */}
      {viewingTransaction && (
        <div className="fixed inset-0 z-[100001] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-900 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  {isHi ? 'इलेक्ट्रॉनिक ट्रांज़ैक्शन रसीद' : 'Electronic Payment Advice'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingTransaction(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{isHi ? 'राशि' : 'Net Amount'}</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                    {viewingTransaction.netAmount < 0 ? '-' : '+'}
                    {formatPrice(Math.abs(viewingTransaction.netAmount))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyTxnId(viewingTransaction.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#081020] border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 font-mono text-[11px] text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {copiedTxnId === viewingTransaction.id ? (
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  )}
                  <span>{viewingTransaction.id}</span>
                </button>
              </div>

              <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/80">
                <div className="flex justify-between gap-4 pt-1">
                  <span className="text-slate-500 dark:text-slate-400">{isHi ? 'शीर्षक' : 'Description'}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">{viewingTransaction.title}</span>
                </div>
                <div className="flex justify-between gap-4 pt-2.5">
                  <span className="text-slate-500 dark:text-slate-400">{isHi ? 'पार्टी' : 'Counterparty'}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-right">{viewingTransaction.payerOrPayee}</span>
                </div>
                <div className="flex justify-between gap-4 pt-2.5">
                  <span className="text-slate-500 dark:text-slate-400">{isHi ? 'माध्यम' : 'Payment Rail'}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-right">{viewingTransaction.paymentMode}</span>
                </div>
                <div className="flex justify-between gap-4 pt-2.5">
                  <span className="text-slate-500 dark:text-slate-400">{isHi ? 'इनवॉइस / रेफ' : 'Invoice / Ref'}</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-right">
                    {viewingTransaction.invoiceNumber || viewingTransaction.id}
                  </span>
                </div>
                <div className="flex justify-between gap-4 pt-2.5">
                  <span className="text-slate-500 dark:text-slate-400">{isHi ? 'UTR / डिवाइस कोड' : 'UTR Reference'}</span>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 text-right break-all">
                    {viewingTransaction.deviceReference}
                  </span>
                </div>
                <div className="flex justify-between gap-4 pt-2.5">
                  <span className="text-slate-500 dark:text-slate-400">{isHi ? 'तारीख' : 'Timestamp'}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200 text-right">{viewingTransaction.dateTime}</span>
                </div>
              </div>

              {viewingTransaction.notes && (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111d36] text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {viewingTransaction.notes}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    downloadTransactionSlipPdf({
                      id: viewingTransaction.id,
                      invoiceNumber: viewingTransaction.invoiceNumber,
                      title: viewingTransaction.title,
                      payerOrPayee: viewingTransaction.payerOrPayee,
                      paymentMode: viewingTransaction.paymentMode,
                      deviceReference: viewingTransaction.deviceReference,
                      dateTime: viewingTransaction.dateTime,
                      category: viewingTransaction.category,
                      status: viewingTransaction.status,
                      signedNetFormatted: `${viewingTransaction.netAmount < 0 ? '-' : '+'}${formatPrice(Math.abs(viewingTransaction.netAmount))}`,
                      taxFormatted: formatPrice(viewingTransaction.taxAmount),
                      notes: viewingTransaction.notes,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isHi ? 'PDF डाउनलोड' : 'Download PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    printTransactionSlipDocument({
                      id: viewingTransaction.id,
                      invoiceNumber: viewingTransaction.invoiceNumber,
                      title: viewingTransaction.title,
                      payerOrPayee: viewingTransaction.payerOrPayee,
                      paymentMode: viewingTransaction.paymentMode,
                      deviceReference: viewingTransaction.deviceReference,
                      dateTime: viewingTransaction.dateTime,
                      category: viewingTransaction.category,
                      status: viewingTransaction.status,
                      signedNetFormatted: `${viewingTransaction.netAmount < 0 ? '-' : '+'}${formatPrice(Math.abs(viewingTransaction.netAmount))}`,
                      taxFormatted: formatPrice(viewingTransaction.taxAmount),
                      notes: viewingTransaction.notes,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isHi ? 'प्रिंट' : 'Print'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingTransaction(null)}
                  className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 font-semibold cursor-pointer"
                >
                  {isHi ? 'बंद करें' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-MODAL 4: GOVT TAX STATEMENT (INDIA GST SAC 998363 & TDS)
      ==================================================================== */}
      {isTaxReportModalOpen && (
        <div className="fixed inset-0 z-[100001] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-t-2xl sm:rounded-2xl bg-white dark:bg-[#0d172c] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-900 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  {isHi ? 'भारत सरकारी GST एवं TDS स्टेटमेंट (SAC 998363)' : 'India GST & TDS Compliance Summary'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTaxReportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{isHi ? 'कुल सकल आय (INR)' : 'Gross Inflow (INR)'}</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                    {formatPrice(totalGrossRevenue)}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{isHi ? 'भारत GST (18%)' : 'India GST Output (18%)'}</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                    {formatPrice(totalGstReserve)}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{isHi ? 'TDS रिज़र्व' : 'TDS Reserve (Sec 194J)'}</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                    {formatPrice(totalTdsReserve)}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/60">
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    {isHi ? 'कुल टैक्स फंड' : 'Total Tax Pool'}
                  </div>
                  <div className="text-lg font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-300 mt-0.5">
                    {formatPrice(totalTaxAndGstPool)}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111d36] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">GSTIN: 07AAACP9921D1Z8</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    FY 2026-27 · Section 269ST Electronic INR Audit Trail
                  </div>
                </div>
                <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">SAC 998363</span>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyTaxSummary}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {taxReportCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  )}
                  <span>{taxReportCopied ? (isHi ? 'कॉपी हो गया' : 'Copied') : isHi ? 'सारांश कॉपी' : 'Copy Summary'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTaxCsv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{isHi ? 'CSV डाउनलोड' : 'Export CSV'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadTaxCompliancePdf({
                      fxCode: 'INR',
                      grossInflow: formatPrice(totalGrossRevenue),
                      gstReserve: formatPrice(totalGstReserve),
                      withholdingReserve: formatPrice(totalTdsReserve),
                      totalTaxPool: formatPrice(totalTaxAndGstPool),
                      totalWithdrawn: formatPrice(totalWithdrawn),
                      availableBalance: formatPrice(availableBalance),
                      bankSummary: `${bankAccount.bankName} (${maskedBankAcc} · ${bankAccount.ifscCode})`,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isHi ? 'PDF डाउनलोड' : 'Download PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    printTaxComplianceDocument({
                      fxCode: 'INR',
                      grossInflow: formatPrice(totalGrossRevenue),
                      gstReserve: formatPrice(totalGstReserve),
                      withholdingReserve: formatPrice(totalTdsReserve),
                      totalTaxPool: formatPrice(totalTaxAndGstPool),
                      totalWithdrawn: formatPrice(totalWithdrawn),
                      availableBalance: formatPrice(availableBalance),
                      bankSummary: `${bankAccount.bankName} (${maskedBankAcc} · ${bankAccount.ifscCode})`,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isHi ? 'प्रिंट' : 'Print'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
