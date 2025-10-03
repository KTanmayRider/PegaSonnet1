/**
 * Jest Test Setup
 * Configures testing environment for React components
 */

import '@testing-library/jest-dom';

// Mock environment variables
process.env.VITE_SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com';
process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'test_token';
process.env.VITE_RAZORPAY_KEY_ID = 'rzp_test_123456';
process.env.VITE_RAZORPAY_KEY_SECRET = 'test_secret';

// Mock window.Razorpay
global.window.Razorpay = jest.fn().mockImplementation((options) => ({
  open: jest.fn(),
  on: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

