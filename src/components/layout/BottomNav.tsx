import { Home, CalendarDays, HeartHandshake, ListChecks, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPartnerMode?: boolean;
}

// Mothers use the Neema app shell (src/neema/NeemaApp.tsx); this bar serves partners.
const tabs = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'tracking', label: 'Progress', Icon: CalendarDays },
  { id: 'health', label: 'Support', Icon: HeartHandshake },
  { id: 'checklist', label: 'Tasks', Icon: ListChecks },
  { id: 'profile', label: 'Profile', Icon: User },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav aria-label="Main" className="grid flex-none grid-cols-5 border-t border-neema-line bg-white px-1 pb-2.5 pt-1.5">
      {tabs.map(({ id, label, Icon }) => {
        const on = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            aria-current={on ? 'page' : undefined}
            onClick={() => onTabChange(id)}
            className={cn('flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[13px] font-semibold leading-4', on ? 'text-neema-primary' : 'text-neema-muted')}
          >
            <Icon className="h-6 w-6" />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
