import type {Mode} from '@/types/Mode';

export interface DBScoreEntry {
  id: number;
  gameId: number;
  team1Points: number;
  team2Points: number;
  mode: Mode;
  playingTeam: 1 | 2;
  roundNumber: number;
  trump?: string;
}
