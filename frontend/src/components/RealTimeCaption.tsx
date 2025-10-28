import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { Volume2, VolumeX } from 'lucide-react';

interface RealTimeCaptionProps {
  text: string;
  isInterim?: boolean;
  confidence?: number;
  isActive?: boolean;
  className?: string;
  showWaveform?: boolean;
  language?: string;
}

const RealTimeCaption: React.FC<RealTimeCaptionProps> = ({
  text,
  isInterim = false,
  confidence = 0,
  isActive = false,
  className,
  showWaveform = true,
  language = 'en'
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const animationRef = useRef<number>();
  const textRef = useRef<HTMLDivElement>(null);

  // Animate text appearance
  useEffect(() => {
    if (isInterim) {
      setDisplayedText(text);
    } else {
      // Smooth transition for final text
      const timer = setTimeout(() => {
        setDisplayedText(text);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [text, isInterim]);

  // Generate animated waveform bars
  useEffect(() => {
    if (!showWaveform || !isActive) {
      setWaveformBars([]);
      return;
    }

    const generateWaveform = () => {
      const bars = Array.from({ length: 15 }, () => Math.random() * 40 + 10);
      setWaveformBars(bars);
      animationRef.current = requestAnimationFrame(generateWaveform);
    };

    generateWaveform();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, showWaveform]);

  // Auto-scroll to keep text visible
  useEffect(() => {
    if (textRef.current && displayedText) {
      textRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [displayedText]);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      'en': 'English',
      'yo': 'Yoruba',
      'ig': 'Igbo',
      'ha': 'Hausa',
      'pcm': 'Pidgin'
    };
    return labels[lang] || lang;
  };

  return (
    <div className={cn(
      "relative w-full max-w-4xl mx-auto p-4 rounded-lg transition-all duration-300",
      isActive 
        ? "bg-primary/10 border border-primary/20 shadow-lg" 
        : "bg-muted/30 border border-border",
      className
    )}>
      {/* Header with language and status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isActive ? (
            <Volume2 className="w-4 h-4 text-primary animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {getLanguageLabel(language)}
          </span>
          {isInterim && (
            <span className="text-xs text-muted-foreground italic">
              (listening...)
            </span>
          )}
        </div>
        
        {confidence > 0 && !isInterim && (
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-medium",
              getConfidenceColor(confidence)
            )}>
              {Math.round(confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Waveform visualization */}
      {showWaveform && isActive && (
        <div className="flex items-center justify-center gap-1 h-8 mb-3">
          {waveformBars.map((height, index) => (
            <div
              key={index}
              className={cn(
                "w-1 bg-primary rounded-full transition-all duration-100",
                isActive ? "opacity-80" : "opacity-30"
              )}
              style={{ 
                height: `${height}px`,
                animationDelay: `${index * 50}ms`
              }}
            />
          ))}
        </div>
      )}

      {/* Caption text */}
      <div className="relative">
        <div
          ref={textRef}
          className={cn(
            "text-lg leading-relaxed transition-all duration-200",
            isInterim 
              ? "text-muted-foreground italic" 
              : "text-foreground",
            !displayedText && "text-muted-foreground"
          )}
        >
          {displayedText || (
            <span className="text-muted-foreground italic">
              {isActive ? "Listening..." : "Waiting for speech..."}
            </span>
          )}
        </div>

        {/* Animated underline for active listening */}
        {isActive && isInterim && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-primary animate-pulse" 
               style={{ 
                 width: `${Math.min(displayedText.length * 2, 100)}%`,
                 transition: 'width 0.3s ease-out'
               }} 
          />
        )}
      </div>

      {/* Timestamp */}
      {displayedText && !isInterim && (
        <div className="mt-2 text-xs text-muted-foreground">
          {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default RealTimeCaption;