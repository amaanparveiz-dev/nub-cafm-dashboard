import type { Translate } from '../context/LocaleContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns an error message, or null when the email is valid. */
export function validateEmail(email: string, t: Translate): string | null {
  if (!email) return t('error.emailRequired');
  return EMAIL_PATTERN.test(email) ? null : t('error.emailInvalid');
}
