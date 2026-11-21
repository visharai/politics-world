import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Radio, CheckCircle2, BarChart3, ShieldCheck } from 'lucide-react';
import { getGA4Status, initGA4, trackGA4Event, GA4StatusInfo } from '../utils/ga4Analytics';

const INDIA_PULSE_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const AGE_BRACKETS = ['18-24', '25-34', '35-44', '45-54', '55+'] as const;

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSubscribeClick?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenMonetizationHub?: (tab?: 'revenue' | 'wallet' | 'invoice' | 'ratecard' | 'calculator' | 'guide' | 'reports') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacyPolicy,
  onOpenMonetizationHub,
}) => {
  const { t, langCode } = useLanguage();
  const isHi = langCode === 'hi';
  const [pulseState, setPulseState] = useState('Delhi');
  const [pulseAge, setPulseAge] = useState<(typeof AGE_BRACKETS)[number]>('25-34');
  const [pulseSubmitted, setPulseSubmitted] = useState(false);
  const [pulseSubmitting, setPulseSubmitting] = useState(false);
  const [ga4Status, setGa4Status] = useState<GA4StatusInfo>(() => getGA4Status());
  const [pulseTotal, setPulseTotal] = useState<number>(0);

  useEffect(() => {
    try {
      if (localStorage.getItem('pw_reader_pulse_done_v1') === '1') {
        setPulseSubmitted(true);
      }
    } catch {
      // ignore
    }

    void initGA4().then((st) => setGa4Status(st));

    const handleGa4Event = (e: Event) => {
      const detail = (e as CustomEvent<GA4StatusInfo>).detail;
      if (detail) setGa4Status(detail);
    };
    window.addEventListener('pw-ga4-status', handleGa4Event);

    fetch('/api/ads/telemetry/summary', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.audiencePulse && typeof d.audiencePulse.totalResponses === 'number') {
          setPulseTotal(d.audiencePulse.totalResponses);
        }
      })
      .catch(() => {
        // ignore offline
      });

    return () => {
      window.removeEventListener('pw-ga4-status', handleGa4Event);
    };
  }, []);

  const handleSubmitReaderPulse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pulseSubmitting || pulseSubmitted) return;
    setPulseSubmitting(true);
    try {
      const res = await fetch('/api/audience/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateName: pulseState, ageBracket: pulseAge }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.audiencePulse && typeof data.audiencePulse.totalResponses === 'number') {
          setPulseTotal(data.audiencePulse.totalResponses);
        } else {
          setPulseTotal((prev) => prev + 1);
        }
        trackGA4Event('reader_pulse_submit', {
          state_name: pulseState,
          age_bracket: pulseAge,
          edition_lang: langCode,
        });
        setPulseSubmitted(true);
        try {
          localStorage.setItem('pw_reader_pulse_done_v1', '1');
          localStorage.setItem('pw_reader_pulse_state_v1', pulseState);
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore transient network failure
    } finally {
      setPulseSubmitting(false);
    }
  };

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
                    onClick={() => onNavigate('audio-digest')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.podcasts || 'Podcasts & Audio'}</span>
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
                    onClick={() => onNavigate('leader-rankings')}
                    className="hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400/70 text-[10px]">›</span>
                    <span>{t.leaderRankings}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: STANDARDS & LEGAL (Vertical list) */}
            <div className="space-y-3.5 text-left">
              <div className="flex items-center gap-2 border-b border-amber-400/30 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                <h4 className="font-serif font-bold text-xs tracking-[0.16em] uppercase text-amber-400">
                  {isHi ? 'मानक एवं कानूनी' : 'Standards & Legal'}
                </h4>
              </div>
              <ul className="flex flex-col space-y-2.5 text-xs text-slate-300">
                <li>
                  <button
                    onClick={() => onOpenPrivacyPolicy?.()}
                    className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 text-left"
                  >
                    <span className="text-amber-400 text-xs">§</span>
                    <span className="font-medium">{isHi ? 'विधिक राजपत्र एवं गोपनीयता नीति (Standards & Legal)' : 'Standards & Legal Gazette (Safe Harbor & Policy)'}</span>
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
                          {isHi
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
                          {isHi
                            ? 'पब्लिशर डेस्क (भारत INR लेजर व ट्रेज़री)'
                            : 'India Publisher Desk (INR Ledger & Treasury)'}
                        </span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>

          </div>
        </div>

        {/* Discreet Footer Analytics Bar: Google Analytics 4 (GA4) + All-India Reader Pulse */}
        <div className="py-5 border-b border-[#142347] space-y-3.5 text-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-2.5 text-slate-300">
              <BarChart3 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-semibold text-white">
                  {isHi ? 'अखिल भारतीय पाठक सर्वेक्षण (वैकल्पिक):' : 'All-India Reader Pulse (Optional):'}
                </span>{' '}
                <span className="text-slate-400">
                  {isHi
                    ? 'नाम या लॉगिन के बिना केवल अपना राज्य और आयु वर्ग साझा करें ताकि भारत-व्यापी संपादकीय रीच बेहतर हो।'
                    : 'Anonymously share your Indian State & Age bracket (no name or login) to support verified national readership reporting.'}
                </span>
              </div>
            </div>

            {pulseSubmitted ? (
              <div className="inline-flex items-center gap-1.5 text-emerald-400 font-medium shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isHi ? 'धन्यवाद — आपका राज्य व आयु वर्ग जुड़ गया है।' : 'Recorded — Thank you for contributing to India readership metrics.'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReaderPulse} className="flex flex-wrap items-center gap-2 shrink-0">
                <select
                  value={pulseState}
                  onChange={(e) => setPulseState(e.target.value)}
                  aria-label="Select Indian State"
                  className="px-2.5 py-1.5 rounded-lg bg-[#08122b] border border-[#1d3263] text-slate-200 text-xs focus:outline-none focus:border-amber-400/60"
                >
                  {INDIA_PULSE_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <select
                  value={pulseAge}
                  onChange={(e) => setPulseAge(e.target.value as (typeof AGE_BRACKETS)[number])}
                  aria-label="Select Age Group"
                  className="px-2.5 py-1.5 rounded-lg bg-[#08122b] border border-[#1d3263] text-slate-200 text-xs focus:outline-none focus:border-amber-400/60"
                >
                  {AGE_BRACKETS.map((br) => (
                    <option key={br} value={br}>
                      {isHi ? `${br} वर्ष` : `${br} yrs`}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={pulseSubmitting}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-semibold text-xs whitespace-nowrap transition-colors cursor-pointer"
                >
                  {pulseSubmitting ? (isHi ? 'भेज रहे हैं...' : 'Saving...') : isHi ? 'सहयोग करें' : 'Submit'}
                </button>
              </form>
            )}
          </div>

          {/* Dedicated Google Analytics 4 (GA4 + Google Signals) Footer Integration Strip */}
          <div className="pt-3 border-t border-[#0f1d3d] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
            <div className="flex flex-wrap items-center gap-2 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-semibold text-slate-200">Google Analytics 4 (GA4)</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              {ga4Status.connected ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {isHi ? `सक्रिय (${ga4Status.maskedId})` : `Active (${ga4Status.maskedId})`}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>
                    {isHi
                      ? 'GA4 इंटीग्रेटेड · Env में GA_MEASUREMENT_ID जोड़ते ही लाइव'
                      : 'GA4 Integrated · Set GA_MEASUREMENT_ID in Env to Activate'}
                  </span>
                </span>
              )}
              <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-slate-400 tabular-nums">
                {isHi
                  ? `फ़र्स्ट-पार्टी रीच: ${pulseTotal.toLocaleString('en-IN')} प्रतिक्रियाएँ`
                  : `Reader Pulse: ${pulseTotal.toLocaleString('en-IN')} check-ins`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-sans">
              {onOpenPrivacyPolicy && (
                <button
                  type="button"
                  onClick={() => onOpenPrivacyPolicy()}
                  className="text-sky-400 hover:text-sky-300 hover:underline cursor-pointer"
                >
                  {isHi ? 'GA4 एवं गोपनीयता नीति' : 'GA4 & Cookie Notice'}
                </button>
              )}
              {onOpenMonetizationHub && (
                <button
                  type="button"
                  onClick={() => onOpenMonetizationHub('reports')}
                  className="text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                >
                  {isHi ? 'विज्ञापन रीच व रिपोर्ट्स →' : '7. Reach & Reports →'}
                </button>
              )}
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
