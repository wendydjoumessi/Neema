import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NeemaApp } from './NeemaApp';
import { formatPhone, normalizePhone, smsLink } from './contacts';
import type { PregnancyData, User } from '@/types/pregnancy';

const user: User = { id: 'u1', name: 'Amina Nkeng', email: 'amina@example.com', role: 'mother' };
const pregnancy: PregnancyData = { id: 'p1', userId: 'u1', currentWeek: 24, trimester: 2, startDate: new Date(), dueDate: new Date(Date.now() + 112 * 86400000) };

describe('phone numbers', () => {
  it('accepts the ways Cameroonians write numbers and rejects the rest', () => {
    expect(normalizePhone('6 77 12 34 56')).toBe('+237677123456');
    expect(normalizePhone('677-12-34-56')).toBe('+237677123456');
    expect(normalizePhone('+237 677 12 34 56')).toBe('+237677123456');
    expect(normalizePhone('00237677123456')).toBe('+237677123456');
    expect(normalizePhone('222 23 45 67')).toBe('+237222234567');
    expect(normalizePhone('+33 6 12 34 56 78')).toBe('+33612345678');
    expect(normalizePhone('12345')).toBeNull();
    expect(normalizePhone('+237 77 12 34 56')).toBeNull();
    expect(normalizePhone('')).toBeNull();
    expect(formatPhone('+237677123456')).toBe('+237 6 77 12 34 56');
  });

  it('builds an SMS link with every recipient and the message', () => {
    const link = smsLink(['+237677123456', '+237699000111'], 'Help now');
    expect(link).toMatch(/^sms:\+237677123456,\+237699000111[?&]body=Help%20now$/);
  });
});

describe('emergency contacts', () => {
  beforeEach(() => {
    window.localStorage.clear();
    Element.prototype.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });
  const setup = () => render(<NeemaApp user={user} pregnancy={pregnancy} onLogout={vi.fn()} extras={[]} />);

  it('starts with no contacts, adds one, edits it and removes it', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open profile and settings' }));
    expect(screen.getByText('No emergency contacts yet')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Add a contact' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Enter a name.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Paul' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Partner' }));
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '12' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText(/Enter a valid phone number/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '6 77 12 34 56' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Partner · +237 6 77 12 34 56')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Call Paul' })).toHaveAttribute('href', 'tel:+237677123456');

    fireEvent.click(screen.getByRole('button', { name: 'Edit Paul' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Paul Nkeng' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Paul Nkeng')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Edit Paul Nkeng' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove this contact' }));
    fireEvent.click(within(screen.getByRole('alert')).getByRole('button', { name: 'Remove' }));
    expect(screen.getByText('No emergency contacts yet')).toBeInTheDocument();
  });

  it('shows her own contacts in SOS and opens the SMS app with them', () => {
    window.localStorage.setItem('neema:contacts', JSON.stringify([
      { id: 'a', name: 'Paul', relationship: 'Partner', phone: '+237677123456', sms: true },
      { id: 'b', name: 'Rose', relationship: 'Mother', phone: '+237699000111', sms: false },
    ]));
    setup();
    fireEvent.click(screen.getAllByRole('button', { name: 'SOS emergency help' })[0]);
    const dialog = screen.getByRole('dialog', { name: 'Emergency SOS' });
    const send = within(dialog).getByRole('link', { name: /SEND SMS TO 1 CONTACT/ });
    expect(send.getAttribute('href')).toMatch(/^sms:\+237677123456[?&]body=URGENT/);
    fireEvent.click(within(dialog).getByRole('button', { name: /Rose/ }));
    expect(within(dialog).getByRole('link', { name: /SEND SMS TO 2 CONTACTS/ }).getAttribute('href')).toContain('+237677123456,+237699000111');
  });

  it('asks a mother with no contacts to add some from SOS', () => {
    setup();
    fireEvent.click(screen.getAllByRole('button', { name: 'SOS emergency help' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Add emergency contacts' }));
    expect(screen.getByText('No emergency contacts yet')).toBeInTheDocument();
  });
});
