import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameBoard } from './components/GameBoard';
import { useStore } from '@/store/gameStore';

export default function App() {
  const { t } = useTranslation();
  const initialize = useStore((s) => s.initialize);
  const initialized = useStore((s) => s.initialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <div className="flex h-full items-center justify-center bg-board-800">
        <div className="text-white/40 text-sm tracking-widest uppercase animate-pulse">
          {t('loading')}
        </div>
      </div>
    );
  }

  return <GameBoard />;
}
