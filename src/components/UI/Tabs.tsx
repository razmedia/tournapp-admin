import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills';
}

export default function Tabs({ tabs, defaultTab, variant = 'default' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const baseTabClasses = "inline-flex items-center px-4 py-2 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";
  
  const variantClasses = {
    default: {
      container: "border-b border-border",
      nav: "-mb-px flex space-x-8",
      active: "border-b-2 border-primary-600 text-primary-600",
      inactive: "border-b-2 border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300"
    },
    pills: {
      container: "bg-gray-100 p-1 rounded-lg",
      nav: "flex space-x-1",
      active: "bg-white text-primary-600 shadow-sm rounded-md",
      inactive: "text-text-secondary hover:text-text-primary hover:bg-white hover:shadow-sm rounded-md"
    }
  };

  const classes = variantClasses[variant];

  return (
    <div>
      <div className={classes.container}>
        <nav className={classes.nav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${baseTabClasses} ${
                activeTab === tab.id ? classes.active : classes.inactive
              }`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}