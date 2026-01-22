import { PregnancyData } from '@/types/pregnancy';
import { weeklyData } from '@/data/pregnancyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Baby, 
  Heart, 
  Apple, 
  Dumbbell, 
  AlertCircle, 
  Sparkles,
  ChevronRight,
  Calendar,
  Bell
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import babyIcon from '@/assets/baby-icon.png';

interface DashboardScreenProps {
  pregnancy: PregnancyData;
  onNavigate: (screen: string) => void;
}

const quickActions = [
  { id: 'nutrition', icon: Apple, label: 'Nutrition', color: 'bg-secondary/20 text-secondary-foreground' },
  { id: 'exercise', icon: Dumbbell, label: 'Exercise', color: 'bg-tertiary/30 text-tertiary-foreground' },
  { id: 'symptoms', icon: AlertCircle, label: 'Symptoms', color: 'bg-destructive/10 text-destructive' },
  { id: 'spiritual', icon: Sparkles, label: 'Daily Prayer', color: 'bg-spiritual/20 text-spiritual-foreground' },
];

export function DashboardScreen({ pregnancy, onNavigate }: DashboardScreenProps) {
  const currentWeekData = weeklyData.find(w => w.week <= pregnancy.currentWeek) || weeklyData[0];
  const daysUntilDue = differenceInDays(pregnancy.dueDate, new Date());
  const progressPercent = Math.min(100, (pregnancy.currentWeek / 40) * 100);

  const getTrimesterLabel = (trimester: number) => {
    switch (trimester) {
      case 1: return 'First Trimester';
      case 2: return 'Second Trimester';
      case 3: return 'Third Trimester';
      default: return '';
    }
  };

  return (
    <div className="pb-6 animate-fade-in">
      {/* Header */}
      <div className="nurture-gradient-hero px-6 pt-safe-top pb-6">
        <div className="flex items-center justify-between mb-6 pt-4">
          <div>
            <p className="text-muted-foreground text-sm">Good morning 👋</p>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {pregnancy.babyName ? `How's ${pregnancy.babyName}?` : "How are you today?"}
            </h1>
          </div>
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
          </Button>
        </div>

        {/* Week Progress Card */}
        <Card variant="elevated" className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              {/* Left side - Week info */}
              <div className="flex-1 p-5">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 trimester-${pregnancy.trimester}`}>
                  {getTrimesterLabel(pregnancy.trimester)}
                </div>
                
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-foreground">Week {pregnancy.currentWeek}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {daysUntilDue} days until due date
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-primary">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="pregnancy-progress h-2">
                    <div 
                      className="pregnancy-progress-fill h-full rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right side - Baby illustration */}
              <div className="w-28 relative bg-primary/5 flex items-center justify-center">
                <img 
                  src={babyIcon} 
                  alt="Baby development" 
                  className="w-20 h-20 object-contain animate-float"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center transition-transform hover:scale-105`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Baby Development */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground">Baby Development</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            See all <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Card variant="gradient-warm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Baby className="w-5 h-5" />
              <span className="font-medium">This week your baby is...</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{currentWeekData.babySize}</p>
                <p className="text-xs opacity-80">Size</p>
              </div>
              <div className="w-px h-10 bg-foreground/20" />
              <div>
                <p className="font-medium">About the size of a</p>
                <p className="text-lg font-bold">{currentWeekData.babySizeComparison}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {currentWeekData.babyDevelopment.slice(0, 2).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Heart className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Your Body This Week */}
      <div className="px-6 mt-6">
        <Card variant="soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-xl">🤰</span> Your Body This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentWeekData.motherChanges.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming */}
      <div className="px-6 mt-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Upcoming</h2>
        <Card variant="elevated">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Due Date</p>
              <p className="text-sm text-muted-foreground">
                {format(pregnancy.dueDate, 'MMMM d, yyyy')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <div className="px-6 mt-6">
        <Card variant="spiritual" className="overflow-hidden">
          <CardContent className="p-5 relative">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-spiritual-foreground shrink-0" />
              <div>
                <p className="font-semibold text-spiritual-foreground mb-1">Today's Tip</p>
                <p className="text-sm text-spiritual-foreground/80">
                  {currentWeekData.tips[0]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
