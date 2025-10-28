import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketMessage, ChatMessage, UserSettings } from '../lib/utils';

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  sendMessage: (message: WebSocketMessage) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendChatMessage: (data: {
    roomId: string;
    message: string;
    originalText?: string;
    sourceLanguage: string;
  }) => void;
  sendSpeechToText: (audioData: ArrayBuffer) => void;
  sendTranslateText: (data: {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
  }) => void;
  updateSettings: (settings: UserSettings) => void;
  disconnect: () => void;
  reconnect: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    url = 'ws://localhost:3001',
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
    onConnect,
    onDisconnect,
    onError,
    onMessage
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectCountRef.current = 0;
        
        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const message = messageQueueRef.current.shift();
          if (message) {
            ws.send(JSON.stringify(message));
          }
        }
        
        onConnect?.();
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        
        if (event.wasClean) {
          console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
          console.warn('WebSocket connection died');
          
          // Attempt to reconnect if not manually disconnected
          if (reconnectCountRef.current < reconnectAttempts) {
            reconnectCountRef.current++;
            console.log(`Attempting to reconnect (${reconnectCountRef.current}/${reconnectAttempts})...`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectDelay);
          } else {
            setError('Failed to reconnect after multiple attempts');
          }
        }
        
        onDisconnect?.();
      };

      ws.onerror = (event) => {
        const error = new Error('WebSocket connection error');
        setError(error.message);
        setIsConnecting(false);
        onError?.(error);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create WebSocket connection');
      setError(error.message);
      setIsConnecting(false);
      onError?.(error);
    }
  }, [url, reconnectAttempts, reconnectDelay, onConnect, onDisconnect, onError, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    reconnectCountRef.current = 0;
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectCountRef.current = 0;
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    const messageToSend = {
      ...message,
      timestamp: new Date().toISOString()
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(messageToSend));
    } else {
      // Queue message for when connection is restored
      messageQueueRef.current.push(messageToSend);
      
      // Try to connect if not already connecting
      if (!isConnecting && !isConnected) {
        connect();
      }
    }
  }, [isConnecting, isConnected, connect]);

  const joinRoom = useCallback((roomId: string) => {
    sendMessage({
      type: 'join_room',
      roomId
    });
  }, [sendMessage]);

  const leaveRoom = useCallback((roomId: string) => {
    sendMessage({
      type: 'leave_room',
      roomId
    });
  }, [sendMessage]);

  const sendChatMessage = useCallback((data: {
    roomId: string;
    message: string;
    originalText?: string;
    sourceLanguage: string;
  }) => {
    sendMessage({
      type: 'chat_message',
      ...data
    });
  }, [sendMessage]);

  const sendSpeechToText = useCallback((audioData: ArrayBuffer) => {
    // Convert ArrayBuffer to base64 for transmission
    const base64Audio = btoa(
      new Uint8Array(audioData).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    sendMessage({
      type: 'speech_to_text',
      audioData: base64Audio
    });
  }, [sendMessage]);

  const sendTranslateText = useCallback((data: {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
  }) => {
    sendMessage({
      type: 'translate_text',
      ...data
    });
  }, [sendMessage]);

  const updateSettings = useCallback((settings: UserSettings) => {
    sendMessage({
      type: 'update_settings',
      settings
    });
  }, [sendMessage]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    sendSpeechToText,
    sendTranslateText,
    updateSettings,
    disconnect,
    reconnect
  };
};

export default useWebSocket;