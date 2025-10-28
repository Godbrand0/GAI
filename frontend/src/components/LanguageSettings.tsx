import React, { useState, useEffect } from 'react';
import { Settings, Globe, Volume2, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { NigerianLanguage, NIGERIAN_LANGUAGES, UserSettings, storage } from '../lib/utils';

interface LanguageSettingsProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  className?: string;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  settings,
  onSettingsChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
    storage.setSettings(newSettings);
  };

  const handleLanguageSwap = () => {
    const newSettings = {
      ...localSettings,
      sourceLanguage: localSettings.targetLanguage,
      targetLanguage: localSettings.sourceLanguage
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
    storage.setSettings(newSettings);
  };

  const LanguageSelector: React.FC<{
    value: NigerianLanguage;
    onChange: (lang: NigerianLanguage) => void;
    label: string;
  }> = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as NigerianLanguage)}
          className={cn(
            "w-full px-4 py-2 pr-10 rounded-lg border border-border",
            "bg-background text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "appearance-none cursor-pointer transition-colors"
          )}
        >
          {Object.entries(NIGERIAN_LANGUAGES).map(([code, lang]) => (
            <option key={code} value={code}>
              {lang.name}
            </option>
          ))}
        </select>
        <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className={cn("relative", className)}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border border-border",
          "bg-background hover:bg-muted transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary"
        )}
      >
        <Settings className="w-4 h-4" />
        <span className="text-sm font-medium">Language Settings</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{NIGERIAN_LANGUAGES[localSettings.sourceLanguage].name}</span>
          <span>→</span>
          <span>{NIGERIAN_LANGUAGES[localSettings.targetLanguage].name}</span>
        </div>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Language Settings</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>

            {/* Language Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LanguageSelector
                value={localSettings.sourceLanguage}
                onChange={(lang) => handleSettingChange('sourceLanguage', lang)}
                label="I speak (Source Language)"
              />
              
              <LanguageSelector
                value={localSettings.targetLanguage}
                onChange={(lang) => handleSettingChange('targetLanguage', lang)}
                label="I want to understand (Target Language)"
              />
            </div>

            {/* Swap Languages Button */}
            <div className="flex justify-center">
              <button
                onClick={handleLanguageSwap}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <span>Swap Languages</span>
                <span className="text-xs text-muted-foreground">⇄</span>
              </button>
            </div>

            {/* Voice Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Voice Settings</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Enable Voice Output</span>
                </div>
                <button
                  onClick={() => handleSettingChange('voiceEnabled', !localSettings.voiceEnabled)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    localSettings.voiceEnabled ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                      localSettings.voiceEnabled ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Display Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Display Settings</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Auto-translate Messages</span>
                </div>
                <button
                  onClick={() => handleSettingChange('autoTranslate', !localSettings.autoTranslate)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    localSettings.autoTranslate ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                      localSettings.autoTranslate ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Show Real-time Captions</span>
                </div>
                <button
                  onClick={() => handleSettingChange('showCaptions', !localSettings.showCaptions)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    localSettings.showCaptions ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                      localSettings.showCaptions ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Configuration</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Source:</span>
                  <span className="ml-2 font-medium">
                    {NIGERIAN_LANGUAGES[localSettings.sourceLanguage].name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Target:</span>
                  <span className="ml-2 font-medium">
                    {NIGERIAN_LANGUAGES[localSettings.targetLanguage].name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Voice:</span>
                  <span className="ml-2 font-medium">
                    {localSettings.voiceEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Auto-translate:</span>
                  <span className="ml-2 font-medium">
                    {localSettings.autoTranslate ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSettings;