import {useStore} from '@/store/gameStore';
import {useTranslation} from 'react-i18next';
import {SUIT_IMAGES} from '@/assets/suits';
import {Dialog} from '@/components/ui/Dialog';
import type {Trump} from '@/types';

type SuitPair = { left: string; right: string };
type ArrowConfig = { top?: string; bottom?: string };

const SUIT_PAIRS: Record<string, SuitPair> = {
  Bells: {left: SUIT_IMAGES.ecke, right: SUIT_IMAGES.bells},
  Roses: {left: SUIT_IMAGES.herz, right: SUIT_IMAGES.roses},
  Shields: {left: SUIT_IMAGES.schaufel, right: SUIT_IMAGES.shields},
  Acorns: {left: SUIT_IMAGES.kreuz, right: SUIT_IMAGES.acorns},
};

const ARROW_CONFIG: Record<string, ArrowConfig> = {
  TopDown: {bottom: '↓'},
  BottomUp: {top: '↑'},
  Slalom: {top: '↑', bottom: '↓'},
};

// Derived from the config objects — no duplicate key lists
const SUIT_TRUMP = Object.keys(SUIT_PAIRS) as Trump[];
const SPECIAL_TRUMP = Object.keys(ARROW_CONFIG) as Trump[];

const BUTTON_CLASS =
  'flex flex-col items-center justify-between py-3 px-2 rounded-xl ' +
  'bg-white/10 hover:bg-red-600/30 active:bg-red-600/50 transition-colors';

function SuitButton({trump, mult, onClick}: { trump: Trump; mult: number; onClick: () => void }) {
  const pair = SUIT_PAIRS[trump];
  return (
    <button data-testid={`trump-${trump}`} onClick={onClick} className={`${BUTTON_CLASS} gap-2`}>
      <div className="flex items-center justify-center gap-1.5">
        <img src={pair.left} alt="" className="w-8 h-8 object-contain"/>
        <img src={pair.right} alt="" className="w-8 h-8 object-contain"/>
      </div>
      <span className="text-red-400 font-bold text-xs">×{mult}</span>
    </button>
  );
}

function ArrowButton({trump, mult, onClick}: { trump: Trump; mult: number; onClick: () => void }) {
  const {top, bottom} = ARROW_CONFIG[trump];
  const bothArrows = top && bottom;
  return (
    <button data-testid={`trump-${trump}`} onClick={onClick} className={BUTTON_CLASS}>
      <div className={`flex items-center leading-tight ${bothArrows ? 'flex-row gap-1' : 'flex-col'}`}>
        {top && <span className="text-white font-bold text-2xl leading-none">{top}</span>}
        {bottom && <span className="text-white font-bold text-2xl leading-none">{bottom}</span>}
      </div>
      <span className="text-red-400 font-bold text-xs mt-1">×{mult}</span>
    </button>
  );
}

export function TrumpDialog() {
  const dialog = useStore((s) => s.dialog);
  const selectTrump = useStore((s) => s.selectTrump);
  const closeDialog = useStore((s) => s.closeDialog);
  const trumpMultipliers = useStore((s) => s.trumpMultipliers);
  const {t} = useTranslation();

  if (dialog.type !== 'trump') return null;
  const {team, next} = dialog;

  const s = useStore.getState();
  const teamLabel = team === 1 ? `${s.player1} / ${s.player2}` : `${s.player3} / ${s.player4}`;

  return (
    <Dialog title={t('trump.title', {team: teamLabel})} onClose={closeDialog}>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-2">
          {SUIT_TRUMP.map((trump) => (
            <SuitButton key={trump} trump={trump} mult={trumpMultipliers[trump]}
                        onClick={() => selectTrump(trump, team, next)}/>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SPECIAL_TRUMP.map((trump) => (
            <ArrowButton key={trump} trump={trump} mult={trumpMultipliers[trump]}
                         onClick={() => selectTrump(trump, team, next)}/>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
