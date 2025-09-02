// Database Table Names
export const TABLES = {
  AUCTION_ITEMS: 'auction_items',
  MEMBERSHIP_ITEMS: 'membership_items', 
  SPENT_ITEMS: 'spent_items',
  DONATION_ITEMS: 'donation_items',
  DUES_ITEMS: 'dues_items'
} as const;

// Navigation Tabs
export const TABS = {
  AUCTION: 'auction',
  MEMBERSHIP: 'membership', 
  EXPENSES: 'expenses',
  DONATIONS: 'donations',
  DUES: 'dues',
  ANALYTICS: 'analytics'
} as const;

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  AMOUNT_POSITIVE: 'Amount must be a positive number'
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard'
} as const;

// PWA Configuration
export const PWA_CONFIG = {
  INSTALL_PROMPT_DELAY: 3000,
  OFFLINE_CHECK_INTERVAL: 5000
} as const;
