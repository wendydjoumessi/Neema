import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Baby, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Shield,
  Clock,
  Star,
  ChevronRight,
  Calendar,
  Apple,
  Dumbbell
} from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.jpg';

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: Baby,
    title: "Week-by-Week Tracking",
    description: "Monitor your baby's development with detailed weekly updates and milestones",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Personalized nutrition plans, safe exercises, and symptom tracking",
    color: "bg-secondary/20 text-secondary-foreground"
  },
  {
    icon: Users,
    title: "Partner Dashboard",
    description: "Keep your partner involved with their own dedicated support view",
    color: "bg-partner/10 text-partner"
  },
  {
    icon: Sparkles,
    title: "Spiritual Support",
    description: "Daily prayers, verses, and emotional encouragement for your journey",
    color: "bg-spiritual/20 text-spiritual-foreground"
  },
  {
    icon: Calendar,
    title: "Family Planning",
    description: "Fertility tracking, ovulation prediction, and conception guidance",
    color: "bg-tertiary/30 text-tertiary-foreground"
  },
  {
    icon: Shield,
    title: "Safety Alerts",
    description: "Know the danger signs and when to seek immediate medical help",
    color: "bg-destructive/10 text-destructive"
  }
];

const benefits = [
  "Track pregnancy week by week",
  "Personalized health guidance",
  "Partner involvement tools",
  "Baby preparation checklists",
  "Contraction timer",
  "Safe medication guide"
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "First-time Mom",
    content: "NurtureLife made my pregnancy journey so much easier. The weekly updates helped me understand what was happening at every stage.",
    rating: 5
  },
  {
    name: "James & Emma",
    role: "Expecting Parents",
    content: "The partner mode is fantastic! It helped me stay connected and supportive throughout the pregnancy.",
    rating: 5
  },
  {
    name: "Dr. Patricia A.",
    role: "OB-GYN",
    content: "I recommend NurtureLife to all my patients. The medical information is accurate and the danger signs section is invaluable.",
    rating: 5
  }
];

const stats = [
  { value: "100K+", label: "Happy Families" },
  { value: "40", label: "Weeks Covered" },
  { value: "24/7", label: "Support Available" },
  { value: "4.9", label: "App Rating" }
];

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative nurture-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 pt-8 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 relative">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-12 md:mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 nurture-gradient-primary rounded-xl flex items-center justify-center">
                <Baby className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl md:text-2xl font-bold text-foreground">
                Nurture<span className="text-primary">Life</span>
              </span>
            </div>
            <Button variant="nurture" size="sm" className="hidden sm:flex" onClick={onGetStarted}>
              Get Started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Heart className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">Your pregnancy companion</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Supporting Your
                <span className="text-gradient-primary block">Beautiful Journey</span>
                to Motherhood
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                From planning to delivery, NurtureLife provides personalized guidance, 
                health tracking, and emotional support for you and your partner.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="nurture" size="xl" onClick={onGetStarted}>
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="group">
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Doctor Approved</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 nurture-gradient-primary rounded-3xl blur-3xl opacity-20 scale-95" />
                <img 
                  src={heroIllustration} 
                  alt="Pregnant woman in peaceful setting" 
                  className="relative w-full rounded-3xl nurture-shadow-elevated object-cover aspect-[4/5]"
                />
                
                {/* Floating Cards */}
                <div className="absolute -left-8 top-1/4 bg-card rounded-2xl p-4 nurture-shadow-elevated animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 nurture-gradient-secondary rounded-xl flex items-center justify-center">
                      <Baby className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Week 24</p>
                      <p className="text-xs text-muted-foreground">Baby is 12 inches</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 bg-card rounded-2xl p-4 nurture-shadow-elevated animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 nurture-gradient-warm rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Healthy</p>
                      <p className="text-xs text-muted-foreground">All vitals normal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for a
              <span className="text-gradient-primary"> Healthy Pregnancy</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and guidance designed by healthcare professionals 
              to support every stage of your pregnancy journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  variant="elevated" 
                  className="group hover:border-primary/30 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 nurture-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Thousands of Families
                <span className="text-gradient-primary block">Choose NurtureLife</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join a community of parents who trust NurtureLife to guide them 
                through one of life's most precious journeys.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button variant="nurture" size="lg" className="mt-8" onClick={onGetStarted}>
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <Card variant="elevated" className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="week-bubble text-base">20</div>
                    <div>
                      <p className="font-display text-2xl font-bold text-foreground">Week 20</p>
                      <p className="text-muted-foreground">Halfway there! 🎉</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Baby className="w-5 h-5 text-secondary-foreground" />
                        <span className="font-semibold text-foreground">Baby Development</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your baby is about 10 inches long and weighs about 10 oz!
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-primary/10 text-center">
                        <Apple className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <span className="text-xs text-muted-foreground">Nutrition</span>
                      </div>
                      <div className="p-3 rounded-xl bg-tertiary/20 text-center">
                        <Dumbbell className="w-5 h-5 mx-auto mb-1 text-tertiary-foreground" />
                        <span className="text-xs text-muted-foreground">Exercise</span>
                      </div>
                      <div className="p-3 rounded-xl bg-spiritual/20 text-center">
                        <Sparkles className="w-5 h-5 mx-auto mb-1 text-spiritual-foreground" />
                        <span className="text-xs text-muted-foreground">Wellness</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by Families
              <span className="text-gradient-primary"> Worldwide</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See what parents are saying about their NurtureLife experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="soft" className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full nurture-gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 nurture-gradient-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of families who trust NurtureLife for their pregnancy journey.
          </p>
          <Button 
            size="xl" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={onGetStarted}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-primary-foreground/60 text-sm mt-4">
            No credit card required • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 nurture-gradient-primary rounded-lg flex items-center justify-center">
                <Baby className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                NurtureLife
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 NurtureLife. Made with 💕
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
