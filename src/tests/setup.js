import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Polyfill for structuredClone
global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock service worker
global.navigator.serviceWorker = {
  register: jest.fn(() => Promise.resolve()),
  addEventListener: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

// Mock Notification
global.Notification = {
  permission: 'granted',
  requestPermission: jest.fn(() => Promise.resolve('granted')),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});