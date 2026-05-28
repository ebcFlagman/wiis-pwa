import Dexie, {type EntityTable} from 'dexie';
import type {DBGame, DBScoreEntry, DBSettings} from '@/db/entities';

export type {DBGame, DBScoreEntry, DBSettings};

class WiisDB extends Dexie {
  games!: EntityTable<DBGame, 'id'>;
  entries!: EntityTable<DBScoreEntry, 'id'>;
  settings!: EntityTable<DBSettings, 'id'>;

  constructor() {
    super('WiisDB');
    this.version(1).stores({
      games: '++id, createdAt, finishedAt',
      entries: '++id, gameId, roundNumber',
      settings: '++id',
    });
  }
}

export const db = new WiisDB();
