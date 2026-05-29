import type {Mode} from './Mode';
import type {Trump} from './Trump.ts';

export interface ScoreEntry {
  id: number;
  team1Points: number;
  team2Points: number;
  mode: Mode;
  playingTeam: 1 | 2;
  roundNumber: number;
  trump?: Trump;
}
