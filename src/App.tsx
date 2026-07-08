import { useState, useEffect, useCallback, useMemo } from 'react';
import { TabId, Roster, MatchState } from './types';
import {
  loadRosters, saveRosters,
  loadMatch, saveMatch, clearMatch,
  createDefaultMatch, calculatePlayerStats,
} from './store';
import { useI18n } from './i18n/context';
import { useAuth } from './firebase/context';
import { cn } from './utils/cn';
import HomePage from './components/HomePage';
import ScoutPage from './components/ScoutPage';
import StatsPage from './components/StatsPage';
import RosterPage from './components/RosterPage';
import SummaryPage from './components/SummaryPage';
import SettingsModal from './components/SettingsModal';
import { Home, Crosshair, BarChart3, Users, FileText, Minus, Plus, Settings, Cloud } from 'lucide-react';

export default function App() {
  const { t } = useI18n();
  const { user, cloudRosters, cloudMatch, saveRostersToCloud, saveMatchToCloud, isSyncing, isConfigured } = useAuth();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [rosters, setRosters] = useState<Roster[]>(() => loadRosters());
  const [match, setMatch] = useState<MatchState>(() => loadMatch() || createDefaultMatch());
  const [scorePulse, setScorePulse] = useState<'home' | 'away' | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync rosters from cloud when user logs in
  useEffect(() => {
    if (user && cloudRosters.length > 0) {
      setRosters(cloudRosters);
    }
  }, [user, cloudRosters]);

  // Sync match from cloud when user logs in
  useEffect(() => {
    if (user && cloudMatch) {
      setMatch(cloudMatch);
    }
  }, [user, cloudMatch]);

  // Persist rosters locally
  useEffect(() => {
    saveRosters(rosters);
  }, [rosters]);

  // Persist match locally
  useEffect(() => {
    saveMatch(match);
  }, [match]);

  // Get players from selected roster
  const players = useMemo(() => {
    const roster = rosters.find((r) => r.id === match.info.rosterId);
    return roster?.players || [];
  }, [rosters, match.info.rosterId]);

  // Calculate stats
  const stats = useMemo(() => {
    return calculatePlayerStats(match.actions, players);
  }, [match.actions, players]);

  const handleSaveRosters = useCallback((updated: Roster[]) => {
    setRosters(updated);
    if (user && !user.isAnonymous) {
      saveRostersToCloud(updated);
    }
  }, [user, saveRostersToCloud]);

  const handleStartMatch = useCallback((updated: MatchState) => {
    setMatch(updated);
    setActiveTab('scout');
    if (user && !user.isAnonymous) {
      saveMatchToCloud(updated);
    }
  }, [user, saveMatchToCloud]);

  const handleUpdateMatch = useCallback((updated: MatchState) => {
    setMatch(updated);
    if (user && !user.isAnonymous) {
      saveMatchToCloud(updated);
    }
  }, [user, saveMatchToCloud]);

  const handleScoreChange = useCallback((setIdx: number, team: 'home' | 'away', delta: number) => {
    setMatch((prev) => {
      const newScores = [...prev.scores];
      if (!newScores[setIdx]) return prev;
      const score = { ...newScores[setIdx] };
      score[team] = Math.max(0, score[team] + delta);
      newScores[setIdx] = score;
      const updated = { ...prev, scores: newScores };
      if (user && !user.isAnonymous) {
        saveMatchToCloud(updated);
      }
      return updated;
    });
    setScorePulse(team);
    setTimeout(() => setScorePulse(null), 300);
  }, [user, saveMatchToCloud]);

  const handleResetMatch = useCallback(() => {
    const newMatch = createDefaultMatch();
    clearMatch();
    setMatch(newMatch);
    setActiveTab('home');
    if (user && !user.isAnonymous) {
      saveMatchToCloud(newMatch);
    }
  }, [user, saveMatchToCloud]);

  const currentScore = match.scores[match.currentSet - 1] || { home: 0, away: 0 };

  const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
    { id: 'home', label: t.nav_home, icon: Home },
    { id: 'scout', label: t.nav_scout, icon: Crosshair },
    { id: 'stats', label: t.nav_stats, icon: BarChart3 },
    { id: 'roster', label: t.nav_roster, icon: Users },
    { id: 'summary', label: t.nav_report, icon: FileText },
  ];

  // Determine what to show in the top bar based on active tab
  const showScoreBar = match.started && activeTab === 'scout';

  return (
    <div className="flex flex-col h-full bg-surface-900 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="bg-navy-800 border-b border-surface-500/30 px-3 flex items-center gap-2 h-[52px] flex-shrink-0">

        {showScoreBar ? (
          /* ─── SCOUT TAB: full score controls ─── */
          <>
            {/* Score - Home */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider hidden sm:block mr-1">{match.info.homeTeam}</span>
              <button
                onClick={() => handleScoreChange(match.currentSet - 1, 'home', -1)}
                className="w-7 h-7 rounded-lg bg-navy-600/50 hover:bg-navy-600 flex items-center justify-center transition-colors"
              >
                <Minus size={14} className="text-muted" />
              </button>
              <span className={cn(
                "text-xl font-black text-gold-400 min-w-[28px] text-center tabular-nums",
                scorePulse === 'home' && 'score-pulse'
              )}>
                {currentScore.home}
              </span>
              <button
                onClick={() => handleScoreChange(match.currentSet - 1, 'home', 1)}
                className="w-7 h-7 rounded-lg bg-navy-600/50 hover:bg-navy-600 flex items-center justify-center transition-colors"
              >
                <Plus size={14} className="text-gold-400" />
              </button>
            </div>

            {/* Center: Set indicator */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-muted-dark uppercase tracking-wider">
                {t.scout_set} {match.currentSet}
              </span>
              <span className="text-xs font-extrabold text-white">
                🏐 SCOUT
              </span>
            </div>

            {/* Score - Away */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleScoreChange(match.currentSet - 1, 'away', -1)}
                className="w-7 h-7 rounded-lg bg-navy-600/50 hover:bg-navy-600 flex items-center justify-center transition-colors"
              >
                <Minus size={14} className="text-muted" />
              </button>
              <span className={cn(
                "text-xl font-black text-gold-400 min-w-[28px] text-center tabular-nums",
                scorePulse === 'away' && 'score-pulse'
              )}>
                {currentScore.away}
              </span>
              <button
                onClick={() => handleScoreChange(match.currentSet - 1, 'away', 1)}
                className="w-7 h-7 rounded-lg bg-navy-600/50 hover:bg-navy-600 flex items-center justify-center transition-colors"
              >
                <Plus size={14} className="text-gold-400" />
              </button>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider hidden sm:block ml-1">{match.info.awayTeam}</span>
            </div>
          </>
        ) : (
          /* ─── ALL OTHER TABS: simple title bar ─── */
          <>
            <div className="flex-1 flex items-center justify-center gap-2">
              <span className="text-base font-extrabold tracking-wider text-white">
                🏐 VOLLEYBALL SCOUT
              </span>
              {/* Cloud sync indicator */}
              {isConfigured && user && !user.isAnonymous && (
                <span className={cn(
                  "flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md",
                  isSyncing
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-green-500/10 text-green-400"
                )}>
                  <Cloud size={10} className={isSyncing ? "animate-pulse" : ""} />
                  {isSyncing ? "..." : "✓"}
                </span>
              )}
            </div>
          </>
        )}

        {/* Settings button — always visible */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-9 h-9 rounded-xl bg-navy-600/30 hover:bg-navy-600/50 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Settings size={16} className="text-muted" />
        </button>
      </div>

      {/* Page Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'home' && (
          <HomePage match={match} rosters={rosters} onStartMatch={handleStartMatch} />
        )}
        {activeTab === 'scout' && (
          <ScoutPage
            match={match}
            players={players}
            onUpdate={handleUpdateMatch}
            onScoreChange={handleScoreChange}
          />
        )}
        {activeTab === 'stats' && (
          <StatsPage stats={stats} matchStarted={match.started} />
        )}
        {activeTab === 'roster' && (
          <RosterPage rosters={rosters} onSave={handleSaveRosters} />
        )}
        {activeTab === 'summary' && (
          <SummaryPage stats={stats} match={match} players={players} onResetMatch={handleResetMatch} />
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className="bg-navy-800 border-t border-surface-500/30 flex items-stretch h-[56px] flex-shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-all relative",
                isActive
                  ? "text-gold-400"
                  : "text-muted-dark hover:text-muted"
              )}
            >
              <Icon size={18} className={isActive ? "drop-shadow-[0_0_6px_rgba(245,200,66,0.4)]" : ""} />
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider",
                isActive && "text-gold-400"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 rounded-full bg-gold-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
