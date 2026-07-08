import { useState, useRef, useEffect } from 'react';
import { MatchState, Player, Fundamental, Quality, ActionEntry } from '../types';
import { generateId } from '../store';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { Undo2, AlertCircle, ChevronRight } from 'lucide-react';

interface Props {
  match: MatchState;
  players: Player[];
  onUpdate: (match: MatchState) => void;
  onScoreChange: (setIdx: number, team: 'home' | 'away', delta: number) => void;
}

export default function ScoutPage({ match, players, onUpdate, onScoreChange }: Props) {
  const { t } = useI18n();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const toastTimeout = useRef<number | null>(null);

  const FUNDAMENTALS: { key: Fundamental; label: string; emoji: string }[] = [
    { key: 'ATT', label: t.fund_attack, emoji: '⚡' },
    { key: 'RIC', label: t.fund_reception, emoji: '🛡️' },
    { key: 'BAT', label: t.fund_serve, emoji: '🏐' },
    { key: 'MUR', label: t.fund_block, emoji: '🧱' },
    { key: 'DIF', label: t.fund_defense, emoji: '🤸' },
  ];

  const QUALITIES: { key: Quality; label: string; color: string; bgColor: string; borderColor: string }[] = [
    { key: '++', label: '++', color: 'text-green-400', bgColor: 'bg-green-500/15', borderColor: 'border-green-500/30' },
    { key: '+', label: '+', color: 'text-blue-400', bgColor: 'bg-blue-500/15', borderColor: 'border-blue-500/30' },
    { key: '-', label: '–', color: 'text-yellow-400', bgColor: 'bg-yellow-500/15', borderColor: 'border-yellow-500/30' },
    { key: '=', label: '=', color: 'text-red-400', bgColor: 'bg-red-500/15', borderColor: 'border-red-500/30' },
  ];

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollLeft = logRef.current.scrollWidth;
    }
  }, [match.actions]);

  const showToast = (msg: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(msg);
    toastTimeout.current = window.setTimeout(() => setToast(null), 2000);
  };

  const handleAction = (fundamental: Fundamental, quality: Quality) => {
    if (!selectedPlayer) {
      showToast(t.scout_select_player);
      return;
    }
    const player = players.find((p) => p.id === selectedPlayer);
    if (!player) return;

    const entry: ActionEntry = {
      id: generateId(),
      playerId: player.id,
      playerName: player.name,
      playerNumber: player.number,
      fundamental,
      quality,
      timestamp: Date.now(),
      set: match.currentSet,
    };

    onUpdate({
      ...match,
      actions: [...match.actions, entry],
    });
  };

  const handleUndo = () => {
    if (match.actions.length === 0) return;
    onUpdate({
      ...match,
      actions: match.actions.slice(0, -1),
    });
    showToast(t.scout_action_undone);
  };

  const handlePointAndError = (type: 'pt' | 'err') => {
    if (type === 'pt') {
      onScoreChange(match.currentSet - 1, 'home', 1);
    } else {
      onScoreChange(match.currentSet - 1, 'away', 1);
    }
  };

  const handleNewSet = () => {
    onUpdate({
      ...match,
      scores: [...match.scores, { home: 0, away: 0 }],
      currentSet: match.currentSet + 1,
    });
    showToast(`${t.scout_set} ${match.currentSet + 1}`);
  };

  if (!match.started) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-700 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-muted-dark" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t.scout_no_match}</h3>
          <p className="text-sm text-muted max-w-xs mx-auto">
            {t.scout_no_match_desc}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Match info bar */}
      <div className="bg-navy-800 border-b border-surface-500/30 px-3 py-1.5 flex items-center justify-center gap-2 flex-shrink-0">
        <span className="text-xs font-bold text-white">{match.info.homeTeam}</span>
        <span className="text-xs text-muted-dark">vs</span>
        <span className="text-xs font-bold text-white">{match.info.awayTeam}</span>
        <span className="text-muted-dark">·</span>
        <span className="text-xs text-gold-400 font-bold">{t.scout_set} {match.currentSet}</span>
        <button
          onClick={handleNewSet}
          className="ml-2 text-[10px] font-bold text-navy-500 bg-navy-600/20 hover:bg-navy-600/40 px-2 py-0.5 rounded-md transition-colors flex items-center gap-0.5"
        >
          {t.scout_new_set} <ChevronRight size={10} />
        </button>
      </div>

      {/* Main scout body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Player column */}
        <div className="w-[108px] sm:w-[120px] bg-surface-800 border-r border-surface-600/50 overflow-y-auto flex-shrink-0 p-1.5 flex flex-col gap-1">
          {players
            .sort((a, b) => a.number - b.number)
            .map((player) => {
              const isSelected = selectedPlayer === player.id;
              return (
                <button
                  key={player.id}
                  onClick={() => setSelectedPlayer(isSelected ? null : player.id)}
                  className={cn(
                    "w-full rounded-xl px-2 h-11 flex items-center gap-2 transition-all text-left flex-shrink-0",
                    isSelected
                      ? "bg-gold-400 text-navy-800"
                      : "bg-navy-700/60 hover:bg-navy-700 text-white"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold flex-shrink-0",
                    isSelected ? "bg-black/15 text-navy-800" : "bg-white/10 text-white"
                  )}>
                    {player.number}
                  </span>
                  <span className="text-[11px] font-bold truncate">{player.name}</span>
                </button>
              );
            })}
        </div>

        {/* Actions grid */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-1.5 flex-shrink-0">
            {QUALITIES.map((q) => (
              <div key={q.key} className={cn("text-center text-[10px] font-extrabold tracking-wider py-1 rounded-lg", q.color, q.bgColor)}>
                {q.label}
              </div>
            ))}
          </div>

          {/* Fundamental rows */}
          {FUNDAMENTALS.map((fund) => (
            <div key={fund.key} className="flex-shrink-0">
              <div className="text-[10px] font-bold text-muted-dark tracking-wider px-1 mb-0.5 flex items-center gap-1">
                <span>{fund.emoji}</span>
                <span>{fund.label.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {QUALITIES.map((q) => (
                  <button
                    key={q.key}
                    onClick={() => handleAction(fund.key, q.key)}
                    className={cn(
                      "h-[52px] rounded-xl flex items-center justify-center text-xl font-black border-2 transition-all active:scale-90",
                      q.bgColor, q.color, q.borderColor,
                      !selectedPlayer && "opacity-40"
                    )}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Point / Error row */}
          <div className="grid grid-cols-2 gap-1.5 mt-1 flex-shrink-0">
            <button
              onClick={() => handlePointAndError('pt')}
              className="h-10 rounded-xl bg-navy-600/50 border border-navy-600/50 text-gold-400 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              🏆 {t.scout_point_home}
            </button>
            <button
              onClick={() => handlePointAndError('err')}
              className="h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              ❌ {t.scout_point_away}
            </button>
          </div>
        </div>
      </div>

      {/* Log strip */}
      <div
        ref={logRef}
        className="bg-surface-800 border-t border-surface-600/50 overflow-x-auto whitespace-nowrap px-2 py-1.5 flex items-center gap-1.5 flex-shrink-0 h-9"
      >
        <button
          onClick={handleUndo}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-navy-600/50 flex items-center justify-center text-muted hover:text-white hover:bg-navy-600 transition-colors"
        >
          <Undo2 size={14} />
        </button>
        <div className="w-px h-5 bg-surface-600/50 flex-shrink-0" />
        {match.actions.slice(-20).map((action) => {
          const qColor = action.quality === '++' ? 'text-green-400' :
            action.quality === '+' ? 'text-blue-400' :
            action.quality === '-' ? 'text-yellow-400' : 'text-red-400';
          return (
            <span
              key={action.id}
              className="inline-flex items-center gap-1 bg-surface-700/70 rounded-full px-2 py-0.5 text-[10px] flex-shrink-0"
            >
              <span className="font-bold text-white">{action.playerNumber}</span>
              <span className="text-muted-dark">{action.fundamental}</span>
              <span className={cn("font-extrabold", qColor)}>{action.quality}</span>
            </span>
          );
        })}
        {match.actions.length === 0 && (
          <span className="text-[10px] text-muted-dark italic">{t.scout_no_actions}</span>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-surface-700 border border-surface-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xl z-50"
          style={{ animation: 'toastIn 0.2s ease-out' }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
