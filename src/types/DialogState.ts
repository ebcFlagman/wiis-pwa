import type { Mode } from './Mode';

export type DialogState =
  | { type: 'none' }
  | { type: 'mainMenu'; team: 1 | 2 }
  | { type: 'scoreInput'; team: 1 | 2 }
  | { type: 'claims'; team: 1 | 2 }
  | { type: 'multiplier'; team: 1 | 2; mode: Mode; score: number }
  | { type: 'settings' }
  | { type: 'result'; winner: 1 | 2 }
  | { type: 'about' }
  | { type: 'confirmNewGame' };
