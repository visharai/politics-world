import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, Info, Sparkles, ChevronRight, DollarSign } from 'lucide-react';
import { AdSenseConfig } from './MonetizationHubModal';

interface InArticleAdBannerProps {
  onOpenMonetizationHub?: () => void;
}

const IN_ARTICLE_SPONSORS = [
  {
    sponsor: 'Global Security & Cyber Resilience Conclave 2026',
    tagline: 'Diplomatic & Critical Infrastructure Summit',
    headline: 'Defending Sovereign Grids & Subsea Cables: Geneva Ministerial',
    description: 'Accreditation open for sovereign delegations, chief risk officers, and defense policy fellows.',
    cta: 'Register Diplomatic Access',
    badge: 'SPECIAL CONCLAVE',
    accent: '#38bdf8',
    bg: 'from-[#06182c] via-[#09152b] to-[#040c1a]',
  },
  {
    sponsor: 'Indo-Pacific Strategic Metals & Trade Alliance',
    tagline: 'Critical Supply Chain Initiative',
    headline: 'Bilateral Critical Minerals Accord & Sovereign Reserves',
    description: 'Executive briefing on semiconductor supply chains and bilateral customs corridors.',
    cta: 'Download Executive Whitepaper',
    badge: 'STRATEGIC REPORT',
    accent: '#34d399',
    bg: 'from-[#051c1e] via-[#081822] to-[#030d12]',
  },
  {
    sponsor: 'Aequitas Policy Forecasting & Global Intel Terminal',
    tagline: 'Enterprise Geopolitical Intelligence',
    headline: 'Real-Time Legislative Tracking for Embassies & Multinational Desks',
    description: 'Empowering foreign ministries with verified automated news and regulatory intelligence.',
    cta: 'Request Embassy Trial',
    badge: 'INSTITUTIONAL INTEL',
    accent: '#fbbf24',
    bg: 'from-[#1a1405] via-[#141005] to-[#080601]',
  },
];

export const InArticleAdBanner: React.FC<InArticleAdBannerProps> = ({
  onOpenMonetizationHub,
}) => {
  const { langCode } = useLanguage();
  const { isDark } = useTheme();

  const [sponsorIndex, setSponsorIndex] = useState(0);
  const [config, setConfig] = useState<AdSenseConfig>(() => {
    try {
      const saved = localStorage.getItem('politics_world_adsense_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
      headerSlotId: '9876543210',
      inArticleSlotId: '1234567890',
      adMode: 'sponsor',
      isAutoAdsEnabled: true,
    };
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('politics_world_adsense_settings');
        if (saved) setConfig(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const curSponsor = IN_ARTICLE_SPONSORS[sponsorIndex];

  return (
    <aside
      aria-label="In-Article Advertisement"
      className="my-7 p-3 sm:p-4 rounded-md border border-[#1d3263] bg-[#050a18] text-slate-200 select-none shadow-sm"
    >
      {/* Top Disclosure Strip */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider sm:tracking-widest text-slate-400 mb-2 px-0.5 sm:px-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-bold text-amber-400">
            {langCode === 'hi' ? 'विज्ञापन (SPONSORED)' : 'ADVERTISEMENT'}
          </span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-slate-500 hidden sm:inline">
            {langCode === 'hi' ? 'इन-आर्टिकल मिड-रोल स्लॉट' : 'In-Article Mid-Roll Broadview'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenMonetizationHub && (
            <button
              onClick={onOpenMonetizationHub}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 text-[10px] font-sans font-semibold cursor-pointer"
            >
              <DollarSign className="w-3 h-3" />
              <span>{langCode === 'hi' ? 'यहाँ विज्ञापन दें' : 'Advertise Here'}</span>
            </button>
          )}

          <span className="flex items-center gap-0.5 text-slate-500 text-[9px]">
            <Info className="w-2.5 h-2.5" />
            <span>AdChoices</span>
          </span>
        </div>
      </div>

      {config.adMode === 'adsense' ? (
        /* Real AdSense Responsive Slot */
        <div className="min-h-[100px] border border-dashed border-sky-500/40 rounded p-4 bg-[#030714] text-center flex flex-col items-center justify-center">
          <span className="text-[11px] font-mono font-bold text-sky-400">
            GOOGLE ADSENSE IN-ARTICLE RESPONSIVE UNIT
          </span>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            data-ad-client="{config.publisherId}" · data-ad-slot="{config.inArticleSlotId}"
          </p>
          {onOpenMonetizationHub && (
            <button
              onClick={onOpenMonetizationHub}
              className="mt-2 text-[11px] text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Configure in Monetization Hub →
            </button>
          )}
        </div>
      ) : (
        /* Premium Washington Post Style Curated Sponsor Creative */
        <div
          className={`relative rounded border p-3 sm:p-4 bg-gradient-to-r ${curSponsor.bg} border-[#1a2e5c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 overflow-hidden`}
        >
          <div className="flex-1 min-w-0 pr-0 sm:pr-2 w-full">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span
                className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border shrink-0"
                style={{
                  color: curSponsor.accent,
                  borderColor: `${curSponsor.accent}40`,
                  backgroundColor: `${curSponsor.accent}15`,
                }}
              >
                {curSponsor.badge}
              </span>
              <span className="text-[11px] font-semibold text-slate-300 truncate">
                {curSponsor.sponsor}
              </span>
            </div>

            <h5 className="font-serif font-bold text-xs sm:text-sm text-white line-clamp-2 sm:line-clamp-1">
              {curSponsor.headline}
            </h5>

            <p className="text-[11px] text-slate-400 line-clamp-2 sm:line-clamp-1 mt-0.5 font-sans">
              {curSponsor.description}
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {onOpenMonetizationHub ? (
              <button
                type="button"
                onClick={onOpenMonetizationHub}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xs font-serif font-bold text-[11px] uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 shadow flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
              >
                <span>{curSponsor.cta}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="w-full sm:w-auto px-3 py-1.5 rounded-xs font-serif font-bold text-[11px] uppercase tracking-wider text-slate-950 bg-amber-300 flex items-center justify-center gap-1">
                <span>{curSponsor.cta}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
