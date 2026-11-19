import { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Segmented } from '@/neema/ui';
import { User } from '@/types/pregnancy';
import logo from '@/assets/logo.png';

interface AuthScreenProps {
  onAuth: (user: User) => void;
  onBack: () => void;
  defaultRole: 'mother' | 'partner';
}

export function AuthScreen({ onAuth, onBack, defaultRole }: AuthScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      name: loginEmail.split('@')[0],
      email: loginEmail,
      role: defaultRole,
    };
    
    onAuth(user);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      name: signupName,
      email: signupEmail,
      role: defaultRole,
    };
    
    onAuth(user);
  };

  const handleGuestLogin = () => {
    const user: User = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@neema.app',
      role: defaultRole,
    };
    onAuth(user);
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
          <h1 className="font-sans mt-2 text-3xl font-bold leading-tight">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-lg text-neema-muted-strong">
            {defaultRole === 'mother' ? 'Your pregnancy and family care, in one place.' : 'Stay close and support the mother.'}
          </p>
        </div>

        <Segmented className="mt-6" label="Account" value={mode} onChange={setMode}
          options={[{ id: 'login', label: 'Log in' }, { id: 'signup', label: 'Sign up' }]} />

        <section className="mt-4 rounded-2xl bg-white p-5 shadow-neema-card">
          {isLogin ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {field('login-email', 'Email', Mail, { type: 'email', placeholder: 'you@example.com', value: loginEmail, onChange: (e) => setLoginEmail(e.target.value), autoComplete: 'email' })}
              {field('login-password', 'Password', Lock, { type: pwType, placeholder: 'Your password', value: loginPassword, onChange: (e) => setLoginPassword(e.target.value), autoComplete: 'current-password' }, true)}
              <button type="button" className="-mt-1 self-end min-h-[44px] px-1 text-sm font-semibold text-neema-dark hover:underline">Forgot password?</button>
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
