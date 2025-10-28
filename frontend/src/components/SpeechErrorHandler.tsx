import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mic, MicOff, RefreshCw, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { NigerianLanguage } from '../lib/utils';

interface SpeechErrorHandlerProps {
  error: string | null;
  isSupported: boolean;
  isListening: boolean;
  onRetry?: () => void;
  onSettings?: () => void;
  className?: string;
  language?: NigerianLanguage;
}

interface SpeechError {
  type: 'permission' | 'network' | 'service' | 'hardware' | 'unknown';
  message: string;
  suggestion: string;
  canRetry: boolean;
}

const SpeechErrorHandler: React.FC<SpeechErrorHandlerProps> = ({
  error,
  isSupported,
  isListening,
  onRetry,
  onSettings,
  className,
  language = 'en'
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [errorDetails, setErrorDetails] = useState<SpeechError | null>(null);

  useEffect(() => {
    if (error && !dismissed) {
      const details = parseSpeechError(error);
      setErrorDetails(details);
    } else {
      setErrorDetails(null);
    }
  }, [error, dismissed]);

  const parseSpeechError = (errorMessage: string): SpeechError => {
    const lowerError = errorMessage.toLowerCase();

    if (lowerError.includes('permission') || lowerError.includes('denied') || lowerError.includes('allowed')) {
      return {
        type: 'permission',
        message: 'Microphone access denied',
        suggestion: 'Please allow microphone access in your browser settings and refresh the page.',
        canRetry: false
      };
    }

    if (lowerError.includes('network') || lowerError.includes('connection')) {
      return {
        type: 'network',
        message: 'Network connection issue',
        suggestion: 'Check your internet connection and try again.',
        canRetry: true
      };
    }

    if (lowerError.includes('service') || lowerError.includes('unavailable')) {
      return {
        type: 'service',
        message: 'Speech recognition service unavailable',
        suggestion: 'The speech recognition service is temporarily unavailable. Please try again later.',
        canRetry: true
      };
    }

    if (lowerError.includes('hardware') || lowerError.includes('device') || lowerError.includes('microphone')) {
      return {
        type: 'hardware',
        message: 'Microphone not found',
        suggestion: 'Please ensure a microphone is connected and working properly.',
        canRetry: true
      };
    }

    return {
      type: 'unknown',
      message: 'Speech recognition error',
      suggestion: 'An unexpected error occurred. Please try again or check your browser settings.',
      canRetry: true
    };
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  const handleRetry = () => {
    setDismissed(false);
    onRetry?.();
  };

  const getErrorIcon = (type: SpeechError['type']) => {
    switch (type) {
      case 'permission':
        return <MicOff className="w-5 h-5" />;
      case 'network':
        return <AlertTriangle className="w-5 h-5" />;
      case 'service':
        return <AlertTriangle className="w-5 h-5" />;
      case 'hardware':
        return <Mic className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getErrorColor = (type: SpeechError['type']) => {
    switch (type) {
      case 'permission':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'network':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'service':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hardware':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isSupported) {
    return (
      <div className={cn(
        "p-4 rounded-lg border border-border bg-muted/30",
        className
      )}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <MicOff className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-1">
              Speech Recognition Not Supported
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your browser doesn't support speech recognition. Please try using a modern browser like Chrome, Firefox, or Safari.
            </p>
            <div className="text-xs text-muted-foreground">
              Supported browsers: Chrome 25+, Firefox 44+, Safari 14.1+
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!errorDetails || dismissed) {
    return null;
  }

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      getErrorColor(errorDetails.type),
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-current/10 flex items-center justify-center">
          {getErrorIcon(errorDetails.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">
              {errorDetails.message}
            </h3>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>
          
          <p className="text-sm mb-3">
            {errorDetails.suggestion}
          </p>

          <div className="flex items-center gap-2">
            {errorDetails.canRetry && onRetry && (
              <button
                onClick={handleRetry}
                disabled={isListening}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-current text-current-foreground rounded hover:bg-current/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            )}
            
            {onSettings && (
              <button
                onClick={onSettings}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
              >
                <Settings className="w-3 h-3" />
                Settings
              </button>
            )}
          </div>

          {/* Language-specific help */}
          {language !== 'en' && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <p className="text-xs">
                <strong>Language Support:</strong> Speech recognition for {language.toUpperCase()} may have limited accuracy. 
                For best results, consider using English as the source language.
              </p>
            </div>
          )}

          {/* Technical details for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-3 text-xs">
              <summary className="cursor-pointer hover:text-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 p-2 bg-current/10 rounded overflow-auto max-h-20">
                Error: {error}
                Type: {errorDetails.type}
                Can Retry: {errorDetails.canRetry ? 'Yes' : 'No'}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechErrorHandler;