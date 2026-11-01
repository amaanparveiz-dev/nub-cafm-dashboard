import type { Locale } from '../i18n/messages';

export function getInitials(name: string): string {
  return name.split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase();
}

export function getGreetingKey(date: Date = new Date()): 'greet.morning' | 'greet.afternoon' | 'greet.evening' {
  const hour = date.getHours();
  if (hour < 12) return 'greet.morning';
  return hour < 18 ? 'greet.afternoon' : 'greet.evening';
}

export function formatVisitDate(isoDate: string, locale: Locale): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function displayName(user: { name: string; nameAr?: string }, locale: Locale): string {
  return locale === 'ar' && user.nameAr ? user.nameAr : user.name;
}
