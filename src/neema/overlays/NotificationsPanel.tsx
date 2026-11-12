import { X } from 'lucide-react';
import { useNeema } from '../store';
import { H2 } from '../ui';

export function NotificationsPanel() {
  const s = useNeema();
  // TODO: load the user's real reminders (tablets, visits, weekly content).
  const items = s.discreet
    ? [{ title: 'You have a new message', when: 'Notes · 9:00' }, { title: 'Reminder', when: 'Notes · yesterday' }, { title: 'You have a new message', when: 'Notes · Monday' }]
    : [{ title: 'Time for your iron and folic acid tablet', when: 'Neema · 9:00' }, { title: 'Antenatal visit coming up — bring your card', when: 'Neema · yesterday' }, { title: 'New this week: folong with groundnuts', when: 'Neema · Monday' }];
  return (
    <div className="absolute left-3 right-3 top-[72px] z-20 flex flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-[0_8px_28px_rgba(43,45,66,0.22)]">
      <div className="flex items-center justify-between">
        <H2>Notifications</H2>
        <button type="button" aria-label="Close notifications" onClick={() => s.setNotifOpen(false)} className="-m-3 flex h-12 w-12 items-center justify-center">
          <X className="h-[22px] w-[22px]" />
        </button>
      </div>
      {items.map((n, i) => (
        <div key={i} className="rounded-xl bg-neema-cream px-3 py-2.5">
          <div className="font-semibold">{n.title}</div>
          <div className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">{n.when}</div>
        </div>
      ))}
    </div>
  );
}
