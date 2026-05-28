import type { DialogState, Mode, ScoreEntry, Settings } from '@/types';

export interface StoreState extends Settings {
  initialized: boolean;
  currentGameId: number | null;
  entries: ScoreEntry[];
  currentRound: number;
  dialog: DialogState;

  getTotal: (team: 1 | 2) => number;
  getLastRoundTotal: (team: 1 | 2) => number;

  initialize: () => Promise<void>;
  addScore: (team: 1 | 2, mode: Mode, score: number, multiplier: number) => Promise<void>;
  undo: () => Promise<void>;
  newGame: () => Promise<void>;

  openMenu: (team: 1 | 2) => void;
  openScoreInput: (team: 1 | 2) => void;
  openClaims: (team: 1 | 2) => void;
  openMultiplier: (team: 1 | 2, mode: Mode, score: number) => void;
  openSettings: () => void;
  openAbout: () => void;
  confirmNewGame: () => void;
  closeDialog: () => void;

  updateSettings: (settings: Partial<Settings>) => Promise<void>;
}
