import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/gameStore';
import { Dialog, ActionButton } from '@/components/ui/Dialog';

export function SettingsDialog() {
  const { t, i18n } = useTranslation();
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

  const field = (label: string, key: keyof typeof form, type: 'text' | 'number' = 'text', testId?: string) => (
    <label className="flex flex-col gap-1" key={key}>
      <span className="text-white/60 text-xs font-medium uppercase tracking-wider">{label}</span>
      <input
        data-testid={testId}
        type={type}
        value={form[key]}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            [key]: type === 'number' ? Number(e.target.value) : e.target.value,
          }))
        }
        className="bg-white/10 text-white rounded-lg px-3 py-2.5 text-sm outline-none border border-white/10 focus:border-red-500 focus:ring-0 placeholder:text-white/30 transition-colors"
      />
    </label>
  );

  const handleSave = () => {
    useStore.getState().updateSettings(form);
    useStore.getState().closeDialog();
  };

  const currentLng = i18n.resolvedLanguage ?? i18n.language;

  return (
    <Dialog
      title={t('settings.title')}
      onClose={() => useStore.getState().closeDialog()}
      footer={
        <>
          <ActionButton variant="secondary" onClick={() => useStore.getState().closeDialog()}>
            {t('cancel')}
          </ActionButton>
          <ActionButton data-testid="settings-save" onClick={handleSave}>{t('save')}</ActionButton>
        </>
      }
    >
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
        {field(t('settings.goal'), 'goal', 'number', 'settings-goal')}
        <div className="border-t border-white/10 pt-3">
          <div className="text-white/50 text-xs uppercase tracking-wider mb-2">{t('settings.team1')}</div>
          {field(t('settings.player', { number: 1 }), 'player1')}
          {field(t('settings.player', { number: 2 }), 'player2')}
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="text-white/50 text-xs uppercase tracking-wider mb-2">{t('settings.team2')}</div>
          {field(t('settings.player', { number: 3 }), 'player3')}
          {field(t('settings.player', { number: 4 }), 'player4')}
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="text-white/50 text-xs uppercase tracking-wider mb-2">{t('settings.language')}</div>
          <div className="flex gap-1">
            {(['de', 'en', 'fr'] as const).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => i18n.changeLanguage(lng)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentLng === lng
                    ? 'bg-red-600 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
              >
                {lng === 'de' ? 'Deutsch' : lng === 'en' ? 'English' : 'Français'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
