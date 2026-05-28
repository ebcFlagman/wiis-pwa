export interface DBGame {
  id: number;
  createdAt: number;
  finishedAt?: number;
  winner?: 1 | 2;
  goal: number;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
}
