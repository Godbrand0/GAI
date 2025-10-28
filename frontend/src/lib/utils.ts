import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format time in milliseconds to MM:SS format
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Nigerian language mappings
export const NIGERIAN_LANGUAGES = {
  'en': { name: 'English', code: 'en-US' },
  'yo': { name: 'Yoruba', code: 'yo-NG' },
  'ig': { name: 'Igbo', code: 'ig-NG' },
  'ha': { name: 'Hausa', code: 'ha-NG' },
  'pcm': { name: 'Nigerian Pidgin', code: 'en-US' }
} as const;

export type NigerianLanguage = keyof typeof NIGERIAN_LANGUAGES;

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  originalText?: string;
  sourceLanguage: string;
  targetLanguage?: string;
  timestamp: Date;
  translations?: Record<string, string>;
  confidence?: number;
}

export interface UserSettings {
  sourceLanguage: NigerianLanguage;
  targetLanguage: NigerianLanguage;
  voiceEnabled: boolean;
  autoTranslate: boolean;
  showCaptions: boolean;
}

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

// Error handling utilities
export class GAIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GAIError';
  }
}

// Audio utilities
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

// Validation utilities
export function isValidLanguage(lang: string): lang is NigerianLanguage {
  return lang in NIGERIAN_LANGUAGES;
}

export function validateMessage(message: string): boolean {
  return message.trim().length > 0 && message.length <= 1000;
}

// Storage utilities
export const storage = {
  getSettings: (): UserSettings | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('gai-settings');
    return stored ? JSON.parse(stored) : null;
  },
  
  setSettings: (settings: UserSettings): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('gai-settings', JSON.stringify(settings));
  },
  
  getChatHistory: (): ChatMessage[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('gai-chat-history');
    return stored ? JSON.parse(stored) : [];
  },
  
  setChatHistory: (messages: ChatMessage[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('gai-chat-history', JSON.stringify(messages));
  }
};

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}