import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import aboutPregnancyTracking from '@/assets/about-pregnancy-tracking.jpg';
import aboutPartnerSupport from '@/assets/about-partner-support.webp';
import aboutHealthNutrition from '@/assets/about-health-nutrition.jpg';
import aboutFamilyPlanning from '@/assets/about-family-planning.png';

interface AboutSectionProps {
  onGetStarted: () => void;
}

const benefits = [
  'Week-by-week pregnancy updates',
  'Danger symptom & medication alerts',
  'Daily prayers & spiritual support',
  'Partner dashboard & reminders',
  'Fertility & ovulation tracking',
  'Hospital bag & shopping checklists',
];

export function AboutSection({ onGetStarted }: AboutSectionProps) {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about-section" className="py-20 md:py-28 bg-muted/50" ref={sectionRef}>
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              Why NurtureLife
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
              A Trusted Companion for Your
              <span className="text-primary"> Pregnancy & Family Planning Journey</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Whether you're planning to conceive or already expecting, NurtureLife is here to guide you 
              through every step. Our app combines medical expertise with emotional and spiritual support 
              to help you feel confident and prepared.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: isVisible ? `${300 + index * 80}ms` : '0ms' }}
                >
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              onClick={onGetStarted}
              className={`nurture-gradient-primary text-primary-foreground shadow-lg transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? '800ms' : '0ms' }}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Image Collage */}
          <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
               style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div 
                  className={`photo-frame aspect-[4/5] transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}
                >
                  <img 
                    src={aboutPregnancyTracking} 
                    alt="Pregnancy tracking feature"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className={`photo-frame aspect-square transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: isVisible ? '600ms' : '0ms' }}
                >
                  <img 
                    src={aboutHealthNutrition} 
                    alt="Health and nutrition guidance"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div 
                  className={`photo-frame aspect-square transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: isVisible ? '500ms' : '0ms' }}
                >
                  <img 
                    src={aboutPartnerSupport} 
                    alt="Partner support mode"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className={`photo-frame aspect-[4/5] transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: isVisible ? '700ms' : '0ms' }}
                >
                  <img 
                    src={aboutFamilyPlanning} 
                    alt="Family planning tools"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating Card */}
            <Card 
              className={`absolute -bottom-6 -left-6 p-4 shadow-xl bg-card/95 backdrop-blur border-0 hidden md:block transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? '900ms' : '0ms' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 nurture-gradient-secondary rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Doctor Approved</p>
                  <p className="text-sm text-muted-foreground">Medically reviewed content</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}