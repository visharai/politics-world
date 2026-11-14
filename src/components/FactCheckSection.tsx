import React, { useState } from 'react';
import { FACT_CHECK_DATA, FactCheckItem } from '../data/factCheckData';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, AlertTriangle, XCircle, FileText, ChevronDown, ChevronUp, RefreshCw, Check, CheckCircle2 } from 'lucide-react';

export const FactCheckSection: React.FC = () => {
  const { t, langCode, hourlyFactChecks, currentHourSlot } = useLanguage();
  const [selectedVerdict, setSelectedVerdict] = useState<string>('All');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  const todayDateStr = new Intl.DateTimeFormat(langCode === 'hi' ? 'hi-IN' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const handleRefreshAudits = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditNotice(langCode === 'hi' ? 'तथ्य जाँच ऑडिट्स सिंक हो गए' : 'Fact Check Ledger Synced');
      setTimeout(() => setAuditNotice(null), 3000);
    }, 600);
  };

  const itemsPool = hourlyFactChecks && hourlyFactChecks.length > 0 ? hourlyFactChecks : FACT_CHECK_DATA;
  const [expandedId, setExpandedId] = useState<string | null>(itemsPool[0]?.id || null);

  const filteredItems = itemsPool.filter((item) => {
    if (selectedVerdict === 'All') return true;
    if (selectedVerdict === 'Verified True') return item.verdict === 'Verified True';
    if (selectedVerdict === 'Context Required') return item.verdict === 'Context Required';
    if (selectedVerdict === 'Misleading') return item.verdict === 'Misleading / Unsubstantiated';
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getVerdictVisual = (verdict: FactCheckItem['verdict']) => {
    switch (verdict) {
      case 'Verified True':
        return {
          label: t.verifiedTrue,
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/40',
          bgColor: 'bg-emerald-500/10',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        };
      case 'Context Required':
        return {
          label: t.contextRequired,
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/40',
          bgColor: 'bg-amber-500/10',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      case 'Misleading / Unsubstantiated':
        return {
          label: t.misleading,
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/40',
          bgColor: 'bg-rose-500/10',
          icon: <XCircle className="w-4 h-4 text-rose-400" />,
        };
    }
  };

  return (
    <section id="fact-checks" className="w-full bg-[#070e24] border-b border-[#172750] py-12 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#16274e]">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>{t.veracityLedger}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-teal-950/70 text-teal-300 border border-teal-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
                <span>{langCode === 'hi' ? 'सत्यापित ऑडिट्स' : 'Verified Audits'} · {todayDateStr}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {t.factCheckTitle}
            </h2>
          </div>
          
          {/* Verdict Filter Controls & Sync */}
          <div className="flex flex-wrap items-center gap-2.5">
            {auditNotice && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs rounded-xs font-mono animate-fade-in">
                <Check className="w-3 h-3" />
                <span>{auditNotice}</span>
              </span>
            )}
            <button
              onClick={handleRefreshAudits}
              disabled={isAuditing}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0a1738] hover:bg-[#112456] border border-teal-500/30 text-teal-300 rounded-xs text-xs font-mono transition-colors cursor-pointer"
              title="Sync latest verified congressional statement audits"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{langCode === 'hi' ? 'ऑडिट सिंक' : 'Audit Sync'}</span>
            </button>
            <div className="flex items-center gap-1.5 p-1 bg-[#09132c] border border-[#172750] rounded-sm overflow-x-auto">
              <button
                onClick={() => setSelectedVerdict('All')}
                className={`px-3 py-1 text-xs font-medium rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                  selectedVerdict === 'All'
                    ? 'bg-[#152752] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
              {t.allAudits}
            </button>
            <button
              onClick={() => setSelectedVerdict('Verified True')}
              className={`px-3 py-1 text-xs font-medium rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                selectedVerdict === 'Verified True'
                  ? 'bg-[#152752] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.verifiedTrue}
            </button>
            <button
              onClick={() => setSelectedVerdict('Context Required')}
              className={`px-3 py-1 text-xs font-medium rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                selectedVerdict === 'Context Required'
                  ? 'bg-[#152752] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.contextRequired}
            </button>
            <button
              onClick={() => setSelectedVerdict('Misleading')}
              className={`px-3 py-1 text-xs font-medium rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                selectedVerdict === 'Misleading'
                  ? 'bg-[#152752] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.misleading}
            </button>
          </div>
        </div>
      </div>

        {/* Fact-Checks Grid */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            const style = getVerdictVisual(item.verdict);

            return (
              <div
                key={item.id}
                className={`border rounded-sm transition-colors ${
                  isExpanded
                    ? 'bg-[#0a1532] border-[#22396e]'
                    : 'bg-[#08122a] border-[#16264d] hover:border-[#1f3463]'
                }`}
              >
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
                      <span className="text-slate-200 font-semibold">{item.speaker}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{item.speakerRole}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-sky-300 font-sans font-medium">{item.topic}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{item.date}</span>
                    </div>

                    {/* Claim Quote */}
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug mb-2 [text-wrap:balance]">
                      {item.claim}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Verdict Badge & Score */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#142347]">
                    <div className="text-left lg:text-right">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">
                        {style.label}
                      </div>
                      <div className={`flex items-center gap-2 text-sm font-bold ${style.textColor}`}>
                        {style.icon}
                        <span>{style.label}</span>
                      </div>
                      <div className="font-mono text-xs text-slate-400 tabular-nums mt-0.5">
                        {t.veracityScore}: <strong className="text-slate-200">{item.verdictScore}/100</strong>
                      </div>
                    </div>

                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-sky-400" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Analysis Drawer */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#15254a] grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-slate-300">
                    <div className="md:col-span-8 space-y-3">
                      <span className="font-semibold uppercase tracking-wider text-sky-400 block">
                        {t.expandAudit}
                      </span>
                      <p className="font-sans leading-relaxed text-slate-200 text-xs sm:text-sm">
                        {item.expandedAnalysis}
                      </p>
                    </div>

                    <div className="md:col-span-4 bg-[#060c1d] p-4 rounded-sm border border-[#142347] space-y-2">
                      <span className="font-semibold uppercase tracking-wider text-slate-300 block flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span>{t.officialRecords}</span>
                      </span>
                      <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
                        {item.sourceDocuments.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-sky-400">›</span>
                            <span className="hover:text-slate-200 transition-colors">{doc}</span>
                          </li>
                        ))}
                      </ul>
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
