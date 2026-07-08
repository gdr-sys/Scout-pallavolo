export interface Player {
  id: string;
  name: string;
  number: number;
  role: PlayerRole;
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

export interface MatchState {
  info: MatchInfo;
  actions: ActionEntry[];
  scores: SetScore[];
  currentSet: number;
  started: boolean;
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
