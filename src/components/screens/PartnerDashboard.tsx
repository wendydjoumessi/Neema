import { PregnancyData } from '@/types/pregnancy';
import { weeklyData } from '@/data/pregnancyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import coupleIllustration from '@/assets/couple-illustration.png';

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
      {/* Header with Partner Theme */}
      <div className="relative overflow-hidden">
        <div className="nurture-gradient-partner px-6 pt-safe-top pb-20">
          <div className="flex items-center justify-between mb-4 pt-4">
            <div>
              <p className="text-partner-foreground/80 text-sm">Partner Mode 💙</p>
              <h1 className="font-display text-2xl font-bold text-partner-foreground">
                Welcome, Partner!
              </h1>
            </div>
            <Button variant="ghost" size="icon-sm" className="text-partner-foreground">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Floating Card */}
        <div className="px-6 -mt-12">
          <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <div className="flex-1 p-5">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-partner/10 text-partner mb-3">
                    Week {pregnancy.currentWeek}
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">{daysUntilDue}</p>
                  <p className="text-sm text-muted-foreground">days until baby arrives</p>
                  <div className="mt-4">
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                </div>
                <div className="w-28 bg-partner/5 flex items-end justify-center">
                  <img 
                    src={coupleIllustration} 
                    alt="Couple" 
                    className="w-24 h-auto object-contain"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Support Tip */}
      <div className="px-6 mt-6">
        <Card variant="partner">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-partner-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium text-partner-foreground/80 mb-1">
                  Today's Support Tip
                </p>
                <p className="font-medium text-partner-foreground">
                  {todaysTip}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Ways to Help</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: MessageCircle, label: 'Send Love', color: 'bg-destructive/10 text-destructive' },
            { icon: Gift, label: 'Surprise Her', color: 'bg-tertiary/30 text-tertiary-foreground' },
            { icon: Calendar, label: 'Plan Date', color: 'bg-partner/10 text-partner' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <button key={i} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center transition-transform hover:scale-105`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Baby Update for Partner */}
      <div className="px-6 mt-6">
        <Card variant="gradient-warm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Baby className="w-5 h-5" />
              <span className="font-medium">Baby This Week</span>
            </div>
            <p className="text-2xl font-bold mb-2">
              {currentWeekData.babySizeComparison}
            </p>
            <p className="text-sm opacity-80">
              About {currentWeekData.babySize} in size
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partner Tasks */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground">Your Tasks</h2>
          <span className="text-sm text-muted-foreground">
            {completedTasks}/{partnerTasks.length} done
          </span>
        </div>
        
        <div className="space-y-3">
          {partnerTasks.map(task => (
            <Card key={task.id} variant={task.completed ? 'soft' : 'elevated'}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  task.completed ? 'bg-success text-success-foreground' : 'bg-muted'
                }`}>
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
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
      <div className="px-6 mt-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">
          What She's Experiencing
        </h2>
        <Card variant="soft">
          <CardContent className="p-5">
            <ul className="space-y-3">
              {currentWeekData.motherChanges.map((change, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Heart className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span className="text-foreground">{change}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Reminders */}
      <div className="px-6 mt-6">
        <Card variant="elevated">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-partner/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-partner" />
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
    </div>
  );
}
