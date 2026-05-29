import {create} from 'zustand';
import {db} from '@/db/db';
import {
  DEFAULT_GOAL,
  DEFAULT_TRUMP_MULTIPLIERS,
  MATCH_SCORE,
  MAX_WRITE_SCORE,
  type ScoreEntry,
  type Settings,
  STOCK_SCORE,
  TRUMP,
  type Trump,
} from '@/types';
import type {StoreState} from './types';

let initStarted = false;

const defaultSettings: Settings = {
  goal: DEFAULT_GOAL,
  player1: 'Spieler 1',
  player2: 'Spieler 2',
  player3: 'Spieler 3',
  player4: 'Spieler 4',
  trumpMultipliers: {...DEFAULT_TRUMP_MULTIPLIERS},
};

const gamesInHistory: number = 10;

function calcCurrentRound(entries: ScoreEntry[]): number {
  if (entries.length === 0) return 1;
  const maxRound = Math.max(...entries.map((e) => e.roundNumber));
  const writeInMax = entries.some((e) => e.roundNumber === maxRound && e.mode === 'WRITE');
  return writeInMax ? maxRound + 1 : maxRound;
}

function normaliseTrumpMultipliers(stored: Record<string, number> | undefined): Record<Trump, number> {
  const base = {...DEFAULT_TRUMP_MULTIPLIERS};
  if (!stored) return base;
  for (const trump of TRUMP) {
    if (typeof stored[trump] === 'number') base[trump] = stored[trump];
  }
  return base;
}

export const useStore = create<StoreState>()((set, get) => ({
  ...defaultSettings,
  initialized: false,
  currentGameId: null,
  entries: [],
  currentRound: 1,
  currentTrump: null,
  dialog: {type: 'none'},

  getTotal: (team) => {
    const {entries} = get();
    return entries.reduce(
      (sum, e) => sum + (team === 1 ? e.team1Points : e.team2Points),
      0
    );
  },

  getLastRoundTotal: (team) => {
    const {entries, currentRound} = get();
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

    const trumpMultipliers = normaliseTrumpMultipliers(storedSettings?.trumpMultipliers as Record<string, number> | undefined);

    const settings: Settings = storedSettings
      ? {
        goal: storedSettings.goal,
        player1: storedSettings.player1,
        player2: storedSettings.player2,
        player3: storedSettings.player3,
        player4: storedSettings.player4,
        trumpMultipliers: trumpMultipliers,
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
      ({id, team1Points, team2Points, mode, playingTeam, roundNumber, trump}) => ({
        id, team1Points, team2Points, mode, playingTeam, roundNumber,
        trump: trump as Trump | undefined,
      })
    );

    const currentRound = calcCurrentRound(entries);
    const roundEntries = entries.filter((e) => e.roundNumber === currentRound);
    const currentTrump = (roundEntries[roundEntries.length - 1]?.trump) ?? null;

    set({
      ...settings,
      currentGameId: game?.id ?? null,
      entries,
      currentRound,
      currentTrump: currentTrump,
      initialized: true,
    });
  },

  addScore: async (team, mode, score) => {
    const {entries, currentRound, goal, currentGameId, currentTrump, trumpMultipliers} = get();
    if (currentGameId === null) return;

    const multiplier = currentTrump ? trumpMultipliers[currentTrump] : 1;

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
      const pts = (mode === 'MATCH' ? MATCH_SCORE : mode === 'STOCK' ? STOCK_SCORE : score) * multiplier;
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
      trump: currentTrump ?? undefined,
    } as Parameters<typeof db.entries.add>[0]);

    const newEntry: ScoreEntry = {
      id: entryId as number,
      team1Points,
      team2Points,
      mode,
      playingTeam: team,
      roundNumber: currentRound,
      trump: currentTrump ?? undefined,
    };

    const newEntries = [...entries, newEntry];
    const nextRound = mode === 'WRITE' ? currentRound + 1 : currentRound;
    const nextTrump = mode === 'WRITE' ? null : currentTrump;

    const t1Total = newEntries.reduce((s, e) => s + e.team1Points, 0);
    const t2Total = newEntries.reduce((s, e) => s + e.team2Points, 0);
    const winner: 1 | 2 | null = t1Total >= goal ? 1 : t2Total >= goal ? 2 : null;

    if (winner) {
      await db.games.update(currentGameId, {finishedAt: Date.now(), winner});
    }

    set({
      entries: newEntries,
      currentRound: nextRound,
      currentTrump: nextTrump,
      dialog: winner ? {type: 'result', winner} : {type: 'none'},
    });
  },

  undo: async () => {
    const {entries, currentRound, currentGameId} = get();
    if (currentGameId === null) return;

    const inCurrent = entries.filter((e) => e.roundNumber === currentRound);

    if (inCurrent.length > 0) {
      await db.entries.bulkDelete(inCurrent.map((e) => e.id));
      set({
        entries: entries.filter((e) => e.roundNumber !== currentRound),
        currentTrump: null,
        dialog: {type: 'none'},
      });
    } else if (currentRound > 1) {
      const prev = currentRound - 1;
      const inPrev = entries.filter((e) => e.roundNumber === prev);
      await db.entries.bulkDelete(inPrev.map((e) => e.id));
      set({
        entries: entries.filter((e) => e.roundNumber !== prev),
        currentRound: prev,
        currentTrump: null,
        dialog: {type: 'none'},
      });
    } else {
      set({currentTrump: null, dialog: {type: 'none'}});
    }
  },

  newGame: async () => {
    const {currentGameId, goal, player1, player2, player3, player4, trumpMultipliers} = get();

    if (currentGameId !== null) {
      await db.games.update(currentGameId, {finishedAt: Date.now()});
    }

    const finishedGames = await db.games.orderBy('createdAt').reverse().toArray();
    const toDelete = finishedGames.slice(gamesInHistory);
    if (toDelete.length > 0) {
      const ids = toDelete.map((g) => g.id!);
      await db.entries.where('gameId').anyOf(ids).delete();
      await db.games.bulkDelete(ids);
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
      currentTrump: null,
      trumpMultipliers: trumpMultipliers,
      dialog: {type: 'none'},
    });
  },

  updateSettings: async (settings) => {
    set(settings as Partial<StoreState>);

    const merged = {...get(), ...settings};
    const {goal, player1, player2, player3, player4, trumpMultipliers, currentGameId} = merged;
    const row = {goal, player1, player2, player3, player4, trumpMultipliers: trumpMultipliers};

    const existing = await db.settings.get(1);
    if (existing) {
      await db.settings.update(1, row);
    } else {
      await db.settings.add({id: 1, ...row});
    }

    if (currentGameId !== null) {
      await db.games.update(currentGameId, {goal, player1, player2, player3, player4});
    }
  },

  openMenu: (team) => set({dialog: {type: 'mainMenu', team}}),
  openScoreInput: (team) => set({dialog: {type: 'scoreInput', team}}),
  openClaims: (team) => set({dialog: {type: 'claims', team}}),
  openTrump: (team, next) => set({dialog: {type: 'trump', team, next}}),

  selectTrump: async (trump, team, next) => {
    set({currentTrump: trump});
    if (next === 'menu') {
      set({dialog: {type: 'mainMenu', team}});
    } else if (next === 'scoreInput') {
      set({dialog: {type: 'scoreInput', team}});
    } else if (next === 'claims') {
      set({dialog: {type: 'claims', team}});
    } else if (next === 'match') {
      await get().addScore(team, 'MATCH', MATCH_SCORE);
    }
  },

  openSettings: () => set({dialog: {type: 'settings'}}),
  openAbout: () => set({dialog: {type: 'about'}}),
  confirmNewGame: () => set({dialog: {type: 'confirmNewGame'}}),
  closeDialog: () => set({dialog: {type: 'none'}}),
}));
