import { useState } from 'react';
import { Player, MatchState, Substitution } from '../types';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { generateId } from '../store';
import { triggerHaptic } from '../utils/haptic';
import { ArrowRightLeft, X, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  match: MatchState;
  players: Player[];
  onUpdate: (match: MatchState) => void;
}

export default function SubstitutionPanel({ match, players, onUpdate }: Props) {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [playerOut, setPlayerOut] = useState<string>('');
  const [playerIn, setPlayerIn] = useState<string>('');

  const substitutions = match.substitutions || [];
  const currentSetSubs = substitutions.filter(s => s.set === match.currentSet);

  // Players currently on court (starters + liberos - substituted out + substituted in)
  const getPlayersOnCourt = (): Set<string> => {
    const onCourt = new Set([...(match.starters || []), ...(match.liberos || [])]);
    for (const sub of currentSetSubs) {
      onCourt.delete(sub.playerOut);
      onCourt.add(sub.playerIn);
    }
    return onCourt;
  };

  const playersOnCourt = getPlayersOnCourt();
  const playersOnBench = players.filter(p => !playersOnCourt.has(p.id));
  const playersOnCourtList = players.filter(p => playersOnCourt.has(p.id));

  const handleSubstitution = () => {
    if (!playerOut || !playerIn) return;
    
    const pOut = players.find(p => p.id === playerOut);
    const pIn = players.find(p => p.id === playerIn);
    if (!pOut || !pIn) return;

    triggerHaptic(50);

    const newSub: Substitution = {
      id: generateId(),
      timestamp: Date.now(),
      set: match.currentSet,
      playerOut: pOut.id,
      playerIn: pIn.id,
      playerOutNumber: pOut.number,
      playerInNumber: pIn.number,
      playerOutName: pOut.name,
      playerInName: pIn.name,
    };

    // Update starters/liberos arrays to reflect the swap
    let newStarters = [...(match.starters || [])];
    let newLiberos = [...(match.liberos || [])];

    // Check if playerOut was a starter or libero
    const wasStarter = newStarters.includes(pOut.id);
    const wasLibero = newLiberos.includes(pOut.id);

    if (wasStarter) {
      // Replace in starters: out goes to bench, in takes their place
      newStarters = newStarters.map(id => id === pOut.id ? pIn.id : id);
    } else if (wasLibero) {
      // Replace in liberos
      newLiberos = newLiberos.map(id => id === pOut.id ? pIn.id : id);
    }

    onUpdate({
      ...match,
      starters: newStarters,
      liberos: newLiberos,
      substitutions: [...substitutions, newSub],
    });

    setPlayerOut('');
    setPlayerIn('');
  };

  const undoSubstitution = (subId: string) => {
    const sub = substitutions.find(s => s.id === subId);
    if (!sub) return;

    triggerHaptic(30);

    // Reverse the swap in starters/liberos
    let newStarters = [...(match.starters || [])];
    let newLiberos = [...(match.liberos || [])];

    // Check if playerIn is currently in starters or liberos (meaning they replaced someone)
    const inStarters = newStarters.includes(sub.playerIn);
    const inLiberos = newLiberos.includes(sub.playerIn);

    if (inStarters) {
      // Reverse: put playerOut back, remove playerIn
      newStarters = newStarters.map(id => id === sub.playerIn ? sub.playerOut : id);
    } else if (inLiberos) {
      newLiberos = newLiberos.map(id => id === sub.playerIn ? sub.playerOut : id);
    }

    onUpdate({
      ...match,
      starters: newStarters,
      liberos: newLiberos,
      substitutions: substitutions.filter(s => s.id !== subId),
    });
  };

  return (
    <div className="bg-surface-800 border border-surface-600/50 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface-700/30 transition-colors"
      >
        <ArrowRightLeft size={14} className="text-gold-400" />
        <span className="text-xs font-bold text-white flex-1 text-left">{t.substitutions}</span>
        <span className="text-[10px] text-muted bg-surface-700 px-2 py-0.5 rounded-lg">
          {currentSetSubs.length}
        </span>
        {isExpanded ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 border-t border-surface-600/50 animate-fade-in">
          {/* Add substitution */}
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Player Out */}
              <div>
                <label className="text-[9px] text-muted-dark uppercase font-bold block mb-1">
                  {t.player_out}
                </label>
                <select
                  value={playerOut}
                  onChange={(e) => setPlayerOut(e.target.value)}
                  className="w-full bg-surface-700 border border-surface-500 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                >
                  <option value="">--</option>
                  {playersOnCourtList.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.number} {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Player In */}
              <div>
                <label className="text-[9px] text-muted-dark uppercase font-bold block mb-1">
                  {t.player_in}
                </label>
                <select
                  value={playerIn}
                  onChange={(e) => setPlayerIn(e.target.value)}
                  className="w-full bg-surface-700 border border-surface-500 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                >
                  <option value="">--</option>
                  {playersOnBench.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.number} {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubstitution}
              disabled={!playerOut || !playerIn}
              className={cn(
                "w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
                playerOut && playerIn
                  ? "bg-gold-400/20 text-gold-400 hover:bg-gold-400/30"
                  : "bg-surface-700 text-muted-dark"
              )}
            >
              <Check size={14} />
              {t.confirm_sub}
            </button>
          </div>

          {/* Substitution log */}
          {currentSetSubs.length > 0 && (
            <div className="mt-3 pt-3 border-t border-surface-600/50 space-y-1">
              <p className="text-[9px] text-muted-dark uppercase font-bold mb-2">
                Set {match.currentSet}
              </p>
              {currentSetSubs.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 px-2 py-1.5 bg-surface-700/30 rounded-lg text-xs"
                >
                  <span className="text-red-400 font-bold">#{sub.playerOutNumber}</span>
                  <ArrowRightLeft size={10} className="text-muted" />
                  <span className="text-green-400 font-bold">#{sub.playerInNumber}</span>
                  <span className="text-muted flex-1 truncate text-[10px]">
                    {sub.playerOutName} → {sub.playerInName}
                  </span>
                  <button
                    onClick={() => undoSubstitution(sub.id)}
                    className="w-5 h-5 rounded-md bg-surface-600 hover:bg-red-500/20 flex items-center justify-center"
                  >
                    <X size={10} className="text-muted hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {currentSetSubs.length === 0 && (
            <p className="text-[10px] text-muted-dark text-center py-3 mt-3 border-t border-surface-600/50">
              {t.no_subs}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
