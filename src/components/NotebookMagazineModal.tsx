import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft, Check, Download, ShoppingBag, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NotebookMagazineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMonetizationHub?: () => void;
}

export const NotebookMagazineModal: React.FC<NotebookMagazineModalProps> = ({
  isOpen,
  onClose,
  onOpenMonetizationHub,
}) => {
  const { langCode } = useLanguage();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const handleOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  const handleDownloadSample = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Notebook Magazine Official Showcase & Ad Booking"
    >
      {/* Background click overlay to dismiss */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Card (Perfect Centering, Never Cut Off) */}
      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-[#060c20] border-2 border-amber-500/70 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-slate-100 flex flex-col overflow-hidden animate-scale-in"
      >
        {/* ============================================================ */}
        {/* TOP BAR WITH PROMINENT BACK BUTTON AND CLOSE BUTTON          */}
        {/* ============================================================ */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#0a1844] via-[#0d1d4d] to-[#0a1844] border-b border-[#1f3570] flex items-center justify-between gap-3 shrink-0">
          {/* Prominent Back / Close Button on Left */}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#142654] hover:bg-[#1e387a] active:scale-95 text-amber-300 hover:text-white border border-amber-400/50 text-xs font-bold cursor-pointer transition-all shadow-xs"
            title="वापस जाएं (Back to website)"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{langCode === 'hi' ? '← वापस जाएं (Back)' : '← Back / Return'}</span>
          </button>

          {/* Center Badge */}
          <div className="hidden xs:flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300">
              {langCode === 'hi' ? 'नोटबुक पत्रिका · विशेष संस्करण' : 'NOTEBOOK MAGAZINE · ISSUE 47'}
            </span>
          </div>

          {/* Right Floating Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full bg-[#142654] hover:bg-rose-900/60 active:scale-95 text-slate-300 hover:text-white border border-[#233c7a] cursor-pointer transition-all"
            aria-label="Close modal"
            title="बंद करें (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* MODAL BODY (SCROLLABLE & FULLY VISIBLE)                      */}
        {/* ============================================================ */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-start">
            {/* Magazine Cover Thumbnail */}
            <div className="w-44 sm:w-56 shrink-0 mx-auto sm:mx-0 rounded-md overflow-hidden border-2 border-amber-400/70 shadow-[0_10px_35px_rgba(212,175,55,0.3)] bg-[#040816] group">
              <img
                src="/src/assets/images/notebook_magazine_cover_1794245314092.jpg"
                alt="Notebook Magazine Quarterly Issue Cover"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
              />
            </div>

            {/* Publication Details */}
            <div className="flex-1 space-y-3.5 text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  {langCode === 'hi' ? 'आधिकारिक प्रायोजित प्रकाशन' : 'OFFICIAL SPONSORED JOURNAL'}
                </span>
                <span className="text-xs text-slate-400 font-mono">WINTER 2026 EDITION</span>
              </div>

              <div>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-wide">
                  NOTEBOOK MAGAZINE
                </h3>
                <p className="text-xs sm:text-sm text-amber-300 font-serif font-semibold mt-0.5">
                  {langCode === 'hi'
                    ? 'त्रैमासिक कूटनीतिक समीक्षा · स्टेटक्राफ्ट एवं संप्रभुता विशेषांक'
                    : 'Quarterly Diplomatic Intelligence Review · Statecraft & Sovereignty'}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {langCode === 'hi'
                  ? 'नोटबुक पत्रिका अंतरराष्ट्रीय नीति, व्हाइट हाउस, ब्रसेल्स, नई दिल्ली और टोक्यो के शीर्ष विश्लेषकों द्वारा लिखित प्रतिष्ठित शोध पत्रिका है। 180 पृष्ठों का यह विशेषांक 2026 की आर्थिक, तकनीकी संप्रभुता व कूटनीतिक दिशा पर केंद्रित है।'
                  : 'Notebook Magazine is an elite international journal of statecraft and geopolitical intelligence. Featuring in-depth treatises from former ambassadors, central bankers, and strategic analysts across G7 and Indo-Pacific capitals.'}
              </p>

              {/* Table of Contents Preview */}
              <div className="bg-[#091538] border border-[#1e346e] rounded-md p-3.5 text-xs space-y-2 font-sans">
                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{langCode === 'hi' ? 'इस अंक के प्रमुख शोध लेख:' : 'Featured Dossiers in Issue 47:'}</span>
                </div>
                <ul className="space-y-1.5 text-slate-200">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">1.</span>
                    <span>The New Silk Road: Ports, Rare Earths & Strategic Corridors (p. 14)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">2.</span>
                    <span>Crisis in Multilateral Diplomacy: Treaties for the 2026 Epoch (p. 28)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">3.</span>
                    <span>Sovereign Semiconductor Reserves & AI Computing Alliances (p. 58)</span>
                  </li>
                </ul>
              </div>

              {/* Price & Delivery Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="font-serif font-black text-xl text-amber-300">
                  {langCode === 'hi' ? '₹1,999 / $25 USD' : '$25.00 USD / £20.00'}
                </span>
                <span className="px-2.5 py-1 rounded-xs bg-[#102354] text-slate-200 text-[11px] font-mono border border-[#213f8c]">
                  {langCode === 'hi' ? 'हार्डकवर प्रिंट + डिजिटल PDF संस्करण' : 'Archival Hardcover + Digital PDF'}
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ACTION BUTTONS & ADVERTISER BOOKING                         */}
          {/* ============================================================ */}
          <div className="pt-4 border-t border-[#182852] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleOrder}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xs transition-all shadow-md active:scale-98 cursor-pointer"
              >
                {orderSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                    <span>{langCode === 'hi' ? 'ऑर्डर दर्ज हुआ!' : 'Order Placed!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{langCode === 'hi' ? 'प्रिंट कॉपी ऑर्डर करें' : 'Order Print & Digital Copy'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSample}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#091538] hover:bg-[#112457] border border-cyan-500/40 text-cyan-300 text-xs font-semibold rounded-xs transition-colors cursor-pointer"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>{langCode === 'hi' ? 'सैंपल डाउनलोड हुआ!' : 'Sample Downloaded!'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{langCode === 'hi' ? 'सैंपल प्रीव्यू PDF' : 'Free Excerpt PDF'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Advertiser Booking Link */}
            <button
              onClick={() => {
                onClose();
                onOpenMonetizationHub?.();
              }}
              className="text-xs text-amber-300 hover:text-amber-200 font-mono underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <span>{langCode === 'hi' ? 'पत्रिका में विज्ञापन स्लॉट बुक करें ↗' : 'Book Magazine Ad Space ↗'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Safety Strip with extra Close Button */}
        <div className="px-5 py-2.5 bg-[#040816] border-t border-[#16274e] flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] font-mono">
            Politics World Media Group · Global Syndication
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-xs cursor-pointer transition-colors"
          >
            {langCode === 'hi' ? 'बंद करें (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
