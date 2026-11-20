import { useCallback, useEffect, useRef, useState } from 'react';
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
import type { PersistedState } from '@/neema/store';
import { ConsentScreen } from '@/components/screens/ConsentScreen';
import { MedicalProfileScreen, type MedicalInput } from '@/components/screens/MedicalProfileScreen';
import { LoadingScreen, NewPasswordScreen } from '@/components/screens/NewPasswordScreen';
import type { PregnancyEntry } from '@/components/screens/PregnancySetupScreen';
import { supabase } from '@/integrations/supabase/client';
import { JourneyScreen } from '@/components/screens/JourneyScreen';
import type { EmergencyContact } from '@/neema/contacts';
import { BirthScreen } from '@/components/screens/BirthScreen';
import {
  CONSENT_VERSION, exportMyData, loadAccount, notPregnant, pregnancyFromRow, requestDeletion, saveAppState, saveBirth, saveContacts, saveConsent,
  saveMedicalProfile, savePregnancy, saveProfile, signOut, type Account, type Journey, type PregnancyRow, type Profile,
} from '@/lib/account';
import { MedicineSafety } from '@/components/screens/MedicineSafety';

type Screen = 'loading' | 'error' | 'landing' | 'contact' | 'onboarding' | 'journey' | 'auth' | 'consent' | 'setup' | 'birth' | 'medical' | 'main' | 'new-password';

const DAY = 86_400_000;
const samplePartnerPregnancy = (userId: string): PregnancyData => ({
  id: 'demo',
  userId,
  startDate: new Date(Date.now() - 140 * DAY),
  dueDate: new Date(Date.now() + 140 * DAY),
  currentWeek: 20,
  trimester: 2,
  babyName: 'Little One',
});

function AppFlow() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRole, setSelectedRole] = useState<'mother' | 'partner'>('mother');
  /** What she chose in "What brings you to Neema?" (an existing account's saved journey wins). */
  const [selectedJourney, setSelectedJourney] = useState<Journey>('preg');
  const [user, setUser] = useState<User | null>(null);
  /** Signed-in account id; null for guests (nothing is saved). */
  const [userId, setUserId] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [pregnancy, setPregnancy] = useState<PregnancyData | null>(null);
  const [isPartnerMode, setIsPartnerMode] = useState(false);
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [setupError, setSetupError] = useState('');
  /** Last contacts list saved to the account, so unchanged lists aren't rewritten. */
  const savedContacts = useRef('[]');
  const recovering = useRef(typeof window !== 'undefined' && window.location.hash.includes('type=recovery'));

  const goMain = (acc: Account | null, role: 'mother' | 'partner', id: string) => {
    if (role === 'partner') {
      // TODO: show the linked mother's shared data once partner linking is built.
      setIsPartnerMode(true);
      setPregnancy(samplePartnerPregnancy(id));
      setActiveTab('home');
      setCurrentScreen('main');
      return;
    }
    setIsPartnerMode(false);
    const journey: Journey = acc?.profile?.journey ?? selectedJourney;
    setSelectedJourney(journey);
    if (journey === 'ttc' || journey === 'avoid') {
      setPregnancy(notPregnant(id));
      setCurrentScreen('main');
    } else if (journey === 'pp') {
      if (acc?.birth) { setPregnancy(pregnancyFromRow(acc.birth)); setCurrentScreen('main'); }
      else setCurrentScreen('birth');
    } else if (acc?.pregnancy) {
      setPregnancy(pregnancyFromRow(acc.pregnancy));
      setCurrentScreen('main');
    } else {
      setCurrentScreen('setup');
    }
  };

  const openAccount = async (id: string, email: string | undefined) => {
    setCurrentScreen('loading');
    try {
      const acc = await loadAccount(id);
      const role = acc.profile?.role ?? selectedRole;
      savedContacts.current = JSON.stringify(acc.contacts);
      setAccount(acc);
      setUserId(id);
      setUser({ id, name: acc.profile?.full_name || email?.split('@')[0] || '', email: email ?? '', role });
      if (recovering.current) { setCurrentScreen('new-password'); return; }
      if (!acc.profile?.consent_terms_at || acc.profile.consent_version !== CONSENT_VERSION) { setCurrentScreen('consent'); return; }
      goMain(acc, role, id);
    } catch {
      setCurrentScreen('error');
    }
  };

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') { recovering.current = true; setCurrentScreen('new-password'); }
    });
    supabase.auth.getSession()
      .then(({ data }) => {
        if (!active) return;
        const u = data.session?.user;
        if (u) openAccount(u.id, u.email);
        else setCurrentScreen((sc) => (sc === 'loading' ? 'landing' : sc));
      })
      .catch(() => active && setCurrentScreen('landing'));
    return () => { active = false; sub.subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleSelect = (role: 'mother' | 'partner') => {
    setSelectedRole(role);
    setCurrentScreen(role === 'mother' ? 'journey' : 'auth');
  };

  const handleJourneySelect = (journey: Journey) => {
    setSelectedJourney(journey);
    setCurrentScreen('auth');
  };

  const handleGuest = (guest: User) => {
    setUser(guest);
    setUserId(null);
    setAccount(null);
    goMain(null, guest.role, guest.id);
  };

  const handleConsent = async (choices: { sms: boolean; partnerSharing: boolean }) => {
    if (!userId) return;
    await saveConsent(userId, choices);
    const acc = await loadAccount(userId);
    setAccount(acc);
    goMain(acc, user?.role ?? 'mother', userId);
  };

  const handlePregnancySetup = async (data: PregnancyData, entry: PregnancyEntry) => {
    setSetupError('');
    if (!userId) {
      setPregnancy(data);
      setCurrentScreen('main');
      return;
    }
    try {
      const row = await savePregnancy(userId, data, entry);
      await saveProfile(userId, { journey: 'preg' });
      setPregnancy(pregnancyFromRow(row));
      setAccount((a) => (a ? { ...a, pregnancy: row, profile: a.profile ? { ...a.profile, journey: 'preg' } : a.profile } : a));
      setCurrentScreen(account?.medical ? 'main' : 'medical');
    } catch {
      setSetupError('We couldn’t save your pregnancy. Check your connection and try again.');
    }
  };

  const handleNotPregnant = async (journey: 'ttc' | 'avoid' | 'pp') => {
    const id = userId ?? 'guest';
    setSelectedJourney(journey);
    if (userId) {
      try { await saveProfile(userId, { journey }); } catch { /* the app keeps working; it saves again on the next change */ }
      setAccount((a) => (a && a.profile ? { ...a, profile: { ...a.profile, journey } } : a));
    }
    if (journey === 'pp') { setCurrentScreen('birth'); return; }
    setPregnancy(notPregnant(id));
    setCurrentScreen('main');
  };

  const handleBirth = async (birthDate: string, nickname: string) => {
    setSetupError('');
    const id = userId ?? 'guest';
    if (!userId) {
      setPregnancy(pregnancyFromRow({ id: 'guest-birth', user_id: id, due_date: birthDate, doctor_due_date: null, status: 'born', outcome_date: birthDate, baby_nickname: nickname || null } as PregnancyRow));
      setCurrentScreen('main');
      return;
    }
    try {
      const row = await saveBirth(userId, birthDate, nickname);
      await saveProfile(userId, { journey: 'pp' });
      setPregnancy(pregnancyFromRow(row));
      setAccount((a) => (a ? { ...a, birth: row, pregnancy: null, profile: a.profile ? { ...a.profile, journey: 'pp' } : a.profile } : a));
      setCurrentScreen(account?.medical ? 'main' : 'medical');
    } catch {
      setSetupError('We couldn’t save this. Check your connection and try again.');
    }
  };

  const handleMedicalSave = async (data: MedicalInput) => {
    if (userId) {
      await saveMedicalProfile(userId, data);
      setAccount((a) => (a ? { ...a, medical: { ...data, user_id: userId, updated_at: new Date().toISOString() } } : a));
    }
  };

  const handleLogout = async () => {
    if (userId) await signOut();
    setUser(null);
    setUserId(null);
    setAccount(null);
    setPregnancy(null);
    setIsPartnerMode(false);
    setCurrentScreen('landing');
  };

  /** Save settings and progress: preferences go to the profile, the rest to app_state. */
  const handlePersist = useCallback((state: PersistedState) => {
    const { lang, journey, discreet, city, contacts, ...rest } = state;
    // A journey that needs dates she hasn't given yet: ask for them.
    if (journey === 'preg' && (pregnancy?.id === 'none' || pregnancy?.birthDate)) setCurrentScreen('setup');
    if (journey === 'pp' && !pregnancy?.birthDate) setCurrentScreen('birth');
    if ((journey === 'ttc' || journey === 'avoid') && journey !== selectedJourney) setSelectedJourney(journey);
    if (!userId) return;
    saveProfile(userId, {
      language: lang === 'fr' ? 'fr' : 'en',
      journey: (journey as Profile['journey']) ?? 'preg',
      discreet_mode: !!discreet,
      city: typeof city === 'string' && city ? city : null,
    }).catch(() => undefined);
    saveAppState(userId, rest).catch(() => undefined);
    const contactsJson = JSON.stringify(contacts ?? []);
    if (contactsJson !== savedContacts.current) {
      saveContacts(userId, (contacts as EmergencyContact[]) ?? [])
        .then(() => { savedContacts.current = contactsJson; })
        .catch(() => undefined);
    }
  }, [userId, pregnancy?.id, pregnancy?.birthDate, selectedJourney]);

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
  if (currentScreen === 'loading') return <LoadingScreen />;

  if (currentScreen === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neema-cream p-6 text-center font-sans text-neema-ink">
        <h1 className="text-2xl font-bold">We couldn’t open your account</h1>
        <p className="max-w-sm text-neema-muted-strong">Check your data or Wi-Fi connection, then try again.</p>
        <button type="button" onClick={() => window.location.reload()} className="min-h-[56px] rounded-xl bg-neema-dark px-8 font-semibold text-white">Try again</button>
        <button type="button" onClick={handleLogout} className="min-h-[48px] font-semibold text-neema-dark">Log out</button>
      </div>
    );
  }

  if (currentScreen === 'new-password') {
    return (
      <NewPasswordScreen
        onDone={() => {
          recovering.current = false;
          window.history.replaceState(null, '', window.location.pathname);
          supabase.auth.getSession().then(({ data }) => {
            const u = data.session?.user;
            if (u) openAccount(u.id, u.email); else setCurrentScreen('auth');
          });
        }}
      />
    );
  }

  if (currentScreen === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setCurrentScreen('onboarding')} 
        onLogin={() => { setSelectedRole('mother'); setCurrentScreen('auth'); }}
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

  if (currentScreen === 'journey') {
    return <JourneyScreen onSelect={handleJourneySelect} onBack={() => setCurrentScreen('onboarding')} />;
  }

  if (currentScreen === 'birth') {
    return <BirthScreen onComplete={handleBirth} onBack={() => (userId ? handleLogout() : setCurrentScreen('journey'))} error={setupError} />;
  }

  if (currentScreen === 'auth') {
    return (
      <AuthScreen 
        onSignedIn={(id) => supabase.auth.getUser().then(({ data }) => openAccount(id, data.user?.email))}
        onGuest={handleGuest}
        onBack={() => setCurrentScreen(selectedRole === 'mother' ? 'journey' : 'onboarding')}
        defaultRole={selectedRole}
        journey={selectedJourney}
      />
    );
  }

  if (currentScreen === 'consent') {
    return <ConsentScreen role={user?.role ?? selectedRole} onAccept={handleConsent} onBack={handleLogout} />;
  }

  if (currentScreen === 'setup') {
    return (
      <PregnancySetupScreen 
        onComplete={handlePregnancySetup}
        onNotPregnant={handleNotPregnant}
        onBack={() => (userId ? handleLogout() : setCurrentScreen('journey'))}
        error={setupError}
      />
    );
  }

  if (currentScreen === 'medical') {
    return (
      <MedicalProfileScreen
        mode="setup"
        initial={account?.medical ?? null}
        onSave={async (data) => { await handleMedicalSave(data); setCurrentScreen('main'); }}
        onSkip={() => setCurrentScreen('main')}
      />
    );
  }

  // Mothers get the Neema experience. Earlier screens stay reachable from Profile › More from Neema.
  const seed: PersistedState | undefined = !account
    ? { journey: selectedJourney }
    : {
        ...(account.appState ?? {}),
        lang: account.profile?.language,
        journey: account.profile?.journey,
        discreet: account.profile?.discreet_mode,
        city: account.profile?.city ?? undefined,
        contacts: account.contacts,
      };
  const medicalFacts = [
    account?.medical?.blood_group && { k: 'Blood group', v: account.medical.blood_group === 'unknown' ? 'Not known' : account.medical.blood_group },
    account?.medical?.genotype && { k: 'Genotype', v: account.medical.genotype === 'unknown' ? 'Not known' : account.medical.genotype },
  ].filter(Boolean) as { k: string; v: string }[];

  if (!isPartnerMode && pregnancy) {
    return (
      <NeemaApp
        user={user}
        pregnancy={pregnancy}
        onLogout={handleLogout}
        seed={seed}
        onPersist={handlePersist}
        profileFacts={medicalFacts}
        account={userId ? { exportData: () => exportMyData(userId), requestDeletion: () => requestDeletion(userId) } : undefined}
        extras={[
          { id: 'medical', label: 'Medical profile', description: 'Blood group, genotype, conditions and allergies', render: () => <MedicalProfileScreen mode="edit" initial={account?.medical ?? null} onSave={handleMedicalSave} /> },
          { id: 'medicines', label: 'Medicine safety check', description: 'Is a medicine safe in pregnancy?', render: () => <div className="bg-neema-cream p-4 pb-8"><MedicineSafety /></div> },
          { id: 'tracking', label: 'Week-by-week tracker', description: 'Baby’s development and your body, week by week', render: () => <WeeklyTrackingScreen pregnancy={pregnancy} /> },
          { id: 'labour', label: 'Contraction timer & labour signs', description: 'Time contractions and know when to go', render: ({ goTab }) => <ChecklistScreen checklist={checklist} onToggleItem={toggleChecklistItem} showChecklist={false} onOpenShopping={() => goTab('shop')} /> },
          { id: 'spiritual', label: 'Spiritual support', description: 'Daily prayer or encouragement, calm breathing', render: () => <SpiritualScreen /> },
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
