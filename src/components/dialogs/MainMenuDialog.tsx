import {useTranslation} from 'react-i18next';
import {useStore} from '@/store/gameStore';
import type {Trump} from '@/types';
import {TRUMP_SYMBOL} from '@/types';
import {SUIT_IMAGES} from '@/assets/suits';
import {Dialog, MenuButton} from '@/components/ui/Dialog';

const SUIT_PREVIEW: Partial<Record<Trump, [string, string]>> = {
  Bells: [SUIT_IMAGES.ecke, SUIT_IMAGES.bells],
  Roses: [SUIT_IMAGES.herz, SUIT_IMAGES.roses],
  Shields: [SUIT_IMAGES.schaufel, SUIT_IMAGES.shields],
  Acorns: [SUIT_IMAGES.kreuz, SUIT_IMAGES.acorns],
};

export function MainMenuDialog() {
  const dialog = useStore((s) => s.dialog);
  const openScoreInput = useStore((s) => s.openScoreInput);
  const openClaims = useStore((s) => s.openClaims);
  const openTrump = useStore((s) => s.openTrump);
  const addScore = useStore((s) => s.addScore);
  const undo = useStore((s) => s.undo);
  const confirmNewGame = useStore((s) => s.confirmNewGame);
  const openSettings = useStore((s) => s.openSettings);
  const openAbout = useStore((s) => s.openAbout);
  const closeDialog = useStore((s) => s.closeDialog);
  const entries = useStore((s) => s.entries);
  const currentRound = useStore((s) => s.currentRound);
  const currentTrump = useStore((s) => s.currentTrump);
  const trumpMultipliers = useStore((s) => s.trumpMultipliers);

  const {t} = useTranslation();

  if (dialog.type !== 'mainMenu') return null;
  const {team} = dialog;

  const label = useStore.getState()[team === 1 ? 'player1' : 'player3'] +
    ' / ' +
    useStore.getState()[team === 1 ? 'player2' : 'player4'];

  const hasAnything = entries.length > 0 || currentRound > 1;
  const multiplier = currentTrump ? trumpMultipliers[currentTrump] : null;
  const suitImages = currentTrump ? SUIT_PREVIEW[currentTrump] : null;
  const arrowSymbol = currentTrump ? TRUMP_SYMBOL[currentTrump] : null;

  const handleScoreAction = (action: 'scoreInput' | 'claims' | 'match') => {
    if (!currentTrump) {
      openTrump(team, action);
      return;
    }
    if (action === 'scoreInput') openScoreInput(team);
    else if (action === 'claims') openClaims(team);
    else addScore(team, 'MATCH', 257);
  };

  return (
    <Dialog title={label} onClose={closeDialog}>
      <div className="flex flex-col gap-1">
        <button
          data-testid="menu-trump"
          onClick={() => openTrump(team, 'menu')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors mb-1 ${
            currentTrump
              ? 'bg-red-600/20 hover:bg-red-600/30'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            {suitImages ? (
              <>
                <img src={suitImages[0]} alt="" className="w-5 h-5 object-contain"/>
                <img src={suitImages[1]} alt="" className="w-5 h-5 object-contain"/>
              </>
            ) : arrowSymbol ? (
              <span className="text-white font-bold text-base leading-none w-10 text-center">{arrowSymbol}</span>
            ) : null}
            <span className={`text-xs uppercase tracking-wider ${currentTrump ? 'text-white' : 'text-white/50'}`}>
              {currentTrump ? t(`trump.name.${currentTrump}`) : t('trump.choose')}
            </span>
          </div>
          {multiplier !== null && (
            <span className="text-red-400 font-bold text-sm">×{multiplier}</span>
          )}
        </button>
        <MenuButton data-testid="menu-score-input" onClick={() => handleScoreAction('scoreInput')}>
          {t('menu.scoreInput')}
        </MenuButton>
        <MenuButton data-testid="menu-claims" onClick={() => handleScoreAction('claims')}>
          {t('menu.claims')}
        </MenuButton>
        <MenuButton data-testid="menu-match" onClick={() => handleScoreAction('match')}>
          {t('menu.match')}
        </MenuButton>
        <div className="my-1 border-t border-white/10"/>
        <MenuButton data-testid="menu-undo" onClick={undo} variant={hasAnything ? 'default' : 'danger'}>
          {t('menu.undo')}
        </MenuButton>
        <MenuButton data-testid="menu-new-game" onClick={confirmNewGame} variant="danger">
          {t('menu.newGame')}
        </MenuButton>
        <div className="my-1 border-t border-white/10"/>
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
