import { PregnancyData } from '@/types/pregnancy';
import { weeklyData } from '@/data/pregnancyData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Baby, 
  Calendar,
  Bell,
  Gift,
  MessageCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import pregnantCouple from '@/assets/pregnant-couple.jpg';

interface PartnerDashboardProps {
  pregnancy: PregnancyData;
  onNavigate: (screen: string) => void;
}

const partnerTasks = [
  { id: 1, title: 'Prepare the nursery', completed: false, dueWeek: 32 },
  { id: 2, title: 'Install car seat', completed: false, dueWeek: 36 },
  { id: 3, title: 'Pack hospital bag together', completed: false, dueWeek: 36 },
  { id: 4, title: 'Attend birthing class', completed: true, dueWeek: 28 },
  { id: 5, title: 'Plan parental leave', completed: false, dueWeek: 30 },
];

const supportTips = [
  "Offer a gentle back or foot massage today",
  "Prepare her favorite healthy snack",
  "Ask about her feelings and really listen",
  "Take over a household chore without being asked",
  "Plan a relaxing date night at home",
];

export function PartnerDashboard({ pregnancy, onNavigate }: PartnerDashboardProps) {
  const currentWeekData = weeklyData.find(w => w.week <= pregnancy.currentWeek) || weeklyData[0];
  const daysUntilDue = differenceInDays(pregnancy.dueDate, new Date());
  const progressPercent = Math.min(100, (pregnancy.currentWeek / 40) * 100);
  const completedTasks = partnerTasks.filter(t => t.completed).length;

  const todaysTip = supportTips[new Date().getDay() % supportTips.length];

  return (
    <div className="pb-6 animate-fade-in">
      {/* Header with Real Photo */}
      <div className="relative overflow-hidden">
        <div className="relative h-56 md:h-72">
          <img 
            src={pregnantCouple} 
            alt="Happy expecting couple" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-partner/40 via-background/60 to-background" />
          <div className="absolute top-0 left-0 right-0 p-4 md:p-8 pt-safe-top flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-partner/20 backdrop-blur-sm rounded-full mb-2">
                <Heart className="w-3 h-3 text-partner-foreground" />
                <span className="text-xs font-medium text-partner-foreground">Partner Mode</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-white drop-shadow-lg">
                Welcome, Partner!
              </h1>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Floating Progress Card */}
        <div className="px-4 md:px-8 lg:px-12 -mt-16">
          <Card className="overflow-hidden border-0 shadow-xl bg-card/95 backdrop-blur">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-partner/10 text-partner">
                  Week {pregnancy.currentWeek}
                </div>
                <div className="text-right">
                  <p className="font-serif text-3xl md:text-4xl font-semibold text-foreground">{daysUntilDue}</p>
                  <p className="text-xs text-muted-foreground">days until baby arrives</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Journey Progress</span>
                  <span className="font-semibold text-partner">{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2.5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Support Tip */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <Card className="border-0 overflow-hidden">
          <div className="nurture-gradient-partner">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-background/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-partner-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-partner-foreground/70 mb-1">
                    Today's Support Tip
                  </p>
                  <p className="font-medium text-partner-foreground leading-relaxed">
                    {todaysTip}
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <h2 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-4">Ways to Help</h2>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: MessageCircle, label: 'Send Love', color: 'bg-accent/20 text-accent-foreground', hoverColor: 'hover:bg-accent/30' },
            { icon: Gift, label: 'Surprise Her', color: 'bg-tertiary/40 text-tertiary-foreground', hoverColor: 'hover:bg-tertiary/60' },
            { icon: Calendar, label: 'Plan Date', color: 'bg-partner/15 text-partner', hoverColor: 'hover:bg-partner/25' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <button key={i} className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${action.hoverColor} group`}>
                <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Baby Update for Partner */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="nurture-gradient-warm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                  <Baby className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">Baby This Week</span>
              </div>
              <p className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-1">
                {currentWeekData.babySizeComparison}
              </p>
              <p className="text-sm text-muted-foreground">
                About {currentWeekData.babySize} in size
              </p>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Partner Tasks */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg md:text-xl font-semibold text-foreground">Your Tasks</h2>
          <span className="text-sm text-muted-foreground">
            {completedTasks}/{partnerTasks.length} done
          </span>
        </div>
        
        <div className="space-y-3">
          {partnerTasks.map(task => (
            <Card key={task.id} className={`border-0 shadow-md transition-all duration-300 hover:shadow-lg ${task.completed ? 'bg-muted/50' : ''}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  task.completed ? 'bg-success text-success-foreground' : 'bg-muted'
                }`}>
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due by week {task.dueWeek}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What She's Experiencing */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <h2 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-4">
          What She's Experiencing
        </h2>
        <Card className="border-0 shadow-lg bg-muted/30">
          <CardContent className="p-5">
            <ul className="space-y-3">
              {currentWeekData.motherChanges.map((change, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-foreground leading-relaxed">{change}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Due Date Card */}
      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <Card className="border-0 shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
          <CardContent className="p-0">
            <div className="flex items-center gap-4 p-4">
              <div className="w-14 h-14 rounded-xl nurture-gradient-partner flex items-center justify-center">
                <Calendar className="w-6 h-6 text-partner-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(pregnancy.dueDate, 'MMMM d, yyyy')}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
