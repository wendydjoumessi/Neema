import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Sparkles, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-pregnant-new.jpg';
import heroImage2 from '@/assets/hero-pregnant-2.jpg';
import heroImage3 from '@/assets/hero-pregnant-3.webp';
import logo from '@/assets/logo.png';

interface HeroSectionProps {
  onGetStarted: () => void;
  onNavigate?: (section: string) => void;
  scrollToSection: (sectionId: string) => void;
}

const heroImages = [heroImage, heroImage2, heroImage3];

export function HeroSection({ onGetStarted, onNavigate, scrollToSection }: HeroSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
              <img 
                src={image} 
                alt={`Pregnant woman ${index + 1}`}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                selectedIndex === index 
                  ? 'bg-primary w-8' 
                  : 'bg-foreground/40 hover:bg-foreground/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative w-full px-6 md:px-12 lg:px-20 py-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-16 md:mb-24">
          <div className="flex items-center gap-2">
            <img src={logo} alt="NurtureLife" className="h-20 md:h-28 w-auto" />
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:inline-flex text-foreground hover:bg-foreground/5"
              onClick={() => scrollToSection('about-section')}
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:inline-flex text-foreground hover:bg-foreground/5"
              onClick={() => scrollToSection('features-section')}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:inline-flex text-foreground hover:bg-foreground/5"
              onClick={() => onNavigate?.('contact')}
            >
              Contact
            </Button>
            <Button 
              onClick={onGetStarted}
              className="nurture-gradient-primary text-primary-foreground hover:opacity-90 shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your pregnancy companion</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
            Embrace Every 
            <span className="text-primary"> Moment</span> of 
            Your Journey
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-xl font-medium">
            From the first heartbeat to the first embrace, NurtureLife guides you through every beautiful milestone of pregnancy and beyond.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="nurture-gradient-primary text-primary-foreground text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}