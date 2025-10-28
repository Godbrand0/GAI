import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { NigerianLanguage, UserSettings, ChatMessage as ChatMessageType, storage } from '../lib/utils';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useWebSocket } from '../hooks/useWebSocket';
import VoiceInput from '../components/VoiceInput';
import RealTimeCaption from '../components/RealTimeCaption';
import ChatMessage from '../components/ChatMessage';
import LanguageSettings from '../components/LanguageSettings';
import ErrorBoundary from '../components/ErrorBoundary';

const Chat = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isInterim, setIsInterim] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [roomId, setRoomId] = useState('default-room');
  const [settings, setSettings] = useState<UserSettings>({
    sourceLanguage: 'en',
    targetLanguage: 'en',
    voiceEnabled: true,
    autoTranslate: true,
    showCaptions: true
  });

  // Load settings from storage
  useEffect(() => {
    const savedSettings = storage.getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
    
    const savedMessages = storage.getChatHistory();
    setMessages(savedMessages);
  }, []);

  // WebSocket connection
  const {
    isConnected,
    isConnecting,
    error: wsError,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    updateSettings
  } = useWebSocket({
    onConnect: () => {
      console.log('Connected to chat server');
      joinRoom(roomId);
    },
    onMessage: (message) => {
      if (message.type === 'chat_message') {
        const newMessage: ChatMessageType = {
          ...message.message,
          timestamp: new Date(message.message.timestamp)
        };
        setMessages(prev => [...prev, newMessage]);
        storage.setChatHistory([...messages, newMessage]);
      }
    }
  });

  // Speech recognition
  const {
    isListening,
    transcript,
    interimTranscript,
    confidence: speechConfidence,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    language: settings.sourceLanguage,
    onResult: (text, conf, isFinal) => {
      if (isFinal) {
        setCurrentTranscript(text);
        setIsInterim(false);
        setConfidence(conf);
        
        // Auto-send message if enabled
        if (settings.autoTranslate) {
          handleSendMessage(text);
        }
      } else {
        setCurrentTranscript(text);
        setIsInterim(true);
        setConfidence(conf);
      }
    }
  });

  // Update settings on server when they change
  useEffect(() => {
    if (isConnected) {
      updateSettings(settings);
    }
  }, [settings, isConnected, updateSettings]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || currentTranscript;
    if (!messageText.trim()) return;

    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      userId: 'current-user',
      message: messageText,
      originalText: messageText,
      sourceLanguage: settings.sourceLanguage,
      timestamp: new Date(),
      confidence: confidence
    };

    // Add message locally
    setMessages(prev => [...prev, newMessage]);
    storage.setChatHistory([...messages, newMessage]);

    // Send to server
    sendChatMessage({
      roomId,
      message: messageText,
      originalText: messageText,
      sourceLanguage: settings.sourceLanguage
    });

    // Clear transcript
    resetTranscript();
    setCurrentTranscript('');
    setIsInterim(false);
    setConfidence(0);
  };

  const handleVoiceTranscript = (text: string, conf: number) => {
    setCurrentTranscript(text);
    setConfidence(conf);
    setIsInterim(false);
  };

  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-transparent hover:bg-accent hover:text-accent-foreground px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">
                  <span className="bg-gradient-multicolor bg-clip-text text-transparent">GAI</span> Chat
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection status */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-green-500" : isConnecting ? "bg-yellow-500" : "bg-red-500"
                )} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
                </span>
              </div>

              <LanguageSettings
                settings={settings}
                onSettingsChange={handleSettingsChange}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        {/* Real-time caption */}
        {settings.showCaptions && (currentTranscript || isListening) && (
          <div className="mb-6">
            <RealTimeCaption
              text={currentTranscript}
              isInterim={isInterim}
              confidence={confidence}
              isActive={isListening}
              language={settings.sourceLanguage}
            />
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-2">
                Welcome to GAI Chat!
              </div>
              <div className="text-muted-foreground text-sm">
                Start speaking or typing to begin translating between Nigerian languages.
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.userId === 'current-user'}
                showTranslation={settings.autoTranslate}
                targetLanguage={settings.targetLanguage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error display */}
        {wsError && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="text-sm text-destructive">
              Connection error: {wsError}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="space-y-4">
          {/* Voice input */}
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            language={settings.sourceLanguage}
            autoSend={settings.autoTranslate}
            disabled={!isConnected}
          />

          {/* Text input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTranscript}
              onChange={(e) => setCurrentTranscript(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message here..."
              disabled={!isConnected}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
            />
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!isConnected || !currentTranscript.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
