import { useState } from 'react';
import { PregnancyData } from '@/types/pregnancy';
import { nutritionGuides, exercises, unsafeMedications, dangerSymptoms, commonSymptoms } from '@/data/pregnancyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Apple, 
  Dumbbell, 
  Pill,
  AlertTriangle,
  Check,
  X,
  AlertCircle,
  Clock,
  ChevronRight,
  Flame,
  Plus
} from 'lucide-react';

import pregnantYogaImg from '@/assets/pregnant-yoga.jpg';
import pregnantNutritionImg from '@/assets/pregnant-nutrition.jpg';
import prenatalCheckupImg from '@/assets/prenatal-checkup.jpg';
import logo from '@/assets/logo.png';

interface HealthScreenProps {
  pregnancy: PregnancyData;
}

export function HealthScreen({ pregnancy }: HealthScreenProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  const nutritionGuide = nutritionGuides.find(n => n.trimester === pregnancy.trimester) || nutritionGuides[0];

  return (
    <div className="pb-6 animate-fade-in">
      {/* Header */}
      <div className="nurture-gradient-hero px-6 pt-safe-top pb-6">
        <div className="pt-4">
          <img src={logo} alt="NurtureLife" className="h-12 md:h-14 w-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            Health & Wellness
          </h1>
          <p className="text-muted-foreground">
            Personalized guidance for trimester {pregnancy.trimester}
          </p>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-6 mt-6">
        <Tabs defaultValue="nutrition" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="nutrition" className="text-xs px-2">
              <Apple className="w-4 h-4 mr-1" />
              Food
            </TabsTrigger>
            <TabsTrigger value="exercise" className="text-xs px-2">
              <Dumbbell className="w-4 h-4 mr-1" />
              Exercise
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="text-xs px-2">
              <AlertCircle className="w-4 h-4 mr-1" />
              Symptoms
            </TabsTrigger>
            <TabsTrigger value="medications" className="text-xs px-2">
              <Pill className="w-4 h-4 mr-1" />
              Meds
            </TabsTrigger>
          </TabsList>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-4">
            {/* Hero Image */}
            <Card variant="elevated" className="overflow-hidden">
              <AspectRatio ratio={16/9}>
                <img 
                  src={pregnantNutritionImg} 
                  alt="Healthy pregnancy nutrition" 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <CardContent className="p-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Eating for Two</h3>
                <p className="text-sm text-muted-foreground">Nourish yourself and your baby with the right foods</p>
              </CardContent>
            </Card>

            {/* Calories */}
            <Card variant="gradient-warm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80 mb-1">Daily Calorie Goal</p>
                    <p className="text-3xl font-bold">{nutritionGuide.dailyCalories}</p>
                    <p className="text-sm opacity-80">calories/day</p>
                  </div>
                  <Flame className="w-12 h-12 opacity-50" />
                </div>
              </CardContent>
            </Card>

            {/* Key Nutrients */}
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg">Key Nutrients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {nutritionGuide.keyNutrients.map((nutrient, i) => (
                    <Badge key={i} variant="secondary" className="py-1 px-3">
                      {nutrient}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Foods */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  Recommended Foods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nutritionGuide.recommended.map((food, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-success/5 border border-success/10">
                      <div>
                        <p className="font-medium text-foreground">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.benefits}</p>
                      </div>
                      <Badge variant="outline" className="text-success border-success/30">
                        {food.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Foods to Avoid */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <X className="w-5 h-5 text-destructive" />
                  Foods to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nutritionGuide.avoid.map((food, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                      <div>
                        <p className="font-medium text-foreground">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.reason}</p>
                      </div>
                      <X className="w-5 h-5 text-destructive" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercise Tab */}
          <TabsContent value="exercise" className="space-y-4">
            {/* Hero Image */}
            <Card variant="elevated" className="overflow-hidden">
              <AspectRatio ratio={16/9}>
                <img 
                  src={pregnantYogaImg} 
                  alt="Pregnant woman doing yoga" 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <CardContent className="p-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Stay Active & Healthy</h3>
                <p className="text-sm text-muted-foreground">Gentle exercises to keep you and baby strong</p>
              </CardContent>
            </Card>

            <Card variant="gradient-secondary">
              <CardContent className="p-5">
                <p className="text-sm opacity-80 mb-2">Safe Exercise Guidelines</p>
                <p className="font-medium">
                  Always consult your doctor before starting any exercise routine during pregnancy.
                </p>
              </CardContent>
            </Card>

            {exercises.map((exercise, i) => (
              <Card key={i} variant="elevated">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg text-foreground">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">{exercise.benefits}</p>
                    </div>
                    <Dumbbell className="w-5 h-5 text-tertiary" />
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {exercise.duration}
                    </div>
                    <div className="text-muted-foreground">
                      {exercise.frequency}
                    </div>
                  </div>
                  {exercise.safetyTips.length > 0 && (
                    <div className="mt-3 p-3 bg-warning/10 rounded-lg">
                      <p className="text-xs font-medium text-warning-foreground mb-1">Safety Tips:</p>
                      <ul className="text-xs text-warning-foreground/80 space-y-1">
                        {exercise.safetyTips.map((tip, j) => (
                          <li key={j}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Symptoms Tab */}
          <TabsContent value="symptoms" className="space-y-4">
            {/* Hero Image */}
            <Card variant="elevated" className="overflow-hidden">
              <AspectRatio ratio={16/9}>
                <img 
                  src={prenatalCheckupImg} 
                  alt="Prenatal checkup with doctor" 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <CardContent className="p-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Know Your Symptoms</h3>
                <p className="text-sm text-muted-foreground">Track and understand what your body is telling you</p>
              </CardContent>
            </Card>

            {/* Danger Symptoms */}
            <Card variant="elevated" className="border-destructive/30">
              <CardHeader className="bg-destructive/5 rounded-t-2xl">
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Signs - Seek Help Immediately
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {dangerSymptoms.map((symptom, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-foreground">{symptom}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="destructive" className="w-full mt-4">
                  Call Emergency
                </Button>
              </CardContent>
            </Card>

            {/* Log Symptoms */}
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Log Today's Symptoms</span>
                  <Button variant="soft" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSymptoms(prev => 
                        prev.includes(symptom) 
                          ? prev.filter(s => s !== symptom)
                          : [...prev, symptom]
                      )}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-4">
            <Card variant="soft">
              <CardContent className="p-5">
                <AlertCircle className="w-8 h-8 text-warning mb-3" />
                <p className="font-medium text-foreground mb-2">Important Notice</p>
                <p className="text-sm text-muted-foreground">
                  Always consult your healthcare provider before taking any medication during pregnancy.
                </p>
              </CardContent>
            </Card>

            {/* Safe Medications */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  Generally Safe
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unsafeMedications.filter(m => m.category === 'safe').map((med, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.notes}</p>
                    </div>
                    <Badge className="bg-success text-success-foreground">Safe</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Unsafe Medications */}
            <Card variant="elevated" className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <X className="w-5 h-5" />
                  Medications to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unsafeMedications.filter(m => m.category === 'unsafe').map((med, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.notes}</p>
                    </div>
                    <Badge variant="destructive">Unsafe</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
