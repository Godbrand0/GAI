import { useState, useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  networkLatency: number;
}

interface UsePerformanceOptimizationOptions {
  enableMetrics?: boolean;
  targetFPS?: number;
  memoryThreshold?: number;
  onPerformanceIssue?: (metrics: PerformanceMetrics) => void;
}

export const usePerformanceOptimization = (options: UsePerformanceOptimizationOptions = {}) => {
  const {
    enableMetrics = true,
    targetFPS = 60,
    memoryThreshold = 50, // MB
    onPerformanceIssue
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    networkLatency: 0
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderStartTime = useRef(0);
  const networkRequests = useRef<Map<string, number>>(new Map());

  // FPS calculation
  const calculateFPS = useCallback(() => {
    frameCount.current++;
    const currentTime = performance.now();
    const delta = currentTime - lastTime.current;
    
    if (delta >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / delta);
      frameCount.current = 0;
      lastTime.current = currentTime;
      
      setMetrics(prev => ({ ...prev, fps }));
      
      // Check if FPS is below target
      if (fps < targetFPS * 0.8) {
        onPerformanceIssue?.({ ...metrics, fps });
      }
    }
  }, [targetFPS, onPerformanceIssue, metrics]);

  // Memory usage monitoring
  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / (1024 * 1024);
      
      setMetrics(prev => ({ ...prev, memoryUsage: usedMB }));
      
      // Check if memory usage is above threshold
      if (usedMB > memoryThreshold) {
        onPerformanceIssue?.({ ...metrics, memoryUsage: usedMB });
      }
    }
  }, [memoryThreshold, onPerformanceIssue, metrics]);

  // Network latency measurement
  const measureNetworkLatency = useCallback((url: string) => {
    const startTime = performance.now();
    networkRequests.current.set(url, startTime);
    
    return {
      complete: () => {
        const endTime = performance.now();
        const latency = endTime - startTime;
        networkRequests.current.delete(url);
        
        setMetrics(prev => ({ ...prev, networkLatency: latency }));
        
        return latency;
      }
    };
  }, []);

  // Render time measurement
  const startRenderMeasure = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderMeasure = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    setMetrics(prev => ({ ...prev, renderTime }));
    
    // Check if render time is too high
    if (renderTime > 16.67) { // > 60fps threshold
      onPerformanceIssue?.({ ...metrics, renderTime });
    }
  }, [onPerformanceIssue, metrics]);

  // Performance optimization strategies
  const optimizePerformance = useCallback(() => {
    setIsOptimizing(true);
    
    // Clear old network requests
    const now = performance.now();
    networkRequests.current.forEach((startTime, url) => {
      if (now - startTime > 10000) { // 10 seconds timeout
        networkRequests.current.delete(url);
      }
    });
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Reduce animation quality if needed
    if (metrics.fps < targetFPS * 0.6) {
      document.body.style.setProperty('--animation-quality', 'low');
    } else {
      document.body.style.setProperty('--animation-quality', 'high');
    }
    
    setTimeout(() => setIsOptimizing(false), 100);
  }, [metrics.fps, targetFPS]);

  // Animation frame optimization
  const requestAnimationFrameOptimized = useCallback((callback: FrameRequestCallback) => {
    return requestAnimationFrame((timestamp) => {
      startRenderMeasure();
      callback(timestamp);
      endRenderMeasure();
      calculateFPS();
    });
  }, [startRenderMeasure, endRenderMeasure, calculateFPS]);

  // Debounced function for performance-critical operations
  const debouncePerformance = useCallback((
    func: Function,
    delay: number,
    immediate: boolean = false
  ) => {
    let timeout: NodeJS.Timeout | null;
    
    return function executedFunction(...args: any[]) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      
      const callNow = immediate && !timeout;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, delay);
      
      if (callNow) func(...args);
    };
  }, []);

  // Throttled function for performance-critical operations
  const throttlePerformance = useCallback((
    func: Function,
    limit: number
  ) => {
    let inThrottle: boolean;
    
    return function executedFunction(...args: any[]) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Performance monitoring loop
  useEffect(() => {
    if (!enableMetrics) return;

    const interval = setInterval(() => {
      measureMemoryUsage();
    }, 5000); // Check memory every 5 seconds

    return () => clearInterval(interval);
  }, [enableMetrics, measureMemoryUsage]);

  // Cleanup old network requests
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = performance.now();
      networkRequests.current.forEach((startTime, url) => {
        if (now - startTime > 30000) { // 30 seconds
          networkRequests.current.delete(url);
        }
      });
    }, 30000);

    return () => clearInterval(cleanup);
  }, []);

  return {
    metrics,
    isOptimizing,
    optimizePerformance,
    measureNetworkLatency,
    startRenderMeasure,
    endRenderMeasure,
    requestAnimationFrameOptimized,
    debouncePerformance,
    throttlePerformance
  };
};

// Performance monitoring for WebSocket connections
export const useWebSocketPerformance = () => {
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  const [latency, setLatency] = useState(0);
  const [messageRate, setMessageRate] = useState(0);
  
  const messageCount = useRef(0);
  const lastMeasureTime = useRef(Date.now());
  const pingInterval = useRef<NodeJS.Timeout>();

  const startMonitoring = useCallback(() => {
    // Measure message rate
    const measureInterval = setInterval(() => {
      const now = Date.now();
      const timeDiff = (now - lastMeasureTime.current) / 1000; // seconds
      const rate = messageCount.current / timeDiff;
      
      setMessageRate(rate);
      messageCount.current = 0;
      lastMeasureTime.current = now;
      
      // Determine connection quality based on latency and message rate
      if (latency < 100 && rate > 10) {
        setConnectionQuality('excellent');
      } else if (latency < 300 && rate > 5) {
        setConnectionQuality('good');
      } else if (latency < 1000) {
        setConnectionQuality('poor');
      } else {
        setConnectionQuality('disconnected');
      }
    }, 5000);

    return () => clearInterval(measureInterval);
  }, [latency]);

  const measureLatency = useCallback(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      setLatency(end - start);
    };
  }, []);

  const incrementMessageCount = useCallback(() => {
    messageCount.current++;
  }, []);

  return {
    connectionQuality,
    latency,
    messageRate,
    startMonitoring,
    measureLatency,
    incrementMessageCount
  };
};

export default usePerformanceOptimization;