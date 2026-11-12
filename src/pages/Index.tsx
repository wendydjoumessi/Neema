import { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { LandingPage } from '@/components/screens/LandingPage';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { PregnancySetupScreen } from '@/components/screens/PregnancySetupScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { DashboardScreen } from '@/components/screens/DashboardScreen';
import { WeeklyTrackingScreen } from '@/components/screens/WeeklyTrackingScreen';
import { HealthScreen } from '@/components/screens/HealthScreen';
import { ChecklistScreen } from '@/components/screens/ChecklistScreen';
import { SpiritualScreen } from '@/components/screens/SpiritualScreen';
import { PartnerDashboard } from '@/components/screens/PartnerDashboard';
import { FamilyPlanningScreen } from '@/components/screens/FamilyPlanningScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { ContactScreen } from '@/components/screens/ContactScreen';
import { PregnancyData, User } from '@/types/pregnancy';
import { defaultChecklist } from '@/data/pregnancyData';
import { NeemaApp } from '@/neema/NeemaApp';

function AppFlow() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'onboarding' | 'auth' | 'setup' | 'main' | 'contact'>('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRole, setSelectedRole] = useState<'mother' | 'partner'>('mother');
  const [user, setUser] = useState<User | null>(null);
  const [pregnancy, setPregnancy] = useState<PregnancyData | null>(null);
  const [isPartnerMode, setIsPartnerMode] = useState(false);
  const [checklist, setChecklist] = useState(defaultChecklist);

  const handleRoleSelect = (role: 'mother' | 'partner') => {
    setSelectedRole(role);
    setCurrentScreen('auth');
  };

  const handleAuth = (authUser: User) => {
    setUser(authUser);
    if (authUser.role === 'partner') {
      setIsPartnerMode(true);
      // Create demo pregnancy data for partner
      const demoPregnancy: PregnancyData = {
        id: 'demo',
        userId: authUser.id,
        startDate: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 140 * 24 * 60 * 60 * 1000),
        currentWeek: 20,
        trimester: 2,
        babyName: 'Little One',
      };
      setPregnancy(demoPregnancy);
      setCurrentScreen('main');
    } else {
      setCurrentScreen('setup');
    }
  };

  const handlePregnancySetup = (data: PregnancyData) => {
    setPregnancy(data);
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    setUser(null);
    setPregnancy(null);
    setIsPartnerMode(false);
    setCurrentScreen('landing');
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Handle quick actions navigation from dashboard
  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'nutrition':
      case 'exercise':
      case 'symptoms':
        setActiveTab('health');
        break;
      case 'spiritual':
        setActiveTab('spiritual');
        break;
      case 'tracking':
        setActiveTab('tracking');
        break;
      default:
        setActiveTab(screen);
    }
  };

  // Handle navigation from landing page
  const handleLandingNavigate = (section: string) => {
    if (section === 'contact') {
      setCurrentScreen('contact');
    }
  };

  // Render appropriate screen
  if (currentScreen === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setCurrentScreen('onboarding')} 
        onNavigate={handleLandingNavigate}
      />
    );
  }

  if (currentScreen === 'contact') {
    return <ContactScreen onBack={() => setCurrentScreen('landing')} />;
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={handleRoleSelect} />;
  }

  if (currentScreen === 'auth') {
    return (
      <AuthScreen 
        onAuth={handleAuth} 
        onBack={() => setCurrentScreen('onboarding')}
        defaultRole={selectedRole}
      />
    );
  }

  if (currentScreen === 'setup') {
    return (
      <PregnancySetupScreen 
        onComplete={handlePregnancySetup}
        onBack={() => setCurrentScreen('auth')}
      />
    );
  }

  // Mothers get the Neema experience. Earlier screens stay reachable from Profile › More from Neema.
  if (!isPartnerMode && pregnancy) {
    return (
      <NeemaApp
        user={user}
        pregnancy={pregnancy}
        onLogout={handleLogout}
        extras={[
          { id: 'tracking', label: 'Week-by-week tracker', description: 'Baby’s development and your body, week by week', render: () => <WeeklyTrackingScreen pregnancy={pregnancy} /> },
          { id: 'checklist', label: 'Contraction timer & birth checklist', description: 'Time contractions and track your hospital bag', render: () => <ChecklistScreen checklist={checklist} onToggleItem={toggleChecklistItem} /> },
          { id: 'spiritual', label: 'Spiritual support', description: 'Daily prayers and encouraging words', render: () => <SpiritualScreen /> },
          { id: 'partner', label: 'Partner view', description: 'See what your partner sees in Neema', render: () => <PartnerDashboard pregnancy={pregnancy} onNavigate={() => undefined} /> },
        ]}
      />
    );
  }

  // Partners keep the existing layout with bottom navigation
  const renderContent = () => {
    if (!pregnancy) return null;

    switch (activeTab) {
      case 'home':
        return isPartnerMode 
          ? <PartnerDashboard pregnancy={pregnancy} onNavigate={handleNavigate} />
          : <DashboardScreen pregnancy={pregnancy} onNavigate={handleNavigate} />;
      case 'tracking':
        return <WeeklyTrackingScreen pregnancy={pregnancy} />;
      case 'health':
        return <HealthScreen pregnancy={pregnancy} />;
      case 'checklist':
        return <ChecklistScreen checklist={checklist} onToggleItem={toggleChecklistItem} />;
      case 'spiritual':
        return <SpiritualScreen />;
      case 'family-planning':
        return <FamilyPlanningScreen />;
      case 'profile':
        return (
          <ProfileScreen 
            user={user}
            pregnancy={pregnancy}
            isPartnerMode={isPartnerMode}
            onTogglePartnerMode={() => setIsPartnerMode(!isPartnerMode)}
            onLogout={handleLogout}
          />
        );
      default:
        return isPartnerMode 
          ? <PartnerDashboard pregnancy={pregnancy} onNavigate={handleNavigate} />
          : <DashboardScreen pregnancy={pregnancy} onNavigate={handleNavigate} />;
    }
  };

  return (
    <MobileLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      isPartnerMode={isPartnerMode}
    >
      {renderContent()}
    </MobileLayout>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <AppFlow />
    </AppProvider>
  );
};

export default Index;
