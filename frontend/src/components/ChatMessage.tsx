import React, { useState } from 'react';
import { User, Bot, Volume2, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { ChatMessage as ChatMessageType, NigerianLanguage, NIGERIAN_LANGUAGES } from '../lib/utils';
import { useSpeechSynthesis } from '../hooks/useSpeechRecognition';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn?: boolean;
  showTranslation?: boolean;
  targetLanguage?: NigerianLanguage;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwn = false,
  showTranslation = false,
  targetLanguage = 'en',
  className
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { speak, isSpeaking, isSupported: speechSupported } = useSpeechSynthesis({
    language: targetLanguage
  });

  const getLanguageLabel = (lang: string) => {
    return NIGERIAN_LANGUAGES[lang as NigerianLanguage]?.name || lang;
  };

  const getTranslation = () => {
    if (!showTranslation || !targetLanguage || message.sourceLanguage === targetLanguage) {
      return null;
    }
    
    return message.translations?.[targetLanguage] || 
           `[Translation to ${getLanguageLabel(targetLanguage)}]: ${message.message}`;
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSpeak = async (text: string) => {
    if (!speechSupported || isSpeaking) return;
    
    try {
      setIsPlaying(true);
      await speak(text);
    } catch (err) {
      console.error('Failed to speak text:', err);
    } finally {
      setIsPlaying(false);
    }
  };

  const translation = getTranslation();
  const displayText = translation || message.message;
  const originalText = message.originalText || message.message;

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg transition-all duration-200",
      isOwn 
        ? "bg-primary/10 border-l-4 border-primary" 
        : "bg-muted/30 border-l-4 border-border",
      className
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
        isOwn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      )}>
        {isOwn ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {isOwn ? 'You' : 'Translator'}
            </span>
            <span className="text-xs text-muted-foreground">
              {getLanguageLabel(message.sourceLanguage)}
            </span>
            {translation && (
              <span className="text-xs text-muted-foreground">
                → {getLanguageLabel(targetLanguage)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {message.confidence && (
              <span className={cn(
                "text-xs font-medium",
                message.confidence >= 0.8 ? "text-green-600" :
                message.confidence >= 0.6 ? "text-yellow-600" : "text-red-600"
              )}>
                {Math.round(message.confidence * 100)}%
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Original text (if different from display text) */}
        {originalText !== displayText && (
          <div className="mb-2 p-2 bg-muted/50 rounded text-sm text-muted-foreground">
            <div className="text-xs font-medium mb-1">Original:</div>
            <div>{originalText}</div>
          </div>
        )}

        {/* Main message text */}
        <div className="text-sm leading-relaxed mb-3">
          {displayText}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Copy button */}
          <button
            onClick={() => handleCopy(displayText)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Copy text"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          {/* Speak button */}
          {speechSupported && (
            <button
              onClick={() => handleSpeak(displayText)}
              disabled={isSpeaking}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs transition-colors",
                isSpeaking || isPlaying
                  ? "text-primary cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Speak text"
            >
              <Volume2 className={cn(
                "w-3 h-3",
                (isSpeaking || isPlaying) && "animate-pulse"
              )} />
              {isSpeaking || isPlaying ? 'Speaking...' : 'Speak'}
            </button>
          )}

          {/* Translation indicator */}
          {translation && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs text-primary bg-primary/10 rounded">
              <span>Translated</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;