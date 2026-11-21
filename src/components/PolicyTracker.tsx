import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, ChevronUp, RefreshCw, Check, Landmark, ExternalLink } from 'lucide-react';

interface LiveBillEntry {
  id: string;
  billNumber: string;
  title: string;
  chamber: string;
  jurisdiction: 'india' | 'senate' | 'house';
  status: string;
  stageProgress: number;
  summary: string;
  nextMilestone: string;
  sourceName: string;
  sourceUrl?: string;
  publishedLabel?: string;
}

export const PolicyTracker: React.FC = () => {
  const { t, langCode, translatedBills } = useLanguage();
  const isHi = langCode === 'hi';

  const [liveBills, setLiveBills] = useState<LiveBillEntry[]>([]);
  const [translatedDisplayBills, setTranslatedDisplayBills] = useState<LiveBillEntry[]>([]);
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [sourcesLabel, setSourcesLabel] = useState<string[]>([]);
  const [updatedIstLabel, setUpdatedIstLabel] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chamberFilter, setChamberFilter] = useState<'All' | 'India' | 'Senate' | 'House'>('All');
  const [isRefreshingBills, setIsRefreshingBills] = useState(false);
  const [billNotice, setBillNotice] = useState<string | null>(null);

  const todayDateStr = new Intl.DateTimeFormat(isHi ? 'hi-IN' : 'en-IN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  const fetchLiveBills = useCallback(async (forceRefresh = false) => {
    setIsRefreshingBills(true);
    try {
      const res = await fetch(`/api/bills/live${forceRefresh ? '?refresh=1' : ''}`);
      if (!res.ok) throw new Error('Bill feed unavailable');
      const data = await res.json();
      if (data?.ok && Array.isArray(data.bills) && data.bills.length > 0) {
        setLiveBills(data.bills);
        setIsLiveFeed(Boolean(data.isLiveFeed));
        setSourcesLabel(Array.isArray(data.sources) ? data.sources : []);
        setUpdatedIstLabel(data.updatedIstLabel || null);
        setExpandedId((prev) => prev || data.bills[0]?.id || null);
        if (forceRefresh) {
          setBillNotice(
            isHi
              ? `ताज़ा संसदीय बिल सिंक हुए (${data.updatedIstLabel || 'लाइव'})`
              : `Live Docket Synced (${data.updatedIstLabel || 'Updated'})`
          );
          setTimeout(() => setBillNotice(null), 3500);
        }
        return;
      }
      throw new Error('No live bills returned');
    } catch {
      if (forceRefresh) {
        setBillNotice(isHi ? 'आर्काइव डॉकेट लोड हुआ' : 'Fallback Archive Loaded');
        setTimeout(() => setBillNotice(null), 3000);
      }
    } finally {
      setIsRefreshingBills(false);
    }
  }, [isHi]);

  useEffect(() => {
    void fetchLiveBills(false);
    const interval = window.setInterval(() => {
      void fetchLiveBills(false);
    }, 15 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [fetchLiveBills]);

  // Base list: real live server feed if available, else baseline fallback
  const baseBills: LiveBillEntry[] =
    liveBills.length > 0
      ? liveBills
      : translatedBills.map((b) => ({
          id: b.id,
          billNumber: b.billNumber,
          title: b.title,
          chamber: b.chamber,
          jurisdiction: b.chamber.toLowerCase().includes('senate') ? 'senate' : 'house',
          status: b.status,
          stageProgress: b.oddsOfPassage,
          summary: b.summary,
          nextMilestone: b.nextMilestone,
          sourceName: 'Editorial Docket',
        }));

  // Translate dynamic server bill items automatically when user switches away from English
  useEffect(() => {
    if (liveBills.length === 0 || langCode === 'en') {
      setTranslatedDisplayBills(baseBills);
      return;
    }

    let cancelled = false;
    const translateDynamicBills = async () => {
      try {
        const textsToTranslate: string[] = [];
        liveBills.forEach((b) => {
          textsToTranslate.push(b.title, b.chamber, b.status, b.summary, b.nextMilestone);
        });
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: textsToTranslate, targetLang: langCode }),
        });
        if (!res.ok || cancelled) {
          setTranslatedDisplayBills(liveBills);
          return;
        }
        const data = await res.json();
        const tr: string[] = Array.isArray(data?.translated) ? data.translated : [];
        if (tr.length !== textsToTranslate.length || cancelled) {
          setTranslatedDisplayBills(liveBills);
          return;
        }
        const mapped = liveBills.map((b, i) => ({
          ...b,
          title: tr[i * 5] || b.title,
          chamber: tr[i * 5 + 1] || b.chamber,
          status: tr[i * 5 + 2] || b.status,
          summary: tr[i * 5 + 3] || b.summary,
          nextMilestone: tr[i * 5 + 4] || b.nextMilestone,
        }));
        if (!cancelled) setTranslatedDisplayBills(mapped);
      } catch {
        if (!cancelled) setTranslatedDisplayBills(liveBills);
      }
    };

    void translateDynamicBills();
    return () => {
      cancelled = true;
    };
  }, [liveBills, langCode, translatedBills]);

  const activeBills = langCode === 'en' || liveBills.length === 0 ? baseBills : (translatedDisplayBills.length > 0 ? translatedDisplayBills : baseBills);

  useEffect(() => {
    if (!expandedId && activeBills.length > 0) {
      setExpandedId(activeBills[0].id);
    }
  }, [activeBills, expandedId]);

  const filteredBills = activeBills.filter((bill) => {
    if (chamberFilter === 'India') return bill.jurisdiction === 'india';
    if (chamberFilter === 'Senate') return bill.jurisdiction === 'senate';
    if (chamberFilter === 'House') return bill.jurisdiction === 'house';
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
                <span className={`h-1.5 w-1.5 rounded-full ${isLiveFeed ? 'bg-emerald-400 animate-ping' : 'bg-sky-400'}`} />
                <span>
                  {isLiveFeed
                    ? isHi
                      ? `लाइव संसदीय फ़ीड · ${todayDateStr}`
                      : `Live Daily Docket · ${todayDateStr}`
                    : isHi
                      ? `संसदीय सत्र · ${todayDateStr}`
                      : `Floor Docket · ${todayDateStr}`}
                </span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {t.capitolBillTracker}
            </h2>
            {isLiveFeed && sourcesLabel.length > 0 && (
              <p className="text-[11px] font-mono text-slate-400 mt-1.5">
                {isHi ? 'लाइव स्रोत:' : 'Verified Daily Feeds:'} {sourcesLabel.join(' + ')}
                {updatedIstLabel ? ` · ${isHi ? 'अपडेटेड' : 'Synced'} ${updatedIstLabel}` : ''}
              </p>
            )}
          </div>

          {/* Chamber Filter Buttons & Live Sync */}
          <div className="flex flex-wrap items-center gap-2.5">
            {billNotice && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-950/80 border border-sky-500/40 text-sky-300 text-xs rounded-xs font-mono animate-fade-in">
                <Check className="w-3 h-3" />
                <span>{billNotice}</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => void fetchLiveBills(true)}
              disabled={isRefreshingBills}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a1738] hover:bg-[#112456] border border-sky-500/30 text-sky-300 rounded-xs text-xs font-mono transition-colors cursor-pointer disabled:opacity-60"
              title={isHi ? 'ताज़ा भारतीय संसद व अमेरिकी कांग्रेस बिल सिंक करें' : 'Sync latest India Parliament & US Congress bills'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingBills ? 'animate-spin' : ''}`} />
              <span>{isHi ? 'बिल सिंक' : 'Docket Sync'}</span>
            </button>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#09132c] border border-[#172750] rounded-sm">
              <button
                type="button"
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
                type="button"
                onClick={() => setChamberFilter('India')}
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                  chamberFilter === 'India'
                    ? 'bg-[#152752] text-amber-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isHi ? 'भारतीय संसद' : 'India Parliament'}
              </button>
              <button
                type="button"
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
                type="button"
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
          {filteredBills.length === 0 ? (
            <div className="p-8 text-center border border-[#16274e] rounded-sm bg-[#08122a] text-xs font-mono text-slate-400">
              {isHi
                ? 'इस सदन में अभी कोई सक्रिय बिल नहीं मिला। "बिल सिंक" पर क्लिक करें।'
                : 'No bills matched this chamber filter. Select "All Chambers" or click Docket Sync.'}
            </div>
          ) : (
            filteredBills.map((bill) => {
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
                    type="button"
                    onClick={() => toggleExpand(bill.id)}
                    className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
                        <span className={`font-semibold ${bill.jurisdiction === 'india' ? 'text-amber-400' : 'text-sky-400'}`}>
                          {bill.billNumber}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{bill.chamber}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-200 font-sans font-medium">{bill.status}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                        {bill.title}
                      </h3>
                    </div>

                    {/* Legislative Stage Metric */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                      <div className="text-left sm:text-right">
                        <div className="text-[11px] uppercase tracking-wider text-slate-400">
                          {isHi ? 'विधायी प्रगति' : 'Legislative Stage'}
                        </div>
                        <div className="font-mono text-lg font-bold tabular-nums text-white flex items-center gap-2">
                          <span>{bill.stageProgress}%</span>
                          <div className="w-16 h-1.5 bg-[#142347] rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full ${
                                bill.stageProgress >= 85
                                  ? 'bg-emerald-400'
                                  : bill.stageProgress >= 60
                                  ? 'bg-sky-400'
                                  : 'bg-amber-400'
                              }`}
                              style={{ width: `${bill.stageProgress}%` }}
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

                        <div className="flex flex-wrap items-center gap-4 pt-1">
                          <div>
                            <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                              {isHi ? 'आधिकारिक स्रोत' : 'Official Source'}
                            </span>
                            <span className="font-mono text-slate-200">{bill.sourceName}</span>
                          </div>
                          {bill.publishedLabel && (
                            <div>
                              <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                                {isHi ? 'सत्र / अपडेट' : 'Session / Date'}
                              </span>
                              <span className="font-mono text-slate-200">{bill.publishedLabel}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-5 bg-[#060c1d] p-4 rounded-sm border border-[#142347] space-y-3 font-mono flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                            {t.nextMilestone}
                          </span>
                          <p className="font-sans text-sky-300 leading-relaxed">
                            {bill.nextMilestone}
                          </p>
                        </div>

                        {bill.sourceUrl && (
                          <div className="pt-2 border-t border-[#121f3f] flex justify-end">
                            <a
                              href={bill.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                            >
                              <span>{isHi ? 'आधिकारिक बिल रिकॉर्ड देखें' : 'View Official Bill Record'}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
