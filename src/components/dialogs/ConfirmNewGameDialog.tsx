import { useStore } from '@/store/gameStore';
import { Dialog, ActionButton } from '@/components/ui/Dialog';

export function ConfirmNewGameDialog() {
  const dialog = useStore((s) => s.dialog);
  const newGame = useStore((s) => s.newGame);
  const closeDialog = useStore((s) => s.closeDialog);

  if (dialog.type !== 'confirmNewGame') return null;

  return (
    <Dialog
      title="Neues Spiel"
      onClose={closeDialog}
      footer={
        <>
          <ActionButton variant="secondary" onClick={closeDialog}>Abbrechen</ActionButton>
          <ActionButton data-testid="confirm-reset" variant="danger" onClick={newGame}>Zurücksetzen</ActionButton>
        </>
      }
    >
      <p className="text-white/80 text-sm py-2">
        Möchtest du wirklich ein neues Spiel starten? Alle Punkte werden zurückgesetzt.
      </p>
    </Dialog>
  );
}
