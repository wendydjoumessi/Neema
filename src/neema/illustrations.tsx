/**
 * Small hand-drawn style illustrations for the Body & skin screens, in Neema's palette.
 * Pure SVG: no photos, no brands, light enough for slow connections.
 */
const SKIN = '#8A5A3B';
const SKIN_LIGHT = '#A9724D';

/** Stretch marks fading over a year: three skin swatches with the marks getting lighter. */
export function FadeTimeline() {
  const stages = [
    { label: 'Now', mark: '#4E2A3A', width: 3.2, opacity: 1 },
    { label: '6 months', mark: '#6E4A44', width: 2.4, opacity: 0.75 },
    { label: '12 months', mark: '#C9A58C', width: 1.6, opacity: 0.7 },
  ];
  return (
    <svg viewBox="0 0 320 132" role="img" aria-label="Stretch marks fade over time: dark now, lighter at 6 months, pale and thin at 12 months" className="h-auto w-full">
      {stages.map((st, i) => {
        const x = 8 + i * 106;
        return (
          <g key={st.label}>
            <rect x={x} y={8} width={92} height={86} rx={18} fill={i === 2 ? SKIN_LIGHT : SKIN} />
            {[26, 44, 62, 78].map((y, k) => (
              <path key={y} d={`M${x + 14 + (k % 2) * 6} ${y} q 16 -7 32 0 t 32 0`} fill="none" stroke={st.mark} strokeWidth={st.width} strokeLinecap="round" opacity={st.opacity} />
            ))}
            <text x={x + 46} y={118} textAnchor="middle" fontSize="13" fontWeight="600" fill="#2B2D42" fontFamily="Inter, sans-serif">{st.label}</text>
            {i < 2 && <path d={`M${x + 96} 51 l 7 0`} stroke="#D95D39" strokeWidth="2.5" strokeLinecap="round" />}
          </g>
        );
      })}
    </svg>
  );
}

type IconProps = { className?: string };

export function DropIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path d="M24 6c7 10 13 17 13 24a13 13 0 0 1-26 0c0-7 6-14 13-24z" fill="#7FB3D5" />
      <path d="M18 31a6 6 0 0 0 6 6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
export function LeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <circle cx="17" cy="26" r="10" fill="#4CAF6A" />
      <circle cx="31" cy="26" r="10" fill="#2B9348" />
      <circle cx="24" cy="15" r="10" fill="#5FBF7A" />
      <path d="M24 26v16" stroke="#1E6B34" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
export function SheaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <ellipse cx="24" cy="34" rx="16" ry="7" fill="#E9D8B4" />
      <path d="M8 34c0-9 7-15 16-15s16 6 16 15" fill="#F3E7CB" />
      <ellipse cx="24" cy="20" rx="9" ry="5" fill="#FFF8E7" />
      <path d="M30 10c3 3 3 7 0 10" stroke="#B88A4A" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
export function CocoaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <ellipse cx="24" cy="25" rx="11" ry="17" fill="#B5651D" transform="rotate(-20 24 25)" />
      <path d="M18 12c-2 9-1 18 4 27M25 9c0 10 1 20 5 28" stroke="#8A4A12" strokeWidth="2" fill="none" />
      <path d="M31 7l4-3" stroke="#2B9348" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
export function AlmondIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path d="M24 5c9 8 13 17 13 25a13 13 0 0 1-26 0c0-8 4-17 13-25z" fill="#C68B59" />
      <path d="M20 18c-2 5-2 11 0 16M27 16c1 6 1 12-1 18" stroke="#A86F42" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
export function CoconutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <circle cx="24" cy="26" r="17" fill="#7A4E2D" />
      <circle cx="24" cy="26" r="12" fill="#FFFDF7" />
      <path d="M8 22a16 16 0 0 1 32 0" fill="#7A4E2D" />
      <circle cx="19" cy="15" r="1.8" fill="#4A2E1A" /><circle cx="24" cy="13" r="1.8" fill="#4A2E1A" /><circle cx="29" cy="15" r="1.8" fill="#4A2E1A" />
    </svg>
  );
}
export function TubeIcon({ className, crossed = false }: IconProps & { crossed?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <rect x="13" y="12" width="22" height="30" rx="5" fill={crossed ? '#F2C9BC' : '#FFFFFF'} stroke={crossed ? '#B54523' : '#D8D0C5'} strokeWidth="2" />
      <rect x="18" y="5" width="12" height="8" rx="2" fill={crossed ? '#B54523' : '#E09F3E'} />
      <rect x="17" y="22" width="14" height="8" rx="2" fill={crossed ? '#fff' : '#FBEFD9'} />
      {crossed && (
        <>
          <circle cx="24" cy="26" r="20" fill="none" stroke="#B54523" strokeWidth="3.5" />
          <path d="M10 12l28 28" stroke="#B54523" strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
export function HatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <ellipse cx="24" cy="31" rx="20" ry="6" fill="#E09F3E" />
      <path d="M13 31c0-10 5-17 11-17s11 7 11 17" fill="#F3B95F" />
      <path d="M13 27h22" stroke="#D95D39" strokeWidth="3" />
    </svg>
  );
}
export function ShadeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path d="M6 24a18 14 0 0 1 36 0z" fill="#D95D39" />
      <path d="M6 24q4.5-5 9 0q4.5-5 9 0q4.5-5 9 0q4.5-5 9 0" fill="#B54523" />
      <path d="M24 10v30q0 4 4 4" stroke="#2B2D42" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
export function SunscreenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <rect x="12" y="10" width="24" height="32" rx="6" fill="#FFFFFF" stroke="#D8D0C5" strokeWidth="2" />
      <rect x="18" y="4" width="12" height="7" rx="2" fill="#3A7CA5" />
      <circle cx="24" cy="26" r="6" fill="#E09F3E" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path key={a} d="M24 16v-2.5" stroke="#E09F3E" strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 24 26)`} />
      ))}
    </svg>
  );
}
export function DnaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path d="M16 6c0 12 16 12 16 24s-16 12-16 12M32 6c0 12-16 12-16 24s16 12 16 12" stroke="#3E3560" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[12, 20, 28, 36].map((y) => <path key={y} d={`M19 ${y}h10`} stroke="#8B80B6" strokeWidth="2.5" strokeLinecap="round" />)}
    </svg>
  );
}
export function HandHeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path d="M24 22c-4-6-12-3-10 3 1 4 10 9 10 9s9-5 10-9c2-6-6-9-10-3z" fill="#D95D39" />
      <path d="M6 38c6-1 9-4 14-4h10c2 0 2 3 0 3h-7M30 37l8-4c2-1 4 2 2 3l-11 6H6" stroke="#1E6B34" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
