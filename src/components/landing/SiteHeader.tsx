import { useEffect, useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

interface SiteHeaderProps {
  onGetStarted: () => void;
  onLogin?: () => void;
  onNavigate?: (section: string) => void;
  scrollToSection: (sectionId: string) => void;
}

const desktopLink = 'hidden min-h-[48px] items-center rounded-full px-4 font-semibold text-neema-ink hover:bg-neema-sand lg:inline-flex';

/** Sticky site header: full links on large screens, a menu button on phones and tablets. */
export function SiteHeader({ onGetStarted, onLogin, onNavigate, scrollToSection }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (fn: () => void) => () => { setOpen(false); fn(); };
  const links = [
    { label: 'Services', action: () => scrollToSection('services-section') },
    { label: 'Why Neema', action: () => scrollToSection('about-section') },
    { label: 'Contact', action: () => onNavigate?.('contact') },
  ];

  return (
    <header className={cn('sticky top-0 z-40 bg-neema-cream/95 transition-shadow', (scrolled || open) && 'shadow-[0_1px_0_#E8E2D9,0_4px_12px_rgba(43,45,66,0.06)]')}>
      <nav aria-label="Main" className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-2 md:px-10">
        <a href="#top" onClick={(e) => { e.preventDefault(); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-none">
          <img src={logo} alt="Neema — Care for Every Stage, home" className="h-14 w-auto md:h-16" />
        </a>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <button key={l.label} type="button" className={desktopLink} onClick={l.action}>{l.label}</button>
          ))}
          {onLogin && (
            <button type="button" onClick={onLogin} className="hidden min-h-[48px] items-center rounded-full px-4 font-semibold text-neema-dark hover:bg-neema-sand sm:inline-flex">
              Log in
            </button>
          )}
          <button type="button" onClick={onGetStarted} className="ml-1 min-h-[48px] whitespace-nowrap rounded-xl bg-neema-dark px-4 font-semibold text-white shadow-md active:scale-[0.98] sm:px-5">
            Get started
          </button>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(!open)}
            className="flex h-12 w-12 flex-none items-center justify-center rounded-xl text-neema-ink hover:bg-neema-sand lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="site-menu" className="border-t border-neema-line bg-neema-cream px-4 pb-4 pt-2 lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col">
            {links.map((l) => (
              <li key={l.label}>
                <button type="button" onClick={go(l.action)} className="flex min-h-[52px] w-full items-center border-b border-neema-line text-left text-lg font-semibold">
                  {l.label}
                </button>
              </li>
            ))}
            {onLogin && (
              <li>
                <button type="button" onClick={go(onLogin)} className="flex min-h-[52px] w-full items-center gap-2 border-b border-neema-line text-left text-lg font-semibold text-neema-dark">
                  <LogIn className="h-5 w-5" /> Log in
                </button>
              </li>
            )}
            <li className="pt-3">
              <button type="button" onClick={go(onGetStarted)} className="min-h-[56px] w-full rounded-xl bg-neema-dark text-lg font-semibold text-white">
                Get started free
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
