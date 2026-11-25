import { X } from 'lucide-react';
import { useNeema } from '../store';
import { H2 } from '../ui';

export function NotificationsPanel() {
  const s = useNeema();
  // TODO: load the user's real reminders (tablets, visits, weekly content).
  const items = s.discreet
    ? [{ title: 'You have a new message', when: 'Notes · 9:00' }, { title: 'Reminder', when: 'Notes · yesterday' }, { title: 'You have a new message', when: 'Notes · Monday' }]
    : s.journey === 'pp'
      ? [{ title: 'Time for a feed and a cup of water', when: 'Neema · 9:00' }, { title: 'Postnatal check coming up — bring baby’s card', when: 'Neema · yesterday' }, { title: 'New: methods that are safe while breastfeeding', when: 'Neema · Monday' }]
      : s.journey === 'ttc'
        ? [{ title: 'Time for your folic acid tablet', when: 'Neema · 9:00' }, { title: s.lastPeriod ? 'Your fertile window estimate is updated' : 'Add your last period to see your fertile days', when: 'Neema · yesterday' }, { title: 'New: eating to conceive with local foods', when: 'Neema · Monday' }]
        : s.journey === 'avoid'
          ? [{ title: s.method.id ? 'Reminder for your method' : 'Choose a method that fits your life', when: 'Neema · 9:00' }, { title: 'Did you know? Only condoms protect against HIV', when: 'Neema · Monday' }]
          : [{ title: 'Time for your iron and folic acid tablet', when: 'Neema · 9:00' }, { title: 'Antenatal visit coming up — bring your card', when: 'Neema · yesterday' }, { title: 'New this week: folong with groundnuts', when: 'Neema · Monday' }];
  return (
    <div className="neema-rise absolute left-3 right-3 top-[68px] z-20 flex flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-[0_8px_28px_rgba(43,45,66,0.22)]">
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
