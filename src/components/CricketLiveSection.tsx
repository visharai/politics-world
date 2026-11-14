import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cricketScoreService, CricketMatch } from '../services/cricketScoreService';
import { useLanguage } from '../context/LanguageContext';
import {
  RefreshCw,
  ExternalLink,
  Trophy,
  Radio,
  Clock,
  Settings,
  CheckCircle2,
  Activity,
} from 'lucide-react';

const TEAM_FLAGS: Array<{ match: string; flag: string }> = [
  { match: 'india', flag: '🇮🇳' },
  { match: 'pakistan', flag: '🇵🇰' },
  { match: 'australia', flag: '🇦🇺' },
  { match: 'england', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { match: 'new zealand', flag: '🇳🇿' },
  { match: 'south africa', flag: '🇿🇦' },
  { match: 'sri lanka', flag: '🇱🇰' },
  { match: 'bangladesh', flag: '🇧🇩' },
  { match: 'afghanistan', flag: '🇦🇫' },
  { match: 'west indies', flag: '🌴' },
  { match: 'ireland', flag: '🇮🇪' },
  { match: 'zimbabwe', flag: '🇿🇼' },
  { match: 'scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { match: 'uae', flag: '🇦🇪' },
  { match: 'emirates', flag: '🇦🇪' },
  { match: 'nepal', flag: '🇳🇵' },
  { match: 'kathmandu', flag: '🇳🇵' },
  { match: 'chitwan', flag: '🇳🇵' },
  { match: 'janakpur', flag: '🇳🇵' },
  { match: 'sudur', flag: '🇳🇵' },
  { match: 'thailand', flag: '🇹🇭' },
  { match: 'victoria', flag: '🇦🇺' },
  { match: 'queensland', flag: '🇦🇺' },
  { match: 'tasmania', flag: '🇦🇺' },
  { match: 'new south wales', flag: '🇦🇺' },
  { match: 'western australia', flag: '🇦🇺' },
  { match: 'south australia', flag: '🇦🇺' },
];

function getTeamFlag(teamName: string): string {
  const lower = (teamName || '').toLowerCase();
  const hit = TEAM_FLAGS.find((item) => lower.includes(item.match));
  return hit ? hit.flag : '🏏';
}

interface CricketScoreStripProps {
  onJumpToCricket: () => void;
}

/**
 * Compact auto-updating Live Cricket Score Strip displayed near the top of the page
 * so readers immediately see active live match scores updating every 30 seconds.
 */
export const CricketScoreStrip: React.FC<CricketScoreStripProps> = ({ onJumpToCricket }) => {
  const { langCode } = useLanguage();
  const [matches, setMatches] = useState<CricketMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = useCallback(async () => {
    try {
      const res = await cricketScoreService.fetchLiveScores(false);
      if (res.matches && res.matches.length > 0) {
        setMatches(res.matches);
      }
    } catch {
      // Keep previous state silently on background refresh
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 30 * 1000);
    return () => clearInterval(interval);
  }, [loadMatches]);

  if (loading || matches.length === 0) return null;

  const liveOnes = matches.filter((m) => m.isLive);
  const displayList = (liveOnes.length > 0 ? liveOnes : matches).slice(0, 4);

  return (
    <div className="w-full bg-[#050b1c] border-b border-[#162750] py-1.5 px-3 sm:px-6 text-xs font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{langCode === 'hi' ? 'क्रिकेट लाइव' : 'CRICKET LIVE'}</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            {langCode === 'hi' ? 'ऑटो-अपडेट 30s' : 'Auto 30s'}
          </span>
        </div>

        <div className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar py-0.5">
          {displayList.map((m) => (
            <button
              key={m.id}
              onClick={onJumpToCricket}
              className="shrink-0 flex items-center gap-2 text-left text-slate-200 hover:text-amber-300 transition-colors cursor-pointer border-r border-[#182952] pr-4 last:border-r-0 last:pr-0 whitespace-nowrap"
            >
              <span className={m.isLive ? 'text-rose-400 font-bold text-[10px] font-mono' : 'text-slate-400 text-[10px] font-mono'}>
                {m.isLive ? '● LIVE' : 'NEXT'}
              </span>
              <span className="font-semibold">
                {getTeamFlag(m.team1)} {m.team1}
                {m.team1Score ? (
                  <span className="ml-1 font-mono tabular-nums text-amber-300 font-bold">
                    {m.team1Score}{m.team1Batting ? '*' : ''}
                  </span>
                ) : null}
              </span>
              <span className="text-slate-500 text-[11px]">vs</span>
              <span className="font-semibold">
                {getTeamFlag(m.team2)} {m.team2}
                {m.team2Score ? (
                  <span className="ml-1 font-mono tabular-nums text-sky-300 font-bold">
                    {m.team2Score}{m.team2Batting ? '*' : ''}
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onJumpToCricket}
          className="shrink-0 self-start lg:self-auto text-[11px] font-serif font-bold uppercase tracking-wider text-amber-300 hover:text-white underline underline-offset-4 cursor-pointer whitespace-nowrap"
        >
          {langCode === 'hi' ? 'पूरा स्कोरबोर्ड देखें ↓' : 'Full Scoreboard ↓'}
        </button>
      </div>
    </div>
  );
};

export const CricketLiveSection: React.FC = () => {
  const { langCode } = useLanguage();
  const isHindi = langCode === 'hi';

  const [matches, setMatches] = useState<CricketMatch[]>([]);
  const [provider, setProvider] = useState<string>('ESPNcricinfo Live Wire');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const [filterMode, setFilterMode] = useState<'all' | 'live' | 'upcoming' | 'international'>('all');

  const [showApiConfig, setShowApiConfig] = useState<boolean>(false);
  const [cricApiKeyInput, setCricApiKeyInput] = useState<string>(() => cricketScoreService.getSavedApiKey());
  const [keyNotice, setKeyNotice] = useState<string>('');

  const fetchScores = useCallback(async (force: boolean = false) => {
    if (force) {
      setIsRefreshing(true);
    }
    try {
      const data = await cricketScoreService.fetchLiveScores(force);
      if (data.status === 'ok' && Array.isArray(data.matches)) {
        setMatches(data.matches);
        setProvider(data.provider || 'ESPNcricinfo Live Wire');
        setLastUpdated(
          new Date(data.updatedAt || Date.now()).toLocaleTimeString(isHindi ? 'hi-IN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
        setErrorMsg(null);
      } else {
        setErrorMsg(data.error || 'Could not load live cricket scores');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to connect to live cricket wire');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setCountdown(30);
    }
  }, [isHindi]);

  useEffect(() => {
    fetchScores(false);

    const pollInterval = setInterval(() => {
      fetchScores(false);
    }, 30 * 1000);

    const timerInterval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(timerInterval);
    };
  }, [fetchScores]);

  const filteredMatches = useMemo(() => {
    if (filterMode === 'live') {
      return matches.filter((m) => m.isLive);
    }
    if (filterMode === 'upcoming') {
      return matches.filter((m) => !m.isLive);
    }
    if (filterMode === 'international') {
      return matches.filter((m) => {
        const t = m.matchTitle.toLowerCase();
        return (
          t.includes('india') ||
          t.includes('pakistan') ||
          t.includes('australia') ||
          t.includes('england') ||
          t.includes('new zealand') ||
          t.includes('sri lanka') ||
          t.includes('south africa') ||
          t.includes('afghanistan') ||
          t.includes('bangladesh') ||
          t.includes('ireland') ||
          t.includes('zimbabwe')
        );
      });
    }
    return matches;
  }, [matches, filterMode]);

  const liveCount = useMemo(() => matches.filter((m) => m.isLive).length, [matches]);

  const handleSaveCricApi = () => {
    cricketScoreService.setSavedApiKey(cricApiKeyInput);
    setKeyNotice(
      cricApiKeyInput.trim().length > 5
        ? isHindi
          ? 'CricAPI की सेव हो गई — लाइव स्कोर अपडेट हो रहे हैं!'
          : 'CricAPI Key saved — fetching enhanced live scorecard!'
        : isHindi
        ? 'API की हटाई गई — डिफ़ॉल्ट ESPNcricinfo लाइव वायर सक्रिय है।'
        : 'API key cleared — using keyless ESPNcricinfo Live Wire.'
    );
    fetchScores(true);
    setTimeout(() => setKeyNotice(''), 4000);
  };

  return (
    <section
      id="cricket-live"
      className="w-full bg-[#060c1d] border-b border-[#182952] py-12 sm:py-16 font-sans text-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 mb-8 border-b border-[#16274e]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{isHindi ? 'रीयल-टाइम ऑटो-अपडेट स्कोरबोर्ड' : 'Real-Time Auto-Updating Scoreboard'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{provider}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight flex flex-wrap items-center gap-3 [text-wrap:balance]">
              <Trophy className="w-7 h-7 text-amber-400 shrink-0" />
              <span>{isHindi ? 'क्रिकेट लाइव स्कोर केंद्र' : 'Live Cricket Scoreboard'}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl">
              {isHindi
                ? 'अंतरराष्ट्रीय एवं प्रमुख टी20/टेस्ट मुकाबलों का लाइव स्कोर हर 30 सेकंड में स्वतः अपडेट होता है।'
                : 'Live match scores across international Tests, ODIs, T20s, and domestic leagues — automatically refreshed every 30 seconds.'}
            </p>
          </div>

          {/* Right Live Telemetry & Refresh Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="text-xs font-mono text-slate-300 bg-[#0a132c] border border-[#182952] px-3 py-2 rounded-xs flex items-center gap-2 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {isHindi ? 'अगला अपडेट:' : 'Next update:'} <strong className="text-amber-300">{countdown}s</strong>
              </span>
              {lastUpdated && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">{lastUpdated}</span>
                </>
              )}
            </div>

            <button
              onClick={() => fetchScores(true)}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xs bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isHindi ? 'अभी ताज़ा करें' : 'Refresh Live'}</span>
            </button>

            <button
              onClick={() => setShowApiConfig((prev) => !prev)}
              className="p-2 rounded-xs bg-[#0a132c] hover:bg-[#122046] border border-[#182952] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isHindi ? 'वैकल्पिक CricAPI सेटिंग' : 'Optional CricAPI Key Settings'}
              aria-label="Cricket API settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auto-Update Progress Bar */}
        <div className="w-full bg-[#0d1c42] h-1 rounded-full overflow-hidden mb-6">
          <div
            className="bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-400 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${Math.min(100, Math.max(3, ((30 - countdown) / 30) * 100))}%` }}
          />
        </div>

        {/* Optional CricAPI Key Configuration Drawer */}
        {showApiConfig && (
          <div className="mb-8 p-4 sm:p-5 bg-[#0a132c] border border-[#1f3469] rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
                {isHindi ? 'क्रिकेट लाइव API कॉन्फ़िगरेशन (वैकल्पिक)' : 'Cricket Live API Configuration (Optional)'}
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">
                {isHindi ? 'डिफ़ॉल्ट लाइव फ़ीड सक्रिय है' : 'Default Keyless Feed Active'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {isHindi
                ? 'ESPNcricinfo लाइव स्कोर बिना किसी API कुंजी के अपने आप काम करता है। अतिरिक्त ओवर-दर-ओवर आंकड़ों के लिए आप CricketData.org (CricAPI) कुंजी भी जोड़ सकते हैं।'
                : 'Live scores stream automatically via ESPNcricinfo Live Wire with zero API key needed. Optionally enter a CricketData.org (CricAPI) key for extended venue & over-by-over details.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={cricApiKeyInput}
                onChange={(e) => setCricApiKeyInput(e.target.value)}
                placeholder="Optional CricAPI key..."
                className="flex-1 bg-[#050b1c] border border-[#1a2d59] focus:border-amber-400 rounded-xs px-3 py-2 text-xs text-white font-mono focus:outline-hidden"
              />
              <button
                onClick={handleSaveCricApi}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                {isHindi ? 'सेव व रिफ्रेश करें' : 'Save & Refresh'}
              </button>
            </div>
            {keyNotice && (
              <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{keyNotice}</span>
              </p>
            )}
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all' as const, label: isHindi ? `सभी मैच (${matches.length})` : `All Matches (${matches.length})` },
              { id: 'live' as const, label: isHindi ? `अभी लाइव (${liveCount})` : `Live Now (${liveCount})` },
              { id: 'international' as const, label: isHindi ? 'अंतरराष्ट्रीय टीम' : 'International' },
              { id: 'upcoming' as const, label: isHindi ? 'आगामी मुकाबले' : 'Upcoming / Scheduled' },
            ].map((tab) => {
              const active = filterMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterMode(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xs text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer border whitespace-nowrap ${
                    active
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-[#0a132c] text-slate-300 border-[#182952] hover:border-amber-400/50 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scorecards Grid (1 Card = 1 Match) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-44 rounded-sm bg-[#0a132c] border border-[#182952] p-5 animate-pulse" />
            ))}
          </div>
        ) : errorMsg && matches.length === 0 ? (
          <div className="p-8 text-center bg-[#0a132c] border border-[#182952] rounded-sm">
            <p className="text-sm text-rose-300 mb-3">{errorMsg}</p>
            <button
              onClick={() => fetchScores(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xs cursor-pointer"
            >
              {isHindi ? 'पुनः प्रयास करें' : 'Retry Connection'}
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="p-10 text-center bg-[#0a132c] border border-[#182952] rounded-sm">
            <p className="text-sm text-slate-300 mb-3">
              {isHindi ? 'इस फ़िल्टर में अभी कोई मैच उपलब्ध नहीं है।' : 'No matches found under this filter right now.'}
            </p>
            <button
              onClick={() => setFilterMode('all')}
              className="px-4 py-2 bg-[#14234a] hover:bg-[#1b3168] text-white text-xs font-semibold rounded-xs cursor-pointer"
            >
              {isHindi ? 'सभी मैच देखें' : 'Show All Matches'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <article
                key={match.id}
                className={`bg-[#0a132c] border rounded-sm p-5 flex flex-col justify-between transition-all shadow-md ${
                  match.isLive
                    ? 'border-emerald-500/45 hover:border-amber-400/70'
                    : 'border-[#182952] hover:border-[#2a4380]'
                }`}
              >
                <div>
                  {/* Clean Unboxed Header Metadata */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#142347] text-[11px] font-mono">
                    <span className={`font-bold flex items-center gap-1.5 ${match.isLive ? 'text-emerald-400' : 'text-slate-400'}`}>
                      <Activity className="w-3.5 h-3.5 shrink-0" />
                      <span>{match.isLive ? (isHindi ? 'लाइव स्कोर' : 'LIVE') : (isHindi ? 'आगामी' : 'SCHEDULED')}</span>
                    </span>
                    <span className="text-slate-400 truncate">{match.matchType}</span>
                  </div>

                  {/* Teams & Tabular Scores */}
                  <div className="space-y-3 mb-4">
                    {/* Team 1 Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0" aria-hidden="true">{getTeamFlag(match.team1)}</span>
                        <span className={`text-sm sm:text-base font-serif font-bold truncate ${match.team1Batting ? 'text-amber-300' : 'text-white'}`}>
                          {match.team1}
                        </span>
                        {match.team1Batting && (
                          <span className="text-[11px] text-amber-400 font-mono shrink-0" title="Currently Batting">
                            🏏
                          </span>
                        )}
                      </div>
                      <span className={`font-mono tabular-nums text-sm sm:text-base font-bold shrink-0 ${match.team1Score ? 'text-amber-300' : 'text-slate-500'}`}>
                        {match.team1Score ? `${match.team1Score}${match.team1Batting ? '*' : ''}` : '—'}
                      </span>
                    </div>

                    {/* Team 2 Row */}
                    {match.team2 && (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0" aria-hidden="true">{getTeamFlag(match.team2)}</span>
                          <span className={`text-sm sm:text-base font-serif font-bold truncate ${match.team2Batting ? 'text-amber-300' : 'text-slate-200'}`}>
                            {match.team2}
                          </span>
                          {match.team2Batting && (
                            <span className="text-[11px] text-amber-400 font-mono shrink-0" title="Currently Batting">
                              🏏
                            </span>
                          )}
                        </div>
                        <span className={`font-mono tabular-nums text-sm sm:text-base font-bold shrink-0 ${match.team2Score ? 'text-sky-300' : 'text-slate-500'}`}>
                          {match.team2Score ? `${match.team2Score}${match.team2Batting ? '*' : ''}` : '—'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Match Status Line */}
                  <p className={`text-xs font-medium leading-snug mb-4 ${match.isLive ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {match.statusText}
                  </p>
                  {match.venue && (
                    <p className="text-[11px] text-slate-500 mb-3 truncate">{match.venue}</p>
                  )}
                </div>

                {/* Footer Action Link */}
                <div className="pt-3 border-t border-[#142347] flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                  <span className="truncate">{match.source}</span>
                  <a
                    href={match.matchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-white font-bold flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <span>{isHindi ? 'पूरा स्कोरकार्ड' : 'Full Scorecard'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
