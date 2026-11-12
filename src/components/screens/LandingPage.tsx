import { HeroSection, FeaturesSection, AboutSection, CTASection, Footer } from '@/components/landing';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate?: (section: string) => void;
}

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neema-cream font-sans text-base text-neema-ink">
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