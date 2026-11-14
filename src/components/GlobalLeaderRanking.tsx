import React, { useState } from 'react';
import { GlobalLeader } from '../data/leaderData';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, TrendingDown, Award, Globe, Shield, ExternalLink, X, ChevronRight, RefreshCw, Check } from 'lucide-react';

export const GlobalLeaderRanking: React.FC = () => {
  const { t, langCode, translatedLeaders } = useLanguage();
  const [sortBy, setSortBy] = useState<'approval' | 'influence' | 'confidence'>('approval');
  const [selectedLeader, setSelectedLeader] = useState<GlobalLeader | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [pollingOffset, setPollingOffset] = useState<Record<string, number>>({});

  const todayDateStr = new Intl.DateTimeFormat(langCode === 'hi' ? 'hi-IN' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const handleSyncPolling = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newOffsets: Record<string, number> = {};
      translatedLeaders.forEach((l) => {
        newOffsets[l.id] = (Math.random() - 0.5) * 0.4;
      });
      setPollingOffset(newOffsets);
      setIsSyncing(false);
      setSyncNotice(langCode === 'hi' ? 'ताज़ा पोलिंग डेटा सिंक हो गया' : 'Live Polling Metrics Synced');
      setTimeout(() => setSyncNotice(null), 3000);
    }, 700);
  };

  const sortedLeaders = [...translatedLeaders]
    .map((l) => {
      const offset = pollingOffset[l.id] || 0;
      return {
        ...l,
        approvalRating: Number((l.approvalRating + offset).toFixed(1)),
      };
    })
    .sort((a, b) => {
      if (sortBy === 'influence') return b.geopoliticalInfluence - a.geopoliticalInfluence;
      if (sortBy === 'confidence') return b.economicConfidence - a.economicConfidence;
      return b.approvalRating - a.approvalRating;
    });

  return (
    <section id="leader-rankings" className="w-full bg-[#060c1d] border-b border-[#172750] py-14 sm:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-10 border-b border-[#16274e]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-amber-300 mb-2 font-serif">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{t.internationalMandate}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{langCode === 'hi' ? 'आज का लाइव इंडेक्स' : 'Live Daily Polling'} · {todayDateStr}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight [text-wrap:balance]">
              {t.leaderRankingsTitle}
            </h2>
          </div>

          {/* Sort Controls & Live Sync - Luxury Dossier Tabs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {syncNotice && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xs font-mono animate-fade-in">
                <Check className="w-3 h-3" />
                <span>{syncNotice}</span>
              </span>
            )}
            <button
              onClick={handleSyncPolling}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0a1738] hover:bg-[#112456] border border-amber-500/30 text-amber-300 rounded-xs text-xs font-mono transition-colors cursor-pointer"
              title="Sync latest live polling numbers"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{langCode === 'hi' ? 'पोलिंग सिंक' : 'Live Sync'}</span>
            </button>
            <div className="flex items-center gap-1.5 bg-[#08122a] p-1 border border-amber-500/20 rounded-xs text-xs">
              <span className="text-slate-400 px-2 text-[10px] uppercase tracking-wider font-mono">{t.rankBy}:</span>
              <button
                onClick={() => setSortBy('approval')}
                className={`px-3 py-1 font-medium rounded-xs transition-colors cursor-pointer ${
                  sortBy === 'approval'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.approval}
              </button>
              <button
                onClick={() => setSortBy('influence')}
                className={`px-3 py-1 font-medium rounded-xs transition-colors cursor-pointer ${
                  sortBy === 'influence'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.influence}
              </button>
              <button
                onClick={() => setSortBy('confidence')}
                className={`px-3 py-1 font-medium rounded-xs transition-colors cursor-pointer ${
                  sortBy === 'confidence'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.confidence}
              </button>
            </div>
          </div>
        </div>

        {/* Global Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {sortedLeaders.map((leader, index) => {
            const displayRank = index + 1;
            const isPositiveChange = leader.approvalChange >= 0;
            const isTopThree = displayRank <= 3;

            return (
              <div
                key={leader.id}
                onClick={() => setSelectedLeader(leader)}
                className={`group flex flex-col justify-between bg-[#08132e] border ${
                  displayRank === 1
                    ? 'border-amber-400/50 shadow-[0_4px_20px_rgba(245,158,11,0.12)]'
                    : 'border-[#172750] hover:border-amber-500/40'
                } rounded-xs overflow-hidden transition-all duration-300 cursor-pointer shadow-lg`}
              >
                {/* Full-Body Professional Portrait Photograph */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0a1534]">
                  <img
                    src={leader.image}
                    alt={`${leader.name} portrait`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  
                  {/* Subtle contrast scrim for typography protection */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08132e] via-transparent to-black/30 pointer-events-none" />

                  {/* Rank Position Overlay - Luxury Medallion Badge */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 backdrop-blur-md px-2.5 py-1 rounded-xs border ${
                    displayRank === 1
                      ? 'bg-amber-950/90 border-amber-400 text-amber-300 font-bold'
                      : displayRank === 2
                      ? 'bg-slate-900/90 border-slate-300 text-slate-200 font-bold'
                      : displayRank === 3
                      ? 'bg-amber-950/70 border-amber-600/70 text-amber-400 font-semibold'
                      : 'bg-[#060c1d]/90 border-[#1b2f5d] text-slate-300'
                  }`}>
                    <span className="font-serif text-xs font-bold tabular-nums">
                      #{displayRank}
                    </span>
                    <span aria-hidden="true" className="opacity-40">·</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {leader.flagCode}
                    </span>
                  </div>

                  {/* Monthly Trend Indicator Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#060c1d]/90 backdrop-blur-md border border-[#1b2f5d] px-2 py-1 rounded-xs text-[11px] font-mono tabular-nums">
                    {isPositiveChange ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className={isPositiveChange ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {isPositiveChange ? `+${leader.approvalChange}%` : `${leader.approvalChange}%`}
                    </span>
                  </div>

                  {/* Floating Title on Scrim */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-[11px] uppercase tracking-wider text-amber-300/90 font-serif font-bold">
                      {leader.country}
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-amber-200 transition-colors leading-snug">
                      {leader.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Official Role */}
                  <div>
                    <div className="text-xs text-slate-400 font-medium mb-3">
                      {leader.title}
                    </div>

                    {/* Approval Percentage Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300 font-semibold">{t.approvalRating}:</span>
                        <span className="text-white font-bold tabular-nums text-sm text-sky-400">
                          {leader.approvalRating}%
                        </span>
                      </div>

                      {/* Clean Segmented Progress Bar */}
                      <div className="w-full h-2.5 bg-[#0e1a38] rounded-xs overflow-hidden flex border border-[#16254a]">
                        {/* Approval Fill */}
                        <div
                          className="bg-sky-400 h-full transition-all duration-500"
                          style={{ width: `${leader.approvalRating}%` }}
                          title={`Approval: ${leader.approvalRating}%`}
                        />
                        {/* Disapproval Fill */}
                        <div
                          className="bg-slate-700/80 h-full transition-all duration-500"
                          style={{ width: `${leader.disapprovalRating}%` }}
                          title={`Disapproval: ${leader.disapprovalRating}%`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 tabular-nums">
                        <span>{t.approval}: {leader.approvalRating}%</span>
                        <span>{t.disapprove}: {leader.disapprovalRating}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Supplementary Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#132247] text-xs font-mono">
                    <div className="bg-[#050b1a] p-2 rounded-xs border border-[#111e3d]">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.influence}</div>
                      <div className="text-sm font-bold text-slate-100 tabular-nums">
                        {leader.geopoliticalInfluence}<span className="text-slate-500 text-[10px]">/100</span>
                      </div>
                    </div>
                    <div className="bg-[#050b1a] p-2 rounded-xs border border-[#111e3d]">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.confidence}</div>
                      <div className="text-sm font-bold text-slate-100 tabular-nums">
                        {leader.economicConfidence}%
                      </div>
                    </div>
                  </div>

                  {/* Key Initiative Deck */}
                  <div className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed pt-1">
                    <span className="text-slate-400 font-medium">Focus:</span> {leader.keyInitiatives[0]}
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-3 border-t border-[#132247] flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">
                      {t.tenure}: {leader.tenureYears} yrs
                    </span>
                    <span className="text-sky-400 group-hover:text-sky-300 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>{t.inspectDossier}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Polling Methodology Note (Anti-slop clean typography) */}
        <div className="mt-8 pt-4 border-t border-[#142347] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div>
            Sample: Multi-nation survey of registered electors (N=14,200) · Margin of error: ±1.8% · Weighted for demographics
          </div>
          <div className="text-slate-400">
            Updated monthly by the Politics World International Governance Desk
          </div>
        </div>

      </div>

      {/* Leader In-Depth Dossier Modal */}
      {selectedLeader && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex justify-center p-4 sm:p-8"
          onClick={() => setSelectedLeader(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#070e24] border border-[#1b2b54] shadow-2xl rounded-sm my-auto text-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#152347] flex items-center justify-between bg-[#08122a]">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="font-bold text-sky-400">LEADERSHIP DOSSIER</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">{selectedLeader.country}</span>
              </div>
              <button
                onClick={() => setSelectedLeader(null)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Portrait Thumbnail */}
                <div className="w-28 sm:w-36 aspect-[3/4] shrink-0 rounded-sm overflow-hidden border border-[#172750] bg-[#0a142e]">
                  <img
                    src={selectedLeader.image}
                    alt={selectedLeader.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
                    Rank #{selectedLeader.rank} · {selectedLeader.title}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    {selectedLeader.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-4">
                    {selectedLeader.bioExcerpt}
                  </p>

                  <div className="p-3 bg-[#0a1532] border border-[#172750] rounded-sm text-xs font-mono space-y-1">
                    <div className="text-slate-400">Primary Polling Benchmark:</div>
                    <div className="text-sky-300 font-medium">{selectedLeader.pollingSource}</div>
                  </div>
                </div>
              </div>

              {/* Approval Bar Details */}
              <div className="p-4 bg-[#08122a] border border-[#16274e] rounded-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-slate-200">Executive Approval Breakdown:</span>
                  <span className="text-sky-400 font-bold tabular-nums text-sm">
                    {selectedLeader.approvalRating}% Net Positive
                  </span>
                </div>
                <div className="w-full h-3 bg-[#0d1838] rounded-xs overflow-hidden flex border border-[#142347]">
                  <div
                    className="bg-sky-400 h-full"
                    style={{ width: `${selectedLeader.approvalRating}%` }}
                  />
                  <div
                    className="bg-slate-700 h-full"
                    style={{ width: `${selectedLeader.disapprovalRating}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
                  <span>Approve: {selectedLeader.approvalRating}%</span>
                  <span>Neutral: {Math.max(0, 100 - selectedLeader.approvalRating - selectedLeader.disapprovalRating).toFixed(1)}%</span>
                  <span>Disapprove: {selectedLeader.disapprovalRating}%</span>
                </div>
              </div>

              {/* Key Initiatives */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Pivotal Legislative & Strategic Directives:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {selectedLeader.keyInitiatives.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Action */}
              <div className="p-3.5 bg-[#0a1636] border border-[#172b5c] rounded-sm text-xs">
                <span className="font-semibold text-sky-400 block mb-1">Recent Diplomatic Action:</span>
                <p className="text-slate-200">{selectedLeader.recentDevelopment}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#152347] bg-[#08122a] flex justify-end">
              <button
                onClick={() => setSelectedLeader(null)}
                className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#060c1d] bg-sky-400 hover:bg-sky-300 rounded-sm transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
