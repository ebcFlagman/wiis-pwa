import { useStore } from '@/store/gameStore';
import { MULTIPLIERS, MAX_WRITE_SCORE } from '@/types';
import { Dialog } from '@/components/ui/Dialog';

export function MultiplicatorDialog() {
  const dialog = useStore((s) => s.dialog);
  const addScore = useStore((s) => s.addScore);
  const closeDialog = useStore((s) => s.closeDialog);

  if (dialog.type !== 'multiplier') return null;
  const { team, mode, score } = dialog;

  const s = useStore.getState();
  const teamLabel = team === 1 ? `${s.player1} / ${s.player2}` : `${s.player3} / ${s.player4}`;
  const oppLabel = team === 1 ? `${s.player3} / ${s.player4}` : `${s.player1} / ${s.player2}`;
  const modeLabel = mode === 'WRITE' ? 'Spielen' : mode === 'CLAIM' ? 'Weisen' : 'Match';

  return (
    <Dialog title={`${teamLabel} – Multiplikator`} onClose={closeDialog}>
      <div className="mb-3 text-center text-white/60 text-sm">
        {modeLabel}: {score} Punkte
      </div>
      <div className="flex flex-col gap-2">
        {MULTIPLIERS.map((mult) => {
          const teamPts = score * mult;
          const oppPts = mode === 'WRITE' ? (MAX_WRITE_SCORE - score) * mult : 0;
          return (
            <button
              key={mult}
              onClick={() => addScore(team, mode, score, mult)}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-red-600/30 active:bg-red-600/50 transition-colors"
            >
              <span className="text-red-400 font-bold text-lg">×{mult}</span>
              <div className="text-right">
                <span className="text-white font-semibold">{teamPts}</span>
                {mode === 'WRITE' && (
                  <span className="text-white/50 text-sm ml-2">/ {oppLabel}: {oppPts}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Dialog>
  );
}
