/** Emergency contacts: phone formatting and SOS message helpers. */
export type EmergencyContact = { id: string; name: string; relationship: string; phone: string; sms: boolean };

export const MAX_CONTACTS = 5;
export const RELATIONSHIPS = ['Partner', 'Mother', 'Sister', 'Friend', 'Neighbour'];

/**
 * Turns what she types into +237XXXXXXXXX. Accepts "6 77 12 34 56", "677123456", "+237 677 12 34 56",
 * "00237…" or another country's number starting with +. Returns null when it can't be a valid number.
 */
export function normalizePhone(raw: string): string | null {
  let d = raw.trim().replace(/[\s().-]/g, '');
  if (d.startsWith('00')) d = '+' + d.slice(2);
  if (d.startsWith('+')) {
    if (!/^\+[0-9]{8,15}$/.test(d)) return null;
    if (d.startsWith('+237') && !/^\+237[26][0-9]{8}$/.test(d)) return null;
    return d;
  }
  if (/^237[26][0-9]{8}$/.test(d)) return '+' + d;
  if (/^[26][0-9]{8}$/.test(d)) return '+237' + d;
  return null;
}

/** +237677123456 → +237 6 77 12 34 56 */
export function formatPhone(p: string): string {
  const m = p.match(/^\+237([26])(\d{2})(\d{2})(\d{2})(\d{2})$/);
  return m ? `+237 ${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]}` : p;
}

export const newContactId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));

/** An sms: link that opens the phone's messaging app with recipients and text filled in. */
export function smsLink(phones: string[], body: string): string {
  const ios = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  return `sms:${phones.join(',')}${ios ? '&' : '?'}body=${encodeURIComponent(body)}`;
}
