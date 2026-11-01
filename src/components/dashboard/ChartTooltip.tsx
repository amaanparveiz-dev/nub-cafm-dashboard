import { createPortal } from 'react-dom';

import type { TooltipState } from '../../types';

const EDGE_MARGIN = 60;

export default function ChartTooltip({ tip }: { tip: TooltipState | null }) {
  if (!tip) return null;
  const left = Math.min(Math.max(tip.x, EDGE_MARGIN), window.innerWidth - EDGE_MARGIN);
  return createPortal(
    <div className="ctip on" role="tooltip" style={{ left, top: tip.y - 8, transform: 'translate(-50%, -100%)' }}>
      <b>{tip.label}</b>
      <span>{tip.value}</span>
    </div>,
    document.body,
  );
}
