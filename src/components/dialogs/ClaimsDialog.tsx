import { useStore } from '@/store/gameStore';
import { CLAIM_PRESETS } from '@/types';
import { Dialog } from '@/components/ui/Dialog';

export function ClaimsDialog() {
  const dialog = useStore((s) => s.dialog);
  const openMultiplier = useStore((s) => s.openMultiplier);
  const closeDialog = useStore((s) => s.closeDialog);

  if (dialog.type !== 'claims') return null;
  const { team } = dialog;

  const s = useStore.getState();
  const label = team === 1 ? `${s.player1} / ${s.player2}` : `${s.player3} / ${s.player4}`;

  return (
    <Dialog title={`${label} – Weisen`} onClose={closeDialog}>
      <div className="grid grid-cols-3 gap-2">
        {CLAIM_PRESETS.map((pts) => (
          <button
            key={pts}
            onClick={() => openMultiplier(team, 'CLAIM', pts)}
            className="h-14 rounded-xl bg-white/10 text-white text-lg font-semibold hover:bg-red-600/30 active:bg-red-600/50 transition-colors"
          >
            {pts}
          </button>
        ))}
      </div>
    </Dialog>
  );
}
