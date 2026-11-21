import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  Search,
  ExternalLink,
  Cookie,
  Mail,
  Lock,
  FileText,
  AlertCircle,
  CheckCircle2,
  Printer,
  ChevronRight,
  Globe,
  Eye,
  UserCheck,
  Scale,
  AlertTriangle,
  Radio,
  Megaphone,
  Copy,
  Check,
  Sun,
  Moon,
  Sparkles,
  Video,
  Image as ImageIcon,
  Volume2,
  Layers,
  Cpu,
  Building2,
  XCircle,
  Calendar,
  CreditCard,
  Award,
  Scroll,
  BadgeCheck,
  Download,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { downloadLegalGazettePdf } from '../utils/pdfExport';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  const { langCode } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Initialize language from app's global language or default to Hindi if site is in Hindi
  const [policyLang, setPolicyLang] = useState<'hi' | 'en'>(() => {
    return langCode === 'hi' ? 'hi' : 'en';
  });

  useEffect(() => {
    if (langCode === 'hi') {
      setPolicyLang('hi');
    }
  }, [langCode]);

  const privacyEmail = 'privacy@politicsworld.news';
  const legalEmail = 'legal@politicsworld.news';
  const effectiveDate = policyLang === 'hi' ? '5 नवंबर 2026' : 'November 5, 2026';
  const lastUpdated = policyLang === 'hi' ? '9 नवंबर 2026' : 'November 9, 2026';

  const handleCopyEmail = (email: string) => {
    try {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2200);
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isHindi = policyLang === 'hi';

  const sectionsNavEn = [
    { id: 'shield-summary', roman: 'PROLOGUE', title: 'Executive Safe Harbor Declaration & Immunity Shield' },
    { id: 'intermediary-status', roman: 'ARTICLE I', title: 'Neutral Intermediary & Technology Platform Status' },
    { id: 'sovereign-expansion-rights', roman: 'ARTICLE II', title: 'Sovereign Right to Integrate Future Channels, Agencies & APIs' },
    { id: 'liability-immunity', roman: 'ARTICLE III', title: 'Complete Liability Immunity & Statutory Safe Harbor' },
    { id: 'multimedia-legal-shield', roman: 'ARTICLE IV', title: 'Comprehensive Legal Framework: Videos, Photos & Voice Synthesis' },
    { id: 'syndicated-feeds-attribution', roman: 'ARTICLE V', title: 'Syndicated Feed Attribution & Originating Publisher Liability' },
    { id: 'adsense-advertising', roman: 'ARTICLE VI', title: 'Google AdSense, DART Cookies & Zero Advertising Liability' },
    { id: 'direct-branding-invoicing', roman: 'ARTICLE VII', title: 'Direct Sponsorships, Sponsored Articles (Photo/Video/Voice), Tax Invoicing & Sovereign Editorial Rights' },
    { id: 'originating-agency-recourse', roman: 'ARTICLE VIII', title: 'Third-Party Content Disputes: Direct Recourse to Originating Wire Agency Only' },
    { id: 'information-collected', roman: 'ARTICLE IX', title: 'Information Collected & Data Minimization' },
    { id: 'cookies-storage', roman: 'ARTICLE X', title: 'Cookies, Web Beacons & Browser Local Storage' },
    { id: 'gdpr-ccpa-dpdp', roman: 'ARTICLE XI', title: 'Multilateral Privacy Rights (DPDP Act, GDPR, CCPA)' },
    { id: 'limitation-liability', roman: 'ARTICLE XII', title: 'Absolute Limitation of Legal Liability & Hold Harmless' },
    { id: 'governing-law', roman: 'ARTICLE XIII', title: 'Jurisdiction, Severability & Dispute Forum' },
    { id: 'contact-officers', roman: 'ARTICLE XIV', title: 'Platform Technical & Legal Compliance Contacts' },
  ];

  const sectionsNav = isHindi
    ? [
        { id: 'shield-summary', roman: 'PROLOGUE', title: 'विधिक सुरक्षा सूचना एवं सुरक्षित कवच (Executive Safe Harbor)' },
        { id: 'intermediary-status', roman: 'ARTICLE I', title: 'केवल तकनीकी मध्यस्थ मंच की स्थिति (Neutral Intermediary)' },
        { id: 'sovereign-expansion-rights', roman: 'ARTICLE II', title: 'भविष्य में नए चैनल, एजेंसियां व API जोड़ने का संप्रभु अधिकार' },
        { id: 'liability-immunity', roman: 'ARTICLE III', title: 'कानूनी दायित्व से पूर्ण मुक्ति एवं Safe Harbor संरक्षण' },
        { id: 'multimedia-legal-shield', roman: 'ARTICLE IV', title: 'वीडियो, फोटो व वॉयस वाचन का संपूर्ण कानूनी संरक्षण' },
        { id: 'syndicated-feeds-attribution', roman: 'ARTICLE V', title: 'सिंडिकेटेड सामग्री का श्रेय व मूल प्रदाता का दायित्व' },
        { id: 'adsense-advertising', roman: 'ARTICLE VI', title: 'Google AdSense, DART कुकीज़ व विज्ञापन दायित्व मुक्ति' },
        { id: 'direct-branding-invoicing', roman: 'ARTICLE VII', title: 'डायरेक्ट विज्ञापन, स्पॉन्सरशिप्स, प्रायोजित आलेख (फोटो/वीडियो/वॉइस) व टैक्स इनवॉइसिंग नियम' },
        { id: 'originating-agency-recourse', roman: 'ARTICLE VIII', title: 'समाचार आपत्ति नियम: सीधे संबंधित मूल एजेंसी/पब्लिशर से संपर्क करें' },
        { id: 'information-collected', roman: 'ARTICLE IX', title: 'एकत्र की जाने वाली जानकारी (Data Minimization)' },
        { id: 'cookies-storage', roman: 'ARTICLE X', title: 'कुकीज़ एवं ब्राउज़र लोकल स्टोरेज' },
        { id: 'gdpr-ccpa-dpdp', roman: 'ARTICLE XI', title: 'बहुपक्षीय गोपनीयता अधिकार (DPDP Act, GDPR, CCPA)' },
        { id: 'limitation-liability', roman: 'ARTICLE XII', title: 'विधिक दायित्व की पूर्ण सीमा (Zero Financial Liability)' },
        { id: 'governing-law', roman: 'ARTICLE XIII', title: 'क्षेत्राधिकार, पृथक्करणीयता एवं लागू कानून' },
        { id: 'contact-officers', roman: 'ARTICLE XIV', title: 'तकनीकी एवं विधिक अनुपालन संपर्क' },
      ]
    : sectionsNavEn;

  const normalizedFilter = filterQuery.trim().toLowerCase();
  const filteredSectionsNav = normalizedFilter
    ? sectionsNav.filter((sec, idx) => {
        const enMatch = sectionsNavEn[idx]?.title.toLowerCase().includes(normalizedFilter);
        return (
          sec.title.toLowerCase().includes(normalizedFilter) ||
          sec.roman.toLowerCase().includes(normalizedFilter) ||
          sec.id.toLowerCase().includes(normalizedFilter) ||
          Boolean(enMatch)
        );
      })
    : sectionsNav;

  // Luxury & Standard Theme Palettes
  const pageBgClass = isDark
    ? 'bg-[#040816] text-slate-200'
    : 'bg-[#faf9f6] text-slate-800';

  const luxuryCardClass = isDark
    ? 'bg-gradient-to-b from-[#08122d]/90 via-[#060c20]/95 to-[#040817] border border-amber-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.5)] text-slate-200'
    : 'bg-white border border-amber-900/15 shadow-[0_4px_25px_rgba(180,140,80,0.08)] text-slate-800';

  const innerPanelClass = isDark
    ? 'bg-[#091433]/70 border border-[#1a2d5e]/70 text-slate-300'
    : 'bg-[#f6f5f0] border border-amber-900/10 text-slate-700';

  const textTitleClass = isDark ? 'text-white' : 'text-slate-950';
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-600';
  const goldHeadingClass = isDark ? 'text-amber-300' : 'text-amber-800';
  const goldSubtleClass = isDark ? 'text-amber-400/90' : 'text-amber-700';

  return (
    <div className={`w-full min-h-screen ${pageBgClass} font-sans pb-28 selection:bg-amber-400/30 selection:text-white print:bg-white print:text-black print:pb-0`}>
      
      {/* ========================================================================= */}
      {/* 1. DIPLOMATIC TOP BANNER & LUXURY CONTROLS BAR                            */}
      {/* ========================================================================= */}
      <div className={`border-b sticky top-0 z-30 backdrop-blur-md transition-colors print:hidden ${
        isDark
          ? 'bg-[#040817]/95 border-amber-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          : 'bg-[#ffffff]/95 border-amber-900/15 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Back & Breadcrumb with Regal Seal */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className={`px-3 py-1.5 rounded-sm border flex items-center gap-2 text-xs font-bold tracking-wider cursor-pointer transition-all shadow-xs active:scale-95 ${
                isDark
                  ? 'bg-gradient-to-r from-[#0c1838] to-[#142654] hover:from-[#142654] hover:to-[#1a3472] border-amber-500/40 text-amber-300 hover:text-white'
                  : 'bg-white hover:bg-slate-50 border-amber-900/20 text-slate-800 hover:text-slate-950'
              }`}
              title={isHindi ? 'मुख्य समाचार पर वापस जाएं' : 'Return to Newsroom'}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHindi ? '← मुख्य समाचार' : '← Newsroom'}</span>
            </button>

            <div className={`h-6 w-px hidden sm:block ${isDark ? 'bg-amber-500/20' : 'bg-slate-300'}`} />

            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-gradient-to-br from-amber-400/20 via-amber-950/60 to-black border-amber-400/70 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-700/50 text-amber-800 shadow-xs'
              }`}>
                <Scale className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <h1 className={`text-xs sm:text-sm font-serif font-black uppercase tracking-[0.14em] leading-none ${textTitleClass}`}>
                  POLITICS WORLD · {isHindi ? 'विधिक एवं मानक राजपत्र' : 'LEGAL & STANDARDS GAZETTE'}
                </h1>
                <img
                  src="/images/politics_world_logo.png"
                  alt="Politics World Official Logo"
                  className="w-32 sm:w-44 h-auto object-contain block mt-0.5 mb-0.5 drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)]"
                />
                <p className={`text-[10px] font-mono tracking-wider ${goldSubtleClass}`}>
                  {isHindi
                    ? 'संहिताबद्ध सेफ हार्बर प्रोटोकॉल · भारत (IST) · 2026'
                    : 'CODIFIED SAFE HARBOR PROTOCOL · INDIA (IST) · 2026'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Quick 2-Language Switcher (हिंदी / English) */}
            <div className={`flex items-center rounded-sm p-0.5 border ${
              isDark ? 'bg-[#030612] border-amber-500/30' : 'bg-slate-100 border-slate-300'
            }`}>
              <button
                type="button"
                onClick={() => setPolicyLang('hi')}
                className={`px-3 py-1 rounded-xs text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isHindi
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="हिंदी में पढ़ें"
              >
                <span>🇮🇳</span>
                <span>हिंदी</span>
              </button>
              <button
                type="button"
                onClick={() => setPolicyLang('en')}
                className={`px-3 py-1 rounded-xs text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isHindi
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Read in English"
              >
                <span>🌐</span>
                <span>English</span>
              </button>
            </div>

            {/* Quick Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-sm border flex items-center justify-center cursor-pointer transition-all ${
                isDark
                  ? 'bg-[#08122d] hover:bg-[#102354] border-amber-500/30 text-amber-300'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
              title={isDark ? 'Switch to Bright Luxury Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-700" />}
            </button>

            {/* Download Official Instrument PDF */}
            <button
              type="button"
              onClick={() => downloadLegalGazettePdf(sectionsNavEn, 'November 5, 2026', 'November 9, 2026')}
              className={`px-3 py-1.5 rounded-sm border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isDark
                  ? 'bg-[#08122d] hover:bg-[#12234e] border-amber-500/30 text-emerald-300'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
              title="Download Official PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>PDF</span>
            </button>

            {/* Print Official Instrument */}
            <button
              type="button"
              onClick={handlePrint}
              className={`px-3 py-1.5 rounded-sm border text-xs font-mono font-bold items-center gap-1.5 cursor-pointer transition-all hidden sm:flex ${
                isDark
                  ? 'bg-[#08122d] hover:bg-[#12234e] border-amber-500/30 text-amber-300'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
              title="Print Official Document"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN DOCUMENT CONTAINER                                                */}
      {/* ========================================================================= */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
        
        {/* ===================================================================== */}
        {/* DIPLOMATIC MASTER HERO: THE CONSTITUTIONAL GAZETTE HEADER              */}
        {/* ===================================================================== */}
        <div className={`rounded-sm p-7 sm:p-10 mb-10 border-2 relative overflow-hidden shadow-2xl ${
          isDark
            ? 'bg-gradient-to-b from-[#0b1738] via-[#060c20] to-[#040816] border-amber-500/40 text-white'
            : 'bg-gradient-to-b from-[#ffffff] via-[#faf8f4] to-[#f4f1ea] border-amber-900/30 text-slate-900'
        }`}>
          {/* Subtle Guilloche / Gold Hairline Accent Lines */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl">
              
              {/* Sovereign Metadata Ribbon (Zero-Pill Typographic Design) */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono tracking-wider font-semibold text-amber-500 dark:text-amber-300 uppercase">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>INSTRUMENT OF SOVEREIGN SAFE HARBOR</span>
                </span>
                <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
                <span>IT ACT §79</span>
                <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
                <span>47 U.S.C. § 230</span>
                <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
                <span>GST SAC 998363</span>
              </div>

              {/* Majestic Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-[1.15]">
                {isHindi
                  ? 'गोपनीयता नीति, विधिक सुरक्षा कवच एवं वाणिज्यिक मानक'
                  : 'Constitutional Safe Harbor, Advertising Standards & Privacy Protocol'}
              </h2>

              <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClass} font-sans`}>
                {isHindi
                  ? 'Politics World की आधिकारिक, बाध्यकारी एवं संप्रभु विधिक संहिता। यह दस्तावेज प्रमाणित करता है कि यह वेबसाइट विशुद्ध रूप से एक तटस्थ तकनीकी मध्यस्थ मंच है। सभी समाचार, फोटो व वीडियो संबंधित अधिकृत तृतीय-पक्ष स्रोतों के हैं; सामग्री संबंधी किसी भी आपत्ति के लिए सीधे उन्हीं मूल एजेंसियों से संपर्क अनिवार्य है। मंच संचालक के पास किसी भी समय नए चैनल्स व एपीआई जोड़ने का संप्रभु अधिकार तथा प्रत्यक्ष वाणिज्यिक विज्ञापनों पर 100% डिलीवरी सुरक्षा कवच पूर्ण रूप से लागू है।'
                  : 'Official statutory codification governing Politics World. This instrument legally establishes our status as an automated neutral technology intermediary, preserves our sovereign right to expand news channels and REST API data feeds, mandates exclusive recourse against originating wire bureaus, and provides complete safe-harbor immunity for direct brand sponsorships under statutory tax invoicing (SAC 998363).'}
              </p>
            </div>

            {/* Official Diplomatic Notarization Registry Box */}
            <div className={`p-5 rounded-sm border-2 text-xs font-mono space-y-2.5 shrink-0 min-w-[270px] shadow-lg ${
              isDark
                ? 'bg-[#030612]/95 border-amber-500/40 text-slate-200 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                : 'bg-white border-amber-900/30 text-slate-900 shadow-md'
            }`}>
              <div className="flex items-center gap-2 pb-2 border-b border-amber-500/30 text-[11px] font-serif font-black uppercase tracking-wider text-amber-500 dark:text-amber-400">
                <Scroll className="w-3.5 h-3.5" />
                <span>NOTARIZED REGISTRY · INDIA (IST) · 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={textMutedClass}>{isHindi ? 'प्रभावी तिथि:' : 'Effective Date:'}</span>
                <span className={`font-semibold ${textTitleClass}`}>{effectiveDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={textMutedClass}>{isHindi ? 'अंतिम संशोधन:' : 'Last Codified:'}</span>
                <span className="text-amber-500 font-bold">{lastUpdated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={textMutedClass}>{isHindi ? 'वैधानिक भूमिका:' : 'Platform Role:'}</span>
                <span className="text-emerald-500 font-bold">{isHindi ? 'तटस्थ मध्यस्थ' : 'Neutral Intermediary'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={textMutedClass}>{isHindi ? 'टैक्स इनवॉइस कोड:' : 'Tax Invoicing SAC:'}</span>
                <span className="text-sky-400 font-bold">SAC 998363</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-700/50">
                <span className={textMutedClass}>{isHindi ? 'मालिक का दायित्व:' : 'Owner Liability:'}</span>
                <span className="text-rose-500 font-black tracking-wide">{isHindi ? 'शून्य (100% सुरक्षित)' : 'ZERO (100% IMMUNE)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* PROLOGUE: EXECUTIVE SAFE HARBOR DECLARATION                           */}
        {/* ===================================================================== */}
        <section id="shield-summary" className={`mb-10 border-2 rounded-sm p-6 sm:p-9 shadow-xl scroll-mt-24 ${
          isDark
            ? 'bg-gradient-to-br from-[#0c193a] to-[#060e24] border-amber-400/50'
            : 'bg-gradient-to-br from-[#fffdfa] to-[#fbf7ee] border-amber-900/30'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-400/30 pb-4 mb-5">
            <div className="flex items-center gap-2.5 text-amber-500 dark:text-amber-300 font-serif font-black text-lg sm:text-xl uppercase tracking-wider">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                {isHindi
                  ? 'महत्वपूर्ण विधिक सुरक्षा सूचना एवं सुरक्षित कवच (Executive Safe Harbor)'
                  : 'Executive Safe Harbor Declaration & Immunity Shield'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 font-bold tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isHindi ? 'कानूनी सुरक्षा कवच पूर्ण सक्रिय' : 'STATUTORY IMMUNITY ACTIVE'}</span>
            </div>
          </div>

          {isHindi ? (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans">
              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>१. विशुद्ध तकनीकी मध्यस्थ मंच:</strong> Politics World स्वयं कोई मूल समाचार निर्माता, लेखक या रिपोर्टर नहीं है। यह केवल एक तकनीकी मंच (News Aggregator & Technology Platform) है जो तृतीय-पक्ष स्रोतों से स्वचालित रूप से समाचार संकलित कर प्रदर्शित करता है।
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>२. नए चैनल्स, एजेंसियां व API जोड़ने का संप्रभु अधिकार:</strong> वेबसाइट मालिक और संचालक के पास यह अनन्य, संप्रभु एवं असीमित अधिकार हमेशा सुरक्षित है कि वह भविष्य में कभी भी किसी भी नए टेलीविज़न न्यूज़ चैनल, डिजिटल समाचार एजेंसी, थर्ड-पार्टी REST API वेंडर या लाइव डेटा स्ट्रीम को जोड़ सकता है, बदल सकता है या हटा सकता है। इसके लिए किसी पूर्व अनुमति या सूचना की आवश्यकता नहीं होगी।
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>३. कानूनी कार्रवाई से मालिक की पूर्ण मुक्ति (Complete Immunity):</strong> यदि किसी व्यक्ति, संस्था, दल या सरकार को किसी भी खबर, हेडलाइन, वीडियो, फोटो या ऑडियो पर कोई मानहानि, कॉपीराइट, तथ्यात्मक या कानूनी आपत्ति है, तो विधिक रूप से <strong>केवल और केवल वह मूल न्यूज़ एजेंसी या स्रोत उत्तरदायी है</strong> जिसने उस सामग्री को बनाया या जारी किया। Politics World या इसके मालिक के खिलाफ कोई कानूनी मुकदमा या दावा मान्य नहीं होगा।
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>४. वीडियो, फोटो एवं वॉयस वाचन का विधिक संरक्षण:</strong> वेबसाइट पर दिखाए जाने वाले वीडियो तीसरे पक्ष के सर्वरों से एम्बेड किए जाते हैं; फोटो समाचार पहचान एवं फेयर-यूज़ के तहत प्रदर्शित होते हैं; और ऑडियो वाचन केवल पाठकों की सुविधा के लिए स्वचालित टेक्स्ट-टू-स्पीच (TTS) तकनीक है। इनमें से किसी के लिए भी मंच मालिक पर कोई दायित्व नहीं होगा।
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>५. Google AdSense एवं विज्ञापन शून्य-दायित्व:</strong> वेबसाइट पर प्रदर्शित होने वाले विज्ञापन Google AdSense और सहयोगी नेटवर्कों द्वारा स्वचालित दिखाए जाते हैं। किसी भी विज्ञापन में किए गए दावे या वित्तीय लेन-देन के लिए वेबसाइट का दायित्व शून्य है।
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>६. आपत्ति नियम (सीधे संबंधित मूल एजेंसी से संपर्क):</strong> वेबसाइट पर दिखने वाले समस्त समाचार, शीर्षक, फोटोग्राफ्स एवं वीडियो संबंधित अधिकृत एजेंसियों के हैं। <strong>Politics World किसी तीसरे पक्ष के समाचार के लिए कोई शिकायत स्वीकार नहीं करता है।</strong> किसी भी आपत्ति, खंडन, मानहानि या कॉपीराइट विवाद के लिए शिकायतकर्ता को सीधे उस संबंधित मूल समाचार एजेंसी/पब्लिशर से ही संपर्क करना होगा जिसका श्रेय समाचार के साथ दिया गया है। Politics World या इसके मालिक को कोई शिकायत न भेजें।
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>७. डायरेक्ट विज्ञापन, स्पॉन्सरशिप्स एवं टैक्स इनवॉइसिंग सुरक्षा नियम:</strong> Google AdSense के अलावा होने वाले सभी डायरेक्ट ब्रांड विज्ञापनों, स्पॉन्सर्ड प्रेस विज्ञप्तियों और पाठक योगदानों पर निश्चित अवधि (सप्ताह/माह/वर्ष), अनिवार्य 100% अग्रिम भुगतान, और वैधानिक टैक्स इनवॉइस (GST SAC 998363) लागू होती है। वेबसाइट के सार्वजनिक URL पर विज्ञापन का लाइव प्रसारण ही सेवा की पूर्ण डिलीवरी का अंतिम व अकाट्य प्रमाण है (सर्वोत्तम प्रयास मानक)। लाइव होने के पश्चात कोई रिफंड या रद्दीकरण मान्य नहीं होगा, और 'पैसा लिया लेकिन विज्ञापन नहीं दिखाया' के किसी भी झूठे दावे के विरुद्ध मंच को पूर्ण कानूनी संरक्षण प्राप्त है।
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans">
              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>1. Platform Nature:</strong> Politics World is exclusively an automated digital technology intermediary and syndication directory. We do not author, originate, investigate, or editorially endorse the news articles or media aggregated herein.
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>2. Sovereign Expansion & Integration Authority:</strong> The platform owner retains the perpetual, unilateral, and unfettered sovereign right to integrate, connect, partner with, syndicate, or ingest feeds from any domestic or international news channel, broadcast network, wire service, or live API data provider at any time without prior notice or third-party consent.
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>3. Complete Intermediary Safe Harbor:</strong> Under Section 79 of the Indian IT Act 2000, 47 U.S.C. § 230 (United States), and Articles 4-6 of Regulation (EU) 2022/2065 (Digital Services Act), all legal recourse regarding defamation, copyright, or accuracy must be directed solely against the originating third-party publisher, and <strong>NEVER against Politics World or its owner</strong>.
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>4. Multimedia Protection:</strong> Embedded video feeds originate from third-party hosts; photographs are rendered under statutory fair dealing and editorial reporting doctrines; automated voice synthesis is an assistive technical utility. The platform owner bears zero liability for multimedia assets.
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>5. Advertising Disclosures:</strong> Programmatic advertisements are automatically served by Google AdSense and certified ad exchanges. Politics World disclaims all liability for commercial products, claims, or transactions.
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>6. Content Complaints: Direct Recourse to Originating News Bureau:</strong> All articles, photos, and video assets belong strictly to their originating publishing wire services. Politics World does not entertain, adjudicate, or process content grievances on behalf of outside publishers. For any factual objection, defamation claim, or copyright inquiry, parties must contact the respective originating wire agency directly as attributed in each dispatch. Do NOT direct content grievances to Politics World or its webmaster.
                </p>
              </div>

              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <p className={textTitleClass}>
                  <strong>7. Direct Sponsorships, Tax Invoicing & Conclusive Delivery Shield:</strong> All non-programmatic direct sponsorships, corporate wire releases, and reader memberships are executed under fixed-term Insertion Orders (Weekly, Monthly, Quarterly, Annual) with mandatory 100% INR pre-payment and statutory Tax Invoices (SAC 998363 · 18% India GST). Public live URL deployment constitutes conclusive, non-rebuttable proof of delivery under the best-efforts technology standard. Ad fees are strictly Not Refundable once scheduled or live, and the platform owner is fully shielded against bad-faith non-delivery allegations.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================================== */}
        {/* QUICK SEARCH & TREATY INDEX                                           */}
        {/* ===================================================================== */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-3 print:hidden">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/70" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={isHindi ? 'विधिक धाराओं में खोजें (जैसे Safe Harbor, टैक्स इनवॉइस, स्पॉन्सरशिप, डिलीवरी नियम)...' : 'Search codified articles (e.g., Safe Harbor, Tax Invoice, Direct Sponsorship, Delivery Shield)...'}
              className={`w-full pl-10 pr-4 py-3 rounded-sm text-xs sm:text-sm placeholder-slate-400 border focus:outline-hidden transition-all ${
                isDark
                  ? 'bg-[#060c20] border-amber-500/30 text-white focus:border-amber-400'
                  : 'bg-white border-amber-900/20 text-slate-900 focus:border-amber-700 shadow-sm'
              }`}
            />
          </div>
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className={`text-xs font-mono px-3 py-2 cursor-pointer ${textMutedClass} hover:text-amber-500`}
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Index: Standard & Luxurious Table of Treaties */}
        <div className={`rounded-sm p-6 mb-12 border ${innerPanelClass} print:hidden`}>
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-amber-500/20">
            <h3 className="text-xs font-serif font-black uppercase tracking-[0.16em] text-amber-500 dark:text-amber-300 flex items-center gap-2">
              <Scroll className="w-4 h-4" />
              <span>{isHindi ? 'राजपत्र विषय सूची · त्वरित विधिक नेविगेशन' : 'Table of Codified Articles · Treaty Index'}</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">14 ARTICLES CODIFIED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {filteredSectionsNav.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`p-3 rounded-sm border flex items-center justify-between group transition-all ${
                  isDark
                    ? 'bg-[#060c20] hover:bg-[#0c1838] border-amber-500/15 hover:border-amber-400/50 text-slate-300'
                    : 'bg-white hover:bg-amber-50/50 border-amber-900/10 hover:border-amber-600/40 text-slate-800 shadow-xs'
                }`}
              >
                <div className="truncate pr-2">
                  <span className="text-[10px] font-mono font-bold text-amber-500 dark:text-amber-400 block mb-0.5">
                    {sec.roman}
                  </span>
                  <span className="truncate block font-medium">{sec.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
              </a>
            ))}
          </div>
          {filteredSectionsNav.length === 0 && (
            <div className={`text-xs font-mono py-3 text-center ${textMutedClass}`}>
              {isHindi
                ? 'कोई मिलती-जुलती विधिक धारा नहीं मिली। कृपया दूसरा शब्द खोजें।'
                : 'No matching article found in index. Try another legal keyword.'}
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* MASTER CODIFIED ARTICLES (LUXURIOUS DIPLOMATIC PRESENTATION)          */}
        {/* ===================================================================== */}
        <div className="space-y-10 text-xs sm:text-sm leading-relaxed">
          
          {/* ARTICLE I: NEUTRAL INTERMEDIARY STATUS */}
          <section id="intermediary-status" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-mono font-bold">
                ARTICLE I
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '१. तटस्थ तकनीकी मध्यस्थ एवं समाचार एग्रीगेटर मंच की स्थिति'
                  : '1. Neutral Intermediary & Technology Aggregator Status'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <p className="leading-relaxed">
                {isHindi
                  ? 'Politics World केवल और केवल एक स्वतंत्र, तटस्थ डिजिटल तकनीकी मंच और स्वचालित सूचना एग्रीगेटर के रूप में कार्य करता है। यह मंच उपयोगकर्ताओं को विभिन्न अधिकृत वैश्विक एवं राष्ट्रीय समाचार स्रोतों, सार्वजनिक डिजिटल प्रेस रिलीज, इलेक्ट्रॉनिक वायर सिंडिकेशन और तकनीकी एपीआई (REST APIs) से स्वचालित रूप से एकत्रित सामग्री को देखने की तकनीकी सुविधा उपलब्ध कराता है।'
                  : 'Politics World operates strictly and exclusively as an independent, neutral digital technological platform and automated information aggregator. We provide electronic hosting and technical indexing infrastructure that programmatically organizes and displays publicly distributed news dispatches from authorized third-party syndication networks and automated REST API interfaces.'}
              </p>
              
              <div className={`p-5 rounded-sm border space-y-2.5 ${innerPanelClass}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${textTitleClass}`}>
                  <Radio className="w-4 h-4 text-sky-400" />
                  <span>{isHindi ? 'स्वचालित तकनीकी संकलन प्रणाली (Automated Architecture)' : 'Automated Algorithmic Ingestion Architecture'}</span>
                </h4>
                <p className={textMutedClass}>
                  {isHindi
                    ? 'वेबसाइट पर प्रदर्शित होने वाली खबरें, हेडलाइंस, विवरण, समय-मुद्राएं और संबंधित मल्टीमीडिया सामग्री स्वचालित एल्गोरिद्मिक स्क्रिप्ट्स और वेब प्रोटोकॉल्स के माध्यम से रियल-टाइम में लोड होती हैं। वेबसाइट के मालिक, संचालक या तकनीकी प्रशासकों द्वारा इनमें कोई पूर्व-संपादकीय हस्तक्षेप, तथ्य-निर्माण, रिपोर्टिंग या मूल सामग्री सृजन नहीं किया जाता।'
                    : 'All dispatches, headlines, descriptions, timestamps, and associated multimedia streams rendered on this platform are aggregated in real time via automated programmatic feeds, standardized syndication channels, and technical application programming interfaces without prior manual editorial alteration, investigative creation, or fact-checking by the platform owner.'}
                </p>
                <p className={`text-xs ${textMutedClass}`}>
                  {isHindi
                    ? 'Politics World न तो मूल डिजिटल ट्रांसमिशन को शुरू करता है, न इसके प्राप्तकर्ता को चुनता है, और न ही तीसरे पक्ष द्वारा प्रसारित सूचनाओं के तथ्यात्मक दावों में कोई फेरबदल करता है।'
                    : 'Politics World does not initiate the transmission, does not select the recipient of the transmission, and does not modify the substantive factual contents originating from third-party sources.'}
                </p>
              </div>
            </div>
          </section>

          {/* ARTICLE II: SOVEREIGN RIGHT TO INTEGRATE FUTURE CHANNELS & APIS */}
          <section id="sovereign-expansion-rights" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-mono font-bold">
                ARTICLE II
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '२. भविष्य में नए चैनल्स, न्यूज़ एजेंसियां व API जोड़ने का संप्रभु एवं अनन्य अधिकार'
                  : '2. Sovereign Right to Integrate Future News Channels, Agencies & APIs'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <div className="font-bold flex items-center gap-2 text-sm text-amber-500 dark:text-amber-300 mb-1">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>
                    {isHindi
                      ? 'मंच मालिक का पूर्ण, असीमित एवं अप्रतिबंधित विधिक अधिकार'
                      : 'Unilateral, Sovereign & Unrestricted Discretion of the Platform Owner'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {isHindi
                    ? 'Politics World के मालिक और संचालक के पास यह अनन्य, स्थायी और संप्रभु अधिकार पूर्ण रूप से सुरक्षित है कि वह अपने विवेकानुसार किसी भी समय, बिना किसी पूर्व सूचना, घोषणा या किसी तीसरे पक्ष की अनुमति के, किसी भी नए घरेलू या अंतरराष्ट्रीय टेलीविज़न समाचार चैनल, डिजिटल ब्रॉडकास्टर, प्रिंट या ऑनलाइन समाचार एजेंसी, स्वतंत्र पत्रकारिता नेटवर्क, RSS/XML डेटा फीड, या तृतीय-पक्ष REST API प्रदाता को इस मंच के साथ जोड़ (Integrate) सकता है, बदल सकता है या हटा सकता है।'
                    : 'The platform owner and operator retains the perpetual, exclusive, unilateral, and unrestricted sovereign right to connect, syndicate, integrate, partner with, ingest data from, switch, or remove any current or future television news broadcast, digital news agency, wire syndicate, RSS/XML feed, live REST API data stream, or content provider at any time at the owner’s sole discretion, without requiring prior notice, user consent, or third-party approval.'}
                </p>
              </div>

              <div className={`p-5 rounded-sm border space-y-3 ${innerPanelClass}`}>
                <h4 className="text-xs font-bold text-amber-500 dark:text-amber-300 uppercase tracking-wider">
                  {isHindi ? 'भविष्य में जुड़ने वाले सभी स्रोतों पर लागू विधिक नियम' : 'Legal Terms Governing All Present & Future Integrations'}
                </h4>
                <ul className={`list-disc list-inside space-y-2 text-xs pl-2 ${textMutedClass}`}>
                  <li>
                    <strong>{isHindi ? 'समान मध्यस्थ संरक्षण का विस्तार:' : 'Automatic Extension of Safe Harbor:'}</strong>{' '}
                    {isHindi
                      ? 'भविष्य में जोड़ा जाने वाला कोई भी नया चैनल, वायर एजेंसी या एपीआई फीड स्वतः इस नीति में उल्लिखित मध्यस्थ सुरक्षा कवच (IT Act धारा 79, US CDA 230, EU DSA) के अंतर्गत सुरक्षित होगा।'
                      : 'Any future news channel, broadcast source, agency wire, or API stream integrated into the platform shall automatically and seamlessly fall under the full statutory intermediary immunity and safe harbor provisions detailed herein.'}
                  </li>
                  <li>
                    <strong>{isHindi ? 'शून्य पूर्वानुमति आवश्यकता:' : 'No Prior Notice or Consent Needed:'}</strong>{' '}
                    {isHindi
                      ? 'मंच द्वारा नए डेटा स्रोतों या सिंडिकेशन पार्टनर्स को जोड़ने, तकनीकी अपग्रेड करने या प्रदाता बदलने के लिए किसी भी पाठक, उपयोगकर्ता या बाहरी संगठन की सहमति की आवश्यकता नहीं होगी।'
                      : 'Neither the platform owner nor administrators require authorization, licensing confirmation from readers, or third-party consultations to add, modify, or retire data feeds or API endpoints.'}
                  </li>
                  <li>
                    <strong>{isHindi ? 'स्रोत विविधता का अधिकार:' : 'Absolute Right to Source Diversity:'}</strong>{' '}
                    {isHindi
                      ? 'मंच किसी भी देश, भाषा, क्षेत्र या प्रारूप के समाचार स्रोतों को शामिल करने के लिए पूरी तरह स्वतंत्र है ताकि पाठकों को व्यापक वैश्विक परिप्रेक्ष्य प्राप्त हो सके।'
                      : 'The platform exercises unencumbered editorial independence in sourcing diverse public viewpoints across multiple jurisdictions, languages, and technical feed formats.'}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ARTICLE III: MASTER LEGAL SHIELD & IMMUNITY */}
          <section id="liability-immunity" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
                ARTICLE III
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '३. कानूनी दायित्व से पूर्ण मुक्ति एवं Safe Harbor विधिक सुरक्षा कवच'
                  : '3. Complete Liability Immunity & Statutory Safe Harbor Protection'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <div className="font-bold flex items-center gap-2 text-sm text-rose-400 mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>
                    {isHindi
                      ? 'वैधानिक सुरक्षा कवच (IT Act धारा 79 / US CDA 230 / EU DSA Articles 4-6)'
                      : 'Statutory Safe Harbor Immunity (Section 79 IT Act / Section 230 CDA / EU DSA)'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {isHindi
                    ? 'Politics World भारतीय सूचना प्रौद्योगिकी अधिनियम 2000 की धारा 2(1)(w) तथा धारा 79 के तहत एक प्रमाणित "मध्यस्थ" (Intermediary) है। साथ ही अमेरिकी विधि 47 U.S.C. § 230 (Communications Decency Act) और यूरोपीय संघ के डिजिटल सर्विसेज एक्ट (EU DSA, Regulation 2022/2065 के अनुच्छेद 4, 5 एवं 6) के अंतर्गत तीसरे पक्ष की सामग्री के संबंध में किसी भी दीवानी या फौजदारी दायित्व से पूर्ण विधिक सुरक्षा प्राप्त है।'
                    : 'Politics World qualifies fully as an "Intermediary" under Section 2(1)(w) and Section 79 of the Indian Information Technology Act, 2000, an interactive computer service provider under Section 230 of Title 47 of the United States Code (47 U.S.C. § 230), and an intermediary service provider under Articles 4, 5, and 6 of Regulation (EU) 2022/2065 (Digital Services Act).'}
                </p>
              </div>

              <div className={`p-5 rounded-sm border space-y-3 ${innerPanelClass}`}>
                <h4 className="text-xs font-bold text-amber-500 dark:text-amber-300 uppercase tracking-wider">
                  {isHindi
                    ? 'कार्रवाई केवल मूल समाचार एजेंसी / पब्लिशर के विरुद्ध किए जाने का अनिवार्य नियम'
                    : 'Mandatory Recourse Requirement Against Originating Wire Services Only'}
                </h4>
                <p className={textTitleClass}>
                  {isHindi
                    ? 'कोई भी व्यक्ति, संगठन, व्यापारिक घराना, राजनीतिक दल, राजनयिक या सरकारी विभाग यदि किसी समाचार, हेडलाइन, बयान, विश्लेषण, फोटो या ऑडियो पर मानहानि (Defamation), कॉपीराइट उल्लंघन, गलत बयानी, राष्ट्रीय सुरक्षा या किसी कानूनी अधिकार के उल्लंघन का दावा करता है, तो वह यह अपरिवर्तनीय रूप से स्वीकार करता है कि:'
                    : 'Any individual, corporate entity, governmental department, political organization, or third party alleging libel, slander, defamation, copyright infringement, factual inaccuracy, trademark violation, or emotional distress arising out of any article, headline, image, or audio narration agrees and stipulates that:'}
                </p>
                <ul className={`list-disc list-inside space-y-2 text-xs pl-2 ${textMutedClass}`}>
                  <li>
                    <strong>{isHindi ? 'सीधी कार्रवाई केवल मूल प्रदाता पर:' : 'Exclusive Action Against Originating Publisher:'}</strong>{' '}
                    {isHindi
                      ? 'किसी भी प्रकार का कानूनी नोटिस, हर्जे-खर्चे का दावा या मुकदमा केवल और केवल उस मूल समाचार एजेंसी या पब्लिशर के खिलाफ ही लाया जा सकता है जिसने वह रिपोर्ट, फोटो या तथ्य तैयार किया या जारी किया था।'
                      : 'All formal legal notices, claims, disputes, and causes of action must be instituted exclusively against the third-party originating news wire, agency, or publisher that authored or originated the underlying dispatch.'}
                  </li>
                  <li>
                    <strong>{isHindi ? 'वेबसाइट और मालिक के लिए 100% अभेद्य ढाल:' : 'Absolute Immunity for Platform Owner & Webmaster:'}</strong>{' '}
                    {isHindi
                      ? 'किसी भी कानूनी सिद्धांत (जैसे प्रतिनिधि दायित्व, उपेक्षा या प्रत्यक्ष दायित्व) के तहत Politics World, इसके डोमेन मालिक, सर्वर प्रदाता, सॉफ्टवेयर डेवलपर्स या तकनीकी सहयोगियों को किसी तीसरे पक्ष के समाचार या डेटा के लिए उत्तरदायी नहीं ठहराया जा सकता।'
                      : 'Under no legal doctrine (including vicarious liability, contributory infringement, negligence, or strict liability) shall Politics World, its founder, domain registrant, hosting provider, or administrators be held legally, civilly, or criminally liable for third-party syndicated items.'}
                  </li>
                  <li>
                    <strong>{isHindi ? 'कोई संपादकीय समर्थन या पुष्टि नहीं:' : 'No Editorial Endorsement or Adoption:'}</strong>{' '}
                    {isHindi
                      ? 'वेबसाइट पर किसी समाचार या बयान का प्रदर्शन उस सामग्री में व्यक्त राय, दावों या आरोपों का इस मंच द्वारा समर्थन या सत्यता की पुष्टि नहीं माना जाएगा।'
                      : 'The automated syndication of any dispatch on Politics World does not constitute an endorsement, verification, adoption, or agreement with the opinions or assertions contained therein.'}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ARTICLE IV: MULTIMEDIA SAFE HARBOR */}
          <section id="multimedia-legal-shield" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold">
                ARTICLE IV
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '४. वीडियो, फोटो एवं वॉयस/ऑडियो वाचन का संपूर्ण कानूनी संरक्षण (Multimedia Safe Harbor)'
                  : '4. Comprehensive Legal Framework: Videos, Photos & Voice/Audio Synthesis'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <p className={textTitleClass}>
                {isHindi
                  ? 'Politics World पर प्रदर्शित होने वाले सभी मल्टीमीडिया अवयवों (वीडियो, चित्र एवं ऑडियो वाचन) को भारतीय, अमेरिकी एवं अंतरराष्ट्रीय कानूनों के तहत पूर्ण विधिक सुरक्षा प्राप्त है:'
                  : 'All multimedia components—including streaming video embeds, photojournalism press captures, and text-to-speech audio narrations—are governed under rigorous statutory safe harbor protections:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* 4A: Video Embeds */}
                <div className={`p-4 rounded-sm border space-y-2.5 ${innerPanelClass}`}>
                  <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                    <Video className="w-4 h-4 shrink-0" />
                    <span>{isHindi ? 'क. वीडियो एवं लाइव स्ट्रीम' : 'A. Video Streams & Embeds'}</span>
                  </div>
                  <p className={textMutedClass}>
                    {isHindi
                      ? 'वेबसाइट पर उपलब्ध कोई भी वीडियो क्लिप या प्रसारण तीसरे पक्ष के अधिकृत सर्वरों से सीधे एम्बेड (Embed) या लिंक किया जाता है। Politics World इन वीडियो फाइलों को अपने सर्वर पर स्टोर, अपलोड या प्रोसेस नहीं करता है।'
                      : 'All video footage, television news clips, and broadcast embeds originate from third-party hosting servers. Politics World does not host, upload, re-encode, or alter underlying video files.'}
                  </p>
                  <p className={`text-[11px] font-mono ${isDark ? 'text-sky-300' : 'text-sky-900'}`}>
                    ✦ {isHindi ? 'केवल क्षणिक तकनीकी संचरण (Conduit Transit), शून्य दायित्व।' : 'Governed as neutral electronic conduit; zero hosting liability.'}
                  </p>
                </div>

                {/* 4B: Photographs */}
                <div className={`p-4 rounded-sm border space-y-2.5 ${innerPanelClass}`}>
                  <div className="flex items-center gap-2 text-amber-500 dark:text-amber-300 font-bold uppercase text-xs">
                    <ImageIcon className="w-4 h-4 shrink-0" />
                    <span>{isHindi ? 'ख. फोटो एवं समाचार चित्र' : 'B. Photos & Visual Assets'}</span>
                  </div>
                  <p className={textMutedClass}>
                    {isHindi
                      ? 'तस्वीरें अधिकृत समाचार सिंडिकेशन और पब्लिक प्रेस वितरण के तहत प्रदर्शित की जाती हैं। यह भारतीय कॉपीराइट अधिनियम 1957 की धारा 52 तथा 17 U.S.C. § 107 के अंतर्गत वर्तमान घटनाओं की रिपोर्टिंग (Fair Dealing / Fair Use) के विधिक दायरे में आता है।'
                      : 'Press imagery is rendered strictly for current affairs identification under Section 52(1)(a)(i) of the Indian Copyright Act, 1957 and 17 U.S.C. § 107 (Fair Use Doctrine). All intellectual property remains with originating owners.'}
                  </p>
                  <p className={`text-[11px] font-mono ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                    ✦ {isHindi ? 'फेयर-यूज़ व बौद्धिक संपदा का सर्वाधिकार मूल एजेंसी के पास।' : 'Protected under Fair Use; IP rights retained by originating wire bureau.'}
                  </p>
                </div>

                {/* 4C: Voice Synthesis */}
                <div className={`p-4 rounded-sm border space-y-2.5 ${innerPanelClass}`}>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs">
                    <Volume2 className="w-4 h-4 shrink-0" />
                    <span>{isHindi ? 'ग. वॉयस/ऑडियो वाचन (TTS)' : 'C. Automated Voice Synthesis'}</span>
                  </div>
                  <p className={textMutedClass}>
                    {isHindi
                      ? '"समाचार सुनें" (Listen Aloud) सुविधा पूरी तरह कंप्यूटर-जनित टेक्स्ट-टू-स्पीच (TTS) तकनीक है। यह किसी मानवीय पत्रकार की व्यक्तिगत आवाज़ या विचार नहीं है, बल्कि केवल सुलभता (Accessibility) के लिए मूल टेक्स्ट का तकनीकी वाचन है।'
                      : 'The "Listen Aloud" audio synthesis is an automated accessibility text-to-speech engine. It does not represent personal journalism, editorial commentary, or voice-over endorsement; it merely converts syndicated text into audio.'}
                  </p>
                  <p className={`text-[11px] font-mono ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>
                    ✦ {isHindi ? 'शुद्ध सहायक तकनीकी उपयोगिता, शून्य मानहानि दायित्व।' : 'Pure assistive technical utility; zero editorial voice liability.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ARTICLE V: SYNDICATED FEED ATTRIBUTION */}
          <section id="syndicated-feeds-attribution" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-mono font-bold">
                ARTICLE V
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '५. सिंडिकेटेड सामग्री का श्रेय एवं मूल प्रदाता का अनन्य उत्तरदायित्व'
                  : '5. Syndicated Feed Attribution & Originating Publisher Liability'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <p>
                {isHindi
                  ? 'Politics World पूर्ण कानूनी पारदर्शिता और बौद्धिक संपदा मानकों का पालन करता है। प्रत्येक समाचार कार्ड, हेडलाइन और डिटेल पेज पर उस समाचार को जारी करने वाली अधिकृत एजेंसी या पब्लिशर का नाम और मूल स्रोत स्पष्ट रूप से प्रदर्शित किया जाता है:'
                  : 'Politics World maintains absolute transparency regarding intellectual property and public reporting standards. Every syndicated article card, headline, and detailed reader interface explicitly references the issuing agency and originating source:'}
              </p>

              <div className={`p-4 rounded-sm border space-y-2.5 ${innerPanelClass}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${textTitleClass}`}>
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>{isHindi ? 'कंटेंट सत्यापन एवं मूल स्रोत की जिम्मेदारी' : 'Source Verification & Originating Liability Stipulation'}</span>
                </h4>
                <p className={textMutedClass}>
                  {isHindi
                    ? 'प्रत्येक समाचार के साथ उसका स्रोत दर्शाया जाता है ताकि पाठक सीधे मूल प्रकाशक की जानकारी देख सकें। यदि किसी खबर में कोई तथ्यात्मक अशुद्धि, गलत अनुवाद, अधूरा संदर्भ या कॉपीराइट विवाद हो, तो उसकी कानूनी जिम्मेदारी पूरी तरह उस मूल समाचार एजेंसी या पब्लिशर की होगी जिसने वह सामग्री जारी की थी। Politics World केवल उस सार्वजनिक सूचना को प्रसारित करने वाला तकनीकी माध्यम है।'
                    : 'Source attribution is preserved to ensure readers can identify the originating news bureau. If any dispatch contains factual inaccuracy, misquotation, mistranslation, or copyright dispute, sole and exclusive legal liability remains with the third-party syndicate that published the material. Politics World serves strictly as the digital medium of technological transit.'}
                </p>
              </div>
            </div>
          </section>

          {/* ARTICLE VI: GOOGLE ADSENSE & ADVERTISING */}
          <section id="adsense-advertising" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-mono font-bold">
                ARTICLE VI
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '६. Google AdSense, DART कुकीज़ एवं विज्ञापनदाता दायित्व मुक्ति'
                  : '6. Google AdSense, DoubleClick DART Cookies & Zero Advertising Liability'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <p className={textTitleClass}>
                {isHindi
                  ? 'पाठकों के लिए निष्पक्ष एवं स्वतंत्र समाचार सेवा को निःशुल्क उपलब्ध कराने के लिए Politics World, Google AdSense और अन्य अधिकृत प्रोग्रामेटिक विज्ञापन एक्सचेंजों के साथ साझेदारी में कार्य करता है।'
                  : 'To ensure free, unimpeded access for global readers without charging mandatory paywalls or subscriptions, Politics World collaborates with Google AdSense and certified programmatic ad exchanges.'}
              </p>

              <div className={`p-5 rounded-sm border space-y-3 ${innerPanelClass}`}>
                <h4 className="text-xs font-bold text-amber-500 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <span>{isHindi ? 'Google DoubleClick DART कुकीज़ एवं थर्ड-पार्टी विज्ञापन प्रणाली' : 'Google DoubleClick DART Cookie & Third-Party Ad Serving'}</span>
                </h4>
                <p className={textMutedClass}>
                  {isHindi
                    ? 'Google एक अधिकृत थर्ड-पार्टी वेंडर के रूप में हमारी वेबसाइट पर विज्ञापन प्रदर्शित करने के लिए कुकीज़ (विशेषकर DoubleClick DART Cookie) का उपयोग करता है। यह तकनीक Google और उसके विज्ञापन भागीदारों को आपकी पूर्व इंटरनेट गतिविधियों के आधार पर प्रासंगिक विज्ञापन दिखाने में मदद करती है।'
                    : 'Google, as an accredited third-party vendor, uses cookies to serve advertisements on Politics World. Google’s use of advertising cookies (specifically the DoubleClick DART cookie) enables it and its ad partners to serve personalized ads based on a user’s visit to this site and other destinations across the Internet.'}
                </p>
                <div className={`p-2.5 rounded-xs text-xs font-mono ${isDark ? 'bg-[#030612] text-amber-300' : 'bg-amber-100 text-amber-900'}`}>
                  ✦ {isHindi
                    ? 'Politics World का तीसरे पक्ष के विज्ञापनदाताओं द्वारा उपयोग की जाने वाली कुकीज़, कोड या ट्रैकिंग तकनीकों पर कोई नियंत्रण नहीं है।'
                    : 'Politics World exercises no control over cookies or behavioral tracking technologies placed by third-party advertisers.'}
                </div>
              </div>

              {/* Zero Commercial Liability */}
              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${textTitleClass} mb-1`}>
                  {isHindi ? 'विज्ञापनों एवं व्यावसायिक दावों के लिए शून्य दायित्व घोषणा' : 'Absolute Disclaimer of Commercial Advertising Liability'}
                </h4>
                <p className={textMutedClass}>
                  {isHindi
                    ? 'Politics World किसी भी विज्ञापन में दिखाए जाने वाले उत्पाद, सेवा, वित्तीय योजना, लोन, निवेश, स्वास्थ्य उत्पाद या दावों की न तो पुष्टि करता है और न ही उनकी कोई गारंटी देता है। किसी भी विज्ञापनदाता के साथ किए जाने वाले लेन-देन या अनुबंध के लिए पाठक और संबंधित विज्ञापनदाता पूरी तरह स्वयं उत्तरदायी होंगे। वेबसाइट या इसके मालिक पर कोई वित्तीय अथवा कानूनी दायित्व नहीं होगा।'
                    : 'Politics World does not endorse, guarantee, warrant, or verify the commercial representations, financial offers, investment schemes, medical claims, or products promoted in banner ads, native widgets, or sponsored links. Any commercial interaction or financial commitment is entered into solely between the user and the third-party advertiser. The platform owner disclaims any and all legal and financial liability.'}
                </p>
              </div>

              {/* Opt-Out Portals */}
              <div className={`p-5 rounded-sm border space-y-3 ${innerPanelClass}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${textTitleClass}`}>
                  <ExternalLink className="w-4 h-4 text-sky-400" />
                  <span>{isHindi ? 'व्यक्तिगत विज्ञापन बंद करने के अधिकृत विकल्प (Opt-Out)' : 'Reader Ad Choice & Behavioral Opt-Out Portals'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-sm border flex items-center justify-between group transition-all ${
                      isDark ? 'bg-[#030717] hover:bg-[#091535] border-amber-500/20 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className={`font-semibold block ${textTitleClass}`}>Google Ad Settings</span>
                      <span className={`text-[10px] font-mono ${textMutedClass}`}>adssettings.google.com</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  </a>

                  <a
                    href="https://optout.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-sm border flex items-center justify-between group transition-all ${
                      isDark ? 'bg-[#030717] hover:bg-[#091535] border-amber-500/20 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className={`font-semibold block ${textTitleClass}`}>AboutAds (DAA)</span>
                      <span className={`text-[10px] font-mono ${textMutedClass}`}>optout.aboutads.info</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  </a>

                  <a
                    href="https://www.youronlinechoices.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-sm border flex items-center justify-between group transition-all ${
                      isDark ? 'bg-[#030717] hover:bg-[#091535] border-amber-500/20 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className={`font-semibold block ${textTitleClass}`}>YourOnlineChoices</span>
                      <span className={`text-[10px] font-mono ${textMutedClass}`}>youronlinechoices.eu</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ARTICLE VII: DIRECT BRANDING, TAX INVOICING & DELIVERY SHIELD */}
          <section id="direct-branding-invoicing" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 border-2 ${
            isDark
              ? 'bg-gradient-to-br from-[#0c1638] via-[#070f26] to-[#040816] border-purple-500/40 text-slate-200'
              : 'bg-gradient-to-br from-white via-purple-50/20 to-white border-purple-900/20 text-slate-800'
          }`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-purple-500/30">
              <span className="px-2.5 py-1 rounded-xs bg-purple-500/20 border border-purple-400/50 text-purple-300 text-xs font-mono font-bold">
                ARTICLE VII
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '७. डायरेक्ट विज्ञापन, स्पॉन्सरशिप्स, प्रायोजित आलेख (फोटो/वीडियो/वॉइस) व टैक्स इनवॉइसिंग के संप्रभु नियम'
                  : '7. Direct Sponsorships, Sponsored Articles (Photo/Video/Voice), Tax Invoicing & Publisher Sovereign Rights'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <div className="font-bold flex items-center gap-2 text-sm text-purple-400 mb-1">
                  <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>
                    {isHindi
                      ? 'गैर-प्रोग्रामेटिक डायरेक्ट ब्रांडिंग, प्रायोजित आलेख व स्पॉन्सरशिप्स का विधिक दायरा (SAC 998363)'
                      : 'Statutory Scope of Direct Commercial Sponsorships, Sponsored Articles & Tax Invoicing'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {isHindi
                    ? 'यह धारा उन सभी वाणिज्यिक विज्ञापनों, डायरेक्ट हेडर व इन-आर्टिकल बैनर्स, प्रायोजित आलेखों (Sponsored Articles), सबमिट की गई तस्वीरों (Photographs), वीडियो एम्बेड (Video Embeds), वॉयस नैरेशन / ऑडियो पॉडकास्ट (Voice Narration), स्पॉन्सर्ड प्रेस विज्ञप्तियों (Sponsored Wire Dispatches), और पाठक स्वैच्छिक सदस्यताओं पर लागू होती है जो Google AdSense के इतर सीधे Politics World और विज्ञापनदाता / प्रस्तुतकर्ता के आपसी अनुबंध के तहत संचालित किए जाते हैं।'
                    : 'This section governs all direct non-programmatic advertising insertion orders, header/in-article brand placements, sponsored editorial articles, submitted client photographs, video embeds, voice narration / audio podcasts, corporate sponsored wire dispatches, and voluntary reader memberships executed directly between Politics World and third-party commercial entities, authors, or patrons.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 7A: Duration */}
                <div className={`p-4 rounded-sm border space-y-2 ${innerPanelClass}`}>
                  <div className="flex items-center gap-2 text-amber-500 dark:text-amber-300 font-bold uppercase text-xs">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isHindi ? 'क. निश्चित समय-सीमा एवं इंसर्शन ऑर्डर' : 'A. Fixed Durations & Insertion Orders'}</span>
                  </div>
                  <p className={textMutedClass}>
                    {isHindi
                      ? 'प्रत्येक डायरेक्ट विज्ञापन व प्रायोजित आलेख समझौता एक स्पष्ट एवं निर्धारित समय-सीमा के लिए होता है: १ सप्ताह (7 दिन), १ माह (30 दिन), ३ माह / त्रैमासिक (90 दिन), अथवा १ वर्ष (365 दिन) अथवा स्थायी आर्काइव (Permanent Archive)। अभियान की शुरुआत तय स्थान पर लाइव होने की तारीख से होती है और तय अवधि की अंतिम तारीख के 23:59 IST पर स्वतः समाप्त हो जाती है।'
                      : 'All direct campaigns and sponsored features are strictly time-bound under binding electronic Insertion Orders (IOs) for fixed durations: 1 Week (7 Days), 1 Month (30 Days), 3 Months (90 Days), 1 Year (365 Days), or Permanent Web Archive. Service initiates upon public URL rendering and expires automatically at 23:59 IST on the terminal date.'}
                  </p>
                </div>

                {/* 7B: Tax Invoicing */}
                <div className={`p-4 rounded-sm border space-y-2 ${innerPanelClass}`}>
                  <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                    <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{isHindi ? 'ख. आधिकारिक टैक्स इनवॉइस एवं 100% अग्रिम भुगतान' : 'B. Statutory Tax Invoicing & Pre-Payment'}</span>
                  </div>
                  <p className={textMutedClass}>
                    {isHindi
                      ? 'डिजिटल विज्ञापन सेवाओं (SAC 998363 - Internet Advertising Services & Sponsored Publishing) के तहत प्रत्येक डायरेक्ट विज्ञापनदाता व आलेख प्रस्तुतकर्ता को अभियान अवधि, स्लॉट विवरण, लागू भारतीय जीएसटी (18% GST · CGST 9% + SGST 9% / IGST 18%) और अद्वितीय इनवॉइस नंबर के साथ आधिकारिक टैक्स इनवॉइस जारी की जाती है। किसी भी विज्ञापन या आलेख को लाइव करने से पूर्व 100% INR अग्रिम भुगतान (Pre-payment · Strictly Not Refundable) अनिवार्य है।'
                      : 'Under SAC Code 998363 (Internet Advertising Space Selling & Sponsored Publishing), every direct advertiser and article submitter is provided a formal India Tax Invoice specifying campaign tenure, placement slot, applicable 18% GST (9% CGST + 9% SGST / 18% IGST), and a unique invoice identifier. Mandatory 100% digital INR pre-payment (Strictly Not Refundable) is required prior to activation.'}
                  </p>
                </div>
              </div>

              {/* 7D: Sponsored Articles, Photos, Video, Voice & Absolute Sovereign Discretion */}
              <div className={`p-5 rounded-sm border-2 space-y-3 ${
                isDark ? 'bg-gradient-to-br from-[#101938] to-[#080d22] border-amber-500/50' : 'bg-amber-50/60 border-amber-500/40'
              }`}>
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {isHindi
                      ? 'ग. प्रायोजित आलेख, फोटो, वीडियो व वॉयस प्रस्तुति की स्वीकृति या अस्वीकृति का संप्रभु विशेषाधिकार'
                      : 'C. Sovereign Prerogative on Sponsored Articles, Photos, Videos & Voice Features'}
                  </span>
                </div>
                <p className={`text-xs font-semibold leading-relaxed ${textTitleClass}`}>
                  {isHindi
                    ? 'यदि कोई व्यक्ति, संस्था, पीआर एजेंसी या कॉर्पोरेट यह अनुरोध करता है कि उसका आलेख, तस्वीरें (Photos), वीडियो एम्बेड (Video Embeds) या वॉयस नैरेशन / ऑडियो (Voice Narration) मंच पर प्रकाशित किया जाए, तो निम्नलिखित संप्रभु शर्तें विधिक रूप से बाध्यकारी होंगी:'
                    : 'Where any individual, corporate entity, or PR agency requests publication of an article, submitted photographs, embedded video footage, or voice narration / audio podcast, the following sovereign terms are legally binding:'}
                </p>
                <div className="space-y-2.5 text-xs">
                  <div className={`p-3 rounded-xs border ${innerPanelClass}`}>
                    <strong className="text-amber-400 block mb-1">
                      {isHindi
                        ? '१. आर्टिकल करना है या नहीं करना है इसका अंतिम व संप्रभु निर्णय केवल मंच संचालक का होगा:'
                        : '1. Sole Prerogative to Accept, Reject, Edit, or Decline Without Obligation:'}
                    </strong>
                    <span className={textMutedClass}>
                      {isHindi
                        ? 'केवल किसी पक्ष द्वारा आलेख भेजने अथवा अग्रिम राशि की पेशकश करने मात्र से Politics World या उसके संचालक पर आलेख को प्रकाशित करने की कोई बाध्यता (obligation) उत्पन्न नहीं होती। मंच संचालक के पास किसी भी आलेख, फोटो, वीडियो या वॉयस प्रस्तुति को बिना कोई कारण बताए स्वीकार करने, आंशिक रूप से संपादित करने, अस्वीकार करने (Reject) या होल्ड पर रखने का पूर्ण, एकतरफा और गैर-अपीलीय संप्रभु अधिकार है।'
                        : 'Submission of an article or an offer of financial compensation creates ZERO obligation on Politics World or its publisher to publish. The platform owner retains the absolute, unilateral, and unappealable sovereign discretion to accept, vet, edit, reject, or decline any article, photo, video embed, or voice recording without assigning reason.'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xs border ${innerPanelClass}`}>
                    <strong className="text-emerald-400 block mb-1">
                      {isHindi
                        ? '२. टैक्स के अनुरूप वैध राजस्व एवं SAC 998363 इनवॉइसिंग:'
                        : '2. Statutory Revenue Accordance & SAC 998363 Tax Invoicing:'}
                    </strong>
                    <span className={textMutedClass}>
                      {isHindi
                        ? 'यदि संचालक द्वारा संपादकीय समीक्षा के पश्चात आलेख को स्वीकार किया जाता है, तो निर्धारित वाणिज्यिक शुल्क पर वस्तु एवं सेवा कर (18% GST - SAC 998363) के साथ विधिवत आधिकारिक टैक्स इनवॉइस जारी की जाएगी और 100% अग्रिम भुगतान प्राप्त होने के बाद ही आलेख को लाइव किया जाएगा। यह राशि मंच के स्वतंत्र डिजिटल बुनियादी ढांचे के वैध वाणिज्यिक संपादन के रूप में दर्ज की जाएगी।'
                        : 'Upon editorial approval by the publisher, all accepted sponsored articles and multimedia packages are invoiced under SAC 998363 (Internet Advertising & Sponsored Media Distribution) with 18% statutory GST. Live placement occurs strictly upon full pre-payment clearance.'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xs border ${innerPanelClass}`}>
                    <strong className="text-rose-400 block mb-1">
                      {isHindi
                        ? '३. प्रस्तुतकर्ता (Submitter) की 100% व्यक्तिगत कानूनी, कॉपीराइट एवं मानहानि की जिम्मेदारी तथा मंच की पूर्ण क्षतिपूर्ति:'
                        : '3. 100% Submitter Legal, IP & Defamation Liability with Absolute Publisher Indemnity:'}
                    </strong>
                    <span className={textMutedClass}>
                      {isHindi
                        ? 'प्रस्तुतकर्ता यह विधिक गारंटी देता है कि प्रेषित आलेख, तस्वीरों, वीडियो और वॉयस के समस्त बौद्धिक संपदा अधिकार व कॉपीराइट उसके पास वैध रूप से मौजूद हैं। यदि किसी आलेख या मीडिया से मानहानि (Defamation/Slander), बौद्धिक संपदा का उल्लंघन, वित्तीय धोखाधड़ी, राष्ट्रीय सुरक्षा से खिलवाड़ या किसी देश के कानून का उल्लंघन होता है, तो उसकी 100% दीवानी व आपराधिक जवाबदेही प्रस्तुतकर्ता की होगी। मंच संचालक, इसके मालिक और तकनीकी टीम को सभी कानूनी मुकदमों, क्षतिपूर्ति, हर्जाने और अदालती खर्चों से पूर्ण रूप से मुक्त (100% Indemnified and Held Harmless) रखा जाएगा।'
                        : 'The submitting client warrants and covenants that it owns 100% copyright and intellectual property rights for all submitted text, photos, video clips, and voice audio. The submitter assumes exclusive, full civil and criminal liability for any defamation, copyright infringement, or statutory violation. The platform owner and technical team are 100% indemnified and held harmless against all claims, damages, liabilities, and legal costs.'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xs border ${innerPanelClass}`}>
                    <strong className="text-sky-400 block mb-1">
                      {isHindi
                        ? '४. अनुचित सामग्री पर बिना किसी रिफंड के तत्काल हटाने का अधिकार:'
                        : '4. Right to Immediate Takedown & Retainer Forfeiture for Non-Compliant Submissions:'}
                    </strong>
                    <span className={textMutedClass}>
                      {isHindi
                        ? 'यदि प्रकाशन के बाद यह संज्ञान में आता है कि प्रेषित आलेख, फोटो, वीडियो या वॉयस में कोई असत्य तथ्य, नफरती भाषा, जुआ, अवैध प्रचार या कॉपीराइट का उल्लंघन है, तो संचालक के पास बिना किसी पूर्व सूचना और बिना किसी रिफंड (Zero Refund) के उस आलेख व मीडिया को तुरंत हटाने का संप्रभु अधिकार सुरक्षित है।'
                        : 'Politics World reserves the unilateral prerogative to immediately take down and permanently remove any sponsored article, photo, video embed, or voice recording found to violate public order, copyright, or truthful reporting standards, resulting in immediate forfeiture of all retainers without refund.'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xs border ${innerPanelClass}`}>
                    <strong className="text-emerald-400 block mb-1">
                      {isHindi
                        ? '५. 100% गैर-नकद (Non-Cash) बैंक लेन-देन, GST रिज़र्व एवं आयकर धारा 269ST/271DA विधिक सुरक्षा:'
                        : '5. 100% Non-Cash Bank Settlements, Statutory GST Pool & Section 269ST Immunity:'}
                    </strong>
                    <span className={textMutedClass}>
                      {isHindi
                        ? 'मंच पर होने वाले समस्त वित्तीय संपादन, विज्ञापन प्रभार, और बैंक विथड्रॉल 100% इलेक्ट्रॉनिक डिवाइस रेफरेंस (NEFT/RTGS/IMPS/EFT) द्वारा संचालित होते हैं। किसी भी नकद राशि (Cash) का लेन-देन पूर्णतः प्रतिबंधित है। संकलित 18% GST राशि को एक समर्पित सरकारी टैक्स रिज़र्व में आरक्षित कर नियमानुसार GSTR-3B द्वारा सरकारी खजाने में जमा कराया जाता है। नकद लेनदेन का पूर्ण अभाव होने के कारण आयकर अधिनियम की धारा 269ST व 271DA के तहत मंच स्वामी किसी भी शास्ति या दंडात्मक कार्रवाई से पूर्णतः सुरक्षित एवं संरक्षित है।'
                        : 'All financial settlements, commercial invoicing, and banking withdrawals operate exclusively through 100% electronic non-cash mechanisms (NEFT/RTGS/IMPS/EFT). Cash transactions are strictly barred. Collected 18% statutory GST is sequestered in a designated Tax Reserve Pool for timely GSTR-3B treasury remittance. Complete absence of cash dealings affords the publisher absolute statutory immunity under Sections 269ST and 271DA of the Income Tax Act.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 7C: The Core Delivery Shield */}
              <div className={`p-5 rounded-sm border space-y-3 ${innerPanelClass}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${textTitleClass}`}>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isHindi
                      ? 'डिलीवरी सत्यापन मानक एवं "विज्ञापन न दिखाने" के झूठे दावों से पूर्ण सुरक्षा'
                      : 'Conclusive Proof of Delivery & Full Safe Harbor Against Non-Delivery Allegations'}
                  </span>
                </h4>
                <p className={textTitleClass}>
                  {isHindi
                    ? 'विज्ञापनदाता और मंच के बीच यह विधिक रूप से बाध्यकारी शर्त है कि विज्ञापन शुल्क प्राप्त होने के पश्चात सेवा की डिलीवरी को निम्नलिखित विधिक मानकों के अनुसार अंतिम एवं पूर्ण माना जाएगा:'
                    : 'The advertiser stipulates and agrees to the following conclusive legal delivery standards governing all direct bookings:'}
                </p>
                <ul className={`list-disc list-inside space-y-2 text-xs pl-2 ${textMutedClass}`}>
                  <li>
                    <strong>{isHindi ? 'लाइव URL प्रसारण ही सेवा की पूर्ण डिलीवरी है:' : 'Public Live URL Placement Constitutes Full Delivery:'}</strong>{' '}
                    {isHindi
                      ? 'तय विज्ञापन स्लॉट (जैसे हेडर, इन-आर्टिकल, प्रायोजित आलेख या स्पॉन्सर्ड वायर) में विज्ञापन क्रिएटिव को मंच के सार्वजनिक डोमेन URL पर सक्रिय (Live) कर दिया जाना ही सेवा के 100% विधिक संपादन का अंतिम और अकाट्य प्रमाण है।'
                      : 'The deployment of the approved ad creative or sponsored article within the designated digital placement on Politics World’s public web URL constitutes 100% conclusive and irrebuttable proof of delivery.'}
                  </li>
                  <li>
                    <strong>{isHindi ? 'इंटरनेट एवं Ad-Blocker की सर्वोत्तम प्रयास (Best-Efforts) छूट:' : 'Best-Efforts Technology & Client-Side Ad-Blocker Safe Harbor:'}</strong>{' '}
                    {isHindi
                      ? 'डिजिटल प्रसारण इंटरनेट सेवा प्रदाताओं (ISPs), वैश्विक राउटिंग, और व्यक्तिगत पाठक के ब्राउज़र सेटिंग्स पर निर्भर करता है। यदि किसी पाठक के निजी फोन/कंप्यूटर में Ad-Blocker, प्राइवेट डीएनएस या कैशे के कारण विज्ञापन नहीं दिखता, तो यह मंच का दोष या अनुबंध उल्लंघन कभी नहीं माना जाएगा। सर्वर लॉग्स अथवा लाइव स्क्रीनशॉट ही डिलीवरी का अंतिम विधिक साक्ष्य होंगे।'
                      : 'Internet delivery relies on third-party CDNs, ISP routing, and local browser environments. If an end-user utilizes client-side Ad-Blockers, private DNS, or local cache configurations that prevent an ad from rendering, such events shall NEVER constitute a breach of contract or platform default. Server access logs and live URL timestamps serve as definitive legal proof of fulfillment.'}
                  </li>
                  <li>
                    <strong>
                      {isHindi
                        ? 'पूर्णतः गैर-वापसी योग्य समझौता (Strictly Not Refundable / No-Refund Covenant):'
                        : 'Strict Not Refundable Agreement (Zero Refund Policy):'}
                    </strong>{' '}
                    {isHindi
                      ? 'एक बार जब विज्ञापन अभियान या प्रायोजित आलेख लाइव या तकनीकी रूप से शेड्यूल हो जाता है, तो भुगतान की गई कोई भी राशि किसी भी परिस्थिति में Not Refundable (गैर-वापसी योग्य) रहेगी और न ही कोई चार्ज-बैक या बैंक विवाद मान्य होगा।'
                      : 'All sponsorship, advertising, native press release, and sponsored article retainers are strictly Not Refundable once scheduled or published. No refunds, chargebacks, or reimbursement demands shall be accepted or legally actionable under any circumstances.'}
                  </li>
                  <li>
                    <strong>{isHindi ? 'अनुचित सामग्री को हटाने का अधिकार:' : 'Right to Takedown Prohibited Ad Copy:'}</strong>{' '}
                    {isHindi
                      ? 'यदि किसी विज्ञापनदाता द्वारा प्रदान की गई सामग्री में जुआ/सट्टेबाजी, अश्लीलता, वित्तीय धोखाधड़ी, मानहानि या कानून का उल्लंघन पाया जाता है, तो संचालक के पास बिना किसी वापसी के उसे तत्काल हटाने का संप्रभु अधिकार है।'
                      : 'Politics World reserves the unilateral right to suspend or remove any advertisement that promotes illegal gambling, fraud, defamation, obscenity, or regulatory violations without refund, resulting in forfeiture of ad retainers.'}
                  </li>
                  <li>
                    <strong>{isHindi ? 'संपादकीय स्वतंत्रता एवं पाठक सदस्यता:' : 'Editorial Independence & Voluntary Reader Contributions:'}</strong>{' '}
                    {isHindi
                      ? 'डायरेक्ट विज्ञापन कभी भी समाचारों की निष्पक्षता को प्रभावित नहीं कर सकता। पाठकों द्वारा किया गया स्वैच्छिक योगदान केवल स्वतंत्र तकनीकी बुनियादी ढांचे के लिए स्वेच्छा से दिया गया अनुदान है, जिससे पाठक को मंच के स्वामित्व या इक्विटी का कोई अधिकार नहीं मिलता।'
                      : 'Advertising never buys editorial bias or news favoritism. Reader memberships and voluntary contributions are non-commercial gratuities for technology upkeep, conferring no equity, governance, or contractual claims against the platform.'}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ARTICLE VIII: CONTENT OBJECTIONS — DIRECT RECOURSE */}
          <section id="originating-agency-recourse" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-mono font-bold">
                ARTICLE VIII
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '८. समाचार आपत्ति नियम: सीधे संबंधित मूल समाचार एजेंसी / पब्लिशर से संपर्क करें'
                  : '8. Third-Party Content Disputes: Direct Recourse to Originating News Bureau Only'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                <div className="font-bold flex items-center gap-2 text-sm text-amber-500 dark:text-amber-300 mb-1">
                  <XCircle className="w-4 h-4 text-amber-400" />
                  <span>
                    {isHindi
                      ? 'Politics World पर सामग्री संबंधित कोई शिकायत स्वीकार्य नहीं (No Third-Party Editorial Grievances Accepted)'
                      : 'Politics World Does Not Accept Third-Party Content Grievances'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {isHindi
                    ? 'Politics World एक स्वचालित तकनीकी मंच है और किसी भी समाचार, वीडियो, फोटो या रिपोर्ट का लेखक या प्रकाशक नहीं है। सभी समाचार, लेख, तस्वीरें और वीडियो पूर्णतः उन संबंधित तृतीय-पक्ष एजेंसियों के हैं जिनका नाम और स्रोत समाचार के साथ प्रदर्शित है। इसलिए, किसी भी व्यक्ति, संगठन या सरकार को यदि किसी भी खबर पर कोई आपत्ति, मानहानि का दावा, तथ्यात्मक सुधार या कॉपीराइट विवाद है, तो उन्हें सीधे उस संबंधित मूल समाचार एजेंसी/पब्लिशर से ही संपर्क करना होगा। Politics World या इसके मालिक को कोई शिकायत न भेजें।'
                    : 'Politics World operates strictly as an automated technological aggregation conduit and does NOT author, investigate, publish, or verify any news article, photograph, or video. All syndicated media and dispatches belong solely to their respective third-party reporting wire services and publishers. Consequently, any individual, political entity, corporation, or agency with a dispute, defamation claim, copyright complaint, or correction request MUST DIRECTLY CONTACT THE ORIGINATING NEWS BUREAU. Politics World does not entertain third-party editorial grievances.'}
                </p>
              </div>

              <div className={`p-5 rounded-sm border space-y-3 ${innerPanelClass}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${textTitleClass}`}>
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>{isHindi ? 'मूल समाचार एजेंसी से संपर्क करने की प्रक्रिया' : 'Protocol for Directly Contacting the Originating Publishing Bureau'}</span>
                </h4>
                <ol className={`list-decimal list-inside space-y-2 text-xs pl-2 ${textMutedClass}`}>
                  <li>
                    <strong>{isHindi ? 'मूल स्रोत की पहचान:' : 'Identify the Originating Bureau:'}</strong>{' '}
                    {isHindi
                      ? 'संबंधित समाचार कार्ड या आर्टिकल विवरण में दिए गए मूल समाचार एजेंसी के नाम और स्रोत को देखें।'
                      : 'Review the attribution header displayed on the article card or modal to identify the originating wire syndicate.'}
                  </li>
                  <li>
                    <strong>{isHindi ? 'एजेंसी के आधिकारिक पोर्टल पर जाएं:' : 'Visit the Agency’s Official Public Portal:'}</strong>{' '}
                    {isHindi
                      ? 'उस संबंधित मूल समाचार एजेंसी की आधिकारिक वेबसाइट पर जाएं जहां उनका संपादकीय कार्यालय, शिकायत प्रकोष्ठ या विधिक विभाग उपलब्ध होता है।'
                      : 'Navigate to the verified official portal of the attributed news organization to access their editorial ombudsman or legal bureau.'}
                  </li>
                  <li>
                    <strong>{isHindi ? 'सीधी कार्रवाई मूल प्रकाशक के साथ:' : 'File Directly with the Publishing Entity:'}</strong>{' '}
                    {isHindi
                      ? 'अपना तथ्यात्मक संशोधन, खंडन या कानूनी नोटिस सीधे उसी मूल एजेंसी को प्रेषित करें जिसने वह सामग्री बनाई और जारी की थी।'
                      : 'Transmit your factual correction, clarification, or formal communication directly to the originating bureau that produced and released the material.'}
                  </li>
                </ol>
                <div className={`p-3 rounded-xs text-xs font-mono border ${
                  isDark ? 'bg-[#030612] border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}>
                  ✦ {isHindi
                    ? 'विधिक स्पष्टीकरण: भारतीय IT Act धारा 79 एवं अमेरिकी CDA 230 के अनुसार तटस्थ तकनीकी मंच किसी तीसरे पक्ष की सामग्री के संबंध में की गई शिकायतों के लिए कानूनी रूप से उत्तरदायी नहीं है।'
                    : 'Statutory Stipulation: Under Section 79 IT Act and 47 U.S.C. § 230, automated conduits bear zero legal obligation or liability for third-party authored dispatches.'}
                </div>
              </div>
            </div>
          </section>

          {/* ARTICLE IX: DATA MINIMIZATION */}
          <section id="information-collected" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-mono font-bold">
                ARTICLE IX
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '९. हमारे द्वारा एकत्र की जाने वाली जानकारी (Data Minimization)'
                  : '9. Information We Collect & Data Minimization Principles'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <p>
                {isHindi
                  ? 'Politics World सख्त डेटा न्यूनीकरण (Data Minimization) के सिद्धांत का पालन करता है। हम किसी उपयोगकर्ता का राष्ट्रीय पहचान पत्र, आधार, बायोमेट्रिक, बैंक विवरण, क्रेडिट कार्ड या लाइव जीपीएस लोकेशन कभी एकत्र नहीं करते।'
                  : 'Politics World rigorously enforces data minimization standards. We never collect government identity credentials, biometric identifiers, banking details, payment instruments, or real-time physical GPS coordinates.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-sm border space-y-2 ${innerPanelClass}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${textTitleClass}`}>
                    <Eye className="w-4 h-4 text-sky-400" />
                    <span>{isHindi ? 'क. स्वचालित तकनीकी मेट्रिक्स' : 'A. Automated Technical Metrics'}</span>
                  </h4>
                  <ul className={`list-disc list-inside space-y-1 text-xs ${textMutedClass}`}>
                    <li>{isHindi ? 'सामान्य गैर-सटीक भौगोलिक क्षेत्र (देश/राज्य स्तर)।' : 'Truncated IP address indicating approximate jurisdiction (country/state level).'}</li>
                    <li>{isHindi ? 'ब्राउज़र प्रकार, स्क्रीन रेजोल्यूशन एवं ऑपरेटिंग सिस्टम।' : 'Browser user-agent, viewport resolution, and operating platform.'}</li>
                    <li>{isHindi ? 'साइट एक्सेस का समय, पेज विज़िट एवं सेशन अवधि।' : 'Access timestamps, page views, and session reading duration.'}</li>
                  </ul>
                </div>
                <div className={`p-4 rounded-sm border space-y-2 ${innerPanelClass}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${textTitleClass}`}>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>{isHindi ? 'ख. स्वैच्छिक पाठक प्रस्तुतियां' : 'B. Voluntary Reader Submissions'}</span>
                  </h4>
                  <ul className={`list-disc list-inside space-y-1 text-xs ${textMutedClass}`}>
                    <li>{isHindi ? 'न्यूज़लेटर सब्सक्राइब करते समय दिया गया ईमेल पता।' : 'Email addresses submitted when opting into our voluntary news brief.'}</li>
                    <li>{isHindi ? 'आर्टिकल पर की गई स्वैच्छिक टिप्पणियां या फीडबैक।' : 'Voluntary comments or policy inquiries submitted via feedback forms.'}</li>
                    <li>{isHindi ? 'आपके अपने डिवाइस पर सहेजे गए स्थानीय बुकमार्क।' : 'Locally cached bookmarked articles saved on your private device.'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ARTICLE X: COOKIES & LOCAL STORAGE */}
          <section id="cookies-storage" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-mono font-bold">
                ARTICLE X
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '१०. कुकीज़ एवं ब्राउज़र लोकल स्टोरेज (Local Storage)'
                  : '10. Cookies, Web Beacons & Browser Local Storage'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <p>
                {isHindi
                  ? 'यह वेब एप्लिकेशन आपकी व्यक्तिगत प्राथमिकताओं को याद रखने के लिए आपके अपने ब्राउज़र के लोकल स्टोरेज (localStorage) का उपयोग करता है:'
                  : 'Our web platform uses client-side web storage (localStorage) exclusively to preserve your personal interface preferences:'}
              </p>
              <ul className={`list-disc list-inside space-y-1.5 text-xs pl-2 ${textMutedClass}`}>
                <li>{isHindi ? 'भाषा प्राथमिकता (जैसे हिंदी, अंग्रेजी आदि)।' : 'Language choice across our multi-lingual interfaces.'}</li>
                <li>{isHindi ? 'डिस्प्ले थीम (डार्क मोड / ब्राइट मोड)।' : 'Visual display theme (Dark Mode / Bright Mode).'}</li>
                <li>{isHindi ? 'आपके द्वारा सहेजे गए समाचार (Saved Dispatches)।' : 'Locally stored bookmarked stories.'}</li>
                <li>
                  {isHindi
                    ? 'Google Analytics 4 (GA4 + IP Anonymization): केवल वेबसाइट के कुल पाठक ट्रैफ़िक, राज्य-वार रीच और विज्ञापन प्रदर्शन मापने हेतु (बिना किसी व्यक्तिगत पहचान के) उपयोग किया जाता है जब पब्लिशर द्वारा GA_MEASUREMENT_ID जुड़ा हो।'
                    : 'Google Analytics 4 (GA4 with IP Anonymization): Used solely for aggregated audience traffic, Indian state reach, and anonymized ad impression/click measurement when linked via GA_MEASUREMENT_ID.'}
                </li>
              </ul>
              <p className={`text-xs ${textMutedClass}`}>
                {isHindi
                  ? 'व्यक्तिगत ब्राउज़र प्राथमिकताएं पूरी तरह आपके अपने फोन या कंप्यूटर में सुरक्षित रहती हैं और हमारे सर्वर पर किसी पहचान से ट्रैक नहीं की जातीं।'
                  : 'Personal interface preferences remain strictly inside your local browser sandbox without individual identity tracking.'}
              </p>
            </div>
          </section>

          {/* ARTICLE XI: MULTILATERAL PRIVACY RIGHTS */}
          <section id="gdpr-ccpa-dpdp" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-mono font-bold">
                ARTICLE XI
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '११. बहुपक्षीय गोपनीयता अधिकार (DPDP Act 2023, GDPR, CCPA/CPRA)'
                  : '11. Multilateral Privacy Rights (DPDP Act, GDPR & CCPA/CPRA)'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <p>
                {isHindi
                  ? 'Politics World दुनिया भर के सभी पाठकों के वैधानिक गोपनीयता अधिकारों का पूर्ण सम्मान करता है:'
                  : 'Regardless of geographical location, Politics World respects international privacy governance standards:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                  <strong className={`block mb-1 text-sm font-serif ${textTitleClass}`}>
                    {isHindi ? 'भारत (DPDP Act 2023):' : 'India (DPDP Act 2023):'}
                  </strong>
                  <span className={textMutedClass}>
                    {isHindi
                      ? 'डेटा देखने, सुधारने, हटाने एवं शिकायत निवारण का पूर्ण अधिकार।'
                      : 'Right to access summary, correct inaccurate data, erase voluntary records, and seek grievance redressal.'}
                  </span>
                </div>
                <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                  <strong className={`block mb-1 text-sm font-serif ${textTitleClass}`}>
                    {isHindi ? 'यूरोपीय संघ (GDPR):' : 'European Union (GDPR):'}
                  </strong>
                  <span className={textMutedClass}>
                    {isHindi
                      ? 'अनुच्छेद 15-22 के अंतर्गत डेटा पहुंच, सुधार, पोर्टेबिलिटी एवं विस्मृत होने का अधिकार (Right to be Forgotten)।'
                      : 'Articles 15–22 entitlements: access, rectification, erasure, and objection to processing.'}
                  </span>
                </div>
                <div className={`p-4 rounded-sm border ${innerPanelClass}`}>
                  <strong className={`block mb-1 text-sm font-serif ${textTitleClass}`}>
                    {isHindi ? 'कैलिफोर्निया (CCPA/CPRA):' : 'California (CCPA / CPRA):'}
                  </strong>
                  <span className={textMutedClass}>
                    {isHindi
                      ? 'डेटा संग्रह की श्रेणियां जानने, हटाने एवं निजी डेटा की बिक्री न करने का अधिकार (Do Not Sell My Info)।'
                      : 'Right to know categories of collected metrics, right to delete, and strict non-discrimination.'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ARTICLE XII: ABSOLUTE LIMITATION OF LIABILITY */}
          <section id="limitation-liability" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/20 border border-amber-400 text-amber-400 text-xs font-mono font-bold">
                ARTICLE XII
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '१२. विधिक दायित्व की पूर्ण सीमा एवं शून्य उत्तरदायित्व (Hold Harmless & Indemnity)'
                  : '12. Absolute Limitation of Legal Liability & Hold Harmless Agreement'}
              </h3>
            </div>

            <div className="space-y-4 pt-1 text-xs sm:text-sm">
              <p className="uppercase font-mono text-amber-500 dark:text-amber-300 text-xs font-bold">
                {isHindi
                  ? 'कृपया इस धारा को ध्यानपूर्वक पढ़ें क्योंकि यह मंच और इसके संचालक के विधिक दायित्व को समाप्त करती है।'
                  : 'PLEASE READ THIS SECTION CAREFULLY AS IT ELIMINATES THE LEGAL LIABILITY OF THE PLATFORM OWNER.'}
              </p>
              <p className={textTitleClass}>
                {isHindi
                  ? 'कानून द्वारा अनुमत अधिकतम सीमा तक, किसी भी परिस्थिति में Politics World, इसके संस्थापक, मालिक, वेबमास्टर, होस्टिंग पार्टनर्स या तकनीकी सहयोगियों को किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, परिणामी, विशेष या दंडात्मक नुकसान के लिए उत्तरदायी नहीं ठहराया जाएगा जो निम्नलिखित में से किसी से उत्पन्न हो:'
                  : 'To the absolute maximum extent permissible under applicable international and domestic laws, in no event shall Politics World, its founder, owner, affiliates, hosting providers, or technical administrators be liable for any direct, indirect, incidental, consequential, special, or exemplary damages resulting from:'}
              </p>
              <ul className={`list-disc list-inside space-y-1.5 text-xs pl-2 ${textMutedClass}`}>
                <li>{isHindi ? 'किसी भी अधिकृत सिंडिकेशन नेटवर्क या एपीआई द्वारा प्रदान किए गए समाचार, हेडलाइन, फोटो, वीडियो या ऑडियो वाचन से।' : 'Any third-party syndicated news dispatch, headline, photograph, embedded video, or voice synthesis.'}</li>
                <li>{isHindi ? 'मूल समाचार स्रोत द्वारा की गई किसी तथ्यात्मक त्रुटि, अधूरी रिपोर्टिंग, गलत अनुवाद या मानहानिकारक दावे से।' : 'Any factual inaccuracy, defamatory claim, or editorial omission authored by an originating wire service.'}</li>
                <li>{isHindi ? 'Google AdSense, डायरेक्ट ब्रांड विज्ञापनों या बाहरी नेटवर्क द्वारा प्रदर्शित किए जाने वाले किसी विज्ञापन, उत्पाद या बाहरी लिंक से।' : 'Any advertisement delivered programmatically or directly by Google AdSense, direct sponsors, or external ad brokers.'}</li>
                <li>{isHindi ? 'इंटरनेट रुकावट, सर्वर डाउनटाइम, या तकनीकी एपीआई कनेक्शन में होने वाली अस्थायी खराबी से।' : 'Temporary platform maintenance, server latency, or automated syndication feed interruptions.'}</li>
              </ul>
              <div className={`p-4 rounded-sm border ${innerPanelClass} ${textTitleClass}`}>
                {isHindi
                  ? 'इस वेबसाइट का उपयोग करके आप स्पष्ट एवं अपरिवर्तनीय रूप से सहमत होते हैं कि आप किसी भी समाचार, वीडियो, फोटो, ऑडियो या विज्ञापन विवाद में Politics World और इसके संचालक/मालिक को पूर्ण रूप से दोषमुक्त (Hold Harmless & Indemnified) रखेंगे।'
                  : 'By accessing or utilizing Politics World, you expressly and irrevocably agree to defend, indemnify, and hold completely harmless Politics World, its owner, and administrators against any and all claims, damages, and legal costs arising from syndicated news content or external advertisements.'}
              </div>
            </div>
          </section>

          {/* ARTICLE XIII: GOVERNING LAW & JURISDICTION */}
          <section id="governing-law" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 ${luxuryCardClass}`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/20">
              <span className="px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-mono font-bold">
                ARTICLE XIII
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '१३. क्षेत्राधिकार, पृथक्करणीयता एवं लागू कानून'
                  : '13. Jurisdiction, Severability & Governing Law'}
              </h3>
            </div>

            <div className="space-y-3 pt-1 text-xs sm:text-sm">
              <p>
                {isHindi
                  ? 'यह नीति और वेबसाइट के संचालन से जुड़े सभी विषय लागू मध्यस्थ सुरक्षा कानूनों (Intermediary Protection Laws) के अनुसार शासित और व्याख्यायित होंगे। यदि किसी सक्षम न्यायालय द्वारा इस नीति का कोई प्रावधान किसी भी कारणवश अमान्य या अप्रवर्तनीय ठहराया जाता है, तो वह केवल उस सीमा तक अलग माना जाएगा और शेष सभी नियम व विधिक सुरक्षा कवच पूरी तरह प्रभावी एवं बाध्यकारी बने रहेंगे।'
                  : 'This Policy and any non-contractual disputes arising from platform access shall be interpreted in accordance with applicable statutory intermediary immunity laws. If any provision is deemed unenforceable by a court of competent jurisdiction, such provision shall be severed without invalidating the enforceability of the remaining safe harbor covenants.'}
              </p>
            </div>
          </section>

          {/* ARTICLE XIV: TECHNICAL & LEGAL COMPLIANCE DESK */}
          <section id="contact-officers" className={`rounded-sm p-7 sm:p-9 scroll-mt-24 border-2 shadow-2xl ${
            isDark
              ? 'bg-gradient-to-b from-[#0b1738] via-[#060c20] to-[#040816] border-amber-400/50'
              : 'bg-white border-amber-900/30 shadow-xl'
          }`}>
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-amber-500/30">
              <span className="px-2.5 py-1 rounded-xs bg-amber-400 text-slate-950 font-black text-xs font-mono">
                ARTICLE XIV
              </span>
              <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide uppercase ${textTitleClass}`}>
                {isHindi
                  ? '१४. तकनीकी एवं विधिक अनुपालन संपर्क (Platform Compliance Only)'
                  : '14. Platform Technical & Legal Compliance Contacts'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <p className={textMutedClass}>
                {isHindi
                  ? 'समाचार सामग्री से संबंधित किसी भी आपत्ति के लिए कृपया सीधे मूल समाचार एजेंसी से संपर्क करें। नीचे दिए गए संपर्क केवल वेबसाइट की तकनीकी कार्यप्रणाली एवं डेटा अनुपालन के लिए हैं:'
                  : 'For all editorial and news content disputes, please contact the originating publishing agency directly. The contacts below are strictly designated for technical website infrastructure and statutory data privacy:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Desk 1: Originating Wire Agency Direct Recourse */}
                <div className={`p-4 rounded-sm border space-y-2 ${innerPanelClass}`}>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-500 dark:text-amber-300 flex items-center gap-1.5 font-bold">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>{isHindi ? 'समाचार आपत्ति / खंडन' : 'Syndicated Content Recourse'}</span>
                  </div>
                  <div className={`text-xs font-semibold ${textTitleClass}`}>
                    {isHindi ? 'सीधे मूल एजेंसी से संपर्क करें' : 'Contact Originating Wire Bureau'}
                  </div>
                  <p className={`text-[11px] ${textMutedClass}`}>
                    {isHindi
                      ? 'प्रत्येक समाचार के साथ संबंधित मूल एजेंसी का नाम अंकित है। आपत्ति के लिए उसी एजेंसी के पोर्टल पर जाएं।'
                      : 'Each story credits its originating publisher. Contact their verified editorial ombudsman directly.'}
                  </p>
                </div>

                {/* Desk 2: Privacy Desk */}
                <div className={`p-4 rounded-sm border space-y-2 ${innerPanelClass}`}>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-500 dark:text-emerald-300 flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{isHindi ? 'गोपनीयता एवं कुकीज़' : 'Privacy & Cookie Opt-Out'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <code className={`text-xs font-mono font-bold truncate ${textTitleClass}`}>{privacyEmail}</code>
                    <button
                      onClick={() => handleCopyEmail(privacyEmail)}
                      className={`px-2 py-1 rounded-xs border text-xs cursor-pointer transition-colors ${
                        copiedEmail === privacyEmail
                          ? 'bg-emerald-500 text-white font-bold'
                          : isDark ? 'bg-[#0b1735] hover:bg-[#122452] border-amber-500/30 text-amber-300' : 'bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-800'
                      }`}
                    >
                      {copiedEmail === privacyEmail ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className={`text-[11px] ${textMutedClass}`}>
                    {isHindi
                      ? 'DPDP Act एवं GDPR कुकीज़ प्राथमिकताओं के लिए।'
                      : 'Dedicated to DPDP Act, GDPR data rights, and browser cache.'}
                  </p>
                </div>

                {/* Desk 3: Technical & Legal Infrastructure */}
                <div className={`p-4 rounded-sm border space-y-2 ${innerPanelClass}`}>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400 flex items-center gap-1.5 font-bold">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span>{isHindi ? 'प्लेटफ़ॉर्म विधिक अनुपालन' : 'Platform Legal Compliance'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <code className={`text-xs font-mono font-bold truncate ${textTitleClass}`}>{legalEmail}</code>
                    <button
                      onClick={() => handleCopyEmail(legalEmail)}
                      className={`px-2 py-1 rounded-xs border text-xs cursor-pointer transition-colors ${
                        copiedEmail === legalEmail
                          ? 'bg-emerald-500 text-white font-bold'
                          : isDark ? 'bg-[#0b1735] hover:bg-[#122452] border-amber-500/30 text-amber-300' : 'bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-800'
                      }`}
                    >
                      {copiedEmail === legalEmail ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className={`text-[11px] ${textMutedClass}`}>
                    {isHindi
                      ? 'वेबसाइट तकनीकी अवसंरचना एवं डोमेन अनुपालन।'
                      : 'Platform technical infrastructure and hosting compliance.'}
                  </p>
                </div>
              </div>

              {/* Diplomatic Seal & Signature Notarization Block */}
              <div className="mt-8 pt-6 border-t-2 border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center ${
                    isDark ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 'border-amber-800 text-amber-800 bg-amber-50'
                  }`}>
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase text-slate-900 dark:text-white">
                      OFFICIAL SEAL OF THE DIGITAL REGISTRY
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      Politics World Media Network · Sovereign Legal Gazette
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] text-slate-500">
                  <div>Notarized in Electronic Form · Verified 2026</div>
                  <div className="text-amber-500 font-bold">LEX ET VERITAS · ALL RIGHTS RESERVED</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===================================================================== */}
        {/* BOTTOM RETURN BAR                                                     */}
        {/* ===================================================================== */}
        <div className={`mt-14 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden ${
          isDark ? 'border-amber-500/20' : 'border-slate-300'
        }`}>
          <button
            onClick={onBack}
            className="px-7 py-3.5 rounded-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest shadow-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>{isHindi ? '← मुख्य समाचार पर वापस जाएं' : '← Return to Politics World Newsroom'}</span>
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`text-xs font-mono font-semibold cursor-pointer transition-colors flex items-center gap-1 ${textMutedClass} hover:text-amber-500`}
          >
            <span>Top of Document ↑</span>
          </button>
        </div>
      </main>
    </div>
  );
};
