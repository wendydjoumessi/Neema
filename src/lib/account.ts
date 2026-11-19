import { supabase } from '@/integrations/supabase/client';
import type { Json, Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import type { PregnancyData } from '@/types/pregnancy';

export type Profile = Tables<'profiles'>;
export type MedicalProfile = Tables<'medical_profiles'>;
export type PregnancyRow = Tables<'pregnancies'>;
export type Role = 'mother' | 'partner';

/** Bump when the consent text changes, so people are asked again. */
export const CONSENT_VERSION = '2026-11';

export type Account = {
  profile: Profile | null;
  medical: MedicalProfile | null;
  pregnancy: PregnancyRow | null;
  appState: Record<string, unknown> | null;
};

const DAY = 86_400_000;

/** Turn Supabase errors into short, plain messages for the sign-in screens. */
export function friendlyError(error: unknown): string {
  const msg = (error as { message?: string })?.message ?? '';
  if (/invalid login credentials/i.test(msg)) return 'That email and password don’t match. Check them and try again.';
  if (/email not confirmed/i.test(msg)) return 'Please confirm your email first: open the link we sent you.';
  if (/already registered|already exists/i.test(msg)) return 'An account with this email already exists. Log in instead.';
  if (/password should be at least|weak password/i.test(msg)) return 'Choose a password with at least 6 characters.';
  if (/rate limit|too many/i.test(msg)) return 'Too many tries. Please wait a minute and try again.';
  if (/failed to fetch|network/i.test(msg)) return 'No connection. Check your data or Wi-Fi and try again.';
  return 'Something went wrong. Please try again.';
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function signUp(input: { name: string; email: string; password: string; role: Role }) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: { data: { full_name: input.name.trim(), role: input.role }, emailRedirectTo: window.location.origin },
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
  const [profile, medical, pregnancy, state] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('medical_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('pregnancies').select('*').eq('user_id', userId).eq('status', 'active').maybeSingle(),
    supabase.from('app_state').select('state').eq('user_id', userId).maybeSingle(),
  ]);
  const err = profile.error || medical.error || pregnancy.error || state.error;
  if (err) throw err;
  return {
    profile: profile.data,
    medical: medical.data,
    pregnancy: pregnancy.data,
    appState: (state.data?.state as Record<string, unknown> | undefined) ?? null,
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
  const row = {
    user_id: userId,
    last_period_date: entry.lastPeriodDate || null,
    gestational_weeks_at_entry: entry.weeksAtEntry ?? null,
    due_date: toIsoDate(p.dueDate),
    doctor_due_date: p.doctorDueDate ? toIsoDate(p.doctorDueDate) : null,
    baby_nickname: p.babyName || null,
  };
  const existing = await supabase.from('pregnancies').select('id').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (existing.error) throw existing.error;
  const res = existing.data
    ? await supabase.from('pregnancies').update(row).eq('id', existing.data.id).select('*').single()
    : await supabase.from('pregnancies').insert(row).select('*').single();
  if (res.error) throw res.error;
  return res.data;
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
  };
}

/** Stand-in for women who are planning a family and not pregnant. */
export function notPregnant(userId: string): PregnancyData {
  return { id: 'none', userId, startDate: new Date(), dueDate: new Date(Date.now() + 280 * DAY), currentWeek: 1, trimester: 1 };
}
