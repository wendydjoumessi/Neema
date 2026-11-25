import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------------------
// A small in-memory stand-in for the Supabase client
// ---------------------------------------------------------------------------
type Row = Record<string, unknown>;
const db: Record<string, Row[]> = { profiles: [], medical_profiles: [], pregnancies: [], app_state: [], data_requests: [], emergency_contacts: [] };
const calls: { table: string; op: string; payload?: unknown }[] = [];
let session: { user: { id: string; email: string; last_sign_in_at?: string } } | null = null;
let signInError: { message: string } | null = null;

function query(table: string) {
  const filters: [string, unknown][] = [];
  let op = 'select';
  let payload: Row | null = null;
  const rows = () => db[table].filter((r) => filters.every(([k, v]) => (v && typeof v === 'object' && 'in' in v ? (v as { in: unknown[] }).in.includes(r[k]) : r[k] === v)));
  const run = () => {
    if (op === 'update') { rows().forEach((r) => Object.assign(r, payload)); return rows(); }
    if (op === 'delete') { const gone = rows(); db[table] = db[table].filter((r) => !gone.includes(r)); return gone; }
    if (op === 'upsert' && Array.isArray(payload)) {
      return (payload as Row[]).map((p) => {
        const existing = db[table].find((r) => r.id === p.id);
        if (existing) Object.assign(existing, p); else db[table].push({ ...p });
        return existing ?? p;
      });
    }
    if (op === 'insert' || op === 'upsert') {
      const key = table === 'profiles' ? 'id' : table === 'pregnancies' || table === 'data_requests' ? 'id' : 'user_id';
      const existing = payload && db[table].find((r) => r[key] && r[key] === payload![key]);
      const row = { id: `id-${db[table].length + 1}`, status: table === 'pregnancies' ? 'active' : undefined, ...payload };
      if (existing && op === 'upsert') Object.assign(existing, payload); else db[table].push(row);
      return [existing ?? row];
    }
    return rows();
  };
  const api = {
    select: () => api,
    eq: (k: string, v: unknown) => { filters.push([k, v]); return api; },
    order: () => api,
    in: (k: string, vs: unknown[]) => { filters.push([k, { in: vs }]); return api; },
    delete: () => { op = 'delete'; calls.push({ table, op }); return api; },
    limit: () => api,
    update: (p: Row) => { op = 'update'; payload = p; calls.push({ table, op, payload: p }); return api; },
    insert: (p: Row) => { op = 'insert'; payload = p; calls.push({ table, op, payload: p }); return api; },
    upsert: (p: Row) => { op = 'upsert'; payload = p; calls.push({ table, op, payload: p }); return api; },
    maybeSingle: () => Promise.resolve({ data: run()[0] ?? null, error: null }),
    single: () => Promise.resolve({ data: run()[0] ?? null, error: null }),
    then: (res: (v: { data: Row[]; error: null }) => void) => Promise.resolve({ data: run(), error: null }).then(res),
  };
  return api;
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (t: string) => query(t),
    auth: {
      getSession: () => Promise.resolve({ data: { session } }),
      getUser: () => Promise.resolve({ data: { user: session?.user ?? null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      signInWithPassword: ({ email }: { email: string }) => {
        if (signInError) return Promise.resolve({ data: { user: null, session: null }, error: signInError });
        session = { user: { id: 'u1', email, last_sign_in_at: new Date().toISOString() } };
        return Promise.resolve({ data: { user: session.user, session }, error: null });
      },
      signUp: () => Promise.resolve({ data: { user: { id: 'u2' }, session: null }, error: null }),
      signOut: () => { session = null; return Promise.resolve({ error: null }); },
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ error: null }),
    },
    functions: { invoke: () => Promise.resolve({ error: null }) },
  },
}));

import Index from '@/pages/Index';
import { CONSENT_VERSION, pregnancyFromRow, friendlyError } from './account';

const iso = (d: Date) => d.toISOString().slice(0, 10);
const consented = { consent_version: CONSENT_VERSION, consent_terms_at: '2026-11-01T00:00:00Z', consent_health_data_at: '2026-11-01T00:00:00Z' };

beforeEach(() => {
  for (const k of Object.keys(db)) db[k] = [];
  calls.length = 0;
  session = null;
  signInError = null;
  window.localStorage.clear();
  Element.prototype.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

describe('pregnancy dating', () => {
  it('works out the week from the due date, and the doctor’s date wins', () => {
    const due = new Date(Date.now() + 112 * 86400000);
    const p = pregnancyFromRow({ id: 'p', user_id: 'u', due_date: iso(due), doctor_due_date: null } as never);
    expect(p.currentWeek).toBe(24);
    expect(p.trimester).toBe(2);
    const doctor = new Date(Date.now() + 70 * 86400000);
    const q = pregnancyFromRow({ id: 'p', user_id: 'u', due_date: iso(due), doctor_due_date: iso(doctor) } as never);
    expect(q.currentWeek).toBe(30);
    expect(q.trimester).toBe(3);
  });

  it('gives plain error messages', () => {
    expect(friendlyError({ message: 'Invalid login credentials' })).toMatch(/don’t match/);
    expect(friendlyError({ message: 'Failed to fetch' })).toMatch(/No connection/);
  });
});

describe('accounts', () => {
  it('shows the landing page when nobody is signed in', async () => {
    render(<Index />);
    expect(await screen.findByRole('heading', { name: /Care for every stage/ })).toBeInTheDocument();
  });

  it('reopens a signed-in mother straight into her app, with her saved settings', async () => {
    session = { user: { id: 'u1', email: 'amina@example.com', last_sign_in_at: new Date().toISOString() } };
    db.profiles.push({ id: 'u1', full_name: 'Amina Nkeng', role: 'mother', language: 'en', journey: 'preg', discreet_mode: false, city: 'Akwa, Douala', ...consented });
    db.pregnancies.push({ id: 'p1', user_id: 'u1', status: 'active', due_date: iso(new Date(Date.now() + 112 * 86400000)), doctor_due_date: null });
    db.app_state.push({ user_id: 'u1', state: { water: 7 } });
    render(<Index />);
    expect(await screen.findByText('Week 24')).toBeInTheDocument();
    expect(screen.getByText(/Good afternoon, Amina|Good .*, Amina/)).toBeInTheDocument();
    expect(screen.getByText(/Akwa, Douala/)).toBeInTheDocument();
    expect(screen.getByText('7 of 11 cups')).toBeInTheDocument();
  });

  it('asks a new account for consent and saves it', async () => {
    session = { user: { id: 'u1', email: 'amina@example.com', last_sign_in_at: new Date().toISOString() } };
    db.profiles.push({ id: 'u1', full_name: 'Amina', role: 'mother', journey: 'preg', language: 'en', discreet_mode: false });
    render(<Index />);
    expect(await screen.findByRole('heading', { name: 'Your data, your choice' })).toBeInTheDocument();
    const agree = screen.getByRole('button', { name: 'Agree and continue' });
    expect(agree).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /accept Neema’s terms/ }));
    fireEvent.click(screen.getByRole('button', { name: /may store the health information/ }));
    fireEvent.click(agree);
    expect(await screen.findByRole('heading', { name: /When did your last period start/ })).toBeInTheDocument();
    const consent = calls.find((c) => c.table === 'profiles' && c.op === 'update');
    expect(consent?.payload).toMatchObject({ consent_version: CONSENT_VERSION, consent_sms: true, consent_partner_sharing: false });
  });

  it('saves the pregnancy, then offers the medical profile, then opens the app', async () => {
    session = { user: { id: 'u1', email: 'amina@example.com', last_sign_in_at: new Date().toISOString() } };
    db.profiles.push({ id: 'u1', full_name: 'Amina', role: 'mother', journey: 'preg', language: 'en', discreet_mode: false, ...consented });
    render(<Index />);
    fireEvent.change(await screen.findByLabelText('I know how many weeks pregnant I am'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Start my journey/ }));
    expect(await screen.findByRole('heading', { name: 'A little about your health' })).toBeInTheDocument();
    expect(db.pregnancies).toHaveLength(1);
    expect(db.pregnancies[0]).toMatchObject({ user_id: 'u1', gestational_weeks_at_entry: 20 });
    fireEvent.click(screen.getByRole('radio', { name: 'O+' }));
    fireEvent.click(screen.getByRole('radio', { name: 'AS' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(await screen.findByText('Week 20')).toBeInTheDocument();
    expect(db.medical_profiles[0]).toMatchObject({ user_id: 'u1', blood_group: 'O+', genotype: 'AS' });
  });

  it('saves setting changes to the account', async () => {
    session = { user: { id: 'u1', email: 'amina@example.com', last_sign_in_at: new Date().toISOString() } };
    db.profiles.push({ id: 'u1', full_name: 'Amina', role: 'mother', journey: 'preg', language: 'en', discreet_mode: false, ...consented });
    db.pregnancies.push({ id: 'p1', user_id: 'u1', status: 'active', due_date: iso(new Date(Date.now() + 112 * 86400000)), doctor_due_date: null });
    render(<Index />);
    await screen.findByText('Week 24');
    fireEvent.click(screen.getByRole('button', { name: /Discreet mode/ }));
    await waitFor(() => expect(db.profiles[0].discreet_mode).toBe(true), { timeout: 2000 });
  });

  it('shows a plain message when the password is wrong', async () => {
    signInError = { message: 'Invalid login credentials' };
    render(<Index />);
    fireEvent.click(await screen.findByRole('button', { name: 'Start free' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    fireEvent.click(screen.getByRole('button', { name: /I’m a mother/ }));
    fireEvent.click(screen.getByRole('button', { name: /I’m pregnant/ }));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'amina@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(within(screen.getByRole('button', { name: 'Log in', hidden: false }).closest('form')!).getByRole('button', { name: 'Log in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/don’t match/);
  });

  it('lets a woman who is not pregnant go straight to family planning', async () => {
    session = { user: { id: 'u1', email: 'amina@example.com', last_sign_in_at: new Date().toISOString() } };
    db.profiles.push({ id: 'u1', full_name: 'Amina', role: 'mother', journey: 'preg', language: 'en', discreet_mode: false, ...consented });
    render(<Index />);
    fireEvent.click(await screen.findByRole('button', { name: 'I’m not pregnant right now' }));
    fireEvent.click(screen.getByRole('button', { name: 'I’m trying to get pregnant' }));
    expect(await screen.findByRole('heading', { name: 'Let’s find your fertile days' })).toBeInTheDocument();
    expect(db.profiles[0].journey).toBe('ttc');
  });

  it('asks a mother what brings her, and sends family planning straight to the app', async () => {
    render(<Index />);
    fireEvent.click(await screen.findByRole('button', { name: 'Start free' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    fireEvent.click(screen.getByRole('button', { name: /I’m a mother/ }));
    expect(screen.getByRole('heading', { name: 'What brings you to Neema?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /I want to avoid pregnancy/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue as guest' }));
    expect(screen.queryByRole('heading', { name: /When did your last period start/ })).not.toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Find a method that fits your life' })).toBeInTheDocument();
  });

  it('asks a new mother for her baby’s birth date instead of pregnancy dates', async () => {
    session = { user: { id: 'u1', email: 'amina@example.com', last_sign_in_at: new Date().toISOString() } };
    db.profiles.push({ id: 'u1', full_name: 'Amina', role: 'mother', journey: 'pp', language: 'en', discreet_mode: false, ...consented });
    render(<Index />);
    const date = await screen.findByLabelText('Baby’s date of birth');
    const born = iso(new Date(Date.now() - 21 * 86400000));
    fireEvent.change(date, { target: { value: born } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    expect(await screen.findByRole('heading', { name: 'A little about your health' })).toBeInTheDocument();
    expect(db.pregnancies[0]).toMatchObject({ user_id: 'u1', status: 'born', outcome_date: born });
  });

  it('reopens a mother after birth on her after-birth home', async () => {
    session = { user: { id: 'u1', email: 'amina@example.com', last_sign_in_at: new Date().toISOString() } };
    db.profiles.push({ id: 'u1', full_name: 'Amina', role: 'mother', journey: 'pp', language: 'en', discreet_mode: false, ...consented });
    db.pregnancies.push({ id: 'p1', user_id: 'u1', status: 'born', due_date: iso(new Date(Date.now() - 21 * 86400000)), outcome_date: iso(new Date(Date.now() - 21 * 86400000)), doctor_due_date: null });
    render(<Index />);
    expect(await screen.findByText('3 weeks after birth')).toBeInTheDocument();
  });

  it('loads her saved contacts and saves changes to the contacts table', async () => {
    session = { user: { id: 'u1', email: 'amina@example.com', last_sign_in_at: new Date().toISOString() } };
    db.profiles.push({ id: 'u1', full_name: 'Amina', role: 'mother', journey: 'preg', language: 'en', discreet_mode: false, ...consented });
    db.pregnancies.push({ id: 'p1', user_id: 'u1', status: 'active', due_date: iso(new Date(Date.now() + 112 * 86400000)), doctor_due_date: null });
    db.emergency_contacts.push({ id: 'c1', user_id: 'u1', name: 'Paul', relationship: 'Partner', phone: '+237677123456', alert_by_sms: true, position: 0 });
    render(<Index />);
    await screen.findByText('Week 24');
    fireEvent.click(screen.getByRole('button', { name: 'Open profile and settings' }));
    expect(screen.getByText('Partner · +237 6 77 12 34 56')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Add a contact' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Rose' } });
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '699 00 01 11' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(db.emergency_contacts).toHaveLength(2), { timeout: 2000 });
    expect(db.emergency_contacts[1]).toMatchObject({ user_id: 'u1', name: 'Rose', phone: '+237699000111', position: 1 });
    fireEvent.click(screen.getByRole('button', { name: 'Edit Paul' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove this contact' }));
    fireEvent.click(within(screen.getByRole('alert')).getByRole('button', { name: 'Remove' }));
    await waitFor(() => expect(db.emergency_contacts.map((c) => c.name)).toEqual(['Rose']), { timeout: 2000 });
  });
});
