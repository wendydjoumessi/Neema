import { Home, Calendar, Heart, ShoppingBag, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPartnerMode?: boolean;
}

const motherTabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tracking', label: 'Tracking', icon: Calendar },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'checklist', label: 'Prepare', icon: ShoppingBag },
  { id: 'profile', label: 'Profile', icon: User },
];

const partnerTabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tracking', label: 'Progress', icon: Calendar },
  { id: 'health', label: 'Support', icon: Heart },
  { id: 'checklist', label: 'Tasks', icon: ShoppingBag },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ activeTab, onTabChange, isPartnerMode = false }: BottomNavProps) {
  const tabs = isPartnerMode ? partnerTabs : motherTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <div className="w-full">
        <div className="flex items-center justify-around px-4 md:px-8 py-2 safe-area-bottom">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 relative min-w-[64px]",
                  isActive 
                    ? isPartnerMode 
                      ? "bg-partner/10 text-partner" 
                      : "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 md:w-6 md:h-6 transition-transform duration-200",
                    isActive && "scale-110"
                  )} 
                />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div 
                    className={cn(
                      "absolute -bottom-2 w-1.5 h-1.5 rounded-full",
                      isPartnerMode ? "bg-partner" : "bg-primary"
                    )} 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
