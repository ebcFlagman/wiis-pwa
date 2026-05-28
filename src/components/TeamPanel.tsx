import { useStore } from '@/store/gameStore';

interface Props {
  team: 1 | 2;
  flipped?: boolean;
}

export function TeamPanel({ team, flipped }: Props) {
  const openMenu = useStore((s) => s.openMenu);
  const getTotal = useStore((s) => s.getTotal);
  const label = useStore((s) =>
    team === 1 ? `${s.player1} / ${s.player2}` : `${s.player3} / ${s.player4}`
  );
  const goal = useStore((s) => s.goal);

  const total = getTotal(team);
  const progress = Math.min(total / goal, 1);

  return (
    <button
      data-testid={`team-panel-${team}`}
      className="team-panel flex-1 flex flex-col items-center justify-center w-full cursor-pointer relative overflow-hidden"
      style={{ transform: flipped ? 'rotate(180deg)' : undefined }}
      onClick={() => openMenu(team)}
      aria-label={`${label} Menü öffnen`}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-red-500/40 transition-all duration-500"
        style={{ transform: `scaleX(${progress})`, transformOrigin: 'left' }}
      />

      <div className="flex flex-col items-center gap-3 px-4 select-none">
        <div data-testid={`team-score-${team}`} className="text-white font-bold leading-none" style={{ fontSize: 'clamp(4rem, 18vw, 7rem)' }}>
          {total}
        </div>
        <div className="text-white/60 text-base font-medium tracking-widest uppercase">
          {label}
        </div>
      </div>
    </button>
  );
}
