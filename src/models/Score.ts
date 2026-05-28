import { ScoreType } from './Mode';

export interface Score {
  id?: number;
  roundId: number;
  teamId: number;
  points: number;
  type: ScoreType;
}
