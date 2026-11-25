import type { EmergencyContact } from '@/neema/contacts';
import { supabase } from '@/integrations/supabase/client';
import type { Json, Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import type { PregnancyData } from '@/types/pregnancy';
import { emergencyContactSchema, pregnancySetupSchema, signupSchema } from './form-validation';

export type Profile = Tables<'profiles'>;
export type MedicalProfile = Tables<'medical_profiles'>;
export type PregnancyRow = Tables<'pregnancies'>;
export type Role = 'mother' | 'partner';
export type Journey = 'ttc' | 'preg' | 'pp' | 'avoid';

/** Bump when the consent text changes, so people are asked again. */
export const CONSENT_VERSION = '2026-11';

export type Account = {
  profile: Profile | null;
  medical: MedicalProfile | null;
  pregnancy: PregnancyRow | null;
  /** The most recent birth, for mothers in the after-birth journey. */
  birth: PregnancyRow | null;
  appState: Record<string, unknown> | null;
  contacts: EmergencyContact[];
};

const DAY = 86_400_000;

/** Turn Supabase errors into short, plain messages for the sign-in screens. */
export function friendlyError(error: unknown): string {
  const msg = (error as { message?: string })?.message ?? '';
  if (/invalid login credentials/i.test(msg)) return 'That email and password don’t match. Check them and try again.';
  if (/email not confirmed/i.test(msg)) return 'Please confirm your email first: open the link we sent you.';
  if (/already registered|already exists/i.test(msg)) return 'An account with this email already exists. Log in instead.';
  if (/pwned|leaked|compromised|breached|known.*weak/i.test(msg)) return 'This password has appeared in a data breach. Choose a different password you haven’t used before.';
  if (/password should be at least|weak password/i.test(msg)) return 'Choose a password with at least 6 characters.';
  if (/rate limit|too many/i.test(msg)) return 'Too many tries. Please wait a minute and try again.';
  if (/failed to fetch|network/i.test(msg)) return 'No connection. Check your data or Wi-Fi and try again.';
  return 'Something went wrong. Please try again.';
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function signUp(input: { name: string; email: string; password: string; country: string; region: string; city: string; role: Role; journey?: Journey }) {
  const validated = signupSchema.parse(input) as { name: string; email: string; password: string; country: string; region: string; city: string };
  const { data, error } = await supabase.auth.signUp({
    email: validated.email,
    password: validated.password,
    options: {
      data: {
        full_name: validated.name, role: input.role, journey: input.journey ?? 'preg',
        country: validated.country, region: validated.region, city: validated.city,
      },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  // With email confirmation on, there is no session until the link is opened.
  return { user: data.user, needsConfirmation: !data.session };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  return data.user;
}

/** People must sign in again once this long has passed since their last sign-in. */
export const MAX_SESSION_MS = DAY;

/** True when the last sign-in is older than MAX_SESSION_MS (or unknown). */
export function isSessionExpired(lastSignInAt: string | null | undefined, now = Date.now()): boolean {
  if (!lastSignInAt) return true;
  const t = Date.parse(lastSignInAt);
  return Number.isNaN(t) || now - t >= MAX_SESSION_MS;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Loading and saving
// ---------------------------------------------------------------------------

export async function loadAccount(userId: string): Promise<Account> {
  const [profile, medical, pregnancy, birth, state] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('medical_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('pregnancies').select('*').eq('user_id', userId).eq('status', 'active').maybeSingle(),
    supabase.from('pregnancies').select('*').eq('user_id', userId).eq('status', 'born')
      .order('outcome_date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('app_state').select('state').eq('user_id', userId).maybeSingle(),
  ]);
  const contacts = await supabase.from('emergency_contacts').select('*').eq('user_id', userId).order('position', { ascending: true });
  const err = profile.error || medical.error || pregnancy.error || birth.error || state.error;
  if (err) throw err;
  return {
    profile: profile.data,
    medical: medical.data,
    pregnancy: pregnancy.data,
    birth: birth.data,
    appState: (state.data?.state as Record<string, unknown> | undefined) ?? null,
    // Contacts are not essential to open the app: if they fail to load, start with none.
    contacts: (contacts.data ?? []).map((c) => ({ id: c.id, name: c.name, relationship: c.relationship, phone: c.phone, sms: c.alert_by_sms })),
  };
}

export async function saveProfile(userId: string, patch: TablesUpdate<'profiles'>) {
  const { error } = await supabase.from('profiles').update(patch).eq('id', userId);
  if (error) throw error;
}

export async function saveConsent(userId: string, choices: { sms: boolean; partnerSharing: boolean }) {
  const now = new Date().toISOString();
  await saveProfile(userId, {
    consent_version: CONSENT_VERSION,
    consent_terms_at: now,
    consent_health_data_at: now,
    consent_sms: choices.sms,
    consent_partner_sharing: choices.partnerSharing,
  });
}

export async function saveMedicalProfile(userId: string, data: Omit<TablesInsert<'medical_profiles'>, 'user_id'>) {
  const { error } = await supabase.from('medical_profiles').upsert({ ...data, user_id: userId });
  if (error) throw error;
}

export async function savePregnancy(userId: string, p: PregnancyData, entry: { lastPeriodDate?: string; weeksAtEntry?: number }) {
  const validated = pregnancySetupSchema.parse({
    lastPeriodDate: entry.lastPeriodDate ?? '',
    gestationalWeeks: entry.weeksAtEntry === undefined ? '' : String(entry.weeksAtEntry),
    doctorDueDate: p.doctorDueDate ? toIsoDate(p.doctorDueDate) : '',
    babyName: p.babyName ?? '',
  });
  const row = {
    user_id: userId,
    last_period_date: entry.lastPeriodDate || null,
    gestational_weeks_at_entry: entry.weeksAtEntry ?? null,
    due_date: toIsoDate(p.dueDate),
    doctor_due_date: p.doctorDueDate ? toIsoDate(p.doctorDueDate) : null,
    baby_nickname: validated.babyName || null,
  };
  const existing = await supabase.from('pregnancies').select('id').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (existing.error) throw existing.error;
  const res = existing.data
    ? await supabase.from('pregnancies').update(row).eq('id', existing.data.id).select('*').single()
    : await supabase.from('pregnancies').insert(row).select('*').single();
  if (res.error) throw res.error;
  return res.data;
}

/** Record a birth: closes the active pregnancy if there is one, otherwise adds a new record. */
export async function saveBirth(userId: string, birthDate: string, nickname: string) {
  const existing = await supabase.from('pregnancies').select('id').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (existing.error) throw existing.error;
  const fields = { status: 'born' as const, outcome_date: birthDate, ...(nickname ? { baby_nickname: nickname } : {}) };
  const res = existing.data
    ? await supabase.from('pregnancies').update(fields).eq('id', existing.data.id).select('*').single()
    : await supabase.from('pregnancies').insert({ user_id: userId, due_date: birthDate, ...fields }).select('*').single();
  if (res.error) throw res.error;
  return res.data;
}

/** Replace her saved emergency contacts with this list (adds, edits, reorders and removes). */
export async function saveContacts(userId: string, input: EmergencyContact[]) {
  // Same rules as the form; anything invalid (e.g. an old device copy) is left out rather than failing the whole save.
  const list = input.flatMap((c) => {
    const r = emergencyContactSchema.safeParse(c);
    return r.success ? [{ ...(r.data as Omit<EmergencyContact, 'id'>), id: c.id }] : [];
  }).slice(0, 5);
  const existing = await supabase.from('emergency_contacts').select('id').eq('user_id', userId);
  if (existing.error) throw existing.error;
  const keep = new Set(list.map((c) => c.id));
  const gone = (existing.data ?? []).map((r) => r.id).filter((id) => !keep.has(id));
  if (gone.length) {
    const del = await supabase.from('emergency_contacts').delete().in('id', gone);
    if (del.error) throw del.error;
  }
  if (list.length) {
    const up = await supabase.from('emergency_contacts').upsert(
      list.map((c, i) => ({ id: c.id, user_id: userId, name: c.name, relationship: c.relationship, phone: c.phone, alert_by_sms: c.sms, position: i })),
    );
    if (up.error) throw up.error;
  }
}

export async function saveAppState(userId: string, state: Record<string, unknown>) {
  const { error } = await supabase.from('app_state').upsert({ user_id: userId, state: state as Json });
  if (error) throw error;
}

export async function requestDeletion(userId: string) {
  const { error } = await supabase.from('data_requests').insert({ user_id: userId, kind: 'delete' });
  if (error) throw error;
}

/** Download everything Neema holds about the user as a JSON file, and log the request. */
export async function exportMyData(userId: string) {
  const account = await loadAccount(userId);
  const all = await supabase.from('pregnancies').select('*').eq('user_id', userId);
  const blob = new Blob(
    [JSON.stringify({ exported_at: new Date().toISOString(), ...account, all_pregnancies: all.data ?? [] }, null, 2)],
    { type: 'application/json' },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neema-my-data-${toIsoDate(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
  await supabase.from('data_requests').insert({ user_id: userId, kind: 'export' });
}

// ---------------------------------------------------------------------------
// Pregnancy dating
// ---------------------------------------------------------------------------

export function toIsoDate(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/** Current week and trimester from the due date (the doctor's date wins). Recomputed on every load. */
export function pregnancyFromRow(row: PregnancyRow): PregnancyData {
  const due = new Date((row.doctor_due_date ?? row.due_date) + 'T00:00:00');
  const start = new Date(due.getTime() - 280 * DAY);
  const days = Math.floor((Date.now() - start.getTime()) / DAY);
  const currentWeek = Math.min(42, Math.max(1, Math.floor(days / 7)));
  return {
    id: row.id,
    userId: row.user_id,
    startDate: start,
    dueDate: due,
    doctorDueDate: row.doctor_due_date ? new Date(row.doctor_due_date + 'T00:00:00') : undefined,
    currentWeek,
    trimester: currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3,
    babyName: row.baby_nickname ?? undefined,
    birthDate: row.status === 'born' && row.outcome_date ? new Date(row.outcome_date + 'T00:00:00') : undefined,
  };
}

/** Stand-in for women who are planning a family and not pregnant. */
export function notPregnant(userId: string): PregnancyData {
  return { id: 'none', userId, startDate: new Date(), dueDate: new Date(Date.now() + 280 * DAY), currentWeek: 1, trimester: 1 };
}
