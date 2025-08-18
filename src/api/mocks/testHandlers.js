import { http, HttpResponse } from 'msw';

// Test endpoint to verify MSW is working
export const testHandlers = [
  http.get('/api/test/health', () => {
    return HttpResponse.json({ 
      status: 'ok', 
      message: 'MSW is working correctly',
      timestamp: new Date().toISOString()
    });
  })
];
