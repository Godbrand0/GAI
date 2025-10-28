import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { cn, formatTime, NigerianLanguage } from '../lib/utils';
import SpeechErrorHandler from './SpeechErrorHandler';

interface VoiceInputProps {
  onTranscript?: (text: string, confidence: number) => void;
  language?: NigerianLanguage;
  className?: string;
  disabled?: boolean;
  showWaveform?: boolean;
  autoSend?: boolean;
  maxDuration?: number;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  language = 'en',
  className,
  disabled = false,
  showWaveform = true,
  autoSend = false,
  maxDuration = 30000 // 30 seconds max
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recordingStartTime = useRef<number | null>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrame = useRef<number | null>(null);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    language,
    continuous: true,
    interimResults: true,
    onResult: (text: string, conf: number, isFinal: boolean) => {
      if (isFinal && onTranscript) {
        onTranscript(text, conf);
        if (autoSend) {
          handleStopRecording();
        }
      }
    },
    onError: (err: string) => {
      console.error('Speech recognition error:', err);
      handleStopRecording();
    }
  });

  // Initialize audio context for waveform visualization
  useEffect(() => {
    if (showWaveform && typeof window !== 'undefined' && window.AudioContext) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [showWaveform]);

  // Update audio level for visualization
  const updateAudioLevel = () => {
    if (!analyser.current || !isRecording) return;

    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    analyser.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setAudioLevel(average / 255);

    animationFrame.current = requestAnimationFrame(updateAudioLevel);
  };

  // Start recording
  const handleStartRecording = async () => {
    if (!isSupported || disabled || isProcessing) return;

    try {
      setIsRecording(true);
      setRecordingTime(0);
      recordingStartTime.current = Date.now();

      // Start speech recognition
      startListening();

      // Setup microphone access for waveform
      if (showWaveform && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (audioContext.current && analyser.current) {
            microphone.current = audioContext.current.createMediaStreamSource(stream);
            microphone.current.connect(analyser.current);
          }
          updateAudioLevel();
        } catch (err) {
          console.warn('Microphone access denied:', err);
        }
      }

      // Start recording timer
      recordingTimer.current = setInterval(() => {
        const elapsed = Date.now() - (recordingStartTime.current || 0);
        setRecordingTime(elapsed);

        // Auto-stop after max duration
        if (elapsed >= maxDuration) {
          handleStopRecording();
        }
      }, 100);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Stop speech recognition
    stopListening();

    // Clear recording timer
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }

    // Stop audio visualization
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }

    // Disconnect microphone
    if (microphone.current) {
      microphone.current.disconnect();
      microphone.current = null;
    }

    setAudioLevel(0);

    // Reset processing state after a short delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  // Format recording time

  // Generate waveform bars
  const generateWaveformBars = () => {
    if (!showWaveform) return null;

    const barCount = 20;
    const bars = [];
    
    for (let i = 0; i < barCount; i++) {
      const height = isRecording 
        ? Math.random() * 40 + 10 + (audioLevel * 30)
        : 4;
      
      bars.push(
        <div
          key={i}
          className={cn(
            "w-1 bg-primary rounded-full transition-all duration-100",
            isRecording ? "opacity-100" : "opacity-30"
          )}
          style={{ height: `${height}px` }}
        />
      );
    }
    
    return bars;
  };

  if (!isSupported) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <MicOff className="w-5 h-5" />
        <span className="text-sm">Speech recognition not supported</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Recording status and timer */}
      {(isRecording || isProcessing) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isRecording && (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>Recording {formatTime(recordingTime)}</span>
            </>
          )}
          {isProcessing && (
            <>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          )}
        </div>
      )}

      {/* Waveform visualization */}
      {showWaveform && (
        <div className="flex items-center justify-center gap-1 h-12">
          {generateWaveformBars()}
        </div>
      )}

      {/* Microphone button */}
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={disabled || isProcessing}
        className={cn(
          "relative p-4 rounded-full transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          isRecording 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-primary hover:bg-primary/90 text-primary-foreground",
          disabled && "opacity-50 cursor-not-allowed",
          isProcessing && "animate-pulse"
        )}
      >
        {isRecording ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
        
        {/* Ripple effect when recording */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping animation-delay-200" />
          </>
        )}
      </button>

      {/* Current transcript display */}
      {(transcript || interimTranscript) && (
        <div className="w-full max-w-md p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            {interimTranscript && "Interim:"}
            {transcript && !interimTranscript && "Final:"}
          </div>
          <div className="text-sm">
            {transcript || interimTranscript}
          </div>
          {confidence > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              Confidence: {Math.round(confidence * 100)}%
            </div>
          )}
        </div>
      )}

      {/* Error Handler */}
      <SpeechErrorHandler
        error={error}
        isSupported={isSupported}
        isListening={isListening}
        onRetry={startListening}
        language={language}
      />

      {/* Instructions */}
      {!isRecording && !isProcessing && !transcript && !error && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Click the microphone to start speaking</p>
          <p className="text-xs mt-1">
            Supports English, Yoruba, Igbo, Hausa, and Nigerian Pidgin
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;