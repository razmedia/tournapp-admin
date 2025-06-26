import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Classification {
  id: string;
  name: string;
}

export interface Gender {
  id: string;
  name: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface CourtSize {
  name: string;
}

export interface BallType {
  name: string;
  color: string;
}

export interface Currency {
  code: string;
  symbol: string;
}

export interface GlobalSettingsData {
  classifications: Classification[];
  genders: Gender[];
  regions: Region[];
  courtSizes: CourtSize[];
  ballTypes: BallType[];
  currencies: Currency[];
}

interface GlobalSettingsContextType {
  settings: GlobalSettingsData;
  updateClassifications: (classifications: Classification[]) => void;
  addClassification: (classification: Classification) => void;
  deleteClassification: (id: string) => void;
  updateClassification: (id: string, name: string) => void;
  updateGenders: (genders: Gender[]) => void;
  addGender: (gender: Gender) => void;
  deleteGender: (id: string) => void;
  updateGender: (id: string, name: string) => void;
  updateRegions: (regions: Region[]) => void;
  addRegion: (region: Region) => void;
  deleteRegion: (id: string) => void;
  updateCurrencies: (currencies: Currency[]) => void;
  addCurrency: (currency: Currency) => void;
  deleteCurrency: (code: string) => void;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'tournapp-global-settings';

const defaultSettings: GlobalSettingsData = {
  classifications: [
    { id: 'c1', name: 'Juniors' },
    { id: 'c2', name: 'Seniors' },
    { id: 'c3', name: 'Handicapped' },
  ],
  genders: [
    { id: 'g1', name: 'Male' },
    { id: 'g2', name: 'Female' },
    { id: 'g3', name: 'Mixed' },
  ],
  regions: [
    { id: 'r1', name: 'North' },
    { id: 'r2', name: 'South' },
    { id: 'r3', name: 'Center' },
  ],
  courtSizes: [
    { name: 'Full Court' },
    { name: 'Half Court' },
    { name: '3/4 Court' },
    { name: 'Mini Tennis' },
  ],
  ballTypes: [
    { name: 'Yellow', color: 'bg-yellow-400' },
    { name: 'Green', color: 'bg-green-500' },
    { name: 'Orange', color: 'bg-orange-500' },
    { name: 'Red', color: 'bg-red-500' },
  ],
  currencies: [
    { code: 'INR', symbol: '₹' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
  ],
};

export function GlobalSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GlobalSettingsData>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Error loading global settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const saveSettings = (newSettings: GlobalSettingsData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving global settings:', error);
    }
  };

  // Classification functions
  const updateClassifications = (classifications: Classification[]) => {
    const newSettings = { ...settings, classifications };
    saveSettings(newSettings);
  };

  const addClassification = (classification: Classification) => {
    const newClassifications = [...settings.classifications, classification];
    updateClassifications(newClassifications);
  };

  const deleteClassification = (id: string) => {
    const newClassifications = settings.classifications.filter(c => c.id !== id);
    updateClassifications(newClassifications);
  };

  const updateClassification = (id: string, name: string) => {
    const newClassifications = settings.classifications.map(c => 
      c.id === id ? { ...c, name } : c
    );
    updateClassifications(newClassifications);
  };

  // Gender functions
  const updateGenders = (genders: Gender[]) => {
    const newSettings = { ...settings, genders };
    saveSettings(newSettings);
  };

  const addGender = (gender: Gender) => {
    const newGenders = [...settings.genders, gender];
    updateGenders(newGenders);
  };

  const deleteGender = (id: string) => {
    const newGenders = settings.genders.filter(g => g.id !== id);
    updateGenders(newGenders);
  };

  const updateGender = (id: string, name: string) => {
    const newGenders = settings.genders.map(g => 
      g.id === id ? { ...g, name } : g
    );
    updateGenders(newGenders);
  };

  // Region functions
  const updateRegions = (regions: Region[]) => {
    const newSettings = { ...settings, regions };
    saveSettings(newSettings);
  };

  const addRegion = (region: Region) => {
    const newRegions = [...settings.regions, region];
    updateRegions(newRegions);
  };

  const deleteRegion = (id: string) => {
    const newRegions = settings.regions.filter(r => r.id !== id);
    updateRegions(newRegions);
  };

  // Currency functions
  const updateCurrencies = (currencies: Currency[]) => {
    const newSettings = { ...settings, currencies };
    saveSettings(newSettings);
  };

  const addCurrency = (currency: Currency) => {
    const newCurrencies = [...settings.currencies, currency];
    updateCurrencies(newCurrencies);
  };

  const deleteCurrency = (code: string) => {
    const newCurrencies = settings.currencies.filter(c => c.code !== code);
    updateCurrencies(newCurrencies);
  };

  const contextValue: GlobalSettingsContextType = {
    settings,
    updateClassifications,
    addClassification,
    deleteClassification,
    updateClassification,
    updateGenders,
    addGender,
    deleteGender,
    updateGender,
    updateRegions,
    addRegion,
    deleteRegion,
    updateCurrencies,
    addCurrency,
    deleteCurrency,
  };

  return (
    <GlobalSettingsContext.Provider value={contextValue}>
      {children}
    </GlobalSettingsContext.Provider>
  );
}

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  if (context === undefined) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
}