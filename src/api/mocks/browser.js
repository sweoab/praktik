import { setupWorker } from 'msw/browser';
import { mockHandlers } from './handlers/mockhandlers';

console.log('Setting up MSW worker with handlers:', mockHandlers.length);

export const worker = setupWorker(...mockHandlers);

worker.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});

worker.events.on('request:match', ({ request }) => {
  console.log('MSW matched:', request.method, request.url);
});

worker.events.on('request:unhandled', ({ request }) => {
  console.log('MSW unhandled:', request.method, request.url);
});
