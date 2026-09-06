import { Roster, MatchState, ActionEntry, Fundamental, PlayerStats, Player, AppSettings, GameSession } from './types';

const ROSTERS_KEY = 'volleyball_scout_rosters';
const MATCH_KEY = 'volleyball_scout_match';
const GAMES_KEY = 'volleyball_scout_games';
const SETTINGS_KEY = 'volleyball_scout_settings';
const CURRENT_GAME_ID = 'volleyball_scout_current_game_id';

// Roster storage
export function loadRosters(): Roster[] {
  try {
    const data = localStorage.getItem(ROSTERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRosters(rosters: Roster[]) {
  localStorage.setItem(ROSTERS_KEY, JSON.stringify(rosters));
}

// Match storage (legacy - for backward compatibility)
export function loadMatch(): MatchState | null {
  try {
    const data = localStorage.getItem(MATCH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveMatch(match: MatchState) {
  localStorage.setItem(MATCH_KEY, JSON.stringify(match));
}

export function clearMatch() {
  localStorage.removeItem(MATCH_KEY);
}

// Multiple games storage
export function loadGames(): GameSession[] {
  try {
    const data = localStorage.getItem(GAMES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveGames(games: GameSession[]) {
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

export function getCurrentGameId(): string | null {
  try {
    return localStorage.getItem(CURRENT_GAME_ID);
  } catch {
    return null;
  }
}

export function setCurrentGameId(gameId: string | null) {
  if (gameId) {
    localStorage.setItem(CURRENT_GAME_ID, gameId);
  } else {
    localStorage.removeItem(CURRENT_GAME_ID);
  }
}

export function saveGame(session: GameSession): GameSession {
  const games = loadGames();
  const existingIndex = games.findIndex(g => g.id === session.id);
  const updatedSession = {
    ...session,
    updatedAt: Date.now(),
  };
  
  if (existingIndex >= 0) {
    games[existingIndex] = updatedSession;
  } else {
    games.push(updatedSession);
  }
  
  saveGames(games);
  return updatedSession;
}

export function deleteGame(gameId: string): boolean {
  const games = loadGames();
  const index = games.findIndex(g => g.id === gameId);
  if (index >= 0) {
    games.splice(index, 1);
    saveGames(games);
    return true;
  }
  return false;
}

export function loadCurrentGame(): GameSession | null {
  const currentId = getCurrentGameId();
  if (!currentId) return null;
  
  const games = loadGames();
  return games.find(g => g.id === currentId) || null;
}

export function getGameById(gameId: string): GameSession | null {
  const games = loadGames();
  return games.find(g => g.id === gameId) || null;
}

// Settings storage
export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { advancedMode: false, language: 'it' };
  } catch {
    return { advancedMode: false, language: 'it' };
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Default match
export function createDefaultMatch(rosterId?: string): MatchState {
  return {
    id: generateId(),
    info: { homeTeam: '', awayTeam: '', date: '', location: '', rosterId: rosterId || '' },
    actions: [],
    scores: [{ home: 0, away: 0 }],
    currentSet: 1,
    started: false,
    starters: [],
    liberos: [],
    substitutions: [],
    timeouts: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createNewGameSession(rosterId?: string): GameSession {
  const match = createDefaultMatch(rosterId);
  return {
    id: generateId(),
    match,
    players: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// Stats calculation
export function calculatePlayerStats(actions: ActionEntry[], players: Player[]): PlayerStats[] {
  const fundamentals: Fundamental[] = ['ATT', 'DIF', 'MUR', 'BAT', 'RIC'];

  return players.map((player) => {
    const playerActions = actions.filter((a) => a.playerId === player.id);

    const fundStats: PlayerStats['fundamentals'] = {} as PlayerStats['fundamentals'];
    let totalPP = 0, totalP = 0, totalM = 0, totalEQ = 0;

    fundamentals.forEach((fund) => {
      const fa = playerActions.filter((a) => a.fundamental === fund);
      const pp = fa.filter((a) => a.quality === '++').length;
      const p = fa.filter((a) => a.quality === '+').length;
      const m = fa.filter((a) => a.quality === '-').length;
      const eq = fa.filter((a) => a.quality === '=').length;
      const total = pp + p + m + eq;

      totalPP += pp;
      totalP += p;
      totalM += m;
      totalEQ += eq;

      fundStats[fund] = {
        pp, p, m, eq, total,
        efficiency: total > 0 ? Math.round(((pp - m) / total) * 100) : 0,
        positivity: total > 0 ? Math.round(((pp + p) / total) * 100) : 0,
        successRate: total > 0 ? Math.round(((pp + p) / total) * 100) : 0,
        errorRate: total > 0 ? Math.round((eq / total) * 100) : 0,
        netEfficiency: total > 0 ? Math.round(((pp - m - eq) / total) * 100) : 0,
      };
    });

    return {
      playerId: player.id,
      playerName: player.name,
      playerNumber: player.number,
      playerRole: player.role,
      fundamentals: fundStats,
      totals: {
        pp: totalPP,
        p: totalP,
        m: totalM,
        eq: totalEQ,
        total: totalPP + totalP + totalM + totalEQ,
      },
    };
  });
}

// UUID generator
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Get favorite actions (most used action combos)
export function getFavoriteActions(actions: ActionEntry[], topN: number = 5) {
  const counts: Record<string, { fundamental: Fundamental; quality: string; count: number }> = {};
  
  for (const action of actions) {
    const key = `${action.fundamental}_${action.quality}`;
    if (!counts[key]) {
      counts[key] = { fundamental: action.fundamental, quality: action.quality, count: 0 };
    }
    counts[key].count++;
  }
  
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}
