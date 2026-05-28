import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/gameStore';
import { Dialog, ActionButton } from '@/components/ui/Dialog';

export function ResultDialog() {
  const { t } = useTranslation();
  const dialog = useStore((s) => s.dialog);
  const newGame = useStore((s) => s.newGame);
  const getTotal = useStore((s) => s.getTotal);
  const goal = useStore((s) => s.goal);
  const entries = useStore((s) => s.entries);

  if (dialog.type !== 'result') return null;
  const { winner } = dialog;

  const s = useStore.getState();
  const label1 = `${s.player1} / ${s.player2}`;
  const label2 = `${s.player3} / ${s.player4}`;
  const winnerLabel = winner === 1 ? label1 : label2;

  const t1 = getTotal(1);
  const t2 = getTotal(2);

  const t1Played = entries.filter((e) => e.mode === 'WRITE' || e.mode === 'MATCH').reduce((sum, e) => sum + e.team1Points, 0);
  const t2Played = entries.filter((e) => e.mode === 'WRITE' || e.mode === 'MATCH').reduce((sum, e) => sum + e.team2Points, 0);
  const t1Claimed = entries.filter((e) => e.mode === 'CLAIM').reduce((sum, e) => sum + e.team1Points, 0);
  const t2Claimed = entries.filter((e) => e.mode === 'CLAIM').reduce((sum, e) => sum + e.team2Points, 0);

  return (
    <Dialog
      title={t('result.title')}
      footer={<ActionButton onClick={newGame}>{t('result.newGame')}</ActionButton>}
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="text-center">
          <div className="text-4xl mb-1">🏆</div>
          <div data-testid="result-winner" className="text-2xl font-bold text-red-400">{winnerLabel}</div>
          <div className="text-white/60 text-sm mt-1">{t('result.won')}</div>
        </div>

        <div className="w-full border-t border-white/10 pt-4 flex flex-col gap-2">
          <ScoreRow label={label1} score={t1} played={t1Played} claimed={t1Claimed} isWinner={winner === 1} goal={goal} />
          <ScoreRow label={label2} score={t2} played={t2Played} claimed={t2Claimed} isWinner={winner === 2} goal={goal} />
        </div>
      </div>
    </Dialog>
  );
}

function ScoreRow({ label, score, played, claimed, isWinner, goal }: {
  label: string;
  score: number;
  played: number;
  claimed: number;
  isWinner: boolean;
  goal: number;
}) {
  const { t } = useTranslation();
  return (
    <div className={`px-3 py-2 rounded-lg ${isWinner ? 'bg-red-600/20' : 'bg-white/5'}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium text-sm ${isWinner ? 'text-red-400' : 'text-white/80'}`}>
          {isWinner && '🏆 '}{label}
        </span>
        <div className="text-right">
          <span className={`font-bold text-lg ${isWinner ? 'text-red-400' : 'text-white'}`}>{score}</span>
          <span className="text-white/40 text-xs ml-1">/ {goal}</span>
        </div>
      </div>
      <div className="flex gap-4 mt-1">
        <span className="text-white/40 text-xs">{t('result.played')} <span className="text-white/60">{played}</span></span>
        <span className="text-white/40 text-xs">{t('result.claimed')} <span className="text-white/60">{claimed}</span></span>
      </div>
    </div>
  );
}
