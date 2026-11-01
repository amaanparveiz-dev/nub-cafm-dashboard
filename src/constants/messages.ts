export const MESSAGES = {
  emailRequired: 'Enter your email address.',
  emailInvalid: 'Enter a valid email address, like name@company.com.',
  passwordRequired: 'Enter your password.',
  badCreds: 'The email or password is incorrect. Check both and try again.',
  badCredsLeft: (n: number) =>
    `The email or password is incorrect. You have ${n} attempts left before sign-in pauses for 30 seconds.`,
  locked: (s: number) => `Too many attempts. Try again in ${s} seconds.`,
  network: 'We couldn’t reach the server. Check your connection and try again.',
  ssoOff: 'Single sign-on isn’t set up for this demo workspace.',
  signedOut: 'You’ve been signed out.',
  success: 'Signed in. Opening your dashboard…',
  resetSent: (email: string) =>
    `If an account exists for ${email}, a reset link is on its way. Check your inbox and spam folder.`,
} as const;
