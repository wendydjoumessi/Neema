import logo from '@/assets/logo.png';

interface FooterProps {
  onNavigate?: (section: string) => void;
  scrollToSection: (sectionId: string) => void;
}

export function Footer({ onNavigate, scrollToSection }: FooterProps) {
  return (
    <footer className="py-12 md:py-16 bg-card border-t border-border">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <img src={logo} alt="NurtureLife" className="h-20 md:h-24 w-auto" />
          </div>
          <div className="flex items-center gap-8 text-muted-foreground">
            <button onClick={() => scrollToSection('about-section')} className="hover:text-foreground transition-colors">About</button>
            <button onClick={() => scrollToSection('features-section')} className="hover:text-foreground transition-colors">Features</button>
            <button onClick={() => onNavigate?.('contact')} className="hover:text-foreground transition-colors">Contact</button>
            <a href="mailto:fortunelekane61@gmail.com" className="hover:text-foreground transition-colors">Support</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 NurtureLife. Made with ❤️ for families.
          </p>
        </div>
      </div>
    </footer>
  );
}