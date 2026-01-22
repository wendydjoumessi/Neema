import { useState } from 'react';
import { ChecklistItem } from '@/types/pregnancy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Shirt, 
  Droplets, 
  Baby, 
  Briefcase,
  Check,
  Clock,
  Timer,
  AlertCircle
} from 'lucide-react';

interface ChecklistScreenProps {
  checklist: ChecklistItem[];
  onToggleItem: (id: string) => void;
}

const categories = [
  { id: 'clothes', label: 'Clothes', icon: Shirt },
  { id: 'hygiene', label: 'Hygiene', icon: Droplets },
  { id: 'equipment', label: 'Equipment', icon: Baby },
  { id: 'hospital-bag', label: 'Hospital', icon: Briefcase },
];

export function ChecklistScreen({ checklist, onToggleItem }: ChecklistScreenProps) {
  const [activeCategory, setActiveCategory] = useState('clothes');
  const [showContractionTimer, setShowContractionTimer] = useState(false);

  const getCategoryItems = (category: string) => 
    checklist.filter(item => item.category === category);

  const getCategoryProgress = (category: string) => {
    const items = getCategoryItems(category);
    const completed = items.filter(item => item.completed).length;
    return items.length > 0 ? (completed / items.length) * 100 : 0;
  };

  const totalCompleted = checklist.filter(item => item.completed).length;
  const totalProgress = (totalCompleted / checklist.length) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'essential': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'recommended': return 'bg-warning/10 text-warning-foreground border-warning/20';
      case 'optional': return 'bg-muted text-muted-foreground border-muted';
      default: return '';
    }
  };

  return (
    <div className="pb-6 animate-fade-in">
      {/* Header */}
      <div className="nurture-gradient-hero px-6 pt-safe-top pb-6">
        <div className="pt-4 mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Baby Preparation
          </h1>
          <p className="text-muted-foreground">
            Everything you need before baby arrives
          </p>
        </div>

        {/* Overall Progress */}
        <Card variant="elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalCompleted} / {checklist.length}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                <span className="text-lg font-bold text-primary">{Math.round(totalProgress)}%</span>
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeDasharray={`${totalProgress * 1.76} 176`}
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex-col gap-2"
            onClick={() => setShowContractionTimer(true)}
          >
            <Timer className="w-6 h-6 text-primary" />
            <span className="text-sm">Contraction Timer</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex-col gap-2"
          >
            <Check className="w-6 h-6 text-success" />
            <span className="text-sm">Birth Plan</span>
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-6">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-4 mb-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.id} value={cat.id} className="flex-col gap-1 py-3">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="space-y-3">
              {/* Category Progress */}
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-muted-foreground">
                  {getCategoryItems(cat.id).filter(i => i.completed).length} of {getCategoryItems(cat.id).length} completed
                </span>
                <span className="font-medium text-primary">
                  {Math.round(getCategoryProgress(cat.id))}%
                </span>
              </div>

              {/* Items List */}
              {getCategoryItems(cat.id).map(item => (
                <Card 
                  key={item.id} 
                  variant={item.completed ? 'soft' : 'elevated'}
                  className={item.completed ? 'opacity-70' : ''}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => onToggleItem(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {item.name}
                          </p>
                          <Badge variant="outline" className={`text-xs shrink-0 ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </Badge>
                        </div>
                        {item.quantity && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Quantity: {item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Contraction Timer Modal */}
      {showContractionTimer && (
        <ContractionTimer onClose={() => setShowContractionTimer(false)} />
      )}
    </div>
  );
}

function ContractionTimer({ onClose }: { onClose: () => void }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [contractions, setContractions] = useState<{ duration: number; interval?: number }[]>([]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const startContraction = () => {
    setIsRunning(true);
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  };

  const stopContraction = () => {
    setIsRunning(false);
    setContractions(prev => [...prev, { duration: seconds }]);
    setSeconds(0);
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Contraction Timer
          </h2>
          <p className="text-muted-foreground">
            Track the duration and frequency of contractions
          </p>
        </div>

        <div className="w-48 h-48 rounded-full nurture-gradient-primary flex items-center justify-center nurture-shadow-glow mb-8">
          <span className="text-5xl font-bold text-primary-foreground">
            {formatTime(seconds)}
          </span>
        </div>

        <Button
          variant={isRunning ? 'destructive' : 'nurture'}
          size="xl"
          onClick={isRunning ? stopContraction : startContraction}
          className="w-full max-w-xs"
        >
          {isRunning ? 'Stop Contraction' : 'Start Contraction'}
        </Button>

        {contractions.length > 0 && (
          <div className="mt-8 w-full max-w-xs">
            <p className="text-sm font-medium text-foreground mb-2">Recent Contractions</p>
            <div className="space-y-2">
              {contractions.slice(-5).reverse().map((c, i) => (
                <div key={i} className="flex justify-between text-sm bg-muted rounded-lg p-3">
                  <span>#{contractions.length - i}</span>
                  <span className="font-medium">{formatTime(c.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 safe-area-bottom">
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Close Timer
        </Button>
      </div>
    </div>
  );
}
