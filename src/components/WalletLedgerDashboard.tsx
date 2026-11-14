import React, { useState, useMemo, useEffect } from 'react';
import {
  Wallet,
  Search,
  Filter,
  Calendar,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Receipt,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  AlertCircle,
  Send,
  TrendingUp,
  ArrowRight,
  Landmark,
  Edit3,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank (PNB)',
  'Bank of Baroda (BOB)',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'Bank of India',
  'Central Bank of India',
  'IDBI Bank',
  'Yes Bank',
  'Indian Bank',
  'Federal Bank',
  'Other / अन्य बैंक',
];

export interface WalletTransaction {
  id: string;
  type: 'adsense' | 'direct-sponsor' | 'sponsored-article' | 'multimedia-feature' | 'withdrawal';
  title: string;
  payerOrPayee: string;
  dateTime: string;
  dateIso: string;
  category: string;
  paymentMode:
    | 'Google Direct Wire (EFT)'
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
    id: 'TXN-ADS-2026-8921',
    type: 'adsense',
    title: 'Google AdSense Monthly Revenue Disbursal',
    payerOrPayee: 'Google Asia Pacific Pte. Ltd. (Automated Wire)',
    dateTime: '26 Oct 2026, 11:45 IST',
    dateIso: '2026-10-26',
    category: 'Google AdSense EFT Automated Payout',
    paymentMode: 'Google Direct Wire (EFT)',
    deviceReference: 'E-DEVICE-REF: CITIBANK-EFT/GS-891040',
    grossAmount: 18720,
    taxAmount: 0,
    netAmount: 18720,
    status: 'success',
    invoiceNumber: 'ADS-EFT/2026-10/771',
    notes: 'Cross-border digital remittance via electronic wire with FIRC certificate.',
  },
  {
    id: 'TXN-ADS-2026-8802',
    type: 'adsense',
    title: 'Google AdSense Monthly Revenue Disbursal',
    payerOrPayee: 'Google Asia Pacific Pte. Ltd. (Automated Wire)',
    dateTime: '26 Sep 2026, 10:15 IST',
    dateIso: '2026-09-26',
    category: 'Google AdSense EFT Automated Payout',
    paymentMode: 'Google Direct Wire (EFT)',
    deviceReference: 'E-DEVICE-REF: CITIBANK-EFT/GS-772190',
    grossAmount: 16450,
    taxAmount: 0,
    netAmount: 16450,
    status: 'success',
    invoiceNumber: 'ADS-EFT/2026-09/612',
    notes: 'Cross-border digital remittance via electronic wire with FIRC certificate.',
  },
  {
    id: 'TXN-DIR-2026-4412',
    type: 'direct-sponsor',
    title: 'Top Header Broadview Banner (30 Days Placement)',
    payerOrPayee: 'Global Trade & Strategic Forum Ltd',
    dateTime: '01 Nov 2026, 16:20 IST',
    dateIso: '2026-11-01',
    category: 'SAC 998363 - Internet Advertising Space',
    paymentMode: 'RTGS Bank Settlement',
    deviceReference: 'E-DEVICE-REF: RTGS-UTR/HDFC2630591240',
    grossAmount: 25000,
    taxAmount: 4500,
    netAmount: 29500,
    status: 'success',
    invoiceNumber: 'PW/TAX-INV/2026-27/101',
    notes: 'Direct institutional billboard booking. 100% pre-paid via electronic RTGS.',
  },
  {
    id: 'TXN-ART-2026-3105',
    type: 'sponsored-article',
    title: 'प्रायोजित आलेख (Full Text & Lead Photo)',
    payerOrPayee: 'Diplomatic Horizon Media & Research LLC',
    dateTime: '04 Nov 2026, 09:15 IST',
    dateIso: '2026-11-04',
    category: 'SAC 998363 - Sponsored Article Publishing',
    paymentMode: 'NEFT Electronic Transfer',
    deviceReference: 'E-DEVICE-REF: NEFT-UTR/SBIN4491028301',
    grossAmount: 8000,
    taxAmount: 1440,
    netAmount: 9440,
    status: 'success',
    invoiceNumber: 'PW/TAX-INV/2026-27/102',
    notes: 'Editorial review approved by publisher. Submitter assumes 100% copyright liability.',
  },
  {
    id: 'WDR-BNK-2026-0914',
    type: 'withdrawal',
    title: 'Electronic Disbursal to Linked Bank Account',
    payerOrPayee: 'State Bank of India (A/C •••• 9182) - Publisher Entity',
    dateTime: '05 Nov 2026, 12:10 IST',
    dateIso: '2026-11-05',
    category: 'Bank Electronic Settlement (NEFT)',
    paymentMode: 'NEFT Electronic Transfer',
    deviceReference: 'E-DEVICE-REF: DISBURSAL-NEFT/PW9021841',
    grossAmount: 20000,
    taxAmount: 200,
    netAmount: -20000,
    status: 'success',
    invoiceNumber: 'PW/WDR-ADV/2026-27/001',
    notes: 'Funds disbursed to official SBI current account for operating reserves & tax advance.',
  },
  {
    id: 'WDR-BNK-2026-0882',
    type: 'withdrawal',
    title: 'Electronic Settlement to Linked Bank Account',
    payerOrPayee: 'State Bank of India (A/C •••• 9182) - Publisher Entity',
    dateTime: '15 Oct 2026, 15:40 IST',
    dateIso: '2026-10-15',
    category: 'Bank Electronic Settlement (RTGS)',
    paymentMode: 'RTGS Bank Settlement',
    deviceReference: 'E-DEVICE-REF: DISBURSAL-RTGS/PW8812902',
    grossAmount: 15000,
    taxAmount: 150,
    netAmount: -15000,
    status: 'success',
    invoiceNumber: 'PW/WDR-ADV/2026-27/002',
    notes: 'Electronic treasury disbursal via RTGS to linked SBI commercial current account.',
  },
  {
    id: 'TXN-MMF-2026-7281',
    type: 'multimedia-feature',
    title: 'मल्टीमीडिया फीचर (Text + Photo + Video + AI Voice)',
    payerOrPayee: 'Indo-Pacific Strategic Review Council',
    dateTime: '07 Nov 2026, 18:40 IST',
    dateIso: '2026-11-07',
    category: 'SAC 998363 - Multimedia Dossier Distribution',
    paymentMode: 'Commercial UPI Business',
    deviceReference: 'E-DEVICE-REF: UPI-REF/981240185901@icici',
    grossAmount: 15000,
    taxAmount: 2700,
    netAmount: 17700,
    status: 'success',
    invoiceNumber: 'PW/TAX-INV/2026-27/103',
    notes: 'Full multimedia publication with audio narration. Client indemnity confirmed.',
  },
  {
    id: 'TXN-DIR-2026-5590',
    type: 'direct-sponsor',
    title: 'Sponsored Wire Press Release & Archival Syndication',
    payerOrPayee: 'Apex Geopolitical Energy Analytics',
    dateTime: '09 Nov 2026, 10:30 IST',
    dateIso: '2026-11-09',
    category: 'SAC 998363 - Sponsored Wire Syndication',
    paymentMode: 'NEFT Electronic Transfer',
    deviceReference: 'E-DEVICE-REF: NEFT-UTR/ICIC8810294103',
    grossAmount: 8000,
    taxAmount: 1440,
    netAmount: 9440,
    status: 'pending',
    invoiceNumber: 'PW/TAX-INV/2026-27/104',
    notes: 'NEFT clearing confirmation awaited from reserve bank gateway.',
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

  const [mainView, setMainView] = useState<'revenue' | 'wallet' | 'all'>(defaultView);

  useEffect(() => {
    if (defaultView) {
      setMainView(defaultView);
    }
  }, [defaultView]);

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('politics_world_wallet_ledger');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_TRANSACTIONS;
  });

  const saveTransactions = (newTxns: WalletTransaction[]) => {
    setTransactions(newTxns);
    try {
      localStorage.setItem('politics_world_wallet_ledger', JSON.stringify(newTxns));
    } catch {
      // ignore
    }
  };

  const [searchTxnQuery, setSearchTxnQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'adsense' | 'direct-sponsor' | 'sponsored-article' | 'multimedia-feature' | 'withdrawal'
  >('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const [bankAccount, setBankAccount] = useState<LinkedBankAccount>(() => {
    try {
      const saved = localStorage.getItem('politics_world_bank_account');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      bankName: 'State Bank of India (SBI)',
      accountNumber: '918234567890',
      ifscCode: 'SBIN0000691',
      holderName: 'Politics World Media Operations',
      accountType: 'Current Account',
      upiId: 'vrai74918@sbi',
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
  const [formType, setFormType] = useState<'Current Account' | 'Savings Account'>(bankAccount.accountType);
  const [formUpi, setFormUpi] = useState(bankAccount.upiId || '');
  const [bankFormError, setBankFormError] = useState<string | null>(null);
  const [bankSuccessBanner, setBankSuccessBanner] = useState<string | null>(null);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(10000);
  const [withdrawBankName, setWithdrawBankName] = useState(bankAccount.bankName);
  const [withdrawAccountNo, setWithdrawAccountNo] = useState(
    bankAccount.accountNumber.length > 4
      ? `•••• •••• •••• ${bankAccount.accountNumber.slice(-4)}`
      : bankAccount.accountNumber
  );
  const [withdrawIfsc, setWithdrawIfsc] = useState(bankAccount.ifscCode);
  const [withdrawHolderName, setWithdrawHolderName] = useState(bankAccount.holderName);
  const [withdrawMode, setWithdrawMode] = useState<
    'NEFT Electronic Transfer' | 'RTGS Bank Settlement' | 'IMPS Instant Electronic'
  >('NEFT Electronic Transfer');
  const [withdrawTdsDeduction, setWithdrawTdsDeduction] = useState(true);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState<string | null>(null);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  const handleOpenBankModal = () => {
    const isStandard = POPULAR_INDIAN_BANKS.includes(bankAccount.bankName);
    setFormBankName(isStandard ? bankAccount.bankName : 'Other / अन्य बैंक');
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
    const cleanBank = (formBankName === 'Other / अन्य बैंक' ? formOtherBankName : formBankName).trim();
    const cleanAccNo = formAccNo.replace(/\s+/g, '');
    const cleanConfirm = formConfirmAccNo.replace(/\s+/g, '');
    const cleanIfsc = formIfsc.trim().toUpperCase();

    if (!cleanHolder) {
      setBankFormError('कृपया बैंक खाताधारक का पूरा नाम दर्ज करें।');
      return;
    }
    if (!cleanBank) {
      setBankFormError('कृपया बैंक का नाम चुनें या दर्ज करें।');
      return;
    }
    if (!/^\d{9,18}$/.test(cleanAccNo)) {
      setBankFormError('बैंक खाता संख्या 9 से 18 अंकों की होनी चाहिए (केवल अंक)।');
      return;
    }
    if (cleanAccNo !== cleanConfirm) {
      setBankFormError('खाता संख्या और पुष्टि खाता संख्या (Confirm Account Number) आपस में मेल नहीं खा रहे हैं।');
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      setBankFormError('अमान्य IFSC कोड! सही प्रारूप: 4 अक्षर + 0 + 6 अंक/अक्षर (उदा: SBIN0000691, HDFC0001234)।');
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
      localStorage.setItem('politics_world_bank_account', JSON.stringify(updatedAccount));
    } catch {
      // ignore
    }

    setBankAccount(updatedAccount);
    setWithdrawBankName(updatedAccount.bankName);
    setWithdrawAccountNo(
      updatedAccount.accountNumber.length > 4
        ? `•••• •••• •••• ${updatedAccount.accountNumber.slice(-4)}`
        : updatedAccount.accountNumber
    );
    setWithdrawIfsc(updatedAccount.ifscCode);
    setWithdrawHolderName(updatedAccount.holderName);
    setIsBankModalOpen(false);
    setBankSuccessBanner(
      langCode === 'hi'
        ? `बैंक खाता (${cleanBank} - •••• ${cleanAccNo.slice(-4)}) सफलतापूर्वक लिंक व सुरक्षित हो गया!`
        : `Bank account (${cleanBank} - •••• ${cleanAccNo.slice(-4)}) successfully linked & verified!`
    );
    setTimeout(() => setBankSuccessBanner(null), 5000);
  };

  const [viewingTransaction, setViewingTransaction] = useState<WalletTransaction | null>(null);
  const [copiedTxnId, setCopiedTxnId] = useState<string | null>(null);
  const [isTaxReportModalOpen, setIsTaxReportModalOpen] = useState(false);
  const [taxReportCopied, setTaxReportCopied] = useState(false);

  const revenueTransactions = useMemo(() => {
    return transactions.filter((t) => t.type !== 'withdrawal');
  }, [transactions]);

  const walletTransactions = useMemo(() => {
    return transactions.filter((t) => t.type === 'withdrawal');
  }, [transactions]);

  const totalIncomeAdSense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'adsense' && t.status === 'success')
      .reduce((sum, t) => sum + t.netAmount, 0);
  }, [transactions]);

  const totalIncomeDirect = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'direct-sponsor' && t.status === 'success')
      .reduce((sum, t) => sum + t.netAmount, 0);
  }, [transactions]);

  const totalIncomeArticles = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          (t.type === 'sponsored-article' || t.type === 'multimedia-feature') &&
          t.status === 'success'
      )
      .reduce((sum, t) => sum + t.netAmount, 0);
  }, [transactions]);

  const totalGrossRevenue = useMemo(() => {
    return revenueTransactions.reduce((sum, t) => sum + t.grossAmount, 0);
  }, [revenueTransactions]);

  const totalNetRevenueReceived = useMemo(() => {
    return revenueTransactions
      .filter((t) => t.status === 'success')
      .reduce((sum, t) => sum + t.netAmount, 0);
  }, [revenueTransactions]);

  const totalGstReserve = useMemo(() => {
    return revenueTransactions
      .filter((t) => t.status === 'success')
      .reduce((sum, t) => sum + t.taxAmount, 0);
  }, [revenueTransactions]);

  const totalWithdrawn = useMemo(() => {
    return walletTransactions
      .filter((t) => t.status === 'success')
      .reduce((sum, t) => sum + Math.abs(t.netAmount), 0);
  }, [walletTransactions]);

  const totalTdsReserve = useMemo(() => {
    return walletTransactions.reduce((sum, t) => sum + t.taxAmount, 0);
  }, [walletTransactions]);

  const totalTaxAndGstPool = totalGstReserve + totalTdsReserve;
  const availableBalance = Math.max(0, totalNetRevenueReceived - totalWithdrawn);

  const getTxnTheme = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'adsense':
        return {
          name: 'Google AdSense',
          borderLeft: 'border-l-4 border-l-sky-500',
          badgeBg: 'bg-sky-100 text-sky-900 border border-sky-300',
          idColor: 'text-sky-700',
          amountColor: 'text-sky-700',
          hoverBg: 'hover:bg-sky-50/60',
        };
      case 'direct-sponsor':
        return {
          name: 'Direct Brand / PR',
          borderLeft: 'border-l-4 border-l-amber-500',
          badgeBg: 'bg-amber-100 text-amber-950 border border-amber-300',
          idColor: 'text-amber-700',
          amountColor: 'text-amber-700',
          hoverBg: 'hover:bg-amber-50/60',
        };
      case 'sponsored-article':
      case 'multimedia-feature':
        return {
          name: 'Sponsored Press',
          borderLeft: 'border-l-4 border-l-indigo-500',
          badgeBg: 'bg-indigo-100 text-indigo-950 border border-indigo-300',
          idColor: 'text-indigo-700',
          amountColor: 'text-indigo-700',
          hoverBg: 'hover:bg-indigo-50/60',
        };
      case 'withdrawal':
      default:
        return {
          name: 'Bank Disbursal',
          borderLeft: 'border-l-4 border-l-emerald-500',
          badgeBg: 'bg-emerald-100 text-emerald-950 border border-emerald-300',
          idColor: 'text-emerald-700',
          amountColor: 'text-emerald-700',
          hoverBg: 'hover:bg-emerald-50/60',
        };
    }
  };

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawErrorMsg(null);
    if (withdrawAmount <= 0) {
      setWithdrawErrorMsg(
        langCode === 'hi' ? 'कृपया वैध निकासी राशि दर्ज करें।' : 'Please enter a valid withdrawal amount.'
      );
      return;
    }
    if (withdrawAmount > availableBalance) {
      setWithdrawErrorMsg(
        langCode === 'hi'
          ? `अपर्याप्त बैलेंस! आपके वॉलेट में केवल ₹${availableBalance.toLocaleString('en-IN')} उपलब्ध है।`
          : `Insufficient funds! Only ₹${availableBalance.toLocaleString('en-IN')} is available in your wallet.`
      );
      return;
    }

    const calculatedTds = withdrawTdsDeduction ? Math.round(withdrawAmount * 0.01) : 0;
    const now = new Date();
    const dateIso = now.toISOString().split('T')[0];
    const timeFormatted = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const dateFormatted = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newTxnId = `WDR-BNK-2026-${randomSeq}`;
    const newInvoiceNo = `PW/WDR-ADV/2026-27/${randomSeq.toString().slice(0, 3)}`;
    const newDeviceRef = `E-DEVICE-REF: DISBURSAL-${withdrawMode.split(' ')[0].toUpperCase()}/PW${Date.now()
      .toString()
      .slice(-7)}`;

    const newWithdrawalRecord: WalletTransaction = {
      id: newTxnId,
      type: 'withdrawal',
      title: 'Electronic Disbursal to Linked Bank Account',
      payerOrPayee: `${withdrawBankName} (${withdrawAccountNo}) - ${withdrawHolderName}`,
      dateTime: `${dateFormatted}, ${timeFormatted} IST`,
      dateIso,
      category: `Bank Electronic Settlement (${withdrawMode.split(' ')[0]})`,
      paymentMode: withdrawMode,
      deviceReference: newDeviceRef,
      grossAmount: withdrawAmount,
      taxAmount: calculatedTds,
      netAmount: -withdrawAmount,
      status: 'success',
      invoiceNumber: newInvoiceNo,
      notes: `Certified 100% electronic disbursal under Section 269ST. Deducted ₹${calculatedTds} (1% TDS) for government income tax reserve pool.`,
    };

    const updatedTxns = [newWithdrawalRecord, ...transactions];
    saveTransactions(updatedTxns);

    setWithdrawSuccessMsg(
      langCode === 'hi'
        ? `₹${withdrawAmount.toLocaleString('en-IN')} का इलेक्ट्रॉनिक बैंक विथड्रॉल सफलतापूर्वक प्रोसेस हो गया है! (Ref: ${newTxnId})`
        : `Electronic withdrawal of ₹${withdrawAmount.toLocaleString('en-IN')} initiated via ${withdrawMode}! (Ref: ${newTxnId})`
    );

    setTimeout(() => {
      setWithdrawSuccessMsg(null);
      setIsWithdrawModalOpen(false);
    }, 2400);
  };

  const filteredTransactions = useMemo(() => {
    let pool: WalletTransaction[];
    if (mainView === 'revenue') {
      pool = revenueTransactions;
    } else if (mainView === 'wallet') {
      pool = walletTransactions;
    } else {
      pool = transactions;
    }

    return pool.filter((txn) => {
      if (searchTxnQuery.trim()) {
        const q = searchTxnQuery.toLowerCase();
        const matchId = txn.id.toLowerCase().includes(q);
        const matchPayer = txn.payerOrPayee.toLowerCase().includes(q);
        const matchTitle = txn.title.toLowerCase().includes(q);
        const matchRef = txn.deviceReference.toLowerCase().includes(q);
        const matchInv = (txn.invoiceNumber || '').toLowerCase().includes(q);
        if (!matchId && !matchPayer && !matchTitle && !matchRef && !matchInv) return false;
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
      'Date & Time',
      'Classification Category (SAC Code)',
      'Payment Mode (100% Non-Cash)',
      'Electronic Device Reference (UTR)',
      'Gross Inflow (INR)',
      'GST Output 18% (INR)',
      'TDS Withheld 1% (INR)',
      'Net Amount (INR)',
      'Audit Status',
    ];

    const rows = transactions.map((t) => [
      t.id,
      t.invoiceNumber || 'E-SLIP',
      `"${t.payerOrPayee.replace(/"/g, '""')}"`,
      `"${t.dateTime}"`,
      `"${t.category}"`,
      `"${t.paymentMode}"`,
      `"${t.deviceReference}"`,
      t.grossAmount,
      t.type === 'withdrawal' ? 0 : t.taxAmount,
      t.type === 'withdrawal' ? t.taxAmount : 0,
      t.netAmount,
      t.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PoliticsWorld_Govt_Tax_Ledger_SAC998363_2026-27.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyTaxSummary = () => {
    const summaryText = `POLITICS WORLD - GOVT TAX & GST RESERVE SUMMARY
SAC Code: 998363 (Internet Advertising & Sponsored Media)
Financial Year: 2026-27 | GSTIN: 07AAACP9921D1Z8
Total Gross Inflow: ₹${totalGrossRevenue.toLocaleString('en-IN')}
Total 18% GST Output Reserve Pool: ₹${totalGstReserve.toLocaleString('en-IN')} (CGST 9%: ₹${(totalGstReserve / 2).toLocaleString('en-IN')}, SGST 9%: ₹${(totalGstReserve / 2).toLocaleString('en-IN')})
Total 1% TDS Reserve Withheld: ₹${totalTdsReserve.toLocaleString('en-IN')}
Total Govt Tax Compliance Fund: ₹${totalTaxAndGstPool.toLocaleString('en-IN')}
Bank Electronic Settlements (Sec 269ST): ₹${totalWithdrawn.toLocaleString('en-IN')}
Net Available Treasury Balance: ₹${availableBalance.toLocaleString('en-IN')}
Certified 100% Non-Cash Electronic Ledger.`;

    navigator.clipboard.writeText(summaryText);
    setTaxReportCopied(true);
    setTimeout(() => setTaxReportCopied(false), 2500);
  };

  const maskedBankAcc =
    bankAccount.accountNumber.length > 4
      ? `•••• •••• ${bankAccount.accountNumber.slice(-4)}`
      : bankAccount.accountNumber;

  return (
    <div className="space-y-6 text-slate-900 font-sans bg-white">
      {/* MASTER TWO OPTIONS HEADER: [ My Revenue ] & [ My Wallet ] */}
      <div className="p-3.5 sm:p-5 rounded-sm border-2 border-slate-200 bg-slate-50 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                {langCode === 'hi'
                  ? 'मुख्य वित्तीय रिकॉर्ड्स विकल्प (CHOOSE FINANCIAL RECORD VIEW):'
                  : 'CHOOSE PRIMARY RECORD VIEW:'}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-serif font-black text-slate-900 mt-0.5">
              {langCode === 'hi'
                ? 'इन दोनों विकल्पों में आपके समस्त ऑनलाइन रिकॉर्ड्स सुरक्षित हैं'
                : 'All Financial Audit Trails are Cataloged in These 2 Dedicated Options'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenBankModal}
              className="px-3 py-1.5 text-xs font-mono rounded-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors active:scale-95"
              title="अपना बैंक खाता जोड़ें या बदलें"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{langCode === 'hi' ? 'अपना बैंक खाता जोड़ें / बदलें' : 'Bank Account Setup'}</span>
            </button>

            <button
              onClick={() => setIsTaxReportModalOpen(true)}
              className="px-3 py-1.5 text-xs font-mono rounded-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors active:scale-95"
              title="सरकार को टैक्स कैसे जाता है - प्रमाण पत्र व रिपोर्ट (PDF)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{langCode === 'hi' ? '📜 सरकारी टैक्स स्टेटमेंट (PDF)' : 'Govt Tax Statement (PDF)'}</span>
            </button>

            <span className="text-xs font-mono text-slate-500">View:</span>
            <button
              onClick={() => {
                setMainView('all');
                setTypeFilter('all');
              }}
              className={`px-3 py-1 text-[11px] font-mono rounded-xs transition-all cursor-pointer ${
                mainView === 'all'
                  ? 'bg-slate-900 text-white font-black shadow-md'
                  : 'bg-white text-slate-700 hover:text-black border border-slate-300'
              }`}
              title="दोनों विकल्पों के संयुक्त रिकॉर्ड्स एक साथ देखें"
            >
              {langCode === 'hi' ? 'सभी संयुक्त (All Combined)' : 'All Records'}
            </button>
          </div>
        </div>

        {bankSuccessBanner && (
          <div className="p-3 rounded-xs bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-mono text-xs flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{bankSuccessBanner}</span>
            </div>
            <button
              onClick={() => setBankSuccessBanner(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* THE TWO DUAL MASTER OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* OPTION 1: MY REVENUE */}
          <button
            onClick={() => {
              setMainView('revenue');
              setTypeFilter('all');
            }}
            className={`p-4 sm:p-6 rounded-xs text-left transition-all cursor-pointer border-2 relative overflow-hidden group select-none bg-white ${
              mainView === 'revenue'
                ? 'border-sky-500 shadow-xl ring-2 ring-sky-500/20 sm:scale-[1.01]'
                : 'border-slate-300 hover:border-sky-400 bg-slate-50/70'
            }`}
          >
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xs flex items-center justify-center font-bold text-lg shrink-0 shadow-sm ${
                    mainView === 'revenue' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700 border border-sky-300'
                  }`}
                >
                  <TrendingUp className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider block text-sky-600">
                    {langCode === 'hi' ? 'विकल्प १ · समस्त कमाई व राजस्व' : 'OPTION 1 · ALL INCOMING REVENUE'}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-serif font-black tracking-tight mt-0.5 leading-none text-slate-900">
                    My Revenue
                  </h3>
                </div>
              </div>

              <span className="px-2 sm:px-2.5 py-1 rounded-xs text-[10px] sm:text-xs font-mono font-black tracking-wide shadow-xs bg-sky-600 text-white shrink-0">
                {revenueTransactions.length} {langCode === 'hi' ? 'आय रिकॉर्ड' : 'Records'}
              </span>
            </div>

            <p className="relative z-10 text-xs mt-3 leading-relaxed font-sans text-slate-600">
              {langCode === 'hi'
                ? 'Google AdSense ऑटोमेटेड EFT वायर, डायरेक्ट संस्थागत प्रायोजकों, प्रायोजित आलेखों एवं मल्टीमीडिया प्रेस से प्राप्त समस्त आय का प्रमाणित B2B टैक्स इनवॉइस रिकॉर्ड।'
                : 'Audit ledger of Google AdSense wire disbursements, direct institutional billboard sponsorships, and SAC 998363 certified tax invoices.'}
            </p>

            <div className="relative z-10 mt-4 pt-3 border-t border-slate-200 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase block font-semibold text-slate-500">
                  {langCode === 'hi' ? 'कुल अर्जित राजस्व:' : 'Total Earned Revenue:'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  ₹{totalGrossRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="font-bold underline flex items-center gap-1 text-sky-600">
                <span>
                  {mainView === 'revenue'
                    ? langCode === 'hi'
                      ? 'सक्रिय विकल्प (ACTIVE)'
                      : 'ACTIVE VIEW'
                    : langCode === 'hi'
                    ? 'क्लिक करके आय देखें'
                    : 'Open Revenue'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>

          {/* OPTION 2: MY WALLET */}
          <button
            onClick={() => {
              setMainView('wallet');
              setTypeFilter('all');
            }}
            className={`p-4 sm:p-6 rounded-xs text-left transition-all cursor-pointer border-2 relative overflow-hidden group select-none bg-white ${
              mainView === 'wallet'
                ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/20 sm:scale-[1.01]'
                : 'border-slate-300 hover:border-emerald-400 bg-slate-50/70'
            }`}
          >
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xs flex items-center justify-center font-bold text-lg shrink-0 shadow-sm ${
                    mainView === 'wallet'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  }`}
                >
                  <Wallet className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider block text-emerald-600">
                    {langCode === 'hi' ? 'विकल्प २ · बैलेंस, निकासी व टैक्स' : 'OPTION 2 · WALLET & PAYOUTS'}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-serif font-black tracking-tight mt-0.5 leading-none text-slate-900">
                    My Wallet
                  </h3>
                </div>
              </div>

              <span className="px-2 sm:px-2.5 py-1 rounded-xs text-[10px] sm:text-xs font-mono font-black tracking-wide shadow-xs bg-emerald-600 text-white shrink-0">
                {walletTransactions.length} {langCode === 'hi' ? 'बैंक निकासी' : 'Payouts'}
              </span>
            </div>

            <p className="relative z-10 text-xs mt-3 leading-relaxed font-sans text-slate-600">
              {langCode === 'hi'
                ? 'वॉलेट में उपलब्ध शुद्ध बैलेंस, लिंक बैंक खाते में राशि ट्रांसफर, 1% TDS कटौती तथा सरकार को GST व आयकर भरने हेतु सुरक्षित रिज़र्व का सम्पूर्ण इलेक्ट्रॉनिक लेजर।'
                : 'Available treasury balance, electronic withdrawals to linked bank account, 1% TDS reserve deduction, and statutory government tax pool records.'}
            </p>

            <div className="relative z-10 mt-4 pt-3 border-t border-slate-200 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase block font-semibold text-slate-500">
                  {langCode === 'hi' ? 'उपलब्ध वॉलेट बैलेंस:' : 'Available Balance:'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  ₹{availableBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="font-bold underline flex items-center gap-1 text-emerald-600">
                <span>
                  {mainView === 'wallet'
                    ? langCode === 'hi'
                      ? 'सक्रिय विकल्प (ACTIVE)'
                      : 'ACTIVE VIEW'
                    : langCode === 'hi'
                    ? 'क्लिक करके वॉलेट देखें'
                    : 'Open Wallet'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* MY REVENUE VIEW (4 COLOR OPTIONS ON WHITE BACKGROUND) */}
      {(mainView === 'revenue' || mainView === 'all') && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 sm:p-5 rounded-sm border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-xs bg-slate-900 text-white font-mono text-[10px] font-black uppercase">
                  MY REVENUE AUDIT
                </span>
                <span className="px-2 py-0.5 rounded-xs bg-white text-slate-700 border border-slate-300 font-mono text-[10px] font-bold">
                  SAC 998363 & GST REGISTERED
                </span>
              </div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 mt-1">
                {langCode === 'hi'
                  ? 'सकल अर्जित आय: ₹' + totalGrossRevenue.toLocaleString('en-IN')
                  : 'Total Gross Inflows: ₹' + totalGrossRevenue.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {langCode === 'hi'
                  ? 'सफेद बैकग्राउंड पर चारों मुख्य आय विकल्पों के रंग-कोडित शब्द सुरक्षित हैं, जो नीचे लेजर टेबल से मेल खाते हैं।'
                  : 'White background cards with color-coded typography preserved across all 4 monetization streams.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onGoToInvoiceTab && (
                <button
                  onClick={onGoToInvoiceTab}
                  className="px-4 py-2 rounded-xs bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{langCode === 'hi' ? 'टैक्स इनवॉइस बनाएं' : 'Create Tax Invoice'}</span>
                </button>
              )}
              {onGoToRateCardTab && (
                <button
                  onClick={onGoToRateCardTab}
                  className="px-3.5 py-2 rounded-xs bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{langCode === 'hi' ? 'विज्ञापन दरें' : 'Rate Card'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* OPTION 1: GOOGLE ADSENSE */}
            <div className="p-4 sm:p-5 rounded-sm bg-white border-2 border-sky-500 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-xs bg-sky-600 text-white shadow-xs">
                    01 · Google AdSense
                  </span>
                  <span className="text-[10px] font-mono text-sky-800 font-bold bg-sky-50 px-1.5 py-0.2 rounded-xs border border-sky-300">
                    EFT Wire
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-sky-600 mt-2">
                  ₹{totalIncomeAdSense.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-mono text-sky-800 font-bold mt-1">
                  ≈ ${Math.round(totalIncomeAdSense / 87)} USD (Cross-Border)
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-4 pt-2.5 border-t border-sky-100 leading-snug font-sans">
                {langCode === 'hi'
                  ? 'गूगल एशिया पैसिफिक से सीधे बैंक खाते में आने वाली मासिक ऑटोमेटेड EFT वायर आय।'
                  : 'Automated monthly cross-border direct wire remittance from Google Asia Pacific Pte. Ltd.'}
              </p>
            </div>

            {/* OPTION 2: DIRECT BRAND / SPONSORSHIP */}
            <div className="p-4 sm:p-5 rounded-sm bg-white border-2 border-amber-500 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-xs bg-amber-600 text-white shadow-xs">
                    02 · Direct Brand Space
                  </span>
                  <span className="text-[10px] font-mono text-amber-900 font-bold bg-amber-50 px-1.5 py-0.2 rounded-xs border border-amber-300">
                    SAC 998363
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-600 mt-2">
                  ₹{totalIncomeDirect.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-mono text-amber-800 font-bold mt-1">
                  100% Pre-Paid Institutional RTGS
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-4 pt-2.5 border-t border-amber-100 leading-snug font-sans">
                {langCode === 'hi'
                  ? 'हेडर ब्रॉडव्यू बिलबोर्ड, इन-आर्टिकल बैनर एवं संस्थागत कंपनियों से प्राप्त डायरेक्ट स्पॉन्सरशिप।'
                  : 'Direct commercial billboard sponsorships and broadview banner placements under SAC 998363.'}
              </p>
            </div>

            {/* OPTION 3: SPONSORED ARTICLES & MULTIMEDIA */}
            <div className="p-4 sm:p-5 rounded-sm bg-white border-2 border-indigo-500 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-xs bg-indigo-600 text-white shadow-xs">
                    03 · Sponsored Press
                  </span>
                  <span className="text-[10px] font-mono text-indigo-800 font-bold bg-indigo-50 px-1.5 py-0.2 rounded-xs border border-indigo-300">
                    Text + Media
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-indigo-600 mt-2">
                  ₹{totalIncomeArticles.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-mono text-indigo-800 font-bold mt-1">
                  Articles + Multimedia Dossiers
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-4 pt-2.5 border-t border-indigo-100 leading-snug font-sans">
                {langCode === 'hi'
                  ? 'प्रायोजित लेख, फोटो गैलरी, यूट्यूब एम्बेड व AI वॉइस नैरेशन पब्लिशिंग से प्राप्त आय।'
                  : 'Paid editorial articles, press dossiers, and audio-synthesized branded briefs.'}
              </p>
            </div>

            {/* OPTION 4: GOVT TAX & GST POOL */}
            <div className="p-4 sm:p-5 rounded-sm bg-white border-2 border-emerald-500 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-xs bg-emerald-600 text-white shadow-xs">
                    04 · Govt Tax & GST
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-xs border border-emerald-300">
                    18% CGST/SGST
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-600 mt-2">
                  ₹{totalGstReserve.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-mono text-emerald-800 font-bold mt-1">
                  CGST ₹{(totalGstReserve / 2).toLocaleString('en-IN')} + SGST ₹{(totalGstReserve / 2).toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-4 pt-2.5 border-t border-emerald-100 leading-snug font-sans">
                {langCode === 'hi'
                  ? 'विज्ञापन बिलों पर एकत्रित 18% GST सरकारी टैक्स रिज़र्व पूल।'
                  : '18% Goods & Services Tax output reserve collected under SAC 998363.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MY WALLET VIEW */}
      {(mainView === 'wallet' || mainView === 'all') && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main Wallet Hero Balance Card */}
          <div className="p-4 sm:p-6 rounded-sm bg-white border-2 border-emerald-500 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-xs bg-emerald-600 text-white font-mono text-[10px] font-black uppercase flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>MY TREASURY WALLET</span>
                </span>
                <span className="px-2 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold">
                  100% ELECTRONIC · SEC 269ST
                </span>
              </div>
              <div className="text-xs font-mono text-slate-500 uppercase pt-1">
                {langCode === 'hi' ? 'वॉलेट में उपलब्ध शुद्ध निकासी बैलेंस:' : 'Available Net Treasury Balance:'}
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-slate-950 tracking-tight">
                ₹{availableBalance.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-600 font-sans">
                {langCode === 'hi'
                  ? `सत्यापित बैंक खाता: ${bankAccount.bankName} (${maskedBankAcc}) · IFSC: ${bankAccount.ifscCode}`
                  : `Verified Settlement Account: ${bankAccount.bankName} (${maskedBankAcc}) · IFSC: ${bankAccount.ifscCode}`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => {
                  setWithdrawErrorMsg(null);
                  setWithdrawAmount(Math.min(10000, availableBalance));
                  setIsWithdrawModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xs bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Landmark className="w-4 h-4" />
                <span>{langCode === 'hi' ? 'राशि निकालें (Withdraw Funds)' : 'Withdraw to Bank (EFT)'}</span>
              </button>

              <button
                onClick={handleOpenBankModal}
                className="px-4 py-2 rounded-xs bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 text-indigo-800 font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{langCode === 'hi' ? 'बैंक खाता विवरण बदलें' : 'Edit Bank Account'}</span>
              </button>
            </div>
          </div>

          {/* 4 Wallet Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-sm bg-white border-2 border-emerald-500 shadow-sm">
              <span className="text-[10px] font-mono font-black uppercase text-emerald-700 block">
                {langCode === 'hi' ? 'उपलब्ध बैलेंस' : 'Available Balance'}
              </span>
              <div className="text-2xl font-mono font-black text-emerald-600 mt-1">
                ₹{availableBalance.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-600 mt-1 font-sans">Ready for Instant NEFT / RTGS</div>
            </div>

            <div className="p-4 rounded-sm bg-white border-2 border-sky-500 shadow-sm">
              <span className="text-[10px] font-mono font-black uppercase text-sky-700 block">
                Withdrawn to Bank
              </span>
              <div className="text-2xl font-mono font-black text-sky-600 mt-1">
                ₹{totalWithdrawn.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-600 mt-1 font-sans">
                {walletTransactions.length} Disbursals Settled
              </div>
            </div>

            <div className="p-4 rounded-sm bg-white border-2 border-amber-500 shadow-sm">
              <span className="text-[10px] font-mono font-black uppercase text-amber-800 block">
                {langCode === 'hi' ? 'सरकारी टैक्स व TDS पूल' : 'Govt Tax & TDS Pool'}
              </span>
              <div className="text-2xl font-mono font-black text-amber-600 mt-1">
                ₹{totalTaxAndGstPool.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-600 mt-1 font-sans">
                GST ₹{totalGstReserve.toLocaleString('en-IN')} + 1% TDS ₹{totalTdsReserve.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-sm bg-white border-2 border-indigo-500 shadow-sm">
              <span className="text-[10px] font-mono font-black uppercase text-indigo-700 block">
                Linked Bank Account
              </span>
              <div className="text-sm font-serif font-black text-indigo-700 mt-1 truncate">
                {bankAccount.bankName}
              </div>
              <div className="text-[11px] font-mono text-slate-700 mt-0.5 truncate">
                {maskedBankAcc} · {bankAccount.ifscCode}
              </div>
              {bankAccount.upiId && (
                <div className="text-[10px] font-mono text-indigo-600 truncate">UPI: {bankAccount.upiId}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEARCH, FILTER BAR & LEDGER TABLE */}
      <div className="p-4 sm:p-5 rounded-sm border border-slate-300 bg-white space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h4 className="font-serif font-black text-sm sm:text-base text-slate-900">
              {mainView === 'revenue'
                ? langCode === 'hi'
                  ? 'My Revenue: समस्त आय व विज्ञापन बिलिंग रिकॉर्ड्स'
                  : 'My Revenue: Incoming Revenue & Billing Audit Trail'
                : mainView === 'wallet'
                ? langCode === 'hi'
                  ? 'My Wallet: बैंक विथड्रॉल, निकासी व टैक्स लेजर'
                  : 'My Wallet: Electronic Disbursals & Bank Payout Ledger'
                : langCode === 'hi'
                ? 'सम्पूर्ण वित्तीय एवं वॉलेट ऑडिट लेजर (All Transactions)'
                : 'Unified Financial & Treasury Audit Ledger'}
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">
              {filteredTransactions.length} {langCode === 'hi' ? 'रिकॉर्ड्स प्रदर्शित' : 'entries displayed'} · 100% Electronic Trace
            </p>
          </div>

          <button
            onClick={handleResetFilters}
            className="self-start sm:self-auto px-3 py-1 rounded-xs border border-slate-300 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {langCode === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTxnQuery}
              onChange={(e) => setSearchTxnQuery(e.target.value)}
              placeholder={langCode === 'hi' ? 'ID, UTR, पार्टी या इनवॉइस खोजें...' : 'Search ID, UTR, entity, invoice...'}
              className="w-full pl-8 pr-3 py-2 rounded-xs bg-slate-50 border border-slate-300 text-slate-900 focus:outline-hidden focus:border-slate-900"
            />
          </div>

          <div className="relative">
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full pl-8 pr-3 py-2 rounded-xs bg-slate-50 border border-slate-300 text-slate-900 cursor-pointer focus:outline-hidden focus:border-slate-900"
            >
              <option value="all">{langCode === 'hi' ? 'सभी तिथियां (All Dates)' : 'All Dates'}</option>
              <option value="today">{langCode === 'hi' ? 'आज के रिकॉर्ड (Today)' : 'Today'}</option>
              <option value="7days">{langCode === 'hi' ? 'पिछले 7 दिन' : 'Last 7 Days'}</option>
              <option value="30days">{langCode === 'hi' ? 'पिछले 30 दिन' : 'Last 30 Days'}</option>
              <option value="custom">{langCode === 'hi' ? 'कस्टम तिथि चुनें' : 'Custom Range'}</option>
            </select>
          </div>

          {mainView !== 'wallet' ? (
            <div className="relative">
              <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full pl-8 pr-3 py-2 rounded-xs bg-slate-50 border border-slate-300 text-slate-900 cursor-pointer focus:outline-hidden focus:border-slate-900"
              >
                <option value="all">{langCode === 'hi' ? 'सभी आय श्रेणियां' : 'All Streams'}</option>
                <option value="adsense">Google AdSense EFT Payout (Sky Blue)</option>
                <option value="direct-sponsor">Direct Brand Sponsorship (Amber)</option>
                <option value="sponsored-article">Sponsored Article (Indigo)</option>
                <option value="multimedia-feature">Multimedia Dossier (Indigo)</option>
                {mainView === 'all' && <option value="withdrawal">Bank Disbursal (Emerald)</option>}
              </select>
            </div>
          ) : (
            <div className="flex items-center px-3 py-2 rounded-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-[11px]">
              Filter: Bank Disbursals (Emerald)
            </div>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xs bg-slate-50 border border-slate-300 text-slate-900 cursor-pointer focus:outline-hidden focus:border-slate-900"
          >
            <option value="all">{langCode === 'hi' ? 'सभी स्थिति (All Status)' : 'All Status'}</option>
            <option value="success">Settled / Success</option>
            <option value="pending">Clearing Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {dateFilter === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">From Date:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">To Date:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
              />
            </div>
          </div>
        )}

        {/* Ledger Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xs">
          <table className="w-full min-w-[740px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3">Txn ID & Stream</th>
                <th className="p-3">Payer / Payee & Electronic UTR</th>
                <th className="p-3">Date & Mode</th>
                <th className="p-3 text-right">Gross / Tax</th>
                <th className="p-3 text-right">Net Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Slip / Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                    {langCode === 'hi'
                      ? 'चुने गए फ़िल्टर के अनुसार कोई लेन-देन नहीं मिला।'
                      : 'No transactions match the selected filters.'}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const theme = getTxnTheme(txn.type);
                  return (
                    <tr key={txn.id} className={`${theme.borderLeft} ${theme.hoverBg} transition-colors`}>
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold ${theme.idColor}`}>{txn.id}</span>
                          <button
                            onClick={() => handleCopyTxnId(txn.id)}
                            className="text-slate-400 hover:text-slate-800 cursor-pointer"
                            title="Copy Txn ID"
                          >
                            {copiedTxnId === txn.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <span className={`px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold inline-block mt-1 ${theme.badgeBg}`}>
                          {theme.name}
                        </span>
                      </td>

                      <td className="p-3 align-top max-w-[240px]">
                        <div className="font-bold text-slate-900 truncate" title={txn.title}>
                          {txn.title}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate" title={txn.payerOrPayee}>
                          {txn.payerOrPayee}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate" title={txn.deviceReference}>
                          {txn.deviceReference}
                        </div>
                      </td>

                      <td className="p-3 align-top">
                        <div className="font-mono text-slate-800 font-medium">{txn.dateTime}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{txn.paymentMode}</div>
                      </td>

                      <td className="p-3 align-top text-right font-mono">
                        <div className="text-slate-700">₹{txn.grossAmount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-500">
                          {txn.type === 'withdrawal' ? 'TDS' : 'GST'}: ₹{txn.taxAmount.toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className={`p-3 align-top text-right font-mono font-black text-sm ${theme.amountColor}`}>
                        {txn.netAmount < 0
                          ? `-₹${Math.abs(txn.netAmount).toLocaleString('en-IN')}`
                          : `+₹${txn.netAmount.toLocaleString('en-IN')}`}
                      </td>

                      <td className="p-3 align-top text-center">
                        {txn.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            SETTLED
                          </span>
                        ) : txn.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                            <Clock className="w-3 h-3" />
                            PENDING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                            <XCircle className="w-3 h-3" />
                            FAILED
                          </span>
                        )}
                      </td>

                      <td className="p-3 align-top text-right">
                        <button
                          onClick={() => setViewingTransaction(txn)}
                          className="px-2.5 py-1 rounded-xs bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] font-bold cursor-pointer transition-colors whitespace-nowrap"
                        >
                          {txn.type === 'withdrawal' ? 'ADVICE SLIP' : 'INVOICE'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: WITHDRAW FUNDS TO LINKED BANK ACCOUNT */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in select-none">
          <div className="w-full max-w-lg max-h-[92dvh] overflow-y-auto bg-white border-2 border-emerald-500 rounded-sm shadow-2xl p-4 sm:p-6 space-y-4 text-slate-900 font-sans relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-600" />
                <h4 className="font-serif font-black text-base text-slate-900">
                  {langCode === 'hi' ? 'बैंक खाते में राशि निकालें (Withdraw Funds)' : 'Electronic Bank Withdrawal (EFT)'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1 text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {withdrawSuccessMsg ? (
              <div className="p-4 rounded bg-emerald-50 border border-emerald-400 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{withdrawSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleExecuteWithdrawal} className="space-y-4 text-xs">
                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-800 block">
                      {langCode === 'hi' ? 'उपलब्ध बैलेंस:' : 'Available Balance:'}
                    </span>
                    <span className="text-lg font-mono font-black text-emerald-700">
                      ₹{availableBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(availableBalance)}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[11px] cursor-pointer"
                  >
                    Withdraw 100%
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {langCode === 'hi' ? 'निकासी राशि (Amount in ₹):' : 'Withdrawal Amount (₹):'}
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 font-mono font-bold text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {langCode === 'hi' ? 'सत्यापित बैंक खाता (Settlement Bank Account):' : 'Settlement Bank Account:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsWithdrawModalOpen(false);
                        handleOpenBankModal();
                      }}
                      className="text-indigo-600 hover:underline font-mono font-bold text-[11px] cursor-pointer"
                    >
                      Change Bank
                    </button>
                  </div>
                  <div className="text-slate-700 font-semibold">{withdrawBankName}</div>
                  <div className="font-mono text-[11px] text-slate-600">
                    A/C: {withdrawAccountNo} · IFSC: {withdrawIfsc}
                  </div>
                  <div className="text-[11px] text-slate-500">{withdrawHolderName}</div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {langCode === 'hi' ? 'इलेक्ट्रॉनिक ट्रांसफर माध्यम:' : 'Electronic Transfer Rail:'}
                  </label>
                  <select
                    value={withdrawMode}
                    onChange={(e) => setWithdrawMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 text-slate-900 cursor-pointer focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="NEFT Electronic Transfer">NEFT Electronic Transfer</option>
                    <option value="RTGS Bank Settlement">RTGS Bank Settlement</option>
                    <option value="IMPS Instant Electronic">IMPS Instant Electronic</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 p-2.5 rounded bg-amber-50 border border-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withdrawTdsDeduction}
                    onChange={(e) => setWithdrawTdsDeduction(e.target.checked)}
                    className="accent-emerald-600"
                  />
                  <span className="text-[11px] text-amber-950 font-medium">
                    Deduct 1% Govt TDS Advance Reserve (₹{Math.round(withdrawAmount * 0.01).toLocaleString('en-IN')})
                  </span>
                </label>

                {withdrawErrorMsg && (
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-300 text-rose-800 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{withdrawErrorMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-bold cursor-pointer hover:bg-slate-100"
                  >
                    {langCode === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{langCode === 'hi' ? 'राशि ट्रांसफर करें' : 'Confirm Disbursal'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: TRANSACTION ADVICE SLIP / TAX INVOICE DETAIL */}
      {viewingTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in select-none">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white border-2 border-slate-300 rounded-sm shadow-2xl p-4 sm:p-7 flex flex-col text-slate-900 font-sans overflow-hidden">
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 shrink-0">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-amber-700">
                  Official Digital Journal of Record · Commercial Monetization Operations
                </div>
                <h4 className="font-serif font-black text-base sm:text-lg text-slate-950 mt-0.5">
                  {viewingTransaction.type === 'withdrawal'
                    ? 'ELECTRONIC BANK DISBURSAL ADVICE SLIP'
                    : 'CERTIFIED ELECTRONIC REVENUE INVOICE'}
                </h4>
              </div>
              <button
                onClick={() => setViewingTransaction(null)}
                className="p-1.5 text-slate-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200 font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Transaction Reference:</div>
                  <div className="font-bold text-slate-900">{viewingTransaction.id}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Document No:</div>
                  <div className="font-bold text-slate-900">{viewingTransaction.invoiceNumber || 'E-RECEIPT'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Timestamp:</div>
                  <div className="font-semibold text-slate-800">{viewingTransaction.dateTime}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Settlement Mode:</div>
                  <div className="font-semibold text-slate-800">{viewingTransaction.paymentMode}</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono text-[10px] uppercase">
                      <th className="p-2.5">Particulars</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{viewingTransaction.title}</div>
                        <div className="text-slate-600">{viewingTransaction.payerOrPayee}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">{viewingTransaction.deviceReference}</div>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold">
                        ₹{viewingTransaction.grossAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700">
                        {viewingTransaction.type === 'withdrawal' ? '1% TDS Advance Reserve' : '18% GST Output (SAC 998363)'}
                      </td>
                      <td className="p-2.5 text-right font-mono">
                        ₹{viewingTransaction.taxAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5">Net Settled Value</td>
                      <td className="p-2.5 text-right font-mono text-emerald-700 text-sm">
                        ₹{Math.abs(viewingTransaction.netAmount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {viewingTransaction.notes && (
                <div className="p-3 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                  <strong>Audit Remarks:</strong> {viewingTransaction.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => setViewingTransaction(null)}
                className="px-4 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LINK & MANAGE BANK ACCOUNT */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in select-none">
          <div className="relative w-full max-w-lg rounded-sm border-2 border-indigo-600 bg-white text-slate-900 shadow-2xl overflow-hidden font-sans max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-indigo-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-700" />
                <h4 className="font-serif font-black text-base text-slate-900">
                  {langCode === 'hi' ? 'अपना बैंक खाता लिंक व अपडेट करें' : 'Link & Manage Bank Account'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="p-1 text-slate-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBankAccount} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs">
              {bankFormError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-300 text-rose-800 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bankFormError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {langCode === 'hi' ? 'बैंक का नाम चुनें (Select Bank):' : 'Select Bank:'}
                </label>
                <select
                  value={formBankName}
                  onChange={(e) => setFormBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 text-slate-900 cursor-pointer focus:border-indigo-600 focus:outline-hidden"
                >
                  {POPULAR_INDIAN_BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              {formBankName === 'Other / अन्य बैंक' && (
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {langCode === 'hi' ? 'अन्य बैंक का पूरा नाम:' : 'Other Bank Name:'}
                  </label>
                  <input
                    type="text"
                    value={formOtherBankName}
                    onChange={(e) => setFormOtherBankName(e.target.value)}
                    placeholder="Enter bank name"
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 text-slate-900"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {langCode === 'hi' ? 'खाताधारक का नाम (Account Holder Name):' : 'Account Holder Name:'}
                </label>
                <input
                  type="text"
                  value={formHolder}
                  onChange={(e) => setFormHolder(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {langCode === 'hi' ? 'खाता संख्या (Account No.):' : 'Account Number:'}
                  </label>
                  <input
                    type="text"
                    value={formAccNo}
                    onChange={(e) => setFormAccNo(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {langCode === 'hi' ? 'खाता संख्या की पुष्टि करें:' : 'Confirm Account No.:'}
                  </label>
                  <input
                    type="text"
                    value={formConfirmAccNo}
                    onChange={(e) => setFormConfirmAccNo(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">IFSC Code:</label>
                  <input
                    type="text"
                    value={formIfsc}
                    onChange={(e) => setFormIfsc(e.target.value.toUpperCase())}
                    maxLength={11}
                    placeholder="SBIN0000691"
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 font-mono uppercase text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Account Type:</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 text-slate-900 cursor-pointer"
                  >
                    <option value="Current Account">Current Account (Commercial)</option>
                    <option value="Savings Account">Savings Account</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {langCode === 'hi' ? 'व्यावसायिक UPI ID (वैकल्पिक):' : 'Commercial UPI ID (Optional):'}
                </label>
                <input
                  type="text"
                  value={formUpi}
                  onChange={(e) => setFormUpi(e.target.value)}
                  placeholder="name@bank"
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 font-mono text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-bold cursor-pointer hover:bg-slate-100"
                >
                  {langCode === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold cursor-pointer shadow-sm"
                >
                  {langCode === 'hi' ? 'बैंक खाता सहेजें' : 'Verify & Save Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CONSOLIDATED GOVT TAX STATEMENT & COMPLIANCE CERTIFICATE */}
      {isTaxReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in select-none print:p-0 print:bg-white print:static">
          <div className="w-full max-w-4xl max-h-[94vh] bg-white border-2 border-emerald-600 rounded-sm shadow-2xl flex flex-col text-slate-900 font-sans overflow-hidden print:max-h-none print:border-none print:shadow-none print:w-full">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-emerald-50 flex items-center justify-between shrink-0 print:hidden">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <h4 className="font-serif font-black text-base text-slate-900">
                    {langCode === 'hi'
                      ? 'सरकारी टैक्स (GST SAC 998363 एवं 1% TDS) अनुपालन प्रमाण-पत्र'
                      : 'Statutory Govt Tax (GST SAC 998363 & 1% TDS) Audit Statement'}
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-mono">
                    Official Digital Journal of Record · Commercial Monetization & Treasury Directorate
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTaxReportModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-800 bg-slate-50 p-3.5 rounded border border-slate-200">
                <div>
                  <div className="font-bold uppercase text-[10px] font-mono text-slate-500">Publisher Tax Entity</div>
                  <div className="font-bold text-slate-950 text-sm">POLITICS WORLD MEDIA NETWORK</div>
                  <div>SAC 998363 (Internet Advertising & Sponsored Media)</div>
                  <div className="font-mono text-[11px] text-slate-600">FY 2026-27 · Certified 100% Electronic (No Cash)</div>
                </div>
                <div className="md:text-right">
                  <div className="font-bold uppercase text-[10px] font-mono text-slate-500">Settlement Bank Linked</div>
                  <div className="font-bold text-slate-900">{bankAccount.bankName}</div>
                  <div className="font-mono text-[11px] text-slate-600">
                    A/C: {maskedBankAcc} · IFSC: {bankAccount.ifscCode}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
                <div className="p-2.5 rounded border border-slate-200 bg-white">
                  <span className="text-[9px] text-slate-500 uppercase block">Gross Inflow</span>
                  <span className="text-base font-black text-slate-900">₹{totalGrossRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded border border-emerald-200 bg-emerald-50">
                  <span className="text-[9px] text-emerald-700 uppercase block">18% GST Pool</span>
                  <span className="text-base font-black text-emerald-700">₹{totalGstReserve.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded border border-amber-200 bg-amber-50">
                  <span className="text-[9px] text-amber-800 uppercase block">1% TDS Reserve</span>
                  <span className="text-base font-black text-amber-700">₹{totalTdsReserve.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded border border-sky-200 bg-sky-50">
                  <span className="text-[9px] text-sky-800 uppercase block">Withdrawn</span>
                  <span className="text-base font-black text-sky-700">₹{totalWithdrawn.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded border border-indigo-200 bg-indigo-50">
                  <span className="text-[9px] text-indigo-800 uppercase block">Total Tax Fund</span>
                  <span className="text-base font-black text-indigo-700">₹{totalTaxAndGstPool.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded border border-slate-800 bg-slate-900 text-white">
                  <span className="text-[9px] text-slate-300 uppercase block">Ready to Withdraw</span>
                  <span className="text-base font-black text-emerald-300">₹{availableBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-300 rounded">
                <table className="w-full min-w-[660px] text-left text-[11px] font-mono border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white uppercase">
                      <th className="p-2.5">Txn ID</th>
                      <th className="p-2.5">Party / Entity</th>
                      <th className="p-2.5">Mode & Reference</th>
                      <th className="p-2.5 text-right">Tax Reserve</th>
                      <th className="p-2.5 text-right">Net Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {transactions.map((t) => (
                      <tr key={t.id}>
                        <td className="p-2.5 font-bold text-slate-800">{t.id}</td>
                        <td className="p-2.5 font-sans font-medium text-slate-900 max-w-[180px] truncate" title={t.payerOrPayee}>
                          {t.payerOrPayee}
                        </td>
                        <td className="p-2.5 text-[9px] text-slate-500 font-mono truncate max-w-[160px]" title={t.deviceReference}>
                          {t.deviceReference}
                        </td>
                        <td className="p-2.5 text-right text-slate-700">₹{t.taxAmount.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-black text-slate-900">
                          {t.netAmount < 0
                            ? `-₹${Math.abs(t.netAmount).toLocaleString('en-IN')}`
                            : `₹${t.netAmount.toLocaleString('en-IN')}`}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={3} className="p-2.5">Net Closing Treasury Balance</td>
                      <td className="p-2.5 text-right">₹{totalTaxAndGstPool.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right font-black text-slate-900">
                        ₹{(totalNetRevenueReceived - totalWithdrawn).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <strong>Sec 269ST Compliance:</strong> Zero cash handling. Every incoming sponsorship and outgoing bank disbursal is 100% digitally traceable via UTR / EFT wire reference.
                </div>
                <div className="sm:text-right">
                  <strong>GST SAC 998363:</strong> 18% Output GST reserve (9% CGST + 9% SGST) itemized per tax invoice for quarterly/monthly GSTR filing.
                </div>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 shrink-0 print:hidden">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyTaxSummary}
                  className="px-3.5 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {taxReportCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{taxReportCopied ? 'Copied!' : 'Copy Summary'}</span>
                </button>
                <button
                  onClick={handleDownloadTaxCsv}
                  className="px-3.5 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
              <button
                onClick={() => setIsTaxReportModalOpen(false)}
                className="px-4 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
