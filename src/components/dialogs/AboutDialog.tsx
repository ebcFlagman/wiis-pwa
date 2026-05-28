import { useStore } from '@/store/gameStore';
import { Dialog } from '@/components/ui/Dialog';

export function AboutDialog() {
  const dialog = useStore((s) => s.dialog);
  const closeDialog = useStore((s) => s.closeDialog);

  if (dialog.type !== 'about') return null;

  return (
    <Dialog title="Info" onClose={closeDialog}>
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <div className="text-5xl">🃏</div>
        <div>
          <div className="text-2xl font-bold text-white">Wiis</div>
          <div className="text-white/50 text-sm">Jass Spielstand-Tracker</div>
        </div>
        <div className="text-white/40 text-sm">Version 1.1.0</div>
        <div className="border-t border-white/10 w-full pt-3 text-white/60 text-sm space-y-1">
          <div>Entwickelt von</div>
          <div className="text-white font-medium">Patrick Wachsmuth</div>
          <div className="text-white/40">Flagman's World</div>
          <div className="text-white/40 text-xs mt-2">© 2016–2025 Flagman's World</div>
        </div>
      </div>
    </Dialog>
  );
}
