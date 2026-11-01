import { useState } from 'react';
import useTooltip from '../../hooks/useTooltip';
import type { CSSProperties, MouseEvent } from 'react';
import type { SpaceSegment } from '../../types';
import ChartTooltip from './ChartTooltip';

interface Arc extends SpaceSegment {
  percent: number;
  isSingle?: boolean;
  dash: string | null;
  dashOffset?: string;
}

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 6;
const CAP = 8;

/** Adds percentage and stroke-dash geometry to each segment. */
function buildArcs(segments: SpaceSegment[]): { arcs: Arc[]; total: number } {
  const total = segments.reduce((sum, { count }) => sum + count, 0);
  const isSingle = segments.filter(({ count }) => count > 0).length === 1;
  let offset = 0;

  const arcs = segments.map((segment): Arc => {
    const percent = total ? Math.round((segment.count / total) * 100) : 0;
    if (!segment.count) return { ...segment, percent, dash: null };

    const length = (segment.count / total) * CIRCUMFERENCE;
    const dash = isSingle ? CIRCUMFERENCE : Math.max(1, length - GAP - CAP * 2);
    const start = isSingle ? 0 : offset + (GAP + CAP * 2) / 2;
    offset += length;
    return {
      ...segment,
      percent,
      isSingle,
      dash: `${dash.toFixed(2)} ${(CIRCUMFERENCE - dash).toFixed(2)}`,
      dashOffset: (-start).toFixed(2),
    };
  });
  return { arcs, total };
}

export default function SpacesDonut({ segments }: { segments: SpaceSegment[] }) {
  const { arcs, total } = buildArcs(segments);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tooltip = useTooltip();

  const hoverProps = ({ label, count, percent }: Arc, index: number) => {
    const handlers = tooltip.bind(label, `${count} space${count === 1 ? '' : 's'} · ${percent}%`);
    return {
      ...handlers,
      onMouseEnter: (event: MouseEvent<Element>) => { handlers.onMouseEnter(event); setActiveIndex(index); },
      onMouseLeave: () => { handlers.onMouseLeave(); setActiveIndex(null); },
    };
  };

  return (
    <div className="sp">
      <div className={`sdn${activeIndex !== null ? ' hov' : ''}`}>
        <svg viewBox="0 0 160 160" role="img" aria-label="Spaces by status">
          <circle className="trk" cx="80" cy="80" r={RADIUS} />
          {arcs.map((arc, index) => arc.dash && (
            <circle
              key={arc.label}
              className={`seg${activeIndex === index ? ' hl' : ''}`}
              cx="80"
              cy="80"
              r={RADIUS}
              stroke={arc.color}
              strokeDasharray={arc.dash}
              strokeDashoffset={arc.dashOffset}
              style={arc.isSingle ? { strokeLinecap: 'butt' } : undefined}
              tabIndex={0}
              {...hoverProps(arc, index)}
            />
          ))}
        </svg>
        <div className="ctr"><b>{total}</b><small>Total</small></div>
      </div>

      <div className="sleg">
        {arcs.map((arc, index) => (
          <div
            key={arc.label}
            className={`r${arc.count ? '' : ' z'}${activeIndex === index ? ' hl' : ''}`}
            style={{ '--c': arc.color } as CSSProperties}
            {...hoverProps(arc, index)}
          >
            <i />
            <span className="nm">{arc.label}</span>
            <b>{arc.count}</b>
            <em>{arc.percent}%</em>
          </div>
        ))}
      </div>
      <ChartTooltip tip={tooltip.tip} />
    </div>
  );
}
