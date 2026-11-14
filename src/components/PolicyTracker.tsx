import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, ChevronUp, RefreshCw, Check, Landmark, ShieldCheck } from 'lucide-react';

export const PolicyTracker: React.FC = () => {
  const { t, langCode, translatedBills, currentHourSlot } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(translatedBills[0]?.id || null);
  const [chamberFilter, setChamberFilter] = useState<'All' | 'Senate' | 'House'>('All');
  const [isRefreshingBills, setIsRefreshingBills] = useState(false);
  const [billNotice, setBillNotice] = useState<string | null>(null);

  const todayDateStr = new Intl.DateTimeFormat(langCode === 'hi' ? 'hi-IN' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const handleRefreshBills = () => {
    setIsRefreshingBills(true);
    setTimeout(() => {
      setIsRefreshingBills(false);
      setBillNotice(langCode === 'hi' ? 'संसदीय बिल रडार अद्यतन हुआ' : 'Capitol Docket Synced');
      setTimeout(() => setBillNotice(null), 3000);
    }, 600);
  };

  const filteredBills = translatedBills.filter((bill) => {
    if (chamberFilter === 'Senate') return bill.chamber.toLowerCase().includes('senate');
    if (chamberFilter === 'House') return bill.chamber.toLowerCase().includes('house') || bill.chamber.toLowerCase().includes('representatives');
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="policy-tracker" className="w-full bg-[#060c1d] border-b border-[#172750] py-12 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#16274e]">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-sky-400" />
                <span>{t.statutoryRadar}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-sky-950/70 text-sky-300 border border-sky-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
                <span>{langCode === 'hi' ? 'लाइव संसदीय सत्र' : 'Live Floor Docket'} · {todayDateStr}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {t.capitolBillTracker}
            </h2>
          </div>
          
          {/* Chamber Filter Buttons & Sync */}
          <div className="flex flex-wrap items-center gap-2.5">
            {billNotice && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-950/80 border border-sky-500/40 text-sky-300 text-xs rounded-xs font-mono animate-fade-in">
                <Check className="w-3 h-3" />
                <span>{billNotice}</span>
              </span>
            )}
            <button
              onClick={handleRefreshBills}
              disabled={isRefreshingBills}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0a1738] hover:bg-[#112456] border border-sky-500/30 text-sky-300 rounded-xs text-xs font-mono transition-colors cursor-pointer"
              title="Sync latest Capitol Hill & Parliamentary bills"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingBills ? 'animate-spin' : ''}`} />
              <span>{langCode === 'hi' ? 'बिल सिंक' : 'Docket Sync'}</span>
            </button>
            <div className="flex items-center gap-1.5 p-1 bg-[#09132c] border border-[#172750] rounded-sm">
              <button
                onClick={() => setChamberFilter('All')}
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                  chamberFilter === 'All'
                    ? 'bg-[#152752] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.allChambers}
              </button>
            <button
              onClick={() => setChamberFilter('Senate')}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                chamberFilter === 'Senate'
                  ? 'bg-[#152752] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.senateChamber}
            </button>
            <button
              onClick={() => setChamberFilter('House')}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                chamberFilter === 'House'
                  ? 'bg-[#152752] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.houseChamber}
            </button>
          </div>
        </div>
      </div>

        {/* Bills Interactive List */}
        <div className="space-y-4">
          {filteredBills.map((bill) => {
            const isExpanded = expandedId === bill.id;
            return (
              <div
                key={bill.id}
                className={`border rounded-sm transition-colors ${
                  isExpanded
                    ? 'bg-[#0a1532] border-sky-500/40'
                    : 'bg-[#08122a] border-[#16274e] hover:border-[#22396d]'
                }`}
              >
                {/* Bill Row Header */}
                <button
                  onClick={() => toggleExpand(bill.id)}
                  className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
                      <span className="font-semibold text-sky-400">{bill.billNumber}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{bill.chamber}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-300 font-sans font-medium">{bill.status}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                      {bill.title}
                    </h3>
                  </div>

                  {/* Passage Odds Metric (Zero-pill, tabular numbers) */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400">
                        {t.oddsOfPassage}
                      </div>
                      <div className="font-mono text-lg font-bold tabular-nums text-white flex items-center gap-2">
                        <span>{bill.oddsOfPassage}%</span>
                        <div className="w-16 h-1.5 bg-[#142347] rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full ${
                              bill.oddsOfPassage >= 75
                                ? 'bg-emerald-400'
                                : bill.oddsOfPassage >= 50
                                ? 'bg-sky-400'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${bill.oddsOfPassage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-sky-400" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-[#15254a] grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-slate-300">
                    <div className="md:col-span-7 space-y-3">
                      <div>
                        <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                          {t.executiveSummary}
                        </span>
                        <p className="font-sans leading-relaxed text-slate-200">
                          {bill.summary}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                          {t.primarySponsors}
                        </span>
                        <div className="flex flex-wrap gap-2 text-slate-300">
                          {bill.sponsors.map((sponsor, idx) => (
                            <span key={idx} className="font-medium">
                              {sponsor}
                              {idx < bill.sponsors.length - 1 && <span className="text-slate-600 ml-2">·</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-5 bg-[#060c1d] p-4 rounded-sm border border-[#142347] space-y-3 font-mono">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                          {t.projectedFloorVote}
                        </span>
                        <div className="flex items-center gap-4 text-xs tabular-nums">
                          <span className="text-emerald-400">{t.yeas}: {bill.voteEstimate.yeas}</span>
                          <span className="text-rose-400">{t.nays}: {bill.voteEstimate.nays}</span>
                          <span className="text-slate-400">{t.undecided}: {bill.voteEstimate.undecided}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#121f3f]">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                          {t.nextMilestone}
                        </span>
                        <p className="font-sans text-sky-300">
                          {bill.nextMilestone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
