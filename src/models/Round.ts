import { GameVariety } from './Mode';

export interface Round {
  id?: number;
  gameId: number;
  roundNumber: number;
  variety: GameVariety;
}
