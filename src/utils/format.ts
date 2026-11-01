export function getInitials(name: string): string {
  return name.split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase();
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  return hour < 18 ? 'Good afternoon' : 'Good evening';
}
