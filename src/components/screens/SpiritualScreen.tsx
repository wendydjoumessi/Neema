import { useState } from 'react';
import { dailyPrayers } from '@/data/pregnancyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  BookOpen, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  Bookmark
} from 'lucide-react';
import pregnantWoman2 from '@/assets/pregnant-woman-2.jpg';
import logo from '@/assets/logo.png';

export function SpiritualScreen() {
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);
  const currentPrayer = dailyPrayers[currentPrayerIndex];

  const affirmations = [
    "I am strong and capable of bringing new life into this world.",
    "My body knows exactly what to do to nurture my baby.",
    "I release fear and embrace the joy of motherhood.",
    "Every day, my baby grows healthy and strong.",
    "I am surrounded by love and support on this journey.",
    "I trust my body and my instincts as a mother.",
  ];

  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  return (
    <div className="pb-6 animate-fade-in">
      {/* Hero Section with Real Photo */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img 
          src={pregnantWoman2} 
          alt="Peaceful pregnant woman" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-spiritual/30 via-background/50 to-background" />
        <div className="absolute top-0 left-0 right-0 p-4 md:p-8 pt-safe-top">
          <img src={logo} alt="NurtureLife" className="h-12 md:h-14 w-auto" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-spiritual/20 backdrop-blur-sm rounded-full mb-3">
            <Sparkles className="w-4 h-4 text-spiritual" />
            <span className="text-sm font-medium text-spiritual-foreground">Daily Inspiration</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
            Spiritual Support
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Peace, prayers, and encouragement
          </p>
        </div>
      </div>

      {/* Today's Prayer */}
      <div className="px-4 md:px-8 lg:px-12 -mt-4">
        <Card className="relative overflow-hidden border-0 shadow-xl">
          <div className="nurture-gradient-spiritual">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-lg flex items-center gap-2 text-spiritual-foreground">
                  <Sparkles className="w-5 h-5" />
                  Today's Prayer
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="w-9 h-9 text-spiritual-foreground/70 hover:text-spiritual-foreground hover:bg-white/10">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-9 h-9 text-spiritual-foreground/70 hover:text-spiritual-foreground hover:bg-white/10">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-spiritual-foreground mb-4">
                {currentPrayer.title}
              </h3>
              <p className="text-spiritual-foreground/90 leading-relaxed mb-5">
                {currentPrayer.content}
              </p>
              
              {currentPrayer.verse && (
                <div className="bg-background/30 backdrop-blur-sm rounded-xl p-4 mb-5">
                  <BookOpen className="w-4 h-4 mb-2 text-spiritual-foreground/70" />
                  <p className="text-sm italic text-spiritual-foreground/80 leading-relaxed">
                    "{currentPrayer.verse}"
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-spiritual-foreground/10">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentPrayerIndex(i => Math.max(0, i - 1))}
                  disabled={currentPrayerIndex === 0}
                  className="text-spiritual-foreground/70 hover:text-spiritual-foreground hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-sm text-spiritual-foreground/70">
                  {currentPrayerIndex + 1} of {dailyPrayers.length}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentPrayerIndex(i => Math.min(dailyPrayers.length - 1, i + 1))}
                  disabled={currentPrayerIndex === dailyPrayers.length - 1}
                  className="text-spiritual-foreground/70 hover:text-spiritual-foreground hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Daily Affirmation */}
      <div className="px-4 md:px-8 lg:px-12 mt-8">
        <h2 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-4">
          Daily Affirmation
        </h2>
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="nurture-gradient-primary">
            <CardContent className="p-6 md:p-8 text-center">
              <Heart className="w-8 h-8 text-primary-foreground mx-auto mb-4 animate-heart-beat" />
              <p className="text-lg md:text-xl font-medium text-primary-foreground leading-relaxed mb-6">
                "{affirmations[currentAffirmation]}"
              </p>
              <Button 
                variant="ghost" 
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                onClick={() => setCurrentAffirmation(i => (i + 1) % affirmations.length)}
              >
                Next Affirmation
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Stress Relief Tips */}
      <div className="px-4 md:px-8 lg:px-12 mt-8">
        <h2 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-4">
          Stress Relief Tips
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { emoji: '🧘', title: 'Deep Breathing', desc: 'Take 5 slow, deep breaths to calm your mind' },
            { emoji: '🚶', title: 'Gentle Walk', desc: 'A short walk can clear your thoughts' },
            { emoji: '🎵', title: 'Soothing Music', desc: 'Listen to calming melodies for relaxation' },
            { emoji: '💭', title: 'Positive Visualization', desc: 'Imagine holding your healthy baby' },
          ].map((tip, i) => (
            <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                  {tip.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{tip.title}</p>
                  <p className="text-sm text-muted-foreground">{tip.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Meditation Timer */}
      <div className="px-4 md:px-8 lg:px-12 mt-8">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-muted/50">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧘‍♀️</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Guided Meditation
              </h3>
              <p className="text-muted-foreground mb-6">
                Take a moment to relax and connect with your baby
              </p>
              <Button className="nurture-gradient-primary text-primary-foreground shadow-lg px-8">
                Start 5-Minute Session
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
