/**
 * Neema's illustration set: flat, warm, drawn in the brand palette with brown skin tones.
 * Pure SVG so they cost no data, scale to any size and work offline.
 */
import { cn } from '@/lib/utils';

const C = {
  dark: '#B54523', primary: '#D95D39', ochre: '#E09F3E', ochreSoft: '#FBEFD9', green: '#2B9348', greenSoft: '#E4F3E8',
  lilac: '#EDE9F6', lilacInk: '#4A3F6B', skin: '#8A5A3B', skin2: '#6B3E26', hair: '#2B2D42', cream: '#F7F4EF', white: '#FFFFFF',
};
type ArtProps = { className?: string };

export function PregnantArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="62" r="50" fill={C.ochreSoft} />
      <circle cx="58" cy="30" r="11" fill={C.skin} />
      <path d="M49 25c2-9 16-11 20-2-5-2-12-2-20 2z" fill={C.hair} />
      <circle cx="68" cy="21" r="5" fill={C.hair} />
      <path d="M54 41h9l4 14c10 3 15 12 13 22-2 9-11 13-20 12l2 21H45l3-27c-4-10-1-30 6-42z" fill={C.primary} />
      <path d="M67 55c10 3 15 12 13 22-2 9-11 13-20 12" fill={C.dark} opacity=".35" />
      <path d="M57 50c3 10 9 17 16 19" stroke={C.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M49 110h10M54 110h12" stroke={C.skin2} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function MotherBabyArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="62" r="50" fill={C.greenSoft} />
      <circle cx="52" cy="30" r="11" fill={C.skin} />
      <path d="M41 28c0-12 22-14 23-1-6-4-15-4-23 1z" fill={C.hair} />
      <path d="M42 42h18c8 8 12 22 10 40l3 28H38l2-30c-3-14-2-29 2-38z" fill={C.primary} />
      <ellipse cx="66" cy="62" rx="16" ry="11" fill={C.ochre} />
      <circle cx="76" cy="57" r="7" fill={C.skin2} />
      <path d="M50 52c6 10 14 14 24 12" stroke={C.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M84 40c3-3 7 0 5 3l-5 4-5-4c-2-3 2-6 5-3z" fill={C.primary} />
    </svg>
  );
}

export function TryingArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="62" r="50" fill={C.lilac} />
      <rect x="28" y="32" width="64" height="58" rx="10" fill={C.white} />
      <rect x="28" y="32" width="64" height="16" rx="8" fill={C.primary} />
      <path d="M42 28v10M78 28v10" stroke={C.dark} strokeWidth="5" strokeLinecap="round" />
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => (
        <circle key={`${r}${c}`} cx={38 + c * 11} cy={56 + r * 9} r="2.6" fill={r === 1 && c > 1 ? C.green : '#D8D0C5'} />
      )))}
      <path d="M86 82c4-5 11 0 8 5l-8 7-8-7c-3-5 4-10 8-5z" fill={C.primary} />
    </svg>
  );
}

export function ShieldArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="62" r="50" fill={C.ochreSoft} />
      <path d="M60 20l32 12v22c0 22-14 38-32 46-18-8-32-24-32-46V32z" fill={C.primary} />
      <path d="M60 28l24 9v17c0 17-10 29-24 36z" fill={C.dark} opacity=".3" />
      <circle cx="60" cy="58" r="10" fill={C.ochre} />
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="60" cy="43" rx="6" ry="9" fill={C.white} transform={`rotate(${a} 60 58)`} />)}
      <circle cx="60" cy="58" r="6" fill={C.ochre} />
    </svg>
  );
}

/** A baby curled up in the womb, for "this week". */
export function BabyArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="60" r="50" fill="#F9D9CC" />
      <circle cx="60" cy="60" r="40" fill="#FBE7DF" />
      <circle cx="70" cy="44" r="15" fill={C.skin} />
      <path d="M58 54c-14 4-20 20-12 32 8 12 28 10 34-2 5-10-2-20-10-22" fill={C.skin} />
      <path d="M50 78c6 2 14 1 18-4" stroke={C.skin2} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M64 46c2 2 5 2 7 0" stroke={C.skin2} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 34c0-6 6-8 9-5" stroke={C.primary} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function PlateArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="60" r="50" fill={C.greenSoft} />
      <circle cx="60" cy="64" r="34" fill={C.white} />
      <circle cx="60" cy="64" r="26" fill={C.cream} />
      <path d="M44 62c4-12 16-14 18-4-6 0-12 2-18 4z" fill={C.green} />
      <path d="M50 70c6-10 18-10 20-2-7-1-14 0-20 2z" fill="#4CAF6A" />
      <ellipse cx="72" cy="58" rx="9" ry="5" fill={C.ochre} />
      <circle cx="56" cy="78" r="4" fill={C.primary} /><circle cx="64" cy="80" r="3.5" fill={C.dark} />
    </svg>
  );
}

export function GlowArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="60" r="50" fill={C.lilac} />
      <path d="M60 26c12 16 20 28 20 40a20 20 0 0 1-40 0c0-12 8-24 20-40z" fill={C.primary} />
      <path d="M52 70a9 9 0 0 0 9 9" stroke={C.white} strokeWidth="4" fill="none" strokeLinecap="round" />
      {[[30, 34, 6], [90, 40, 5], [86, 84, 4]].map(([x, y, r]) => (
        <path key={`${x}`} d={`M${x} ${y - r}v${2 * r}M${x - r} ${y}h${2 * r}`} stroke={C.ochre} strokeWidth="3" strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function StethoArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="60" r="50" fill={C.greenSoft} />
      <path d="M40 28v22a16 16 0 0 0 32 0V28" stroke={C.lilacInk} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M56 66v10a16 16 0 0 0 32 0v-6" stroke={C.lilacInk} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="88" cy="64" r="8" fill={C.primary} /><circle cx="88" cy="64" r="3.5" fill={C.white} />
    </svg>
  );
}

export function CalendarHeartArt({ className }: ArtProps) { return <TryingArt className={className} />; }

/** Mood faces for the after-birth check-in. */
export function MoodFace({ mood, className }: { mood: 'good' | 'ok' | 'low' | 'hard'; className?: string }) {
  const fill = { good: '#F3B95F', ok: '#F6D7A7', low: '#C9C3DD', hard: '#B8B2CF' }[mood];
  const mouth = {
    good: 'M14 25c3 4 9 4 12 0',
    ok: 'M14 26h12',
    low: 'M14 28c3-3 9-3 12 0',
    hard: 'M14 29c3-4 9-4 12 0',
  }[mood];
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <circle cx="20" cy="20" r="18" fill={fill} />
      <circle cx="14" cy="17" r="2.2" fill={C.hair} /><circle cx="26" cy="17" r="2.2" fill={C.hair} />
      {mood === 'hard' && <path d="M10 14l5-2.5M30 14l-5-2.5" stroke={C.hair} strokeWidth="1.8" strokeLinecap="round" />}
      {mood === 'low' && <circle cx="27" cy="23" r="1.8" fill="#7FB3D5" />}
      <path d={mouth} stroke={C.hair} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Water cups as drops that fill in. */
export function WaterDrops({ value, total, className }: { value: number; total: number; className?: string }) {
  return (
    <span className={cn('flex flex-wrap gap-1', className)} role="img" aria-label={`${value} of ${total} cups of water`}>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 16 20" className={cn('h-5 w-4', i < value && 'neema-drop-in')} style={{ animationDelay: `${i * 40}ms` }} aria-hidden="true">
          <path d="M8 1c4 6 7 9 7 12a7 7 0 0 1-14 0c0-3 3-6 7-12z" fill={i < value ? '#5DA9D6' : 'none'} stroke={i < value ? '#5DA9D6' : '#C8D7E1'} strokeWidth="1.6" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Cycle wheel: period days, fertile window and today's marker around a ring.
 * Estimates only; the screen says so beside it.
 */
export function CycleWheel({ cycleLen, periodLen, day, ovulationDay, size = 148, children }: {
  cycleLen: number; periodLen: number; day: number; ovulationDay: number; size?: number; children?: React.ReactNode;
}) {
  const r = size / 2 - 12;
  const cx = size / 2;
  const arc = (from: number, to: number) => {
    const a0 = ((from - 1) / cycleLen) * 2 * Math.PI - Math.PI / 2;
    const a1 = (to / cycleLen) * 2 * Math.PI - Math.PI / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${cx + r * Math.cos(a0)} ${cx + r * Math.sin(a0)} A${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(a1)} ${cx + r * Math.sin(a1)}`;
  };
  const d = Math.min(Math.max(day, 1), cycleLen);
  const ta = ((d - 0.5) / cycleLen) * 2 * Math.PI - Math.PI / 2;
  return (
    <span className="relative inline-flex flex-none items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0" aria-hidden="true">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="12" />
        <path d={arc(1, periodLen)} stroke="#FFFFFF" strokeWidth="12" fill="none" strokeLinecap="round" opacity=".95" />
        <path d={arc(ovulationDay - 5, ovulationDay + 1)} stroke="#7FD49A" strokeWidth="12" fill="none" strokeLinecap="round" />
        <circle cx={cx + r * Math.cos(((ovulationDay - 0.5) / cycleLen) * 2 * Math.PI - Math.PI / 2)} cy={cx + r * Math.sin(((ovulationDay - 0.5) / cycleLen) * 2 * Math.PI - Math.PI / 2)} r="4" fill={C.green} />
        <g>
          <circle cx={cx + r * Math.cos(ta)} cy={cx + r * Math.sin(ta)} r="10" fill={C.ochre} stroke="#fff" strokeWidth="3" />
        </g>
      </svg>
      <span className="relative flex flex-col items-center text-center">{children}</span>
    </span>
  );
}

/** Small food pictures for the Diet screen. */
export function FoodArt({ name, className }: { name: string; className?: string }) {
  const n = name.toLowerCase();
  const kind = /plantain/.test(n) ? 'plantain' : /groundnut|egusi|nut/.test(n) ? 'nut' : /mackerel|fish|sardine/.test(n) ? 'fish' : /bean|koki/.test(n) ? 'bean' : 'leaf';
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <circle cx="32" cy="32" r="30" fill={kind === 'leaf' ? C.greenSoft : kind === 'fish' ? '#E3F0F8' : C.ochreSoft} />
      {kind === 'leaf' && (
        <g>
          <path d="M18 40c2-14 14-22 28-22-2 14-12 24-28 22z" fill="#4CAF6A" />
          <path d="M20 39c8-6 14-11 22-18" stroke="#1E6B34" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M24 46c4-8 12-10 18-8-4 6-10 9-18 8z" fill={C.green} />
        </g>
      )}
      {kind === 'plantain' && (
        <g>
          <path d="M16 22c4 16 18 26 34 22-4 6-14 9-22 6S14 36 16 22z" fill="#F3C64B" />
          <path d="M16 22c4 16 18 26 34 22" stroke="#C99A1E" strokeWidth="2" fill="none" />
          <path d="M14 20l4 3" stroke="#6B4B12" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {kind === 'nut' && (
        <g>
          {[[24, 28], [38, 26], [30, 40]].map(([x, y]) => (
            <g key={`${x}${y}`}><ellipse cx={x} cy={y} rx="9" ry="6" fill="#C68B59" transform={`rotate(-20 ${x} ${y})`} /><path d={`M${x - 3} ${y - 1}h6`} stroke="#A86F42" strokeWidth="1.6" strokeLinecap="round" /></g>
          ))}
        </g>
      )}
      {kind === 'fish' && (
        <g>
          <path d="M12 32c8-10 22-12 32-2-10 10-24 8-32 2z" fill="#5D8FB0" />
          <path d="M44 30l8-7v18z" fill="#4A7593" />
          <circle cx="20" cy="30" r="2" fill="#fff" />
          <path d="M26 28c4 2 4 6 0 8" stroke="#8DB6D0" strokeWidth="2" fill="none" />
        </g>
      )}
      {kind === 'bean' && (
        <g>
          {[[22, 26], [36, 24], [26, 38], [40, 37]].map(([x, y]) => (
            <ellipse key={`${x}${y}`} cx={x} cy={y} rx="7" ry="5" fill="#8C3B2A" transform={`rotate(25 ${x} ${y})`} />
          ))}
          {[[22, 26], [36, 24], [26, 38], [40, 37]].map(([x, y]) => (
            <circle key={`h${x}${y}`} cx={x - 2} cy={y - 1.5} r="1.3" fill="#E7B9A6" />
          ))}
        </g>
      )}
    </svg>
  );
}

/** A support person beside the mother: partner, mother, sister or friend. */
export function SupportArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="62" r="50" fill={C.lilac} />
      <circle cx="44" cy="40" r="10" fill={C.skin2} />
      <path d="M30 100c0-24 6-40 14-40s14 16 14 40z" fill={C.lilacInk} />
      <circle cx="74" cy="38" r="10" fill={C.skin} />
      <path d="M64 34c2-8 16-9 19 0-6-3-13-3-19 0z" fill={C.hair} />
      <path d="M60 100c0-24 6-42 14-42s14 18 14 42z" fill={C.primary} />
      <path d="M52 70c6 4 12 4 16 0" stroke={C.skin2} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M60 22c3-3 7 0 5 3l-5 4-5-4c-2-3 2-6 5-3z" fill={C.primary} />
    </svg>
  );
}
