import { useState, useEffect, useRef, useCallback } from 'react';
import { NigerianLanguage, NIGERIAN_LANGUAGES, SpeechRecognitionResult } from '../lib/utils';

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    SpeechSynthesis: any;
    webkitSpeechSynthesis: any;
  }
}

export interface UseSpeechRecognitionOptions {
  language?: NigerianLanguage;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  onResult?: (text: string, confidence: number, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const {
    language = 'en',
    continuous = true,
    interimResults = true,
    maxAlternatives = 1,
    onResult = null,
    onError = null,
    onStart = null,
    onEnd = null
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.maxAlternatives = maxAlternatives;
      recognitionRef.current.lang = NIGERIAN_LANGUAGES[language]?.code || 'en-US';
      
      // Event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        onStart?.();
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interim = '';
        let maxConfidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += transcript;
            maxConfidence = Math.max(maxConfidence, result[0].confidence);
          } else {
            interim += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          setInterimTranscript('');
          setConfidence(maxConfidence);
          onResult?.(finalTranscript, maxConfidence, true);
        } else {
          setInterimTranscript(interim);
          onResult?.(interim, 0, false);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        onError?.(event.error);
        
        // Auto-restart for certain errors
        if (event.error === 'network' || event.error === 'service-not-allowed') {
          setTimeout(() => {
            if (isListening) {
              startListening();
            }
          }, 1000);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        onEnd?.();
        
        // Auto-restart if continuous mode and no error
        if (continuous && !error && isListening) {
          timeoutRef.current = setTimeout(() => {
            startListening();
          }, 100);
        }
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
    }
  }, [language, continuous, interimResults, maxAlternatives, onResult, onError, onStart, onEnd]);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current && isSupported) {
      recognitionRef.current.lang = NIGERIAN_LANGUAGES[language]?.code || 'en-US';
    }
  }, [language, isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition is not supported');
      return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start speech recognition');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  const abortListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
    abortListening
  };
};

// Custom hook for voice synthesis (text-to-speech)
export interface UseSpeechSynthesisOptions {
  language?: NigerianLanguage;
  voice?: string | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export const useSpeechSynthesis = (options: UseSpeechSynthesisOptions = {}) => {
  const {
    language = 'en',
    voice = null,
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    onStart = null,
    onEnd = null,
    onError = null
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      synthesisRef.current = window.speechSynthesis;
      
      // Get available voices
      const updateVoices = () => {
        const voices = synthesisRef.current?.getVoices() || [];
        setAvailableVoices(voices);
      };
      
      updateVoices();
      
      // Voices load asynchronously
      if (synthesisRef.current.onvoiceschanged !== undefined) {
        synthesisRef.current.onvoiceschanged = updateVoices;
      }
    } else {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback((text: string, options: Partial<UseSpeechSynthesisOptions> = {}) => {
    if (!isSupported || !synthesisRef.current) {
      return Promise.reject(new Error('Speech synthesis is not supported'));
    }

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set utterance properties
    utterance.lang = NIGERIAN_LANGUAGES[language]?.code || 'en-US';
    utterance.rate = options.rate || rate;
    utterance.pitch = options.pitch || pitch;
    utterance.volume = options.volume || volume;

    // Select voice
    if (voice || options.voice) {
      const selectedVoice = availableVoices.find(v => 
        v.name === (options.voice || voice) || 
        v.lang === (options.voice || voice)
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (event: any) => {
      setIsSpeaking(false);
      onError?.(event.error);
    };

    return new Promise<void>((resolve, reject) => {
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
        resolve();
      };
      
      utterance.onerror = (event: any) => {
        setIsSpeaking(false);
        onError?.(event.error);
        reject(new Error(event.error));
      };

      synthesisRef.current?.speak(utterance);
    });
  }, [isSupported, language, voice, rate, pitch, volume, availableVoices, onStart, onEnd, onError]);

  const stop = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.resume();
    }
  }, []);

  return {
    isSpeaking,
    isSupported,
    availableVoices,
    speak,
    stop,
    pause,
    resume
  };
};

export default useSpeechRecognition;