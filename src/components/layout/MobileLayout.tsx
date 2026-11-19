import { ReactNode } from 'react';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import emblem from '@/assets/neema-emblem.png';
import { BottomNav } from './BottomNav';

interface MobileLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  showNav?: boolean;
  isPartnerMode?: boolean;
  className?: string;
}

/** App frame for partners, matching the Neema app shell: header, scrolling content, bottom bar. */
export function MobileLayout({ children, activeTab, onTabChange, showNav = true, isPartnerMode = false, className }: MobileLayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-neema-sand/60 font-sans text-base leading-6 tracking-normal text-neema-ink [&_h1]:font-sans [&_h1]:tracking-normal [&_h2]:font-sans [&_h2]:tracking-normal [&_h3]:font-sans">
      <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-neema-cream md:shadow-xl">
        <header className="flex flex-none items-center justify-between gap-3 border-b border-neema-line bg-neema-cream px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <img src={emblem} alt="Neema logo" className="h-11 w-11 flex-none rounded-xl object-cover" />
            <span className="flex flex-col">
              <span className="text-lg font-bold leading-6 text-neema-dark">Neema</span>
              <span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{isPartnerMode ? 'Support person' : 'My pregnancy'}</span>
            </span>
          </div>
          <a href="tel:119" aria-label="Call 119 emergency" className="flex h-12 min-w-[72px] items-center justify-center gap-1.5 rounded-full border-[1.5px] border-neema-sos bg-neema-sos-soft px-3.5 text-sm font-bold tracking-wider text-neema-sos">
            <Phone className="h-4 w-4" />SOS
          </a>
        </header>
        <main className={cn('min-h-0 flex-1 overflow-y-auto', className)}>{children}</main>
        {showNav && <BottomNav activeTab={activeTab} onTabChange={onTabChange} isPartnerMode={isPartnerMode} />}
      </div>
    </div>
  );
}
