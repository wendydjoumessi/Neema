import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  showNav?: boolean;
  isPartnerMode?: boolean;
  className?: string;
}

export function MobileLayout({ 
  children, 
  activeTab, 
  onTabChange, 
  showNav = true,
  isPartnerMode = false,
  className 
}: MobileLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-background flex flex-col w-full relative",
      isPartnerMode && "partner-mode"
    )}>
      <main className={cn(
        "flex-1 overflow-y-auto scroll-smooth hide-scrollbar",
        showNav && "pb-24",
        className
      )}>
        {children}
      </main>
      
      {showNav && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={onTabChange}
          isPartnerMode={isPartnerMode}
        />
      )}
    </div>
  );
}
