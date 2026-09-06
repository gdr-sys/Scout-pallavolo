import { useState, useMemo } from 'react';
import { GameSession } from '../types';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { Calendar, Clock, Trophy, PlayCircle, Trash2, X, Plus, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  games: GameSession[];
  currentGameId: string | null;
  onLoadGame: (game: GameSession) => void;
  onNewGame: () => void;
  onDeleteGame: (gameId: string) => void;
}

export default function GameListModal({ isOpen, onClose, games, currentGameId, onLoadGame, onNewGame, onDeleteGame }: Props) {
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
    return 'Untitled Match';
  };

  const getGameStatus = (game: GameSession) => {
    const match = game.match;
    if (!match.started) return 'Not started';
    if (match.actions.length === 0) return 'Started';
    
    const totalActions = match.actions.length;
    const sets = match.scores.length;
    
    // Find current score
    const currentSetIndex = match.currentSet - 1;
    const currentScore = match.scores[currentSetIndex];
    
    return `${currentScore.home}-${currentScore.away} (${totalActions} actions, Set ${match.currentSet})`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-800 border border-surface-600 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-600/30">
          <div className="flex items-center gap-3">
            <History size={20} className="text-gold-400" />
            <h2 className="text-lg font-bold text-white">Saved Games</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-700 hover:bg-surface-600 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {sortedGames.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto mb-3 text-muted-dark opacity-40" />
              <p className="text-sm text-muted">No saved games found</p>
              <p className="text-xs text-muted-dark mt-1">Start a new match to save it</p>
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
                      "bg-surface-700/50 border border-surface-600/30 rounded-xl p-3 transition-all",
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
                            <p className="text-xs text-muted-dark">{formatDate(game.updatedAt)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted ml-10">{getGameStatus(game)}</p>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        {isCurrent ? (
                          <span className="text-xs font-bold text-gold-400 uppercase">Current</span>
                        ) : (
                          <button
                            onClick={() => onLoadGame(game)}
                            className="px-3 py-1.5 bg-navy-600/50 hover:bg-navy-600 rounded-lg text-xs font-bold text-white transition-colors"
                          >
                            Load
                          </button>
                        )}
                        
                        {!isCurrent && (
                          <button
                            onClick={() => setDeleteConfirmId(deleteConfirmId === game.id ? null : game.id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs font-bold text-red-400 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            {deleteConfirmId === game.id ? 'Sure?' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {deleteConfirmId === game.id && (
                      <div className="mt-2 pt-2 border-t border-surface-600/30 flex justify-end gap-2">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-1.5 bg-surface-600 hover:bg-surface-500 rounded-lg text-xs font-bold text-muted transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            onDeleteGame(game.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-bold text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-600/30 flex gap-2">
          <button
            onClick={() => {
              onNewGame();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-sm font-bold text-green-400 transition-colors"
          >
            <Plus size={16} />
            New Game
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-surface-700 hover:bg-surface-600 rounded-xl text-sm font-bold text-muted transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
