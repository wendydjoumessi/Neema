import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Pause, Play, SkipForward, Square, Volume2, VolumeX, Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Move } from '../body';
import { ExerciseFigure, PROGRAMS, programSecs, usePrefersReducedMotion } from '../exerciseAnim';
import { todayIso } from '../cycle';
import { useNeema } from '../store';

const fmt = (secs: number) => `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;

/** Where we are inside a program after `elapsed` seconds. */
function position(move: Move, elapsed: number) {
  const prog = PROGRAMS[move.id];
  const total = programSecs(prog);
  if (prog.minutes) {
    return { phase: prog.phases[0], phaseLeft: total - elapsed, phaseSecs: total, rep: 0, reps: 0, done: elapsed >= total, total };
  }
  const cycle = prog.phases.reduce((t, p) => t + p.secs, 0);
  const rep = Math.min(prog.reps ?? 1, Math.floor(elapsed / cycle) + 1);
  let t = elapsed - (rep - 1) * cycle;
  let phase = prog.phases[0];
  for (const ph of prog.phases) {
    phase = ph;
    if (t < ph.secs) break;
    t -= ph.secs;
  }
  return { phase, phaseLeft: Math.max(0, phase.secs - t), phaseSecs: phase.secs, rep, reps: prog.reps ?? 1, done: elapsed >= total, total };
}

/**
 * Full-screen guided workout, like a fitness app: the figure moves in time with a countdown,
 * reps are counted, and an optional voice says each step. Works offline.
 */
export function ExercisePlayer({ queue, start = 0, csection, onClose }: { queue: Move[]; start?: number; csection: boolean; onClose: () => void }) {
  const s = useNeema();
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(start);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [voice, setVoice] = useState(false);
  const [finished, setFinished] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const lastLabel = useRef('');
  const move = queue[index];
  const prog = PROGRAMS[move.id];
  const pos = position(move, elapsed);
  const complete = pos.done;
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Clock: counts real time while running, so it stays right even if the phone is slow.
  useEffect(() => {
    if (!running || complete) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const delta = (now - last) / 1000; // read before resetting: React may run the updater later
      last = now;
      setElapsed((e) => e + delta);
    }, 200);
    return () => window.clearInterval(id);
  }, [running, complete]);

  // Keep the figure frozen while paused.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (running && !complete) svg.unpauseAnimations?.(); else svg.pauseAnimations?.();
  }, [running, complete, index]);

  const say = useCallback((text: string) => {
    if (!voice || !canSpeak) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = s.lang === 'fr' ? 'fr-FR' : 'en-GB';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }, [voice, canSpeak, s.lang]);

  // Say each new step (and the end).
  useEffect(() => {
    const label = complete ? 'done' : `${pos.rep}:${pos.phase.label}`;
    if (label === lastLabel.current) return;
    lastLabel.current = label;
    if (complete) say('Well done.');
    else if (!prog.minutes || elapsed < 0.5) say(pos.phase.label);
  }, [complete, pos.rep, pos.phase.label, prog.minutes, elapsed, say]);

  useEffect(() => () => { if (canSpeak) window.speechSynthesis.cancel(); }, [canSpeak]);

  // Mark as done for today when an exercise is completed.
  useEffect(() => {
    if (!complete || finished.includes(move.id)) return;
    setFinished((f) => [...f, move.id]);
    const today = todayIso();
    const list = s.moves[today] ?? [];
    if (!list.includes(move.id)) s.setMoves({ [today]: [...list, move.id] });
  }, [complete, move.id, finished, s]);

  const goTo = (i: number) => { setIndex(i); setElapsed(0); setRunning(true); lastLabel.current = ''; };
  const next = index < queue.length - 1 ? () => goTo(index + 1) : null;

  // Ring shows time left in the current step (or whole timer for walks).
  const R = 54;
  const C = 2 * Math.PI * R;
  const frac = complete ? 1 : 1 - pos.phaseLeft / pos.phaseSecs;
  const big = prog.minutes ? fmt(Math.max(0, pos.total - elapsed)) : String(Math.ceil(pos.phaseLeft));
  const breathIn = prog.guide === 'breath' && pos.phase.pose === 1;

  return (
    <div role="dialog" aria-modal="true" aria-label={`Exercise: ${move.name}`} className="fixed inset-0 z-50 bg-neema-ink/40">
      <div className="mx-auto flex h-full max-w-md flex-col bg-neema-cream">
        <header className="flex flex-none items-center justify-between gap-2 px-4 py-3">
          <button type="button" onClick={onClose} aria-label="Close exercise" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm"><X className="h-6 w-6" /></button>
          <div className="flex min-w-0 flex-col items-center text-center">
            <span className="truncate text-lg font-semibold leading-6">{move.name}</span>
            {queue.length > 1 && <span className="text-[13px] font-semibold leading-[18px] text-neema-muted-strong">Exercise {index + 1} of {queue.length}</span>}
          </div>
          {canSpeak ? (
            <button type="button" onClick={() => setVoice(!voice)} aria-pressed={voice} aria-label={voice ? 'Turn voice coach off' : 'Turn voice coach on'}
              className={cn('flex h-12 w-12 items-center justify-center rounded-full shadow-sm', voice ? 'bg-neema-dark text-white' : 'bg-white')}>
              {voice ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </button>
          ) : <span className="w-12" />}
        </header>

        {queue.length > 1 && (
          <div className="flex gap-1.5 px-4" aria-hidden="true">
            {queue.map((q, i) => <span key={q.id} className={cn('h-1.5 flex-1 rounded-full', i < index || finished.includes(q.id) ? 'bg-neema-success' : i === index ? 'bg-neema-primary' : 'bg-neema-line')} />)}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-5 py-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white p-3 shadow-neema-card">
            {prog.guide === 'breath' && !reduced && (
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neema-primary-soft"
                style={{ transform: `translate(-50%, -50%) scale(${breathIn && running ? 1.25 : 0.7})`, transition: `transform ${pos.phase.secs}s ease-in-out` }} />
            )}
            <ExerciseFigure
              key={`${move.id}-${pos.rep}`}
              ref={svgRef}
              program={prog}
              staticPose={reduced ? pos.phase.pose : undefined}
              label={`${move.name}: ${pos.phase.label}`}
              className="relative h-full w-full"
            />
          </div>

          {complete ? (
            <div role="status" className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-16 w-16 animate-[neema-pop_400ms_ease-out] items-center justify-center rounded-full bg-neema-success text-white"><Check className="h-9 w-9" /></span>
              <span className="text-2xl font-bold leading-8">Well done!</span>
              <span className="text-neema-muted-strong">{move.name} is ticked for today.</span>
            </div>
          ) : (
            <>
              <div className="relative h-[132px] w-[132px]" aria-hidden="true">
                <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90">
                  <circle cx="66" cy="66" r={R} fill="none" stroke="#E8E2D9" strokeWidth="10" />
                  <circle cx="66" cy="66" r={R} fill="none" stroke="#2B9348" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={C} strokeDashoffset={C * (1 - frac)} style={{ transition: 'stroke-dashoffset 200ms linear' }} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold tabular-nums">{big}</span>
              </div>
              <div className="flex flex-col items-center text-center" aria-live="polite">
                <span className="text-2xl font-bold leading-8 text-neema-dark">{pos.phase.label}</span>
                <span className="font-semibold text-neema-muted-strong">{prog.minutes ? `${prog.minutes} minutes` : `Rep ${pos.rep} of ${pos.reps}`}</span>
              </div>
              {csection && move.csNote && <p className="rounded-xl bg-neema-ochre-soft px-3.5 py-2 text-center text-[15px] leading-[22px] text-neema-ochre-ink">{move.csNote}</p>}
            </>
          )}
        </div>

        <footer className="flex flex-none items-center gap-3 px-5 pb-6 pt-2">
          {complete ? (
            <>
              <button type="button" onClick={() => goTo(index)} className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl border border-neema-border bg-white font-semibold">
                <RotateCcw className="h-5 w-5" /> Again
              </button>
              <button type="button" onClick={next ?? onClose} className="flex min-h-[56px] flex-[2] items-center justify-center gap-2 rounded-2xl bg-neema-dark text-lg font-semibold text-white">
                {next ? <>Next: {queue[index + 1].name}</> : 'Finish'}
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setRunning(!running)} aria-label={running ? 'Pause' : 'Resume'}
                className="flex min-h-[56px] flex-[2] items-center justify-center gap-2 rounded-2xl bg-neema-dark text-lg font-semibold text-white">
                {running ? <><Pause className="h-6 w-6" /> Pause</> : <><Play className="h-6 w-6" /> Resume</>}
              </button>
              <button type="button" onClick={() => (next ? goTo(index + 1) : onClose())} aria-label={next ? 'Skip to next exercise' : 'Stop'}
                className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl border border-neema-border bg-white font-semibold">
                {next ? <SkipForward className="h-5 w-5" /> : <Square className="h-5 w-5" />} {next ? 'Skip' : 'Stop'}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
