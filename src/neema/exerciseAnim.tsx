/**
 * Animated exercise figures, drawn in SVG and moved with SMIL so they run smoothly on low-end phones
 * without any video download. Each exercise is a few key poses plus a timed program of phases
 * ("Squeeze", "Relax"...). The same program drives the looping preview and the guided player, so
 * the figure always moves in time with the countdown.
 */
import { forwardRef, useEffect, useState } from 'react';

type Pt = [number, number];
export type Pose = {
  h: Pt; // head centre
  s: Pt; // shoulder
  m?: Pt; // spine bend (defaults to midpoint of shoulder and hip)
  p: Pt; // hip
  e1: Pt; w1: Pt; e2?: Pt; w2?: Pt; // near and far arm: elbow, hand
  k1: Pt; f1: Pt; k2?: Pt; f2?: Pt; // near and far leg: knee, foot
  belly?: number; // belly rise for breathing (0 to 1)
  ring?: number; // pelvic floor lift (0 to 1)
};
export type Phase = { label: string; secs: number; pose: number; move?: number };
export type AnimId = 'kegel' | 'breath' | 'tilt' | 'walk' | 'brisk' | 'heel' | 'bridge' | 'reach' | 'squat' | 'plank' | 'cat';
export type Program = { anim: AnimId; phases: Phase[]; reps?: number; minutes?: number; guide?: 'breath' };

const lieBent: Pose = { h: [38, 97], s: [54, 103], p: [106, 103], e1: [76, 107], w1: [96, 108], k1: [130, 79], f1: [152, 109] };
const stand0: Pose = { h: [100, 19], s: [100, 33], p: [100, 70], e1: [93, 51], w1: [89, 67], e2: [108, 51], w2: [113, 66], k1: [110, 90], f1: [117, 109], k2: [92, 90], f2: [85, 108] };
const stand1: Pose = { ...stand0, h: [100, 17], s: [100, 31], p: [100, 68], e1: [108, 51], w1: [113, 66], e2: [93, 51], w2: [89, 67], k1: [92, 89], f1: [85, 108], k2: [110, 89], f2: [117, 109] };
const four: Pose = { h: [50, 57], s: [66, 66], p: [122, 66], e1: [66, 88], w1: [68, 109], k1: [122, 109], f1: [152, 109] };

/** Frame each kind of move tightly so the figure fills its card (lying, kneeling, standing). */
const VIEW = { lying: '14 46 182 76', kneeling: '12 26 184 96', standing: '30 4 140 118' };

export const ANIMS: Record<AnimId, { poses: Pose[]; prop?: 'mat' | 'chair' | 'floor'; view: string }> = {
  kegel: { poses: [{ ...lieBent, ring: 0 }, { ...lieBent, ring: 1 }], prop: 'mat', view: VIEW.lying },
  breath: { poses: [{ ...lieBent, belly: 0 }, { ...lieBent, belly: 1 }], prop: 'mat', view: VIEW.lying },
  tilt: { poses: [lieBent, { ...lieBent, m: [82, 106], p: [106, 99], k1: [131, 76] }], prop: 'mat', view: VIEW.lying },
  heel: { poses: [lieBent, { ...lieBent, k1: [138, 101], f1: [172, 106], k2: [130, 79], f2: [152, 109] }], prop: 'mat', view: VIEW.lying },
  bridge: { poses: [lieBent, { ...lieBent, m: [80, 93], p: [108, 79], k1: [134, 71] }], prop: 'mat', view: VIEW.lying },
  walk: { poses: [stand0, stand1], prop: 'floor', view: VIEW.standing },
  brisk: { poses: [stand0, stand1], prop: 'floor', view: VIEW.standing },
  reach: { poses: [four, { ...four, e2: [46, 60], w2: [24, 56], k2: [148, 66], f2: [176, 62] }], prop: 'mat', view: VIEW.kneeling },
  cat: { poses: [four, { ...four, m: [94, 48], h: [52, 66] }], prop: 'mat', view: VIEW.kneeling },
  squat: {
    poses: [
      { h: [114, 17], s: [113, 31], p: [110, 66], e1: [125, 43], w1: [140, 45], k1: [112, 88], f1: [112, 109] },
      { h: [124, 42], s: [118, 55], m: [104, 66], p: [90, 80], e1: [132, 60], w1: [147, 58], k1: [117, 82], f1: [114, 109] },
    ],
    prop: 'chair',
    view: '30 4 150 118',
  },
  plank: {
    poses: [
      { h: [50, 83], s: [64, 89], p: [132, 95], e1: [66, 109], w1: [88, 109], k1: [158, 109], f1: [182, 100] },
      { h: [50, 82], s: [64, 88], m: [98, 93], p: [132, 94], e1: [66, 109], w1: [88, 109], k1: [158, 109], f1: [182, 100] },
    ],
    prop: 'mat',
    view: VIEW.lying,
  },
};

/** Timed programs for each exercise in Neema's plans (by move id). */
export const PROGRAMS: Record<string, Program> = {
  kegel: { anim: 'kegel', reps: 10, phases: [{ label: 'Squeeze and lift', secs: 4, pose: 1, move: 0.8 }, { label: 'Relax', secs: 5, pose: 0, move: 1 }] },
  breath: { anim: 'breath', reps: 10, guide: 'breath', phases: [{ label: 'Breathe in', secs: 4, pose: 1, move: 4 }, { label: 'Breathe out, belly in', secs: 6, pose: 0, move: 6 }] },
  tilt: { anim: 'tilt', reps: 10, phases: [{ label: 'Tilt and press', secs: 3, pose: 1, move: 1.5 }, { label: 'Relax', secs: 3, pose: 0, move: 1.5 }] },
  walk: { anim: 'walk', minutes: 5, phases: [{ label: 'Keep walking', secs: 0.6, pose: 1, move: 0.6 }, { label: 'Keep walking', secs: 0.6, pose: 0, move: 0.6 }] },
  brisk: { anim: 'brisk', minutes: 20, phases: [{ label: 'Walk briskly', secs: 0.42, pose: 1, move: 0.42 }, { label: 'Walk briskly', secs: 0.42, pose: 0, move: 0.42 }] },
  active150: { anim: 'brisk', minutes: 30, phases: [{ label: 'Keep moving', secs: 0.42, pose: 1, move: 0.42 }, { label: 'Keep moving', secs: 0.42, pose: 0, move: 0.42 }] },
  pwalk: { anim: 'walk', minutes: 30, phases: [{ label: 'Keep walking', secs: 0.6, pose: 1, move: 0.6 }, { label: 'Keep walking', secs: 0.6, pose: 0, move: 0.6 }] },
  heel: { anim: 'heel', reps: 10, phases: [{ label: 'Slide the heel out', secs: 3, pose: 1, move: 3 }, { label: 'Slide it back', secs: 3, pose: 0, move: 3 }] },
  bridge: { anim: 'bridge', reps: 10, phases: [{ label: 'Lift', secs: 2, pose: 1, move: 2 }, { label: 'Hold', secs: 3, pose: 1 }, { label: 'Lower slowly', secs: 2, pose: 0, move: 2 }, { label: 'Rest', secs: 2, pose: 0 }] },
  four: { anim: 'reach', reps: 8, phases: [{ label: 'Reach out', secs: 3, pose: 1, move: 1.5 }, { label: 'Come back', secs: 2, pose: 0, move: 1.5 }] },
  squat: { anim: 'squat', reps: 10, phases: [{ label: 'Sit back slowly', secs: 3, pose: 1, move: 3 }, { label: 'Stand up', secs: 2, pose: 0, move: 2 }] },
  plank: { anim: 'plank', reps: 3, phases: [{ label: 'Hold, breathe normally', secs: 15, pose: 1, move: 2 }, { label: 'Rest', secs: 10, pose: 0, move: 1 }] },
  back: { anim: 'cat', reps: 10, phases: [{ label: 'Round your back', secs: 3, pose: 1, move: 2 }, { label: 'Flat back', secs: 3, pose: 0, move: 2 }] },
  labour: { anim: 'breath', reps: 30, guide: 'breath', phases: [{ label: 'Breathe in', secs: 4, pose: 1, move: 4 }, { label: 'Breathe out slowly', secs: 6, pose: 0, move: 6 }] },
};

export const cycleSecs = (prog: Program) => prog.phases.reduce((t, ph) => t + ph.secs, 0);
export const programSecs = (prog: Program) => (prog.minutes ? prog.minutes * 60 : cycleSecs(prog) * (prog.reps ?? 1));

// ---------------------------------------------------------------------------
const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const P = (pt: Pt) => `${pt[0]} ${pt[1]}`;
function shape(pose: Pose) {
  const m = pose.m ?? mid(pose.s, pose.p);
  return {
    torso: `M${P(pose.s)} Q${P(m)} ${P(pose.p)}`,
    armNear: `M${P(pose.s)} L${P(pose.e1)} L${P(pose.w1)}`,
    armFar: `M${P(pose.s)} L${P(pose.e2 ?? pose.e1)} L${P(pose.w2 ?? pose.w1)}`,
    legNear: `M${P(pose.p)} L${P(pose.k1)} L${P(pose.f1)}`,
    legFar: `M${P(pose.p)} L${P(pose.k2 ?? pose.k1)} L${P(pose.f2 ?? pose.f1)}`,
    hx: pose.h[0], hy: pose.h[1],
    // Belly: a soft dome above the tummy that grows on the in-breath
    bellyRy: 2 + (pose.belly ?? 0) * 7,
    bellyCy: (pose.s[1] + pose.p[1]) / 2 - 2 - (pose.belly ?? 0) * 4,
    bellyCx: (m[0] + pose.p[0]) / 2,
    ringCy: pose.p[1] - 1 - (pose.ring ?? 0) * 6,
    ringOp: 0.35 + (pose.ring ?? 0) * 0.65,
    ringCx: pose.p[0] - 4,
  };
}
type Shape = ReturnType<typeof shape>;

/** Key frames for one cycle: hold the previous pose until the phase starts, then move over `move` seconds. */
function timeline(prog: Program, poses: Pose[]) {
  const total = cycleSecs(prog);
  const frames: { t: number; pose: number }[] = [];
  let t = 0;
  let prev = prog.phases[prog.phases.length - 1].pose;
  frames.push({ t: 0, pose: prev });
  for (const ph of prog.phases) {
    const move = Math.min(ph.move ?? 0.8, ph.secs);
    if (t > frames[frames.length - 1].t + 1e-6) frames.push({ t, pose: prev });
    frames.push({ t: t + move, pose: ph.pose });
    t += ph.secs;
    prev = ph.pose;
  }
  if (frames[frames.length - 1].t < total - 1e-6) frames.push({ t: total, pose: prev });
  const shapes = poses.map(shape);
  return {
    dur: `${total}s`,
    keyTimes: frames.map((f) => (f.t / total).toFixed(4)).join(';'),
    values: (k: keyof Shape) => frames.map((f) => shapes[f.pose][k]).join(';'),
  };
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

type FigureProps = {
  program: Program;
  /** Show one pose without movement (reduced motion, or a paused player). */
  staticPose?: number;
  className?: string;
  label: string;
};

const NEAR = '#B54523';
const FAR = '#E59A80';

/** The animated figure. Remount it (change `key`) to restart the cycle in step with a timer. */
export const ExerciseFigure = forwardRef<SVGSVGElement, FigureProps>(function ExerciseFigure({ program, staticPose, className, label }, ref) {
  const reduced = usePrefersReducedMotion();
  const def = ANIMS[program.anim];
  const still = reduced || staticPose !== undefined;
  const fixed = shape(def.poses[staticPose ?? (program.phases[0]?.pose ?? 0)]);
  const tl = still ? null : timeline(program, def.poses);
  const anim = (attr: string, key: keyof Shape) =>
    tl ? <animate attributeName={attr} dur={tl.dur} keyTimes={tl.keyTimes} values={tl.values(key)} repeatCount="indefinite" calcMode="linear" /> : null;
  const hasBelly = def.poses.some((p) => p.belly !== undefined);
  const hasRing = def.poses.some((p) => p.ring !== undefined);
  const limb = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <svg ref={ref} viewBox={def.view} role="img" aria-label={label} className={className}>
      {/* props */}
      {def.prop === 'mat' && <rect x="20" y="110" width="168" height="7" rx="3.5" fill="#E9E6F0" />}
      {def.prop === 'floor' && (
        <g>
          <path d="M20 112h160" stroke="#E8E2D9" strokeWidth="3" strokeLinecap="round" />
          {!still && [40, 80, 120, 160].map((x) => (
            <circle key={x} cx={x} cy="117" r="1.8" fill="#D8D0C5">
              <animate attributeName="cx" from={x} to={x - 40} dur={program.anim === 'brisk' ? '0.84s' : '1.2s'} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}
      {def.prop === 'chair' && (
        <g stroke="#D8D0C5" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M66 50v60M66 84h30M94 84v26" />
        </g>
      )}
      {def.prop !== 'floor' && def.prop !== 'mat' && <path d="M20 112h160" stroke="#E8E2D9" strokeWidth="3" strokeLinecap="round" />}

      {/* far limbs first, lighter for depth */}
      <path d={fixed.armFar} stroke={FAR} strokeWidth="6" {...limb}>{anim('d', 'armFar')}</path>
      <path d={fixed.legFar} stroke={FAR} strokeWidth="8" {...limb}>{anim('d', 'legFar')}</path>
      {hasBelly && (
        <ellipse cx={fixed.bellyCx} cy={fixed.bellyCy} rx="15" ry={fixed.bellyRy} fill="#F3B98F">
          {anim('ry', 'bellyRy')}{anim('cy', 'bellyCy')}
        </ellipse>
      )}
      <path d={fixed.torso} stroke={NEAR} strokeWidth="11" {...limb}>{anim('d', 'torso')}</path>
      <path d={fixed.legNear} stroke={NEAR} strokeWidth="8" {...limb}>{anim('d', 'legNear')}</path>
      <path d={fixed.armNear} stroke={NEAR} strokeWidth="6" {...limb}>{anim('d', 'armNear')}</path>
      <circle cx={fixed.hx} cy={fixed.hy} r="10" fill={NEAR}>{anim('cx', 'hx')}{anim('cy', 'hy')}</circle>
      {hasRing && (
        <ellipse cx={fixed.ringCx} cy={fixed.ringCy} rx="12" ry="5" fill="#E4F3E8" stroke="#2B9348" strokeWidth="3.5" opacity={fixed.ringOp}>
          {anim('cy', 'ringCy')}{anim('opacity', 'ringOp')}
        </ellipse>
      )}
    </svg>
  );
});
