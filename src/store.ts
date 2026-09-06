import { Roster, MatchState, ActionEntry, Fundamental, PlayerStats, Player, AppSettings, GameSession } from './types';
import { db, migrateFromLocalStorage } from './db';

const ROSTERS_KEY = 'volleyball_scout_rosters';
const MATCH_KEY = 'volleyball_scout_match';
const GAMES_KEY = 'volleyball_scout_games';
const SETTINGS_KEY = 'volleyball_scout_settings';
const CURRENT_GAME_ID = 'volleyball_scout_current_game_id';

// Initialize database and migrate from localStorage
migrateFromLocalStorage().catch(console.error);

// Roster storage
export async function loadRosters(): Promise<Roster[]> {
  try {
    const rosters = await db.rosters.toArray();
    if (rosters.length > 0) return rosters;
    // Fallback to localStorage for backward compatibility
    const data = localStorage.getItem(ROSTERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    const data = localStorage.getItem(ROSTERS_KEY);
    return data ? JSON.parse(data) : [];
  }
}

export async function saveRosters(rosters: Roster[]) {
  try {
    await db.rosters.bulkPut(rosters);
    localStorage.setItem(ROSTERS_KEY, JSON.stringify(rosters));
  } catch {
    localStorage.setItem(ROSTERS_KEY, JSON.stringify(rosters));
  }
}

// Match storage (legacy - for backward compatibility)
export async function loadMatch(): Promise<MatchState | null> {
  try {
    const matches = await db.match.toArray();
    if (matches.length > 0) return matches[0];
    // Fallback to localStorage
    const data = localStorage.getItem(MATCH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    const data = localStorage.getItem(MATCH_KEY);
    return data ? JSON.parse(data) : null;
  }
}

export async function saveMatch(match: MatchState) {
  try {
    await db.match.put(match);
    localStorage.setItem(MATCH_KEY, JSON.stringify(match));
  } catch {
    localStorage.setItem(MATCH_KEY, JSON.stringify(match));
  }
}

export function clearMatch() {
  localStorage.removeItem(MATCH_KEY);
}

// Multiple games storage
export async function loadGames(): Promise<GameSession[]> {
  try {
    const games = await db.games.toArray();
    if (games.length > 0) return games;
    // Fallback to localStorage
    const data = localStorage.getItem(GAMES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    const data = localStorage.getItem(GAMES_KEY);
    return data ? JSON.parse(data) : [];
  }
}

export async function saveGames(games: GameSession[]) {
  try {
    await db.games.bulkPut(games);
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
  } catch {
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
  }
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

export async function saveGame(session: GameSession): Promise<GameSession> {
  try {
    await db.games.put(session);
  } catch {
    // Fallback to localStorage
    const games = await loadGames();
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
  
  return session;
}

export async function deleteGame(gameId: string): Promise<boolean> {
  try {
    await db.games.delete(gameId);
    const games = await loadGames();
    const index = games.findIndex(g => g.id === gameId);
    if (index >= 0) {
      games.splice(index, 1);
      saveGames(games);
    }
    return true;
  } catch {
    const games = await loadGames();
    const index = games.findIndex(g => g.id === gameId);
    if (index >= 0) {
      games.splice(index, 1);
      saveGames(games);
      return true;
    }
    return false;
  }
}

export async function loadCurrentGame(): Promise<GameSession | null> {
  const currentId = getCurrentGameId();
  if (!currentId) return null;
  
  try {
    const games = await loadGames();
    return games.find(g => g.id === currentId) || null;
  } catch {
    return null;
  }
}

export async function getGameById(gameId: string): Promise<GameSession | null> {
  try {
    const games = await loadGames();
    return games.find(g => g.id === gameId) || null;
  } catch {
    return null;
  }
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
