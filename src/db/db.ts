import Dexie, { type EntityTable } from 'dexie';
import type { Team } from '../models/Team';
import type { Game } from '../models/Game';
import type { Round } from '../models/Round';
import type { Score } from '../models/Score';
import type { Settings } from '../models/Settings';

class JassDatabase extends Dexie {
  teams!: EntityTable<Team, 'id'>;
  games!: EntityTable<Game, 'id'>;
  rounds!: EntityTable<Round, 'id'>;
  scores!: EntityTable<Score, 'id'>;
  settings!: EntityTable<Settings, 'id'>;

  constructor() {
    super('wiis');
    this.version(1).stores({
      teams: '++id, teamName',
      games: '++id, date, status, team1Id, team2Id',
      rounds: '++id, gameId, roundNumber',
      scores: '++id, roundId, teamId, type',
      settings: '++id'
    });
  }
}

export const db = new JassDatabase();

// Datenbank öffnen, um Initialisierung und populate zu erzwingen
db.open().catch((err) => {
  console.error("Fehler beim Öffnen der JassDatabase:", err);
});

// Initialdaten hinzufügen
db.on('populate', () => {
  db.settings.add({
    goal: 2500,
    player1: 'Spieler 1',
    player2: 'Spieler 2',
    player3: 'Spieler 3',
    player4: 'Spieler 4',
  });
});

export default db;
