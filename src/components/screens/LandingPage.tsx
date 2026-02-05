import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  Heart, 
  Baby, 
  Calendar, 
  Shield, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import heroImage from '@/assets/hero-pregnant-new.jpg';
import heroImage2 from '@/assets/hero-pregnant-2.jpg';
import heroImage3 from '@/assets/hero-pregnant-3.webp';
import pregnancyTracking from '@/assets/pregnancy-tracking.avif';
import healthNutrition from '@/assets/health-nutrition.webp';
import partnerMode from '@/assets/partner-mode.webp';
import birthPrep from '@/assets/birth-prep.webp';
import spiritualSupport from '@/assets/spiritual-support.jpg';
import familyPlanningImg from '@/assets/family-planning-new.webp';
import pregnantWoman1 from '@/assets/pregnant-woman-1.jpg';
import pregnantWoman2 from '@/assets/pregnant-woman-2.jpg';
import pregnantCouple from '@/assets/pregnant-couple.jpg';
import motherBaby from '@/assets/mother-baby.jpg';
import logo from '@/assets/logo.png';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate?: (section: string) => void;
}

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

const benefits = [
  'Week-by-week pregnancy updates',
  'Danger symptom & medication alerts',
  'Daily prayers & spiritual support',
  'Partner dashboard & reminders',
  'Fertility & ovulation tracking',
  'Hospital bag & shopping checklists',
];

const heroImages = [heroImage, heroImage2, heroImage3];

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section id="features-section" className="py-20 md:py-28" ref={featuresRef}>
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className={`text-center mb-16 transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
                    featuresVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ 
                    transitionDelay: featuresVisible ? `${index * 100}ms` : '0ms',
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

      {/* Benefits/About Section */}
      <section id="about-section" className="py-20 md:py-28 bg-muted/50" ref={aboutRef}>
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                Why NurtureLife
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
                A Trusted Companion for Your
                <span className="text-primary"> Pregnancy Journey</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Join thousands of families who trust NurtureLife to guide them through 
                one of life's most beautiful experiences. Our app combines medical expertise 
                with emotional support.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: aboutVisible ? `${300 + index * 80}ms` : '0ms' }}
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
                  aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: aboutVisible ? '800ms' : '0ms' }}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Image Collage */}
            <div className={`relative transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
                 style={{ transitionDelay: aboutVisible ? '200ms' : '0ms' }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div 
                    className={`photo-frame aspect-[4/5] transition-all duration-500 ${aboutVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    style={{ transitionDelay: aboutVisible ? '400ms' : '0ms' }}
                  >
                    <img 
                      src={pregnantWoman1} 
                      alt="Happy pregnant woman"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div 
                    className={`photo-frame aspect-square transition-all duration-500 ${aboutVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    style={{ transitionDelay: aboutVisible ? '600ms' : '0ms' }}
                  >
                    <img 
                      src={motherBaby} 
                      alt="Mother with baby"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div 
                    className={`photo-frame aspect-square transition-all duration-500 ${aboutVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    style={{ transitionDelay: aboutVisible ? '500ms' : '0ms' }}
                  >
                    <img 
                      src={pregnantCouple} 
                      alt="Expecting couple"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div 
                    className={`photo-frame aspect-[4/5] transition-all duration-500 ${aboutVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    style={{ transitionDelay: aboutVisible ? '700ms' : '0ms' }}
                  >
                    <img 
                      src={pregnantWoman2} 
                      alt="Pregnant woman relaxing"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating Card */}
              <Card 
                className={`absolute -bottom-6 -left-6 p-4 shadow-xl bg-card/95 backdrop-blur border-0 hidden md:block transition-all duration-500 ${
                  aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: aboutVisible ? '900ms' : '0ms' }}
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

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={pregnantCouple} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/85" />
        </div>
        
        <div className="relative w-full px-6 md:px-12 lg:px-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-background mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-background/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join our community of expecting parents and experience the joy of a 
            well-supported pregnancy journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

      {/* Footer */}
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
              © 2024 NurtureLife. Made with ❤️ for families.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
