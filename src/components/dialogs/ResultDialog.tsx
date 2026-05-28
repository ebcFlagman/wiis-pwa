import { useStore } from '@/store/gameStore';
import { Dialog, ActionButton } from '@/components/ui/Dialog';

export function ResultDialog() {
  const dialog = useStore((s) => s.dialog);
  const newGame = useStore((s) => s.newGame);
  const getTotal = useStore((s) => s.getTotal);
  const goal = useStore((s) => s.goal);

  if (dialog.type !== 'result') return null;
  const { winner } = dialog;

  const s = useStore.getState();
  const label1 = `${s.player1} / ${s.player2}`;
  const label2 = `${s.player3} / ${s.player4}`;
  const winnerLabel = winner === 1 ? label1 : label2;

  const t1 = getTotal(1);
  const t2 = getTotal(2);

  return (
    <Dialog
      title="Spiel beendet!"
      footer={<ActionButton onClick={newGame}>Neues Spiel</ActionButton>}
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="text-center">
          <div className="text-4xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-red-400">{winnerLabel}</div>
          <div className="text-white/60 text-sm mt-1">hat gewonnen!</div>
        </div>

        <div className="w-full border-t border-white/10 pt-4 flex flex-col gap-2">
          <ScoreRow label={label1} score={t1} isWinner={winner === 1} goal={goal} />
          <ScoreRow label={label2} score={t2} isWinner={winner === 2} goal={goal} />
        </div>
      </div>
    </Dialog>
  );
}

function ScoreRow({ label, score, isWinner, goal }: { label: string; score: number; isWinner: boolean; goal: number }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${isWinner ? 'bg-red-600/20' : 'bg-white/5'}`}>
      <span className={`font-medium text-sm ${isWinner ? 'text-red-400' : 'text-white/80'}`}>
        {isWinner && '🏆 '}{label}
      </span>
      <div className="text-right">
        <span className={`font-bold text-lg ${isWinner ? 'text-red-400' : 'text-white'}`}>{score}</span>
        <span className="text-white/40 text-xs ml-1">/ {goal}</span>
      </div>
    </div>
  );
}
