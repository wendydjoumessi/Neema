import { Home, Calendar, Heart, ShoppingBag, User } from 'lucide-react';
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
    <nav className="bottom-nav safe-area-bottom">
      <div className="flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "bottom-nav-item flex-1",
                isActive && "active",
                isPartnerMode && isActive && "!bg-partner/10 !text-partner"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  isActive && "scale-110"
                )} 
              />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div 
                  className={cn(
                    "absolute -bottom-1 w-1 h-1 rounded-full",
                    isPartnerMode ? "bg-partner" : "bg-primary"
                  )} 
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
