import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Trophy, Users, Building, Settings, Info, Award, FileText, Upload, Megaphone, Home, Target, ChevronDown, ChevronRight, UserCheck, Castle as Whistle, User, Sliders, HelpCircle, Monitor } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/organizations', label: 'Organizations', icon: BarChart3 },
  { 
    label: 'User Management', 
    icon: Users,
    submenu: [
      { path: '/users', label: 'Users', icon: User },
      { path: '/clubs', label: 'Clubs', icon: Building },
      { path: '/coaches', label: 'Coach', icon: UserCheck },
      { path: '/referees', label: 'Referee', icon: Whistle },
      { path: '/players', label: 'Player', icon: Users },
    ]
  },
  { path: '/tournaments', label: 'Tournaments', icon: Trophy },
  { path: '/leagues', label: 'Leagues', icon: Target },
  { path: '/ranking', label: 'Ranking', icon: Award },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/publishing', label: 'Publishing', icon: Upload },
  { path: '/advertising', label: 'Advertising', icon: Megaphone },
];

const settingsItems = [
  { 
    label: 'Settings', 
    icon: Settings,
    submenu: [
      { path: '/global-settings', label: 'Global Preference', icon: Sliders },
      { path: '/system-settings', label: 'System Settings', icon: Monitor },
      { path: '/information', label: 'Information', icon: Info },
      { path: '/support', label: 'Support', icon: HelpCircle },
    ]
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

// Tournapp Logo Component with theme switching
const TournappLogo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      {/* Light mode logo */}
      <img 
        src="/assets/light-tournapp-logo.svg" 
        alt="Tournapp" 
        className="h-8 w-auto dark:hidden"
      />
      {/* Dark mode logo */}
      <img 
        src="/assets/dark-tournapp-logo.svg" 
        alt="Tournapp" 
        className="h-8 w-auto hidden dark:block"
      />
    </div>
  );
};

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();
  // Changed: Both User Management and Settings are now closed by default (empty array)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isMenuExpanded = (label: string) => expandedMenus.includes(label);

  const renderMenuItem = (item: any, isSettings = false) => {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = isMenuExpanded(item.label);
    const isActive = item.path ? location.pathname === item.path : false;
    const hasActiveSubmenu = hasSubmenu && item.submenu.some((subItem: any) => location.pathname === subItem.path);

    if (hasSubmenu) {
      return (
        <div key={item.label} className="mb-1">
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 group rounded-lg ${
              hasActiveSubmenu
                ? 'bg-primary-50 text-primary-700'
                : 'text-text-tertiary hover:bg-gray-50 hover:text-text-primary'
            }`}
          >
            <Icon className={`h-5 w-5 mr-3 transition-colors ${
              hasActiveSubmenu ? 'text-primary-600' : 'text-text-muted group-hover:text-text-secondary'
            }`} />
            <span className="flex-1 text-left">{item.label}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform duration-200" />
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-1 ml-3 space-y-1">
              {item.submenu.map((subItem: any) => {
                const SubIcon = subItem.icon;
                const isSubActive = location.pathname === subItem.path;
                
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`flex items-center px-3 py-2 text-sm transition-all duration-200 group rounded-lg ${
                      isSubActive
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-text-tertiary hover:bg-gray-50 hover:text-text-primary'
                    }`}
                  >
                    <SubIcon className={`h-4 w-4 mr-3 transition-colors ${
                      isSubActive ? 'text-white' : 'text-text-muted group-hover:text-text-secondary'
                    }`} />
                    <span>{subItem.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.path} className="mb-1">
        <Link
          to={item.path}
          className={`flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 group rounded-lg ${
            isActive
              ? 'bg-primary-50 text-primary-700'
              : 'text-text-tertiary hover:bg-gray-50 hover:text-text-primary'
          }`}
        >
          <Icon className={`h-5 w-5 mr-3 transition-colors ${
            isActive ? 'text-primary-600' : 'text-text-muted group-hover:text-text-secondary'
          }`} />
          <span>{item.label}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-sm z-30 flex flex-col border-r border-border dark:border-gray-700">
      {/* Logo Section */}
      <div className="flex items-center p-6 border-b border-border dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <TournappLogo />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* Settings section at bottom */}
      <div className="border-t border-border dark:border-gray-700 bg-gray-25 dark:bg-gray-800 px-4 py-4">
        <div className="space-y-1">
          {settingsItems.map((item) => renderMenuItem(item, true))}
        </div>
      </div>
    </div>
  );
}