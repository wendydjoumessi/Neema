/**
 * Shared building blocks for a calm, lively mobile feel: entrance animation, bottom sheets,
 * stories, progress rings and horizontal scrollers. All motion is short and switched off when
 * the phone asks for reduced motion (see index.css).
 */
import { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Fades and lifts its content in, a little after the item before it. */
export function Reveal({ i = 0, className, children, as: Tag = 'div' }: { i?: number; className?: string; children: ReactNode; as?: 'div' | 'section' | 'li' }) {
  return <Tag className={cn('neema-rise', className)} style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>{children}</Tag>;
}

/** A horizontal row that scrolls sideways and snaps, with the first card lined up to the page edge. */
export function HScroll({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div role={label ? 'region' : undefined} aria-label={label} className={cn('neema-hscroll -mx-4 flex gap-3 overflow-x-auto px-4 pb-1', className)}>
      {children}
    </div>
  );
}

/** Animated ring that fills to `value` (0 to 1) when it appears. */
export function ProgressRing({ value, size = 64, stroke = 7, color = '#2B9348', track = '#E8E2D9', children, label }: {
  value: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode; label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <span className="relative inline-flex flex-none items-center justify-center" style={{ width: size, height: size }} role={label ? 'img' : undefined} aria-label={label}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v)} className="neema-ring-in" style={{ '--ring-c': c, transition: 'stroke-dashoffset 500ms ease-out' } as CSSProperties} />
      </svg>
      <span className="relative flex flex-col items-center justify-center text-center">{children}</span>
    </span>
  );
}

/** Bottom sheet for details: keeps screens short, with the full text one tap away. */
export function Sheet({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center bg-neema-ink/45 font-sans text-base text-neema-ink neema-fade [&_h2]:font-sans [&_h2]:tracking-normal" onClick={onClose}>
      <div className="flex h-full w-full max-w-md flex-col justify-end">
        <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
          className="neema-sheet flex max-h-[88dvh] flex-col rounded-t-[28px] bg-neema-cream shadow-2xl outline-none">
          <div className="flex flex-none flex-col items-center px-5 pt-2.5">
            <span aria-hidden="true" className="h-1.5 w-11 rounded-full bg-neema-line" />
          </div>
          <div className="flex flex-none items-center justify-between gap-3 px-5 pb-2 pt-3">
            <h2 className="text-xl font-semibold leading-7">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white shadow-sm"><X className="h-5 w-5" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
          {footer && <div className="flex-none border-t border-neema-line px-5 pb-6 pt-3">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** A tappable row that opens more: icon on the left, short title, one line of detail. */
export function ListRow({ icon, title, sub, onClick, tint = 'bg-neema-primary-soft text-neema-dark', right }: {
  icon: ReactNode; title: string; sub?: string; onClick?: () => void; tint?: string; right?: ReactNode;
}) {
  const body = (
    <>
      <span aria-hidden="true" className={cn('flex h-11 w-11 flex-none items-center justify-center rounded-2xl', tint)}>{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold leading-5">{title}</span>
        {sub && <span className="line-clamp-2 text-[15px] leading-[21px] text-neema-muted-strong">{sub}</span>}
      </span>
      {right ?? (onClick && <ChevronRight aria-hidden="true" className="h-5 w-5 flex-none text-neema-muted" />)}
    </>
  );
  return onClick
    ? <button type="button" onClick={onClick} className="neema-press flex min-h-[64px] w-full items-center gap-3 py-2 text-left">{body}</button>
    : <div className="flex min-h-[64px] w-full items-center gap-3 py-2">{body}</div>;
}

// ---------------------------------------------------------------------------
// Stories: short daily cards with a picture, like the most-used women's health apps.
// ---------------------------------------------------------------------------
export type Story = {
  id: string;
  /** Short label under the bubble. */
  label: string;
  /** Picture inside the bubble and at the top of the story. */
  art: ReactNode;
  /** Background colour of the story page. */
  tone: string;
  kicker: string;
  title: string;
  text: string;
  source?: string;
  photo?: string;
  photoAlt?: string;
  action?: { label: string; onClick: () => void };
};

const SEEN_KEY = 'neema:storiesSeen';
const seenToday = (): string[] => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? '{}') as { day?: string; ids?: string[] };
    return raw.day === new Date().toDateString() ? raw.ids ?? [] : [];
  } catch { return []; }
};

export function StoryRow({ stories }: { stories: Story[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<string[]>(seenToday);
  const markSeen = useCallback((id: string) => {
    setSeen((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { window.localStorage.setItem(SEEN_KEY, JSON.stringify({ day: new Date().toDateString(), ids: next })); } catch { /* storage may be unavailable */ }
      return next;
    });
  }, []);
  return (
    <>
      <HScroll label="Today’s stories" className="gap-4 pt-1">
        {stories.map((st, i) => {
          const isSeen = seen.includes(st.id);
          return (
            <button key={st.id} type="button" onClick={() => setOpen(i)} className="neema-press flex w-[76px] flex-none flex-col items-center gap-1.5" aria-label={`Story: ${st.title}`}>
              <span className={cn('rounded-full p-[3px]', isSeen ? 'bg-neema-line' : 'bg-gradient-to-tr from-neema-dark via-neema-primary to-neema-ochre')}>
                <span className="flex h-[66px] w-[66px] items-center justify-center overflow-hidden rounded-full border-[3px] border-neema-cream" style={{ background: st.tone }}>
                  {st.art}
                </span>
              </span>
              <span className={cn('w-full truncate text-center text-[13px] font-semibold leading-[18px]', isSeen ? 'text-neema-muted-strong' : 'text-neema-ink')}>{st.label}</span>
            </button>
          );
        })}
      </HScroll>
      {open !== null && <StoryViewer stories={stories} start={open} onSeen={markSeen} onClose={() => setOpen(null)} />}
    </>
  );
}

const STORY_MS = 8000;

function StoryViewer({ stories, start, onSeen, onClose }: { stories: Story[]; start: number; onSeen: (id: string) => void; onClose: () => void }) {
  const [i, setI] = useState(start);
  const [paused, setPaused] = useState(false);
  const st = stories[i];
  useEffect(() => { onSeen(st.id); }, [st.id, onSeen]);
  const next = useCallback(() => (i < stories.length - 1 ? setI(i + 1) : onClose()), [i, stories.length, onClose]);
  const prev = () => setI(Math.max(0, i - 1));
  useEffect(() => {
    if (paused) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // no auto-advance: she moves on by tapping
    const id = window.setTimeout(next, STORY_MS);
    return () => window.clearTimeout(id);
  }, [i, paused, next]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`Story: ${st.title}`} className="fixed inset-0 z-50 flex justify-center bg-neema-ink/70 font-sans neema-fade [&_h2]:font-sans [&_h2]:tracking-normal">
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden text-neema-ink" style={{ background: st.tone }}>
        {/* progress */}
        <div className="flex flex-none gap-1.5 px-3 pt-3" aria-hidden="true">
          {stories.map((s2, k) => (
            <span key={s2.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/50">
              {k < i && <span className="block h-full w-full bg-white" />}
              {k === i && (
                <span key={`${i}-${paused}`} className="block h-full w-full origin-left bg-white"
                  style={{ animation: `neema-story-bar ${STORY_MS}ms linear both`, animationPlayState: paused ? 'paused' : 'running' }} />
              )}
            </span>
          ))}
        </div>
        <div className="flex flex-none items-center justify-between px-4 pt-3">
          <span className="rounded-full bg-white/80 px-3 py-1 text-[13px] font-bold uppercase tracking-[0.06em] text-neema-dark">{st.kicker}</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPaused(!paused)} className="h-11 rounded-full bg-white/80 px-4 text-[15px] font-semibold">{paused ? 'Play' : 'Pause'}</button>
            <button type="button" onClick={onClose} aria-label="Close story" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80"><X className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          {/* tap zones: left half goes back, right half goes forward */}
          <button type="button" aria-label="Previous story" onClick={prev} className="absolute inset-y-0 left-0 z-10 w-1/3" />
          <button type="button" aria-label="Next story" onClick={next} className="absolute inset-y-0 right-0 z-10 w-1/3" />
          <div key={st.id} className="neema-rise flex min-h-0 flex-1 flex-col justify-center gap-5 px-6 pb-6">
            <div className="mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center overflow-hidden rounded-[36px] bg-white/70 shadow-neema-card">
              {st.photo ? <img src={st.photo} alt={st.photoAlt ?? ''} className="h-full w-full object-cover" /> : <span className="neema-float flex h-full w-full items-center justify-center p-6">{st.art}</span>}
            </div>
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-[26px] font-bold leading-8">{st.title}</h2>
              <p className="text-lg leading-7">{st.text}</p>
              {st.source && <p className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">Source: {st.source}</p>}
            </div>
          </div>
        </div>
        {st.action && (
          <div className="relative z-20 flex-none px-6 pb-8">
            <button type="button" onClick={() => { onClose(); st.action!.onClick(); }} className="neema-press min-h-[56px] w-full rounded-2xl bg-neema-dark text-lg font-semibold text-white shadow-neema-hero">
              {st.action.label}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
