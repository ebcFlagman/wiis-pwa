import type {Trump} from '@/types/Trump.ts';

export interface DBSettings {
  id: number;
  goal: number;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  trumpMultipliers?: Record<Trump, number>;
}
