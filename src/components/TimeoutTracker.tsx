import { useMemo } from 'react';
import { MatchState, TimeoutRecord } from '../types';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { generateId } from '../store';
import { triggerHaptic } from '../utils/haptic';
import { Clock } from 'lucide-react';

interface Props {
  match: MatchState;
  onUpdate: (match: MatchState) => void;
}

const MAX_TIMEOUTS_PER_SET = 2;

export default function TimeoutTracker({ match, onUpdate }: Props) {
  const { t } = useI18n();

  // Count timeouts for current set
  const currentSetTimeouts = useMemo(() => {
    const timeouts = match.timeouts || [];
    return {
      home: timeouts.filter(to => to.set === match.currentSet && to.team === 'home').length,
      away: timeouts.filter(to => to.set === match.currentSet && to.team === 'away').length,
    };
  }, [match.timeouts, match.currentSet]);

  const addTimeout = (team: 'home' | 'away') => {
    if (team === 'home' && currentSetTimeouts.home >= MAX_TIMEOUTS_PER_SET) return;
    if (team === 'away' && currentSetTimeouts.away >= MAX_TIMEOUTS_PER_SET) return;

    triggerHaptic(40);

    const newTimeout: TimeoutRecord = {
      id: generateId(),
      timestamp: Date.now(),
      set: match.currentSet,
      team,
    };

    onUpdate({
      ...match,
      timeouts: [...(match.timeouts || []), newTimeout],
    });
  };

  const undoLastTimeout = (team: 'home' | 'away') => {
    const timeouts = match.timeouts || [];
    const lastIndex = timeouts.map((to, i) => ({ to, i }))
      .filter(({ to }) => to.set === match.currentSet && to.team === team)
      .pop();
    
    if (!lastIndex) return;
    
    triggerHaptic(30);
    onUpdate({
      ...match,
      timeouts: timeouts.filter((_, i) => i !== lastIndex.i),
    });
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-surface-800/50 border-b border-surface-600/20">
      <Clock size={14} className="text-gold-400 flex-shrink-0" />
      <span className="text-[10px] font-bold text-muted-dark uppercase tracking-wider">
        {t.timeout}
      </span>

      {/* Home timeouts */}
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-muted hidden sm:inline">{match.info.homeTeam}</span>
        <div className="flex gap-0.5">
          {[...Array(MAX_TIMEOUTS_PER_SET)].map((_, i) => (
            <div
              key={`home-${i}`}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                i < currentSetTimeouts.home
                  ? "bg-gold-400 border-gold-400"
                  : "bg-transparent border-surface-500"
              )}
            />
          ))}
        </div>
        <button
          onClick={() => addTimeout('home')}
          disabled={currentSetTimeouts.home >= MAX_TIMEOUTS_PER_SET}
          className={cn(
            "w-6 h-6 rounded-lg text-[10px] font-bold transition-all",
            currentSetTimeouts.home < MAX_TIMEOUTS_PER_SET
              ? "bg-gold-400/20 text-gold-400 hover:bg-gold-400/30"
              : "bg-surface-700 text-muted-dark"
          )}
        >
          +
        </button>
        {currentSetTimeouts.home > 0 && (
          <button
            onClick={() => undoLastTimeout('home')}
            className="w-6 h-6 rounded-lg bg-surface-700 text-muted text-[10px] font-bold hover:bg-surface-600"
          >
            −
          </button>
        )}
      </div>

      <div className="h-4 w-px bg-surface-600" />

      {/* Away timeouts */}
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
          {[...Array(MAX_TIMEOUTS_PER_SET)].map((_, i) => (
            <div
              key={`away-${i}`}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                i < currentSetTimeouts.away
                  ? "bg-blue-400 border-blue-400"
                  : "bg-transparent border-surface-500"
              )}
            />
          ))}
        </div>
        <button
          onClick={() => addTimeout('away')}
          disabled={currentSetTimeouts.away >= MAX_TIMEOUTS_PER_SET}
          className={cn(
            "w-6 h-6 rounded-lg text-[10px] font-bold transition-all",
            currentSetTimeouts.away < MAX_TIMEOUTS_PER_SET
              ? "bg-blue-400/20 text-blue-400 hover:bg-blue-400/30"
              : "bg-surface-700 text-muted-dark"
          )}
        >
          +
        </button>
        {currentSetTimeouts.away > 0 && (
          <button
            onClick={() => undoLastTimeout('away')}
            className="w-6 h-6 rounded-lg bg-surface-700 text-muted text-[10px] font-bold hover:bg-surface-600"
          >
            −
          </button>
        )}
        <span className="text-[9px] text-muted hidden sm:inline">{match.info.awayTeam}</span>
      </div>
    </div>
  );
}
