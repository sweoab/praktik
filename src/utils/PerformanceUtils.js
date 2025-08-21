/**
 * Frontend Performance Utils
 * Optimerar React-komponenter och API-calls
 */

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Custom hook för debounced input
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook för optimerade API calls
 */
export const useOptimizedAPI = () => {
  const requestCache = useRef(new Map());
  const pendingRequests = useRef(new Map());

  const makeRequest = useCallback(async (url, options = {}) => {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    // Check cache
    const cached = requestCache.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 300000) {
      return cached.data;
    }

    // Check if same request is pending
    if (pendingRequests.current.has(cacheKey)) {
      return pendingRequests.current.get(cacheKey);
    }

    // Make new request
    const requestPromise = fetch(url, {
      ...options,
      signal: AbortSignal.timeout(10000) // 10s timeout
    }).then(res => res.json());

    pendingRequests.current.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      
      // Cache successful response
      requestCache.current.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } finally {
      pendingRequests.current.delete(cacheKey);
    }
  }, []);

  const clearCache = useCallback(() => {
    requestCache.current.clear();
  }, []);

  return { makeRequest, clearCache };
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName) => {
  const renderStart = useRef(Date.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
    const renderTime = Date.now() - renderStart.current;
    
    if (renderTime > 100) { // Log slow renders
      console.warn(`🐌 Slow render: ${componentName} took ${renderTime}ms (render #${renderCount.current})`);
    }
    
    renderStart.current = Date.now();
  });

  return {
    renderCount: renderCount.current,
    logPerformance: (operation, time) => {
      console.log(`⚡ ${componentName} - ${operation}: ${time}ms`);
    }
  };
};

/**
 * Virtual scrolling hook för stora listor
 */
export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const scrollTop = useRef(0);
  const visibleStart = Math.floor(scrollTop.current / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = useMemo(() => 
    items.slice(visibleStart, visibleEnd).map((item, index) => ({
      ...item,
      index: visibleStart + index
    }))
  , [items, visibleStart, visibleEnd]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const onScroll = useCallback((e) => {
    scrollTop.current = e.target.scrollTop;
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll
  };
};

/**
 * Memory usage optimizer
 */
export const useMemoryOptimizer = () => {
  useEffect(() => {
    const cleanup = () => {
      // Force garbage collection hints
      if (window.gc) {
        window.gc();
      }
    };

    const interval = setInterval(cleanup, 60000); // Cleanup every minute
    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);
};

/**
 * Loading state manager med timeout
 */
export const useSmartLoading = (initialState = false, timeout = 5000) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const timeoutRef = useRef(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    
    // Auto-stop loading after timeout
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      console.warn('Loading timeout reached');
    }, timeout);
  }, [timeout]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isLoading, startLoading, stopLoading };
};

/**
 * Component performance wrapper
 */
export const withPerformanceOptimization = (WrappedComponent, options = {}) => {
  const { 
    enableMemoization = true,
    enableVirtualization = false,
    enableLazyLoading = true 
  } = options;

  return React.memo((props) => {
    const { logPerformance } = usePerformanceMonitor(WrappedComponent.name);
    
    useMemoryOptimizer();

    const memoizedProps = useMemo(() => props, [
      enableMemoization ? JSON.stringify(props) : props
    ]);

    return <WrappedComponent {...memoizedProps} />;
  });
};

export default {
  useDebounce,
  useOptimizedAPI,
  usePerformanceMonitor,
  useVirtualScrolling,
  useMemoryOptimizer,
  useSmartLoading,
  withPerformanceOptimization
};
