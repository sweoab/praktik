// Enhanced Error Handler with Retry Logic
class RetryableError extends Error {
  constructor(message, isRetryable = false) {
    super(message);
    this.isRetryable = isRetryable;
    this.name = 'RetryableError';
  }
}

export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable
      const isRetryable = error.isRetryable || 
        error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('500') ||
        error.message.includes('502') ||
        error.message.includes('503') ||
        error.message.includes('504');
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  throw lastError;
};

// Enhanced fetcher with automatic retry
export const createEnhancedFetcher = (baseFetcher) => {
  return async (...args) => {
    return withRetry(() => baseFetcher(...args));
  };
};
