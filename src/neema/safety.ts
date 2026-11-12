import { DANGER } from './data';

/** Returns the danger sign mentioned in a message, if any. Fixed, clinician-approved keyword rules — never AI. */
export function findDangerSign(text: string): string | null {
  const low = text.toLowerCase();
  const hit = DANGER.find(([key]) => low.includes(key));
  return hit ? hit[1] : null;
}
