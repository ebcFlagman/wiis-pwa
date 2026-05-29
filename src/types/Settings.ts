import type {Trump} from './Trump.ts';

export interface Settings {
  goal: number;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  trumpMultipliers: Record<Trump, number>;
}
