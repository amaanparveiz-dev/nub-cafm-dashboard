import { MESSAGES } from '../constants/messages';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns an error message, or null when the email is valid. */
export function validateEmail(email: string): string | null {
  if (!email) return MESSAGES.emailRequired;
  return EMAIL_PATTERN.test(email) ? null : MESSAGES.emailInvalid;
}
