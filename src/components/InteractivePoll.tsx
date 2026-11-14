import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Check, ShieldCheck } from 'lucide-react';

export const InteractivePoll: React.FC = () => {
  const { t, translatedPoll } = useLanguage();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [votesData, setVotesData] = useState(translatedPoll.options);
  const [totalCount, setTotalCount] = useState(translatedPoll.totalVotes);
  const [userComment, setUserComment] = useState('');
  const [submittedComment, setSubmittedComment] = useState<string | null>(null);

  // Sync if poll options change on language switch
  React.useEffect(() => {
    setVotesData(translatedPoll.options);
    setTotalCount(translatedPoll.totalVotes + (hasVoted ? 1 : 0));
  }, [translatedPoll, hasVoted]);

  const handleVote = (id: string) => {
    if (hasVoted) return;
    setSelectedOptionId(id);
    setHasVoted(true);
    setTotalCount((prev) => prev + 1);

    setVotesData((prev) =>
      prev.map((opt) => {
        if (opt.id === id) {
          return {
            ...opt,
            votes: opt.votes + 1,
          };
        }
        return opt;
      })
    );
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setSubmittedComment(userComment);
    setUserComment('');
  };

  return (
    <section id="public-sentiment" className="w-full bg-[#070e24] border-b border-[#172750] py-12 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Context & Editorial Prompt */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-sky-400">
              {t.democraticLedger}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight [text-wrap:balance]">
              {t.pollTitle}
            </h2>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              {translatedPoll.description}
            </p>

            <div className="pt-4 border-t border-[#16274e] flex items-center gap-4 text-xs text-slate-400 font-mono tabular-nums">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {t.verifiedSample}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{totalCount.toLocaleString()} {t.totalBallots}</span>
            </div>
          </div>

          {/* Right Column: Interactive Poll Box */}
          <div className="lg:col-span-7 bg-[#0a1534] border border-[#1a2d5c] rounded-sm p-6 sm:p-8">
            <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-6 leading-snug">
              {translatedPoll.question}
            </h3>

            {/* Poll Options */}
            <div className="space-y-3.5 mb-6">
              {votesData.map((opt) => {
                const currentPercentage = Math.round((opt.votes / totalCount) * 100);
                const isSelected = selectedOptionId === opt.id;

                return (
                  <div key={opt.id} className="relative">
                    <button
                      onClick={() => handleVote(opt.id)}
                      disabled={hasVoted}
                      className={`w-full p-4 text-left border rounded-sm relative overflow-hidden transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-sky-400 bg-[#10234f]'
                          : hasVoted
                          ? 'border-[#17274e] bg-[#08122a] opacity-90'
                          : 'border-[#1a2c5a] bg-[#09132c] hover:border-sky-400/60 hover:bg-[#0c1836]'
                      }`}
                    >
                      {/* Background fill representing vote percentage if voted */}
                      {hasVoted && (
                        <div
                          className="absolute inset-y-0 left-0 bg-sky-500/15 pointer-events-none transition-all duration-700"
                          style={{ width: `${currentPercentage}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-4">
                        <span className="text-xs sm:text-sm font-sans text-slate-200 font-medium">
                          {opt.label}
                        </span>

                        {hasVoted && (
                          <div className="flex items-center gap-2 shrink-0 font-mono text-sm font-bold text-white tabular-nums">
                            {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                            <span>{currentPercentage}%</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Post-vote status or Instructions */}
            <div className="text-xs text-slate-400 mb-6">
              {hasVoted ? (
                <span className="text-sky-300 font-medium">
                  {t.voteRecorded}
                </span>
              ) : (
                <span>{t.submitVote}</span>
              )}
            </div>

            {/* Editorial Discussion & Commentary Form */}
            <form onSubmit={handleCommentSubmit} className="pt-5 border-t border-[#17274e]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {t.sharePerspective}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.writeComment}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="flex-1 bg-[#060c1d] border border-[#1b2b57] focus:border-sky-400 rounded-sm px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!userComment.trim()}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#060c1d] bg-sky-400 hover:bg-sky-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-sm transition-colors cursor-pointer shrink-0"
                >
                  {t.post}
                </button>
              </div>

              {submittedComment && (
                <div className="mt-3 p-3 bg-[#081636] border border-[#1a2d5c] rounded-sm text-xs text-slate-200">
                  <span className="text-sky-400 font-semibold block mb-0.5">{t.perspectivePosted}:</span>
                  &ldquo;{submittedComment}&rdquo;
                </div>
              )}
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};
