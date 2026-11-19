import { HeroSection, FeaturesSection, AboutSection, CTASection, Footer, SiteHeader } from '@/components/landing';

interface LandingPageProps {
  onGetStarted: () => void;
  /** Returning users: go straight to log in. */
  onLogin?: () => void;
  onNavigate?: (section: string) => void;
}

export function LandingPage({ onGetStarted, onLogin, onNavigate }: LandingPageProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-neema-cream font-sans text-base text-neema-ink">
      <SiteHeader onGetStarted={onGetStarted} onLogin={onLogin} onNavigate={onNavigate} scrollToSection={scrollToSection} />
      <HeroSection 
        onGetStarted={onGetStarted} 
        onNavigate={onNavigate}
        scrollToSection={scrollToSection}
      />
      <FeaturesSection />
      <AboutSection onGetStarted={onGetStarted} />
      <CTASection onGetStarted={onGetStarted} />
      <Footer onNavigate={onNavigate} scrollToSection={scrollToSection} />
    </div>
  );
}