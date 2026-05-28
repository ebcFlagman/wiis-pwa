import { ReactNode } from 'react';

interface Props {
  title: string;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Dialog({ title, onClose, children, footer }: Props) {
  return (
    <div
      className="dialog-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="dialog-card w-full max-w-sm rounded-2xl bg-board-800 border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Schliessen"
            >
              ×
            </button>
          )}
        </div>
        <div className="px-4 py-3">{children}</div>
        {footer && (
          <div className="px-4 pb-4 pt-1 border-t border-white/10 flex gap-2 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface MenuButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'default' | 'danger' | 'primary';
}

export function MenuButton({ onClick, children, variant = 'default' }: MenuButtonProps) {
  const base = 'w-full text-left px-4 py-3.5 rounded-xl font-medium text-base transition-colors';
  const variants = {
    default: 'text-white hover:bg-white/10 active:bg-white/15',
    danger: 'text-red-400 hover:bg-red-500/10 active:bg-red-500/15',
    primary: 'text-red-400 hover:bg-red-500/10 active:bg-red-500/15',
  };
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export function ActionButton({ onClick, children, variant = 'primary', disabled }: ActionButtonProps) {
  const base = 'px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40';
  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
    secondary: 'bg-white/10 text-white hover:bg-white/20 active:bg-white/15',
    danger: 'bg-red-700 text-white hover:bg-red-600 active:bg-red-800',
  };
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
