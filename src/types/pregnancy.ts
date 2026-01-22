export interface User {
  id: string;
  name: string;
  email: string;
  role: 'mother' | 'partner';
  partnerId?: string;
  avatarUrl?: string;
}

export interface PregnancyData {
  id: string;
  userId: string;
  startDate: Date;
  dueDate: Date;
  doctorDueDate?: Date;
  currentWeek: number;
  trimester: 1 | 2 | 3;
  babyName?: string;
}

export interface WeeklyInfo {
  week: number;
  babySize: string;
  babySizeComparison: string;
  babyDevelopment: string[];
  motherChanges: string[];
  tips: string[];
  trimester: 1 | 2 | 3;
}

export interface SymptomLog {
  id: string;
  userId: string;
  date: Date;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
  isDanger?: boolean;
}

export interface NutritionGuide {
  trimester: 1 | 2 | 3;
  recommended: FoodItem[];
  avoid: FoodItem[];
  dailyCalories: number;
  keyNutrients: string[];
}

export interface FoodItem {
  name: string;
  category: string;
  benefits?: string;
  reason?: string;
}

export interface ExerciseGuide {
  trimester: 1 | 2 | 3;
  recommended: Exercise[];
  avoid: string[];
}

export interface Exercise {
  name: string;
  duration: string;
  frequency: string;
  benefits: string;
  safetyTips: string[];
}

export interface Medication {
  name: string;
  category: 'safe' | 'caution' | 'unsafe';
  notes: string;
}

export interface ChecklistItem {
  id: string;
  category: 'clothes' | 'hygiene' | 'equipment' | 'hospital-bag';
  name: string;
  completed: boolean;
  quantity?: number;
  priority: 'essential' | 'recommended' | 'optional';
}

export interface Contraction {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  intensity: 'light' | 'moderate' | 'strong';
}

export interface DailyPrayer {
  id: string;
  date: Date;
  title: string;
  content: string;
  verse?: string;
  affirmation: string;
}

export interface FertilityData {
  cycleLength: number;
  lastPeriodDate: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'alert' | 'tip' | 'milestone';
  title: string;
  message: string;
  date: Date;
  read: boolean;
}
