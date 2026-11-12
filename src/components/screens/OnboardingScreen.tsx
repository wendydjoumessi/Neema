import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Baby, 
  Users, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import heroImage from '@/assets/hero-pregnant.jpg';
import pregnantWoman1 from '@/assets/pregnant-woman-1.jpg';
import pregnantCouple from '@/assets/pregnant-couple.jpg';
import motherBaby from '@/assets/mother-baby.jpg';
import logo from '@/assets/logo.png';

interface OnboardingScreenProps {
  onComplete: (role: 'mother' | 'partner') => void;
}

const slides = [
  {
    image: heroImage,
    icon: Heart,
    title: 'Welcome to Neema',
    description: 'Your personal companion through the beautiful journey of pregnancy. Track, learn, and prepare with confidence.',
    color: 'primary'
  },
  {
    image: pregnantWoman1,
    icon: Baby,
    title: 'Track Your Journey',
    description: 'Follow your baby\'s weekly development with detailed insights, size comparisons, and milestones that matter.',
    color: 'secondary'
  },
  {
    image: pregnantCouple,
    icon: Users,
    title: 'Include Your Partner',
    description: 'Share this special journey together. Your partner gets their own dashboard with updates, tips, and ways to support you.',
    color: 'partner'
  },
  {
    image: motherBaby,
    icon: Sparkles,
    title: 'Prepare with Confidence',
    description: 'From health guidance to birth preparation, we\'ve got you covered every step of the way. Let\'s begin!',
    color: 'spiritual'
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      setShowRoleSelection(true);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setShowRoleSelection(true);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary text-primary-foreground';
      case 'secondary': return 'bg-secondary text-secondary-foreground';
      case 'partner': return 'bg-partner text-partner-foreground';
      case 'spiritual': return 'bg-spiritual text-spiritual-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  // Role Selection Screen
  if (showRoleSelection) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={pregnantCouple} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        {/* Content */}
        <div className="relative min-h-screen flex flex-col p-6 md:p-8 lg:p-12 pt-safe-top pb-safe-bottom">
          {/* Logo and Back Button */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setShowRoleSelection(false)}
              className="text-foreground/80 hover:text-foreground hover:bg-background/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <img src={logo} alt="Neema" className="h-12 md:h-14 w-auto" />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Title */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
              Who are you?
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose your role to personalize your experience
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card 
              className="cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-[1.02] shadow-xl overflow-hidden"
              onClick={() => onComplete('mother')}
            >
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={pregnantWoman1} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <CardContent className="p-5 text-center -mt-8 relative">
                <div className="w-16 h-16 mx-auto rounded-full neema-gradient-primary flex items-center justify-center mb-4 shadow-lg border-4 border-card">
                  <Baby className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  I'm Expecting
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track your pregnancy journey with personalized insights and support
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer border-2 border-transparent hover:border-partner transition-all duration-300 hover:scale-[1.02] shadow-xl overflow-hidden"
              onClick={() => onComplete('partner')}
            >
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={pregnantCouple} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <CardContent className="p-5 text-center -mt-8 relative">
                <div className="w-16 h-16 mx-auto rounded-full neema-gradient-partner flex items-center justify-center mb-4 shadow-lg border-4 border-card">
                  <Users className="w-8 h-8 text-partner-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={slide.image} 
          alt="" 
          className="w-full h-full object-cover transition-all duration-700"
          key={currentSlide}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header with Logo and Skip */}
        <div className="flex items-center justify-between p-6 pt-safe-top">
          <img src={logo} alt="Neema" className="h-12 md:h-14 w-auto" />
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="text-foreground/80 hover:text-foreground hover:bg-background/20"
          >
            Skip
          </Button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Content */}
        <div className="p-6 md:p-8 lg:p-12 pb-safe-bottom">
          {/* Icon */}
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${getColorClasses(slide.color)} flex items-center justify-center mb-6 shadow-lg animate-scale-in`}>
            <Icon className="w-7 h-7 md:w-8 md:h-8" />
          </div>

          {/* Text Content */}
          <div className="mb-8 animate-slide-up" key={`content-${currentSlide}`}>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 leading-tight">
              {slide.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-lg">
              {slide.description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2 mb-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-foreground/20 hover:bg-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            {currentSlide > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                className="w-14 h-14 rounded-full p-0 border-2 bg-background/50 backdrop-blur"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            
            <Button
              size="lg"
              onClick={handleNext}
              className={`flex-1 h-14 text-lg font-medium shadow-xl ${
                isLastSlide 
                  ? 'neema-gradient-primary text-primary-foreground' 
                  : 'bg-foreground text-background hover:bg-foreground/90'
              }`}
            >
              {isLastSlide ? 'Get Started' : 'Continue'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
