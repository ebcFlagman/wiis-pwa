export const TRUMP = [
  'Bells', 'Roses', 'Shields', 'Acorns',
  'TopDown', 'BottomUp', 'Slalom',
] as const;

export type Trump = typeof TRUMP[number];

export const TRUMP_SYMBOL: Record<Trump, string> = {
  Bells: '♦',
  Roses: '♥',
  Shields: '♠',
  Acorns: '♣',
  TopDown: '↓',
  BottomUp: '↑',
  Slalom: '↑↓',
};

export const DEFAULT_TRUMP_MULTIPLIERS: Record<Trump, number> = {
  Bells: 1,
  Roses: 1,
  Shields: 2,
  Acorns: 2,
  TopDown: 3,
  BottomUp: 3,
  Slalom: 3,
};
