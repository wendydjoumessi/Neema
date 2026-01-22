import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, PregnancyData, SymptomLog, ChecklistItem, Contraction, FertilityData } from '@/types/pregnancy';
import { defaultChecklist } from '@/data/pregnancyData';

interface AppContextType {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isPartnerMode: boolean;
  setIsPartnerMode: (value: boolean) => void;
  
  // Pregnancy data
  pregnancy: PregnancyData | null;
  setPregnancy: (data: PregnancyData | null) => void;
  
  // Symptoms
  symptomLogs: SymptomLog[];
  addSymptomLog: (log: SymptomLog) => void;
  
  // Checklist
  checklist: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  
  // Contractions
  contractions: Contraction[];
  addContraction: (contraction: Contraction) => void;
  clearContractions: () => void;
  
  // Fertility
  fertilityData: FertilityData | null;
  setFertilityData: (data: FertilityData | null) => void;
  
  // Navigation
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPartnerMode, setIsPartnerMode] = useState(false);
  const [pregnancy, setPregnancy] = useState<PregnancyData | null>(null);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [fertilityData, setFertilityData] = useState<FertilityData | null>(null);
  const [currentScreen, setCurrentScreen] = useState('onboarding');

  const addSymptomLog = (log: SymptomLog) => {
    setSymptomLogs(prev => [log, ...prev]);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addContraction = (contraction: Contraction) => {
    setContractions(prev => [contraction, ...prev]);
  };

  const clearContractions = () => {
    setContractions([]);
  };

  const value: AppContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
    isPartnerMode,
    setIsPartnerMode,
    pregnancy,
    setPregnancy,
    symptomLogs,
    addSymptomLog,
    checklist,
    toggleChecklistItem,
    contractions,
    addContraction,
    clearContractions,
    fertilityData,
    setFertilityData,
    currentScreen,
    setCurrentScreen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
