import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Baby, Users, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.jpg';

interface OnboardingScreenProps {
  onComplete: (role: 'mother' | 'partner') => void;
}

const features = [
  {
    icon: Baby,
    title: "Track Your Journey",
    description: "Week-by-week pregnancy tracking with baby development updates"
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Personalized nutrition, exercise, and symptom guidance"
  },
  {
    icon: Users,
    title: "Partner Support",
    description: "Keep your partner involved with their own dashboard"
  },
  {
    icon: Sparkles,
    title: "Spiritual Care",
    description: "Daily prayers and emotional support for your journey"
  }
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);

  if (step === 0) {
    return (
      <div className="min-h-screen nurture-gradient-hero flex flex-col">
        {/* Hero Section */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-safe-top">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4 animate-heart-beat" />
              <span className="text-sm font-medium">Your pregnancy companion</span>
            </div>
            
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">
              Nurture<span className="text-gradient-primary">Life</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xs mx-auto">
              Supporting you from planning to delivery with love and care
            </p>
          </div>

          {/* Hero Illustration */}
          <div className="relative w-full max-w-sm mb-8 animate-slide-up">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden nurture-shadow-elevated">
              <img 
                src={heroIllustration} 
                alt="Pregnant woman in peaceful garden" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card rounded-2xl px-6 py-3 nurture-shadow-soft">
              <p className="text-sm font-medium text-foreground">
                Join 100,000+ families 💕
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 pb-8 safe-area-bottom">
          <Button 
            variant="nurture" 
            size="xl" 
            className="w-full"
            onClick={() => setStep(1)}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Free to use • No credit card required
          </p>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6 pt-safe-top pb-8">
        {/* Progress */}
        <div className="flex gap-2 mb-8 mt-4">
          <div className="flex-1 h-1 rounded-full bg-primary" />
          <div className="flex-1 h-1 rounded-full bg-muted" />
        </div>

        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            What NurtureLife offers
          </h2>
          <p className="text-muted-foreground mb-8">
            Everything you need for a healthy pregnancy journey
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  variant="elevated" 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl nurture-gradient-warm flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Button 
          variant="nurture" 
          size="lg" 
          className="w-full mt-6"
          onClick={() => setStep(2)}
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  // Step 2: Choose Role
  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-safe-top pb-8">
      {/* Progress */}
      <div className="flex gap-2 mb-8 mt-4">
        <div className="flex-1 h-1 rounded-full bg-primary" />
        <div className="flex-1 h-1 rounded-full bg-primary" />
      </div>

      <div className="flex-1">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Who are you?
        </h2>
        <p className="text-muted-foreground mb-8">
          Choose your role to personalize your experience
        </p>

        <div className="space-y-4">
          <Card 
            variant="elevated" 
            className="cursor-pointer hover:border-primary border-2 border-transparent"
            onClick={() => onComplete('mother')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full nurture-gradient-primary flex items-center justify-center mb-4">
                <Baby className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                I'm Expecting
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your pregnancy journey with personalized insights and support
              </p>
            </CardContent>
          </Card>

          <Card 
            variant="elevated" 
            className="cursor-pointer hover:border-partner border-2 border-transparent"
            onClick={() => onComplete('partner')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full nurture-gradient-partner flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-partner-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                I'm a Partner
              </h3>
              <p className="text-sm text-muted-foreground">
                Support your partner and stay connected throughout the journey
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
