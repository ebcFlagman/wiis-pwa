import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useStore} from '@/store/gameStore';
import {MAX_WRITE_SCORE} from '@/types';
import {ActionButton, Dialog} from '@/components/ui/Dialog';

export function ScoreInputDialog() {
  const dialog = useStore((s) => s.dialog);
  const addScore = useStore((s) => s.addScore);
  const closeDialog = useStore((s) => s.closeDialog);

  const {t} = useTranslation();
  const [input, setInput] = useState('');

  if (dialog.type !== 'scoreInput') return null;
  const {team} = dialog;

  const s = useStore.getState();
  const teamLabel = team === 1 ? `${s.player1} / ${s.player2}` : `${s.player3} / ${s.player4}`;
  const opponentLabel = team === 1 ? `${s.player3} / ${s.player4}` : `${s.player1} / ${s.player2}`;

  const score = parseInt(input, 10);
  const valid = !isNaN(score) && score >= 0 && score <= MAX_WRITE_SCORE;
  const opponent = valid ? MAX_WRITE_SCORE - score : null;

  const handleConfirm = () => {
    if (valid) {
      addScore(team, 'WRITE', score);
      setInput('');
    }
  };

  const handleClose = () => {
    setInput('');
    closeDialog();
  };

  const handleKey = (v: string) => {
    if (v === '⌫') {
      setInput((prev) => prev.slice(0, -1));
    } else if (input.length < 3) {
      const next = input + v;
      const n = parseInt(next, 10);
      if (n <= MAX_WRITE_SCORE) setInput(next);
    }
  };

  return (
    <Dialog
      title={t('scoreInput.title', {team: teamLabel})}
      onClose={handleClose}
      footer={
        <>
          <ActionButton variant="secondary" onClick={handleClose}>{t('cancel')}</ActionButton>
          <ActionButton data-testid="score-confirm" onClick={handleConfirm}
                        disabled={!valid}>{t('scoreInput.confirm')}</ActionButton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <div className="text-6xl font-bold text-white font-mono h-16 flex items-center justify-center">
            {input || <span className="text-white/25">0</span>}
          </div>
          {valid && opponent !== null && (
            <div className="mt-1 text-sm text-white/60">
              {t('scoreInput.opponentScore', {team: opponentLabel, score: opponent})}
            </div>
          )}
          {input && !valid && (
            <div className="mt-1 text-sm text-red-400">
              {t('scoreInput.maxScore', {max: MAX_WRITE_SCORE})}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((v, i) => (
            <button
              key={i}
              data-testid={v ? `digit-${v === '⌫' ? 'backspace' : v}` : undefined}
              onClick={() => v && handleKey(v)}
              disabled={!v}
              className={`h-14 rounded-xl text-xl font-semibold transition-colors ${
                v === '⌫'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : v
                    ? 'bg-white/10 text-white hover:bg-white/20 active:bg-white/30'
                    : 'invisible'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
