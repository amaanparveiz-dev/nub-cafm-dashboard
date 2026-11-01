import type { ReactNode } from 'react';

const ICONS = {
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" /></>,
  arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  signOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  reset: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.5h.01" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.7 2.7L16 9.8" /></>,
  tick: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.8" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 5.6c.4-.1.9-.1 1.4-.1 6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.8M6.5 7.7A15.6 15.6 0 0 0 2.5 12S6 18.5 12 18.5c1.2 0 2.3-.2 3.3-.6" /><path d="M9.9 9.9a2.8 2.8 0 0 0 4 4" /></>,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/** Decorative stroke icon. Pass className "ic" or "lg-ic" to pick up the stylesheet's sizing. */
export default function Icon({ name, className, size, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}
