import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, CheckCircle2, Shield } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'whiteHouse',
    'summits',
  ]);
  const [subscribed, setSubscribed] = useState(false);

  const availableTopics = [
    { id: 'whiteHouse', label: t.whiteHouseCongress },
    { id: 'summits', label: t.globalSummits },
    { id: 'elections', label: t.elections2026 },
    { id: 'economy', label: t.economyTrade },
  ];

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <section id="subscribe-section" className="w-full bg-[#060c1d] border-b border-[#172750] py-14 sm:py-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        
        <div className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">
          {t.inboxIntelligence}
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-4 [text-wrap:balance]">
          {t.morningMemoTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl mx-auto mb-8 leading-relaxed">
          {t.morningMemoSubtitle}
        </p>

        {subscribed ? (
          <div className="p-6 bg-[#091534] border border-sky-400/40 rounded-sm max-w-xl mx-auto text-left">
            <div className="flex items-center gap-2.5 text-sky-400 font-serif font-bold text-lg mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{t.subscriptionConfirmed}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-3">
              {t.subscriptionNotice}
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              {t.selectedBeats}: {selectedTopics.map((id) => availableTopics.find((tItem) => tItem.id === id)?.label).filter(Boolean).join(' · ')}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
            {/* Topic Selection Checkboxes */}
            <div className="text-left bg-[#08122c] border border-[#17274e] p-4 rounded-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                {t.essentialTakeaways}:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {availableTopics.map((topic) => {
                  const isChecked = selectedTopics.includes(topic.id);
                  return (
                    <label
                      key={topic.id}
                      className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTopic(topic.id)}
                        className="rounded border-[#1f3160] text-sky-500 focus:ring-0 bg-[#060c1d] cursor-pointer"
                      />
                      <span>{topic.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Email Input & Submit */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#08132e] border border-[#192b57] focus:border-sky-400 rounded-sm pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#060c1d] bg-sky-400 hover:bg-sky-300 active:bg-sky-500 rounded-sm transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                {t.subscribeButton}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5" />
              <span>{t.privacyGuarantee}</span>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
