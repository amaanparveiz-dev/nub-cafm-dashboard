import { useState } from 'react';
import type { FocusEvent, MouseEvent } from 'react';
import type { TooltipState } from '../types';

/** Element-agnostic so the bindings work on both HTML and SVG elements. */
type ShowEvent = MouseEvent<Element> | FocusEvent<Element>;

export interface TooltipBindings {
  onMouseEnter: (event: ShowEvent) => void;
  onFocus: (event: ShowEvent) => void;
  onMouseLeave: () => void;
  onBlur: () => void;
}

export interface TooltipApi {
  tip: TooltipState | null;
  bind: (label: string, value: string, options?: { inner?: boolean }) => TooltipBindings;
}

/**
 * Chart tooltip state. `bind(label, value)` returns the event props to spread
 * on a hoverable/focusable element; pass `{ inner: true }` to anchor the tooltip
 * to the element's first child (e.g. the bar inside a column).
 */
export default function useTooltip(): TooltipApi {
  const [tip, setTip] = useState<TooltipState | null>(null);

  const hide = () => setTip(null);
  const bind: TooltipApi['bind'] = (label, value, { inner = false } = {}) => {
    const show = (event: ShowEvent) => {
      const target = event.currentTarget;
      const anchor = (inner && target.firstElementChild) || target;
      const rect = anchor.getBoundingClientRect();
      setTip({ label, value, x: rect.left + rect.width / 2, y: rect.top });
    };
    return { onMouseEnter: show, onFocus: show, onMouseLeave: hide, onBlur: hide };
  };

  return { tip, bind };
}
