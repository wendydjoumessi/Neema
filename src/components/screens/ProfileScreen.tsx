import { useState } from 'react';
import { User, PregnancyData } from '@/types/pregnancy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  User as UserIcon,
  Settings,
  Bell,
  Shield,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Heart,
  Users,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

interface ProfileScreenProps {
  user: User | null;
  pregnancy: PregnancyData | null;
  isPartnerMode: boolean;
  onTogglePartnerMode: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ 
  user, 
  pregnancy, 
  isPartnerMode, 
  onTogglePartnerMode,
  onLogout 
}: ProfileScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const menuItems = [
    { 
      section: 'Account',
      items: [
        { icon: UserIcon, label: 'Edit Profile', action: () => {} },
        { icon: Shield, label: 'Privacy Settings', action: () => {} },
        { icon: Bell, label: 'Notifications', toggle: true, value: notificationsEnabled, onChange: setNotificationsEnabled },
      ]
    },
    {
      section: 'Preferences',
      items: [
        { icon: Globe, label: 'Language', value: 'English' },
        { icon: Moon, label: 'Dark Mode', toggle: true, value: false },
        { icon: Calendar, label: 'Date Format', value: 'MM/DD/YYYY' },
      ]
    },
    {
      section: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: () => {} },
        { icon: Heart, label: 'Rate the App', action: () => {} },
      ]
    }
  ];

  return (
    <div className="pb-6 animate-fade-in">
      {/* Profile Header */}
      <div className={`px-6 pt-safe-top pb-8 ${isPartnerMode ? 'neema-gradient-partner' : 'neema-gradient-primary'}`}>
        <div className="pt-4 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1 text-white">
            <h2 className="font-display text-xl font-bold">
              {user?.name || 'Guest User'}
            </h2>
            <p className="text-white/80 text-sm">
              {user?.email || 'guest@example.com'}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-xs">
              {isPartnerMode ? (
                <>
                  <Users className="w-3 h-3" />
                  Partner Mode
                </>
              ) : (
                <>
                  <Heart className="w-3 h-3" />
                  Mother Mode
                </>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Edit className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Pregnancy Summary */}
      {pregnancy && (
        <div className="px-6 -mt-4">
          <Card variant="elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-bold text-foreground">
                    {format(pregnancy.dueDate, 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Currently</p>
                  <p className="font-bold text-primary">Week {pregnancy.currentWeek}</p>
                </div>
              </div>
              {pregnancy.babyName && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">Baby's nickname</p>
                  <p className="font-medium text-foreground">{pregnancy.babyName}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Partner Mode Toggle */}
      <div className="px-6 mt-6">
        <Card variant="soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isPartnerMode ? 'bg-partner/20' : 'bg-primary/10'
              }`}>
                <Users className={`w-5 h-5 ${isPartnerMode ? 'text-partner' : 'text-primary'}`} />
              </div>
              <div>
                <p className="font-medium text-foreground">Partner Mode</p>
                <p className="text-xs text-muted-foreground">
                  Switch to partner dashboard view
                </p>
              </div>
            </div>
            <Switch
              checked={isPartnerMode}
              onCheckedChange={onTogglePartnerMode}
            />
          </CardContent>
        </Card>
      </div>

      {/* Settings Menu */}
      <div className="px-6 mt-6 space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              {section.section}
            </h3>
            <Card variant="elevated">
              <CardContent className="p-0 divide-y divide-border">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={item.action}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-foreground">{item.label}</span>
                      </div>
                      {'toggle' in item && item.toggle ? (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                        />
                      ) : 'value' in item ? (
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="px-6 mt-6">
        <Card variant="elevated" className="border-destructive/20">
          <CardContent className="p-0">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-4 text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* App Version */}
      <div className="px-6 mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Neema v1.0.0
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Made with 💕 for families everywhere
        </p>
      </div>
    </div>
  );
}
