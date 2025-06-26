import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function useDataPersistence<T>(key: string, defaultValue: T) {
  const { user } = useAuth();
  const [data, setData] = useState<T>(defaultValue);

  // Create user-specific storage key
  const storageKey = user ? `tournapp-${user.id}-${key}` : `tournapp-guest-${key}`;

  // Load data on mount and when user changes
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        setData(defaultValue);
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      setData(defaultValue);
    }
  }, [storageKey, key, defaultValue]);

  // Save data to localStorage
  const saveData = (newData: T) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  return [data, saveData] as const;
}