import { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DISCLAIMER =
  'Advice provided by Neema AI for educational and navigation purposes only. Always consult a qualified health worker.';

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn('rounded-xl bg-neema-cream px-3 py-2 text-[13px] font-medium leading-[18px] text-neema-muted-strong', className)}>
      {DISCLAIMER}
    </p>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('rounded-2xl bg-white p-5 shadow-neema-card', className)}>{children}</section>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('text-[13px] font-semibold uppercase leading-[18px] text-neema-muted', className)}>{children}</div>;
}

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-bold leading-8 text-neema-ink">{children}</h1>;
}

export function H2({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-lg font-semibold leading-6 text-neema-ink', className)}>{children}</h2>;
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[13px] font-semibold leading-[18px]', className)}>
      {children}
    </span>
  );
}

/** Square check box used in lists; the whole row is the button. */
export function CheckBox({ on, tone = 'green' }: { on: boolean; tone?: 'green' | 'terracotta' | 'ink' }) {
  const fill = tone === 'green' ? 'border-neema-success bg-neema-success' : tone === 'ink' ? 'border-neema-ink bg-neema-ink' : 'border-neema-dark bg-neema-dark';
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-7 w-7 flex-none items-center justify-center rounded-lg border-2 text-white',
        on ? fill : 'border-neema-border bg-white',
      )}
    >
      <Check className="h-4 w-4" strokeWidth={3} />
    </span>
  );
}

export function Switch({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn('flex h-8 w-14 flex-none rounded-full p-[3px] transition-colors', on ? 'justify-end bg-neema-dark' : 'justify-start bg-[#C9C2B8]')}
    >
      <span className="h-[26px] w-[26px] rounded-full bg-white shadow" />
    </span>
  );
}

export function SwitchRow({ label, sub, on, onToggle, className }: { label: string; sub?: string; on: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={cn('flex min-h-[48px] w-full items-center justify-between gap-3 text-left text-neema-ink', className)}
    >
      <span className="flex flex-col">
        <span className="font-semibold">{label}</span>
        {sub && <span className="text-sm leading-5 text-neema-muted">{sub}</span>}
      </span>
      <Switch on={on} />
    </button>
  );
}

/** Segmented control (tabs or radio group). */
export function Segmented<T extends string | number>({
  options, value, onChange, label, role = 'tablist', className,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: NoInfer<T>) => void;
  label: string;
  role?: 'tablist' | 'radiogroup';
  className?: string;
}) {
  return (
    <div role={role} aria-label={label} className={cn('grid gap-1.5 rounded-[14px] bg-neema-sand p-1', className)} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={String(o.id)}
            type="button"
            role={role === 'tablist' ? 'tab' : 'radio'}
            aria-selected={role === 'tablist' ? on : undefined}
            aria-checked={role === 'radiogroup' ? on : undefined}
            onClick={() => onChange(o.id)}
            className={cn(
              'min-h-[48px] rounded-[10px] px-1 text-sm font-semibold leading-[18px]',
              on ? 'bg-white text-neema-dark shadow-sm' : 'bg-transparent text-neema-ink',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled, className }: { children: ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-neema-dark px-4 text-base font-semibold tracking-wide text-white transition-transform active:scale-[0.98] disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-neema-border bg-white px-4 text-base font-semibold text-neema-ink active:scale-[0.98]', className)}
    >
      {children}
    </button>
  );
}

/** The subtle SOS button style used everywhere outside the SOS sheet itself. */
export function SosPill({ onClick, label = 'SOS', className }: { onClick: () => void; label?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="SOS emergency help"
      className={cn('flex h-12 min-w-[72px] items-center justify-center gap-1.5 rounded-full border-[1.5px] border-neema-sos bg-neema-sos-soft px-3.5 text-sm font-bold tracking-wider text-neema-sos', className)}
    >
      {label}
    </button>
  );
}

