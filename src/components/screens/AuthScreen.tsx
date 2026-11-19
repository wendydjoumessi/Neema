import { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Segmented } from '@/neema/ui';
import { User } from '@/types/pregnancy';
import { friendlyError, requestPasswordReset, signIn, signUp, type Journey } from '@/lib/account';
import logo from '@/assets/logo.png';

interface AuthScreenProps {
  /** Called once the person is signed in with a real account. */
  onSignedIn: (userId: string) => void;
  /** Called for "Continue as guest": nothing is saved. */
  onGuest: (user: User) => void;
  onBack: () => void;
  defaultRole: 'mother' | 'partner';
  /** What she chose in "What brings you to Neema?", saved with a new account. */
  journey?: Journey;
}

type Mode = 'login' | 'signup' | 'forgot';

export function AuthScreen({ onSignedIn, onGuest, onBack, defaultRole, journey }: AuthScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const run = async (fn: () => Promise<void>) => {
    setError('');
    setNotice('');
    setIsLoading(true);
    try {
      await fn();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const user = await signIn(loginEmail, loginPassword);
      if (user) onSignedIn(user.id);
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const { user, needsConfirmation } = await signUp({ name: signupName, email: signupEmail, password: signupPassword, role: defaultRole, journey });
      if (needsConfirmation) {
        setLoginEmail(signupEmail);
        setMode('login');
        setNotice(`We sent a confirmation link to ${signupEmail}. Open it, then log in here.`);
      } else if (user) {
        onSignedIn(user.id);
      }
    });
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await requestPasswordReset(loginEmail);
      setMode('login');
      setNotice(`If an account exists for ${loginEmail}, we sent a link to choose a new password.`);
    });
  };

  const handleGuestLogin = () => {
    onGuest({ id: 'guest', name: 'Guest', email: 'guest@neema.app', role: defaultRole });
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setNotice('');
  };

  const isLogin = mode === 'login';
  const inputCls = 'min-h-[52px] w-full rounded-xl border border-neema-border bg-white pl-11 pr-4 text-base text-neema-ink placeholder:text-neema-muted transition-colors duration-150 focus:border-neema-primary focus:outline-none focus:ring-2 focus:ring-neema-primary/30';
  const field = (id: string, label: string, Icon: typeof Mail, props: React.InputHTMLAttributes<HTMLInputElement>, eye = false) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-neema-ink">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neema-muted" />
        <input id={id} required className={cn(inputCls, eye && 'pr-12')} {...props} />
        {eye && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-neema-muted-strong hover:text-neema-ink">
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
  const pwType = showPassword ? 'text' : 'password';

  return (
    <div className="min-h-screen bg-neema-cream font-sans text-neema-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-8 pt-3">
        <header className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="flex min-h-[48px] items-center gap-1.5 rounded-full px-3 font-semibold text-neema-dark transition-colors duration-150 hover:bg-neema-sand">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" />
        </header>

        <div className="mt-6">
          <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-neema-dark">Your account</div>
          <h1 className="font-sans mt-2 text-3xl font-bold leading-tight">{mode === 'forgot' ? 'Reset your password' : isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-lg text-neema-muted-strong">
            {defaultRole === 'mother' ? 'Your pregnancy and family care, in one place.' : 'Stay close and support the mother.'}
          </p>
        </div>

        {mode !== 'forgot' && (
          <Segmented className="mt-6" label="Account" value={mode} onChange={switchMode}
            options={[{ id: 'login', label: 'Log in' }, { id: 'signup', label: 'Sign up' }]} />
        )}
        {notice && <p role="status" className="mt-4 rounded-xl bg-neema-success-soft px-4 py-3 font-medium text-neema-success-ink">{notice}</p>}
        {error && <p role="alert" className="mt-4 rounded-xl bg-neema-primary-soft px-4 py-3 font-medium text-neema-dark">{error}</p>}

        <section className="mt-4 rounded-2xl bg-white p-5 shadow-neema-card">
          {mode === 'forgot' ? (
            <form onSubmit={handleForgot} className="flex flex-col gap-4">
              <p className="text-neema-muted-strong">Enter your email and we’ll send you a link to choose a new password.</p>
              {field('forgot-email', 'Email', Mail, { type: 'email', placeholder: 'you@example.com', value: loginEmail, onChange: (e) => setLoginEmail(e.target.value), autoComplete: 'email' })}
              <SubmitBtn loading={isLoading}>Send reset link</SubmitBtn>
              <button type="button" onClick={() => switchMode('login')} className="min-h-[48px] font-semibold text-neema-dark">Back to log in</button>
            </form>
          ) : isLogin ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {field('login-email', 'Email', Mail, { type: 'email', placeholder: 'you@example.com', value: loginEmail, onChange: (e) => setLoginEmail(e.target.value), autoComplete: 'email' })}
              {field('login-password', 'Password', Lock, { type: pwType, placeholder: 'Your password', value: loginPassword, onChange: (e) => setLoginPassword(e.target.value), autoComplete: 'current-password' }, true)}
              <button type="button" onClick={() => switchMode('forgot')} className="-mt-1 self-end min-h-[48px] px-1 text-[15px] font-semibold text-neema-dark hover:underline">Forgot password?</button>
              <SubmitBtn loading={isLoading}>Log in</SubmitBtn>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {field('signup-name', 'Full name', UserIcon, { type: 'text', placeholder: 'e.g. Amina Fouda', value: signupName, onChange: (e) => setSignupName(e.target.value), autoComplete: 'name' })}
              {field('signup-email', 'Email', Mail, { type: 'email', placeholder: 'you@example.com', value: signupEmail, onChange: (e) => setSignupEmail(e.target.value), autoComplete: 'email' })}
              {field('signup-password', 'Password', Lock, { type: pwType, placeholder: 'Create a password', value: signupPassword, onChange: (e) => setSignupPassword(e.target.value), autoComplete: 'new-password', minLength: 6 }, true)}
              <SubmitBtn loading={isLoading}>Create account</SubmitBtn>
            </form>
          )}
        </section>

        <div className="my-6 flex items-center gap-3 text-sm text-neema-muted-strong">
          <span className="h-px flex-1 bg-neema-line" /> or <span className="h-px flex-1 bg-neema-line" />
        </div>
        <button type="button" onClick={handleGuestLogin}
          className="flex min-h-[52px] w-full items-center justify-center rounded-xl border border-neema-border bg-white px-4 font-semibold text-neema-ink transition-transform duration-150 active:scale-[0.98]">
          Continue as guest
        </button>
        <p className="mt-2 text-center text-[15px] text-neema-muted-strong">As a guest, nothing is saved when you close Neema.</p>

        <p className="mt-auto flex items-start justify-center gap-2 pt-8 text-center text-sm text-neema-muted-strong">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-neema-success-ink" />
          Your data stays private. Neema never sells it and shows no ads.
        </p>
      </div>
    </div>
  );
}

function SubmitBtn({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading}
      className="mt-1 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-neema-dark px-4 text-lg font-semibold text-white shadow-neema-hero transition-transform duration-150 active:scale-[0.98] disabled:opacity-60">
      {loading ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Please wait…</> : children}
    </button>
  );
}
