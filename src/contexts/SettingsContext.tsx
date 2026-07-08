import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppSettings } from '../types';
import { loadSettings, saveSettings } from '../store';

interface SettingsContextType {
  settings: AppSettings;
  advancedMode: boolean;
  toggleAdvancedMode: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  // Persist settings on change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const toggleAdvancedMode = useCallback(() => {
    setSettings(prev => ({ ...prev, advancedMode: !prev.advancedMode }));
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  return (
    <SettingsContext.Provider value={{
      settings,
      advancedMode: settings.advancedMode,
      toggleAdvancedMode,
      updateSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
