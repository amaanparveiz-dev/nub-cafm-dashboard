export const STORAGE_KEYS = {
  session: 'nub-session',
  lock: 'nub-auth-lock',
  lastEmail: 'nub-last-email',
  layout: 'nub-overview-layout',
  locale: 'nub-locale',
} as const;

export const AUTH_CONFIG = {
  showDemo: true, // show the demo-account box on the login page
  maxFails: 5, // failed attempts before sign-in pauses
  lockMs: 30000, // pause length
  sessionHours: 8, // session length without "Remember me"
  rememberDays: 30, // session length with "Remember me"
} as const;
