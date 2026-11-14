import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  ExternalLink,
  Info,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RotateCw,
  Code2,
} from 'lucide-react';

export interface SponsorCampaign {
  id: string;
  sponsorName: string;
  tagline: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  badge: string;
  bgColorDark: string;
  bgColorLight: string;
  accentColor: string;
}

const SPONSOR_CAMPAIGNS: SponsorCampaign[] = [
  {
    id: 'campaign-davos-2026',
    sponsorName: 'Global Geopolitical Forum · Davos 2026',
    tagline: 'Annual Multilateral Conclave',
    headline: 'World Ministerial & Diplomatic Summit: Reshaping Global Security',
    description: 'Join 1,200 foreign ministers, central bankers, and strategic analysts in Geneva.',
    ctaText: 'Reserve Official Delegate Pass',
    ctaUrl: '#ad-davos-conclave',
    badge: 'OFFICIAL SUMMIT',
    bgColorDark: 'from-[#0a1838] via-[#08122c] to-[#040919]',
    bgColorLight: 'from-[#e0eafc] via-[#eef2f7] to-[#ffffff]',
    accentColor: '#38bdf8',
  },
  {
    id: 'campaign-maritime-energy',
    sponsorName: 'Indo-Pacific Maritime & Trade Accord',
    tagline: 'Strategic Supply Chain Initiative',
    headline: 'Critical Minerals & Maritime Trade Security Conference 2026',
    description: 'Securing sea-lanes, semiconductor supply chains, and sovereign energy resilience.',
    ctaText: 'Access Executive Briefing',
    ctaUrl: '#ad-maritime-trade',
    badge: 'STRATEGIC PARTNER',
    bgColorDark: 'from-[#071d2b] via-[#05141e] to-[#030a10]',
    bgColorLight: 'from-[#e2f1f8] via-[#f0f8fa] to-[#ffffff]',
    accentColor: '#34d399',
  },
  {
    id: 'campaign-intel-terminal',
    sponsorName: 'Aequitas Global Intelligence Terminal',
    tagline: 'Institutional Geopolitical Data',
    headline: 'Real-Time Legislative Tracking & Foreign Policy Predictive Feeds',
    description: 'Authoritative data streams used by 45+ foreign ministries and embassies worldwide.',
    ctaText: 'Request Institutional Trial',
    ctaUrl: '#ad-intel-terminal',
    badge: 'ENTERPRISE INTEL',
    bgColorDark: 'from-[#1a1205] via-[#120d03] to-[#080501]',
    bgColorLight: 'from-[#fef5e7] via-[#fffbf2] to-[#ffffff]',
    accentColor: '#fbbf24',
  },
];

export interface TopLeaderboardAdProps {
  onOpenMonetizationHub?: () => void;
}

export const TopLeaderboardAd: React.FC<TopLeaderboardAdProps> = ({
  onOpenMonetizationHub,
}) => {
  const { langCode } = useLanguage();
  const { isDark } = useTheme();

  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [adMode, setAdMode] = useState<'sponsor' | 'adsense'>('sponsor');
  const [publisherId, setPublisherId] = useState('ca-pub-XXXXXXXXXXXXXXXX');
  const [headerSlotId, setHeaderSlotId] = useState('9876543210');

  useEffect(() => {
    const syncSettings = () => {
      try {
        const saved = localStorage.getItem('politics_world_adsense_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.adMode) setAdMode(parsed.adMode);
          if (parsed.publisherId) setPublisherId(parsed.publisherId);
          if (parsed.headerSlotId) setHeaderSlotId(parsed.headerSlotId);
        }
      } catch {}
    };
    syncSettings();
    window.addEventListener('storage', syncSettings);
    return () => window.removeEventListener('storage', syncSettings);
  }, []);

  // Rotate sponsor campaigns automatically every 24 seconds for high-end engagement
  useEffect(() => {
    if (isDismissed) return;
    const interval = setInterval(() => {
      setActiveCampaignIndex((prev) => (prev + 1) % SPONSOR_CAMPAIGNS.length);
    }, 24000);
    return () => clearInterval(interval);
  }, [isDismissed]);

  const campaign = SPONSOR_CAMPAIGNS[activeCampaignIndex];

  if (isDismissed) {
    return (
      <div className="w-full bg-[#030612] border-b border-[#111f42] py-1 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>
            {langCode === 'hi'
              ? 'विज्ञापन छुपाया गया है (The Washington Post Standard Ad Slot)'
              : 'Advertisement collapsed (The Washington Post Standard Leaderboard Ad Slot)'}
          </span>
          <button
            onClick={() => setIsDismissed(false)}
            className="text-amber-400 hover:text-amber-300 underline font-sans font-semibold cursor-pointer text-xs"
          >
            {langCode === 'hi' ? 'विज्ञापन पुनः दिखाएं' : 'Show Advertisement'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="Advertisement Banner"
      className={`w-full border-b transition-colors duration-200 select-none ${
        isDark
          ? 'bg-[#030612] border-[#13234d] text-slate-200'
          : 'bg-[#f4f7fb] border-slate-300 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5">
        {/* Top Tiny Ad Disclosure Bar (Washington Post / NYT Style) */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest text-slate-400 mb-1 px-0.5 sm:px-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-amber-500/90 dark:text-amber-400">
              {langCode === 'hi' ? 'विज्ञापन' : 'ADVERTISEMENT'}
            </span>
            <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
            <span className="hidden sm:inline text-slate-500">
              {langCode === 'hi' ? 'वाशिंगटन पोस्ट शैली लीडरबोर्ड' : 'The Washington Post Leaderboard System'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Monetization & AdSense Revenue Portal Trigger */}
            <button
              onClick={() => onOpenMonetizationHub?.()}
              className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer text-[9px] sm:text-[10px] font-sans font-semibold bg-amber-500/10 hover:bg-amber-500/20 px-1.5 sm:px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap"
              title="Monetization & AdSense Revenue Setup"
            >
              <Code2 className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{langCode === 'hi' ? 'कमाई एवं AdSense' : 'Earning & AdSense'}</span>
            </button>

            {/* Next Sponsor Cycle */}
            <button
              onClick={() => setActiveCampaignIndex((prev) => (prev + 1) % SPONSOR_CAMPAIGNS.length)}
              className="hidden sm:flex items-center gap-1 text-slate-500 hover:text-amber-300 transition-colors cursor-pointer text-[10px] font-sans"
              title="Rotate Sponsor"
            >
              <RotateCw className="w-3 h-3" />
              <span>Rotate</span>
            </button>

            {/* AdChoices Info Icon */}
            <span className="flex items-center gap-0.5 text-slate-500 text-[9px]" title="AdChoices Information">
              <Info className="w-2.5 h-2.5" />
              <span>AdChoices</span>
            </span>

            {/* Close / Collapse Ad */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-0.5 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
              title="Hide Advertisement"
              aria-label="Hide advertisement"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* LEADERBOARD CREATIVE DISPLAY (728x90 / 970x90 Broadview Banner)       */}
        {/* ==================================================================== */}
        {adMode === 'sponsor' ? (
          <div
            className={`relative rounded-md border px-3 py-2 sm:px-4 sm:py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 sm:gap-3 overflow-hidden shadow-xs transition-all duration-300 bg-gradient-to-r ${
              isDark
                ? `${campaign.bgColorDark} border-[#1d3368]`
                : `${campaign.bgColorLight} border-slate-300`
            }`}
          >
            {/* Ambient Background Accent Glow */}
            <div
              className="absolute -right-12 -top-12 w-44 h-44 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ backgroundColor: campaign.accentColor }}
            />

            {/* Left Content Column */}
            <div className="flex-1 min-w-0 pr-0 md:pr-2 w-full">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <span
                  className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-extrabold uppercase tracking-wider sm:tracking-widest border shrink-0"
                  style={{
                    color: campaign.accentColor,
                    borderColor: `${campaign.accentColor}50`,
                    backgroundColor: `${campaign.accentColor}15`,
                  }}
                >
                  {campaign.badge}
                </span>

                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 font-semibold truncate">
                  {campaign.sponsorName}
                </span>

                <span className="hidden lg:inline text-slate-600">·</span>
                <span className="hidden lg:inline text-[11px] text-slate-400 italic">
                  {campaign.tagline}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm md:text-[15px] font-serif font-black tracking-tight text-slate-900 dark:text-white line-clamp-2 sm:line-clamp-1">
                {campaign.headline}
              </h4>

              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 sm:line-clamp-1 font-sans">
                {campaign.description}
              </p>
            </div>

            {/* Right Action Column */}
            <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-700/30">
              <div className="hidden xl:flex flex-col text-right font-mono text-[10px] text-slate-400">
                <span className="text-emerald-400 font-bold">● VERIFIED SPONSOR</span>
                <span>Official Partner 2026</span>
              </div>

              <button
                type="button"
                onClick={() => onOpenMonetizationHub?.()}
                className="w-full md:w-auto px-3.5 py-1.5 sm:py-2 rounded-xs font-serif font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#060c1d] bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span>{campaign.ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        ) : (
          /* Google AdSense Responsive Leaderboard Unit */
          <div className="w-full min-h-[90px] border-2 border-dashed border-sky-500/40 rounded-md p-4 bg-[#050b1d] text-center flex flex-col items-center justify-center">
            <span className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider">
              GOOGLE ADSENSE RESPONSIVE LEADERBOARD UNIT (728x90 / 970x250)
            </span>
            <p className="text-xs text-slate-300 mt-1 max-w-xl font-mono">
              data-ad-client="{publisherId}" · data-ad-slot="{headerSlotId}" · Responsive Broadview
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => onOpenMonetizationHub?.()}
                className="text-[11px] text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                {langCode === 'hi' ? 'कमाई केंद्र में सेटिंग्स बदलें →' : 'Configure in Monetization Hub →'}
              </button>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
};
