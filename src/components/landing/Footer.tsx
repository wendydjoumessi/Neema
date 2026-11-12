import { Phone } from 'lucide-react';
import logo from '@/assets/logo.png';

interface FooterProps {
  onNavigate?: (section: string) => void;
  scrollToSection: (sectionId: string) => void;
}

const link = 'min-h-[48px] px-2 text-neema-muted-strong hover:text-neema-ink';

export function Footer({ onNavigate, scrollToSection }: FooterProps) {
  return (
    <footer className="border-t border-neema-line bg-white py-10 md:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 md:px-10">
        <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          <img src={logo} alt="Neema — Care for Every Stage" className="h-20 w-auto" />
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-4">
            <button type="button" onClick={() => scrollToSection('services-section')} className={link}>Services</button>
            <button type="button" onClick={() => scrollToSection('about-section')} className={link}>Why Neema</button>
            <button type="button" onClick={() => onNavigate?.('contact')} className={link}>Contact</button>
            <a href="mailto:fortunelekane61@gmail.com" className={`${link} inline-flex items-center`}>Support</a>
          </nav>
        </div>
        <a href="tel:119" className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-[1.5px] border-neema-sos bg-neema-sos-soft px-5 font-semibold text-neema-sos">
          <Phone className="h-5 w-5" /> In an emergency, call 119 (SAMU)
        </a>
        <p className="text-center text-sm text-neema-muted-strong">
          © 2026 Neema. Educational information only — always consult a qualified health worker.
        </p>
      </div>
    </footer>
  );
}
