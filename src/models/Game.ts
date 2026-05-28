export interface Game {
  id?: number;
  date: Date;
  status: 'active' | 'finished';
  team1Id: number;
  team2Id: number;
  finishScore: number;
  actualRoundNumber: number;
}
