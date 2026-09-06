import { useState, useMemo, useEffect } from 'react';
import { GameSession } from '../types';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { Calendar, Clock, Trophy, PlayCircle, Trash2, Plus, FileText, RotateCcw } from 'lucide-react';

interface Props {
  games: GameSession[];
  currentGameId: string | null;
  onLoadGame: (game: GameSession) => void;
  onNewGame: () => void;
  onDeleteGame: (gameId: string) => void;
}

export default function MatchesPage({ games, currentGameId, onLoadGame, onNewGame, onDeleteGame }: Props) {
  const { t } = useI18n();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const sortedGames = useMemo(() => {
    return [...games].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [games]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGameTitle = (game: GameSession) => {
    const match = game.match;
    if (match.info.homeTeam && match.info.awayTeam) {
      return `${match.info.homeTeam} vs ${match.info.awayTeam}`;
    }
    return t.games_new_game;
  };

  const getGameStatus = (game: GameSession) => {
    const match = game.match;
    if (!match.started) return t.home_no_roster;
    if (match.actions.length === 0) return 'Started';
    
    const totalActions = match.actions.length;
    const currentSetIndex = match.currentSet - 1;
    const currentScore = match.scores[currentSetIndex];
    
    return `${currentScore.home}-${currentScore.away} (${totalActions} ${t.summary_actions}, ${t.scout_set} ${match.currentSet})`;
  };

  const handleNewMatch = () => {
    onNewGame();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <History size={18} className="text-gold-400" />
          <h2 className="text-base font-bold text-white">{t.games_title}</h2>
        </div>

        {sortedGames.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-3 text-muted-dark opacity-40" />
            <p className="text-sm text-muted">{t.games_no_games}</p>
            <p className="text-xs text-muted-dark mt-1">{t.games_no_games_desc}</p>
            
            <button
              onClick={handleNewMatch}
              className="mt-6 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-green-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors mx-auto"
            >
              <Plus size={16} />
              {t.games_new_game}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedGames.map((game) => {
              const isCurrent = game.id === currentGameId;
              const match = game.match;
              
              return (
                <div
                  key={game.id}
                  className={cn(
                    "bg-surface-800 border border-surface-600/50 rounded-xl p-3 transition-all animate-fade-in",
                    isCurrent && "border-gold-400/30 bg-gold-400/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-navy-600/50 flex items-center justify-center flex-shrink-0">
                          <Calendar size={14} className="text-gold-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white truncate">{getGameTitle(game)}</p>
                          <p className="text-xs text-muted-dark">{formatDate(game.updatedAt)} at {formatTime(game.updatedAt)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted ml-10">{getGameStatus(game)}</p>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      {isCurrent ? (
                        <span className="text-xs font-bold text-gold-400 uppercase">{t.games_current}</span>
                      ) : (
                        <button
                          onClick={() => onLoadGame(game)}
                          className="px-3 py-1.5 bg-navy-600/50 hover:bg-navy-600 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1"
                        >
                          <PlayCircle size={12} />
                          {t.games_load}
                        </button>
                      )}
                      
                      {!isCurrent && (
                        <button
                          onClick={() => setDeleteConfirmId(deleteConfirmId === game.id ? null : game.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs font-bold text-red-400 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          {deleteConfirmId === game.id ? t.confirm : t.games_delete}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {deleteConfirmId === game.id && !isCurrent && (
                    <div className="mt-2 pt-2 border-t border-surface-600/30 flex justify-end gap-2">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1.5 bg-surface-600 hover:bg-surface-500 rounded-lg text-xs font-bold text-muted transition-colors"
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={() => {
                          onDeleteGame(game.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-bold text-red-400 transition-colors"
                      >
                        {t.games_delete}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* New game button */}
        {!sortedGames.length || sortedGames.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-600/50">
            <button
              onClick={handleNewMatch}
              className="w-full py-3.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={18} />
              {t.games_new_game}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
