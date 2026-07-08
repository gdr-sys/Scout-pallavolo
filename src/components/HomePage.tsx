import { useState, useEffect } from 'react';
import { MatchState, Roster } from '../types';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { Play, MapPin, Calendar, Home, Users, Trophy, AlertCircle } from 'lucide-react';

interface Props {
  match: MatchState;
  rosters: Roster[];
  onStartMatch: (match: MatchState) => void;
}

export default function HomePage({ match, rosters, onStartMatch }: Props) {
  const { t } = useI18n();
  const [homeTeam, setHomeTeam] = useState(match.info.homeTeam);
  const [awayTeam, setAwayTeam] = useState(match.info.awayTeam);
  const [date, setDate] = useState(match.info.date);
  const [location, setLocation] = useState(match.info.location);
  const [rosterId, setRosterId] = useState(match.info.rosterId);

  useEffect(() => {
    setHomeTeam(match.info.homeTeam);
    setAwayTeam(match.info.awayTeam);
    setDate(match.info.date);
    setLocation(match.info.location);
    setRosterId(match.info.rosterId);
  }, [match]);

  const canStart = homeTeam.trim() && awayTeam.trim() && rosterId;

  const handleStart = () => {
    if (!canStart) return;
    onStartMatch({
      ...match,
      info: {
        homeTeam: homeTeam.trim(),
        awayTeam: awayTeam.trim(),
        date,
        location: location.trim(),
        rosterId,
      },
      started: true,
    });
  };

  if (match.started) {
    const roster = rosters.find((r) => r.id === match.info.rosterId);
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Trophy size={28} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{t.home_match_in_progress}</h2>
            <p className="text-muted text-sm">{match.info.homeTeam} vs {match.info.awayTeam}</p>
          </div>

          <div className="bg-surface-800 border border-surface-600/50 rounded-2xl p-5 mb-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold mb-1">{t.home_team_home}</p>
                <p className="text-white font-bold">{match.info.homeTeam}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold mb-1">{t.home_team_away}</p>
                <p className="text-white font-bold">{match.info.awayTeam}</p>
              </div>
            </div>
            {match.info.date && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar size={14} />
                {match.info.date}
              </div>
            )}
            {match.info.location && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={14} />
                {match.info.location}
              </div>
            )}
            {roster && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <Users size={14} />
                {t.home_roster}: {roster.name} ({roster.players.length} {t.roster_players})
              </div>
            )}

            {/* Score summary */}
            <div className="pt-3 border-t border-surface-600/50">
              <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold mb-2">{t.summary_result}</p>
              <div className="flex gap-2 flex-wrap">
                {match.scores.map((s, i) => (
                  <div key={i} className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold",
                    i === match.currentSet - 1 
                      ? "bg-gold-400/15 text-gold-400 border border-gold-400/30" 
                      : "bg-surface-700 text-muted"
                  )}>
                    S{i + 1}: {s.home} - {s.away}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 px-3 py-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
            <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-400/80">
              {t.home_go_to_scout}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-navy-600/50 flex items-center justify-center">
            <Home size={20} className="text-gold-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t.home_new_match}</h2>
            <p className="text-xs text-muted">{t.home_details}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Teams */}
          <div className="bg-surface-800 border border-surface-600/50 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold mb-3">{t.home_teams}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted mb-1.5 block">{t.home_team_home}</label>
                <input
                  type="text"
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  placeholder="Team name"
                  className="w-full bg-surface-700 border border-surface-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-muted-dark outline-none focus:border-navy-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1.5 block">{t.home_team_away}</label>
                <input
                  type="text"
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  placeholder="Team name"
                  className="w-full bg-surface-700 border border-surface-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-muted-dark outline-none focus:border-navy-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-surface-800 border border-surface-600/50 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold mb-3">{t.home_details}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted mb-1.5 block flex items-center gap-1.5">
                  <Calendar size={12} /> {t.home_date}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-700 border border-surface-500 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-navy-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1.5 block flex items-center gap-1.5">
                  <MapPin size={12} /> {t.home_location}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Venue"
                  className="w-full bg-surface-700 border border-surface-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-muted-dark outline-none focus:border-navy-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Roster */}
          <div className="bg-surface-800 border border-surface-600/50 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold mb-3">{t.home_roster}</p>
            {rosters.length === 0 ? (
              <p className="text-xs text-muted-dark py-2">
                {t.home_no_roster}
              </p>
            ) : (
              <select
                value={rosterId}
                onChange={(e) => setRosterId(e.target.value)}
                className="w-full bg-surface-700 border border-surface-500 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-navy-600 transition-colors"
              >
                <option value="">{t.home_select_roster}</option>
                {rosters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.players.length} {t.roster_players})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all",
              canStart
                ? "bg-gradient-to-r from-navy-600 to-navy-500 text-white hover:from-navy-500 hover:to-navy-600 shadow-lg shadow-navy-600/20"
                : "bg-surface-700 text-muted-dark cursor-not-allowed"
            )}
          >
            <Play size={20} />
            {t.home_start_match}
          </button>
        </div>
      </div>
    </div>
  );
}
