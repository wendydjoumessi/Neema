import { PregnancyData } from '@/types/pregnancy';
import { weeklyData } from '@/data/pregnancyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Baby, 
  Heart, 
  Apple, 
  Dumbbell, 
  AlertCircle, 
  Sparkles,
  ChevronRight,
  Calendar,
  Bell,
  TrendingUp
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import pregnantWoman from '@/assets/pregnant-woman-1.jpg';
import logo from '@/assets/logo.png';

interface DashboardScreenProps {
  pregnancy: PregnancyData;
  onNavigate: (screen: string) => void;
}

const quickActions = [
  { id: 'nutrition', icon: Apple, label: 'Nutrition', color: 'bg-secondary/15 text-secondary', hoverColor: 'hover:bg-secondary/25' },
  { id: 'exercise', icon: Dumbbell, label: 'Exercise', color: 'bg-tertiary/40 text-tertiary-foreground', hoverColor: 'hover:bg-tertiary/60' },
  { id: 'symptoms', icon: AlertCircle, label: 'Symptoms', color: 'bg-destructive/10 text-destructive', hoverColor: 'hover:bg-destructive/20' },
  { id: 'spiritual', icon: Sparkles, label: 'Daily Prayer', color: 'bg-spiritual/15 text-spiritual-foreground', hoverColor: 'hover:bg-spiritual/25' },
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
      {/* Header with Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 h-72">
          <img 
            src={pregnantWoman} 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>
        
        <div className="relative px-4 md:px-8 lg:px-12 pt-safe-top pb-6">
          <div className="flex items-center justify-between mb-4 pt-4">
            <img src={logo} alt="NurtureLife" className="h-12 md:h-14 w-auto" />
            <Button variant="ghost" size="icon" className="relative w-10 h-10 rounded-full bg-card shadow-sm">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background" />
            </Button>
          </div>
          
          <div className="mb-6">
            <p className="text-muted-foreground text-sm md:text-base">Good morning 👋</p>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
              {pregnancy.babyName ? `How's ${pregnancy.babyName}?` : "How are you today?"}
            </h1>
          </div>

          {/* Week Progress Card */}
          <Card className="overflow-hidden border-0 shadow-xl bg-card/95 backdrop-blur">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Left side - Week info */}
                <div className="flex-1 p-5 md:p-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 trimester-${pregnancy.trimester}`}>
                    {getTrimesterLabel(pregnancy.trimester)}
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-serif text-4xl md:text-5xl font-semibold text-foreground">Week {pregnancy.currentWeek}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">
                    {daysUntilDue} days until your due date
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Journey Progress</span>
                      <span className="font-semibold text-primary">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="pregnancy-progress h-2.5 rounded-full">
                      <div 
                        className="pregnancy-progress-fill h-full rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right side - Visual indicator */}
                <div className="hidden md:flex w-40 nurture-gradient-warm items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-background/50 backdrop-blur flex items-center justify-center mb-2 mx-auto">
                      <Baby className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-xs text-foreground/70 font-medium">{currentWeekData.babySizeComparison}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <h2 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl transition-all duration-300 ${action.hoverColor} group`}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${action.color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-xs font-medium text-muted-foreground text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Baby Development */}
      <div className="px-4 md:px-8 lg:px-12 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg md:text-xl font-semibold text-foreground">Baby Development</h2>
          <Button variant="ghost" size="sm" className="text-primary font-medium">
            See all <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="nurture-gradient-warm">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                  <Baby className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">This week your baby is...</span>
              </div>
              <div className="flex items-center gap-6 mb-5">
                <div className="text-center">
                  <p className="font-serif text-3xl md:text-4xl font-semibold text-foreground">{currentWeekData.babySize}</p>
                  <p className="text-xs text-muted-foreground mt-1">Size</p>
                </div>
                <div className="w-px h-12 bg-foreground/10" />
                <div>
                  <p className="text-sm text-muted-foreground">About the size of a</p>
                  <p className="font-serif text-xl font-semibold text-foreground">{currentWeekData.babySizeComparison}</p>
                </div>
              </div>
              <div className="space-y-3">
                {currentWeekData.babyDevelopment.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-background/50 rounded-xl">
                    <Heart className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Your Body This Week */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <Card className="border-0 shadow-lg bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              Your Body This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentWeekData.motherChanges.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <h2 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-4">Upcoming</h2>
        <Card className="border-0 shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
          <CardContent className="p-0">
            <div className="flex items-center gap-4 p-4">
              <div className="w-14 h-14 rounded-xl nurture-gradient-primary flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(pregnancy.dueDate, 'MMMM d, yyyy')}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <Card className="border-0 overflow-hidden">
          <div className="nurture-gradient-spiritual">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-spiritual" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Today's Tip</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentWeekData.tips[0]}
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
