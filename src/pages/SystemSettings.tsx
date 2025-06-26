import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Monitor, Sun, Moon, Globe, Check } from 'lucide-react';

interface SystemSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'english' | 'hebrew';
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    theme: 'light',
    language: 'english'
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('tournapp-system-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        applyTheme(parsed.theme);
        applyLanguage(parsed.language);
      } catch (error) {
        console.error('Error loading system settings:', error);
      }
    }
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const applyLanguage = (language: string) => {
    const root = document.documentElement;
    
    if (language === 'hebrew') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'he');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    }
  };

  const handleSettingChange = (key: keyof SystemSettings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
    
    // Apply changes immediately for preview
    if (key === 'theme') {
      applyTheme(value);
    } else if (key === 'language') {
      applyLanguage(value);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('tournapp-system-settings', JSON.stringify(settings));
      
      // Apply settings
      applyTheme(settings.theme);
      applyLanguage(settings.language);
      
      setHasChanges(false);
      setLastSaved(new Date());
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultSettings: SystemSettings = {
        theme: 'light',
        language: 'english'
      };
      
      setSettings(defaultSettings);
      setHasChanges(true);
      applyTheme(defaultSettings.theme);
      applyLanguage(defaultSettings.language);
    }
  };

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      description: 'Light theme with bright colors',
      icon: <Sun className="h-5 w-5" />
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Dark theme with muted colors',
      icon: <Moon className="h-5 w-5" />
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follow system preference',
      icon: <Monitor className="h-5 w-5" />
    }
  ];

  const languageOptions = [
    {
      value: 'english',
      label: 'English',
      description: 'English (Left to Right)',
      flag: '🇺🇸'
    },
    {
      value: 'hebrew',
      label: 'עברית',
      description: 'Hebrew (Right to Left)',
      flag: '🇮🇱'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">System Settings</h1>
          <p className="text-text-secondary mt-1">Configure system-wide preferences and appearance</p>
        </div>
        {lastSaved && (
          <div className="text-sm text-text-muted">
            Last saved: {lastSaved.toLocaleString()}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card title="Theme Preference" subtitle="Choose your preferred color scheme">
          <div className="space-y-4">
            {themeOptions.map((option) => (
              <div
                key={option.value}
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  settings.theme === option.value
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-border hover:border-primary-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSettingChange('theme', option.value)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    settings.theme === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{option.label}</h4>
                    <p className="text-sm text-text-secondary">{option.description}</p>
                  </div>
                </div>
                {settings.theme === option.value && (
                  <div className="text-primary-600">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Language Settings */}
        <Card title="Language Preference" subtitle="Choose your preferred language">
          <div className="space-y-4">
            {languageOptions.map((option) => (
              <div
                key={option.value}
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  settings.language === option.value
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-border hover:border-primary-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSettingChange('language', option.value)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-2xl">
                    {option.flag}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{option.label}</h4>
                    <p className="text-sm text-text-secondary">{option.description}</p>
                  </div>
                </div>
                {settings.language === option.value && (
                  <div className="text-primary-600">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Preview Section */}
      <Card title="Preview" subtitle="See how your settings will look">
        <div className="p-6 border border-border rounded-lg bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {settings.language === 'hebrew' ? 'טורנאפ' : 'Tournapp'}
              </h3>
              <p className="text-text-secondary">
                {settings.language === 'hebrew' 
                  ? 'פאנל ניהול מערכת' 
                  : 'Admin Panel System'
                }
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  settings.theme === 'dark' 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'bg-primary-100 text-primary-800'
                }`}>
                  {settings.theme === 'light' ? 'Light Theme' : 
                   settings.theme === 'dark' ? 'Dark Theme' : 'System Theme'}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  {settings.language === 'hebrew' ? 'עברית' : 'English'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
              loading={isSaving}
              className="flex items-center"
            >
              <Check className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleResetToDefaults}
              disabled={isSaving}
            >
              Reset to Defaults
            </Button>
          </div>

          {hasChanges && (
            <div className="flex items-center text-sm text-warning-600">
              <div className="w-2 h-2 bg-warning-500 rounded-full mr-2"></div>
              You have unsaved changes
            </div>
          )}
        </div>

        {!hasChanges && lastSaved && (
          <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg">
            <div className="flex items-center text-success-800">
              <Check className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Settings saved successfully at {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Information Section */}
      <Card title="Additional Information">
        <div className="space-y-4 text-sm text-text-secondary">
          <div>
            <h4 className="font-medium text-text-primary mb-2">Theme Settings</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Light:</strong> Uses bright colors and light backgrounds</li>
              <li><strong>Dark:</strong> Uses dark colors and reduces eye strain in low light</li>
              <li><strong>System:</strong> Automatically matches your device's theme preference</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-text-primary mb-2">Language Settings</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>English:</strong> Left-to-right text direction with English interface</li>
              <li><strong>Hebrew:</strong> Right-to-left text direction with Hebrew interface</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Changes are applied immediately for preview. Click "Save Changes" to persist your preferences.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}