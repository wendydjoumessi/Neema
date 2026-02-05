import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Baby, 
  Calendar, 
  Shield, 
  Users, 
  Sparkles 
} from 'lucide-react';
import pregnancyTracking from '@/assets/pregnancy-tracking.avif';
import healthNutrition from '@/assets/health-nutrition.webp';
import partnerMode from '@/assets/partner-mode.webp';
import birthPrep from '@/assets/birth-prep.webp';
import spiritualSupport from '@/assets/spiritual-support.jpg';
import familyPlanningImg from '@/assets/family-planning-new.webp';

const features = [
  {
    icon: Calendar,
    title: 'Pregnancy Tracking',
    description: 'Automatic week calculation, weekly updates, delivery countdown, and doctor-verified due dates.',
    image: pregnancyTracking
  },
  {
    icon: Heart,
    title: 'Health & Nutrition Guidance',
    description: 'Trimester-based nutrition, safe exercises, mental wellbeing support, and medication safety alerts.',
    image: healthNutrition
  },
  {
    icon: Users,
    title: 'Partner Mode',
    description: 'Shared pregnancy dashboard, reminders, and guidance to keep partners involved in the journey.',
    image: partnerMode
  },
  {
    icon: Baby,
    title: 'Baby & Birth Preparation',
    description: 'Hospital bag checklists, contraction timer, shopping assistant, and budget-friendly recommendations.',
    image: birthPrep
  },
  {
    icon: Sparkles,
    title: 'Spiritual & Emotional Support',
    description: 'Daily prayers, encouraging verses, and uplifting messages to nurture your mind and spirit.',
    image: spiritualSupport
  },
  {
    icon: Shield,
    title: 'Family Planning',
    description: 'Fertility tracking, ovulation prediction, contraceptive education, and pregnancy planning tools.',
    image: familyPlanningImg
  },
];

export function FeaturesSection() {
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
    <section id="features-section" className="py-20 md:py-28" ref={sectionRef}>
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-2 bg-secondary/10 rounded-full text-secondary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Everything You Need for a
            <br className="hidden md:block" />
            <span className="text-primary"> Healthy Pregnancy</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive tools and guidance designed by healthcare professionals 
            to support you through every stage of your pregnancy journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover-scale ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{ 
                  transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                  transitionProperty: 'opacity, transform, box-shadow'
                }}
              >
                <div className="relative h-48 md:h-52 lg:h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <div className="flex items-center gap-3 text-primary-foreground">
                      <div className="w-10 h-10 rounded-lg bg-primary/90 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-xl font-semibold">{feature.title}</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}