import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/gameStore';
import { CLAIM_PRESETS, STOCK_SCORE } from '@/types';
import { Dialog } from '@/components/ui/Dialog';

export function ClaimsDialog() {
  const dialog = useStore((s) => s.dialog);
  const openMultiplier = useStore((s) => s.openMultiplier);
  const closeDialog = useStore((s) => s.closeDialog);

  const { t } = useTranslation();

  if (dialog.type !== 'claims') return null;
  const { team } = dialog;

  const s = useStore.getState();
  const label = team === 1 ? `${s.player1} / ${s.player2}` : `${s.player3} / ${s.player4}`;

  return (
    <Dialog title={t('claims.title', { team: label })} onClose={closeDialog}>
      <div className="grid grid-cols-3 gap-2">
        <button
          data-testid="claim-stock"
          onClick={() => openMultiplier(team, 'STOCK', STOCK_SCORE)}
          className="col-span-3 h-14 rounded-xl bg-amber-600/30 text-amber-300 text-lg font-semibold hover:bg-amber-600/50 active:bg-amber-600/70 transition-colors"
        >
          {t('claims.stock')}
        </button>
        {CLAIM_PRESETS.map((pts) => (
          <button
            key={pts}
            data-testid={`claim-${pts}`}
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
