import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Radio } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSubscribeClick: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenMonetizationHub?: (tab?: 'revenue' | 'wallet' | 'invoice' | 'ratecard' | 'adsense' | 'calculator' | 'guide') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSubscribeClick,
  onOpenPrivacyPolicy,
  onOpenMonetizationHub,
}) => {
  const { t, langCode } = useLanguage();

  return (
    <footer className="w-full bg-[#040814] border-t-2 border-[#1b2b54] text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        
        {/* Main Footer Grid with Vertical Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#142347]">
          
          {/* Brand & Masthead Summary - Left Column (Vertical) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4 text-left">
            <div>
              <h3 className="brand-title text-2xl sm:text-3xl font-serif font-black tracking-[0.18em] text-white uppercase select-none leading-none">
                POLITICS WORLD
              </h3>
              <img
                src="/images/politics_world_logo.png"
                alt="Politics World Official Logo"
                className="w-full max-w-[260px] sm:max-w-[300px] h-auto object-contain block mt-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]"
              />
              <p className="brand-motto text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-amber-200/80 font-serif mt-1.5">
                Veritas et Aequitas · Independent Global Journal of Record
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.footerAbout}
            </p>

            <div className="pt-1 flex flex-col gap-1 text-[11px] text-slate-500 font-mono tracking-wider">
              <span>ISSN 2831-9042 · Established MMXXIV</span>
              <span className="text-amber-400/90 font-sans font-medium">New Delhi · Washington · London · Geneva · Etc. Global Bureau</span>
            </div>

            <div className="pt-2">
              <button
                onClick={onSubscribeClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm"
              >
                <span>{t.getDispatch || 'Subscribe to Dispatch'}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Vertical Columns: Desks, Editorial Coverage & Standards */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* Column 1: DESKS (Vertical list) */}
            <div className="space-y-3.5 text-left">
              <div className="flex items-center gap-2 border-b border-amber-400/30 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                <h4 className="font-serif font-bold text-xs tracking-[0.16em] uppercase text-amber-400">
                  {t.politicalDesk || 'News Desks'}
                </h4>
              </div>
              <ul className="flex flex-col space-y-2.5 text-xs text-slate-300">
                <li>
                  <button
                    onClick={() => onNavigate('live-wire')}
                    className="hover:text-cyan-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <span className="font-semibold text-cyan-200">GNews.io Live Wire Stream</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('latest-news')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.globalBriefing}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('latest-news')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.whiteHouseCongress || 'White House & Capitol'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('latest-news')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.geopolitics || 'Geopolitics & Defense'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('latest-news')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.economyTrade || 'Economy & Trade'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: EDITORIAL COVERAGE (Vertical list) */}
            <div className="space-y-3.5 text-left">
              <div className="flex items-center gap-2 border-b border-amber-400/30 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                <h4 className="font-serif font-bold text-xs tracking-[0.16em] uppercase text-amber-400">
                  {t.desksCoverage || 'Editorial Coverage'}
                </h4>
              </div>
              <ul className="flex flex-col space-y-2.5 text-xs text-slate-300">
                <li>
                  <button
                    onClick={() => onNavigate('leader-rankings')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.leaderRankings}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('policy-tracker')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.capitolPolicy}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('fact-checks')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.factChecks}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('audio-digest')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.podcasts || 'Podcasts & Audio'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: STANDARDS & LEGAL (Vertical list) */}
            <div className="space-y-3.5 text-left">
              <div className="flex items-center gap-2 border-b border-amber-400/30 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                <h4 className="font-serif font-bold text-xs tracking-[0.16em] uppercase text-amber-400">
                  {langCode === 'hi' ? 'मानक एवं कानूनी' : 'Standards & Legal'}
                </h4>
              </div>
              <ul className="flex flex-col space-y-2.5 text-xs text-slate-300">
                <li>
                  <button
                    onClick={() => onOpenPrivacyPolicy?.()}
                    className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400 text-xs">§</span>
                    <span className="font-medium">{langCode === 'hi' ? 'विधिक राजपत्र एवं गोपनीयता नीति (Standards & Legal)' : 'Standards & Legal Gazette (Safe Harbor & Policy)'}</span>
                  </button>
                </li>
                {onOpenMonetizationHub && (
                  <>
                    <li>
                      <button
                        onClick={() => onOpenMonetizationHub?.('ratecard')}
                        className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                      >
                        <span className="text-amber-400 text-xs">◈</span>
                        <span className="font-medium">
                          {langCode === 'hi'
                            ? 'विज्ञापन व मीडिया रेट कार्ड (Advertise With Us)'
                            : 'Media & Advertising Rate Card (Sponsorships)'}
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onOpenMonetizationHub?.('wallet')}
                        className="hover:text-slate-100 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left text-slate-400 font-mono text-[11px]"
                      >
                        <span className="text-amber-400">🔒</span>
                        <span>
                          {langCode === 'hi'
                            ? 'पब्लिशर डेस्क (प्राइवेट लेजर व वॉलेट)'
                            : 'Publisher Admin Desk (Private Ledger & Payouts)'}
                        </span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Legal Tier */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div>
            {t.copyrightText}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 text-slate-400 text-xs">
            <span className="text-cyan-400 font-mono">
              {langCode === 'hi'
                ? 'अधिकृत वैश्विक सिंडिकेशन नेटवर्क द्वारा संचालित'
                : 'Powered by Authorized Global Syndication Networks'}
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Global Broadsheet Edition</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Independent Non-Partisan Journalism</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
