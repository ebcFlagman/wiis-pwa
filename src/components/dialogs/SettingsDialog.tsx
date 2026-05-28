import { useState } from 'react';
import { useStore } from '@/store/gameStore';
import { Dialog, ActionButton } from '@/components/ui/Dialog';

// Nur gerendert wenn dialog.type === 'settings' (conditional in GameBoard)
export function SettingsDialog() {
  const [form, setForm] = useState(() => {
    const s = useStore.getState();
    return {
      goal: s.goal,
      player1: s.player1,
      player2: s.player2,
      player3: s.player3,
      player4: s.player4,
    };
  });

  const field = (label: string, key: keyof typeof form, type: 'text' | 'number' = 'text') => (
    <label className="flex flex-col gap-1" key={key}>
      <span className="text-white/60 text-xs font-medium uppercase tracking-wider">{label}</span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            [key]: type === 'number' ? Number(e.target.value) : e.target.value,
          }))
        }
        className="bg-white/10 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500 placeholder:text-white/30"
      />
    </label>
  );

  const handleSave = () => {
    useStore.getState().updateSettings(form);
    useStore.getState().closeDialog();
  };

  return (
    <Dialog
      title="Einstellungen"
      onClose={() => useStore.getState().closeDialog()}
      footer={
        <>
          <ActionButton variant="secondary" onClick={() => useStore.getState().closeDialog()}>
            Abbrechen
          </ActionButton>
          <ActionButton onClick={handleSave}>Speichern</ActionButton>
        </>
      }
    >
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
        {field('Zielpunkte', 'goal', 'number')}
        <div className="border-t border-white/10 pt-3">
          <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Team 1</div>
          {field('Spieler 1', 'player1')}
          {field('Spieler 2', 'player2')}
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Team 2</div>
          {field('Spieler 3', 'player3')}
          {field('Spieler 4', 'player4')}
        </div>
      </div>
    </Dialog>
  );
}
