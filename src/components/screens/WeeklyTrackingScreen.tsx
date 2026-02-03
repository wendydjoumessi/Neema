import { useState } from 'react';
import { PregnancyData } from '@/types/pregnancy';
import { weeklyData } from '@/data/pregnancyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Baby, 
  Heart, 
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { format, addWeeks, subWeeks } from 'date-fns';
import babyIcon from '@/assets/baby-icon.png';
import logo from '@/assets/logo.png';

interface WeeklyTrackingScreenProps {
  pregnancy: PregnancyData;
}

export function WeeklyTrackingScreen({ pregnancy }: WeeklyTrackingScreenProps) {
  const [selectedWeek, setSelectedWeek] = useState(pregnancy.currentWeek);
  
  const weekData = weeklyData.find(w => w.week === selectedWeek) || 
    weeklyData.reduce((prev, curr) => 
      Math.abs(curr.week - selectedWeek) < Math.abs(prev.week - selectedWeek) ? curr : prev
    );

  const canGoBack = selectedWeek > 1;
  const canGoForward = selectedWeek < 40;

  const getTrimesterColor = (trimester: number) => {
    switch (trimester) {
      case 1: return 'bg-secondary/20 text-secondary-foreground';
      case 2: return 'bg-tertiary/30 text-tertiary-foreground';
      case 3: return 'bg-accent/20 text-accent-foreground';
      default: return '';
    }
  };

  return (
    <div className="pb-6 animate-fade-in">
      {/* Header */}
      <div className="nurture-gradient-hero px-6 pt-safe-top pb-6">
        <div className="pt-4 mb-6">
          <img src={logo} alt="NurtureLife" className="h-12 md:h-14 w-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            Weekly Tracking
          </h1>
          <p className="text-muted-foreground">
            Explore each week of your pregnancy
          </p>
        </div>

        {/* Week Selector */}
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={() => canGoBack && setSelectedWeek(w => w - 1)}
                disabled={!canGoBack}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="text-center flex-1">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getTrimesterColor(weekData.trimester)}`}>
                  Trimester {weekData.trimester}
                </div>
                <p className="text-3xl font-bold text-foreground">Week {selectedWeek}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedWeek === pregnancy.currentWeek ? "Current week" : 
                    selectedWeek < pregnancy.currentWeek ? "Past week" : "Coming up"}
                </p>
              </div>

              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={() => canGoForward && setSelectedWeek(w => w + 1)}
                disabled={!canGoForward}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Week dots */}
            <div className="flex justify-center gap-1 mt-4 overflow-x-auto hide-scrollbar py-2">
              {Array.from({ length: 40 }, (_, i) => i + 1).map(week => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`w-2 h-2 rounded-full transition-all shrink-0 ${
                    week === selectedWeek 
                      ? 'w-6 bg-primary' 
                      : week <= pregnancy.currentWeek 
                        ? 'bg-primary/40' 
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <div className="px-6 mt-6">
        <Tabs defaultValue="baby" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="baby" className="text-sm">
              <Baby className="w-4 h-4 mr-2" />
              Baby
            </TabsTrigger>
            <TabsTrigger value="mother" className="text-sm">
              <Heart className="w-4 h-4 mr-2" />
              Your Body
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-sm">
              <Lightbulb className="w-4 h-4 mr-2" />
              Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="baby" className="space-y-4">
            {/* Baby Size */}
            <Card variant="gradient-warm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-background/20 rounded-2xl flex items-center justify-center">
                    <img 
                      src={babyIcon} 
                      alt="Baby" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm opacity-80 mb-1">Baby is about</p>
                    <p className="text-2xl font-bold">{weekData.babySize}</p>
                    <p className="text-sm opacity-80">
                      Size of a {weekData.babySizeComparison}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Development Points */}
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Baby className="w-5 h-5 text-primary" />
                  Baby Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weekData.babyDevelopment.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mother" className="space-y-4">
            <Card variant="gradient-secondary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  🤰 Your Body This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weekData.motherChanges.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Heart className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <span className="text-secondary-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Emotional Check-in */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">How are you feeling?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  It's normal to experience a range of emotions during pregnancy. Take a moment to check in with yourself.
                </p>
                <div className="flex justify-center gap-4">
                  {['😊', '😌', '😔', '😰', '🥰'].map((emoji, i) => (
                    <button 
                      key={i}
                      className="w-12 h-12 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center text-2xl transition-transform hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card variant="spiritual">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Week {selectedWeek} Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {weekData.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background/50">
                      <span className="text-lg">💡</span>
                      <span className="text-spiritual-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Appointment Reminder */}
            <Card variant="elevated">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Schedule Appointments</p>
                  <p className="text-sm text-muted-foreground">
                    Don't forget your prenatal checkups
                  </p>
                </div>
                <Button variant="soft" size="sm">
                  Add
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
