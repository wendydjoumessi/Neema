import { useState } from 'react';
import { Lock } from 'lucide-react';
import logo from '@/assets/logo.png';
import { friendlyError, updatePassword } from '@/lib/account';

/** Shown when someone opens the password-reset link from their email. */
export function NewPasswordScreen({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('The two passwords don’t match.'); return; }
    setSaving(true);
    setError('');
    try {
      await updatePassword(password);
      onDone();
    } catch (err) {
      setError(friendlyError(err));
      setSaving(false);
    }
  };

  const input = 'min-h-[52px] w-full rounded-xl border border-neema-border bg-white pl-11 pr-4 text-base focus:border-neema-primary focus:outline-none focus:ring-2 focus:ring-neema-primary/30';
  return (
    <div className="min-h-screen bg-neema-cream font-sans text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal [&_h2]:font-sans [&_h2]:tracking-normal">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-5 pb-8 pt-3">
        <header className="flex justify-end"><img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" /></header>
        <div>
          <h1 className="text-3xl font-bold leading-tight">Choose a new password</h1>
          <p className="mt-2 text-lg text-neema-muted-strong">Use at least 6 characters.</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-neema-card">
          {[{ id: 'new-pw', l: 'New password', v: password, s: setPassword }, { id: 'new-pw2', l: 'Type it again', v: confirm, s: setConfirm }].map((x) => (
            <div key={x.id} className="flex flex-col gap-1.5">
              <label htmlFor={x.id} className="text-[15px] font-semibold">{x.l}</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neema-muted" />
                <input id={x.id} type="password" required minLength={6} autoComplete="new-password" value={x.v} onChange={(e) => x.s(e.target.value)} className={input} />
              </div>
            </div>
          ))}
          {error && <p role="alert" className="rounded-xl bg-neema-primary-soft px-4 py-3 font-medium text-neema-dark">{error}</p>}
          <button type="submit" disabled={saving} className="min-h-[56px] rounded-xl bg-neema-dark text-lg font-semibold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save new password'}</button>
        </form>
      </div>
    </div>
  );
}

export function LoadingScreen({ message = 'Opening Neema…' }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neema-cream font-sans text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal [&_h2]:font-sans [&_h2]:tracking-normal" role="status" aria-live="polite">
      <img src={logo} alt="Neema — Care for Every Stage" className="h-24 w-auto" />
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-neema-primary-soft border-t-neema-dark" />
      <p className="text-neema-muted-strong">{message}</p>
    </div>
  );
}
