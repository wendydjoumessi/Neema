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
import spiritualBg from '@/assets/spiritual-bg.png';

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
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={spiritualBg} 
          alt="Spiritual background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Daily Spiritual Support
          </h1>
          <p className="text-muted-foreground">
            Peace, prayers, and encouragement
          </p>
        </div>
      </div>

      {/* Today's Prayer */}
      <div className="px-6 -mt-4">
        <Card variant="spiritual" className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Today's Prayer
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon-sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-display text-xl font-bold text-spiritual-foreground mb-4">
              {currentPrayer.title}
            </h3>
            <p className="text-spiritual-foreground/90 leading-relaxed mb-4">
              {currentPrayer.content}
            </p>
            
            {currentPrayer.verse && (
              <div className="bg-background/30 rounded-xl p-4 mb-4">
                <BookOpen className="w-4 h-4 mb-2 opacity-70" />
                <p className="text-sm italic text-spiritual-foreground/80">
                  "{currentPrayer.verse}"
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-spiritual-foreground/10">
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={() => setCurrentPrayerIndex(i => Math.max(0, i - 1))}
                disabled={currentPrayerIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-sm">
                {currentPrayerIndex + 1} of {dailyPrayers.length}
              </span>
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={() => setCurrentPrayerIndex(i => Math.min(dailyPrayers.length - 1, i + 1))}
                disabled={currentPrayerIndex === dailyPrayers.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Affirmation */}
      <div className="px-6 mt-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">
          Daily Affirmation
        </h2>
        <Card variant="gradient">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-primary-foreground mx-auto mb-4 animate-heart-beat" />
            <p className="text-lg font-medium text-primary-foreground leading-relaxed">
              "{affirmations[currentAffirmation]}"
            </p>
            <Button 
              variant="ghost" 
              className="mt-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
              onClick={() => setCurrentAffirmation(i => (i + 1) % affirmations.length)}
            >
              Next Affirmation
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stress Relief Tips */}
      <div className="px-6 mt-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">
          Stress Relief Tips
        </h2>
        <div className="space-y-3">
          {[
            { emoji: '🧘', title: 'Deep Breathing', desc: 'Take 5 slow, deep breaths to calm your mind' },
            { emoji: '🚶', title: 'Gentle Walk', desc: 'A short walk can clear your thoughts' },
            { emoji: '🎵', title: 'Soothing Music', desc: 'Listen to calming melodies for relaxation' },
            { emoji: '💭', title: 'Positive Visualization', desc: 'Imagine holding your healthy baby' },
          ].map((tip, i) => (
            <Card key={i} variant="elevated">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                  {tip.emoji}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{tip.title}</p>
                  <p className="text-sm text-muted-foreground">{tip.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Meditation Timer */}
      <div className="px-6 mt-6">
        <Card variant="soft">
          <CardContent className="p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🧘‍♀️</span>
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">
              Guided Meditation
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take a moment to relax and connect with your baby
            </p>
            <Button variant="nurture">
              Start 5-Minute Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
