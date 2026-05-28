import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();

  if (dialog.type !== 'mainMenu') return null;
  const { team } = dialog;

  const label = useStore.getState()[team === 1 ? 'player1' : 'player3'] +
    ' / ' +
    useStore.getState()[team === 1 ? 'player2' : 'player4'];

  const hasAnything = entries.length > 0 || currentRound > 1;

  return (
    <Dialog title={label} onClose={closeDialog}>
      <div className="flex flex-col gap-1">
        <MenuButton data-testid="menu-score-input" onClick={() => openScoreInput(team)}>
          {t('menu.scoreInput')}
        </MenuButton>
        <MenuButton data-testid="menu-claims" onClick={() => openClaims(team)}>
          {t('menu.claims')}
        </MenuButton>
        <MenuButton data-testid="menu-match" onClick={() => openMultiplier(team, 'MATCH', 257)}>
          {t('menu.match')}
        </MenuButton>
        <div className="my-1 border-t border-white/10" />
        <MenuButton data-testid="menu-undo" onClick={undo} variant={hasAnything ? 'default' : 'danger'}>
          {t('menu.undo')}
        </MenuButton>
        <MenuButton data-testid="menu-new-game" onClick={confirmNewGame} variant="danger">
          {t('menu.newGame')}
        </MenuButton>
        <div className="my-1 border-t border-white/10" />
        <MenuButton data-testid="menu-settings" onClick={openSettings}>
          {t('menu.settings')}
        </MenuButton>
        <MenuButton data-testid="menu-about" onClick={openAbout}>
          {t('menu.about')}
        </MenuButton>
      </div>
    </Dialog>
  );
}
