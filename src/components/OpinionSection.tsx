import React from 'react';
import { OPINION_COLUMNS, OpinionColumn } from '../data/newsData';
import { useLanguage } from '../context/LanguageContext';

interface OpinionSectionProps {
  onSelectColumn: (col: OpinionColumn) => void;
}

export const OpinionSection: React.FC<OpinionSectionProps> = ({ onSelectColumn }) => {
  const { t, hourlyOpinionColumns, currentHourSlot } = useLanguage();
  const columnsToDisplay = hourlyOpinionColumns && hourlyOpinionColumns.length > 0 ? hourlyOpinionColumns : OPINION_COLUMNS;

  return (
    <section id="opinion-voices" className="w-full bg-[#060c1d] border-b border-[#172750] py-12 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-10 border-b border-[#16274e]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">
              <span>{t.commentaryBoard}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono font-normal text-[11px]">Hourly Rotation Slot {currentHourSlot}:00</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {t.editorialVoicesTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md font-sans">
            {t.opinionSubtitle}
          </p>
        </div>

        {/* Opinion Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columnsToDisplay.map((column) => (
            <div
              key={column.id}
              onClick={() => onSelectColumn(column)}
              className="group flex flex-col justify-between bg-[#08122a] border border-[#16264d] hover:border-[#22396e] rounded-sm p-6 sm:p-7 transition-all duration-200 cursor-pointer"
            >
              <div>
                {/* Column Series Kicker */}
                <div className="flex items-center justify-between text-xs text-sky-400 font-semibold uppercase tracking-wider mb-3">
                  <span>{column.columnTitle}</span>
                  <span className="text-slate-500 font-mono text-[11px] font-normal">{column.readTime}</span>
                </div>

                {/* Column Headline */}
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-sky-300 transition-colors leading-snug mb-4 [text-wrap:balance]">
                  {column.headline}
                </h3>

                {/* Pull Quote */}
                <div className="py-4 my-2 border-y border-[#142347]">
                  <p className="text-xs sm:text-sm font-serif italic text-slate-300 leading-relaxed">
                    &ldquo;{column.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Author Masthead */}
              <div className="pt-4 border-t border-[#121f3f] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    {column.author}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">
                    {column.role}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#102047] border border-[#1d3368] flex items-center justify-center text-xs font-serif font-bold text-sky-300 group-hover:bg-sky-400 group-hover:text-[#060c1d] transition-colors">
                  {column.initials}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
