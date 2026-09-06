import Dexie, { Table } from 'dexie';
import { GameSession, Roster, AppSettings, MatchState } from './types';

class VolleyballDB extends Dexie {
  games!: Table<GameSession, string>;
  rosters!: Table<Roster, string>;
  settings!: Table<AppSettings, string>;
  match!: Table<MatchState, string>;

  constructor() {
    super('VolleyballScoutDB');
    
    this.version(1).stores({
      games: 'id,updatedAt,createdAt,match.info.homeTeam,match.info.awayTeam',
      rosters: 'id,name,createdAt',
      settings: 'id',
      match: 'id'
    });
  }
}

export const db = new VolleyballDB();

// Helper functions for migration from localStorage
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    // Migrate rosters
    const rostersJson = localStorage.getItem('volleyball_scout_rosters');
    if (rostersJson) {
      const rosters: Roster[] = JSON.parse(rostersJson);
      await db.rosters.bulkPut(rosters);
    }

    // Migrate match
    const matchJson = localStorage.getItem('volleyball_scout_match');
    if (matchJson) {
      const match: MatchState = JSON.parse(matchJson);
      await db.match.put({ ...match, id: 'legacy' });
    }

    // Migrate settings
    const settingsJson = localStorage.getItem('volleyball_scout_settings');
    if (settingsJson) {
      const settings: AppSettings = JSON.parse(settingsJson);
      await db.settings.put({ ...settings, id: 'settings' });
    }

    // Migrate games
    const gamesJson = localStorage.getItem('volleyball_scout_games');
    if (gamesJson) {
      const games: GameSession[] = JSON.parse(gamesJson);
      await db.games.bulkPut(games);
    }

    // Clear localStorage after migration
    localStorage.removeItem('volleyball_scout_rosters');
    localStorage.removeItem('volleyball_scout_match');
    localStorage.removeItem('volleyball_scout_settings');
    localStorage.removeItem('volleyball_scout_games');
    localStorage.removeItem('volleyball_scout_current_game_id');
    
    console.log('✅ Migrated from localStorage to Dexie.js');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}
