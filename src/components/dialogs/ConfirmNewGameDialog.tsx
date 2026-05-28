import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/gameStore';
import { Dialog, ActionButton } from '@/components/ui/Dialog';

export function ConfirmNewGameDialog() {
  const dialog = useStore((s) => s.dialog);
  const newGame = useStore((s) => s.newGame);
  const closeDialog = useStore((s) => s.closeDialog);

  const { t } = useTranslation();

  if (dialog.type !== 'confirmNewGame') return null;

  return (
    <Dialog
      title={t('confirmNewGame.title')}
      onClose={closeDialog}
      footer={
        <>
          <ActionButton variant="secondary" onClick={closeDialog}>{t('cancel')}</ActionButton>
          <ActionButton data-testid="confirm-reset" variant="danger" onClick={newGame}>{t('confirmNewGame.reset')}</ActionButton>
        </>
      }
    >
      <p className="text-white/80 text-sm py-2">
        {t('confirmNewGame.message')}
      </p>
    </Dialog>
  );
}
