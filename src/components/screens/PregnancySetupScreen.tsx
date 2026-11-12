import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, ArrowLeft, ArrowRight, Baby, CalendarDays, Stethoscope } from 'lucide-react';
import { format, addDays, differenceInWeeks } from 'date-fns';
import { PregnancyData } from '@/types/pregnancy';

interface PregnancySetupScreenProps {
  onComplete: (data: PregnancyData) => void;
  onBack: () => void;
}

export function PregnancySetupScreen({ onComplete, onBack }: PregnancySetupScreenProps) {
  const [step, setStep] = useState(1);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [gestationalWeeks, setGestationalWeeks] = useState('');
  const [doctorDueDate, setDoctorDueDate] = useState('');
  const [babyName, setBabyName] = useState('');

  const calculateDueDate = (): Date => {
    if (lastPeriodDate) {
      return addDays(new Date(lastPeriodDate), 280); // 40 weeks
    }
    if (gestationalWeeks) {
      const weeksRemaining = 40 - parseInt(gestationalWeeks);
      return addDays(new Date(), weeksRemaining * 7);
    }
    return addDays(new Date(), 280);
  };

  const calculateCurrentWeek = (): number => {
    if (gestationalWeeks) {
      return parseInt(gestationalWeeks);
    }
    if (lastPeriodDate) {
      return Math.max(1, differenceInWeeks(new Date(), new Date(lastPeriodDate)));
    }
    return 1;
  };

  const getTrimester = (week: number): 1 | 2 | 3 => {
    if (week <= 13) return 1;
    if (week <= 26) return 2;
    return 3;
  };

  const handleComplete = () => {
    const currentWeek = calculateCurrentWeek();
    const dueDate = doctorDueDate ? new Date(doctorDueDate) : calculateDueDate();
    
    const pregnancyData: PregnancyData = {
      id: Date.now().toString(),
      userId: 'user-1',
      startDate: lastPeriodDate ? new Date(lastPeriodDate) : new Date(),
      dueDate,
      doctorDueDate: doctorDueDate ? new Date(doctorDueDate) : undefined,
      currentWeek,
      trimester: getTrimester(currentWeek),
      babyName: babyName || undefined,
    };

    onComplete(pregnancyData);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6 pt-safe-top pb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex-1">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full neema-gradient-secondary flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              When did your last period start?
            </h2>
            <p className="text-muted-foreground">
              This helps us calculate your due date
            </p>
          </div>

          <Card variant="soft" className="mb-6">
            <CardContent className="p-4">
              <Label htmlFor="lmp-date" className="text-sm font-medium mb-2 block">
                First day of last menstrual period
              </Label>
              <Input
                id="lmp-date"
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="h-14 text-lg"
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </CardContent>
          </Card>

          <div className="text-center text-muted-foreground text-sm mb-6">
            or
          </div>

          <Card variant="soft">
            <CardContent className="p-4">
              <Label htmlFor="weeks" className="text-sm font-medium mb-2 block">
                I know my gestational age
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="weeks"
                  type="number"
                  placeholder="0"
                  min="1"
                  max="42"
                  value={gestationalWeeks}
                  onChange={(e) => setGestationalWeeks(e.target.value)}
                  className="h-14 text-lg text-center"
                />
                <span className="text-muted-foreground">weeks pregnant</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button 
          variant="neema" 
          size="lg" 
          className="w-full"
          onClick={() => setStep(2)}
          disabled={!lastPeriodDate && !gestationalWeeks}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  if (step === 2) {
    const estimatedDueDate = calculateDueDate();

    return (
      <div className="min-h-screen bg-background flex flex-col px-6 pt-safe-top pb-8">
        <button 
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-muted-foreground mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex-1">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full neema-gradient-warm flex items-center justify-center mb-4">
              <Stethoscope className="w-8 h-8 text-tertiary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Doctor's due date
            </h2>
            <p className="text-muted-foreground">
              Override if your doctor gave a different date
            </p>
          </div>

          <Card variant="gradient-warm" className="mb-6">
            <CardContent className="p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CalendarDays className="w-5 h-5" />
                <span className="text-sm font-medium opacity-80">Estimated Due Date</span>
              </div>
              <p className="text-2xl font-bold">
                {format(estimatedDueDate, 'MMMM d, yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card variant="soft">
            <CardContent className="p-4">
              <Label htmlFor="doctor-date" className="text-sm font-medium mb-2 block">
                Doctor's due date (optional)
              </Label>
              <Input
                id="doctor-date"
                type="date"
                value={doctorDueDate}
                onChange={(e) => setDoctorDueDate(e.target.value)}
                className="h-14 text-lg"
              />
            </CardContent>
          </Card>
        </div>

        <Button 
          variant="neema" 
          size="lg" 
          className="w-full"
          onClick={() => setStep(3)}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  // Step 3: Baby name (optional)
  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-safe-top pb-8">
      <button 
        onClick={() => setStep(2)}
        className="flex items-center gap-2 text-muted-foreground mb-6 mt-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex-1">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full neema-gradient-primary flex items-center justify-center mb-4 animate-bounce-gentle">
            <Baby className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Give your baby a nickname
          </h2>
          <p className="text-muted-foreground">
            We'll use this in your updates (optional)
          </p>
        </div>

        <Card variant="soft">
          <CardContent className="p-4">
            <Input
              placeholder="e.g., Little Bean, Peanut..."
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              className="h-14 text-lg text-center"
            />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't worry, you can change this anytime!
        </p>
      </div>

      <div className="space-y-3">
        <Button 
          variant="neema" 
          size="lg" 
          className="w-full"
          onClick={handleComplete}
        >
          Start My Journey
          <ArrowRight className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="lg" 
          className="w-full"
          onClick={handleComplete}
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}
