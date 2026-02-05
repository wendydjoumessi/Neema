import { useState, useEffect, useCallback } from 'react';
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
    title: 'Week-by-Week Tracking',
    description: 'Follow your baby\'s development with detailed weekly updates and milestones.',
    image: pregnantWoman1
  },
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Personalized nutrition plans, safe exercises, and symptom monitoring.',
    image: pregnantWoman2
  },
  {
    icon: Users,
    title: 'Partner Support',
    description: 'Keep your partner involved with a dedicated dashboard and shared journey.',
    image: pregnantCouple
  },
  {
    icon: Baby,
    title: 'Birth Preparation',
    description: 'Comprehensive checklists and contraction timer for the big day.',
    image: motherBaby
  },
];

const benefits = [
  'Personalized pregnancy timeline',
  'Doctor-approved health guidance',
  'Daily affirmations & support',
  'Partner involvement tools',
  'Birth preparation checklists',
  'Medication safety database',
];

const heroImages = [heroImage, heroImage2, heroImage3];

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
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
      <section id="features-section" className="py-20 md:py-28">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
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

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-3 text-primary-foreground">
                        <div className="w-10 h-10 rounded-lg bg-primary/90 flex items-center justify-center">
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
      <section id="about-section" className="py-20 md:py-28 bg-muted/50">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
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
                  <div key={index} className="flex items-center gap-3">
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
                className="nurture-gradient-primary text-primary-foreground shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Image Collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="photo-frame aspect-[4/5]">
                    <img 
                      src={pregnantWoman1} 
                      alt="Happy pregnant woman"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="photo-frame aspect-square">
                    <img 
                      src={motherBaby} 
                      alt="Mother with baby"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="photo-frame aspect-square">
                    <img 
                      src={pregnantCouple} 
                      alt="Expecting couple"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="photo-frame aspect-[4/5]">
                    <img 
                      src={pregnantWoman2} 
                      alt="Pregnant woman relaxing"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating Card */}
              <Card className="absolute -bottom-6 -left-6 p-4 shadow-xl bg-card/95 backdrop-blur border-0 hidden md:block">
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

      {/* Testimonials Section */}
      <section className="py-20 md:py-28">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/20 rounded-full text-accent-foreground text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Loved by Families
              <span className="text-primary"> Worldwide</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Real stories from real parents who've used NurtureLife throughout their pregnancy journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-spiritual text-spiritual" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
