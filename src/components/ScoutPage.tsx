import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Player, MatchState, Fundamental, Quality, ActionEntry } from '../types';
import { generateId, getFavoriteActions } from '../store';
import { useI18n } from '../i18n/context';
import { useSettings } from '../contexts/SettingsContext';
import { cn } from '../utils/cn';
import { triggerHaptic } from '../utils/haptic';
import { Undo2, Plus, Star, Crosshair, RotateCcw, Shield, X, Check, User, Hash } from 'lucide-react';
import LiveStatsBar from './LiveStatsBar';
import TimeoutTracker from './TimeoutTracker';
import SubstitutionPanel from './SubstitutionPanel';
import CourtHeatmap from './CourtHeatmap';

interface Props {
  match: MatchState;
  players: Player[];
  onUpdate: (match: MatchState) => void;
  onScoreChange: (setIdx: number, team: 'home' | 'away', delta: number) => void;
}

// Combined Action Modal - Player selection + Score update in one flow
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (playerId: string, addPointTo: 'home' | 'away' | null) => void;
  players: Player[];
  starters: string[];
  liberos: string[];
  actionType: { fundamental: Fundamental; quality: Quality };
  homeTeam: string;
  awayTeam: string;
  currentHomeScore: number;
  currentAwayScore: number;
}

function ActionModal({
  isOpen, onClose, onComplete, players, starters, liberos, 
  actionType, homeTeam, awayTeam, currentHomeScore, currentAwayScore
}: ActionModalProps) {
  const { t } = useI18n();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showScoreStep, setShowScoreStep] = useState(false);
  
  // Auto-advance to score step for ++ or = quality
  useEffect(() => {
    if (isOpen && selectedPlayer && (actionType.quality === '++' || actionType.quality === '=')) {
      setShowScoreStep(true);
    }
  }, [isOpen, selectedPlayer, actionType.quality]);

  if (!isOpen) return null;

  const sortedPlayers = useMemo(() => {
    const starterPlayers = players.filter(p => starters.includes(p.id)).sort((a, b) => a.number - b.number);
    const liberoPlayers = players.filter(p => liberos.includes(p.id)).sort((a, b) => a.number - b.number);
    const benchPlayers = players.filter(p => !starters.includes(p.id) && !liberos.includes(p.id)).sort((a, b) => a.number - b.number);
    return { starters: starterPlayers, liberos: liberoPlayers, bench: benchPlayers };
  }, [players, starters, liberos]);

  // Quality determines if we need score step
  const needsScoreStep = actionType.quality === '++' || actionType.quality === '=';

  // Step 1: Select Player
  if (!showScoreStep) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-surface-800 border border-surface-500 rounded-2xl p-6 w-full max-w-md animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              <span className="text-gold-400">{actionType.fundamental}</span> <span className="text-muted">{actionType.quality}</span>
            </h3>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-surface-700 hover:bg-surface-600 flex items-center justify-center text-muted transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-sm text-muted mb-4">{t.scout_select_player}</p>
          
          <div className="max-h-80 overflow-y-auto">
            {/* Starters */}
            {sortedPlayers.starters.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-bold text-gold-400/60 uppercase tracking-wider px-1 py-1 mb-1">
                  {t.starters}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sortedPlayers.starters.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => {
                        setSelectedPlayer(player.id);
                        if (!needsScoreStep) {
                          onComplete(player.id, null);
                        }
                      }}
                      className={cn(
                        "p-3 rounded-xl text-center transition-all border-2",
                        selectedPlayer === player.id
                          ? "border-gold-400 bg-gold-400/10"
                          : "border-surface-600/30 bg-surface-700/50 hover:bg-surface-600/50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold-400/20 mx-auto mb-1 flex items-center justify-center">
                        <span className="text-sm font-extrabold text-gold-400">{player.number}</span>
                      </div>
                      <span className="text-xs font-bold text-white truncate block">{player.name}</span>
                      <Star size={10} className="text-gold-400 mx-auto mt-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Liberos */}
            {sortedPlayers.liberos.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-bold text-purple-400/60 uppercase tracking-wider px-1 py-1 mb-1">
                  {t.liberos}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sortedPlayers.liberos.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => {
                        setSelectedPlayer(player.id);
                        if (!needsScoreStep) {
                          onComplete(player.id, null);
                        }
                      }}
                      className={cn(
                        "p-3 rounded-xl text-center transition-all border-2",
                        selectedPlayer === player.id
                          ? "border-purple-400 bg-purple-400/10"
                          : "border-surface-600/30 bg-surface-700/50 hover:bg-surface-600/50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-400/20 mx-auto mb-1 flex items-center justify-center">
                        <span className="text-sm font-extrabold text-purple-400">{player.number}</span>
                      </div>
                      <span className="text-xs font-bold text-white truncate block">{player.name}</span>
                      <Shield size={10} className="text-purple-400 mx-auto mt-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Bench */}
            {sortedPlayers.bench.length > 0 && (
              <div>
                {(sortedPlayers.starters.length > 0 || sortedPlayers.liberos.length > 0) && (
                  <div className="border-t border-surface-600/30 my-2" />
                )}
                <div className="text-xs font-bold text-muted-dark uppercase tracking-wider px-1 py-1 mb-1">
                  {t.starters_bench}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sortedPlayers.bench.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => {
                        setSelectedPlayer(player.id);
                        if (!needsScoreStep) {
                          onComplete(player.id, null);
                        }
                      }}
                      className={cn(
                        "p-3 rounded-xl text-center transition-all border-2",
                        selectedPlayer === player.id
                          ? "border-gold-400 bg-gold-400/10"
                          : "border-surface-600/30 bg-surface-700/50 hover:bg-surface-600/50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-700 mx-auto mb-1 flex items-center justify-center">
                        <span className="text-sm font-extrabold text-muted">{player.number}</span>
                      </div>
                      <span className="text-xs font-bold text-muted truncate block">{player.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Next button for actions that need score step */}
          {needsScoreStep && selectedPlayer && (
            <div className="mt-4 pt-4 border-t border-surface-600/30">
              <button
                onClick={() => setShowScoreStep(true)}
                className="w-full py-4 rounded-xl bg-gold-400/15 border border-gold-400/30 text-gold-400 font-extrabold text-lg hover:bg-gold-400/20 transition-colors"
              >
                {t.wizard_next}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Select Score (only for ++ or =)
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-800 border border-surface-500 rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            <User size={20} className="inline mr-2 text-gold-400" />
            {players.find(p => p.id === selectedPlayer)?.name || ''}
          </h3>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-surface-700 hover:bg-surface-600 flex items-center justify-center text-muted transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm text-muted mb-4 text-center">{t.scout_select_score_team}</p>
        
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onComplete(selectedPlayer || '', 'home')}
            className="py-6 rounded-2xl bg-green-500/15 border-2 border-green-500/40 text-green-400 font-extrabold text-xl hover:bg-green-500/20 transition-colors"
          >
            <div className="text-3xl font-black">{currentHomeScore}</div>
            <div className="text-xs font-bold uppercase">{homeTeam || 'HOME'}</div>
          </button>
          <button
            onClick={() => onComplete(selectedPlayer || '', null)}
            className="py-6 rounded-2xl bg-surface-700 border-2 border-surface-500 text-muted font-extrabold text-lg hover:bg-surface-600 transition-colors"
          >
            <X size={24} />
            <div className="text-xs font-bold uppercase mt-1">{t.scout_no_point}</div>
          </button>
          <button
            onClick={() => onComplete(selectedPlayer || '', 'away')}
            className="py-6 rounded-2xl bg-red-500/15 border-2 border-red-500/40 text-red-400 font-extrabold text-xl hover:bg-red-500/20 transition-colors"
          >
            <div className="text-3xl font-black">{currentAwayScore}</div>
            <div className="text-xs font-bold uppercase">{awayTeam || 'AWAY'}</div>
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-sm text-muted-dark">
            {actionType.fundamental} {actionType.quality}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScoutPage({ match, players, onUpdate, onScoreChange }: Props) {
  const { t } = useI18n();
  const { advancedMode } = useSettings();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedFundamental, setSelectedFundamental] = useState<Fundamental | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentRotation, setCurrentRotation] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [swipeState, setSwipeState] = useState<Record<string, 'left' | 'right' | null>>({});
  const [pendingPosition, setPendingPosition] = useState<{ x: number; y: number } | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ fundamental: Fundamental; quality: Quality } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const toastTimeout = useRef<number | null>(null);
  const touchStartX = useRef<Record<string, number>>({});

  const FUNDAMENTALS: { key: Fundamental; label: string; emoji: string }[] = [
    { key: 'ATT', label: t.fund_attack, emoji: '\u26a1' },
    { key: 'RIC', label: t.fund_reception, emoji: '\ud83d\udee1\ufe0f' },
    { key: 'BAT', label: t.fund_serve, emoji: '\ud83c\udfd0' },
    { key: 'MUR', label: t.fund_block, emoji: '\ud83e\uddf1' },
    { key: 'DIF', label: t.fund_defense, emoji: '\ud83e\udd38' },
  ];

  const QUALITIES: { key: Quality; label: string; color: string; bgColor: string; borderColor: string }[] = [
    { key: '++', label: '++', color: 'text-green-400', bgColor: 'bg-green-500/15', borderColor: 'border-green-500/30' },
    { key: '+', label: '+', color: 'text-blue-400', bgColor: 'bg-blue-500/15', borderColor: 'border-blue-500/30' },
    { key: '-', label: '\u2013', color: 'text-yellow-400', bgColor: 'bg-yellow-500/15', borderColor: 'border-yellow-500/30' },
    { key: '=', label: '=', color: 'text-red-400', bgColor: 'bg-red-500/15', borderColor: 'border-red-500/30' },
  ];

  // Favorite actions (top 5 most used)
  const favorites = useMemo(() => {
    return getFavoriteActions(match.actions, 5);
  }, [match.actions]);

  // Starters + liberos first, then bench
  const sortedPlayers = useMemo(() => {
    const starters = match.starters || [];
    const liberos = match.liberos || [];
    const starterPlayers = players.filter(p => starters.includes(p.id));
    const liberoPlayers = players.filter(p => liberos.includes(p.id));
    const benchPlayers = players.filter(p => !starters.includes(p.id) && !liberos.includes(p.id));
    return {
      starters: starterPlayers.sort((a, b) => a.number - b.number),
      liberos: liberoPlayers.sort((a, b) => a.number - b.number),
      bench: benchPlayers.sort((a, b) => a.number - b.number),
    };
  }, [players, match.starters, match.liberos]);

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

  const currentScore = match.scores[match.currentSet - 1] || { home: 0, away: 0 };

  // Handle action recording - NEW 3-CLICK FLOW
  // Click 1: Action button → Opens modal
  // Click 2: Player → Selects player (auto-advances if needs score)
  // Click 3: Score option (or auto-completes if + or -)
  const handleAction = useCallback((fundamental: Fundamental, quality: Quality) => {
    setPendingAction({ fundamental, quality });
    setShowActionModal(true);
    triggerHaptic(20);
  }, []);

  // Handle modal completion
  const handleActionComplete = useCallback((playerId: string, addPointTo: 'home' | 'away' | null) => {
    const player = players.find((p) => p.id === playerId);
    if (!player || !pendingAction) return;

    // Create action entry
    const entry: ActionEntry = {
      id: generateId(),
      playerId: player.id,
      playerName: player.name,
      playerNumber: player.number,
      fundamental: pendingAction.fundamental,
      quality: pendingAction.quality,
      timestamp: Date.now(),
      set: match.currentSet,
      ...(advancedMode ? { 
        rotation: currentRotation,
        ...(pendingPosition ? { position: pendingPosition } : {})
      } : {}),
    };

    // Haptic feedback
    triggerHaptic(pendingAction.quality === '++' ? 50 : pendingAction.quality === '=' ? 80 : 30);

    // Update match with new action
    onUpdate({
      ...match,
      actions: [...match.actions, entry],
    });

    // If user selected a team for score, update score
    if (addPointTo) {
      onScoreChange(match.currentSet - 1, addPointTo, 1);
    }

    // Reset and close
    setPendingAction(null);
    setShowActionModal(false);
    setSelectedPlayer(null);
    setPendingPosition(null);
    
    showToast(`#${player.number} ${pendingAction.fundamental} ${pendingAction.quality}`);
  }, [pendingAction, players, match, advancedMode, currentRotation, pendingPosition, onUpdate, onScoreChange]);

  const handleUndo = () => {
    if (match.actions.length === 0) return;
    triggerHaptic(40);
    onUpdate({
      ...match,
      actions: match.actions.slice(0, -1),
    });
    showToast(t.scout_action_undone);
  };

  const handleNewSet = () => {
    triggerHaptic(60);
    onUpdate({
      ...match,
      scores: [...match.scores, { home: 0, away: 0 }],
      currentSet: match.currentSet + 1,
    });
    showToast(`${t.scout_set} ${match.currentSet + 1}`);
  };

  // Swipe handling for advanced mode
  const handleTouchStart = (playerId: string, e: React.TouchEvent) => {
    if (!advancedMode) return;
    touchStartX.current[playerId] = e.touches[0].clientX;
  };

  const handleTouchEnd = (playerId: string, e: React.TouchEvent) => {
    if (!advancedMode || !selectedFundamental) return;
    const startX = touchStartX.current[playerId];
    if (startX === undefined) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    
    if (Math.abs(diff) < 50) return; // threshold
    
    // Set this player as selected
    setSelectedPlayer(playerId);
    
    if (diff > 0) {
      // Swipe right = ++
      setSwipeState(prev => ({ ...prev, [playerId]: 'right' }));
      setTimeout(() => {
        const player = players.find(p => p.id === playerId);
        if (!player) return;
        const entry: ActionEntry = {
          id: generateId(),
          playerId: player.id,
          playerName: player.name,
          playerNumber: player.number,
          fundamental: selectedFundamental,
          quality: '++',
          timestamp: Date.now(),
          set: match.currentSet,
          ...(advancedMode ? { rotation: currentRotation } : {}),
        };
        triggerHaptic(50);
        onUpdate({ ...match, actions: [...match.actions, entry] });
        showToast(`#${player.number} ${selectedFundamental} ++`);
        setSwipeState(prev => ({ ...prev, [playerId]: null }));
      }, 300);
    } else {
      // Swipe left = =
      setSwipeState(prev => ({ ...prev, [playerId]: 'left' }));
      setTimeout(() => {
        const player = players.find(p => p.id === playerId);
        if (!player) return;
        const entry: ActionEntry = {
          id: generateId(),
          playerId: player.id,
          playerName: player.name,
          playerNumber: player.number,
          fundamental: selectedFundamental,
          quality: '=',
          timestamp: Date.now(),
          set: match.currentSet,
          ...(advancedMode ? { rotation: currentRotation } : {}),
        };
        triggerHaptic(80);
        onUpdate({ ...match, actions: [...match.actions, entry] });
        showToast(`#${player.number} ${selectedFundamental} =`);
        setSwipeState(prev => ({ ...prev, [playerId]: null }));
      }, 300);
    }
    
    delete touchStartX.current[playerId];
  };

  if (!match.started) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <Crosshair size={48} className="mx-auto mb-3 text-muted-dark opacity-40" />
          <h3 className="text-lg font-bold text-white mb-2">{t.scout_no_match}</h3>
          <p className="text-sm text-muted max-w-xs mx-auto">{t.scout_no_match_desc}</p>
        </div>
      </div>
    );
  }

  const renderPlayerButton = (player: Player, type: 'starter' | 'libero' | 'bench') => {
    const isSelected = selectedPlayer === player.id;
    const swipe = swipeState[player.id];
    const isLibero = type === 'libero';
    const isStarter = type === 'starter';
    return (
      <button
        key={player.id}
        onClick={() => {
          setSelectedPlayer(player.id);
          if (pendingAction) {
            // Quick action: if player clicked and action pending, complete it
            handleActionComplete(player.id, null);
          }
        }}
        onTouchStart={(e) => handleTouchStart(player.id, e)}
        onTouchEnd={(e) => handleTouchEnd(player.id, e)}
        className={cn(
          "w-full px-2 py-2 rounded-xl text-left flex items-center gap-2 transition-all",
          isSelected
            ? "bg-navy-600/50 border border-navy-500/50"
            : isLibero 
              ? "bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20"
              : "bg-surface-800 border border-surface-600/30 hover:bg-surface-700",
          swipe === 'right' && 'swipe-right',
          swipe === 'left' && 'swipe-left'
        )}
      >
        {isStarter && <Star size={8} className="text-gold-400 flex-shrink-0" />}
        {isLibero && <Shield size={8} className="text-purple-400 flex-shrink-0" />}
        <span className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0",
          isSelected ? "bg-gold-400/20 text-gold-400" : isLibero ? "bg-purple-500/20 text-purple-400" : "bg-surface-700 text-muted"
        )}>
          {player.number}
        </span>
        <span className={cn(
          "text-xs font-bold truncate",
          isSelected ? "text-white" : "text-muted"
        )}>
          {player.name}
        </span>
      </button>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Match info bar */}
      <div className="px-3 py-1.5 bg-surface-800/50 border-b border-surface-600/20 flex items-center gap-2 text-[10px] text-muted-dark font-bold flex-shrink-0">
        <span className="text-white">{match.info.homeTeam}</span>
        <span>vs</span>
        <span className="text-white">{match.info.awayTeam}</span>
        <span>\u00b7</span>
        <span className="text-gold-400">{t.scout_set} {match.currentSet}</span>
        <div className="ml-auto flex gap-1.5">
          <button
            onClick={handleNewSet}
            className="px-2 py-1 rounded-md bg-surface-700 hover:bg-surface-600 text-muted text-[10px] font-bold transition-colors"
          >
            <Plus size={10} className="inline mr-0.5" />
            {t.scout_new_set}
          </button>
        </div>
      </div>

      {/* Live stats bar */}
      <LiveStatsBar actions={match.actions} />

      {/* Timeout tracker */}
      <TimeoutTracker match={match} onUpdate={onUpdate} />

      {/* Rotation selector (advanced mode) */}
      {advancedMode && (
        <div className="px-3 py-1.5 bg-surface-800/30 border-b border-surface-600/20 flex items-center gap-2 flex-shrink-0">
          <RotateCcw size={12} className="text-gold-400" />
          <span className="text-[10px] font-bold text-muted-dark">{t.rotation}:</span>
          {([1, 2, 3, 4, 5, 6] as const).map(r => (
            <button
              key={r}
              onClick={() => { setCurrentRotation(r); triggerHaptic(15); }}
              className={cn(
                "w-6 h-6 rounded-md text-[10px] font-extrabold transition-all",
                currentRotation === r
                  ? "bg-gold-400/20 text-gold-400 border border-gold-400/40"
                  : "bg-surface-700 text-muted hover:text-white"
              )}
            >
              {r}
            </button>
          ))}
          {advancedMode && selectedFundamental && (
            <span className="ml-auto text-[9px] text-muted-dark italic">
              {t.swipe_right_positive} \u00b7 {t.swipe_left_negative}
            </span>
          )}
        </div>
      )}

      {/* Favorites bar */}
      {favorites.length > 0 && (
        <div className="px-3 py-1.5 bg-surface-800/30 border-b border-surface-600/20 flex items-center gap-1.5 flex-shrink-0 overflow-x-auto">
          <span className="text-[10px] font-bold text-gold-400/60 flex-shrink-0">\u2b50</span>
          {favorites.map((fav) => {
            const fundInfo = FUNDAMENTALS.find(f => f.key === fav.fundamental);
            const qualInfo = QUALITIES.find(q => q.key === fav.quality);
            return (
              <button
                key={`${fav.fundamental}_${fav.quality}`}
                onClick={() => handleAction(fav.fundamental, fav.quality as Quality)}
                className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-bold flex-shrink-0 transition-all border",
                  qualInfo?.bgColor,
                  qualInfo?.borderColor,
                  qualInfo?.color
                )}
              >
                {fundInfo?.emoji} {fav.fundamental} {fav.quality}
                <span className="text-muted-dark ml-1">({fav.count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main scout body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Player column */}
        <div className="w-[120px] flex-shrink-0 overflow-y-auto p-1.5 space-y-1 border-r border-surface-600/20">
          {/* Starters section */}
          {sortedPlayers.starters.length > 0 && (
            <>
              <div className="text-[9px] font-bold text-gold-400/60 uppercase tracking-wider px-1 py-0.5">
                {t.starters}
              </div>
              {sortedPlayers.starters.map((player) => renderPlayerButton(player, 'starter'))}
            </>
          )}
          {/* Liberos section */}
          {sortedPlayers.liberos.length > 0 && (
            <>
              <div className="text-[9px] font-bold text-purple-400/60 uppercase tracking-wider px-1 py-0.5 mt-1">
                {t.liberos}
              </div>
              {sortedPlayers.liberos.map((player) => renderPlayerButton(player, 'libero'))}
            </>
          )}
          {/* Bench */}
          {sortedPlayers.bench.length > 0 && (sortedPlayers.starters.length > 0 || sortedPlayers.liberos.length > 0) && (
            <>
              <div className="border-t border-surface-600/30 my-1" />
              <div className="text-[9px] font-bold text-muted-dark uppercase tracking-wider px-1 py-0.5">
                {t.starters_bench}
              </div>
            </>
          )}
          {sortedPlayers.bench.map((player) => renderPlayerButton(player, 'bench'))}
          {sortedPlayers.starters.length === 0 && sortedPlayers.liberos.length === 0 && sortedPlayers.bench.length === 0 && (
            players.sort((a, b) => a.number - b.number).map((player) => renderPlayerButton(player, 'bench'))
          )}
        </div>

        {/* Actions grid */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* Fundamental tabs for quick select (advanced mode swipe) */}
          {advancedMode && (
            <div className="flex gap-1 mb-2">
              {FUNDAMENTALS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setSelectedFundamental(selectedFundamental === f.key ? null : f.key)}
                  className={cn(
                    "flex-1 px-1 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                    selectedFundamental === f.key
                      ? "bg-navy-600/50 text-white border border-navy-500/50"
                      : "bg-surface-800 text-muted-dark hover:text-muted"
                  )}
                >
                  {f.emoji} {f.key}
                </button>
              ))}
            </div>
          )}

          {/* Column headers */}
          <div className="grid grid-cols-4 gap-1.5 mb-1.5">
            {QUALITIES.map((q) => (
              <div key={q.key} className={cn("text-center text-[10px] font-extrabold py-1 rounded-lg", q.color)}>
                {q.label}
              </div>
            ))}
          </div>

          {/* Fundamental rows */}
          {FUNDAMENTALS.map((fund) => (
            <div key={fund.key} className="mb-2 animate-fade-in">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs">{fund.emoji}</span>
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{fund.label.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {QUALITIES.map((q) => (
                  <button
                    key={q.key}
                    onClick={() => handleAction(fund.key, q.key)}
                    className={cn(
                      "py-4 rounded-xl font-extrabold text-lg transition-all border",
                      q.bgColor, q.borderColor, q.color,
                      "hover:opacity-80 active:scale-90"
                    )}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Direct score buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => onScoreChange(match.currentSet - 1, 'home', 1)}
              className="py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 font-extrabold text-xs"
            >
              {t.scout_point_home}
            </button>
            <button
              onClick={() => onScoreChange(match.currentSet - 1, 'away', 1)}
              className="py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 font-extrabold text-xs"
            >
              {t.scout_point_away}
            </button>
          </div>

          {/* Substitution Panel */}
          <div className="mt-3">
            <SubstitutionPanel match={match} players={players} onUpdate={onUpdate} />
          </div>

          {/* Court Heatmap (advanced mode) */}
          {advancedMode && (
            <div className="mt-3">
              <CourtHeatmap 
                actions={match.actions} 
                selectedFundamental={selectedFundamental}
                interactive={!!selectedPlayer}
                onCourtTap={(pos) => {
                  setPendingPosition(pos);
                  triggerHaptic(20);
                  showToast(`\ud83d\udccd ${pos.x}, ${pos.y}`);
                }}
              />
              {pendingPosition && (
                <p className="text-[10px] text-gold-400 mt-1 text-center">
                  \ud83d\udccd Posizione selezionata: ({pendingPosition.x}, {pendingPosition.y})
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Log strip + Undo */}
      <div className="flex-shrink-0 border-t border-surface-600/20 bg-surface-800/50 px-2 py-2 flex items-center gap-2">
        <button
          onClick={handleUndo}
          disabled={match.actions.length === 0}
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
            match.actions.length > 0
              ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
              : "bg-surface-700 text-muted-dark"
          )}
          title="Undo"
        >
          <Undo2 size={16} />
        </button>
        <div
          ref={logRef}
          className="flex-1 flex gap-1 overflow-x-auto"
        >
          {match.actions.slice(-20).map((action) => {
            const qColor = action.quality === '++' ? 'text-green-400' :
              action.quality === '+' ? 'text-blue-400' :
              action.quality === '-' ? 'text-yellow-400' : 'text-red-400';
            return (
              <div
                key={action.id}
                className="flex-shrink-0 flex items-center gap-0.5 px-1.5 py-1 bg-surface-700/50 rounded-md text-[9px] animate-slide-in"
              >
                <span className="font-bold text-white">{action.playerNumber}</span>
                <span className="text-muted-dark">{action.fundamental}</span>
                <span className={cn("font-extrabold", qColor)}>{action.quality}</span>
              </div>
            );
          })}
          {match.actions.length === 0 && (
            <span className="text-[10px] text-muted-dark italic py-1">{t.scout_no_actions}</span>
          )}
        </div>
      </div>

      {/* Action Modal - Combined player + score selection */}
      {pendingAction && (
        <ActionModal
          isOpen={showActionModal}
          onClose={() => {
            setShowActionModal(false);
            setPendingAction(null);
            setSelectedPlayer(null);
          }}
          onComplete={handleActionComplete}
          players={players}
          starters={match.starters || []}
          liberos={match.liberos || []}
          actionType={pendingAction}
          homeTeam={match.info.homeTeam}
          awayTeam={match.info.awayTeam}
          currentHomeScore={currentScore.home}
          currentAwayScore={currentScore.away}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-surface-700 border border-surface-500 rounded-xl text-sm font-bold text-white shadow-2xl z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
