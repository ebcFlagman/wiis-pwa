import { useStore } from '@/store/gameStore';
import { Dialog, MenuButton } from '@/components/ui/Dialog';

export function MainMenuDialog() {
  const dialog = useStore((s) => s.dialog);
  const openScoreInput = useStore((s) => s.openScoreInput);
  const openClaims = useStore((s) => s.openClaims);
  const openMultiplier = useStore((s) => s.openMultiplier);
  const undo = useStore((s) => s.undo);
  const confirmNewGame = useStore((s) => s.confirmNewGame);
  const openSettings = useStore((s) => s.openSettings);
  const openAbout = useStore((s) => s.openAbout);
  const closeDialog = useStore((s) => s.closeDialog);
  const entries = useStore((s) => s.entries);
  const currentRound = useStore((s) => s.currentRound);

  if (dialog.type !== 'mainMenu') return null;
  const { team } = dialog;

  const label = useStore.getState()[team === 1 ? 'player1' : 'player3'] +
    ' / ' +
    useStore.getState()[team === 1 ? 'player2' : 'player4'];

  const hasAnything = entries.length > 0 || currentRound > 1;

  return (
    <Dialog title={label} onClose={closeDialog}>
      <div className="flex flex-col gap-1">
        <MenuButton onClick={() => openScoreInput(team)}>
          🃏 Punkte eingeben
        </MenuButton>
        <MenuButton onClick={() => openClaims(team)}>
          ✋ Weisen
        </MenuButton>
        <MenuButton onClick={() => openMultiplier(team, 'MATCH', 257)}>
          💥 Match (257)
        </MenuButton>
        <div className="my-1 border-t border-white/10" />
        <MenuButton onClick={undo} variant={hasAnything ? 'default' : 'danger'}>
          ↩ Rückgängig
        </MenuButton>
        <MenuButton onClick={confirmNewGame} variant="danger">
          🔄 Neues Spiel
        </MenuButton>
        <div className="my-1 border-t border-white/10" />
        <MenuButton onClick={openSettings}>
          ⚙️ Einstellungen
        </MenuButton>
        <MenuButton onClick={openAbout}>
          ℹ️ Info
        </MenuButton>
      </div>
    </Dialog>
  );
}
