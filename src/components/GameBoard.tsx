import { useTranslation } from 'react-i18next';
import { TeamPanel } from './TeamPanel';
import { MainMenuDialog } from './dialogs/MainMenuDialog';
import { ScoreInputDialog } from './dialogs/ScoreInputDialog';
import { ClaimsDialog } from './dialogs/ClaimsDialog';
import { MultiplicatorDialog } from './dialogs/MultiplicatorDialog';
import { SettingsDialog } from './dialogs/SettingsDialog';
import { ResultDialog } from './dialogs/ResultDialog';
import { AboutDialog } from './dialogs/AboutDialog';
import { ConfirmNewGameDialog } from './dialogs/ConfirmNewGameDialog';
import { useStore } from '@/store/gameStore';

export function GameBoard() {
  const { t } = useTranslation();
  const currentRound = useStore((s) => s.currentRound);
  const goal = useStore((s) => s.goal);
  const team1Remaining = useStore((s) => Math.max(s.goal - s.entries.reduce((sum, e) => sum + e.team1Points, 0), 0));
  const team2Remaining = useStore((s) => Math.max(s.goal - s.entries.reduce((sum, e) => sum + e.team2Points, 0), 0));
  const dialogType = useStore((s) => s.dialog.type);

  return (
    <div className="board-surface flex flex-col h-full w-full">
      {/* Team 2 – top half, rotated */}
      <TeamPanel team={2} flipped />

      {/* Divider */}
      <div className="flex-none flex items-center h-14 border-t border-b border-white/10 bg-board-900/60 relative px-4">
        <span className="rotate-180 text-white/35 text-xs font-mono tabular-nums">{team2Remaining}</span>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <span className="text-white/40 text-xs font-mono tracking-widest uppercase">
              {t('round', { count: currentRound })}
            </span>
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
          </div>
          <span className="text-white/25 text-xs mt-1">{t('goal', { goal })}</span>
        </div>

        <span className="ml-auto text-white/35 text-xs font-mono tabular-nums">{team1Remaining}</span>
      </div>

      {/* Team 1 – bottom half */}
      <TeamPanel team={1} />

      {/* Dialogs */}
      <MainMenuDialog />
      <ScoreInputDialog />
      <ClaimsDialog />
      <MultiplicatorDialog />
      {dialogType === 'settings' && <SettingsDialog />}
      <ResultDialog />
      <AboutDialog />
      <ConfirmNewGameDialog />
    </div>
  );
}
