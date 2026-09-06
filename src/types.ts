export interface Player {
  id: string;
  name: string;
  number: number;
  role: PlayerRole;
  isStarter?: boolean; // titolare
}

export type PlayerRole = 'Palleggiatore' | 'Opposto' | 'Schiacciatore' | 'Centrale' | 'Libero';

export interface Roster {
  id: string;
  name: string;
  players: Player[];
  createdAt: number;
}

export type Fundamental = 'ATT' | 'DIF' | 'MUR' | 'BAT' | 'RIC';

export type Quality = '++' | '+' | '-' | '=';

export interface ActionEntry {
  id: string;
  playerId: string;
  playerName: string;
  playerNumber: number;
  fundamental: Fundamental;
  quality: Quality;
  timestamp: number;
  set: number;
  // Advanced mode fields (optional)
  position?: { x: number; y: number };
  rotation?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface MatchInfo {
  homeTeam: string;
  awayTeam: string;
  date: string;
  location: string;
  rosterId: string;
}

export interface SetScore {
  home: number;
  away: number;
}

export interface Substitution {
  id: string;
  timestamp: number;
  set: number;
  playerOut: string; // player ID
  playerIn: string;  // player ID
  playerOutNumber: number;
  playerInNumber: number;
  playerOutName: string;
  playerInName: string;
}

export interface TimeoutRecord {
  id: string;
  timestamp: number;
  set: number;
  team: 'home' | 'away';
}

export interface MatchState {
  id: string;
  info: MatchInfo;
  actions: ActionEntry[];
  scores: SetScore[];
  currentSet: number;
  started: boolean;
  starters?: string[];      // player IDs of 6 starters (non-liberos)
  liberos?: string[];       // player IDs of 1-2 liberos
  substitutions?: Substitution[];
  timeouts?: TimeoutRecord[];
  createdAt: number;
  updatedAt: number;
}

export interface SavedGame {
  match: MatchState;
  players: Player[];
}

export type TabId = 'scout' | 'home' | 'stats' | 'roster' | 'summary';

export interface PlayerStats {
  playerId: string;
  playerName: string;
  playerNumber: number;
  playerRole: PlayerRole;
  fundamentals: {
    [key in Fundamental]: {
      pp: number; // ++
      p: number;  // +
      m: number;  // -
      eq: number; // =
      total: number;
      efficiency: number;
      positivity: number;
    };
  };
  totals: {
    pp: number;
    p: number;
    m: number;
    eq: number;
    total: number;
  };
}

export interface FavoriteAction {
  fundamental: Fundamental;
  quality: Quality;
  count: number;
}

export interface AppSettings {
  advancedMode: boolean;
  language: string;
}

export interface GameSession {
  id: string;
  match: MatchState;
  players: Player[];
  createdAt: number;
  updatedAt: number;
}
