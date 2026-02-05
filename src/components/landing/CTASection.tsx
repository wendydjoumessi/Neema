import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import pregnantCouple from '@/assets/pregnant-couple.jpg';

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0">
        <img 
          src={pregnantCouple} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/85" />
      </div>
      
      <div className="relative w-full px-6 md:px-12 lg:px-20 text-center">
        <h2 
          className={`font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-background mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Ready to Start Your Journey?
        </h2>
        <p 
          className={`text-background/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
        >
          Join our community of expecting parents and experience the joy of a 
          well-supported pregnancy journey.
        </p>
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: isVisible ? '300ms' : '0ms' }}
        >
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6 shadow-xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-background/50 text-background hover:bg-background/10 text-lg px-8 py-6"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}