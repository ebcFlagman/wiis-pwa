import { create } from 'zustand';
import { db } from '@/db/db';
import {
  type ScoreEntry,
  type Settings,
  DEFAULT_GOAL,
  MATCH_SCORE,
  MAX_WRITE_SCORE,
} from '@/types';
import type { StoreState } from './types';

// Guard against double-init from React StrictMode's double-invoke of effects
let initStarted = false;

const defaultSettings: Settings = {
  goal: DEFAULT_GOAL,
  player1: 'Spieler 1',
  player2: 'Spieler 2',
  player3: 'Spieler 3',
  player4: 'Spieler 4',
};

function calcCurrentRound(entries: ScoreEntry[]): number {
  if (entries.length === 0) return 1;
  const maxRound = Math.max(...entries.map((e) => e.roundNumber));
  const writeInMax = entries.some((e) => e.roundNumber === maxRound && e.mode === 'WRITE');
  return writeInMax ? maxRound + 1 : maxRound;
}

export const useStore = create<StoreState>()((set, get) => ({
  ...defaultSettings,
  initialized: false,
  currentGameId: null,
  entries: [],
  currentRound: 1,
  dialog: { type: 'none' },

  getTotal: (team) => {
    const { entries } = get();
    return entries.reduce(
      (sum, e) => sum + (team === 1 ? e.team1Points : e.team2Points),
      0
    );
  },

  getLastRoundTotal: (team) => {
    const { entries, currentRound } = get();
    const lastCompleted = currentRound - 1;
    if (lastCompleted < 1) return 0;
    return entries
      .filter((e) => e.roundNumber === lastCompleted)
      .reduce((sum, e) => sum + (team === 1 ? e.team1Points : e.team2Points), 0);
  },

  initialize: async () => {
    if (initStarted) return;
    initStarted = true;

    const storedSettings = await db.settings.get(1);

    let game = await db.games
      .orderBy('createdAt')
      .filter((g) => g.finishedAt === undefined)
      .last();

    const settings: Settings = storedSettings
      ? {
          goal: storedSettings.goal,
          player1: storedSettings.player1,
          player2: storedSettings.player2,
          player3: storedSettings.player3,
          player4: storedSettings.player4,
        }
      : defaultSettings;

    if (!game) {
      const id = await db.games.add({
        createdAt: Date.now(),
        ...settings,
      } as Parameters<typeof db.games.add>[0]);
      game = await db.games.get(id as number);
    }

    const dbEntries = game
      ? await db.entries.where('gameId').equals(game.id).sortBy('id')
      : [];

    const entries: ScoreEntry[] = dbEntries.map(
      ({ id, team1Points, team2Points, mode, playingTeam, roundNumber }) => ({
        id, team1Points, team2Points, mode, playingTeam, roundNumber,
      })
    );

    set({
      ...settings,
      currentGameId: game?.id ?? null,
      entries,
      currentRound: calcCurrentRound(entries),
      initialized: true,
    });
  },

  addScore: async (team, mode, score, multiplier) => {
    const { entries, currentRound, goal, currentGameId } = get();
    if (currentGameId === null) return;

    let team1Points = 0;
    let team2Points = 0;

    if (mode === 'WRITE') {
      if (team === 1) {
        team1Points = score * multiplier;
        team2Points = (MAX_WRITE_SCORE - score) * multiplier;
      } else {
        team2Points = score * multiplier;
        team1Points = (MAX_WRITE_SCORE - score) * multiplier;
      }
    } else {
      const pts = (mode === 'MATCH' ? MATCH_SCORE : score) * multiplier;
      if (team === 1) team1Points = pts;
      else team2Points = pts;
    }

    const entryId = await db.entries.add({
      gameId: currentGameId,
      team1Points,
      team2Points,
      mode,
      playingTeam: team,
      roundNumber: currentRound,
    } as Parameters<typeof db.entries.add>[0]);

    const newEntry: ScoreEntry = {
      id: entryId as number,
      team1Points,
      team2Points,
      mode,
      playingTeam: team,
      roundNumber: currentRound,
    };

    const newEntries = [...entries, newEntry];
    const nextRound = mode === 'WRITE' ? currentRound + 1 : currentRound;

    const t1Total = newEntries.reduce((s, e) => s + e.team1Points, 0);
    const t2Total = newEntries.reduce((s, e) => s + e.team2Points, 0);
    const winner: 1 | 2 | null = t1Total >= goal ? 1 : t2Total >= goal ? 2 : null;

    if (winner) {
      await db.games.update(currentGameId, { finishedAt: Date.now(), winner });
    }

    set({
      entries: newEntries,
      currentRound: nextRound,
      dialog: winner ? { type: 'result', winner } : { type: 'none' },
    });
  },

  undo: async () => {
    const { entries, currentRound, currentGameId } = get();
    if (currentGameId === null) return;

    const inCurrent = entries.filter((e) => e.roundNumber === currentRound);

    if (inCurrent.length > 0) {
      await db.entries.bulkDelete(inCurrent.map((e) => e.id));
      set({
        entries: entries.filter((e) => e.roundNumber !== currentRound),
        dialog: { type: 'none' },
      });
    } else if (currentRound > 1) {
      const prev = currentRound - 1;
      const inPrev = entries.filter((e) => e.roundNumber === prev);
      await db.entries.bulkDelete(inPrev.map((e) => e.id));
      set({
        entries: entries.filter((e) => e.roundNumber !== prev),
        currentRound: prev,
        dialog: { type: 'none' },
      });
    } else {
      set({ dialog: { type: 'none' } });
    }
  },

  newGame: async () => {
    const { currentGameId, goal, player1, player2, player3, player4 } = get();

    if (currentGameId !== null) {
      await db.games.update(currentGameId, { finishedAt: Date.now() });
    }

    const newGameId = await db.games.add({
      createdAt: Date.now(),
      goal,
      player1,
      player2,
      player3,
      player4,
    } as Parameters<typeof db.games.add>[0]);

    set({
      currentGameId: newGameId as number,
      entries: [],
      currentRound: 1,
      dialog: { type: 'none' },
    });
  },

  updateSettings: async (settings) => {
    set(settings as Partial<StoreState>);

    const merged = { ...get(), ...settings };
    const { goal, player1, player2, player3, player4, currentGameId } = merged;
    const row = { goal, player1, player2, player3, player4 };

    const existing = await db.settings.get(1);
    if (existing) {
      await db.settings.update(1, row);
    } else {
      await db.settings.add({ id: 1, ...row });
    }

    if (currentGameId !== null) {
      await db.games.update(currentGameId, row);
    }
  },

  openMenu: (team) => set({ dialog: { type: 'mainMenu', team } }),
  openScoreInput: (team) => set({ dialog: { type: 'scoreInput', team } }),
  openClaims: (team) => set({ dialog: { type: 'claims', team } }),
  openMultiplier: (team, mode, score) =>
    set({ dialog: { type: 'multiplier', team, mode, score } }),
  openSettings: () => set({ dialog: { type: 'settings' } }),
  openAbout: () => set({ dialog: { type: 'about' } }),
  confirmNewGame: () => set({ dialog: { type: 'confirmNewGame' } }),
  closeDialog: () => set({ dialog: { type: 'none' } }),
}));
