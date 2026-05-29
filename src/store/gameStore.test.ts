import {beforeEach, describe, expect, it} from 'vitest';
import {db} from '@/db/db';
import {DEFAULT_GOAL, DEFAULT_TRUMP_MULTIPLIERS, MATCH_SCORE, MAX_WRITE_SCORE, STOCK_SCORE} from '@/types';
import {useStore} from './gameStore';

const resetState = () =>
  useStore.setState({
    initialized: false,
    currentGameId: null,
    entries: [],
    currentRound: 1,
    currentTrump: null,
    dialog: {type: 'none'},
    goal: DEFAULT_GOAL,
    player1: 'Spieler 1',
    player2: 'Spieler 2',
    player3: 'Spieler 3',
    player4: 'Spieler 4',
    trumpMultipliers: {...DEFAULT_TRUMP_MULTIPLIERS},
  });

beforeEach(async () => {
  await db.entries.clear();
  await db.games.clear();
  await db.settings.clear();
  resetState();
});

// ─── helper ────────────────────────────────────────────────────────────────

async function withGame(): Promise<number> {
  const id = (await db.games.add({
    createdAt: Date.now(),
    goal: DEFAULT_GOAL,
    player1: 'Spieler 1',
    player2: 'Spieler 2',
    player3: 'Spieler 3',
    player4: 'Spieler 4',
  } as Parameters<typeof db.games.add>[0])) as number;
  useStore.setState({currentGameId: id, currentTrump: 'Roses'}); // ×1
  return id;
}

// ─── getTotal ──────────────────────────────────────────────────────────────

describe('getTotal', () => {
  it('returns 0 when there are no entries', () => {
    expect(useStore.getState().getTotal(1)).toBe(0);
    expect(useStore.getState().getTotal(2)).toBe(0);
  });

  it('sums team1 and team2 points independently', () => {
    useStore.setState({
      entries: [
        {id: 1, team1Points: 100, team2Points: 57, mode: 'WRITE', playingTeam: 1, roundNumber: 1},
        {id: 2, team1Points: 0, team2Points: 150, mode: 'CLAIM', playingTeam: 2, roundNumber: 1},
      ],
    });
    expect(useStore.getState().getTotal(1)).toBe(100);
    expect(useStore.getState().getTotal(2)).toBe(207);
  });
});

// ─── getLastRoundTotal ─────────────────────────────────────────────────────

describe('getLastRoundTotal', () => {
  it('returns 0 when currentRound is 1 (no completed round yet)', () => {
    useStore.setState({currentRound: 1});
    expect(useStore.getState().getLastRoundTotal(1)).toBe(0);
  });

  it('sums only entries from the last completed round', () => {
    useStore.setState({
      currentRound: 3,
      entries: [
        {id: 1, team1Points: 50, team2Points: 107, mode: 'WRITE', playingTeam: 1, roundNumber: 1},
        {id: 2, team1Points: 80, team2Points: 77, mode: 'WRITE', playingTeam: 1, roundNumber: 2},
        {id: 3, team1Points: 0, team2Points: 50, mode: 'CLAIM', playingTeam: 2, roundNumber: 2},
      ],
    });
    // last completed = round 2
    expect(useStore.getState().getLastRoundTotal(1)).toBe(80);
    expect(useStore.getState().getLastRoundTotal(2)).toBe(127);
  });
});

// ─── addScore ──────────────────────────────────────────────────────────────

describe('addScore', () => {
  it('does nothing when currentGameId is null', async () => {
    await useStore.getState().addScore(1, 'CLAIM', 50);
    expect(useStore.getState().entries).toHaveLength(0);
  });

  it('WRITE mode splits points correctly (team 1 playing, ×1)', async () => {
    await withGame();
    await useStore.getState().addScore(1, 'WRITE', 100);
    const {entries} = useStore.getState();
    expect(entries).toHaveLength(1);
    expect(entries[0].team1Points).toBe(100);
    expect(entries[0].team2Points).toBe(MAX_WRITE_SCORE - 100);
  });

  it('WRITE mode splits points correctly (team 2 playing, ×1)', async () => {
    await withGame();
    await useStore.getState().addScore(2, 'WRITE', 100);
    const {entries} = useStore.getState();
    expect(entries[0].team2Points).toBe(100);
    expect(entries[0].team1Points).toBe(MAX_WRITE_SCORE - 100);
  });

  it('WRITE mode applies multiplier from currentTrump', async () => {
    await withGame();
    useStore.setState({currentTrump: 'Shields'}); // ×2
    await useStore.getState().addScore(1, 'WRITE', 100);
    const {entries} = useStore.getState();
    expect(entries[0].team1Points).toBe(200);
    expect(entries[0].team2Points).toBe((MAX_WRITE_SCORE - 100) * 2);
  });

  it('WRITE mode advances currentRound and resets currentTrump', async () => {
    await withGame();
    await useStore.getState().addScore(1, 'WRITE', 100);
    expect(useStore.getState().currentRound).toBe(2);
    expect(useStore.getState().currentTrump).toBeNull();
  });

  it('CLAIM mode assigns points only to the playing team', async () => {
    await withGame();
    await useStore.getState().addScore(2, 'CLAIM', 50);
    const {entries} = useStore.getState();
    expect(entries[0].team1Points).toBe(0);
    expect(entries[0].team2Points).toBe(50);
    expect(useStore.getState().currentRound).toBe(1);
  });

  it('STOCK mode assigns STOCK_SCORE only to the playing team', async () => {
    await withGame();
    await useStore.getState().addScore(1, 'STOCK', 0);
    const {entries} = useStore.getState();
    expect(entries[0].team1Points).toBe(STOCK_SCORE);
    expect(entries[0].team2Points).toBe(0);
    expect(useStore.getState().currentRound).toBe(1);
  });

  it('STOCK mode applies multiplier from currentTrump', async () => {
    await withGame();
    useStore.setState({currentTrump: 'TopDown'}); // ×3
    await useStore.getState().addScore(2, 'STOCK', 0);
    const {entries} = useStore.getState();
    expect(entries[0].team2Points).toBe(STOCK_SCORE * 3);
    expect(entries[0].team1Points).toBe(0);
  });

  it('STOCK mode does not advance currentRound', async () => {
    await withGame();
    await useStore.getState().addScore(1, 'STOCK', 0);
    expect(useStore.getState().currentRound).toBe(1);
  });

  it('MATCH mode uses MATCH_SCORE constant', async () => {
    await withGame();
    await useStore.getState().addScore(1, 'MATCH', 0);
    expect(useStore.getState().entries[0].team1Points).toBe(MATCH_SCORE);
    expect(useStore.getState().entries[0].team2Points).toBe(0);
  });

  it('sets winner dialog when a team reaches the goal', async () => {
    await withGame();
    useStore.setState({goal: 100});
    await useStore.getState().addScore(1, 'CLAIM', 100);
    const {dialog} = useStore.getState();
    expect(dialog.type).toBe('result');
    if (dialog.type === 'result') expect(dialog.winner).toBe(1);
  });

  it('persists entry to the database', async () => {
    const gameId = await withGame();
    await useStore.getState().addScore(1, 'CLAIM', 60);
    const dbEntries = await db.entries.where('gameId').equals(gameId).toArray();
    expect(dbEntries).toHaveLength(1);
    expect(dbEntries[0].team1Points).toBe(60);
  });
});

// ─── undo ──────────────────────────────────────────────────────────────────

describe('undo', () => {
  it('removes entries of the current round', async () => {
    const gameId = await withGame();
    const entryId = (await db.entries.add({
      gameId,
      team1Points: 50,
      team2Points: 107,
      mode: 'WRITE',
      playingTeam: 1,
      roundNumber: 1,
    } as Parameters<typeof db.entries.add>[0])) as number;
    useStore.setState({
      currentRound: 2,
      entries: [{id: entryId, team1Points: 50, team2Points: 107, mode: 'WRITE', playingTeam: 1, roundNumber: 1}],
    });

    await useStore.getState().undo();
    expect(useStore.getState().entries).toHaveLength(0);
    expect(useStore.getState().currentRound).toBe(1);
  });

  it('removes entries of the previous round when current round is empty', async () => {
    const gameId = await withGame();
    const entryId = (await db.entries.add({
      gameId,
      team1Points: 80,
      team2Points: 77,
      mode: 'WRITE',
      playingTeam: 1,
      roundNumber: 1,
    } as Parameters<typeof db.entries.add>[0])) as number;
    useStore.setState({
      currentRound: 2,
      entries: [{id: entryId, team1Points: 80, team2Points: 77, mode: 'WRITE', playingTeam: 1, roundNumber: 1}],
    });

    await useStore.getState().undo();
    expect(useStore.getState().entries).toHaveLength(0);
    expect(useStore.getState().currentRound).toBe(1);
  });

  it('closes any open dialog on undo', async () => {
    await withGame();
    useStore.setState({dialog: {type: 'about'}});
    await useStore.getState().undo();
    expect(useStore.getState().dialog.type).toBe('none');
  });

  it('resets currentTrump on undo', async () => {
    await withGame();
    useStore.setState({currentTrump: 'Shields'});
    await useStore.getState().undo();
    expect(useStore.getState().currentTrump).toBeNull();
  });
});

// ─── newGame ───────────────────────────────────────────────────────────────

describe('newGame', () => {
  it('resets entries and currentRound', async () => {
    await withGame();
    useStore.setState({
      entries: [{id: 1, team1Points: 50, team2Points: 107, mode: 'WRITE', playingTeam: 1, roundNumber: 1}],
      currentRound: 3,
    });
    await useStore.getState().newGame();
    expect(useStore.getState().entries).toHaveLength(0);
    expect(useStore.getState().currentRound).toBe(1);
  });

  it('assigns a new currentGameId', async () => {
    const oldId = await withGame();
    await useStore.getState().newGame();
    expect(useStore.getState().currentGameId).not.toBe(oldId);
    expect(useStore.getState().currentGameId).not.toBeNull();
  });

  it('marks the old game as finished in the DB', async () => {
    const oldId = await withGame();
    await useStore.getState().newGame();
    const oldGame = await db.games.get(oldId);
    expect(oldGame?.finishedAt).toBeDefined();
  });
});

// ─── dialog actions ────────────────────────────────────────────────────────

describe('dialog actions', () => {
  it('openMenu sets dialog to mainMenu', () => {
    useStore.getState().openMenu(1);
    expect(useStore.getState().dialog).toEqual({type: 'mainMenu', team: 1});
  });

  it('openScoreInput sets dialog to scoreInput', () => {
    useStore.getState().openScoreInput(2);
    expect(useStore.getState().dialog).toEqual({type: 'scoreInput', team: 2});
  });

  it('openClaims sets dialog to claims', () => {
    useStore.getState().openClaims(1);
    expect(useStore.getState().dialog).toEqual({type: 'claims', team: 1});
  });

  it('openTrump sets dialog to trump with next action', () => {
    useStore.getState().openTrump(2, 'scoreInput');
    expect(useStore.getState().dialog).toEqual({type: 'trump', team: 2, next: 'scoreInput'});
  });

  it('openSettings sets dialog to settings', () => {
    useStore.getState().openSettings();
    expect(useStore.getState().dialog).toEqual({type: 'settings'});
  });

  it('openAbout sets dialog to about', () => {
    useStore.getState().openAbout();
    expect(useStore.getState().dialog).toEqual({type: 'about'});
  });

  it('confirmNewGame sets dialog to confirmNewGame', () => {
    useStore.getState().confirmNewGame();
    expect(useStore.getState().dialog).toEqual({type: 'confirmNewGame'});
  });

  it('closeDialog resets to none', () => {
    useStore.getState().openSettings();
    useStore.getState().closeDialog();
    expect(useStore.getState().dialog).toEqual({type: 'none'});
  });
});

// ─── updateSettings ────────────────────────────────────────────────────────

describe('updateSettings', () => {
  it('updates store state immediately', async () => {
    await useStore.getState().updateSettings({goal: 1500, player1: 'Alice'});
    const {goal, player1} = useStore.getState();
    expect(goal).toBe(1500);
    expect(player1).toBe('Alice');
  });

  it('persists settings to the DB', async () => {
    await useStore.getState().updateSettings({goal: 1500});
    const row = await db.settings.get(1);
    expect(row?.goal).toBe(1500);
  });

  it('updates the current game record when a game is active', async () => {
    const gameId = await withGame();
    await useStore.getState().updateSettings({player1: 'Bob'});
    const game = await db.games.get(gameId);
    expect(game?.player1).toBe('Bob');
  });
});
