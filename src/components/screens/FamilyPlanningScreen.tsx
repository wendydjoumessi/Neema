import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Heart,
  Target,
  Shield,
  Info,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Sparkles
} from 'lucide-react';
import { format, addDays, subDays, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';

export function FamilyPlanningScreen() {
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate fertility window
  const calculateFertility = () => {
    if (!lastPeriodDate) return null;
    
    const ovulationDay = addDays(lastPeriodDate, cycleLength - 14);
    const fertileStart = subDays(ovulationDay, 5);
    const fertileEnd = addDays(ovulationDay, 1);
    const nextPeriod = addDays(lastPeriodDate, cycleLength);

    return {
      ovulationDay,
      fertileStart,
      fertileEnd,
      nextPeriod,
    };
  };

  const fertility = calculateFertility();

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getDayType = (day: Date): 'normal' | 'period' | 'fertile' | 'ovulation' => {
    if (!lastPeriodDate || !fertility) return 'normal';
    
    // Period days (first 5 days of cycle)
    const periodEnd = addDays(lastPeriodDate, 4);
    if (day >= lastPeriodDate && day <= periodEnd) return 'period';
    
    // Ovulation day
    if (isSameDay(day, fertility.ovulationDay)) return 'ovulation';
    
    // Fertile window
    if (day >= fertility.fertileStart && day <= fertility.fertileEnd) return 'fertile';
    
    return 'normal';
  };

  const getDayClass = (type: string) => {
    switch (type) {
      case 'period': return 'bg-destructive/20 text-destructive';
      case 'fertile': return 'bg-secondary/30 text-secondary-foreground';
      case 'ovulation': return 'bg-primary text-primary-foreground';
      default: return 'hover:bg-muted';
    }
  };

  return (
    <div className="pb-6 animate-fade-in">
      {/* Header */}
      <div className="nurture-gradient-hero px-6 pt-safe-top pb-6">
        <div className="pt-4">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Family Planning
          </h1>
          <p className="text-muted-foreground">
            Fertility tracking and education
          </p>
        </div>
      </div>

      <div className="px-6 mt-6">
        <Tabs defaultValue="tracking">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tracking">
              <Target className="w-4 h-4 mr-2" />
              Track
            </TabsTrigger>
            <TabsTrigger value="planning">
              <Heart className="w-4 h-4 mr-2" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="education">
              <Info className="w-4 h-4 mr-2" />
              Learn
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-4">
            {/* Cycle Setup */}
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg">Your Cycle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">First day of last period</Label>
                  <Input
                    type="date"
                    className="h-12"
                    max={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => setLastPeriodDate(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Average cycle length: {cycleLength} days</Label>
                  <input
                    type="range"
                    min="21"
                    max="35"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>21 days</span>
                    <span>35 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => setCurrentMonth(d => subDays(d, 30))}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <CardTitle className="text-lg">
                    {format(currentMonth, 'MMMM yyyy')}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => setCurrentMonth(d => addDays(d, 30))}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for start of month */}
                  {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  
                  {getDaysInMonth().map((day, i) => {
                    const dayType = getDayType(day);
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all ${getDayClass(dayType)} ${
                          isToday(day) ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        {format(day, 'd')}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-destructive/20" />
                    <span className="text-muted-foreground">Period</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-secondary/30" />
                    <span className="text-muted-foreground">Fertile</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Ovulation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predictions */}
            {fertility && (
              <div className="grid grid-cols-2 gap-3">
                <Card variant="gradient-secondary">
                  <CardContent className="p-4 text-center">
                    <Sparkles className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-xs opacity-80">Ovulation</p>
                    <p className="font-bold">{format(fertility.ovulationDay, 'MMM d')}</p>
                  </CardContent>
                </Card>
                <Card variant="soft">
                  <CardContent className="p-4 text-center">
                    <Droplets className="w-6 h-6 mx-auto mb-2 text-destructive" />
                    <p className="text-xs text-muted-foreground">Next Period</p>
                    <p className="font-bold text-foreground">{format(fertility.nextPeriod, 'MMM d')}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="planning" className="space-y-4">
            <Card variant="gradient-warm">
              <CardContent className="p-5 text-center">
                <Heart className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">
                  Ready to Conceive?
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  Your fertile window is the best time to try for a baby
                </p>
                {fertility && (
                  <div className="bg-background/30 rounded-xl p-4">
                    <p className="text-sm opacity-80">Best days to try:</p>
                    <p className="text-lg font-bold">
                      {format(fertility.fertileStart, 'MMM d')} - {format(fertility.fertileEnd, 'MMM d')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preconception Tips */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Preconception Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Start taking prenatal vitamins with folic acid',
                    'Maintain a healthy weight',
                    'Quit smoking and limit alcohol',
                    'Track your ovulation',
                    'Manage stress levels',
                    'Schedule a preconception checkup',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-primary">✓</span>
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-partner" />
                  Contraception Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you're not ready for pregnancy, consult your healthcare provider about these options:
                </p>
                <div className="space-y-3">
                  {[
                    { name: 'Hormonal Birth Control', desc: 'Pills, patches, rings, injections' },
                    { name: 'IUD', desc: 'Long-term, reversible protection' },
                    { name: 'Barrier Methods', desc: 'Condoms, diaphragms' },
                    { name: 'Natural Family Planning', desc: 'Fertility awareness methods' },
                  ].map((method, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted">
                      <p className="font-medium text-foreground">{method.name}</p>
                      <p className="text-xs text-muted-foreground">{method.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Understanding Your Cycle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="font-medium text-destructive mb-1">Menstrual Phase (Days 1-5)</p>
                    <p className="text-sm text-muted-foreground">The uterine lining sheds</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted">
                    <p className="font-medium text-foreground mb-1">Follicular Phase (Days 1-13)</p>
                    <p className="text-sm text-muted-foreground">Eggs develop in the ovaries</p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="font-medium text-primary mb-1">Ovulation (Day 14)</p>
                    <p className="text-sm text-muted-foreground">Egg is released - peak fertility</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/20 border border-secondary/30">
                    <p className="font-medium text-secondary-foreground mb-1">Luteal Phase (Days 15-28)</p>
                    <p className="text-sm text-muted-foreground">Body prepares for possible pregnancy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
