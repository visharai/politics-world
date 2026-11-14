import React, { useState } from 'react';
import { BATTLEGROUND_RACES, BattlegroundRace } from '../data/electoralData';
import { useLanguage } from '../context/LanguageContext';
import { RotateCcw } from 'lucide-react';

export const BattlegroundSimulator: React.FC = () => {
  const { t, translateText } = useLanguage();

  // Base non-battleground safe seats
  const baseDem = 46;
  const baseRep = 47;

  const [raceStates, setRaceStates] = useState<Record<string, BattlegroundRace['currentLean']>>(() => {
    const initial: Record<string, BattlegroundRace['currentLean']> = {};
    BATTLEGROUND_RACES.forEach((r) => {
      initial[r.id] = r.currentLean;
    });
    return initial;
  });

  const handleToggleLean = (raceId: string, lean: BattlegroundRace['currentLean']) => {
    setRaceStates((prev) => ({
      ...prev,
      [raceId]: lean,
    }));
  };

  const handleReset = () => {
    const initial: Record<string, BattlegroundRace['currentLean']> = {};
    BATTLEGROUND_RACES.forEach((r) => {
      initial[r.id] = r.currentLean;
    });
    setRaceStates(initial);
  };

  // Calculate totals
  let demSeats = baseDem;
  let repSeats = baseRep;
  let tossUpSeats = 0;

  BATTLEGROUND_RACES.forEach((race) => {
    const stateLean = raceStates[race.id];
    if (stateLean === 'Democratic') demSeats += 1;
    else if (stateLean === 'Republican') repSeats += 1;
    else tossUpSeats += 1;
  });

  const getMajorityStatus = () => {
    if (demSeats >= 51) {
      return { text: `${t.senateMajorityProjectedDem} (${demSeats})`, color: 'text-sky-400' };
    }
    if (repSeats >= 51) {
      return { text: `${t.senateMajorityProjectedRep} (${repSeats})`, color: 'text-rose-400' };
    }
    if (demSeats === 50 && repSeats === 50) {
      return { text: t.dividedSenateProjected, color: 'text-amber-400' };
    }
    return { text: `${tossUpSeats} ${t.statesUndecided} (${t.majorityThreshold})`, color: 'text-slate-300' };
  };

  const majorityStatus = getMajorityStatus();

  return (
    <section id="elections-radar" className="w-full bg-[#060c1d] border-b border-[#172750] py-12 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#16274e]">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">
              {t.electoralCalculus}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {t.battlegroundTitle}
            </h2>
          </div>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-[#09132c] border border-[#18274f] hover:border-sky-400/50 rounded-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetSimulation}</span>
          </button>
        </div>

        {/* Chamber Balance Bar Visualizer */}
        <div className="p-6 bg-[#08132e] border border-[#192b57] rounded-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs uppercase tracking-wider text-slate-400">
              {t.battlegroundSubtitle}
            </div>
            <div className={`font-serif text-sm sm:text-base font-bold ${majorityStatus.color}`}>
              {majorityStatus.text}
            </div>
          </div>

          {/* Seat Distribution Visual Bar */}
          <div className="space-y-1.5">
            <div className="h-6 w-full rounded-sm overflow-hidden flex bg-[#040813] border border-[#152347]">
              {/* Dem Seats */}
              <div
                className="bg-sky-500 flex items-center justify-center text-[11px] font-mono font-bold text-[#060c1d] transition-all duration-300"
                style={{ width: `${(demSeats / 100) * 100}%` }}
              >
                {demSeats} D
              </div>
              {/* Toss-Up Seats */}
              {tossUpSeats > 0 && (
                <div
                  className="bg-amber-500/80 flex items-center justify-center text-[11px] font-mono font-bold text-[#060c1d] transition-all duration-300"
                  style={{ width: `${(tossUpSeats / 100) * 100}%` }}
                >
                  {tossUpSeats} Toss
                </div>
              )}
              {/* Rep Seats */}
              <div
                className="bg-rose-500 flex items-center justify-center text-[11px] font-mono font-bold text-[#060c1d] transition-all duration-300"
                style={{ width: `${(repSeats / 100) * 100}%` }}
              >
                {repSeats} R
              </div>
            </div>

            {/* Threshold Marker Indicator */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
              <span>{t.demSeatsLabel}: <strong className="text-sky-300">{demSeats}</strong></span>
              <span className="text-slate-300 border-x border-[#1a2c58] px-3">{t.majorityThreshold}</span>
              <span>{t.repSeatsLabel}: <strong className="text-rose-300">{repSeats}</strong></span>
            </div>
          </div>
        </div>

        {/* Battleground States Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BATTLEGROUND_RACES.map((race) => {
            const currentLean = raceStates[race.id];

            return (
              <div
                key={race.id}
                className={`p-5 rounded-sm border transition-all duration-200 ${
                  currentLean === 'Democratic'
                    ? 'bg-[#091738] border-sky-500/50'
                    : currentLean === 'Republican'
                    ? 'bg-[#180f24] border-rose-500/50'
                    : 'bg-[#08122a] border-[#16274e]'
                }`}
              >
                {/* State Code Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-sm bg-[#0e1d42] border border-[#1b3164] flex items-center justify-center font-mono font-bold text-xs text-sky-300">
                      {race.stateCode}
                    </span>
                    <h3 className="font-serif font-bold text-white text-base">
                      {race.state}
                    </h3>
                  </div>

                  <span className="font-mono text-xs tabular-nums text-slate-400">
                    {t.pollingMarginLabel}: {race.pollingMargin > 0 ? `+${race.pollingMargin}% D` : `${race.pollingMargin}% R`}
                  </span>
                </div>

                {/* Matchup */}
                <div className="space-y-1 text-xs text-slate-300 mb-3 pb-3 border-b border-[#142347]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{translateText ? translateText('Incumbent') : 'Incumbent'}:</span>
                    <span className="font-medium text-white">{race.incumbent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{translateText ? translateText('Challenger') : 'Challenger'}:</span>
                    <span className="font-medium text-white">{race.challenger}</span>
                  </div>
                </div>

                {/* Primary Issue Kicker */}
                <div className="text-xs text-slate-400 mb-4 line-clamp-1">
                  <span className="text-slate-300 font-medium">{t.primaryIssueLabel}:</span> {translateText ? translateText(race.primaryIssue) : race.primaryIssue}
                </div>

                {/* User Lean Selector Buttons */}
                <div className="grid grid-cols-3 gap-1 bg-[#050b1a] p-1 rounded-sm border border-[#132247]">
                  <button
                    onClick={() => handleToggleLean(race.id, 'Democratic')}
                    className={`py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                      currentLean === 'Democratic'
                        ? 'bg-sky-500 text-[#060c1d]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dem
                  </button>
                  <button
                    onClick={() => handleToggleLean(race.id, 'Toss-Up')}
                    className={`py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                      currentLean === 'Toss-Up'
                        ? 'bg-amber-500 text-[#060c1d]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tossUpLabel}
                  </button>
                  <button
                    onClick={() => handleToggleLean(race.id, 'Republican')}
                    className={`py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                      currentLean === 'Republican'
                        ? 'bg-rose-500 text-[#060c1d]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Rep
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
